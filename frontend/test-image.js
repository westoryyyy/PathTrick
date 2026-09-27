/* eslint-disable */
const fs = require('fs');
const PNG = require('/tmp/node_modules/pngjs').PNG;

fs.createReadStream('/Users/paulinasmacbook/pathrickFrontEnd/public/Walk(down).png')
  .pipe(new PNG())
  .on('parsed', function() {
    let minX = this.width, maxX = 0;
    let minY = this.height, maxY = 0;
    let found = false;

    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        let idx = (this.width * y + x) << 2;
        let alpha = this.data[idx + 3];
        if (alpha > 0) { // non-transparent pixel
          found = true;
          if (x < minX) minX = x;
          if (x > maxX) maxX = x;
          if (y < minY) minY = y;
          if (y > maxY) maxY = y;
        }
      }
    }

    if (!found) {
      console.log('Image is completely transparent!');
    } else {
      console.log(`Visible bounds: X: ${minX} to ${maxX} (width: ${maxX - minX + 1})`);
      console.log(`Visible bounds: Y: ${minY} to ${maxY} (height: ${maxY - minY + 1})`);
      console.log(`Total Image Size: ${this.width} x ${this.height}`);
    }
  });
