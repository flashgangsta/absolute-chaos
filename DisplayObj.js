import {Rectangle} from "./Rectangle.js";

export class DisplayObj extends HTMLElement {
    #x = 0;
    #y = 0;

    constructor() {
        super();
        this.style.position = "absolute";
    }

    set x(value) {
        this.style.left = value + "px";
        this.#x = value;
    }

    get x() {
        return this.#x;
    }

    set y(value) {
        this.style.top = value + "px";
        this.#y = value;
    }

    get y() {
        return this.#y;
    }

    get height() {
        return this.scrollHeight || Math.ceil(parseFloat(this.style.height)) || this.#getSizeByMeasureHack("scrollHeight") || 0;
    }

    set height(value) {
        this.style.height = value + "px";
    }

    get width() {
        return this.scrollWidth || Math.ceil(parseFloat(this.style.width)) || this.#getSizeByMeasureHack("scrollWidth") || 0;
    }

    set width(value) {
        this.style.width = value + "px";
    }

    getBounds(targetCoordinateElement=null) {
        const bounds = new Rectangle(this.x, this.y, this.width, this.height);

        if (!targetCoordinateElement || !targetCoordinateElement.contains(this)) {
            return bounds;
        } else {
            let child = this;
            let parent = child.parentElement;
            let result = bounds.clone();
            let parentBounds;

            while(parent !== targetCoordinateElement) {
                parent = child.parentElement;
                parentBounds = parent.getBounds();
                result.x = bounds.x + parentBounds.x;
                result.y = bounds.y + parentBounds.y;
                child = parent;
                return result;
            }
            return result;
        }
    }


    #getSizeByMeasureHack(sideName) {
        if(this.parentElement) {
            return undefined;
        }
        const oldVisibility = this.style.visibility || "";
        let result;
        this.style.visibility = "hidden";
        document.body.append(this);
        result = this[sideName];
        this.style.visibility = oldVisibility;
        this.parentNode.removeChild(this);
        return result;
    }

    /*append(...nodes) {
        super.append(...nodes);
    }*/

}