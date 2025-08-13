import { IonContent, IonFab, IonFabButton, IonGrid, IonHeader, IonIcon, IonLabel, IonModal, IonPage, IonProgressBar, IonRow, IonTitle, IonToolbar } from '@ionic/react';
import { AnimatePresence } from 'framer-motion';
import { addSharp } from 'ionicons/icons';
import React, { useEffect, useState } from 'react';
import './Baggages.css';
import Page2_AddItemModal from './modal/Page2_AddItemModal';
import { get, subscribe } from '../../utils/storage';
import { useParams } from 'react-router';
import BagContainer from '../Travels/BagContainer';




const Baggages: React.FC = () => {


  const [baggageData, setBaggageData] = useState<Bag[]>();

  const [baggages, setBaggages] = useState<Bag[]>()

  const { uuid } = useParams<{ uuid: string }>();

  useEffect(() => {
    let isMounted = true;

    const setup = async () => {
      const baggages = await get<Bag[]>("baggages");

      if (isMounted && baggages) { setBaggageData(baggages); }
    };

    setup();

    const unsub_baggages = subscribe<Bag[]>('baggages', (baggages) => {
      if (isMounted) {
        console.log("Travel data updated:", baggages);

        setBaggageData(baggages);
      }
    });



    return () => {
      isMounted = false;
      unsub_baggages();
    };
  }, []);




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
        <div style={{ padding: "0 10px 0", display: "flex", flexDirection: "column", gap: "5px" }}>

          {baggageData?.map((bag, index) => (
            <BagContainer bag={bag} key={index} style={{ width: "100%" }} />
          ))}

        </div>
      </IonContent>
    </IonPage>
  );
};

export default Baggages;
