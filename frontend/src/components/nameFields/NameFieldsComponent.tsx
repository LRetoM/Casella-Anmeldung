import type { ChangeEvent, ReactElement } from "react";

import type { ITranslation } from "../../interfaces/ITranslation";

interface INameFieldsComponentProperties {
    translation: ITranslation;
    vorname: string;
    nachname: string;
    onVornameChange: (value: string) => void;
    onNachnameChange: (value: string) => void;
}

export function NameFieldsComponent(props: INameFieldsComponentProperties): ReactElement {
    const { translation, vorname, nachname, onVornameChange, onNachnameChange } = props;

    return (
        <>
            <div className="field">
                <span className="field-label" id="label-vorname">
                    {translation.Vorname}
                </span>
                <input
                    type="text"
                    id="vorname"
                    placeholder={translation.Vorname}
                    value={vorname}
                    onChange={(event: ChangeEvent<HTMLInputElement>): void => onVornameChange(event.target.value)}
                    required
                />
            </div>
            <div className="field">
                <span className="field-label" id="label-nachname">
                    {translation.Nachname}
                </span>
                <input
                    type="text"
                    id="nachname"
                    placeholder={translation.Nachname}
                    value={nachname}
                    onChange={(event: ChangeEvent<HTMLInputElement>): void => onNachnameChange(event.target.value)}
                    required
                />
            </div>
        </>
    );
}
