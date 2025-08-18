import { IonBackButton, IonButtons, IonCard, IonCardHeader, IonCardTitle, IonCol, IonContent, IonFab, IonFabButton, IonGrid, IonHeader, IonIcon, IonModal, IonPage, IonRow, IonTitle, IonToolbar, isPlatform } from '@ionic/react';
import { addSharp } from 'ionicons/icons';
import React, { useEffect, useReducer, useRef, useState } from 'react';
import { useParams } from 'react-router';
import { get, subscribe } from '../../utils/storage';
import BagContainer from './BagContainer';
import './TravelDetails.css';
import AddBaggageModal from './modal/AddBaggageModal';
import { useTranslation } from 'react-i18next';

const TravelDetails: React.FC = () => {
  const { t } = useTranslation();







  const modal = useRef<HTMLIonModalElement>(null);


  type FormState = {
    baggageNameValue: string,
    isEdit: boolean
    progress: number,
    uuid?: string,
  };
  type FormAction =
    | { type: "UPDATE"; field: keyof FormState; value: string | number | boolean | undefined }
    | { type: "RESET" };

  const formReducer = (state: FormState, action: FormAction) => {
    switch (action.type) {
      case "UPDATE":
        return { ...state, [action.field]: action.value };
      case "RESET":
        return {
          baggageNameValue: "",
          isEdit: false,
          progress: 0.02,
          uuid: undefined,
        };
      default:
        return state;
    }
  }

  const [formState, dispatch] = useReducer(formReducer, {
    baggageNameValue: "",
    isEdit: false,
    progress: 0.02,
    uuid: undefined
  })



  const [travelData, setTravelData] = useState<Travel[]>();
  const [baggageData, setBaggageData] = useState<Bag[]>();

  const [travel, setTravel] = useState<Travel>()
  //const [baggages, setBaggages] = useState<Bag[]>()

  const { uuid } = useParams<{ uuid: string }>();

  useEffect(() => {
    let isMounted = true;

    const setup = async () => {
      const travels = await get<Travel[]>("travels");
      const baggages = await get<Bag[]>("baggages");

      if (isMounted && travels) setTravelData(travels);
      if (isMounted && baggages) { setBaggageData(baggages); }
    };

    setup();

    const unsub_travels = subscribe<Travel[]>('travels', (travels) => {
      if (isMounted) {
        //console.log("Travel data updated:", travels);

        setTravelData(travels);
      }
    });

    const unsub_baggages = subscribe<Bag[]>('baggages', (baggages) => {
      if (isMounted) {
        //console.log("Travel data updated:", baggages);

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

  // useEffect(() => {
  //   setBaggages(baggageData?.filter((elem) => travel?.bags?.includes(elem.uuid || "")))
  // }, [baggageData])


  // const handleInput = (event: Event) => {
  //   let query = '';
  //   const target = event.target as HTMLIonSearchbarElement;
  //   if (target) query = target.value!.toLowerCase();

  //   setBaggageData(baggages?.filter((elem) => elem.name.toLowerCase().indexOf(query) > -1));
  // };

  return (
    <>
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonBackButton text={isPlatform('ios') ? t("generic.back") : undefined} />
            </IonButtons>
            <IonTitle>{travel?.name || t("baggages.unnamed") as string}</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent fullscreen>

          <IonCard className='ion-padding-none'>
            <IonCardHeader className="padding-bottom-none">
              <IonCardTitle>
                {t("generic.details") as string}
              </IonCardTitle>
            </IonCardHeader>
          </IonCard>

          <IonCard className='ion-padding-none' style={{ display: (baggageData?.filter((bag) => travel?.bags?.includes(bag.uuid || ""))?.length ?? 0) > 0 ? "block" : "none" }}>
            <IonCardHeader className="padding-bottom-none">
              <IonCardTitle>
                {t("baggages.baggages") as string}
              </IonCardTitle>
            </IonCardHeader >

            <IonGrid>
              <IonRow className="baggle-horizontal-slider " key={travel?.uuid}>

                {baggageData?.filter((bag) => travel?.bags?.includes(bag.uuid || "")).map((bag, index) => (
                  <IonCol style={{ minWidth: '285px', maxWidth: '310px' }} key={index}>
                    <BagContainer bag={bag} dispatch={dispatch} modal={modal} />
                  </IonCol>
                ))}

              </IonRow>
            </IonGrid>
          </IonCard>


          <IonFab slot="fixed" vertical="bottom" horizontal="end" id="open-baggage-modal">
            <IonFabButton>
              <IonIcon icon={addSharp}></IonIcon>
            </IonFabButton>
          </IonFab>
          <IonModal
            ref={modal}
            trigger="open-baggage-modal"
            canDismiss={true}
            onWillDismiss={() => { /* Dismiss */ }}
            keepContentsMounted
            initialBreakpoint={1}
            breakpoints={[0, 1]}
            animated
          >
            <AddBaggageModal
              modal={modal}
              formState={formState}
              dispatch={dispatch}
              travel={uuid}
            />

          </IonModal>
        </IonContent>
      </IonPage>

    </>
  );

};

export default TravelDetails;
