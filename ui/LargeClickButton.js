export default class LargeClickButton {
  constructor(scene, x, y, onClick = null) {
    this.scene = scene;

    // Add the button image
    this.button = scene.add.image(x, y, "LargeClickButton")
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true })
      .setScale(1.45);
    // === Pointer Events ===

    // Pressed down → make slightly smaller & darker
    this.button.on("pointerdown", () => {
      //this.button.setScale(1.40);       // shrink a little
      this.button.setAlpha(0.8);        // dim slightly
    });

    // Released → restore & fire click
    this.button.on("pointerup", () => {
      //this.button.setScale(1);
      this.button.setAlpha(1);
      console.log("LargeClickButton clicked");
      if (onClick) onClick();  // callback
    });

    // Pointer dragged out → cancel press effect
    this.button.on("pointerout", () => {
      //this.button.setScale(1);
      this.button.setAlpha(1);
    });
  }
}
