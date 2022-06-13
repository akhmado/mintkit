import {IFilesConfig, IMintViewFileConfig} from "./types";

const EXISTING_PATHS: Record<string, boolean> = {};

export const CheckIsPathUsed = (mintPath: string) => {
  if (EXISTING_PATHS.hasOwnProperty(mintPath)) {
    throw `Path ${mintPath} is used by another view`;
  } else {
    EXISTING_PATHS[mintPath] = true;
  }
}

export const CheckIfFilesConfigPresent = (config?: IFilesConfig, files?: IMintViewFileConfig) => {
  if (!!files?.fileName && !config) {
    throw 'Please provide a files config to the MintKit'
  }
}

export const CheckSupportedContentType = (contentType: string): { isSupported: boolean; contentType: string } => {
  const isSupported = !!(
    contentType.includes('multipart/form-data') ||
    contentType.includes('application/json') ||
    contentType.includes('application/x-www-form-urlencoded')
  )
  return {
    isSupported,
    contentType
  };
}


