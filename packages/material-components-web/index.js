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

import * as base from '@material/base';
import * as checkbox from '@material/checkbox';
import * as formField from '@material/form-field';
import * as gridList from '@material/grid-list';
import * as iconToggle from '@material/icon-toggle';
import * as radio from '@material/radio';
import * as ripple from '@material/ripple';
import * as dialog from '@material/dialog';
import * as drawer from '@material/drawer';
import * as textfield from '@material/textfield';
import * as snackbar from '@material/snackbar';
import * as linearProgress from '@material/linear-progress';
import * as menu from '@material/menu';
import * as select from '@material/select';
import * as tabs from '@material/tabs';
import * as toolbar from '@material/toolbar';
import autoInit from '@material/auto-init';

// Register all components
autoInit.register('MDCCheckbox', checkbox.MDCCheckbox);
autoInit.register('MDCDialog', dialog.MDCDialog);
autoInit.register('MDCPersistentDrawer', drawer.MDCPersistentDrawer);
autoInit.register('MDCTemporaryDrawer', drawer.MDCTemporaryDrawer);
autoInit.register('MDCRipple', ripple.MDCRipple);
autoInit.register('MDCGridList', gridList.MDCGridList);
autoInit.register('MDCIconToggle', iconToggle.MDCIconToggle);
autoInit.register('MDCLinearProgress', linearProgress.MDCLinearProgress);
autoInit.register('MDCRadio', radio.MDCRadio);
autoInit.register('MDCSnackbar', snackbar.MDCSnackbar);
autoInit.register('MDCTab', tabs.MDCTab);
autoInit.register('MDCTabBar', tabs.MDCTabBar);
autoInit.register('MDCTextfield', textfield.MDCTextfield);
autoInit.register('MDCSimpleMenu', menu.MDCSimpleMenu);
autoInit.register('MDCSelect', select.MDCSelect);
autoInit.register('MDCToolbar', toolbar.MDCToolbar);

// Export all components.
export {
  base,
  checkbox,
  dialog,
  drawer,
  formField,
  gridList,
  iconToggle,
  linearProgress,
  radio,
  ripple,
  snackbar,
  tabs,
  textfield,
  menu,
  select,
  toolbar,
  autoInit,
};
