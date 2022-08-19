
export const createCLIZipFolder = (folderPath: string, zipDestination: string) => `zip -r ${zipDestination} ${folderPath}`;