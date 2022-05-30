import {DisplayObj} from "./DisplayObj.js";
import {Message} from "./Message.js";

export class Messages extends DisplayObj {

    #model;
    #viewPort;
    #grid;
    #margin = 20;
    #messageElsList = [];

    constructor(model) {
        super();
        this.#model = model;
        this.addEventListener("wheel", this.#onScroll.bind(this));
        window.m = this;
    }

    fillMessages(viewPort, grid) {
        const model = this.#model;
        this.#grid = grid;
        let isFits = true;
        let i = model.from;
        let lastMessageY = 0;
        this.#viewPort = viewPort;


        while(isFits) {
            const message = new Message(model.getMessageAt(i));
            if(message) {
                message.y = lastMessageY;
                this.#setMessageWidth(message);
                this.append(message);
                this.#messageElsList.push(message);
                if (lastMessageY > viewPort.height) {
                    isFits = false;
                    break;
                }

                lastMessageY += message.height + 2;
                i++;
            }
        }
    }


    #setMessageWidth(message) {
        const grid = this.#grid;
        const gridPointTop = grid[0];
        const gridPointMiddle = grid[1];
        const gridPointBottom = grid[2];
        const noGridY = grid[3].y;
        const bounds = message.getBounds(this.parentElement);

        if(!bounds) {
            debugger;
        }

        if(bounds.y < gridPointMiddle.y) {
            message.width = gridPointTop.x - this.#margin;
        } else if(bounds.y < gridPointBottom.y) {
            //debugger;
            message.width = gridPointMiddle.x - this.#margin;
        } else if(bounds.y < noGridY) {
            message.width = gridPointBottom.x - this.#margin;
        } else {
            message.width = this.width;
        }
    }

    #onScroll(event) {
        const deltaY = event.deltaY;
        const viewPort = this.#viewPort;
        const stopScrollY = viewPort.height - this.height;
        let lastMessageBounds = null;
        let targetY = this.y - deltaY;

        if(targetY > 0) {
            targetY = 0;
        } else if(targetY < stopScrollY) {
            targetY = stopScrollY;
        }

        this.y = targetY;

        this.#messageElsList.forEach((message) => {
            if(lastMessageBounds) {
                message.y = lastMessageBounds.bottom + 2;
            }

            this.#setMessageWidth(message);

            lastMessageBounds = message.getBounds();

        });
    }
}

window.customElements.define("messages-el", Messages);