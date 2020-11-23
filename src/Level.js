import { Scene } from "phaser";
import { Image } from "phaser";
import { Pillar } from "./Pillar";
import { Bridge } from "./Bridge";
import { Word } from "./Word";

export class Level extends Scene {

    constructor(pillarNumber){
        super();
        this.playerWordSet = [];
        this.numberOfPillars = 2;
        this.selectedWord;
        this.selectedPillar;
        this.pillars = [];
        this.bridgeParts = [];
        this.bridgeWidth = 63;
        this.pillarWidth = 44;
    }

    preload() {
        this.load.image('background', 'assets/background.png');
        this.load.image('cliff', 'assets/cliff.png'); 
        this.load.image('pillar', 'assets/pillar.png');
        this.load.image('bridge', 'assets/bridge.png');
        this.load.image('lemming', 'assets/lemming.png');
    }

    create() {
        this.add.image(0, 0, 'background').setOrigin(0, 0);
        this.add.image(0, 285, 'lemming').setOrigin(0, 0);
        this.createStatics();
        
    }

    createStatics(){
        var grounds = this.physics.add.staticGroup();
        

        grounds.create(0, 300, 'cliff').setOrigin(0, 0);
        grounds.create(700, 300, 'cliff').setOrigin(0, 0);
        this.pillars[0] = new Pillar(this, 100, 300);
        // TODO: Abstand Formel, random Anzahl
        for(var i=1; i<=this.numberOfPillars; i++){
            this.pillars[i] = new Pillar(this, 100+i*(this.bridgeWidth+this.pillarWidth), 300);
        }
        this.pillars.push(new Pillar(this, 700-this.pillarWidth, 300));
        // TODO: Brückenteile automatisch einfügen
        // for(var i=0; i<this.numberOfPillars-1; i++){
        //     bridgeParts[i] = new Bridge(this);
        // }
        this.bridgeParts.push(new Bridge(this,100+this.pillarWidth, 300));
        this.bridgeParts.push(new Bridge(this,100+2*this.pillarWidth+this.bridgeWidth, 300));
        this.bridgeParts.push(new Bridge(this,100+3*this.pillarWidth+2*this.bridgeWidth, 300))
        this.bridgeParts[2].setScale(5, 1);

        var word1 = new Word(this, 0, 0, "Teller");
    }

    changeSelectedWord(word){
        this.selectedWord = word;
        // mark selected word
        // if in pillar -> return word
        // else if selectedPillar = null -> mark free pillars
        // else enterWord...
    }

    changeSelectedPillar(pillar){
        // if in pillar -> 
        // else if selectedWord = null -> select pillar, mark free words
        // else enterWord...
    }

    enterWordIntoPillar(word, pillar){
        // if fits = true -> enter word
        // else no fit message
    }

    wordFitsToPillar(word, pillar){
        // check left and right pillars for words
        // check word dist with left and right words
    }

    checkWin(){
        // for each pillar: if word = null -> false
    }
}