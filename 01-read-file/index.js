const fs = require('fs');
const path = require('path');
const { stdout } = process;
// const readableStream = fs.createReadStream(path.join(__dirname, 'text.txt'));
const readableStream = new fs.ReadStream(path.join(__dirname, 'text.txt'));

readableStream.on('data', (text) => stdout.write(text.toString()));


