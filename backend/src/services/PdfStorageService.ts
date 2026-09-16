import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const STORAGE_DIRECTORY: string = join(process.cwd(), "anmeldungen");

export class PdfStorageService {
    public static save(fileName: string, pdfBuffer: Buffer): void {
        if (!existsSync(STORAGE_DIRECTORY)) {
            mkdirSync(STORAGE_DIRECTORY, { recursive: true });
        }
        writeFileSync(join(STORAGE_DIRECTORY, fileName), pdfBuffer);
    }
}
