import type { ChangeEvent, ReactElement } from "react";

import { BIRTH_DAY_OPTION_COUNT, BIRTH_YEAR_OPTION_COUNT } from "../../constants/StaticValues";
import type { ITranslation } from "../../interfaces/ITranslation";

interface IBirthDateFieldComponentProperties {
    translation: ITranslation;
    tag: string;
    monat: string;
    jahr: string;
    onTagChange: (value: string) => void;
    onMonatChange: (value: string) => void;
    onJahrChange: (value: string) => void;
}

export function BirthDateFieldComponent(props: IBirthDateFieldComponentProperties): ReactElement {
    const { translation, tag, monat, jahr, onTagChange, onMonatChange, onJahrChange } = props;
    const currentYear: number = new Date().getFullYear();
    const days: number[] = Array.from({ length: BIRTH_DAY_OPTION_COUNT }, (_unused: unknown, index: number): number => index + 1);
    const years: number[] = Array.from(
        { length: BIRTH_YEAR_OPTION_COUNT },
        (_unused: unknown, index: number): number => currentYear - index
    );

    return (
        <div className="field">
            <span className="field-label" id="label-geburtsdatum">
                {translation.Geburtsdatum}
            </span>
            <div className="date-row">
                <select
                    id="geb-tag"
                    className={tag ? undefined : "placeholder"}
                    value={tag}
                    onChange={(event: ChangeEvent<HTMLSelectElement>): void => onTagChange(event.target.value)}
                    required
                >
                    <option value="" hidden>
                        {translation.Tag}
                    </option>
                    {days.map(
                        (day: number): ReactElement => (
                            <option key={day} value={day}>
                                {day}
                            </option>
                        )
                    )}
                </select>
                <select
                    id="geb-monat"
                    className={monat ? undefined : "placeholder"}
                    value={monat}
                    onChange={(event: ChangeEvent<HTMLSelectElement>): void => onMonatChange(event.target.value)}
                    required
                >
                    <option value="" hidden>
                        {translation.Monat}
                    </option>
                    {translation.Monate.map(
                        (monthName: string, index: number): ReactElement => (
                            <option key={monthName} value={index + 1}>
                                {monthName}
                            </option>
                        )
                    )}
                </select>
                <select
                    id="geb-jahr"
                    className={jahr ? undefined : "placeholder"}
                    value={jahr}
                    onChange={(event: ChangeEvent<HTMLSelectElement>): void => onJahrChange(event.target.value)}
                    required
                >
                    <option value="" hidden>
                        {translation.Jahr}
                    </option>
                    {years.map(
                        (year: number): ReactElement => (
                            <option key={year} value={year}>
                                {year}
                            </option>
                        )
                    )}
                </select>
            </div>
        </div>
    );
}
