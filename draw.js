function Renderer(context1, context2) {
    this.context1 = context1;
    this.context2 = context2;
    this.imageLoaded = false;
    this.currentPainter = new Painter();
    this.currentPainter.numberOfLayers = document.getElementById("layers").innerText;
    this.currentPainter.threshold = document.getElementById("threshold").innerText;
    this.currentPainter.alpha = document.getElementById("alpha").innerText;
    this.currentPainter.brushSizes = [32, 16, 8, 4, 2];
    this.currentPainter.minStrokeLength = parseInt(document.getElementById("amount").innerText.split(" ")[0]);
    this.currentPainter.maxStrokeLength = parseInt(document.getElementById("amount").innerText.split(" ")[2]);
}

Renderer.prototype.putPixel = function(x, y, color) {
    var pixelindex = (y * this.imagedata.width + x) * 4;
    this.imagedata.data[pixelindex] = color[0];
    this.imagedata.data[pixelindex + 1] = color[1];
    this.imagedata.data[pixelindex + 2] = color[2];
    this.imagedata.data[pixelindex + 3] = color[3];
}

Renderer.prototype.getPixel = function(x, y) {
    var pixelindex = (y * this.imagedata.width + x) * 4;
    return [this.imagedata.data[pixelindex], this.imagedata.data[pixelindex + 1], this.imagedata.data[pixelindex + 2]];
}

Renderer.prototype.render = function(context, image) {
    var w = image.width;
    var h = image.height;
    for(x = 0; x < w; x++) {
        for(y = 0; y < h; y++) {
            this.putPixel(x, y, image.data[x][y]);
        }
    }
    context.putImageData(this.imagedata, 0, 0);
}

Renderer.prototype.updateMenu = function() {
    var numberOfLayers = this.currentPainter.layers.length;
    var select1 = document.getElementById("image1");
    var select2 = document.getElementById("image2");
    select1.options.length = 0;
    select2.options.length = 0;
    select1.options[select1.options.length] = new Option('Original Image', 'originalImage');
    select2.options[select2.options.length] = new Option('Original Image', 'originalImage');
    for (var i = 1; i < numberOfLayers; i++) {
        select1.options[select1.options.length] = new Option('Layer ' + i, 'layer' + i);
        select2.options[select2.options.length] = new Option('Layer ' + i, 'layer' + i);
    }
    select1.options[select1.options.length] = new Option('Final Image', 'finalImage');
    select2.options[select2.options.length] = new Option('Final Image', 'finalImage');
    select1.options[select1.options.length] = new Option('Gradient', 'gradient');
    select2.options[select2.options.length] = new Option('Gradient', 'gradient');
    select1.selectedIndex = select2.options.length - 2;
    select2.selectedIndex = 0;
}

Renderer.prototype.draw = function() {
    var w = this.context1.canvas.width;
    var h = this.context1.canvas.height;
    this.imagedata = this.context2.getImageData(0, 0, w, h);
    this.inputImage = new ImageClass(w, h);
    for(x = 0; x < w; x++) {
        for(y = 0; y < h; y++) {
            var color = this.getPixel(x, y);
            this.inputImage.data[x][y][0] = color[0];
            this.inputImage.data[x][y][1] = color[1];
            this.inputImage.data[x][y][2] = color[2];
        }
    }
    
    this.outputImage = this.currentPainter.paint(this.inputImage);

    this.render(this.context1, this.outputImage);
    this.updateMenu();
}

function changeImage() {
    var option1 = document.getElementById("image1").value;
    var option2 = document.getElementById("image2").value;
    if(option1 == 'originalImage') renderer.render(renderer.context1, renderer.inputImage);
    else if(option1 == 'finalImage') renderer.render(renderer.context1, renderer.outputImage);
    else if(option1 == 'gradient') renderer.render(renderer.context1, renderer.currentPainter.gradientImage);
    else if(option1.indexOf("layer") != -1) renderer.render(renderer.context1, renderer.currentPainter.layers[parseInt(option1[5]) - 1]);
    if(option2 == 'originalImage') renderer.render(renderer.context2, renderer.inputImage);
    else if(option2 == 'finalImage') renderer.render(renderer.context2, renderer.outputImage);
    else if(option2 == 'gradient') renderer.render(renderer.context2, renderer.currentPainter.gradientImage);
    else if(option2.indexOf("layer") != -1) renderer.render(renderer.context2, renderer.currentPainter.layers[parseInt(option2[5]) - 1]);
}

function changeNumberOfLayers(numberOfLayers) {
    renderer.currentPainter.numberOfLayers = numberOfLayers;
}

function changeAlpha(alpha) {
    renderer.currentPainter.alpha = alpha;
}

function changeStrokeLength(minLen, maxLen) {
    renderer.currentPainter.minStrokeLength = minLen;
    renderer.currentPainter.maxStrokeLength = maxLen;
}

function changeBrushSize(index, value) {
    renderer.currentPainter.brushSizes[index] = value;
}

function changeThreshold(threshold) {
    renderer.currentPainter.threshold = threshold;
}

function repaint() {
    if (renderer.imageLoaded == false) 
        return;
    renderer.outputImage = renderer.currentPainter.paint(renderer.inputImage);
    renderer.render(renderer.context1, renderer.outputImage);
    renderer.updateMenu();
}

function loadPreset() {
    var e = document.getElementById("presets");
    var presetName = e.options[e.selectedIndex].value;
    var presets = {}
    presets["Oil Painting"] = Presets.OilPainting();
    presets["Point Painting"] = Presets.PointPainting();
    presets["Colorist Wash"] = Presets.ColoristWash();
    presets["Color Pencil"] = Presets.ColorPencil();
    renderer.currentPainter = presets[presetName];
    repaint();
}


var renderer;

function main() {
    var canvas1 = document.getElementById("canvas1");
    var context1 = canvas1.getContext("2d");
    var canvas2 = document.getElementById("canvas2");
    var context2 = canvas2.getContext("2d");
    var img = document.createElement("img");
    renderer = new Renderer(context1, context2);

    context1.fillText("Drag and drop an image on either of the canvases", 80, 200);
    context2.fillText("Drag and drop an image on either of the canvases", 80, 200);

    var loadImageListener = function() {
        context1.clearRect(0, 0, canvas1.width, canvas1.height);
        context2.clearRect(0, 0, canvas2.width, canvas2.height);
        canvas1.width = canvas2.width = this.naturalWidth;
        canvas1.height = canvas2.height = this.naturalHeight;
        context2.drawImage(this, 0, 0);
        renderer.draw();
        renderer.imageLoaded = true;
    }

    img.addEventListener("load", loadImageListener, false);

    var dragoverListener = function(evt) {
        evt.preventDefault();
    }

    var dropListener = function(evt) {
        var files = evt.dataTransfer.files;
        if(files.length > 0) {
            var file = files[0];
            if (typeof FileReader !== "undefined" && file.type.indexOf("image") != -1) {
                var reader = new FileReader();
                reader.onload = function(evt) {
                    img.src = event.target.result;
                }
                reader.readAsDataURL(file);
            }
        }
        evt.preventDefault();
    }

    canvas1.addEventListener("dragover", dragoverListener, false);
    canvas2.addEventListener("dragover", dragoverListener, false);
    canvas1.addEventListener("drop", dropListener, false);
    canvas2.addEventListener("drop", dropListener, false);
}