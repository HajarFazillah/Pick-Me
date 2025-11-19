export default class LargeClickButton {
  constructor(scene, x, y) {
    this.button = scene.add.rectangle(x, y, 350, 90, 0xdddddd)
      .setOrigin(0.5)
      .setStrokeStyle(2, 0x000000);

    this.text = scene.add.text(x, y, 'CLICK', {
      fontSize: '40px',
      color: '#000000',
      fontStyle: 'bold'
    }).setOrigin(0.5);
  }
}
