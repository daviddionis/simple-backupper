import { Backup } from "../../config";
import * as path from "path";
import * as fs from "fs/promises";
import { getActualFullDate } from "../utils/dates.utils";
import { createCLIEncryptFile } from "../helpers/openssl.helpers";
import { sendFileViaSFTPFromTo } from "../helpers/sftp.helpers";
import { createCLIZipFolder } from "../helpers/zip.helpers";
import { getFolderName } from "../utils/folders.utils";
import { getTempFolderFilePath } from "../utils/files.utils";
import { FolderBackupConfig, ViaTypes } from "../models/config.interfaces";
import { sendEmailWithAttachment } from "../helpers/email.helpers";

const exec = require('child_process').exec;

export const executeFoldersBackups = () => {
    for (let db of Backup.Folders.folders) {
        console.log(`Executing Folder backup for ${db}`);
        backupFolder(db);
    }
}

export const backupFolder = (flInfo: FolderBackupConfig): Promise<void> =>
    new Promise((resolve, reject) => {

        const actualFullDate = getActualFullDate();
        const folderName = getFolderName(flInfo.folder);
        let fileName = `${folderName}_${actualFullDate}.zip`;

        let filePath = getTempFolderFilePath(fileName);
        console.log(filePath);

        const zipExec = exec(createCLIZipFolder(flInfo.folder, filePath));

        zipExec.on('close', async (code: string) => {
            if (code == '0') {
                const encryptFile = exec(createCLIEncryptFile(filePath));

                encryptFile.on('close', async (code: string) => {

                    if (code == '0') {
                        filePath += '.enc';
                        fileName += '.enc';

                        let vias = [];

                        if (!Array.isArray(flInfo.via)) vias.push(flInfo.via);
                        else vias = flInfo.via;

                        for (let i = 0; i < vias.length; i++) {
                            const via = vias[i];

                            if (via.type == ViaTypes.SFTP) {
                                await sendFileViaSFTPFromTo(filePath, via.destination + '/' + fileName)
                                    .then(() => console.log(`Folder sent via SFTP to ${via.destination} for ${flInfo.folder} at ${actualFullDate}`))
                                    .catch((err) => console.error(`Error sending folder via SFTP to ${via.destination} for ${flInfo.folder} at ${actualFullDate}`, err));
                            }

                            if (via.type == ViaTypes.Email) {
                                await sendEmailWithAttachment({
                                    to: via.destination,
                                    subject: 'Backup Folder ' + flInfo.folder + ' ' + actualFullDate,
                                    file: filePath,
                                })
                                    .then(() => console.log(`Folder sent via email to ${via.destination} for ${flInfo.folder} at ${actualFullDate}`))
                                    .catch((err) => console.error(`Error sending folder via email to ${via.destination} for ${flInfo.folder} at ${actualFullDate}`, err));
                            }

                        }
                        await fs.unlink(filePath);
                        filePath = filePath.replace('.enc', '');
                        await fs.unlink(filePath);
                        return resolve();
                    }
                });
            }
        });
    });