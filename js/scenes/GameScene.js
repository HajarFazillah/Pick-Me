import * as Phaser from 'https://cdn.jsdelivr.net/npm/phaser@3/dist/phaser.esm.js';

export default class GameScene extends Phaser.Scene {
  constructor() {
    super('GameScene');
    this.leverState = 0; // Left lever: Tracks what stage of animation we're in (0, 1, 2, 3)
    this.popup = null;  // Stores the currently displayed popup container
    // Right Lever: Arrays to store the 10 random results for multi-pull
    this.gachaResults = []; // Character names
    this.gachaCapsules = []; 
    this.currentCapsuleIndex = 0; //Which capsule currently being showed
  }

  preload() {
    // Lever and capsule assets
    this.load.image('LeftLever', 'assets/LeftLever.png');
    this.load.image('RightLever', 'assets/RightLever.png');
    this.load.image('CapsuleDrop', 'assets/CapsuleDrop.png');
    this.load.image('CapsuleOpen', 'assets/CapsuleOpen.png');
    this.load.image('CapsuleOpen_Yellow', 'assets/CapsuleOpen_Yellow.png');  // Different types/colors
    this.load.image('CapsuleOpen_Blue', 'assets/CapsuleOpen_Blue.png');
    this.load.image('GachaResult', 'assets/GachaResult.png');
    // Character result images - add more as needed
    this.load.image('Char_Cake', 'assets/Char_Cake.png');
    this.load.image('Char_Snow', 'assets/Char_Snow.png');
    this.load.image('Char_Pen', 'assets/Char_Pen.png');
    this.load.image('Char_Happy', 'assets/Char_Happy.png');
    // Other images can be add here too
  }

  create() {
    const centerX = this.cameras.main.centerX;
    this.cameras.main.setBackgroundColor('#ffffff');

    // Top currency bars
    this.add.rectangle(165, 50, 315, 40).setStrokeStyle(2, 0x000000);
    this.add.circle(40, 50, 16, 0xffe68a).setStrokeStyle(2, 0x000000);
    this.add.text(70, 39, '000000000', { fontSize: '21px', color: '#000' });

    this.add.rectangle(590, 50, 315, 40).setStrokeStyle(2, 0x000000);
    this.add.circle(470, 50, 16, 0x66ccff).setStrokeStyle(2, 0x000000);
    this.add.text(500, 39, '000000000', { fontSize: '21px', color: '#000' });

    // Three gacha category buttons
    const categories = [
        { x: centerX - 160, label: '이달의 가챠' },
        { x: centerX, label: '11월 한정' },
        { x: centerX + 160, label: '커밍순' }
    ];

     this.categoryRects = [];
     this.categoryTexts = [];

     categories.forEach((cat, index) => {
      const rect = this.add.rectangle(cat.x, 130, 160, 48, 0xcccccc)
        .setInteractive({ useHandCursor: true });
         const text = this.add.text(cat.x, 130, cat.label, { fontSize: '18px', color: '#444'
     }).setOrigin(0.5);

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
    
    // Large gacha placeholder box (with X)
    this.add.rectangle(centerX, 400, 400, 400).setStrokeStyle(2, 0x000000);
    this.add.line(centerX - 200, 200, 400, 400, 0x000000);
    this.add.line(centerX + 200, 200, -400, 400, 0x000000);

    // ================================== Left Lever (1회 뽑기 / Single Pull) ================================
     const leftLever = this.add.circle(centerX - 120, 680, 63, 0xaaaaaa).setInteractive({ useHandCursor: true });
    this.add.rectangle(centerX - 120, 680, 28, 130, 0x1a1a1a);
    this.add.text(centerX - 120, 760, '1회 뽑기', { fontSize: '20px', color: '#222' }).setOrigin(0.5);
    leftLever.on('pointerdown', () => this.handleLeftLeverClick());

    // ================================== Right Lever (10회 뽑기 / 10X Pull) ==================================
    const rightLever = this.add.circle(centerX + 120, 680, 63, 0xaaaaaa).setInteractive({ useHandCursor: true });
    this.add.rectangle(centerX + 120, 680, 28, 130, 0x1a1a1a);
    this.add.text(centerX + 120, 760, '10회 뽑기', { fontSize: '20px', color: '#222' }).setOrigin(0.5);
    rightLever.on('pointerdown', () => this.handleRightLeverClick());

    // Progress bar (pity gauge)
    this.add.rectangle(centerX, 880, 370, 11, 0xffffff).setStrokeStyle(1, 0x1a1a1a);
    this.add.rectangle(centerX - 130, 880, 100, 11, 0x333333); // progress fill
    this.add.text(centerX, 900, 'A등급 이상 확정까지 NN회', { fontSize: '17px', color: '#222' }).setOrigin(0.5);

    // Skip animation checkbox
    this.add.rectangle(centerX - 65, 950, 24, 24, 0xffffff).setStrokeStyle(1, 0x222222);
    this.add.text(centerX - 40, 950, '연출 건너뛰기', { fontSize: '18px', color: '#222' }).setOrigin(0, 0.5);

    // Bottom nav (triangles, circles/text)
    ['장식장', '가방', '상점'].forEach((label, i) => {
    // Create circle button
    let circleBtn = this.add.circle(centerX - 80 + (i * 80), 1010, 32, 0xf1f1f1)
        .setInteractive({ useHandCursor: true });  // Make circle interactive with cursor change on hover

    // Create text button
    let textBtn = this.add.text(centerX - 80 + (i * 80), 1010, label, { fontSize: '18px', color: '#222' }).setOrigin(0.5)
        .setInteractive({ useHandCursor: true });  // Make text interactive

    // Add input event listeners for both circle and text
    circleBtn.on('pointerdown', () => this.onNavButtonClicked(label));
    textBtn.on('pointerdown', () => this.onNavButtonClicked(label));
    });
    
  }
  // Left Lever Logic - Single Pull
   handleLeftLeverClick() {
    if (this.popup) return; // Prevent interaction while popup is open

    if (this.leverState === 0) {
      this.showPopup("Lever Turn", "레버를 돌리는 중...");
      this.leverState = 1;
    } else if (this.leverState === 1) {
      this.showPopup("Capsule Open", "캡슐이 열리는 중...");
      this.leverState = 2;
    } else if (this.leverState === 2) {
      this.showPopup("Gacha Result", "이름이름이름");
      this.leverState = 3;
    }
  }

  // Left Lever Popup Display
    showPopup(imageName, labelText) {   //left lever
    // Clean previous popup
    if (this.popup) {
      this.popup.destroy();
      this.popup = null;
    }

    const centerX = this.cameras.main.centerX;
    const centerY = 400; 
    this.popup = this.add.container(centerX, centerY);

    if (imageName === "Gacha Result") {
    const bg = this.add.rectangle(0, 0, 320, 320, 0xffcce2)
      .setStrokeStyle(2, 0x000000);
    this.popup.add(bg);
  }

    // Map the state name to the correct image asset
  let key = imageName;
  if (key === "Lever Turn") key = "LeftLever";
  else if (key === "Capsule Open") key = "CapsuleOpen";
  else if (key === "Gacha Result") key = "GachaResult";

  // Add the image to the popup
  const img = this.add.image(0, 0, key);
  img.setDisplaySize(160, 160); 
  this.popup.add(img);

    // FINAL STATE: Show "확인" button to close and reset
    if (imageName === "Gacha Result") {
      const confirmBtn = this.add.rectangle(0, 120, 120, 40, 0xdddddd)
        .setInteractive({ useHandCursor: true });
      const confirmBtnText = this.add.text(0, 120, '확인', { fontSize: '20px', color: '#111' }).setOrigin(0.5);
      this.popup.add(confirmBtn);
      this.popup.add(confirmBtnText);

      confirmBtn.on('pointerdown', () => {
        this.popup.destroy();
        this.popup = null;
        this.leverState = 0; // Reset for next gacha pull
      });
    } else {
      // For intermediate states, click anywhere in popup to advance
      img.setInteractive({ useHandCursor: true });
      img.on('pointerdown', () => {
        this.popup.destroy();
        this.popup = null;
        this.handleLeftLeverClick(); // Advance to next state
      });
    }
  }
   
  //Right Lever Logic (10 Pull)
 handleRightLeverClick() {
    if (this.popup) return;
    // Define available characters and capsule colors
    const characters = ['Char_Cake', 'Char_Snow', 'Char_Pen', 'Char_Happy'];
    const capsuleColors = ['CapsuleOpen_Yellow', 'CapsuleOpen_Blue'];
    //Reset arrays
    this.gachaResults = [];
    this.gachaCapsules = [];
    //Generate 10 random results
    for (let i = 0; i < 10; i++) {
      // Pick a random character
      this.gachaResults.push(
        characters[Math.floor(Math.random() * characters.length)]
      );
      // Pick a random capsule color
      this.gachaCapsules.push(
        capsuleColors[Math.floor(Math.random() * capsuleColors.length)]
      );
    }
    //Start from the first capsule
    this.currentCapsuleIndex = 0;
    this.revealCapsulesOneByOne();
  }
// Reveal capsule one by one
revealCapsulesOneByOne() {
  // Clean up previous popup
    if (this.popup) {
      this.popup.destroy();
      this.popup = null;
    }
    const centerX = this.cameras.main.centerX;
    const centerY = 400;
    this.popup = this.add.container(centerX, centerY);

    // Get current capsule data
    const idx = this.currentCapsuleIndex;
    const capsuleKey = this.gachaCapsules[idx]; //CapsuleOpen_Yellow
    const charKey = this.gachaResults[idx]; // 'Char_cake'

    // Create capsule image starting above the visible area
     const capsuleImg = this.add.image(0, -200, capsuleKey);
     capsuleImg.setDisplaySize(180, 180);  
     this.popup.add(capsuleImg);
    
    // Animate capsule dropping to center
    this.tweens.add({
      targets: capsuleImg,
      y: 0,            // Move to center
      duration: 500,   // 0.5 seconds
      onComplete: () => {
        // After drop animation completes, make capsule clickable
        capsuleImg.setInteractive({useHandCursor: true});

        // When user clicks capsule
        capsuleImg.once('pointerdown', () => {
          capsuleImg.setVisible(false); //Hide capsule

          // Show character result
          const charImg = this.add.image(0, 0, charKey).setScale(1);
          this.popup.add(charImg);
          charImg.setInteractive({useHandCursor: true});

          // When user clicks character 
          charImg.once('pointerdown', () => {
            this.popup.destroy();
            this.popup = null;
            this.currentCapsuleIndex++; // Move to next capsule

            if (this.currentCapsuleIndex < 10) {
              // Still have more capsules to reveal
              this.revealCapsulesOneByOne();
            } else {
              // All 10 capsules revealed -> show final grid
              this.showMultiResultPopup();
            }
          });
        });
      }
    });
  }

  // Show multi-result popup
  showMultiResultPopup() {
    // Clean up previous pupop
    if (this.popup) {
      this.popup.destroy();
      this.popup = null;
    }
    const centerX = this.cameras.main.centerX;
    const centerY = 400;

    this.popup = this.add.container(centerX, centerY);

    // Create pink background
    const bg = this.add.rectangle(0, 0, 340, 370, 0xffcce2)
      .setStrokeStyle(2, 0x000000);
    this.popup.add(bg);

    // Display characters in a grid (4-4-2 layout)
   const rowSizes = [4, 4, 2]; // Items per row
let itemIndex = 0;

for (let row = 0; row < rowSizes.length; row++) {
  const itemsInRow = rowSizes[row];
  const rowWidth = (itemsInRow - 1) * 60; // Total width of items in this row
  const startX = -rowWidth / 2; // Center the row horizontally
  
  for (let col = 0; col < itemsInRow; col++) {
    if (itemIndex >= this.gachaResults.length) break; // Safety check
    
    const x = startX + col * 60;           // Horizontal position (centered per row)
    const y = -80 + row * 90;             // Vertical position (row spacing)
    const char = this.add.image(x, y, this.gachaResults[itemIndex]).setScale(0.5);
    this.popup.add(char);
    
    itemIndex++;
  }
}

    //  Add "확인" button to close the popup
    const confirmBtn = this.add.rectangle(0, 155, 120, 44, 0xdddddd)
    .setInteractive({ useHandCursor: true })
    .setStrokeStyle(2, 0x000000);  // Border for visibility

  const confirmBtnText = this.add.text(0, 155, '확인', { 
    fontSize: '20px', 
    color: '#111' 
  }).setOrigin(0.5);

  this.popup.add(confirmBtn);
  this.popup.add(confirmBtnText);

  // Hover feedback
  confirmBtn.on('pointerover', () => {
    confirmBtn.setFillStyle(0xbbbbbb);
  });

  confirmBtn.on('pointerout', () => {
    confirmBtn.setFillStyle(0xdddddd);
  });

  // Click handler
  confirmBtn.on('pointerdown', () => {
    console.log('Button clicked!');  // Check console
    this.popup.destroy();
    this.popup = null;
  });
}
    
    onNavButtonClicked(label) {
    console.log(label + ' clicked!');
    // TODO: Add logic here to switch UI content or change pages based on label
    // e.g., showing different containers or scenes
    }
}
