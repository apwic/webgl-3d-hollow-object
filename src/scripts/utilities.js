function hexToRGBColor(hex) {
    var bigint = parseInt(hex.replace("#", ""), 16);
    var r = (bigint >> 16) & 255;
    var g = (bigint >> 8) & 255;
    var b = bigint & 255;
    return [r / 255, g / 255, b / 255];
}

function rgbToHexColor(rgb) {
    var r = Math.floor(rgb[0] * 255);
    var g = Math.floor(rgb[1] * 255);
    var b = Math.floor(rgb[2] * 255);
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}