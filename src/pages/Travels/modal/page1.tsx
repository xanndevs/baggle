import { IonButton, IonButtons, IonDatetime, IonHeader, IonInput, IonModal, IonTitle, IonToolbar } from '@ionic/react';
import { time } from 'console';
import { motion, AnimatePresence } from 'framer-motion';
import React, { useEffect, useRef } from 'react';
import { push } from '../../../utils/storage';
import { v4 as uuid_v4 } from 'uuid';


interface ComponentTypes {
    dispatch: any,
    formState: any,
    setModalPage: React.Dispatch<React.SetStateAction<number>>,
    modal: React.RefObject<HTMLIonModalElement>,

}

const Page1: React.FC<ComponentTypes> = ({ dispatch, formState, modal, setModalPage }) => {

    const date_modal = useRef<HTMLIonModalElement>(null);
    const time_modal = useRef<HTMLIonModalElement>(null);
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

        return travel
    }


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
                    label="Travel Name"
                    labelPlacement="stacked"
                    fill="solid"
                    color={'secondary'}
                    ref={firstInput}
                    className='bordered'
                    value={formState.travelNameValue}

                    onIonChange={(e) => {
                        dispatch({
                            type: "UPDATE",
                            field: "travelNameValue",
                            value: e.target.value,
                        })
                    }}
                />

                <br></br>

                <>
                    {
                        //#region Travel Date
                    }
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

                        canDismiss={true}
                        onWillDismiss={() => { /* Dismiss */ }}


                        keepContentsMounted
                        id='date-modal'
                        initialBreakpoint={1}
                        breakpoints={[0, 1]}
                        animated




                    >
                        <div id='date-modal-content'>
                            <IonHeader>
                                <IonToolbar>
                                    <IonTitle className='ion-padding-vertical'>Date Picker</IonTitle>
                                    <IonButtons slot='end'>
                                        <IonButton size='small' onClick={() => { date_modal.current?.dismiss(); time_modal.current?.present() }}>Next</IonButton>
                                    </IonButtons>
                                </IonToolbar>
                            </IonHeader>
                            <IonDatetime
                                id='date-picker'
                                preferWheel={false}
                                color={'secondary'}
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
                    {
                        //#endregion
                    }
                </>

                <br></br>

                <>
                    {
                        //#region Travel Time
                    }
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
                                color={'secondary'}
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
                    {
                        //#endregion
                    }
                </>
            </div>

            <IonButton
                expand="block"
                className="ion-margin-top"
                style={{ paddingBottom: `${100 - ((modal.current?.initialBreakpoint || 0) * 100) }vh` }}
                onClick={() => {
                    push("travels", getFormInput());
                    //setModalPage((prev) => prev + 1);
                    dispatch({
                        type: "UPDATE",
                        field: "progress",
                        value: 1,
                    })
                    modal.current?.dismiss();
                }}
            >
                Next
            </IonButton>


        </motion.div>

    </>)

}

export default Page1