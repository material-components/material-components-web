class MDCTabzScroller {
  static attachTo(root) {
    return new MDCTabzScroller(root);
  }

  constructor(root) {
    this.root_ = root;
  }

  nextPage() {
    console.log('nextPage');
  }

  prevPage() {
    console.log('prevPage');
  }
}

export {
  MDCTabzScroller,
};
