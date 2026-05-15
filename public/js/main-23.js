import {Canvas} from './modules/canvas.js';
import {Object} from './modules/object.js';
import {rotateAxes, rotatePoints, multiplyMatrixVectors, multiplyMatrixVectors2, MMulti, RotateX, RotateY, RotateZ} from './modules/utils.js';

let docWidth = innerWidth;
let docHeight = innerHeight;

let objects = [];
let selected = 0;


let identityMatrix = [
    1, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, 1, 0,
    0, 0, 0, 1
];

let worldMatrix = [
    1, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, 1, 0,
    0, 0, 0, 1
];

//Projection Matrix
let a = docHeight / docWidth;//accept ratio
let theta = Math.PI / 3;
let fov = theta;
let f = 1 / (Math.tan(fov / 2));//field of view
let w = 1;

let zFar = 1000;
let zNear = .1;
let q = zFar / (zFar - zNear);

let projectionMatrix = [
    f, 0, 0, 0,
    0, f, 0, 0,
    0, 0, q, -zNear * q,
    0, 0, w, 0
]

let vCamera = [0, 0, 0];
let worldAxes = [
    1, 0, 0,
    0, 1, 0,
    0, 0, 1
]

function newRot(axe, rM) {
    let resultMatrix = rM;
    switch (axe) {
        case 0:
            resultMatrix = RotateX(rM, 5);
            break;
        case 1:
            resultMatrix = RotateY(rM, 5);
            break;
        case 2:
            resultMatrix = RotateZ(rM, 5);
            break;
    }
    return resultMatrix;
}

function worldRot(axe, rM, Phi) {
    let resultMatrix = rM;
    switch (axe) {
        case 0:
            resultMatrix = RotateX(rM, Phi);
            break;
        case 1:
            resultMatrix = RotateY(rM, Phi);
            break;
    }

    return resultMatrix;
}


function eventKeyDown(ev) {
    let keyPressed = String.fromCharCode(ev.keyCode);
    console.log("keypressed: " + keyPressed + "\n" + "ev.code: " + ev.code);
    let r = 0;
    let i = 0;
    let point = [];
    let M = [];
    //switch (ev.keyCode) {
    switch (ev.code) {
        case 'Digit1':
            selected = 0;
            break;
        case 'Digit2':
            selected = 1;
            break;
        case 'Digit3':
            selected = 2;
            break;
        case 'KeyX':
            //objects[selected].setRotationMatrix(0);
            objects[selected].rotMatrix4 = newRot(0, [...objects[selected].rotMatrix4]);
            update();
            break;
        case 'KeyY':
            //objects[selected].setRotationMatrix(1);
            objects[selected].rotMatrix4 = newRot(1, [...objects[selected].rotMatrix4]);
            update();
            break;
        case 'KeyZ':
            //objects[selected].setRotationMatrix(2);
            objects[selected].rotMatrix4 = newRot(2, [...objects[selected].rotMatrix4]);
            update();
            break;
        case 'ArrowLeft':
            //pijl naar link, kijken naar links
            //Wereld naar rechts
            worldMatrix = worldRot(1, [...worldMatrix], -5);
            update();
            break;
        case 'ArrowRight':
            //pijl naar rechts, kijken naar rechts
            //Wereld naar links
            worldMatrix = worldRot(1, [...worldMatrix], 5);
            update();
            break;
        case 'ArrowUp':
            //pijl/kijken naar boven,
            //Wereld naar onder
            worldMatrix = worldRot(0, [...worldMatrix], 5);
            update();
            break;
        case 'ArrowDown':
            //pijl/kijken naar beneden
            //Wereld naar boven
            worldMatrix = worldRot(0, [...worldMatrix], -5);
            update();
            break;
        //going left right up down in world
        case 'KeyA':
            //going left, world goes right
            let txr = worldMatrix[3];
            txr += .2;
            if (txr > 8) txr = 8;
            worldMatrix[3] = txr;
            update();
            break;

        case 'KeyD':
            //going right, world goes left
            let txl = worldMatrix[3];
            txl -= .2;
            if (txl < -8) txl = -8;
            worldMatrix[3] = txl;
            update();
            break;
        case 'KeyW':
            //going up, world goes down
            //cY goes up
            let txu = worldMatrix[7];
            txu -= .4;
            if (txu < -8) txu = -8;
            canvasTop.setCenter(canvasTop.cX, canvasTop.cY - 50);
            canvasGrid.setCenter(canvasGrid.cX, canvasGrid.Y - 50);
            canvasTop.horizon = canvasGrid.horizon = canvasTop.cY;
            worldMatrix[7] = txu;
            update();
            break;

        case 'KeyS':
            //going down, world goes up
            let txd = worldMatrix[7];
            txd += .4;
            if (txd > 0) txd = 0;
            canvasTop.setCenter(canvasTop.cX, canvasTop.cY + 40);
            canvasGrid.setCenter(canvasGrid.cX, canvasGrid.cY + 40);
            canvasTop.horizon = canvasGrid.horizon = canvasTop.cY;
            worldMatrix[7] = txd;
            update();
            break;
    }


}

function update() {
    //objects
    for (let i = 0; i < objects.length; i++) {
        objects[i].rotatedPoints = rotatePoints([...objects[i].points], [...objects[i].rotMatrix4], [...objects[i].center]);
        for (let j = 0; j < objects[i].rotatedPoints.length; j++) {
            objects[i].rotatedPoints[j][2] += objects[i].position[2];
            objects[i].rotatedPoints[j][1] += objects[i].position[1];
            objects[i].rotatedPoints[j][0] += objects[i].position[0];
        }
        //world

        objects[i].rotatedPoints = multiplyMatrixVectors([...objects[i].rotatedPoints], worldMatrix);
        objects[i].rotatedPoints = multiplyMatrixVectors([...objects[i].rotatedPoints], projectionMatrix);
        console.log('canvasGrid.horizon: ' + (canvasGrid.horizon) + "\nworldMatrix[7]: " + worldMatrix[7] + "\n");
    }


    canvasGrid.clearCanvas();
    canvasGrid.setBackground('#666');
    canvasGrid.drawGrid();
    canvasTop.clearCanvas();
    canvasTop.drawAxes(worldMatrix);
    objects.sort(function (a, b) {
        return b.position[2] - a.position[2]
    });

    for (let i = 0; i < 3; i++) {
        canvasTop.drawTriangleSides(objects[i].sides, objects[i].rotatedPoints, vCamera);
    }
}

function setup(){


    let lines = [];
    lines[0] = [[0, 100], [100, 100], [100, 0], [0, 0]]
    lines[1] = [[200, 100], [300, 100], [300, 0], [200, 0]];

//canvasTop.drawAxes(rotatedMatrix);




    let dumPoints = [[-1, -1, -1], [-1, 1, -1], [1, 1, -1], [1, -1, -1], [1, -1, 1], [1, 1, 1], [-1, 1, 1], [-1, -1, 1]];


    let sides = [[0, 1, 2], [0, 2, 3], [3, 2, 5], [3, 5, 4], [4, 5, 6], [4, 6, 7], [7, 6, 1], [7, 1, 0], [7, 0, 3], [7, 3, 4], [1, 6, 5], [1, 5, 2]];
    let colors = ['#ffff00', '#ffff00', '#880000', '#880000', '#ffff00', '#ffff00', '#880000', '#880000', '#008888', '#008888', '#008888', '#008888'];
    let rgbs = [[0, 0, 255], [0, 0, 255], [255, 0, 0], [255, 0, 0], [0, 0, 255], [0, 0, 255], [255, 0, 0], [255, 0, 0], [0, 255, 0], [0, 255, 0], [0, 255, 0], [0, 255, 0]];
    let rgbds = [[0, 0, 100], [0, 0, 100], [100, 0, 0], [100, 0, 0], [0, 0, 100], [0, 0, 100], [100, 0, 0], [100, 0, 0], [0, 100, 100], [0, 100, 100], [0, 100, 100], [0, 100, 100]];
    objects[0] = new Object('Box1', [0, 0, 0], [-10, 1, 10]);
    objects[1] = new Object('Box2', [0, 0, 0], [-2, 1, 15]);
    objects[2] = new Object('Box3', [0, 0, 0], [5, 1, 5]);
    for (let i = 0; i < objects.length; i++) {
        objects[i].points = [...dumPoints];
        let side = {};
        for (let s = 0; s < sides.length; s++) {
            side = {
                pointers: [...sides[s]],
                color: colors[s],
                rgb: rgbs[s],
                rgbd: rgbds[s]
            }

            objects[i].setSide(side);
        }
    }

    /*canvasTop.setCenter(canvasTop.cX, 700);
    canvasTop.setCenter(canvasTop.cX, 700);
    worldMatrix[7]=1.6;*/

    canvasTop.drawAxes(worldMatrix);
}
let canvasHorizon=0;
let nIntervalId;

function rotateObject() {
// check if already an interval has been set up
    if (!nIntervalId) {
        // nIntervalId = setInterval(rotateYaxes, 30);
        /* rotatedMatrix = [...defaultMatrix];
         rotatedMatrix = rotateAxes(2, Math.PI / 8, [...rotatedMatrix]);
         rotatedMatrix = rotateAxes(0, Math.PI / 6, [...rotatedMatrix]);*/

    }
}

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}


/* keyboard */
window.addEventListener('keydown', eventKeyDown, true);

// create the canvas and reporting list
let canvasTop = new Canvas('canvas-top', 'canvas-wrapper', docWidth, docHeight, docWidth / 2, docHeight, 100,1, '500');
canvasTop.create();

let canvasGrid = new Canvas('canvas-grid', 'canvas-wrapper', docWidth, docHeight, docWidth / 2,  docHeight, 100,1, '100');
canvasGrid.create();

setup();
update();
//canvasTop.drawLines(lines,'#ff0000');