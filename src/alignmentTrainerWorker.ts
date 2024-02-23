import { workerData } from "node:worker_threads";


console.log( "in the worker" );

//now wait for 10 seconds.
setTimeout(() => {
    // Now exit.
    console.log( "after 10 seconds" );
    
}, 10000);