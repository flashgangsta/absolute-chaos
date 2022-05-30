import {DisplayObj} from "./DisplayObj.js";
import {Messages} from "./Messages.js";
import {Cards} from "./Cards.js";
import {Rectangle} from "./Rectangle.js";

export class Content extends DisplayObj {

    #elMessages
    #elCards;
    #messagesViewPort;

    constructor(model) {
        super();
        this.#elMessages = new Messages(model);
        this.#elCards = new Cards();
        this.append(this.#elMessages);
        this.append(this.#elCards);
    }

    resize(viewPort) {
        this.width = this.#elMessages.width = viewPort.width;
        this.height = viewPort.height - this.y;
        this.#elCards.x = Math.round(viewPort.width - this.#elCards.width);
        this.#messagesViewPort = new Rectangle(0, 0, this.width, this.height);
    }

    fillMessages() {
        this.#elMessages.fillMessages(this.#messagesViewPort, this.#elCards.getGrid())
    }
}

window.customElements.define("content-el", Content);