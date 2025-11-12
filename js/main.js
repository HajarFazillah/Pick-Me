import * as Phaser from 'https://cdn.jsdelivr.net/npm/phaser@3/dist/phaser.esm.js';
import StartScene from './scenes/StartScene.js';
import GameScene from './scenes/GameScene.js';
import PartTimeScene from './scenes/PartTimeScene.js';
import CollectionPopup from '../ui/CollectionPopup.js';

const config = {
  type: Phaser.AUTO,
  width: 720,    // example value
  height: 1280,  // matches your coordinate system
  scale: {
    mode: Phaser.Scale.RESIZE,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    parent: 'game-container',                 
  },
  scene: [GameScene, PartTimeScene, CollectionPopup]
};

const game = new Phaser.Game(config);