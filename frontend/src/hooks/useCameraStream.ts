import type { RefObject } from "react";
import { useCallback, useEffect, useRef, useState } from "react";

import { COUNTDOWN_START_SECONDS, PHOTO_JPEG_QUALITY } from "../constants/StaticValues";

type CameraPhase = "idle" | "streaming" | "countdown" | "captured";

export interface IUseCameraStreamResult {
    videoRef: RefObject<HTMLVideoElement | null>;
    canvasRef: RefObject<HTMLCanvasElement | null>;
    phase: CameraPhase;
    countdownValue: number | null;
    photoDataUrl: string | null;
    errorMessage: string | null;
    startCamera: () => Promise<void>;
    takePhoto: () => void;
    retake: () => Promise<void>;
    reset: () => void;
}

function getCameraErrorMessage(error: unknown): string {
    const errorNames: Record<string, string> = {
        NotAllowedError: "Zugriff verweigert. Bitte Kameraberechtigung im Browser erlauben.",
        NotFoundError: "Keine Kamera gefunden.",
        NotReadableError: "Die Kamera wird möglicherweise bereits von einer anderen Anwendung verwendet.",
        OverconstrainedError: "Die gewünschte Kameraeinstellung wird nicht unterstützt.",
        SecurityError: "Der Browser hat den Kamerazugriff aus Sicherheitsgründen blockiert."
    };
    if (error instanceof Error) {
        return errorNames[error.name] ?? error.message;
    }
    return String(error);
}

export function useCameraStream(): IUseCameraStreamResult {
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const [phase, setPhase] = useState<CameraPhase>("idle");
    const [countdownValue, setCountdownValue] = useState<number | null>(null);
    const [photoDataUrl, setPhotoDataUrl] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const stopCamera = useCallback((): void => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach((track: MediaStreamTrack): void => track.stop());
            streamRef.current = null;
        }
        if (videoRef.current) {
            videoRef.current.srcObject = null;
        }
    }, []);

    const startCamera = useCallback(async (): Promise<void> => {
        try {
            if (!window.isSecureContext) {
                throw new Error("Kamerazugriff benötigt HTTPS oder localhost.");
            }
            if (!navigator.mediaDevices?.getUserMedia) {
                throw new Error("Kamerazugriff wird von diesem Browser oder Kontext nicht unterstützt.");
            }
            stopCamera();
            setErrorMessage(null);

            const stream: MediaStream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: { ideal: "user" } },
                audio: false
            });
            streamRef.current = stream;

            const video: HTMLVideoElement | null = videoRef.current;
            if (video) {
                video.srcObject = stream;
                await new Promise<void>((resolve, reject) => {
                    if (video.readyState >= 1) {
                        resolve();
                        return;
                    }
                    video.onloadedmetadata = (): void => resolve();
                    video.onerror = (): void => reject(new Error("Videostream konnte nicht geladen werden."));
                });
                await video.play();
            }

            setPhotoDataUrl(null);
            setPhase("streaming");
        } catch (error) {
            setErrorMessage(getCameraErrorMessage(error));
            stopCamera();
            setPhase("idle");
        }
    }, [stopCamera]);

    const takePhoto = useCallback((): void => {
        const video: HTMLVideoElement | null = videoRef.current;
        if (!streamRef.current || !video || !video.videoWidth || !video.videoHeight) {
            setErrorMessage("Das Kamerabild ist noch nicht bereit.");
            return;
        }

        setPhase("countdown");
        let remaining: number = COUNTDOWN_START_SECONDS;
        setCountdownValue(remaining);

        const intervalId: number = window.setInterval(() => {
            remaining -= 1;
            if (remaining > 0) {
                setCountdownValue(remaining);
                return;
            }
            window.clearInterval(intervalId);
            setCountdownValue(null);

            const canvas: HTMLCanvasElement | null = canvasRef.current;
            const context: CanvasRenderingContext2D | null | undefined = canvas?.getContext("2d");
            if (canvas && context) {
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                context.drawImage(video, 0, 0);
                const dataUrl: string = canvas.toDataURL("image/jpeg", PHOTO_JPEG_QUALITY);
                setPhotoDataUrl(dataUrl);
            }

            stopCamera();
            setPhase("captured");
        }, 1000);
    }, [stopCamera]);

    const retake = useCallback(async (): Promise<void> => {
        setPhotoDataUrl(null);
        await startCamera();
    }, [startCamera]);

    const reset = useCallback((): void => {
        stopCamera();
        setPhotoDataUrl(null);
        setPhase("idle");
        setErrorMessage(null);
        setCountdownValue(null);
    }, [stopCamera]);

    useEffect(() => {
        const handleBeforeUnload = (): void => stopCamera();
        window.addEventListener("beforeunload", handleBeforeUnload);
        return (): void => {
            window.removeEventListener("beforeunload", handleBeforeUnload);
            stopCamera();
        };
    }, [stopCamera]);

    return { videoRef, canvasRef, phase, countdownValue, photoDataUrl, errorMessage, startCamera, takePhoto, retake, reset };
}
