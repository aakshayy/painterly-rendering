function ImageClass(w, h) {
    this.width = w;
    this.height = h;
    this.data = new Array(w);
    for (var i = 0; i < w; i ++) {
        this.data[i] = new Array(h);
        for (var j = 0; j < h; j++) {
            this.data[i][j] = [0, 0, 0, 255];
        }
    }
}