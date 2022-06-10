import {IFilesConfig, IMintViewFileConfig} from "./types";

/* Types */
interface Props {
  currentMethod: string;
  id: string;
  filesConfig: IFilesConfig;
  viewFilesConfig?: IMintViewFileConfig;
  manager: any;
  data: Record<string, any>;
  files?: any[];
}

/* Index */
export async function MethodManager({  currentMethod, id, data, filesConfig, manager, files, viewFilesConfig }: Props) {
  const filePath = `${filesConfig?.servingURL}/${files?.[0]?.filename}`;

  /* Methods handler */
  if (currentMethod === 'GET' && id) {
    return await manager.findOne(id);
  }

  if (currentMethod === 'GET') {
    return await manager.findMany();
  }

  if (currentMethod === 'POST') {
    return await manager.create(
      data,
      viewFilesConfig?.fileTableCell || viewFilesConfig?.fileName,
      filePath
    );
  }

  if (currentMethod === 'PATCH' || currentMethod === 'PUT') {
    return await manager.update(id, data);
  }

  if (currentMethod === 'DELETE') {
    return await manager.delete(id);
  }
}