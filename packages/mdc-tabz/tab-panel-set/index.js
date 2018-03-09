import {
  MDCTabzPanel,
} from '../tabz-panel';

class MDCTabzPanelSet {
  static attachTo(root) {
    return new MDCTabzPanelSet(root);
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
    console.log('init MDCTabzPanelSet');

    const panels = [].slice.call(this.root_.querySelectorAll(MDCTabzPanel.strings.TABZ_PANEL_SELECTOR));
    this.panels_ = panels.map((el) => MDCTabzPanel.attachTo(el));
  }
}

export {
  MDCTabzPanelSet,
};
