import fs from 'fs';
import path from 'path';

type Fonts = {
  [key: string]: string;
};

const fonts: Fonts = {};

const directory = path.join(__dirname, 'node_modules/figlet/importable-fonts');

// Ensure you use dynamic imports properly if using Webpack
fs.readdirSync(directory).forEach((fileName) => {
  if (fileName.endsWith('.js')) {
    const fontName = fileName.replace('.js', '');
    fonts[fontName] = require(path.join(directory, fileName));
  }
});

export default fonts;
