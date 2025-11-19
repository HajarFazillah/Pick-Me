export default class CategoryButton {
  constructor(scene, x, y, label, onClick) {
    this.scene = scene;
    this.label = label;
    this.onClick = onClick;

    this.rect = scene.add.rectangle(x, y, 160, 48, 0x999999)
      .setInteractive({ useHandCursor: true });

    this.text = scene.add.text(x, y, label, {
      fontSize: "18px",
      color: "#444"
    }).setOrigin(0.5);

    this.rect.on("pointerdown", () => {
      if (this.onClick) this.onClick(this);
    });
  }

  activate() {
    this.rect.setFillStyle(0x003366);
    this.text.setColor("#ffffff");
  }

  deactivate() {
    this.rect.setFillStyle(0x999999);
    this.text.setColor("#444444");
  }
}
