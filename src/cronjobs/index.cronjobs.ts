import { Backup } from "../../config"
import { executeMySQLBackupCJ as executeDatabasesBackupCJ } from "./databases.cronjobs";
import { executeFoldersBackupCJ as executeFoldersBackupCJ } from "./folders.cronjobs";

export const executeCronJobs = () => {
    if (Backup.Databases != null) executeDatabasesBackupCJ();
    if (Backup.Folders != null) executeFoldersBackupCJ();

}
