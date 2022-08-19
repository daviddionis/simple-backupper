import { Backup } from "../../config";
import { createCLIMySQLDump } from "../helpers/mysql.helpers";
import * as path from "path";
import * as fs from "fs/promises";
import { getActualFullDate } from "../utils/dates.utils";
import { createCLIEncryptFile } from "../helpers/openssl.helpers";
import { sendFileFromTo } from "../helpers/sftp.helpers";

const exec = require('child_process').exec;

export const executeDatabasesBackups = () => {
    for (let db of Backup.Databases.databases) {
        console.log(`Executing MySQL backup for ${db}`);
        backupDatabase(db);
    }
}

export const backupDatabase = (database: string): Promise<void> =>
    new Promise((resolve, reject) => {
        let fileName = `${database}_${getActualFullDate()}.sql`;
        let filePath = path.join(__dirname, '../../', Backup.Databases.tempDestination, fileName);


        const exportMySQL = exec(createCLIMySQLDump(database, filePath));

        exportMySQL.on('close', async (code: string) => {
            if (code == '0') {
                const encryptFile = exec(createCLIEncryptFile(filePath));

                encryptFile.on('close', async (code: string) => {
                    if (code == '0') {
                        await fs.unlink(filePath);
                        filePath += '.enc';
                        fileName += '.enc';
                        await sendFileFromTo(filePath, Backup.Databases.sftpDestination + '/' + fileName);
                        await fs.unlink(filePath);

                        console.log(`Database ${database} backup finished`);
                        return resolve();
                    }
                });
            }
        });
    });