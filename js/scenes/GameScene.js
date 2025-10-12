import * as Phaser from 'https://cdn.jsdelivr.net/npm/phaser@3/dist/phaser.esm.js';

export default class GameScene extends Phaser.Scene {
  constructor() {
    super('GameScene');
  }

  preload() {
    // Load assets
    this.load.image('good', 'assets/keyring.png');
  }

  create() {
    this.add.image(400, 300, 'good').setScale(0.5);
  }

  update() {
    // Game loop logic here
  }
}