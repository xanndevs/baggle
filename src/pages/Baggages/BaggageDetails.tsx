import React, { useEffect, useState } from 'react';
import { IonBackButton, IonBadge, IonButtons, IonCheckbox, IonChip, IonCol, IonContent, IonGrid, IonHeader, IonIcon, IonImg, IonItem, IonItemDivider, IonItemGroup, IonLabel, IonList, IonPage, IonRow, IonSearchbar, IonText, IonTitle, IonToolbar, isPlatform } from '@ionic/react';
import TravelsAccordion from '../../components/TravelsAccordion';
import './BaggageDetails.css';
import WalrusBucket from '../../walrus_bucket.jpg';
import { useParams } from 'react-router';
import { checkmarkSharp, eyedropOutline, pencilSharp } from 'ionicons/icons';

const BaggageDetails: React.FC = () => {

  const [bagValue, setBagValue] = useState<Bag | undefined>();

  const { uuid } = useParams<{ uuid: string }>();
  const [data, setData] = useState<Item[]>();
  const [results, setResults] = useState<Item[]>();



  useEffect(() => {
    const fetchBags = async () => {
      //Get bags from the api?
      //Since I have no api  I will jsut define a fake response
      //res = askforbags([,"678-36-425469","904-53-4535"]) // the holly api call
      console.log(uuid)
      // a white old wizard arrived with the response
      const res = {
        bags: [
          {
            uuid: "uuid-best",
            name: "Valiz",
            itemsPacked: [
              { name: "Ekmek", amount: 3 }
            ],
            itemsReady: [
              { name: "Ayakkabı", amount: 3 }
            ],
            itemsStore: [
              { name: "Balık", amount: 3, price: 300 }
            ],
          },
          {
            uuid: "uuis-notbest",
            name: "Sırt Çantası",
            itemsPacked: [
              { name: "Ekmek", amount: 3 }
            ],
            itemsReady: [
              { name: "Ekmek", amount: 3 }
            ],
          }
        ]
      }

      const bag = res.bags.find((elem) => elem.uuid === uuid);
      setBagValue(bag);

      const filteredBag = [
        ...(bag?.itemsReady || []),
        ...(bag?.itemsStore || []),
        ...(bag?.itemsPacked || []),
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
                <IonCheckbox justify='space-between' alignment='center' style={{width:"100%"}}>


                  <IonRow class='ion-align-items-start' >
                    <IonCol size='auto' >
                      <IonImg style={{ width: "45px", aspectRatio: "0.75", objectFit: "cover" }} src={result.image ?? WalrusBucket}></IonImg>
                      <IonBadge color={'primary'} style={{position:"absolute", bottom:"0px", right:"0px", opacity:"0.85"}} >
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
