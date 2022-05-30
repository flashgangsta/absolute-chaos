export class Rectangle {

    #x = 0;
    #y = 0;
    #width = 0;
    #height = 0;
    #bottom = 0;
    #right = 0;

    constructor(x=0, y=0, width=0, height=0) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    set x(value) {
        this.#x = value;
        this.#updateRight();
    }

    get x() {
        return this.#x;
    }

    set y(value) {
        this.#y = value;
        this.#updateBottom()
    }

    get y() {
        return this.#y;
    }

    set width(value) {
        this.#width = value;
        this.#updateRight();
    }

    get width() {
        return this.#width;
    }

    set height(value) {
        this.#height = value;
        this.#updateBottom()
    }

    get height() {
        return this.#height;
    }

    get right() {
        return this.#right;
    }

    get bottom() {
        return this.#bottom;
    }

    #updateRight() {
        this.#right = this.#x + this.#width;
    }

    #updateBottom() {
        this.#bottom = this.#y + this.#height;
    }

    clone() {
        return new Rectangle(this.x, this.y, this.width, this.height);
    }
}