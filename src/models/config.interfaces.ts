export enum ViaTypes {
    Email = 'Email',
    SFTP = 'SFTP',
}

export interface BackupConfig {
    everySeconds: number;
    via: Via[] | Via;
    destination?: string;
}

export interface Via {
    type: ViaTypes;
    destination: string;
}

export interface DatabaseBackupConfig extends BackupConfig {
    database: string;
}

export interface FolderBackupConfig extends BackupConfig {
    folder: string;
}