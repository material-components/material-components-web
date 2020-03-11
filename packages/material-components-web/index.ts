/**
 * @license
 * Copyright 2016 Google Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

import autoInit from '@material/auto-init/index';
import * as base from '@material/base/index';
import * as checkbox from '@material/checkbox/index';
import * as chips from '@material/chips/index';
import * as circularProgress from '@material/circular-progress/index';
import * as dataTable from '@material/data-table/index';
import * as dialog from '@material/dialog/index';
import * as dom from '@material/dom/index';
import * as drawer from '@material/drawer/index';
import * as floatingLabel from '@material/floating-label/index';
import * as formField from '@material/form-field/index';
import * as iconButton from '@material/icon-button/index';
import * as lineRipple from '@material/line-ripple/index';
import * as linearProgress from '@material/linear-progress/index';
import * as list from '@material/list/index';
import * as menuSurface from '@material/menu-surface/index';
import * as menu from '@material/menu/index';
import * as notchedOutline from '@material/notched-outline/index';
import * as radio from '@material/radio/index';
import * as ripple from '@material/ripple/index';
import * as select from '@material/select/index';
import * as slider from '@material/slider/index';
import * as snackbar from '@material/snackbar/index';
import * as switchControl from '@material/switch/index';
import * as tabBar from '@material/tab-bar/index';
import * as tabIndicator from '@material/tab-indicator/index';
import * as tabScroller from '@material/tab-scroller/index';
import * as tab from '@material/tab/index';
import * as textField from '@material/textfield/index';
import * as topAppBar from '@material/top-app-bar/index';

// Register all components
autoInit.register('MDCCheckbox', checkbox.MDCCheckbox);
autoInit.register('MDCChip', chips.MDCChip);
autoInit.register('MDCChipSet', chips.MDCChipSet);
autoInit.register('MDCCircularProgress', circularProgress.MDCCircularProgress);
autoInit.register('MDCDataTable', dataTable.MDCDataTable);
autoInit.register('MDCDialog', dialog.MDCDialog);
autoInit.register('MDCDrawer', drawer.MDCDrawer);
autoInit.register('MDCFloatingLabel', floatingLabel.MDCFloatingLabel);
autoInit.register('MDCFormField', formField.MDCFormField);
autoInit.register('MDCIconButtonToggle', iconButton.MDCIconButtonToggle);
autoInit.register('MDCLineRipple', lineRipple.MDCLineRipple);
autoInit.register('MDCLinearProgress', linearProgress.MDCLinearProgress);
autoInit.register('MDCList', list.MDCList);
autoInit.register('MDCMenu', menu.MDCMenu);
autoInit.register('MDCMenuSurface', menuSurface.MDCMenuSurface);
autoInit.register('MDCNotchedOutline', notchedOutline.MDCNotchedOutline);
autoInit.register('MDCRadio', radio.MDCRadio);
autoInit.register('MDCRipple', ripple.MDCRipple);
autoInit.register('MDCSelect', select.MDCSelect);
autoInit.register('MDCSlider', slider.MDCSlider);
autoInit.register('MDCSnackbar', snackbar.MDCSnackbar);
autoInit.register('MDCSwitch', switchControl.MDCSwitch);
autoInit.register('MDCTabBar', tabBar.MDCTabBar);
autoInit.register('MDCTextField', textField.MDCTextField);
autoInit.register('MDCTopAppBar', topAppBar.MDCTopAppBar);

// Export all components.
export {
  autoInit,
  base,
  checkbox,
  chips,
  circularProgress,
  dataTable,
  dialog,
  dom,
  drawer,
  floatingLabel,
  formField,
  iconButton,
  lineRipple,
  linearProgress,
  list,
  menu,
  menuSurface,
  notchedOutline,
  radio,
  ripple,
  select,
  slider,
  snackbar,
  switchControl,
  tab,
  tabBar,
  tabIndicator,
  tabScroller,
  textField,
  topAppBar,
};
