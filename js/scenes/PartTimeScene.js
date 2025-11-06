import * as Phaser from 'https://cdn.jsdelivr.net/npm/phaser@3/dist/phaser.esm.js';
import TopButtonBar from '/ui/TopButtonBar.js';
import BottomNavBar from '/ui/BottomNavBar.js';

export default class GameScene extends Phaser.Scene {
  constructor() {
    super('PartTimeScene');
  }

  preload() {}

  create() {
    this.cameras.main.setBackgroundColor('#3d3d3d');

    // Store game objects so we can reposition them
    this.title = this.add.text(this.cameras.main.centerX, 100, 'Part-Time Scene', { 
        fontSize: '48px', 
        color: '#ffffff' 
    }).setOrigin(0.5);

    // This scene needs its own BottomNavBar to allow navigation
    this.bottomNavBar = new BottomNavBar(this, 1100);

    this.scale.on('resize', this.resize, this);
  }

    resize(gameSize, baseSize, displaySize, resolution) {
        this.title.setPosition(this.cameras.main.centerX, 100);

        if(this.bottomNavBar) {
            this.bottomNavBar.destroy();
        }
        this.bottomNavBar = new BottomNavBar(this, 1100);
    }
}
