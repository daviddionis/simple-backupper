import { ConnectOptions } from "ssh2-sftp-client";

export const EncryptionKey = 'AMegaUltraHyperSecureRobustEncryptionKey';

export enum Vias {
    Email = 'Email',
    SFTP = 'SFTP',
}

export const MySQLConfig = {
    host: 'localhost',
    user: 'root',
    password: 'password',
    port: false,
    protocol: false,
};

export const SFTPConfig: ConnectOptions = {
    host: 'example.com',
    port: 22,
    username: 'root',
    password: 'AVerySecurePassword',
};

export const Backup = {
    Databases: {
        everySeconds: 3600,
        vias: [Vias.SFTP],
        databases: [
            'db_name',
        ],
        tempDestination: './temp/db',
        sftpDestination: '/root/backups/db',
    },
    Folders: {
        everySeconds: 3600,
        vias: [Vias.SFTP],
        folders: [
            '/Users/my_user_name/Documents/folder_wanted'
        ],
        tempDestination: './temp/folders',
        sftpDestination: '/root/backups/folders',
    }
}