import {EntityManager, prisma} from './EntityManagers/Prisma';
import {RouterManager} from './RouterManager/Express'
/* Types */
import {IMintBuild} from "./common/types";

const EXISTING_PATHS: any = {};

/* Main */
export class MintKit {
  expressApp: any;

  constructor(expressApp: any) {
    this.expressApp = expressApp;
  }

  build({path, entity, methods, select}: IMintBuild) {
    const mintPath = path || entity;

    if (EXISTING_PATHS.hasOwnProperty(mintPath)) {
      throw Error(`Path ${mintPath} is used by another NextSet`)
    } else {
      EXISTING_PATHS[mintPath] = true;
    }

    const manager = new EntityManager(entity, select);
    this.expressApp.use(`/${mintPath}/:id?`, (req: any, res: any, next: any) => RouterManager({
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
        this.build({entity: modelMap[model].name});
      }
    }
  }
}
