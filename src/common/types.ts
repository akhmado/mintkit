import { Request, Response, NextFunction } from 'express';

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