import {DisplayObj} from "./DisplayObj.js";
import {Card} from "./Card.js";
import {Point} from "./Point.js";

export class Cards extends DisplayObj {

    #margin = 20;
    #cardsList = [];

    constructor() {
        super();

        const margin = this.#margin;
        let lastPoint = new Point(0, 0);

        for(let i = 0; i < 6; i++) {
            const card = new Card();

            if(i === 3) {
                lastPoint.x = card.width + margin;
                lastPoint.y = card.height + margin;
            } else if(i === 5) {
                lastPoint.x = (card.width + margin) * 2;
                lastPoint.y = (card.height + margin) * 2;
            } else if(i > 0) {
                lastPoint.x = lastPoint.x + (card.width + margin);
            }

            card.x = lastPoint.x;
            card.y = lastPoint.y;
            this.append(card);
            this.#cardsList.push(card);
        }

    }


    getGrid() {
        const cardsList = this.#cardsList;
        const cardHeight = cardsList[0].height + this.#margin;
        const margin = this.#margin;
        return [
            new Point(this.x, this.y),
            new Point(this.x + cardsList[3].x, cardHeight - margin),
            new Point(this.x + cardsList[5].x, cardHeight * 2 - margin),
            new Point(0, cardHeight * 3 - margin)
        ];
    }
}

window.customElements.define("cards-el", Cards);