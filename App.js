import {Model} from "./Model.js";
import {Content} from "./Content.js";
import {Rectangle} from "./Rectangle.js";

export class App {
    #elBody;
    #elContent;
    #windowViewPort;

    constructor() {
        const model = new Model();
        this.#elBody = document.querySelector("body");
        this.#elContent = new Content(model);

        this.#elBody.append(this.#elContent);

        this.#elContent.y = 100;

        window.addEventListener("resize", this.#onWindowResize.bind(this));
        this.#onWindowResize();
        this.#elContent.fillMessages();
    }

    #onWindowResize(event=null) {
        this.#windowViewPort = new Rectangle(0, 0, window.innerWidth, window.innerHeight);
        this.#elContent.resize(this.#windowViewPort);
    }
}

new App();