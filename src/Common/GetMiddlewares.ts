import multer from "./Multer";
import {NextFunction, Response, Request} from "express";

interface Props {
  before?: (req: Request, res: Response, next: NextFunction) => any;
  fileName?: string;
}
export const GetMiddlewares = ({ before, fileName }: Props) => {
  let middlewares = [];

  if (!!before) {
    middlewares.push(before);
  }

  if (!!fileName) {
    middlewares.push(multer.array(fileName));
  }

  return middlewares;
}