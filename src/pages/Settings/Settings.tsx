import {
  IonButton,
  IonCheckbox,
  IonContent,
  IonHeader,
  IonIcon,
  IonLabel,
  IonPage,
  IonText,
  IonTitle,
  IonToolbar
} from '@ionic/react';
import React, { useEffect } from 'react';
import { get, set } from '../../utils/storage';
import { language, languageOutline } from 'ionicons/icons';
import "./Settings.css";
import LanguageSelector from './modals/LanguageSelector';

const Settings: React.FC = () => {
  
  function defaultSettings(): Settings {
    // Example default settings object
    return {
      theme: 'dark',
      language: 'en',
    };
  }

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
          <IonTitle>Settings</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Settings</IonTitle>
          </IonToolbar>
        </IonHeader>
        <div className='ion-padding-horizontal'>
          <LanguageSelector />
        </div>
      </IonContent>
    </IonPage>
  );
};


export default Settings;


