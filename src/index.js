import { config } from "./phaserConfig";
import { initialisePlayerStorageKey } from "./PlayerStorageKey";

// await initialisePlayerStorageKey();
initialisePlayerStorageKey()
    .then(() => {
        new Phaser.Game(config);
    })
