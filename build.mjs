import fs from 'fs';
import path from 'path';
import zlib from 'zlib';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distDir = path.join(__dirname, 'dist');


function createCompassPng(size, isMaskable = false) {
  const width = size;
  const height = size;
  const rawData = Buffer.alloc(height * (1 + width * 4));
  const cx = width / 2;
  const cy = height / 2;
  const scale = isMaskable ? 0.72 : 0.86;
  const outerR = (size / 2) * scale;
  const innerR = outerR * 0.76;

  for (let y = 0; y < height; y++) {
    const rowStart = y * (1 + width * 4);
    rawData[rowStart] = 0; // filter type 0
    for (let x = 0; x < width; x++) {
      const idx = rowStart + 1 + x * 4;
      const dx = x - cx;
      const dy = y - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Deep navy glassy background (#081226 -> #0f172a)
      let r = 10;
      let g = 20;
      let b = 42;
      let a = 255;

      // Subtle cyan radial glow in center
      const glow = Math.max(0, 1 - dist / (size * 0.55));
      r = Math.min(255, Math.round(r + glow * 8));
      g = Math.min(255, Math.round(g + glow * 65));
      b = Math.min(255, Math.round(b + glow * 115));

      // Outer compass ring (#06b6d4 to #38bdf8)
      if (dist <= outerR && dist >= innerR) {
        r = 14;
        g = 165;
        b = 233;
      }

      // Compass diamond needle
      const nx = Math.abs(dx);
      const ny = Math.abs(dy);
      if (ny / (outerR * 0.68) + nx / (outerR * 0.24) <= 1.0) {
        if (dy < 0) {
          // North needle: bright cyan (#22d3ee)
          r = 34;
          g = 211;
          b = 238;
        } else {
          // South needle: electric blue (#3b82f6)
          r = 59;
          g = 130;
          b = 246;
        }
      }

      // Center pivot dot
      if (dist <= outerR * 0.1) {
        r = 255;
        g = 255;
        b = 255;
      }

      rawData[idx] = r;
      rawData[idx + 1] = g;
      rawData[idx + 2] = b;
      rawData[idx + 3] = a;
    }
  }

  function crc32(buf) {
    let c = 0xffffffff;
    for (let i = 0; i < buf.length; i++) {
      c ^= buf[i];
      for (let k = 0; k < 8; k++) {
        c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
      }
    }
    return (c ^ 0xffffffff) >>> 0;
  }

  function chunk(type, data) {
    const len = Buffer.alloc(4);
    len.writeUInt32BE(data.length, 0);
    const typeBuf = Buffer.from(type, 'ascii');
    const crcBuf = Buffer.alloc(4);
    const combined = Buffer.concat([typeBuf, data]);
    crcBuf.writeUInt32BE(crc32(combined), 0);
    return Buffer.concat([len, combined, crcBuf]);
  }

  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // RGBA
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;

  const idat = zlib.deflateSync(rawData);
  const iend = Buffer.alloc(0);

  return Buffer.concat([
    signature,
    chunk('IHDR', ihdr),
    chunk('IDAT', idat),
    chunk('IEND', iend),
  ]);
}

// Ensure PWA PNG icons exist in assets/icons/
const iconsDir = path.join(__dirname, 'assets', 'icons');
fs.mkdirSync(iconsDir, { recursive: true });
fs.writeFileSync(path.join(iconsDir, 'apple-touch-icon.png'), createCompassPng(180, false));
fs.writeFileSync(path.join(iconsDir, 'pwa-192x192.png'), createCompassPng(192, false));
fs.writeFileSync(path.join(iconsDir, 'pwa-512x512.png'), createCompassPng(512, false));
fs.writeFileSync(path.join(iconsDir, 'pwa-maskable-512x512.png'), createCompassPng(512, true));

fs.rmSync(distDir, { recursive: true, force: true });
fs.mkdirSync(distDir, { recursive: true });

for (const entry of fs.readdirSync(__dirname)) {
  if (entry.endsWith('.html') || entry === 'manifest.json' || entry === 'sw.js') {
    fs.copyFileSync(path.join(__dirname, entry), path.join(distDir, entry));
  }
}

for (const dir of ['assets', 'css', 'js']) {
  const src = path.join(__dirname, dir);
  if (fs.existsSync(src)) {
    fs.cpSync(src, path.join(distDir, dir), { recursive: true });
  }
}

console.log('Static build complete (with PWA icons & manifest) -> dist/');
