const B = 0x100;
const BM = 0xff;

const N = 0x1000;
const NP = 12;   /* 2^N */
const NM = 0xfff;

var start = 1;

var seed = 1;
function random()
{
    seed = (seed * 0x5DEECE66D + 0xB) & ((1 << 48) - 1);
    return (seed >>> (40));
}

//tabla de gradientes
var g1 = [];
var g2 = [];
var g3 = [];
var p = [];

function normalize2(v)
{
	var s;

	s = Math.sqrt(v[0] * v[0] + v[1] * v[1]);
	v[0] = v[0] / s;
	v[1] = v[1] / s;
}

function normalize3(v)
{
	var s;

	s = Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
	v[0] = v[0] / s;
	v[1] = v[1] / s;
	v[2] = v[2] / s;
}

function init()
{
	var i, j, k;

	for (i = 0 ; i < B ; i++) {
		p[i] = i;

		g1[i] = (float)((random() % (B + B)) - B) / B;

		for (j = 0 ; j < 2 ; j++)
			g2[i][j] = (float)((random() % (B + B)) - B) / B;
		normalize2(g2[i]);

		for (j = 0 ; j < 3 ; j++)
			g3[i][j] = (float)((random() % (B + B)) - B) / B;
		normalize3(g3[i]);
	}

	while (--i) {
		k = p[i];
		p[i] = p[j = random() % B];
		p[j] = k;
	}

	for (i = 0 ; i < B + 2 ; i++) {
		p[B + i] = p[i];
		g1[B + i] = g1[i];
		for (j = 0 ; j < 2 ; j++)
			g2[B + i][j] = g2[i][j];
		for (j = 0 ; j < 3 ; j++)
			g3[B + i][j] = g3[i][j];
	}
}


function s_curve(t) { return ( t * t * (3. - 2. * t) ) }

function lerp(t, a, b) { return ( a + t * (b - a) ) }

function setup(i,b0,b1,r0,r1) {
	t = vec[i] + N;
	b0 = t & BM;
	b1 = (b0+1) & BM;
	r0 = t - t;
	r1 = r0 - 1;
}

function a(a) { a = 2 } ;
var b0 = 0;
console.log(b0);
a(b0);

console.log(b0);