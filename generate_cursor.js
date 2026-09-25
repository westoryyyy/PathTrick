const fs = require('fs');
const pixels = [
  "B . . . . . . . . . . .",
  "B B . . . . . . . . . .",
  "B H B . . . . . . . . .",
  "B H F B . . . . . . . .",
  "B H F F B . . . . . . .",
  "B H F F F B . . . . . .",
  "B H F F F F B . . . . .",
  "B H F F F F F B . . . .",
  "B H F F F F F F B . . .",
  "B H F F F F F F F B . .",
  "B H F F F F F F F F B .",
  "B H F F F F B B B B B .",
  "B H F B B F B . . . . .",
  "B H B . B F B . . . . .",
  "B B . . . B F B . . . .",
  "B . . . . B F B . . . .",
  ". . . . . . B B . . . ."
];

const colorMap = {
  "B": "#3b261b",
  "F": "#fbbf24",
  "H": "#fde68a"
};

let rects = "";
for(let y=0; y<pixels.length; y++) {
  const row = pixels[y].split(" ");
  for(let x=0; x<row.length; x++) {
    const c = row[x];
    if(c !== ".") {
      rects += `  <rect x="${x}" y="${y}" width="1.05" height="1.05" fill="${colorMap[c]}" />\n`;
    }
  }
}

const svg = `<svg width="32" height="34" viewBox="0 0 12 17" xmlns="http://www.w3.org/2000/svg">\n${rects}</svg>`;
fs.writeFileSync('public/cursor.svg', svg);
