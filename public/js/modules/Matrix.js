//matrix objects


class Matrix {

    theta = Math.PI / 3;
    zNear = .1;
    zFar = 1000;
    fov = this.theta;
    f = 0;
    w = 1.0;
    q = 0;

    constructor() {

    }

    m_identity() {
        // | 1 0 0 0 |
        // | 0 1 0 0 |
        // | 0 0 1 0 |
        // | 0 0 0 1 |
        let m = [
            [1, 0, 0, 0],
            [0, 1, 0, 0],
            [0, 0, 1, 0],
            [0, 0, 0, 1]
        ]
        return m;
    }

    m_eye() {
        // | 1 0 0 0 |
        // | 0 1 0 0 |
        // | 0 0 1 0 |
        // | 0 0 0 1 |
        let m = [
            [1, 0, 0, 0],
            [0, 1, 0, 0],
            [0, 0, 1, 0],
            [0, 0, 0, 1]
        ]
        return m;
    }


    m_projection(theta = Math.PI / 3, zF = 1000, zN = .1, w = 1.0) {
        this.theta = theta;
        this.zNear = zN;
        this.zFar = zF;
        this.w = w;
        this.fov = this.theta;
        this.f = 1 / (Math.tan(this.fov / 2));//field of view
        this.q = this.zFar / (this.zFar - this.zNear);

        let m = [
            [this.f, 0, 0, 0],
            [0, this.f, 0, 0],
            [0, 0, this.q, -this.zNear * this.q],
            [0, 0, this.w, 0]
        ]
        return m;
    }

    m_make_translate(tx = 0, ty = 0, tz = 0) {
        // | 1 0 0 tx |
        // | 0 1 0 ty |
        // | 0 0 1 tx |
        // | 0 0 0 1 |
        let m = this.m_eye();
        m[0][3] = tx;
        m[1][3] = ty;
        m[2][3] = tz;

        return m;
    }

    m_make_rx(a = 0) {
        if (a > 360) a -= 360;
        a *= Math.PI / 180;
        let Cos = Math.cos(a);
        let Sin = Math.sin(a);
        let m = this.m_eye();
        m[1][1] = Cos;
        m[1][2] = -Sin;
        m[2][1] = Sin;
        m[2][2] = Cos;

        return m;
    }


    m_make_ry(a = 0) {
        if (a > 360) a -= 360;
        a *= Math.PI / 180;
        let Cos = Math.cos(a);
        let Sin = Math.sin(a);
        let m = this.m_eye();
        m[0][0] = Cos;
        m[0][2] = Sin;
        m[2][0] = -Sin;
        m[2][2] = Cos;

        return m;
    }


    m_make_rz(a = 0) {
        if (a > 360) a -= 360;
        a *= Math.PI / 180;
        let Cos = Math.cos(a);
        let Sin = Math.sin(a);
        let m = this.m_eye();
        m[0][0] = Cos;
        m[0][1] = -Sin;
        m[1][0] = Sin;
        m[1][1] = Cos;

        return m;
    }

    m_rotate(axe = 0, m = [], g = 0) {
        let rm = [];
        let result = [];
        switch (axe) {
            case 0:
                rm = this.m_make_rx(g);
                break;
            case 1:
                rm = this.m_make_ry(g);
                break;
            case 2:
                rm = this.m_make_rz(g);
                break;
        }
        result = this.m_mul_m(rm, m);
        return result;
    }


    m_make_scale(sx = 1, sy = 1, sz = 1) {
        // | sx  0  0  0 |
        // |  0 sy  0  0 |
        // |  0  0 sz  0 |
        // |  0  0  0  1 |
        let m = this.m_eye();
        m[0][0] = sx;
        m[1][1] = sy;
        m[2][2] = sz;
        return m;
    }

    m_mul_m(m1, m2) {
        let m = this.m_eye();
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                m[i][j] = m1[i][0] * m2[0][j] + m1[i][1] * m2[1][j] + m1[i][2] * m2[2][j] + m1[i][3] * m2[3][j];
            }
        }
        return m;
    }

    /*

mat4_t mat4_mul_mat4(mat4_t a, mat4_t b) {
    mat4_t m;
    for (int i = 0; i < 4; i++) {
        for (int j = 0; j < 4; j++) {
            m.m[i][j] = a.m[i][0] * b.m[0][j] + a.m[i][1] * b.m[1][j] + a.m[i][2] * b.m[2][j] + a.m[i][3] * b.m[3][j];
        }
    }
    return m;
}


     */


    m_mul_v4(m, v) {
        if (v.length < 4) v[3] = 1;
        let result = [];
        result[0] = m[0][0] * v[0] + m[0][1] * v[1] + m[0][2] * v[2] + m[0][3] * v[3];
        result[1] = m[1][0] * v[0] + m[1][1] * v[1] + m[1][2] * v[2] + m[1][3] * v[3];
        result[2] = m[2][0] * v[0] + m[2][1] * v[1] + m[2][2] * v[2] + m[2][3] * v[3];
        result[3] = m[3][0] * v[0] + m[3][1] * v[1] + m[3][2] * v[2] + m[3][3] * v[3];
        return result;
    }

    m_mul_v3(m, v) {
        let result = [];

        result[0] = m[0][0] * v[0] + m[0][1] * v[1] + m[0][2] * v[2];
        result[1] = m[1][0] * v[0] + m[1][1] * v[1] + m[1][2] * v[2];
        result[2] = m[2][0] * v[0] + m[2][1] * v[1] + m[2][2] * v[2];

        return result;
    }

    m_mul_array_v3(v, m) {
        let result = [];
        for (let i = 0; i < v.length; i++) {
            result[i] = [];
            result[i][0] = m[0][0] * v[i][0] + m[0][1] * v[i][1] + m[0][2] * v[i][2];
            result[i][1] = m[1][0] * v[i][0] + m[1][1] * v[i][1] + m[1][2] * v[i][2];
            result[i][2] = m[2][0] * v[i][0] + m[2][1] * v[i][1] + m[2][2] * v[i][2];
            /*result[i][0] = m[0][0] * v[i][0] + m[1][0] * v[i][1] + m[2][0] * v[i][2];
            result[i][1] = m[0][1] * v[i][0] + m[1][1] * v[i][1] + m[2][1] * v[i][2];
            result[i][2] = m[0][2] * v[i][0] + m[1][2] * v[i][1] + m[2][2] * v[i][2];*/
        }

        return result;
    }

    m_mul_v(v, m) {
        let result = [];
        /*result[i][0] = m[0][0] * v[i][0] + m[0][1] * v[i][1] + m[0][2] * v[i][2];
 result[i][1] = m[1][0] * v[i][0] + m[1][1] * v[i][1] + m[1][2] * v[i][2];
 result[i][2] = m[2][0] * v[i][0] + m[2][1] * v[i][1] + m[2][2] * v[i][2];*/
        result[0] = m[0][0] * v[0] + m[1][0] * v[1] + m[2][0] * v[2];
        result[1] = m[0][1] * v[0] + m[1][1] * v[1] + m[2][1] * v[2];
        result[2] = m[0][2] * v[0] + m[1][2] * v[1] + m[2][2] * v[2];


        return result;
    }

    m_mul_array_own_v3(v, m) {
        let result = [];
        for (let i = 0; i < v.length; i++) {
            result[i] = [];
            result[i][0] = m[0][0] * v[i][0] + m[1][0] * v[i][1] + m[2][0] * v[i][2];
            result[i][1] = m[0][1] * v[i][0] + m[1][1] * v[i][1] + m[2][1] * v[i][2];
            result[i][2] = m[0][2] * v[i][0] + m[1][2] * v[i][1] + m[2][2] * v[i][2];
        }

        return result;
    }
}

export {Matrix}