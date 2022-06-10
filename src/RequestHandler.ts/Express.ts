import {Express} from "express";
import { MainManager } from "../Index/index";
import {IFilesConfig, IMintViewFileConfig, IViewMethods, OrmTypes} from "../Common/types";
import {DataSource} from "typeorm";
import {PassFolderLocationMiddleware} from "../Middlewares/PassFolderLocationMiddleware";
import multer from "../Common/Multer";

/* Types */
interface ExpressHandlerProps {
  entity: string;
  methods: IViewMethods;
  validationEnabled: boolean;

  ormType?: OrmTypes;
  select?: string[];
  filesConfig?: IFilesConfig;
  viewFilesConfig?: IMintViewFileConfig;
  dataSource?: DataSource;
}

/* Index */
export const ExpressHandler = (expressApp: Express, path: string, props: ExpressHandlerProps) => {
  const middlewares: any[] = [];

  if (!!props?.viewFilesConfig?.fileName && !!props?.filesConfig?.folderLocation) {
    //@ts-ignore
    middlewares.push((...args) => PassFolderLocationMiddleware(...args, folderLocation));
    middlewares.push(multer.array(props.viewFilesConfig.fileName))
  }

  return expressApp.use(path, middlewares, async (req, res, next) => {
    const data = req.body;
    const currentMethod = req.method;
    const id = '';

    const result = await MainManager({
      ...props,
      currentMethod,
      data,
      files: [],
      id
    })

    if (result && !!result.error) {
      res.status(result.code).json(result.error);
      return;
    }

    if (result && !!result.data) {
      res.status(result.code).json(result.data);
      return;
    }

    res.status(500).json({ message: 'Server error' })
  })
}


