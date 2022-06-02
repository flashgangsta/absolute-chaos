import {DisplayObj} from "./DisplayObj.js";
import {Message} from "./Message.js";

export class Messages extends DisplayObj {

    #model;
    #viewPort;
    #grid;
    #margin = 20;
    #messageElsList = [];
    #topHiddenElementIndex;
    #bottomHiddenElementIndex;
    #messageVerticalMargin = 2;

    constructor(model) {
        super();
        this.#model = model;
        window.m = this;
    }

    init(viewPort, grid) {
        console.log("init messages");
        const model = this.#model;
        this.#grid = grid;
        let isFits = true;
        let i = model.from;
        let lastMessageY = 0;
        this.#viewPort = viewPort;

        this.addEventListener("wheel", this.#onScroll.bind(this));

        //fill messages

        let message;

        while(isFits) {
            message = new Message(model.getMessageAt(i), i);
            if(message) {
                message.y = lastMessageY;
                this.#setMessageWidth(message);
                this.append(message);
                this.#messageElsList.push(message);
                if (lastMessageY > viewPort.height) {
                    isFits = false;
                    break;
                }

                lastMessageY += message.height + this.#messageVerticalMargin;
                i++;
            }
        }

        this.#bottomHiddenElementIndex = message.index;
        message.visible = false;

        this.#updateSize();
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
            message.width = gridPointMiddle.x - this.#margin;
        } else if(bounds.y < noGridY) {
            message.width = gridPointBottom.x - this.#margin;
        } else {
            message.width = this.width;
        }
    }


    #addNextMessage() {
        const messageIndex = ++this.#bottomHiddenElementIndex;
        const messageData = this.#model.getMessageAt(messageIndex);
        let message = null;
        if(messageData) {
            message = new Message(messageData, messageIndex);
            message.y = this.height + this.#messageVerticalMargin;
            message.visible = false;
            this.#setMessageWidth(message);
            this.#messageElsList.push(message);
            this.append(message);
            console.log("append new message", this.#bottomHiddenElementIndex);
        } else {
            this.#bottomHiddenElementIndex = null;
            console.log("clear #bottomHiddenElementIndex. All data rendered.")
        }

        this.#updateSize();

        return message;
    }


    #onScroll(event) {
        const deltaY = event.deltaY;
        const viewPort = this.#viewPort;
        let stopScrollY = viewPort.height - this.height;
        let lastMessageBounds = null;
        let targetY = this.y - deltaY;
        let newMessage;

        if(targetY > 0) {
            targetY = 0;
        } else if(targetY < stopScrollY) {
            newMessage = this.#addNextMessage();
            if(newMessage) {
                stopScrollY = viewPort.height - this.height;
            }
            targetY = stopScrollY;
        }
        this.y = targetY;

        //this.y -= deltaY;

        /*for(let i = this.#topHiddenElementIndex + 1 || 0; i < this.#bottomHiddenElementIndex; i++) {
            const message = this.#messageElsList[i];
            console.log(i);
            let messageBoundsRelativeViewPort = message.getBounds(this.parentElement);
            let topHiddenElIndex = this.#topHiddenElementIndex;
            let bottomHiddenElIndex = this.#bottomHiddenElementIndex;

            if(lastMessageBounds) {
                message.y = lastMessageBounds.bottom + this.#messageVerticalMargin;
            }

            this.#setMessageWidth(message);

            //scroll top
            if(deltaY < 0) {
                // show top hidden messages
                if(topHiddenElIndex >= 0 && message.index === topHiddenElIndex && messageBoundsRelativeViewPort.bottom > 0) {
                    let hiddenMessage = message;
                    let hiddenMessageBoundsRelativeViewPort = messageBoundsRelativeViewPort;
                    while(hiddenMessageBoundsRelativeViewPort.bottom > 0 && topHiddenElIndex >= 0) {
                        hiddenMessage.visible = true;
                        topHiddenElIndex = this.#topHiddenElementIndex = hiddenMessage.index - 1;
                        console.log(`Show top: ${hiddenMessage.index}`)

                        if(topHiddenElIndex <= 0) {
                            break;
                        }
                        hiddenMessage = this.#messageElsList[topHiddenElIndex];
                        hiddenMessageBoundsRelativeViewPort = hiddenMessage.getBounds(this.parentElement);
                    }
                }
            } else if(deltaY > 0) {
                // hide top messages
                if (messageBoundsRelativeViewPort.bottom <= 0 && message.visible) {
                    this.#topHiddenElementIndex = message.index;
                    message.visible = false;
                    console.log(`Hide top: ${message.index}`)
                }

                //show bottom hidden message
                let bottomHiddenMessage = this.#messageElsList[this.#bottomHiddenElementIndex];
                if(bottomHiddenMessage && !bottomHiddenMessage.visible) {
                    bottomHiddenMessage.visible = true;

                }
            }

            lastMessageBounds = message.getBounds();

        }
        console.log("===========")*/

        this.#messageElsList.forEach((message) => {
            if(lastMessageBounds) {
                message.y = lastMessageBounds.bottom + this.#messageVerticalMargin;
            }

            this.#setMessageWidth(message);

            let messageBoundsRelativeViewPort = message.getBounds(this.parentElement);
            let topHiddenElIndex = this.#topHiddenElementIndex;
            let bottomHiddenElIndex = this.#bottomHiddenElementIndex;

            if(deltaY < 0) {
                // show top hidden messages
                if(topHiddenElIndex >= 0 && message.index === topHiddenElIndex && messageBoundsRelativeViewPort.bottom > 0) {
                    let hiddenMessage = message;
                    let hiddenMessageBoundsRelativeViewPort = messageBoundsRelativeViewPort;
                    while(hiddenMessageBoundsRelativeViewPort.bottom > 0 && topHiddenElIndex >= 0) {
                        hiddenMessage.visible = true;
                        topHiddenElIndex = this.#topHiddenElementIndex = hiddenMessage.index - 1;
                        //console.log(`Show top: ${hiddenMessage.index}`)

                        if(topHiddenElIndex <= 0) {
                            break;
                        }
                        hiddenMessage = this.#messageElsList[topHiddenElIndex];
                        hiddenMessageBoundsRelativeViewPort = hiddenMessage.getBounds(this.parentElement);
                    }
                }
            } else if(deltaY > 0) {
                // hide top messages
                if(messageBoundsRelativeViewPort.bottom <= 0 && message.visible) {
                    this.#topHiddenElementIndex = message.index;
                    message.visible = false;
                    //console.log(`Hide top: ${message.index}`)
                }

                //show bottom hidden message
                if(bottomHiddenElIndex >= 0 && message.index === bottomHiddenElIndex && messageBoundsRelativeViewPort.y < this.#viewPort.height) {
                    let hiddenMessage = message;
                    let hiddenMessageBoundsRelativeViewPort = messageBoundsRelativeViewPort;
                    let i = message.index;
                    while(hiddenMessageBoundsRelativeViewPort.y < this.#viewPort.height) {
                        hiddenMessage.visible = true;
                        bottomHiddenElIndex = this.#bottomHiddenElementIndex = hiddenMessage.index + 1;
                        console.log(`Show bottom: ${message.index}`);

                        if(bottomHiddenElIndex >= this.#messageElsList.length) {
                            console.log("break", bottomHiddenElIndex);
                            break;
                        }

                        hiddenMessage = this.#messageElsList[bottomHiddenElIndex];
                        hiddenMessageBoundsRelativeViewPort = hiddenMessage.getBounds(this.parentElement);
                    }
                }
            }

            lastMessageBounds = message.getBounds();

        });

        this.#updateSize();
    }

    #updateSize() {
        this.height = this.getBounds().height;
    }
}

window.customElements.define("messages-el", Messages);