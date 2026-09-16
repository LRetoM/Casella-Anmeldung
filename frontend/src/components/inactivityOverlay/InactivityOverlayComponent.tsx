import type { ReactElement, RefObject } from "react";

import type { ITranslation } from "../../interfaces/ITranslation";

interface IInactivityOverlayComponentProperties {
    translation: ITranslation;
    isVisible: boolean;
    badgeRef: RefObject<HTMLDivElement | null>;
    onContinue: () => void;
    onReset: () => void;
}

export function InactivityOverlayComponent(props: IInactivityOverlayComponentProperties): ReactElement {
    const { translation, isVisible, badgeRef, onContinue, onReset } = props;
    const className: string = `inactivity-badge${isVisible ? " show" : ""}`;

    return (
        <div className={className} id="inactivity-badge" ref={badgeRef}>
            <p id="inactivity-title">{translation.InactivityTitle}</p>
            <p id="inactivity-subtext">{translation.InactivitySubtext}</p>
            <button type="button" className="btn" id="btn-inactivity-continue" onClick={onContinue}>
                {translation.InactivityBtn}
            </button>
            <button
                type="button"
                className="btn"
                id="btn-inactivity-reset"
                style={{ background: "transparent", color: "#fff", border: "2px solid #fff", marginTop: "12px" }}
                onClick={onReset}
            >
                {translation.InactivityResetBtn}
            </button>
        </div>
    );
}
