import type { IRegistrationData } from "../interfaces/IRegistrationData";

export class RegistrationData implements IRegistrationData {
    public Vorname: string;
    public Nachname: string;
    public Firma: string;
    public Geburtsdatum: string;
    public Foto: string | null;
    public Unterschrift: string;

    public constructor(data?: Partial<IRegistrationData>) {
        this.Vorname = data?.Vorname ?? "";
        this.Nachname = data?.Nachname ?? "";
        this.Firma = data?.Firma ?? "";
        this.Geburtsdatum = data?.Geburtsdatum ?? "";
        this.Foto = data?.Foto ?? null;
        this.Unterschrift = data?.Unterschrift ?? "";
    }
}
