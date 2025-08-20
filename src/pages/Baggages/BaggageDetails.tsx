import { IonBackButton, IonBadge, IonButtons, IonCheckbox, IonChip, IonContent, IonFab, IonFabButton, IonHeader, IonIcon, IonImg, IonItemDivider, IonLabel, IonList, IonModal, IonPage, IonProgressBar, IonRow, IonSearchbar, IonText, IonTitle, IonToolbar } from '@ionic/react';
import { AnimatePresence } from 'framer-motion';
import { addSharp, bag, bagOutline, cameraOutline, checkmark, checkmarkDone } from 'ionicons/icons';
import React, { useEffect, useReducer, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router';
import { get, retrive_bag, retrive_bag_items, subscribe } from '../../utils/storage';
import './BaggageDetails.css';
import './Baggages.css';
import ItemCard from './ItemCard';
import CategoriesBar from './modal/CategoriesBar';
import Page1_AddItemModal from './modal/Page1_AddItemModal';
import Page2_AddItemModal from './modal/Page2_AddItemModal';

const BaggageDetails: React.FC = () => {

  const { t } = useTranslation();
  const { uuid } = useParams<{ uuid: string }>();
  const modal = useRef<HTMLIonModalElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [modalPage, setModalPage] = useState(0);
  const [isStreaming, setIsStreaming] = useState(false);
  //#region Form State
  type FormAction =
    | { type: "UPDATE"; field: keyof FormState; value: string | number | undefined | boolean }
    | { type: "RESET" };
  interface FormState extends Item {
    progress?: number;
    nameError?: string;
    title?: string;

    isEdit: boolean
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
    nameError: t("items.nameError"),
    title: t("items.new"),

    isEdit: false,
  };

  const formReducer = (state: FormState, action: FormAction) => {
    switch (action.type) {
      case "UPDATE":
        return { ...state, [action.field]: action.value };
      case "RESET":
        setModalPage(0);
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

  const [settings, setSettings] = useState<Settings | undefined>();

  useEffect(() => {
    baggageDataRef.current = baggageData;
  }, [baggageData]);
  //#region Storage Init
  useEffect(() => {
    let isMounted = true;

    const setup = async () => {
      const bag = await retrive_bag(uuid) as Bag;
      const items = await retrive_bag_items(uuid) as Item[];
      const settings = await get("settings") as Settings;

      if (isMounted && bag) {
        setBaggageData(bag);
        baggageDataRef.current = bag; // sync ref too
      }
      if (isMounted && items && baggageDataRef.current && Array.isArray(baggageDataRef.current.items)) {
        setData(items.filter((item) => baggageDataRef.current && baggageDataRef.current.items.includes(item.uuid)));
      }
      if (isMounted && settings) {
        setSettings(settings);
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

    const unsub_settings = subscribe<Settings>('settings', (settings) => {
      if (isMounted) {
        setSettings(settings);
        //console.log("Settings data updated:", settings);
      }
    });

    return () => {
      isMounted = false;
      unsub_baggages();
      unsub_items();
      unsub_settings();
    };
  }, [uuid]);

  //#endregion


  const [searchTerm, setSearchTerm] = useState<string>("");
  const searchbar = useRef<HTMLIonSearchbarElement>(null);
  const [searchResults, setSearchResults] = useState<Item[]>([])
  const [searchResultsStore, setSearchResultsStore] = useState<Item[]>([])
  const [searchResultsPacked, setSearchResultsPacked] = useState<Item[]>([])
  const [searchResultsReady, setSearchResultsReady] = useState<Item[]>([])
  //#region Search Functionality
  const handleInput = () => {
    const inputValue = searchbar.current?.value || ""
    setSearchTerm(inputValue)
  }

  useEffect(() => {
    if (!data) { setSearchResults([]); return; }
    const filtered = data.filter((elem) => elem.name.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1);
    setSearchResults(filtered);
    setSearchResultsStore(filtered.filter(item => item.type === 'store'));
    setSearchResultsPacked(filtered.filter(item => item.type === 'packed'));
    setSearchResultsReady(filtered.filter(item => item.type === 'ready'));

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





  //#region Camera Functionality
  const [stream, setStream] = useState<MediaStream | null>(null);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        setIsStreaming(true);
        await videoRef.current.play();
      }
      setStream(mediaStream);
    } catch (err) {
      //console.error('Error accessing camera:', err);
    }
  };

  const stopCamera = () => {
    if (stream) {
      setIsStreaming(false);
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  const takePhoto = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0);
      const dataUrl = canvas.toDataURL('image/png');
      dispatch({
        type: 'UPDATE',
        field: 'image',
        value: dataUrl.split(',')[1] // only base64 part
      });
    }
    stopCamera();
  };
  const removePhoto = () => {
    dispatch({
      type: 'UPDATE',
      field: 'image',
      value: undefined
    });
  };

  return (
    <>
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonBackButton text={t("generic.back") as string} />
            </IonButtons>
            <IonTitle>{baggageData?.name || t("baggages.unnamed") as string}</IonTitle>
          </IonToolbar>
          <IonToolbar>
            <IonSearchbar placeholder={t("generic.search") as string} aria-autocomplete='none' autocomplete='off' ref={searchbar} debounce={250} onIonInput={handleInput}></IonSearchbar>
            <IonRow className='horizontal-slider seperator-top'>

              <CategoriesBar></CategoriesBar>

            </IonRow>
          </IonToolbar>
        </IonHeader>
        <IonContent fullscreen>
          <IonList class='items-list'>
            {searchResultsStore.length !== 0 && (
              <IonItemDivider style={{ backgroundColor: "transparent" }}>
                <IonLabel style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <IonIcon icon={bagOutline} />
                  {t("items.store") as string}
                </IonLabel>
                <IonChip color={'primary'} slot='end'>{t("items.unboughtPrice", { amount: searchResultsStore.reduce((acc, item) => acc + (item.amount * (item.price || 0)), 0) }) as string}</IonChip>
              </IonItemDivider>
            )}
            {
              searchResultsStore.map((result, key) => (
                <React.Fragment key={key}> <ItemCard
                  item={result}
                  dispatch={dispatch}
                  modal={modal}
                /> </React.Fragment>
              ))
            }

            {(searchResultsReady.length !== 0) && (
              <IonItemDivider style={{ backgroundColor: "transparent", borderTop: searchResultsStore.length !== 0 ? "1px solid var(--ion-color-secondary)" : "none", minHeight: "32px", paddingTop: "5px", paddingBottom: "2px" }} >
                <IonLabel style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <IonIcon icon={checkmark} />
                  {t("items.ready") as string}
                </IonLabel>
              </IonItemDivider>)}

            {
              searchResultsReady.map((result, key) => (
                <React.Fragment key={key}> <ItemCard
                  item={result}
                  dispatch={dispatch}
                  modal={modal}
                /> </React.Fragment>
              ))
            }

            {(searchResultsPacked.length !== 0) && (
              <IonItemDivider style={{ backgroundColor: "transparent", borderTop: (searchResultsReady.length !== 0 || searchResultsStore.length !== 0) ? "1px solid var(--ion-color-secondary)" : "none", minHeight: "32px", paddingTop: "5px", paddingBottom: "2px" }} >
                <IonLabel style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <IonIcon icon={checkmarkDone} />
                  {t("items.packed") as string}
                </IonLabel>
              </IonItemDivider>
            )}

            {
              searchResultsPacked.map((result, key) => (
                <React.Fragment key={key}> <ItemCard
                  item={result}
                  dispatch={dispatch}
                  modal={modal}
                /> </React.Fragment>
              ))
            }
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
                onClick={isStreaming ? takePhoto : formState.image ? removePhoto : startCamera}
                playsInline
                style={{ display: isStreaming ? 'block' : 'none', }}
              >
              </video>

              {
                !formState.image ?
                  <div className='camera-preview' onClick={isStreaming ? takePhoto : formState.image ? removePhoto : startCamera} style={{ display: isStreaming ? 'none' : 'flex', }}>
                    <IonIcon size='large' icon={cameraOutline}></IonIcon>

                  </div> :
                  <IonImg src={formState.image ? 'data:image/jpeg;base64,' + formState.image : ""} className='camera-preview' onClick={isStreaming ? takePhoto : formState.image ? removePhoto : startCamera} style={{ display: isStreaming ? 'none' : 'flex', }}>
                  </IonImg>
              }



              <div className='item-preview-details'>
                <div style={{ display: 'flex', gap: "4px", alignItems: 'center' }}>
                  <IonLabel className='item-preview-title'>{formState.name || t("items.name") as string}</IonLabel>
                  <IonChip className='item-preview-price'>{`${formState.price || 0}${settings?.currency}`}</IonChip>
                </div>
                <div style={{ display: 'flex', flexDirection: 'row', gap: '4px', alignItems: 'flex-start', height: '100%' }}>
                  <IonLabel style={{ flexGrow: 1 }} color={'primary'} className='item-preview-note'>{formState.note || t("items.noteNotProvided") as string}</IonLabel>

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
                      isStreaming={isStreaming}
                      bag_uuid={uuid}
                      startCamera={startCamera}
                      takePhoto={takePhoto}
                      removePhoto={removePhoto}
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
