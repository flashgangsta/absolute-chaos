import {DisplayObj} from "./DisplayObj.js";

export class Message extends DisplayObj {
    static #PADDING = "10px 15px";

    #index = null;

    constructor(text, index) {
        super();
        this.textContent = `${index}) ${text}`;
        this.style.padding = Message.#PADDING;
        this.#index = index;
        this.setAttribute("index", index);
    }

    get index() {
        return this.#index;
    }
}

window.customElements.define("message-el", Message);