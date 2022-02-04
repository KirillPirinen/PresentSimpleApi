const fs = require('fs')
const path = require('path')

const deleteUploadedFile = (filename) => {
    setTimeout(() => {
      fs.unlink(path.join(process.env.PWD, '/public/', filename), (err) => {
        console.log(err)
      })
    }, 0);
}

module.exports = deleteUploadedFile;
