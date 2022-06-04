import {NextFunction, Request, Response} from "express";

export const PassFolderLocationMiddleware = (req: Request, res: Response, next: NextFunction, folderLocation?: string) => {
  //@ts-ignore
  req.folderLocation = folderLocation;
  next();
}