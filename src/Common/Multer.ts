import multer from 'multer';
import path from 'path';

const fileStorage = multer.diskStorage({
  filename: (req: any, file: any, cb: any) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
  destination: async (req: any, file: any, cb: any) => {
    cb(null, path.join('uploads'));
  },
});

const fileFilter = (req: any, file: any, cb: any) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

// multer({
//   storage: multer.diskStorage({
//     destination: (req, file, callback) => {
//       let userId = req.user._id;
//       let path = `./public/uploads//${userId}`;
//       fs.mkdirsSync(path);
//       callback(null, path);
//     },
//     filename: (req, file, callback) => {
//       //originalname is the uploaded file's name with extn
//       callback(null, file.originalname);
//     }
//   })
// });

export default multer({ storage: fileStorage, fileFilter: fileFilter });