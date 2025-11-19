import * as Phaser from "https://cdn.jsdelivr.net/npm/phaser@3/dist/phaser.esm.js";

export default class PartTimeFrame extends Phaser.GameObjects.Container {
  constructor(scene, x, y, width = 350, height = 520) {
    super(scene, x, y);
    scene.add.existing(this);

    const box = new Phaser.GameObjects.Rectangle(
      scene,
      0, 0,
      width, height,
      0xffffff
    ).setStrokeStyle(2, 0x000000);

    this.add(box);
  }
}
