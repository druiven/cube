class Group {
    name = [];
    anim = {
        step: 5,
        deg: 0
    }
    points = [];
    rotatedPoints = [];
    triangles = [];
    center = [0, 0, 0, 1];
    position = [0, 0, 0, 1];
    rotatedPosition = [this.position];
    objects = [];

    groupMatrix = [
        [1, 0, 0, 0],
        [0, 1, 0, 0],
        [0, 0, 1, 0],
        [0, 0, 0, 1]
    ];

    positionMatrix = [
        [1, 0, 0, 0],
        [0, 1, 0, 0],
        [0, 0, 1, 0],
        [0, 0, 0, 1]
    ]

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
    rotations = [0, 0, 0, 1];

    constructor(name = '', center = [], position = [], objects = []) {
        this.name = name;
        this.center = center;
        this.position = position;
        this.rotatedPosition[0] = position;
        this.objects = objects;
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

    setGroupMatrix(rM) {
        this.groupMatrix = rM;
    }

    setTransMatrix(tM) {
        this.transMatrix = tM;
    }

    setScaleMatrix(sM) {
        this.scaleMatrix = sM;
    }

    addObject(object = {}) {
        this.objects.push(object);
    }

}

export {Group}