export class EntityManagerTemplate {
  ENTITY_KEY;
  select: Record<string, boolean>;

  constructor(entity: any, select?: string[]) {
    this.ENTITY_KEY = entity;

    //Select table fields
    if (select?.length) {
      this.select = {};
      select?.forEach(field => {
        this.select[field] = true;
      })
    }
  }

  async findOne(id: any): Promise<any> {}

  async findMany(): Promise<any> {}

  async create(data: any): Promise<any> {}

  async update(id: any, data: any): Promise<any> {}

  async delete(id: any): Promise<any> {}

}