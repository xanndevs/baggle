import React from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import TravelsAccordion from '../components/TravelsAccordion';
import './StoreItems.css';

const StoreItems: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Store</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Store</IonTitle>
          </IonToolbar>
        </IonHeader>
        <TravelsAccordion />
      </IonContent>
    </IonPage>
  );
};

export default StoreItems;
