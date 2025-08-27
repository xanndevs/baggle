import {
  IonButton,
  IonContent,
  IonHeader,
  IonPage,
  IonPicker,
  IonTitle,
  IonToolbar
} from '@ionic/react';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { get, set, subscribe } from '../../utils/storage';
import "./Settings.css";
import LanguageSelector from './modal/LanguageSelector';
import CurrencySelector from './modal/CurrencySelector';
import ExportSettings from './modal/ExportSettings';


const Settings: React.FC = () => {


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
          //console.error('Error fetching settings:', error);
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


  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>{t("tabs.settings") as string}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">{t("tabs.settings") as string}</IonTitle>
          </IonToolbar>
        </IonHeader>
        <div className='ion-padding-horizontal flex-col gap'>
          <LanguageSelector translations={t} i18n={i18n} settings={settings}/>
          <CurrencySelector translations={t} settings={settings} />
          <ExportSettings translations={t} />
        </div>
      </IonContent>
    </IonPage>
  );
};


export default Settings;


