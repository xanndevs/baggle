import { IonButton, IonButtons, IonContent, IonDatetime, IonHeader, IonInput, IonModal, IonProgressBar, IonTitle, IonToolbar } from '@ionic/react';
import { motion, AnimatePresence } from 'framer-motion';
import React, { useEffect, useRef, useState } from 'react';
import { v4 as uuid_v4 } from 'uuid';
import { edit_uuid, push } from '../../../utils/storage';
interface ComponentTypes {
    dispatch: any,
    formState: any,
    modal: React.RefObject<HTMLIonModalElement>,
    travel: string

}

const AddBaggageModal: React.FC<ComponentTypes> = ({ dispatch, formState, modal, travel }) => {

    const firstInput = useRef<HTMLIonInputElement>(null);
    const [modalPage, setModalPage] = useState(1);

    const pageVariants = {
        initial: { opacity: 0, x: 50 },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -50 },
    };

    //console.log(1 - (modal.current?.initialBreakpoint || 0))
    useEffect(() => {
        setTimeout(() => {
            firstInput.current?.setFocus();
        }, 150); // wait a bit to ensure modal is fully visible
    }, []);

    
    function getFormInput(): any {
        const travel: { uuid: string; name: string; bags: string[]; date: string } = {
            uuid: uuid_v4(),
            name: formState.travelNameValue,
            bags: ["uuid-best"],
            date: formState.travelDateValue,
        };
        return travel;
    }


        async function handleAddBaggage(e?: React.FormEvent<HTMLFormElement>) {
            if (e) e.preventDefault();

            const formInput = getFormInput();
            // Use input validity instead of manual length check
            edit_uuid(`travels.${formInput.uuid}`, {bags: formInput.uuid});
            push("baggages", formInput);
            dispatch({
                type: "UPDATE",
                field: "progress",
                value: 1,
            });
            setTimeout(() => {
                modal.current?.dismiss();
                dispatch({
                    type: "RESET",
                })
            }, 350);
    
        }

    return (<>


        <div id='baggage-modal-content' style={{ display: 'flex', flexDirection: 'column', height: '300px' }}>
            <IonHeader >
                <IonToolbar>
                    <IonTitle>New Baggage</IonTitle>

                </IonToolbar>
                <IonProgressBar value={formState.progress}></IonProgressBar>
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
                                style={{ bottom: "10px", position: "absolute", right: "10px", left: "10px" }}
                                onClick={() => {
                                    //setModalPage((prev) => prev + 1);
                                    handleAddBaggage();
                                }}
                            >
                                Next
                            </IonButton>


                        </motion.div>

                    )}

                    {/*
                    
                    {modalPage === 2 && (
                        <></>
                    )}

                    {modalPage === 3 && (
                        <></>
                    )}
                    
                    */}
                </AnimatePresence>
            </IonContent>
        </div>

    </>)

}

export default AddBaggageModal