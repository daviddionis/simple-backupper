import { Backup } from "../../config";
import { createCLIMySQLDump } from "../helpers/mysql.helpers";
import * as fs from "fs/promises";
import { getActualFullDate } from "../utils/dates.utils";
import { createCLIEncryptFile } from "../helpers/openssl.helpers";
import { sendFileViaSFTPFromTo } from "../helpers/sftp.helpers";
import { DatabaseBackupConfig, ViaTypes } from "../models/config.interfaces";
import { getTempDatabaseFilePath } from "../utils/files.utils";
import { sendEmailWithAttachment } from "../helpers/email.helpers";

const exec = require('child_process').exec;

export const backupDatabase = (dbInfo: DatabaseBackupConfig): Promise<void> =>
    new Promise((resolve, reject) => {
        try {
            const actualFullDate = getActualFullDate();

            let fileName = `${dbInfo.database}_${actualFullDate}.sql`;
            let filePath = getTempDatabaseFilePath(fileName);

            const exportMySQL = exec(createCLIMySQLDump(dbInfo.database, filePath));

            exportMySQL.on('close', async (code: string) => {
                if (code == '0') {
                    const encryptFile = exec(createCLIEncryptFile(filePath));

                    encryptFile.on('close', async (code: string) => {
                        if (code == '0') {

                            filePath += '.enc';
                            fileName += '.enc';

                            let vias = [];

                            if (!Array.isArray(dbInfo.via)) vias.push(dbInfo.via);
                            else vias = dbInfo.via;

                            for (let i = 0; i < vias.length; i++) {
                                const via = vias[i];

                                if (via.type == ViaTypes.SFTP) {
                                    await sendFileViaSFTPFromTo(filePath, via.destination + '/' + fileName)
                                        .then(() => console.log(`Folder sent via SFTP to ${via.destination} for ${dbInfo.database} at ${actualFullDate}`))
                                        .catch((err) => console.error(`Error sending database via SFTP to ${via.destination} for ${dbInfo.database} at ${actualFullDate}`, err));
                                }

                                if (via.type == ViaTypes.Email) {
                                    await sendEmailWithAttachment({
                                        to: via.destination,
                                        subject: 'Backup ' + dbInfo.database + ' ' + actualFullDate,
                                        file: filePath,
                                    })
                                        .then(() => console.log(`Database sent via email to ${via.destination} for ${dbInfo.database} at ${actualFullDate}`))
                                        .catch((err) => console.error(`Error sending database via email to ${via.destination} for ${dbInfo.database} at ${actualFullDate}`, err));
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
        } catch (err) {
            console.error('Not handled error', err);
            return reject(err);
        }
    });