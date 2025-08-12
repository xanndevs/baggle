import { IonButton, IonButtons, IonCheckbox, IonDatetime, IonHeader, IonIcon, IonInput, IonModal, IonTitle, IonToolbar } from '@ionic/react';
import { motion, AnimatePresence, clamp } from 'framer-motion';
import React, { useEffect, useRef } from 'react';
import './AddItemModal.css';
import { addSharp, removeSharp } from 'ionicons/icons';

interface ComponentTypes {
    dispatch: any,
    formState: any,
    setModalPage: React.Dispatch<React.SetStateAction<number>>,
    modal: React.RefObject<HTMLIonModalElement>,

}

const Page1_AddItemModal: React.FC<ComponentTypes> = ({ dispatch, formState, modal, setModalPage }) => {

    const firstInput = useRef<HTMLIonInputElement>(null);
    const amountRef = useRef<HTMLIonInputElement>(null);

    const pageVariants = {
        initial: { opacity: 0, x: 50 },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -50 },
    };

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
            style={{ display: 'flex', flexDirection: 'column', height: '100%', }}
        >
            <div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                <IonInput
                    label="Item Name"
                    labelPlacement="stacked"
                    fill="solid"
                    color={'secondary'}
                    ref={firstInput}
                    className='bordered'
                    value={formState.name}

                    onIonInput={(e) => {
                        dispatch({
                            type: "UPDATE",
                            field: "name",
                            value: e.target.value,
                        })
                    }}
                />
                <br></br>
                <div className='number-border' style={{ display: 'flex', flexDirection: 'row', gap: '0px', alignItems: 'flex-end' }}>
                    <IonInput
                        label="Item Amount"
                        labelPlacement="stacked"
                        fill="outline"
                        className='bordered border-right-flat'
                        color={'secondary'}
                        value={formState.amount}
                        ref={amountRef}
                        min={1}
                        max={99}
                        type='number'
                        onIonInput={(e) => {
                            const val = String(e.target.value);
                            const parsed = val === '' ? 1 : parseInt(val, 10);
                            dispatch({
                                type: "UPDATE",
                                field: "amount",
                                value: Math.max(1, Math.min(99, isNaN(parsed) ? 1 : parsed)),
                            })
                        }}
                    />
                    <IonButton
                        fill='clear'
                        className='ion-no-margin number-button'
                        onClick={() => {
                            amountRef.current?.setFocus();
                            dispatch({
                                type: "UPDATE",
                                field: "amount",
                                value: Math.max(1, Math.min(99, formState.amount - 1)),
                            })
                        }}
                    ><IonIcon size='small' icon={removeSharp} /></IonButton>
                    <IonButton
                        className='ion-no-margin number-button'
                        fill='clear'
                        onClick={() => {
                            amountRef.current?.setFocus();
                            dispatch({
                                type: "UPDATE",
                                field: "amount",
                                value: Math.max(1, Math.min(99, formState.amount + 1)),
                            })
                        }}
                    ><IonIcon size='small' icon={addSharp} /></IonButton>

                </div>

                <br></br>

                <IonCheckbox
                    style={{ flexGrow: 1 }}
                    justify='space-between'
                    labelPlacement="start"
                    onIonChange={(e) => {
                        dispatch({
                            type: "UPDATE",
                            field: "type",
                            value: e.detail.checked ? "store" : "ready",
                        })
                    }}
                    checked={formState.type === "store"}
                >
                    I dont have this item yet.
                </IonCheckbox>


            </div>

            <IonButton
                expand="block"
                onClick={() => {
                    setModalPage((prev) => prev + 1);
                    dispatch({ type: "UPDATE", field: "progress", value: 0.5, })
                }}
            >
                Next
            </IonButton>


        </motion.div >

    </>)

}

export default Page1_AddItemModal