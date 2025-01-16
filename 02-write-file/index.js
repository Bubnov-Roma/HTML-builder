const fs = require('fs');
const path = require('path');
const { stdin, stdout } = process;
const text = []

fs.open(
    path.join(__dirname, 'text.txt'), 'w',
    (err) => {
        if (err) throw err;
        process.stdout.write('Write\'l something?\n');
    }
);

stdin.setRawMode(true);
stdin.resume();
stdin.setEncoding('utf-8');

stdin.on('data', function (key) {
    text.push(key)
    if (key === '\u0003' || text.join('').split('').slice(-4).join('') === 'exit') {
        stdout.write('\nSaved in file "text.txt"\n');
        process.exit();
    }
    fs.appendFile(
        path.join(__dirname, 'text.txt'),
        key,
        (err) => {
            if (err) throw err;
        }
    );
    stdout._write(key)
});