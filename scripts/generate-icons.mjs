import sharp from 'sharp'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, '..')
const svg = fs.readFileSync(path.join(root, 'icon.svg'))

const androidSizes = [
  { dir: 'mipmap-mdpi',    size: 48,  fgSize: 108 },
  { dir: 'mipmap-hdpi',    size: 72,  fgSize: 162 },
  { dir: 'mipmap-xhdpi',   size: 96,  fgSize: 216 },
  { dir: 'mipmap-xxhdpi',  size: 144, fgSize: 324 },
  { dir: 'mipmap-xxxhdpi', size: 192, fgSize: 432 },
]

const androidBase = path.join(root, 'android/app/src/main/res')

async function run() {
  // Play Store icon (512×512)
  await sharp(svg).resize(512, 512).png().toFile(path.join(root, 'play-store-icon.png'))
  console.log('✓ play-store-icon.png (512×512)')

  // Android launcher icons + adaptive foreground for each density
  for (const { dir, size, fgSize } of androidSizes) {
    const dest = path.join(androidBase, dir)
    fs.mkdirSync(dest, { recursive: true })
    await sharp(svg).resize(size, size).png().toFile(path.join(dest, 'ic_launcher.png'))
    await sharp(svg).resize(size, size).png().toFile(path.join(dest, 'ic_launcher_round.png'))
    await sharp(svg).resize(fgSize, fgSize).png().toFile(path.join(dest, 'ic_launcher_foreground.png'))
    console.log(`✓ ${dir}/ic_launcher.png (${size}×${size}), foreground (${fgSize}×${fgSize})`)
  }

  console.log('\nDone! Add play-store-icon.png to your Play Store listing.')
}

run().catch(console.error)
