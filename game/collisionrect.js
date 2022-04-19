import Rect from "./rect.js"

export default class collisionRect{
    x
    y
    list = []

    constructor(x,y){
        this.x = x
        this.y = y
        this.list.push(new Rect(this.x,this.y, 32,32))
    }
    getX(){
        return this.x
    }
    getY(){
        return this.y
    }
    getList(){
        return this.list
    }
    
    



}