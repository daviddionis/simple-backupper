
export const getFolderName = (folderPath: string): string => {
    let folderName = folderPath.split('/');
    return folderName[folderName.length - 1];
}