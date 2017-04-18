function Painter() {
    this.brushes = new Array();
    this.brushes.push(Brush.roundBrush(64));
    this.brushes.push(Brush.roundBrush(32));
    this.brushes.push(Brush.roundBrush(16));
    this.brushes.push(Brush.roundBrush(8));
}

Painter.prototype.paint = function(inputImage) {
    this.referenceImage = new ImageClass(inputImage.width, inputImage.height);
    this.gaussianFilter = new GaussianFilter();
    this.gaussianFilter.applyFilter(inputImage, this.referenceImage);
    this.canvas = new ImageClass(inputImage.width, inputImage.height);
    for(var i = 0; i < this.brushes.length; i++) {
        this.paintLayer(this.brushes[i]);
    }
    return this.canvas;
}

Painter.prototype.paintLayer = function(brush) {
    var difference = ImageClass.diffImages(this.canvas, this.referenceImage);
    var gridSize = Math.floor(brush.size / 2);
    var strokes = new Array();
    for (var w = 0; w < (this.canvas.width - gridSize); w+= gridSize) {
        for (var h = 0; h < (this.canvas.height - gridSize); h+= gridSize) {
            var maxError = 0;
            var maxX, maxY;
            var totalError = 0;
            var threshold = 0;
            for (var x = w; x < w + gridSize; x++) {
                for (var y = h; y < h + gridSize; y++) {
                    totalError += difference.data[x][y][0];
                    if(difference.data[x][y][0] > maxError) {
                        maxX = x;
                        maxY = y;
                        maxError = difference.data[x][y][0];
                    }
                }
            }
            totalError /= (gridSize * gridSize);
            if (totalError > threshold) {
                strokes.push([maxX, maxY]);
            }
        }
    }
    console.log("Stroke count: ", strokes.length);
    for(var i = 0; i < strokes.length; i++) {
        var x = strokes[i][0], y = strokes[i][1];
        this.makeStroke(x, y, this.referenceImage.data[x][y], brush)
    }
}

Painter.prototype.makeStroke = function(cx, cy, color, brush) {
    for (var i = 0; i < brush.x_stroke.length; i++) {
        var x = brush.x_stroke[i] + cx;
        var y = brush.y_stroke[i] + cy;
        if (x < 0 || x >= this.canvas.width || y < 0 || y >= this.canvas.height)
            continue;
        this.canvas.data[x][y][0] = color[0];
        this.canvas.data[x][y][1] = color[1];
        this.canvas.data[x][y][2] = color[2];
    }
}