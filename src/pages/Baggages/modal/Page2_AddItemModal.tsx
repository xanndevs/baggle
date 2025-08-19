import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { IonButton, IonIcon, IonLabel, IonTextarea } from '@ionic/react';
import { motion } from 'framer-motion';
import { cameraOutline, imageOutline, trashOutline } from 'ionicons/icons';
import React, { useEffect, useRef, useState } from 'react';
import { v4 as uuid_v4 } from 'uuid';
import { edit_uuid, push, push_item_to_bag } from '../../../utils/storage';
import './AddItemModal.css';
import { useTranslation } from 'react-i18next';


interface FormState extends Item {
    progress?: number;
    nameError?: string;
    title?: string;

    isEdit?: boolean
  }

type FormAction = {
    type: "UPDATE";
    field: keyof FormState;
    value: string | number | undefined| boolean;
} | {
    type: "RESET";
}
interface ComponentTypes {
    dispatch: React.Dispatch<FormAction>;
    formState: FormState;
    setModalPage: React.Dispatch<React.SetStateAction<number>>;
    modal: React.RefObject<HTMLIonModalElement>;

    isStreaming: boolean;
    bag_uuid: string;
    startCamera: () => Promise<void>;
    takePhoto: () => void;
    removePhoto: () => void;
}

const Page2_AddItemModal: React.FC<ComponentTypes> = ({ dispatch, formState, modal, setModalPage, isStreaming, bag_uuid, startCamera, takePhoto, removePhoto }) => {
    //const firstInput = useRef<HTMLIonInputElement>(null);
    const { t } = useTranslation(); 

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



    useEffect(() => {
        dispatch({
            type: "UPDATE",
            field: "title",
            value: t("items.moreDetails") as string,
        })

    }, [modal])

    modal.current?.onWillDismiss().then(() => {
        //stopCamera();
    });
    async function addItem() {

        const formValues = { ...formState, uuid: formState.uuid === ""? uuid_v4() : formState.uuid } as FormState;
        delete formValues.title;
        delete formValues.progress;
        delete formValues.nameError;
        if(formValues.isEdit){
            delete formValues.isEdit;

            handleEdit(formValues);
            return
        }
        delete formValues.isEdit;


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

        async function handleEdit(formInput: Item) {


            await edit_uuid(`items.${formInput.uuid}`, formInput)
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
                //history.push(`/travels/${formInput.uuid}`);
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
                    label={t("items.note") as string}
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
                            {t(isStreaming ? "generic.cameraTake" : 'generic.camera') as string}
                        </IonLabel>
                        <IonIcon size="default" slot="start" icon={cameraOutline} />
                    </IonButton>

                    <IonButton
                        fill="outline"
                        color="primary"
                        onClick={pickFromGallery}
                    >
                        <IonLabel slot="end">
                            {t("generic.gallery") as string}
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
                    {t("generic.back") as string}
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
                    {t("generic.next") as string}
                </IonButton>
            </div>
        </motion.div>
    );
};

export default Page2_AddItemModal;
