// src/components/LanguageSelector.tsx
import { IonActionSheet, IonButton, IonPicker } from '@ionic/react';
import { useTranslation } from 'react-i18next';
import React, { useEffect, useState } from 'react';
import ReactCountryFlag from 'react-country-flag';
import { edit_settings, get, subscribe } from '../../../utils/storage';

import { getAllISOCodes } from 'iso-country-currency';
import { TFunction } from 'i18next';



// Define Settings interface (adjust based on your actual structure)
interface Settings {
  language: string;
  currency: string;
  // Add other settings properties as needed
}

interface ContainerProps {
  translations: TFunction;
  settings?: Settings ;
}


const CurrencySelector: React.FC<ContainerProps> = ({translations, settings}) => {
  const t = translations // Specify namespace

  const [buttonValues, setButtonValues] = useState<{ text: string; value: string }[]>([]);

  useEffect(() => {
    const allCodes = getAllISOCodes();

    setButtonValues(allCodes.map((code) => {
      //console.log(code);

      return {
        text: `${code.countryName} • ${code.symbol}`,
        value: code.symbol,
      };
    })
    )

  }, []);


  const handleAction = async (currency: string) => {
    if (currency) {
      try {
        await edit_settings({ currency });
      } catch (error) {
        //console.error('Error updating currency:', error);
      }
    }
  };

  return (
    <>
      <IonPicker
        trigger="open-picker"
        columns={[
          {
            name: 'currencies',
            selectedIndex: 0,
            options: [
              { text: "defg", value: '' },
            ],
          },
        ]}
        buttons={[
          {
            text: 'Cancel',
            role: 'cancel',
          },
          {
            text: 'Confirm',
            handler: (userInput) => {
              handleAction(userInput.currencies.value);
            },
          },
        ]}
      ></IonPicker>
      <IonButton id='open-picker'>{settings?.currency} • {t("settings.selectCurrency") as string}</IonButton>
    </>
  );
};

export default CurrencySelector;