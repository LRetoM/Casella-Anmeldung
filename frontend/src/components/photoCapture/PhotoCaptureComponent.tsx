import type { ReactElement } from "react";

import type { IUseCameraStreamResult } from "../../hooks/useCameraStream";
import type { ITranslation } from "../../interfaces/ITranslation";

interface IPhotoCaptureComponentProperties {
    translation: ITranslation;
    camera: IUseCameraStreamResult;
}

export function PhotoCaptureComponent(props: IPhotoCaptureComponentProperties): ReactElement {
    const { translation, camera } = props;
    const isLiveViewVisible: boolean = camera.phase === "streaming" || camera.phase === "countdown";

    return (
        <div className="field">
            <span className="field-label" id="label-foto">
                {translation.Foto}
            </span>
            <div className="cam-box">
                <video
                    id="video"
                    playsInline
                    autoPlay
                    muted
                    ref={camera.videoRef}
                    style={{ display: isLiveViewVisible ? "block" : "none" }}
                />
                <img
                    id="photo-preview"
                    alt="Aufgenommenes Foto"
                    src={camera.photoDataUrl ?? undefined}
                    style={{ display: camera.phase === "captured" ? "block" : "none" }}
                />
                <div id="silhouette" style={{ display: isLiveViewVisible ? "flex" : "none" }}>
                    <svg viewBox="0 0 269.019 241.209" aria-hidden="true">
                        <path
                            d="M268.262 239.863c-4.842-5.608-10.965-9.681-17.515-12.809-11.332-5.413-22.768-9.578-34.68-13.529l-17.718-5.878c-9.526-3.702-17.738-9.044-25.167-15.991l-.962-11.776c-.484-5.925-1.042-11.803.598-17.592l6.708-10.346c2.358-6.49 3.264-13.122 3.411-19.89 2.423.248 4.287.044 5.811-1.285 1.327-1.157 3.589-8.958 3.971-13.371.664-7.673 4.861-11.201 2.702-20.184-.665-2.765-2.871-3.958-5.912-3.364 1.752-5.86 3.011-11.556 3.456-17.75l1.211-16.837.246-10.994-.456-5.065c-1.049-11.64-3.165-21.525-14.876-25.348l3.05-2.739c-4.385-1.605-8.792-1.099-13.567.302-.582-5.693-5.57-9.664-11.457-9.421l-1.656-2.955-4.604 1.828-1.721-1.51c-2.761-.392-6.306.566-8.83.036-8.902-1.869-15.741-5.358-24.997 2.583l-9.64 1.391c-1.366.197-2.465 1.957-2.83 3.267-5.461 2.057-10.24 5.566-14.091 9.995l-4.36 5.014c-1.376 1.582-3 3.019-3.638 5.248-2.392 8.36-4.759 16.789-4.918 25.576-.241 13.299-1 25.06 3.74 37.349-1.011-.045-3.162-.074-3.929.382-.767.456-1.631 1.874-1.975 2.896-2.474 7.342 1.487 12.346 2.431 19.296.688 5.066 2.255 13.266 4.888 14.875 1.415.864 3.621.944 5.042.869l.474 6.702c.623 8.806 3.874 16.379 9.585 23.099 1.241 4.833 1.08 10.409.82 15.405l-.367 7.035c-.125 2.398-.096 5.683-1.326 7.753-9.997 9.717-22.059 15.183-35.26 19.162-14.82 4.467-29.288 8.921-42.851 16.235-8.339 4.497-13.356 9.584-16.349 13.023"
                        />
                    </svg>
                </div>
                <div id="countdown" style={{ display: camera.phase === "countdown" ? "flex" : "none" }}>
                    {camera.countdownValue}
                </div>
                {camera.phase === "idle" && (
                    <button type="button" className="btn btn-secondary" id="btn-start-cam" onClick={camera.startCamera}>
                        {translation.KameraStarten}
                    </button>
                )}
                <canvas id="photo-canvas" ref={camera.canvasRef} hidden />
            </div>
            <div className="cam-buttons">
                {camera.phase === "streaming" && (
                    <button type="button" className="btn btn-secondary" id="btn-snap" onClick={camera.takePhoto}>
                        {translation.FotoAufnehmen}
                    </button>
                )}
                {camera.phase === "captured" && (
                    <button type="button" className="btn btn-secondary" id="btn-retake" onClick={camera.retake}>
                        {translation.NeuAufnehmen}
                    </button>
                )}
            </div>
        </div>
    );
}
