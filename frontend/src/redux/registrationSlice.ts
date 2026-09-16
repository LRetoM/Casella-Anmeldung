import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

type StatusType = "ok" | "err";

interface IRegistrationState {
    vorname: string;
    nachname: string;
    firma: string;
    firmaAndere: string;
    isFirmaAndereMode: boolean;
    geburtstag: string;
    geburtsmonat: string;
    geburtsjahr: string;
    statusMessage: string | null;
    statusType: StatusType | null;
    isSubmitting: boolean;
    isSuccessVisible: boolean;
}

const initialState: IRegistrationState = {
    vorname: "",
    nachname: "",
    firma: "",
    firmaAndere: "",
    isFirmaAndereMode: false,
    geburtstag: "",
    geburtsmonat: "",
    geburtsjahr: "",
    statusMessage: null,
    statusType: null,
    isSubmitting: false,
    isSuccessVisible: false
};

const registrationSlice = createSlice({
    name: "registration",
    initialState,
    reducers: {
        setVorname: (state, action: PayloadAction<string>): void => {
            state.vorname = action.payload;
        },
        setNachname: (state, action: PayloadAction<string>): void => {
            state.nachname = action.payload;
        },
        setFirma: (state, action: PayloadAction<string>): void => {
            state.firma = action.payload;
            if (action.payload === "andere") {
                state.isFirmaAndereMode = true;
            }
        },
        setFirmaAndere: (state, action: PayloadAction<string>): void => {
            state.firmaAndere = action.payload;
        },
        setGeburtstag: (state, action: PayloadAction<string>): void => {
            state.geburtstag = action.payload;
        },
        setGeburtsmonat: (state, action: PayloadAction<string>): void => {
            state.geburtsmonat = action.payload;
        },
        setGeburtsjahr: (state, action: PayloadAction<string>): void => {
            state.geburtsjahr = action.payload;
        },
        setStatus: (state, action: PayloadAction<{ message: string; type: StatusType }>): void => {
            state.statusMessage = action.payload.message;
            state.statusType = action.payload.type;
        },
        clearStatus: (state): void => {
            state.statusMessage = null;
            state.statusType = null;
        },
        setIsSubmitting: (state, action: PayloadAction<boolean>): void => {
            state.isSubmitting = action.payload;
        },
        setIsSuccessVisible: (state, action: PayloadAction<boolean>): void => {
            state.isSuccessVisible = action.payload;
        },
        resetRegistration: (): IRegistrationState => initialState
    }
});

export const {
    setVorname,
    setNachname,
    setFirma,
    setFirmaAndere,
    setGeburtstag,
    setGeburtsmonat,
    setGeburtsjahr,
    setStatus,
    clearStatus,
    setIsSubmitting,
    setIsSuccessVisible,
    resetRegistration
} = registrationSlice.actions;
export const registrationReducer = registrationSlice.reducer;
