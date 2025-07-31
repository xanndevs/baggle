import { IonButton, IonButtons, IonDatetime, IonHeader, IonInput, IonModal, IonTitle, IonToolbar } from '@ionic/react';
import { motion, AnimatePresence } from 'framer-motion';
import React, { useEffect, useRef } from 'react';

interface ComponentTypes {
    travelNameValue: any,
    setInputValue: any,
    travelDateValue: any,
    setTravelDateValue: any,
    setModalPage: React.Dispatch<React.SetStateAction<number>>,
    setProgress: any

}

const Page1: React.FC<ComponentTypes> = ({ travelNameValue, setInputValue, travelDateValue, setTravelDateValue, setModalPage, setProgress }) => {

    const date_modal = useRef<HTMLIonModalElement>(null);
    const time_modal = useRef<HTMLIonModalElement>(null);
    const firstInput = useRef<HTMLIonInputElement>(null);

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
                    value={travelNameValue}

                    onIonChange={(e) => setInputValue(e.detail.value!)}
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
                        value={travelDateValue.split("T")[0]}

                        onIonFocus={(e) => date_modal.current?.present()}
                    ></IonInput>

                    <IonModal
                        ref={date_modal}
                        trigger="open-date"

                        canDismiss={true}
                        onWillDismiss={() => { console.log("1"); }}
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
                                        <IonButton size='small' onClick={() => {date_modal.current?.dismiss()}}>Done</IonButton>
                                    </IonButtons>
                                </IonToolbar>
                            </IonHeader>
                            <IonDatetime
                                id='date-picker'
                                preferWheel={false}
                                color={'secondary'}
                                size='cover'
                                presentation='date'
                                onIonChange={(elem) => { setTravelDateValue(elem.target.value) }}

                                value={travelDateValue}

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
                        value={travelDateValue.split("T")[1]}

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
                                        <IonButton size='small' onClick={() => {time_modal.current?.dismiss()}}>Done</IonButton>
                                    </IonButtons>
                                </IonToolbar>
                            </IonHeader>
                            <IonDatetime
                                id='time-picker'
                                preferWheel={false}
                                color={'secondary'}
                                size='cover'
                                presentation='time'
                                onIonChange={(elem) => { setTravelDateValue(elem.target.value) }}

                                value={travelDateValue}

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
                style={{ paddingBottom: "15vh" }}
                onClick={() => { setModalPage((prev) => prev + 1); setProgress(0.5); }}
            >
                Next
            </IonButton>


        </motion.div>

    </>)

}

export default Page1