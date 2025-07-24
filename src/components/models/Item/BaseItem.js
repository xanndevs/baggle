import { v4 as uuid_v4 } from 'uuid';

class BaseItem {
  constructor(name, amount = 1, note = undefined, pictureUrl = undefined) {
    if (!name) throw new Error(`${this.constructor.name}: name is required`);
    if (typeof amount !== 'number') throw new Error(`${this.constructor.name}: amount must be a number`);

    this.id = uuid_v4();
    this.name = name;
    this.amount = amount;
    this.note = note;
    this.pictureUrl = pictureUrl;
  }

  toString() {
    return JSON.stringify(this);
  }
}

export default BaseItem;
