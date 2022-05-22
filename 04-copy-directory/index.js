const { mkdir, readdir, writeFile, copyFile, unlink, rmdir } = require('fs/promises');
const path = require('path');


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


let prom = clearFolder(path.join(__dirname, 'files-copy'));

prom
  .then(() => {
    copyFiles(path.join(__dirname, 'files'), __dirname, 'files-copy');
  })
  .then(console.log('Файлы успешно скопированы'));
