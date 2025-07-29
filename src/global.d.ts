// /global.d.ts
declare global {



    //#region Item
    interface Item {
        type: "store" | "ready" | "packed", 
        uuid?: string,
        image?: string,
        name: string,
        amount: number,
        price?: number,
        note?: string,

    }
    //#endregion


    //#region Bag
    interface Bag {
        uuid?: string,
        name?: string,
        items: Item[],
    }
    //#endregion
}

export {};
