import BaseItem from './BaseItem.js';
import ExistingItem from './ExistingItem.js';

class StoreItem extends BaseItem {
  constructor(name, amount, note, pictureUrl, price = undefined) {
    super(name, amount, note, pictureUrl);
    this.price = price;
    this.finalizedAmount = 0;
  }

  finalize(count){
    if (count > (this.amount - this.finalizedAmount)) throw new Error(`${this.constructor.name}: amount can not be greater than not-bought item count`);
    
    this.finalizedAmount += count

    return (this.amount - this.finalizedAmount);    
  }

  toExisting() {
    return new ExistingItem(this.name, this.amount, this.note, this.pictureUrl);
  }
}

export default StoreItem;

