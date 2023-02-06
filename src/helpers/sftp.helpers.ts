import Client from 'ssh2-sftp-client';
import { SFTPConfig } from '../../config';

export const startClient = (): Promise<Client> =>
    new Promise((resolve, reject) => {
        let newClient = new Client();
        newClient.connect(SFTPConfig).then(() =>
            resolve(newClient)
        ).catch(err => reject(err));
    });

export const sendFileViaSFTPFromTo = (from: string, to: string): Promise<void> =>
    new Promise(async (resolve, reject) => {
        try {
            const client = await startClient();
            client.fastPut(from, to).then(() => {
                client.end();
                return resolve();
            });
        } catch (err) {
            return reject(err);
        }
    });
