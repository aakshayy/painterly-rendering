function Painter() {
}

Painter.prototype.initializeBrushes = function() {
    this.brushes = new Array();
    for (var i = 0; i < this.numberOfLayers; i++) {
        this.brushes.push(Brush.roundBrush(this.brushSizes[i]));
    }
}

Painter.prototype.paint = function(inputImage) {
    this.initializeBrushes();

    this.referenceImage = new ImageClass(inputImage.width, inputImage.height);
    this.gradientImage = new ImageClass(inputImage.width, inputImage.height);
    this.canvas = new ImageClass(inputImage.width, inputImage.height);
    this.outputImage = new ImageClass(inputImage.width, inputImage.height);

    this.gaussianFilter = new GaussianFilter();
    this.sobelFilter = new SobelFilter();
    
    this.gaussianFilter.applyFilter(inputImage, this.referenceImage);
    this.sobelFilter.applyFilter(this.referenceImage, this.gradientImage);

    this.layers = [];
    for(var i = 0; i < this.brushes.length; i++) {
        this.paintLayer(this.brushes[i]);
        this.layers.push(ImageClass.copyImage(this.canvas));
    }

    this.gaussianFilter.applyFilter(this.canvas, this.outputImage)

    return this.outputImage;
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
            if (totalError > this.threshold) {
                strokes.push([maxX, maxY]);
            }
        }
    }
    console.log("Stroke count: ", strokes.length);
    for(var i = 0; i < strokes.length; i++) {
        var x = strokes[i][0], y = strokes[i][1];
        this.makeSplineStroke(x, y, this.referenceImage.data[x][y], brush)
    }
}

Painter.prototype.makeStroke = function(cx, cy, color, brush) {
    for (var i = 0; i < brush.x_stroke.length; i++) {
        var x = brush.x_stroke[i] + cx;
        var y = brush.y_stroke[i] + cy;
        if (x < 0 || x >= this.canvas.width || y < 0 || y >= this.canvas.height)
            continue;
        //this.canvas.data[x][y][0] = this.canvas.data[x][y][0] * (1 - this.alpha) + color[0] * this.alpha;
        //this.canvas.data[x][y][1] = this.canvas.data[x][y][1] * (1 - this.alpha) + color[1] * this.alpha;
        //this.canvas.data[x][y][2] = this.canvas.data[x][y][2] * (1 - this.alpha) + color[2] * this.alpha;
        this.canvas.data[x][y][0] = color[0];
        this.canvas.data[x][y][1] = color[1];
        this.canvas.data[x][y][2] = color[2];
    }
}

Painter.prototype.distanceSquareColor = function(c1, c2) {
    var dr = c1[0] - c2[0];
    var dg = c1[1] - c2[1];
    var db = c1[2] - c2[2];
    return dr * dr + dg * dg + db * db;
}

Painter.prototype.makeSplineStroke = function(cx, cy, color, brush) {
    var x = cx;
    var y = cy;
    var lastdx = 0, lastdy = 0;
    for (var i = 1; i < this.maxStrokeLength; i++) {
        this.makeStroke(x, y, color, brush);

        var diffCanvasReference = this.distanceSquareColor(this.canvas.data[x][y], this.referenceImage.data[x][y]);
        var diffBrushReference = this.distanceSquareColor(color, this.referenceImage.data[x][y]);
        if (i > this.minStrokeLength && diffBrushReference > diffCanvasReference) {
            break;
        }

        if (this.gradientImage.data[x][y].mag == 0) {
            break;
        }
        var dx = -this.gradientImage.data[x][y].gy;
        var dy = this.gradientImage.data[x][y].gx;

        if (lastdx * dx + lastdy * dy < 0) {
            //dx = -dx;
            //dy = -dy;
        }
        
        var fc = 0.25;

        dx = fc * dx + (1 - fc) * lastdx;
        dy = fc * dy + (1 - fc) * lastdy;

        var d = Math.sqrt(dx * dx + dy * dy);
        dx /= d;
        dy /= d;

        x = Math.round(x + (brush.size / 2) * dx);
        y = Math.round(y + (brush.size / 2) * dy);

        if (x < 0 || x >= this.canvas.width || y < 0 || y >= this.canvas.height)
            break;
        
        lastdx = dx;
        lastdy = dy;
    }
}