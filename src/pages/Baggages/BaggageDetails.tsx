import { IonBackButton, IonBadge, IonButtons, IonCard, IonCheckbox, IonChip, IonCol, IonContent, IonFab, IonFabButton, IonGrid, IonHeader, IonIcon, IonImg, IonLabel, IonList, IonModal, IonPage, IonProgressBar, IonRow, IonSearchbar, IonTitle, IonToolbar, isPlatform } from '@ionic/react';
import { AnimatePresence } from 'framer-motion';
import { addSharp, cameraOutline, filter, imageOutline, search } from 'ionicons/icons';
import React, { useEffect, useReducer, useRef, useState } from 'react';
import { useParams } from 'react-router';
import WalrusBucket from '../../walrus_bucket.jpg';
import './BaggageDetails.css';
import './Baggages.css';
import Page2_AddItemModal from './modal/Page2_AddItemModal';
import { get, retrive_bag, retrive_bag_items, subscribe } from '../../utils/storage';
import Page1_AddItemModal from './modal/Page1_AddItemModal';

const BaggageDetails: React.FC = () => {



  const { uuid } = useParams<{ uuid: string }>();
  const videoRef = useRef<HTMLVideoElement>(null);
  const modal = useRef<HTMLIonModalElement>(null);
  const [modalPage, setModalPage] = useState(1);
  const [isStreaming, setIsStreaming] = useState(false);


  //#region Form State
  type FormAction =
    | { type: "UPDATE"; field: keyof Item; value: string | number }
    | { type: "RESET" };
  interface FormState extends Item {
    progress: number;
    nameError: string;
    title: string;
  }

  const defaults: FormState = {
    uuid: "",
    name: "",
    amount: 1,
    type: "ready",
    image: undefined,
    price: 0,
    note: "",
    category: "",

    progress: 0.02,
    nameError: "Item name must be between 3 and 20 characters long.",
    title: "Add a new Item",
  };

  const formReducer = (state: FormState, action: FormAction) => {
    switch (action.type) {
      case "UPDATE":
        return { ...state, [action.field]: action.value };
      case "RESET":
        return {
          ...defaults
        };
      default:
        return state;
    }
  }

  const [formState, dispatch] = useReducer(formReducer, {
    ...defaults
  })

  const setModal = () => {
    dispatch({
      type: "RESET",
    })
  };
  //#endregion



  const [baggageData, setBaggageData] = useState<Bag>();
  const [data, setData] = useState<Item[]>();
  // const [results, setResults] = useState<Item[]>();

const baggageDataRef = useRef<Bag | undefined>(undefined);

useEffect(() => {
  baggageDataRef.current = baggageData;
}, [baggageData]);


  //#region Storage Initialization
useEffect(() => {
  let isMounted = true;

  const setup = async () => {
    const bag = await retrive_bag(uuid);
    const items = await retrive_bag_items(uuid);

    if (isMounted && bag) {
      setBaggageData(bag);
      baggageDataRef.current = bag; // sync ref too
    }
    if (isMounted && items && baggageDataRef.current) {
      setData(items.filter((item) => baggageDataRef.current!.items.includes(item.uuid)));
    }
  };

  setup();

  const unsub_baggages = subscribe<Bag[]>('baggages', (baggages) => {
    if (isMounted) {
      const bag = baggages.find((elem) => elem.uuid === uuid);
      console.log("Baggage data updated:", baggages);
      setBaggageData(bag);
      baggageDataRef.current = bag;
    }
  });

  const unsub_items = subscribe<Item[]>('items', (items) => {
    if (isMounted && items && baggageDataRef.current) {
      setData(items.filter((item) => baggageDataRef.current!.items.includes(item.uuid)));
      console.log("Items data updated:", items);
    }
  });

  return () => {
    isMounted = false;
    unsub_baggages();
    unsub_items();
  };
}, [uuid]); // also add uuid here

  //#endregion



  const [searchTerm, setSearchTerm] = useState<string>("");



  //#region Search Functionality
  // const handleInput = (event: Event) => {

  //   const target = event.target as HTMLIonSearchbarElement;
  //   if (target) {
  //     setSearchTerm(target.value!);
  //     const query = target.value!.toLowerCase();
  //     setResults(data?.filter((elem) => elem.name.toLowerCase().indexOf(query) > -1));
  //   }
  // };
  //#endregion


  return (
    <>
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonBackButton text={isPlatform('ios') ? "Back" : undefined} />
            </IonButtons>
            <IonTitle>{baggageData?.name || "Unnamed Baggage"}</IonTitle>
          </IonToolbar>
          {/* <IonToolbar>
            <IonSearchbar debounce={250} value={searchTerm} onIonInput={(event) => handleInput(event)}></IonSearchbar>
          </IonToolbar> */}
        </IonHeader>
        <IonContent fullscreen>
          <IonList class=''>
            {data?.map((result, key) => (
              <div className='item-preview-card' key={key}>
              <IonBadge className='item-preview-amount'>x{result.amount}</IonBadge>
              {
                !result.image ?
                  <div className='camera-preview' style={{ display: 'flex', }}>
                    <IonIcon size='large' icon={imageOutline}></IonIcon>

                  </div> :
                  <IonImg src={result.image ? 'data:image/jpeg;base64,' + result.image : ""} className='camera-preview' style={{ display: 'flex', }}>
                  </IonImg>
              }



              <div className='item-preview-details'>
                <div style={{ display: 'flex', gap: "4px", alignItems: 'center' }}>
                  <IonLabel className='item-preview-title'>{result.name || "Unnamed Item"}</IonLabel>
                  {
                    result.price ?
                  <IonChip className='item-preview-price'>{result.price}₺</IonChip> : undefined
                  }
                </div>
                <div style={{ display: 'flex', flexDirection: 'row', gap: '4px', alignItems: 'flex-start', height: '100%' }}>
                  <IonLabel style={{ flexGrow: 1 }} color={'primary'} className='item-preview-note'>{result.note || "No note provided. "}</IonLabel>

                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'baseline', justifyContent: 'flex-end', height: '100%', minWidth: 'min-content' }}>
                    <IonCheckbox> </IonCheckbox>
                  </div>

                </div>
              </div>
            </div>

              // <IonCard key={key}>
              //   <IonGrid key={key} >
              //     <IonCheckbox justify='space-between' alignment='center' style={{ width: "100%" }}>


              //       <IonRow class='ion-align-items-start' >
              //         <IonCol size='auto' >
              //           <IonImg style={{ width: "45px", aspectRatio: "0.75", objectFit: "cover" }} src={result.image ?? WalrusBucket}></IonImg>
              //           <IonBadge color={'primary'} style={{ position: "absolute", bottom: "0px", right: "0px", opacity: "0.85" }} >
              //             {result.amount ? `x${result.amount}` : undefined}
              //           </IonBadge>
              //         </IonCol>
              //         <IonCol class='ion-no-padding'>

              //           <IonRow class='ion-align-items-center' >
              //             <IonCol size='auto'>
              //               <IonTitle class='ion-text-start ion-no-padding' size='small'>
              //                 {result.name}
              //               </IonTitle>
              //             </IonCol>

              //             <IonCol>


              //               <IonBadge color={"success"}>
              //                 {
              //                   //#region WIP
              //                   /**
              //                    * Add a currency provider and replace the currency with the user provided currency
              //                   */
              //                   //#regionend
              //                 }
              //                 {result.price ? `${result.price}₺` : undefined}
              //               </IonBadge>&nbsp;

              //             </IonCol>
              //           </IonRow>

              //           <IonRow>
              //             <IonCol>
              //               <IonLabel>
              //                 {result.note ?? undefined}
              //               </IonLabel>
              //             </IonCol>
              //           </IonRow>

              //         </IonCol>
              //         <IonCol size='auto' class='ion-align-self-center'>
              //         </IonCol>
              //       </IonRow>

              //     </IonCheckbox>

              //   </IonGrid>
              // </IonCard>
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
            handleBehavior="none"
            canDismiss={true}
            onWillDismiss={() => { /* Dismiss */ }}
            keepContentsMounted={true}
            initialBreakpoint={1}
            breakpoints={[0, 1]}
            style={{ '--background': "transparent" }}
            animated
          >
            <div className='item-preview-card'>
              <IonBadge className='item-preview-amount'>x{formState.amount}</IonBadge>


              <video
                ref={videoRef}
                id="videoRef"
                className='camera-preview'
                muted
                playsInline
                style={{ display: isStreaming ? 'block' : 'none', }}
              >
              </video>

              {
                !formState.image ?
                  <div className='camera-preview' style={{ display: isStreaming ? 'none' : 'flex', }}>
                    <IonIcon size='large' icon={cameraOutline}></IonIcon>

                  </div> :
                  <IonImg src={formState.image ? 'data:image/jpeg;base64,' + formState.image : ""} className='camera-preview' style={{ display: isStreaming ? 'none' : 'flex', }}>
                  </IonImg>
              }



              <div className='item-preview-details'>
                <div style={{ display: 'flex', gap: "4px", alignItems: 'center' }}>
                  <IonLabel className='item-preview-title'>{formState.name || "Item Name"}</IonLabel>
                  <IonChip className='item-preview-price'>100₺</IonChip>
                </div>
                <div style={{ display: 'flex', flexDirection: 'row', gap: '4px', alignItems: 'flex-start', height: '100%' }}>
                  <IonLabel style={{ flexGrow: 1 }} color={'primary'} className='item-preview-note'>{formState.note || "No note provided."}</IonLabel>

                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'baseline', justifyContent: 'flex-end', height: '100%', minWidth: 'min-content' }}>
                    <IonCheckbox> </IonCheckbox>
                  </div>

                </div>
              </div>
            </div>
            <div id='id-modal-content' style={{ display: 'flex', flexDirection: 'column', height: '350px', }}>

              <IonHeader style={{ 'background': "var(--ion-card-background)", borderRadius: "15px 15px 0px 0px" }}>
                <IonToolbar style={{ borderRadius: "14px 14px 0px 0px" }}>
                  <IonTitle>{formState.title}</IonTitle>

                </IonToolbar>
                <IonProgressBar value={formState.progress}></IonProgressBar>
              </IonHeader>
              <IonContent className="ion-padding">

                <AnimatePresence mode="wait">
                  {modalPage === 1 && (
                    <Page1_AddItemModal
                      modal={modal}
                      dispatch={dispatch}
                      formState={formState}
                      setModalPage={setModalPage}
                    />
                  )}

                  {modalPage === 2 && (
                    <Page2_AddItemModal
                      modal={modal}
                      dispatch={dispatch}
                      formState={formState}
                      setModalPage={setModalPage}
                      videoRef={videoRef}
                      setIsStreaming={setIsStreaming}
                      isStreaming={isStreaming}
                      bag_uuid={uuid}
                    />
                  )}

                  {modalPage === 3 && (
                    <></>
                  )}
                </AnimatePresence>
              </IonContent>
            </div>

          </IonModal>
        </IonContent>
      </IonPage >

    </>
  );
};

export default BaggageDetails;
