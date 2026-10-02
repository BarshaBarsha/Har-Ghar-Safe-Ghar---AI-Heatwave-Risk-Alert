import fs from 'fs';
import path from 'path';
import zlib from 'zlib';

function createSolidPNG(width, height, r, g, b, a = 255) {
  // Simple valid PNG encoder using zlib
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  function chunk(type, data) {
    const len = Buffer.alloc(4);
    len.writeUInt32BE(data.length, 0);
    const typeBuf = Buffer.from(type, 'ascii');
    const body = Buffer.concat([typeBuf, data]);
    const crc = crc32(body);
    const crcBuf = Buffer.alloc(4);
    crcBuf.writeUInt32BE(crc, 0);
    return Buffer.concat([len, body, crcBuf]);
  }

  // Table for CRC-32
  const crcTable = [];
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) {
      if (c & 1) c = 0xedb88320 ^ (c >>> 1);
      else c = c >>> 1;
    }
    crcTable[n] = c;
  }

  function crc32(buf) {
    let crc = 0xffffffff;
    for (let i = 0; i < buf.length; i++) {
      crc = crcTable[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
    }
    return (crc ^ 0xffffffff) >>> 0;
  }

  // IHDR
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // color type RGBA
  ihdr[10] = 0; // compression
  ihdr[11] = 0; // filter
  ihdr[12] = 0; // interlace

  // Raw image data with filter byte 0 per scanline
  const rowSize = 1 + width * 4;
  const rawData = Buffer.alloc(height * rowSize);
  for (let y = 0; y < height; y++) {
    const rowOffset = y * rowSize;
    rawData[rowOffset] = 0; // Filter None
    for (let x = 0; x < width; x++) {
      const pxOffset = rowOffset + 1 + x * 4;
      // Draw stylized fiery gradient: orange to rose with central sun highlight
      const cx = width / 2;
      const cy = height / 2;
      const dist = Math.sqrt((x - cx) ** 2 + (y - cy) ** 2) / (width / 2);
      if (dist < 0.6) {
        // Center sun: gold/yellow
        rawData[pxOffset] = 251; // R
        rawData[pxOffset + 1] = 191; // G
        rawData[pxOffset + 2] = 36; // B
        rawData[pxOffset + 3] = a;
      } else if (dist < 0.85) {
        // Outer glow: fiery orange-red
        rawData[pxOffset] = 249; // R
        rawData[pxOffset + 1] = 115; // G
        rawData[pxOffset + 2] = 22; // B
        rawData[pxOffset + 3] = a;
      } else {
        // Background dark slate
        rawData[pxOffset] = 15; // R
        rawData[pxOffset + 1] = 23; // G
        rawData[pxOffset + 2] = 42; // B
        rawData[pxOffset + 3] = a;
      }
    }
  }

  const compressed = zlib.deflateSync(rawData);
  const idat = chunk('IDAT', compressed);
  const iend = chunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, chunk('IHDR', ihdr), idat, iend]);
}

const publicDir = path.resolve('public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Generate PNG icons
fs.writeFileSync(path.join(publicDir, 'pwa-192x192.png'), createSolidPNG(192, 192, 245, 158, 11));
fs.writeFileSync(path.join(publicDir, 'pwa-512x512.png'), createSolidPNG(512, 512, 245, 158, 11));
fs.writeFileSync(path.join(publicDir, 'pwa-maskable-512x512.png'), createSolidPNG(512, 512, 245, 158, 11));
fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.png'), createSolidPNG(180, 180, 245, 158, 11));
fs.writeFileSync(path.join(publicDir, 'favicon.ico'), createSolidPNG(32, 32, 245, 158, 11));

// Also generate public/icon.svg
const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="none">
  <rect width="512" height="512" rx="96" fill="#020617"/>
  <circle cx="256" cy="256" r="140" fill="url(#sun-grad)"/>
  <circle cx="256" cy="256" r="170" stroke="#f59e0b" stroke-width="8" stroke-dasharray="24 16" opacity="0.6"/>
  <path d="M256 60V100M256 412V452M60 256H100M412 256H452M118 118L146 146M366 366L394 394M118 394L146 366M366 146L394 118" stroke="#fbbf24" stroke-width="12" stroke-linecap="round"/>
  <path d="M220 330C220 310 240 300 240 280C240 260 220 250 220 230C220 205 245 190 256 180C267 190 292 205 292 230C292 250 272 260 272 280C272 300 292 310 292 330C292 350 276 364 256 364C236 364 220 350 220 330Z" fill="#ef4444"/>
  <defs>
    <radialGradient id="sun-grad" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(256 256) rotate(90) scale(140)">
      <stop stop-color="#fef08a"/>
      <stop offset="0.5" stop-color="#f59e0b"/>
      <stop offset="1" stop-color="#ea580c"/>
    </radialGradient>
  </defs>
</svg>`;
fs.writeFileSync(path.join(publicDir, 'icon.svg'), svg);

console.log('PWA icons successfully generated in /public');
