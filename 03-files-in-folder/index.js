const path = require('path');
const { readdir, open } = require('fs/promises');


(async (folder) => {

  try {
    const files = await readdir(folder, { withFileTypes: true });
    for (const file of files) {
      if (file.isFile()) {
        let data = [];

        let name = file.name.slice(0, file.name.lastIndexOf('.'));  
        data.push(name);
        let extension = path.extname(file.name).slice(1);
        data.push(extension);
        
        let filehandle  = await open(path.join(folder, file.name));
        let fileData = await filehandle.stat();
        let fileSize = (fileData.size / 1024).toFixed(3) + 'kb';

        data.push(fileSize);
        console.log(data.join(' - '));
      } 
    }
  } catch (err) {
    console.error(err);
  }

})(path.join(__dirname, 'secret-folder'));
