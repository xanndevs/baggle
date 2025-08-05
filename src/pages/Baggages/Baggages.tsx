import { IonContent, IonFab, IonFabButton, IonHeader, IonIcon, IonLabel, IonModal, IonPage, IonProgressBar, IonTitle, IonToolbar } from '@ionic/react';
import { AnimatePresence } from 'framer-motion';
import { addSharp } from 'ionicons/icons';
import React, { useReducer, useRef, useState } from 'react';
import './Baggages.css';
import Page1 from './modal/Page1';

const Baggages: React.FC = () => {


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
        <IonLabel>No Content</IonLabel>

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
  );
};

export default Baggages;
