import {Request, Response, NextFunction, Express} from 'express';
import {DataSource} from "typeorm";

export type OrmTypes = 'prisma' | 'typeorm';

export interface IMintKit {
  app: Express;
  apiPrefix?: string;
  ormType?: OrmTypes;
  dataSource?: DataSource;
}

export interface IMintBuild {
  entity: string;
  path?: string;
  methods?: {
    findOne?: boolean;
    delete?: boolean;
    create?: boolean;
    update?: boolean;
  };
  before?: (req: Request, res: Response, next: NextFunction) => void;
  select?: string[];
}