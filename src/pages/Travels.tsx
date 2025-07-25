import React from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import TravelsAccordion from '../components/TravelsAccordion';
import './Travels.css';

const Travels: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Travels</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Travels</IonTitle>
          </IonToolbar>
        </IonHeader>
        <TravelsAccordion />
      </IonContent>
    </IonPage>
  );
};

export default Travels;
