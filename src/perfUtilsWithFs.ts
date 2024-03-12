import path from 'path';
import fs from 'fs';
import { PRIMARY_WORD, Perf, PerfVerse, SECONDARY_WORD, TSourceTargetAlignment, TTrainingAndTestingData, TWord, extractAlignmentsFromPerfVerse, extractWrappedWordsFromPerfVerse, getSourceFolders, pullVersesFromPerf, reindexPerfVerse, sortAndSupplementFromSourceWords, usfmToPerf } from './perfUtils';


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

function getFileInWorkspace( filePath: string, firstWorkSpaceFolder: string ): Promise< string | undefined > {
    //const firstWorkSpaceFolder = vscode.workspace?.workspaceFolders?.[0]?.uri.fsPath;
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


async function getFirstValidFile( filenames: string[], firstWorkSpaceFolder: string ) : Promise<string | undefined> {
    for( const filename of filenames ){
        try{
            let fileContent = await getFileInWorkspace( filename, firstWorkSpaceFolder );
            if( fileContent ){
                return fileContent;
            }
        }catch( e ){
            //ignore
        }
    }
    return undefined;
}


export async function getSourceFileForTargetFile( 
        filename: string, 
        getConfiguration: (key: string) => Promise<any>, 
        firstWorkSpaceFolder: string ) : Promise< string | undefined > {
    let result = undefined;
    const baseFilename = path.basename(filename);
    

    let sourceFolders = await getSourceFolders(getConfiguration);    
    let sourceFilenames = computeSourceFilenames( filename, sourceFolders );
    result = await getFirstValidFile( sourceFilenames, firstWorkSpaceFolder );

    if( result === undefined ){
        //Throw an exception indicating that we can't find the file.
        throw new Error(`Could not find source file for ${baseFilename}`);
    }
    return result;
}


export async function getAllAlignmentDataFromBook( filename: string, fileContents: string, 
    getConfiguration: (key: string) => Promise<any>,
    firstWorkSpaceFolder: string, includeUnfinished: boolean ): Promise< TTrainingAndTestingData | undefined >{

//TODO: Check if this throws an exception or returns null if it can't find the source files.
const sourceUsfm = await getSourceFileForTargetFile( filename , getConfiguration, firstWorkSpaceFolder );
if( !sourceUsfm ) return undefined;

const sourceUsfmPerf : Perf = usfmToPerf( sourceUsfm );

const targetUsfmPerf : Perf  = usfmToPerf( fileContents );

//use the file name without the path and the suffix as the book name.
const bookName = path.basename(filename).split(".")[0];

const sourceVerses : { [key: string]: PerfVerse} = pullVersesFromPerf( sourceUsfmPerf );
const targetVersesNotReindexed : { [key: string]: PerfVerse} = pullVersesFromPerf( targetUsfmPerf );


const targetVerses : { [key: string]: PerfVerse} = Object.fromEntries( Object.entries( targetVersesNotReindexed ).map( ([reference,targetVerseNotReindexed]: [string, PerfVerse]) => {
    const targetVerse = reindexPerfVerse( targetVerseNotReindexed );
    return [reference, targetVerse];
}))

const bookAlignments : { [key: string]: TSourceTargetAlignment[] } = Object.fromEntries( Object.entries( targetVerses ).map( ([reference,targetVerse]: [string, PerfVerse]) => {
    const alignments = extractAlignmentsFromPerfVerse( targetVerse );
    return [reference, alignments];
}));


const sourceWordsPerVerse = Object.fromEntries( Object.entries( sourceVerses ).map( ([reference,sourceVerse]: [string, PerfVerse]) => {
      const sourceWords = extractWrappedWordsFromPerfVerse( sourceVerse, PRIMARY_WORD );
      return [reference, sourceWords];
}))

const supplementedAlignmentsPerVerse = Object.fromEntries( Object.entries( bookAlignments ).map( ([reference,alignments]: [string, TSourceTargetAlignment[]]) => {
    const sourceWords = sourceWordsPerVerse[reference] ?? [];
    const supplementedAlignments = sortAndSupplementFromSourceWords( sourceWords, alignments );
    return [reference, supplementedAlignments];
}))

//Now create the data structure which will be stuffed with the result.
const result : TTrainingAndTestingData = {
    alignments: {},
    corpus: {},
}

//now loop through all the data and stuff it into the result.
Object.entries( supplementedAlignmentsPerVerse ).forEach( ([reference,supplementedAlignments]: [string, TSourceTargetAlignment[]]) => {
    const expandedReference = `${bookName} ${reference}`;

    const tWordTargetVerse: TWord[] = extractWrappedWordsFromPerfVerse( targetVerses[reference], SECONDARY_WORD );
    const tWordSourceVerse: TWord[] = extractWrappedWordsFromPerfVerse( sourceVerses[reference], PRIMARY_WORD );
    result.corpus[expandedReference] = {
        sourceTokens: tWordSourceVerse,
        targetTokens: tWordTargetVerse
    }

    //only add it to the alignments if the alignment is complete so that we don't train on incomplete alignments.
    const hasEmptySourceNgram = supplementedAlignments.some( (supplementedAlignment: TSourceTargetAlignment) => {
        return supplementedAlignment.sourceNgram.length === 0;
    });
    
    if( !hasEmptySourceNgram ){
        result.alignments[expandedReference] = {
            targetVerse: tWordTargetVerse,
            sourceVerse: tWordSourceVerse,
            alignments: supplementedAlignments,
        }                
    }
})

return result;
}
