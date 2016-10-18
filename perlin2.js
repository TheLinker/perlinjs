'use strict';

var B  = 0x100
var BM = 0xff

var N  = 0x1000
var NP = 12   /* 2^N */
var NM = 0xfff

var p     = [];
var g3    = [];
var g2    = [];
var g1    = [];
var start = 1;

function s_curve(t) { return t * t * (3.0 - (2.0 * t) ) }
function lerp(t, a, b) { return a + t * (b - a) }

function setup (i,vec,obj) {
    obj.t = vec[i] + N;
    obj.b0 = parseInt(obj.t) & BM;
    obj.b1 = (obj.b0+1) & BM;
    obj.r0 = obj.t - parseInt(obj.t);
    obj.r1 = obj.r0 - 1.;
}

function normalize2(v)
{
    var s = Math.sqrt(v[0] * v[0] + v[1] * v[1]);
    v[0] = v[0] / s;
    v[1] = v[1] / s;
}

function normalize3(v)
{
    var s = Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
    v[0] = v[0] / s;
    v[1] = v[1] / s;
    v[2] = v[2] / s;
}

function init()
{
    var i, j, k;

    for (i = 0 ; i < B ; i++) {
        p[i] = i;

        g1[i] = ((rand() % (B + B)) - B) / B;

        for (j = 0 ; j < 2 ; j++) {
            if(!g2[i]) g2[i] = [];
            g2[i][j] = ((rand() % (B + B)) - B) / B;
        }
        normalize2(g2[i]);

        for (j = 0 ; j < 3 ; j++)
            if(!g3[i]) g3[i] = [];
            g3[i][j] = ((rand() % (B + B)) - B) / B;
        normalize3(g3[i]);
    }

    while (--i) {
        k = p[i];
        p[i] = p[j = rand() % B];
        p[j] = k;
    }

    for (i = 0 ; i < B + 2 ; i++) {
        p[B + i] = p[i];
        g1[B + i] = g1[i];
        for (j = 0 ; j < 2 ; j++) {
            if(!g2[B + i]) g2[B + i] = [];
            g2[B + i][j] = g2[i][j];
        }
        for (j = 0 ; j < 3 ; j++) {
            if(!g3[B + i]) g3[B + i] = [];
            g3[B + i][j] = g3[i][j];
        }
    }
}

var noise1 = function(arg)
{
    var obj = {}

    if (start) {
        start = 0;
        init();
    }

    setup(0,[arg],obj);

    var sx = s_curve(obj.r0);

    var u = obj.r0 * g1[ p[ obj.b0 ] ];
    var v = obj.r1 * g1[ p[ obj.b1 ] ];

    return lerp(sx, u, v);
}


var noise2 = function(x,y)
{
    var obj = {}
    var vec = [x,y];

    if (start) {
        start = 0;
        init();
    }

    var objx = {}
    setup(0, vec, objx);
    var objy = {t:objx.t}
    setup(1, vec, objy);

    var i = p[ objx.b0 ];
    var j = p[ objx.b1 ];

    var b00 = p[ i + objy.b0 ];
    var b10 = p[ j + objy.b0 ];
    var b01 = p[ i + objy.b1 ];
    var b11 = p[ j + objy.b1 ];

    var sx = s_curve(objx.r0);
    var sy = s_curve(objy.r0);

    var at2 = function (rx,ry,q) {
        return rx * q[0] + ry * q[1]
    }

    var q,a,b,u,v;
    q = g2[ b00 ];
    u = at2(objx.r0,objy.r0,q);
    q = g2[ b10 ];
    v = at2(objx.r1,objy.r0,q);
    a = lerp(sx, u, v);

    q = g2[ b01 ];
    u = at2(objx.r0,objy.r1,q);
    q = g2[ b11 ];
    v = at2(objx.r1,objy.r1,q);
    b = lerp(sx, u, v);

    return lerp(sy, a, b);
}
