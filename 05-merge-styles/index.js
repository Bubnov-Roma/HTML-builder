const fs = require('fs')
const path = require('path')

const stylesDir = path.join(__dirname, 'styles/')
const bundleFilePath = path.join(__dirname, "project-dist", "bundle.css")

fs.open(
  bundleFilePath,
  "w",
  (err) => { if (err) throw err }
)

fs.unlink(
  bundleFilePath,
  err => { if (err) throw err }
)

fs.readdir(stylesDir, { withFileTypes: true }, (err, files) => {
  if (err) throw err
  files.forEach(file => {
    if (file.isFile() && path.extname(path.join(stylesDir, file.name)) === ".css") {
      fs.readFile(path.join(stylesDir, file.name), "utf-8", (err, data) => {
        if (err) throw err
        fs.appendFile(bundleFilePath,
          data,
          (err) => { if (err) throw err }
        )
      })
    }
  })
  console.log("bundle done")
})

