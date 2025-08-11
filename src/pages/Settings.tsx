import React, { useState, useRef, useEffect } from 'react';
import {
  IonButtons,
  IonButton,
  IonModal,
  IonHeader,
  IonContent,
  IonToolbar,
  IonTitle,
  IonPage,
  IonInput,
  IonProgressBar,
  IonDatetime,
  IonLabel,
  IonText,
} from '@ionic/react';
import { motion, AnimatePresence } from 'framer-motion';
import { get } from '../utils/storage';

const Settings: React.FC = () => {
  const modal = useRef<HTMLIonModalElement>(null);

  const [inputValue, setInputValue] = useState('');
  const [progress, setProgress] = useState<number>(0);
  const [modalPage, setModalPage] = useState(1);

  const [dateValue, setDateValue] = useState<string>();


  const [bagsString, setBagsString] = useState<string>('');

  const setModal = () => {
    setProgress((previous) => previous + 0.05);
  };

  const pageVariants = {
    initial: { opacity: 0, x: 50 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 },
  };

  useEffect(() => {
        async function handleAddBaggage(e?: React.FormEvent<HTMLFormElement>) {

            get("baggages").then((data) => {
                setBagsString(JSON.stringify(data, null, 2));
            });

        }
        handleAddBaggage();
    }, []);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>App</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">

        <IonDatetime value={dateValue}></IonDatetime>
        <IonLabel>{dateValue}</IonLabel>
        <IonInput value={inputValue} onIonChange={e => setInputValue(e.detail.value!)} />
        <IonText>{bagsString}</IonText>
      </IonContent>
    </IonPage>
  );
};

export default Settings;
