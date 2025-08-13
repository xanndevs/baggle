import { IonButton, IonButtons, IonContent, IonDatetime, IonHeader, IonInput, IonModal, IonProgressBar, IonTitle, IonToolbar } from '@ionic/react';
import { motion, AnimatePresence } from 'framer-motion';
import React, { useEffect, useRef, useState } from 'react';
import { v4 as uuid_v4 } from 'uuid';
import { edit_uuid, push, push_bag_to_travel } from '../../../utils/storage';
import { c } from 'framer-motion/dist/types.d-Cjd591yU';
import { useHistory } from 'react-router';
interface ComponentTypes {
    dispatch: any,
    formState: any,
    modal: React.RefObject<HTMLIonModalElement>,
    travel: string

}

const AddBaggageModal: React.FC<ComponentTypes> = ({ dispatch, formState, modal, travel }) => {

    const firstInput = useRef<HTMLIonInputElement>(null);
    const [modalPage, setModalPage] = useState(1);
    const history = useHistory(); // <-- Create history
    const [nameError, setNameError] = useState<string>("");


    const pageVariants = {
        initial: { opacity: 0, x: 50 },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -50 },
    };

    //console.log(1 - (modal.current?.initialBreakpoint || 0))
    
    // ditch the idea of focus trapping for now, as it was lowering the UX quality
    // useEffect(() => {
    //     setTimeout(() => {
    //         firstInput.current?.setFocus();
    //     }, 150); // wait a bit to ensure modal is fully visible
    // }, []);


    function getFormInput(): any {
        const baggage: { uuid: string; name: string; } = {
            uuid: uuid_v4(),
            name: formState.baggageNameValue,
        };
        return baggage;
    }


    async function handleAddBaggage(e?: React.FormEvent<HTMLFormElement>) {
        if (e) e.preventDefault();

        const formInput = getFormInput();
        console.log("Form Input: ", formInput);
        // Use input validity instead of manual length check
        await push_bag_to_travel(travel, formInput.uuid);
        await push("baggages", formInput);
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
            history.push(`/baggages/${formInput.uuid}`);
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
                            <form style={{ flexGrow: 1 }} onSubmit={handleAddBaggage}>
                                <IonInput

                                    type='text'
                                    color={nameError ? 'danger' : 'secondary'}
                                    className={`bordered ${nameError ? 'input-error' : ''}`}
                                    counter={formState.baggageNameValue.length}
                                    counterFormatter={(value: number) => `${value}/16`}
                                    errorText={nameError}
                                    label="Bag Name"
                                    labelPlacement="stacked"
                                    fill="solid"
                                    ref={firstInput}
                                    value={formState.baggageNameValue}
                                    minlength={3}
                                    maxlength={16}
                                    required
                                    onIonInput={(e) => {
                                        e.preventDefault();
                                        console.log("Input Value: ", e.target.value?.toString().length);

                                        console.log("Target Object: ", e.target.attributes);

                                        dispatch({
                                            type: "UPDATE",
                                            field: "baggageNameValue",
                                            value: e.target.value?.toString().split("").splice(0, 16).join(""),
                                        });
                                    }}
                                    onIonChange={(e) => {
                                        if (formState.baggageNameValue.length < 3 || formState.baggageNameValue.length > 16) {
                                            setNameError("Baggage name must be between 3 and 16 characters long.");
                                        } else {
                                            setNameError("");
                                        }
                                    }}
                                />


                                <IonButton
                                    expand="block"
                                    className="ion-margin-top"

                                    style={{ bottom: "10px", position: "absolute", right: "10px", left: "10px" }}
                                    type="submit"
                                >
                                    Next
                                </IonButton>
                            </form>


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