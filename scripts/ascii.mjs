// One-off generator: converts public/profile.jpg into ASCII art and writes
// src/asciiPortrait.ts. Run with:  node scripts/ascii.mjs
import { Jimp, intToRGBA } from 'jimp'
import { writeFileSync } from 'node:fs'

const SRC = 'public/matri_profile.png'
const OUT = 'src/asciiPortrait.ts'
const WIDTH = 64
// Characters are ~2x taller than wide -> compress vertical sampling
const ASPECT = 0.5
// light -> dark ramp (reversed): dark pixels become blank space so the dark
// background melts into the card, while the lit face renders as dense glyphs.
const RAMP = ' .:-=+*#%@'

const img = await Jimp.read(SRC)
const w = WIDTH
const h = Math.max(1, Math.round((img.bitmap.height / img.bitmap.width) * w * ASPECT))
img.resize({ w, h })

let out = ''
for (let y = 0; y < h; y++) {
  let line = ''
  for (let x = 0; x < w; x++) {
    const { r, g, b } = intToRGBA(img.getPixelColor(x, y))
    const lum = 0.299 * r + 0.587 * g + 0.114 * b // 0..255
    const idx = Math.min(RAMP.length - 1, Math.floor((lum / 256) * RAMP.length))
    line += RAMP[idx]
  }
  out += line.replace(/\s+$/g, '') + '\n'
}

const ts = `// Auto-generated from ${SRC} by scripts/ascii.mjs — do not edit by hand.
export const asciiPortrait = ${JSON.stringify(out)}
export const asciiDims = { cols: ${w}, rows: ${h} }
`
writeFileSync(OUT, ts)
console.log(out)
console.log('\nwrote ' + OUT + ' (' + w + 'x' + h + ')')
