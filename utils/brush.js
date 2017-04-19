function distanceSquare(x1, y1, x2, y2) {
    var dx = x1 - x2;
    var dy = y1 - y2;
    return dx * dx + dy * dy;
}

function Brush() {}

Brush.roundBrush = function(size) {
    var b = new Brush();
    b.size = size;
    b.minStrokeLength = 4;
    b.maxStrokeLength = 12;
    b.x_stroke = [];
    b.y_stroke = [];
    var r = Math.floor(size / 2);
    for (var i = 0; i <= size; i++) {
        for (var j = 0; j <= size; j++) {
            if (distanceSquare(i, j, r, r) <= (r * r)) {
                b.x_stroke.push(i - r);
                b.y_stroke.push(j - r);
            }
        }
    }
    return b;
}