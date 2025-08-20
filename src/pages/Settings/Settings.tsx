import {
  IonButton,
  IonContent,
  IonHeader,
  IonPage,
  IonPicker,
  IonTitle,
  IonToolbar
} from '@ionic/react';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { get, set } from '../../utils/storage';
import "./Settings.css";
import LanguageSelector from './modal/LanguageSelector';
import CurrencySelector from './modal/CurrencySelector';


const Settings: React.FC = () => {

  function defaultSettings(): Settings {
    // Example default settings object
    return {
      theme: 'dark',
      language: 'en',
      currency: 'USD',
    };
  }
  const { t } = useTranslation();
  useEffect(() => {
    const initializeSettings = async () => {
      // Initialize settings if needed
      const settings = await get("settings");
      if (!settings) {


        await set("settings", defaultSettings());
      }
    }

    initializeSettings();
  }, []);

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
        <div className='ion-padding-horizontal'>
          <LanguageSelector />
          <br />
          <CurrencySelector />
        </div>
      </IonContent>
    </IonPage>
  );
};


export default Settings;


