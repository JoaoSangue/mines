const white = 255;
const black = 0;
const grey = 80;
const yellow = [255, 255, 0];
const lead = [150, 175, 181];
const red = [232, 18, 18];

function Tile (i, j, size) {
    this.xPos = size*i + 50;
    this.yPos = size*j + 50;
    this.size = size;
    this.flagON = false;
    this.digged =  false;
    this.hasBomb = false;
    this.nearbyBombs = 0;
    Tile.prototype.drawTile = function () {
        fill(150,175,181);
        rect(this.xPos, this.yPos, size, size);
    }; this.drawTile();

    Tile.prototype.clicked = function (x, y, button) {
        let boundary = this.size/2;
        let centerX = this.xPos + boundary;
        let centerY = this.yPos + boundary;
        let distanceX = abs(x - centerX);
        let distanceY = abs(y - centerY);

        if ((distanceX < boundary) && (distanceY < boundary)) {
            if (button === LEFT || button === CENTER) {
                this.digTile();
            } else if (button === RIGHT) {
                this.toggleFlag();
            }
            return true;
        }
        return false;
    };

    Tile.prototype.digTile = function () {
        let flag = this.flagON, digged = this.digged, bomb = this.hasBomb;
        if (flag || digged) return;
        if (bomb) this.explode();
        else this.revealTile();
    };

    Tile.prototype.revealTile = function () {
        let line = (this.xPos - 50)/this.size;
        let column = (this.yPos - 50)/this.size;

        fill(white);
        rect(this.xPos, this.yPos, size, size);
        if (this.nearbyBombs > 0) {
            let number = this.nearbyBombs;
            fill(black);
            text(number, this.xPos + this.size/2, this.yPos + this.size/2);
        } else if (this.nearbyBombs === 0){
            let positions = [[line-1, column-1], [line, column-1],
            [line+1, column-1], [line-1, column], [line+1, column],
            [line-1, column+1], [line, column+1], [line+1, column+1]];

            this.nearbyBombs = -1;

            for (let [i, j] of positions) {
                if (i < 0 || j < 0 || i >= tilesPerSide || j >= tilesPerSide) {
                    continue;
                }
                field.tiles[i][j].revealTile();
            }
        }
        if(!this.digged) {
            this.digged = true;
            remainingTiles--;
        }
    };

    Tile.prototype.toggleFlag = function () {
        let flag = this.flagON, digged = this.digged;
        if (digged) return;
        if (flag) {
            fill(lead);
            rect(this.xPos, this.yPos, size, size);
            this.flagON = false;
        } else {
            image(flagPNG, this.xPos, this.yPos, size, size);
            this.flagON = true;
        }
    };

    Tile.prototype.explode = function () {
        fill(red);
        rect(this.xPos, this.yPos, size, size);
        endGame = true;
    };

}

function Field (tilesPerSide, tilesSize, bombs) {
    this.tilesPerSide = tilesPerSide;
    this.tilesSize = tilesSize;
    this.bombs = bombs;
    this.tiles = [];

    Field.prototype.createField = function () {
        for (let i = 0; i < this.tilesPerSide; i++) {
            this.tiles[i] = [];
            for (let j = 0; j < this.tilesPerSide; j++) {
                this.tiles[i][j] = new Tile(i, j, this.tilesSize);
            }
        }
        this.placeBombs();

        for (i = 0; i < this.tilesPerSide; i++) {
            for (j = 0; j < this.tilesPerSide; j++) {
                this.calculateNearby(i,j);
            }
        }
        startTime = new Date();
    };

    Field.prototype.placeBombs = function () {
        for (let z = 0; z < this.bombs; z++) {
            let i = Math.floor(Math.random() * tilesPerSide);
            let j = Math.floor(Math.random() * tilesPerSide);
            (this.tiles[i][j].hasBomb)? z-- : this.tiles[i][j].hasBomb = true;
        }
    };

    Field.prototype.calculateNearby = function (line, column) {
        let positions = [[line-1, column-1], [line, column-1],
        [line+1, column-1], [line-1, column], [line+1, column],
        [line-1, column+1], [line, column+1], [line+1, column+1]];

        for (let [i, j] of positions) {
            if (i < 0 || j < 0 || i >= this.tilesPerSide || j >= this.tilesPerSide) {
                continue;
            }
            if(this.tiles[i][j].hasBomb) this.tiles[line][column].nearbyBombs++;
        }
    };

    Field.prototype.revealAll = function () {
        for (let i = 0; i < this.tilesPerSide; i++) {
            for (let j = 0; j < this.tilesPerSide; j++) {
                if (!this.tiles[i][j].digged) {
                    let x = this.tiles[i][j].xPos;
                    let y = this.tiles[i][j].yPos;
                    if (this.tiles[i][j].hasBomb) {
                        tint(255, 180);
                        image(bombPNG, x, y, this.tilesSize, this.tilesSize);
                    } else if (!this.tiles[i][j].flagON) {
                        if (this.tiles[i][j].nearbyBombs > 0) {
                            let number = this.tiles[i][j].nearbyBombs;
                            fill(black);
                            text(number, x + this.tilesSize/2, y + this.tilesSize/2);
                        }
                    }
                }
            }
        }
    };
}
