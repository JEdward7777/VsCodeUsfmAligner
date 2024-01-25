import React from 'react';

interface AlignmentDialogWrapperProps {
    reference: string;
    getConfiguration: (key: string) => Promise<any>;
    getFile: (path: string) => Promise<string|undefined>;
    alignmentData: any;
    setAlignmentData: (alignmentData: any) => void;
    getDocumentUri: () => Promise<string>;
}

function computeSourceFilenames(filename: string, sourceMap: { [key: string]: string[] }): string[] {

    const transformedFilenames : string[] = [];

    for (const regexPattern in sourceMap) {
      const regex = new RegExp(regexPattern);
      const match = filename.match(regex);
  
      if (match) {
        // iterate through the values in sourceMap[RegexPattern]
        // and replace in the filename
        for( const pattern of sourceMap[regexPattern] ) {

            // Use capture groups to replace in the corresponding value
            const replacementPiece = pattern.replace(/\$(\d+)/g, (_, groupIndex) => match[parseInt(groupIndex, 10)]);

            //now put the replacement in the filename.
            const transformedFilename = filename.replace(regex, replacementPiece);

            transformedFilenames.push( transformedFilename );
        }
      }
    }
  
    //return all the matches.
    return transformedFilenames;
  }

// interface SourceMapI{
//     [key: string]: string
// }

const AlignmentDialogWrapper: React.FC<AlignmentDialogWrapperProps> = ({
    reference,
    getConfiguration,
    getFile,
    getDocumentUri,
}) => {

    //state var for the source map.
    //const [sourceMap, setSourceMap] = React.useState<SourceMapI>({});


    async function getSourceMap() : Promise< { [key: string]: string[] } >{
        console.log( "requesting sourceMap." );
        let sourceMap : any = await getConfiguration("sourceMap");
        if( Object.keys(sourceMap).length == 0 ){ 
            sourceMap = {"([^\\\\/]*)\\.usfm": "source/$1.usfm"}; 
        }
        console.log( "received sourceMap. " + sourceMap );
        return sourceMap
    }

    const [inited, setInited] = React.useState<boolean>(false);

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

    async function init(){
        if( !inited ){
            let sourceMap = await getSourceMap();
            let filename = await getDocumentUri();
            let sourceFilenames = computeSourceFilenames( filename, sourceMap );
            let fileContent = await getFirstValidFile( sourceFilenames );
            console.log( "filename: " + filename );
            console.log( "sourceMap: " + Object.entries(sourceMap).map(([key, value]) => `${key} => ${value}`).join('\n') );
            console.log( "fileContent: " + fileContent );
            setInited(true);
        }
    }
    init();


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