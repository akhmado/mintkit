import {PrismaClient} from '@prisma/client';
import {EntityManagerTemplate} from "./index";

export const prisma = new PrismaClient();

export class PrismaEntityManager extends EntityManagerTemplate {
  ENTITY_KEY;
  select: Record<string, boolean>;

  async findOne(id: any) {
    return await prisma[this.ENTITY_KEY].findUnique({
      where: {id},
      select: this.select
    });
  }

  async findMany() {
    return await prisma[this.ENTITY_KEY].findMany({
      select: this.select
    });
  }

  async create(data: any, fileField?: string, filePath?: string) {
    // console.log('DATA IS HERE', data);
    // console.log('Create fileField', fileField);

    console.log('Create - filePath', filePath);

    const te = {
      ...data,
      isActive: false,
      price: 525.25,
      ...(fileField && filePath && {[fileField]: filePath})
    }

    try {
      return await prisma[this.ENTITY_KEY].create({
        data: te,
        select: this.select
      });
    } catch (error: any) {
      return {error: error.message};
    }
  }

  async update(id: any, data: any) {
    try {
      return await prisma[this.ENTITY_KEY].update({where: {id}, data, select: this.select});
    } catch (error: any) {
      if (error.code === 'P2025') {
        return {message: 'Record was now found.'};
      }
      return {error: error.message};
    }
  }

  async delete(id: any) {
    try {
      await prisma[this.ENTITY_KEY].delete({where: {id}});
      return {message: 'Deleted successfully'}
    } catch (error: any) {
      return {error: error.meta.cause}
    }
  }

}