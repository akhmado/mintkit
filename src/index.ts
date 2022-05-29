import {prisma, PrismaEntityManager} from './EntityManagers/Prisma';
import {RouterManager} from './RouterManager/Express'
/* Types */
import {IMintBuild, IMintKit, OrmTypes} from "./common/types";
import {NextFunction, Response} from "express";
import {DataSource} from "typeorm";
import {TypeormEntityManager} from "./EntityManagers/Typeorm";

/* CONSTANTS */
const EXISTING_PATHS: any = {};

/* Main */
export class MintKit {
  private readonly expressApp: any;
  private readonly apiPrefix: string;
  private readonly ormType: OrmTypes;
  private readonly dataSource: DataSource;

  constructor({ app, apiPrefix, dataSource, ormType = 'prisma' } : IMintKit) {
    this.expressApp = app;
    this.apiPrefix = apiPrefix;
    this.ormType = ormType;
    this.dataSource = dataSource;
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

    let manager = null;

    if (this.ormType === 'prisma') {
      manager = new PrismaEntityManager(entity, select);
    } else if (this.ormType === 'typeorm') {
      manager = new TypeormEntityManager(this.dataSource, entity, select);
    }

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
