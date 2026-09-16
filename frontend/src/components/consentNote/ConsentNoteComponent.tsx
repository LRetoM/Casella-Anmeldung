import type { ReactElement } from "react";

import type { ITranslation } from "../../interfaces/ITranslation";

interface IConsentNoteComponentProperties {
    translation: ITranslation;
}

export function ConsentNoteComponent(props: IConsentNoteComponentProperties): ReactElement {
    return <p className="consent-note" id="consent-note" dangerouslySetInnerHTML={{ __html: props.translation.ConsentNote }} />;
}
