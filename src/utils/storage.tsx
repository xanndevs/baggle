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

    // set("baggages", [{
    //   uuid: "uuid-best",
    //   name: "Valiz",
    //   items: [
    //     "bag-uuid", "bag-uuid", "bag-uuid", "bag-uuid"
    //   ],
    // }, {
    //   uuid: "uuid-best",
    //   name: "Valiz",
    //   items: [
    //     "bag-uuid", "bag-uuid", "bag-uuid", "bag-uuid"
    //   ],
    // } ])


    // set("items", [
    //   { uuid: "bag-uuid", type: 'packed', name: "Ekmek", amount: 3 },
    //   { uuid: "bag-uuid", type: 'ready', name: "Ayakkabı", amount: 3 },
    //   { uuid: "bag-uuid", type: 'store', name: "Balık", amount: 3, price: 300 }
    // ])
    storageReady = true;
  }
}

export async function set(key: string, value: GeneralType): Promise<void> {
  await initStorage();
  await store.set(key, value);
  emitter.emit(key, value);

}

export async function get<T = GeneralType>(key: string): Promise<T | null> {
  await initStorage();
  return await store.get(key);
}

export async function push_bag_to_travel(travel_uuid: string, bag_uuid: string): Promise<void> {
  await initStorage();
  const travels: Travel[] = (await store.get("travels")) ?? [];
  const travelIndex = travels.findIndex((t) => t.uuid === travel_uuid);
  if (travelIndex === -1) return;
  // Initialize bags array if missing
  if (!Array.isArray(travels[travelIndex].bags)) {
    travels[travelIndex].bags = [];
  }
  if (!travels[travelIndex].bags.includes(bag_uuid)) {
    travels[travelIndex].bags.push(bag_uuid);
    await store.set("travels", travels);
    emitter.emit("travels", travels);
  }
}

export async function retrive_bag_items(uuid: string): Promise<Item[] | null> {
  await initStorage();

  const baggages: Bag[] = (await store.get("baggages")) ?? [];
  const items: Item[] = (await store.get("items")) ?? [];

  const bag = baggages.find((b) => b.uuid === uuid);
  if (!bag) return null;

  // If bag.items is string[] (UUIDs)
  const filteredItems = items.filter((item) => bag?.items?.includes(item.uuid));

  return filteredItems;
}

export async function retrive_bag(uuid: string): Promise<Bag | null> {
  await initStorage();

  const baggages: Bag[] = (await store.get("baggages")) ?? [];

  const bag = baggages.find((b) => b.uuid === uuid);
  if (!bag) return null;
  return bag;
}

export async function retrive_travel_total_price(uuid: string): Promise<number | 0> {
  await initStorage();

  const travels: Travel[] = (await store.get("travels")) ?? [];
  const travel = travels.find((t) => t.uuid === uuid);
  if (!travel) return 0;

  const baggages: Bag[] = (await store.get("baggages")) ?? [];
  if (!travel.bags || travel.bags.length === 0) return 0;

  const items: Item[] = (await store.get("items")) ?? [];
  if (!items || items.length === 0) return 0;

  const total = travel.bags.reduce((acc, bag_uuid) => {
    const bag = baggages.find((b) => b.uuid === bag_uuid);
    if (!bag) return acc;

    const bagItems = items.filter((item) => bag.items.includes(item.uuid) && item.type === 'store');
    const bagTotal = bagItems.reduce((sum, item) => sum + (item.price || 0) * (item.amount || 0), 0);
    return acc + bagTotal;
  }, 0);

  return total;
}

export async function push_item_to_bag(bag_uuid: string, item_uuid: string): Promise<void> {

  await initStorage();

  const baggages: Bag[] = (await store.get("baggages")) ?? [];

  const bagIndex = baggages.findIndex((b) => b.uuid === bag_uuid);
  if (bagIndex === -1) return;

  // Initialize items array if missing
  if (!Array.isArray(baggages[bagIndex].items)) {
    baggages[bagIndex].items = [];
  }

  if (!baggages[bagIndex].items.includes(item_uuid)) {
    baggages[bagIndex].items.push(item_uuid);
    await store.set("baggages", baggages);
    emitter.emit("baggages", baggages);
  }
}



export async function remove(key: string): Promise<void> {
  await initStorage();
  await store.remove(key);
  emitter.emit(key, null);
}

export async function push(key: string, value: GeneralType): Promise<void> {
  await initStorage();
  const existingData = await store.get(key) || [];
  existingData.push(value);
  await store.set(key, existingData);
  emitter.emit(key, existingData);
}

export async function pop_uuid(key: string, value: string): Promise<void> {
  await initStorage();
  const existingData = await store.get(key) || [];

  const index = existingData.findIndex((item: Travel | Bag | Item) => item.uuid === value);

  if (index !== -1) {
    existingData.splice(index, 1); // removes the first matching uuid
  }
  await store.set(key, existingData);
  emitter.emit(key, existingData);
}

export async function edit_uuid(fullKey: string, updates: Partial<Item> | Partial<Bag> | Partial<Travel>): Promise<void> {
  await initStorage();

  const [storeKey, uuid] = fullKey.split(".");
  if (!storeKey || !uuid) {
    throw new Error("Invalid key format. Use 'key.uuid', e.g., 'baggages.3454'");
  }

  const existingData: (Item | Bag | Travel)[] = await store.get(storeKey) || [];

  const index = existingData.findIndex(entry => entry.uuid === uuid);
  if (index === -1) return;

  // Type-safe merge
  if (storeKey === "items") {
    const original = existingData[index] as Item;
    existingData[index] = { ...original, ...(updates as Partial<Item>) };
  }
  else if (storeKey === "baggages") {
    const original = existingData[index] as Bag;
    existingData[index] = { ...original, ...(updates as Partial<Bag>) };
  }
  else if (storeKey === "travels") {
    const original = existingData[index] as Travel;
    existingData[index] = { ...original, ...(updates as Partial<Travel>) };
  }
  else {
    throw new Error("Unknown storeKey: " + storeKey);
  }

  await store.set(storeKey, existingData);
  emitter.emit(storeKey, existingData);
}

export const edit_settings = async (updates: Partial<Settings>): Promise<void> => {
  await initStorage();

  let existingSettings: Settings = await store.get("settings") || {};
  // Type-safe merge
  existingSettings = { ...existingSettings, ...updates };
  await store.set("settings", existingSettings);

  emitter.emit("settings", existingSettings);
}


export async function keys(): Promise<string[]> {
  await initStorage();
  return await store.keys();
}

export function subscribe<T>(key: string, callback: (value: T) => void): () => void {
  emitter.on(key, callback);
  return () => emitter.off(key, callback); // unsubscribe
}
