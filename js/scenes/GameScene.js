import * as Phaser from 'https://cdn.jsdelivr.net/npm/phaser@3/dist/phaser.esm.js';
import TopButtonBar from '/ui/TopButtonBar.js';
import BottomNavBar from '/ui/BottomNavBar.js';
import Lever from '/ui/Lever.js';
import CollectionPopup from '/ui/CollectionPopup.js';

export default class GameScene extends Phaser.Scene {
  constructor() {
    super('GameScene');
  }

  preload() {
    // Lever and capsule assets
    this.load.image('LeftLever', 'assets/LeftLever.png');
    this.load.image('RightLever', 'assets/RightLever.png');
    this.load.image('CapsuleDrop', 'assets/CapsuleDrop.png');
    this.load.image('CapsuleOpen', 'assets/CapsuleOpen.png');
    this.load.image('CapsuleOpen_Yellow', 'assets/CapsuleOpen_Yellow.png');
    this.load.image('CapsuleOpen_Blue', 'assets/CapsuleOpen_Blue.png');
    this.load.image('GachaResult', 'assets/GachaResult.png');
    this.load.image('Char_Cake', 'assets/Char_Cake.png');
    this.load.image('Char_Snow', 'assets/Char_Snow.png');
    this.load.image('Char_Pen', 'assets/Char_Pen.png');
    this.load.image('Char_Happy', 'assets/Char_Happy.png');
    // Other images can be add here too
  } 

  create() {
    
    const centerX = this.cameras.main.centerX;
    const startX = centerX - 240;
    const startY = 40;

    // Create UI components
    this.topButtonBar = new TopButtonBar(this, startX, startY);

    // Create the popup manager
    this.collectionPopup = new CollectionPopup(this);
    this.collectionPopup.createPopup();

    // Create the bottom nav bar and pass the callback
    this.bottomNavBar = new BottomNavBar(this, 1100, this.onNavButtonClicked.bind(this));
    console.log('GameScene created, popup ready');

    this.Lever = new Lever(this,120,750);
    this.Lever.createLever();
    
    // CENTER CATEGORY BUTTONS
    const categories = [
      { x: centerX - 200, label: '이달의 가챠' },
      { x: centerX, label: '11월 한정' },
      { x: centerX + 210, label: '커밍순' }
    ];
  
    this.categoryRects = [];
    this.categoryTexts = [];
    
    categories.forEach((cat, index) => {
      const rect = this.add.rectangle(cat.x, 210, 160, 48, 0xcccccc).setInteractive({ useHandCursor: true });
      const text = this.add.text(cat.x, 210, cat.label, { fontSize: '18px', color: '#444' }).setOrigin(0.5);

      this.categoryRects.push(rect);
      this.categoryTexts.push(text);

      rect.on('pointerdown', () => {
        categories.forEach((c, i) => {
          if (i === index) {
            this.categoryRects[i].setFillStyle(0x003366); // dark blue
            this.categoryTexts[i].setColor('#fff');
          } else {
            this.categoryRects[i].setFillStyle(0x999999); // grey
            this.categoryTexts[i].setColor('#444');
          }
        });
      });
    });

    //////////////////////////////////////////////////////////////////

    // Large gacha placeholder box
    this.add.rectangle(centerX, 470, 370, 400).setStrokeStyle(2, 0x000000);

    //////////////////////////////////////////////////////////////////
    // Progress bar (pity gauge)
    this.add.rectangle(centerX, 880, 370, 11, 0xffffff).setStrokeStyle(1, 0x1a1a1a);
    this.add.rectangle(centerX - 130, 880, 100, 11, 0x333333); // progress fill
    this.add.text(centerX, 900, 'A등급 이상 확정까지 NN회', { fontSize: '17px', color: '#222' }).setOrigin(0.5);
 
  }

  onNavButtonClicked(label) {
    console.log('onNavButtonClicked() triggered for:', label);

    if (label === '도감') {
      console.log('Attempting to show popup...');
      if (this.collectionPopup) {
        this.collectionPopup.showPopup();
      } else {
        console.error('Popup object is undefined!');
      }
    } else {
      if (this.collectionPopup) this.collectionPopup.hidePopup();
    }
  }

}