import createFocusTrap from 'focus-trap';

export function createFocusTrapInstance(surfaceEl, focusTrapFactory = createFocusTrap) {
  return focusTrapFactory(surfaceEl, {
    initialFocus: false,
    clickOutsideDeactivates: true,
    escapeDeactivates: false, // Navigation drawer handles ESC.
    returnFocusOnDeactivate: false, // Navigation drawer handles restore focus.
  });
}
