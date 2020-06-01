const multer = require('multer')
const path = require('path')
const storage = multer.diskStorage({
    destination: './assets/images/',
    filename: function(req, file, cb){
      cb(null,file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
  });
  

  // Check File Type
  function checkFileType(file, cb){
    // Allowed ext
    const filetypes = /jpeg|jpg|png|gif/;
    // Check ext
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    // Check mime
    const mimetype = filetypes.test(file.mimetype);
  
    if(mimetype && extname){
      return cb(null,true);
    } else {
      cb('Error: Images Only!');
    }
  }

  module.exports = {
      uploadImg: () => {
        return multer({
            storage: storage,
            limits:{fileSize: 1000000},
            fileFilter: function(req, file, cb){
              checkFileType(file, cb);
            }
          }).single('avatar');
      }
  }