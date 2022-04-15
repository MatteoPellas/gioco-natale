export default class Levels {
    level_width; //Altezza e larghezza dell livello (in tiles)
    level_height;
    tile_width; //Dimensione di ogni tile
    tile_height;
    tileMapImage //L'immagine da cui recuperare tutti i tile
    tileMapImgHeight; //Le dimensioni della mappa da cui recupero i tile
    tileMapImageWidth;
    level;
    
    constructor(level_width, level_height, tile_width, tile_height, tileMapsrc, tileMapImgHeight, tileMapImageWidth, level) {
        this.level_width = level_width;
        this.level_height = level_height;
        this.tile_width = tile_width;
        this.tile_height = tile_height;
        this.tileMapImage = new Image(this.width, this.height);
        this.tileMapImage.src = tileMapsrc;
        this.tileMapImgHeight = tileMapImgHeight;
        this.tileMapImageWidth = tileMapImageWidth;
        this.level = level
    }

    draw(canvasContext) {
        //Disegno l'acqua
        for (let i = 0; i < this.level.length; i++) {
            
            //Ottengo le coordinate sulla canvas
            let dx = (i % this.level_width) * 32;
            let dy = Math.floor(i / this.level_width) * 32;
            let tile = this.level[i];
            
            //Ottengo le coordinate sulla tilemap
            let sx = ((tile  % (this.tileMapImageWidth/32))-1) * 32; //Devo fare -1 perchè il primo tile è il n°1
            let sy = Math.floor(tile / (this.tileMapImageWidth/32)) * 32;


            if (this.level[i] != 0) {
                
                canvasContext.drawImage(this.tileMapImage, sx, sy, this.tile_width, this.tile_height, dx, dy, this.tile_width, this.tile_height);
            }
        }
    }
}

