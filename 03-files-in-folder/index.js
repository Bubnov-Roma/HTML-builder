const fs = require('fs');
const path = require('path');
const pathTofiles = path.join(__dirname, 'secret-folder')

fs.readdir(
    pathTofiles,
    (err, files) => {
        err ?
            err :
            files.forEach(file => {
                const fileName = path.basename(file, path.extname(file))
                const fileExt = path.extname(file).slice(1)
                fs.stat(path.join(pathTofiles, file), (err, file) => {
                    file.isFile() ?
                        console.log(`${fileName} - ${fileExt} - ${file.size / 1000}`) :
                        err
                })
            })
    });