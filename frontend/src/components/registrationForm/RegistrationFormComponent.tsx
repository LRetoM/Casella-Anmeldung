import type { ReactElement } from "react";

import { BirthDateFieldComponent } from "../birthDateField/BirthDateFieldComponent";
import { CompanyFieldComponent } from "../companyField/CompanyFieldComponent";
import { ConsentNoteComponent } from "../consentNote/ConsentNoteComponent";
import { NameFieldsComponent } from "../nameFields/NameFieldsComponent";
import { PhotoCaptureComponent } from "../photoCapture/PhotoCaptureComponent";
import { SignaturePadComponent } from "../signaturePad/SignaturePadComponent";
import { StatusMessageComponent } from "../statusMessage/StatusMessageComponent";
import type { IUseCameraStreamResult } from "../../hooks/useCameraStream";
import type { IUseSignaturePadResult } from "../../hooks/useSignaturePad";
import type { ITranslation } from "../../interfaces/ITranslation";

interface IRegistrationFormComponentProperties {
    translation: ITranslation;
    vorname: string;
    nachname: string;
    onVornameChange: (value: string) => void;
    onNachnameChange: (value: string) => void;
    firma: string;
    firmaAndere: string;
    isFirmaAndereMode: boolean;
    onFirmaChange: (value: string) => void;
    onFirmaAndereChange: (value: string) => void;
    geburtstag: string;
    geburtsmonat: string;
    geburtsjahr: string;
    onGeburtstagChange: (value: string) => void;
    onGeburtsmonatChange: (value: string) => void;
    onGeburtsjahrChange: (value: string) => void;
    camera: IUseCameraStreamResult;
    signature: IUseSignaturePadResult;
    statusMessage: string | null;
    statusType: "ok" | "err" | null;
    isSubmitting: boolean;
    onSubmit: () => void;
}

export function RegistrationFormComponent(props: IRegistrationFormComponentProperties): ReactElement {
    return (
        <form id="form" noValidate autoComplete="off">
            <NameFieldsComponent
                translation={props.translation}
                vorname={props.vorname}
                nachname={props.nachname}
                onVornameChange={props.onVornameChange}
                onNachnameChange={props.onNachnameChange}
            />
            <CompanyFieldComponent
                translation={props.translation}
                firma={props.firma}
                firmaAndere={props.firmaAndere}
                isFirmaAndereMode={props.isFirmaAndereMode}
                onFirmaChange={props.onFirmaChange}
                onFirmaAndereChange={props.onFirmaAndereChange}
            />
            <BirthDateFieldComponent
                translation={props.translation}
                tag={props.geburtstag}
                monat={props.geburtsmonat}
                jahr={props.geburtsjahr}
                onTagChange={props.onGeburtstagChange}
                onMonatChange={props.onGeburtsmonatChange}
                onJahrChange={props.onGeburtsjahrChange}
            />
            <PhotoCaptureComponent translation={props.translation} camera={props.camera} />
            <ConsentNoteComponent translation={props.translation} />
            <SignaturePadComponent translation={props.translation} signature={props.signature} />
            <button
                type="button"
                className="btn btn-primary"
                id="btn-mail"
                disabled={props.isSubmitting}
                onClick={props.onSubmit}
            >
                {props.isSubmitting ? props.translation.WirdGesendet : props.translation.Absenden}
            </button>
            <StatusMessageComponent message={props.statusMessage} type={props.statusType} />
        </form>
    );
}
