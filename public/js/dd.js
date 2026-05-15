import {Canvas} from './modules/Canvas.js';
import {Object} from './modules/Object.js';
import {Group} from './modules/Group.js';
import {Matrix} from './modules/Matrix.js';
import {rotateAxes, rotatePoints, multiplyMatrixVectors, multiplyMatrixVectors2, MMulti, RotateX, RotateY, RotateZ, degToRad, TranslateV, multiplyVectorsCamera} from './modules/utils.js';

let docWidth = innerWidth;
let docHeight = innerHeight;

let objects = [];
let maxObj = 15;
let maxObj2 = 8;
let selected = 0;

let M = new Matrix();
let Cubes = new Group('Cubes', [0, 0, 0, 1], [0, 0, 0, 1]);


let identityMatrix = M.m_eye();

let worldMatrix = M.m_eye();


//Projection Matrix
let a = docHeight / docWidth;//accept ratio
let theta = Math.PI / 3;
let fov = theta;
let f = 1 / (Math.tan(fov / 2));//field of view
let w = 1;

let zFar = 10000;
let zNear = .1;
let q = zFar / (zFar - zNear);

let projectionMatrix = M.m_projection(theta, zFar, zNear, w);
let vCamera = M.m_eye();

function newRot(axe, rM) {
    let resultMatrix = rM;
    switch (axe) {
        case 0:
            //resultMatrix = RotateX(rM, 5);
            resultMatrix = M.m_rotate(0, rM, 5);
            break;
        case 1:
            resultMatrix = M.m_rotate(1, rM, 5);
            //resultMatrix = RotateY(rM, 5);
            break;
        case 2:
            //resultMatrix = RotateZ(rM, 5);
            resultMatrix = M.m_rotate(2, rM, 5);
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
            Cubes.objects[selected].rotMatrix = newRot(0, [...Cubes.objects[selected].rotMatrix]);
            console.table(Cubes.objects[selected].rotMatrix)

            update();
            break;
        case 'KeyY':
            //objects[selected].setRotationMatrix(1);
            Cubes.objects[selected].rotMatrix = newRot(1, [...Cubes.objects[selected].rotMatrix]);
            update();
            break;
        case 'KeyZ':
            //objects[selected].setRotationMatrix(2);
            Cubes.objects[selected].rotMatrix = newRot(2, [...Cubes.objects[selected].rotMatrix]);
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
            let txu = worldMatrix[1][3];
            txu -= .4;
            if (txu < -8) {
                txu += -.4;
            } else {
                canvasTop.setCenter(canvasTop.cX, canvasTop.cY - 50);
                canvasGrid.setCenter(canvasGrid.cX, canvasGrid.cY - 50);
                canvasTop.horizon = canvasGrid.horizon = canvasTop.cY;

                worldMatrix[1][3] = txu;
                update();
            }

            break;

        case 'ArrowDown':
            //going down, world goes up
            let txd = worldMatrix[1][3];
            txd += .4;
            if (txd > 0) {
                txd -= .4;
            } else {
                canvasTop.setCenter(canvasTop.cX, canvasTop.cY + 50);
                canvasGrid.setCenter(canvasGrid.cX, canvasGrid.cY + 50);
                canvasTop.horizon = canvasGrid.horizon = canvasTop.cY;
                /*  canvasTop.horizon = canvasTop.cY;
                  canvasGrid.horizon=canvasTop.horizon;*/
                worldMatrix[1][3] = txd;
                update();
            }

            break;
        case 'KeyA':
            //going left, world goes right
            let txr = worldMatrix[0][3];
            txr += .2;
            if (txr > 15) txr = 15;
            worldMatrix[0][3] = txr;
            update();
            break;

        case 'KeyD':
            //going right, world goes left
            let txl = worldMatrix[0][3];
            txl -= .2;
            if (txl < -15) txl = -15;
            worldMatrix[0][3] = txl;
            update();
            break;
        case 'KeyS':
            //going forwards, world goes to screen
            let txf = worldMatrix[2][3];
            txf += .2;
            if (txf > 50) txf = 50;
            worldMatrix[2][3] = txf;
            update();
            break;
        case 'KeyW':
            //going down, world goes up.
            let txb = worldMatrix[2][3];
            txb -= .2;
            if (txb < -50) txb = -50;
            worldMatrix[2][3] = txb;
            update();
            break;
    }


}

function update() {
    //objects
    let positions = [];
    let v = [];
    let vv = [];
    let vvv = [];
    let obj = {};
    let pos = [];
    let cPos = [Cubes.transMatrix[0][3], Cubes.transMatrix[1][3], Cubes.transMatrix[2][3]];

    let dumRM = M.m_eye();
    for (let i = 0; i < Cubes.objects.length; i++) {
        obj = Cubes.objects[i];
        pos = [...obj.position];
        //pos = [obj.animatedPosition];
        pos = M.m_mul_v([...pos], [...Cubes.groupMatrix]);

        /*  pos[0] += Cubes.transMatrix[0][3];
          pos[1] += Cubes.transMatrix[1][3];
          pos[2] += Cubes.transMatrix[2][3];*/

        pos[0] += cPos[0];
        pos[1] += cPos[1];//Cubes.transMatrix[1][3];
        pos[2] += cPos[2];//Cubes.transMatrix[2][3];
       // pos = M.m_mul_v([...pos], [...worldMatrix]);
        obj.rotatedPosition[0] = pos;

        //obj.rotatedPosition[0] = obj.position;
        obj.rotatedPoints = [...obj.points];
        //obj.rotatedPoints =
        obj.rotatedPoints = M.m_mul_array_v3(obj.rotatedPoints, [...obj.scaleMatrix]);
        obj.rotatedPoints = M.m_mul_array_v3(obj.rotatedPoints, [...obj.rotMatrix]);
        obj.rotatedPoints = M.m_mul_array_v3(obj.rotatedPoints, [...Cubes.groupMatrix]);
       // obj.rotatedPoints = M.m_mul_array_v3(obj.rotatedPoints, [...worldMatrix]);
       // obj.rotatedPoints = rotatePoints([...obj.points], [...rotationMatrix]);
        //obj.rotatedPosition = rotatePoints([...[obj.position]], [...rotationMatrix]);
        for (let j = 0; j < obj.rotatedPoints.length; j++) {
            v = [...obj.rotatedPoints[j]];
            vv = [...obj.rotatedPosition[0]];
            vvv = [-worldMatrix[3], -worldMatrix[7], -worldMatrix[11]];
            /*v[2] += obj.position[2];
            v[1] += obj.position[1];
            v[0] += obj.position[0];*/
            //obj.rotatedPoints[j] = v;

            v[2] += vv[2];
            v[1] += vv[1];
            v[0] += vv[0];
            obj.rotatedPoints[j] = v;
        }
        //world

        //obj.rotatedPoints = multiplyVectorsCamera([...obj.rotatedPoints], worldMatrix);
        obj.rotatedPoints = multiplyMatrixVectors([...obj.rotatedPoints], worldMatrix);
        obj.rotatedPosition = multiplyMatrixVectors([...obj.rotatedPosition], worldMatrix);
        obj.rotatedPoints = multiplyMatrixVectors([...obj.rotatedPoints], projectionMatrix);
        /*obj.rotatedPoints = M.m_mul_array_v3([...obj.rotatedPoints], worldMatrix);
                obj.rotatedPosition = M.m_mul_array_v3([...obj.rotatedPosition], worldMatrix);
                obj.rotatedPoints = M.m_mul_array_v3([...obj.rotatedPoints], projectionMatrix);*/

    }
    Cubes.objects.sort(function (a, b) {
        return b.rotatedPosition[0][2] - a.rotatedPosition[0][2];
    });
    canvasGrid.clearCanvas();
    canvasAir.clearCanvas();
    canvasAir.drawBackgroundImage(imgAir, -canvasAir.cX, -canvasAir.horizon, canvasAir.width, canvasAir.height);
    canvasGrid.drawBackgroundImage(imgGround, 0, 0, canvasGrid.width, canvasGrid.height);

    /* canvasGrid.setBackground('#83c6ff');
     canvasGrid.drawRectangle(-canvasGrid.cX, 0, canvasGrid.width, canvasGrid.height - canvasGrid.horizon, '#007025');
     canvasGrid.drawGrid();*/
    canvasTop.clearCanvas();
    // canvasTop.drawAxes(worldMatrix);

    for (let i = 0; i < Cubes.objects.length; i++) {
        let z = Cubes.objects[i].rotatedPosition[0][2];
        if (z > 1.5) {
            canvasTop.drawTriangleSides(Cubes.objects[i].triangles, Cubes.objects[i].rotatedPoints, vCamera);
        }
    }
}

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}


// create the canvas and reporting list
let canvasTop = new Canvas('canvas-top', 'canvas-wrapper', docWidth, docHeight, docWidth / 2, docHeight, 300, 1, '500');
canvasTop.create();

let canvasGrid = new Canvas('canvas-grid', 'canvas-wrapper', docWidth, docHeight, 0, 450, 300, 1, '100');
let canvasAir = new Canvas('canvas-air', 'canvas-wrapper', docWidth, docHeight, 0, 0, 300, 1, '50');
canvasGrid.create();
//canvasGrid.drawRectangle(-canvasGrid.cX,canvasGrid.horizon,canvasGrid.width,canvasGrid.height);
canvasAir.create();
let imgAir = "/public/images/air.webp";
let imgGround = "/public/images/ground.png";

//canvasGrid.drawRectangle(-canvasGrid.cX, 0, canvasGrid.width, canvasGrid.height - canvasGrid.horizon, '#007025');
/*background.onload = function(){
    //canvas_widthを height / width倍する.
    canvas.drawImage(background,0,0,canvas_width, background.height * canvas_width / background.width);
}*/
function setup() {


    let boxPoints = [[-1, -1, -1], [-1, 1, -1], [1, 1, -1], [1, -1, -1], [1, -1, 1], [1, 1, 1], [-1, 1, 1], [-1, -1, 1]];
    let triangles = [[0, 1, 2], [0, 2, 3], [3, 2, 5], [3, 5, 4], [4, 5, 6], [4, 6, 7], [7, 6, 1], [7, 1, 0], [7, 0, 3], [7, 3, 4], [1, 6, 5], [1, 5, 2]];
    let colors = ['#ffff00', '#ffff00', '#880000', '#880000', '#ffff00', '#ffff00', '#880000', '#880000', '#008888', '#008888', '#008888', '#008888'];
    //let rgbs = [[0, 0, 255], [0, 0, 255], [255, 0, 0], [255, 0, 0], [0, 0, 255], [0, 0, 255], [255, 0, 0], [255, 0, 0], [0, 255, 0], [0, 255, 0], [0, 255, 0], [0, 255, 0]];
    let rgbs = [[255, 156, 1], [255, 156, 1], [255, 156, 1], [255, 156, 1], [255, 156, 1], [255, 156, 1], [255, 156, 1], [255, 156, 1], [255, 156, 1], [255, 156, 1], [255, 156, 1], [255, 156, 1]];
    // let rgbds = [[0, 0, 100], [0, 0, 100], [100, 0, 0], [100, 0, 0], [0, 0, 100], [0, 0, 100], [100, 0, 0], [100, 0, 0], [0, 100, 100], [0, 100, 100], [0, 100, 100], [0, 100, 100]];
    let rgbds = [[100, 100, 100], [100, 100, 100], [100, 100, 100], [100, 100, 100], [100, 100, 100], [100, 100, 100], [100, 100, 100], [100, 100, 100], [100, 100, 100], [100, 100, 100], [100, 100, 100], [100, 100, 100]];

    // objects[0] = new Object('Box1', [0, 0, 0], [-8, 1, 20]);
    // objects[1] = new Object('Box2', [0, 0, 0], [5*Math.cos(Math.PI/4), 1,5*Math.sin(Math.PI/4)]);
    /*objects[2] = new Object('Box3', [0, 0, 0], [5, 1, 5]);*/
    let num1, num2, num3;
    let name = '';
    let r = 20;
    let gr = 360 / maxObj;
    let gr2 = 180 / maxObj2;
    let obj = {};
    let o = {};
    let sM = M.m_make_scale(3, 3, 3);
    let dumSM = [...sM];
    for (let i = 0; i < maxObj; i++) {
        name = 'Box' + i;
        num1 = r * Math.cos(degToRad(gr * i));
        num2 = 1;
        num3 = r * Math.sin(degToRad(gr * i));
        obj = new Object(name, [0, 0, 0, 1], [num1, num2, num3, 1]);
        obj.ground = num2;
        obj.rotations = [0, 0, 0];
        obj.rotations = [0, gr * i, 0];
        obj.rotMatrix = M.m_rotate(1, [...obj.rotMatrix], obj.rotations[1]);
        obj.anim = {
            rdeg: 5,
            r: 2 + Math.round(rp() * 5),
            step: .2 + (rp() * 10) / 3,
            deg: 0
        };
        obj.points = [...boxPoints];
        obj.scale = [Math.random() * 1.5, Math.random() * 1.5, Math.random() * 1.5];
        //obj.scale = [3,3,3];
        dumSM = M.m_make_scale(obj.scale[0], obj.scale[1], obj.scale[2]);

        obj.setScaleMatrix(dumSM);
        let triangle = {};
        for (let s = 0; s < triangles.length; s++) {
            triangle = {
                pointers: [...triangles[s]],
                color: colors[s],
                rgbd: rgbds[s],
                rgb: rgbs[s]
            }

            obj.setTriangle(triangle);
        }
        obj.setScaleMatrix(dumSM);
        //obj.block = update_anim_block(obj.block);
        obj.spring = update_spring_anim(obj.spring);

        Cubes.addObject(obj);

    }
    r = 12;
    let rs = 15;
    gr = 360 / maxObj2;
    for (let i = 0; i < maxObj2; i++) {
        name = 'Box' + (i + maxObj);
        num1 = r * Math.cos(degToRad(gr * i));
        num2 = 1 + rs;
        num3 = r * Math.sin(degToRad(gr * i));
        obj = new Object(name, [0, 0, 0, 1], [num1, num2, num3, 1]);
        obj.ground = num2;
        obj.rotations = [0, 0, 0];
        obj.rotations = [0, gr * i, 0];
        obj.rotMatrix = M.m_rotate(1, [...obj.rotMatrix], obj.rotations[1]);
        obj.anim = {
            rdeg: 5,
            r: 2 + Math.round(rp() * 5),
            step: .2 + (rp() * 10) / 3,
            deg: 0
        };
        obj.points = [...boxPoints];
        obj.scale = [Math.random() * 1.5, Math.random() * 1.5, Math.random() * 1.5];
        //obj.scale = [3,3,3];
        dumSM = M.m_make_scale(obj.scale[0], obj.scale[1], obj.scale[2]);

        obj.setScaleMatrix(dumSM);
        let triangle = {};
        for (let s = 0; s < triangles.length; s++) {
            triangle = {
                pointers: [...triangles[s]],
                color: colors[s],
                rgbd: rgbds[s],
                rgb: rgbs[s]
            }

            obj.setTriangle(triangle);
        }
        //obj.block = update_anim_block(obj.block);
        obj.spring = update_spring_anim(obj.spring);

        Cubes.addObject(obj);

    }
//Group Cubes setup
    Cubes.setTransMatrix(M.m_make_translate(0, 0, 30));
    Cubes.anim = {
        deg: 0,
        step: (rp() * 10),
    }

    canvasTop.setCenter(canvasTop.cX, canvasTop.cY - 200);
    canvasGrid.setCenter(canvasGrid.cX, 2 * canvasGrid.height / 3);
    canvasAir.drawBackgroundImage(imgAir, 0, 0, canvasAir.width, canvasAir.height);
    canvasGrid.drawBackgroundImage(imgGround, 0, 0, canvasGrid.width, canvasGrid.height);
    worldMatrix[1][3] = -1.6;
    worldMatrix[2][3] = 0;
}


function rot_object(obj) {
    /*
    rm = this.m_make_rx(g);
                break;
            case 1:
                rm = this.m_make_ry(g);
                break;
            case 2:
                rm = this.m_make_rz(g);

     */
    let o_rx = M.m_make_rx(obj.rotations[0]);
    let o_ry = M.m_make_ry(obj.rotations[1]);
    let o_rz = M.m_make_rz(obj.rotations[2]);
    let rm = M.m_eye();
    rm = M.m_mul_m(rm, o_rx);
    rm = M.m_mul_m(rm, o_ry);
    rm = M.m_mul_m(rm, o_rz);

    return rm;
}


/*
function animate_org(timeStamp) {
    let obj = {};

    Cubes.anim.deg += Cubes.anim.step;
    if (Cubes.anim.deg > 180) Cubes.anim.deg -= 180;

    Cubes.rotations[1] += .5;
    if (Cubes.rotations[1] > 360) Cubes.rotations[1] -= 360;
    Cubes.groupMatrix = rot_object({...Cubes});
    let maxg = 360;
    let str = 0;
    for (let i = 0; i < Cubes.objects.length; i++) {

        obj = Cubes.objects[i];
        obj.anim.deg += obj.anim.step;
        if (obj.anim.deg > maxg) {
            obj.anim.deg -= maxg;
            obj.anim.rdeg += 30;
            if (obj.anim.rdeg > 360) {
                obj.anim.r = 2 + Math.round(rp() * 5);
                obj.anim.step = .3 + (rp() * 30) / 4.0;
                obj.anim.rdeg -= 360;
                console.log('rdeg: ' + obj.anim.rdeg);
            }

        }
        str = obj.anim.r * Math.cos(degToRad(obj.anim.rdeg));

        str = obj.anim.r;
        obj.rotations[0] += obj.anim.step / 3;
        obj.rotations[1] += obj.anim.step;
        if (obj.rotations[0] > 360) obj.rotations[0] -= 360;
        if (obj.rotations[1] > 360) obj.rotations[1] -= 360;
        if (obj.rotations[2] > 360) obj.rotations[2] -= 360;

        let num1 = obj.position[0];
        let num2 = obj.ground + str * Math.sin(degToRad(obj.anim.deg));
        if (obj.ground < 2) num2 = Math.abs(num2);
        let num3 = obj.position[2];
        obj.position = [num1, num2, num3, 1];
        obj.transMatrix = M.m_make_translate(obj.position[0], obj.position[1], obj.position[2]);

        obj.rotMatrix = rot_object(obj);

    }
    update();
    requestAnimationFrame((t) => animate(t));
}
*/


let zero;

//requestAnimationFrame(firstFrame);

/*function firstFrame(timeStamp) {
    zero = timeStamp;
    animate(timeStamp);
}*/
var anim_fps = 50;
var anim_now;
var anim_then = Date.now();
var anim_interval = 1000 / anim_fps;
var anim_delta;

function animate() {

    requestAnimationFrame(animate);

    anim_now = Date.now();
    anim_delta = anim_now - anim_then;

    if (anim_delta > anim_interval) {
        anim_then = anim_now - (anim_delta % anim_interval);
        //real anim
        let obj = {};
        //Group holder animate

        Cubes.anim.deg += Cubes.anim.step;
        if (Cubes.anim.deg > 180) Cubes.anim.deg -= 180;

        Cubes.rotations[1] += .5;
        if (Cubes.rotations[1] > 360) Cubes.rotations[1] -= 360;
        Cubes.groupMatrix = rot_object({...Cubes});
        let maxg = 360;
        let str = 0;
        let dSM = [];
        let sp = [0, 0, 0];
        for (let i = 0; i < Cubes.objects.length; i++) {

            obj = Cubes.objects[i];
            sp = [...obj.scale];

            //console.log("sp EEN: \n"+sp+"\n")
            //obj.block = update_anim(obj.block);
            obj.spring = spring_anim(obj.spring);
            obj.anim.deg += obj.anim.step;
            //obj.anim.r=8*obj.anim.r/9;
            // if (obj.ground > 2) {
            // maxg = 360;
            if (obj.anim.deg > maxg) {
                obj.anim.deg -= maxg;
                obj.anim.rdeg += obj.anim.step;
                if (obj.anim.rdeg > 360) {
                    obj.anim.r = 2 + Math.round(rp() * 5);
                    obj.anim.step = .3 + (rp() * 30) / 4.0;
                    obj.anim.rdeg -= 360;
                }

            }
            str = obj.anim.r * Math.cos(degToRad(obj.anim.rdeg));

            str = obj.anim.r * Math.cos(degToRad(obj.anim.rdeg));
            //str = obj.anim.r;
            obj.rotations[0] += obj.anim.step / 3;
            obj.rotations[1] += obj.anim.step;
            //console.log("r: "+str);
            if (obj.rotations[0] > 360) obj.rotations[0] -= 360;
            if (obj.rotations[1] > 360) obj.rotations[1] -= 360;
            if (obj.rotations[2] > 360) obj.rotations[2] -= 360;

            let num1 = obj.position[0];
            // let num2 = obj.ground + str * Math.sin(degToRad(obj.anim.deg));
            let num2 = obj.ground + obj.spring.y;
            //let num2 = obj.ground + obj.block.y-obj.block.rl;//str * Math.sin(degToRad(obj.anim.deg));
            if (obj.ground < 2) num2 = Math.abs(num2);
            // if (obj.ground < 2) num2 = Math.abs(num2);
            let num3 = obj.position[2];
            obj.position = [num1, num2, num3, 1];
            obj.transMatrix = M.m_make_translate(obj.position[0], obj.position[1], obj.position[2]);
            let len = 1;//Math.abs(Math.sin(degToRad(obj.anim.deg)));
            sp[0] = .3 + sp[0] * len;
            sp[1] = .3 + sp[1] * len;
            sp[2] = .3 + sp[2] * len;
            obj.scaleMatrix[0][0] = sp[0];
            obj.scaleMatrix[1][1] = sp[1];
            obj.scaleMatrix[2][2] = sp[2];

            //obj.transMatrix = M.m_make_translate(obj.animatedPosition[0], obj.animatedPosition[1], obj.animatedPosition[2]);

            obj.rotMatrix = rot_object(obj);

        }
        update();
    }
}

function update_anim(b) {
    let block = b;
    let l = block.y - block.rl;
    let force = -block.k * l;
    block.ry = block.y;
    block.v += force;
    block.y += block.v;

    block.v *= block.d;
    if (Math.abs(block.v) < 0.0001) {
        block = update_anim_block(block);
        /*block.k = 0.01 + (Math.random() / 10.0);
        block.d = .9 + Math.random() / 10.0;
        block.rl = 2 + Math.ceil(Math.random() * 4);*/
        //block.y=block.rl;
    }
    //render();
    return block;
}

function update_anim_block(block) {
    block.k = 0.005 + (rp() / 100.0);
    block.d = .9 + rp() / 10.0;
    block.rl = 4 + Math.ceil(rp() * 8);
    block.v = .5;
    //block.y=block.rl-.54;

    return block;
}

function spring_anim(spring) {
    spring.angle += spring.angleV;
    spring.r = 20;
    spring.y = spring.rs * Math.sin(spring.angle);
    if (spring.angle > Math.PI * 2) {
        update_spring_anim(spring);
    }
    return spring;
}

function update_spring_anim(spring) {
    spring.rs *= .98;
    //spring.aVD+=spring.rs;
    spring.angleV = Math.PI / (spring.aVD + spring.rs);
    spring.angle -= (Math.PI * 2);
    if (spring.rs < 1) {
        //spring.rs=100+Math.ceil(Math.random()*200);
        spring.aVD = 20 + Math.random() * 10;
        spring.rs = 2 + Math.ceil(Math.random() * 4);
    }
    return spring;
}

function rp(mini = 1, maxi = 2) {
    //return (Math.random()*Math.random())/2.0;
    return (Math.exp(Math.random() * (Math.log(maxi) - Math.log(mini))) * mini) / 2.0;
}



function resizeCanvas() {
    let w = innerWidth;
    let h = innerHeight;
    let cx = w / 2;
    let cy = h / 2;
    canvasTop.resizeCanvas(w, h, cx, cy);
    update();
}
/* keyboard */
window.addEventListener('keydown', eventKeyDown, true);
window.addEventListener('resize', resizeCanvas, false);


setup();
animate();


