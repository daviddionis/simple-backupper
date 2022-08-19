import { Backup } from "../../config";
import { executeDatabasesBackups } from "../controllers/mysql.controllers";

export const executeMySQLBackupCJ = () => {
    executeDatabasesBackups();
    setInterval(() => executeDatabasesBackups(), Backup.Databases.everySeconds * 1000);
}

