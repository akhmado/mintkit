import Ajv, {ValidateFunction} from "ajv"
import {prisma} from "../EntityManagers/Prisma";

type ValidationDataTypes = 'integer' | 'text' | 'double precision' | 'boolean';

const validationSchemas: Record<string, {
  required: ValidateFunction<any>;
  optional: ValidateFunction<any>;
}> = {};

const getPropertyType = (data_type: ValidationDataTypes) => {
  if (data_type === 'text') {
    return 'string';
  }
  if (data_type === 'double precision') {
    return 'number';
  }
  return data_type;
}

export const BodyValidation = async (entity: string, primaryKey = 'id') => {
  if (!validationSchemas.hasOwnProperty(entity)) {
    const data: any[] = await prisma.$queryRaw`SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME=${entity}`;

    const properties: Record<string, { type: string }> = {};
    const required: string[] = [];
    const ajv = new Ajv();

    data.forEach(column => {
      if (column.column_name !== primaryKey) {
        properties[column.column_name] = {
          type: getPropertyType(column.data_type)
        }
        if (column.is_nullable === 'NO') {
          required.push(column.column_name);
        }
      }
    });

    validationSchemas[entity] = {
      required: null,
      optional: null
    }

    validationSchemas[entity].required = ajv.compile({
        type: "object",
        properties,
        required
    })

    validationSchemas[entity].optional = ajv.compile({
      type: "object",
      properties,
      required: []
    })
  }
}

export const validateData = async (method: string, data: Record<string, any>, entity: string, isFormData?: boolean) => {
  if (method === 'POST' || method === 'PUT' || method === 'PATCH') {
    const isCreate = method === 'POST' ? 'required' : 'optional';
    const dataToProcess = parseFormData(data);
    if (validationSchemas.hasOwnProperty(entity)) {
      return validate(entity, isCreate, dataToProcess);
    } else {
      await BodyValidation(entity);
      return validate(entity, isCreate, dataToProcess);
    }
  }
}

const validate = (entity: string, isCreate: string, data: Record<string, any>) => {
  const valid = validationSchemas[entity][isCreate](data);
  if (!valid) {
    return validationSchemas[entity][isCreate].errors;
  }
  return null;
}

export const parseFormData = (data: Record<string, any>): Record<string, any> => {
  const parsedData: Record<string, any> = {};

  for (const key in data) {
    if (data[key] === 'false' || data[key] === 'true') {
      parsedData[key] = data[key] === 'true';
    } else if (!isNaN(Number(data[key]))) {
      parsedData[key] = Number(data[key])
    } else {
      parsedData[key] = data[key]
    }
  }

  return parsedData;
}
