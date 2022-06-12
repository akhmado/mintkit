import multer from 'multer';
import path from 'path';

const fileStorage = multer.diskStorage({
  filename: (req: any, file: any, cb: any) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
  destination: async (req: any, file: any, cb: any) => {

    console.log("YOYO", req.folderLocation)

    cb(null, path.join(req?.folderLocation));
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

export default multer({ storage: fileStorage, fileFilter: fileFilter });