import React from 'react';
import { IonContent, IonHeader, IonLabel, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import TravelsAccordion from '../../components/TravelsAccordion';
import './Baggages.css';

const Baggages: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Baggages</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Baggages</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonLabel>No Content</IonLabel>
      </IonContent>
    </IonPage>
  );
};

export default Baggages;
