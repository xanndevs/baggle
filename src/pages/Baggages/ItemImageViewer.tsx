

import { createGesture, GestureDetail, IonBackButton, IonBadge, IonButton, IonButtons, IonCard, IonCheckbox, IonChip, IonContent, IonHeader, IonIcon, IonImg, IonLabel, IonPage, IonTitle, IonToolbar, useIonActionSheet, useIonPopover } from '@ionic/react';
import { bagAddOutline, bagAddSharp, bagOutline, image, imageOutline, pencilSharp, pricetag, pricetagOutline, trashSharp } from 'ionicons/icons';
import React, { useEffect, useRef } from 'react';
import { edit_uuid, get, pop_uuid, subscribe } from '../../utils/storage';
import './ItemImageViewer.css';
import { useTranslation } from 'react-i18next';
import { presentDeleteConfirmation, presentReadyOrPackedSelection } from '../Settings/modal/DeleteActionSheet';
import { settings } from 'cluster';
import { useParams } from 'react-router';


const ItemImageViewer: React.FC = () => {
  const { t } = useTranslation();
  const { uuid } = useParams<{ uuid: string }>();

  const [item, setItem] = React.useState<Item>();
  useEffect(() => {
    let isMounted = true;

    const setup = async () => {
      const item = await get("items") as Item[];

      if (isMounted && item) {
        setItem(item.find(i => i.uuid === uuid) || undefined);
      }

    };

    setup();


    const unsub_items = subscribe<Item[]>('items', (elem) => {
      if (isMounted) {
        setItem(elem.find(i => i.uuid === uuid) || item);
        //console.log("Settings data updated:", settings);
      }
    });

    return () => {
      isMounted = false;
      unsub_items();
    };
  }, []);


  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton text={t("generic.back") as string} />
          </IonButtons>
          <IonTitle>{t("items.imageOf", { name: item?.name }) as string}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen className='ion-padding'>
        <div className='flex-center'>
          <div className='sizing-fix'>
        <IonImg src={item?.image ? 'data:image/jpeg;base64,' + item.image : ""} alt={item?.name} />
        </div>
        </div>
          
      </IonContent>
    </IonPage>
  );

}

export default ItemImageViewer;