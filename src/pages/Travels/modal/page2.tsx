import { IonButton, IonButtons, IonDatetime, IonHeader, IonInput, IonModal, IonTitle, IonToolbar } from '@ionic/react';
import { motion, AnimatePresence } from 'framer-motion';
import React, { useRef } from 'react';
import { push } from '../../../utils/storage';

interface ComponentTypes {
  travelNameValue: any,
  setModalPage: React.Dispatch<React.SetStateAction<number>>,
  modal:any,

}

const Page2: React.FC<ComponentTypes> = ({ travelNameValue, setModalPage, modal}) => {

  const date_modal = useRef<HTMLIonModalElement>(null);
  const time_modal = useRef<HTMLIonModalElement>(null);

  const pageVariants = {
    initial: { opacity: 0, x: 50 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 },
  };

  return (<>

    <motion.div
      key="page2"
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
      transition={{ duration: 0.2 }}
      style={{ display: 'flex', flexDirection: 'column', height: '100%' }}
    >
      <div style={{ flexGrow: 1 }}>
        <h2>Review Input</h2>
        <p>You entered: {travelNameValue}</p>

      </div>
      <div style={{display:"flex", flexDirection:"row", paddingBottom: "15vh"}}>

        <IonButton
          style={{ flexGrow:3 }}
          onClick={() => setModalPage(1)}
        >
          Back
        </IonButton>
      <IonButton
        expand="block"
        color="success"
        style={{ flexGrow:3 }}
        onClick={() => {
          console.log('Input value:', travelNameValue);
          modal.current?.dismiss();
          push("travels", { name: travelNameValue, bags: [], date: new Date().toISOString() });
        }}
        >
        Submit
      </IonButton>
        </div>



    </motion.div>

  </>)

}

export default Page2