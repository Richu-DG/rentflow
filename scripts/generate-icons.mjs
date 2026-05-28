import sharp from 'sharp'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, '..')
const svg = fs.readFileSync(path.join(root, 'icon.svg'))

const androidSizes = [
  { dir: 'mipmap-mdpi',    size: 48  },
  { dir: 'mipmap-hdpi',    size: 72  },
  { dir: 'mipmap-xhdpi',   size: 96  },
  { dir: 'mipmap-xxhdpi',  size: 144 },
  { dir: 'mipmap-xxxhdpi', size: 192 },
]

const androidBase = path.join(root, 'android/app/src/main/res')

async function run() {
  // Play Store icon (512×512)
  await sharp(svg).resize(512, 512).png().toFile(path.join(root, 'play-store-icon.png'))
  console.log('✓ play-store-icon.png (512×512)')

  // Android launcher icons
  for (const { dir, size } of androidSizes) {
    const dest = path.join(androidBase, dir)
    fs.mkdirSync(dest, { recursive: true })
    await sharp(svg).resize(size, size).png().toFile(path.join(dest, 'ic_launcher.png'))
    await sharp(svg).resize(size, size).png().toFile(path.join(dest, 'ic_launcher_round.png'))
    console.log(`✓ ${dir}/ic_launcher.png (${size}×${size})`)
  }

  // Adaptive icon foreground (108dp canvas, image centered in 72dp safe zone)
  // Foreground should be 432×432 (at xxxhdpi 4×) with content in center 288×288
  const fgSize = 432
  await sharp(svg).resize(fgSize, fgSize).png().toFile(
    path.join(androidBase, 'mipmap-xxxhdpi', 'ic_launcher_foreground.png')
  )
  console.log('✓ ic_launcher_foreground.png')

  console.log('\nDone! Add play-store-icon.png to your Play Store listing.')
}

run().catch(console.error)
