import { ConnectOptions } from "ssh2-sftp-client";
import { DatabaseBackupConfig, FolderBackupConfig, ViaTypes } from "./src/models/config.interfaces";

export const EncryptionKey = 'AMegaUltraHyperSecureRobustEncryptionKey';

export const MySQLConfig = {
    host: 'localhost',
    user: 'root',
    password: 'AVerySecurePassword',
    port: false,
    protocol: false,
};

export const NodeMailerConfig = {
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: 'example@gmail.com',
        pass: 'AVerySecurePassword',
    },
};

export const SFTPConfig: ConnectOptions = {
    host: 'example.com',
    port: 22,
    username: 'root',
    password: 'AVerySecurePassword',
};

export const Backup = {
    Databases: {
        databases: [
            {
                database: 'database_name_1',
                everySeconds: 3600,
                via: [
                    {
                        type: ViaTypes.Email,
                        destination: 'database.backups@example.com',
                    },
                    {
                        type: ViaTypes.SFTP,
                        destination: '/folder/where/to/save/backup',
                    },
                ]
            },
            {
                database: 'database_name_2',
                everySeconds: 3600,
                via: {
                    type: ViaTypes.Email,
                    destination: 'database.backups@example.com',
                }
            },
        ] as DatabaseBackupConfig[],
        tempDestination: './temp/db',
    },
    Folders: {
        folders: [
            {
                folder: '/folder/to/backup/images',
                everySeconds: 3600,
                via: {
                    type: ViaTypes.SFTP,
                    destination: '/folder/where/to/save/backup',
                }
            }
        ] as FolderBackupConfig[],
        tempDestination: './temp/folders',
    }
}