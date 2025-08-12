import { IonButton, IonButtons, IonContent, IonDatetime, IonHeader, IonInput, IonModal, IonProgressBar, IonTitle, IonToolbar } from '@ionic/react';
import { time } from 'console';
import { motion, AnimatePresence } from 'framer-motion';
import React, { useEffect, useRef, useState } from 'react';
import { push } from '../../../utils/storage';
import { v4 as uuid_v4 } from 'uuid';
import { useHistory } from 'react-router';


interface ComponentTypes {
    dispatch: any,
    formState: any,
    modal: React.RefObject<HTMLIonModalElement>,

}

const AddTravelModal: React.FC<ComponentTypes> = ({ dispatch, formState, modal }) => {
    const [modalPage, setModalPage] = useState<number>(1);

    const date_modal = useRef<HTMLIonModalElement>(null);
    const time_modal = useRef<HTMLIonModalElement>(null);
    const firstInput = useRef<HTMLIonInputElement>(null);
    const [nameError, setNameError] = useState<string>("");
    const history = useHistory();

    const pageVariants = {
        initial: { opacity: 0, x: 50 },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -50 },
    };


    // ditch the idea of focus trapping for now, as it was lowering the UX quality
    // useEffect(() => {
    //     setTimeout(() => {
    //         firstInput.current?.setFocus();
    //     }, 150);
    // }, []);

    function toLocalISOString(date: Date): string {
        const pad = (n: number) => String(n).padStart(2, "0");
        const yyyy = date.getFullYear();
        const mm = pad(date.getMonth() + 1);
        const dd = pad(date.getDate());
        const hh = pad(date.getHours());
        const mi = pad(date.getMinutes());
        const ss = pad(date.getSeconds());
        return `${yyyy}-${mm}-${dd}T${hh}:${mi}:${ss}`;
    }

    function getFormInput(): any {
        const travel: { uuid: string; name: string; bags: string[]; date: string } = {
            uuid: uuid_v4(),
            name: formState.travelNameValue,
            bags: ["uuid-best"],
            date: formState.travelDateValue,
        };
        return travel;
    }

    async function handleAddTravel(e?: React.FormEvent<HTMLFormElement>) {
        if (e) e.preventDefault();
        // Use input validity instead of manual length check
        const formInput = getFormInput();
        await push("travels", formInput);
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
            history.push(`/travels/${formInput.uuid}`);
        }, 350);
    }

    return (
        <>
            <div style={{ display: 'flex', flexDirection: 'column', height: '466px' }}>

                <IonHeader >
                    <IonToolbar>
                        <IonTitle>New Travel</IonTitle>

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
                                style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>

                                <form noValidate style={{ flexGrow: 1 }} onSubmit={handleAddTravel}>
                                    <IonInput
                                        label="Travel Name *"
                                        labelPlacement="stacked"
                                        fill="solid"
                                        type='text'
                                        color={nameError ? 'danger' : 'secondary'}
                                        ref={firstInput}
                                        className={`bordered ${nameError ? 'input-error' : ''}`}
                                        value={formState.travelNameValue}
                                        minlength={3}
                                        counter={formState.travelNameValue.length}
                                        counterFormatter={(value: number) => `${value}/16`}
                                        maxlength={16}
                                        required
                                        onIonInput={(e) => {
                                            e.preventDefault();
                                            console.log("Input Value: ", e.target.value?.toString().length);

                                            console.log("Target Object: ", e.target.attributes);

                                            dispatch({
                                                type: "UPDATE",
                                                field: "travelNameValue",
                                                value: e.target.value?.toString().split("").splice(0,16).join(""),
                                            });
                                        }}
                                        onIonChange={(e) => {
                                            if (formState.travelNameValue.length < 3 || formState.travelNameValue.length > 16) {
                                                setNameError("Travel name must be between 3 and 16 characters long.");
                                            } else {
                                                setNameError("");
                                            }
                                        }}
                                        errorText={nameError}
                                    />
                                    {nameError && (
                                        <div style={{ color: 'red', fontSize: '0.9em', marginTop: '4px' }}>{nameError}</div>
                                    )}

                                    <br></br>

                                    {/* Travel Date */}
                                    <IonInput
                                        label="Travel Date"
                                        labelPlacement="stacked"
                                        fill="solid"
                                        color={'secondary'}
                                        className='bordered'
                                        id='open-date'
                                        value={formState.travelDateValue.toISOString().split("T")[0]}
                                        onIonFocus={(e) => date_modal.current?.present()}
                                    ></IonInput>

                                    <IonModal
                                        ref={date_modal}
                                        trigger="open-date"
                                        id='date-modal'
                                        canDismiss={true}
                                        onWillDismiss={() => { /* Dismiss */ }}
                                        keepContentsMounted
                                        initialBreakpoint={1}
                                        breakpoints={[0, 1]}
                                        animated
                                    >
                                        <div id='date-modal-content'>
                                            <IonHeader>
                                                <IonToolbar>
                                                    <IonTitle className='ion-padding-vertical'>Date Picker</IonTitle>
                                                    <IonButtons slot='end'>
                                                        <IonButton size='small' onClick={() => { date_modal.current?.dismiss(); /* not really intuitive time_modal.current?.present() */ }}>Done</IonButton>
                                                    </IonButtons>
                                                </IonToolbar>
                                            </IonHeader>
                                            <IonDatetime
                                                id='date-picker'
                                                preferWheel={false}
                                                color={'primary '}
                                                size='cover'
                                                presentation='date'
                                                onIonChange={(e) => {
                                                    const rawValue = e.target.value;
                                                    let dateValue = "";
                                                    if (Array.isArray(rawValue) && rawValue.length > 0) {
                                                        const parts = rawValue[0].split("T")[0]
                                                        dateValue = parts || "";
                                                    } else if (typeof rawValue === "string") {
                                                        const parts = rawValue.split("T")[0]
                                                        dateValue = parts || "";
                                                    }
                                                    dispatch({
                                                        type: "UPDATE",
                                                        field: "travelDateValue",
                                                        value: new Date(dateValue),
                                                    });
                                                }}
                                                value={formState.travelDateValue.toISOString()}
                                            />
                                        </div>
                                    </IonModal>

                                    <br></br>

                                    {/* Travel Time */}
                                    <IonInput
                                        label="Travel Time"
                                        labelPlacement="stacked"
                                        fill="solid"
                                        color={'secondary'}
                                        className='bordered'
                                        id='open-time'
                                        value={toLocalISOString(formState.travelDateValue).split("T")[1].split(".")[0]}
                                        onIonFocus={(e) => time_modal.current?.present()}
                                    ></IonInput>

                                    <IonModal
                                        ref={time_modal}
                                        trigger="open-time"
                                        canDismiss={true}
                                        onWillDismiss={() => { console.log("1"); }}
                                        keepContentsMounted
                                        id='time-modal'
                                        breakpoints={[0, 1]}
                                        initialBreakpoint={1}
                                        animated
                                    >
                                        <div id='time-modal-content'>
                                            <IonHeader>
                                                <IonToolbar>
                                                    <IonTitle className='ion-padding-vertical'>Time Picker</IonTitle>
                                                    <IonButtons slot='end'>
                                                        <IonButton size='small' onClick={() => { time_modal.current?.dismiss() }}>Done</IonButton>
                                                    </IonButtons>
                                                </IonToolbar>
                                            </IonHeader>
                                            <IonDatetime
                                                id='time-picker'
                                                preferWheel={false}
                                                color={'primary'}
                                                size='cover'
                                                presentation='time'
                                                onIonChange={(e) => {
                                                    const rawValue = e.target.value;
                                                    let timeValue = "";
                                                    if (Array.isArray(rawValue) && rawValue.length > 0) {
                                                        const parts = rawValue[0].split("T")[1]?.split(".");
                                                        timeValue = parts?.[0] || "";
                                                    } else if (typeof rawValue === "string") {
                                                        const parts = rawValue.split("T")[1]?.split(".");
                                                        timeValue = parts?.[0] || "";
                                                    }
                                                    // Fallback to 0 for missing time segments
                                                    const [h, m, s] = timeValue.split(":").map((v) => parseInt(v, 10) || 0);
                                                    const date = new Date(formState.travelDateValue);
                                                    date.setHours(h, m, s, 0); // local time
                                                    dispatch({
                                                        type: "UPDATE",
                                                        field: "travelDateValue",
                                                        value: date,
                                                    });
                                                }}
                                                value={toLocalISOString(formState.travelDateValue)}
                                            />
                                        </div>
                                    </IonModal>

                                    <IonButton
                                        expand="block"
                                        className="ion-margin-top"
                                        style={{ position: "absolute", bottom: "10px", left: "10px", right: "10px" }}
                                        type="submit"
                                    >
                                        Add Travel
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
        </>
    );
}

export default AddTravelModal;