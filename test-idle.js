/* eslint-disable */
const fs = require('fs');
const PNG = require('/tmp/node_modules/pngjs').PNG;
fs.createReadStream('/Users/paulinasmacbook/pathrickFrontEnd/public/idle.png')
  .pipe(new PNG())
  .on('parsed', function() {
    let minX = this.width, maxX = 0;
    let minY = this.height, maxY = 0;
    let found = false;
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        let idx = (this.width * y + x) << 2;
        if (this.data[idx + 3] > 0) {
          found = true;
          if (x < minX) minX = x;
          if (x > maxX) maxX = x;
          if (y < minY) minY = y;
          if (y > maxY) maxY = y;
        }
      }
    }
    if (!found) console.log('Image is empty');
    else console.log(`Visible bounds: X: ${minX} to ${maxX}, Y: ${minY} to ${maxY}`);
  });
