import multer from "./Multer";
import {NextFunction, Response, Request} from "express";
import {PassFolderLocationMiddleware} from "../Middlewares/PassFolderLocationMiddleware";

interface Props {
  before?: (req: Request, res: Response, next: NextFunction) => any;
  fileName?: string;
  folderLocation?: string;
}
export const GetMiddlewares = ({ before, fileName, folderLocation }: Props) => {
  let middlewares = [];

  if (!!before) {
    middlewares.push(before);
  }

  if (!!fileName && !!folderLocation) {
    //@ts-ignore
    middlewares.push((...args) => PassFolderLocationMiddleware(...args, folderLocation));
    middlewares.push(multer.array(fileName))
  }

  return middlewares;
}