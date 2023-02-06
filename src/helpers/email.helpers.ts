import * as nodemailer from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';
import path from 'path';
import { __dirnameAtSrcLevel } from '..';
import { Backup, NodeMailerConfig } from '../../config';
// create a function to send via nodemailer a file as an attachment

export interface EmailWithAttachment {
    to: string;
    subject: string;
    text?: string;
    file?: string[] | string;
}

export const sendEmailWithAttachment = (emailInfo: EmailWithAttachment) =>
    new Promise(async (resolve, reject) => {
        try {
            const transporter = nodemailer.createTransport(NodeMailerConfig);

            let mailOptions: Mail.Options = {};

            mailOptions.to = emailInfo.to;
            mailOptions.subject = emailInfo.subject;

            if (emailInfo.text)
                mailOptions.text = emailInfo.text;

            if (emailInfo.file) {
                if (Array.isArray(emailInfo.file)) {
                    mailOptions.attachments = [];

                    for (const file of emailInfo.file) {
                        mailOptions.attachments.push({
                            filename: file,
                            path: file,
                        });
                    }
                }
                else {
                    mailOptions.attachments = [
                        {
                            filename: emailInfo.file,
                            path: emailInfo.file,
                        },
                    ];
                }
            }

            const info = await transporter.sendMail(mailOptions);

            return resolve(info);
        } catch (err) {
            console.error(err);
            return reject(err);
        }
    });



export const tellMeDirnameFromEmail = () => path.join(__dirnameAtSrcLevel, Backup.Databases.tempDestination);