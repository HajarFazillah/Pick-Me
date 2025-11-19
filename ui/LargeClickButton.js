export default class LargeClickButton {
  constructor(scene, x, y) {
    this.scene = scene;

    // Normal & pressed colors
    this.defaultColor = 0xdddddd;
    this.pressedColor = 0xbbbbbb;

    // Button shape
    this.button = scene.add.rectangle(x, y, 350, 90, this.defaultColor)
      .setOrigin(0.5)
      .setStrokeStyle(2, 0x000000)
      .setInteractive({ useHandCursor: true });

    // Button text
    this.text = scene.add.text(x, y, 'CLICK', {
      fontSize: '40px',
      color: '#000000',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    // === Add Pointer Events ===

    // When pressed down
    this.button.on('pointerdown', () => {
      this.button.setFillStyle(this.pressedColor);
    });

    // When released (inside button)
    this.button.on('pointerup', () => {
      this.button.setFillStyle(this.defaultColor);

      // TODO: Insert your click action here
      // Example:
      // console.log("Button clicked!");
    });

    // If pointer leaves the button while still held
    this.button.on('pointerout', () => {
      this.button.setFillStyle(this.defaultColor);
    });
  }
}
