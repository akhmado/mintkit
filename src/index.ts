import {prisma} from './EntityManagers/Prisma';
/* Checks */
import {CheckIfFilesConfigPresent, CheckIsPathUsed} from "./Common/Checks";
/* Types */
import {IMintView, IMintKitConfig, OrmTypes, IFilesConfig} from "./Common/types";
import express, { Express } from 'express';
import {DataSource} from "typeorm";
import {ExpressHandler} from "./RequestHandler/Express/Express";

/* Index */
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

    const props = {
      entity,
      methods,
      validationEnabled: validation.enabled,
      ormType: this.ormType,
      select,
      filesConfig: this.filesConfig,
      viewFilesConfig: files,
      dataSource: this.dataSource,
    }

    if (!!this.expressApp) {
      ExpressHandler(this.expressApp, this.getURL(mintPath), props);
    }
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
