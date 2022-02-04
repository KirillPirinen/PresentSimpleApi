const path = require('path')
const multer = require('multer')

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, './public/uploads')
  },
  filename(req, file, cb) {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, Date.now() + ext)
  }
})

const fileFilter = (req, file, cb) => {
  if(file.mimetype === 'image/png' || 'image/jpeg' || 'image/jpg') {
    cb(null, true)
  } else {
    cb(null, false)
  }
}

module.exports = multer({storage, fileFilter})
