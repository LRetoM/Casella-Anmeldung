import type { RefObject } from "react";
import { useCallback, useEffect, useRef, useState } from "react";

import { AUTO_RESET_TIMEOUT_MS, INACTIVITY_TIMEOUT_MS } from "../constants/StaticValues";

export interface IUseInactivityTimerResult {
    badgeRef: RefObject<HTMLDivElement | null>;
    isBadgeVisible: boolean;
    continueSession: () => void;
    resetNow: () => void;
}

const ACTIVITY_EVENTS: string[] = ["input", "change", "click", "touchstart", "mousedown", "keydown"];

export function useInactivityTimer(hasInput: () => boolean, onReset: () => void): IUseInactivityTimerResult {
    const badgeRef = useRef<HTMLDivElement | null>(null);
    const inactivityTimerRef = useRef<number | undefined>(undefined);
    const autoResetTimerRef = useRef<number | undefined>(undefined);
    const [isBadgeVisible, setIsBadgeVisible] = useState<boolean>(false);

    const restartTimer = useCallback((): void => {
        window.clearTimeout(inactivityTimerRef.current);
        window.clearTimeout(autoResetTimerRef.current);
        setIsBadgeVisible(false);

        if (!hasInput()) {
            return;
        }

        inactivityTimerRef.current = window.setTimeout(() => {
            setIsBadgeVisible(true);
            autoResetTimerRef.current = window.setTimeout(() => {
                onReset();
                setIsBadgeVisible(false);
                window.scrollTo({ top: 0, behavior: "instant" });
            }, AUTO_RESET_TIMEOUT_MS);
        }, INACTIVITY_TIMEOUT_MS);
    }, [hasInput, onReset]);

    useEffect(() => {
        const handleActivity = (event: Event): void => {
            if (badgeRef.current?.contains(event.target as Node)) {
                return;
            }
            restartTimer();
        };

        ACTIVITY_EVENTS.forEach((eventName: string): void =>
            document.addEventListener(eventName, handleActivity, { passive: true })
        );
        return (): void => {
            ACTIVITY_EVENTS.forEach((eventName: string): void => document.removeEventListener(eventName, handleActivity));
            window.clearTimeout(inactivityTimerRef.current);
            window.clearTimeout(autoResetTimerRef.current);
        };
    }, [restartTimer]);

    const continueSession = useCallback((): void => {
        restartTimer();
    }, [restartTimer]);

    const resetNow = useCallback((): void => {
        onReset();
        setIsBadgeVisible(false);
        restartTimer();
    }, [onReset, restartTimer]);

    return { badgeRef, isBadgeVisible, continueSession, resetNow };
}
