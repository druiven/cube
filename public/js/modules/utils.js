/**
 *
 * @param axe - index of rotation vector
 * @param rot - rotation radius of index vector
 * @param rotM - rotation Matrix
 */


function rotateAxes(axe, rot, rotM) {
    let rM = [];
    let v1 = 0;
    let v2 = 0;
    rM[0] = [rotM[0], rotM[4], rotM[8]];
    rM[1] = [rotM[1], rotM[5], rotM[9]];
    rM[2] = [rotM[2], rotM[6], rotM[10]];
    /*rM[0] = [rotM[0], rotM[1], rotM[2]];
    rM[1] = [rotM[3], rotM[4], rotM[5]];
    rM[2] = [rotM[6], rotM[7], rotM[8]];*/
    switch (axe) {
        case 0:
            v1 = 1;
            v2 = 2;
            break;
        case 1:
            v1 = 0;
            v2 = 2;
            break;
        case 2:
            v1 = 1;
            v2 = 0;
            break;
    }
    let cos = Math.cos(rot);
    let sin = Math.sin(rot);

    let dumV1 = [];
    let dumV2 = [];

    dumV1[0] = cos * rM[v1][0] - sin * rM[v2][0];
    dumV1[1] = cos * rM[v1][1] - sin * rM[v2][1];
    dumV1[2] = cos * rM[v1][2] - sin * rM[v2][2];

    dumV2[0] = cos * rM[v2][0] + sin * rM[v1][0];
    dumV2[1] = cos * rM[v2][1] + sin * rM[v1][1];
    dumV2[2] = cos * rM[v2][2] + sin * rM[v1][2];

    rM[v1] = dumV1;
    rM[v2] = dumV2

    rotM = [
        rM[0][0], rM[1][0], rM[2][0], 0,
        rM[0][1], rM[1][1], rM[2][1], 0,
        rM[0][2], rM[1][2], rM[2][2], 0,
        0, 0, 0, 1

    ];
    return rotM;
}

function rotatePoints(points = [], rotM) {
    let i = 0;
    let dumP = [];
    let p = [];


    for (i = 0; i < points.length; i++) {
        p = points[i];

        dumP[i] = [];
        dumP[i][0] = p[0] * rotM[0][0] + p[1] * rotM[0][1] + p[2] * rotM[0][2];
        dumP[i][1] = p[0] * rotM[1][0] + p[1] * rotM[1][1] + p[2] * rotM[1][2];
        dumP[i][2] = p[0] * rotM[2][0] + p[1] * rotM[2][1] + p[2] * rotM[2][2];
    }

    return dumP;
}


function multiplyMatrixVectors(p = [], m) {
    let dumPoints = [];
    let w = 0;
    /*        let projectionMatrix = [

        f, 0, 0, 0,
        0, f, 0, 0,
        0, 0, q, -zNear * q,
        0, 0, 1, 0
    ]

    * */
    for (let i = 0; i < p.length; i++) {
        dumPoints[i] = [];
        dumPoints[i][0] = p[i][0] * m[0][0] + p[i][1] * m[0][1] + p[i][2] * m[0][2] + m[0][3];
        dumPoints[i][1] = p[i][0] * m[1][0] + p[i][1] * m[1][1] + p[i][2] * m[1][2] + m[1][3];
        dumPoints[i][2] = p[i][0] * m[2][0] + p[i][1] * m[2][1] + p[i][2] * m[2][2] + m[2][3];

     /*   dumPoints[i][0] = m[0][0] * p[i][0] + m[1][0] * p[i][1] + m[2][0] * p[i][2]+m[0][3];
        dumPoints[i][1] = m[0][1] * p[i][0] + m[1][1] * p[i][1] + m[2][1] * p[i][2]+m[1][3];
        dumPoints[i][2] = m[0][2] * p[i][0] + m[1][2] * p[i][1] + m[2][2] * p[i][2]+m[2][3];*/
        
        w = p[i][0] * m[3][0] + p[i][1] * m[3][1] + p[i][2] * m[3][2] + m[3][3];
        /*
        w > 0 if matrix is projection matrix and m[14] is 1
        then w == z (<- po[i][2])
        */
        if (w !== 0) {
            for (let j = 0; j < 3; j++) {
                dumPoints[i][j] /= w;
            }
        }
    }
    return dumPoints;
}

function multiplyVectorsCamera(p = [], m = []) {
    let dumPoints = [];
    let w = 0;

    for (let i = 0; i < p.length; i++) {
        dumPoints[i] = [];
        dumPoints[i][0] = p[i][0] * m[0] + p[i][1] * m[1] + p[i][2] * m[2];
        dumPoints[i][1] = p[i][0] * m[4] + p[i][1] * m[5] + p[i][2] * m[6];
        dumPoints[i][2] = p[i][0] * m[8] + p[i][1] * m[9] + p[i][2] * m[10];

    }
    return dumPoints;
}


// multiplies two matrices
function MMulti1(M1, M2) {
    let M = [];
    for (let i = 0; i < 4; i++) {
        M[i * 4] = M1[i * 4] * M2[0] + M1[i * 4 + 1] * M2[4] + M1[i * 4 + 2] * M2[8] + M1[i * 4 + 3] * M2[12];
        M[i * 4 + 1] = M1[i * 4] * M2[1] + M1[i * 4 + 1] * M2[5] + M1[i * 4 + 2] * M2[9] + M1[i * 4 + 3] * M2[13];
        M[i * 4 + 2] = M1[i * 4] * M2[2] + M1[i * 4 + 1] * M2[6] + M1[i * 4 + 2] * M2[10] + M1[i * 4 + 3] * M2[14];
        M[i * 4 + 3] = M1[i * 4] * M2[3] + M1[i * 4 + 1] * M2[7] + M1[i * 4 + 2] * M2[11] + M1[i * 4 + 3] * M2[15];
    }
    return M;
}

function MMulti(m1, m2) {
    let m = [
        [1, 0, 0, 0],
        [0, 1, 0, 0],
        [0, 0, 1, 0],
        [0, 0, 0, 1]
    ];//this.m_eye();
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            m[i][j] = m1[i][0] * m2[0][j] + m1[i][1] * m2[1][j] + m1[i][2] * m2[2][j] + m1[i][3] * m2[3][j];
        }
    }
    return m;
}

function Translate(M, Dx, Dy, Dz) {
    let T = [
        [1, 0, 0, Dx],
        [0, 1, 0, Dy],
        [0, 0, 1, Dz],
        [0, 0, 0, 1]
    ];
    return MMulti(T, M);
}

function TranslateV(V, Dx, Dy, Dz) {
    V[0] += Dx;
    V[1] += Dy;
    V[2] += Dz;
    return V;
}


function RotateX(M, Phi) {
    let a = Phi;
    a *= Math.PI / 180;
    let Cos = Math.cos(a);
    let Sin = Math.sin(a);
    let dumm = [];
    let R = [
        [1, 0, 0, 0],
        [0, Cos, -Sin, 0],
        [0, Sin, Cos, 0],
        [0, 0, 0, 1]
    ];
    let dm = MMulti( M,R);
    return dm;
}

function RotateY(M, Phi) {
    let a = Phi;
    a *= Math.PI / 180;
    let Cos = Math.cos(a);
    let Sin = Math.sin(a);
    let R = [
        [Cos, 0, Sin, 0],
        [0, 1, 0, 0],
        [-Sin, 0, Cos, 0],
        [0, 0, 0, 1]
    ];
    let dm = MMulti(R, M);
    return dm;
}

function RotateZ(M, Phi) {
    let a = Phi;
    a *= Math.PI / 180;
    let Cos = Math.cos(a);
    let Sin = Math.sin(a);
    let R = [
        [Cos, -Sin, 0, 0],
        [Sin, Cos, 0, 0],
        [0, 0, 1, 0],
        [0, 0, 0, 1]
    ];
    let dm = MMulti(R, M);
    return dm;
}


function multiplyMatrixVectors2(M, vM) {
    /*
     dumPoints[0] = Box1.center[0] * rotatedMatrix[0] + Box1.center[1] * rotatedMatrix[3] + Box1.center[2] * rotatedMatrix[6];
     dumPoints[1] = Box1.center[0] * rotatedMatrix[1] + Box1.center[1] * rotatedMatrix[4] + Box1.center[2] * rotatedMatrix[7];
     dumPoints[2] = Box1.center[0] * rotatedMatrix[2] + Box1.center[1] * rotatedMatrix[5] + Box1.center[2] * rotatedMatrix[8];
     */
    let vecM = [];
    //
    /* vecM[0] = vM[0] * M[0] + vM[1] * M[1] + vM[2] * M[2];
     vecM[1] = vM[0] * M[3] + vM[1] * M[4] + vM[2] * M[5];
     vecM[2] = vM[0] * M[6] + vM[1] * M[7] + vM[2] * M[8];
 */
    vecM[0] = vM[0] * M[0] + vM[1] * M[4] + vM[2] * M[8] + vM[3] * M[12];
    vecM[1] = vM[0] * M[1] + vM[1] * M[5] + vM[2] * M[9] + vM[3] * M[13];
    vecM[2] = vM[0] * M[2] + vM[1] * M[6] + vM[2] * M[10] + vM[3] * M[14];
    vecM[3] = vM[0] * M[3] + vM[1] * M[7] + vM[2] * M[11] + vM[3] * M[15]

    return vecM;
}

function matrixInverse(m) {
    let r = [
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1
    ];

    r[0] = m[5] * m[10] * m[15] - m[5] * m[14] * m[11] - m[6] * m[9] * m[15] + m[6] * m[13] * m[11] + m[7] * m[9] * m[14] - m[7] * m[13] * m[10];
    r[1] = -m[1] * m[10] * m[15] + m[1] * m[14] * m[11] + m[2] * m[9] * m[15] - m[2] * m[13] * m[11] - m[3] * m[9] * m[14] + m[3] * m[13] * m[10];
    r[2] = m[1] * m[6] * m[15] - m[1] * m[14] * m[7] - m[2] * m[5] * m[15] + m[2] * m[13] * m[7] + m[3] * m[5] * m[14] - m[3] * m[13] * m[6];
    r[3] = -m[1] * m[6] * m[11] + m[1] * m[10] * m[7] + m[2] * m[5] * m[11] - m[2] * m[9] * m[7] - m[3] * m[5] * m[10] + m[3] * m[9] * m[6];

    r[4] = -m[4] * m[10] * m[15] + m[4] * m[14] * m[11] + m[6] * m[8] * m[15] - m[6] * m[12] * m[11] - m[7] * m[8] * m[14] + m[7] * m[12] * m[10];
    r[5] = m[0] * m[10] * m[15] - m[0] * m[14] * m[11] - m[2] * m[8] * m[15] + m[2] * m[12] * m[11] + m[3] * m[8] * m[14] - m[3] * m[12] * m[10];
    r[6] = -m[0] * m[6] * m[15] + m[0] * m[14] * m[7] + m[2] * m[4] * m[15] - m[2] * m[12] * m[7] - m[3] * m[4] * m[14] + m[3] * m[12] * m[6];
    r[7] = m[0] * m[6] * m[11] - m[0] * m[10] * m[7] - m[2] * m[4] * m[11] + m[2] * m[8] * m[7] + m[3] * m[4] * m[10] - m[3] * m[8] * m[6];

    r[8] = m[4] * m[9] * m[15] - m[4] * m[13] * m[11] - m[5] * m[8] * m[15] + m[5] * m[12] * m[11] + m[7] * m[8] * m[13] - m[7] * m[12] * m[9];
    r[9] = -m[0] * m[9] * m[15] + m[0] * m[13] * m[11] + m[1] * m[8] * m[15] - m[1] * m[12] * m[11] - m[3] * m[8] * m[13] + m[3] * m[12] * m[9];
    r[10] = m[0] * m[5] * m[15] - m[0] * m[13] * m[7] - m[1] * m[4] * m[15] + m[1] * m[12] * m[7] + m[3] * m[4] * m[13] - m[3] * m[12] * m[5];
    r[11] = -m[0] * m[5] * m[11] + m[0] * m[9] * m[7] + m[1] * m[4] * m[11] - m[1] * m[8] * m[7] - m[3] * m[4] * m[9] + m[3] * m[8] * m[5];

    r[12] = -m[4] * m[9] * m[14] + m[4] * m[13] * m[10] + m[5] * m[8] * m[14] - m[5] * m[12] * m[10] - m[6] * m[8] * m[13] + m[6] * m[12] * m[9];
    r[13] = m[0] * m[9] * m[14] - m[0] * m[13] * m[10] - m[1] * m[8] * m[14] + m[1] * m[12] * m[10] + m[2] * m[8] * m[13] - m[2] * m[12] * m[9];
    r[14] = -m[0] * m[5] * m[14] + m[0] * m[13] * m[6] + m[1] * m[4] * m[14] - m[1] * m[12] * m[6] - m[2] * m[4] * m[13] + m[2] * m[12] * m[5];
    r[15] = m[0] * m[5] * m[10] - m[0] * m[9] * m[6] - m[1] * m[4] * m[10] + m[1] * m[8] * m[6] + m[2] * m[4] * m[9] - m[2] * m[8] * m[5];

    let det = m[0] * r[0] + m[1] * r[4] + m[2] * r[8] + m[3] * r[12];
    for (let i = 0; i < 16; i++) r[i] /= det;
    return r;
}

function degToRad(d) {
    return d * Math.PI / 180;
}

export {rotateAxes, rotatePoints, multiplyMatrixVectors, multiplyMatrixVectors2, MMulti, Translate, RotateX, RotateY, RotateZ, degToRad, TranslateV, multiplyVectorsCamera};