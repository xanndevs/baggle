import { IonButton, IonButtons, IonDatetime, IonHeader, IonInput, IonModal, IonTitle, IonToolbar } from '@ionic/react';
import { motion, AnimatePresence } from 'framer-motion';
import React, { useEffect, useRef } from 'react';

interface ComponentTypes {
    dispatch: any,
    formState: any,
    setModalPage: React.Dispatch<React.SetStateAction<number>>,
    modal: React.RefObject<HTMLIonModalElement>,

}

const Page1: React.FC<ComponentTypes> = ({ dispatch, formState, modal, setModalPage }) => {

    const firstInput = useRef<HTMLIonInputElement>(null);

    const pageVariants = {
        initial: { opacity: 0, x: 50 },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -50 },
    };

    console.log(1 - (modal.current?.initialBreakpoint || 0))
    useEffect(() => {
        setTimeout(() => {
            firstInput.current?.setFocus();
        }, 100); // wait a bit to ensure modal is fully visible
    }, []);

    return (<>

        <motion.div
            key="page1"
            initial="initial"
            animate="animate"
            exit="exit"
            variants={pageVariants}
            transition={{ duration: 0.2 }}
            style={{ display: 'flex', flexDirection: 'column', height: '100%' }}
        >
            <div style={{ flexGrow: 1 }}>
                <IonInput
                    label="Bag Name"
                    labelPlacement="stacked"
                    fill="solid"
                    color={'secondary'}
                    ref={firstInput}
                    className='bordered'
                    value={formState.baggageNameValue}

                    onIonChange={(e) => {
                        dispatch({
                            type: "UPDATE",
                            field: "baggageNameValue",
                            value: e.target.value,
                        })
                    }}
                />

            </div>

            <IonButton
                expand="block"
                className="ion-margin-top"
                style={{ paddingBottom: `${100 - ((modal.current?.initialBreakpoint || 0) * 100) }vh` }}
                onClick={() => {
                    setModalPage((prev) => prev + 1);
                    dispatch({
                        type: "UPDATE",
                        field: "progress",
                        value: 0.5,
                    })
                }}
            >
                Next
            </IonButton>


        </motion.div>

    </>)

}

export default Page1