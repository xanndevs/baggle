// /global.d.ts
declare global {

    //#region Item
    interface Item {
        type: "store" | "ready" | "packed", // If an item is not bought then its a "store" item, if it is bought or user already has it then "ready" or if the user has put the thing inside of the bag then its "packed" 
        uuid?: string, // Automatically generated uuid using uuidv4
        image?: string, // Image url of the item. User can take a photo of the item or select from gallery
        name: string, // Name of the item
        amount: number, // Amount of the item
        price?: number, // Price of the item, if it is a store item then it is the price of the item in the store
        note?: string, // Note of the item, user can add a note to the item
        category?: string, // Category of the item, user can select a category for the item
    }
    //#endregion

    //#region Bag
    interface Bag {
        uuid: string, // Automatically generated uuid using uuidv4
        name: string, // Name of the bag
        items: string[], // uuids of the items inside the bag
        category?: string[], // Categories of the items inside of the bag 
    }
    //#endregion

    //#region Travel
    interface Travel {
        uuid: string,
        name: string,
        date?: string,
        bags?: string[],
    }
    //#endregion

}

export {};
