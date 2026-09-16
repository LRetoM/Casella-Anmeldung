import type { ReactElement } from "react";
import { useEffect, useState } from "react";

import { HeaderComponent } from "./components/header/HeaderComponent";
import { InactivityOverlayComponent } from "./components/inactivityOverlay/InactivityOverlayComponent";
import { RegistrationFormComponent } from "./components/registrationForm/RegistrationFormComponent";
import { SuccessOverlayComponent } from "./components/successOverlay/SuccessOverlayComponent";
import { SUCCESS_OVERLAY_DURATION_MS } from "./constants/StaticValues";
import { Language } from "./enums/Language";
import { useCameraStream } from "./hooks/useCameraStream";
import { useInactivityTimer } from "./hooks/useInactivityTimer";
import { useSignaturePad } from "./hooks/useSignaturePad";
import { RegistrationData } from "./models/RegistrationData";
import { PdfGenerationService } from "./services/PdfGenerationService";
import { SubmissionService } from "./services/SubmissionService";
import { TranslationService } from "./services/TranslationService";

type StatusType = "ok" | "err";

export function App(): ReactElement {
    const [language, setLanguage] = useState<Language>(Language.DE);
    const translation = TranslationService.getTranslation(language);

    const [vorname, setVorname] = useState<string>("");
    const [nachname, setNachname] = useState<string>("");
    const [firma, setFirma] = useState<string>("");
    const [firmaAndere, setFirmaAndere] = useState<string>("");
    const [isFirmaAndereMode, setIsFirmaAndereMode] = useState<boolean>(false);
    const [geburtstag, setGeburtstag] = useState<string>("");
    const [geburtsmonat, setGeburtsmonat] = useState<string>("");
    const [geburtsjahr, setGeburtsjahr] = useState<string>("");

    const [statusMessage, setStatusMessage] = useState<string | null>(null);
    const [statusType, setStatusType] = useState<StatusType | null>(null);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [isSuccessVisible, setIsSuccessVisible] = useState<boolean>(false);

    const camera = useCameraStream();
    const signature = useSignaturePad();

    useEffect(() => {
        if (camera.errorMessage) {
            setStatusMessage(translation.KameraFehlerPrefix + camera.errorMessage);
            setStatusType("err");
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [camera.errorMessage]);

    const getFirma = (): string => (isFirmaAndereMode ? firmaAndere.trim() : firma);

    const getGeburtsdatum = (): string | null => {
        if (!geburtstag || !geburtsmonat || !geburtsjahr) {
            return null;
        }
        return `${geburtsjahr}-${geburtsmonat.padStart(2, "0")}-${geburtstag.padStart(2, "0")}`;
    };

    const resetForm = (): void => {
        setVorname("");
        setNachname("");
        setFirma("");
        setFirmaAndere("");
        setIsFirmaAndereMode(false);
        setGeburtstag("");
        setGeburtsmonat("");
        setGeburtsjahr("");
        camera.reset();
        signature.clear();
        setStatusMessage(null);
        setStatusType(null);
        setLanguage(Language.DE);
    };

    const hasInput = (): boolean =>
        Boolean(
            vorname.trim() ||
                nachname.trim() ||
                getFirma() ||
                geburtstag ||
                geburtsmonat ||
                geburtsjahr ||
                camera.photoDataUrl ||
                camera.phase === "streaming" ||
                camera.phase === "countdown" ||
                signature.hasSignature
        );

    const inactivity = useInactivityTimer(hasInput, resetForm);

    const handleSubmit = async (): Promise<void> => {
        const geburtsdatum: string | null = getGeburtsdatum();
        const firmaValue: string = getFirma();

        if (!vorname.trim() || !nachname.trim() || !firmaValue || !geburtsdatum) {
            setStatusMessage(translation.ErrFelder);
            setStatusType("err");
            return;
        }
        if (!signature.hasSignature) {
            setStatusMessage(translation.ErrUnterschrift);
            setStatusType("err");
            return;
        }

        const data: RegistrationData = new RegistrationData({
            Vorname: vorname.trim(),
            Nachname: nachname.trim(),
            Firma: firmaValue,
            Geburtsdatum: geburtsdatum,
            Foto: camera.photoDataUrl,
            Unterschrift: signature.getDataUrl()
        });

        setIsSubmitting(true);
        try {
            const pdfBase64: string = PdfGenerationService.generateBase64(data);
            await SubmissionService.submit(data, pdfBase64);
            setIsSuccessVisible(true);
            window.setTimeout(() => {
                resetForm();
                setIsSuccessVisible(false);
                window.scrollTo({ top: 0, behavior: "instant" });
            }, SUCCESS_OVERLAY_DURATION_MS);
        } catch (error) {
            const message: string = error instanceof Error ? error.message : String(error);
            setStatusMessage(translation.ErrSendenPrefix + message);
            setStatusType("err");
        } finally {
            setIsSubmitting(false);
        }
    };

    const toggleLanguage = (): void => {
        setLanguage(language === Language.DE ? Language.EN : Language.DE);
    };

    return (
        <>
            <HeaderComponent translation={translation} onToggleLanguage={toggleLanguage} />
            <SuccessOverlayComponent message={translation.ErfolgreichVersendet} isVisible={isSuccessVisible} />
            <InactivityOverlayComponent
                translation={translation}
                isVisible={inactivity.isBadgeVisible}
                badgeRef={inactivity.badgeRef}
                onContinue={inactivity.continueSession}
                onReset={inactivity.resetNow}
            />
            <div className="content">
                <RegistrationFormComponent
                    translation={translation}
                    vorname={vorname}
                    nachname={nachname}
                    onVornameChange={setVorname}
                    onNachnameChange={setNachname}
                    firma={firma}
                    firmaAndere={firmaAndere}
                    isFirmaAndereMode={isFirmaAndereMode}
                    onFirmaChange={(value: string): void => {
                        setFirma(value);
                        if (value === "andere") {
                            setIsFirmaAndereMode(true);
                        }
                    }}
                    onFirmaAndereChange={setFirmaAndere}
                    geburtstag={geburtstag}
                    geburtsmonat={geburtsmonat}
                    geburtsjahr={geburtsjahr}
                    onGeburtstagChange={setGeburtstag}
                    onGeburtsmonatChange={setGeburtsmonat}
                    onGeburtsjahrChange={setGeburtsjahr}
                    camera={camera}
                    signature={signature}
                    statusMessage={statusMessage}
                    statusType={statusType}
                    isSubmitting={isSubmitting}
                    onSubmit={handleSubmit}
                />
            </div>
        </>
    );
}
