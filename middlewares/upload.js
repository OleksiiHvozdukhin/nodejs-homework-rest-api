const multer = require("multer");
const path = require("path");

const upload = multer({
  storage: multer.diskStorage({
    destination: path.resolve("temp"),
    filename: (_, file, cb) => {
      cb(null, file.originalname);
    },
  }),
});

module.exports = upload;
