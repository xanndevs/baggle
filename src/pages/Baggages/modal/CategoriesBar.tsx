

import { IonButton, IonChip, IonCol, IonIcon, IonInput, IonLabel, IonText } from '@ionic/react';
import { add, close, send } from 'ionicons/icons';
import React from 'react';
import { useTranslation } from 'react-i18next';
import "../BaggageDetails.css";

interface ContainerProps {
    travel: string;
}
const CategoriesBar: React.FC<ContainerProps> = ({ travel }) => {
    const { t } = useTranslation();
    const [categoryAdding, setCategoryAdding] = React.useState(false);

    return (
        <>
            <IonChip className='categories-button' style={{ minHeight: "16px", fontSize: "12px" }} >
                <IonLabel>dfgdfg</IonLabel>
                <IonIcon icon={close ?? add} />
            </IonChip>

            <IonChip className='categories-button' style={{ minHeight: "16px", fontSize: "12px" }} >
                <IonLabel>dfgdfg</IonLabel>
                <IonIcon size='small' icon={close ?? add} />
            </IonChip>

            <IonChip className='categories-button categories-add-button' onClick={categoryAdding? undefined: () => setCategoryAdding(true) } style={{ height: "26.4px", minHeight: "16px",  minWidth: categoryAdding ? "160px" : "70px", maxWidth: categoryAdding ? "110px" : "110px" }} >

                <IonIcon style={{minWidth:"18px"}} size='small' icon={categoryAdding ? close : add} onClick={(e) => {e.preventDefault();setCategoryAdding(false)}} />
                {categoryAdding ?
                    <>
                        <IonInput fill='solid' style={{ flexGrow: 1,  fontSize: "12px", border: "none" }} placeholder={t("generic.categoryName") as string} readonly={!categoryAdding} />
                        <IonIcon size='small' icon={send} onClick={(e) => {e.preventDefault();setCategoryAdding(false)}}></IonIcon>
                    </> :
                    <IonLabel style={{ fontWeight: "600" }} >{t("generic.add") as string}</IonLabel>
                    
                }
            </IonChip>
        </>
    );

}

export default CategoriesBar;