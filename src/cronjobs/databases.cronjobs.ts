import { Backup } from "../../config";
import { backupDatabase } from "../controllers/mysql.controllers";

export const executeMySQLBackupCJ = async () => {

    let intervalIds: NodeJS.Timeout[] = [];

    for (const database of Backup.Databases.databases) {

        await backupDatabase(database);

        const intervalId = setInterval(() => backupDatabase(database), database.everySeconds * 1000);

        intervalIds.push(intervalId);
    }

}

