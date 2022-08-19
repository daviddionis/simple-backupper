import { MySQLConfig } from "../../config";

export const createCLIMySQLDump = (databaseName: string, fileName: string) => {
    let command = `mysqldump`;
    if (MySQLConfig.user) command += ` -u ${MySQLConfig.user}`;
    if (MySQLConfig.password) command += ` -p${MySQLConfig.password}`;
    if (MySQLConfig.host) command += ` -h ${MySQLConfig.host}`;
    if (MySQLConfig.port) command += ` -P ${MySQLConfig.port}`;
    if (MySQLConfig.protocol) command += ` --protocol=${MySQLConfig.protocol}`;
    command += ` ${databaseName}`;
    command += ` > ${fileName}`;
    return command;
}