//SettingPopup.js
export default class SettingPopup {
  constructor(scene) {
    this.scene = scene;
    this.popup = null;
    // Default: sound/music enabled (status: 0=ON, 1=HALF, 2=OFF)
    this.soundStatus = 0;
    this.musicStatus = 0;
    this.iconKeys = [
      ["sound1", "sound2", "sound3", "sound0"], 
      ["music1", "music2", "music3", "music0"]
    ];
  }

  show() {
    // Destroy old popup
    if (this.popup) this.popup.destroy();

    const centerX = this.scene.cameras.main.centerX;
    const centerY = this.scene.cameras.main.centerY;
    const width = 470, height = 310;

    this.popup = this.scene.add.container(centerX, centerY);

    // Background
    const bg = this.scene.add.rectangle(0, 0, width, height, 0xf7e6af)
      .setOrigin(0.5)
      .setStrokeStyle(2, 0xbdc8cc);
    this.popup.add(bg);

    // Panel Title
    this.popup.add(this.scene.add.text(0, -height/2+32, "설정", {
      fontSize: "28px",
      color: "#222",
      fontFamily: "Arial"
    }).setOrigin(0.5));

    // SOUND Control
    this.popup.add(this.scene.add.text(-120, -40, "효과음", {
      fontSize: "24px",
      color: "#222"
    }).setOrigin(0.5));

    this.soundBtn = this.scene.add.image(-30, -40,
      this.iconKeys[0][this.soundStatus])
      .setOrigin(0.5)
      .setDisplaySize(80, 80)
      .setInteractive({ useHandCursor: true });
    this.popup.add(this.soundBtn);

    // Toggle sound state on click
    this.soundBtn.on("pointerdown", () => {
      this.soundStatus = (this.soundStatus + 1) % 4;
      this.soundBtn.setTexture(this.iconKeys[0][this.soundStatus]);
      // TODO: Optionally call your game sound function here
    });

    // MUSIC Control
    this.popup.add(this.scene.add.text(-120, 48, "배경음", {
      fontSize: "24px",
      color: "#222"
    }).setOrigin(0.5));

    this.musicBtn = this.scene.add.image(-30, 48,
      this.iconKeys[1][this.musicStatus])
      .setOrigin(0.5)
      .setDisplaySize(80, 80)
      .setInteractive({ useHandCursor: true });
    this.popup.add(this.musicBtn);

    // Toggle music state on click
    this.musicBtn.on("pointerdown", () => {
      this.musicStatus = (this.musicStatus + 1) % 4;
      this.musicBtn.setTexture(this.iconKeys[1][this.musicStatus]);
      // TODO: Optionally call your game music function here
    });

    // Instagram Button (plain rectangle, no rounded corners)
const instaBtnBg = this.scene.add.rectangle(120, 0, 200, 100, 0xeeb9fa)
    .setOrigin(0.5);
// No .setRadius() call!

this.popup.add(instaBtnBg);

// Instagram Button Text (centered)
const instaText = this.scene.add.text(120, 0, "★우리팀 인스타★", {
    fontSize: "26px",
    color: "#222",
    fontStyle: "bold",
    fontFamily: "Arial"
}).setOrigin(0.5);
this.popup.add(instaText);

// Optionally make clickable, e.g. open link (Phaser browser only)
instaBtnBg.setInteractive({ useHandCursor: true });
instaBtnBg.on("pointerdown", () => {
    window.open("https://instagram.com", "_blank");
});
instaText.setInteractive({ useHandCursor: true });
instaText.on("pointerdown", () => {
    window.open("https://instagram.com", "_blank");
});

    // Close button
    const xBtn = this.scene.add.image(-width/2 + 32, height/2 - 32, "exit_button")
      .setOrigin(0.5)
      .setDisplaySize(48, 48)
      .setInteractive({ useHandCursor: true });
    xBtn.on("pointerdown", () => {
      this.popup.destroy();
      this.popup = null;
    });
    this.popup.add(xBtn);
  }
}