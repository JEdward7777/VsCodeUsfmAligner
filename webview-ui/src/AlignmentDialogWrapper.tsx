import React, { useEffect } from 'react';
//@ts-ignore
import { SuggestingWordAligner, TAlignerData, TReference, TSourceTargetAlignment, TWord } from 'suggesting-word-aligner-rcl';

//import css
import './AlignmentDialogWrapper.css';

interface AlignmentDialogWrapperProps {
    reference: string;
    setAlignmentData: (alignmentData: any, reference: string) => void;
    getAlignmentData: (reference: string) => Promise<any>;
}


// interface SourceMapI{
//     [key: string]: string
// }

const AlignmentDialogWrapper: React.FC<AlignmentDialogWrapperProps> = ({
    reference,
    setAlignmentData,
    getAlignmentData
}) => {

    //state var for the source map.
    //const [sourceMap, setSourceMap] = React.useState<SourceMapI>({});




    const [alignmentDataState, setAlignmentDataState] = React.useState<any>({});


    async function figureAlignmentData(){
        let alignmentData = await getAlignmentData(reference);
        console.log( "alignmentData: " + alignmentData );
        setAlignmentDataState(alignmentData);
    }
    useEffect(() => {
        figureAlignmentData();
    },[reference]);

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

    const onAlignmentChange = (alignmentData: TAlignerData) => {
        console.log( "AlignmentData: " + alignmentData );  
        setAlignmentData(alignmentData.verseAlignments, reference);
    }

    console.log( "About to render Alignment dialog wrapper" );

    return (
        <div id="AlignmentDialogWrapper">
            <p>Alignment dialog wrapper {reference}</p>
            {Object.keys(alignmentDataState || {}).length === 0 ? (
                // Show loading message if alignments are an empty dictionary
                <p>Loading...</p>
            ) : (
                // Render the SuggestingWordAligner component if alignments are not empty
                <SuggestingWordAligner
                    key={alignmentDataState?.reference}
                    style={{ maxHeight: `${height}px`, overflowY: 'auto' }}
                    verseAlignments={alignmentDataState?.alignments || null}
                    targetWords={alignmentDataState?.wordBank || null}
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