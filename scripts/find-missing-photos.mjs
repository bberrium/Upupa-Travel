import fs from 'fs';
import path from 'path';

const dataDir = 'src/data';
const imagesDir = 'public/images';

// Get all image filenames on disk
const diskImages = new Set(
  fs.readdirSync(imagesDir, { recursive: true })
    .map(file => path.basename(file))
);

// Read all data files
const files = fs.readdirSync(dataDir).filter(f => f.endsWith('.js') || f.endsWith('.ts'));

files.forEach(file => {
  const filePath = path.join(dataDir, file);
  const content = fs.readFileSync(filePath, 'utf8');

  // Match photos("prefix", start, end)
  const matches = content.matchAll(/photos\(\s*["']([^"']+)["']\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/g);

  for (const match of matches) {
    const [fullCall, prefix, startStr, endStr] = match;
    const start = parseInt(startStr, 10);
    const end = parseInt(endStr, 10);
    const missing = [];

    for (let i = start; i <= end; i++) {
      if (!diskImages.has(`${prefix}${i}.webp`)) {
        missing.push(i);
      }
    }

    if (missing.length > 0) {
      console.log(`In ${file} -> ${fullCall}:`);
      console.log(`  Missing image numbers: ${missing.join(', ')}`);
    }
  }
});