import {IFilesConfig, IMintViewFileConfig, IViewMethods, OrmTypes} from "../Common/types";
import {checkEnabledMethods} from "../Validations/MethodValidation";
import {GetManager} from "../Common/GetManager";
import {DataSource} from "typeorm";
import {MethodManager} from "../Common/MethodManager";
import {validateData} from "../Common/BodyValidation";

/* Types */
export interface IMainManagerProps {
  entity: string;
  data: Record<string, any>;
  currentMethod: string;
  methods: IViewMethods;
  id: string;
  validationEnabled: boolean;

  ormType?: OrmTypes;
  select?: string[];
  filesPath?: string[];
  filesConfig?: IFilesConfig;
  viewFilesConfig?: IMintViewFileConfig;
  dataSource?: DataSource;
}

interface ReturnType {
  code: number;
  data?: any;
  error?: any;
}

/* Index */
export const MainManager = async ({
  methods,
  data,
  currentMethod,
  id,
  select,
  ormType = 'prisma',
  entity,
  dataSource,
  filesConfig,
  validationEnabled,
  viewFilesConfig,
  filesPath
}: IMainManagerProps): Promise<ReturnType> => {

  /* Check if method allowed */
  if (!!methods) {
    const allowedMethod = checkEnabledMethods(id, currentMethod, methods);
    if (!allowedMethod) {
      return {
        code: 400,
        error: {
          message: 'Method is not allowed.'
        }
      };
    }
  }

  /* Validate data */
  if (validationEnabled) {
    const validationResult = validateData(currentMethod, data, entity);
    if (!!validationResult) {
      return {
        code: 400,
        error: {
          data: validationResult
        }
      };
    }
  }

  /* Get manager */
  const manager = GetManager({
    ormType,
    dataSource,
    entity,
    select,
  });

  /* Process data */
  const processedData = await MethodManager({
    files: filesPath,
    currentMethod,
    id,
    filesConfig,
    viewFilesConfig,
    manager,
    data
  });

  return {code: 200, data: processedData};
}