const fs = require('fs')
const path = require('path')
const { Transform } = require('stream');

// utilits
function copier(srcPath, distPath) {
  fs.readdir(srcPath, { withFileTypes: true }, (err, files) => {
    if (err) throw err
    files.forEach(file => {
      const srcFilePath = path.join(srcPath, file.name)
      const distFilePath = path.join(distPath, file.name)
      if (file.isFile()) {
        fs.copyFile(srcFilePath, distFilePath, (err) => {
          if (err) throw err
          else {
            // console.log(`${file.name} file copyed`) 
          }
        })
      } else {
        fs.mkdir(distFilePath, { recursive: true }, (err) => {
          if (err) throw err
          else {
            copier(srcFilePath, distFilePath)
            // console.log(`${distFilePath} create`)
          }
        })
      }
    })
  })
}
// create project-dist folder
fs.mkdir(
  path.join(__dirname, 'project-dist'),
  { recursive: true },
  err => { if (err) throw err }
)
// boundle style.css file 
fs.open(
  path.join(__dirname, 'project-dist', 'style.css'),
  "w",
  (err) => { if (err) throw err }
)
// function rewriter(pathToFile) {
//   // fs.stat(
//   //   pathToFile,
//   //   (err) => {
//   if (pathToFile) {
//     // console.log(pathToFile)
//     fs.unlink(
//       pathToFile, (err => {
//         if (err) console.log(err)
//         else console.log('file update')
//       }))
//   } else { throw err }
//   //   }
//   // )
// }
fs.readdir(path.join(__dirname, 'styles'), { withFileTypes: true }, (err, files) => {
  if (err) throw err
  files.forEach(file => {
    if (file.isFile() && path.extname(path.join(__dirname, 'styles', file.name)) === ".css") {
      fs.readFile(path.join(__dirname, 'styles', file.name), "utf-8", (err, data) => {
        if (err) throw err
        const pathToFile = path.join(__dirname, 'project-dist', 'style.css')
        fs.appendFile(pathToFile,
          data,
          (err) => { if (err) throw err }
        )
      })
    }
  })
})

// copy assets
const srcAssets = path.join(__dirname, 'assets')
const distAssets = path.join(__dirname, 'project-dist', 'assets')

copier(srcAssets, distAssets)

// build html 

const readableTemplate = fs.createReadStream(path.join(__dirname, 'template.html'), 'utf-8')
const writeableIndex = fs.createWriteStream(path.join(__dirname, 'project-dist', 'index.html'))

const reverse = new Transform(
  {
    transform(chunk, encoding, callback) {
      let resultChunk = chunk.toString()

      const arrMarks = chunk.toString().match(/\{\{[a-z]+\}\}/g)
      const nameComponent = arrMarks.map(i => i.match(/[a-z]+/)[0])

      for (let i = 0; i < nameComponent.length; i++) {
        const pathToComponent = path.join(__dirname, 'components', `${nameComponent[i]}.html`)

        fs.access(pathToComponent, fs.F_OK, (err) => {
          if (err) {
            console.log(`file "${nameComponent[i]}" not found`)
            resultChunk = resultChunk.replace(`{{${nameComponent[i]}}}`, '')
          } else {
            const readableComponent = fs.createReadStream(pathToComponent, 'utf-8')
            readableComponent.on('data', (dataComponent) => {
              const mark = new RegExp(`{{${nameComponent[i]}}}`)
              resultChunk = resultChunk.replace(mark, dataComponent)
              if (!resultChunk.match(/\{\{[a-z]+\}\}/g)) callback(null, resultChunk)
            })
          }
        })
      }
    }
  }
)

readableTemplate.pipe(reverse).pipe(writeableIndex)


