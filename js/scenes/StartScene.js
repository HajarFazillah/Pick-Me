import * as Phaser from 'https://cdn.jsdelivr.net/npm/phaser@3/dist/phaser.esm.js';

export default class StartScene extends Phaser.Scene {
  constructor() {
    super('StartScene');
  }

  create() {
    console.log("Loaded:", this.scene.key);

    const centerX = this.cameras.main.centerX;
    const centerY = this.cameras.main.centerY;

    this.add.text(centerX, centerY - 100, 'Gacha Game', {
      fontSize: '48px',
      fill: '#ffffff',
    }).setOrigin(0.5);

    const startText = this.add.text(centerX, centerY, 'Click Here to Start', {
      fontSize: '32px',
      fill: '#00ff00',
      backgroundColor: '#000000',
      padding: { x: 20, y: 10 },
      borderRadius: 10,
    }).setOrigin(0.5).setInteractive();

    startText.on('pointerdown', () => {
      this.scene.start('GameScene');
    });

    startText.on('pointerover', () => startText.setStyle({ fill: '#ff0' }));
    startText.on('pointerout', () => startText.setStyle({ fill: '#00ff00' }));
  }
}