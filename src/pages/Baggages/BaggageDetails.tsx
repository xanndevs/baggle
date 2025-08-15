import { IonBackButton, IonBadge, IonButtons, IonCheckbox, IonChip, IonContent, IonFab, IonFabButton, IonHeader, IonIcon, IonImg, IonLabel, IonList, IonModal, IonPage, IonProgressBar, IonSearchbar, IonTitle, IonToolbar, isPlatform } from '@ionic/react';
import { AnimatePresence } from 'framer-motion';
import { addSharp, cameraOutline } from 'ionicons/icons';
import React, { useEffect, useReducer, useRef, useState } from 'react';
import { useParams } from 'react-router';
import { retrive_bag, retrive_bag_items, subscribe } from '../../utils/storage';
import './BaggageDetails.css';
import './Baggages.css';
import ItemCard from './ItemCard';
import Page1_AddItemModal from './modal/Page1_AddItemModal';
import Page2_AddItemModal from './modal/Page2_AddItemModal';

const BaggageDetails: React.FC = () => {

  const { uuid } = useParams<{ uuid: string }>();
  const modal = useRef<HTMLIonModalElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [modalPage, setModalPage] = useState(0);
  const [isStreaming, setIsStreaming] = useState(false);
  //#region Form State
  type FormAction =
    | { type: "UPDATE"; field: keyof FormState; value: string | number | undefined }
    | { type: "RESET" };
  interface FormState extends Item {
    progress?: number;
    nameError?: string;
    title?: string;
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

  // const setModal = () => {
  //   dispatch({
  //     type: "RESET",
  //   })
  // };
  //#endregion

  const baggageDataRef = useRef<Bag | undefined>(undefined);
  const [baggageData, setBaggageData] = useState<Bag>();
  const [data, setData] = useState<Item[]>();

  useEffect(() => {
    baggageDataRef.current = baggageData;
  }, [baggageData]);
  //#region Storage Init
  useEffect(() => {
    let isMounted = true;

    const setup = async () => {
      const bag = await retrive_bag(uuid);
      const items = await retrive_bag_items(uuid);

      if (isMounted && bag) {
        setBaggageData(bag);
        baggageDataRef.current = bag; // sync ref too
      }
      if (isMounted && items && baggageDataRef.current && Array.isArray(baggageDataRef.current.items)) {
        setData(items.filter((item) => baggageDataRef.current && baggageDataRef.current.items.includes(item.uuid)));
      }
    };

    setup();

    const unsub_baggages = subscribe<Bag[]>('baggages', (baggages) => {
      if (isMounted) {
        const bag = baggages.find((elem) => elem.uuid === uuid);
        //console.log("Baggage data updated:", baggages);
        setBaggageData(bag);
        baggageDataRef.current = bag;
      }
    });

    const unsub_items = subscribe<Item[]>('items', (items) => {
      if (isMounted && items && baggageDataRef.current) {
        setData(items.filter((item) => baggageDataRef.current!.items.includes(item.uuid)));
        //console.log("Items data updated:", items);
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
  const searchbar = useRef<HTMLIonSearchbarElement>(null);
  const [searchResults, setSearchResults] = useState<Item[]>([])
  //#region Search Functionality
  const handleInput = () => {
    const inputValue = searchbar.current?.value || ""
    setSearchTerm(inputValue)
  }

  useEffect(() => {
    if (!data) { setSearchResults([]); return; }
    const filtered = data.filter((elem) => elem.name.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1);
    setSearchResults(filtered);
  }, [searchTerm, data])
  //#endregion


  const handleChecked = () => {
    dispatch({
      type: "UPDATE",
      field: "type",
      value: formState.type === "packed" ?
        "unpacked" :
        "packed",
    });
  }

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
          <IonToolbar>
            <IonSearchbar aria-autocomplete='none' autocomplete='off' ref={searchbar} debounce={250} onIonInput={handleInput}></IonSearchbar>
          </IonToolbar>
        </IonHeader>
        <IonContent fullscreen>
          <IonList class='items-list'>
            {searchResults?.map((result, key) => (
              <React.Fragment key={key}>
                <ItemCard
                  item={result}
                />
              </React.Fragment>
            ))}
            <div style={{ position: 'relative', width: '100%', height: '105px' }}>

            </div>
          </IonList>


          <IonFab slot="fixed" vertical="bottom" horizontal="end" id="open-item-modal">
            <IonFabButton>
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
                  <IonChip className='item-preview-price'>{`${formState.price || 0}₺`}</IonChip>
                </div>
                <div style={{ display: 'flex', flexDirection: 'row', gap: '4px', alignItems: 'flex-start', height: '100%' }}>
                  <IonLabel style={{ flexGrow: 1 }} color={'primary'} className='item-preview-note'>{formState.note || "No note provided."}</IonLabel>

                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'baseline', justifyContent: 'flex-end', height: '100%', minWidth: 'min-content' }}>
                    <IonCheckbox onClick={handleChecked} disabled={formState.type === "store"} > </IonCheckbox>
                  </div>

                </div>
              </div>
            </div>
            <div id='id-modal-content' style={{ display: 'flex', flexDirection: 'column', height: '350px', }}>

              <IonHeader style={{ 'background': "var(--ion-card-background)", borderRadius: "15px 15px 0px 0px" }}>
                <IonToolbar style={{ borderRadius: "var(--ion-border-radius) var(--ion-border-radius) 0px 0px" }}>
                  <IonTitle>{formState.title}</IonTitle>

                </IonToolbar>
                <IonProgressBar value={formState.progress}></IonProgressBar>
              </IonHeader>
              <IonContent className="ion-padding">

                <AnimatePresence mode="wait">
                  {modalPage === 0 && (
                    <Page1_AddItemModal
                      dispatch={dispatch}
                      formState={formState}
                      setModalPage={setModalPage}
                    />
                  )}

                  {modalPage === 1 && (
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
