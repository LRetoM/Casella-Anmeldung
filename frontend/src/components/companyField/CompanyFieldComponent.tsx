import type { ChangeEvent, ReactElement } from "react";
import { useEffect, useRef } from "react";

import { ALL_COMPANIES, FREQUENTLY_USED_COMPANIES } from "../../constants/Companies";
import type { ITranslation } from "../../interfaces/ITranslation";

interface ICompanyFieldComponentProperties {
    translation: ITranslation;
    firma: string;
    firmaAndere: string;
    isFirmaAndereMode: boolean;
    onFirmaChange: (value: string) => void;
    onFirmaAndereChange: (value: string) => void;
}

export function CompanyFieldComponent(props: ICompanyFieldComponentProperties): ReactElement {
    const { translation, firma, firmaAndere, isFirmaAndereMode, onFirmaChange, onFirmaAndereChange } = props;
    const inputRef = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
        if (isFirmaAndereMode) {
            inputRef.current?.focus();
        }
    }, [isFirmaAndereMode]);

    return (
        <div className="field">
            <span className="field-label" id="label-firma">
                {translation.Unternehmen}
            </span>
            {!isFirmaAndereMode && (
                <select
                    id="firma-select"
                    className={firma ? undefined : "placeholder"}
                    value={firma}
                    onChange={(event: ChangeEvent<HTMLSelectElement>): void => onFirmaChange(event.target.value)}
                >
                    <option value="" hidden>
                        {translation.UnternehmenPlatzhalter}
                    </option>
                    <optgroup label={translation.HaeufigGenutzt}>
                        {FREQUENTLY_USED_COMPANIES.map(
                            (company: string): ReactElement => (
                                <option key={company} value={company}>
                                    {company}
                                </option>
                            )
                        )}
                    </optgroup>
                    <optgroup label={translation.AlleUnternehmen}>
                        {ALL_COMPANIES.map(
                            (company: string): ReactElement => (
                                <option key={company} value={company}>
                                    {company}
                                </option>
                            )
                        )}
                    </optgroup>
                    <option value="andere">{translation.UnternehmenAndere}</option>
                </select>
            )}
            {isFirmaAndereMode && (
                <input
                    ref={inputRef}
                    type="text"
                    id="firma-andere"
                    placeholder={translation.UnternehmenEingeben}
                    value={firmaAndere}
                    onChange={(event: ChangeEvent<HTMLInputElement>): void => onFirmaAndereChange(event.target.value)}
                />
            )}
        </div>
    );
}
