'use strict';

var m = 1<<31;
var a = 1103515245;
var c = 12345;

var next_seed = 0;
function srand(seed) {
    next_seed = seed;
}

function rand() {
    var ret = (a*next_seed+c) % m; 
    next_seed = ret;
    return ret;
}

// var LEN =  607;
// var TAP =  273;
// var MASK = 0x7fffffff;
// var A =    48271;
// var M =    2147483647;
// var Q =    44488;
// var R =    3399;
// var NORM = 1.0/(1.0+MASK);

// var rng_vec = [];
// var rng_tap = 0;
// var rng_feed = 0;
// var lk;

// function srand(seed)
// {
//     var lo, hi, x;
//     var i;

//     rng_tap = 0;
//     rng_feed = LEN-TAP;
//     seed = seed%M;
//     if(seed < 0)
//         seed += M;
//     if(seed == 0)
//         seed = 89482311;
//     x = seed;
//     /*
//      *  Initialize by x[n+1] = 48271 * x[n] mod (2**31 - 1)
//      */
//     for(i = -20; i < LEN; i++) {
//         hi = x / Q;
//         lo = x % Q;
//         x = A*lo - R*hi;
//         if(x < 0)
//             x += M;
//         if(i >= 0)
//             rng_vec[i] = x;
//     }
// }

// function rand()
// {
//     var x;

//     rng_tap--;
//     if(rng_tap < 0) {
//         if(rng_feed == 0) {
//             srand(1);
//             rng_tap--;
//         }
//         rng_tap += LEN;
//     }
//     rng_feed--;
//     if(rng_feed < rng_vec)
//         rng_feed += LEN;
//     x = (rng_vec[rng_feed] + rng_vec[rng_tap]) & MASK;
//     rng_vec[rng_feed] = x;

//     return x;
// }
