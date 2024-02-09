import React, { useEffect } from 'react';
//@ts-ignore
import { SuggestingWordAligner, TAlignerData, TReference, TSourceTargetAlignment, TWord } from 'suggesting-word-aligner-rcl';

//import css
import './AlignmentDialogWrapper.css';


export interface VersionInfo{
    strippedUsfmVersion: number;
    alignmentDataVersion: number;
    reference: string;
}


interface AlignmentDialogWrapperProps {
    reference: string;
    strippedUsfmVersion: number;
    alignmentDataVersion: number;
    setAlignmentData: (alignmentData: any, reference: string) => Promise<VersionInfo>;
    getAlignmentData: (reference: string) => Promise<any>;
}


// interface SourceMapI{
//     [key: string]: string
// }

interface AlignmentDialogWrapperState {
    alignmentData?: any | undefined;
    strippedUsfmVersion?: number | undefined;
    alignmentDataVersion?: number | undefined;
}

const AlignmentDialogWrapper: React.FC<AlignmentDialogWrapperProps> = ({
    reference,
    strippedUsfmVersion,
    alignmentDataVersion,
    setAlignmentData,
    getAlignmentData
}) => {

    //This contains the alignment data for the dialog.  Changing
    //This feeds the dialog.  The dialog is keyed off of the reference
    //and version numbers so that if these are changed in state the dialog
    //reloads.
    const [state, setState] = React.useState<AlignmentDialogWrapperState>({});

    //The ref version of the versions, makes it so that we can keep track of
    //of the versions in a way that doesn't update the component so that we can
    //skip updates that we know about already.
    
    //The version number in this can be higher then the version number in state
    //because it gets set by the callback.  But we don't need to update the data
    //in the state with fresh data because the aligner dialog is just happy with the data
    //it has and we don't want to reset it.  This also prevents when there are more then
    //one event flushing through asynchronously that the aligner dialog doesn't get whiplash.
    const versionRefs = React.useRef<VersionInfo>({strippedUsfmVersion: -1, alignmentDataVersion: -1, reference: ""});


    async function figureAlignmentData( strippedUsfmVersion: number, alignmentDataVersion: number, reference: string ) {
        let alignmentData = await getAlignmentData(reference);
        console.log( "alignmentData: " + alignmentData );
        setState({alignmentData,
            strippedUsfmVersion,
            alignmentDataVersion,
        });

        versionRefs.current.strippedUsfmVersion = Math.max( strippedUsfmVersion, versionRefs.current.strippedUsfmVersion );
        versionRefs.current.alignmentDataVersion = Math.max( alignmentDataVersion, versionRefs.current.alignmentDataVersion );
        versionRefs.current.reference = reference;
    }
    useEffect(() => {
        //Ignore updates that we already know about.
        if( strippedUsfmVersion > (versionRefs.current.strippedUsfmVersion ?? -1) || 
            alignmentDataVersion > (versionRefs.current.alignmentDataVersion ?? -1) ||
            reference !== versionRefs.current.reference){
            figureAlignmentData( strippedUsfmVersion, alignmentDataVersion, reference );
        }
    },[reference,strippedUsfmVersion,alignmentDataVersion]);

    const height = 500;

    const translate = (text: string) => {
        if( text === "" ){
            return "";
        }
        return text;
    }

    const showPopover = () =>{
        return false;
    }

    const alignmentInProcessRef = React.useRef(false);
    const stashedAlignmentDataToProcess = React.useRef<TAlignerData | undefined>();

    const onAlignmentChange = async (alignmentData: TAlignerData) => {

        //if the alignment is currently in process, stash the alignment data
        //otherwise process.
        if( !alignmentInProcessRef.current ){
            //mark that we are in process
            alignmentInProcessRef.current = true;

            //init with our own alignment data
            let currentAlignmentData = alignmentData;
            //and keep looping while we pick up new alignments
            while( currentAlignmentData !== undefined ){

                console.log( "AlignmentData before sleep" ); 
                //sleep to allow the forground machinery priority.
                await new Promise(r => setTimeout(r, 2000));
                console.log( "AlignmentData after sleep"  ); 
        
                const newVersionRefs : VersionInfo = await setAlignmentData(currentAlignmentData.verseAlignments, reference);
                //The max might be superfluous but it's good to be safe.
                versionRefs.current.alignmentDataVersion = Math.max( versionRefs.current.alignmentDataVersion, newVersionRefs.alignmentDataVersion );
                versionRefs.current.strippedUsfmVersion = Math.max( versionRefs.current.strippedUsfmVersion, newVersionRefs.strippedUsfmVersion );

                //grab new alignment datas which have been stashed if they exist.
                currentAlignmentData = stashedAlignmentDataToProcess.current;
                stashedAlignmentDataToProcess.current = undefined;

                if( currentAlignmentData !== undefined ){
                    console.log( "AlignmentData picked up stashed alignment" );
                }
            }

            console.log( "AlignmentData done processing" );

            //mark that we are done.
            alignmentInProcessRef.current = false;
        }else{
            //stash the alignment data if we are in process
            //overwriting any existing alignment already stashed.
            console.log( "AlignmentData Stashing alignment data" );
            stashedAlignmentDataToProcess.current = alignmentData;
        }

    }

    console.log( "About to render Alignment dialog wrapper" );

    return (
        <div id="AlignmentDialogWrapper">
            <p>Alignment dialog wrapper {reference}</p>
            {Object.keys(state?.alignmentData || {}).length === 0 ? (
                // Show loading message if alignments are an empty dictionary
                <p>Loading...</p>
            ) : (
                // Render the SuggestingWordAligner component if alignments are not empty
                <SuggestingWordAligner
                    key={"" + state?.alignmentData?.reference + "," + state?.strippedUsfmVersion + "," + state?.alignmentDataVersion}
                    style={{ maxHeight: `${height}px`, overflowY: 'auto' }}
                    verseAlignments={state?.alignmentData?.alignments || null}
                    targetWords={state?.alignmentData?.wordBank || null}
                    translate={translate}
                    contextId={{ reference: reference }}
                    targetLanguage={"xxx"}
                    targetLanguageFont={''}
                    sourceLanguage={"yyy"}
                    showPopover={showPopover}
                    lexicons={{}}
                    loadLexiconEntry={(_arg:any) => { return {} }}
                    onChange={onAlignmentChange}
                    suggester={undefined}
                />
            )}
        </div>
    );
}


export default AlignmentDialogWrapper