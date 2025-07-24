import { v4 as uuid_v4 } from 'uuid';
import BaseItem from './Item/BaseItem';


class Baggage {
    /**
     * @param {string} name 
     * @param {string} note 
     * @returns A Baggage Object to be added in a Travel Object
     */
    constructor(name, note = undefined) {
        if (!name) throw new Error(`${this.constructor.name}: name is required`);

        /** @type {string} */
        this.id = uuid_v4();
        
        /** @type {Object.<string, BaseItem[]>} */
        this.inventory = {};

        this.name = name;
        this.note = note;


    }
    /** @returns A JSON.stringify() version of the Baggage item. */
    toString() {
        return JSON.stringify(this);
    }
    
    /** 
     * @param {BaseItem} item 
     * @param {string} category
     * */
    addItem(item, category) {
        this.addCategory(category);
        this.inventory[category].push(item);
    }

    /** @param {string} itemId */
    removeItem(itemId) {
        for(const category in this.inventory) {
            const index = this.inventory[category].findIndex(elem => elem.id === itemId);
            if (index !== -1){
                this.inventory[category].splice(index,1);
                break
            }
        }
    }

    /** @param {string} categoryName */
    addCategory(categoryName) {
        if (!this.inventory[categoryName]) {
            this.inventory[categoryName] = [];
        }
    }
}

export default BaseItem;
