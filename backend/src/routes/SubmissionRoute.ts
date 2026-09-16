import type { Request, Response } from "express";
import { Router } from "express";

import { EmailService } from "../services/EmailService.js";
import { PdfStorageService } from "../services/PdfStorageService.js";
import type { ISubmissionRequest } from "../interfaces/ISubmissionRequest.js";

export const submissionRouter: Router = Router();

function buildFileName(nachname: string): string {
    const sanitizedNachname: string = nachname.replace(/[^\p{L}\p{N}_-]/gu, "_");
    const now: Date = new Date();
    const datePart: string = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
    const timePart: string = `${String(now.getHours()).padStart(2, "0")}${String(now.getMinutes()).padStart(2, "0")}${String(now.getSeconds()).padStart(2, "0")}`;
    return `Anmeldung_${sanitizedNachname}_${datePart}_${timePart}.pdf`;
}

function formatGeburtsdatum(geburtsdatum: string): string {
    const [year, month, day]: string[] = geburtsdatum.split("-");
    return `${day}.${month}.${year}`;
}

submissionRouter.post("/submit", async (request: Request, response: Response): Promise<void> => {
    const body: Partial<ISubmissionRequest> = request.body as Partial<ISubmissionRequest>;

    if (!body.vorname || !body.nachname || !body.firma || !body.geburtsdatum || !body.pdfBase64) {
        response.status(400).json({ success: false, error: "Unvollständige Daten" });
        return;
    }

    const vorname: string = body.vorname.trim();
    const nachname: string = body.nachname.trim();
    const firma: string = body.firma.trim();
    const geburtsdatum: string = body.geburtsdatum.trim();

    const pdfBuffer: Buffer = Buffer.from(body.pdfBase64, "base64");
    if (pdfBuffer.length === 0) {
        response.status(400).json({ success: false, error: "PDF ungültig" });
        return;
    }

    const fileName: string = buildFileName(nachname);
    PdfStorageService.save(fileName, pdfBuffer);

    try {
        await EmailService.sendRegistrationMail({
            vorname,
            nachname,
            firma,
            geburtsdatumFormatted: formatGeburtsdatum(geburtsdatum),
            pdfBuffer,
            pdfFileName: fileName
        });
        response.json({ success: true });
    } catch {
        response.status(500).json({ success: false, error: "E-Mail konnte nicht gesendet werden" });
    }
});
