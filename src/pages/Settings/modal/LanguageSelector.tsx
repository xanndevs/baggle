// src/components/LanguageSelector.tsx
import { IonActionSheet, IonButton } from '@ionic/react';
import { useTranslation } from 'react-i18next';
import React, { useEffect, useState } from 'react';
import ReactCountryFlag from 'react-country-flag';
import { edit_settings, get, subscribe } from '../../../utils/storage';

// Define Settings interface (adjust based on your actual structure)
interface Settings {
  language: string;
  // Add other settings properties as needed
}

interface ContainerProps {
  i18n?: any;
  translations?: any; 
  settings?: Settings | undefined;
}

const LanguageSelector: React.FC<ContainerProps> = ({translations, i18n, settings}) => {
  const t = translations;

  const handleAction = async (detail: any) => {
    console.log(i18n.languages)
    if (detail.role === 'cancel') return;

    if (detail.data?.action === 'select') {
      const newLanguage = detail.data.language;
      try {
        await edit_settings({ language: newLanguage });
        await i18n.changeLanguage(newLanguage);
      } catch (error) {
        //console.error('Error updating language:', error);
      }
    }
  };

  return (
    <>
        <IonActionSheet
          trigger="open-language-action-sheet"
          header={t('settings.selectLanguage') as string} // Use correct key
          onDidDismiss={({ detail }) => handleAction(detail)}
          buttons={[
            {
              text: '中文',
              role: settings?.language === 'cn' ? 'selected' : undefined,
              data: {
                action: 'select',
                language: 'cn',
              },
            },
            {
              text: 'English',
              role: settings?.language === 'us' ? 'selected' : undefined,
              data: {
                action: 'select',
                language: 'us',
              },
            },
            {
              text: 'Español',
              role: settings?.language === 'es' ? 'selected' : undefined,
              data: {
                action: 'select',
                language: 'es',
              },
            },
            {
              text: 'Française',
              role: settings?.language === 'fr' ? 'selected' : undefined,
              data: {
                action: 'select',
                language: 'fr',
              },
            },
            {
              text: 'Türkçe',
              role: settings?.language === 'tr' ? 'selected' : undefined,
              data: {
                action: 'select',
                language: 'tr',
              },
            },
            {
              text: 'Cancel',
              role: 'cancel',
              data: {
                action: 'cancel',
              },
            },
          ]}
        />
      <IonButton id="open-language-action-sheet" expand="block">
        <ReactCountryFlag
          countryCode={i18n.language} // Adjust for correct flag (e.g., 'gb' for English)
          cdnSuffix="svg"
          cdnUrl="https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.4.3/flags/4x3/"
          style={{
            borderRadius: '5px',
            width: 'auto',
            height: '1.5em',
            aspectRatio: '4/3',
            marginRight: '8px',
          }}
          svg
          slot="start"
        />
        {t('settings.selectLanguage') as string} {/* Use correct key and remove .toString() */}
      </IonButton>
    </>
  );
};

export default LanguageSelector;