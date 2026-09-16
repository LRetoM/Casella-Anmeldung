import type { ReactElement } from "react";
import { useEffect } from "react";

import { HeaderComponent } from "./components/header/HeaderComponent";
import { InactivityOverlayComponent } from "./components/inactivityOverlay/InactivityOverlayComponent";
import { RegistrationFormComponent } from "./components/registrationForm/RegistrationFormComponent";
import { SuccessOverlayComponent } from "./components/successOverlay/SuccessOverlayComponent";
import { SUCCESS_OVERLAY_DURATION_MS } from "./constants/StaticValues";
import { useCameraStream } from "./hooks/useCameraStream";
import { useInactivityTimer } from "./hooks/useInactivityTimer";
import { useSignaturePad } from "./hooks/useSignaturePad";
import { RegistrationData } from "./models/RegistrationData";
import { resetLanguage, toggleLanguage } from "./redux/languageSlice";
import {
    resetRegistration,
    setFirma,
    setFirmaAndere,
    setGeburtsjahr,
    setGeburtsmonat,
    setGeburtstag,
    setIsSubmitting,
    setIsSuccessVisible,
    setNachname,
    setStatus,
    setVorname
} from "./redux/registrationSlice";
import { useAppDispatch, useAppSelector } from "./redux/store";
import { PdfGenerationService } from "./services/PdfGenerationService";
import { SubmissionService } from "./services/SubmissionService";
import { TranslationService } from "./services/TranslationService";

export function App(): ReactElement {
    const dispatch = useAppDispatch();
    const language = useAppSelector((state) => state.language.currentLanguage);
    const registration = useAppSelector((state) => state.registration);
    const translation = TranslationService.getTranslation(language);

    const camera = useCameraStream();
    const signature = useSignaturePad();

    useEffect(() => {
        if (camera.errorMessage) {
            dispatch(setStatus({ message: translation.KameraFehlerPrefix + camera.errorMessage, type: "err" }));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [camera.errorMessage]);

    const getFirma = (): string => (registration.isFirmaAndereMode ? registration.firmaAndere.trim() : registration.firma);

    const getGeburtsdatum = (): string | null => {
        if (!registration.geburtstag || !registration.geburtsmonat || !registration.geburtsjahr) {
            return null;
        }
        return `${registration.geburtsjahr}-${registration.geburtsmonat.padStart(2, "0")}-${registration.geburtstag.padStart(2, "0")}`;
    };

    const resetForm = (): void => {
        dispatch(resetRegistration());
        dispatch(resetLanguage());
        camera.reset();
        signature.clear();
    };

    const hasInput = (): boolean =>
        Boolean(
            registration.vorname.trim() ||
                registration.nachname.trim() ||
                getFirma() ||
                registration.geburtstag ||
                registration.geburtsmonat ||
                registration.geburtsjahr ||
                camera.photoDataUrl ||
                camera.phase === "streaming" ||
                camera.phase === "countdown" ||
                signature.hasSignature
        );

    const inactivity = useInactivityTimer(hasInput, resetForm);

    const handleSubmit = async (): Promise<void> => {
        const geburtsdatum: string | null = getGeburtsdatum();
        const firmaValue: string = getFirma();

        if (!registration.vorname.trim() || !registration.nachname.trim() || !firmaValue || !geburtsdatum) {
            dispatch(setStatus({ message: translation.ErrFelder, type: "err" }));
            return;
        }
        if (!signature.hasSignature) {
            dispatch(setStatus({ message: translation.ErrUnterschrift, type: "err" }));
            return;
        }

        const data: RegistrationData = new RegistrationData({
            Vorname: registration.vorname.trim(),
            Nachname: registration.nachname.trim(),
            Firma: firmaValue,
            Geburtsdatum: geburtsdatum,
            Foto: camera.photoDataUrl,
            Unterschrift: signature.getDataUrl()
        });

        dispatch(setIsSubmitting(true));
        try {
            const pdfBase64: string = PdfGenerationService.generateBase64(data);
            await SubmissionService.submit(data, pdfBase64);
            dispatch(setIsSuccessVisible(true));
            window.setTimeout(() => {
                resetForm();
                dispatch(setIsSuccessVisible(false));
                window.scrollTo({ top: 0, behavior: "instant" });
            }, SUCCESS_OVERLAY_DURATION_MS);
        } catch (error) {
            const message: string = error instanceof Error ? error.message : String(error);
            dispatch(setStatus({ message: translation.ErrSendenPrefix + message, type: "err" }));
        } finally {
            dispatch(setIsSubmitting(false));
        }
    };

    return (
        <>
            <HeaderComponent translation={translation} onToggleLanguage={(): void => void dispatch(toggleLanguage())} />
            <SuccessOverlayComponent message={translation.ErfolgreichVersendet} isVisible={registration.isSuccessVisible} />
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
                    vorname={registration.vorname}
                    nachname={registration.nachname}
                    onVornameChange={(value: string): void => void dispatch(setVorname(value))}
                    onNachnameChange={(value: string): void => void dispatch(setNachname(value))}
                    firma={registration.firma}
                    firmaAndere={registration.firmaAndere}
                    isFirmaAndereMode={registration.isFirmaAndereMode}
                    onFirmaChange={(value: string): void => void dispatch(setFirma(value))}
                    onFirmaAndereChange={(value: string): void => void dispatch(setFirmaAndere(value))}
                    geburtstag={registration.geburtstag}
                    geburtsmonat={registration.geburtsmonat}
                    geburtsjahr={registration.geburtsjahr}
                    onGeburtstagChange={(value: string): void => void dispatch(setGeburtstag(value))}
                    onGeburtsmonatChange={(value: string): void => void dispatch(setGeburtsmonat(value))}
                    onGeburtsjahrChange={(value: string): void => void dispatch(setGeburtsjahr(value))}
                    camera={camera}
                    signature={signature}
                    statusMessage={registration.statusMessage}
                    statusType={registration.statusType}
                    isSubmitting={registration.isSubmitting}
                    onSubmit={handleSubmit}
                />
            </div>
        </>
    );
}
