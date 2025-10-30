import * as Phaser from 'https://cdn.jsdelivr.net/npm/phaser@3/dist/phaser.esm.js';

export default class GameScene extends Phaser.Scene {
  constructor() {
    super('GameScene');
    this.leverState = 0; // 0: idle, 1: lever turned, 2: capsule opened, 3: result shown
    this.popup = null;
  }

  preload() {
  this.load.image('LeftLever', 'assets/LeftLever.png');
  this.load.image('CapsuleOpen', 'assets/CapsuleOpen.png');
  this.load.image('GachaResult', 'assets/GachaResult.png');
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
    this.add.rectangle(centerX - 160, 130, 160, 48, 0xcccccc);
    this.add.text(centerX - 160, 130, '이달의 가챠', { fontSize: '18px', color: '#444' }).setOrigin(0.5);

    this.add.rectangle(centerX, 130, 160, 48, 0xcccccc);
    this.add.text(centerX, 130, '11월 한정', { fontSize: '18px', color: '#444' }).setOrigin(0.5);

    this.add.rectangle(centerX + 160, 130, 160, 48, 0xcccccc);
    this.add.text(centerX + 160, 130, '커밍순', { fontSize: '18px', color: '#444' }).setOrigin(0.5);

    // Large gacha placeholder box (with X)
    this.add.rectangle(centerX, 400, 400, 400).setStrokeStyle(2, 0x000000);
    this.add.line(centerX - 200, 200, 400, 400, 0x000000);
    this.add.line(centerX + 200, 200, -400, 400, 0x000000);

    // Gacha levers (left/right)
     const leftLever = this.add.circle(centerX - 120, 760, 63, 0xaaaaaa).setInteractive({ useHandCursor: true });
    this.add.rectangle(centerX - 120, 760, 28, 130, 0x1a1a1a);
    this.add.text(centerX - 120, 840, '1회 뽑기', { fontSize: '20px', color: '#222' }).setOrigin(0.5);

    this.add.circle(centerX + 120, 760, 63, 0xaaaaaa);
    this.add.rectangle(centerX + 120, 760, 28, 130, 0x1a1a1a);
    this.add.text(centerX + 120, 840, '10회 뽑기', { fontSize: '20px', color: '#222' }).setOrigin(0.5);

    leftLever.on('pointerdown', () => this.handleLeftLeverClick());

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
  
  showPopup(imageName, labelText) {
    // Remove any previous popup
    if (this.popup) {
      this.popup.destroy();
      this.popup = null;
    }

    const centerX = this.cameras.main.centerX;
    const centerY = 400; // Near gacha box center
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
  img.setDisplaySize(160, 160); // Scale as you like
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
