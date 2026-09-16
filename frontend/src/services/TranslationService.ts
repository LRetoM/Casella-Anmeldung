import { Language } from "../enums/Language";
import { translationsDe } from "../i18n/translations.de";
import { translationsEn } from "../i18n/translations.en";
import type { ITranslation } from "../interfaces/ITranslation";

const TRANSLATIONS_BY_LANGUAGE: Record<Language, ITranslation> = {
    [Language.DE]: translationsDe,
    [Language.EN]: translationsEn
};

export class TranslationService {
    public static getTranslation(language: Language): ITranslation {
        return TRANSLATIONS_BY_LANGUAGE[language];
    }
}
