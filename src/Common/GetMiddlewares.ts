import multer from "./Multer";
import {NextFunction, Response, Request} from "express";
import {PassFolderLocationMiddleware} from "../Middlewares/PassFolderLocationMiddleware";
import {validateData} from "./BodyValidation";
import {IValidationConfig} from "./types";

interface Props {
  entity: string;
  folderLocation?: string;
  validationConfig?: IValidationConfig;
  before?: (req: Request, res: Response, next: NextFunction) => any;
  fileName?: string;
}
export const GetMiddlewares = ({ before, fileName, folderLocation, validationConfig, entity }: Props) => {
  let middlewares = [];

  if (!!before) {
    middlewares.push(before);
  }

  if (validationConfig?.enabled) {
    //@ts-ignore
    middlewares.push((...args) => validateData(...args, entity));
  }

  if (!!fileName && !!folderLocation) {
    //@ts-ignore
    middlewares.push((...args) => PassFolderLocationMiddleware(...args, folderLocation));
    middlewares.push(multer.array(fileName))
  }

  return middlewares;
}