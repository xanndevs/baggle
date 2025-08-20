import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { get, subscribe } from '../../utils/storage';
import BagContainer from '../Travels/details/BagContainer';
import './Baggages.css';
import { useTranslation } from 'react-i18next';




const Baggages: React.FC = () => {
  const {t} = useTranslation();

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
        //console.log("Travel data updated:", baggages);

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
          <IonTitle>{t("baggages.baggages") as string}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">{t("baggages.baggages") as string}</IonTitle>
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
