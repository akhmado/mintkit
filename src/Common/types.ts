import {Request, Response, NextFunction } from 'express';
import {DataSource} from "typeorm";

export type OrmTypes = 'prisma' | 'typeorm';

export interface IMintKitConfig {
  apiPrefix?: string;
  ormType?: OrmTypes;
  dataSource?: DataSource;
  filesUpload?: IFilesConfig;
}

export interface IFilesConfig {
  servingURL: string;
  folderLocation: string;
}

export interface IRouterManager {
  req: Request;
  res: Response;
  next: NextFunction;
  manager: any;
  methods: IViewMethods;
  servingURL?: string;
  filesConfig?: IMintViewFileConfig;
}

export interface IMintViewFileConfig {
  fileName: string;
  fileTableCell?: string;
}

export interface IMintView {
  entity: string;
  path?: string;
  methods?: IViewMethods;
  files?: IMintViewFileConfig;
  before?: (req: Request, res: Response, next: NextFunction) => void;
  select?: string[];
}

interface IViewMethods {
  findOne?: boolean;
  findMany?: boolean;
  delete?: boolean;
  create?: boolean;
  update?: boolean;
}