

export class WordSet {
    constructor(scenep){
        this.mySet = [];
        this.scene = scenep
        this.bgPics = [];
    }

    addWord(word){
        this.mySet.push(word);
        this.bgPics[this.mySet.indexOf(word)].setScale(word.displayWidth + 10, word.displayHeight + 10);
        this.bgPics[this.mySet.indexOf(word)].setPosition(word.x-5, word.y-5);
    }

    setWordPositions(initialX, initialY, isOriginal, offsetRight){
        let x = initialX;
        let y = initialY;
        for (let i = 0; i < this.mySet.length; i++) {
            if(isOriginal){
            this.mySet[i].setOriginals(x, y);
            }
            this.mySet[i].setPosition(x, y);
            this.bgPics[i].setPosition(x-5, y-5);
            x += this.mySet[i].displayWidth + 25;
            if (i + 1 < this.mySet.length && this.mySet[i + 1].displayWidth >= this.scene.cameras.main.width - x - offsetRight) {
                y += this.mySet[i].displayHeight + 25;
                x = initialX;
            }
        }
    }

    spliceWords(indx, number){
       return this.mySet.splice(indx, number);
    }

    getSet(){
        return this.mySet;
    }
}