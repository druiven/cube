import {Canvas} from './modules/canvas.js';
import {Object} from './modules/object.js';
import {Group} from './modules/group.js';
import {rotateAxes, rotatePoints, multiplyMatrixVectors, multiplyMatrixVectors2, MMulti,Translate, RotateX, RotateY, RotateZ, degToRad, TranslateV, multiplyVectorsCamera} from './modules/utils.js';

let docWidth = innerWidth;
let docHeight = innerHeight;

let maxObj = 10;
let selected = 0;
let Cubes=new Group();


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

let zFar = 10000;
let zNear = .1;
let q = zFar / (zFar - zNear);

let projectionMatrix = [
    f, 0, 0, 0,
    0, f, 0, 0,
    0, 0, q, -zNear * q,
    0, 0, w, 0
]

let vCamera = [...identityMatrix];
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
            // rM=Translate([...rM],rM[3],rM[7],rM[11]);
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
    let num = parseInt(keyPressed) - 1;
    if (num > 0 && num < 10) {
        selected = num;
    }

    switch (ev.code) {
        /*case 'Digit1':
            selected = 0;
            break;
        case 'Digit2':
            selected = 1;
            break;
        case 'Digit3':
            selected = 2;
            break;*/
        case 'KeyX':
            //objects[selected].setRotationMatrix(0);
            Cubes.objects[selected].rotMatrix4 = newRot(0, [...objects[selected].rotMatrix4]);
            update();
            break;
        case 'KeyY':
            //objects[selected].setRotationMatrix(1);
            Cubes.objects[selected].rotMatrix4 = newRot(1, [...objects[selected].rotMatrix4]);
            update();
            break;
        case 'KeyZ':
            //objects[selected].setRotationMatrix(2);
            update();
            break;
        case 'ArrowLeft':
            //pijl naar link, kijken naar links
            //Wereld naar rechts
            worldMatrix = worldRot(1, [...worldMatrix], +1);

            update();
            break;
        case 'ArrowRight':
            //pijl naar rechts, kijken naar rechts
            //Wereld naar links
            worldMatrix = worldRot(1, [...worldMatrix], -1);

            update();
            break;
        case 'ArrowUp':
            //going up, world goes down
            //cY goes up
            let txu = worldMatrix[7];
            txu -= .4;
            if (txu < -8) {
                txu += -.4;
            } else {
                canvasTop.setCenter(canvasTop.cX, canvasTop.cY - 50);
                canvasGrid.setCenter(canvasGrid.cX, canvasGrid.cY - 50);
                canvasTop.horizon = canvasGrid.horizon = canvasTop.cY;
                worldMatrix[7] = txu;

                update();
            }

            break;

        case 'ArrowDown':
            //going down, world goes up
            let txd = worldMatrix[7];
            txd += .4;
            if (txd > 0) {
                txd -= .4;
            } else {
                canvasTop.setCenter(canvasTop.cX, canvasTop.cY + 50);
                canvasGrid.setCenter(canvasGrid.cX, canvasGrid.cY + 50);
                canvasTop.horizon = canvasGrid.horizon = canvasTop.cY;
                worldMatrix[7] = txd;

                update();
            }


            break;
        case 'KeyA':
            //going left, world goes right
            let txr = worldMatrix[3];
            txr += .2;
            if (txr > 15) txr = 15;
            worldMatrix[3] = txr;

            update();
            break;

        case 'KeyD':
            //going right, world goes left
            let txl = worldMatrix[3];
            txl -= .2;
            if (txl < -15) txl = -15;
            worldMatrix[3] = txl;

            update();
            break;
        case 'KeyS':
            //going forwards, world goes to screen
            let txf = worldMatrix[11];
            txf += .2;
            if (txf > 50) txf = 50;
            worldMatrix[11] = txf;
            update();
            break;
        case 'KeyW':
            //going down, world goes up.
            let txb = worldMatrix[11];
            txb -= .2;
            if (txb < -50) txb = -50;
            worldMatrix[11] = txb;

            update();
            break;
    }


}

function animateCubes(){
    for (let i = 0; i < Cubes.objects.length; i++) {
        Cubes.objects[i].anim.deg += Cubes.objects[i].anim.step;
        if (Cubes.objects[i].anim.deg > 180) Cubes.objects[i].anim.deg -= 180
        let num1 = Cubes.objects[i].position[0];
        let num2 = 1 + 5 * Math.sin(degToRad(Cubes.objects[i].anim.deg));
        let num3 =Cubes.objects[i].position[2];
        Cubes.objects[i].position=[num1, num2, num3];
        //Cubes.objects[i].position[0] = 1 + 5 * Math.sin(degToRad(Cubes.objects[i].anim.deg));
        Cubes.objects[i].rotMatrix4 = RotateY([...Cubes.objects[i].rotMatrix4], Cubes.objects[i].anim.step);
    }

}
function update() {
    let groupMatrix=[...identityMatrix];
    groupMatrix=newRot(1, [...Cubes.groupMatrix],1);

    console.log(groupMatrix);
    //objects
    let positions = [];
    let v = [];
    let vv = [];
    //animateCubes();
    maxObj=Cubes.objects.length;
    Cubes.rotatedPosition[0]=Cubes.position;
    Cubes.rotatedPosition = multiplyMatrixVectors([...Cubes.rotatedPosition], worldMatrix);
    Cubes.groupMatrix[3]= Cubes.rotatedPosition[0][0];
    Cubes.groupMatrix[7]= Cubes.rotatedPosition[0][1];
    Cubes.groupMatrix[11]= Cubes.rotatedPosition[0][2];
    for (let i = 0; i < maxObj; i++) {
        Cubes.objects[i].rotatedPosition[0] = Cubes.objects[i].position;
        Cubes.objects[i].rotatedPoints = rotatePoints([...Cubes.objects[i].points], [...Cubes.objects[i].rotMatrix4]);
        Cubes.objects[i].rotatedPosition = multiplyMatrixVectors([...Cubes.objects[i].rotatedPosition], Cubes.groupMatrix);
        for (let j = 0; j < Cubes.objects[i].rotatedPoints.length; j++) {
            v = [...Cubes.objects[i].rotatedPoints[j]];
            vv = [...Cubes.objects[i].position];
            v[2] += vv[2];
            v[1] += vv[1];
            v[0] += vv[0];

            /*v[2] += vv[2]+Cubes.rotatedPosition[0][2];
            v[1] += vv[1]+Cubes.rotatedPosition[0][1];
            v[0] += vv[0]+Cubes.rotatedPosition[0][0];*/
            Cubes.objects[i].rotatedPoints[j] = v;
        }

        //objects[i].rotatedPoints = multiplyVectorsCamera([...objects[i].rotatedPoints], worldMatrix);
        Cubes.objects[i].rotatedPoints = multiplyMatrixVectors([...Cubes.objects[i].rotatedPoints], Cubes.groupMatrix);
        Cubes.objects[i].rotatedPosition = multiplyMatrixVectors([...Cubes.objects[i].rotatedPosition], Cubes.groupMatrix);
        Cubes.objects[i].rotatedPoints = multiplyMatrixVectors([...Cubes.objects[i].rotatedPoints], projectionMatrix);
    }
    Cubes.objects.sort(function (a, b) {
        return b.rotatedPosition[0][2] - a.rotatedPosition[0][2];
    });
    canvasGrid.clearCanvas();
    canvasGrid.setBackground('#83c6ff');
    canvasGrid.drawRectangle(-canvasGrid.cX, 0, canvasGrid.width, canvasGrid.height - canvasGrid.horizon, '#007025');
    canvasGrid.drawGrid();
    canvasTop.clearCanvas();
    // canvasTop.drawAxes(worldMatrix);

    for (let i = 0; i < maxObj; i++) {
        let z = Cubes.objects[i].rotatedPosition[0][2];
        if (z > 1.5) {
            canvasTop.drawTriangleSides(Cubes.objects[i].triangles, Cubes.objects[i].rotatedPoints, vCamera);
        }
    }
}

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}


/* keyboard */
window.addEventListener('keydown', eventKeyDown, true);

// create the canvas and reporting list
let canvasTop = new Canvas('canvas-top', 'canvas-wrapper', docWidth, docHeight, docWidth / 2, docHeight, 300, 1, '500');
canvasTop.create();

let canvasGrid = new Canvas('canvas-grid', 'canvas-wrapper', docWidth, docHeight, docWidth / 2, docHeight, 300, 1, '100');
canvasGrid.create();


function setup() {
    let lines = [];
    lines[0] = [[0, 100], [100, 100], [100, 0], [0, 0]]
    lines[1] = [[200, 100], [300, 100], [300, 0], [200, 0]];

    let boxPoints = [[-1, -1, -1], [-1, 1, -1], [1, 1, -1], [1, -1, -1], [1, -1, 1], [1, 1, 1], [-1, 1, 1], [-1, -1, 1]];
    let triangles = [[0, 1, 2], [0, 2, 3], [3, 2, 5], [3, 5, 4], [4, 5, 6], [4, 6, 7], [7, 6, 1], [7, 1, 0], [7, 0, 3], [7, 3, 4], [1, 6, 5], [1, 5, 2]];
    let colors = ['#ffff00', '#ffff00', '#880000', '#880000', '#ffff00', '#ffff00', '#880000', '#880000', '#008888', '#008888', '#008888', '#008888'];
    let rgbs = [[0, 0, 255], [0, 0, 255], [255, 0, 0], [255, 0, 0], [0, 0, 255], [0, 0, 255], [255, 0, 0], [255, 0, 0], [0, 255, 0], [0, 255, 0], [0, 255, 0], [0, 255, 0]];
    let rgbds = [[0, 0, 100], [0, 0, 100], [100, 0, 0], [100, 0, 0], [0, 0, 100], [0, 0, 100], [100, 0, 0], [100, 0, 0], [0, 100, 100], [0, 100, 100], [0, 100, 100], [0, 100, 100]];

    // objects[0] = new Object('Box1', [0, 0, 0], [-8, 1, 20]);
    // objects[1] = new Object('Box2', [0, 0, 0], [5*Math.cos(Math.PI/4), 1,5*Math.sin(Math.PI/4)]);
    /*objects[2] = new Object('Box3', [0, 0, 0], [5, 1, 5]);*/
    let num1, num2, num3;
    let name = '';
    let r = 10;
    let gr = 360 / maxObj;
    Cubes = new Group("cubes", [0, 0, 0], [0,0,0]);
    let object={};
    for (let i = 0; i < maxObj; i++) {
        name = 'Box' + i;
        num1 = r * Math.cos(degToRad(gr * i));
        num2 = 1;
        num3 =15+ r * Math.sin(degToRad(gr * i));

        object = new Object(name, [0, 0, 0], [num1, num2, num3]);
        object.rotMatrix4 = RotateY([...object.rotMatrix4], gr * i);
        object.anim = {
            step: .1 +(Math.random() *10)/3,
            deg: 0
        }
        object.points = [...boxPoints];
        let triangle = {};
        for (let s = 0; s < triangles.length; s++) {
            triangle = {
                pointers: [...triangles[s]],
                color: colors[s],
                rgbd: rgbds[s],
                rgb: rgbs[s]
            }

            object.setTriangle(triangle);
        }
        Cubes.addObject(object);
    }
    canvasTop.setCenter(canvasTop.cX, canvasTop.cY - 200);
    canvasGrid.setCenter(canvasGrid.cX, canvasGrid.cY - 200);
    Cubes.position=[0,0,20,1];
    worldMatrix[7] =-1.6;
    //Cubes.groupMatrix[11] = 20;
}

let zero;
//requestAnimationFrame(firstFrame);

function firstFrame(timeStamp) {
    zero = timeStamp;
    animate(timeStamp);
}

function animate(timeStamp) {
    update();
    requestAnimationFrame((t) => animate(t));
}

setup();
//requestAnimationFrame(firstFrame);
update();
//firstFrame();
//canvasTop.drawLines(lines,'#ff0000');