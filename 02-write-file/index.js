const { stdin, stdout } = process;
const fs = require('fs');
const path = require('path');

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
    if (key === '\u0003') {
        stdout.write('\nBye!\n');
        process.exit();
    }

    fs.appendFile(
        path.join(__dirname, 'text.txt'),
        key,
        (err) => {
            if (err) throw err;
        }
    );

    stdout.write(key);

});


// function write() {

    //     stdout.write('Write\'l something?\n');

    //     stdin.on("data", data => {
    //         const result = data;
    //         let text = result.toString();
    //         console.log(typeof text);

    //         process.exit();
    //     });


    //     process.on('exit', () => stdout.write('Good luck!\n'));

// }

// write();
