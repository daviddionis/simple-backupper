import { EncryptionKey } from "../../config";

export const createCLIEncryptFile = (fileName: string) => {
    let command = `openssl enc -aes-256-cbc -salt`;
    command += ` -in ${fileName}`;
    command += ` -out ${fileName}.enc`;
    command += ` -pass pass:${EncryptionKey}`;
    return command;
}