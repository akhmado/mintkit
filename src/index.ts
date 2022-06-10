import {prisma} from './EntityManagers/Prisma';
/* Managers */
import {RouterManager} from './RouterManager/Express'
import {GetManager} from "./Common/GetManager";
import {GetMiddlewares} from "./Common/GetMiddlewares";
import {CheckIfFilesConfigPresent, CheckIsPathUsed} from "./Common/Checks";
/* Types */
import {IMintView, IMintKitConfig, OrmTypes, IFilesConfig} from "./Common/types";
import express, {Request, Response, NextFunction, Express} from 'express';
import {DataSource} from "typeorm";

/* Main */
export class MintKit {
  private readonly expressApp: Express;
  private readonly apiPrefix: string;
  private readonly ormType: OrmTypes;
  private readonly dataSource: DataSource;
  private readonly filesConfig: IFilesConfig;

  constructor(app: Express, {apiPrefix, dataSource, ormType = 'prisma', filesConfig }: IMintKitConfig) {
    this.expressApp = app;
    this.apiPrefix = apiPrefix;
    this.ormType = ormType;
    this.dataSource = dataSource;

    //Enable serving static files
    if (!!filesConfig && filesConfig.servingURL) {
      this.filesConfig = {
        servingURL: filesConfig.servingURL,
        folderLocation: filesConfig.folderLocation
      }
      app.use(`/${filesConfig.servingURL}`, express.static(filesConfig.folderLocation))
    }
  }

  getURL(path: string) {
    return this.apiPrefix ? `/${this.apiPrefix}/${path}/:id?` : `/${path}/:id?`;
  }

  view({path, entity, methods, select, before, files, validation = { enabled: true } }: IMintView) {

    const mintPath = path || entity;
    CheckIsPathUsed(mintPath)
    CheckIfFilesConfigPresent(this.filesConfig, files)

    const manager = GetManager({
      ormType: this.ormType,
      dataSource: this.dataSource,
      entity,
      select,
    });

    const middlewares = GetMiddlewares({
      fileName: files?.fileName,
      folderLocation: this.filesConfig?.folderLocation,
      validationConfig: validation,
      entity,
      before
    })

    this.expressApp.use(this.getURL(mintPath), middlewares, (req: Request, res: Response, next: NextFunction) => {
      return RouterManager({
        req,
        res,
        next,
        manager,
        methods,
        servingURL: this.filesConfig?.servingURL,
        filesConfig: files
      })
    })
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
