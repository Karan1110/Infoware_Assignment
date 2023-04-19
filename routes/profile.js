const express = require("express");
const router = express.Router();
const multer = require('multer');
const fs = require("fs");
const winston = require("winston");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

router.post("/dp", upload.single('image'), (req, res) => {
    fs.unlink(req.file.path, (err) => {
        if (err) {
          winston.error(err);
        }
      });
    res.header("Content/Dispostion", "attachment");
    res.sendFile(req.file);
 });

module.exports = router;