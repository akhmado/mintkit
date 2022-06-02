const EXISTING_PATHS: Record<string, boolean> = {};

export const CheckIsPathUsed = (mintPath: string) => {
  if (EXISTING_PATHS.hasOwnProperty(mintPath)) {
    throw Error(`Path ${mintPath} is used by another view`)
  } else {
    EXISTING_PATHS[mintPath] = true;
  }
}


