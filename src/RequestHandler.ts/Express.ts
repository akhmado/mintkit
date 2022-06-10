import {Express} from "express";
import { MainManager } from "../Index/index";
import {IFilesConfig, IMintViewFileConfig, IViewMethods, OrmTypes} from "../Common/types";
import {DataSource} from "typeorm";

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
  return expressApp.use(path, async (req, res, next) => {
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


