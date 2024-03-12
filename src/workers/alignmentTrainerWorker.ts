import { parentPort } from "node:worker_threads";
import { WorkerMessage } from "./alignmentTrainerTypes";
import path from 'path';
import crypto from 'crypto';
import fs from 'fs';
import zlib from 'zlib';
import { TSourceTargetAlignment, TTrainingAndTestingData } from "../perfUtils";
import { Token } from "wordmap-lexer";
import { Alignment, Ngram } from "wordmap";
import { updateTokenLocations } from "wordmapbooster/dist/wordmap_tools";
import { MorphJLBoostWordMap } from "wordmapbooster/dist/boostwordmap_tools";
import { Uri } from "vscode";
import { getAllAlignmentDataFromBook } from "../perfUtilsWithFs";

let nextRequestId : number = 0;
//callbacks a map from a number to a resolve or reject function
const callbackPairs : Map<number, [Function, Function]> = new Map();


function postMessageWithResponse(message:WorkerMessage): Promise<WorkerMessage> {
    const requestId : number = nextRequestId++;
    const p = new Promise<WorkerMessage>((resolve, reject) => callbackPairs.set(requestId, [resolve, reject]));

    const out_message: WorkerMessage = {
        ...message,
        requestId
    };

    parentPort?.postMessage(out_message);
    return p;
}

parentPort?.on( "message", (message:WorkerMessage) => {
    if( message.command === "respond" ){
        const callBackPair = callbackPairs.get( message.requestId! );
        if( callBackPair ){
            const [resolve, reject] = callBackPair;
            if( message.error ){
                reject( message );
            }else{
                resolve( message );
            }
            callbackPairs.delete( message.requestId! );
        }
    }
});

async function getConfiguration( key: string, defaultValue: any ){
    return (await postMessageWithResponse({
        command: "getConfiguration",
        content: { key, defaultValue }
    })).content;
}

async function getOpenFiles() : Promise<string[]> {
    return (await postMessageWithResponse({
        command: "getOpenFiles"
    })).content;
}

async function getWorkspaceFolders() : Promise<{index: number, name: string, uri: Uri}[] | undefined> {
    return (await postMessageWithResponse({
        command: "getWorkspaceFolders"
    })).content;
} 

async function getFileStat( filePath: string ){
    try{
        return (await postMessageWithResponse({
            command: "getFileStat",
            content: { filePath }
        })).content;
    }catch( e ){
        return null;
    }
}


async function getBookGroups(){
    const bookGroupsString = await getConfiguration( "alignmentTraining.bookGroups", "" );

    const workspaceFolders = await getWorkspaceFolders() ?? [];
    
    //now I will split the book groups into groups, split by blank lines.
    const bookGroups : string[][] = [];

    //only process the bookGroups if we have some workspaceFolders.
    if( workspaceFolders.length === 0 ){
        return bookGroups;
    }

    
    const lines = bookGroupsString.split( "\n" );
    let currentGroup : string[] = [];
    for( const line of lines ){
        if( line.trim() ){
            currentGroup.push( line );
        }else{
            if( currentGroup.length > 0 ){
                bookGroups.push( currentGroup );
                currentGroup = [];
            }
        }
    }
    if( currentGroup.length > 0 ){
        bookGroups.push( currentGroup );
        currentGroup = [];
    }

    //Now I need to path join these with the first folder in the workspace.
    for( let i = 0; i < bookGroups.length; i++ ){
        bookGroups[i] = bookGroups[i].map( b => path.join( workspaceFolders[0].uri.path, b ) ).map( b => path.normalize( b ) );
    }

    //now see if the usfm files which are currently open are represented, otherwise add each of them as their own group.
    const openFiles = (await getOpenFiles()).map( f => path.normalize( f ) );
    for( const openFile of openFiles ){
        if( !bookGroups.some( b => b.includes( openFile ) ) ){
            bookGroups.push( [openFile] );
        }
    }

    return bookGroups;
}

async function filenameToBookGroup( filename: string ) : Promise<string[] | undefined> {
    const bookGroups = await getBookGroups();
    //convert the bookGroups into canonical paths.
    const bookGroupsCanonical = bookGroups.map( b => b.map( f => path.normalize( f ) ) );
    const filenameCanonical = path.normalize( filename );

    //need to see if we can find the filenameCanonical in any of the bookGroupsCanonical
    //But we have to return the original non-canonical path.
    //iterate over bookGroupsCanonical but have the index in the loop.
    for( let i = 0; i < bookGroupsCanonical.length; i++ ){
        if( bookGroupsCanonical[i].includes( filenameCanonical ) ){
            return bookGroups[i];
        }
    }
    return undefined;
}

function bookGroupToModelName( bookGroup: string[] ){
    //The output will have the same path as the first entry.
    //The name will have the first entry to the second entry (unless it is just one entry)
    //Plus 4 characters of a hash of the entire string joined with \n's.
    //We only need a hash if there are more then two to represent the missing books.
    //The point is that if any of the books are to change, the name of the model would change.

    if( bookGroup.length === 0 ) return undefined;

    const firstEntry = bookGroup[0];

    const pathOfFirstEntry = path.dirname( firstEntry );

    //Strip off the suffix.
    const nameOfFirstEntry = path.basename( firstEntry ).split(".")[0];
    const nameOfLastEntry = path.basename( bookGroup[bookGroup.length-1] ).split(".")[0];

    let result = nameOfFirstEntry;
    if( bookGroup.length > 2 ){
        result += "_to_";
    }else if( bookGroup.length > 1 ){
        result += "_";
    }
    if( bookGroup.length > 1 ) result += nameOfLastEntry;

    if( bookGroup.length > 2 ){
        const fullStringJoin = bookGroup.join( "\n" );
        const hash = crypto.createHash( "md5" );
        hash.update( fullStringJoin );
        result += "_" + hash.digest("hex").substring(0, 4);
    }

    //now tack a .model onto the end.
    result += ".model";

    //and put the path on the front.
    return path.join( pathOfFirstEntry, result );
}

async function getNeedsTraining( bookGroup: string[] ){
    //The way we tell if this book group needs training
    //is to see if any of the modification time of any of the books are
    //after the modification time of the resulting model.

    let lastBookModTime : number | null = null;

    for( const book of bookGroup ){
        const bookStat = await getFileStat( book );
        if( bookStat && (lastBookModTime === null || ( bookStat.mtime > lastBookModTime )) ){
            lastBookModTime = bookStat.mtime;
        }
    }

    //if we couldn't find any books to stat in this group, we don't need to train.
    if( lastBookModTime === null ) return false;

    //path to model
    const modelPath = bookGroupToModelName( bookGroup );
    if( modelPath ){
        const modelStat = await getFileStat( modelPath );
        //if there is no model we need to train
        if( !modelStat ) return true;
        //and if a book has been modified after the model we need to train
        if( lastBookModTime === null || ( modelStat.mtime < lastBookModTime )) return true;
    }

    return false;
}

async function trainModelForBookGroup( data: TTrainingAndTestingData ){


    //Convert the data into the structure which the training model expects.
    const sourceVersesTokenized : {[reference: string]: Token[] } = {};
    const targetVersesTokenized : {[reference: string]: Token[] } = {};
    const alignments: {[reference: string]: Alignment[] } = {};
    Object.entries(data.alignments).forEach(([reference,training_data])=>{
        // sourceVersesTokenized[reference] = wordmapLexer.tokenize(training_data.sourceVerse);
        // targetVersesTokenized[reference] = wordmapLexer.tokenize(training_data.targetVerse);
        sourceVersesTokenized[reference] = training_data.sourceVerse.map( n => new Token(n) );
        targetVersesTokenized[reference] = training_data.targetVerse.map( n => new Token(n) );
        updateTokenLocations(sourceVersesTokenized[reference])
        updateTokenLocations(targetVersesTokenized[reference])
    
        
        alignments[reference] = training_data.alignments.map(alignment=>new Alignment( new Ngram( alignment.sourceNgram.map( n => new Token(n) ) ), new Ngram( alignment.targetNgram.map( n => new Token(n) )  ) ) );
    });
    
    
    const sourceCorpusTokenized : {[reference: string]: Token[] } = {};
    const targetCorpusTokenized : {[reference: string]: Token[] } = {};
    Object.entries(data.corpus).forEach(([reference,training_data])=>{
        sourceCorpusTokenized[reference] = training_data.sourceTokens.map( n => new Token(n) );
        targetCorpusTokenized[reference] = training_data.targetTokens.map( n => new Token(n) );
        updateTokenLocations(sourceCorpusTokenized[reference])
        updateTokenLocations(targetCorpusTokenized[reference])
    })
    
    
    //TODO: break the hyper parameters of MorphJLBoostWordMap out into configuration options.

    //Create the training object.
    //There are several different word map classes,
    //and there are different hyper parameters which can be passed into it as well.
    const wordAlignerModel = new MorphJLBoostWordMap({ targetNgramLength: 5, warnings: false, forceOccurrenceOrder:false, train_steps:1000 });

    //TODO: make this also a configuration option.
    wordAlignerModel.setTrainingRatio( .1 );

    wordAlignerModel.appendKeyedCorpusTokens(sourceCorpusTokenized,targetCorpusTokenized);
    //Do a test to see if adding the alignment stuff as corpus as well helps.
    wordAlignerModel.appendKeyedCorpusTokens(sourceVersesTokenized,targetVersesTokenized);
    
    await wordAlignerModel.add_alignments_2(sourceVersesTokenized,targetVersesTokenized,alignments);

    return wordAlignerModel;

}

async function trainBookGroup( bookGroup: string[] ){
    //first load in the different books which actually exist.

    //I could make this go through the message passing and have vscode load the book,
    //but I really don't want to cause any lagging on the vscode side, so I am going
    //to load this with fs directly and when/if this gets turned into a web plugin,
    //this decision can be reverted.

    //drop any book that is not found.  If an exception is thrown don't include the book.
    const usfmContent: { [filename: string]: string } = bookGroup.reduce((acc: { [filename: string]: string }, filename: string) => {
        try {
            const content = fs.readFileSync(filename).toString();
            acc[filename] = content;
        } catch {
            // File not found or unable to read
        }
        return acc;
    }, {});

    //wrap the configuration getter so that it doesn't have a second parameter.
    const getConfigurationWrapper = async ( key : string ) => await getConfiguration( key, null );

    //now get the workspace folders
    const workSpaceFolders = await getWorkspaceFolders() ?? [];
    if( workSpaceFolders.length === 0 ){
        throw new Error( "no workspace folders" );
    }
    const firstWorkspaceFolder = workSpaceFolders[0].uri.path;

    const bookAlignments: TTrainingAndTestingData = await Object.entries(usfmContent).reduce(async (promiseAccumulator: Promise<TTrainingAndTestingData>, [filename, content]: [string, string]) => {
        const accumulator = await promiseAccumulator;
        const currentValue = await getAllAlignmentDataFromBook(filename, content, getConfigurationWrapper, firstWorkspaceFolder, false);
        if (currentValue === undefined) return accumulator;

        //I don't want to have collisions between the new references and the ones
        //already in the accumulator.
        const referenceRemap : { [reference: string]: string } = {};
        
        //first collect all the references and remove duplicates.
        const references = Object.keys(currentValue.alignments).concat(Object.keys(currentValue.corpus)).filter((value, index, array) => array.indexOf(value) === index);

        //now remap the references
        references.forEach((reference) => {
            if( reference in accumulator.alignments || reference in accumulator.corpus ){
                //already exists
                let prefixNumber = 1;
                let newReference = `${prefixNumber} ${reference}`;
                while( newReference in accumulator.alignments || newReference in accumulator.corpus ){
                    prefixNumber++;
                    newReference = `${prefixNumber} ${reference}`;
                }
                referenceRemap[reference] = newReference;
            }else{
                referenceRemap[reference] = reference;
            }
        });

        //change the references in the alignments and corpus
        const remappedAlignments = Object.fromEntries( Object.entries(currentValue.alignments).map( ([k, v]) => [referenceRemap[k], v] ) );
        const remappedCorpus     = Object.fromEntries( Object.entries(currentValue.corpus    ).map( ([k, v]) => [referenceRemap[k], v] ) );


        return {
            alignments: { ...accumulator.alignments, ...remappedAlignments },
            corpus:     { ...accumulator.corpus    , ...remappedCorpus     }
        };
        //TODO: make it so that alignments and corpus which come back do not collide with each other.
    }, Promise.resolve({ alignments: {}, corpus: {} }));

    //Do the actual training.
    console.log( "worker: Training...");

    const model = await trainModelForBookGroup( bookAlignments );
    console.log( "worker: Training complete." );

    //save the model
    const modelPath = bookGroupToModelName( bookGroup );
    if( modelPath ){
        const replaceModel = () : Promise<void> =>   {
            const tempPath = modelPath + ".tmp";
            //model save returns a jason-able structure which then needs to be saved to the path.
            //I would also like to gzip it on the way out because we can and that will save space.
            const modelJson = JSON.stringify( model.save() );
            //now gzip the string.
            const gzip = zlib.createGzip();
            const gzipStream = gzip.pipe(fs.createWriteStream( tempPath ));

            return new Promise( (resolve, reject) => {
                gzipStream.on('finish', () => {
                    //now move the temp file to the model path
                    fs.promises.rename(tempPath, modelPath)
                    .then(() => resolve())
                    .catch(reject); // Directly pass error to rejection
                });
                gzipStream.on('error', reject);
                gzipStream.write( modelJson );
                gzipStream.end();
            });
        }
        await replaceModel();
    }
}

async function trainModels(){
    let done = false;

    while( !done ){
        const enabled = await getConfiguration( "alignmentTraining.enabled", true );
        if( enabled ){
            //we mark that we are done before we start, but if we find any work
            //to do we will set it to false again.
            done = true;


            const bookGroups : string[][] = await getBookGroups();

            // //run through each of the open editors and make sure there is a book group for it.
            // const openEditorFilenames = await getOpenFiles();
            // console.table( openEditorFilenames );
            // for( const filename of openEditorFilenames ){
            //     const bookGroup = await filenameToBookGroup( filename );
            //     if( !bookGroup ){
            //         bookGroups.push( [filename] );
            //     }
            // }


            for( const bookGroup of bookGroups ){
                const needsTraining = await getNeedsTraining( bookGroup );
                if( needsTraining ){
                    try{
                        await trainBookGroup( bookGroup );
                        done = false;
                    }catch( e ){
                        console.log( "worker: error: " + e );
                    }
                }
            }
        }else{
            done = true;
        }
    }
}


console.log( "worker: in the worker" );

trainModels().then( () => {
    console.log( "worker: done" );
    //timeout is needed or the log doesn't show up.
    setTimeout(process.exit, 100);
} ).catch( e => {
    console.log( "worker: error: " + e );
    setTimeout(process.exit, 100);
});
