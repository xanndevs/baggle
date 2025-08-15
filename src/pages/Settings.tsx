import {
  IonCheckbox,
  IonContent,
  IonHeader,
  IonLabel,
  IonPage,
  IonTitle,
  IonToolbar
} from '@ionic/react';
import React, { useEffect } from 'react';
import { get, set } from '../utils/storage';
import { language } from 'ionicons/icons';

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
      <IonContent >

        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Settings</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonCheckbox labelPlacement='start'>Use system language</IonCheckbox>
        <IonLabel>No Content</IonLabel>
      </IonContent>
    </IonPage>
  );
};


export default Settings;


