//NoticePopup.js
export default class NoticePopup {
  constructor(scene) {
    this.scene = scene;
    this.popup = null;
    this.detailPopup = null;
  }

  show(noticeList) {
    // Destroy previous popups
    if (this.popup) this.popup.destroy();
    if (this.detailPopup) this.detailPopup.destroy();

    const centerX = this.scene.cameras.main.centerX;
    const centerY = this.scene.cameras.main.centerY;
    const width = 540, height = 590;
    const itemHeight = 160;

    this.popup = this.scene.add.container(centerX, centerY);

    // Panel background
    const bg = this.scene.add.rectangle(0, 0, width, height, 0xf7e6af)
      .setOrigin(0.5)
      .setStrokeStyle(2, 0xbdc8cc);
    this.popup.add(bg);

    // Notice list boxes (vertical stack)
    noticeList.forEach((notice, idx) => {
      const boxY = -height / 2 + 88 + idx * (itemHeight + 16);

      // Notice box with shadow
      const itemBg = this.scene.add.rectangle(0, boxY, width - 45, itemHeight, 0xffffff)
        .setOrigin(0.5)
        .setStrokeStyle(0, 0xbbbbbb);
      this.popup.add(itemBg);

      // Notice image (placeholder if needed)
      const img = this.scene.add.rectangle(0, boxY - 23, width - 85, 56, 0x888888)
        .setOrigin(0.5);
      this.popup.add(img);
      this.popup.add(this.scene.add.text(0, boxY - 18, "이미지", {
        fontSize: "22px",
        color: "#fff"
      }).setOrigin(0.5));

      // Notice message/preview below
      this.popup.add(this.scene.add.text(0, boxY + 38, notice.title, {
        fontSize: "18px",
        color: "#222"
      }).setOrigin(0.5, 0));

      // Make each notice clickable to open detail
      itemBg.setInteractive({ useHandCursor: true });
      itemBg.on('pointerdown', () => this.showDetail(notice));
      img.setInteractive({ useHandCursor: true });
      img.on('pointerdown', () => this.showDetail(notice));
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

  showDetail(notice) {
    // Destroy any previous detail popup
    if (this.detailPopup) this.detailPopup.destroy();

    const centerX = this.scene.cameras.main.centerX;
    const centerY = this.scene.cameras.main.centerY;
    const width = 540, height = 590;

    this.detailPopup = this.scene.add.container(centerX, centerY);

    // Background
    const bg = this.scene.add.rectangle(0, 0, width, height, 0xf7e6af)
      .setOrigin(0.5)
      .setStrokeStyle(2, 0xbdc8cc);
    this.detailPopup.add(bg);

    // Big notice image (placeholder rectangle)
    const img = this.scene.add.rectangle(0, -120, width - 50, 106, 0x888888)
      .setOrigin(0.5);
    this.detailPopup.add(img);
    this.detailPopup.add(this.scene.add.text(0, -120, "이미지", {
      fontSize: "25px",
      color: "#fff"
    }).setOrigin(0.5));

    // Full notice text area (scroll not included here)
    this.detailPopup.add(this.scene.add.text(-width/2+35, 20, notice.text, {
      fontSize: 18,
      color: "#222",
      wordWrap: { width: width - 70, useAdvancedWrap: true }
    }));

    // Close button
    const xBtn = this.scene.add.image(-width/2 + 32, height/2 - 32, "exit_button")
      .setOrigin(0.5)
      .setDisplaySize(48, 48)
      .setInteractive({ useHandCursor: true });
    xBtn.on("pointerdown", () => {
      this.detailPopup.destroy();
      this.detailPopup = null;
    });
    this.detailPopup.add(xBtn);
  }
}