class Canvas {
    constructor(id, parentId = 'c-wrapper', width = 100, height = 100, cX = 0, cY = 0, scaling = 1, alpha = 1, zIndex = '0') {
        this.id = id;
        this.listId = null;
        this.parentId = parentId;
        this.cX = cX;
        this.cY = cY;
        this.horizon = cY;
        this.alpha = alpha
        this.scale = scaling;
        this.width = width;
        this.height = height;
        this.ctx = null;
        this.zIndex = zIndex;
        this.background = undefined;

    }

    // new class stuff above here

    create() {
        if (this.ctx !== null) {
            return;
        } else {
            let canvasElem = document.createElement('canvas');
            let cWrapper = document.getElementById(this.parentId);
            if (cWrapper) {
                cWrapper.appendChild(canvasElem);

                canvasElem.id = this.id;
                canvasElem.width = this.width;
                canvasElem.height = this.height;
                canvasElem.style.zIndex = this.zIndex;

                this.ctx = canvasElem.getContext('2d');
                this.ctx.globalAlpha = this.alpha;
                this.ctx.translate(Math.floor(this.cX), Math.floor(this.cY));
            } else {
                return;
            }
        }
    }

    resizeCanvas(w,h,cx,cy){

        this.width = w;
        this.height = h;
        this.setCenter(cx,cy);
        this.clearCanvas();
       // redraw();
    }

    setCenter(cX = 0, cY = 0) {
        this.cX = cX;
        this.cY = cY;
        this.horizon = this.cY;
        this.ctx.resetTransform();
        this.ctx.translate(Math.floor(cX), Math.floor(cY));

    }

    clearCanvas() {
        this.ctx.clearRect(-this.cX, -this.cY, this.width, this.height);
    }

    setBackground(fillStyle = '#000000') {
        this.ctx.fillStyle = fillStyle;
        this.ctx.fillRect(-this.cX, -this.cY, this.width, this.height);
    }

    drawRectangle(x, y, w, h, color) {
        this.ctx.fillStyle = color;
        this.ctx.fillRect(x, y, w, h);
        this.ctx.beginPath();
        this.ctx.arc(0, 0, 250, 0, 2 * Math.PI);
        this.ctx.closePath();
        this.ctx.fill();
    }

    drawCircle(x, y, r, color = '#ffffff') {
        this.ctx.fillStyle = color;
        this.ctx.beginPath();
        this.ctx.arc(x, y, r, 0, 2 * Math.PI);
        //this.ctx.closePath();
        this.ctx.fill();
    }

    drawGrid(gridWidth = 25) {
        let vCount = Math.floor((this.height) / gridWidth);
        let hCount = Math.floor((this.width / 2) / gridWidth);
        let leftHCount = Math.floor(this.cX / gridWidth);
        let rightHCount = Math.floor((this.width - this.cX) / gridWidth);
        let leftVCount = Math.floor(this.horizon / gridWidth);
        let rightVCount = Math.floor((this.height - this.horizon) / gridWidth);
        this.ctx.lineWidth = 2;
        this.ctx.strokeStyle = '#0000AA';
        this.ctx.beginPath();
        /* this.ctx.moveTo(0, -this.horizon);
         this.ctx.lineTo(0, this.height);
         this.ctx.stroke();*/
        this.ctx.moveTo(-this.cX, 0);
        this.ctx.lineTo(this.width, 0);
        this.ctx.stroke();
        this.ctx.lineWidth = 1;
        this.ctx.strokeStyle = '#888888';
        let i = 0;
        for (i = 1; i <= hCount; i++) {
            this.ctx.beginPath();
            this.ctx.moveTo(-(i * gridWidth), -this.horizon);
            this.ctx.lineTo(-(i * gridWidth), this.height);
            this.ctx.stroke();
        }
        for (i = 0; i <= hCount; i++) {
            this.ctx.beginPath();
            this.ctx.moveTo((i * gridWidth), -this.horizon);
            this.ctx.lineTo((i * gridWidth), this.height);
            this.ctx.stroke();
        }
        /*for (i = 1; i <= leftHCount; i++) {
            this.ctx.beginPath();
            this.ctx.moveTo(-(i * gridWidth), -this.horizon);
            this.ctx.lineTo(-(i * gridWidth), this.height);
            this.ctx.stroke();
        }
        this.ctx.strokeStyle = '#888888';
        for (i = 0; i <= rightHCount; i++) {
            this.ctx.beginPath();
            this.ctx.moveTo((i * gridWidth), -this.horizon);
            this.ctx.lineTo((i * gridWidth), this.height);
            this.ctx.stroke();
        }*/
        this.ctx.strokeStyle = '#6666bb';
        for (i = 1; i <= leftVCount; i++) {
            this.ctx.beginPath();
            this.ctx.moveTo(-this.cX, -(i * gridWidth));
            this.ctx.lineTo(this.width, -(i * gridWidth));
            this.ctx.stroke();
        }
        this.ctx.strokeStyle = '#88BB88';
        for (i = 1; i <= rightVCount; i++) {
            this.ctx.beginPath();
            this.ctx.moveTo(-this.cX, (i * gridWidth));
            this.ctx.lineTo(this.width, (i * gridWidth));
            this.ctx.stroke();
        }

    }

    drawLines(lines = [], color = '#000000') {
        //point 2D array lineNUmber[points]
        let linesLength = lines.length;
        let pointsLength = 0;
        let i = 0;
        let j = 0;
        this.ctx.strokeStyle = '#ff0000';
        for (i = 0; i < linesLength; i++) {
            pointsLength = lines[i].length;
            this.ctx.beginPath();
            this.ctx.moveTo(lines[i][0][0], lines[i][0][1]);
            for (j = 1; j < pointsLength; j++) {
                this.ctx.lineTo(lines[i][j][0], lines[i][j][1]);
            }
            this.ctx.lineTo(lines[i][0][0], lines[i][0][1]);
            this.ctx.stroke();
        }
    }

    drawBackgroundImage(imgUrl, x, y, w, h) {
        if (this.background === undefined || !this.background) {
            this.background = new Image();
            this.background.src = imgUrl;
            /*  this.background.height=this.background.height;
              this.background.width=this.background.width;*/
        }


        this.ctx.drawImage(this.background, x, y, w, h);

    }

    drawTriangleSides(triangles = [], points = [], vCam = []) {
        if (triangles.length < 1 || points.length < 1) return null;
        let i = 0;
        let j = 0;
        let pointers = [];
        let side = {};
        let vC = [];
        let cv = 0;
        let cA = 0;
        let c2 = 0;
        let delta = 0;
        let r = 0;
        let g = 0;
        let b = 0;
        let scale = this.scale;
        let line = [];
        let va = {};
        let vb = {};
        let vn = {};
        let vLightDirection = [0, 0, -1];
        let vLightLength = Math.sqrt(vLightDirection[0] ** 2 + vLightDirection[1] ** 2 + vLightDirection[2] ** 2);
        vLightDirection[0] /= vLightLength;
        vLightDirection[1] /= vLightLength;
        vLightDirection[2] /= vLightLength;
        let dpL = 0;
        this.ctx.lineJoin = 'round';
        for (i = 0; i < triangles.length; i++) {
            pointers = triangles[i].pointers;
            line[0] = [];
            va.x = points[pointers[1]][0] - points[pointers[0]][0];
            va.y = points[pointers[1]][1] - points[pointers[0]][1];
            va.z = points[pointers[1]][2] - points[pointers[0]][2];

            let vaL = Math.sqrt(va.x ** 2 + va.y ** 2 + va.z ** 2);

            vb.x = points[pointers[2]][0] - points[pointers[0]][0];
            vb.y = points[pointers[2]][1] - points[pointers[0]][1];
            vb.z = points[pointers[2]][2] - points[pointers[0]][2];

            vn.x = va.y * vb.z - va.z * vb.y
            vn.y = va.x * vb.z - va.z * vb.x;
            vn.z = va.x * vb.y - va.y * vb.x;

            c2 = (Math.sqrt(vn.x ** 2 + vn.y ** 2 + vn.z ** 2));

            if (c2 !== 0) {
                cA = (Math.acos(vn.z / c2))
            } else {
                cA = 0;
            }
            dpL = vn.x * (points[pointers[0]][0] - vCam[0][3]) +
                vn.y * (points[pointers[0]][1] - vCam[1][3]) +
                vn.z * (points[pointers[0]][2] - vCam[2][3]);
            /*  dpL = vn.x * (points[pointers[0]][0] - vCam[0]) +
                  vn.y * (points[pointers[0]][1] - vCam[1]) +
                  vn.z * (points[pointers[0]][2] - vCam[2]);*/
            if (dpL < 0) {
                delta = 0;
                if (c2 !== 0) {
                    cA = Math.acos(vn.z / c2);
                }

                delta = Math.sin(cA);
//
                if (i === 1) {
                    //dpL = vn.x * vLightDirection[0] + vn.y * vLightDirection[1] + vn.z * vLightDirection[2];
                }
                r = triangles[i].rgb[0] * delta * 50;
                g = triangles[i].rgb[1] * delta * 50;
                b = triangles[i].rgb[2] * delta * 50;
                this.ctx.strokeStyle = '#000';//triangles[i].color;
               // this.ctx.fillStyle = triangles[i].color;
               this.ctx.fillStyle = 'rgb(' + (triangles[i].rgb[0] - r) + ',' + (triangles[i].rgb[1] - g) + ',' + (triangles[i].rgb[2] - b) + ')';
                //this.ctx.fillStyle = 'rgb(' + ( r) + ',' + ( g) + ',' + ( b) + ')';
                this.ctx.beginPath();

                //this.ctx.moveTo((points[pointers[0]][0]/points[pointers[0]][2]) * 300, (points[pointers[0]][1]/points[pointers[0]][2]) * 300);
                this.ctx.moveTo((points[pointers[0]][0]) * scale, -(points[pointers[0]][1]) * scale);
                for (j = 1; j < pointers.length; j++) {

                    //   this.ctx.lineTo((points[pointers[j]][0]/points[pointers[j]][2]) * 300, (points[pointers[j]][1]/points[pointers[j]][2]) * 300);
                    this.ctx.lineTo((points[pointers[j]][0]) * scale, -(points[pointers[j]][1]) * scale);
                }
                this.ctx.closePath();

                // this.ctx.stroke();
                this.ctx.fill();
                /*this.ctx.beginPath();
                this.ctx.moveTo((points[pointers[0]][0]) * scale, -(points[pointers[0]][1]) * scale);
                this.ctx.lineTo((vn.x + points[pointers[0]][0]) * scale, -(vn.y + points[pointers[0]][1]) * scale);
                this.ctx.strokeStyle ='rgb(' + (triangles[i].rgb[0] - r) + ',' + (triangles[i].rgb[1] - g) + ',' + (triangles[i].rgb[2] - b) + ')';
                this.ctx.stroke();*/
            }

            // this.ctx.fill();

        }
    }

    drawSides(sides = [], points = []) {
        if (sides.length < 1 || points.length < 1) return null;

        let i = 0;
        let j = 0;
        let pointers = [];
        let side = {};
        let vC = [];
        let cv = 0;
        let cA = 0;
        let c2 = 0;
        let delta = 0;
        let r = 0;
        let g = 0;
        let b = 0;
        for (i = 0; i < sides.length; i++) {
            pointers = sides[i].pointers;
            //cross product
            vC[0] = ((points[pointers[0]][1] - points[pointers[1]][1]) * (points[pointers[0]][2] - points[pointers[2]][2])) - ((points[pointers[0]][2] - points[pointers[1]][2]) * (points[pointers[0]][1] - points[pointers[2]][1]));
            vC[1] = ((points[pointers[0]][2] - points[pointers[1]][2]) * (points[pointers[0]][0] - points[pointers[2]][0])) - ((points[pointers[0]][0] - points[pointers[1]][0]) * (points[pointers[0]][2] - points[pointers[2]][2]));
            vC[2] = ((points[pointers[0]][0] - points[pointers[1]][0]) * (points[pointers[0]][1] - points[pointers[2]][1])) - ((points[pointers[0]][1] - points[pointers[1]][1]) * (points[pointers[0]][0] - points[pointers[2]][0]));
            c2 = (Math.sqrt(vC[0] ** 2 + vC[1] ** 2 + vC[2] ** 2));
            cv = vC[2];
            if (c2 !== 0) {
                cA = Math.acos(cv / c2);
            } else {
                cA = 0;
                yyyy
            }
            if (cv < 0) {
                delta = Math.sin(cA);
                r = (sides[i].rgb[0] - sides[i].rgbd[0]) * delta;
                g = (sides[i].rgb[1] - sides[i].rgbd[1]) * delta;
                b = (sides[i].rgb[2] - sides[i].rgbd[2]) * delta;
                this.ctx.strokeStyle = '#000';//sides[i].color;
                //this.ctx.fillStyle = sides[i].color;
                this.ctx.fillStyle = 'rgb(' + (sides[i].rgb[0] - r) + ',' + (sides[i].rgb[1] - g) + ',' + (sides[i].rgb[2] - b) + ')';
                this.ctx.beginPath();
                //this.ctx.moveTo((points[pointers[0]][0]/points[pointers[0]][2]) * 300, (points[pointers[0]][1]/points[pointers[0]][2]) * 300);
                this.ctx.moveTo((points[pointers[0]][0]) * 300, (points[pointers[0]][1]) * 300);

                for (j = 1; j < pointers.length; j++) {
                    //   this.ctx.lineTo((points[pointers[j]][0]/points[pointers[j]][2]) * 300, (points[pointers[j]][1]/points[pointers[j]][2]) * 300);
                    this.ctx.lineTo((points[pointers[j]][0]) * 300, (points[pointers[j]][1]) * 300);
                }
                this.ctx.closePath();
                this.ctx.stroke();
                this.ctx.fill();
            } else {
            }

        }
    }

    drawSPoints(points = []) {
        let l = points.length;
        this.ctx.fillStyle = "#ffff00";
        this.ctx.beginPath();
        let s = 80;

        //this.ctx.moveTo((points[pointers[0]][0]/points[pointers[0]][2]) * 300, (points[pointers[0]][1]/points[pointers[0]][2]) * 300);
        this.ctx.moveTo(points[0][0] * s, points[0][1] * s);
        for (let j = 1; j < l; j++) {

            //   this.ctx.lineTo((points[pointers[j]][0]/points[pointers[j]][2]) * 300, (points[pointers[j]][1]/points[pointers[j]][2]) * 300);
            this.ctx.lineTo(points[j][0] * s, points[j][1] * s);

        }
        this.ctx.closePath();

        this.ctx.stroke();
        this.ctx.fill();
    }


    drawAxes(rM = []) {
        let xA = [rM[0], rM[1], rM[2]];
        let yA = [rM[4], rM[5], rM[6]];
        let zA = [rM[8], rM[9], rM[10]];
        let axeScale = 200;

        this.ctx.lineWidth = 3;
        this.ctx.strokeStyle = '#ff0000';

        let one = xA[0];
        let two = xA[1];
        let three = zA[0];
        let four = zA[1];
        let a1 = xA;
        a1[3] = '#ff0000';
        let a2 = yA;
        a2[3] = '#00ff00';
        let a3 = zA;
        a3[3] = "#0000ff";
        let dum = [];
        if (a1[2] < a2[2]) {
            dum = a1;
            a1 = a2;
            a2 = dum;
        }
        if (a2[2] < a3[2]) {
            dum = a2;
            a2 = a3;
            a3 = dum;
        }
        if (a1[2] < a2[2]) {
            dum = a1;
            a1 = a2;
            a2 = dum;
        }
        this.ctx.beginPath();
        this.ctx.strokeStyle = a1[3];
        this.ctx.moveTo(0, 0);
        this.ctx.lineTo(a1[0] * axeScale, -a1[1] * axeScale);
        this.ctx.stroke();
        this.ctx.beginPath();
        this.ctx.arc(a1[0] * axeScale, -a1[1] * axeScale, 8, 0, 2 * Math.PI);
        this.ctx.fillStyle = a1[3];
        this.ctx.fill();

        this.ctx.beginPath();
        this.ctx.strokeStyle = a2[3];
        this.ctx.moveTo(0, 0);
        this.ctx.lineTo(a2[0] * axeScale, -a2[1] * axeScale);
        this.ctx.stroke();
        this.ctx.beginPath();
        this.ctx.arc(a2[0] * axeScale, -a2[1] * axeScale, 8, 0, 2 * Math.PI);
        this.ctx.fillStyle = a2[3];
        this.ctx.fill();

        this.ctx.beginPath();
        this.ctx.strokeStyle = a3[3];
        this.ctx.moveTo(0, 0);
        this.ctx.lineTo(a3[0] * axeScale, -a3[1] * axeScale);
        this.ctx.stroke();
        this.ctx.beginPath();
        this.ctx.arc(a3[0] * axeScale, -a3[1] * axeScale, 8, 0, 2 * Math.PI);
        this.ctx.fillStyle = a3[3];
        this.ctx.fill();


    }

    createReportList() {
        if (this.listId !== null) {
            return;
        } else {
            let list = document.createElement('ul');
            list.id = this.id + '-reporter';

            let canvasWrapper = document.getElementById(this.id);
            canvasWrapper.appendChild(list);

            this.listId = list.id;
        }
    }
}

export {Canvas};