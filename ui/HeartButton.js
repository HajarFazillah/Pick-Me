export default class HeartButton {
  constructor(scene, x, y) {
    this.heart = scene.add.text(x, y, '❤', {
      fontSize: '64px',
      color: '#000000'
    }).setOrigin(1, 0); // top-right anchor
  }
}