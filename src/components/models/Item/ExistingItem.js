import BaseItem from './BaseItem.js';

class ExistingItem extends BaseItem {
  constructor(name, amount, note, pictureUrl) {
    
    super(name, amount, note, pictureUrl);
    this.finalizedAmount = 0;
  }
  finalize(count){
    if (count > (this.amount - this.finalizedAmount)) throw new Error(`${this.constructor.name}: amount can not be greater than not-packed item count`);
    this.finalizedAmount += count
    return (this.amount - this.finalizedAmount);    
    
  }
}


export default ExistingItem;
