const { mkdir, readdir, readFile, writeFile, rmdir, unlink, copyFile } = require('fs/promises');
const { createReadStream } = require('fs');
const path = require('path');


// !folders

async function clearFolder(directory) {
  let innerFolder;

  try {
    innerFolder = await readdir(directory, { withFileTypes: true });
  } catch {
    return;
  }

  for (const file of innerFolder) {
    if (file.isFile()) {
      await unlink(path.join(directory, file.name));
    } else {
      await clearFolder(path.join(directory, file.name));
    }
  }

  await rmdir(directory);
}

function createFolder() {
  return mkdir(path.join(__dirname, 'project-dist'), { recursive: true });
}


// !html

let html = '';

function readHtml() {
  return new Promise((res) => {
    const readStream = createReadStream(path.join(__dirname, 'template.html'), 'utf-8');

    readStream.on('data', (chunk) => {
      html += chunk;
    });

    readStream.on('end', () => {
      res();
    });
  });
}

async function buildHtml() {
  let compDirectory = path.join(__dirname, 'components');
  let components = await readdir(compDirectory);


  for (const temp of components) {
    if (path.extname(temp) !== '.html') continue;
    let tempInner = await readFile(path.join(compDirectory, temp), 'utf-8');
    let re =`{{${temp.slice(0, temp.lastIndexOf('.'))}}}`;
    html = html.replace(re, tempInner);
  }

  await writeFile(path.join(__dirname, 'project-dist', 'index.html'), html);
}


// !styles

let styles = [];

function readStyles(pathToItem) {
  return new Promise((res) => {
    const readStream = createReadStream(pathToItem, 'utf-8');

    readStream.on('data', (chunk) => {
      styles.unshift(chunk);
    });

    readStream.on('end', () => {
      res();
    });
  });
}

async function buildStyle(folder) {
  const folderInsides = await readdir(folder);

  for (const item of folderInsides) {
    const pathToItem = path.join(folder, item);
    if (path.extname(pathToItem) === '.css') {
      await readStyles(pathToItem);
    }
  }

  styles = styles.join('\r\n');
  const bundlePath = path.join(__dirname, 'project-dist', 'style.css');

  writeFile(bundlePath, styles);
}


// !assets

async function copyFiles(from, to, folderName) {
  await mkdir(path.join(to, folderName), { recursive: true });
  const copyContent = await readdir(from, { withFileTypes: true });

  for (const file of copyContent) {
    if (file.isFile()) {
      await writeFile(path.join(to, folderName, file.name), '');
      await copyFile(path.join(from, file.name), path.join(to, folderName, file.name));
    } else {
      copyFiles(path.join(from, file.name), path.join(to, folderName), file.name);
    }
  }
}


async function bundlePage() {
  await clearFolder(path.join(__dirname, 'project-dist'));
  await createFolder();
  await readHtml();
  buildHtml();
  buildStyle(path.join(__dirname, 'styles'));
  copyFiles(path.join(__dirname, 'assets'), path.join(__dirname, 'project-dist'), 'assets');
  console.log('Сборка страницы успешно выполнена!');
}


bundlePage();
