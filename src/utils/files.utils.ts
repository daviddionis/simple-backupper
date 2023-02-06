import path from 'path';
import { __dirnameAtSrcLevel } from '..';
import { Backup } from '../../config';

export const getTempDatabaseFilePath = (fileName: string) =>
    path.join(__dirnameAtSrcLevel, Backup.Databases.tempDestination, fileName);

export const getTempFolderFilePath = (fileName: string) =>
    path.join(__dirnameAtSrcLevel, Backup.Folders.tempDestination, fileName);