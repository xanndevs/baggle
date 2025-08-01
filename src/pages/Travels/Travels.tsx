import React, { act, useReducer, useRef, useState } from 'react';
import {
  IonContent, IonFab, IonFabButton, IonFabList, IonHeader, IonIcon, IonModal, IonPage, IonTitle, IonToolbar, IonButtons,
  IonButton,
  IonInput,
  IonProgressBar,
  IonDatetime,
  IonDatetimeButton,
  IonFooter,
} from '@ionic/react';
import TravelsAccordion from '../../components/TravelsAccordion';
import './Travels.css';
import { addSharp } from 'ionicons/icons';
import { motion, AnimatePresence, number } from 'framer-motion';
import { push } from '../../utils/storage';
import Page1 from './modal/page1';
import Page2 from './modal/page2';
import Page3 from './modal/page3';

interface ComponentProps { travels: Travel[] }

const Travels: React.FC<ComponentProps> = ({ travels }) => {

  const modal = useRef<HTMLIonModalElement>(null);


  const [travelNameValue, setInputValue] = useState<string>('');
  const [travelDateValue, setTravelDateValue] = useState<any>();
  const [progress, setProgress] = useState<number>(0);
  const [modalPage, setModalPage] = useState(1);

  type FormState = {
    travelNameValue: string,
    travelDateValue: Date,
    travelTimeValue: Date,
    bagNameValue: string,
    bagItems: Item[],
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
          travelNameValue: "",
          travelDateValue: new Date(),
          travelTimeValue: new Date(
            new Date().getFullYear(),
            new Date().getMonth(),
            new Date().getDate(),
            6, 30, 0, 0
          ),

          bagNameValue: "",
          bagItems: [],

          progress: 0.02,
        };
      default:
        return state;
    }
  }

  const [formState, dispatch] = useReducer(formReducer, {
    travelNameValue: "",
    travelDateValue: new Date(),
    travelTimeValue: new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      new Date().getDate(),
      6, 30, 0, 0
    ),

    bagNameValue: "",
    bagItems: [],

    progress: 0.02
  })



  const setModal = () => {
    dispatch({
      type: "RESET",
    })
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Travels</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Travels</IonTitle>
          </IonToolbar>
        </IonHeader>
        <TravelsAccordion travels={travels} />

        <IonFab slot="fixed" vertical="bottom" horizontal="end" id="open-modal">
          <IonFabButton onClick={setModal}>
            <IonIcon icon={addSharp}></IonIcon>
          </IonFabButton>
        </IonFab>
        <IonModal
          ref={modal}
          trigger="open-modal"
          initialBreakpoint={0.65}
          breakpoints={[0, 0.65]}
          canDismiss={true}
          handleBehavior="none"
          onWillDismiss={() => setModalPage(1)}
        >
          <IonHeader >
            <IonToolbar>
              <IonTitle>New Travel</IonTitle>
              <IonButton slot='end' fill='clear' size='small' onClick={() => modal.current?.dismiss()}>Cancel</IonButton>
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
                <Page3
                  modal={modal}
                  dispatch={dispatch}
                  formState={formState}
                  setModalPage={setModalPage}
                />
              )}

              {modalPage === 3 && (
                <Page2
                  modal={modal}
                  dispatch={dispatch}
                  formState={formState}
                  setModalPage={setModalPage}
                />
              )}
            </AnimatePresence>
          </IonContent>
        </IonModal>

      </IonContent>
    </IonPage>
  );
};

export default Travels;
