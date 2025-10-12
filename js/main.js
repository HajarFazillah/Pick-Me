import * as Phaser from 'https://cdn.jsdelivr.net/npm/phaser@3/dist/phaser.esm.js';
import StartScene from './scenes/StartScene.js';
import GameScene from './scenes/GameScene.js';


const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  scene: [StartScene, GameScene]
};

const game = new Phaser.Game(config);
