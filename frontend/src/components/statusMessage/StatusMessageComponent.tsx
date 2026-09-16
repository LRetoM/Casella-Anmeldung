import type { ReactElement } from "react";

interface IStatusMessageComponentProperties {
    message: string | null;
    type: "ok" | "err" | null;
}

export function StatusMessageComponent(props: IStatusMessageComponentProperties): ReactElement {
    const className: string = props.type ? `status ${props.type}` : "status";
    return (
        <div className={className} id="status">
            {props.message}
        </div>
    );
}
