import { jsPDF } from "jspdf";

import type { IRegistrationData } from "../interfaces/IRegistrationData";

const PAGE_MARGIN: number = 20;
const HEADER_BLUE: [number, number, number] = [1, 174, 240];
const HEADER_HEIGHT: number = 32;
const PHOTO_MAX_SIZE: number = 80;
const SIGNATURE_BOX_WIDTH: number = 80;
const SIGNATURE_BOX_HEIGHT: number = 32;
const SIGNATURE_IMAGE_WIDTH: number = 72;
const SIGNATURE_IMAGE_HEIGHT: number = 26;
const BOTTOM_MARGIN_FOR_SIGNATURE: number = 58;
const FOOTER_LINE_OFFSET: number = 18;
const FOOTER_TEXT_OFFSET: number = 11;

export class PdfGenerationService {
    public static generate(data: IRegistrationData): jsPDF {
        const doc: jsPDF = new jsPDF();
        const pageWidth: number = doc.internal.pageSize.getWidth();
        const pageHeight: number = doc.internal.pageSize.getHeight();

        doc.setFillColor(...HEADER_BLUE);
        doc.rect(0, 0, pageWidth, HEADER_HEIGHT, "F");
        doc.setTextColor(255);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(22);
        doc.text("Anmeldeformular", pageWidth / 2, 21, { align: "center" });

        let currentY: number = 50;
        currentY = this._drawField(doc, "Vorname", data.Vorname, currentY);
        currentY = this._drawField(doc, "Nachname", data.Nachname, currentY);
        currentY = this._drawField(doc, "Unternehmen", data.Firma, currentY);
        currentY = this._drawField(
            doc,
            "Geburtsdatum",
            `${this._formatDatum(data.Geburtsdatum)} (${this._alter(data.Geburtsdatum)})`,
            currentY
        );

        if (data.Foto) {
            currentY = this._drawPhoto(doc, data.Foto, currentY);
        }

        if (currentY + BOTTOM_MARGIN_FOR_SIGNATURE > pageHeight - PAGE_MARGIN) {
            doc.addPage();
            currentY = PAGE_MARGIN;
        }

        currentY = this._drawSignature(doc, data.Unterschrift, currentY);

        doc.setFont("helvetica", "normal");
        doc.setTextColor(140);
        doc.text("Der Verarbeitung der Daten gemäß Datenschutzerklärung wurde zugestimmt.", PAGE_MARGIN, currentY);

        this._drawFooter(doc, pageWidth, pageHeight);

        return doc;
    }

    public static generateBase64(data: IRegistrationData): string {
        const doc: jsPDF = this.generate(data);
        const dataUriString: string = doc.output("datauristring");
        return dataUriString.split(",")[1];
    }

    private static _drawField(doc: jsPDF, label: string, value: string, y: number): number {
        let nextY: number = y;
        doc.setFontSize(9);
        doc.setTextColor(...HEADER_BLUE);
        doc.text(label, PAGE_MARGIN, nextY);
        nextY += 7;
        doc.setFontSize(15);
        doc.setTextColor(20);
        doc.text(value, PAGE_MARGIN, nextY);
        nextY += 13;
        return nextY;
    }

    private static _drawPhoto(doc: jsPDF, photoDataUrl: string, y: number): number {
        let nextY: number = y;
        doc.setFontSize(9);
        doc.setTextColor(...HEADER_BLUE);
        doc.text("Foto", PAGE_MARGIN, nextY);
        nextY += 6;

        const properties: { width: number; height: number } = doc.getImageProperties(photoDataUrl);
        const ratio: number = Math.min(PHOTO_MAX_SIZE / properties.width, PHOTO_MAX_SIZE / properties.height);
        const imageWidth: number = properties.width * ratio;
        const imageHeight: number = properties.height * ratio;

        doc.addImage(photoDataUrl, "JPEG", PAGE_MARGIN, nextY, imageWidth, imageHeight);
        doc.rect(PAGE_MARGIN, nextY, imageWidth, imageHeight);
        nextY += imageHeight + 14;
        return nextY;
    }

    private static _drawSignature(doc: jsPDF, signatureDataUrl: string, y: number): number {
        let nextY: number = y;
        doc.setFontSize(9);
        doc.setTextColor(...HEADER_BLUE);
        doc.text("Unterschrift", PAGE_MARGIN, nextY);
        nextY += 6;
        doc.roundedRect(PAGE_MARGIN, nextY, SIGNATURE_BOX_WIDTH, SIGNATURE_BOX_HEIGHT, 4, 4);
        doc.addImage(signatureDataUrl, "PNG", PAGE_MARGIN + 4, nextY + 3, SIGNATURE_IMAGE_WIDTH, SIGNATURE_IMAGE_HEIGHT);
        nextY += 42;
        return nextY;
    }

    private static _drawFooter(doc: jsPDF, pageWidth: number, pageHeight: number): void {
        const now: Date = new Date();
        doc.line(PAGE_MARGIN, pageHeight - FOOTER_LINE_OFFSET, pageWidth - PAGE_MARGIN, pageHeight - FOOTER_LINE_OFFSET);
        doc.setFontSize(8);
        const day: string = String(now.getDate()).padStart(2, "0");
        const month: string = String(now.getMonth() + 1).padStart(2, "0");
        const hours: string = String(now.getHours()).padStart(2, "0");
        const minutes: string = String(now.getMinutes()).padStart(2, "0");
        doc.text(
            `Erstellt am ${day}.${month}.${now.getFullYear()} um ${hours}:${minutes}`,
            PAGE_MARGIN,
            pageHeight - FOOTER_TEXT_OFFSET
        );
    }

    private static _formatDatum(iso: string): string {
        const parts: string[] = iso.split("-");
        return `${parts[2]}.${parts[1]}.${parts[0]}`;
    }

    private static _alter(iso: string): number {
        const [birthYear, birthMonth, birthDay]: number[] = iso.split("-").map(Number);
        const today: Date = new Date();
        let age: number = today.getFullYear() - birthYear;
        if (today.getMonth() < birthMonth - 1 || (today.getMonth() === birthMonth - 1 && today.getDate() < birthDay)) {
            age--;
        }
        return age;
    }
}
