const fs = require('fs').promises
const path = require('path')

const deleteUploadedFile = (filename) => {
    fs.unlink(path.join(process.env.PWD, '/public/', filename)).catch(err => {
      console.error(err)
    })
}

module.exports = deleteUploadedFile;
