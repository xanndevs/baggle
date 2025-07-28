// /global.d.ts
declare global {



    //#region Item
    interface Item {
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
        itemsPacked: Item[],
        itemsReady: Item[],
        itemsStore?: Item[],

    }
    //#endregion
}

export {};
