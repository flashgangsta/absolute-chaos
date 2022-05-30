import {DisplayObj} from "./DisplayObj.js";

export class Card extends DisplayObj {
    constructor() {
        super();
        this.width = 350;
        this.height = 200;
    }
}

window.customElements.define("card-el", Card);