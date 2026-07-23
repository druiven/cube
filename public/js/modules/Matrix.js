//matrix objects

class Matrix {
  theta = Math.PI / 3;
  zNear = 0.1;
  zFar = 1000;
  fov = this.theta;
  f = 0;
  w = 1.0;
  q = 0;
  coos = [];
  sien = [];

  constructor() {
    this.make_sien_coos();
  }

  make_sien_coos() {
    let h = 0;
    for (let i = 0; i < 360; i++) {
      h = (i * Math.PI) / 180;
      this.sien[i] = Math.sin(h);
      this.coos[i] = Math.cos(h);
    }
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
      [0, 0, 0, 1],
    ];
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
      [0, 0, 0, 1],
    ];
    return m;
  }

  m_projection(theta = Math.PI / 3, zF = 1000, zN = 0.1, w = 1.0, aspect = 1.0) {
    this.theta = theta;
    this.zNear = zN;
    this.zFar = zF;
    this.w = w;
    this.fov = this.theta;
    this.f = 1 / Math.tan(this.fov / 2); //field of view
    this.q = this.zFar / (this.zFar - this.zNear);
    let safeAspect = aspect;
    if (safeAspect === 0) safeAspect = 1;

    let m = [
      [this.f / safeAspect, 0, 0, 0],
      [0, this.f, 0, 0],
      [0, 0, this.q, -this.zNear * this.q],
      [0, 0, this.w, 0],
    ];
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

  normalizeDegrees(a = 0) {
    let angle = Math.floor(a % 360);
    if (angle < 0) angle += 360;
    return angle;
  }

  m_make_rx(a = 0) {
    a = this.normalizeDegrees(a);

    let m = this.m_eye();
    m[1][1] = this.coos[a]; //Cos;
    m[1][2] = -this.sien[a]; //-Sin;
    m[2][1] = this.sien[a]; //Sin;
    m[2][2] = this.coos[a]; //Cos;

    return m;
  }

  m_make_ry(a = 0) {
    a = this.normalizeDegrees(a);
    let m = this.m_eye();
    m[0][0] = this.coos[a]; //Cos;
    m[0][2] = this.sien[a]; //Sin;
    m[2][0] = -this.sien[a]; //-Sin;
    m[2][2] = this.coos[a]; //

    return m;
  }

  m_make_rz(a = 0) {
    a = this.normalizeDegrees(a);
    let m = this.m_eye();
    m[0][0] = this.coos[a]; //Cos;
    m[0][1] = -this.sien[a]; //-Sin;
    m[1][0] = this.sien[a]; //Sin;
    m[1][1] = this.coos[a]; //Cos;

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
        m[i][j] =
          m1[i][0] * m2[0][j] +
          m1[i][1] * m2[1][j] +
          m1[i][2] * m2[2][j] +
          m1[i][3] * m2[3][j];
      }
    }
    return m;
  }

  m_mul_v4(m, v) {
    if (v.length < 4) v[3] = 1;
    let result = [];
    result[0] =
      m[0][0] * v[0] + m[0][1] * v[1] + m[0][2] * v[2] + m[0][3] * v[3];
    result[1] =
      m[1][0] * v[0] + m[1][1] * v[1] + m[1][2] * v[2] + m[1][3] * v[3];
    result[2] =
      m[2][0] * v[0] + m[2][1] * v[1] + m[2][2] * v[2] + m[2][3] * v[3];
    result[3] =
      m[3][0] * v[0] + m[3][1] * v[1] + m[3][2] * v[2] + m[3][3] * v[3];
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
      
    }

    return result;
  }

  m_mul_v(v, m) {
    let result = [];
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

export { Matrix };
