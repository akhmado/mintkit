export interface IMintBuild {
  entity: string;
  path?: string;
  methods?: {
    findOne?: boolean;
    delete?: boolean;
    create?: boolean;
    update?: boolean;
  };
  select?: string[];
}