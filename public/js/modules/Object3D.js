class Object3D {
    name = [];
    anim = {
        rdeg: 5,
        r: 1,
        step: 5,
        deg: 0
    }
//    var block = {x: 20, v: 0, mass: 0.5};
    //  var wall = {x: 30, lx: 30, v: 0, t: 0, frequency: 0};

    spring = {
        angle: 0,
        r: 20,
        rs: 0,
        angleV: Math.PI / 30,
        aVD:30,
        y: 0,
    }

    block = {
        k: 0.05,
        d: 0.99,
        v: 0.1,
        rl: 3,
        l: 0,
        r: 5,
        x: 0,
        y: 0,
        w: 40,
        h: 40,
        ry: 0
    }

    points = [];
    rotatedPoints = [];
    triangles = [];
    center = [0, 0, 0, 1];
    position = [0, 0, 0, 1];
    rotations = [0, 0, 0, 1];
    scale=[1,1,1];
    animatedPosition = [...this.position];
    rotatedPosition = [];
    ground = 0;


    rotMatrix = [
        [1, 0, 0, 0],
        [0, 1, 0, 0],
        [0, 0, 1, 0],
        [0, 0, 0, 1]
    ];

    transMatrix = [
        [1, 0, 0, 0],
        [0, 1, 0, 0],
        [0, 0, 1, 0],
        [0, 0, 0, 1]
    ];

    scaleMatrix = [
        [1, 0, 0, 0],
        [0, 1, 0, 0],
        [0, 0, 1, 0],
        [0, 0, 0, 1]
    ];

    constructor(name = '', center = [], position = []) {
        this.name = name;
        this.center = center;
        this.position = position;
        this.rotatedPosition[0] = position;
        /* this.rotMatrix[3]=this.position[0];
         this.rotMatrix[7]=this.position[1];
         this.rotMatrix[11]=this.position[2];*/
    }

    setPoints(points = []) {
        this.points = points;
    }

    setTriangle(triangle = {}) {
        this.triangles.push(triangle);
    }

    setTriangles(triangles = []) {
        this.triangles = triangles;
    }

    setRotMatrix(rM) {
        this.rotMatrix = rM;
    }

    setTransMatrix(tM) {
        this.transMatrix = tM;
    }

    setScaleMatrix(sM) {
        this.scaleMatrix = sM;
    }

    getScaleMatrix(){
        return this.scaleMatrix;
    }

    getRotMatrix() {
        return this.rotMatrix;
    }

}

export {Object3D}