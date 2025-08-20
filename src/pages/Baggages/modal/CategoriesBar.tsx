

import { IonButton, IonChip, IonCol, IonIcon, IonInput, IonLabel, IonText } from '@ionic/react';
import { add, close, send } from 'ionicons/icons';
import React from 'react';
import { useTranslation } from 'react-i18next';
import "../BaggageDetails.css";

// interface ContainerProps {

// }
const CategoriesBar: React.FC/*<ContainerProps>*/ = () => {
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
                <IonIcon icon={close ?? add} />
            </IonChip>

            <IonChip className='categories-button categories-add-button' onClick={categoryAdding? undefined: () => setCategoryAdding(true) } style={{ minWidth: categoryAdding ? "160px" : "70px", maxWidth: categoryAdding ? "110px" : "60px" }} >
                <IonIcon icon={categoryAdding ? close : add} onClick={(e) => {e.preventDefault();setCategoryAdding(false)}} />

                {categoryAdding ?
                    <>
                        <IonInput fill='solid' style={{ minHeight: "1px", width: "100%", lineHeight: "14px", fontSize: "12px", border: "none" }} placeholder={t("generic.categoryName") as string} readonly={!categoryAdding} />
                        <IonIcon icon={send} onClick={() => setCategoryAdding(false)}></IonIcon>
                    </> :
                    <IonText style={{ minHeight: "1px", width: "100%", fontSize: "12px", lineHeight: "14px", fontWeight: "600" }} >{t("generic.add") as string}</IonText>

                }
            </IonChip>
        </>
    );

}

export default CategoriesBar;