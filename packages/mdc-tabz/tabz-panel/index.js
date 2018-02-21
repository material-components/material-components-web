class MDCTabzPanel {
  static attachTo(root) {
    return new MDCTabzPanel(root);
  }

  constructor(root) {
    this.root_ = root;

    this.adapter_ = {
      getBoundingClientRect: () =>
        this.root_.getBoundingClientRect(),
      setStyleProp: (prop, value) =>
        this.root_.style[prop] = value,
    };

    this.init();
  }

  init() {
    console.log('init');
  }
}

export {
  MDCTabzPanel,
};
