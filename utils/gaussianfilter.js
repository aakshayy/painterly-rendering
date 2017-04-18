function GaussianFilter() {
    this.kernelSize = 5;
    this.kernel = new Array(this.kernelSize);
    for (var i = 0; i < this.kernelSize; i++) {
        this.kernel[i] = new Array(this.kernelSize);
    }

    var sigma = 1.0;
    var r, s = 2 * sigma * sigma;
    var sum = 0;
    var kby2 = Math.floor(this.kernelSize / 2);
    for (var x = -kby2; x <= kby2; x++) {
        for (var y = -kby2; y <= kby2; y++) {
            r = Math.sqrt(x * x + y * y);
            this.kernel[x + kby2][y + kby2] = Math.exp(-(r * r) / s) / (Math.PI * s);
            sum += this.kernel[x + kby2][y + kby2];
        }
    }

    for (var x = 0; x < this.kernelSize; x++) {
        for (var y = 0; y < this.kernelSize; y++) {
            this.kernel[x][y] /= sum;
        }
    }
}

GaussianFilter.prototype.applyFilter = function(input, output) {
    var kby2 = Math.floor(this.kernelSize / 2);
    for (var i = kby2; i < (input.width - kby2); i++) {
        for (var j = kby2; j < (input.height - kby2); j++) {
            var sum1 = 0.0; var sum2 = 0.0; var sum3 = 0.0;
            for (var x = -kby2; x <= kby2; x++) {
                for (var y = -kby2; y <= kby2; y++) {
                    sum1 += input.data[i + x][j + y][0] * this.kernel[x + kby2][y + kby2];
                    sum2 += input.data[i + x][j + y][1] * this.kernel[x + kby2][y + kby2];
                    sum3 += input.data[i + x][j + y][2] * this.kernel[x + kby2][y + kby2];
                }
            }
            output.data[i][j][0] = sum1;
            output.data[i][j][1] = sum2;
            output.data[i][j][2] = sum3;
        }
    }
}