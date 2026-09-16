import nodemailer, { type Transporter } from "nodemailer";

import { ConfigService } from "./ConfigService.js";
import type { IServerConfig } from "../interfaces/IServerConfig.js";

interface ISendRegistrationMailParameters {
    vorname: string;
    nachname: string;
    firma: string;
    geburtsdatumFormatted: string;
    pdfBuffer: Buffer;
    pdfFileName: string;
}

export class EmailService {
    private static _transporter: Transporter | undefined;

    public static async sendRegistrationMail(parameters: ISendRegistrationMailParameters): Promise<void> {
        const config: IServerConfig = ConfigService.getConfig();
        const body: string =
            "Neue Anmeldung eingegangen!\n\n" +
            `Vorname: ${parameters.vorname}\n` +
            `Nachname: ${parameters.nachname}\n` +
            `Unternehmen: ${parameters.firma}\n` +
            `Geburtsdatum: ${parameters.geburtsdatumFormatted}\n\n` +
            "Das vollständige Anmeldeformular befindet sich im Anhang!";

        await this._getTransporter().sendMail({
            from: `Anmeldeformular <${config.mailSender}>`,
            replyTo: config.mailSender,
            to: config.mailRecipient,
            subject: `Neue Anmeldung von ${parameters.vorname} ${parameters.nachname}`,
            text: body,
            attachments: [
                {
                    filename: parameters.pdfFileName,
                    content: parameters.pdfBuffer,
                    contentType: "application/pdf"
                }
            ]
        });
    }

    private static _getTransporter(): Transporter {
        if (!this._transporter) {
            this._transporter = nodemailer.createTransport({
                host: process.env.SMTP_HOST,
                port: Number(process.env.SMTP_PORT) || 587,
                secure: process.env.SMTP_SECURE === "true",
                auth: process.env.SMTP_USER
                    ? {
                          user: process.env.SMTP_USER,
                          pass: process.env.SMTP_PASS
                      }
                    : undefined
            });
        }
        return this._transporter;
    }
}
