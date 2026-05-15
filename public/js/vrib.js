import {Canvas} from './modules/Canvas.js';

let docWidth = innerWidth;
let docHeight = innerHeight;
let canvasTop = new Canvas('canvas-top', 'canvas-wrapper', docWidth, docHeight, docWidth / 2, docHeight / 2, 300, 1, '500');
canvasTop.create();

function render() {
    canvasTop.clearCanvas();
    canvasTop.drawRectangle(block.x - block.w / 2, block.y - block.rl - block.h / 2, block.w, block.h, "#ff0000");
}

let anim_fps = 1 / 50;
let anim_now;
let anim_then = Date.now();
let anim_interval = 1000 * anim_fps;
let anim_delta;

let vib = {k: 0, dx: 0, b: 0, v: 0};
let Fspring = -vib.k * vib.dx;
let Fdamping = -vib.b * vib.v;

let scale = 50;

let block = {
    k: 0.05,
    d: 0.99,
    v: 0.1,
    rl: 200,
    l: 0,
    r: 5,
    x: 0,
    y: 0,
    w: 40,
    h: 40,
    ry: 0
}

let PI2 = Math.PI * 2 - Math.PI / 32;
let firstTime=true;
function update() {
    let l = block.y - block.rl;
    let force = -block.k * l;
    block.ry=block.y;
    block.v += force;
    block.y += block.v;

    block.v *= block.d;
    if(Math.abs(block.v)<0.01) {
        block.k = 0.01 + (Math.random() / 10.0);
        block.d = .9 + Math.random() / 10.0;
        block.rl = 150 + Math.ceil(Math.random() * 150);
        //block.y=block.rl;
    }
    render();
}

function setup() {

    canvasTop.drawRectangle(-20, -20, 40, 40, "#ff0000");
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
animate();