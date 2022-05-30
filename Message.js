import {DisplayObj} from "./DisplayObj.js";

export class Message extends DisplayObj {
    static #PADDING = "10px 15px";

    constructor(text) {
        super();
        this.textContent = text;
        this.style.padding = Message.#PADDING;
    }
}

window.customElements.define("message-el", Message);