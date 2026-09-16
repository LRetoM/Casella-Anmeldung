import type { ReactElement } from "react";

import type { IUseSignaturePadResult } from "../../hooks/useSignaturePad";
import type { ITranslation } from "../../interfaces/ITranslation";

interface ISignaturePadComponentProperties {
    translation: ITranslation;
    signature: IUseSignaturePadResult;
}

export function SignaturePadComponent(props: ISignaturePadComponentProperties): ReactElement {
    const { translation, signature } = props;

    return (
        <div className="field">
            <span className="field-label" id="label-unterschrift">
                {translation.Unterschrift}
            </span>
            <div className="sig-wrap">
                <canvas
                    id="sigpad"
                    ref={signature.canvasRef}
                    onPointerDown={signature.handlePointerDown}
                    onPointerMove={signature.handlePointerMove}
                />
                <button type="button" id="btn-clear-sig" title="Löschen" onClick={signature.clear}>
                    <svg viewBox="0 0 24 24">
                        <path d="M3 12a9 9 0 1 0 2.636-6.364L3 8" />
                        <path d="M3 3v5h5" />
                    </svg>
                </button>
            </div>
        </div>
    );
}
