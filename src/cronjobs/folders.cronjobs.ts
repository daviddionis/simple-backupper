import { Backup } from "../../config";
import { executeFoldersBackups } from "../controllers/folders.controllers";

export const executeFoldersBackupCJ = () => {
    executeFoldersBackups();
    setInterval(() => executeFoldersBackups(), Backup.Folders.everySeconds * 1000);
}
