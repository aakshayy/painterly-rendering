Presets = function() {
}

Presets.OilPainting = function() {
    var painter = new Painter();
    painter.numberOfLayers = 4;
    painter.threshold = 20;
    painter.alpha = 1.0;
    painter.brushSizes = [32, 16, 8, 4, 2];
    painter.minStrokeLength = 4;
    painter.maxStrokeLength = 12;
    return painter;
}

Presets.PointPainting = function() {
    var painter = new Painter();
    painter.numberOfLayers = 1;
    painter.threshold = 25;
    painter.alpha = 1.0;
    painter.brushSizes = [16, 8, 4, 2, 2];
    painter.minStrokeLength = 1;
    painter.maxStrokeLength = 2;
    return painter;
}

Presets.ColoristWash = function() {
    var painter = new Painter();
    painter.numberOfLayers = 2;
    painter.threshold = 50;
    painter.alpha = 0.7;
    painter.brushSizes = [16, 8, 4, 2, 2];
    painter.minStrokeLength = 2;
    painter.maxStrokeLength = 4;
    return painter;
}

Presets.ColorPencil = function() {
    var painter = new Painter();
    painter.numberOfLayers = 2;
    painter.threshold = 25;
    painter.alpha = 1.0;
    painter.brushSizes = [2, 2, 2, 1, 1];
    painter.minStrokeLength = 8;
    painter.maxStrokeLength = 12;
    return painter;
}