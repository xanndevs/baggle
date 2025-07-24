
class Place {
    /**
     * @param {string} name 
     * @param {string} date 
     * @param {string} geo 
     */
    constructor(name, date = undefined, geo = undefined){
        this.name = name;
        this.date = date;
        this.geo = geo;
    }

    /** @returns {number | undefined} */ 
    till() {
        if (!this.date) return undefined;
        return (new Date(this.date) - new Date()) / (1000 * 60 * 60 * 24);
    }




}