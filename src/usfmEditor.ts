import * as vscode from 'vscode';
import { UsfmDocumentAbstraction, UsfmEditorAbstraction } from './usfmOutline';
//@ts-ignore
import {Proskomma} from 'proskomma-core';
//@ts-ignore
import {PipelineHandler} from 'proskomma-json-tools';
import * as fs from 'fs';
import * as path from 'path';

interface InternalUsfmJsonFormat{
    strippedUsfm: {
        version: number,
        text: string
    },
    alignmentData: {
        version: number,
        perf: any,
    }
}

interface UsfmMessage{
    command: string,
    content?: InternalUsfmJsonFormat,
    requestId?: number,
    commandArg?: any,
    response?: any,
    error?: any,
  }

export function disposeAll(disposables: vscode.Disposable[]): void {
    while (disposables.length) {
        const item = disposables.pop();
        if (item) {
            item.dispose();
        }
    }
}

function deepCopy(obj: any): any {
    return JSON.parse(JSON.stringify(obj));
}

export abstract class Disposable {
    private _isDisposed = false;

    protected _disposables: vscode.Disposable[] = [];

    public isClosed = false;

    public dispose(): any {
        if (this._isDisposed) {
            return;
        }
        this._isDisposed = true;
        disposeAll(this._disposables);
    }

    protected _register<T extends vscode.Disposable>(value: T): T {
        if (this._isDisposed) {
            value.dispose();
        } else {
            this._disposables.push(value);
        }
        return value;
    }

    protected get isDisposed(): boolean {
        return this._isDisposed;
    }
}

function computeSourceFilenames(filename: string, sourceFolders: string[]): string[] {

    const transformedFilenames: string[] = [];

    //if sourceFolders is a string wrap it in an array.
    if (typeof sourceFolders === 'string') { sourceFolders = [sourceFolders]; }

    for (const sourceFolder in sourceFolders) {
        //get the filename without the path from filename:
        const filenameWithoutPath = path.basename(filename);

        //now concatenate that onto the sourceFolder path.
        transformedFilenames.push(path.join(sourceFolders[sourceFolder], filenameWithoutPath));
    }
    //return all the matches.
    return transformedFilenames;
}

/**
 * Asynchronously retrieves the source map.  The source map is what
 * maps source files (greek, hebrew) from the target files that you are working
 * with.
 * @return {Promise<{ [key: string]: string[] }>} The retrieved source map
 */
async function getSourceFolders() : Promise< string[] >{
    if( !vscode.workspace ) return [];

    
    console.log( "requesting sourceFolders." );

    let sourceFolders : string[] | undefined = vscode.workspace?.getConfiguration("usfmEditor").get("sourceFolders" );
    
    //if sourceFolders is undefined, then get the default.
    if( sourceFolders === undefined ) { sourceFolders = []; }

    //if sourceFolders is a string wrap it in an array.
    if( typeof sourceFolders === 'string' ){ sourceFolders = [sourceFolders]; }


    return sourceFolders;
}


function getFile( filePath: string ): Promise< string | undefined > {
    const firstWorkSpaceFolder = vscode.workspace?.workspaceFolders?.[0]?.uri.fsPath;
    const filePathRebased = firstWorkSpaceFolder ? path.resolve(firstWorkSpaceFolder, filePath) : filePath;

    return new Promise( (resolve, reject) => {
        fs.readFile(filePathRebased, 'utf8', (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    });
}

async function getFirstValidFile( filenames: string[] ) : Promise<string | undefined> {
    for( const filename of filenames ){
        try{
            let fileContent = await getFile( filename );
            if( fileContent ){
                return fileContent;
            }
        }catch{
            //ignore
        }
    }
    return undefined;
}

async function getSourceFileForTargetFile( filename: string ) : Promise< string | undefined > {
    let done = false;
    let result = undefined;
    const baseFilename = path.basename(filename);
    while( !done ){
        let sourceFolders = await getSourceFolders();    
        let sourceFilenames = computeSourceFilenames( filename, sourceFolders );
        result = await getFirstValidFile( sourceFilenames );

        if( result !== undefined ){
            done = true;
        }else{
            //Ask the user for a path to the source files.
            const newSourceFolder = await vscode.window.showInputBox({
                placeHolder: `Enter the folder containing the source lang file related to ${baseFilename}:`,
                value: ""
            });

            if( newSourceFolder ){
                //test to see if the supplied folder works.
                sourceFilenames = computeSourceFilenames( filename, [newSourceFolder] );
                result = await getFirstValidFile( sourceFilenames );

                if( result === undefined ){
                    vscode.window.showErrorMessage(`Did not find a file named ${baseFilename} in the source folder ${newSourceFolder}`);
                }else{
                    //if we found a source there, go ahead and change to configuration to add this folder.
                    sourceFolders.push( newSourceFolder );
                    await vscode.workspace?.getConfiguration("usfmEditor").update("sourceFolders", sourceFolders);
                    done = true;
                }
            }else{
                //if the user cancels then we are done.
                done = true;
            }
        }
    }
    return result;
}

function usfmToPerf( usfm: string ): any {
    const pk = new Proskomma();
    pk.importDocument({lang: "xxx", abbr: "yyy"}, "usfm", usfm);
    return JSON.parse(pk.gqlQuerySync("{documents {perf}}").data.documents[0].perf);
}

function pullVerseFromPerf( reference: string, perf: any ): any {
    if( !reference ) return undefined;
    
    const referenceParts = reference.split(":");

    if( referenceParts.length != 2 ) return undefined;

    const chapter : string = referenceParts[0];
    const verse : string = referenceParts[1];


    let currentChapter : string = "-1";
    let currentVerse : string = "-1";

    const collectedContent : any[] = [];

    //first iterate the chapters.
    //perf.sequences[perf.main_sequence_id].blocks is an array.
    for( const block of perf.sequences[perf.main_sequence_id].blocks ){
        if( block.type == 'paragraph' ){
            for( const content of block.content ){
                if( content.type == 'mark' ){
                    if( content.subtype == 'chapter' ){
                        currentChapter = content.atts.number;
                    }else if( content.subtype == 'verses' ){
                        currentVerse = content.atts.number;
                    }
                    //if we have changed the reference and we have already
                    //collected content, then we can stop scanning and just return
                    if( collectedContent.length > 0 && currentChapter != chapter && currentVerse != verse ){
                        return collectedContent;
                    }
                }else{
                    //if we are in the correct reference then collect the content.
                    if( currentChapter == chapter && currentVerse == verse ){
                        collectedContent.push( content );
                    }
                }
            }
        }
    }

    return collectedContent;
}

function replacePerfVerseInPerf( perf :any, perfVerse: any, reference : string ){
    if( !reference ) return undefined;
    
    const referenceParts = reference.split(":");

    if( referenceParts.length != 2 ) return undefined;

    const chapter : string = referenceParts[0];
    const verse : string = referenceParts[1];


    let currentChapter : string = "-1";
    let currentVerse : string = "-1";

    const newMainSequenceBlocks : any[] = [];

    //iterate the chapters.
    for( const block of perf.sequences[perf.main_sequence_id].blocks ){
        if( block.type == 'paragraph' ){
            const newContent = [];
            for( const content of block.content ){
                let dropContent  = false;
                let pushNewVerse = false;
                if( content.type == 'mark' ){
                    if( content.subtype == 'chapter' ){
                        currentChapter = content.atts.number;
                    }else if( content.subtype == 'verses' ){
                        currentVerse = content.atts.number;

                        //if the chapter and verse are correct, then dump the inserted content in.
                        if( currentChapter == chapter && currentVerse == verse ){
                            //I set a flag here instead of just push it because
                            //the content has to be pushed after the verse indicator
                            pushNewVerse = true;
                        }   
                    }
                }else{
                    //if we are in the existing verse, then drop all existing content
                    //so that the inserted content is not doubled.
                    if( currentChapter == chapter && currentVerse == verse ){
                        dropContent = true;
                    }
                }
                if( !dropContent ){ newContent.push(    content   );}
                if( pushNewVerse ){ newContent.push( ...perfVerse );}
            }
            newMainSequenceBlocks.push( {
                ...block,
                content: newContent
            });
        }else{
            newMainSequenceBlocks.push( block );
        }
    }

    const newPerf = {
        ...perf,
        sequences: {
            ...perf.sequences,
            [perf.main_sequence_id]: {
                ...perf.sequences[perf.main_sequence_id],
                blocks: newMainSequenceBlocks
            }
        }
    };

    return newPerf;
}


function perfContentToTWord( perfContent: any ){
    const word : { [key: string]: any } = {};

     if (perfContent?.atts?.["x-occurrence" ] ) { word["occurrence" ] = perfContent.atts["x-occurrence" ].join(" "); }
     if (perfContent?.atts?.["x-occurrences"] ) { word["occurrences"] = perfContent.atts["x-occurrences"].join(" "); }
     if (perfContent?.atts?.["x-content"    ] ) { word["text"       ] = perfContent.atts["x-content"    ].join(" "); }
     if (perfContent?.      ["content"      ] ) { word["text"       ] = perfContent.content              .join(" "); }
     if (perfContent?.atts?.["x-lemma"      ] ) { word["lemma"      ] = perfContent.atts["x-lemma"      ].join(" "); }
     if (perfContent?.atts?.["lemma"        ] ) { word["lemma"      ] = perfContent.atts["lemma"        ].join(" "); }
     if (perfContent?.atts?.["x-morph"      ] ) { word["morph"      ] = perfContent.atts["x-morph"      ].join(","); }
     if (perfContent?.atts?.["x-strong"     ] ) { word["strong"     ] = perfContent.atts["x-strong"     ].join(" "); }
     if (perfContent?.atts?.["strong"       ] ) { word["strong"     ] = perfContent.atts["strong"       ].join(" "); }
    return word;
}


function computeOccurrenceInformation( words: any[] ){
    const wordsCopy = deepCopy( words );
    const occurrenceMap = new Map<string, number>();
    for( const word of wordsCopy ){
        const occurrence = (occurrenceMap.get( word.text ) || 0) + 1;
        occurrenceMap.set( word.text, occurrence );
        word.occurrence = occurrence;
    }
    for( const word of wordsCopy ){
        word.occurrences = occurrenceMap.get( word.text );
    }
    return wordsCopy;
}

function extractWrappedWordsFromPerfVerse( perfVerse: any, reindexOccurrences: boolean = false ): any[] {
    let wrappedWords : any[] = [];
    let inMapping = false;
    let index = 0;
    for( const content of perfVerse ){
        //If content is a string just skip it.  It is like commas and stuff.
        if( typeof content == 'string' ){
            //pass
        }else if( content.type == "wrapper" && content.subtype == "usfm:w" ){
            const wrappedWord = perfContentToTWord( content );
            wrappedWord.disabled = inMapping; //If the word is mapped then disable it for the wordBank.
            wrappedWord.index = index++;
            wrappedWords.push( wrappedWord );
        }else if( content.type == "start_milestone" && content.subtype == "usfm:zaln" ){
            inMapping = true;
        }else if( content.type == "end_milestone" && content.subtype == "usfm:zaln" ){
            //I know the end_milestone can come in clumps, but this works anyways.
            inMapping = false;
        }
    }
    //recompute occurrence information if it doesn't exist.
    if( wrappedWords.length > 0 && (!wrappedWords[0].occurrence || reindexOccurrences) ){
        wrappedWords = computeOccurrenceInformation( wrappedWords );
    }else{
        console.log( "Wrapped words already have occurrence information." );
    }
    return wrappedWords;
}

function extractAlignmentsFromPerfVerse( perfVerse: any ): any[] {
    const alignments : any[] = [];
    const sourceStack : any[] = [];
    const targetStack : any[] = [];

    //we need to stash alignments as we make them so that further words that get
    //added to them can get poked into existing ones.
    const sourceNgramHashToAlignment = new Map<string, any>();

    let targetIndex = 0;
    for( const content of perfVerse ){

        if( content.type == "start_milestone" && content.subtype == "usfm:zaln" ){
            //we can't index the source words right now because they are out of order.
            //we will do it later when the alignments are supplemented with the unused source words.
            sourceStack.push( perfContentToTWord(content) );

            //If there are any target words then just drop them because they aren't part of this
            //group.
            targetStack.length = 0;
        }else if( content.type == "end_milestone" && content.subtype == "usfm:zaln" ){
            //process the source and target stacks when we are a place where we are popping
            if( targetStack.length > 0 ){
                const sourceNgram = [...sourceStack];
                const targetNgram = [...targetStack];

                const sourceNgramHash = hashNgramToString( sourceNgram );

                //If we have already seen the source ngram then add the target ngram to it
                if( !sourceNgramHashToAlignment.has( sourceNgramHash ) ){
                    const newAlignment = { sourceNgram, targetNgram };
                    sourceNgramHashToAlignment.set( sourceNgramHash, newAlignment );
                    alignments.push( newAlignment );
                }else{
                    const existingAlignment = sourceNgramHashToAlignment.get( sourceNgramHash );
                    existingAlignment.targetNgram = [...existingAlignment.targetNgram, ...targetNgram];
                }
                //clear the targetStack
                targetStack.length = 0;
            }

            sourceStack.pop();
        }else if( content.type == "wrapper" && content.subtype == "usfm:w" ){
            const wrappedWord = perfContentToTWord( content );
            wrappedWord.index = targetIndex++;
            targetStack.push( wrappedWord );
        }
    }
    return alignments;
}

function hashWordToString( word: any ){
    return `${word.text}-${word.occurrence}`;
}

function hashNgramToString( ngram: any[] ){
    return ngram?.map( ( word: any ) => hashWordToString( word ) )?.join("/");
}

function sortAndSupplementFromSourceWords( sourceWords:any, alignments:any ){
    //Hash the source word list so that we can find them when going through the alignment source words.
    const sourceWordHashToSourceWord = Object.fromEntries( sourceWords.map( ( word : any ) => {
        return [ hashWordToString( word ), word ];
    }));
    //now hash all the sources to indicate which ones are represented so we can add the ones which are not.
    const sourceWordHashToExistsBool = alignments.reduce( (acc:any, cur:any) => {
        cur.sourceNgram.forEach( ( word :any  ) => {
            acc[ hashWordToString( word ) ] = true;
        });
        return acc;
    }, {});

    //now create an array of the sourceWords which are not represented.
    const newSourceWords = sourceWords.filter( ( word : any ) => {
        return !( hashWordToString( word ) in sourceWordHashToExistsBool );
    })

    //now create bogus alignments for the new source words.
    const newAlignments = newSourceWords.map( ( word : any ) => {
        //return a bogus alignment
        return {
            sourceNgram: [ word ],
            targetNgram: []
        }
    });

    //Now create a new list which has both the new alignments and the old alignments
    const combinedAlignments = alignments.concat( newAlignments );

    //Get the index set on all the source words in the alignment.
    const sourceIndexedAlignments = combinedAlignments.map( ( alignment : any, index : number ) => {
        const indexedSourceNgram = alignment.sourceNgram.map( ( sourceWord : any ) => {
            return {
                ...sourceWord,
                index: sourceWordHashToSourceWord[ hashWordToString( sourceWord  )  ]?.index ?? -1
            }
        });
        return {
            ...alignment,
            sourceNgram: indexedSourceNgram
        };
    });
    
    //now sort the alignment based on index of the first source word.
    sourceIndexedAlignments.sort( ( a : any, b : any ) => {
        return a.sourceNgram[0].index - b.sourceNgram[0].index;
    });

    //now give each alignment an index.
    const indexedAlignments = sourceIndexedAlignments.map( ( alignment : any, index : number ) => {
        return {
            ...alignment,
            index
        };
    });

    return indexedAlignments;
}

function reindexPerfVerse( perfVerse: any ): any {
    const perfVerseCopy = deepCopy( perfVerse );
    const occurrenceMap = new Map<string, number>();
    for( const perfContent of perfVerseCopy ){
        if( perfContent.hasOwnProperty("type") && perfContent.type == "wrapper" && 
        perfContent.hasOwnProperty("subtype") && perfContent.subtype == "usfm:w" ){
            const text = (perfContent?.["content"])?perfContent.content.join(" "):"";
            const occurrence = (occurrenceMap.get( text ) || 0) + 1;
            occurrenceMap.set( text, occurrence );
            if( !perfContent.atts ) perfContent.atts = {};
            perfContent.atts["x-occurrence" ] = [ "" + occurrence ];
        }
    }
    for( const perfContent of perfVerseCopy ){
        if( perfContent.hasOwnProperty("type") && perfContent.type == "wrapper" && 
        perfContent.hasOwnProperty("subtype") && perfContent.subtype == "usfm:w" ){
            const text = (perfContent?.["content"])?perfContent.content.join(" "):"";
            if( !perfContent.atts ) perfContent.atts = {};
            perfContent.atts["x-occurrences" ] = [ "" + occurrenceMap.get( text ) ];
        }
    }
    return perfVerseCopy;
}


async function mergeAlignmentPerf( strippedUsfmPerf: any, strippedAlignment: any ){
    try{
        const pipelineH = new PipelineHandler({proskomma: new Proskomma()});
        const mergeAlignmentPipeline_output = await pipelineH.runPipeline('mergeAlignmentPipeline', {
            perf: strippedUsfmPerf,
            strippedAlignment,
        });
        return mergeAlignmentPipeline_output.perf;
    }catch( e ){
        console.log( e );
    }
    return undefined;
}

function replaceAlignmentsInPerfVerse( perfVerse: any, newAlignments: any ): any[]{
    const result : any[] = [];

    const withoutOldAlignments = perfVerse.filter( ( perfContent : any ) => {
        if( perfContent.hasOwnProperty("type") && 
        (perfContent.type == "start_milestone" || perfContent.type == "end_milestone") &&
        perfContent.hasOwnProperty("subtype") && perfContent.subtype == "usfm:zaln" ){
            return false;
        }
        return true;
    });

    //this indicates what the current source alignment stack is so we know when it needs to change.
    let currentSourceAlignmentHash = "";
    let currentSourceAlignmentLength = 0;

    //hash each of the target words to the alignment which contains them.
    const targetWordHashToAlignment = new Map<string, any>();
    for( const alignment of newAlignments ){
        for( const targetWord of alignment.targetNgram ){
            targetWordHashToAlignment.set( hashWordToString( targetWord ), alignment );
        }
    }

    const closeSourceRange = () => {
        //we can just put it at the end but we will instead look backwards and find the last place
        //a word wrapper is and put it after that.
        let lastWordIndex = result.length - 1;
        while( lastWordIndex >= 0 && 
         !(result[lastWordIndex].hasOwnProperty("type"   ) && result[lastWordIndex].type    == "wrapper" && 
           result[lastWordIndex].hasOwnProperty("subtype") && result[lastWordIndex].subtype == "usfm:w") ){
            lastWordIndex--;
        }

        //take out the old source alignment
        //by inserting in after lastWordIndex
        for( let i = 0; i < currentSourceAlignmentLength; i++ ){
            const newEndMilestone : any = { 
                type: "end_milestone", 
                subtype: "usfm:zaln"
            }
            result.splice( lastWordIndex + i + 1, 0, newEndMilestone );
        }
    };

    for( const perfContent of withoutOldAlignments ){
        //Only do something different if it is a wrapped word.
        if( perfContent.hasOwnProperty("type") && perfContent.type == "wrapper" && 
        perfContent.hasOwnProperty("subtype") && perfContent.subtype == "usfm:w" ){
            
            const relevantAlignment = targetWordHashToAlignment.get( hashWordToString( perfContentToTWord( perfContent ) ) );

            //If the current currentSourceAlignmentHash is not correct and it is set we need to close it out.
            if( currentSourceAlignmentHash != (hashNgramToString(relevantAlignment?.sourceNgram) ?? "") ){
                closeSourceRange();

                //add in the new alignment.
                if( relevantAlignment ){
                    for( const sourceToken of relevantAlignment.sourceNgram ){
                        const newStartMilestone : any= {
                            type: "start_milestone",
                            subtype: "usfm:zaln",
                            atts: {}
                        }
                        if( sourceToken.hasOwnProperty("strong"     ) ){ newStartMilestone.atts["x-strong"      ] = [ "" + sourceToken.strong         ]; }
                        if( sourceToken.hasOwnProperty("lemma"      ) ){ newStartMilestone.atts["x-lemma"       ] = [ "" + sourceToken.lemma          ]; }
                        if( sourceToken.hasOwnProperty("morph"      ) ){ newStartMilestone.atts["x-morph"       ] =        sourceToken.morph.split(","); }
                        if( sourceToken.hasOwnProperty("occurrence" ) ){ newStartMilestone.atts["x-occurrence"  ] = [ "" + sourceToken.occurrence     ]; }
                        if( sourceToken.hasOwnProperty("occurrences") ){ newStartMilestone.atts["x-occurrences" ] = [ "" + sourceToken.occurrences    ]; }
                        if( sourceToken.hasOwnProperty("text"       ) ){ newStartMilestone.atts["x-content"     ] = [ "" + sourceToken.text           ]; }
                        result.push( newStartMilestone );
                    }
                    currentSourceAlignmentHash = hashNgramToString(relevantAlignment.sourceNgram);
                    currentSourceAlignmentLength = relevantAlignment.sourceNgram.length;
                }else{
                    currentSourceAlignmentHash = "";
                    currentSourceAlignmentLength = 0;
                }
            }
        }

        result.push( perfContent );
    }


    //now close out any remaining source alignment.
    closeSourceRange();
    currentSourceAlignmentHash = "";
    currentSourceAlignmentLength = 0;

    //Note, this will not work correctly if the alignment spans multiple verses.  But we have issues otherwise if this is the case.

    return result;
}



async function setAlignmentData( filename: string, data: InternalUsfmJsonFormat, args: { reference: string, newAlignments: any } ): Promise<void>{
    if( !args.reference ) return undefined;


    let mergedPerf = await mergeAlignmentPerf( usfmToPerf( data.strippedUsfm.text ), data.alignmentData.perf );
    if( !mergedPerf ) return undefined;


    const targetPerfVerse = pullVerseFromPerf( args.reference, mergedPerf );

    const targetPerfVerseReindex = reindexPerfVerse( targetPerfVerse );

    const updatedTargetPerfVerse = replaceAlignmentsInPerfVerse( targetPerfVerseReindex, args.newAlignments );


    const updatedMergedPerf = replacePerfVerseInPerf( mergedPerf, updatedTargetPerfVerse, args.reference );


    //Now need to create the new alignment structure by splitting the merged perf between content and alignments.
    const pipelIneH = new PipelineHandler({proskomma: new Proskomma()});
    const stripAlignmentPipeline_outputs = pipelIneH.runPipeline("stripAlignmentPipeline", {
        perf: updatedMergedPerf
    });

    const strippedAlign = stripAlignmentPipeline_outputs.strippedAlignment;

    return strippedAlign;
}

async function getAlignmentData( filename: string, data: InternalUsfmJsonFormat, reference: string ): Promise< any | undefined >{
    if( !reference ) return undefined;

    const sourceUsfm = await getSourceFileForTargetFile( filename );
    if( !sourceUsfm ) return undefined;

    const sourceUsfmPerf = usfmToPerf( sourceUsfm );

    const strippedUsfmPerf = usfmToPerf( data.strippedUsfm.text );


    //now bring up the pipeline in order to merge it back with the alignment data
    let mergedPerf = await mergeAlignmentPerf( strippedUsfmPerf, data.alignmentData.perf );
    if( !mergedPerf ) return undefined;

    const sourceVerse = pullVerseFromPerf( reference, sourceUsfmPerf );
    const mergedVerseNotReindexed = pullVerseFromPerf( reference, mergedPerf     );
    const mergedVerse = reindexPerfVerse( mergedVerseNotReindexed );

    

    const sourceWords = extractWrappedWordsFromPerfVerse( sourceVerse );
    const targetWords = extractWrappedWordsFromPerfVerse( mergedVerse );

    const alignments = extractAlignmentsFromPerfVerse( mergedVerse );

    const supplementedAlignments = sortAndSupplementFromSourceWords( sourceWords, alignments );
    
    console.log( "Checkpoint" );

    return {wordBank: targetWords, alignments: supplementedAlignments, reference: reference};
}


async function usfmToInternalJson( mergedUsfm: string ): Promise<InternalUsfmJsonFormat> {

    //first get the perf from the usfm
    const pk = new Proskomma();
    pk.importDocument({lang: "xxx", abbr: "yyy"}, "usfm", mergedUsfm);
    const mergedPerf = JSON.parse(pk.gqlQuerySync("{documents {perf}}").data.documents[0].perf);


    //Now split it using a pipeline.
    const pipelIneH = new PipelineHandler({proskomma: new Proskomma()});
    const stripAlignmentPipeline_outputs = pipelIneH.runPipeline("stripAlignmentPipeline", {
        perf: mergedPerf
    });

    const myStrippedPerf = stripAlignmentPipeline_outputs.perf;
    const strippedAlign = stripAlignmentPipeline_outputs.strippedAlignment;

    //convert the stripped perf back into usfm.
    const perfToUsfmPipeline_outputs = await pipelIneH.runPipeline("perfToUsfmPipeline", {
        perf: myStrippedPerf
    });
    const myStrippedUsfm = perfToUsfmPipeline_outputs.usfm;


    return {
        strippedUsfm: {
            version: 0,
            text: myStrippedUsfm
        },
        alignmentData: {
            version: 0,
            perf: strippedAlign,
        }
    };
}

async function internalJsonToUsfm( json: InternalUsfmJsonFormat ): Promise<string> {
    //here we run the reverse were we merge it together before saving it out.
    
    //first convert the stripped usfm back into perf

    const pk = new Proskomma();
    pk.importDocument({lang: "xxx", abbr: "yyy"}, "usfm", json.strippedUsfm.text);
    const myStrippedPerf = JSON.parse(pk.gqlQuerySync("{documents {perf}}").data.documents[0].perf);


    //now bring up the pipeline in order to merge it back with the alignment data
    const pipelineH = new PipelineHandler({proskomma: new Proskomma()});
    const mergeAlignmentPipeline_output = await pipelineH.runPipeline('mergeAlignmentPipeline', {
        perf: myStrippedPerf,
        strippedAlignment: json.alignmentData.perf,
    });
    const mergedPerf = mergeAlignmentPipeline_output.perf;

    //now convert that mergedPerf back into usfm
    const perfToUsfmPipeline_outputs = pipelineH.runPipeline("perfToUsfmPipeline", {
        perf: mergedPerf,
    });
    const mergedUsfm = perfToUsfmPipeline_outputs.usfm;

    return mergedUsfm;
}


interface UpdateFlushable{
    //async function flushUpdates
    flushUpdates(documentUri: vscode.Uri): Promise<void>;
}



class UsfmDocument extends Disposable implements vscode.CustomDocument, UsfmDocumentAbstraction {

    static async create(
        uri: vscode.Uri,
        backupId: string | undefined,
        updateFlusher: UpdateFlushable
    ): Promise< UsfmDocument | PromiseLike<UsfmDocument>>{
        //If we have a backup, read that.  Otherwise read the resource from the workspace
        
        //The backup files will be in JSON format, the normal data files will be in usfm format.
        //The reason for this decision os that that if there is escape, we don't have to do a reconcile
        //into a steady state representable in usfm which may not be possible if the user is half way through
        //typing a structure or something.
        let documentData: InternalUsfmJsonFormat | undefined;
        if( typeof backupId === "string" ){
            const backupDataArray = await vscode.workspace.fs.readFile(vscode.Uri.parse(backupId));
            const backupDataString = new TextDecoder().decode(backupDataArray);
            documentData = JSON.parse(backupDataString);
        }else{
            const fileDataArray = await vscode.workspace.fs.readFile(uri);
            const fileDataString = new TextDecoder().decode(fileDataArray);
            documentData = await usfmToInternalJson( fileDataString );
        }

        return new UsfmDocument( uri, documentData!, updateFlusher );
    }


    private readonly _uri: vscode.Uri;
    private _documentData: InternalUsfmJsonFormat;

    //This way we can tell if the document is dirty or not
    private _savedDocumentData: InternalUsfmJsonFormat | undefined;

    private constructor(
        uri: vscode.Uri,
        documentData: InternalUsfmJsonFormat,
        private updateFlusher: UpdateFlushable,
    ){
        super();
        this._uri = uri;
        this._documentData = documentData;

        //register a hook which notifies us if another program has modified our file.
        const changeWatcher = vscode.workspace.createFileSystemWatcher(new vscode.RelativePattern(this._uri, "*"));
        this._register(changeWatcher);
        changeWatcher.onDidChange(() => {
            console.log( "changeWatcher onDidChange " + this._uri.toString() );
            if( !this.isClosed && !this.isDirty ){
                this.revert( new vscode.CancellationTokenSource().token );
            }
        });


        this._savedDocumentData = deepCopy(this._documentData);
    }

    public get isDirty(): boolean {
        if( this._savedDocumentData === undefined ){ return true; }
        if( this._documentData.alignmentData.version !== this._savedDocumentData.alignmentData.version ){ return true; }
        if( this._documentData.strippedUsfm.version !== this._savedDocumentData.strippedUsfm.version ){ return true; }
        return false;
    }

    public get uri(): vscode.Uri {
        return this._uri;
    }

    public get documentData(): InternalUsfmJsonFormat {
        return this._documentData;
    }

    public getStrippedUsfmText(): string {
        if( this._documentData === undefined ){
            return "";
        }
        return this._documentData.strippedUsfm.text;
    }

    private readonly _onDidDispose = this._register(new vscode.EventEmitter<void>());
    /**
     * An event that is emitted when the document is disposed of.
     */
    public readonly onDidDispose = this._onDidDispose.event;
    
    /**
     * Called by VS Code when there are no more references to the document.
     *
     * This happens when all editors for it have been closed.
     */
    dispose(): void {
        console.log( "Disposing document " + this._uri.toString() );

        this._onDidDispose.fire();
        super.dispose();
        this.isClosed = true;
    }

    private readonly _onDidChangeDocument = this._register(new vscode.EventEmitter<{
        readonly content: InternalUsfmJsonFormat;
    }>());
    /**
     * Fired to notify webviews that the document has changed.
     */
    public readonly onDidChangeContent = this._onDidChangeDocument.event;

    private readonly _onDidChange = this._register(new vscode.EventEmitter<{
        readonly label: string,
        undo(): void,
        redo(): void,
    }>());
    /**
     * Fired to tell VS Code that an edit has occurred in the document.
     *
     * This updates the document's dirty indicator.
     */
    public readonly onDidChange = this._onDidChange.event;



    /**
     * Called when the user edits the document in a webview.
     *
     * This fires an event to notify VS Code that the document has been edited.
     */
    makeEdit(newContent: InternalUsfmJsonFormat) {
        const lastDocumentState = this._documentData;
        this._documentData = newContent;

        console.log( "making edit on version " + this._documentData.strippedUsfm.version );

        this._onDidChange.fire({
            label: 'onDidChangeLabel', //<-- Not sure where this comes through.
            undo: async () => {
                console.log( "undoing edit" );

                const replacedData = this._documentData;
                this._documentData = { ...lastDocumentState };

                this._documentData.alignmentData.version = replacedData.alignmentData.version + 1 + Math.random();
                this._documentData.strippedUsfm.version = replacedData.strippedUsfm.version + 1 + Math.random();
                console.log( "Undoing edit now on version " + this._documentData.strippedUsfm.version );
                this._onDidChangeDocument.fire({
                    content: this._documentData,
                });
            },
            redo: async () => {
                console.log( "redoing edit" );

                const replacedData = this._documentData;
                this._documentData = { ...newContent };
                this._documentData.alignmentData.version = replacedData.alignmentData.version + 1 + Math.random();
                this._documentData.strippedUsfm.version = replacedData.strippedUsfm.version + 1 + Math.random();
                console.log( "Redoing edit now on version " + this._documentData.strippedUsfm.version );
                this._onDidChangeDocument.fire({
                    content: this._documentData,
                });
            }
        });

        this._onDidChangeDocument.fire({
            content: this._documentData
        });
    }

    /**
     * Called by VS Code when the user saves the document.
     */
    async save(cancellation: vscode.CancellationToken): Promise<void> {
        if( this._documentData && !cancellation.isCancellationRequested ){
            await this.saveAs(this.uri, cancellation, false );
        }
    }



    /**
     * Called by VS Code when the user saves the document to a new location.
     */
    async saveAs(targetResource: vscode.Uri, cancellation: vscode.CancellationToken, isBackup: boolean ): Promise<void> {
        if( !this._documentData ){ return; }
        if( cancellation.isCancellationRequested ){ return; }

  
        const encoder = new TextEncoder();

        // With the save also convert the data back to the internal format
        // so if there was data lost in the conversion we see it.
        if( !isBackup ){
            // Loop through the _delegates and let each one of them flush updates to us
            await this.updateFlusher.flushUpdates(this._uri);

            // Now convert the data back to usfm.
            const usfmData = await internalJsonToUsfm( this._documentData );
            const usfmDataArray = encoder.encode(usfmData);
    
            await vscode.workspace.fs.writeFile(targetResource, usfmDataArray);


            const lastDocumentState = this._documentData;
            this._documentData = await usfmToInternalJson( usfmData );
            this._documentData.alignmentData.version = lastDocumentState.alignmentData.version + 1 + Math.random();
            this._documentData.strippedUsfm.version = lastDocumentState.strippedUsfm.version + 1 + Math.random();
           
            this._onDidChangeDocument.fire({
                content: this._documentData
            });

            //update the saved data so isDirty resets.
            this._savedDocumentData = deepCopy(this._documentData);
        }else{

            //if it is a backup just dump the json data.
            const jsonString = JSON.stringify(this._documentData);
            const jsonArray = encoder.encode(jsonString);

            await vscode.workspace.fs.writeFile(targetResource, jsonArray);
        }
    }


    /**
     * Called by VS Code when the user calls `revert` on a document.
     */
    async revert(_cancellation: vscode.CancellationToken): Promise<void> {
        console.log( "started revert" );
        //get the new version number now so that if edits happen after the revert finishes
        //we don't overwrite anymore.
        const newAlignmentVersion = this._documentData.alignmentData.version + (1 + Math.random())*.001;
        const newStrippedUsfmVersion = this._documentData.strippedUsfm.version + (1 + Math.random())*.001;


        const fileDataArray = await vscode.workspace.fs.readFile(this.uri);
        const fileDataString = new TextDecoder().decode(fileDataArray);
        const documentData = await usfmToInternalJson( fileDataString );

        //only update if the version is still relevant.
        if( newAlignmentVersion > this._documentData.alignmentData.version &&
            newStrippedUsfmVersion > this._documentData.strippedUsfm.version ){

            const lastDocumentState = this._documentData;

            //update the version numbers to be more then what it was so that the revert
            //can go through.
            this._documentData = documentData;
            this._documentData.alignmentData.version = newAlignmentVersion;
            this._documentData.strippedUsfm.version = newStrippedUsfmVersion;

            this._onDidChangeDocument.fire({
                content: this._documentData
            });

            //update the saved data so isDirty resets.
            this._savedDocumentData = deepCopy(this._documentData);
            console.log( "finished revert" );
        }else{
            console.log( "canceled revert" );
        }
    }

    /**
     * Called by VS Code to backup the edited document.
     *
     * These backups are used to implement hot exit.
     */
    async backup(destination: vscode.Uri, cancellation: vscode.CancellationToken): Promise<vscode.CustomDocumentBackup> {
        await this.saveAs(destination, cancellation, true);

        return {
            id: destination.toString(),
            delete: async () => {
                try {
                    await vscode.workspace.fs.delete(destination);
                } catch {
                    // noop
                }
            }
        };
    }
}


export function findEdit( before: string, after: string ): { start: number, end: number, newText: string } {
    //First find where the text is different from the start.
    let start = 0;
    while( start < before.length && start < after.length && before.charAt(start) === after.charAt(start) ){
        start++;
    }

    //Now find where the text is different from the end
    let end = before.length - 1;
    while( end >= start && (end-start) >= (before.length-after.length) &&  end+after.length-before.length >= 0 && before[end] === after[end+after.length-before.length]){
        end--;
    }

    //inc end because we want it to be the first char not changed, instead of the last char changed
    end++;

    return { start, end, newText: after.slice(start, end+after.length-before.length) };
}

export function useEdit( before: string, edit: { start: number, end: number, newText: string } ): string {
    return before.slice(0, edit.start) + edit.newText + before.slice(edit.end);
}

export class UsfmEditorProvider implements vscode.CustomEditorProvider<UsfmDocument>,  UsfmEditorAbstraction, UpdateFlushable{


    public static register(context: vscode.ExtensionContext): [vscode.Disposable, UsfmEditorAbstraction] {
        const provider = new UsfmEditorProvider(context);
        return [vscode.window.registerCustomEditorProvider(UsfmEditorProvider.viewType, provider,{
            webviewOptions: {
                retainContextWhenHidden: true,
            },
            supportsMultipleEditorsPerDocument: true
        }), provider];
    }

    private static readonly viewType = 'com.lansfords.usfmEditor';

    /**
     * Tracks all known webviews.  
     * The class takes care of automatically dropping references to the webviews when they close.
     */
    private readonly webviews = new WebviewCollection();


    constructor(private readonly _context: vscode.ExtensionContext) {
        
    }

    //#region CustomEditorProvider

    async openCustomDocument(uri: vscode.Uri, openContext: vscode.CustomDocumentOpenContext, token: vscode.CancellationToken): Promise<UsfmDocument> {
        const document: UsfmDocument = await UsfmDocument.create(uri, openContext.backupId, this );

        const listeners: vscode.Disposable[] = [];

        listeners.push(document.onDidChange( e => {
            // Tell VS Code that the document has been edited by the use.
            this._onDidChangeCustomDocument.fire({
                document,
                ...e,
            });
        }));


        listeners.push(document.onDidChangeContent(e => {
            // Update all webviews when the document changes
            for (const webviewPanel of this.webviews.get(document.uri)) {

                const updateMessage: UsfmMessage = {
                    command: 'sync',
                    content: document.documentData,
                };
                try{
                    webviewPanel.webview.postMessage(updateMessage);
                }catch{
                    //ignore
                }
            }
        }));

        document.onDidDispose(() => disposeAll(listeners));


        return document;
    }

    async resolveCustomEditor(document: UsfmDocument, webviewPanel: vscode.WebviewPanel, token: vscode.CancellationToken): Promise<void> {
        // Add the webview to our internal set of active webviews
        this.webviews.add(document.uri, webviewPanel);

        // Setup initial content for the webview
        webviewPanel.webview.options = {
            enableScripts: true
        };
        webviewPanel.webview.html = this.getHtmlForWebview(webviewPanel.webview);

        webviewPanel.webview.onDidReceiveMessage(e => this.onMessage(document, e, webviewPanel));

        webviewPanel.onDidChangeViewState(e => {
            if (e.webviewPanel.active) {
                this._onUsfmActiveEditorChanged.fire(document);
            }
        });
        
        this._onUsfmActiveEditorChanged.fire(document);
    }

    
    private readonly _onDidChangeCustomDocument = new vscode.EventEmitter<vscode.CustomDocumentEditEvent<UsfmDocument>>();
    public readonly onDidChangeCustomDocument = this._onDidChangeCustomDocument.event;

    
    private readonly _onUsfmActiveEditorChanged = new vscode.EventEmitter<UsfmDocument>();
    public readonly onUsfmActiveEditorChanged = this._onUsfmActiveEditorChanged.event;


    public saveCustomDocument(document: UsfmDocument, cancellation: vscode.CancellationToken): Thenable<void> {
        return document.save(cancellation);
    }

    public saveCustomDocumentAs(document: UsfmDocument, destination: vscode.Uri, cancellation: vscode.CancellationToken): Thenable<void> {
        return document.saveAs(destination, cancellation, false );
    }

    
    public revertCustomDocument(document: UsfmDocument, cancellation: vscode.CancellationToken): Thenable<void> {
        return document.revert(cancellation);
    }

    public backupCustomDocument(document: UsfmDocument, context: vscode.CustomDocumentBackupContext, cancellation: vscode.CancellationToken): Thenable<vscode.CustomDocumentBackup> {
        return document.backup(context.destination, cancellation);
    }
    //#endregion


    /**
     * Get the static HTML used for in our editor's webviews.
     */
    private getHtmlForWebview(webview: vscode.Webview): string {
        // Local path to script and css for the webview
        const styleResetUri = webview.asWebviewUri(vscode.Uri.joinPath(
            this._context.extensionUri, 'media', 'reset.css'));

        const styleVSCodeUri = webview.asWebviewUri(vscode.Uri.joinPath(
            this._context.extensionUri, 'media', 'vscode.css'));

        const styleMainUri = webview.asWebviewUri(vscode.Uri.joinPath(
            this._context.extensionUri, 'media', 'usfmEditor.css'));


        const reactIndexJsUri = webview.asWebviewUri(vscode.Uri.joinPath(
            this._context.extensionUri, 'webview-ui', 'build', 'assets', 'index.js'));
        
        const reactIndexCssUri = webview.asWebviewUri(vscode.Uri.joinPath(
            this._context.extensionUri, 'webview-ui', 'build', 'assets', 'index.css'));


        return /* html */`
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">

                <meta name="viewport" content="width=device-width, initial-scale=1.0">

                <link href="${styleResetUri}" rel="stylesheet" />
                <link href="${styleVSCodeUri}" rel="stylesheet" />
                <link href="${styleMainUri}" rel="stylesheet" />

                <title>Usfm Editor</title>


                <meta charset="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <script type="module" crossorigin src="${reactIndexJsUri}"></script>
                <link rel="stylesheet" crossorigin href="${reactIndexCssUri}">
            </head>
            <body>

                <h1>Usfm Editor</h1>

                <div id="root"></div>

            </body>
            </html>`;
    }

    public async getActiveViewName( webviewPanel: vscode.WebviewPanel ): Promise<string>{
        const message : UsfmMessage = {
            command: 'getActiveViewName'
        };
        const response = await this.postMessageWithResponse( webviewPanel, message );
        return response.response!;
    }


    public async flushUpdates( documentUri: vscode.Uri): Promise<void>{
        //Iterate through all of our web panels and request that they flush their updates.
        for( const webviewPanel of this.webviews.get(documentUri) ){
            const flushUpdateCommand : UsfmMessage = {
                command: 'flushUpdates'
            };
            try{
                await this.postMessageWithResponse( webviewPanel, flushUpdateCommand );
            }catch{
                //ignore
            }
        }
        return Promise.resolve();
    }

    private _requestId = 1;
    private readonly _callbacks = new Map<number, (response: UsfmMessage) => void>();

    private postMessageWithResponse(panel: vscode.WebviewPanel, message:UsfmMessage): Promise<UsfmMessage> {
        const requestId = this._requestId++;
        const p = new Promise<UsfmMessage>(resolve => this._callbacks.set(requestId, resolve));

        const out_message: UsfmMessage = {
            ...message,
            requestId
        };
        
        panel.webview.postMessage(out_message);
        return p;
    }


    async selectReference(reference: string, documentUri: vscode.Uri): Promise<void> {
        const selectReferenceCommand : UsfmMessage = {
            command: 'selectReference',
            commandArg: reference
        };

        //Find if there is a webview already looking at this reference.
        let foundView = false;
        for( const webviewPanel of this.webviews.get(documentUri) ){
            try{
                const activeView = await this.getActiveViewName( webviewPanel );
                if( activeView === "view_stripped_usfm" ){
                    foundView = true;
                    webviewPanel.webview.postMessage(selectReferenceCommand);
                }
            }catch{
                //ignore
            }
        }
        
        //Now if none of them were on the stripped_usfm view,
        //Then we will just send it to the first one to pop it over.
        if( !foundView ){
            for( const webviewPanel of this.webviews.get(documentUri) ){
                try{
                    webviewPanel.webview.postMessage(selectReferenceCommand);
                    break;
                }catch{
                    //ignore
                }
            }
        }
    }

    async alignReference(reference: string, documentUri: vscode.Uri): Promise<void> {
        const alignReferenceCommand : UsfmMessage = {
            command: 'alignReference',
            commandArg: reference
        };

        //Find if there is a webview already looking at this reference.
        let foundView = false;
        for( const webviewPanel of this.webviews.get(documentUri) ){
            try{
                const activeView = await this.getActiveViewName( webviewPanel );
                if( activeView === "view_align_usfm" ){
                    foundView = true;
                    webviewPanel.webview.postMessage(alignReferenceCommand);
                }
            }catch{
                //ignore
            }
        }
        
        //Now if none of them were on the stripped_usfm view,
        //Then we will just send it to the first one to pop it over.
        if( !foundView ){
            for( const webviewPanel of this.webviews.get(documentUri) ){
                try{
                    webviewPanel.webview.postMessage(alignReferenceCommand);
                    break;
                }catch{
                    //ignore
                }
            }
        }
    }


    onUsfmDocumentChanged(callback: (e: vscode.CustomDocumentEditEvent<UsfmDocument>) => void): void {
        this.onDidChangeCustomDocument(callback);
    }


    private onMessage(document: UsfmDocument, message: UsfmMessage, webviewPanel: vscode.WebviewPanel) {
        switch (message.command) {
            case 'sync':
                this.updateUsfmDocument(document, message, webviewPanel);
                console.log( "update received" );
                break;
            case 'ready':
                this.updateWebview( document, webviewPanel );
                break;
            case 'response':
                const callback = this._callbacks.get(message.requestId!);
                callback?.(message);
                this._callbacks.delete(message.requestId!);
                break;

            case 'getConfiguration': //This makes it so that the webview can get a configuration.
                const configurationName = message.commandArg;
                if( configurationName ){
                    const configuration = vscode.workspace?.getConfiguration("usfmEditor").get(configurationName );
                    webviewPanel.webview.postMessage({
                        command: 'response',
                        requestId: message.requestId,
                        response: configuration
                    });
                }
                break;
            
            case 'getFile':
                const filePath = message.commandArg!;
                const firstWorkSpaceFolder = vscode.workspace?.workspaceFolders?.[0]?.uri.fsPath;
                const filePathRebased = firstWorkSpaceFolder ? path.resolve(firstWorkSpaceFolder, filePath) : filePath;

                if (filePathRebased) {
                    fs.readFile(filePathRebased, 'utf8', (err, data) => {
                        if (err) {
                            // Handle error
                            console.error(err);
                            webviewPanel.webview.postMessage({
                                command: 'response',
                                requestId: message.requestId,
                                error: err
                            });
                        } else {
                            webviewPanel.webview.postMessage({
                                command: 'response',
                                requestId: message.requestId,
                                response: data,
                            });
                        }
                    });
                }
                break;

            case 'getDocumentUri':
                webviewPanel.webview.postMessage({
                    command: 'response',
                    requestId: message.requestId,
                    response: document.uri.fsPath,
                });
                break;

            case 'getAlignmentData':
                getAlignmentData( document.uri.fsPath, message.content!, message.commandArg! ).then( response => {
                    webviewPanel.webview.postMessage({
                        command: 'response',
                        requestId: message.requestId,
                        response
                    });
                }).catch( err => {
                    webviewPanel.webview.postMessage({
                        command: 'response',
                        requestId: message.requestId,
                        error: err
                    });
                });
                break;
            case 'setAlignmentData':
                setAlignmentData( document.uri.fsPath, message.content!, message.commandArg! ).then( response => {
                    webviewPanel.webview.postMessage({
                        command: 'response',
                        requestId: message.requestId,
                        response
                    });
                }).catch( err => {
                    webviewPanel.webview.postMessage({
                        command: 'response',
                        requestId: message.requestId,
                        error: err
                    });
                })
                break;
        }
    }

    private updateUsfmDocument(document: UsfmDocument, data: UsfmMessage, webviewPanel: vscode.WebviewPanel) {
        if( document.isClosed ) { return; }

        if( data.command === "sync" && data.content ){
            let doUpdateState = false;
            let doSendReply = false;
            let newDocumentData = document.documentData;
            if( data.content.alignmentData.version > newDocumentData.alignmentData.version ){
                doUpdateState = true;
                newDocumentData = {
                    ...newDocumentData,
                    alignmentData: data.content.alignmentData
                };
            }else if( data.content.alignmentData.version < newDocumentData.alignmentData.version ){
                doSendReply = true;
            }
            if( data.content.strippedUsfm.version > newDocumentData.strippedUsfm.version ){
                doUpdateState = true;
                newDocumentData = {
                    ...newDocumentData,
                    strippedUsfm: data.content.strippedUsfm
                };
            }else if( data.content.strippedUsfm.version < newDocumentData.strippedUsfm.version ){
                doSendReply = true;
            }

            if( doUpdateState ){
                document.makeEdit( newDocumentData );
            }
            if( doSendReply ){
                this.updateWebview( document, webviewPanel );
            }
        }
    };

    private updateWebview(document: UsfmDocument, webviewPanel: vscode.WebviewPanel ) {
        const updateMessage: UsfmMessage = {
            command: 'sync',
            content: document.documentData
        };
        webviewPanel.webview.postMessage(updateMessage);
    };
    

    // public async resolveCustomTextEditor(
    //     document: vscode.TextDocument,
    //     webviewPanel: vscode.WebviewPanel,
    //     token: vscode.CancellationToken
    // ): Promise<void> {
    //     webviewPanel.webview.options = {
    //         enableScripts: true
    //     };
    //     webviewPanel.webview.html = this.getHtmlForWebview(webviewPanel.webview);

    //     webviewPanel.onDidChangeViewState(e => {
    //         if (e.webviewPanel.active) {
    //             this.onUsfmActiveEditorChangedSet.forEach(callback => {
    //                 callback(document);
    //             });
    //         }
    //     });

    //     this.onUsfmActiveEditorChangedSet.forEach(callback => {
    //         callback(document);
    //     });




    //     const changeDocumentSubscription = vscode.workspace.onDidChangeTextDocument(e => {
    //         if (e.document.uri.toString() === document.uri.toString()) {
    //             updateWebview();
    //             this.onUsfmDocumentChangedSet.forEach(callback => {
    //                 callback(e);
    //             });
    //         }
    //     });

    //     // const activeEditorSubscription = vscode.window.onDidChangeActiveTextEditor(e => {
    //     //     if (e?.document.uri.toString() === document.uri.toString()) {
    //     //         updateWebview();
    //     //         this.onUsfmActiveEditorChangedSet.forEach(callback => {
    //     //             callback(e?.document);
    //     //         });
    //     //     }
    //     // });
        
    //     const messageSubscription = webviewPanel.webview.onDidReceiveMessage((e: UsfmMessage) => {
    //         switch (e.command) {
    //             case 'sync':
    //                 updateTextDocument(e);
    //                 console.log( "update received" );
    //                 break;
    //             case 'ready':
    //                 updateWebview();
    //                 break;
    //         }
    //     });


    //     const getDocContent = () : InternalUsfmJsonFormat => {
    //         //check if the document is dirty.
    //         const isDirty = document.isDirty;

    //         //if the document is dirty then it is just json of the DirtyDocumentFormat,
    //         //otherwise we need to construct it.
    //         const result: InternalUsfmJsonFormat = (isDirty) ? 
    //             JSON.parse(document.getText()) :
    //             {
    //                 strippedUsfm: {
    //                     version: 0,
    //                     text: document.getText()
    //                 },
    //                 alignmentData: {
    //                     version: 0
    //                 }
    //             };
    //         return result;
    //     };


    //     this.liveWebViews.add(webviewPanel);
        
    //     webviewPanel.onDidDispose(() => {
    //         changeDocumentSubscription.dispose();
    //         messageSubscription.dispose();
    //         //activeEditorSubscription.dispose();
    //         this.liveWebViews.delete(webviewPanel);
    //     });

    //     updateWebview();
    // }

    


}

/**
 * Tracks all webviews.
 */
class WebviewCollection {

    private readonly _webviews = new Set<{
        readonly resource: string;
        readonly webviewPanel: vscode.WebviewPanel;
    }>();

    public *all(): Iterable<vscode.WebviewPanel> {
        for (const entry of this._webviews) {
            yield entry.webviewPanel;
        }
    }

    /**
     * Get all known webviews for a given uri.
     */
    public *get(uri: vscode.Uri): Iterable<vscode.WebviewPanel> {
        const key = uri.toString();
        for (const entry of this._webviews) {
            if (entry.resource === key) {
                yield entry.webviewPanel;
            }
        }
    }

    /**
     * Add a new webview to the collection.
     */
    public add(uri: vscode.Uri, webviewPanel: vscode.WebviewPanel) {
        const entry = { resource: uri.toString(), webviewPanel };
        this._webviews.add(entry);

        webviewPanel.onDidDispose(() => {
            this._webviews.delete(entry);
        });
    }
}
