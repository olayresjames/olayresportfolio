import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const stillAssets = [
  'resources/id-picture-v2.png',
  'resources/hero-portrait-black-cutout.png',
  'resources/hero-portrait-white-cutout.png',
  'resources/Experiences/PNP - IDTMS PROJECT PREVIEW.png',
  'resources/PAIS 2.0 PREVIEW.png',
  'resources/CAMP-NAVI PREVIEW.png',
  'resources/PNP ASSIGNMENT SYSTEM PREVIEW.png',
  'resources/Experiences/WEBDEV FREELANCING (2023 - PRESENT).png',
  'resources/AppbuildersPH Hackaton 2026/Event photos/831277560_1071540725679663_1368969917848350556_n.jpg',
  'resources/AppbuildersPH Hackaton 2026/Event photos/833322975_1075334208833626_2719532112471684819_n.jpg',
  'resources/AppbuildersPH Hackaton 2026/Event photos/835357134_1129485376433869_5402630550514437801_n.jpg',
  'resources/AppbuildersPH Hackaton 2026/Event photos/840346202_1069674935937478_847077860598290348_n.jpg',
  'resources/AppbuildersPH Hackaton 2026/Event photos/841120454_1079063551580006_2888176752970575677_n.jpg',
  "resources/Certificates/[AWARD]RESET - PEOPLE'S CHOICE AWARD IN DIGITAL GAME CATEGORY - FIRST PLACE.jpg",
  ...Array.from({ length: 19 }, (_, index) => {
    const numbers = ['145910', '145933', '150002', '150034', '151017', '151202', '151216', '151231', '152023', '152049', '152238', '152711', '152854', '153010', '153036', '153115', '153745', '153756', '153807'];
    return `resources/Legend Of Cee/in game screenshots/Screenshot 2026-09-23 ${numbers[index]}.png`;
  }),
];

const animatedAssets = [
  { source: 'resources/gif replys/handshake.gif', maxWidth: 320 },
  { source: 'resources/gif replys/druski-pointing.gif', maxWidth: 220 },
  { source: 'resources/gif replys/what do you mean by that.gif', maxWidth: 498 },
];

async function convertStill(relativeSource) {
  const source = path.join(projectRoot, 'public', relativeSource);
  const parsed = path.parse(source);
  const fullOutput = path.join(parsed.dir, `${parsed.name}.webp`);
  const smallOutput = path.join(parsed.dir, `${parsed.name}-800.webp`);
  const image = sharp(source).rotate();

  await Promise.all([
    image.clone().webp({ quality: 84, effort: 5, alphaQuality: 90 }).toFile(fullOutput),
    image.clone().resize({ width: 800, withoutEnlargement: true }).webp({ quality: 82, effort: 5, alphaQuality: 90 }).toFile(smallOutput),
  ]);

  return [source, fullOutput, smallOutput];
}

async function convertAnimation({ source: relativeSource, maxWidth }) {
  const source = path.join(projectRoot, 'public', relativeSource);
  const parsed = path.parse(source);
  const output = path.join(parsed.dir, `${parsed.name}.webp`);
  await sharp(source, { animated: true })
    .resize({ width: maxWidth, withoutEnlargement: true })
    .webp({ quality: 78, effort: 5, alphaQuality: 90 })
    .toFile(output);
  const metadata = await sharp(output, { animated: true }).metadata();
  if ((metadata.pages || 1) < 2) throw new Error(`Expected animated WebP output for ${relativeSource}`);
  return [source, output];
}

for (const [source, output, small] of await Promise.all(stillAssets.map(convertStill))) {
  console.log(`${path.relative(projectRoot, source)} -> ${path.basename(output)} + ${path.basename(small)}`);
}

for (const [source, output] of await Promise.all(animatedAssets.map(convertAnimation))) {
  console.log(`${path.relative(projectRoot, source)} -> ${path.basename(output)} (animated)`);
}
