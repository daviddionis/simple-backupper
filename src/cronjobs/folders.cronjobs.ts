import { Backup } from "../../config";
import { backupFolder, executeFoldersBackups } from "../controllers/folders.controllers";

export const executeFoldersBackupCJ = async () => {

    let intervalIds: NodeJS.Timeout[] = [];

    for (const folder of Backup.Folders.folders) {

        await backupFolder(folder);

        const intervalId = setInterval(() => backupFolder(folder), folder.everySeconds * 1000);

        intervalIds.push(intervalId);
    }

}
