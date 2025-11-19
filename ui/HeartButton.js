export default class HeartButton {
  constructor(scene, x, y) {
    this.scene = scene;
    this.isLiked = false; // track state

    this.heart = scene.add.text(x, y, '❤', {
      fontSize: '64px',
      color: '#000000'
    })
      .setOrigin(1, 0)
      .setInteractive({ useHandCursor: true });

    // === Click Event ===
    this.heart.on('pointerdown', () => {
      this.toggleHeart();
    });
  }

  toggleHeart() {
    this.isLiked = !this.isLiked;

    // Change color on toggle
    this.heart.setColor(this.isLiked ? '#ff0000' : '#000000');
  }
}
