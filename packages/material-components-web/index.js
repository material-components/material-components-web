/**
 * Copyright 2016 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import autoInit from '@material/auto-init';
import * as base from '@material/base';
import * as checkbox from '@material/checkbox';
import * as dialog from '@material/dialog';
import * as drawer from '@material/drawer';
import * as formField from '@material/form-field';
import * as gridList from '@material/grid-list';
import * as iconToggle from '@material/icon-toggle';
import * as linearProgress from '@material/linear-progress';
import * as menu from '@material/menu';
import * as radio from '@material/radio';
import * as ripple from '@material/ripple';
import * as select from '@material/select';
import * as selectionControl from '@material/selection-control';
import * as slider from '@material/slider';
import * as snackbar from '@material/snackbar';
import * as tabs from '@material/tabs';
import * as textField from '@material/textfield';
import * as toolbar from '@material/toolbar';

// Register all components
autoInit.register('MDCCheckbox', checkbox.MDCCheckbox);
autoInit.register('MDCDialog', dialog.MDCDialog);
autoInit.register('MDCPersistentDrawer', drawer.MDCPersistentDrawer);
autoInit.register('MDCTemporaryDrawer', drawer.MDCTemporaryDrawer);
autoInit.register('MDCFormField', formField.MDCFormField);
autoInit.register('MDCRipple', ripple.MDCRipple);
autoInit.register('MDCGridList', gridList.MDCGridList);
autoInit.register('MDCIconToggle', iconToggle.MDCIconToggle);
autoInit.register('MDCLinearProgress', linearProgress.MDCLinearProgress);
autoInit.register('MDCRadio', radio.MDCRadio);
autoInit.register('MDCSnackbar', snackbar.MDCSnackbar);
autoInit.register('MDCTab', tabs.MDCTab);
autoInit.register('MDCTabBar', tabs.MDCTabBar);
autoInit.register('MDCTextField', textField.MDCTextField);
autoInit.register('MDCSimpleMenu', menu.MDCSimpleMenu);
autoInit.register('MDCSelect', select.MDCSelect);
autoInit.register('MDCSlider', slider.MDCSlider);
autoInit.register('MDCToolbar', toolbar.MDCToolbar);

// Export all components.
export {
  autoInit,
  base,
  checkbox,
  dialog,
  drawer,
  formField,
  gridList,
  iconToggle,
  linearProgress,
  menu,
  radio,
  ripple,
  select,
  selectionControl,
  slider,
  snackbar,
  tabs,
  textField,
  toolbar,
};
