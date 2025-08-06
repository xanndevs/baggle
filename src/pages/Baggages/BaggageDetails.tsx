import { IonBackButton, IonBadge, IonButtons, IonCheckbox, IonCol, IonContent, IonFab, IonFabButton, IonGrid, IonHeader, IonIcon, IonImg, IonLabel, IonList, IonModal, IonPage, IonProgressBar, IonRow, IonSearchbar, IonTitle, IonToolbar, isPlatform } from '@ionic/react';
import { AnimatePresence } from 'framer-motion';
import { addSharp } from 'ionicons/icons';
import React, { useEffect, useReducer, useRef, useState } from 'react';
import { useParams } from 'react-router';
import WalrusBucket from '../../walrus_bucket.jpg';
import './BaggageDetails.css';
import './Baggages.css';
import Page1 from './modal/Page1';

const BaggageDetails: React.FC = () => {

  const [bagValue, setBagValue] = useState<Bag | undefined>();

  const { uuid } = useParams<{ uuid: string }>();
  const [data, setData] = useState<Item[]>();
  const [results, setResults] = useState<Item[]>();








  const modal = useRef<HTMLIonModalElement>(null);

  const [modalPage, setModalPage] = useState(1);

  type FormState = {
    baggageNameValue: string,
    progress: number,
  };
  type FormAction =
    | { type: "UPDATE"; field: keyof FormState; value: string | number }
    | { type: "RESET" };

  const formReducer = (state: FormState, action: FormAction) => {
    switch (action.type) {
      case "UPDATE":
        return { ...state, [action.field]: action.value };
      case "RESET":
        return {
          baggageNameValue: "",
          progress: 0.02,
        };
      default:
        return state;
    }
  }

  const [formState, dispatch] = useReducer(formReducer, {
    baggageNameValue: "",
    progress: 0.02
  })



  const setModal = () => {
    dispatch({
      type: "RESET",
    })
  };







  useEffect(() => {
    const fetchBags = async () => {
      //Get bags from the api?
      //Since I have no api  I will jsut define a fake response
      //res = askforbags([,"678-36-425469","904-53-4535"]) // the holly api call
      console.log(uuid)
      // a white old wizard arrived with the response
      const res: { bags: Bag[], items: Item[] } = {

        bags: [
          {
            uuid: "uuid-best",
            name: "Valiz",
            items: ["123", "234", "345"],

          },
          {
            uuid: "uuis-notbest",
            name: "Sırt Çantası",
            items: ["123", "234", "345"],

          }
        ],
        items: [
          { type: 'packed', name: "Ekmek", amount: 3 },
          { type: 'ready', name: "Ayakkabı", amount: 3 },
          { type: 'store', name: "Balık", amount: 3, price: 300 }
        ],
      }

      //const bag = res.bags.find((elem) => elem.uuid === uuid);
      //const bag = res.items;
      setBagValue(res.bags.find((elem) => elem.uuid === uuid));

      const filteredBag = [
        ...(res.items || []),
      ];
      setData(filteredBag);
      setResults(filteredBag);

    }
    fetchBags();
  }, [uuid]);

  const handleInput = (event: Event) => {
    let query = '';
    const target = event.target as HTMLIonSearchbarElement;
    if (target) query = target.value!.toLowerCase();

    setResults(data?.filter((elem) => elem.name.toLowerCase().indexOf(query) > -1));
  };

  return (
    <>
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonBackButton text={isPlatform('ios') ? "Back" : undefined} />
            </IonButtons>
            <IonTitle>{bagValue?.name || "Unnamed Baggage"}</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent fullscreen>
          <IonHeader >
            <IonToolbar>
              <IonSearchbar debounce={250} onIonInput={(event) => handleInput(event)}></IonSearchbar>
            </IonToolbar>
          </IonHeader>
          <IonList class='ion-padding-horizontal '>
            {results?.map((result, key) => (
              <>
                <IonGrid key={key} >
                  <IonCheckbox justify='space-between' alignment='center' style={{ width: "100%" }}>


                    <IonRow class='ion-align-items-start' >
                      <IonCol size='auto' >
                        <IonImg style={{ width: "45px", aspectRatio: "0.75", objectFit: "cover" }} src={result.image ?? WalrusBucket}></IonImg>
                        <IonBadge color={'primary'} style={{ position: "absolute", bottom: "0px", right: "0px", opacity: "0.85" }} >
                          {result.amount ? `x${result.amount}` : undefined}
                        </IonBadge>
                      </IonCol>
                      <IonCol class='ion-no-padding'>

                        <IonRow class='ion-align-items-center' >
                          <IonCol size='auto'>
                            <IonTitle class='ion-text-start ion-no-padding' size='small'>
                              {result.name}
                            </IonTitle>
                          </IonCol>

                          <IonCol>


                            <IonBadge color={"success"}>
                              {
                                //#region WIP
                                /**
                                 * Add a currency provider and replace the currency with the user provided currency
                                */
                                //#regionend
                              }
                              {result.price ? `${result.price}₺` : undefined}
                            </IonBadge>&nbsp;

                          </IonCol>
                        </IonRow>

                        <IonRow>
                          <IonCol>
                            <IonLabel>
                              {result.note ?? undefined}
                            </IonLabel>
                          </IonCol>
                        </IonRow>

                      </IonCol>
                      <IonCol size='auto' class='ion-align-self-center'>
                      </IonCol>
                    </IonRow>

                  </IonCheckbox>

                </IonGrid>
              </>
            ))}
          </IonList>


          <IonFab slot="fixed" vertical="bottom" horizontal="end" id="open-item-modal">
            <IonFabButton onClick={setModal}>
              <IonIcon icon={addSharp}></IonIcon>
            </IonFabButton>
          </IonFab>
          <IonModal
            ref={modal}
            trigger="open-item-modal"
            initialBreakpoint={0.65}
            breakpoints={[0, 0.65]}
            canDismiss={true}
            handleBehavior="none"
            onWillDismiss={() => setModalPage(1)}
          >
            <IonHeader >
              <IonToolbar>
                <IonTitle>New Travel</IonTitle>

              </IonToolbar>
              <IonProgressBar value={formState.progress}></IonProgressBar>
            </IonHeader>
            <IonContent className="ion-padding">

              <AnimatePresence mode="wait">
                {modalPage === 1 && (
                  <Page1
                    modal={modal}
                    dispatch={dispatch}
                    formState={formState}
                    setModalPage={setModalPage}
                  />
                )}

                {modalPage === 2 && (
                  <></>
                )}

                {modalPage === 3 && (
                  <></>
                )}
              </AnimatePresence>
            </IonContent>
          </IonModal>
        </IonContent>
      </IonPage>

    </>
  );


  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton text={isPlatform('ios') ? "Back" : undefined} />
          </IonButtons>
          <IonTitle>{bagValue?.name || "Unnamed Baggage"}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader >
          <IonToolbar>
            <IonTitle size="large">Tab 2</IonTitle>
          </IonToolbar>
        </IonHeader>
      </IonContent>
    </IonPage>
  );
};

export default BaggageDetails;
