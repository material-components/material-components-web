import createFocusTrap from 'focus-trap';

export function createFocusTrapInstance(surfaceEl, focusTrapFactory = createFocusTrap) {
  return focusTrapFactory(surfaceEl, {
    clickOutsideDeactivates: true,
    escapeDeactivates: false, // Navigation drawer handles ESC
  });
}
