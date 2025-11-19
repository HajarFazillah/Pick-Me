//Lever.js
export default class Lever{
    constructor(scene, x, y) {
    this.scene = scene;
    this.x = x;
    this.y = y;
    this.leverState = 0; // Left lever: Tracks what stage of animation we're in (0, 1, 2, 3)
    this.popup = null;  // Stores the currently displayed popup container
    // Right Lever: Arrays to store the 10 random results for multi-pull
    this.gachaResults = []; // Character names
    this.gachaCapsules = []; 
    this.currentCapsuleIndex = 0; //Which capsule currently being showed
    this.skipAnimation = false; // Track checkbox state
    this.pityCounter = 0; // Counts pulls since last A or higher
    this.maxPity = 100;   // At 101st, guarantee A or higher
    this.onProgressUpdate = null; // Callback for updating progress UI
   }
   setProgressBarUpdateCallback(callback) {
    this.onProgressUpdate = callback;
   }

   updateProgressBar() {
    if (this.onProgressUpdate) {
      this.onProgressUpdate(this.pityCounter, this.maxPity);
    }
   }

   getGachaResult(isPity) {
    if (isPity) return "A";
    const r = Math.random() * 100;
    if (r < 0.8) return "S";
    if (r < 5) return "A";
    if (r < 19) return "B";
    if (r < 50) return "C";
    return "D";
   }

  createLever(){
    const centerX = this.scene.cameras.main.centerX;

    // Left Lever (1회 뽑기)
    const leftLever = this.scene.add.circle(centerX - 120, 750, 63, 0xaaaaaa).setInteractive({ useHandCursor: true });
    this.scene.add.rectangle(centerX - 120, 750, 28, 130, 0x1a1a1a);
    this.scene.add.text(centerX - 120, 840, '1회 뽑기', { fontSize: '20px', color: '#222' }).setOrigin(0.5);
    leftLever.on('pointerdown', () => this.handleLeftLeverClick());

    // Right Lever (10회 뽑기)
    const rightLever = this.scene.add.circle(centerX + 120, 750, 63, 0xaaaaaa).setInteractive({ useHandCursor: true });
    this.scene.add.rectangle(centerX + 120, 750, 28, 130, 0x1a1a1a);
    this.scene.add.text(centerX + 120, 840, '10회 뽑기', { fontSize: '20px', color: '#222' }).setOrigin(0.5);
    rightLever.on('pointerdown', () => this.handleRightLeverClick());

    // Skip animation checkbox
    this.checkboxRect = this.scene.add.rectangle(centerX - 65, 950, 24, 24, 0xffffff)
      .setStrokeStyle(1, 0x222222)
      .setInteractive({ useHandCursor: true });

    // Checkmark (initially hidden)
    this.checkmark = this.scene.add.text(centerX - 65, 950, '✓', {
      fontSize: '20px',
      color: '#000',
      fontStyle: 'bold'
    }).setOrigin(0.5).setVisible(false);

    const checkboxLabel = this.scene.add.text(centerX - 40, 950, '연출 건너뛰기', {
      fontSize: '18px',
      color: '#222'
    }).setOrigin(0, 0.5).setInteractive({ useHandCursor: true });

    // Checkbox click handler
    this.checkboxRect.on('pointerdown', () => this.toggleSkipCheckbox());
    checkboxLabel.on('pointerdown', () => this.toggleSkipCheckbox());
  }
  // Toggle checkbox state
    toggleSkipCheckbox() {
      this.skipAnimation = !this.skipAnimation;
      this.checkmark.setVisible(this.skipAnimation);
    
      // Optional: Visual feedback on checkbox
      if (this.skipAnimation) {
        this.checkboxRect.setFillStyle(0xe0e0e0);
      } else {
        this.checkboxRect.setFillStyle(0xffffff);
      }
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
       let isPity = this.pityCounter >= this.maxPity;
       let grade = this.getGachaResult(isPity);
        if (isPity) {
      this.pityCounter = 0;
        } else {
      this.pityCounter += 1;
      if (this.pityCounter > this.maxPity) this.pityCounter = this.maxPity;
    }
        this.updateProgressBar();
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

      let guaranteeUsed = false;
      let indexOfPity = -1;

    for (let i = 0; i < 10; i++) {
    let isPity = (!guaranteeUsed && (this.pityCounter + i) >= this.maxPity);
    let grade = this.getGachaResult(isPity);

    if (isPity) {
      grade = "A";
      guaranteeUsed = true;
      indexOfPity = i;
    }
    this.gachaResults.push(characters[Math.floor(Math.random() * characters.length)]);
    this.gachaCapsules.push(capsuleColors[Math.floor(Math.random() * capsuleColors.length)]);
  }

   if (indexOfPity >= 0) {
    this.pityCounter = 0;
  } else {
    this.pityCounter += 10;
    if (this.pityCounter > this.maxPity) this.pityCounter = this.maxPity;
  }
  this.updateProgressBar();
  this.currentCapsuleIndex = 0;

      // Show right lever turn animation first
      const centerX = this.scene.cameras.main.centerX;
      const centerY = 600;
      this.popup = this.scene.add.container(centerX, centerY);

      const leverImg = this.scene.add.image(0, 0, 'RightLever');
      leverImg.setDisplaySize(160, 160);
      this.popup.add(leverImg);
      leverImg.setInteractive({ useHandCursor: true });
  
      // When user clicks the lever animation
      leverImg.once('pointerdown', () => {
        this.popup.destroy();
        this.popup = null;

        // Check if skip is enabled
        if (this.skipAnimation) {
          // Skip directly to final grid popup
          this.showRightLeverPopup();
        } else {
          // Show capsules one by one (original behavior)
          this.revealCapsulesOneByOne();
        }
      });
    }

    revealCapsulesOneByOne() {
      if (this.popup) {
        this.popup.destroy();
        this.popup = null;
      }

      const centerX = this.scene.cameras.main.centerX;
      const centerY = 600;
      this.popup = this.scene.add.container(centerX, centerY);

      // Get current capsule data
      const idx = this.currentCapsuleIndex;
      const capsuleKey = this.gachaCapsules[idx]; 
      const charKey = this.gachaResults[idx]; 

      // Create capsule image starting above the visible area
      const capsuleImg = this.scene.add.image(0, -200, capsuleKey);
      capsuleImg.setDisplaySize(180, 180);  
      this.popup.add(capsuleImg);
    
      // Animate capsule dropping to center
      this.scene.tweens.add({
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
          const charImg = this.scene.add.image(0, 0, charKey);
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

      const centerX = this.scene.cameras.main.centerX;
      const centerY = 600; 
      this.popup = this.scene.add.container(centerX, centerY);

      if (imageName === "Gacha Result") {
      const bg = this.scene.add.rectangle(0, 0, 320, 320, 0xffcce2)
        .setStrokeStyle(2, 0x000000);
      this.popup.add(bg);
      }

      // Map the state name to the correct image asset
      let key = imageName;
      if (key === "Lever Turn") key = "LeftLever";
      else if (key === "Capsule Open") key = "CapsuleOpen";
      else if (key === "Gacha Result") key = "GachaResult";

      // Add the image to the popup
      const img = this.scene.add.image(0, 0, key);
      img.setDisplaySize(160, 160); 
      this.popup.add(img);

      // FINAL STATE: Show "확인" button to close and reset
      if (imageName === "Gacha Result") {
        const confirmBtn = this.scene.add.rectangle(0, 120, 120, 40, 0xdddddd)
          .setInteractive({ useHandCursor: true });
        const confirmBtnText = this.scene.add.text(0, 120, '확인', { fontSize: '20px', color: '#111' }).setOrigin(0.5);
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
        const centerX = this.scene.cameras.main.centerX;
        const centerY = 600;

        this.popup = this.scene.add.container(centerX, centerY);

        // Create pink background
        const bg = this.scene.add.rectangle(0, 0, 340, 370, 0xffcce2).setStrokeStyle(2, 0x000000);
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
          const y = -100 + row * 90;             // Vertical position (row spacing)
          const char = this.scene.add.image(x, y, this.gachaResults[itemIndex]);
          char.setDisplaySize(80, 80);
          this.popup.add(char);
    
          itemIndex++;
        }
      }

      //  Add "확인" button to close the popup
      const confirmBtn = this.scene.add.rectangle(0, 155, 120, 44, 0xdddddd)
      .setInteractive({ useHandCursor: true })
      .setStrokeStyle(2, 0x000000);  // Border for visibility

      const confirmBtnText = this.scene.add.text(0, 155, '확인', { 
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
}