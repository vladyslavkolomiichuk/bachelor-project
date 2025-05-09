import axios from 'axios';
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

// Функція для перетворення об'єкта RGB в CSS-формат
const rgbToCss = (rgb) => `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;

// Завантаження зображення за URL або з локального файлу і обробка кольорів
export async function getColorsFromImage(source) {
  try {
    if (typeof source !== 'string' || source.length === 0) {
      throw new Error('Source must be a non-empty string');
    }
    
    let imageBuffer;

    if (source.startsWith('http://') || source.startsWith('https://')) {
      // Завантаження зображення за URL
      const response = await axios.get(source, {
        responseType: 'arraybuffer',
      });
      imageBuffer = Buffer.from(response.data);
    } else {
      // Завантаження з локального файлу
      const filePath = path.join(process.cwd(), 'public', source);
      imageBuffer = fs.readFileSync(filePath);
    }

    // Обробка зображення з використанням sharp
    const { data, info } = await sharp(imageBuffer)
      .resize(300) // Для зменшення розміру
      .raw()
      .toBuffer({ resolveWithObject: true });

    const pixels = buildRgb(data, info.width, info.height);

    // Виконати кольорову квантизацію
    const quantizedColors = quantization(pixels, 0);

    // Перетворити кольори у формат rgb(r, g, b)
    const cssColors = quantizedColors.map(color => rgbToCss(color));

    return cssColors;
  } catch (error) {
    console.error('Error processing image:', error);
    return [];
  }
}

// Вже визначена функція для конвертації пікселів в RGB
const buildRgb = (imageData, width, height) => {
  const rgbValues = [];
  for (let i = 0; i < imageData.length; i += 3) {
    const r = imageData[i];
    const g = imageData[i + 1];
    const b = imageData[i + 2];

    rgbValues.push({ r, g, b });
  }
  return rgbValues;
};

// Колірна квантизація
const quantization = (rgbValues, depth) => {
  const MAX_DEPTH = 4;

  if (depth === MAX_DEPTH || rgbValues.length === 0) {
    const avgColor = rgbValues.reduce((acc, curr) => {
      acc.r += curr.r;
      acc.g += curr.g;
      acc.b += curr.b;
      return acc;
    }, { r: 0, g: 0, b: 0 });

    avgColor.r = Math.round(avgColor.r / rgbValues.length);
    avgColor.g = Math.round(avgColor.g / rgbValues.length);
    avgColor.b = Math.round(avgColor.b / rgbValues.length);

    return [avgColor];
  }

  const componentToSortBy = findBiggestColorRange(rgbValues);
  rgbValues.sort((p1, p2) => p1[componentToSortBy] - p2[componentToSortBy]);

  const mid = Math.floor(rgbValues.length / 2);
  return [
    ...quantization(rgbValues.slice(0, mid), depth + 1),
    ...quantization(rgbValues.slice(mid), depth + 1)
  ];
};

// Допоміжна функція
const findBiggestColorRange = (rgbValues) => {
  let rMin = Infinity, gMin = Infinity, bMin = Infinity;
  let rMax = -Infinity, gMax = -Infinity, bMax = -Infinity;

  rgbValues.forEach(pixel => {
    rMin = Math.min(rMin, pixel.r);
    gMin = Math.min(gMin, pixel.g);
    bMin = Math.min(bMin, pixel.b);
    rMax = Math.max(rMax, pixel.r);
    gMax = Math.max(gMax, pixel.g);
    bMax = Math.max(bMax, pixel.b);
  });

  const rRange = rMax - rMin;
  const gRange = gMax - gMin;
  const bRange = bMax - bMin;

  if (rRange > gRange && rRange > bRange) return 'r';
  if (gRange > rRange && gRange > bRange) return 'g';
  return 'b';
};
