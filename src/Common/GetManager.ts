import {PrismaEntityManager} from "../EntityManagers/Prisma";
import {TypeormEntityManager} from "../EntityManagers/Typeorm";
import {OrmTypes} from "./types";
import {DataSource} from "typeorm";

interface Props {
  ormType: OrmTypes
  entity: string;
  select: string[];
  dataSource: DataSource;
}

export const GetManager = ({ormType, entity, select, dataSource}: Props) => {
  if (ormType === 'prisma') {
    return new PrismaEntityManager(entity, select);
  } else if (ormType === 'typeorm') {
    return new TypeormEntityManager(dataSource, entity, select);
  }
  throw `${ormType} is not supported`;
}