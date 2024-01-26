import React, { useEffect } from 'react';

interface AlignmentDialogWrapperProps {
    reference: string;
    getConfiguration: (key: string) => Promise<any>;
    getFile: (path: string) => Promise<string|undefined>;
    alignmentData: any;
    setAlignmentData: (alignmentData: any) => void;
    getDocumentUri: () => Promise<string>;
    getAlignmentData: (reference: string) => Promise<any>;
}



// interface SourceMapI{
//     [key: string]: string
// }

const AlignmentDialogWrapper: React.FC<AlignmentDialogWrapperProps> = ({
    reference,
    getConfiguration,
    getFile,
    getDocumentUri,
    getAlignmentData,
}) => {

    //state var for the source map.
    //const [sourceMap, setSourceMap] = React.useState<SourceMapI>({});




    const [alignmentData, setAlignmentData] = React.useState<any>({});

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

    async function figureAlignmentData(){
        let alignmentData = await getAlignmentData(reference);
        console.log( "alignmentData: " + alignmentData );
        setAlignmentData(alignmentData);
    }
    useEffect(() => {
        figureAlignmentData();
    },[reference]);


    //const [smallFile, setSmallFile] = React.useState<string>("");
    // async function getSmallFile(){
    //     console.log( "requesting smallFile." );
    //     let fileContent = await getFile("./bob.txt");
    //     console.log( "received smallFile. " + fileContent );
    //     if( fileContent ){
    //         setSmallFile(fileContent);
    //     }
    // }
    // if( smallFile === "" ){ 
    //     getSmallFile(); 
    // }else{
    //     console.log( "Have smallFile. " + smallFile );
    // }

    return (
        <div>
            <p>Alignment dialog wrapper</p>
            <p>{reference}</p>

        </div>
    )
}


export default AlignmentDialogWrapper