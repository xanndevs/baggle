import { v4 as uuid_v4 } from 'uuid';
import Baggage from './Baggage.js';


class Travel {
    /**
     * @param {string} name 
     * @param {Place} from 
     * @param {Place} to 
     * @param {string} note 
     * @returns A Baggage Object to be added in a Travel Object
     */
    constructor(name, from, to, note = undefined) {
        if (!name) throw new Error(`${this.constructor.name}: name is required`);

        /** @type {string} */
        this.id = uuid_v4();

        /** @type {Baggage[]>} */
        this.baggage = [];

        this.name = name;
        this.from = from;
        this.to = to;
        this.note = note;
    }
    /** @returns A JSON.stringify() version of the Baggage item. */
    toString() {
        return JSON.stringify(this);
    }

    /** @param {BaseItem} item */
    addItem(item) {
        this.inventory.push(item);
    }

    /** @param {string} itemId */
    removeItem(itemId) {
        const index = this.inventory.findIndex(elem => elem.id === itemId);
        if (index !== -1) {
            this.inventory[category].splice(index, 1);
        }

    }

}

export default BaseItem;
