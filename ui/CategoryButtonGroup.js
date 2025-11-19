import CategoryButton from "./CategoryButton.js";

export default class CategoryButtonGroup {
  constructor(scene, centerX, onCategoryClicked) {
    this.scene = scene;
    this.onCategoryClicked = onCategoryClicked;
    this.buttons = [];

    const categories = [
      { x: centerX - 200, label: "이달의 가챠" },
      { x: centerX,       label: "11월 한정" },
      { x: centerX + 210, label: "커밍순" }
    ];

    categories.forEach(data => {
      const btn = new CategoryButton(
        scene,
        data.x,
        210,
        data.label,
        (clickedBtn) => this.handleClick(clickedBtn)
      );
      this.buttons.push(btn);
    });
  }

  handleClick(clickedBtn) {
    this.buttons.forEach(btn => {
      if (btn === clickedBtn) btn.activate();
      else btn.deactivate();
    });

    if (this.onCategoryClicked) {
      this.onCategoryClicked(clickedBtn.label);
    }
  }

  activateDefault() {
    if (this.buttons[0]) this.buttons[0].activate();
  }
}
