import { Camera, CameraResultType } from '@capacitor/camera';
import { IonButton, IonButtons, IonCheckbox, IonDatetime, IonHeader, IonIcon, IonImg, IonInput, IonModal, IonTitle, IonToolbar } from '@ionic/react';
import { motion, AnimatePresence } from 'framer-motion';
import React, { useEffect, useRef, useState } from 'react';
import './AddItemModal.css';
import { addSharp } from 'ionicons/icons';

interface ComponentTypes {
    dispatch: any,
    formState: any,
    setModalPage: React.Dispatch<React.SetStateAction<number>>,
    modal: React.RefObject<HTMLIonModalElement>,

}

const Page2_AddItemModal: React.FC<ComponentTypes> = ({ dispatch, formState, modal, setModalPage }) => {

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


const [imageURL, setImageURL] = useState<string | undefined>(undefined);

const takePicture = async () => {
  const image = await Camera.getPhoto({
    quality: 90,
    resultType: CameraResultType.Uri
  });

  // image.webPath will contain a path that can be set as an image src.
  // You can access the original file using image.path, which can be
  // passed to the Filesystem API to read the raw data of the image,
  // if desired (or pass resultType: CameraResultType.Base64 to getPhoto)
  const imageUrl = image.webPath;

  // Can be set to the src of an image now
  setImageURL(imageUrl);
};

    return (<>

        <motion.div
            key="page2"
            initial="initial"
            animate="animate"
            exit="exit"
            variants={pageVariants}
            transition={{ duration: 0.2 }}
            style={{ display: 'flex', flexDirection: 'column', height: '100%', }}
        >
            <div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                <IonButton expand='block' fill='outline' color='secondary' onClick={() => {
                    takePicture();
                }}>
                    <IonTitle>Take Photo</IonTitle>
                    <IonIcon slot="end" icon={addSharp} />
                </IonButton>
                <IonImg src={imageURL}></IonImg>
                <IonInput
                    label="Bag Name"
                    labelPlacement="stacked"
                    fill="solid"
                    color={'secondary'}
                    ref={firstInput}
                    className='bordered'
                    value={formState.name}

                    onIonChange={(e) => {
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
                        min={1}
                        max={99}
                        type='number'
                        onIonChange={(e) => {
                            dispatch({
                                type: "UPDATE",
                                field: "amount",
                                value: e.target.value,
                            })
                        }}
                    />
                    <IonButton fill='clear' className='ion-no-margin number-button'>-</IonButton>
                    <IonButton
                        className='ion-no-margin number-button'
                        fill='clear'
                        onClick={() =>
                            dispatch({
                                type: "UPDATE",
                                field: "amount",
                                value: formState.amount + 1,
                            })
                        }
                    >+</IonButton>

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


        </motion.div>

    </>)

}

export default Page2_AddItemModal