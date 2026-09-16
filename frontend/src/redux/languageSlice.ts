import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

import { Language } from "../enums/Language";

interface ILanguageState {
    currentLanguage: Language;
}

const initialState: ILanguageState = {
    currentLanguage: Language.DE
};

const languageSlice = createSlice({
    name: "language",
    initialState,
    reducers: {
        setLanguage: (state, action: PayloadAction<Language>): void => {
            state.currentLanguage = action.payload;
        },
        toggleLanguage: (state): void => {
            state.currentLanguage = state.currentLanguage === Language.DE ? Language.EN : Language.DE;
        },
        resetLanguage: (state): void => {
            state.currentLanguage = Language.DE;
        }
    }
});

export const { setLanguage, toggleLanguage, resetLanguage } = languageSlice.actions;
export const languageReducer = languageSlice.reducer;
