import Joi from 'joi';
import {prisma} from "../EntityManagers/Prisma";
import {NextFunction, Request, Response} from "express";

type ValidationDataTypes = 'integer' | 'text' | 'double precision';

const validationSchemas: Record<string, any> = {};

const createTextValidation = (data_type: ValidationDataTypes) => {
  switch (data_type) {
    case "text":
      return Joi.string().required();
    case "integer":
      return Joi.number().required();
    case 'double precision':
      return Joi.number().required();
  }
}

export const BodyValidation = async (entity: string, primaryKey = 'id') => {
  if (!validationSchemas.hasOwnProperty(entity)) {
    const data: any[] = await prisma.$queryRaw`SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME=${entity}`;
    const validationSchema: Record<string, any> = {};

    data.forEach(column => {
      if (column.column_name !== primaryKey) {
        validationSchema[column.column_name] = createTextValidation(column.data_type);
      }
    })

    validationSchemas[entity] = Joi.object(validationSchema);
  }
}

export const validateData = async (req: Request, res: Response, next: NextFunction, entity: string) => {
  if (validationSchemas.hasOwnProperty(entity)) {
    const data = req.body;
    const validationResult = validationSchemas[entity].validate(data)

    if (!!validationResult?.error) {
      res.json(validationResult);
      return;
    }

    next();
  } else {
    await BodyValidation(entity);
    validateData(req, res, next, entity)
  }
}