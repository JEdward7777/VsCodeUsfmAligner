import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import './App.css'
import AlignmentDialogWrapper, { VersionInfo } from './AlignmentDialogWrapper';
import { InternalUsfmJsonFormat, OptionalInternalUsfmJsonFormat, TAlignmentSuggestion, TSourceTargetAlignment, TSourceTargetPrediction, TWord, UsfmMessage } from '../../src/utils';

function deepCopy(obj: any): any {
  return JSON.parse(JSON.stringify(obj));
}

//This code was given as an example for using Monica with Vite.  I am not including it until I run into a problem that will tell me why.
//it is needed for the editor.
import { OnChange, OnMount, loader } from '@monaco-editor/react';
import * as monaco from 'monaco-editor';
import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker&inline';
import jsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker&inline';
import cssWorker from 'monaco-editor/esm/vs/language/css/css.worker?worker&inline';
import htmlWorker from 'monaco-editor/esm/vs/language/html/html.worker?worker&inline';
import tsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker&inline';
self.MonacoEnvironment = {
  getWorker(_, label) {
    if (label === 'json') {
      return new jsonWorker();
    }
    if (label === 'css' || label === 'scss' || label === 'less') {
      return new cssWorker();
    }
    if (label === 'html' || label === 'handlebars' || label === 'razor') {
      return new htmlWorker();
    }
    if (label === 'typescript' || label === 'javascript') {
      return new tsWorker();
    }
    console.log( "Getting the editorWorker." );
    return new editorWorker();
  },
};
loader.config({ monaco });
loader.init().then(/* ... */);


//Determine the color scheme from vscode.  So body will have an attribute with the name on it, so if it includes "light"
//in it we will go with light otherwise we will be dark.
//reference to body
const body = document.querySelector('body');
const vscodeTheme = body?.getAttribute( "data-vscode-theme-id" )
const editorColorScheme = (vscodeTheme?.toLowerCase().includes( "light" )) ? "light" : "vs-dark";

import Editor from '@monaco-editor/react';
import { editor, Selection } from 'monaco-editor/esm/vs/editor/editor.api';
import { useEffect } from 'react';
import React from 'react';


interface VsCodeStub{
  postMessage: (message: UsfmMessage) => void
}

interface AppState{
  activeView: string,
  alignmentReference: string,
}
 
export default function App() {

  const vscodeRef = React.useRef<VsCodeStub | null>(null);

  const editorRef = React.useRef<editor.IEditor | null>(null);

  //make a react state for AppState
  const [appState, setAppState] = useState<AppState>({
    activeView: "view_stripped_usfm",
    alignmentReference: ""
  })


  const _documentDataRef = React.useRef<InternalUsfmJsonFormat>({
    strippedUsfm: {
      version: -1,
      text: ""
    },
    alignmentData: {
      version: -1,
      perf: null
    }
  });
  const [ documentDataState, _setDocumentDataState] = useState<InternalUsfmJsonFormat>(_documentDataRef.current);

  const ignoreChangeCountRef = React.useRef(0);

  const setDocumentData = ( {newDocumentData, sendAlignmentData = true, sendStrippedUsfm = true} : {newDocumentData: InternalUsfmJsonFormat, sendAlignmentData?: boolean, sendStrippedUsfm?: boolean} ) => {
    //set the document data
    _documentDataRef.current = newDocumentData;
    _setDocumentDataState( newDocumentData );
    if( sendStrippedUsfm || sendAlignmentData ){
      let updateContent : OptionalInternalUsfmJsonFormat = {};
      
      if( sendStrippedUsfm && sendAlignmentData ){
        updateContent = getDocumentData();
      }else if( sendStrippedUsfm ){
        updateContent.strippedUsfm = getDocumentData().strippedUsfm;
      }else if( sendAlignmentData ){
        updateContent.alignmentData = _documentDataRef.current.alignmentData;
      }
      vscodeRef.current?.postMessage({ command: 'sync', content: updateContent });
    }
  }



  const getDocumentData = () : InternalUsfmJsonFormat => {
    _documentDataRef.current.strippedUsfm.text = (editorRef.current?.getModel() as editor.ITextModel)?.getValue() || "";
    return _documentDataRef.current;
  }

  const handleEditorChangeDebounced = ( _value : string | undefined, _ev : editor.IModelContentChangedEvent ) : void => {
    ignoreChangeCountRef.current = 0;
    //debounced edit send.
    console.log( "Sending a sync message because of an edit.");
    vscodeRef.current?.postMessage({ command: 'sync', content: getDocumentData() });
  }

  const handleEditorChangeDebounceRef = React.useRef(0);
  const handleEditorChange : OnChange = (value,_ev ) => {
    if( ignoreChangeCountRef.current > 0 ){
      ignoreChangeCountRef.current -= 1;
      return;
    }
    //inc the stripped version if the text has changed.
    _documentDataRef.current.strippedUsfm.version += 1 + Math.random();

    const SYNC_DEBOUNCE_TIME_MS = 1000;
    clearTimeout( handleEditorChangeDebounceRef.current );
    
    handleEditorChangeDebounceRef.current = (setTimeout( () => {
      handleEditorChangeDebounced( value, _ev );
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    }, SYNC_DEBOUNCE_TIME_MS) as any);
  }



  const handleEditorMount : OnMount = (editor,_monica) => {
    editorRef.current = editor;

    if ( vscodeRef.current ) {
      vscodeRef.current?.postMessage({ command: 'ready' });
    }
  }

  const selectReference = ( reference: string ) => {    
    const model: editor.ITextModel | undefined = editorRef.current?.getModel() as editor.ITextModel | undefined;
    const referenceSplit : string[] = reference.split( ":" );

    const chapter = referenceSplit[0];
    const verse = referenceSplit.length > 1 ? referenceSplit[1] : "";

    if( model ){
      //make sure we have a chapter.
      if( chapter !== '' ){
        //find it in the editor.
        //                                      searchString: string, searchOnlyEditableRange: boolean, isRegex: boolean, matchCase: boolean, wordSeparators: string | null, captureMatches: boolean, limitResultCount?: number
        const chapterMatches = model.findMatches( "\\c " + chapter    , true                            , false           , true              , null                         , false                  , 1 );

        if( chapterMatches.length > 0 ){
          const chapterMatch = chapterMatches[0];

          let selection : Selection | undefined = undefined;
          if( verse === '' ){
            //if there is not a verse we want to select the chapter.
            selection = new Selection( chapterMatch.range.startLineNumber, chapterMatch.range.startColumn, chapterMatch.range.endLineNumber, chapterMatch.range.endColumn );

          }else{
            //now if there is a verse as well find it after the chapter.

            //now look for the verse after the chapter.
            //                         findNextMatch(searchString: string, searchStart: IPosition             , isRegex: boolean, matchCase: boolean, wordSeparators: string | null, captureMatches: boolean): FindMatch | null;
            const verseMatches = model.findNextMatch( '\\v ' + verse     , chapterMatch.range.getEndPosition(), false           , true              , null                         , false                  );

            if( verseMatches ){
              //have the editor highlight the verse.
              //constructor(                   selectionStartLineNumber: number  , selectionStartColumn: number  , positionLineNumber: number      , positionColumn: number );
              selection = new Selection( verseMatches.range.startLineNumber, verseMatches.range.startColumn, verseMatches.range.endLineNumber, verseMatches.range.endColumn );
            }
          }

          //if something was selected then select it.
          if( selection ){ 
            editorRef.current?.setSelection( selection );
            //make the selection visible.
            editorRef.current?.revealRange( selection ); 
          }
        }
      }
    }
  }

  //see if the function acquireVsCodeApi exists.
  //Ignore if acquireVsCodeApi does not exist.
  // @ts-expect-error acquireVsCodeApi exists in vscode.
  if (typeof acquireVsCodeApi === 'function' && vscodeRef.current === null ) {
    // @ts-expect-error acquireVsCodeApi exists in vscode.
    vscodeRef.current = acquireVsCodeApi();
  }

  const _requestIdRef = React.useRef(1);
  const _callbacksRef = React.useRef<Map<number, (response: UsfmMessage) => void>>(new Map());

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const postMessageWithResponse = (message: UsfmMessage): Promise<UsfmMessage> =>  {
    const requestId = _requestIdRef.current;
    _requestIdRef.current += 1;
    return new Promise<UsfmMessage>((resolve,error) => {
      _callbacksRef.current.set(requestId, (response: UsfmMessage) => {
        if( response.error ){
          error( response.error );
        }else{
          resolve( response );
        }
      });
      vscodeRef.current?.postMessage({ ...message, requestId });
    });
  }

  const getConfiguration = async (key: string) : Promise<any> => {
    return (await postMessageWithResponse( { command: 'getConfiguration', commandArg: key } ) ).response!;
  }

  const getFile = async (path: string) : Promise<string|undefined> => {
    return (await postMessageWithResponse( { command: 'getFile', commandArg: path } )).response;
  }

  const getDocumentUri = async (): Promise<string> => {
    return (await postMessageWithResponse( { command: 'getDocumentUri' } )).response;
  }

  const getAlignmentData = async ( reference: string ): Promise<any|undefined> => {
    return (await postMessageWithResponse( { command: 'getAlignmentData', content: getDocumentData(), commandArg: reference } )).response;
  }

  const setAlignmentData = async ( newAlignments : any, reference: string ) : Promise<VersionInfo> => {
    const documentData = getDocumentData();
    const newConvertedAlignmentData = (await postMessageWithResponse( { command: 'setAlignmentData', content: documentData, commandArg: { reference, newAlignments } } )).response;
    const newDocumentData : InternalUsfmJsonFormat = { ...documentData };
    newDocumentData.alignmentData.perf = newConvertedAlignmentData;
    newDocumentData.alignmentData.version += 1 + Math.random();
    setDocumentData( {newDocumentData, sendStrippedUsfm: false} );
    return { strippedUsfmVersion: newDocumentData.strippedUsfm.version, alignmentDataVersion: newDocumentData.alignmentData.version, reference };
  }

  const makeAlignmentSuggestions = async ( args:  {sourceSentence: TWord[], targetSentence: TWord[], maxSuggestions: number, manuallyAligned: TSourceTargetAlignment[]}) : Promise<TAlignmentSuggestion[]> => {
    return (await postMessageWithResponse( { command: 'makeAlignmentSuggestions', commandArg: args } )).response;
  }

  //Go ahead and subscribe to the plugin events.
  useEffect(() => {
    const messageEventListener = (e: {data: UsfmMessage}) => {
      const model: editor.ITextModel | undefined = editorRef.current?.getModel() as editor.ITextModel | undefined;
      //If the model doesn't exist yet, just drop the sync so we don't think we are up to date,
      //when we are not.
      if( e.data.command === 'sync' && e.data.content && model ){
        let doUpdateState = false;
        let doSendReply = false;
        let doEditorUpdate = false;
        let newDocumentData = getDocumentData();
        if( e.data.content.alignmentData !== undefined ){
          if( e.data.content.alignmentData.version > newDocumentData.alignmentData.version ){
            doUpdateState = true;
            newDocumentData = {
              ...newDocumentData,
              alignmentData: e.data.content.alignmentData
            };
          }else if( e.data.content.alignmentData.version < newDocumentData.alignmentData.version ){
            doSendReply = true;
          }
        }
        if( e.data.content.strippedUsfm !== undefined ){
          if( e.data.content.strippedUsfm.version > newDocumentData.strippedUsfm.version ){
            doUpdateState = true;
            newDocumentData = {
              ...newDocumentData,
              strippedUsfm: e.data.content.strippedUsfm
            };
            doEditorUpdate = true;
          }else if( e.data.content.strippedUsfm.version < newDocumentData.strippedUsfm.version ){
            //Don't bother sending a reply if we have an outgoing edit waiting to go.
            if( handleEditorChangeDebounceRef.current === 0 ){
              doSendReply = true;
            }
          }
        }
        if( doUpdateState ){
          setDocumentData({newDocumentData, sendAlignmentData:false, sendStrippedUsfm:false });
        }
        if( doEditorUpdate && e.data.content.strippedUsfm !== undefined ){
          ignoreChangeCountRef.current += 1;
          const position = editorRef.current?.getPosition();
          model.setValue(e.data.content.strippedUsfm.text);
          if( position )editorRef.current?.setPosition(position);
        }
        if( doSendReply ){
          console.log( "sending reply because the webview has a newer version" );
          if( vscodeRef.current )vscodeRef.current?.postMessage({ command: 'sync', content: newDocumentData });
        }
      }else if( e.data.command === 'flushUpdates' ){
        if( vscodeRef.current ){
          //First we sync our data.
          vscodeRef.current?.postMessage({ command: 'sync', content: getDocumentData() });
          //and then we respond with the id to indicate that we have done so.
          vscodeRef.current?.postMessage({ command: 'response', requestId: e.data.requestId });
        }
      }else if( e.data.command === 'selectReference' ){
        console.log( "Selecting reference " + e.data.commandArg );
        if( e.data.commandArg ){
          selectReference( e.data.commandArg );
        }
        setAppState( { ...appState, activeView: 'view_stripped_usfm' } );
      }else if( e.data.command === 'alignReference' ){
        console.log( "performing alignment " + e.data.commandArg );
        setAppState( { ...appState, activeView: 'view_align_usfm', alignmentReference: e.data.commandArg || '' } );
      }else if( e.data.command === 'getActiveViewName' ){
        if( vscodeRef.current ){
          console.log( "Sending the active view is " + appState.activeView );
          vscodeRef.current?.postMessage({ command: 'response', requestId: e.data.requestId, response: appState.activeView });
        }
      }else if( e.data.command === 'response' ){
        if( e.data.requestId ){
          const callback = _callbacksRef.current.get(e.data.requestId);
          if( callback ){
            callback(e.data);
            _callbacksRef.current.delete(e.data.requestId);
          }
        }
      }
    };
    window.addEventListener('message', messageEventListener);

    return () => window.removeEventListener('message', messageEventListener);
  }, [appState]);
  

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.layout(); 
    }
  }, [appState.activeView]);

  return <>
    <p>ActiveView {appState.activeView}</p>
    <div style={
      { 
        "display": (appState.activeView === 'view_stripped_usfm' ? 'flex' : 'none'), 
        "flexDirection": 'column', 
        "flex": 1 
      }}>
      <Editor 
      wrapperProps={{ style: { 
        flex: 1,
        display: 'flex',
        position: 'relative',
        textAlign: 'initial'
      } }} 
      defaultLanguage="text" 
      theme={editorColorScheme} 
      onChange={handleEditorChange} 
      onMount={handleEditorMount}
      />
    </div>
    <div style={{ display: (appState.activeView === 'view_align_usfm' ? 'flex' : 'none'), 
        "flexDirection": 'column', 
        "flex": 1 
       }}>
      <AlignmentDialogWrapper 
        reference={appState.alignmentReference} 
        setAlignmentData={setAlignmentData}
        getAlignmentData={getAlignmentData}
        strippedUsfmVersion={documentDataState?.strippedUsfm?.version}
        alignmentDataVersion={documentDataState?.alignmentData?.version}
        makeAlignmentSuggestions={makeAlignmentSuggestions}
      />
    </div>
 </>
}
