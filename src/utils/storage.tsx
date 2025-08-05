import { Storage } from '@ionic/storage';
import { Drivers } from '@ionic/storage';
import EventEmitter from 'events';

const store = new Storage({
  name: '__baggle_db',
  driverOrder: [Drivers.IndexedDB, Drivers.LocalStorage]
});

const emitter = new EventEmitter();
let storageReady = false;

// Ensure Storage is created only once
async function initStorage() {
  if (!storageReady) {
    await store.create();


    push("baggages", {
      uuid: "uuid-best",
      name: "Valiz",
      items: [
        { type: 'packed', name: "Ekmek", amount: 3 },
        { type: 'ready', name: "Ayakkabı", amount: 3 },
        { type: 'store', name: "Balık", amount: 3, price: 300 }
      ],
    })

    push("baggages", {
      uuid: "uuid-best",
      name: "Valiz",
      items: [
        { type: 'packed', name: "Ekmek", amount: 3 },
        { type: 'ready', name: "Ayakkabı", amount: 3 },
        { type: 'store', name: "Balık", amount: 3, price: 300 }
      ],
    })
    storageReady = true;
  }
}

export async function set(key: string, value: any): Promise<void> {
  await initStorage();
  await store.set(key, value);
  emitter.emit(key, value);

}

export async function get<T = any>(key: string): Promise<T | null> {
  await initStorage();
  return await store.get(key);
}

export async function remove(key: string): Promise<void> {
  await initStorage();
  await store.remove(key);
  emitter.emit(key, null);
}

export async function push(key: string, value: any): Promise<void> {
  await initStorage();
  const existingData = await store.get(key) || [];
  existingData.push(value);
  await store.set(key, existingData);
  emitter.emit(key, existingData);
}

export async function pop_uuid(key: string, value: any): Promise<void> {
  await initStorage();
  const existingData = await store.get(key) || [];

  const index = existingData.findIndex((item: Travel | Bag | Item)  => item.uuid === value);

  if (index !== -1) {
    existingData.splice(index, 1); // removes the first matching uuid
  }
  await store.set(key, existingData);
  emitter.emit(key, existingData);
}

export async function keys(): Promise<string[]> {
  await initStorage();
  return await store.keys();
}

export function subscribe<T>(key: string, callback: (value: T) => void): () => void {
  emitter.on(key, callback);
  return () => emitter.off(key, callback); // unsubscribe
}
