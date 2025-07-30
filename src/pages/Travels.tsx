import React, { useRef, useState } from 'react';
import {
  IonContent, IonFab, IonFabButton, IonFabList, IonHeader, IonIcon, IonModal, IonPage, IonTitle, IonToolbar, IonButtons,
  IonButton,
  IonInput,
  IonProgressBar,
} from '@ionic/react';
import TravelsAccordion from '../components/TravelsAccordion';
import './Travels.css';
import { addSharp } from 'ionicons/icons';
import { motion, AnimatePresence } from 'framer-motion';


const Travels: React.FC = () => {

  const modal = useRef<HTMLIonModalElement>(null);

  const [inputValue, setInputValue] = useState('');
  const [progress, setProgress] = useState<number>(0);
  const [modalPage, setModalPage] = useState(1);

  const setModal = () => {
    setProgress((previous) => previous + 0.05);
  };

  const pageVariants = {
    initial: { opacity: 0, x: 50 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 },
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
        <TravelsAccordion />

        <IonFab slot="fixed" vertical="bottom" horizontal="end" id="open-modal">
          <IonFabButton onClick={setModal}>
            <IonIcon icon={addSharp}></IonIcon>
          </IonFabButton>
        </IonFab>
          <IonModal
            ref={modal}
            trigger="open-modal"
            initialBreakpoint={0.85}
            breakpoints={[0, 0.85]}
            backdropBreakpoint={0.1}
            canDismiss={true}
            handleBehavior="none"
            onWillDismiss={() => setModalPage(1)}
          >
            <IonHeader >
              <IonToolbar>
                <IonTitle>New Travel</IonTitle>
                <IonButton slot='end' fill='clear' size='small' onClick={() => modal.current?.dismiss()}>Cancel</IonButton>
              </IonToolbar>
              <IonProgressBar value={progress}></IonProgressBar>
            </IonHeader>
            <IonContent className="ion-padding">

              <AnimatePresence mode="wait">
                {modalPage === 1 && (
                  <motion.div
                    key="page1"
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    variants={pageVariants}
                    transition={{ duration: 0.2 }}
                  >
                    <IonInput
                      label="Travel Name"
                      labelPlacement="floating"
                      fill="outline"
                      value={inputValue}
                      onIonChange={(e) => setInputValue(e.detail.value!)}
                    />
                    <IonButton
                      expand="block"
                      className="ion-margin-top"
                      onClick={() => { setModalPage(2); setProgress(0.5); }}
                    >
                      Next
                    </IonButton>
                  </motion.div>
                )}

                {modalPage === 2 && (
                  <motion.div
                    key="page2"
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    variants={pageVariants}
                    transition={{ duration: 0.3 }}
                  >
                    <h2>Review Input</h2>
                    <p>You entered: {inputValue}</p>
                    <IonButton
                      expand="block"
                      className="ion-margin-bottom"
                      onClick={() => setModalPage(1)}
                    >
                      Back
                    </IonButton>
                    <IonButton
                      expand="block"
                      color="success"
                      onClick={() => {
                        console.log('Input value:', inputValue);
                        modal.current?.dismiss();
                      }}
                    >
                      Submit
                    </IonButton>
                  </motion.div>
                )}
              </AnimatePresence>
            </IonContent>
          </IonModal>

      </IonContent>
    </IonPage>
  );
};

export default Travels;
