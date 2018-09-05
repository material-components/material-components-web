const firstToggleButton = document.querySelector('.mdc-icon-button[aria-pressed]');
if (firstToggleButton) {
  mdc.iconButton.MDCIconButtonToggle.attachTo(firstToggleButton);
}
