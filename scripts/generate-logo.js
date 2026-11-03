const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const logoSvg = `
<svg width="600" height="150" viewBox="0 0 600 150" fill="none" xmlns="http://www.w3.org/2000/svg">
  <!-- Leads (Bold White) -->
  <text x="10" y="102" font-family="'Plus Jakarta Sans', 'Inter', -apple-system, sans-serif" font-weight="900" font-size="82" fill="#FFFFFF" letter-spacing="-1.5">
    Leads
  </text>
  
  <!-- Gr (Bold Green) -->
  <text x="248" y="102" font-family="'Plus Jakarta Sans', 'Inter', -apple-system, sans-serif" font-weight="900" font-size="82" fill="#22C55E" letter-spacing="-1.5">
    Gr
  </text>

  <!-- Growth Arrow replacing 'o' in Grow -->
  <g transform="translate(362, 38)">
    <!-- Glow back circle / ring subtle -->
    <circle cx="28" cy="46" r="26" stroke="#22C55E" stroke-width="8" stroke-dasharray="130 35" stroke-linecap="round" fill="none" />
    
    <!-- Bold Upward Growth Arrow pointing up-right -->
    <path d="M12 62 L38 24 M38 24 L20 24 M38 24 L38 42" stroke="#B6F23D" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>
    
    <!-- Pulse dot -->
    <circle cx="38" cy="24" r="3.5" fill="#FFFFFF" />
  </g>

  <!-- w (Bold Green) -->
  <text x="432" y="102" font-family="'Plus Jakarta Sans', 'Inter', -apple-system, sans-serif" font-weight="900" font-size="82" fill="#22C55E" letter-spacing="-1.5">
    w
  </text>

  <!-- Trademark TM -->
  <text x="510" y="52" font-family="'Plus Jakarta Sans', 'Inter', -apple-system, sans-serif" font-weight="800" font-size="20" fill="#B6F23D">
    TM
  </text>
</svg>
`;

const iconSvg = `
<svg width="512" height="512" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="512" height="512" rx="128" fill="#0B0F0D"/>
  <rect x="16" y="16" width="480" height="480" rx="112" stroke="#1A2420" stroke-width="8"/>
  
  <!-- Growth Arrow Circle Graphic -->
  <circle cx="256" cy="256" r="140" stroke="#22C55E" stroke-width="36" stroke-dasharray="640 180" stroke-linecap="round"/>
  <path d="M170 340 L340 170 M340 170 L240 170 M340 170 L340 270" stroke="#B6F23D" stroke-width="38" stroke-linecap="round" stroke-linejoin="round"/>
  <circle cx="340" cy="170" r="16" fill="#FFFFFF"/>
</svg>
`;

async function main() {
  const logoDir = path.resolve(__dirname, '../public/logo');
  const appDir = path.resolve(__dirname, '../app');
  fs.mkdirSync(logoDir, { recursive: true });

  const logoPngPath = path.join(logoDir, 'leadsgrow-logo.png');
  await sharp(Buffer.from(logoSvg))
    .png()
    .toFile(logoPngPath);
  console.log('✅ Generated logo at:', logoPngPath);

  const iconPngPath = path.resolve(__dirname, '../public/icon.png');
  await sharp(Buffer.from(iconSvg))
    .png()
    .toFile(iconPngPath);
  console.log('✅ Generated icon at:', iconPngPath);

  const appIconPath = path.join(appDir, 'icon.png');
  await sharp(Buffer.from(iconSvg))
    .resize(32, 32)
    .png()
    .toFile(appIconPath);
  console.log('✅ Generated app icon at:', appIconPath);
}

main().catch(console.error);

