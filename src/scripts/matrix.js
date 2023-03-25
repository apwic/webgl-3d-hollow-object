function multiply(m1, m2) {
    var m3 = [];
    var currElm = 0;
    for (var i = 0; i < 4; i++) {
        for (var j = 0; j < 4; j++) {
            currElm = 0;
            for (var k = 0; k < 4; k++) {
                currElm += m2[4 * i + k] * m1[4 * k + j];
            }
            m3.push(currElm);
        }
    }
    return m3;
}

function getPerspectiveProjection(angle, a, zMin, zMax) {
    let ang = Math.tan((angle * .5) * Math.PI / 180);
    return [
        0.5 / ang, 0, 0, 0,
        0, 0.5 * a / ang, 0, 0,
        0, 0, -(zMax + zMin) / (zMax - zMin), -1,
        0, 0, (-2 * zMax * zMin) / (zMax - zMin), 0
    ];
}

function getObliqueProjection(aspectRatio) {
    // Assumed near and far are 1 and 100 respectively
    const near = 1; 
    const far = 100;
    const fovyAngle = 45; // in degrees, default
    const fovy = fovyAngle * Math.PI / 180; // in radians
    
    const top = near * Math.tan(fovy / 2);
    const right = top * aspectRatio;
    const left = -right;
    const bottom = -top;

    const obliqueMatrix = [
        2 / (right - left), 0, 0, -(right + left) / (right - left),
        0, 2 / (top - bottom), 0, -(top + bottom) / (top - bottom),
        0, 0, -2 / (far - near), -(far + near) / (far - near),
        0, 0, 0, 1,
    ];

    const shearFactor = 0.5;

    const shearMatrix = [
        1, 0, shearFactor, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1,
    ];

    return multiply(obliqueMatrix, shearMatrix);
}

function getOrthographicProjection(aspectRatio) {    
    const far = 100;
    const near = -far; 
    // // const fovyAngle = 45; // in degrees, default
    // // const fovy = fovyAngle * Math.PI / 180; // in radians
    
    const top = aspectRatio;
    const right = aspectRatio;
    const left = -right;
    const bottom = -top;

    // const depth = 500;
    // console.log(width, height, depth);

    const orthMatrix = [
        2 / (right - left), 0, 0, 0,
        0, 2 / (top - bottom), 0, 0,
        0, 0, -2 / (far - near), 0,
        0, 0, 0, 1,
    ];

    return orthMatrix;
}

function scaleMatrix(sx, sy, sz){
    return [
        sx, 0, 0, 0,
        0, sy, 0, 0,
        0, 0, sz, 0,
        0, 0, 0, 1,
    ];
}

function translationMatrix(tx, ty, tz) {
    return [
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        tx, ty, tz, 1
    ];
}

function rotateZ(m, angle) {
    let c = Math.cos(angle);
    let s = Math.sin(angle);
    let mv0 = m[0],
        mv4 = m[4],
        mv8 = m[8];

    m[0] = c * m[0] - s * m[1];
    m[4] = c * m[4] - s * m[5];
    m[8] = c * m[8] - s * m[9];

    m[1] = c * m[1] + s * mv0;
    m[5] = c * m[5] + s * mv4;
    m[9] = c * m[9] + s * mv8;
}

function rotateX(m, angle) {
    let c = Math.cos(angle);
    let s = Math.sin(angle);
    let mv1 = m[1],
        mv5 = m[5],
        mv9 = m[9];

    m[1] = m[1] * c - m[2] * s;
    m[5] = m[5] * c - m[6] * s;
    m[9] = m[9] * c - m[10] * s;

    m[2] = m[2] * c + mv1 * s;
    m[6] = m[6] * c + mv5 * s;
    m[10] = m[10] * c + mv9 * s;
}

function rotateY(m, angle) {
    let c = Math.cos(angle);
    let s = Math.sin(angle);
    let mv0 = m[0],
        mv4 = m[4],
        mv8 = m[8];

    m[0] = c * m[0] + s * m[2];
    m[4] = c * m[4] + s * m[6];
    m[8] = c * m[8] + s * m[10];

    m[2] = c * m[2] - s * mv0;
    m[6] = c * m[6] - s * mv4;
    m[10] = c * m[10] - s * mv8;
}

function rotateMatrix(angleX, angleY, angleZ) {
    var m = [
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1
    ];
    rotateX(m, angleX);
    rotateY(m, angleY);
    rotateZ(m, angleZ);
    return m;
}