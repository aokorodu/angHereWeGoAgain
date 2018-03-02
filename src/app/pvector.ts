export class PVector{

    x: number;
    y: number;

    public static Subtract(v1, v2): PVector {
        let x = v1.x - v2.x;
        let y = v1.y - v2.y;

        return new PVector(x, y);
    }

    public static Add(v1, v2): PVector {
        let x = v1.x + v2.x;
        let y = v1.y + v2.y;

        return new PVector(x, y);
    }

    public static Copy(v): PVector {
        return new PVector(v.x, v.y);
    }

    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    mag() {
        return Math.sqrt(this.x * this.x + this.y * this.y)
    }

    add(v) {
        this.x += v.x;
        this.y += v.y;
    }

    sub(v) {
        this.x -= v.x;
        this.y -= v.y;
    }

    multiply(num) {
        this.x *= num;
        this.y *= num;
    }

    normalize() {
        let num = Math.sqrt(this.x * this.x + this.y * this.y)
        this.x = this.x/num;
        this.y = this.y/num;
    }

    reset() {
        this.x = 0;
        this.y = 0;
    }


}
