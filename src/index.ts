import { prisma } from './EntityManagers/Prisma';
/* Managers */
import {RouterManager} from './RouterManager/Express'
import {GetManager} from "./Common/GetManager";
import {GetMiddlewares} from "./Common/GetMiddlewares";
import {CheckIsPathUsed} from "./Common/PathUsedCheck";
/* Types */
import {IMintView, IMintKitConfig, OrmTypes} from "./Common/types";
import express, {Request, Response, NextFunction, Express} from 'express';
import {DataSource} from "typeorm";

/* Main */
export class MintKit {
  private readonly expressApp: any;
  private readonly apiPrefix: string;
  private readonly ormType: OrmTypes;
  private readonly dataSource: DataSource;

  constructor(app: Express, {apiPrefix, dataSource, ormType = 'prisma', filesUpload}: IMintKitConfig) {
    this.expressApp = app;
    this.apiPrefix = apiPrefix;
    this.ormType = ormType;
    this.dataSource = dataSource;

    console.log('DIRNAME', __dirname);

    //Enable serving static files
    if (!!filesUpload && filesUpload.servingURL) {
      app.use(`/${filesUpload.servingURL}`, express.static(filesUpload.folderLocation))
    }
  }

  getURL(path: string) {
    return this.apiPrefix ? `/${this.apiPrefix}/${path}/:id?` : `/${path}/:id?`;
  }

  view({ path, entity, methods, select, before, files }: IMintView) {

    const mintPath = path || entity;
    CheckIsPathUsed(mintPath)

    const manager = GetManager({
      ormType: this.ormType,
      dataSource: this.dataSource,
      entity,
      select,
    });

    const middlewares = GetMiddlewares({
      fileName: files?.fileName,
      before
    })

    this.expressApp.use(this.getURL(mintPath), middlewares , (req: Request, res: Response, next: NextFunction) => RouterManager({
      req,
      res,
      next,
      manager,
      methods,
    }))
  }

  autopilot() {
    if (this.ormType === 'prisma') {
      //@ts-ignore
      const modelMap = prisma._dmmf.modelMap;
      for (const model in modelMap) {
        if (modelMap[model].name) {
          this.view({entity: modelMap[model].name});
        }
      }
    } else {
      throw 'Autopilot only supports Prisma'
    }
  }
}
