import { Backup } from "../../config";
import * as path from "path";
import * as fs from "fs/promises";
import { getActualFullDate } from "../utils/dates.utils";
import { createCLIEncryptFile } from "../helpers/openssl.helpers";
import { sendFileFromTo } from "../helpers/sftp.helpers";
import { createCLIZipFolder } from "../helpers/zip.helpers";
import { getFolderName } from "../utils/folders.utils";

const exec = require('child_process').exec;

export const executeFoldersBackups = () => {
    for (let db of Backup.Folders.folders) {
        console.log(`Executing Folder backup for ${db}`);
        backupFolder(db);
    }
}

export const backupFolder = (folder: string): Promise<void> =>
    new Promise((resolve, reject) => {
        let fileName = getFolderName(folder);
        fileName += `_${getActualFullDate()}.zip`;
        let filePath = path.join(__dirname, '../../', Backup.Folders.tempDestination, fileName);

        const zipExec = exec(createCLIZipFolder(folder, filePath));

        zipExec.on('close', async (code: string) => {
            if (code == '0') {
                const encryptFile = exec(createCLIEncryptFile(filePath));

                encryptFile.on('close', async (code: string) => {

                    if (code == '0') {
                        await fs.unlink(filePath);
                        filePath += '.enc';
                        fileName += '.enc';
                        await sendFileFromTo(filePath, Backup.Folders.sftpDestination + '/' + fileName);
                        await fs.unlink(filePath);

                        console.log(`Folder ${getFolderName(folder)} backup finished`);
                        return resolve();
                    }
                });
            }
        });
    });