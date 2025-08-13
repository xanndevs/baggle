import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { IonButton, IonIcon, IonLabel, IonTextarea } from '@ionic/react';
import { motion } from 'framer-motion';
import { cameraOutline, imageOutline, trashOutline } from 'ionicons/icons';
import React, { useEffect, useRef, useState } from 'react';
import { v4 as uuid_v4 } from 'uuid';
import { push, push_item_to_bag } from '../../../utils/storage';
import './AddItemModal.css';


interface FormState extends Item {
    progress?: number;
    nameError?: string;
    title?: string;
  }

type FormAction = {
    type: "UPDATE";
    field: keyof FormState;
    value: string | number | undefined;
} | {
    type: "RESET";
}
interface ComponentTypes {
    dispatch: React.Dispatch<FormAction>;
    formState: FormState;
    setModalPage: React.Dispatch<React.SetStateAction<number>>;
    modal: React.RefObject<HTMLIonModalElement>;
    videoRef: React.RefObject<HTMLVideoElement>;
    setIsStreaming: React.Dispatch<React.SetStateAction<boolean>>;
    isStreaming: boolean;
    bag_uuid: string;
}

const Page2_AddItemModal: React.FC<ComponentTypes> = ({ dispatch, formState, modal, setModalPage, videoRef, setIsStreaming, isStreaming, bag_uuid }) => {
    //const firstInput = useRef<HTMLIonInputElement>(null);
    const [stream, setStream] = useState<MediaStream | null>(null);

    const pageVariants = {
        initial: { opacity: 0, x: 50 },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -50 }
    };

    // ditch the idea of focus trapping for now, as it was lowering the UX quality
    //   useEffect(() => {
    //     setTimeout(() => {
    //       firstInput.current?.setFocus();
    //     }, 100);
    //   }, []);

    const startCamera = async () => {
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'environment' }
            });
            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream;
                setIsStreaming(true);
                await videoRef.current.play();
            }
            setStream(mediaStream);
        } catch (err) {
            //console.error('Error accessing camera:', err);
        }
    };

    const stopCamera = () => {
        if (stream) {
            setIsStreaming(false);
            stream.getTracks().forEach(track => track.stop());
            setStream(null);
        }
    };

    const takePhoto = () => {
        if (!videoRef.current) return;
        const canvas = document.createElement('canvas');
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;
        const ctx = canvas.getContext('2d');
        if (ctx) {
            ctx.drawImage(videoRef.current, 0, 0);
            const dataUrl = canvas.toDataURL('image/png');
            dispatch({
                type: 'UPDATE',
                field: 'image',
                value: dataUrl.split(',')[1] // only base64 part
            });
        }
        stopCamera();
    };

    const pickFromGallery = async () => {
        try {
            const photo = await Camera.getPhoto({
                quality: 90,
                allowEditing: false,
                resultType: CameraResultType.Base64,
                source: CameraSource.Photos
            });
            if (photo.base64String) {
                dispatch({
                    type: 'UPDATE',
                    field: 'image',
                    value: photo.base64String
                });
            }
        } catch (err) {
            //console.error('Error picking from gallery:', err);
        }
    };

    const removePhoto = () => {
        dispatch({
            type: 'UPDATE',
            field: 'image',
            value: undefined
        });
    };

    useEffect(() => {
        dispatch({
            type: "UPDATE",
            field: "title",
            value: "Add more details",
        })

    }, [modal])

    modal.current?.onWillDismiss().then(() => {
        //stopCamera();
    });
    async function addItem() {

        const formValues = { ...formState, uuid: uuid_v4() };

        delete formValues.title;
        delete formValues.progress;
        delete formValues.nameError;

        setModalPage(0);
        if (modal.current) {
            modal.current.dismiss();
        }

        await push_item_to_bag(bag_uuid, formValues.uuid).then(() => {
            push('items', formValues);
        });

        setTimeout(() => {
            modal.current?.dismiss();
            dispatch({
                type: "RESET",
            })
            setModalPage(0);
        }, 350);
    }

    return (
        <motion.div
            key="page2"
            initial="initial"
            animate="animate"
            exit="exit"
            variants={pageVariants}
            transition={{ duration: 0.2 }}
            style={{ display: 'flex', flexDirection: 'column', height: '100%' }}
        >
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    flexGrow: 1,
                    width: '100%',
                    gap: '8px'
                }}
            >
                <IonTextarea
                    color={'primary'}
                    className='bordered'
                    label='Item Note'
                    labelPlacement='stacked'


                    rows={3}
                    maxlength={50}
                    value={formState.note}

                    onIonInput={(e) =>
                        dispatch({
                            type: "UPDATE",
                            field: "note",
                            value: e.target.value?.toString().split("").splice(0, 50).join(""),
                        })
                    }
                    counter={true}
                    counterFormatter={(value: number) => `${value}/50`}
                />

                <div style={{ display: 'flex', flexDirection: 'row', gap: '8px' }}>
                    <IonButton
                        fill={isStreaming ? "solid" : "outline"}
                        color="primary"
                        onClick={isStreaming ? takePhoto : startCamera}
                        style={{ flexGrow: 1 }}
                    >
                        <IonLabel slot="end">
                            {isStreaming ? 'Take Photo' : 'From Camera'}
                        </IonLabel>
                        <IonIcon size="default" slot="start" icon={cameraOutline} />
                    </IonButton>

                    <IonButton
                        fill="outline"
                        color="primary"
                        onClick={pickFromGallery}
                    >
                        <IonLabel slot="end">
                            From Gallery
                        </IonLabel>
                        <IonIcon slot="start" icon={imageOutline} />
                    </IonButton>

                    <IonButton
                        expand="block"
                        fill="solid"
                        color="danger"
                        onClick={removePhoto}
                        disabled={!formState.image}
                    >
                        <IonIcon slot="" icon={trashOutline} />
                    </IonButton>
                </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', gap: '8px' }}>
                <IonButton
                    expand="block"
                    fill='outline'
                    color={'secondary'}
                    style={{ flexGrow: 2 }}
                    onClick={() => {
                        setModalPage(prev => prev - 1);
                        dispatch({
                            type: 'UPDATE',
                            field: 'progress',
                            value: 0.5
                        });
                    }}
                >
                    Back
                </IonButton>
                <IonButton
                    style={{ flexGrow: 5 }}
                    expand="block"
                    onClick={async () => {
                        //do nothing
                        //setModalPage(prev => prev + 1);
                        dispatch({
                            type: 'UPDATE',
                            field: 'progress',
                            value: 1
                        });
                        await addItem()
                    }}
                >
                    Next
                </IonButton>
            </div>
        </motion.div>
    );
};

export default Page2_AddItemModal;
