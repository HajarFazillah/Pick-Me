import * as Phaser from 'https://cdn.jsdelivr.net/npm/phaser@3/dist/phaser.esm.js';

export default class CollectionPopup {
  constructor(scene) {
    this.scene = scene;
    this.popupContainer = null;
    this.scrollContainer = null;
    this.scrollY = 0;
    this.selectedTab = 'story'; // Default tab
    this.tabButtons = [];
    this.tabTexts = [];
    this.itemsData = this.generateTestData();
    this.visibleHeight = 550;
    this.itemHeight = 80;
    this.tabHeight = 40;
    this.extraTopSpace = 30;
    this.listWidth = 440;
    this.listBgWidth = 400;
    this.popupWidth = 500;
    this.popupHeight = 700;
  }

  generateTestData() {
    return [
      { name: '토토의 기다림', status: [true, true, true, true], locked: false },
      { name: '토토의 기다림', status: [true, true, true, false], locked: false },
      { name: '토토의 기다림', status: [true, true, true, true], locked: false },
      { name: '이름이름이름이름', status: [true, true, false, false], locked: false },
      { name: '이름이름이름이름', status: [true, false, false, false], locked: false },
      { name: '이름이름이름이름', status: [false, false, false, false], locked: true },
      { name: '이름이름이름이름', status: [false, false, false, false], locked: true },
      { name: '이름이름이름이름', status: [false, false, false, false], locked: true },
      { name: '이름이름이름이름', status: [false, false, false, false], locked: true },
      { name: '이름이름이름이름', status: [false, false, false, false], locked: true },
      { name: '이름이름이름이름', status: [true, true, false, false], locked: false },
      { name: '이름이름이름이름', status: [true, false, false, false], locked: false },
    ];
  }

  createPopup() {
    const scene = this.scene;
    const centerX = scene.cameras.main.centerX;
    const centerY = scene.cameras.main.centerY;

    // Main popup container
    this.popupContainer = scene.add.container(0, 0);
    this.popupContainer.setVisible(false);
    this.popupContainer.setDepth(999);

    // Overlay
    const overlay = scene.add.rectangle(
    scene.cameras.main.centerX,
    scene.cameras.main.centerY,
    scene.cameras.main.width,
    scene.cameras.main.height,
    0x000000, 0.5).setInteractive();


    // Popup box
    const box = scene.add.rectangle(centerX, centerY, this.popupWidth, this.popupHeight, 0xf5f5f5).setStrokeStyle(2, 0x000000);

    // Red X close button (top right)
    const xBtnSize = 48;
    const xBtn = scene.add.text(
      centerX + this.popupWidth / 2 - xBtnSize,     // x position: right edge
      centerY - this.popupHeight / 2 + xBtnSize,    // y position: top edge
      'X',
      {
        fontSize: '28px',
        fontStyle: 'bold',
        color: '#91131a',
        fontFamily: 'Arial'
      }
    ).setOrigin(0.5).setInteractive({ useHandCursor: true });
    xBtn.on('pointerover', () => xBtn.setColor('#fa5555'));
    xBtn.on('pointerout', () => xBtn.setColor('#91131a'));
    xBtn.on('pointerdown', () => this.hidePopup());

    // Tabs settings: align left
    const tabLeft = centerX - (this.popupWidth / 2) + 80; // 80px padding from popup left
    const tabSpacing = 110;
    const tabY = centerY - (this.popupHeight / 2) + this.tabHeight/2 + 25;
    const tabs = [
      { key: 'story', label: '스토리', x: tabLeft },
      { key: 'item', label: '아이템', x: tabLeft + tabSpacing }
    ];

    this.tabButtons = [];
    this.tabTexts = [];
    tabs.forEach(tab => {
      const isSelected = tab.key === this.selectedTab;
      const btn = scene.add.rectangle(tab.x, tabY, 100, this.tabHeight, isSelected ? 0x999999 : 0xcccccc)
        .setInteractive({ useHandCursor: true });
      btn.on('pointerdown', () => {
        this.selectedTab = tab.key;
        this.refreshTabs();
        this.refreshList();
      });
      this.tabButtons.push(btn);

      const txt = scene.add.text(tab.x, tabY, tab.label, {
        fontSize: '18px',
        color: isSelected ? '#fff' : '#000'
      }).setOrigin(0.5);
      this.tabTexts.push(txt);
    });

    // Calculate where to start the mask/list area (just below the tab buttons)
    const maskTopY = tabY + (this.tabHeight/2) + this.extraTopSpace;
    // Draw mask area as frame
    this.listMaskArea = scene.add.rectangle(
      centerX,
      maskTopY + this.visibleHeight / 2, // Mask's center so items align properly below tabs
      this.listWidth,
      this.visibleHeight,
      0xdddddd
    ).setStrokeStyle(1, 0x000);

    // Scrollable item container
    this.scrollContainer = scene.add.container(0, 0);

    // Mask for scroll area (clips content, same box as list frame)
    const maskShape = scene.make.graphics({});
    maskShape.fillStyle(0xffffff);
    maskShape.fillRect(centerX - (this.listWidth / 2), maskTopY, this.listWidth, this.visibleHeight);
    const mask = maskShape.createGeometryMask();
    this.scrollContainer.setMask(mask);

    // Set bounds for scrolling
    this.scrollBounds = {
      min: 0,
      max: Math.max(0, this.itemsData.length * this.itemHeight - this.visibleHeight),
    };
    this.scrollY = 0;

    // Save y position for first item row
    this.itemsStartY = maskTopY + this.itemHeight / 2;

    scene.input.on('wheel', (pointer, gameObjects, deltaX, deltaY) => {
      if (!this.popupContainer.visible) return;
      this.scrollY += deltaY * 0.5;
      this.updateScroll();
    });

    this.popupContainer.add([
      overlay,
      box,
      xBtn,
      ...this.tabButtons,
      ...this.tabTexts,
      this.listMaskArea,
      this.scrollContainer
    ]);
    scene.add.existing(this.popupContainer);
    this.refreshList();
  }

  refreshTabs() {
    for (let i = 0; i < this.tabButtons.length; i++) {
      const isSelected = (i === 1 && this.selectedTab === 'story') ||
                        (i === 0 && this.selectedTab === 'item');
      this.tabButtons[i].fillColor = isSelected ? 0x999999 : 0xcccccc;
      this.tabTexts[i].setColor(isSelected ? '#fff' : '#000');
    }
  }

  refreshList() {
    this.scrollContainer.removeAll(true);

    const scene = this.scene;
    const centerX = scene.cameras.main.centerX;
    const startY = this.itemsStartY;

    if (this.selectedTab === 'item') {
      const centerY = scene.cameras.main.centerY;
      const emptyText = scene.add.text(centerX, centerY, "No stories available", {
        fontSize: '18px',
        color: '#666'
      }).setOrigin(0.5);
      this.scrollContainer.add(emptyText);
      return;
    }

    for (let i = 0; i < this.itemsData.length; i++) {
      const y = startY + i * this.itemHeight;
      const item = this.itemsData[i];

      const bg = scene.add.rectangle(centerX, y, this.listBgWidth, 70, item.locked ? 0x888888 : 0xffffff, item.locked ? 0.5 : 1)
        .setStrokeStyle(1, 0x444);

      const nameText = scene.add.text(centerX - 150, y, item.name, {
        fontSize: '16px',
        color: item.locked ? '#666' : '#000'
      }).setOrigin(0, 0.5);

      // Rectangular icons (future PNGs)
      for (let j = 0; j < 3; j++) {
        const iconX = centerX + 80 + j * 38;
        const iconY = y;
        const width = 28, height = 22;
        const fillColor = item.locked ? 0x444444 : (item.status[j] === true ? 0xc2c2c2 : 0xefefef);
        const strokeColor = item.locked ? 0x222222 : 0x888888;
        const rect = scene.add.rectangle(iconX, iconY, width, height, fillColor).setStrokeStyle(2, strokeColor);
        this.scrollContainer.add(rect);
      }

      this.scrollContainer.add([bg, nameText]);
    }

    this.updateScroll();
  }

  updateScroll() {
    this.scrollY = Phaser.Math.Clamp(this.scrollY, -this.scrollBounds.max, this.scrollBounds.min);
    this.scrollContainer.y = this.scrollY;
  }

  showPopup() {
    if (!this.popupContainer) this.createPopup();
    this.popupContainer.setVisible(true);
    this.popupContainer.setDepth(999);
    this.refreshTabs();
    this.refreshList();
  }

  hidePopup() {
    if (this.popupContainer) this.popupContainer.setVisible(false);
  }
}
