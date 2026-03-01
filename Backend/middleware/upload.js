const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Default upload folder for CNIC (backwards compatible)
const defaultUploadDir = 'uploads/cnic';
if (!fs.existsSync(defaultUploadDir)) fs.mkdirSync(defaultUploadDir, { recursive: true });

const createStorage = (dir) =>
  multer.diskStorage({
    destination: (req, file, cb) => {
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      cb(null, dir);
    },
    filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
  });

// default uploader (used by auth routes for CNIC)
const defaultStorage = createStorage(defaultUploadDir);
const upload = multer({ storage: defaultStorage });

// helper to create uploader for different folders (e.g., story docs)
const createUploader = (folderPath) => multer({ storage: createStorage(folderPath) });

module.exports = upload;
module.exports.createUploader = createUploader;
