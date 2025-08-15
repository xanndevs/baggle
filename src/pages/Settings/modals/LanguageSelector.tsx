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

const LanguageSelector: React.FC = () => {
  const { t, i18n } = useTranslation('translation'); // Specify namespace
  const [settings, setSettings] = useState<Settings | undefined>(undefined);

  useEffect(() => {
    let isMounted = true;

    const setup = async () => {
      try {
        const storedSettings = await get<Settings>('settings');
        if (isMounted && storedSettings) {
          setSettings(storedSettings);
          // Sync i18n language with stored language
          if ( storedSettings.language ) {
            await i18n.changeLanguage(storedSettings.language);
          }
        }
      } catch (error) {
        console.error('Error fetching settings:', error);
      }
    };

    setup();

    const unsub_settings = subscribe<Settings>('settings', (newSettings) => {
      if (isMounted) {
        setSettings(newSettings);
        // Sync i18n language with updated settings
        if (newSettings?.language && newSettings.language !== i18n.language) {
          i18n.changeLanguage(newSettings.language);
        }
      }
    });

    return () => {
      isMounted = false;
      unsub_settings();
    };
  }, [i18n]); // Include i18n in dependencies to handle language changes

  const handleAction = async (detail: any) => {
    if (detail.role === 'cancel') return;

    if (detail.data?.action === 'select') {
      const newLanguage = detail.data.language;
      try {
        await edit_settings({ language: newLanguage });
        await i18n.changeLanguage(newLanguage);
      } catch (error) {
        console.error('Error updating language:', error);
      }
    }
  };

  return (
    <>
      <IonButton id="open-action-sheet" expand="block">
        <ReactCountryFlag
          countryCode={i18n.language === 'tr' ? 'tr' : i18n.language === 'es' ? 'es' : 'gb'} // Adjust for correct flag (e.g., 'gb' for English)
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
        {t('app.language').toString()} {/* Use correct key and remove .toString() */}
      </IonButton>
      <IonActionSheet
        trigger="open-action-sheet"
        header={t('app.language')} // Use correct key
        onDidDismiss={({ detail }) => handleAction(detail)}
        buttons={[
          {
            text: 'Türkçe',
            role: settings?.language === 'tr' ? 'selected' : undefined,
            data: {
              action: 'select',
              language: 'tr',
            },
          },
          {
            text: 'English',
            role: settings?.language === 'en' ? 'selected' : undefined,
            data: {
              action: 'select',
              language: 'en',
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
            text: 'Cancel',
            role: 'cancel',
            data: {
              action: 'cancel',
            },
          },
        ]}
      />
    </>
  );
};

export default LanguageSelector;