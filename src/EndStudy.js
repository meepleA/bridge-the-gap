import { Scene } from "phaser";
import { Button } from "./Button";
import { myGame } from "./globalVariables";

export class EndStudy extends Scene {

    constructor() {
        super({ key: "endStudy" });
        this.finishText;
    }

    preload() {
        this.load.image('background', 'assets/background.png');
        this.load.image('buttonBg', 'assets/buttonBg.png');
        this.load.spritesheet('finishButton', 'assets/finishButton.png', { frameWidth: 425, frameHeight: 178 });
    }

    create() {
        this.add.image(0, 0, 'background').setScale(myGame.bgPicScale[0], myGame.bgPicScale[1]).setOrigin(0, 0);

        let rt = this.add.renderTexture(0, 0, this.cameras.main.width, this.cameras.main.height);
        rt.fill(0xffffff, 0.8);

        let style = { fontSize: 24, fontFamily: "Quicksand, Arial", fill: "#000000", align: "center", wordWrap: { width: 700, useAdvancedWrap: true }, lineSpacing: 20};
        this.finishText = this.add.text(this.cameras.main.centerX, 100, ["Vielen Dank für deine Teilnahme an der Studie. Der spielerische Teil ist beendet und ich bitte dich, als Letztes noch den Fragebogen zu deinen Erfahrungen mit dem Spiel auszufüllen. Bitte gib dort im Feld für deine Spieler-ID folgende Nummer ein: \n", "", localStorage.getItem("playerStorageKey")], style).setOrigin(0.5, 0);
       
        let buttonPic = this.add.image(this.cameras.main.centerX, this.finishText.y + this.finishText.displayHeight + 50, 'buttonBg').setScale(0.8, 0.5).setOrigin(0.5, 0);
        this.finishButton = new Button(this, buttonPic.x, buttonPic.y +10, "finishButton", () => {

            // this.sys.game.destroy(true);
            window.open("https://docs.google.com/forms/d/e/1FAIpQLSdy4Iav7mGQd0Y9iy5d3gN9jzm9pwcQGjNrKocmVPTdEU1N_Q/viewform?usp=sf_link", "_self");

        }).setOrigin(0.5, 0).setScale(0.6, 0.6);

    }
}