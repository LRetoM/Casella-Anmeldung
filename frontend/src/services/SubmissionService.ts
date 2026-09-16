import type { IRegistrationData } from "../interfaces/IRegistrationData";
import type { ISubmissionResponse } from "../interfaces/ISubmissionResponse";

const API_BASE_URL: string = import.meta.env.VITE_API_BASE_URL ?? "";

export class SubmissionService {
    public static async submit(data: IRegistrationData, pdfBase64: string): Promise<void> {
        const response: Response = await fetch(`${API_BASE_URL}/submit`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                vorname: data.Vorname,
                nachname: data.Nachname,
                firma: data.Firma,
                geburtsdatum: data.Geburtsdatum,
                pdfBase64
            })
        });

        const json: ISubmissionResponse = await response.json();
        if (!response.ok || !json.success) {
            throw new Error(json.error ?? `HTTP ${response.status}`);
        }
    }
}
