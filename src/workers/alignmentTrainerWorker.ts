import { parentPort } from "node:worker_threads";
import { WorkerMessage } from "./alignmentTrainerTypes";
import path from 'path';
import crypto from 'crypto';

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

async function getOpenFiles(){
    return (await postMessageWithResponse({
        command: "getOpenFiles"
    })).content;
}

async function getWorkspaceFolders(){
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
    if( workspaceFolders.length > 0 ){
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
            bookGroups[i] = bookGroups[i].map( b => path.join( workspaceFolders[0].uri.path, b ) );
        }
    }



    //now see if the usfm files which are currently open are represented, otherwise add each of them as their own group.
    const openFiles = (await getOpenFiles()).map( (f : string) => f.replace("file://", "") );
    for( const openFile of openFiles ){
        if( !bookGroups.some( b => b.includes( openFile ) ) ){
            bookGroups.push( [openFile] );
        }
    }

    return bookGroups;
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

async function trainModels(){
    let done = false;

    while( !done ){
        const enabled = await getConfiguration( "alignmentTraining.enabled", true );
        if( enabled ){
            //we mark that we are done before we start, but if we find any work
            //to do we will set it to false again.
            done = true;


            const openEditors = await getOpenFiles();
            console.log( "worker: open editors: " + JSON.stringify( openEditors ) );

            const bookGroups : string[][] = await getBookGroups();
            for( const bookGroup of bookGroups ){
                const needsTraining = await getNeedsTraining( bookGroup );
                if( needsTraining ){
                    // done = false;
                    // await trainBookGroup( bookGroup );
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
    setTimeout(process.exit, 5000);
} ).catch( e => {
    console.log( "worker: error: " + e );
    //exit after a timeout.
    setTimeout(process.exit, 5000);
});



//now wait for 10 seconds.
setTimeout(() => {
    // Now exit.
    console.log( "worker: after 10 seconds" );

}, 10000);