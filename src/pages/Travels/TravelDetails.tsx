import React, { useEffect, useState } from 'react';
import { IonAccordionGroup, IonBackButton, IonBadge, IonButton, IonButtons, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonCheckbox, IonChip, IonCol, IonContent, IonGrid, IonHeader, IonIcon, IonImg, IonItem, IonItemDivider, IonItemGroup, IonLabel, IonList, IonListHeader, IonPage, IonRow, IonSearchbar, IonText, IonTitle, IonToolbar, isPlatform } from '@ionic/react';
import TravelsCard from '../../components/TravelsCard';
import './TravelDetails.css';
import WalrusBucket from '../../walrus_bucket.jpg';
import { useParams } from 'react-router';
import { get, subscribe } from '../../utils/storage';
import { checkmarkDoneSharp, checkmarkSharp, chevronForwardSharp, pricetagSharp, sadSharp } from 'ionicons/icons';
import BaggageAccordionItem from '../../components/BaggageAccordionItem';
import BagContainer from './BagContainer';


const TravelDetails: React.FC = () => {

  const [travelData, setTravelData] = useState<Travel[]>();
  const [baggageData, setBaggageData] = useState<Bag[]>();

  const [travel, setTravel] = useState<Travel>()
  const [baggages, setBaggages] = useState<Bag[]>()

  const { uuid } = useParams<{ uuid: string }>();
  const [results, setResults] = useState<Bag[]>();



  useEffect(() => {
    let isMounted = true;

    const setup = async () => {
      const travels = await get<Travel[]>("travels");
      const baggages = await get<Bag[]>("baggages");

      if (isMounted && travels) setTravelData(travels);
      if (isMounted && baggages) { setBaggageData(baggages); setResults(baggages) }
    };

    setup();

    const unsub_travels = subscribe<Travel[]>('travels', (travels) => {
      if (isMounted) {
        console.log("Travel data updated:", travels);

        setTravelData(travels);
      }
    });

    const unsub_baggages = subscribe<Bag[]>('baggages', (baggages) => {
      if (isMounted) {
        console.log("Travel data updated:", baggages);

        setBaggageData(baggages);
      }
    });



    return () => {
      isMounted = false;
      unsub_travels();
      unsub_baggages();
    };
  }, []);

  useEffect(() => {
    setTravel(travelData?.find((elem) => elem.uuid === uuid))
  }, [travelData])

  useEffect(() => {
    setBaggages(baggageData?.filter((elem) => travel?.bags?.includes(elem.uuid || "")))
  }, [baggageData])


  const handleInput = (event: Event) => {
    let query = '';
    const target = event.target as HTMLIonSearchbarElement;
    if (target) query = target.value!.toLowerCase();

    setResults(baggages?.filter((elem) => elem.name.toLowerCase().indexOf(query) > -1));
  };

  return (
    <>
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonBackButton text={isPlatform('ios') ? "Back" : undefined} />
            </IonButtons>
            <IonTitle>{travel?.name || "Unnamed Baggage"}</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent fullscreen>
          {/* <IonHeader >
            <IonToolbar>
              <IonSearchbar debounce={250} onIonInput={(event) => handleInput(event)}></IonSearchbar>
            </IonToolbar>
          </IonHeader> */}
          <IonContent>
            <IonCard className='ion-padding-none'>
              <IonCardHeader className="padding-bottom-none">
                <IonCardTitle>
                  Baggages
                </IonCardTitle>
              </IonCardHeader >

              <IonGrid >
                <IonRow className="baggle-horizontal-slider" >

                  {results?.map((bag, index) => (
                    <>
                      <BagContainer bag={bag} key={index}/>

                    </>
                  ))}

                </IonRow>
              </IonGrid>
            </IonCard>
          </IonContent>

        </IonContent>
      </IonPage>

    </>
  );

};

export default TravelDetails;
