const path = require('path');
const fs = require('fs');
const { stdout } = require('process');

const textPath = path.join(__dirname, 'text.txt');
const stream = fs.createReadStream(textPath, 'utf-8');
let text = '';


stream.on('data', chunk => text += chunk);
stream.on('end', () => stdout.write(text));

