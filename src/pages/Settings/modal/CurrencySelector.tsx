// src/components/LanguageSelector.tsx
import { IonActionSheet, IonButton, IonPicker } from '@ionic/react';
import { useTranslation } from 'react-i18next';
import React, { useEffect, useState } from 'react';
import ReactCountryFlag from 'react-country-flag';
import { edit_settings, get, subscribe } from '../../../utils/storage';

import { getAllISOCodes } from 'iso-country-currency';



// Define Settings interface (adjust based on your actual structure)
interface Settings {
  language: string;
  currency: string;
  // Add other settings properties as needed
}

const CurrencySelector: React.FC = () => {
  const { t } = useTranslation(); // Specify namespace
  const [settings, setSettings] = useState<Settings | undefined>(undefined);

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


  useEffect(() => {
    let isMounted = true;

    const setup = async () => {
      try {
        const storedSettings = await get<Settings>('settings');
        if (isMounted && storedSettings) {
          setSettings(storedSettings);

        }
      } catch (error) {
        //console.error('Error fetching settings:', error);
      }
    };

    setup();

    const unsub_settings = subscribe<Settings>('settings', (newSettings) => {
      if (isMounted) {
        setSettings(newSettings);

      }
    });

    return () => {
      isMounted = false;
      unsub_settings();
    };
  }, []); // Include i18n in dependencies to handle language changes

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
      <IonButton id='open-picker'>{settings?.currency} • {t("settings.selectCurrency") as string}</IonButton>
      <IonPicker
        trigger="open-picker"
        columns={[
          {
            name: 'currencies',
            selectedIndex: buttonValues.findIndex((item) => item.value === settings?.currency),
            options: [
              ...buttonValues
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
    </>
  );
};

export default CurrencySelector;