import {Canvas} from './modules/Canvas.js';
import {Matrix} from './modules/Matrix.js';

let M = new Matrix;
let anim_fps = 1 / 60;
let anim_now;
let anim_then = Date.now();
let anim_interval = 1000 * anim_fps;
let anim_delta;

let docWidth = innerWidth;
let docHeight = innerHeight;
let canvasTop = new Canvas('canvas-top', 'canvas-wrapper', docWidth, docHeight, docWidth / 2, docHeight / 2, 100, 1, '500');
canvasTop.create();


let cube = [[-1, -1, -1], [-1, 1, -1], [1, -1, -1], [1, 1, -1], [1, -1, 1], [1, 1, 1], [-1, -1, 1], [-1, 1, 1],];


let dumCube = [...cube];

let cp = [[0, 1, 3, 2], [2, 3, 5, 4], [4, 5, 7, 6], [6, 7, 1, 0], [1, 7, 5, 3], [6, 0, 2, 4]];
let colors = ['#ff0000', '#ffff00', '#ff0000', '#ffff00', '#00ffff', '#00ffff'];

let cubePosition = [3, 1.5, 2];

let rotations = [0, 0, 0];
let sScale = 200;
let pM = M.m_eye();

let spring = {
    angle: 0, r: 20, rs: 0, angleV: Math.PI / 30, aVD: 30, y: 0,
}
let H = 0;
let HS = 5;
let r0, r1, r2 = 0;
let rA = 0;
let rotM = M.m_eye();
let transM=M.m_make_translate(cubePosition[0],cubePosition[1],cubePosition[2]);

function update() {

    /* dumCube = [...dumCube];
     pM=M.m_eye();
     let mZ= M.m_make_rz(5);
     let mY= M.m_make_ry(5);
     let mX= M.m_make_rx(5);
     pM=m_mul_m(mZ,pM);
     pM=m_mul_m(mY,pM);
     pM=m_mul_m(mX,pM);
     switch(rA){
         case 0:
             rotM=mX;
             break;
         case 1:
             rotM=mY;
             break;
         case 2:
             rotM=mZ;
             break;
     }*/
    rotM=M.m_mul_m(rotM,transM);
    console.table(rotM)
    dumCube = rotatePoints([...cube], rotM);
    //  console.table(dumCube);
    draw();
}

function spring_anim() {
    spring.angle += spring.angleV;
    spring.r = 20;
    spring.y = spring.rs * Math.sin(spring.angle);
    if (spring.angle > Math.PI * 2) {
        update_spring_anim();
    }
}

function update_spring_anim() {
    spring.rs *= .98;
    //spring.aVD+=spring.rs;
    spring.angleV = Math.PI / (spring.aVD + spring.rs);
    spring.angle -= (Math.PI * 2);
    if (spring.rs < 1) {
        //spring.rs=100+Math.ceil(Math.random()*200);
        spring.aVD = 5 + Math.random() * 15;
        spring.rs = 2 + Math.ceil(Math.random() * 4);
    }
}

function draw() {
    // canvasTop.drawRectangle(0,0,100, 100, "#ff0000");
    canvasTop.clearCanvas();
    //canvasTop.drawCircle(0, spring.y * 50, spring.r, "#ff0000");
    drawCube(dumCube, cp, colors);
    //canvasTop.drawTriangleSides(cT,dumCube,vCam);
}

function setup() {
    canvasTop.setBackground("#000000");
    update_spring_anim();
    update();

}

function animate() {

    requestAnimationFrame(animate);

    anim_now = Date.now();
    anim_delta = anim_now - anim_then;

    if (anim_delta > anim_interval) {
        anim_then = anim_now - (anim_delta % anim_interval);
        //real anim

        update();
    }
}

setup();
//animate();

//matrix

function rotateAxes_org(axe, rot, rotM) {
    let rM = [];
    let v1 = 0;
    let v2 = 0;
    rM[0] = [rotM[0][0], rotM[1][0], rotM[2][0]];
    rM[1] = [rotM[0][1], rotM[1][1], rotM[2][1]];
    rM[2] = [rotM[0][2], rotM[1][2], rotM[2][2]];

    switch (axe) {
        case 0:
            v1 = 2;
            v2 = 1;
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

    rotM = [[rM[0][0], rM[1][0], rM[2][0]], [rM[0][1], rM[1][1], rM[2][1]], [rM[0][2], rM[1][2], rM[2][2]]];
    return rotM;
}

function rotateAxes(axe, rot, rotM) {
    rot = (rot * 180.0) / Math.PI;
    let dRM;
    let result;
    switch (axe) {
        case 0:
            dRM = M.m_make_rx(rot);
            break;
        case 1:
            dRM = M.m_make_ry(rot);
            break;
        case 2:
            dRM = M.m_make_rz(rot);
            break;
    }
    result = M.m_mul_m(rotM, dRM);
    return result;
}

function rotateAxes_changed(axe, rot, rotM) {
    let rM = [];
    let v1 = 0;
    let v2 = 0;

    let dumV1 = [];
    let dumV2 = [];

    let cos = Math.cos(rot);
    let sin = Math.sin(rot);
    rot = (rot * 180.0) / Math.PI;
    rM = [...rotM];
    /*
      rM[0] = [rotM[0][0], rotM[1][0], rotM[2][0]];
      rM[1] = [rotM[0][1], rotM[1][1], rotM[2][1]];
      rM[2] = [rotM[0][2], rotM[1][2], rotM[2][2]];*/
    let dRM = M.m_eye();
    let result = M.m_eye();
    switch (axe) {
        case 0:
            v1 = 2;
            v2 = 1;
            /*   dRM[1][1]=cos;
               dRM[1][2]=-sin;
               dRM[2][1]=sin;
               dRM[2][2]=cos;*/

            dRM = M.m_make_rx(rot);
            //x-as rond y en z
            dumV1[0] = cos * rM[2][0] - sin * rM[1][0];
            dumV1[1] = cos * rM[2][1] - sin * rM[1][1];
            dumV1[2] = cos * rM[2][2] - sin * rM[1][2];
            //x-as over y en z
            dumV2[0] = sin * rM[2][0] + cos * rM[1][0];
            dumV2[1] = sin * rM[2][1] + cos * rM[1][1];
            dumV2[2] = sin * rM[2][2] + cos * rM[1][2];
            break;
        case 1:
            v1 = 0;
            v2 = 2;
            /*    dRM[0][0]=cos;
                dRM[0][2]=sin;
                dRM[2][0]=-sin;
                dRM[2][2]=cos;*/
            dRM = M.m_make_ry(rot);

            //y-as rond x en z
            dumV1[0] = cos * rM[0][0] - sin * rM[2][0];
            dumV1[1] = cos * rM[0][1] - sin * rM[2][1];
            dumV1[2] = cos * rM[0][2] - sin * rM[2][2];
            //y-as over x e  z
            dumV2[0] = sin * rM[0][0] + cos * rM[2][0];
            dumV2[1] = sin * rM[0][1] + cos * rM[2][1];
            dumV2[2] = sin * rM[0][2] + cos * rM[2][2];

            break;
        case 2:
            v1 = 1;
            v2 = 0;
            /*  dRM[0][0]=cos;
              dRM[0][1]=-sin;
              dRM[1][0]=sin;
              dRM[1][1]=cos;*/
            dRM = M.m_make_rz(rot);

            //z-as rond x en uy
            dumV1[0] = cos * rM[1][0] - sin * rM[0][0];
            dumV1[1] = cos * rM[1][1] - sin * rM[0][1];
            dumV1[2] = cos * rM[1][2] - sin * rM[0][2]

            //z-as over x en y
            dumV2[0] = sin * rM[1][0] + cos * rM[0][0];
            dumV2[1] = sin * rM[1][1] + cos * rM[0][1];
            dumV2[2] = sin * rM[1][2] + cos * rM[0][2];

            break;
    }

    rM[v1] = dumV1;
    rM[v2] = dumV2

    rotM = [
        [rM[0][0], rM[1][0], rM[2][0]],
        [rM[0][1], rM[1][1], rM[2][1]],
        [rM[0][2], rM[1][2], rM[2][2]]
    ]
    //  *-******************************************-*];

    //return rotM;
    console.log("result en dRM:\n");
    console.table(result);
    return result;
}


function interaction(axe = 1) {
    let r = .1;
    canvasTop.clearCanvas();
    //canvasTop.drawAxes(rotatedMatrix);
    if (axe >= 0) rotM = rotateAxes(axe, r, [...rotM]);
//    rotatedPoints = rotatePoints([...points], [...rotMatrix], [...center]);
    /*
        for (let i = 0; i < rotatedPoints.length; i++) {
            rotatedPoints[i][2] += center[2];
            rotatedPoints[i][1] += center[1];
            rotatedPoints[i][0] += center[0];
        }
    */
    // rotatedPoints = multiplyMatrix([...rotatedPoints], projectionMatrix);
    // canvasTop.drawTriangleSides(Box1.sides, Box1.rotatedPoints, vCamera);
}

function rotatePoints(points = [], rotM) {
    let i = 0;
    let dumP = [];
    let p = [];


    for (i = 0; i < points.length; i++) {
        p = points[i];

        dumP[i] = [];
        dumP[i][0] = p[0] * rotM[0][0] + p[1] * rotM[0][1] + p[2] * rotM[0][2]+rotM[0][3];
        dumP[i][1] = p[0] * rotM[1][0] + p[1] * rotM[1][1] + p[2] * rotM[1][2]+rotM[1][3];
        dumP[i][2] = p[0] * rotM[2][0] + p[1] * rotM[2][1] + p[2] * rotM[2][2]+rotM[2][3];

    }

    return dumP;
}

let selected = 0;

function drawCube(points = [], pointers = [], colors = []) {
    let l = pointers.length;
    let pl = points.length;
    let cS = canvasTop.scale;
    let s = cS;
    //canvasTop.ctx.fillStyle="#ff0000";
    canvasTop.ctx.strokeStyle = "#ff0000";
    for (let i = 0; i < l; i++) {

        let a = v3_sub(points[pointers[i][0]], points[pointers[i][1]]);
        let b = v3_sub(points[pointers[i][0]], points[pointers[i][2]]);

        let c = v3_cross(a, b);
        if (c[2] < 0) {
            canvasTop.ctx.beginPath();
            s = 1 + points[pointers[i][0]][2] / 2;
            s = cS;
            canvasTop.ctx.moveTo(points[pointers[i][0]][0] * s, points[pointers[i][0]][1] * s);

            for (let j = 1; j < pointers[i].length; j++) {
                s = 1 + points[pointers[i][j]][2] / 2;
                s = cS;
                canvasTop.ctx.lineTo(points[pointers[i][j]][0] * s, points[pointers[i][j]][1] * s);

            }
            canvasTop.ctx.fillStyle = colors[i];
            canvasTop.ctx.closePath();
            canvasTop.ctx.fill()
            canvasTop.ctx.stroke();
        }
    }
}

function v3_sub(a = [], b = []) {
    let r = [];
    r[0] = a[0] - b[0];
    r[1] = a[1] - b[1];
    r[2] = a[2] - b[2];


    return r;
}

function v3_cross(a, b) {
    let result = [0, 0, 0];

    result[0] = a[1] * b[2] - a[2] * b[1];
    result[1] = a[2] * b[0] - a[0] * b[2];
    result[2] = a[0] * b[1] - a[1] * b[0];
    //z = a.x * b.y - a.y * b.x
    return result;
}

function eventKeyDown(ev) {
    let keyPressed = String.fromCharCode(ev.keyCode);
    let r = 0.1;
    let i = 0;
    let point = [];
    let M = [];
    //switch (ev.keyCode) {
    let num = parseInt(keyPressed) - 1;
    if (num > 0 && num < 10) {
        selected = num;
    }

    switch (ev.code) {

        case 'KeyX':
            //objects[selected].setRotationMatrix(0);
            /* rotations[0] += 2;
             if (rotations[0] > 360) rotations[0] -= 360;
             rA=0;*/
            rotM = rotateAxes(0, r, [...rotM]);
            console.log("key X");
            update();
            break;
        case 'KeyY':
            /*  rotations[1] += 2;
              if (rotations[1] > 360) rotations[1] -= 360;
              rA=1;*/
            rotM = rotateAxes(1, r, [...rotM]);
            console.log("key Y");

            update();
            break;
        case 'KeyZ':
            /*     rotations[2] += 2;
                 if (rotations[2] > 360) rotations[2] -= 360;
                 rA=2;*/
            rotM = rotateAxes(2, r, [...rotM]);
            console.log("key Z");
            update();
            break;


        default:
            break;


    }


}

function m_mul_m(m1, m2) {
    let m = M.m_eye();
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            m[i][j] = m1[i][0] * m2[0][j] + m1[i][1] * m2[1][j] + m1[i][2] * m2[2][j] + m1[i][3] * m2[3][j];
        }
    }
    return m;
}

function resizeCanvas() {
    let w = innerWidth;
    let h = innerHeight;
    let cx = w / 2;
    let cy = h / 2;
    canvasTop.resizeCanvas(w, h, cx, cy);
    update();
}

window.addEventListener('keydown', eventKeyDown, true);
window.addEventListener('resize', resizeCanvas, false);