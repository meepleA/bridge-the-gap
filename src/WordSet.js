

export class WordSet {
    constructor(scenep){
        this.mySet = [];
        this.scene = scenep
    }

    addWord(word){
        this.mySet.push(word);
    }

    setWordPositions(initialX, initialY, isOriginal, offsetRight){
        let x = initialX;
        let y = initialY;
        for (let i = 0; i < this.mySet.length; i++) {
            if(isOriginal){
            this.mySet[i].setOriginals(x, y);
            }
            this.mySet[i].setPosition(x, y);
            x += this.mySet[i].displayWidth + 50;
            if (i + 1 < this.mySet.length && this.mySet[i + 1].displayWidth >= this.scene.cameras.main.centerX * 2 - x - offsetRight) {
                y += 50;
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