// src/components/LanguageSelector.tsx
import { CheckboxCustomEvent, IonButton, IonCheckbox, IonContent, IonHeader, IonIcon, IonModal, IonProgressBar, IonTitle, IonToast, IonToolbar } from '@ionic/react';
import { TFunction } from 'i18next';
import React, { useEffect, useRef, useState } from 'react';
import { build_export_payload, get, importData, subscribe } from '../../../utils/storage';
import "../Settings.css";
import { Directory, Encoding, Filesystem } from '@capacitor/filesystem';
import { Capacitor } from '@capacitor/core';
import { downloadOutline } from 'ionicons/icons';
import { FilePicker } from '@capawesome/capacitor-file-picker';
// Define Settings interface (adjust based on your actual structure)
interface Settings {
  language: string;
  // Add other settings properties as needed
}

interface ContainerProps {
  translations: TFunction;

}

const ImportSettings: React.FC<ContainerProps> = ({ translations }) => {
  const t = translations
  const [toastOpen, setToastOpen] = useState(false);


  const handleAction = async () => {
    const result = await pickJsonFile();
    if (result) {
      await importData(result);
      setToastOpen(true);
    }
  }

  const pickJsonFile = async () => {
    try {
      const result = await FilePicker.pickFiles({
        types: ["application/json"],
        limit: 1,
        readData: true
      });

      if (result.files.length > 0) {
        const file = result.files[0];
        //console.log("Picked JSON file:", file);

        // Read file content if available
        if (file.data) {
          const text = atob(file.data); // Base64 decode
          const json = JSON.parse(text, (key, value) => {
            if (key === "date") {
              return new Date(value);
            }
            return value;
          });
          //console.log("Parsed JSON:", json);
          return json;
        }
      }
      return null;
    } catch (err) {
      //console.error("File picking cancelled or failed:", err);
    }
  };

  return (
    <>
      <IonButton id="open-travels-import-picker" expand="block" onClick={handleAction} >
        <IonIcon slot='start' icon={downloadOutline}></IonIcon>
        {t('settings.importTravels') as string} {/* Use correct key and remove .toString() */}
      </IonButton>

      <IonToast
        isOpen={toastOpen}
        message={t('settings.successfullyImported') as string}
        duration={3000}
        buttons={[
          {
            text: t('generic.dismiss') as string,
            role: "cancel",
            handler: () => {/* Dismiss toast */},
          },
        ]}
        onDidDismiss={(e: CustomEvent) => {
          //console.log(`Dismissed with role: ${e.detail.role}`);
          setToastOpen(false); // close after dismiss
        }}
      />
      {/* <IonModal
                ref={modal}
                canDismiss={true}
                onWillDismiss={() => { /* Dismiss / }}
                keepContentsMounted
                initialBreakpoint={1}
                breakpoints={[0,1]}
                animated
                trigger="open-travels-import-picker"
            >
                <div style={{ display: 'flex', flexDirection: 'column', height: '466px'}}>

                    <IonHeader>
                        <IonToolbar>
                            <IonTitle>{t("settings.selectTravelsToExport") as string}</IonTitle>

                        </IonToolbar>
                        <IonProgressBar value={0.02}></IonProgressBar>
                    </IonHeader>
                    <IonContent className="ion-padding-vertical">
                        <div className='flex-col'>
                            <div className='flex-col travels-list ion-padding-horizontal'>
                                {
                                    travels?.map((travel, index) => (

                                        <IonCheckbox value={travel.uuid} onIonChange={handleAction} onClick={(e) => {e.preventDefault()}} key={index} labelPlacement='start' className='ion-padding-vertical'>{travel.name}</IonCheckbox>

                                    ))
                                }

                            </div>
                            <div className='ion-padding-horizontal ion-padding-top'>

                            <IonButton expand='block' onClick={handleExport}> {t('generic.export') as string} </IonButton>
                            </div>

                        </div>
                    </IonContent>
                </div>
            </IonModal> */}
    </>
  );
};

export default ImportSettings;