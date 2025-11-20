import * as Phaser from 'https://cdn.jsdelivr.net/npm/phaser@3/dist/phaser.esm.js';
import TopButtonBar from '/ui/TopButtonBar.js';
import BottomNavBar from '/ui/BottomNavBar.js';
import Lever from '/ui/Lever.js';
import CollectionPopup from '/ui/CollectionPopup.js';
import CategoryButton from '/ui/CategoryButton.js';
import CategoryButtonGroup from '/ui/CategoryButtonGroup.js';

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
    // Category button assets
    this.load.image("cat1BtnOff", "assets/ButtonCat1_Off.png");
    this.load.image("cat1BtnOn", "assets/ButtonCat1_On.png");
    this.load.image("cat2BtnOff", "assets/ButtonCat2_Off.png");
    this.load.image("cat2BtnOn", "assets/ButtonCat2_On.png");
    this.load.image("cat3BtnOff", "assets/ButtonCat3_Off.png");
    // Other images can be add here too
  }

  create() {
    console.log("Loaded:", this.scene.key);

    const centerX = this.cameras.main.centerX;
    const startX = centerX - 240;
    const startY = 40;

    // Create UI components (in order from  top to bottom of the page)
    this.topButtonBar = new TopButtonBar(this, startX, startY);
    this.collectionPopup = new CollectionPopup(this);
    this.collectionPopup.createPopup();
    this.categoryGroup = new CategoryButtonGroup(this,centerX,(label) => this.onCategoryClicked(label));
    this.categoryGroup.activateDefault();
    this.add.rectangle(centerX, 470, 370, 400).setStrokeStyle(2, 0x000000);
    this.bottomNavBar = new BottomNavBar(this, 1100, this.onNavButtonClicked.bind(this));
    this.Lever = new Lever(this,120,750);
    this.Lever.createLever();
    this.createProgressBar();
    this.Lever.setProgressBarUpdateCallback(this.updateProgressBarUI.bind(this));
    
  }

  createProgressBar() {
   const centerX = this.cameras.main.centerX;
   this.progressBarBg = this.add.rectangle(centerX, 880, 370, 11, 0xffffff).setStrokeStyle(1, 0x1a1a1a);
   this.progressBarFill_maxWidth = 370;
   const fillLeft = centerX - 370/2;  // Fill: x := left edge
   this.progressBarFill = this.add.rectangle(fillLeft, 880, 0, 11, 0x333333).setOrigin(0, 0.5); 
   if (this.progressLabel) this.progressLabel.destroy(); // prevent duplicate
   this.progressLabel = this.add.text(centerX, 900, 'A등급 이상 확정까지 101회', { fontSize: '17px', color: '#222' }).setOrigin(0.5);
 }

  updateProgressBarUI(current, max) {
   const centerX = this.cameras.main.centerX;
   const fillMaxWidth = this.progressBarFill_maxWidth;
   const fillLeft = centerX - 370/2;
   let fillWidth = Math.min(1, current / max) * fillMaxWidth; // Fill progress calculation
   this.progressBarFill.width = fillWidth;
   this.progressBarFill.x = fillLeft; // Always align to left of background

   let remain = max - current + 1;
   if (remain < 1) remain = 1;
   this.progressLabel.setText(`A등급 이상 확정까지 ${remain}회`);
 }

  onCategoryClicked(label) {console.log("Selected:", label);}

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