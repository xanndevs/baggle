import { IonContent, IonHeader, IonLabel, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import React from 'react';
import './StoreItems.css';
import { useTranslation } from 'react-i18next';

const StoreItems: React.FC = () => {
  const { t } = useTranslation(); 
  
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>{ t("tabs.store") }</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">{ t("tabs.store") }</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonLabel>{ t("generic.noContent") }</IonLabel>
      </IonContent>
    </IonPage>
  );
};

export default StoreItems;
