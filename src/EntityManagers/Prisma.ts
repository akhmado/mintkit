import { PrismaClient } from '@prisma/client';
export const prisma = new PrismaClient();

export class EntityManager {
  ENTITY_KEY;
  select: string[] | undefined = undefined;

  constructor(entity: any, select?: string[]) {
    this.ENTITY_KEY = entity;
    this.select = select;
  }

  async findOne(id: any) {
    return await prisma[this.ENTITY_KEY].findUnique({ 
      where: { id }
    });
  }

  async findMany() {
    return await prisma[this.ENTITY_KEY].findMany({
      select: this.select
    });
  }

  async create(data: any) {
    try {
      return await prisma[this.ENTITY_KEY].create({ data });
    } catch (error: any) {
      return { error: error.message };
    }
  }

  async update(id: any, data: any) {
    try {
      return await prisma[this.ENTITY_KEY].update({ where: { id }, data });
    } catch (error: any) {
      if (error.code === 'P2025') {
        return { message: 'Record was now found.'};
      }
      return { error: error.message };
    }
  }

  async delete(id: any) {
    try {
      await prisma[this.ENTITY_KEY].delete({ where: { id } });
      return { message: `deleted successfully` }
    } catch(error: any) {
      return { error: error.meta.cause }
    }
  }

}