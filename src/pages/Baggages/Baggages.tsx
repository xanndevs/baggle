import { IonContent, IonFab, IonFabButton, IonHeader, IonIcon, IonLabel, IonModal, IonPage, IonProgressBar, IonTitle, IonToolbar } from '@ionic/react';
import { AnimatePresence } from 'framer-motion';
import { addSharp } from 'ionicons/icons';
import React from 'react';
import './Baggages.css';
import Page2_AddItemModal from './modal/Page2_AddItemModal';

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
