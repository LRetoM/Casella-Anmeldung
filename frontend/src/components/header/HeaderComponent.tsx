import type { ReactElement } from "react";

import { LanguageSwitchButtonComponent } from "../languageSwitchButton/LanguageSwitchButtonComponent";
import type { ITranslation } from "../../interfaces/ITranslation";

interface IHeaderComponentProperties {
    translation: ITranslation;
    onToggleLanguage: () => void;
}

export function HeaderComponent(props: IHeaderComponentProperties): ReactElement {
    return (
        <div className="header">
            <span id="header-title">{props.translation.Title}</span>
            <LanguageSwitchButtonComponent onClick={props.onToggleLanguage} />
        </div>
    );
}
