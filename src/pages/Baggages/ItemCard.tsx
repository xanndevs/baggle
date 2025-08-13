

import { IonBadge, IonCard, IonCheckbox, IonChip, IonIcon, IonImg, IonLabel } from '@ionic/react';
import { imageOutline } from 'ionicons/icons';
import React from 'react';
import { edit_uuid } from '../../utils/storage';
import './ItemCard.css';

const ItemCard: React.FC<{ result: Item }> = ({ result }, props) => {





    const handleChecked = (e: React.MouseEvent<HTMLIonCardElement, MouseEvent>) => {

        if (result.type === "store") return;
        edit_uuid(
            `items.${result.uuid}`,
            {
                ...result,
                type: result.type === "packed" ? "ready" : "packed"
            }
        );



    };

    return (
        <IonCard className='item-card' {...props} button onClick={handleChecked}>

            <div className='item-card-content' >
                <IonBadge className='item-amount'>x{result.amount}</IonBadge>
                {
                    !result.image ?
                        <div className='item-image' style={{ display: 'flex', }}>
                            <IonIcon size='large' icon={imageOutline}></IonIcon>

                        </div> :
                        <IonImg src={result.image ? 'data:image/jpeg;base64,' + result.image : ""} className='item-image' style={{ display: 'flex', }}>
                        </IonImg>
                }



                <div className='item-details'>
                    <div style={{ display: 'flex', gap: "4px", alignItems: 'center' }}>
                        <IonLabel className='item-title'>{result.name || "Unnamed Item"}</IonLabel>
                        {
                            result.price ?
                                <IonChip className='item-price'>{result.price}₺</IonChip> : undefined
                        }
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'row', gap: '4px', alignItems: 'flex-start', height: '100%' }}>
                        <IonLabel style={{ flexGrow: 1 }} color={'primary'} className='item-note'>{result.note || "No note provided. "}</IonLabel>

                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'baseline', justifyContent: 'flex-end', height: '100%', minWidth: 'min-content' }}>
                            <IonCheckbox checked={result.type === "packed"} ></IonCheckbox>
                        </div>

                    </div>
                </div>
            </div>
        </IonCard>
    );

}

export default ItemCard;