import type { ReactElement } from "react";

interface ISuccessOverlayComponentProperties {
    message: string;
    isVisible: boolean;
}

export function SuccessOverlayComponent(props: ISuccessOverlayComponentProperties): ReactElement {
    const className: string = `success-overlay${props.isVisible ? " show" : ""}`;
    return (
        <div className={className} id="success-overlay">
            {props.message}
        </div>
    );
}
