// src/utils/i18n.ts
import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';
import { get } from './storage'; // Your storage utility

// Import translation files
import en from '../locales/en.json';
import es from '../locales/es.json';
import tr from '../locales/tr.json';

// Define supported languages
const resources = {
  en: { translation: en },
  es: { translation: es },
  tr: { translation: tr },
};

export const initI18n = async (): Promise<any> => {
  // Retrieve saved language from storage, fallback to 'en' if none
  const settings = await get<Settings>('settings');
  const savedLanguage = settings?.language || "en";

  return i18n
    .use(LanguageDetector) // Detects browser language or storage
    .use(initReactI18next) // Bind i18next to React
    .init({
      resources,
      lng: savedLanguage, // Use saved language or fallback
      fallbackLng: 'en', // Fallback language if translation is missing
      interpolation: {
        escapeValue: false, // React already escapes values
      },
      detection: {
        // Customize language detection
        order: ['localStorage', 'navigator'], // Check storage first, then browser language
        lookupLocalStorage: 'language', // Key used in storage
        caches: ['localStorage'], // Persist language in storage
      },
      react: {
        useSuspense: false,
      }
    });
};