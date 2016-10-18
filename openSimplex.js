'use strict';

var STRETCH_CONSTANT_2D = -0.211324865405187;    //(1/Math.sqrt(2+1)-1)/2;
var SQUISH_CONSTANT_2D = 0.366025403784439; //(Math.sqrt(2+1)-1)/2;

var NORM_CONSTANT_2D = 47;

var DEFAULT_SEED = 0;

var perm = [];

function OpenSimplexNoise(seed) {
    // var permGradIndex3D = new short[256];
    var source = [];
    for (var i = 0; i < 256; i++)
        source[i] = i;

    seed = (seed * 6364136223846793005 + 1442695040888963407) % ((1<<31) - 1);
    seed = (seed * 6364136223846793005 + 1442695040888963407) % ((1<<31) - 1);
    seed = (seed * 6364136223846793005 + 1442695040888963407) % ((1<<31) - 1);
    for (var i = 255; i >= 0; i--) {
        seed = (seed * 6364136223846793005 + 1442695040888963407) % ((1<<31) - 1);
        var r = parseInt((seed + 31) % (i + 1));
        if (r < 0)
            r += (i + 1);
        perm[i] = source[r];
        // permGradIndex3D[i] = (short)((perm[i] % (gradients3D.length / 3)) * 3);
        source[r] = source[i];
    }
}

//2D OpenSimplex Noise.
function noise2(x, y) {

    //Place input coordinates onto grid.
    var stretchOffset = (x + y) * STRETCH_CONSTANT_2D;
    var xs = x + stretchOffset;
    var ys = y + stretchOffset;
    
    //Floor to get grid coordinates of rhombus (stretched square) super-cell origin.
    var xsb = fastFloor(xs);
    var ysb = fastFloor(ys);
    
    //Skew out to get actual coordinates of rhombus origin. We'll need these later.
    var squishOffset = (xsb + ysb) * SQUISH_CONSTANT_2D;
    var xb = xsb + squishOffset;
    var yb = ysb + squishOffset;
    
    //Compute grid coordinates relative to rhombus origin.
    var xins = xs - xsb;
    var yins = ys - ysb;
    
    //Sum those together to get a value that determines which region we're in.
    var inSum = xins + yins;

    //Positions relative to origin point.
    var dx0 = x - xb;
    var dy0 = y - yb;
    
    //We'll be defining these inside the next block and using them afterwards.
    var dx_ext, dy_ext;
    var xsv_ext, ysv_ext;
    
    var value = 0;

    //Contribution (1,0)
    var dx1 = dx0 - 1 - SQUISH_CONSTANT_2D;
    var dy1 = dy0 - 0 - SQUISH_CONSTANT_2D;
    var attn1 = 2 - dx1 * dx1 - dy1 * dy1;
    if (attn1 > 0) {
        attn1 *= attn1;
        value += attn1 * attn1 * extrapolate(xsb + 1, ysb + 0, dx1, dy1);
    }

    //Contribution (0,1)
    var dx2 = dx0 - 0 - SQUISH_CONSTANT_2D;
    var dy2 = dy0 - 1 - SQUISH_CONSTANT_2D;
    var attn2 = 2 - dx2 * dx2 - dy2 * dy2;
    if (attn2 > 0) {
        attn2 *= attn2;
        value += attn2 * attn2 * extrapolate(xsb + 0, ysb + 1, dx2, dy2);
    }
    
    if (inSum <= 1) { //We're inside the triangle (2-Simplex) at (0,0)
        var zins = 1 - inSum;
        if (zins > xins || zins > yins) { //(0,0) is one of the closest two triangular vertices
            if (xins > yins) {
                xsv_ext = xsb + 1;
                ysv_ext = ysb - 1;
                dx_ext = dx0 - 1;
                dy_ext = dy0 + 1;
            } else {
                xsv_ext = xsb - 1;
                ysv_ext = ysb + 1;
                dx_ext = dx0 + 1;
                dy_ext = dy0 - 1;
            }
        } else { //(1,0) and (0,1) are the closest two vertices.
            xsv_ext = xsb + 1;
            ysv_ext = ysb + 1;
            dx_ext = dx0 - 1 - 2 * SQUISH_CONSTANT_2D;
            dy_ext = dy0 - 1 - 2 * SQUISH_CONSTANT_2D;
        }
    } else { //We're inside the triangle (2-Simplex) at (1,1)
        var zins = 2 - inSum;
        if (zins < xins || zins < yins) { //(0,0) is one of the closest two triangular vertices
            if (xins > yins) {
                xsv_ext = xsb + 2;
                ysv_ext = ysb + 0;
                dx_ext = dx0 - 2 - 2 * SQUISH_CONSTANT_2D;
                dy_ext = dy0 + 0 - 2 * SQUISH_CONSTANT_2D;
            } else {
                xsv_ext = xsb + 0;
                ysv_ext = ysb + 2;
                dx_ext = dx0 + 0 - 2 * SQUISH_CONSTANT_2D;
                dy_ext = dy0 - 2 - 2 * SQUISH_CONSTANT_2D;
            }
        } else { //(1,0) and (0,1) are the closest two vertices.
            dx_ext = dx0;
            dy_ext = dy0;
            xsv_ext = xsb;
            ysv_ext = ysb;
        }
        xsb += 1;
        ysb += 1;
        dx0 = dx0 - 1 - 2 * SQUISH_CONSTANT_2D;
        dy0 = dy0 - 1 - 2 * SQUISH_CONSTANT_2D;
    }
    
    //Contribution (0,0) or (1,1)
    var attn0 = 2 - dx0 * dx0 - dy0 * dy0;
    if (attn0 > 0) {
        attn0 *= attn0;
        value += attn0 * attn0 * extrapolate(xsb, ysb, dx0, dy0);
    }
    
    //Extra Vertex
    var attn_ext = 2 - dx_ext * dx_ext - dy_ext * dy_ext;
    if (attn_ext > 0) {
        attn_ext *= attn_ext;
        value += attn_ext * attn_ext * extrapolate(xsv_ext, ysv_ext, dx_ext, dy_ext);
    }
    
    return value / NORM_CONSTANT_2D;
}

//Gradients for 2D. They approximate the directions to the
//vertices of an octagon from the center.
var gradients2D = [
     5,  2,    2,  5,
    -5,  2,   -2,  5,
     5, -2,    2, -5,
    -5, -2,   -2, -5,
];

function extrapolate(xsb, ysb, dx, dy)
{
    var index = perm[(perm[xsb & 0xFF] + ysb) & 0xFF] & 0x0E;
    return gradients2D[index] * dx + gradients2D[index + 1] * dy;
}

function fastFloor(x) {
    var xi = parseInt(x);
    return x < xi ? xi - 1 : xi;
}
