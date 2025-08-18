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
          <IonTitle>{ t("tabs.store") as string }</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">{ t("tabs.store") as string }</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonLabel>{ t("generic.noContent") as string }</IonLabel>
      </IonContent>
    </IonPage>
  );
};

export default StoreItems;
