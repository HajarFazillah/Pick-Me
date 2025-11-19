import * as Phaser from 'https://cdn.jsdelivr.net/npm/phaser@3/dist/phaser.esm.js';

import TopButtonBar from '/ui/TopButtonBar.js';
import BottomNavBar from '/ui/BottomNavBar.js';
import PartTimeFrame from '/ui/PartTimeFrame.js';
import HeartButton from '/ui/HeartButton.js';

import LargeClickButton from '/ui/LargeClickButton.js';

export default class PartTimeScene extends Phaser.Scene {
  constructor() {
    super('PartTimeScene');
  }

  preload() {}

  create() {
    console.log("Loaded:", this.scene.key);

    const cx = this.cameras.main.centerX;
    const cy = this.cameras.main.centerY;

    this.cameras.main.setBackgroundColor('#ffffff');

    // === Top UI Bar ===
    new TopButtonBar(this, cx - 240, 40);

    // === Count Coin ===
    //this.countCoin = new CountCoin(this, cx, 120);
    //this.countCoin.setProgress(0.4);

    // === Three small boxes ===
    let boxStartX = cx - 150;
    for (let i = 0; i < 3; i++) {
      this.add.rectangle(boxStartX + i * 60, 280, 40, 40, 0xcccccc)
        .setStrokeStyle(2, 0x000000)
        .setOrigin(0.5);
    }

    // === Large Image Frame ===
    this.frame = new PartTimeFrame(this, cx, cy - 100, 350, 500);

    // === Heart in top-right of frame ===
    this.heart = new HeartButton(this, cx + 160, cy - 330);

    // === CLICK Button ===
    this.clickButton = new LargeClickButton(this, cx, cy + 300);

    // === Bottom Navigation ===
    this.bottomNav = new BottomNavBar(this);
  }
}
