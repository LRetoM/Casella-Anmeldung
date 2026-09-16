import type { PointerEvent as ReactPointerEvent, RefObject } from "react";
import { useCallback, useEffect, useRef, useState } from "react";

import { SIGNATURE_LINE_WIDTH } from "../constants/StaticValues";

export interface IUseSignaturePadResult {
    canvasRef: RefObject<HTMLCanvasElement | null>;
    hasSignature: boolean;
    handlePointerDown: (event: ReactPointerEvent<HTMLCanvasElement>) => void;
    handlePointerMove: (event: ReactPointerEvent<HTMLCanvasElement>) => void;
    clear: () => void;
    getDataUrl: () => string;
}

export function useSignaturePad(): IUseSignaturePadResult {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const drawingRef = useRef<boolean>(false);
    const [hasSignature, setHasSignature] = useState<boolean>(false);

    const resizeCanvas = useCallback((): void => {
        const canvas: HTMLCanvasElement | null = canvasRef.current;
        const context: CanvasRenderingContext2D | null | undefined = canvas?.getContext("2d");
        if (!canvas || !context) {
            return;
        }

        const ratio: number = Math.max(window.devicePixelRatio || 1, 2);
        const rect: DOMRect = canvas.getBoundingClientRect();
        const previousDataUrl: string | null = hasSignature ? canvas.toDataURL() : null;

        canvas.width = rect.width * ratio;
        canvas.height = rect.height * ratio;
        context.setTransform(ratio, 0, 0, ratio, 0, 0);
        context.lineWidth = SIGNATURE_LINE_WIDTH;
        context.lineCap = "round";
        context.lineJoin = "round";
        context.strokeStyle = "#000";

        if (previousDataUrl) {
            const image: HTMLImageElement = new Image();
            image.onload = (): void => context.drawImage(image, 0, 0, rect.width, rect.height);
            image.src = previousDataUrl;
        }
    }, [hasSignature]);

    useEffect(() => {
        resizeCanvas();
        window.addEventListener("resize", resizeCanvas);
        return (): void => window.removeEventListener("resize", resizeCanvas);
    }, [resizeCanvas]);

    useEffect(() => {
        const handlePointerUp = (): void => {
            drawingRef.current = false;
        };
        window.addEventListener("pointerup", handlePointerUp);
        return (): void => window.removeEventListener("pointerup", handlePointerUp);
    }, []);

    const handlePointerDown = useCallback((event: ReactPointerEvent<HTMLCanvasElement>): void => {
        const canvas: HTMLCanvasElement | null = canvasRef.current;
        const context: CanvasRenderingContext2D | null | undefined = canvas?.getContext("2d");
        if (!canvas || !context) {
            return;
        }
        drawingRef.current = true;
        setHasSignature(true);
        const rect: DOMRect = canvas.getBoundingClientRect();
        context.beginPath();
        context.moveTo(event.clientX - rect.left, event.clientY - rect.top);
        event.preventDefault();
    }, []);

    const handlePointerMove = useCallback((event: ReactPointerEvent<HTMLCanvasElement>): void => {
        if (!drawingRef.current) {
            return;
        }
        const canvas: HTMLCanvasElement | null = canvasRef.current;
        const context: CanvasRenderingContext2D | null | undefined = canvas?.getContext("2d");
        if (!canvas || !context) {
            return;
        }
        const rect: DOMRect = canvas.getBoundingClientRect();
        context.lineTo(event.clientX - rect.left, event.clientY - rect.top);
        context.stroke();
        event.preventDefault();
    }, []);

    const clear = useCallback((): void => {
        const canvas: HTMLCanvasElement | null = canvasRef.current;
        const context: CanvasRenderingContext2D | null | undefined = canvas?.getContext("2d");
        if (!canvas || !context) {
            return;
        }
        context.clearRect(0, 0, canvas.width, canvas.height);
        setHasSignature(false);
    }, []);

    const getDataUrl = useCallback((): string => {
        return canvasRef.current?.toDataURL("image/png") ?? "";
    }, []);

    return { canvasRef, hasSignature, handlePointerDown, handlePointerMove, clear, getDataUrl };
}
