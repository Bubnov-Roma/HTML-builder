const fs = require('fs');
const patch = require('path');
const { stdout } = process;

fs.readFile(
    patch.join(__dirname, 'text.txt'),
    'utf-8',
    (err, data) => {
        if (err) throw err;
        stdout.write(data);
    }
);
