const fs = require('fs');
const path = require('path');

const MAPS_DIR = path.join(__dirname, '../public/maps');
const OUTPUT_FILE = path.join(MAPS_DIR, 'asia_all_subdivisions.svg');

// Senarai fail negeri yang hendak diekstrak masuk ke kanvas utama
const COUNTRY_FILES = [
  { file: 'MY.svg', prefix: 'MY' },
  { file: 'ID.svg', prefix: 'ID' },
  { file: 'TH.svg', prefix: 'TH' },
  { file: 'VN.svg', prefix: 'VN' },
  { file: 'PH.svg', prefix: 'PH' },
  { file: 'KH.svg', prefix: 'KH' },
  { file: 'LA.svg', prefix: 'LA' },
  { file: 'MM.svg', prefix: 'MM' },
  { file: 'BN.svg', prefix: 'BN' },
  { file: 'SG.svg', prefix: 'SG' },
];

function runMerge() {
  console.log('Memulakan proses penggabungan peta...');

  const asiaPath = path.join(MAPS_DIR, 'asia.svg');
  if (!fs.existsSync(asiaPath)) {
    console.error('Ralat: Fail public/maps/asia.svg tidak dijumpai!');
    process.exit(1);
  }

  const asiaRaw = fs.readFileSync(asiaPath, 'utf-8');

  // Ambil viewBox asal fail asia.svg
  const viewBoxMatch = asiaRaw.match(/viewBox=["']([^"']+)["']/i);
  const viewBox = viewBoxMatch ? viewBoxMatch[1] : '0 0 1000 700';

  // Ambil semua path asal asia.svg tetapi ketepikan negara SEA untuk diganti dengan negeri terperinci
  const seaCountryCodes = ['MY', 'ID', 'TH', 'VN', 'PH', 'KH', 'LA', 'MM', 'BN', 'SG'];
  
  // Ekstrak path benua/dunia luar sebagai latar belakang pasif (inert)
  const pathRegex = /<path\b([^>]+)>/gi;
  let match;
  const backgroundPaths = [];

  while ((match = pathRegex.exec(asiaRaw)) !== null) {
    const fullTag = match[0];
    const idMatch = fullTag.match(/\bid=["']([^"']+)["']/i);
    const id = idMatch ? idMatch[1].toUpperCase() : '';

    // Jika bukan negara SEA, kekalkan sebagai latar geografi
    if (!seaCountryCodes.includes(id)) {
      // Ubah warna latar menjadi gelap pasif
      const inertPath = fullTag.replace(/fill=["'][^"']*["']/i, '').replace(
        '<path',
        '<path class="inert-continent" fill="#11131A" stroke="#1A1F2C" stroke-width="0.5"'
      );
      backgroundPaths.push(inertPath);
    }
  }

  // Sekarang ekstrak sub-wilayah (negeri) dari fail individu
  const subdivisionPaths = [];

  for (const item of COUNTRY_FILES) {
    const filePath = path.join(MAPS_DIR, item.file);
    if (!fs.existsSync(filePath)) {
      console.warn(`Amaran: Fail ${item.file} tiada dalam public/maps/, melangkau...`);
      continue;
    }

    const content = fs.readFileSync(filePath, 'utf-8');
    let subMatch;
    while ((subMatch = pathRegex.exec(content)) !== null) {
      let tag = subMatch[0];
      
      // Pastikan ada atribut id (cth: id="MY-16" atau id="ID-BA")
      const idMatch = tag.match(/\b(iso_3166_2|id)=["']([^"']+)["']/i);
      const nameMatch = tag.match(/\bname=["']([^"']+)["']/i);
      
      const regionId = idMatch ? idMatch[2] : `${item.prefix}-REG`;
      const regionName = nameMatch ? nameMatch[1] : regionId;

      // Bersihkan dan standardkan atribut path untuk kegunaan game
      tag = tag.replace(/fill=["'][^"']*["']/gi, '');
      tag = tag.replace(/stroke=["'][^"']*["']/gi, '');
      tag = tag.replace(
        '<path',
        `<path id="${regionId}" name="${regionName}"`
      );

      subdivisionPaths.push(tag);
    }
  }

  // Cantumkan menjadi satu fail SVG lengkap
  const finalSvgContent = `<?xml version="1.0" encoding="utf-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}" width="100%" height="100%">
  <!-- 1. Benua Latar Belakang (Non-interactive) -->
  <g id="world_background">
    ${backgroundPaths.join('\n    ')}
  </g>

  <!-- 2. Zon Sub-Wilayah Nusantara / SEA (Interaktif & Boleh Dituntut) -->
  <g id="sea_subdivisions">
    ${subdivisionPaths.join('\n    ')}
  </g>
</svg>`;

  fs.writeFileSync(OUTPUT_FILE, finalSvgContent, 'utf-8');
  console.log(`Berjaya! Peta gabungan dihasilkan di: ${OUTPUT_FILE}`);
}

runMerge();