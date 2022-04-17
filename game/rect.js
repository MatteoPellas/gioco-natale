export default class Rect{

    x;
    y;
    width;
    heigth;

    constructor (x, y, width, height){
        this.x = x
        this.y = y
        this.width = width
        this.heigth = height
    }

    getX(){
        return this.x
    }
    getY(){
        return this.y
    }
}