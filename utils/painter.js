function Painter() {}

Painter.prototype.paint = function(inputImage, outputImage) {
    this.referenceImage = new ImageClass(inputImage.width, inputImage.height);
    this.gaussianFilter = new GaussianFilter();
    this.gaussianFilter.applyFilter(inputImage, this.referenceImage);
    outputImage.data = this.referenceImage.data;
}