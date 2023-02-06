import { Backup } from "../../config"
import { executeMySQLBackupCJ } from "./databases.cronjobs";
import { executeFoldersBackupCJ } from "./folders.cronjobs";

export const executeCronJobs = () => {
    if (Backup.Databases != null) executeMySQLBackupCJ();
    if (Backup.Folders != null) executeFoldersBackupCJ();

}
