const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  scene: {
    preload: preload,
    create: create,
    update: update
  }
};

const game = new Phaser.Game(config);

function preload() {
  // Example: load a placeholder image (add one to your assets folder first)
  this.load.image('any', 'assets/any.png');
}

function create() {
  // Example: display the placeholder image in the center
  this.add.image(400, 300, 'any');
}

function update() {
  // Game loop logic goes here (leave empty for now)
}
