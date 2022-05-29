import {EntityManagerTemplate} from "./index";
import {DataSource} from "typeorm";

export class TypeormEntityManager extends EntityManagerTemplate {
  dataSource: DataSource;

  constructor(dataSource: DataSource, entity: string, select?: string[]) {
    super(entity, select);
    this.dataSource = dataSource;
  }

  getSelect() {
    const selectItems = !!this.select && Object.keys(this.select);
    return selectItems && selectItems.length ? selectItems : undefined;
  }

  async findOne(id): Promise<any> {
    const repo = this.dataSource.getRepository(this.ENTITY_KEY);
    return await repo.findOne({
      where: { id },
      select: this.getSelect()
    });
  }

  async findMany(): Promise<any> {
    const repo = this.dataSource.getRepository(this.ENTITY_KEY);
    return await repo.find({
      select: this.getSelect()
    });
  }

  async create(data: any): Promise<any> {
    const repo = this.dataSource.getRepository(this.ENTITY_KEY);
    return await repo.save({ ...data });
  }

  async update(id: any, data: any): Promise<any> {
    const repo = this.dataSource.getRepository(this.ENTITY_KEY);
    return await repo.update({ id }, { ...data });
  }

  async delete(id: any): Promise<any> {
    const repo = this.dataSource.getRepository(this.ENTITY_KEY);
    try {
      await repo.delete(id);
      return {message: 'Deleted successfully'}
    } catch (error) {
      return {error: error}
    }
  }

}