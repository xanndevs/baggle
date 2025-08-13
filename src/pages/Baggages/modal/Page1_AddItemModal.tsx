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
    const priceRef = useRef<HTMLIonInputElement>(null);

    const pageVariants = {
        initial: { opacity: 0, x: 50 },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -50 },
    };

    //dithced the idea of focus trapping for now, as it was lowering the ux quality
    // useEffect(() => {
    //     setTimeout(() => {
    //         firstInput.current?.setFocus();
    //     }, 100); // wait a bit to ensure modal is fully visible
    // }, []);

    useEffect(() => {
        dispatch({
            type: "UPDATE",
            field: "title",
            value: "Add a new Item",
        })
    }, [])

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
                    maxlength={20}
                    minlength={3}
                    counter={formState.name.length}
                    counterFormatter={(value: number) => `${value}/20`}
                    value={formState.name}

                    errorText={formState.nameError}
                    onIonInput={(e) => {
                        dispatch({
                            type: "UPDATE",
                            field: "name",
                            value: e.target.value?.toString().split("").splice(0, 20).join(""),
                        });
                    }}
                    onIonChange={(e) => {
                        if (formState.name.length < 3 || formState.name.length > 20) {
                            dispatch({
                                type: "UPDATE",
                                field: "nameError",
                                value: "Item name must be between 3 and 20 characters long.",
                            });
                        } else {
                            dispatch({
                                type: "UPDATE",
                                field: "nameError",
                                value: "",
                            });
                        }
                    }}
                />
                <br></br>
                <div style={{ display: 'flex', flexDirection: 'row', gap: '8px', alignItems: 'center' }}>
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
                        onMouseDown={(e) => {
                            e.preventDefault(); // Prevents the input from losing focus
                        }}
                        onClick={() => {
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
                        onMouseDown={(e) => {
                            e.preventDefault(); // Prevents the input from losing focus
                        }}
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

                <div className='' style={{ display: 'flex', flexDirection: 'row', gap: '0px', alignItems: 'flex-end' }}>
                    <IonInput
                        label="Item Price"
                        labelPlacement="stacked"
                        fill="outline"
                        className='bordered'
                        color={'secondary'}
                        value={formState.price}
                        ref={priceRef}
                        min={0}
                        type='number'
                        onIonInput={(e) => {
                            const val = String(e.target.value);
                            const parsed = val === '' ? 0 : parseFloat(parseFloat(val).toFixed(3));
                            dispatch({
                                type: "UPDATE",
                                field: "price",
                                value: Math.max(0,  isNaN(parsed) ? 0 : parsed),
                            })
                        }}
                    />
                </div>

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