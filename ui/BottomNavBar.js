export default class BottomNavBar {
  
  constructor(scene, navY=1100) {
    this.scene = scene;
    this.navY = navY;
    this.circleRadius = 55;
    this.circleGap = 30;
    this.labels = ['장식장', '가방', '상점', '도감'];
    this.n = this.labels.length;
    
    this.createBottomNavBar();
  }
  
  createBottomNavBar() {
  const totalWidth = this.n * (this.circleRadius * 2) + (this.n - 1) * this.circleGap;
  const centerXNav = this.scene.cameras.main.centerX;
  
  // starting point is adjusted by adding the radius
  // so the center if the first circle is placed correctly
  const startXNav = centerXNav - totalWidth / 2 + this.circleRadius;
  const navY = this.navY;
  const arrowOffset = 60;
  const arrowSize = 60;

  // Left Arrow
  const leftArrow = this.scene.add.triangle(
    startXNav - this.circleRadius + 2 - arrowOffset, navY,
    arrowSize, 0, 0, arrowSize / 2, arrowSize, arrowSize, 0x222222
  ).setInteractive({ useHandCursor: true });

  this.labels.forEach((label, i) => {
    const x = startXNav + i * (this.circleRadius * 2 + this.circleGap);
    const circleBtn = this.scene.add.circle(x, navY, this.circleRadius, 0xf1f1f1)
      .setInteractive({ useHandCursor: true });
    const textBtn = this.scene.add.text(x, navY, label, {
      fontSize: '26px', color: '#222', fontFamily: 'Arial', fontStyle: 'bold'
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    circleBtn.on('pointerdown', () => this.onNavButtonClicked(label));
    textBtn.on('pointerdown', () => this.onNavButtonClicked(label));
  });

  // Right Arrow
  const rightArrow = this.scene.add.triangle(
    startXNav + (this.n - 1) * (this.circleRadius * 2 + this.circleGap) + this.circleRadius + arrowOffset, navY,
    0, 0, arrowSize, arrowSize / 2, 0, arrowSize, 0x222222
  ).setInteractive({ useHandCursor: true });

  leftArrow.on('pointerdown', () => {
    this.scene.scene.start('PartTimeScene');
  });

  rightArrow.on('pointerdown', () => {
    this.scene.scene.start('GameScene');
  });
}


  onNavButtonClicked(label) {
    console.log(label + ' 버튼이 클릭되었습니다.');
    // Add your navigation logic here
  }

}