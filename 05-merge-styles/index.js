const { readdir } = require('fs/promises');
const { createReadStream, writeFile } = require('fs');
const path = require('path');

let result = [];

function readData(pathToItem) {
  return new Promise((res) => {
    const readStream = createReadStream(pathToItem, 'utf-8');

    readStream.on('data', (chunk) => {
      result.push(chunk);
    });

    readStream.on('end', () => {
      res();
    });
  });
}


async function fff(folder) {
  const folderInsides = await readdir(folder);

  for (const item of folderInsides) {
    const pathToItem = path.join(folder, item);
    if (path.extname(pathToItem) === '.css') {
      await readData(pathToItem);
    }
  }

  result = result.join('\r\n');
  const bundlePath = path.join(__dirname, 'project-dist', 'bundle.css');

  writeFile(bundlePath, result, () => {
    console.log('Сборка css бандла завершена');
  });
}


fff(path.join(__dirname, 'styles'));
