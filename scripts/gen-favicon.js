/**
 * Generate a minimal 16x16 favicon.ico (purple square) so /favicon.ico doesn't 404.
 * Run: node scripts/gen-favicon.js
 */
const fs = require('fs');
const path = require('path');

// ICO: 6-byte header + 16-byte dir entry + 40-byte BITMAPINFOHEADER + 16*16*4 BMP (32bpp, bottom-up)
const header = Buffer.alloc(6);
header.writeUInt16LE(0, 0);   // reserved
header.writeUInt16LE(1, 2);   // type 1 = ICO
header.writeUInt16LE(1, 4);   // count 1

const dirEntry = Buffer.alloc(16);
dirEntry[0] = 16;   // width
dirEntry[1] = 16;   // height
dirEntry[2] = 0;    // color count (0 = 256+)
dirEntry[3] = 0;    // reserved
dirEntry.writeUInt16LE(1, 4);  // planes
dirEntry.writeUInt16LE(32, 6); // bpp
dirEntry.writeUInt32LE(1064, 8);  // size of (BITMAPINFOHEADER + pixels) = 40 + 1024
dirEntry.writeUInt32LE(22, 12);  // offset to image data

// BITMAPINFOHEADER 40 bytes
const bih = Buffer.alloc(40);
bih.writeUInt32LE(40, 0);   // size
bih.writeInt32LE(16, 4);    // width
bih.writeInt32LE(32, 8);    // height (16*2 for AND mask)
bih.writeUInt16LE(1, 12);   // planes
bih.writeUInt16LE(32, 14);  // bit count
bih.writeUInt32LE(0, 16);   // compression (0 = BI_RGB)

// 16x16 32bpp BGRA, bottom-up (first row = bottom of icon)
const pixels = Buffer.alloc(1024);
const purple = 0x6C5CE7; // #6C5CE7
const dark = 0x0F0A1A;   // #0F0A1A
for (let y = 15; y >= 0; y--) {
  for (let x = 0; x < 16; x++) {
    const i = ((15 - y) * 16 + x) * 4;
    const usePurple = x >= 2 && x < 14 && y >= 4 && y < 12;
    const c = usePurple ? purple : dark;
    pixels[i] = c & 0xff;           // B
    pixels[i + 1] = (c >> 8) & 0xff;  // G
    pixels[i + 2] = (c >> 16) & 0xff; // R
    pixels[i + 3] = 255;
  }
}

const ico = Buffer.concat([header, dirEntry, bih, pixels]);
const out = path.join(__dirname, '..', 'public', 'favicon.ico');
fs.writeFileSync(out, ico);
console.log('Wrote', out);
console.log('Favicon size:', ico.length, 'bytes');
