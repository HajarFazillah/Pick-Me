import * as Phaser from 'https://cdn.jsdelivr.net/npm/phaser@3/dist/phaser.esm.js';

export default class GameScene extends Phaser.Scene {
  constructor() {
    super('GameScene');
    this.leverState = 0; // 0: idle, 1: lever turned, 2: capsule opened, 3: result shown
    this.popup = null;
    this.gachaResults = []; // Stores result images for 10x gacha
  }

  preload() {
    // Lever and capsule assets
    this.load.image('LeftLever', 'assets/LeftLever.png');
    this.load.image('RightLever', 'assets/RightLever.png');
    this.load.image('CapsuleDrop', 'assets/CapsuleDrop.png');
    this.load.image('CapsuleOpen_Yellow', 'assets/CapsuleOpen_Yellow.png');  // Different types/colors
    this.load.image('CapsuleOpen_Blue', 'assets/CapsuleOpen_Blue.png');
    this.load.image('GachaResult', 'assets/GachaResult.png');
    this.load.image('Char_Apple', 'assets/Char_Cake.png');
    this.load.image('Char_Heart', 'assets/Char_Snow.png');
    this.load.image('Char_Drop', 'assets/Char_Pen.png');
    this.load.image('Char_Leaf', 'assets/Char_Happy.png');
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

    const text = this.add.text(cat.x, 130, cat.label, { fontSize: '18px', color: '#444' }).setOrigin(0.5);

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

    // Gacha levers (left/right)
    // Left lever (single pull)
     const leftLever = this.add.circle(centerX - 120, 680, 63, 0xaaaaaa).setInteractive({ useHandCursor: true });
    this.add.rectangle(centerX - 120, 680, 28, 130, 0x1a1a1a);
    this.add.text(centerX - 120, 760, '1회 뽑기', { fontSize: '20px', color: '#222' }).setOrigin(0.5);
    leftLever.on('pointerdown', () => this.handleLeftLeverClick());

    // Right lever (10 pull)
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

    handleRightLeverClick() {
    if (this.popup) return;
    this.dropMultipleCapsules(10);
  }

  dropMultipleCapsules(count) {
    this.gachaResults = [];
    let dropIndex = 0;

    const dropNextCapsule = () => {
      if (dropIndex >= count) {
        // All capsules done, show results popup
        this.showMultiResultPopup();
        return;
      }

      // 1. Animate capsule drop
      const centerX = this.cameras.main.centerX;
      const startY = 100;          // Start above
      const endY = 400;            // End in center (gacha box)
      // Pick capsule color randomly
      const capsuleColors = ['CapsuleOpen_Yellow', 'CapsuleOpen_Blue', 'CapsuleOpen_Red'];
      const capsuleKey = capsuleColors[Math.floor(Math.random() * capsuleColors.length)];
      // Pick character randomly
      const characters = ['Char_Apple', 'Char_Heart', 'Char_Drop', 'Char_Leaf']; // Add all character keys here later
      const characterKey = characters[Math.floor(Math.random() * characters.length)];

      const capsule = this.add.image(centerX, startY, 'CapsuleDrop').setScale(0.5);

      // Capsule drop animation
      this.tweens.add({
        targets: capsule,
        y: endY,
        duration: 500,
        onComplete: () => {
          capsule.setVisible(false);
          // Show capsule open color & character result
          const capsuleOpen = this.add.image(centerX, endY, capsuleKey).setScale(0.7);
          const charImg = this.add.image(centerX, endY, characterKey).setScale(1.1);

          this.time.delayedCall(700, () => {
            capsuleOpen.destroy();
            charImg.destroy();
            this.gachaResults.push(characterKey);
            dropIndex++;
            dropNextCapsule();
          });
        }
      });
    };

    dropNextCapsule();
  }

  showMultiResultPopup() {
    // Remove any previous popup
    if (this.popup) {
      this.popup.destroy();
      this.popup = null;
    }
    const centerX = this.cameras.main.centerX;
    const centerY = 400;

    this.popup = this.add.container(centerX, centerY);

    // Pink background
    const bg = this.add.rectangle(0, 0, 340, 370, 0xffcce2).setStrokeStyle(2, 0x000000);
    this.popup.add(bg);

    // Result grid of characters
    const resultsPerRow = 5;
    for(let i=0; i < this.gachaResults.length; i++) {
      const x = -120 + (i % resultsPerRow) * 60;
      const y = -80 + Math.floor(i / resultsPerRow) * 110;
      const char = this.add.image(x, y, this.gachaResults[i]).setScale(0.7);
      this.popup.add(char);
      // Optionally add name label:
      // const txt = this.add.text(x, y+45, '이름이름', {fontSize:'14px',color:'#222'}).setOrigin(0.5);
      // this.popup.add(txt);
    }

    // 확인 button
    const confirmBtn = this.add.rectangle(0, 155, 120, 44, 0xdddddd).setInteractive({ useHandCursor: true });
    const confirmBtnText = this.add.text(0, 156, '확인', { fontSize: '20px', color: '#111' }).setOrigin(0.5);
    this.popup.add(confirmBtn);
    this.popup.add(confirmBtnText);

    confirmBtn.on('pointerdown', () => {
      this.popup.destroy();
      this.popup = null;
    });
  }

  showPopup(imageName, labelText) {
    // Remove any previous popup
    if (this.popup) {
      this.popup.destroy();
      this.popup = null;
    }

    const centerX = this.cameras.main.centerX;
    const centerY = 400; 
    this.popup = this.add.container(centerX, centerY);

    // Popup background
    const bg = this.add.rectangle(0, 0, 320, 320, 0xffcce2).setStrokeStyle(2, 0x000000);
    this.popup.add(bg);

    // Select correct image key
  let key = imageName;
  if (key === "Lever Turn") key = "LeftLever";
  else if (key === "Capsule Open") key = "CapsuleOpen";
  else if (key === "Gacha Result") key = "GachaResult";

  // Add the image
  const img = this.add.image(0, 0, key);
  img.setDisplaySize(160, 160); 
  this.popup.add(img);

    // "확인" button only for result state
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
      bg.setInteractive({ useHandCursor: true });
      bg.on('pointerdown', () => {
        this.popup.destroy();
        this.popup = null;
        this.handleLeftLeverClick(); // Advance to next state
      });
    }
  }
    
    onNavButtonClicked(label) {
    console.log(label + ' clicked!');
    // TODO: Add logic here to switch UI content or change pages based on label
    // e.g., showing different containers or scenes
    }
}