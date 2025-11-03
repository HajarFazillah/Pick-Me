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
    const centerY = this.cameras.main.centerY;
    this.cameras.main.setBackgroundColor('#ffffff');

    // Coin currency bar at Top Left
    this.add.rectangle(190, 50, 315, 40).setStrokeStyle(2, 0x000000); // coin bar
    this.add.circle(90, 50, 16, 0xffe68a).setStrokeStyle(2, 0x000000); // yellow coin
    this.add.text(120, 40, '000000000', { fontSize: '21px', color: '#000' });

    // 4 Mini Buttons at Top Right (퀘스트, 메일, 설정, 공지)
    const barY = 40;
    const barHeight = 20;
    const canvasWidth = this.cameras.main.width;

    // Button data
    const buttonLabels = ['퀘스트', '메일', '설정', '공지'];
    const buttonCount = buttonLabels.length;
    const buttonRadius = 25;
    const buttonGap = 50;
    const buttonsWidth = buttonCount * buttonRadius * 2 + (buttonCount - 1) * buttonGap;
    const rightPadding = 60;

    // Calculate leftmost X so the row ends at "rightPadding"
    let startX = canvasWidth - rightPadding - buttonsWidth + buttonRadius;

    this.topButtons = [];
  
    for (let i = 0; i < buttonCount; i++) {
      // Calculate button position
      const x = startX + i * (buttonRadius * 2 + buttonGap);
      const circle = this.add.circle(x, barY + buttonRadius, buttonRadius, 0xffffff)
      .setStrokeStyle(4, 0x8887f6)
      .setInteractive({ useHandCursor: true });

      const label = this.add.text(x, barY + buttonRadius*2 + 10, buttonLabels[i], {
        fontSize: '22px', color: '#222', fontFamily: 'Arial'
      }).setOrigin(0.5, 0);

    circle.on('pointerover', () => circle.setFillStyle(0xf4f6ff));
    circle.on('pointerout', () => circle.setFillStyle(0xffffff));
    circle.on('pointerdown', () => {
      console.log(buttonLabels[i] + ' clicked!');
      this.showSimplePopup(buttonLabels[i] + ' 팝업입니다');
    });

    this.topButtons.push({ circle, label });
  }

    // CENTER CATEGORY BUTTONS
    const categories = [
        { x: centerX - 200, label: '이달의 가챠' },
        { x: centerX, label: '11월 한정' },
        { x: centerX + 210, label: '커밍순' }
    ];
    this.categoryRects = [];
    this.categoryTexts = [];

    categories.forEach((cat, index) => {
      const rect = this.add.rectangle(cat.x, 150, 160, 48, 0xcccccc).setInteractive({ useHandCursor: true });
      const text = this.add.text(cat.x, 150, cat.label, {fontSize: '18px', color: '#444'}).setOrigin(0.5);

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
    
    // Large gacha placeholder box
    this.add.rectangle(centerX, 400, 400, 400).setStrokeStyle(2, 0x000000);

    // Left Lever (1회 뽑기)
    const leftLever = this.add.circle(centerX - 120, 680, 63, 0xaaaaaa).setInteractive({ useHandCursor: true });
    this.add.rectangle(centerX - 120, 680, 28, 130, 0x1a1a1a);
    this.add.text(centerX - 120, 760, '1회 뽑기', { fontSize: '20px', color: '#222' }).setOrigin(0.5);
    leftLever.on('pointerdown', () => this.handleLeftLeverClick());

    // Right Lever (10회 뽑기)
    const rightLever = this.add.circle(centerX + 120, 680, 63, 0xaaaaaa).setInteractive({ useHandCursor: true });
    this.add.rectangle(centerX + 120, 680, 28, 130, 0x1a1a1a);
    this.add.text(centerX + 120, 760, '10회 뽑기', { fontSize: '20px', color: '#222' }).setOrigin(0.5);
    rightLever.on('pointerdown', () => this.handleRightLeverClick());

    //////////////////////////////////////////////////////////////////
    // Progress bar (pity gauge)
    this.add.rectangle(centerX, 880, 370, 11, 0xffffff).setStrokeStyle(1, 0x1a1a1a);
    this.add.rectangle(centerX - 130, 880, 100, 11, 0x333333); // progress fill
    this.add.text(centerX, 900, 'A등급 이상 확정까지 NN회', { fontSize: '17px', color: '#222' }).setOrigin(0.5);

    // Skip animation checkbox
    this.add.rectangle(centerX - 65, 950, 24, 24, 0xffffff).setStrokeStyle(1, 0x222222);
    this.add.text(centerX - 40, 950, '연출 건너뛰기', { fontSize: '18px', color: '#222' }).setOrigin(0, 0.5);
    
    //////////////////////////////////////////////////////////////////
    // Bottom Navigation Bar
    const circleRadius = 55;
    const circleGap = 30;
    const labels = ['장식장', '가방', '상점', '도감'];
    const n = labels.length;
    
    const totalWidth = n * (circleRadius * 2) + (n - 1) * circleGap;

    const centerXNav = this.cameras.main.centerX;
    const navY = 1100; // lower down whole bottom nav bar (pixels)
    let startXNav = centerXNav - totalWidth / 2 + circleRadius;

    const arrowOffset = 60;
    const arrowSize = 40;

    const leftArrow = this.add.triangle(
      startXNav - circleRadius - arrowOffset, navY,
      arrowSize, 0, 0, arrowSize /2, arrowSize, arrowSize, 0x222222).setInteractive({ useHandCursor: true });

    labels.forEach((label, i) => {
      const x = startXNav + i * (circleRadius * 2 + circleGap);
      const circleBtn = this.add.circle(x, navY, circleRadius, 0xf1f1f1).setInteractive({ useHandCursor: true });
      const textBtn = this.add.text(x, navY, label, {
      fontSize: '26px', color: '#222', fontFamily: 'Arial', fontStyle: 'bold'
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

      circleBtn.on('pointerdown', () => this.onNavButtonClicked(label));
      textBtn.on('pointerdown', () => this.onNavButtonClicked(label));    
    });

    const rightArrow = this.add.triangle(
      startXNav + (n - 1) * (circleRadius * 2 + circleGap) + circleRadius + arrowOffset, navY,
    0, 0, arrowSize, arrowSize / 2, 0, arrowSize, 0x222222).setInteractive({ useHandCursor: true });

    leftArrow.on('pointerdown', () => {
    // Navigate to previous page group (add your logic here)
    });

    rightArrow.on('pointerdown', () => {
    // Navigate to next page group (add your logic here)
    });

  }

  handleLeftLeverClick() {
    if (this.popup) return;

    if (this.leverState === 0) {
      this.showLeftLeverPopup("Lever Turn", "레버를 돌리는 중...");
      this.leverState = 1;
    } else if (this.leverState === 1) {
      this.showLeftLeverPopup("Capsule Open", "캡슐이 열리는 중...");
      this.leverState = 2;
    } else if (this.leverState === 2) {
      this.showLeftLeverPopup("Gacha Result", "이름이름이름");
      this.leverState = 3;
    }
  }

  handleRightLeverClick() {
    if (this.popup) return;
  
    const characters = ['Char_Cake', 'Char_Snow', 'Char_Pen', 'Char_Happy'];
    const capsuleColors = ['CapsuleOpen_Yellow', 'CapsuleOpen_Blue'];
    
    this.gachaResults = [];
    this.gachaCapsules = [];

    //Generate 10 random results > pick random character and capsule color
    for (let i = 0; i < 10; i++) { 
      this.gachaResults.push(
        characters[Math.floor(Math.random() * characters.length)]
      );

      this.gachaCapsules.push(
        capsuleColors[Math.floor(Math.random() * capsuleColors.length)]
      );
    }

    this.currentCapsuleIndex = 0;
    this.revealCapsulesOneByOne();
  }

  revealCapsulesOneByOne() {
    if (this.popup) {
      this.popup.destroy();
      this.popup = null;
    }

    const centerX = this.cameras.main.centerX;
    const centerY = 400;
    this.popup = this.add.container(centerX, centerY);

    // Get current capsule data
    const idx = this.currentCapsuleIndex;
    const capsuleKey = this.gachaCapsules[idx]; 
    const charKey = this.gachaResults[idx]; 

    // Create capsule image starting above the visible area
     const capsuleImg = this.add.image(0, -200, capsuleKey);
     capsuleImg.setDisplaySize(180, 180);  
     this.popup.add(capsuleImg);
    
    // Animate capsule dropping to center
    this.tweens.add({
      targets: capsuleImg,
      y: 0,            // Move to center
      duration: 250,   // 0.5 seconds
      onComplete: () => {
        // After drop animation completes, make capsule clickable
        capsuleImg.setInteractive({useHandCursor: true});

        // When user clicks capsule
        capsuleImg.once('pointerdown', () => {
          capsuleImg.setVisible(false); // Hide capsule

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
              this.showRightLeverPopup();
            }
          });

        });
      }
    });
  } 

  // Left Lever Popup Display
    showLeftLeverPopup(imageName, labelText) {
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
   
  // Right Lever Popup Display
  showRightLeverPopup() {
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
      const rowWidth = (itemsInRow - 1) * 60; 
      const startX = -rowWidth / 2;
  
      for (let col = 0; col < itemsInRow; col++) {
        if (itemIndex >= this.gachaResults.length) break; // Safety check
    
        const x = startX + col * 60;          // Horizontal position (centered per row)
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