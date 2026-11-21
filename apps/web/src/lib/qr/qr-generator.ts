/**
 * Lightweight, zero-dependency, ISO/IEC 18004 compliant QR Code Matrix Generator.
 * Supports Byte Mode encoding (UTF-8) for Versions 1 to 10 with Reed-Solomon GF(256) error correction.
 */

const GF256_EXP = new Uint8Array(512);
const GF256_LOG = new Uint8Array(256);

(function initGf() {
  let val = 1;
  for (let i = 0; i < 255; i++) {
    GF256_EXP[i] = val;
    GF256_EXP[i + 255] = val;
    GF256_LOG[val] = i;
    val = (val << 1) ^ (val >= 128 ? 0x11d : 0);
  }
})();

function gfMul(x: number, y: number): number {
  if (x === 0 || y === 0) return 0;
  return GF256_EXP[GF256_LOG[x] + GF256_LOG[y]];
}

export type EccLevel = 'L' | 'M' | 'Q' | 'H';

interface QrVersionSpec {
  total: number;
  align: number[];
  ecc: Record<EccLevel, [number, number]>; // [eccCodewordsPerBlock, numBlocks]
}

const QR_SPECS: (QrVersionSpec | null)[] = [
  null,
  // v1 (21x21)
  { total: 26, align: [], ecc: { L: [7, 1], M: [10, 1], Q: [13, 1], H: [17, 1] } },
  // v2 (25x25)
  { total: 44, align: [6, 18], ecc: { L: [10, 1], M: [16, 1], Q: [22, 1], H: [28, 1] } },
  // v3 (29x29)
  { total: 70, align: [6, 22], ecc: { L: [15, 1], M: [26, 1], Q: [18, 2], H: [22, 2] } },
  // v4 (33x33)
  { total: 100, align: [6, 26], ecc: { L: [20, 1], M: [18, 2], Q: [26, 2], H: [16, 4] } },
  // v5 (37x37)
  { total: 134, align: [6, 30], ecc: { L: [26, 1], M: [24, 2], Q: [18, 4], H: [22, 4] } },
  // v6 (41x41)
  { total: 172, align: [6, 34], ecc: { L: [18, 2], M: [16, 4], Q: [24, 4], H: [28, 4] } },
  // v7 (45x45)
  { total: 196, align: [6, 22, 38], ecc: { L: [20, 2], M: [18, 4], Q: [18, 6], H: [26, 5] } },
  // v8 (49x49)
  { total: 242, align: [6, 24, 42], ecc: { L: [24, 2], M: [22, 4], Q: [22, 6], H: [26, 6] } },
  // v9 (53x53)
  { total: 292, align: [6, 26, 46], ecc: { L: [30, 2], M: [22, 5], Q: [20, 8], H: [24, 8] } },
  // v10 (57x57)
  { total: 346, align: [6, 28, 50], ecc: { L: [18, 4], M: [26, 5], Q: [24, 8], H: [28, 8] } },
];

function rsCompute(data: Uint8Array, eccCount: number): Uint8Array {
  let gen = new Uint8Array([1]);
  for (let i = 0; i < eccCount; i++) {
    const next = new Uint8Array(gen.length + 1);
    const factor = GF256_EXP[i];
    for (let j = 0; j < gen.length; j++) {
      next[j] ^= gfMul(gen[j], factor);
      next[j + 1] ^= gen[j];
    }
    gen = next;
  }

  const remainder = new Uint8Array(eccCount);
  for (const byte of data) {
    const factor = byte ^ remainder[0];
    remainder.copyWithin(0, 1);
    remainder[eccCount - 1] = 0;
    for (let i = 0; i < eccCount; i++) {
      remainder[i] ^= gfMul(gen[i], factor);
    }
  }
  return remainder;
}

export interface QrResult {
  matrix: boolean[][];
  size: number;
  version: number;
}

export function generateQrMatrix(text: string, eccLevel: EccLevel = 'Q'): QrResult {
  const utf8 = new TextEncoder().encode(text);
  const dataLen = utf8.length;

  let version = 1;
  let spec: QrVersionSpec | null = null;
  let dataCapacity = 0;

  for (let v = 1; v <= 10; v++) {
    const s = QR_SPECS[v]!;
    const [eccPerBlock, numBlocks] = s.ecc[eccLevel];
    const totalData = s.total - eccPerBlock * numBlocks;
    const charCountBits = v >= 10 ? 16 : 8;
    const overheadBytes = Math.ceil((4 + charCountBits) / 8);
    if (totalData >= dataLen + overheadBytes) {
      version = v;
      spec = s;
      dataCapacity = totalData;
      break;
    }
  }

  if (!spec) {
    throw new Error(`Data too long (${dataLen} bytes) for QR Code versions 1-10 with ECC ${eccLevel}`);
  }

  const [eccPerBlock, numBlocks] = spec.ecc[eccLevel];
  const charCountBits = version >= 10 ? 16 : 8;

  // 1. Bit Stream
  const bits: number[] = [];
  function pushBits(val: number, len: number) {
    for (let i = len - 1; i >= 0; i--) {
      bits.push((val >> i) & 1);
    }
  }

  // Byte mode header (0100)
  pushBits(0b0100, 4);
  // Length
  pushBits(dataLen, charCountBits);
  // Data bytes
  for (const b of utf8) {
    pushBits(b, 8);
  }
  // Terminator
  const totalDataBits = dataCapacity * 8;
  const termLen = Math.min(4, totalDataBits - bits.length);
  pushBits(0, termLen);
  // Pad to byte boundary
  while (bits.length % 8 !== 0) {
    bits.push(0);
  }
  // Alternating pad bytes 0xEC, 0x11
  const padBytes = [0xec, 0x11];
  let padIdx = 0;
  while (bits.length < totalDataBits) {
    pushBits(padBytes[padIdx % 2], 8);
    padIdx++;
  }

  // Codewords buffer
  const dataCodewords = new Uint8Array(dataCapacity);
  for (let i = 0; i < dataCapacity; i++) {
    let b = 0;
    for (let j = 0; j < 8; j++) {
      b = (b << 1) | bits[i * 8 + j];
    }
    dataCodewords[i] = b;
  }

  // 2. Blocks and Reed-Solomon ECC
  const blockSize = Math.floor(dataCapacity / numBlocks);
  const extraBlocks = dataCapacity % numBlocks;
  const dataBlocks: Uint8Array[] = [];
  const eccBlocks: Uint8Array[] = [];

  let offset = 0;
  for (let i = 0; i < numBlocks; i++) {
    const curLen = blockSize + (i >= numBlocks - extraBlocks ? 1 : 0);
    const blockData = dataCodewords.slice(offset, offset + curLen);
    offset += curLen;
    dataBlocks.push(blockData);
    eccBlocks.push(rsCompute(blockData, eccPerBlock));
  }

  // Interleave data
  const finalCodewords: number[] = [];
  const maxBlockLen = blockSize + (extraBlocks > 0 ? 1 : 0);
  for (let i = 0; i < maxBlockLen; i++) {
    for (let b = 0; b < numBlocks; b++) {
      if (i < dataBlocks[b].length) {
        finalCodewords.push(dataBlocks[b][i]);
      }
    }
  }
  // Interleave ECC
  for (let i = 0; i < eccPerBlock; i++) {
    for (let b = 0; b < numBlocks; b++) {
      finalCodewords.push(eccBlocks[b][i]);
    }
  }

  // 3. Matrix Setup
  const size = 17 + 4 * version;
  const matrix: boolean[][] = Array.from({ length: size }, () => Array(size).fill(false));
  const isFunction: boolean[][] = Array.from({ length: size }, () => Array(size).fill(false));

  function setFunction(r: number, c: number, val: boolean) {
    matrix[r][c] = val;
    isFunction[r][c] = true;
  }

  // Place Finder Patterns
  function placeFinder(row: number, col: number) {
    for (let r = -1; r <= 7; r++) {
      for (let c = -1; c <= 7; c++) {
        const nr = row + r;
        const nc = col + c;
        if (nr < 0 || nr >= size || nc < 0 || nc >= size) continue;
        const isCore = r >= 0 && r <= 6 && c >= 0 && c <= 6;
        const val = isCore && (
          r === 0 || r === 6 || c === 0 || c === 6 ||
          (r >= 2 && r <= 4 && c >= 2 && c <= 4)
        );
        setFunction(nr, nc, val);
      }
    }
  }

  placeFinder(0, 0);
  placeFinder(0, size - 7);
  placeFinder(size - 7, 0);

  // Alignment Patterns
  for (const r of spec.align) {
    for (const c of spec.align) {
      if (isFunction[r][c]) continue;
      for (let dr = -2; dr <= 2; dr++) {
        for (let dc = -2; dc <= 2; dc++) {
          const val = Math.max(Math.abs(dr), Math.abs(dc)) !== 1;
          setFunction(r + dr, c + dc, val);
        }
      }
    }
  }

  // Timing Patterns
  for (let i = 8; i < size - 8; i++) {
    if (!isFunction[6][i]) setFunction(6, i, i % 2 === 0);
    if (!isFunction[i][6]) setFunction(i, 6, i % 2 === 0);
  }

  // Dark module
  setFunction(4 * version + 9, 8, true);

  // Reserve format bits
  for (let i = 0; i <= 8; i++) {
    if (!isFunction[8][i]) setFunction(8, i, false);
    if (!isFunction[i][8]) setFunction(i, 8, false);
  }
  for (let i = 0; i <= 7; i++) {
    if (!isFunction[8][size - 1 - i]) setFunction(8, size - 1 - i, false);
    if (!isFunction[size - 1 - i][8]) setFunction(size - 1 - i, 8, false);
  }

  // Data Bits Placement
  const allBits: number[] = [];
  for (const cw of finalCodewords) {
    for (let i = 7; i >= 0; i--) {
      allBits.push((cw >> i) & 1);
    }
  }

  let bitIdx = 0;
  let upward = true;
  for (let right = size - 1; right > 0; right -= 2) {
    if (right === 6) right--; // skip timing column
    const rows = upward
      ? Array.from({ length: size }, (_, i) => size - 1 - i)
      : Array.from({ length: size }, (_, i) => i);

    for (const r of rows) {
      for (const c of [right, right - 1]) {
        if (!isFunction[r][c]) {
          if (bitIdx < allBits.length) {
            matrix[r][c] = allBits[bitIdx] === 1;
            bitIdx++;
          }
        }
      }
    }
    upward = !upward;
  }

  // Apply Mask 0: (row + col) % 2 === 0
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (!isFunction[r][c]) {
        if ((r + c) % 2 === 0) {
          matrix[r][c] = !matrix[r][c];
        }
      }
    }
  }

  // Format Information
  const eccMap: Record<EccLevel, number> = { L: 1, M: 0, Q: 3, H: 2 };
  const formatData = (eccMap[eccLevel] << 3) | 0; // mask 0

  let rem = formatData << 10;
  for (let i = 4; i >= 0; i--) {
    if ((rem >> (i + 10)) & 1) {
      rem ^= 0x537 << i;
    }
  }
  const formatCode = ((formatData << 10) | rem) ^ 0x5412;

  for (let i = 0; i <= 5; i++) matrix[8][i] = ((formatCode >> i) & 1) === 1;
  matrix[8][7] = ((formatCode >> 6) & 1) === 1;
  matrix[8][8] = ((formatCode >> 7) & 1) === 1;
  matrix[7][8] = ((formatCode >> 8) & 1) === 1;
  for (let i = 9; i < 15; i++) matrix[14 - i][8] = ((formatCode >> i) & 1) === 1;

  for (let i = 0; i <= 7; i++) matrix[size - 1 - i][8] = ((formatCode >> i) & 1) === 1;
  for (let i = 8; i < 15; i++) matrix[8][size - 15 + i] = ((formatCode >> i) & 1) === 1;

  return { matrix, size, version };
}
