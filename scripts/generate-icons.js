const fs = require('fs');
const path = require('path');

// Create a simple SVG icon that can be used as PNG placeholder
const createIconSVG = (size) => `
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${size}" height="${size}" rx="${size * 0.125}" fill="#10b981"/>
  <rect x="${size * 0.25}" y="${size * 0.375}" width="${size * 0.5}" height="${size * 0.375}" rx="${size * 0.0625}" fill="white"/>
  <rect x="${size * 0.25}" y="${size * 0.375}" width="${size * 0.5}" height="${size * 0.125}" fill="#10b981"/>
  <circle cx="${size * 0.375}" cy="${size * 0.5625}" r="${size * 0.0625}" fill="#10b981"/>
  <circle cx="${size * 0.5}" cy="${size * 0.5625}" r="${size * 0.0625}" fill="#10b981"/>
  <circle cx="${size * 0.625}" cy="${size * 0.5625}" r="${size * 0.0625}" fill="#10b981"/>
  <rect x="${size * 0.3125}" y="${size * 0.6875}" width="${size * 0.375}" height="${size * 0.0625}" fill="#10b981"/>
</svg>`;

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
const iconsDir = path.join(__dirname, '..', 'public', 'icons');

// Ensure icons directory exists
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// Generate SVG files for each size (we'll use SVG as PNG placeholders)
sizes.forEach(size => {
  const svgContent = createIconSVG(size);
  const filename = `icon-${size}x${size}.png`;
  const filepath = path.join(iconsDir, filename);
  
  // For now, we'll create SVG files with .png extension as placeholders
  fs.writeFileSync(filepath, svgContent);
  console.log(`Created ${filename}`);
});

console.log('Icon generation complete!');