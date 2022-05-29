import {EntityManager, prisma} from './EntityManagers/Prisma';
import {RouterManager} from './RouterManager/Express'
/* Types */
import {IMintBuild} from "./common/types";
import {Express, NextFunction, Response} from "express";

const EXISTING_PATHS: any = {};

/* Main */
export class MintKit {
  private readonly expressApp: any;
  private readonly apiPrefix: string;

  constructor({ app, apiPrefix } : { app: any; apiPrefix?: string }) {
    this.expressApp = app;
    this.apiPrefix = apiPrefix;
  }

  view({
         path,
         entity,
         methods,
         select,
         before = (req, res, next) => next()
       }: IMintBuild) {
    const mintPath = path || entity;

    if (EXISTING_PATHS.hasOwnProperty(mintPath)) {
      throw Error(`Path ${mintPath} is used by another view`)
    } else {
      EXISTING_PATHS[mintPath] = true;
    }

    const manager = new EntityManager(entity, select);
    const url = this.apiPrefix ? `/${this.apiPrefix}/${mintPath}/:id?` : `/${mintPath}/:id?`
    this.expressApp.use(url, before, (req: Request, res: Response, next: NextFunction) => RouterManager({
      req,
      res,
      next,
      manager,
      methods,
    }))
  }

  autopilot() {
    //@ts-ignore
    const modelMap = prisma._dmmf.modelMap;
    for (const model in modelMap) {
      if (modelMap[model].name) {
        this.view({entity: modelMap[model].name});
      }
    }
  }
}
