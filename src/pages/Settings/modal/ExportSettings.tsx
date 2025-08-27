// src/components/LanguageSelector.tsx
import { CheckboxCustomEvent, IonButton, IonCheckbox, IonContent, IonHeader, IonModal, IonProgressBar, IonTitle, IonToolbar } from '@ionic/react';
import { TFunction } from 'i18next';
import React, { useEffect, useRef, useState } from 'react';
import { get, subscribe } from '../../../utils/storage';
import "../Settings.css";
import { Directory, Encoding, Filesystem }  from '@capacitor/filesystem';
import { Capacitor } from '@capacitor/core';
// Define Settings interface (adjust based on your actual structure)
interface Settings {
    language: string;
    // Add other settings properties as needed
}

interface ContainerProps {
    translations: TFunction;

}

const ExportSettings: React.FC<ContainerProps> = ({translations}) => {
    const t = translations
    const [travels, setTravels] = useState<Travel[] | undefined>(undefined);
    const modal = useRef<HTMLIonModalElement>(null);

    const [selectedTravels, setSelectedTravels] = useState<string[]>([]);

    useEffect(() => {
        let isMounted = true;

        const setup = async () => {
            try {
                const storedTravels = await get<Travel[]>('travels');
                if (isMounted && storedTravels) {
                    setTravels(storedTravels);
                }
            } catch (error) {
                //console.error('Error fetching settings:', error);
            }
        };

        setup();

        const unsub_travels = subscribe<Travel[]>('travels', (newTravels) => {
            if (isMounted) {
                setTravels(newTravels);
            }
        });

        return () => {
            isMounted = false;
            unsub_travels();
        };
    }, []); // Include i18n in dependencies to handle language changes

    useEffect(() => {console.log(selectedTravels)}, [selectedTravels]);

    const handleAction = async (action: CheckboxCustomEvent<any>) => {
        if (action.detail.checked){
            setSelectedTravels([...selectedTravels, action.detail.value]);
        }
        else{
            setSelectedTravels(selectedTravels.filter(travel => travel !== action.detail.value));
        }
    };


  const downloadFile = (filename: string, content: string) => {
    const blob = new Blob([content], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const saveFileNative = async (filename: string, content: string) => {
    try {
      await Filesystem.writeFile({
        path: filename,
        data: content,
        directory: Directory.Documents,
        encoding: Encoding.UTF8,
      });
      return true;
    } catch (err) {
      console.error('Filesystem write error:', err);
      return false;
    }
  };

  const buildExportPayload = async (selectedIds: string[] | null) => {
    // read full collections (use existing storage keys)
    const [allTravels, allBaggages, allItems] = await Promise.all([
      get<Travel[]>('travels'),
      get<Bag[]>('baggages'),
      get<Item[]>('items'),
    ]);

    const travelsArr = allTravels ?? [];
    const baggagesArr = allBaggages ?? [];
    const itemsArr = allItems ?? [];

    // Determine which travels to export
    const travelsToExport =
      !selectedIds || selectedIds.length === 0
        ? travelsArr
        : travelsArr.filter((t) => selectedIds.includes(t.uuid));

    // collect baggage uuids referenced by those travels
    const baggageUuids = new Set<string>();
    travelsToExport.forEach((t) => {
      (t.bags ?? []).forEach((bId) => baggageUuids.add(bId)); 
    });

    // include baggage objects that match
    const baggagesToExport = baggagesArr.filter((b) => baggageUuids.has(b.uuid));

    // collect item uuids from these baggages
    const itemUuids = new Set<string>();
    baggagesToExport.forEach((b) => {
      (b.items ?? []).forEach((iId) => itemUuids.add(iId));
    });

    // include items that match
    const itemsToExport = itemsArr.filter((it) => itemUuids.has(it.uuid));

    return {
      meta: {
        exportedAt: new Date().toISOString(),
        app: 'baggle',
      },
      travels: travelsToExport,
      baggages: baggagesToExport,
      items: itemsToExport
    };
  };

  const handleExport = async () => {
    try {
      const payload = await buildExportPayload(selectedTravels.length ? selectedTravels : null);
      const content = JSON.stringify(payload, null, 2);
      const filename = `baggle-export-${new Date().toISOString().replace(/[:.]/g, '-')}.json`;

      const isNative = Capacitor.getPlatform() !== 'web';

      if (isNative) {
        const ok = await saveFileNative(filename, content);
        if (!ok) {
          // fallback to web download (if running in a webview that supports blob)
          downloadFile(filename, content);
        }
      } else {
        downloadFile(filename, content);
      }

      // close modal after export
      try {
        modal.current?.dismiss();
      } catch (e) {
        // ignore
      }
    } catch (err) {
      //console.error('Export failed:', err);
    }
  };



    return (
        <>
            <IonButton id="open-settings-picker" expand="block">
                {t('settings.exportTravels') as string} {/* Use correct key and remove .toString() */}
            </IonButton>
            <IonModal
                ref={modal}
                canDismiss={true}
                onWillDismiss={() => { /* Dismiss */ }}
                keepContentsMounted
                initialBreakpoint={1}
                breakpoints={[0,1]}
                animated
                trigger="open-settings-picker"
            >
                <div style={{ display: 'flex', flexDirection: 'column', height: '466px'}}>

                    <IonHeader>
                        <IonToolbar>
                            <IonTitle>{t("settings.selectTravelsToExport") as string}</IonTitle>

                        </IonToolbar>
                        <IonProgressBar value={0.02}></IonProgressBar>
                    </IonHeader>
                    <IonContent className="ion-padding-vertical">
                        <div className='flex-col'>
                            <div className='flex-col travels-list ion-padding-horizontal'>
                                {
                                    travels?.map((travel, index) => (

                                        <IonCheckbox value={travel.uuid} onIonChange={handleAction} onClick={(e) => {e.preventDefault()}} key={index} labelPlacement='start' className='ion-padding-vertical'>{travel.name}</IonCheckbox>

                                    ))
                                }

                            </div>
                            <div className='ion-padding-horizontal ion-padding-top'>

                            <IonButton expand='block' onClick={handleExport}> {t('generic.export') as string} </IonButton>
                            </div>

                        </div>
                    </IonContent>
                </div>
            </IonModal>
        </>
    );
};

export default ExportSettings;