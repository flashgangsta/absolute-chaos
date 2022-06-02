import {DisplayObj} from "./DisplayObj.js";
import {Message} from "./Message.js";

export class Messages extends DisplayObj {

    #model;
    #viewPort;
    #grid;
    #margin = 20;
    #addedMessagesList = [];
    #visibleMessagesList = [];
    #topHiddenElementIndex;
    #bottomHiddenElementIndex;
    #messageVerticalMargin = 2;

    constructor(model) {
        super();
        this.#model = model;
        window.m = this;
    }

    init(viewPort, grid) {
        const model = this.#model;
        this.#grid = grid;
        let isFilled = true;
        let i = 0;
        let lastMessageY = 0;
        this.#viewPort = viewPort;

        this.addEventListener("wheel", this.#onScroll.bind(this));

        //fill messages

        let message;

        while(isFilled) {
            message = new Message(model.getMessageAt(i), i);
            if(message) {
                message.y = lastMessageY;
                this.#setMessageWidth(message);
                this.append(message);
                this.#addedMessagesList.push(message);

                if (lastMessageY > viewPort.height) {
                    isFilled = false;
                    break;
                }

                lastMessageY += message.height + this.#messageVerticalMargin;
                i++;
            }
        }

        this.#visibleMessagesList = this.#addedMessagesList.slice(0, this.#addedMessagesList.length - 1);
        this.#bottomHiddenElementIndex = message.index;
        message.visible = false;

        this.#updateScrollContainerHeight();
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
        if (messageIndex >= this.#model.getMessagesTotal()) {
            this.#bottomHiddenElementIndex = null;
            console.log("clear #bottomHiddenElementIndex. All messages added.")
            return null;
        }

        const messageData = this.#model.getMessageAt(messageIndex);
        let message = new Message(messageData, messageIndex);
        message.y = this.height + this.#messageVerticalMargin;
        message.visible = false;
        this.#setMessageWidth(message);
        this.#addedMessagesList.push(message);
        this.append(message);
        console.log("append new message", this.#bottomHiddenElementIndex);

        this.#updateScrollContainerHeight();

        return message;
    }


    /*#onScroll(event) {
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

        /!*for(let i = this.#topHiddenElementIndex + 1 || 0; i < this.#bottomHiddenElementIndex; i++) {
            const message = this.#addedMessagesList[i];
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
                        hiddenMessage = this.#addedMessagesList[topHiddenElIndex];
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
                let bottomHiddenMessage = this.#addedMessagesList[this.#bottomHiddenElementIndex];
                if(bottomHiddenMessage && !bottomHiddenMessage.visible) {
                    bottomHiddenMessage.visible = true;

                }
            }

            lastMessageBounds = message.getBounds();

        }
        console.log("===========")*!/

        this.#addedMessagesList.forEach((message) => {
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
                        hiddenMessage = this.#addedMessagesList[topHiddenElIndex];
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

                        if(bottomHiddenElIndex >= this.#addedMessagesList.length) {
                            console.log("break", bottomHiddenElIndex);
                            break;
                        }

                        hiddenMessage = this.#addedMessagesList[bottomHiddenElIndex];
                        hiddenMessageBoundsRelativeViewPort = hiddenMessage.getBounds(this.parentElement);
                    }
                }
            }

            lastMessageBounds = message.getBounds();

        });

        this.#updateScrollContainerHeight();
    }*/

    #onScroll(event) {
        const deltaY = event.deltaY;
        const viewPort = this.#viewPort;
        let stopScrollY = viewPort.height - this.height;
        let targetY = this.y - deltaY;

        if(targetY > 0) {
            targetY = 0;
        } else if(targetY < stopScrollY) {
            targetY = stopScrollY;
        }

        this.y = targetY;

        this.#resizeAndAlignVisibleMessages();

        if(deltaY > 0) {
            console.log("SCROLL BOTTOM");
        } else if(deltaY < 0) {
            console.log("SCROLL TOP");
        }

        this.#hideOutsideViewPortMessages();
        this.#showInsideViewPortMessages();
        this.#updateScrollContainerHeight();
    }

    #resizeAndAlignVisibleMessages() {
        const visibleMessagesList = this.#visibleMessagesList;
        visibleMessagesList.forEach((message, i) => {
            let lastResizedMessage = visibleMessagesList[i - 1];
            this.#setMessageWidth(message);
            if(lastResizedMessage) {
                message.y = lastResizedMessage.getBounds(this).bottom + this.#messageVerticalMargin;
            }
        });
    }


    #hideOutsideViewPortMessages() {
        //generate new view port visible elements and hide all outside
        const visibleMessagesList = this.#visibleMessagesList;
        let newVisibleMessagesList = [];
        let firstVisibleTopMessage;

        //find first top message in view port
        for(let i = 0, len = visibleMessagesList.length; i < len; i++) {
            let message = visibleMessagesList[i];
            if(message.getBounds(this.parentElement).bottom > 0) {
                firstVisibleTopMessage = i;
                break;
            }
        }

        //hide top messages outside viewport
        let i = firstVisibleTopMessage - 1;
        while(i >= 0) {
            visibleMessagesList[i].visible = false;
            console.log("Hide message " + i);
            i--;
        }

        //check last message is in view port and hide if not
        let lastMessageIndex = visibleMessagesList.length - 1;
        let lastMessage = visibleMessagesList[lastMessageIndex];
        let lastMessageBounds = lastMessage.getBounds(this.parentElement);

        while(lastMessageBounds.y >= this.#viewPort.height) {
            console.warn("last message outside view port", lastMessageIndex);
            lastMessage.visible = false;
            lastMessageIndex--;
            lastMessage = visibleMessagesList[lastMessageIndex];
            lastMessageBounds = lastMessage.getBounds(this.parentElement);
        }

        //build new visible elements list
        newVisibleMessagesList = visibleMessagesList.slice(firstVisibleTopMessage, lastMessageIndex + 1); //remove top and bottom hidden elements

        this.#visibleMessagesList = newVisibleMessagesList;
    }


    #showInsideViewPortMessages() {
        const visibleMessagesList = this.#visibleMessagesList;
        const addedElsList = this.#addedMessagesList;
        const lastVisibleMessageIndex = visibleMessagesList.length - 1;
        let nextMessageIndex = visibleMessagesList.length;
        let isFilled = false;

        while(!isFilled) {
            if(nextMessageIndex > this.#addedMessagesList.length - 1) {
                const newAddedMessage = new Message(this.#model.getMessageAt(nextMessageIndex), nextMessageIndex);
                newAddedMessage.visible = false;
                newAddedMessage.y = nextMessageBounds.y + this.#messageVerticalMargin;
                this.append(newAddedMessage);
                this.#addedMessagesList.push(newAddedMessage);
            }
            const nextMessage = this.#addedMessagesList[nextMessageIndex];
            const nextMessageBounds = nextMessage.getBounds(this.parentElement);

            if(nextMessageBounds.bottom <= this.#viewPort.height) {
                nextMessageBounds.visible = true;
                visibleMessagesList.push(nextMessage);
                this.#setMessageWidth(nextMessage);
            } else {
                isFilled = true;
                break;
            }

            nextMessageIndex++;
        }
    }


    #updateScrollContainerHeight() {
        this.height = this.getBounds().height;
    }
}

window.customElements.define("messages-el", Messages);