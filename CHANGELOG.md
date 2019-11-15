# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [5.0.0](https://github.com/material-components/material-components-web/compare/v4.0.0...v5.0.0) (2019-11-15)


### Bug Fixes

* **button:** Fixed  parameter default value in height mixin ([#5244](https://github.com/material-components/material-components-web/issues/5244)) ([b0cecf1](https://github.com/material-components/material-components-web/commit/b0cecf1))
* **checkbox:** update disabled color values ([#5209](https://github.com/material-components/material-components-web/issues/5209)) ([821871e](https://github.com/material-components/material-components-web/commit/821871e))
* **dialog:** Move aria roles from dialog root to dialog surface… ([#5239](https://github.com/material-components/material-components-web/issues/5239)) ([c704b71](https://github.com/material-components/material-components-web/commit/c704b71))
* **fab:** Add missing dep to fab package.json. ([#5236](https://github.com/material-components/material-components-web/issues/5236)) ([e0f6fd9](https://github.com/material-components/material-components-web/commit/e0f6fd9))
* **fab:** Add overflow: visible to make touch target visible in… ([#5241](https://github.com/material-components/material-components-web/issues/5241)) ([5850080](https://github.com/material-components/material-components-web/commit/5850080))
* **fab:** Adjust fab line-height ([#5254](https://github.com/material-components/material-components-web/issues/5254)) ([525989b](https://github.com/material-components/material-components-web/commit/525989b))
* **radio:** update disabled color values ([#5210](https://github.com/material-components/material-components-web/issues/5210)) ([491fddc](https://github.com/material-components/material-components-web/commit/491fddc))


### Code Refactoring

* **touchtarget:** Rename mdc-touch-target-component => mdc… ([#5245](https://github.com/material-components/material-components-web/issues/5245)) ([afe0dd1](https://github.com/material-components/material-components-web/commit/afe0dd1))


* fix(linear-progress) support aria attributes (#5248) ([7084b40](https://github.com/material-components/material-components-web/commit/7084b40)), closes [#5248](https://github.com/material-components/material-components-web/issues/5248)


### Features

* **button:** Add disabled state color mixins ([#5232](https://github.com/material-components/material-components-web/issues/5232)) ([b5eb51e](https://github.com/material-components/material-components-web/commit/b5eb51e))
* **button:** Setup elevation overlay ([#5256](https://github.com/material-components/material-components-web/issues/5256)) ([3cbee6d](https://github.com/material-components/material-components-web/commit/3cbee6d))
* **elevation:** Add elevation overlay mixins ([#5249](https://github.com/material-components/material-components-web/issues/5249)) ([b4cfdc4](https://github.com/material-components/material-components-web/commit/b4cfdc4))
* **fab:** Add support for increased touch target to mini FAB. ([#5231](https://github.com/material-components/material-components-web/issues/5231)) ([0c4d8f3](https://github.com/material-components/material-components-web/commit/0c4d8f3))
* **icon-button:** Add disabled state color mixins ([#5246](https://github.com/material-components/material-components-web/issues/5246)) ([7161170](https://github.com/material-components/material-components-web/commit/7161170))
* **text-field:** Add disabled state color mixins ([#5208](https://github.com/material-components/material-components-web/issues/5208)) ([66299b6](https://github.com/material-components/material-components-web/commit/66299b6))


### BREAKING CHANGES

* Adds new adapter methods to MDCLinearProgressAdapter.
* **elevation:** Functions moved into the _functions.scss file
* **touchtarget:** Renames mixin from mdc-touch-target-component => mdc-touch-target-margin
* **text-field:** Redundant mixins `mdc-text-field-textarea-fill-color`, `mdc-text-field-textarea-stroke-color`, `mdc-text-field-fullwidth-bottom-line-color` removed. Instead, use `mdc-text-field-fill-color`, `mdc-text-field-outline-color`, and `mdc-text-field-bottom-line-color` respectively to achieve the same effect.





# [4.0.0](https://github.com/material-components/material-components-web/compare/v3.2.0...v4.0.0) (2019-11-02)


### Bug Fixes

* **button:** Add `overflow: visible` to button. ([#4973](https://github.com/material-components/material-components-web/issues/4973)) ([905e84e](https://github.com/material-components/material-components-web/commit/905e84e))
* **button:** Adjust touch target size when density is applied ([#5112](https://github.com/material-components/material-components-web/issues/5112)) ([e2506f4](https://github.com/material-components/material-components-web/commit/e2506f4))
* **checkbox:** Change minimum ripple size of checkbox & switch 24px => 28px ([#5140](https://github.com/material-components/material-components-web/issues/5140)) ([3eae309](https://github.com/material-components/material-components-web/commit/3eae309))
* **checkbox:** Fix checkbox terminology in sass mixins ([#5014](https://github.com/material-components/material-components-web/issues/5014)) ([2161c02](https://github.com/material-components/material-components-web/commit/2161c02))
* **checkbox:** Remove RTL styles from checkbox ripple ([#5134](https://github.com/material-components/material-components-web/issues/5134)) ([a646516](https://github.com/material-components/material-components-web/commit/a646516))
* **chips:** Ignore selection events in chip set ([#4878](https://github.com/material-components/material-components-web/issues/4878)) ([94c6a00](https://github.com/material-components/material-components-web/commit/94c6a00))
* **chips:** Remove keyCode check ([#4966](https://github.com/material-components/material-components-web/issues/4966)) ([e6304c4](https://github.com/material-components/material-components-web/commit/e6304c4))
* **chips:** Reset touch target when chip density mixin is applied. ([#5116](https://github.com/material-components/material-components-web/issues/5116)) ([d3b515e](https://github.com/material-components/material-components-web/commit/d3b515e))
* **chips:** Stack trailing/leading icons above touch target el ([#5040](https://github.com/material-components/material-components-web/issues/5040)) ([048d4b7](https://github.com/material-components/material-components-web/commit/048d4b7))
* **chips:** Stop emitting events in handlers ([#4969](https://github.com/material-components/material-components-web/issues/4969)) ([cfd81dc](https://github.com/material-components/material-components-web/commit/cfd81dc))
* **data-table:** Minor fixes for data table layout ([#5037](https://github.com/material-components/material-components-web/issues/5037)) ([37b1f93](https://github.com/material-components/material-components-web/commit/37b1f93))
* **fab:** Add overflow: hidden; to ripple target to fix bounded ripple. ([#5214](https://github.com/material-components/material-components-web/issues/5214)) ([97cbbdc](https://github.com/material-components/material-components-web/commit/97cbbdc))
* **fab:** Use FAB ripple target selector ([#5146](https://github.com/material-components/material-components-web/issues/5146)) ([9d91acc](https://github.com/material-components/material-components-web/commit/9d91acc))
* **form-field:** Fix radio RTL alignment bug. ([#5064](https://github.com/material-components/material-components-web/issues/5064)) ([ef99808](https://github.com/material-components/material-components-web/commit/ef99808))
* **linear-progress:** Fix indeterminate animation bug ([#5180](https://github.com/material-components/material-components-web/issues/5180)) ([062ade5](https://github.com/material-components/material-components-web/commit/062ade5))
* **linear-progress:** Prefix animation keyframes to prevent clashing ([#5155](https://github.com/material-components/material-components-web/issues/5155)) ([fc0e474](https://github.com/material-components/material-components-web/commit/fc0e474))
* **linear-progress:** Restore buffer after determinate is toggl… ([#5156](https://github.com/material-components/material-components-web/issues/5156)) ([09b1598](https://github.com/material-components/material-components-web/commit/09b1598))
* **linear-progress:** Support high contrast mode ([#5190](https://github.com/material-components/material-components-web/issues/5190)) ([d4141c9](https://github.com/material-components/material-components-web/commit/d4141c9))
* **list:** Add #adapter.listItemAtIndexHasClass to prevent user state change to disabled items ([#4922](https://github.com/material-components/material-components-web/issues/4922)) ([b6d213c](https://github.com/material-components/material-components-web/commit/b6d213c))
* **menu:** Vertically center the group icon ([#4862](https://github.com/material-components/material-components-web/issues/4862)) ([c5738ed](https://github.com/material-components/material-components-web/commit/c5738ed))
* **menu-surface:** remove duplicate export from menu-surface ([#5200](https://github.com/material-components/material-components-web/issues/5200)) ([0b120ae](https://github.com/material-components/material-components-web/commit/0b120ae))
* **radio:** Fix touch target margins: 0px => 4px. ([#5096](https://github.com/material-components/material-components-web/issues/5096)) ([a48d06e](https://github.com/material-components/material-components-web/commit/a48d06e))
* **ripple:** Add overflow: hidden; to the bounded ripple mixin ([#5173](https://github.com/material-components/material-components-web/issues/5173)) ([996b091](https://github.com/material-components/material-components-web/commit/996b091))
* **ripple:** Always set even num when initial ripple size is ca… ([#5141](https://github.com/material-components/material-components-web/issues/5141)) ([b26ad23](https://github.com/material-components/material-components-web/commit/b26ad23))
* **ripple:** Remove unnecessary overflow: hidden. ([#5191](https://github.com/material-components/material-components-web/issues/5191)) ([5916d18](https://github.com/material-components/material-components-web/commit/5916d18))
* **tabs:** Fix tab img icon styling. ([#5041](https://github.com/material-components/material-components-web/issues/5041)) ([d0e6cd1](https://github.com/material-components/material-components-web/commit/d0e6cd1))
* **text-field:** Do not trigger shake animation when text field is empty ([#5097](https://github.com/material-components/material-components-web/issues/5097)) ([4913db9](https://github.com/material-components/material-components-web/commit/4913db9))
* **text-field:** Fixes input text alignment on IE11 for densed text field ([#5136](https://github.com/material-components/material-components-web/issues/5136)) ([892dd4e](https://github.com/material-components/material-components-web/commit/892dd4e))
* **text-field:** Fixes input text alignment on IE11 for densed… ([#5147](https://github.com/material-components/material-components-web/issues/5147)) ([c8f7693](https://github.com/material-components/material-components-web/commit/c8f7693))
* **text-field:** Updated shape mixins to set density scale ([#5207](https://github.com/material-components/material-components-web/issues/5207)) ([719b57e](https://github.com/material-components/material-components-web/commit/719b57e))
* **touch-target:** Add class to touch target wrapper. ([#5174](https://github.com/material-components/material-components-web/issues/5174)) ([e7799b8](https://github.com/material-components/material-components-web/commit/e7799b8))
* **touch-target:** Add missing dependency - touch target to com… ([#5098](https://github.com/material-components/material-components-web/issues/5098)) ([9306bd0](https://github.com/material-components/material-components-web/commit/9306bd0))


### Code Refactoring

* **button:** Add ripple target as an inner element. ([#4890](https://github.com/material-components/material-components-web/issues/4890)) ([dffefe6](https://github.com/material-components/material-components-web/commit/dffefe6))
* **mdc-fab:** Move Ripple to inner Element. ([#4997](https://github.com/material-components/material-components-web/issues/4997)) ([85b33b5](https://github.com/material-components/material-components-web/commit/85b33b5))
* **select:** Refactor select ([#5113](https://github.com/material-components/material-components-web/issues/5113)) ([db7560e](https://github.com/material-components/material-components-web/commit/db7560e))
* **slider:** Functional slider tick visuals with css background ([#4756](https://github.com/material-components/material-components-web/issues/4756)) ([8f851d9](https://github.com/material-components/material-components-web/commit/8f851d9))


### Features

* **button:** Add support for increased touch target to button. ([#4948](https://github.com/material-components/material-components-web/issues/4948)) ([1d7a2e6](https://github.com/material-components/material-components-web/commit/1d7a2e6))
* **checkbox:** Add disabled state color mixins ([#5167](https://github.com/material-components/material-components-web/issues/5167)) ([01628ef](https://github.com/material-components/material-components-web/commit/01628ef))
* **checkbox:** Add support for 48px touch target ([#5025](https://github.com/material-components/material-components-web/issues/5025)) ([b5685a8](https://github.com/material-components/material-components-web/commit/b5685a8))
* **checkbox:** Move ripple to child node ([#4981](https://github.com/material-components/material-components-web/issues/4981)) ([9712b24](https://github.com/material-components/material-components-web/commit/9712b24))
* **chip:** Add density mixin to chip. ([#5109](https://github.com/material-components/material-components-web/issues/5109)) ([bdf3430](https://github.com/material-components/material-components-web/commit/bdf3430))
* **chips:** Add keyboard navigation ([#4844](https://github.com/material-components/material-components-web/issues/4844)) ([42065fe](https://github.com/material-components/material-components-web/commit/42065fe)), closes [#2259](https://github.com/material-components/material-components-web/issues/2259)
* **chips:** Add setSelectedFromChipset method ([#4872](https://github.com/material-components/material-components-web/issues/4872)) ([283bd55](https://github.com/material-components/material-components-web/commit/283bd55))
* **chips:** Add support for increased touch target to chips. ([#4970](https://github.com/material-components/material-components-web/issues/4970)) ([6aa109d](https://github.com/material-components/material-components-web/commit/6aa109d))
* **chips:** Use index for all chip operations ([#4869](https://github.com/material-components/material-components-web/issues/4869)) ([07078bb](https://github.com/material-components/material-components-web/commit/07078bb))
* **density:** Add density subsystem to components ([#5059](https://github.com/material-components/material-components-web/issues/5059)) ([73a5e4c](https://github.com/material-components/material-components-web/commit/73a5e4c))
* **dialog:** Add dialog mixin for dialogs with increased touch target buttons. ([#5024](https://github.com/material-components/material-components-web/issues/5024)) ([2ef1ddd](https://github.com/material-components/material-components-web/commit/2ef1ddd))
* **icon-button:** Add density mixin to icon button ([#5122](https://github.com/material-components/material-components-web/issues/5122)) ([37d6458](https://github.com/material-components/material-components-web/commit/37d6458))
* **list:** Add density mixin to list ([#5069](https://github.com/material-components/material-components-web/issues/5069)) ([5132f89](https://github.com/material-components/material-components-web/commit/5132f89))
* **list:** Add mixin for disabled text opacity ([#4861](https://github.com/material-components/material-components-web/issues/4861)) ([d68f8a7](https://github.com/material-components/material-components-web/commit/d68f8a7))
* **radio:** Add density mixin to radio ([#5118](https://github.com/material-components/material-components-web/issues/5118)) ([199534d](https://github.com/material-components/material-components-web/commit/199534d))
* **radio:** Add disabled state color mixins ([#5168](https://github.com/material-components/material-components-web/issues/5168)) ([b5c6d66](https://github.com/material-components/material-components-web/commit/b5c6d66))
* **radio:** Add support for 48px touch target ([#5032](https://github.com/material-components/material-components-web/issues/5032)) ([87b0a4c](https://github.com/material-components/material-components-web/commit/87b0a4c))
* **radio:** Move ripple to child element ([#4983](https://github.com/material-components/material-components-web/issues/4983)) ([100ab37](https://github.com/material-components/material-components-web/commit/100ab37))
* **ripple:** Add support for ripple target to mixins. ([#4880](https://github.com/material-components/material-components-web/issues/4880)) ([08dbe69](https://github.com/material-components/material-components-web/commit/08dbe69))
* **snackbar:** Add option for indefinite timeout ([#4998](https://github.com/material-components/material-components-web/issues/4998)) ([4f11851](https://github.com/material-components/material-components-web/commit/4f11851))
* **switch:** Add density support for switch component. ([#5124](https://github.com/material-components/material-components-web/issues/5124)) ([2c793b4](https://github.com/material-components/material-components-web/commit/2c793b4)), closes [#5104](https://github.com/material-components/material-components-web/issues/5104)
* **switch:** add ripple opacity customization mixins ([#5126](https://github.com/material-components/material-components-web/issues/5126)) ([8c0273f](https://github.com/material-components/material-components-web/commit/8c0273f))
* **tab:** Add text transform mixin ([#5144](https://github.com/material-components/material-components-web/issues/5144)) ([22d7ad2](https://github.com/material-components/material-components-web/commit/22d7ad2))
* **tab-bar:** Add a mixin to set scroller animation ([#5172](https://github.com/material-components/material-components-web/issues/5172)) ([d7c938a](https://github.com/material-components/material-components-web/commit/d7c938a))
* **tab-bar:** Add density mixin to tab-bar ([#5070](https://github.com/material-components/material-components-web/issues/5070)) ([45dc002](https://github.com/material-components/material-components-web/commit/45dc002))
* **tab-scroller:** Add incrementScrollImmediate to bypass animation ([#5184](https://github.com/material-components/material-components-web/issues/5184)) ([2b878b3](https://github.com/material-components/material-components-web/commit/2b878b3)), closes [#5123](https://github.com/material-components/material-components-web/issues/5123)
* **tab-scroller:** Mixin for scroll transition ([#5154](https://github.com/material-components/material-components-web/issues/5154)) ([efda83d](https://github.com/material-components/material-components-web/commit/efda83d))
* **text-field:** Add density mixin to text field variants ([#5066](https://github.com/material-components/material-components-web/issues/5066)) ([a12101d](https://github.com/material-components/material-components-web/commit/a12101d))
* **text-field:** Center align inner elements for dynamic height ([#4990](https://github.com/material-components/material-components-web/issues/4990)) ([4d94b22](https://github.com/material-components/material-components-web/commit/4d94b22))
* **touch-target:** Add touch target mixins. ([#4940](https://github.com/material-components/material-components-web/issues/4940)) ([b2e0fea](https://github.com/material-components/material-components-web/commit/b2e0fea))


### BREAKING CHANGES

* **checkbox:** `mdc-checkbox-ink-color` mixin now only applies to enabled checkboxes
* **chips:** Chips markup, adapters, foundations, and events have changed.
* **select:** In MDCMenu and MDCMenuSurface, `hoistMenuToBody` adapter method removed.  In MDCSelect, HTML structure changed: the select anchor is now wrapped in a parent element, and the anchor's sibling is the select menu. Support for native select removed. Support added for select with no label. MDCSelectAdapter methods removed: `getValue`, `setValue`, `isMenuOpen`, `setSelectedIndex`, `checkValidity`, `setValid`, `toggleClassAtIndex`. MDCSelectAdapter methods added: `hasLabel`, `getSelectedMenuItem`, `setSelectedText`, `isSelectedTextFocused`, `get/setSelectedTextAttr`, `getAnchorElement`, `setMenuAnchorElement`, `setMenuAnchorCorner`, `setMenuWrapFocus`, `set/removeAttributeAtIndex`, `focusMenuItemAtIndex`, `getMenuItemValues`, `getMenuItemCount`, `getMenuItemCount`, `getMenuItemAttr`, `getMenuItemTextAtIndex`, `add/removeClassAtIndex`. MDCSelectFoundation `setValue` method removed; `getDisabled`, `handleMenuItemAction`, `getSelectedIndex`, `get/setRequired`, `init` added.
* **radio:** In Checkbox, Renamed sass variables `$mdc-radio-touch-area` => `$mdc-radio-ripple-size` & `$mdc-radio-ui-size` => `$mdc-radio-icon-size` to be consistent with checkbox. Also, removed `$mdc-radio-ui-pct` sass variable.
* **switch:** Renames switch variables $mdc-switch-tap-target-size => $mdc-switch-ripple-size, removes $mdc-switch-tap-target-initial-position and $mdc-switch-native-control-width.
* **list:** New adapter method listItemAtIndexHasClass
* **list:** Renamed mixin `mdc-list-item-shape-radius()` => `mdc-list-single-line-shape-radius()`
* **linear-progress:** MDCLinearProgressAdapter adapter has new `forceLayout` method
* **text-field:** Removed sass variable in notched outline - `$mdc-notched-outline-transition-duration`.
* **mdc-fab:** This changes the structure of the FAB element by moving the ripple from the outer element to an inner mdc-fab__ripple element.

  OLD

  ```html
  <button class="mdc-fab" aria-label="Favorite">
    <span class="mdc-fab__icon material-icons">favorite</span>
  </button>
  ```

  NEW

  ```html
  <button class="mdc-fab" aria-label="Favorite">
    <div class="mdc-fab__ripple"></div>
    <span class="mdc-fab__icon material-icons">favorite</span>
  </button>
  ```

* **radio:** Ripple has been moved to a child element. See readme for updates.
* **slider:** remove adapter methods `appendTrackMarkers`, `removeTrackMarkers `, `setLastTrackMarkersStyleProperty `, and add adapter method `setTrackMarkers`.
* **button:** This changes the structure of the button element by moving the ripple from the outer <button> element to an inner `mdc-button__ripple` element.

  OLD

  ```html
  <button class="mdc-button">
    <span class="mdc-button__label">Hello World</span>
  </button>
  ```

  NEW

  ```html
  <button class="mdc-button">
    <div class="mdc-button__ripple"></div>
    <span class="mdc-button__label">Hello World</span>
  </button>
  ```
* **chips:** MDCChipSetAdapter#removeChip has been replaced with MDCChipSetAdapter#removeChipAtIndex. MDCChipSetAdapter#setSelected has been replaced with MDCChipSetAdapter#selectChipAtIndex
* **density:** Renamed sass mixins & variables in MDC Data Table - `mdc-data-table-header-row-height` => `mdc-data-table-header-cell-height` & `mdc-data-table-row-height` => `mdc-data-table-cell-height`. Also removed `mdc-button--dense` variant, use button's density mixin instead.





# [3.2.0](https://github.com/material-components/material-components-web/compare/v3.1.1...v3.2.0) (2019-09-12)


### Bug Fixes

* Use head instead of body to detect edge pseudo var bug ([#4982](https://github.com/material-components/material-components-web/issues/4982)) ([9e87478](https://github.com/material-components/material-components-web/commit/9e87478))
* **data-table:** Add .npmignore to ignore typescript files when… ([#4992](https://github.com/material-components/material-components-web/issues/4992)) ([dd422d1](https://github.com/material-components/material-components-web/commit/dd422d1))
* **linear-progress:** stop animation when closed ([#5006](https://github.com/material-components/material-components-web/issues/5006)) ([4c4342d](https://github.com/material-components/material-components-web/commit/4c4342d))
* **menu:** recompute index before marking selection ([#5047](https://github.com/material-components/material-components-web/issues/5047)) ([90f6247](https://github.com/material-components/material-components-web/commit/90f6247))
* **rtl:** Removed mdc-rtl-include check from mdc-rtl-reflexive mixin ([#5001](https://github.com/material-components/material-components-web/issues/5001)) ([6e7b191](https://github.com/material-components/material-components-web/commit/6e7b191))
* **top-app-bar:** "always collapsed" variant semantics in Short TopAppBar Foundation ([#5009](https://github.com/material-components/material-components-web/issues/5009)) ([805d098](https://github.com/material-components/material-components-web/commit/805d098))


### Features

* **linear-progress:** add feature targeting for styles ([#4898](https://github.com/material-components/material-components-web/issues/4898)) ([7ec18c6](https://github.com/material-components/material-components-web/commit/7ec18c6))
* **list:** Add setEnabled to foundation ([#5049](https://github.com/material-components/material-components-web/issues/5049)) ([c2b4407](https://github.com/material-components/material-components-web/commit/c2b4407))
* **menu:** add setEnabled to allow dynamic enabling or disabling menu item ([#5054](https://github.com/material-components/material-components-web/issues/5054)) ([4751d64](https://github.com/material-components/material-components-web/commit/4751d64))
* **rtl:** Added a flag to turn-off mdc-rtl CSS ([#4996](https://github.com/material-components/material-components-web/issues/4996)) ([eb87f06](https://github.com/material-components/material-components-web/commit/eb87f06))





## [3.1.1](https://github.com/material-components/material-components-web/compare/v3.1.0...v3.1.1) (2019-08-14)


### Bug Fixes

* **data-table:** Fixed alignment of header cell title for numer… ([#4963](https://github.com/material-components/material-components-web/issues/4963)) ([b6274a7](https://github.com/material-components/material-components-web/commit/b6274a7))





# [3.1.0](https://github.com/material-components/material-components-web/compare/v3.0.0...v3.1.0) (2019-07-22)


### Bug Fixes

* update TypeScript version to 3.5.x and fix typing errors ([#4853](https://github.com/material-components/material-components-web/issues/4853)) ([0657504](https://github.com/material-components/material-components-web/commit/0657504))
* **checkbox:** Fixed checkbox container fill color when animati… ([#4879](https://github.com/material-components/material-components-web/issues/4879)) ([d393fb5](https://github.com/material-components/material-components-web/commit/d393fb5))
* **checkbox:** Fixed hover focus colors for unchecked checkbox ([#4868](https://github.com/material-components/material-components-web/issues/4868)) ([1d8fbf5](https://github.com/material-components/material-components-web/commit/1d8fbf5))
* **fab:** clear text decoration ([#4865](https://github.com/material-components/material-components-web/issues/4865)) ([b524a12](https://github.com/material-components/material-components-web/commit/b524a12))
* **infrastructure:** support ssr by removing the reference from window ([#4864](https://github.com/material-components/material-components-web/issues/4864)) ([e5c5ea5](https://github.com/material-components/material-components-web/commit/e5c5ea5))
* **menu:** Vertically center the group icon ([#4862](https://github.com/material-components/material-components-web/issues/4862)) ([d551dfd](https://github.com/material-components/material-components-web/commit/d551dfd))


### Features

* **data-table:** Added data table component ([#4889](https://github.com/material-components/material-components-web/issues/4889)) ([7d3380a](https://github.com/material-components/material-components-web/commit/7d3380a))
* **drawer:** add feature targeting for styles ([#4877](https://github.com/material-components/material-components-web/issues/4877)) ([4d65d29](https://github.com/material-components/material-components-web/commit/4d65d29))
* **slider:** add feature targeting for styles ([#4871](https://github.com/material-components/material-components-web/issues/4871)) ([3ee2675](https://github.com/material-components/material-components-web/commit/3ee2675))
* **snackbar:** add feature targeting for styles ([#4876](https://github.com/material-components/material-components-web/issues/4876)) ([1b7aea1](https://github.com/material-components/material-components-web/commit/1b7aea1))





# [3.0.0](https://github.com/material-components/material-components-web/compare/v2.3.1...v3.0.0) (2019-06-25)


### Bug Fixes

* **checkbox:** screenshot test golden update ([#4735](https://github.com/material-components/material-components-web/issues/4735)) ([0b44494](https://github.com/material-components/material-components-web/commit/0b44494))
* **chips:** Add box-sizing back to chip root ([#4807](https://github.com/material-components/material-components-web/issues/4807)) ([19a19b3](https://github.com/material-components/material-components-web/commit/19a19b3))
* **chips:** Fix chips trailing icon margin ([#4720](https://github.com/material-components/material-components-web/issues/4720)) ([5de76bc](https://github.com/material-components/material-components-web/commit/5de76bc))
* **dialog:** Add noflip annotations for GSS compiler. ([#4769](https://github.com/material-components/material-components-web/issues/4769)) ([d644e78](https://github.com/material-components/material-components-web/commit/d644e78))
* **dialog:** Fix scrolling content overflowing on Chrome/Android. ([#4746](https://github.com/material-components/material-components-web/issues/4746)) ([3e9abda](https://github.com/material-components/material-components-web/commit/3e9abda))
* **dialog:** Use 100vw for dialog max-width calculation. ([#4766](https://github.com/material-components/material-components-web/issues/4766)) ([d0b8c89](https://github.com/material-components/material-components-web/commit/d0b8c89)), closes [#4746](https://github.com/material-components/material-components-web/issues/4746)
* **infrastructure:** Fix failing screenshot tests ([#4800](https://github.com/material-components/material-components-web/issues/4800)) ([a9a41cb](https://github.com/material-components/material-components-web/commit/a9a41cb))
* **infrastructure:** update check-pkg-for-release.js ([#4857](https://github.com/material-components/material-components-web/issues/4857)) ([0cd775c](https://github.com/material-components/material-components-web/commit/0cd775c))
* **menu:** Fix bug where TAB does not respect the default browser tab order. ([#4789](https://github.com/material-components/material-components-web/issues/4789)) ([22237cd](https://github.com/material-components/material-components-web/commit/22237cd))
* **menu:** In Windows high contrast mode, decrease opacity of disabled menu items. ([#4777](https://github.com/material-components/material-components-web/issues/4777)) ([898e53e](https://github.com/material-components/material-components-web/commit/898e53e))
* **menu:** Remove code to focus on first/last element on TAB/SHIFT+TAB. ([#4786](https://github.com/material-components/material-components-web/issues/4786)) ([99af567](https://github.com/material-components/material-components-web/commit/99af567))
* **menu:** Switch from aria-selected to aria-checked for selected menu item. ([#4779](https://github.com/material-components/material-components-web/issues/4779)) ([f4b0bf5](https://github.com/material-components/material-components-web/commit/f4b0bf5))
* **select:** Update screenshots for FF/Windows update. ([#4790](https://github.com/material-components/material-components-web/issues/4790)) ([6ea503c](https://github.com/material-components/material-components-web/commit/6ea503c))
* move applyPassive to dom package for use in text-field ([#4747](https://github.com/material-components/material-components-web/issues/4747)) ([ce0b1c5](https://github.com/material-components/material-components-web/commit/ce0b1c5))
* **tab-indicator:** Center content ([#4837](https://github.com/material-components/material-components-web/issues/4837)) ([102d778](https://github.com/material-components/material-components-web/commit/102d778))
* **tabs:** Remove deprecated package mdc-tabs ([#4784](https://github.com/material-components/material-components-web/issues/4784)) ([4f366a5](https://github.com/material-components/material-components-web/commit/4f366a5))
* **text-field:** Fix asterisk color of text field when input is invalid and disabled ([#4806](https://github.com/material-components/material-components-web/issues/4806)) ([24054ed](https://github.com/material-components/material-components-web/commit/24054ed))
* remove icontoggle ([#4783](https://github.com/material-components/material-components-web/issues/4783)) ([a13089d](https://github.com/material-components/material-components-web/commit/a13089d))
* remove icontoggle ([#4783](https://github.com/material-components/material-components-web/issues/4783)) ([5079213](https://github.com/material-components/material-components-web/commit/5079213))


### Code Refactoring

* **dialog:** Split dialog Foundation#handleInteraction into #handleClick/#handleKeydown. ([#4655](https://github.com/material-components/material-components-web/issues/4655)) ([d650390](https://github.com/material-components/material-components-web/commit/d650390))
* **top-app-bar:** Remove [de]registerEventHandler methods from adapters ([#4701](https://github.com/material-components/material-components-web/issues/4701)) ([34bba89](https://github.com/material-components/material-components-web/commit/34bba89))
* **top-app-bar:** Remove [de]registerEventHandler methods from adapters ([#4701](https://github.com/material-components/material-components-web/issues/4701)) ([d8fe135](https://github.com/material-components/material-components-web/commit/d8fe135))


### Features

* **checkbox:** Added mixin to customize checkbox touch dimension. ([#4697](https://github.com/material-components/material-components-web/issues/4697)) ([ff2873e](https://github.com/material-components/material-components-web/commit/ff2873e))
* **chips:** Add setAttr adapter method ([#4736](https://github.com/material-components/material-components-web/issues/4736)) ([1e21acf](https://github.com/material-components/material-components-web/commit/1e21acf))
* **chips:** Use semantic button elements ([#4627](https://github.com/material-components/material-components-web/issues/4627)) ([741124d](https://github.com/material-components/material-components-web/commit/741124d))
* add feature targeting for styles to tab-related packages ([#4838](https://github.com/material-components/material-components-web/issues/4838)) ([c7efc10](https://github.com/material-components/material-components-web/commit/c7efc10))
* **dialog:** Add Adapter#getInitialFocusEl. ([#4719](https://github.com/material-components/material-components-web/issues/4719)) ([1108307](https://github.com/material-components/material-components-web/commit/1108307))
* **menu:** add setSelectedIndex to set selected item in menu selection group ([#4620](https://github.com/material-components/material-components-web/issues/4620)) ([3a280c6](https://github.com/material-components/material-components-web/commit/3a280c6))
* **top-app-bar:** use mdc-icon-button styles instead of top app bar ([#4745](https://github.com/material-components/material-components-web/issues/4745)) ([f8c561c](https://github.com/material-components/material-components-web/commit/f8c561c))


### BREAKING CHANGES

* **tabs:** removed deprecated mdc-tabs package.
* **chips:** Update mdc-chip-leading-icon-margin and mdc-chip-trailing-icon-margin mixins signatures to take only left and right margin values.
* **chips:** Add the setAttr method to the chip adapter.
* **top-app-bar:** Replaced adapter methods getParentElement, getSelectedElementIndex with getSelectedSiblingOfItemAtIndex, isSelectableItemAtIndex.
* **dialog:** Dialog Adapter#getInitialFocusEl has been added and Adapter#trapFocus first argument is now the initialFocusEl.
* **checkbox:** Removed `$mdc-checkbox-ui-pct` sass variable from `MDCCheckbox`
* **menu:** Replaced adapter methods getParentElement, getSelectedElementIndex with getSelectedSiblingOfItemAtIndex, isSelectableItemAtIndex.
* **dialog:** Dialog `Foundation#handleInteraction` has been split into two methods: `#handleClick` and `#handleKeydown`.
* **menu:** The following adapter methods were removed: isFirstElementFocused, isLastElementFocused, focusFirstElement, focusLastElement. The following functionality to handle TAB on menusurface has been removed: "If TAB and last element is focused => Focus on first element", "If SHIFT + TAB and first element is focused => Focus on last element"
* **chips:** Add the setAttr method to the chip adapter.
* **top-app-bar:** Replaced adapter methods getParentElement, getSelectedElementIndex with getSelectedSiblingOfItemAtIndex, isSelectableItemAtIndex.
* **dialog:** Dialog Adapter#getInitialFocusEl has been added and Adapter#trapFocus first argument is now the initialFocusEl.
* **checkbox:** Removed `$mdc-checkbox-ui-pct` sass variable from `MDCCheckbox`
* **menu:** Replaced adapter methods getParentElement, getSelectedElementIndex with getSelectedSiblingOfItemAtIndex, isSelectableItemAtIndex.
* **dialog:** Dialog `Foundation#handleInteraction` has been split into two methods: `#handleClick` and `#handleKeydown`.
* **chips:** Update mdc-chip-leading-icon-margin and mdc-chip-trailing-icon-margin mixins signatures to take only left and right margin values.





<a name="2.3.1"></a>
## [2.3.1](https://github.com/material-components/material-components-web/compare/v2.3.0...v2.3.1) (2019-06-11)


### Bug Fixes

* **text-field:** Update outline idle border color to match design guidance ([#4768](https://github.com/material-components/material-components-web/issues/4768)) ([7fedeaf](https://github.com/material-components/material-components-web/commit/7fedeaf))



<a name="2.3.0"></a>
# [2.3.0](https://github.com/material-components/material-components-web/compare/v2.1.1...v2.3.0) (2019-05-28)


### Bug Fixes

* **ripple:** Fixes issue where Chrome v74 shows black artifact on ripple surface on hover ([#4695](https://github.com/material-components/material-components-web/issues/4695)) ([7a5e7ed](https://github.com/material-components/material-components-web/commit/7a5e7ed))
* **select:** Fixes arrow direction on select focused state ([#4726](https://github.com/material-components/material-components-web/issues/4726)) ([358546a](https://github.com/material-components/material-components-web/commit/358546a))
* **tab:** Fix tab color variables to use color literals ([#4688](https://github.com/material-components/material-components-web/issues/4688)) ([88734fe](https://github.com/material-components/material-components-web/commit/88734fe))
* **typography:** Use unquote for setting font-family. ([#4665](https://github.com/material-components/material-components-web/issues/4665)) ([8d8f3fc](https://github.com/material-components/material-components-web/commit/8d8f3fc))


### Features

* **auto-init:** initialize components once with multiple mdc.autoInit() calls ([#4691](https://github.com/material-components/material-components-web/issues/4691)) ([218d2e5](https://github.com/material-components/material-components-web/commit/218d2e5))
* **chips:** Add feature targeting for styles ([#4693](https://github.com/material-components/material-components-web/issues/4693)) ([0fdb889](https://github.com/material-components/material-components-web/commit/0fdb889))



<a name="2.2.0"></a>
# [2.2.0](https://github.com/material-components/material-components-web/compare/v2.1.1...v2.2.0) (2019-05-13)


### Bug Fixes

* **tab:** Fix tab color variables to use color literals ([#4688](https://github.com/material-components/material-components-web/issues/4688)) ([88734fe](https://github.com/material-components/material-components-web/commit/88734fe))


### Features

* **chips:** Add feature targeting for styles ([#4693](https://github.com/material-components/material-components-web/issues/4693)) ([0fdb889](https://github.com/material-components/material-components-web/commit/0fdb889))



<a name="2.1.1"></a>
## [2.1.1](https://github.com/material-components/material-components-web/compare/v2.1.0...v2.1.1) (2019-05-10)


### Bug Fixes

* **ripple:** Fixes issue where Chrome v74 shows black artifact on ripple surface on hover ([a0c7b81](https://github.com/material-components/material-components-web/commit/a0c7b81))



<a name="2.1.0"></a>
# [2.1.0](https://github.com/material-components/material-components-web/compare/v2.0.0...v2.1.0) (2019-05-06)


### Bug Fixes

* **tab:** Update horizontal padding mixin ([#4678](https://github.com/material-components/material-components-web/issues/4678)) ([d3ce9c9](https://github.com/material-components/material-components-web/commit/d3ce9c9))
* **tab-indicator:** Remove child selector ([#4676](https://github.com/material-components/material-components-web/issues/4676)) ([edbe0ba](https://github.com/material-components/material-components-web/commit/edbe0ba))
* **tab-indicator:** Show border for high contrast ([#4666](https://github.com/material-components/material-components-web/issues/4666)) ([5a52847](https://github.com/material-components/material-components-web/commit/5a52847))
* **text-field:** Fixes overlapping input with leading icon in absence of label ([#4637](https://github.com/material-components/material-components-web/issues/4637)) ([64e459e](https://github.com/material-components/material-components-web/commit/64e459e))
* **text-field:** Update character counter to update when value is set. ([#4663](https://github.com/material-components/material-components-web/issues/4663)) ([acfbe2d](https://github.com/material-components/material-components-web/commit/acfbe2d))
* **top-app-bar:** Move comment line to appropriate section ([#4610](https://github.com/material-components/material-components-web/issues/4610)) ([3e36555](https://github.com/material-components/material-components-web/commit/3e36555))


### Features

* **checkbox:** Updated cssClasses constant of checkbox ([#4674](https://github.com/material-components/material-components-web/issues/4674)) ([bb25680](https://github.com/material-components/material-components-web/commit/bb25680))
* **tab:** Improved mixins ([#4675](https://github.com/material-components/material-components-web/issues/4675)) ([252009f](https://github.com/material-components/material-components-web/commit/252009f))



<a name="2.0.0"></a>
# [2.0.0](https://github.com/material-components/material-components-web/compare/v1.0.0...v2.0.0) (2019-04-29)


### Bug Fixes

* **button:** Update border-width to 1px ([#4606](https://github.com/material-components/material-components-web/issues/4606)) ([be8747f](https://github.com/material-components/material-components-web/commit/be8747f))
* **card:** Use on-surface color for action icons ([#4519](https://github.com/material-components/material-components-web/issues/4519)) ([9f37016](https://github.com/material-components/material-components-web/commit/9f37016))
* **checkbox:** Fixed disabled checkbox styles for Edge browser ([#4602](https://github.com/material-components/material-components-web/issues/4602)) ([7855a6b](https://github.com/material-components/material-components-web/commit/7855a6b))
* **chips:** Fix incorrect ripple effect on filter chip ([#4565](https://github.com/material-components/material-components-web/issues/4565)) ([975bae2](https://github.com/material-components/material-components-web/commit/975bae2))
* **feature-targeting:** Move ripple styles into separate mixins ([#4454](https://github.com/material-components/material-components-web/issues/4454)) ([720bef0](https://github.com/material-components/material-components-web/commit/720bef0))
* **list:** Add cursor: pointer for interactive list items ([#4563](https://github.com/material-components/material-components-web/issues/4563)) ([d2f0ccb](https://github.com/material-components/material-components-web/commit/d2f0ccb)), closes [#4557](https://github.com/material-components/material-components-web/issues/4557)
* **list:** Include disabled list items in keyboard navigation and allow focus ([#4568](https://github.com/material-components/material-components-web/issues/4568)) ([6e24280](https://github.com/material-components/material-components-web/commit/6e24280))
* **list:** Update meta class to use caption typogrpahy style ([#4623](https://github.com/material-components/material-components-web/issues/4623)) ([0826a78](https://github.com/material-components/material-components-web/commit/0826a78))
* **menu:** Fix selection group list item spacing ([#4517](https://github.com/material-components/material-components-web/issues/4517)) ([5183e01](https://github.com/material-components/material-components-web/commit/5183e01))
* **menu:** Use on-surface color for graphic/meta content ([#4520](https://github.com/material-components/material-components-web/issues/4520)) ([74b8d67](https://github.com/material-components/material-components-web/commit/74b8d67))
* **ripple:** Use standard element removal method ([#4638](https://github.com/material-components/material-components-web/issues/4638)) ([ef07477](https://github.com/material-components/material-components-web/commit/ef07477))
* **select:** Fix enhanced select issue where it does not stay open on long press [#4173](https://github.com/material-components/material-components-web/issues/4173) ([#4590](https://github.com/material-components/material-components-web/issues/4590)) ([8286aa7](https://github.com/material-components/material-components-web/commit/8286aa7))
* **select:** Use correct shape category consistently with text-field ([#4553](https://github.com/material-components/material-components-web/issues/4553)) ([bec2ef2](https://github.com/material-components/material-components-web/commit/bec2ef2))
* **shape:** Allow percentage based global overrides ([#4548](https://github.com/material-components/material-components-web/issues/4548)) ([4bf7a86](https://github.com/material-components/material-components-web/commit/4bf7a86))
* **shape:** Fix errors related to multi-value shape categories ([#4547](https://github.com/material-components/material-components-web/issues/4547)) ([9f79d17](https://github.com/material-components/material-components-web/commit/9f79d17))
* **tab:** Explicitly set margin to 0 on tabs for Safari ([#4654](https://github.com/material-components/material-components-web/issues/4654)) ([28aa623](https://github.com/material-components/material-components-web/commit/28aa623))
* Don't import * from focus-trap to avoid default export confusion ([#4485](https://github.com/material-components/material-components-web/issues/4485)) ([6082dc3](https://github.com/material-components/material-components-web/commit/6082dc3))
* **tab:** Fix tab icon color mixin to support SVG icons. ([#4540](https://github.com/material-components/material-components-web/issues/4540)) ([5ad6570](https://github.com/material-components/material-components-web/commit/5ad6570))
* **tab:** Update moz-focusring to moz-focus-inner to match button ([#4567](https://github.com/material-components/material-components-web/issues/4567)) ([968a054](https://github.com/material-components/material-components-web/commit/968a054))
* **tabs:** Disable firefox focus ring ([#4560](https://github.com/material-components/material-components-web/issues/4560)) ([a99b7d4](https://github.com/material-components/material-components-web/commit/a99b7d4))
* **text-field:** add classes constant ([#4608](https://github.com/material-components/material-components-web/issues/4608)) ([22fa259](https://github.com/material-components/material-components-web/commit/22fa259))
* **text-field:** Fix for input alignment in textfield with trailing icon ([#4478](https://github.com/material-components/material-components-web/issues/4478)) ([b9c5fc6](https://github.com/material-components/material-components-web/commit/b9c5fc6))
* **text-field:** Fixed asterisk color where it stays in error color even after input is resolved ([#4576](https://github.com/material-components/material-components-web/issues/4576)) ([ca502d4](https://github.com/material-components/material-components-web/commit/ca502d4))
* **text-field:** Set character counter in setValue ([#4572](https://github.com/material-components/material-components-web/issues/4572)) ([bce2e63](https://github.com/material-components/material-components-web/commit/bce2e63))


### Code Refactoring

* Swap MDCTopAppBar Sass Variable Word Order ([#4498](https://github.com/material-components/material-components-web/issues/4498)) ([e851bae](https://github.com/material-components/material-components-web/commit/e851bae))


### Features

* **checkbox:** Toggle selected class with state ([#4612](https://github.com/material-components/material-components-web/issues/4612)) ([5f06dce](https://github.com/material-components/material-components-web/commit/5f06dce))
* **dialog:** Add feature targeting for styles ([#4524](https://github.com/material-components/material-components-web/issues/4524)) ([3556a93](https://github.com/material-components/material-components-web/commit/3556a93))
* **drawer:** Make list instance publicly accessible ([#4516](https://github.com/material-components/material-components-web/issues/4516)) ([f46941c](https://github.com/material-components/material-components-web/commit/f46941c))
* **fab:** Add feature targeting for styles ([#4526](https://github.com/material-components/material-components-web/issues/4526)) ([1ba7bdd](https://github.com/material-components/material-components-web/commit/1ba7bdd))
* **form-field:** add feature targeting for styles ([#4521](https://github.com/material-components/material-components-web/issues/4521)) ([cd04f82](https://github.com/material-components/material-components-web/commit/cd04f82))
* **grid-list:** Add feature targeting for styles ([#4534](https://github.com/material-components/material-components-web/issues/4534)) ([a8a6660](https://github.com/material-components/material-components-web/commit/a8a6660))
* **icon-button:** Add feature targeting for styles ([#4536](https://github.com/material-components/material-components-web/issues/4536)) ([a58f2d2](https://github.com/material-components/material-components-web/commit/a58f2d2))
* **image-list:** Add feature targeting for styles ([#4535](https://github.com/material-components/material-components-web/issues/4535)) ([0bfeabb](https://github.com/material-components/material-components-web/commit/0bfeabb))
* **list:** Add disabled class name to constants ([#4558](https://github.com/material-components/material-components-web/issues/4558)) ([f2db177](https://github.com/material-components/material-components-web/commit/f2db177))
* **list:** Automatically use appropriate aria attribute for single selection list. ([#4479](https://github.com/material-components/material-components-web/issues/4479)) ([077c809](https://github.com/material-components/material-components-web/commit/077c809))
* **menu:** Added new API to manually set focus when menu is opened ([#4468](https://github.com/material-components/material-components-web/issues/4468)) ([42ae5c3](https://github.com/material-components/material-components-web/commit/42ae5c3))
* **menu:** Focus management features & accessibility improvements ([#4587](https://github.com/material-components/material-components-web/issues/4587)) ([8d91b93](https://github.com/material-components/material-components-web/commit/8d91b93))
* **tab:** Add Tab Sass mixins targeting active state colors ([#4522](https://github.com/material-components/material-components-web/issues/4522)) ([31376f7](https://github.com/material-components/material-components-web/commit/31376f7))
* **tab-bar:** Allow activation of tab without previous active tab ([#4615](https://github.com/material-components/material-components-web/issues/4615)) ([7d4124d](https://github.com/material-components/material-components-web/commit/7d4124d))
* **tabs:** Add active tab states mixin ([#4603](https://github.com/material-components/material-components-web/issues/4603)) ([0e9f3f5](https://github.com/material-components/material-components-web/commit/0e9f3f5))
* **text-field:** define icon's cssClasses ([#4614](https://github.com/material-components/material-components-web/issues/4614)) ([816139c](https://github.com/material-components/material-components-web/commit/816139c))
* **theme:** Add support for arbitrary CSS vars with fallback ([#4470](https://github.com/material-components/material-components-web/issues/4470)) ([0bfb393](https://github.com/material-components/material-components-web/commit/0bfb393))


### BREAKING CHANGES

* **menu:** New adapter methods to MDC List: `isRootFocused`. MDC Menu: Replaced adapter methods `isRootFocused`, `focusRoot` with `focusListRoot`. When using MDC List inside MDC Menu `tabindex` should be set on list root element where `role="menu"` is assigned.
* **list:** MDCList's `listElements` component API now includes disabled list items which previously returned only enabled list items.
* **menu:** Focus is no more set to first menu item when menu is opened. Introduced new API (`setDefaultFocusState()`) to set default focus state (`DefaultFocusState`) that will be used to focus every time when menu is opened. Also introduced new foundation & adapter methods to incorporate this change. Please use `setDefaultFocusItemIndex(DefaultFocusState.FIRST_ITEM)` method before menu open to retain previous behaviour.
* `$mdc-top-app-bar-prominent-dense-title-bottom-padding` is renamed to `$mdc-top-app-bar-dense-prominent-title-bottom-padding`



<a name="1.1.1"></a>
## [1.1.1](https://github.com/material-components/material-components-web/compare/v1.1.0...v1.1.1) (2019-04-08)


### Bug Fixes

* **chips:** Fix incorrect ripple effect on filter chip ([#4565](https://github.com/material-components/material-components-web/issues/4565)) ([60a268f](https://github.com/material-components/material-components-web/commit/60a268f))
* **list:** Add cursor: pointer for interactive list items ([#4563](https://github.com/material-components/material-components-web/issues/4563)) ([0bba1fa](https://github.com/material-components/material-components-web/commit/0bba1fa)), closes [#4557](https://github.com/material-components/material-components-web/issues/4557)
* **menu:** Fix selection group list item spacing ([#4517](https://github.com/material-components/material-components-web/issues/4517)) ([e9b7cca](https://github.com/material-components/material-components-web/commit/e9b7cca))
* **select:** Use correct shape category consistently with text-field ([#4553](https://github.com/material-components/material-components-web/issues/4553)) ([5d3e22f](https://github.com/material-components/material-components-web/commit/5d3e22f))
* **shape:** Allow percentage based global overrides ([#4548](https://github.com/material-components/material-components-web/issues/4548)) ([f648b2d](https://github.com/material-components/material-components-web/commit/f648b2d))
* **shape:** Fix errors related to multi-value shape categories ([#4547](https://github.com/material-components/material-components-web/issues/4547)) ([39214e4](https://github.com/material-components/material-components-web/commit/39214e4))
* **tab:** Fix tab icon color mixin to support SVG icons. ([#4540](https://github.com/material-components/material-components-web/issues/4540)) ([13326b6](https://github.com/material-components/material-components-web/commit/13326b6))
* **tab:** Update moz-focusring to moz-focus-inner to match button ([#4567](https://github.com/material-components/material-components-web/issues/4567)) ([b99d2c5](https://github.com/material-components/material-components-web/commit/b99d2c5))
* **tabs:** Disable firefox focus ring ([#4560](https://github.com/material-components/material-components-web/issues/4560)) ([1a7ddb1](https://github.com/material-components/material-components-web/commit/1a7ddb1))
* **text-field:** Set character counter in setValue ([#4572](https://github.com/material-components/material-components-web/issues/4572)) ([7261fd0](https://github.com/material-components/material-components-web/commit/7261fd0))



<a name="1.1.0"></a>
# [1.1.0](https://github.com/material-components/material-components-web/compare/v1.0.0...v1.1.0) (2019-03-26)


### Bug Fixes

* **card:** Use on-surface color for action icons ([#4519](https://github.com/material-components/material-components-web/issues/4519)) ([34fb821](https://github.com/material-components/material-components-web/commit/34fb821))
* **menu:** Fix selection group list item spacing ([#4517](https://github.com/material-components/material-components-web/issues/4517)) ([8a1de5b](https://github.com/material-components/material-components-web/commit/8a1de5b))
* **menu:** Use on-surface color for graphic/meta content ([#4520](https://github.com/material-components/material-components-web/issues/4520)) ([499d286](https://github.com/material-components/material-components-web/commit/499d286))
* **text-field:** Fix for input alignment in textfield with trailing icon ([#4478](https://github.com/material-components/material-components-web/issues/4478)) ([7c9793b](https://github.com/material-components/material-components-web/commit/7c9793b))


### Features

* **dialog:** Add feature targeting for styles ([#4524](https://github.com/material-components/material-components-web/issues/4524)) ([690036f](https://github.com/material-components/material-components-web/commit/690036f))
* **drawer:** Make list instance publicly accessible ([#4516](https://github.com/material-components/material-components-web/issues/4516)) ([798108b](https://github.com/material-components/material-components-web/commit/798108b))
* **fab:** Add feature targeting for styles ([#4526](https://github.com/material-components/material-components-web/issues/4526)) ([5676d70](https://github.com/material-components/material-components-web/commit/5676d70))
* **form-field:** add feature targeting for styles ([#4521](https://github.com/material-components/material-components-web/issues/4521)) ([11eb357](https://github.com/material-components/material-components-web/commit/11eb357))
* **grid-list:** Add feature targeting for styles ([#4534](https://github.com/material-components/material-components-web/issues/4534)) ([3a3c74c](https://github.com/material-components/material-components-web/commit/3a3c74c))
* **icon-button:** Add feature targeting for styles ([#4536](https://github.com/material-components/material-components-web/issues/4536)) ([ab8beeb](https://github.com/material-components/material-components-web/commit/ab8beeb))
* **image-list:** Add feature targeting for styles ([#4535](https://github.com/material-components/material-components-web/issues/4535)) ([1046258](https://github.com/material-components/material-components-web/commit/1046258))
* **list:** Automatically use appropriate aria attribute for single selection list. ([#4479](https://github.com/material-components/material-components-web/issues/4479)) ([3804743](https://github.com/material-components/material-components-web/commit/3804743))
* **tab:** Add Tab Sass mixins targeting active state colors ([#4522](https://github.com/material-components/material-components-web/issues/4522)) ([3666c80](https://github.com/material-components/material-components-web/commit/3666c80))
* **theme:** Add support for arbitrary CSS vars with fallback ([#4470](https://github.com/material-components/material-components-web/issues/4470)) ([b4b954b](https://github.com/material-components/material-components-web/commit/b4b954b))



<a name="1.0.1"></a>
## [1.0.1](https://github.com/material-components/material-components-web/compare/v1.0.0...v1.0.1) (2019-03-11)


### Bug Fixes

* **feature-targeting:** Move ripple styles into separate mixins ([#4454](https://github.com/material-components/material-components-web/issues/4454)) ([f53aacc](https://github.com/material-components/material-components-web/commit/f53aacc))
* Don't import * from focus-trap to avoid default export confusion ([#4485](https://github.com/material-components/material-components-web/issues/4485)) ([bd3d946](https://github.com/material-components/material-components-web/commit/bd3d946))



<a name="1.0.0"></a>
# [1.0.0](https://github.com/material-components/material-components-web/compare/v0.44.1...v1.0.0) (2019-03-06)


### Bug Fixes

* **list:** Update default notifyAction impl to emit object ([#4356](https://github.com/material-components/material-components-web/issues/4356)) ([ed1aeb2](https://github.com/material-components/material-components-web/commit/ed1aeb2)), closes [#4355](https://github.com/material-components/material-components-web/issues/4355)
* **menu:** Read index property from list item event detail ([#4368](https://github.com/material-components/material-components-web/issues/4368)) ([5eb5a01](https://github.com/material-components/material-components-web/commit/5eb5a01)), closes [#4356](https://github.com/material-components/material-components-web/issues/4356)
* **ripple:** Use mdc-dom.matches everywhere ([#4372](https://github.com/material-components/material-components-web/issues/4372)) ([a2aa3c8](https://github.com/material-components/material-components-web/commit/a2aa3c8)), closes [#4340](https://github.com/material-components/material-components-web/issues/4340)
* **text-field:** Set char counter text not to wrap ([#4423](https://github.com/material-components/material-components-web/issues/4423)) ([9b7dce7](https://github.com/material-components/material-components-web/commit/9b7dce7))
* **menu-surface:** Fix anchorElement initialization ([#4462](https://github.com/material-components/material-components-web/issues/4462)) ([2025c8b](https://github.com/material-components/material-components-web/commit/2025c8b))
* **package:** Fix module declaration names in dist d.ts files ([#4476](https://github.com/material-components/material-components-web/issues/4476)) ([872b39f](https://github.com/material-components/material-components-web/commit/872b39f))
* **list:** Remove unused adapter.removeAttributeForElementIndex ([#4473](https://github.com/material-components/material-components-web/issues/4473)) ([6b3a419](https://github.com/material-components/material-components-web/commit/6b3a419))


### Code Refactoring

* **animation:** Remove `transformStyleProperties` export ([#4453](https://github.com/material-components/material-components-web/issues/4453)) ([aa44991](https://github.com/material-components/material-components-web/commit/aa44991)), closes [/github.com/material-components/material-components-web/pull/4407#discussion_r258668567](https://github.com//github.com/material-components/material-components-web/pull/4407/issues/discussion_r258668567)


### Features

* Convert packages to TypeScript ([#4451](https://github.com/material-components/material-components-web/issues/4451)) ([ad5743a](https://github.com/material-components/material-components-web/commit/ad5743a))
* **feature-targeting:** Elevation, ripple, theme, typography ([#4383](https://github.com/material-components/material-components-web/issues/4383)) ([4c2a63c](https://github.com/material-components/material-components-web/commit/4c2a63c))
* **feature-targeting:** Rename main mixins to end with `-core-styles` ([#4404](https://github.com/material-components/material-components-web/issues/4404)) ([3102351](https://github.com/material-components/material-components-web/commit/3102351))
* **menu-surface:** Update setPosition adapter API to use numeric values ([#4351](https://github.com/material-components/material-components-web/issues/4351)) ([701ed5c](https://github.com/material-components/material-components-web/commit/701ed5c)), closes [#4273](https://github.com/material-components/material-components-web/issues/4273)
* **ripple:** Reduce press opacity by 25% ([#4350](https://github.com/material-components/material-components-web/issues/4350)) ([f5d2170](https://github.com/material-components/material-components-web/commit/f5d2170))
* **shape:** add feature targeting to public mixins ([#4384](https://github.com/material-components/material-components-web/issues/4384)) ([e0860dd](https://github.com/material-components/material-components-web/commit/e0860dd))
* **tab:** Implement a base states color mixin for Tab ([#4421](https://github.com/material-components/material-components-web/issues/4421)) ([35c3721](https://github.com/material-components/material-components-web/commit/35c3721))


### BREAKING CHANGES

* The previously deprecated mdc-icon-toggle package has been removed; use mdc-icon-button instead.
* **animation:** The `transformStyleProperties` array export has been removed from `mdc-animation`. Please use `getCorrectPropertyName(window, 'transform')` instead.
* **ripple:** `getMatchesProperty()` has been removed from `@material/ripple/util` and `@material/tab-scroller/util`. Use `matches()` from `@material/dom/ponyfill` instead.
* **feature-targeting:** The main mixins recently introduced to some packages in in v0.44.0 have been renamed from `mdc-foo` to `mdc-foo-core-styles`. (Importing baseline styles via `mdc-foo.scss` remains unaffected.)
* **list:** The default `MDCListAdapter#notifyAction` implementation now emits an object of type `{index: number}` rather than a primitive `number` directly.
* **menu-surface:** `MDCMenuSurfaceAdapter#setPosition` now expects an object with properties of type `number` rather than `string`. E.g., `setPosition({top: '5px', left: '10px'})` is now `setPosition({top: 5, left: 10})`.
* **list:** Removed `MDCListAdapter#removeAttributeForElementIndex`



<a name="0.44.1"></a>
## [0.44.1](https://github.com/material-components/material-components-web/compare/v0.44.0...v0.44.1) (2019-02-19)


### Bug Fixes

* **chips:** Flip leading icon margin when used in RTL contexts ([#4380](https://github.com/material-components/material-components-web/issues/4380)) ([10a384f](https://github.com/material-components/material-components-web/commit/10a384f))
* **chips:** Use required pixel value ([#4361](https://github.com/material-components/material-components-web/issues/4361)) ([7dc2125](https://github.com/material-components/material-components-web/commit/7dc2125))
* **feature-targeting:** fix incorrect list construction ([#4419](https://github.com/material-components/material-components-web/issues/4419)) ([37f2044](https://github.com/material-components/material-components-web/commit/37f2044))
* **floating-label:** Add missing import to mixins ([#4434](https://github.com/material-components/material-components-web/issues/4434)) ([cd1d9fb](https://github.com/material-components/material-components-web/commit/cd1d9fb))
* **menu-surface:** Correct open animation issue ([#4371](https://github.com/material-components/material-components-web/issues/4371)) ([189957b](https://github.com/material-components/material-components-web/commit/189957b))
* **text-field:** Fix placeholder styles for text field fullwidth variant. ([#4385](https://github.com/material-components/material-components-web/issues/4385)) ([1edc29f](https://github.com/material-components/material-components-web/commit/1edc29f))



<a name="0.44.0"></a>
# [0.44.0](https://github.com/material-components/material-components-web/compare/v0.43.0...v0.44.0) (2019-02-04)


### Bug Fixes

* **drawer:** Fix restore & release focus order when closing the drawer ([#4304](https://github.com/material-components/material-components-web/issues/4304)) ([dffbcc1](https://github.com/material-components/material-components-web/commit/dffbcc1))
* **drawer:** Use parentNode DOM API when selecting scrim to make it work with Shadow DOM ([#4265](https://github.com/material-components/material-components-web/issues/4265)) ([385a223](https://github.com/material-components/material-components-web/commit/385a223))
* **feature-targeting:** prevent accidental nesting of mdc-feature-targets mixin ([#4281](https://github.com/material-components/material-components-web/issues/4281)) ([3405bc4](https://github.com/material-components/material-components-web/commit/3405bc4))
* **menu:** Updated menu to use list's custom event ([#4151](https://github.com/material-components/material-components-web/issues/4151)) ([a4e08f1](https://github.com/material-components/material-components-web/commit/a4e08f1))
* **text-field:** Fix textfield placeholder & outline stroke animation ([#4310](https://github.com/material-components/material-components-web/issues/4310)) ([58c3b4d](https://github.com/material-components/material-components-web/commit/58c3b4d))
* **text-field:** Reset z-index property of chrome autofill box ([#4232](https://github.com/material-components/material-components-web/issues/4232)) ([e718cb2](https://github.com/material-components/material-components-web/commit/e718cb2))
* **text-field:** Update closure type for rippleFactory ([#4324](https://github.com/material-components/material-components-web/issues/4324)) ([7a4a707](https://github.com/material-components/material-components-web/commit/7a4a707))


### Features

* **card:** add feature targeting for styles ([#4301](https://github.com/material-components/material-components-web/issues/4301)) ([92db33b](https://github.com/material-components/material-components-web/commit/92db33b))
* **checkbox:** add feature targeting to remaining public mixins ([#4315](https://github.com/material-components/material-components-web/issues/4315)) ([4bc18d1](https://github.com/material-components/material-components-web/commit/4bc18d1))
* **chips:** Move logic for calculating chip bounding rect into a foundation method ([#4243](https://github.com/material-components/material-components-web/issues/4243)) ([b30f5e2](https://github.com/material-components/material-components-web/commit/b30f5e2))
* **list:** add feature targeting for styles ([#4303](https://github.com/material-components/material-components-web/issues/4303)) ([c994156](https://github.com/material-components/material-components-web/commit/c994156))
* **list:** Add notifyAction adapter for action on list item. ([#4144](https://github.com/material-components/material-components-web/issues/4144)) ([6ed35b1](https://github.com/material-components/material-components-web/commit/6ed35b1))
* **menu:** add feature targeting for styles ([#4278](https://github.com/material-components/material-components-web/issues/4278)) ([97a8585](https://github.com/material-components/material-components-web/commit/97a8585))
* **menu:** add feature targeting to remaining public mixins ([#4317](https://github.com/material-components/material-components-web/issues/4317)) ([5928c00](https://github.com/material-components/material-components-web/commit/5928c00))
* **menu-surface:** add feature targeting for styles ([#4279](https://github.com/material-components/material-components-web/issues/4279)) ([56b8467](https://github.com/material-components/material-components-web/commit/56b8467))
* **radio:** add feature targeting for styles ([#4270](https://github.com/material-components/material-components-web/issues/4270)) ([eb8b8f6](https://github.com/material-components/material-components-web/commit/eb8b8f6))
* **radio:** add feature targeting to remaining public mixins ([#4318](https://github.com/material-components/material-components-web/issues/4318)) ([9f8ee9e](https://github.com/material-components/material-components-web/commit/9f8ee9e))
* **switch:** add feature targeting for styles ([#4275](https://github.com/material-components/material-components-web/issues/4275)) ([4836293](https://github.com/material-components/material-components-web/commit/4836293))
* Add feature targeting support and apply to mdc-button ([#4228](https://github.com/material-components/material-components-web/issues/4228)) ([531dffb](https://github.com/material-components/material-components-web/commit/531dffb))
* **text-field:** Added support for character counter. ([#4244](https://github.com/material-components/material-components-web/issues/4244)) ([0bcc0e7](https://github.com/material-components/material-components-web/commit/0bcc0e7))
* **text-field:** Added support for text field without label ([#4285](https://github.com/material-components/material-components-web/issues/4285)) ([bf956fa](https://github.com/material-components/material-components-web/commit/bf956fa))
* **typography:** add feature targeting for styles ([#4305](https://github.com/material-components/material-components-web/issues/4305)) ([8691cf8](https://github.com/material-components/material-components-web/commit/8691cf8))


### BREAKING CHANGES

* **text-field:** Helper text must now be nested within `mdc-text-field-helper-line` element. Wrappers must account for the new `character-counter` sub-component. See the Text Field documentation for examples and more information.
* **menu:** Replaced menu's foundation methods `handleClick` and `handleSelection` with `handleItemAction` to handle list item action (i.e., list's custom event `MDCList:action`)
* **list:** Removed adapter method `followHref` and used native anchor element behaviour to follow href on <kbd>Enter</kbd> & click. Components that use MDC List should use its new custom event.
* **chips:** Adds 3 new chips adapter methods: `hasLeadingIcon`, `getRootBoundingClientRect`, and `getCheckmarkBoundingClientRect`. Also adds a new foundation method: `getDimensions`.



<a name="0.43.1"></a>
## [0.43.1](https://github.com/material-components/material-components-web/compare/v0.43.0...v0.43.1) (2019-01-22)


### Bug Fixes

* **text-field:** Reset z-index property of chrome autofill box ([#4232](https://github.com/material-components/material-components-web/issues/4232)) ([9e06b77](https://github.com/material-components/material-components-web/commit/9e06b77))


<a name="0.43.0"></a>
# [0.43.0](https://github.com/material-components/material-components-web/compare/v0.42.0...v0.43.0) (2019-01-07)


### Bug Fixes

* **drawer:** Upgrade focus-trap version in drawer & dialog ([#4217](https://github.com/material-components/material-components-web/issues/4217)) ([ea37b07](https://github.com/material-components/material-components-web/commit/ea37b07))
* **list:** Accept array of index for selectedIndex API ([#4124](https://github.com/material-components/material-components-web/issues/4124)) ([be070a4](https://github.com/material-components/material-components-web/commit/be070a4))
* **notched-outline:** Fix label overflow ([#4171](https://github.com/material-components/material-components-web/issues/4171)) ([145db1f](https://github.com/material-components/material-components-web/commit/145db1f))
* **notched-outline:** fix missing shape functions import ([#4224](https://github.com/material-components/material-components-web/issues/4224)) ([96f663e](https://github.com/material-components/material-components-web/commit/96f663e))
* **package:** Add source-map files to npm releases ([#4206](https://github.com/material-components/material-components-web/issues/4206)) ([9d6375b](https://github.com/material-components/material-components-web/commit/9d6375b))
* **snackbar:** Rename action/dismiss classes and revise docs/tests ([#4203](https://github.com/material-components/material-components-web/issues/4203)) ([673dba2](https://github.com/material-components/material-components-web/commit/673dba2))


### Features

* **button:** Add trailing icon support via label element ([#4159](https://github.com/material-components/material-components-web/issues/4159)) ([fa41579](https://github.com/material-components/material-components-web/commit/fa41579))
* **checkbox:** Declare all Sass variables as `!default` ([de6c833](https://github.com/material-components/material-components-web/commit/de6c833)), closes [#3708](https://github.com/material-components/material-components-web/issues/3708)
* **snackbar:** Update to match latest design guidelines ([#4166](https://github.com/material-components/material-components-web/issues/4166)) ([33d30e6](https://github.com/material-components/material-components-web/commit/33d30e6)), closes [#4005](https://github.com/material-components/material-components-web/issues/4005) [#3981](https://github.com/material-components/material-components-web/issues/3981) [#2916](https://github.com/material-components/material-components-web/issues/2916) [#2628](https://github.com/material-components/material-components-web/issues/2628) [#1466](https://github.com/material-components/material-components-web/issues/1466) [#1398](https://github.com/material-components/material-components-web/issues/1398) [#1258](https://github.com/material-components/material-components-web/issues/1258) [#11](https://github.com/material-components/material-components-web/issues/11) [#2813](https://github.com/material-components/material-components-web/issues/2813)
* **tab:** Get tabs by their ID ([#4149](https://github.com/material-components/material-components-web/issues/4149)) ([2d35220](https://github.com/material-components/material-components-web/commit/2d35220))


### BREAKING CHANGES

* **list:** Introduced new adapter `isFocusInsideList` for MDC List for improved accessibility.
* **snackbar:** Snackbar's DOM and APIs have changed to match the latest design guidelines. See the Snackbar documentation for more information.
* **button:** We recommend placing each button's text label within a `mdc-button__label` element. This does not immediately break existing MDC Button usage, but updating is recommended to future-proof against potential upcoming changes.
* **tab:** `MDCTabBar#getIndexOfTab(tab: MDCTab): number` is now `MDCTabBar#getIndexOfTabById(id: string): number`



<a name="0.42.1"></a>
## [0.42.1](https://github.com/material-components/material-components-web/compare/v0.42.0...v0.42.1) (2018-12-17)


### Bug Fixes

* **menu:** Increase specificity of selection group class ([#4172](https://github.com/material-components/material-components-web/issues/4172)) ([870b234](https://github.com/material-components/material-components-web/commit/870b234))
* **menu-surface:** Raise z-index over MDC Dialog ([#4185](https://github.com/material-components/material-components-web/issues/4185)) ([49233a8](https://github.com/material-components/material-components-web/commit/49233a8))
* **slider:** Don't throw error when markup min is greater than default max ([#3315](https://github.com/material-components/material-components-web/issues/3315)) ([8d461be](https://github.com/material-components/material-components-web/commit/8d461be)), closes [#2269](https://github.com/material-components/material-components-web/issues/2269)
* **text-field:** Don't move caret when value has not changed ([#4160](https://github.com/material-components/material-components-web/issues/4160)) ([31f5d9c](https://github.com/material-components/material-components-web/commit/31f5d9c))
* **text-field:** Restrict resize to vertical for full width text area ([#4167](https://github.com/material-components/material-components-web/issues/4167)) ([8e6b968](https://github.com/material-components/material-components-web/commit/8e6b968))



<a name="0.42.0"></a>
# [0.42.0](https://github.com/material-components/material-components-web/compare/v0.41.0...v0.42.0) (2018-12-04)


### Bug Fixes

* **card:** Corrected baseline shape value of card small => medium ([#4060](https://github.com/material-components/material-components-web/issues/4060)) ([acb9443](https://github.com/material-components/material-components-web/commit/acb9443))
* **card:** Update elevation to match spec ([#4040](https://github.com/material-components/material-components-web/issues/4040)) ([a6b028d](https://github.com/material-components/material-components-web/commit/a6b028d))
* **checkbox:** remove adapter.getNativeCb and move property hooks to component ([#4073](https://github.com/material-components/material-components-web/issues/4073)) ([5ab68fe](https://github.com/material-components/material-components-web/commit/5ab68fe))
* **dialog:** Cancel open's rAF when close is called ([#4087](https://github.com/material-components/material-components-web/issues/4087)) ([2516c25](https://github.com/material-components/material-components-web/commit/2516c25))
* **dialog:** Release focus after style changes on close ([#4069](https://github.com/material-components/material-components-web/issues/4069)) ([e12997a](https://github.com/material-components/material-components-web/commit/e12997a))
* **drawer:** allow drawer below top app bar ([#4028](https://github.com/material-components/material-components-web/issues/4028)) ([ebdb084](https://github.com/material-components/material-components-web/commit/ebdb084))
* **drawer:** check for existence of ANIMATE class name in isOpening condition ([#4078](https://github.com/material-components/material-components-web/issues/4078)) ([a4fd0a6](https://github.com/material-components/material-components-web/commit/a4fd0a6))
* **drawer:** Fix issue where drawer fires opened event twice. ([#4027](https://github.com/material-components/material-components-web/issues/4027)) ([72ef4e8](https://github.com/material-components/material-components-web/commit/72ef4e8))
* **fab:** Separate mixins for regular FAB and Extended FAB ([#4082](https://github.com/material-components/material-components-web/issues/4082)) ([003e95f](https://github.com/material-components/material-components-web/commit/003e95f))
* **list:** Fix font size and placement for avatar graphic ([#4021](https://github.com/material-components/material-components-web/issues/4021)) ([5abe685](https://github.com/material-components/material-components-web/commit/5abe685))
* **list:** Update ARIA attributes for radio/checkbox based list ([#4055](https://github.com/material-components/material-components-web/issues/4055)) ([76b404e](https://github.com/material-components/material-components-web/commit/76b404e))
* **ripple:** Suppress before/after when color is transparent ([#4112](https://github.com/material-components/material-components-web/issues/4112)) ([2e2b227](https://github.com/material-components/material-components-web/commit/2e2b227))
* **select:** Add missing exports ([#4129](https://github.com/material-components/material-components-web/issues/4129)) ([dbc429a](https://github.com/material-components/material-components-web/commit/dbc429a))
* **select:** Enhanced select doesn't wrap focus ([#4083](https://github.com/material-components/material-components-web/issues/4083)) ([c640d50](https://github.com/material-components/material-components-web/commit/c640d50))
* **select:** Remove style customization for native select > option ([#4089](https://github.com/material-components/material-components-web/issues/4089)) ([379c522](https://github.com/material-components/material-components-web/commit/379c522))
* **shape:** Add noflip comments, fix RTL for categories ([#4116](https://github.com/material-components/material-components-web/issues/4116)) ([62054f8](https://github.com/material-components/material-components-web/commit/62054f8))
* **text-field:** Send client position to line ripple for touch events ([#4084](https://github.com/material-components/material-components-web/issues/4084)) ([95c0a98](https://github.com/material-components/material-components-web/commit/95c0a98))
* **top-app-bar:** Move scroll target initialization; improve test ([#4106](https://github.com/material-components/material-components-web/issues/4106)) ([f799659](https://github.com/material-components/material-components-web/commit/f799659))


### Code Refactoring

* **notched-outline:** Refactor notched outline to use 3 divs ([#4035](https://github.com/material-components/material-components-web/issues/4035)) ([9741233](https://github.com/material-components/material-components-web/commit/9741233))


### Features

* **text-field:** Add focus API to component ([#4020](https://github.com/material-components/material-components-web/issues/4020)) ([edcb939](https://github.com/material-components/material-components-web/commit/edcb939))


### BREAKING CHANGES

* **notched-outline:** The notched outline has been changed from using an SVG for the outline to using 3 div elements. This approach resolves initial rendering issues as well as inconsistencies between the different types of outlines. Please refer to the [Readme](./packages/mdc-notched-outline/README.md) or the [screenshot test pages](./test/screenshot/spec/mdc-textfield/classes) for details and examples.
* **checkbox:** The component is now responsible for calling `MDCCheckboxFoundation#handleChange` when the checked and indeterminate properties change.
* **list:** Replaced toggleCheckbox adapter method with `setCheckedCheckboxOrRadioAtIndex` and added 3 more new adapter methods for improved accessibility.
* **fab:** Fab now has 2 separate mixins - `mdc-fab-shape-radius` for regular / mini Fab variants & `mdc-fab-extended-shape-radius` for Extended FAB variant.



<a name="0.41.1"></a>
## [0.41.1](https://github.com/material-components/material-components-web/compare/v0.41.0...v0.41.1) (2018-11-14)


### Bug Fixes

* **card:** Corrected baseline shape value of card small => medium ([#4060](https://github.com/material-components/material-components-web/issues/4060)) ([875b159](https://github.com/material-components/material-components-web/commit/875b159))
* **drawer:** allow drawer below top app bar ([#4028](https://github.com/material-components/material-components-web/issues/4028)) ([1eff602](https://github.com/material-components/material-components-web/commit/1eff602))
* **drawer:** Fix issue where drawer fires opened event twice. ([#4027](https://github.com/material-components/material-components-web/issues/4027)) ([4a5a8e2](https://github.com/material-components/material-components-web/commit/4a5a8e2))



<a name="0.41.0"></a>
# [0.41.0](https://github.com/material-components/material-components-web/compare/v0.40.0...v0.41.0) (2018-10-29)


### Bug Fixes

* **dialog:** Apply max-width to same element as min-width ([#3749](https://github.com/material-components/material-components-web/issues/3749)) ([2dac7e1](https://github.com/material-components/material-components-web/commit/2dac7e1))
* **drawer:** link to the es6 component js file in screenshot spec ([#3696](https://github.com/material-components/material-components-web/issues/3696)) ([8d96a72](https://github.com/material-components/material-components-web/commit/8d96a72))
* **drawer:** Remove redundant style ([#3731](https://github.com/material-components/material-components-web/issues/3731)) ([716da5a](https://github.com/material-components/material-components-web/commit/716da5a))
* **drawer:** Remove unnecessary Closure annotation ([#3935](https://github.com/material-components/material-components-web/issues/3935)) ([61128be](https://github.com/material-components/material-components-web/commit/61128be))
* **floating-label:** Add alternate tag ([#3993](https://github.com/material-components/material-components-web/issues/3993)) ([6307071](https://github.com/material-components/material-components-web/commit/6307071))
* **list:** Peace out whitespace ([#3997](https://github.com/material-components/material-components-web/issues/3997)) ([19b5152](https://github.com/material-components/material-components-web/commit/19b5152))
* **menu:** Allow anchor links as menu list items ([#3680](https://github.com/material-components/material-components-web/issues/3680)) ([d312271](https://github.com/material-components/material-components-web/commit/d312271))
* **notched-outline:** Add noflip annotation ([#3994](https://github.com/material-components/material-components-web/issues/3994)) ([c60d42b](https://github.com/material-components/material-components-web/commit/c60d42b))
* **notched-outline:** Auto position the notch and floating label based on corner size ([#3929](https://github.com/material-components/material-components-web/issues/3929)) ([06daf52](https://github.com/material-components/material-components-web/commit/06daf52))
* **radio:** remove getNativeControl from adapter ([#3785](https://github.com/material-components/material-components-web/issues/3785)) ([476130e](https://github.com/material-components/material-components-web/commit/476130e))
* **ripple:** Deactivate on contextmenu event ([#3759](https://github.com/material-components/material-components-web/issues/3759)) ([4d76e3f](https://github.com/material-components/material-components-web/commit/4d76e3f))
* **shape:** Rename surface term with component. ([#3761](https://github.com/material-components/material-components-web/issues/3761)) ([81bb919](https://github.com/material-components/material-components-web/commit/81bb919))
* Future-proof Sass usage ([#3921](https://github.com/material-components/material-components-web/issues/3921)) ([6fa2269](https://github.com/material-components/material-components-web/commit/6fa2269))
* **text-field:** Fix textarea-shape-radius mixin behavior for input ([#3982](https://github.com/material-components/material-components-web/issues/3982)) ([1167289](https://github.com/material-components/material-components-web/commit/1167289))
* **textfield:** Use theme mixin for asterisk color ([#3952](https://github.com/material-components/material-components-web/issues/3952)) ([981b37e](https://github.com/material-components/material-components-web/commit/981b37e))
* **theme:** Make $mdc-theme-on-error dark if $mdc-theme-error is light ([#3678](https://github.com/material-components/material-components-web/issues/3678)) ([5b1348c](https://github.com/material-components/material-components-web/commit/5b1348c))
* **typography:** Add alternate tag for line-height ([#3992](https://github.com/material-components/material-components-web/issues/3992)) ([f6acae8](https://github.com/material-components/material-components-web/commit/f6acae8))


### Features

* Update default npm export to ES5 js files ([#3245](https://github.com/material-components/material-components-web/issues/3245)) ([514f9f8](https://github.com/material-components/material-components-web/commit/514f9f8))
* **chips:** Make deselect and toggleSelect private. Update handleChipInteraction/Removal API ([#3617](https://github.com/material-components/material-components-web/issues/3617)) ([73ab5a0](https://github.com/material-components/material-components-web/commit/73ab5a0))
* **menu:** Expose handleSelection API to public ([#3950](https://github.com/material-components/material-components-web/issues/3950)) ([7f02a64](https://github.com/material-components/material-components-web/commit/7f02a64))
* **select:** Add enhanced select variant ([#3949](https://github.com/material-components/material-components-web/issues/3949)) ([35697a5](https://github.com/material-components/material-components-web/commit/35697a5))
* **tab-bar:** Add focusOnActivate flag ([#3748](https://github.com/material-components/material-components-web/issues/3748)) ([313618a](https://github.com/material-components/material-components-web/commit/313618a))


### BREAKING CHANGES

* Anyone intending to build MDC Web's ES2015+ sources must directly import `@material/foo/index`. `@material/foo` will now resolve to UMD modules.
* **select:** Several adapter APIs were added to support the enhanced variant. The drop-down arrow is now its own element. The change event is now MDCSelect:change for all variants. See the README for full details.
* **radio:** Removed getNativeControl from adapter, and subsequent foundation methods that called getNativeControl. Foundation methods removed: isChecked, setChecked, isDisabled, getValue, setValue.
* **shape:** Renamed shape global variables from `$mdc-shape-*-surface-radius` to `$mdc-shape-*-component-radius`
* **chips:** deselect and toggleSelect are private methods. handleChipInteraction and handleChipRemoval now accept chipId instead of an event.



<a name="0.40.1"></a>
## [0.40.1](https://github.com/material-components/material-components-web/compare/v0.40.0...v0.40.1) (2018-10-08)


### Bug Fixes

* **checkbox:** Added missing clearTimeout call to destroy method ([#3674](https://github.com/material-components/material-components-web/issues/3674)) ([6706919](https://github.com/material-components/material-components-web/commit/6706919))
* **chips:** Notify ChipSet when selected is set directly on the Chip ([#3601](https://github.com/material-components/material-components-web/issues/3601)) ([773e0f0](https://github.com/material-components/material-components-web/commit/773e0f0))
* **dialog:** Wait for rAF/timeout to apply open class ([#3682](https://github.com/material-components/material-components-web/issues/3682)) ([3206521](https://github.com/material-components/material-components-web/commit/3206521))
* **drawer:** Use rAF/setTimeout for opening class ([#3683](https://github.com/material-components/material-components-web/issues/3683)) ([8c8dee8](https://github.com/material-components/material-components-web/commit/8c8dee8))
* **floating-label:** Enforce text alignment ([#3684](https://github.com/material-components/material-components-web/issues/3684)) ([19d0ca1](https://github.com/material-components/material-components-web/commit/19d0ca1))
* **ripple:** Transition background-color to avoid flashes ([#3693](https://github.com/material-components/material-components-web/issues/3693)) ([17a5828](https://github.com/material-components/material-components-web/commit/17a5828))



<a name="0.40.0"></a>
# [0.40.0](https://github.com/material-components/material-components-web/compare/v0.39.0...v0.40.0) (2018-09-24)


### Bug Fixes

* **checkbox:** remove native control from getters/setters of foundation ([#3408](https://github.com/material-components/material-components-web/issues/3408)) ([b0fe9cf](https://github.com/material-components/material-components-web/commit/b0fe9cf))
* **dialog:** Add redlines to dialog screenshots; update to match spec ([#3602](https://github.com/material-components/material-components-web/issues/3602)) ([4da83dd](https://github.com/material-components/material-components-web/commit/4da83dd))
* **dialog:** Conform more closely with spec ([#3575](https://github.com/material-components/material-components-web/issues/3575)) ([359710d](https://github.com/material-components/material-components-web/commit/359710d))
* **dialog:** Increase z-index above Drawer ([#3597](https://github.com/material-components/material-components-web/issues/3597)) ([c1bd45a](https://github.com/material-components/material-components-web/commit/c1bd45a))
* **drawer:** Destroy list in destroy method ([#3474](https://github.com/material-components/material-components-web/issues/3474)) ([325317c](https://github.com/material-components/material-components-web/commit/325317c))
* **drawer:** Fix drawer content to have momentum scroll on iOS ([#3578](https://github.com/material-components/material-components-web/issues/3578)) ([c65be9b](https://github.com/material-components/material-components-web/commit/c65be9b))
* **drawer:** Modal --open state class needs display: flex ([#3431](https://github.com/material-components/material-components-web/issues/3431)) ([533a46f](https://github.com/material-components/material-components-web/commit/533a46f))
* **drawer:** Remove list item children to be included in click target. ([#3480](https://github.com/material-components/material-components-web/issues/3480)) ([cc3ae2f](https://github.com/material-components/material-components-web/commit/cc3ae2f))
* **icon-button:** remove unused ARIA_LABEL string from constants ([#3591](https://github.com/material-components/material-components-web/issues/3591)) ([bce1724](https://github.com/material-components/material-components-web/commit/bce1724))
* **infrastructure:** Update ff screenshot tests ([#3540](https://github.com/material-components/material-components-web/issues/3540)) ([16007f1](https://github.com/material-components/material-components-web/commit/16007f1))
* **list:** Always call followHref regardless of single-selection mode ([#3595](https://github.com/material-components/material-components-web/issues/3595)) ([b556724](https://github.com/material-components/material-components-web/commit/b556724))
* **list:** Change private getter method to public ([#3473](https://github.com/material-components/material-components-web/issues/3473)) ([f57c731](https://github.com/material-components/material-components-web/commit/f57c731))
* **list:** Update single line list to ellipsis ([#3460](https://github.com/material-components/material-components-web/issues/3460)) ([60cf6c5](https://github.com/material-components/material-components-web/commit/60cf6c5))
* **menu:** Prevent endless loop from unexpected markup ([#3489](https://github.com/material-components/material-components-web/issues/3489)) ([5dea634](https://github.com/material-components/material-components-web/commit/5dea634))
* **menu:** Remove max-width ([#3583](https://github.com/material-components/material-components-web/issues/3583)) ([c44ca61](https://github.com/material-components/material-components-web/commit/c44ca61))
* **menu:** Update styles to match guidance ([#3455](https://github.com/material-components/material-components-web/issues/3455)) ([5c01746](https://github.com/material-components/material-components-web/commit/5c01746))
* **menu-surface:** Fix absolute positioning for scrollX ([#3609](https://github.com/material-components/material-components-web/issues/3609)) ([4074535](https://github.com/material-components/material-components-web/commit/4074535))
* **menu-surface:** Fix interpolation in calc ([#3445](https://github.com/material-components/material-components-web/issues/3445)) ([7f14c72](https://github.com/material-components/material-components-web/commit/7f14c72))
* **ripple:** Change default color from black to on-surface ([#3554](https://github.com/material-components/material-components-web/issues/3554)) ([e203aa4](https://github.com/material-components/material-components-web/commit/e203aa4))
* **ripple:** Prevent ripple from getting cut out. ([#3521](https://github.com/material-components/material-components-web/issues/3521)) ([a8008f4](https://github.com/material-components/material-components-web/commit/a8008f4))
* **select:** Add missing mixin ([#3435](https://github.com/material-components/material-components-web/issues/3435)) ([e654526](https://github.com/material-components/material-components-web/commit/e654526))
* **select:** Fix dropdown color/opacity and options background ([#3553](https://github.com/material-components/material-components-web/issues/3553)) ([3e26342](https://github.com/material-components/material-components-web/commit/3e26342))
* **select:** Fix outlined select not changing color without label ([#3433](https://github.com/material-components/material-components-web/issues/3433)) ([a1c0930](https://github.com/material-components/material-components-web/commit/a1c0930))
* **select:** Only add line ripple listeners when line ripple is present ([#3470](https://github.com/material-components/material-components-web/issues/3470)) ([453b5c5](https://github.com/material-components/material-components-web/commit/453b5c5))
* **select:** Set transform origin for line ripple ([#3432](https://github.com/material-components/material-components-web/issues/3432)) ([0ff23e1](https://github.com/material-components/material-components-web/commit/0ff23e1))
* **tab-bar:** Remove trailing comma from function. ([#3574](https://github.com/material-components/material-components-web/issues/3574)) ([e201d24](https://github.com/material-components/material-components-web/commit/e201d24))
* **text-field:** Fix outlined disabled text color to match filled variant ([#3544](https://github.com/material-components/material-components-web/issues/3544)) ([0da74d9](https://github.com/material-components/material-components-web/commit/0da74d9))
* **theme:** Declare error variables as !default ([#3531](https://github.com/material-components/material-components-web/issues/3531)) ([eebdcdc](https://github.com/material-components/material-components-web/commit/eebdcdc))


### Features

* **checkbox:** Support customizing the color of the stroke in the marked state ([#3412](https://github.com/material-components/material-components-web/issues/3412)) ([7f47386](https://github.com/material-components/material-components-web/commit/7f47386))
* **chips:** Add a mixin to handle chip elevation transitions ([#3579](https://github.com/material-components/material-components-web/issues/3579)) ([eadde7a](https://github.com/material-components/material-components-web/commit/eadde7a))
* **chips:** Add mixins to customize horizontal padding and icon margins ([#3530](https://github.com/material-components/material-components-web/issues/3530)) ([43aeea4](https://github.com/material-components/material-components-web/commit/43aeea4))
* **dialog:** Initial prototype ([#3413](https://github.com/material-components/material-components-web/issues/3413)) ([9d133b2](https://github.com/material-components/material-components-web/commit/9d133b2))
* **dialog:** Integrate with MDC List; add keyboard action handling ([#3594](https://github.com/material-components/material-components-web/issues/3594)) ([7b6d86b](https://github.com/material-components/material-components-web/commit/7b6d86b))
* **dialog:** Reverse buttons when stacked; allow toggling auto-stack ([#3573](https://github.com/material-components/material-components-web/issues/3573)) ([2e7805b](https://github.com/material-components/material-components-web/commit/2e7805b))
* **dialog:** Support default action button ([#3600](https://github.com/material-components/material-components-web/issues/3600)) ([3aa18e2](https://github.com/material-components/material-components-web/commit/3aa18e2))
* **dialog:** Support reporting action in ancestor element ([#3572](https://github.com/material-components/material-components-web/issues/3572)) ([fcbef20](https://github.com/material-components/material-components-web/commit/fcbef20))
* **dom:** Add closest ponyfill ([#3559](https://github.com/material-components/material-components-web/issues/3559)) ([eddf66c](https://github.com/material-components/material-components-web/commit/eddf66c))
* **dom:** Create `mdc-dom` package with `Element.matches()` ponyfill ([#3515](https://github.com/material-components/material-components-web/issues/3515)) ([91d8fe8](https://github.com/material-components/material-components-web/commit/91d8fe8)), closes [#3413](https://github.com/material-components/material-components-web/issues/3413) [#1104](https://github.com/material-components/material-components-web/issues/1104)
* **drawer:** Allow customizing drawer width ([#3459](https://github.com/material-components/material-components-web/issues/3459)) ([247f75f](https://github.com/material-components/material-components-web/commit/247f75f))
* **drawer:** New sass mixin to set z-index ([#3453](https://github.com/material-components/material-components-web/issues/3453)) ([cf3084f](https://github.com/material-components/material-components-web/commit/cf3084f))
* **list:** Toggle radio checkbox ([#3546](https://github.com/material-components/material-components-web/issues/3546)) ([f59b6e6](https://github.com/material-components/material-components-web/commit/f59b6e6))
* **list:** Update list to toggle tabindex of radio/checkbox ([#3542](https://github.com/material-components/material-components-web/issues/3542)) ([13abb24](https://github.com/material-components/material-components-web/commit/13abb24))
* **shape:** Added Shape subsystem and integrated with all components ([#3626](https://github.com/material-components/material-components-web/issues/3626)) ([d5f0897](https://github.com/material-components/material-components-web/commit/d5f0897))
* **text-field:** Add support for leading/trailing icons at the same time ([#3451](https://github.com/material-components/material-components-web/issues/3451)) ([6b3cfe5](https://github.com/material-components/material-components-web/commit/6b3cfe5))
* **theme:** Add error and on-error support ([#3469](https://github.com/material-components/material-components-web/issues/3469)) ([b10095f](https://github.com/material-components/material-components-web/commit/b10095f))


### BREAKING CHANGES

* **shape:** The previous contents of the mdc-shape package have been removed and replaced with mixins implementing the Shape system. This system implements only rounded corners to provide a straightforward CSS-only solution. Replaced all *-corner-radius component mixins with *-shape-radius mixins to integrate with Shape system.
* **dialog:** MDCDialog has been reimplemented to support more use cases, so APIs and the DOM structure have changed. See the mdc-dialog README for more information.
* **text-field:** Component API's for interacting with icons has changed. Please refer to the documentation.
* **checkbox:** Remove foundation methods for set/get indeterminate, value, disabled. Add adapter methods: isIndeterminate, isChecked, hasNativeControl, setNativeControlDisabled.



<a name="0.39.3"></a>
## [0.39.3](https://github.com/material-components/material-components-web/compare/v0.39.1...v0.39.3) (2018-09-11)


### Bug Fixes

* **ripple:** Clean deactivation timer and CSS when interrupted ([#3529](https://github.com/material-components/material-components-web/issues/3529)) ([425df03](https://github.com/material-components/material-components-web/commit/425df03))
* **select:** Disabled color and opacity ([#3513](https://github.com/material-components/material-components-web/issues/3513)) ([8b10c02](https://github.com/material-components/material-components-web/commit/8b10c02))
* **select:** Remove blue background in IE on focus ([#3497](https://github.com/material-components/material-components-web/issues/3497)) ([a02a4f1](https://github.com/material-components/material-components-web/commit/a02a4f1)), closes [#3496](https://github.com/material-components/material-components-web/issues/3496)



<a name="0.39.1"></a>
## [0.39.1](https://github.com/material-components/material-components-web/compare/v0.39.0...v0.39.1) (2018-08-31)


### Bug Fixes

* **drawer:** Destroy list in destroy method ([#3474](https://github.com/material-components/material-components-web/issues/3474)) ([4719e0c](https://github.com/material-components/material-components-web/commit/4719e0c))
* **drawer:** Modal --open state class needs display: flex ([#3431](https://github.com/material-components/material-components-web/issues/3431)) ([7fe8a97](https://github.com/material-components/material-components-web/commit/7fe8a97))
* **drawer:** Remove list item children to be included in click target. ([#3480](https://github.com/material-components/material-components-web/issues/3480)) ([e05ca84](https://github.com/material-components/material-components-web/commit/e05ca84))
* **list:** Change private getter method to public ([#3473](https://github.com/material-components/material-components-web/issues/3473)) ([45f6be9](https://github.com/material-components/material-components-web/commit/45f6be9))
* **list:** Update single line list to ellipsis ([#3460](https://github.com/material-components/material-components-web/issues/3460)) ([148c1cd](https://github.com/material-components/material-components-web/commit/148c1cd))
* **menu:** Prevent endless loop from unexpected markup ([#3489](https://github.com/material-components/material-components-web/issues/3489)) ([730b176](https://github.com/material-components/material-components-web/commit/730b176))
* **menu:** Update styles to match guidance ([#3455](https://github.com/material-components/material-components-web/issues/3455)) ([3ef0ada](https://github.com/material-components/material-components-web/commit/3ef0ada))
* **menu-surface:** Fix interpolation in calc ([#3445](https://github.com/material-components/material-components-web/issues/3445)) ([7aa7804](https://github.com/material-components/material-components-web/commit/7aa7804))
* **select:** Add missing mixin ([#3435](https://github.com/material-components/material-components-web/issues/3435)) ([39f95a3](https://github.com/material-components/material-components-web/commit/39f95a3))
* **select:** Fix outlined select not changing color without label ([#3433](https://github.com/material-components/material-components-web/issues/3433)) ([dcd9466](https://github.com/material-components/material-components-web/commit/dcd9466))
* **select:** Only add line ripple listeners when line ripple is present ([#3470](https://github.com/material-components/material-components-web/issues/3470)) ([f9ef8f5](https://github.com/material-components/material-components-web/commit/f9ef8f5))
* **select:** Set transform origin for line ripple ([#3432](https://github.com/material-components/material-components-web/issues/3432)) ([251c95f](https://github.com/material-components/material-components-web/commit/251c95f))



<a name="0.39.0"></a>
# [0.39.0](https://github.com/material-components/material-components-web/compare/v0.39.0-0...v0.39.0) (2018-08-27)


### Bug Fixes

* **checkbox:** remove register/deregister event listeners from foundation ([#3402](https://github.com/material-components/material-components-web/issues/3402)) ([430b338](https://github.com/material-components/material-components-web/commit/430b338))
* **drawer:** Fix exports and closure tests ([#3424](https://github.com/material-components/material-components-web/issues/3424)) ([8d53068](https://github.com/material-components/material-components-web/commit/8d53068))
* **list:** Add support for activated ([#3388](https://github.com/material-components/material-components-web/issues/3388)) ([5590412](https://github.com/material-components/material-components-web/commit/5590412))
* **list:** Follow hrefs on keypresses on links ([#3407](https://github.com/material-components/material-components-web/issues/3407)) ([e6d6deb](https://github.com/material-components/material-components-web/commit/e6d6deb))
* **snackbar:** Allow variables to be customized ([#3335](https://github.com/material-components/material-components-web/issues/3335)) ([215d0c6](https://github.com/material-components/material-components-web/commit/215d0c6))
* **tab-bar:** Early exit ([#3386](https://github.com/material-components/material-components-web/issues/3386)) ([f0ebfea](https://github.com/material-components/material-components-web/commit/f0ebfea))
* **tab-bar:** Move activateTab to adapter ([#3394](https://github.com/material-components/material-components-web/issues/3394)) ([5007604](https://github.com/material-components/material-components-web/commit/5007604))
* **text-field:** Update to match spec ([#3397](https://github.com/material-components/material-components-web/issues/3397)) ([e34b251](https://github.com/material-components/material-components-web/commit/e34b251))
* **menu-surface:** Remove overflow hidden during menu-surface animation. ([#3358](https://github.com/material-components/material-components-web/issues/3358)) ([951a3ae](https://github.com/material-components/material-components-web/commit/951a3ae))
* **notched-outline:** Add alignment ([#3349](https://github.com/material-components/material-components-web/issues/3349)) ([ee93c61](https://github.com/material-components/material-components-web/commit/ee93c61))
* **snackbar:** Doesn't close while other element is focused ([#2183](https://github.com/material-components/material-components-web/issues/2183)) ([e161cc0](https://github.com/material-components/material-components-web/commit/e161cc0))
* **text-field:** Adjust the baseline of text field's helper text to match spec ([#3069](https://github.com/material-components/material-components-web/issues/3069)) ([36acc28](https://github.com/material-components/material-components-web/commit/36acc28))
* **text-field:** Fix label shake bug. Update invalid screenshots to show required star. ([#3338](https://github.com/material-components/material-components-web/issues/3338)) ([1245573](https://github.com/material-components/material-components-web/commit/1245573))
* **text-field:** Input position and textarea size ([#3321](https://github.com/material-components/material-components-web/issues/3321)) ([5160241](https://github.com/material-components/material-components-web/commit/5160241)), closes [#2826](https://github.com/material-components/material-components-web/issues/2826)


### Chores

* **list:** Remove all references to Element from MDCListAdapter ([#3398](https://github.com/material-components/material-components-web/issues/3398)) ([53f42b9](https://github.com/material-components/material-components-web/commit/53f42b9))
* **tab:** Move computeIndicatorClientRect logic out of the foundation ([#3367](https://github.com/material-components/material-components-web/issues/3367)) ([9cac7c0](https://github.com/material-components/material-components-web/commit/9cac7c0)), closes [#3341](https://github.com/material-components/material-components-web/issues/3341)


### Code Refactoring

* **text-field:** Change text-field--box to be the new default ([#2859](https://github.com/material-components/material-components-web/issues/2859)) ([01b6be7](https://github.com/material-components/material-components-web/commit/01b6be7))


### Features

* Update to MIT license ([#3376](https://github.com/material-components/material-components-web/issues/3376)) ([2cf8487](https://github.com/material-components/material-components-web/commit/2cf8487))
* **drawer:** Improved navigation drawer  ([#3417](https://github.com/material-components/material-components-web/issues/3417)) ([3aa211d](https://github.com/material-components/material-components-web/commit/3aa211d))
* **theme:** Added new function for text emphasis opacities ([f841afe](https://github.com/material-components/material-components-web/commit/f841afe))
* **chips:** Pass chip ids instead of foundations in events  ([#3265](https://github.com/material-components/material-components-web/issues/3265)) ([7ce0fba](https://github.com/material-components/material-components-web/commit/7ce0fba))
* **icon-button:** Add SVG support ([#3310](https://github.com/material-components/material-components-web/issues/3310)) ([25fa51e](https://github.com/material-components/material-components-web/commit/25fa51e))
* **menu:** Adds new menu, menu-surface. ([#3311](https://github.com/material-components/material-components-web/issues/3311)) ([6439c5b](https://github.com/material-components/material-components-web/commit/6439c5b))
* **switch:** Move component specific logic out of foundation ([#3342](https://github.com/material-components/material-components-web/issues/3342)) ([e1e4465](https://github.com/material-components/material-components-web/commit/e1e4465))
* **tab:** Move event registration to component ([#3331](https://github.com/material-components/material-components-web/issues/3331)) ([f2ac793](https://github.com/material-components/material-components-web/commit/f2ac793))
* **tab-bar:** Support manual and automatic activation behavior ([#3303](https://github.com/material-components/material-components-web/issues/3303)) ([7182fa1](https://github.com/material-components/material-components-web/commit/7182fa1))
* **tab-indicator:** Remove transitionend event handling ([#3337](https://github.com/material-components/material-components-web/issues/3337)) ([c8af69b](https://github.com/material-components/material-components-web/commit/c8af69b))
* **text-field:** New API to enable/disable native input validation for custom validity ([#3084](https://github.com/material-components/material-components-web/issues/3084)) ([bd49920](https://github.com/material-components/material-components-web/commit/bd49920))
* **text-field:** Support for types- color, date, datetime-local, etc ([#2854](https://github.com/material-components/material-components-web/issues/2854)) ([0d02f1f](https://github.com/material-components/material-components-web/commit/0d02f1f))
* **typography:** Reverted baseline mixin to use display inline-block because of IE issues ([#3297](https://github.com/material-components/material-components-web/issues/3297)) ([ded07d0](https://github.com/material-components/material-components-web/commit/ded07d0))


### BREAKING CHANGES

* **drawer:** Drawer variants have new DOM structure, mixins, and JS. MDCPersistentDrawer and MDCTemporaryDrawer components are replaced with a single MDCDrawer component which supports both.
* **list:** Please update calls to MDCListFoundation.handleKeydown to pass in isRootListItem and listItemIndex, and update both MDCListFoundation.handleFocusIn, MDCListFoundation.handleFocusOut to pass in listItemIndex
* **text-field:** This PR removes the margin-top from the mdc-text-field container. This can cause a UI to shift/change.
* **checkbox:** Event registration adapter APIs have been removed and are now the responsibility of the component.
* **list:** Adds a followHref adapter API.
* **text-field:** Removes the default version of the text field and changes the new default variant to be the `--box` variant. Changes the box-sizing to border-box.
* **tab-bar:** `getActiveTabIndex` adapter method renamed and `setActiveTab` adapter method added.
* **tab:** We've removed the `computeIndicatorClientRect` method from `MDCTabFoundation`
* **switch:** We've removed the `isChecked` and `isDisabled` methods from `MDCSwitchFoundation`. Please update any call to `MDCSwitchFoundation.handleChange` so it passes in the change event. And note that `isNativeControlChecked` and `isNativeControlDisabled` are no longer required methods in `MDCSwitchAdapter`
* **text-field:** Setting the validity state using `setValid` no longer ignores native input validation. New API `useNativeValidation` is introduced to enable / disable native validation for custom validity.
* **menu:** Menu positioning logic has been split into its own package (mdc-menu-surface). mdc-menu is rebuilt to use mdc-menu-surface and mdc-list styles and JavaScript.
* **text-field:** The `mdc-text-field--upgraded` class has been removed. `mdc-text-field__input` position has changed by 2px to match spec. `mdc-text-field--textarea` width in IE and Edge now matches other browsers.
* **tab:** Removes handleTransitionEnd foundation API. Removes [de]registerEventHandler adapter APIs. Event registration is now the component's responsibility.
* **icon-button:** Removes the previous data attributes and no longer dynamically changes the label. Allows developers to add both elements to the button, with one indicated as the on state by using a data-toggle-on attribute. State is now changed by adding/removing the mdc-icon-button--on class to the mdc-icon-button element. All icon elements should have the mdc-icon-button__icon class.
* **tab-indicator:** Removes handleTransitionEnd foundation API. Removes [de]registerEventHandler adapter APIs.
* **typography:** Helper text and MDC List two-line text that uses new typography baseline mixin should strip the white-space.
* **chips:** `MDCChip` takes an `id`, no longer exposes its `foundation`, and has `selected` as a property. Custom event details require a `chipId` instead of `chipFoundation`. New methods added to `MDCChipSetAdapter` and `MDCChipSetFoundation`.
* **text-field:** Removed bottom margin from both text field and helper text.
* **snackbar:** Adds a new adapter method that is required `isFocused`.
* **tab-bar:** Adds focusTabAtIndex and getFocusedTabIndex MDCTabBarAdapter APIs; adds focus MDCTab component API used by MDCTabBar.



<a name="0.38.2"></a>
## [0.38.2](https://github.com/material-components/material-components-web/compare/v0.38.1...v0.38.2) (2018-08-15)


### Bug Fixes

* **dialog:** Expose numbers on foundation ([#3346](https://github.com/material-components/material-components-web/issues/3346)) ([8aa7ae0](https://github.com/material-components/material-components-web/commit/8aa7ae0))



<a name="0.38.1"></a>
## [0.38.1](https://github.com/material-components/material-components-web/compare/v0.38.0...v0.38.1) (2018-08-13)


### Bug Fixes

* **dialog:** Fixes transitionend event not always being called ([#3267](https://github.com/material-components/material-components-web/issues/3267)) ([f4af684](https://github.com/material-components/material-components-web/commit/f4af684))
* **list:** Update clickable elements selector ([#3312](https://github.com/material-components/material-components-web/issues/3312)) ([c4fc932](https://github.com/material-components/material-components-web/commit/c4fc932))
* **radio:** Add missing `[@import](https://github.com/import)` for theme mixins; add screenshot tests ([#3285](https://github.com/material-components/material-components-web/issues/3285)) ([553438a](https://github.com/material-components/material-components-web/commit/553438a))
* **ripple:** Register focus/blur handlers in IE ([#3294](https://github.com/material-components/material-components-web/issues/3294)) ([1e10ac2](https://github.com/material-components/material-components-web/commit/1e10ac2))
* **select:** add adapter ([#3233](https://github.com/material-components/material-components-web/issues/3233)) ([3b20de8](https://github.com/material-components/material-components-web/commit/3b20de8))
* **text-field:** Set the margin for text-area helper text ([#3290](https://github.com/material-components/material-components-web/issues/3290)) ([e395bb3](https://github.com/material-components/material-components-web/commit/e395bb3))
* **text-field:** Stop emitting unused CSS in Text Field & Select ([#3293](https://github.com/material-components/material-components-web/issues/3293)) ([4041d9e](https://github.com/material-components/material-components-web/commit/4041d9e))



<a name="0.38.0"></a>
# [0.38.0](https://github.com/material-components/material-components-web/compare/v0.37.1...v0.38.0) (2018-07-30)


### Bug Fixes

* **chips:** Remove color change from selected filter chips ([#3093](https://github.com/material-components/material-components-web/issues/3093)) ([19e3d7f](https://github.com/material-components/material-components-web/commit/19e3d7f))
* **infrastructure:** Rework goog.module positioning ([#3098](https://github.com/material-components/material-components-web/issues/3098)) ([fbbf58a](https://github.com/material-components/material-components-web/commit/fbbf58a))
* **infrastructure:** update saucelabs windows 8 to windows 10 IE11 browser ([#3234](https://github.com/material-components/material-components-web/issues/3234)) ([547a980](https://github.com/material-components/material-components-web/commit/547a980))
* **list:** add list to webpack js bundler ([#3244](https://github.com/material-components/material-components-web/issues/3244)) ([b95d4e7](https://github.com/material-components/material-components-web/commit/b95d4e7))
* **theme:** Allow CSS variables to be passed to mdc-theme-prop ([#3086](https://github.com/material-components/material-components-web/issues/3086)) ([b47fe7d](https://github.com/material-components/material-components-web/commit/b47fe7d))


### Features

* **auto-init:** return initialized components ([#1333](https://github.com/material-components/material-components-web/issues/1333)) ([19955bf](https://github.com/material-components/material-components-web/commit/19955bf))
* **floating-label:** Add max-width mixin ([#2956](https://github.com/material-components/material-components-web/issues/2956)) ([66f8bf7](https://github.com/material-components/material-components-web/commit/66f8bf7))
* **chips:** Register handlers in component instead of foundation ([#3146](https://github.com/material-components/material-components-web/issues/3146)) ([36e2755](https://github.com/material-components/material-components-web/commit/36e2755))
* **icon-button:** update event handling to new standard ([#3165](https://github.com/material-components/material-components-web/issues/3165)) ([531867e](https://github.com/material-components/material-components-web/commit/531867e))
* **list:** Add single selection ([#2970](https://github.com/material-components/material-components-web/issues/2970)) ([cd1f972](https://github.com/material-components/material-components-web/commit/cd1f972))
* **list:** Updated two-line list to use typography baseline to match spec. ([#3085](https://github.com/material-components/material-components-web/issues/3085)) ([4d11b37](https://github.com/material-components/material-components-web/commit/4d11b37))
* **select:** reduce adapter apis not used in MDCReact and update events to new pattern ([#3204](https://github.com/material-components/material-components-web/issues/3204)) ([e29742a](https://github.com/material-components/material-components-web/commit/e29742a))
* **switch:** Merge updated switch into master ([#3214](https://github.com/material-components/material-components-web/issues/3214)) ([19724f1](https://github.com/material-components/material-components-web/commit/19724f1)), closes [#2825](https://github.com/material-components/material-components-web/issues/2825)
* **tab-bar:** Launch tab, tab indicator, tab scroller, tab bar ([#3252](https://github.com/material-components/material-components-web/issues/3252)) ([78bf4bc](https://github.com/material-components/material-components-web/commit/78bf4bc))
* **typography:** New mixin to set exact baseline height of text elements. ([#3083](https://github.com/material-components/material-components-web/issues/3083)) ([dd3817a](https://github.com/material-components/material-components-web/commit/dd3817a))


### BREAKING CHANGES

* **tab-bar:** mdc-tabs is deprecated and no longer bundled in the material-components-web package. You are encouraged to use the new mdc-tab-bar and related packages instead.
* **switch:** MDC Switch DOM structure and Sass APIs have changed, and JavaScript APIs have been added. See the documentation for more information.
* **icon-button:** Removed some adapter APIs (registerInteractionHandler, deregisterInteractionHandler) and shifted responsibility of event handling out of the foundation and into the component.
* **select:** Removed some adapter APIs (setDisabled, setSelectedIndex, getSelectedIndex, setValue, registerInteractionHandler, deregisterInteractionHandler) and shifted responsibility of event handling and programmatic select element updates out of the foundation and into the component.
* **chips:** `MDCChip`/`MDCChipSet` registerEventHandler adapter methods were removed, and corresponding handlers were made public in `MDCChipFoundation`/`MDCChipSetFoundation`.
* **list:** The layout of two-line list items is changed to wrap primary text line in a separate block element.


<a name="0.37.1"></a>
## [0.37.1](https://github.com/material-components/material-components-web/compare/v0.37.0...v0.37.1) (2018-07-16)


### Bug Fixes

* hot-patching closure annotations. ([#3024](https://github.com/material-components/material-components-web/issues/3024)) ([d5b95ab](https://github.com/material-components/material-components-web/commit/d5b95ab))
* **button:** Remove dense/stroked line-height tweaks to improve alignment ([#3028](https://github.com/material-components/material-components-web/issues/3028)) ([8b5f595](https://github.com/material-components/material-components-web/commit/8b5f595))
* **notched-outline:** Remove unused dependency from scss ([#3044](https://github.com/material-components/material-components-web/issues/3044)) ([85ecf11](https://github.com/material-components/material-components-web/commit/85ecf11))
* **typography:**  Update variable reference to work for newer versions of ruby-sass ([#3047](https://github.com/material-components/material-components-web/issues/3047)) ([0dfad9a](https://github.com/material-components/material-components-web/commit/0dfad9a))



<a name="0.37.0"></a>
# [0.37.0](https://github.com/material-components/material-components-web/compare/v0.36.0...v0.37.0) (2018-07-02)


### Bug Fixes

* **chips:** Add an event typedef for chip interaction events ([#2965](https://github.com/material-components/material-components-web/issues/2965)) ([153e737](https://github.com/material-components/material-components-web/commit/153e737))
* **icon-button:** Remove unused styles, update docs, code cleanup ([#2957](https://github.com/material-components/material-components-web/issues/2957)) ([32b5b9d](https://github.com/material-components/material-components-web/commit/32b5b9d))
* **text-field:** Update caret color to match spec ([#2894](https://github.com/material-components/material-components-web/issues/2894)) ([88fd0bf](https://github.com/material-components/material-components-web/commit/88fd0bf))


### Features

* **chips:** Expose method to begin chip exit animation ([#2845](https://github.com/material-components/material-components-web/issues/2845)) ([eb00fd3](https://github.com/material-components/material-components-web/commit/eb00fd3))
* **chips:** Make chip exit on trailing icon click optional ([#2893](https://github.com/material-components/material-components-web/issues/2893)) ([9178d46](https://github.com/material-components/material-components-web/commit/9178d46))
* **chips:** Make event handlers on Chip public ([#2997](https://github.com/material-components/material-components-web/issues/2997)) ([963e0c1](https://github.com/material-components/material-components-web/commit/963e0c1))
* **fab:** Add Extended FAB ([14cb0bf](https://github.com/material-components/material-components-web/commit/14cb0bf))
* **fab:** Enable padding customization ([#2959](https://github.com/material-components/material-components-web/issues/2959)) ([1f5fd1f](https://github.com/material-components/material-components-web/commit/1f5fd1f))
* **list:** Add arrow key a11y support.  ([#2871](https://github.com/material-components/material-components-web/issues/2871)) ([7c06e9f](https://github.com/material-components/material-components-web/commit/7c06e9f))
* **ripple:** Expose focus/blur handlers  ([#2905](https://github.com/material-components/material-components-web/issues/2905)) ([31d81ad](https://github.com/material-components/material-components-web/commit/31d81ad))
* **select:** Add outlined variant ([#2674](https://github.com/material-components/material-components-web/issues/2674)) ([4863125](https://github.com/material-components/material-components-web/commit/4863125))



<a name="0.36.1"></a>
## [0.36.1](https://github.com/material-components/material-components-web/compare/v0.36.0...v0.36.1) (2018-06-18)


### Bug Fixes

* **checkbox:** support high contrast mode in Firefox on Windows ([#2927](https://github.com/material-components/material-components-web/issues/2927)) ([8b7d77e](https://github.com/material-components/material-components-web/commit/8b7d77e))
* **menu:** Update adapter to check for focus before calling ([#2880](https://github.com/material-components/material-components-web/issues/2880)) ([84fcc08](https://github.com/material-components/material-components-web/commit/84fcc08))
* **text-field:** Hide extraneous border in FF in HC mode. ([#2931](https://github.com/material-components/material-components-web/issues/2931)) ([bd4c563](https://github.com/material-components/material-components-web/commit/bd4c563))



<a name="0.36.0"></a>
# [0.36.0](https://github.com/material-components/material-components-web/compare/v0.36.0-0...v0.36.0) (2018-06-04)


### Bug Fixes

* **card:** Import variables in mixins ([#2799](https://github.com/material-components/material-components-web/issues/2799)) ([e6b787c](https://github.com/material-components/material-components-web/commit/e6b787c))
* **dialog:** Apply mdc-dialog__action color to buttons ([#2776](https://github.com/material-components/material-components-web/issues/2776)) ([6066795](https://github.com/material-components/material-components-web/commit/6066795))
* **dialog:** Fix Typography version ([#2821](https://github.com/material-components/material-components-web/issues/2821)) ([e793a56](https://github.com/material-components/material-components-web/commit/e793a56))
* **fab:** Restore horizontal alignment in IE11 ([#2715](https://github.com/material-components/material-components-web/issues/2715)) ([fded349](https://github.com/material-components/material-components-web/commit/fded349))
* **ripple:** Fix missing dependency ([#2795](https://github.com/material-components/material-components-web/issues/2795)) ([16a6890](https://github.com/material-components/material-components-web/commit/16a6890))
* **text-field:** Made handleValidationAttributeMutation to accept attribute list ([#2794](https://github.com/material-components/material-components-web/issues/2794)) ([14ee518](https://github.com/material-components/material-components-web/commit/14ee518))
* **text-field:** Moved VALIDATION_ATTR_WHITELIST to constants. ([#2808](https://github.com/material-components/material-components-web/issues/2808)) ([2180f95](https://github.com/material-components/material-components-web/commit/2180f95))
* **text-field:** Update floating-label to work properly for number fields ([#2781](https://github.com/material-components/material-components-web/issues/2781)) ([d0bff1f](https://github.com/material-components/material-components-web/commit/d0bff1f))
* **top-app-bar:** Add z-index. Cleanup redundant properties. ([#2828](https://github.com/material-components/material-components-web/issues/2828)) ([3f6bbc1](https://github.com/material-components/material-components-web/commit/3f6bbc1))
* **top-app-bar:** Fix testdouble warning about using both stub & verify. ([#2793](https://github.com/material-components/material-components-web/issues/2793)) ([d79af08](https://github.com/material-components/material-components-web/commit/d79af08))
* **checkbox:** Fix visibility in Windows high-contrast mode ([#2672](https://github.com/material-components/material-components-web/issues/2672)) ([eadec3c](https://github.com/material-components/material-components-web/commit/eadec3c))
* **checkbox:** make checkmark in high contrast mode on IE visible. ([#2848](https://github.com/material-components/material-components-web/issues/2848)) ([9b2c6a1](https://github.com/material-components/material-components-web/commit/9b2c6a1))
* **chips:** Add delay to filter chip checkmark ([#2804](https://github.com/material-components/material-components-web/issues/2804)) ([9e35b1e](https://github.com/material-components/material-components-web/commit/9e35b1e))
* **chips:** Fix choice-chips leading icon being hidden ([#2796](https://github.com/material-components/material-components-web/issues/2796)) ([7d406fa](https://github.com/material-components/material-components-web/commit/7d406fa)), closes [#2728](https://github.com/material-components/material-components-web/issues/2728)
* **switch:** Refactor switch styles to show up in HC windows mode. ([#2853](https://github.com/material-components/material-components-web/issues/2853)) ([ef159c8](https://github.com/material-components/material-components-web/commit/ef159c8))
* **text-field:** Changes to text area label positioning to cover text content ([#2816](https://github.com/material-components/material-components-web/issues/2816)) ([d6f4dc1](https://github.com/material-components/material-components-web/commit/d6f4dc1))


### Code Refactoring

* **chips:** Stop handling DOM manipulation in input chips ([#2791](https://github.com/material-components/material-components-web/issues/2791)) ([5a8ada5](https://github.com/material-components/material-components-web/commit/5a8ada5))


### Documentation

* **icon-toggle:** Add deprecation notice to README ([#2766](https://github.com/material-components/material-components-web/issues/2766)) ([119645e](https://github.com/material-components/material-components-web/commit/119645e))


### Features

* **icon-button:** Add new package ([#2748](https://github.com/material-components/material-components-web/issues/2748)) ([39a4815](https://github.com/material-components/material-components-web/commit/39a4815))
* **text-field:** Add methods to set text field icon aria-label and content ([#2771](https://github.com/material-components/material-components-web/issues/2771)) ([02d7dca](https://github.com/material-components/material-components-web/commit/02d7dca))
* **rtl:** Make mdc-rtl-reflexive sass mixin public ([#2823](https://github.com/material-components/material-components-web/issues/2823)) ([ca018a7](https://github.com/material-components/material-components-web/commit/ca018a7))


### BREAKING CHANGES

* **text-field:** Adds setContent adapter API to text field icon
* **icon-toggle:** The icon-toggle package has been deprecated. The functionality was moved to the icon-button package. Please refer to the icon-button readme for changes and how to update.
* **text-field:** registerValidationAttributeChangeHandler adapter API now expects the handler to accept an array of strings, not mutation objects
* **chips:** MDCChipSet/MDCChip no longer manipulates DOM directly. Removed MDCChipSetAdapter.appendChip, MDCChipSetFoundation.addChip, and MDCChip.remove. Modified signature of MDCChipSet.addChip



<a name="0.35.2"></a>
## [0.35.2](https://github.com/material-components/material-components-web/compare/v0.35.1...v0.35.2) (2018-05-21)


### Bug Fixes

* **dialog:** Dialog scroll-lock fix when calling destroy immediately after close ([#2120](https://github.com/material-components/material-components-web/issues/2120)) ([c961a5d](https://github.com/material-components/material-components-web/commit/c961a5d))
* **floating-label:** Add [@noflip](https://github.com/noflip) annotation to floating label ([#2696](https://github.com/material-components/material-components-web/issues/2696)) ([d9d695a](https://github.com/material-components/material-components-web/commit/d9d695a))
* **floating-label:** Import RTL in mixin since it is being used ([#2743](https://github.com/material-components/material-components-web/issues/2743)) ([f75df26](https://github.com/material-components/material-components-web/commit/f75df26))
* **infrastructure:** Ensure grid pattern renders correctly in IE ([#2729](https://github.com/material-components/material-components-web/issues/2729)) ([34f73e8](https://github.com/material-components/material-components-web/commit/34f73e8))
* **switch:** Fix switch RTL ([#2645](https://github.com/material-components/material-components-web/issues/2645)) ([e5ad26a](https://github.com/material-components/material-components-web/commit/e5ad26a))
* **text-field:** Add missing import to _mixins file ([#2740](https://github.com/material-components/material-components-web/issues/2740)) ([581e8f4](https://github.com/material-components/material-components-web/commit/581e8f4))
* **text-field:** Made handleValidationAttributeMutation method public. ([#2779](https://github.com/material-components/material-components-web/issues/2779)) ([1949989](https://github.com/material-components/material-components-web/commit/1949989))
* **top-app-bar:** Fix JS error when navigation icon is not present. ([#2751](https://github.com/material-components/material-components-web/issues/2751)) ([7643f3b](https://github.com/material-components/material-components-web/commit/7643f3b))
* **top-app-bar:** Replace margin-top in media query with padding-top ([#2704](https://github.com/material-components/material-components-web/issues/2704)) ([88c78b3](https://github.com/material-components/material-components-web/commit/88c78b3))



<a name="0.35.1"></a>
## [0.35.1](https://github.com/material-components/material-components-web/compare/v0.35.0...v0.35.1) (2018-05-03)


### Bug Fixes

* **chips:** Add nowrap to chip text ([#2671](https://github.com/material-components/material-components-web/issues/2671)) ([7abb3a2](https://github.com/material-components/material-components-web/commit/7abb3a2))
* **select:** Fix dropdown arrow mixin setting an invalid color ([#2637](https://github.com/material-components/material-components-web/issues/2637)) ([6450613](https://github.com/material-components/material-components-web/commit/6450613))
* **select:** Fix SassC compilation error ([#2678](https://github.com/material-components/material-components-web/issues/2678)) ([b0b3337](https://github.com/material-components/material-components-web/commit/b0b3337))
* **text-field:** Fix textarea height ([#2638](https://github.com/material-components/material-components-web/issues/2638)) ([75fe98d](https://github.com/material-components/material-components-web/commit/75fe98d))
* **text-field:** Update error color ([#2690](https://github.com/material-components/material-components-web/issues/2690)) ([d16a42e](https://github.com/material-components/material-components-web/commit/d16a42e))
* **top-app-bar:** Change margin-top to padding-top to prevent margin collapsing ([#2643](https://github.com/material-components/material-components-web/issues/2643)) ([8bba12d](https://github.com/material-components/material-components-web/commit/8bba12d))



<a name="0.35.0"></a>
# [0.35.0](https://github.com/material-components/material-components-web/compare/v0.34.1...v0.35.0) (2018-04-23)


### Bug Fixes

* **button:** Fix vertical alignment of contents ([#2534](https://github.com/material-components/material-components-web/issues/2534)) ([6bc73ca](https://github.com/material-components/material-components-web/commit/6bc73ca))
* **button:** Rename stroke to outline ([#2632](https://github.com/material-components/material-components-web/issues/2632)) ([0033990](https://github.com/material-components/material-components-web/commit/0033990))
* **button:** Update colors to match guidance ([#2598](https://github.com/material-components/material-components-web/issues/2598)) ([1be9d96](https://github.com/material-components/material-components-web/commit/1be9d96))
* **card:** Rename stroke to outline ([#2633](https://github.com/material-components/material-components-web/issues/2633)) ([6657e6f](https://github.com/material-components/material-components-web/commit/6657e6f))
* **checkbox:** Implement component/adapter APIs to sync aria-checked ([#2580](https://github.com/material-components/material-components-web/issues/2580)) ([30710a4](https://github.com/material-components/material-components-web/commit/30710a4))
* **checkbox:** Update to match new colors ([#2622](https://github.com/material-components/material-components-web/issues/2622)) ([68f4ad0](https://github.com/material-components/material-components-web/commit/68f4ad0))
* **chips:** Extend ripple to fill the chip when animating width ([#2423](https://github.com/material-components/material-components-web/issues/2423)) ([ec705e1](https://github.com/material-components/material-components-web/commit/ec705e1))
* **chips:** Manage chip selection for classes added manually ([#2391](https://github.com/material-components/material-components-web/issues/2391)) ([66f2464](https://github.com/material-components/material-components-web/commit/66f2464))
* **chips:** Rename all entry chips to input chips ([#2619](https://github.com/material-components/material-components-web/issues/2619)) ([a694a34](https://github.com/material-components/material-components-web/commit/a694a34))
* **chips:** Rename stroke to outline ([#2635](https://github.com/material-components/material-components-web/issues/2635)) ([604ddad](https://github.com/material-components/material-components-web/commit/604ddad))
* **chips:** Trailing icon and remove icon are the same thing ([#2616](https://github.com/material-components/material-components-web/issues/2616)) ([9e64c32](https://github.com/material-components/material-components-web/commit/9e64c32))
* **chips:** Update to guidance ([#2601](https://github.com/material-components/material-components-web/issues/2601)) ([c529cea](https://github.com/material-components/material-components-web/commit/c529cea))
* **floating-label:** achieved 100% test coverage ([#2523](https://github.com/material-components/material-components-web/issues/2523)) ([2e7f904](https://github.com/material-components/material-components-web/commit/2e7f904))
* **floating-label:** Update transition durations ([#2590](https://github.com/material-components/material-components-web/issues/2590)) ([099738c](https://github.com/material-components/material-components-web/commit/099738c))
* **infrastructure:** Remove deprecated JWT addon in .travis.yml ([#2521](https://github.com/material-components/material-components-web/issues/2521)) ([4876cf2](https://github.com/material-components/material-components-web/commit/4876cf2)), closes [#2151](https://github.com/material-components/material-components-web/issues/2151)
* **radio:** Update colors to latest guidance ([#2623](https://github.com/material-components/material-components-web/issues/2623)) ([e164a24](https://github.com/material-components/material-components-web/commit/e164a24))
* **ripple:** Re-flow logic to avoid crashing Edge ([#2542](https://github.com/material-components/material-components-web/issues/2542)) ([4ca8925](https://github.com/material-components/material-components-web/commit/4ca8925))
* **select:** Float label on focus/blur ([#2560](https://github.com/material-components/material-components-web/issues/2560)) ([68c08f7](https://github.com/material-components/material-components-web/commit/68c08f7))
* **select:** Override floating label properties in select box ([#2574](https://github.com/material-components/material-components-web/issues/2574)) ([f71d905](https://github.com/material-components/material-components-web/commit/f71d905))
* **select:** Remove animation causing the bottom line to flash ([#2612](https://github.com/material-components/material-components-web/issues/2612)) ([639387e](https://github.com/material-components/material-components-web/commit/639387e))
* **select:** Update colors to match latest guidance. ([#2617](https://github.com/material-components/material-components-web/issues/2617)) ([5aa7ec7](https://github.com/material-components/material-components-web/commit/5aa7ec7))
* **select:** Update typography to match latest guidance ([#2615](https://github.com/material-components/material-components-web/issues/2615)) ([0f18f39](https://github.com/material-components/material-components-web/commit/0f18f39))
* **shape:** Rename stroke to outline ([#2634](https://github.com/material-components/material-components-web/issues/2634)) ([ec9d7a5](https://github.com/material-components/material-components-web/commit/ec9d7a5))
* **text-field:** Add error state to trailing icon ([#2620](https://github.com/material-components/material-components-web/issues/2620)) ([fc6cdd3](https://github.com/material-components/material-components-web/commit/fc6cdd3))
* **text-field:** Add role="button" to icon ([#2584](https://github.com/material-components/material-components-web/issues/2584)) ([4c52589](https://github.com/material-components/material-components-web/commit/4c52589))
* **text-field:** Restore icon tabindex according to its initial value ([#2600](https://github.com/material-components/material-components-web/issues/2600)) ([02a3def](https://github.com/material-components/material-components-web/commit/02a3def))
* **text-field:** Update colors to match guidance ([#2597](https://github.com/material-components/material-components-web/issues/2597)) ([444f14f](https://github.com/material-components/material-components-web/commit/444f14f))
* **text-field:** Update helper text to use correct typography ([#2618](https://github.com/material-components/material-components-web/issues/2618)) ([2703580](https://github.com/material-components/material-components-web/commit/2703580))
* **text-field:** Update label position and shake animation ([#2594](https://github.com/material-components/material-components-web/issues/2594)) ([bd84694](https://github.com/material-components/material-components-web/commit/bd84694))
* **text-field:** Update typography to subtitle1. Updated height and padding. ([#2606](https://github.com/material-components/material-components-web/issues/2606)) ([127375e](https://github.com/material-components/material-components-web/commit/127375e))


### Code Refactoring

* **chips:** Manage chip foundations instead of chips in the chip set foundation ([#2397](https://github.com/material-components/material-components-web/issues/2397)) ([10a75f6](https://github.com/material-components/material-components-web/commit/10a75f6))
* **select**: removed label and replaced with floating-label ([#2522](https://github.com/material-components/material-components-web/issues/2130)) ([9a9a8905](https://github.com/material-components/material-components-web/commit/9a9a8905dd07e8ef6559c3e67637993ab4ce2d5c))
* **select**: use line ripple package to replace bottom line ([#2544](https://github.com/material-components/material-components-web/issues/2129)) ([9938d31a](https://github.com/material-components/material-components-web/commit/9938d31abc8edd97f88f3b4f11b2de12521e9579))

### Features

* **base:** Add mdc-emit-once utility mixin; deduplicate styles ([#2578](https://github.com/material-components/material-components-web/issues/2578)) ([64a00b2](https://github.com/material-components/material-components-web/commit/64a00b2))
* **chips:** Add animation for entry chips ([#2543](https://github.com/material-components/material-components-web/issues/2543)) ([68006fb](https://github.com/material-components/material-components-web/commit/68006fb))
* **chips:** Add entry chips ([#2414](https://github.com/material-components/material-components-web/issues/2414)) ([afe5367](https://github.com/material-components/material-components-web/commit/afe5367))
* **chips:** Allow close icon and exit animation ([#2571](https://github.com/material-components/material-components-web/issues/2571)) ([3d8a27b](https://github.com/material-components/material-components-web/commit/3d8a27b))
* **chips:** Customize icon size and color ([#2613](https://github.com/material-components/material-components-web/issues/2613)) ([0f5af21](https://github.com/material-components/material-components-web/commit/0f5af21))
* **color:** Add on-surface and surface to theme.  ([#2556](https://github.com/material-components/material-components-web/issues/2556)) ([9639689](https://github.com/material-components/material-components-web/commit/9639689))
* **fab:** Add support for svg icons ([#2504](https://github.com/material-components/material-components-web/issues/2504)) ([3895376](https://github.com/material-components/material-components-web/commit/3895376))
* **infrastructure:** Add newline at end of js files as part of the transform. ([#2557](https://github.com/material-components/material-components-web/issues/2557)) ([4fe967d](https://github.com/material-components/material-components-web/commit/4fe967d))
* **infrastructure:** different namespacing for default exports ([#2553](https://github.com/material-components/material-components-web/issues/2553)) ([4ff505e](https://github.com/material-components/material-components-web/commit/4ff505e))
* **infrastructure:** Upload compiled screenshot test assets to GCS ([#2500](https://github.com/material-components/material-components-web/issues/2500)) ([5ada5b4](https://github.com/material-components/material-components-web/commit/5ada5b4))
* **ripple:** Call layout on each activation ([#2567](https://github.com/material-components/material-components-web/issues/2567)) ([c6076e1](https://github.com/material-components/material-components-web/commit/c6076e1))
* **shape:** Add MDC Shape with support for unelevated angled corners ([#2506](https://github.com/material-components/material-components-web/issues/2506)) ([dc87f18](https://github.com/material-components/material-components-web/commit/dc87f18))
* **theme:** Add new mdc-theme-on-primary global variable ([#2483](https://github.com/material-components/material-components-web/issues/2483)) ([777a0fd](https://github.com/material-components/material-components-web/commit/777a0fd))
* **theme:** Add typography styles to shrine demo ([#2605](https://github.com/material-components/material-components-web/issues/2605)) ([976affd](https://github.com/material-components/material-components-web/commit/976affd))
* **top-app-bar:** Add --fixed variant to top app bar ([#2474](https://github.com/material-components/material-components-web/issues/2474)) ([1d40fa9](https://github.com/material-components/material-components-web/commit/1d40fa9))
* **top-app-bar:** add default scroll behavior ([#2417](https://github.com/material-components/material-components-web/issues/2417)) ([18be342](https://github.com/material-components/material-components-web/commit/18be342))
* **typography:** Update styles to match guidance ([#2527](https://github.com/material-components/material-components-web/issues/2527)) ([f750ec7](https://github.com/material-components/material-components-web/commit/f750ec7))


### BREAKING CHANGES

* **chips:** Renames variant, classes and mixins containing the word stroke to use the word outline.
* **chips:** Expose a foundation getter in MDCChips
* **card:** Renames variant, classes and mixins containing the word stroke to use the word outline.
* **button:** Renames variant, classes and mixins containing stroke to use outline.
* **chips:** Entry chips renamed to input chips.
* **chips:** Add Sass mixins to customize color and size of leading/trailing icons.
* **chips:** Get rid of mdc-chip__icon--remove API.
* **text-field:** Adds getAttr adapter API to text field icon
* **chips:** Add API for remove icon including mdc-chip__icon--remove, remove() method and adapter methods to MDCChip. Modify appendChip() and add removeChip() adapter method to MDCChipSet.
* **shape:** Renames variant, classes and mixins containing the word stroke to use the word outline.
* **text-field:** Adds removeAttr(attr) adapter API
* **theme:** Removes the --mdc-theme-text-<TEXT_STYLE>-on-<THEME_COLOR> CSS custom properties, and the mdc-theme--text-<TEXT_STYLE>-on-<THEME_COLOR> CSS classes
* **chips:** layout() method added to MDCChipAdapter.
* **typography:** Previous typography styles are removed. The new styles are listed in the readme.
* **top-app-bar:** New adapter methods for setting the top app bar position and adding resize event handlers that must be implemented.
* **chips:** Added a new chip variant (entry chips). Added new methods to MDCChipSet, MDCChipSetFoundation, and MDCChipSetAdapter.
* **chips:** isSelected method added to MDCChip, and related methods added to MDCChipFoundation and MDCChipSetFoundation.
* **floating-label:** Removes the (undocumented) mdc-floating-label-transition function
* **select:** Removes the mdc-select__label class and uses mdc-floating-label for the floating label.
* **select:** Removes the mdc-select__bottom-line class and uses the mdc-line-ripple instead.


<a name="0.34.1"></a>
## [0.34.1](https://github.com/material-components/material-components-web/compare/v0.34.0...v0.34.1) (2018-04-03)


### Bug Fixes

* **infrastructure:** Unexpose private tab  ([#2499](https://github.com/material-components/material-components-web/issues/2499)) ([306fd7f](https://github.com/material-components/material-components-web/commit/306fd7f)), closes [#2498](https://github.com/material-components/material-components-web/issues/2498)
* **ripple:** Clean activation timer and css when interrupted ([#2490](https://github.com/material-components/material-components-web/issues/2490)) ([18cba98](https://github.com/material-components/material-components-web/commit/18cba98))



<a name="0.34.0"></a>
# [0.34.0](https://github.com/material-components/material-components-web/compare/v0.33.0...v0.34.0) (2018-04-02)


### Bug Fixes

* Compile demo CSS/JS during `npm run build` ([#2437](https://github.com/material-components/material-components-web/issues/2437)) ([21150c7](https://github.com/material-components/material-components-web/commit/21150c7)), closes [#2325](https://github.com/material-components/material-components-web/issues/2325)
* **button:** Suppress whitespace between icon and text label ([#2449](https://github.com/material-components/material-components-web/issues/2449)) ([f504aa6](https://github.com/material-components/material-components-web/commit/f504aa6))
* **drawer:** Update motion to match spec ([#2398](https://github.com/material-components/material-components-web/issues/2398)) ([6417b51](https://github.com/material-components/material-components-web/commit/6417b51))
* **line-ripple:** Fix CSP inline style rule ([#2491](https://github.com/material-components/material-components-web/issues/2491)) ([4f1cdc1](https://github.com/material-components/material-components-web/commit/4f1cdc1))
* **select:** Update theme select demo ([#2496](https://github.com/material-components/material-components-web/issues/2496)) ([db424bf](https://github.com/material-components/material-components-web/commit/db424bf))
* **text-field:** Remove press ripple effect ([#2419](https://github.com/material-components/material-components-web/issues/2419)) ([e207f0f](https://github.com/material-components/material-components-web/commit/e207f0f))
* **toolbar:** Fix toolbar/top-app-bar button icons ([#2454](https://github.com/material-components/material-components-web/issues/2454)) ([3a149b3](https://github.com/material-components/material-components-web/commit/3a149b3))
* **top-app-bar:** Remove applyPassive function from toolbar/top app bar ([#2487](https://github.com/material-components/material-components-web/issues/2487)) ([c252aba](https://github.com/material-components/material-components-web/commit/c252aba))


### Chores

* **theme:** Remove tonal variants, since they dont match MD guidelines ([#2473](https://github.com/material-components/material-components-web/issues/2473)) ([a99ce40](https://github.com/material-components/material-components-web/commit/a99ce40))
* **typography:** Remove the adjust margin feature ([#2464](https://github.com/material-components/material-components-web/issues/2464)) ([3f23821](https://github.com/material-components/material-components-web/commit/3f23821))


### Code Refactoring

* **notched-outline:** remove text-field notched outline styles and coupling ([#2401](https://github.com/material-components/material-components-web/issues/2401)) ([4f83757](https://github.com/material-components/material-components-web/commit/4f83757))


### feature

* **select:** replace menu with native html select ([#2462](https://github.com/material-components/material-components-web/issues/2462)) ([fcc7341](https://github.com/material-components/material-components-web/commit/fcc7341))


### Features

* **button:** Add padding mixin, adjust icon margin ([#2420](https://github.com/material-components/material-components-web/issues/2420)) ([819d139](https://github.com/material-components/material-components-web/commit/819d139))
* **tab:** Add MDCTab component ([#2421](https://github.com/material-components/material-components-web/issues/2421)) ([a8b3193](https://github.com/material-components/material-components-web/commit/a8b3193))
* **top-app-bar:** Add dense style ([#2475](https://github.com/material-components/material-components-web/issues/2475)) ([3feec58](https://github.com/material-components/material-components-web/commit/3feec58))


### BREAKING CHANGES

* **select:** The template and adapter APIs have changed to take advantage of the native select element; see the MDC Select README for more information.
* **typography:** Removes the `mdc-typography--adjust-margin` CSS class and the `mdc-typography-adjust-margin` Sass mixin
* **theme:** Removes styles for `mdc-theme--primary/secondary-light/dark` CSS classes and the `mdc-theme-light/dark-variant` Sass functions
* **notched-outline:** Renamed `mdc-text-field-outlined-corner-radius` to `mdc-text-field-outline-corner-radius`. Made `updateSvgPath_()` private in notched-outline foundation and replaced it
with `notch()`. Renamed `updateOutline()` in text-field foundation to `notchOutline()`.
* **line-ripple:** The `setAttr` adapter method has been removed and replaced by `setStyle`.



<a name="0.33.0"></a>
# [0.33.0](https://github.com/material-components/material-components-web/compare/v0.32.0...v0.33.0) (2018-03-19)


### Bug Fixes

* **button:** icon in rtl should have margin right flipped. ([#2346](https://github.com/material-components/material-components-web/issues/2346)) ([3c04419](https://github.com/material-components/material-components-web/commit/3c04419))
* **card:** Center background image ([#2388](https://github.com/material-components/material-components-web/issues/2388)) ([466e7db](https://github.com/material-components/material-components-web/commit/466e7db))
* **checkbox:** add aria-checked=mixed to indeterminate state ([#2389](https://github.com/material-components/material-components-web/issues/2389)) ([cf45654](https://github.com/material-components/material-components-web/commit/cf45654))
* **demos:** Correct RTL/LTR toggling in demos in Safari ([#2348](https://github.com/material-components/material-components-web/issues/2348)) ([b9000a4](https://github.com/material-components/material-components-web/commit/b9000a4))
* **drawer:** Update menu icon to be anchor element ([#2372](https://github.com/material-components/material-components-web/issues/2372)) ([1065a74](https://github.com/material-components/material-components-web/commit/1065a74))
* **rtl:** Adding noflip annotations to fix downstream rtl issues ([#2344](https://github.com/material-components/material-components-web/issues/2344)) ([dc3d69f](https://github.com/material-components/material-components-web/commit/dc3d69f))
* **text-field:** Clicking label should focus textfield ([#2353](https://github.com/material-components/material-components-web/issues/2353)) ([f17e0d3](https://github.com/material-components/material-components-web/commit/f17e0d3))
* Use `var` instead of `const` in menu demo ([#2345](https://github.com/material-components/material-components-web/issues/2345)) ([ab85736](https://github.com/material-components/material-components-web/commit/ab85736))
* **theme:** Move [@alternate](https://github.com/alternate) annotations for Closure Stylesheets ([#2355](https://github.com/material-components/material-components-web/issues/2355)) ([dc52201](https://github.com/material-components/material-components-web/commit/dc52201))
* **toolbar:** Fix colors for svg icons. Update custom-toolbar demo ([#2331](https://github.com/material-components/material-components-web/issues/2331)) ([35a5cfc](https://github.com/material-components/material-components-web/commit/35a5cfc))
* **top-app-bar:** Adjust title padding-left styles ([#2390](https://github.com/material-components/material-components-web/issues/2390)) ([e24480c](https://github.com/material-components/material-components-web/commit/e24480c))
* **top-app-bar:** Fix border-radius mixin to use parameter instead of variable ([#2396](https://github.com/material-components/material-components-web/issues/2396)) ([671aa4c](https://github.com/material-components/material-components-web/commit/671aa4c))
* **top-app-bar:** Update short collapsed border-radius to match baseline ([#2407](https://github.com/material-components/material-components-web/issues/2407)) ([cea9de6](https://github.com/material-components/material-components-web/commit/cea9de6))


### Chores

* **notched-outline:** separate outline from text-field ([#2326](https://github.com/material-components/material-components-web/issues/2326)) ([e215ca8](https://github.com/material-components/material-components-web/commit/e215ca8))


### Code Refactoring

* **button:** Remove compact variant ([#2361](https://github.com/material-components/material-components-web/issues/2361)) ([77b15f4](https://github.com/material-components/material-components-web/commit/77b15f4))


### Features

* **button:** Add ability to color icons separately from the text ([#2362](https://github.com/material-components/material-components-web/issues/2362)) ([6e5139c](https://github.com/material-components/material-components-web/commit/6e5139c))
* **button:** Add support for SVG icons ([#2352](https://github.com/material-components/material-components-web/issues/2352)) ([499ad15](https://github.com/material-components/material-components-web/commit/499ad15))
* **chips:** Replace leading icon with checkmark in selected filter chips ([#2320](https://github.com/material-components/material-components-web/issues/2320)) ([0b73002](https://github.com/material-components/material-components-web/commit/0b73002))
* **image-list:** Add base styles and mixins for Standard Image List ([#2367](https://github.com/material-components/material-components-web/issues/2367)) ([71ea82a](https://github.com/material-components/material-components-web/commit/71ea82a))
* **image-list:** Add corner radius mixin ([#2385](https://github.com/material-components/material-components-web/issues/2385)) ([567deec](https://github.com/material-components/material-components-web/commit/567deec))
* **image-list:** Add Masonry Image List ([#2381](https://github.com/material-components/material-components-web/issues/2381)) ([d368fa7](https://github.com/material-components/material-components-web/commit/d368fa7))
* **ripple:** Expose mdc-states-opacity; fix press fallback ([#2402](https://github.com/material-components/material-components-web/issues/2402)) ([2dfaec6](https://github.com/material-components/material-components-web/commit/2dfaec6))
* **top-app-bar:** Add prominent style ([#2349](https://github.com/material-components/material-components-web/issues/2349)) ([f59b109](https://github.com/material-components/material-components-web/commit/f59b109))
* **top-app-bar:** Switch to use variant specific foundations ([#2412](https://github.com/material-components/material-components-web/issues/2412)) ([2950b3e](https://github.com/material-components/material-components-web/commit/2950b3e))


### BREAKING CHANGES

* **notched-outline:** removed mdc-text-field__outline element for mdc-notched-outline.
Renamed mdc-text-field-outlined-corner-radius to mdc-text-field-outline-corner-radius.
* **chips:** renamed (de)registerInteractionHandler to (de)registerEventHandler and added multiple new methods to MDCChipAdapter. Also changed HTML structure of filter chips to include checkmark.
* **checkbox:** Adds setNativeControlAttr and removeNativeControlAttr adapter APIs.
* **button:** The compact variant of MDC Button is removed.



<a name="0.32.0"></a>
# [0.32.0](https://github.com/material-components/material-components-web/compare/v0.31.0...v0.32.0) (2018-03-05)


### Bug Fixes

* **chips:** Emit custom event from trailing icon ([#2286](https://github.com/material-components/material-components-web/issues/2286)) ([e849937](https://github.com/material-components/material-components-web/commit/e849937))
* **ripple:** Fix selected opacity levels ([#2294](https://github.com/material-components/material-components-web/issues/2294)) ([06e39b1](https://github.com/material-components/material-components-web/commit/06e39b1))
* **select:** add tests for select label package ([#2289](https://github.com/material-components/material-components-web/issues/2289)) ([b8ae66c](https://github.com/material-components/material-components-web/commit/b8ae66c))
* **select:** Fix floating label for pre-selected option ([#2306](https://github.com/material-components/material-components-web/issues/2306)) ([d8dae34](https://github.com/material-components/material-components-web/commit/d8dae34))
* **text-field:** disable validation check in setRequired ([#2201](https://github.com/material-components/material-components-web/issues/2201)) ([0ba7d10](https://github.com/material-components/material-components-web/commit/0ba7d10))
* **toolbar:** Fix icon padding for ripples, and vertical alignment in FF/IE/Edge ([#2138](https://github.com/material-components/material-components-web/issues/2138)) ([d2c9726](https://github.com/material-components/material-components-web/commit/d2c9726))
* Use `var` instead of `const` in demos/ready.js ([#2343](https://github.com/material-components/material-components-web/issues/2343)) ([78408bb](https://github.com/material-components/material-components-web/commit/78408bb))


### Chores

* **floating-label:** separate label module from text-field ([#2237](https://github.com/material-components/material-components-web/issues/2237)) ([4b24b51](https://github.com/material-components/material-components-web/commit/4b24b51))


### Features

* **chips:** Add `mdc-chip-set--choice` variant ([#2215](https://github.com/material-components/material-components-web/issues/2215)) ([f89cd10](https://github.com/material-components/material-components-web/commit/f89cd10))
* **chips:** Change chip color when selected ([#2329](https://github.com/material-components/material-components-web/issues/2329)) ([ecf4060](https://github.com/material-components/material-components-web/commit/ecf4060))
* **chips:** Create mixin to customize chip margins ([#2277](https://github.com/material-components/material-components-web/issues/2277)) ([b996b7f](https://github.com/material-components/material-components-web/commit/b996b7f))
* **chips:** Handle multi-select for filter chips ([#2297](https://github.com/material-components/material-components-web/issues/2297)) ([807b6ce](https://github.com/material-components/material-components-web/commit/807b6ce))
* **top app bar:** Add short top app bar always collapsed feature ([#2327](https://github.com/material-components/material-components-web/issues/2327)) ([bc17291](https://github.com/material-components/material-components-web/commit/bc17291))
* **top-app-bar:** Baseline top app bar component ([#2225](https://github.com/material-components/material-components-web/issues/2225)) ([0ad69c4](https://github.com/material-components/material-components-web/commit/0ad69c4))
* **top-app-bar:** Implement short top app bar ([#2290](https://github.com/material-components/material-components-web/issues/2290)) ([fd8d8d9](https://github.com/material-components/material-components-web/commit/fd8d8d9))


### BREAKING CHANGES

* **text-field:** removed setRequired and isRequired from foundation.
* **chips:** The `mdc-chip--activated` class, `mdc-chip-activated-ink-color` Sass mixin, and the `toggleActive` methods on `MDCChip`/`MDCChipSet` have been renamed to `mdc-chip--selected`, `mdc-chip-selected-ink-color`, and `toggleSelected`, respectively.
* **floating-label:** must use `.mdc-floating-label` selector instead of `.mdc-text-field__label`
* **chips:** Added `mdc-chip-set--filter` as a variant to be set in the HTML.
* **chips:** New MDCChipAdapter methods for handling trailing icons must be implemented.



<a name="0.31.0"></a>
# [0.31.0](https://github.com/material-components/material-components-web/compare/v0.30.0...v0.31.0) (2018-02-20)


### Bug Fixes

* **button:** Increase specifity of button icon's CSS class ([#2242](https://github.com/material-components/material-components-web/issues/2242)) ([f91d25e](https://github.com/material-components/material-components-web/commit/f91d25e))
* **card:** Remove unused dep/import and add missing dep ([#2234](https://github.com/material-components/material-components-web/issues/2234)) ([a6de863](https://github.com/material-components/material-components-web/commit/a6de863)), closes [#2231](https://github.com/material-components/material-components-web/issues/2231)
* **checkbox:** Avoid using & within [@at-root](https://github.com/at-root) context ([#2238](https://github.com/material-components/material-components-web/issues/2238)) ([665cf12](https://github.com/material-components/material-components-web/commit/665cf12))
* **demos:** Remove space between toolbar title and navigation icon. ([#2174](https://github.com/material-components/material-components-web/issues/2174)) ([3b0977d](https://github.com/material-components/material-components-web/commit/3b0977d))
* **menu:** Rename test files ([#2168](https://github.com/material-components/material-components-web/issues/2168)) ([5ea5c2f](https://github.com/material-components/material-components-web/commit/5ea5c2f))
* **menu:** Use mdc-theme-prop to support css variables on background ([#2253](https://github.com/material-components/material-components-web/issues/2253)) ([1cc5dd5](https://github.com/material-components/material-components-web/commit/1cc5dd5))
* **ripple:** Ensure hover/focus states have proper z-index ([#2204](https://github.com/material-components/material-components-web/issues/2204)) ([751dabd](https://github.com/material-components/material-components-web/commit/751dabd))
* **ripple:** use default computeBoundingRect for all components with ripple ([#2216](https://github.com/material-components/material-components-web/issues/2216)) ([229e590](https://github.com/material-components/material-components-web/commit/229e590))
* **select:** pre-selected option correctly floats label ([#2125](https://github.com/material-components/material-components-web/issues/2125)) ([fac0d03](https://github.com/material-components/material-components-web/commit/fac0d03))
* **switch:** change all border-radius values to 50% instead of hardcoded pixel values ([#2255](https://github.com/material-components/material-components-web/issues/2255)) ([1b2219b](https://github.com/material-components/material-components-web/commit/1b2219b))
* **text-field:** Apply error color on bottom line of fullwidth field ([#2197](https://github.com/material-components/material-components-web/issues/2197)) ([a6500bd](https://github.com/material-components/material-components-web/commit/a6500bd))
* **theme:** fix select underline ([#2236](https://github.com/material-components/material-components-web/issues/2236)) ([4514e03](https://github.com/material-components/material-components-web/commit/4514e03))


### Features

* **card:** Add primary action element with hover, focused, and pressed states ([#2039](https://github.com/material-components/material-components-web/issues/2039)) ([3949dbe](https://github.com/material-components/material-components-web/commit/3949dbe)), closes [#1709](https://github.com/material-components/material-components-web/issues/1709)
* **chips:** Add Sass mixins for customization ([#2177](https://github.com/material-components/material-components-web/issues/2177)) ([667513c](https://github.com/material-components/material-components-web/commit/667513c))
* **chips:** Handle leading/trailing icon styles ([#2191](https://github.com/material-components/material-components-web/issues/2191)) ([be71f9f](https://github.com/material-components/material-components-web/commit/be71f9f))


### BREAKING CHANGES

* **chips:** MDC Chips has new Sass mixins.



<a name="0.30.0"></a>
# [0.30.0](https://github.com/material-components/material-components-web/compare/v0.29.0...v0.30.0) (2018-02-05)


### Bug Fixes

* **checkbox:** Fix background fading too fast ([#2122](https://github.com/material-components/material-components-web/issues/2122)) ([d461374](https://github.com/material-components/material-components-web/commit/d461374))
* **demos:** Fix drawer menu icon position in RTL ([#1931](https://github.com/material-components/material-components-web/issues/1931)) ([8848fcc](https://github.com/material-components/material-components-web/commit/8848fcc))
* **demos:** Fix ready.js to avoid false positive before document load ([#2180](https://github.com/material-components/material-components-web/issues/2180)) ([2fe4dcd](https://github.com/material-components/material-components-web/commit/2fe4dcd))
* **demos:** Re-enable JS source maps ([#2124](https://github.com/material-components/material-components-web/issues/2124)) ([929eb8c](https://github.com/material-components/material-components-web/commit/929eb8c))
* **demos:** Sanitize slider input values ([#2018](https://github.com/material-components/material-components-web/issues/2018)) ([f3d4ca7](https://github.com/material-components/material-components-web/commit/f3d4ca7))
* **drawer:** Fix slidable drawer's closed position in RTL ([#1957](https://github.com/material-components/material-components-web/issues/1957)) ([486ec87](https://github.com/material-components/material-components-web/commit/486ec87)), closes [#1930](https://github.com/material-components/material-components-web/issues/1930)
* **drawer:** fixed drawer demo typos ([#2115](https://github.com/material-components/material-components-web/issues/2115)) ([c52a4b6](https://github.com/material-components/material-components-web/commit/c52a4b6))
* **drawer:** remove dark theme ([#2080](https://github.com/material-components/material-components-web/issues/2080)) ([f05ebb5](https://github.com/material-components/material-components-web/commit/f05ebb5))
* **list:** Add missing import ([#2150](https://github.com/material-components/material-components-web/issues/2150)) ([5dcc918](https://github.com/material-components/material-components-web/commit/5dcc918))
* **list:** added ellipsis to text and secondary text if text overflows ([#2049](https://github.com/material-components/material-components-web/issues/2049)) ([526521c](https://github.com/material-components/material-components-web/commit/526521c))
* **list:** Don't allow graphic to shrink when text overflows ([#1943](https://github.com/material-components/material-components-web/issues/1943)) ([da007f5](https://github.com/material-components/material-components-web/commit/da007f5)), closes [#1941](https://github.com/material-components/material-components-web/issues/1941)
* **list:** updated demo to show checkbox examples ([fa0f58c](https://github.com/material-components/material-components-web/commit/fa0f58c))
* **list:** updated demo to show checkbox examples ([#2064](https://github.com/material-components/material-components-web/issues/2064)) ([ec3d489](https://github.com/material-components/material-components-web/commit/ec3d489))
* **menu:** Close menu when a list-item was clicked. ([#1756](https://github.com/material-components/material-components-web/issues/1756)) ([c052cfe](https://github.com/material-components/material-components-web/commit/c052cfe)), closes [#1747](https://github.com/material-components/material-components-web/issues/1747)
* **ripple:** Fix nested ripple handling to work with touch events ([#2178](https://github.com/material-components/material-components-web/issues/2178)) ([a633cf5](https://github.com/material-components/material-components-web/commit/a633cf5))
* **ripple:** Fix unbounded ripple sizes ([#2092](https://github.com/material-components/material-components-web/issues/2092)) ([41e3e89](https://github.com/material-components/material-components-web/commit/41e3e89))
* **ripple:** Only deduplicate events on parents whose children activated ([#2160](https://github.com/material-components/material-components-web/issues/2160)) ([d83d5bd](https://github.com/material-components/material-components-web/commit/d83d5bd))
* **ripple:** Prevent ancestors of nested ripple surfaces from activating ([#2123](https://github.com/material-components/material-components-web/issues/2123)) ([0a83568](https://github.com/material-components/material-components-web/commit/0a83568))
* **select:** Fix background-color that changed during first mixin PR ([#2070](https://github.com/material-components/material-components-web/issues/2070)) ([fe6186a](https://github.com/material-components/material-components-web/commit/fe6186a))
* **select:** Remove list CSS, and use mdc-list styles directly ([#2065](https://github.com/material-components/material-components-web/issues/2065)) ([e588392](https://github.com/material-components/material-components-web/commit/e588392))
* **tabs:** centered and adjusted vertical placement of css-only tab indicator ([#2141](https://github.com/material-components/material-components-web/issues/2141)) ([e01bb84](https://github.com/material-components/material-components-web/commit/e01bb84))
* **text-field:** Change text-field/label/variables file from css to scss. ([#2103](https://github.com/material-components/material-components-web/issues/2103)) ([2998a42](https://github.com/material-components/material-components-web/commit/2998a42))
* **text-field:** Fix floating label for Outlined Text Fields with a leading icon. ([#2078](https://github.com/material-components/material-components-web/issues/2078)) ([ffca02d](https://github.com/material-components/material-components-web/commit/ffca02d)), closes [#1908](https://github.com/material-components/material-components-web/issues/1908)
* **text-field:** Indent Outlined Helper Text ([#2140](https://github.com/material-components/material-components-web/issues/2140)) ([220168a](https://github.com/material-components/material-components-web/commit/220168a)), closes [#2139](https://github.com/material-components/material-components-web/issues/2139)
* **text-field:** Make outline visibility directly linked to floating labels ([#2073](https://github.com/material-components/material-components-web/issues/2073)) ([6129f45](https://github.com/material-components/material-components-web/commit/6129f45))
* **text-field:** move script tags below mdc.js tag ([#2179](https://github.com/material-components/material-components-web/issues/2179)) ([f5e506f](https://github.com/material-components/material-components-web/commit/f5e506f))
* added back missing import scss packages ([#2104](https://github.com/material-components/material-components-web/issues/2104)) ([ceb3d51](https://github.com/material-components/material-components-web/commit/ceb3d51))
* **text-field:** Remove unnecessary styling on label in disabled state ([#2058](https://github.com/material-components/material-components-web/issues/2058)) ([23e6b26](https://github.com/material-components/material-components-web/commit/23e6b26))
* **text-field:** removed --float-above from --shake selectors ([#2007](https://github.com/material-components/material-components-web/issues/2007)) ([9d63b2e](https://github.com/material-components/material-components-web/commit/9d63b2e))


### Chores

* **checkbox:** Rename checkmark path for BEM ([#2096](https://github.com/material-components/material-components-web/issues/2096)) ([015c66b](https://github.com/material-components/material-components-web/commit/015c66b))
* **list:** remove dark theme ([#2082](https://github.com/material-components/material-components-web/issues/2082)) ([a2c1bd0](https://github.com/material-components/material-components-web/commit/a2c1bd0))
* **menu:** Rename SimpleMenu to Menu ([#2061](https://github.com/material-components/material-components-web/issues/2061)) ([26c9aec](https://github.com/material-components/material-components-web/commit/26c9aec))
* **slider:** remove dark theme ([#2099](https://github.com/material-components/material-components-web/issues/2099)) ([e1ea223](https://github.com/material-components/material-components-web/commit/e1ea223))
* **tabs:** removed .mdc-toolbar specific selectors ([#1979](https://github.com/material-components/material-components-web/issues/1979)) ([b32d013](https://github.com/material-components/material-components-web/commit/b32d013))
* **theme:** remove dark theme ([#2169](https://github.com/material-components/material-components-web/issues/2169)) ([13b5605](https://github.com/material-components/material-components-web/commit/13b5605))


### Features

* **button:** removed dark theme from buttons ([#2038](https://github.com/material-components/material-components-web/issues/2038)) ([dee5055](https://github.com/material-components/material-components-web/commit/dee5055))
* **button:** removed unused imports from css ([#2093](https://github.com/material-components/material-components-web/issues/2093)) ([339e15b](https://github.com/material-components/material-components-web/commit/339e15b))
* **card:** Add `--stroked` variant and `mdc-card-stroke` mixin ([#2035](https://github.com/material-components/material-components-web/issues/2035)) ([76e56cf](https://github.com/material-components/material-components-web/commit/76e56cf)), closes [#1708](https://github.com/material-components/material-components-web/issues/1708)
* **card:** Add theme mixins; remove content layouts ([#2025](https://github.com/material-components/material-components-web/issues/2025)) ([5f338e6](https://github.com/material-components/material-components-web/commit/5f338e6)), closes [#1126](https://github.com/material-components/material-components-web/issues/1126)
* **chips:** Baseline chip and chip set ([#2083](https://github.com/material-components/material-components-web/issues/2083)) ([17c6c51](https://github.com/material-components/material-components-web/commit/17c6c51))
* **dialog:** remove dark theme ([#2079](https://github.com/material-components/material-components-web/issues/2079)) ([3af1221](https://github.com/material-components/material-components-web/commit/3af1221))
* **menu:** Add --selected class to menu items ([#2084](https://github.com/material-components/material-components-web/issues/2084)) ([04a6ee6](https://github.com/material-components/material-components-web/commit/04a6ee6))
* **menu:** Add quickOpen option.  ([#2127](https://github.com/material-components/material-components-web/issues/2127)) ([e571a53](https://github.com/material-components/material-components-web/commit/e571a53))
* **ripple:** Split radius mixin into bounded/unbounded versions ([#2112](https://github.com/material-components/material-components-web/issues/2112)) ([1f3871c](https://github.com/material-components/material-components-web/commit/1f3871c))
* **select:** Add non box version  ([#2149](https://github.com/material-components/material-components-web/issues/2149)) ([d2e53e8](https://github.com/material-components/material-components-web/commit/d2e53e8))
* **select:** Remove css version ([#2116](https://github.com/material-components/material-components-web/issues/2116)) ([f44721c](https://github.com/material-components/material-components-web/commit/f44721c))
* **select:** removed dark theme ([#2098](https://github.com/material-components/material-components-web/issues/2098)) ([c928bce](https://github.com/material-components/material-components-web/commit/c928bce))
* **text-field:** Move bottom-line to separate package ([#2037](https://github.com/material-components/material-components-web/issues/2037)) ([1dc0e85](https://github.com/material-components/material-components-web/commit/1dc0e85))
* **text-field:** Move final JS colors to mixins. Update demos ([#2006](https://github.com/material-components/material-components-web/issues/2006)) ([989c516](https://github.com/material-components/material-components-web/commit/989c516))


### BREAKING CHANGES

* **theme:** Deleted `mdc-theme-light-or-dark` and `mdc-theme-dark`
* **tabs:** Removal of .mdc-toolbar selector forces clients to customize tab-bars within toolbars that require a different ink color.
* **ripple:** Adds `containsEventTarget(target)` API to the ripple adapter.
* **chips:** A new package `mdc-chip` has been added.
* **text-field:** Moves the text-field bottom-line element to a new package (mdc-line-ripple), so we can reuse it in other components. The HTML class name for the bottom-line element has changed from mdc-text-field__bottom-line to mdc-line-ripple. Removes the animation end events from the bottom-line. Renames the bottom-line to line-ripple.
* **select:** Removes the CSS version of the mdc-select element.
* **menu:** Removes the `eventTargetHasClass` from the adapter.
* **slider:** Removed `$mdc-slider-dark-theme-assumed-bg-color` from slider variables.
* **ripple:** mdc-ripple-radius is replaced by mdc-ripple-radius-bounded and mdc-ripple-radius-unbounded; use one or the other as appropriate for the surface. The default 100% value of the unbounded mixin now results in a smaller, more appropriate radius.
* **card:** All CSS classes for content layouts have been removed. Clients should decide what kind of layout is best for their specific use case. Dark theme CSS classes have been removed; use the Sass mixin or custom CSS instead.
* **checkbox:** All checkboxes need to update the SVG path's class from `mdc-checkbox__checkmark__path` to `mdc-checkbox__checkmark-path`.
* **menu:** Renames MDCSimpleMenu to MDCMenu. Renames all mdc-simple-menu classes to mdc-menu. JS and SASS file paths for the menu have changed.
* **list:** Renamed divider sass vars `$mdc-list-divider-color-light` to `$mdc-list-divider-color-on-light-bg`, `$mdc-list-divider-color-dark` to `$mdc-list-divider-color-on-dark-bg`



<a name="0.29.0"></a>
# [0.29.0](https://github.com/material-components/material-components-web/compare/v0.28.0...v0.29.0) (2018-01-22)


### Bug Fixes

* **checkbox:** Remove unnecessary :enabled ([#1944](https://github.com/material-components/material-components-web/issues/1944)) ([9525aec](https://github.com/material-components/material-components-web/commit/9525aec))
* **demos:** Fix CSS selector for dark theme buttons ([#1933](https://github.com/material-components/material-components-web/issues/1933)) ([bbc479c](https://github.com/material-components/material-components-web/commit/bbc479c))
* **demos:** Fix NPEs in drawer demos ([#1946](https://github.com/material-components/material-components-web/issues/1946)) ([2c92827](https://github.com/material-components/material-components-web/commit/2c92827))
* **dialog:** Remove code that does nothing ([#1935](https://github.com/material-components/material-components-web/issues/1935)) ([fd0c675](https://github.com/material-components/material-components-web/commit/fd0c675))
* **list:** Fix the height of the dense avatar list ([#1905](https://github.com/material-components/material-components-web/issues/1905)) ([3e5f6e0](https://github.com/material-components/material-components-web/commit/3e5f6e0))
* **ripple:** Relax deduplication conditions for touch devices ([#1990](https://github.com/material-components/material-components-web/issues/1990)) ([450a699](https://github.com/material-components/material-components-web/commit/450a699))
* **rtl:** Fix typo in error message and make it more readable ([#1956](https://github.com/material-components/material-components-web/issues/1956)) ([6e4432c](https://github.com/material-components/material-components-web/commit/6e4432c))
* **select:** Remove unused JS logic for bottom-line scaleX transform ([#1910](https://github.com/material-components/material-components-web/issues/1910)) ([82a9fa3](https://github.com/material-components/material-components-web/commit/82a9fa3))
* **slider:** Add MDCSliderFoundation export ([#1959](https://github.com/material-components/material-components-web/issues/1959)) ([3a1786f](https://github.com/material-components/material-components-web/commit/3a1786f))
* **tabs:** removed ::after for css-only .mdc-tab__indicator ([#1983](https://github.com/material-components/material-components-web/issues/1983)) ([5787846](https://github.com/material-components/material-components-web/commit/5787846))
* **text-field:** Add outline to foundation map ([#1914](https://github.com/material-components/material-components-web/issues/1914)) ([8a8d53e](https://github.com/material-components/material-components-web/commit/8a8d53e))
* **text-field:** Fix focused hover state on outlined text field ([4df8319](https://github.com/material-components/material-components-web/commit/4df8319))
* **text-field:** Fix label shake animation ([#1882](https://github.com/material-components/material-components-web/issues/1882)) ([f7b5da4](https://github.com/material-components/material-components-web/commit/f7b5da4))
* **text-field:** Remove extra adapter method ([#1913](https://github.com/material-components/material-components-web/issues/1913)) ([656dc7c](https://github.com/material-components/material-components-web/commit/656dc7c))
* **textfield:** add primary color to textfield label on focus ([#1820](https://github.com/material-components/material-components-web/issues/1820)) ([31aa288](https://github.com/material-components/material-components-web/commit/31aa288))
* **textfield:** Fix textarea label from overlapping border. ([#1715](https://github.com/material-components/material-components-web/issues/1715)) ([673a84d](https://github.com/material-components/material-components-web/commit/673a84d))
* **toolbar:** Use transparent bg for menu icon to avoid IE 11 bug ([#1909](https://github.com/material-components/material-components-web/issues/1909)) ([2da3dc8](https://github.com/material-components/material-components-web/commit/2da3dc8)), closes [#881](https://github.com/material-components/material-components-web/issues/881)


### Chores

* **demos:** Use CSS files directly instead of Webpack's .css.js ([#1916](https://github.com/material-components/material-components-web/issues/1916)) ([d1ec729](https://github.com/material-components/material-components-web/commit/d1ec729))
* **select:** Remove multi-select from mdc-select. ([#1917](https://github.com/material-components/material-components-web/issues/1917)) ([145217c](https://github.com/material-components/material-components-web/commit/145217c))
* **tabs:** move indicator sass into custom mixins ([#1965](https://github.com/material-components/material-components-web/issues/1965)) ([fc3a9d5](https://github.com/material-components/material-components-web/commit/fc3a9d5))
* **text-field:** Move idle outline style method ([#1911](https://github.com/material-components/material-components-web/issues/1911)) ([5d3b350](https://github.com/material-components/material-components-web/commit/5d3b350))


### Features

* **demos:** Add global `demoReady()` function ([#1919](https://github.com/material-components/material-components-web/issues/1919)) ([da34cc9](https://github.com/material-components/material-components-web/commit/da34cc9))
* **demos:** Add theme switcher to theme demo page ([#1975](https://github.com/material-components/material-components-web/issues/1975)) ([4f89819](https://github.com/material-components/material-components-web/commit/4f89819))
* **select:** Move colors for default select to mixins ([#1934](https://github.com/material-components/material-components-web/issues/1934)) ([d6c68ce](https://github.com/material-components/material-components-web/commit/d6c68ce))
* **text-field:** Expand the helper text foundation ([#1955](https://github.com/material-components/material-components-web/issues/1955)) ([468942b](https://github.com/material-components/material-components-web/commit/468942b))
* **text-field:** Move color for default text-field to mixins. ([#1899](https://github.com/material-components/material-components-web/issues/1899)) ([ec4d18e](https://github.com/material-components/material-components-web/commit/ec4d18e))
* **text-field:** Move text-field outline colors to mixins ([#1963](https://github.com/material-components/material-components-web/issues/1963)) ([1dae53c](https://github.com/material-components/material-components-web/commit/1dae53c))
* **text-field:** Remove css only options. Update docs. Update demo ([#2012](https://github.com/material-components/material-components-web/issues/2012)) ([9d87adf](https://github.com/material-components/material-components-web/commit/9d87adf))


### BREAKING CHANGES

* **tabs:** removal of .mdc-toolbar selector forces clients to
customize tab-bars within toolbars that require a different ink color.
* **text-field:** Removes the css only version of the text-field component.
* **tabs:** all css-only mdc-tab elements must have a .mdc-tab__indicator
child element
* **select:** Move colors for default select element to mixins. Refer to the documentation for guidance.
refs: #1150

Move colors for the select into a new mixins file.
* **text-field:** Moves color customization of the outline text-field to SASS mixins.
* **select:** Removes mdc-multi-select from the mdc-select package. Use lists to create components that allow multiple items to be selected.
* **demos:** Sass source maps and hot reloading no longer work on demo pages. We can address those issues in future PRs if they become a problem. In addition, the `MDC_WRAP_CSS_IN_JS` env var now defaults to `false`.

This change:

1. Makes it possible to dynamically switch themes at runtime (follow-up PR)
2. Fixes the FOUC on all demo pages
3. Fixes sporadic rendering errors on all demo pages that call `getComputedStyle()` on page load (e.g., ripple)
4. Allows us to remove CSS polling from our demo JS (follow-up PR)
5. Reduces Chrome devtools memory leaks after hot reloading
* **text-field:** Text field outline adapter now must implement the `getIdleOutlineStyleValue` method previously implemented in the text field adapter. The functionality is exactly the same and requires only small changes to accessing the outline node.



<a name="0.28.0"></a>
# [0.28.0](https://github.com/material-components/material-components-web/compare/v0.27.0...v0.28.0) (2018-01-08)


### Bug Fixes

* **checkbox:** Remove duplicate background props ([#1812](https://github.com/material-components/material-components-web/issues/1812)) ([d3a2901](https://github.com/material-components/material-components-web/commit/d3a2901))
* **checkbox:** Respect BEM when outputting the base stylesheet ([#1733](https://github.com/material-components/material-components-web/issues/1733)) ([3e9bd5f](https://github.com/material-components/material-components-web/commit/3e9bd5f))
* **drawer:** update radio button ids to correct add/remove classes on demos ([#1883](https://github.com/material-components/material-components-web/issues/1883)) ([ac46b88](https://github.com/material-components/material-components-web/commit/ac46b88))
* **linear-progress:** restores progress when determinate set to true ([#1698](https://github.com/material-components/material-components-web/issues/1698)) ([1d9cd68](https://github.com/material-components/material-components-web/commit/1d9cd68)), closes [#1531](https://github.com/material-components/material-components-web/issues/1531)
* **list:** Move divider color style so it takes precedence ([#1856](https://github.com/material-components/material-components-web/issues/1856)) ([e3cb47c](https://github.com/material-components/material-components-web/commit/e3cb47c))
* **list:** Respect BEM when outputting the base stylesheet. ([#1799](https://github.com/material-components/material-components-web/issues/1799)) ([ee1c0db](https://github.com/material-components/material-components-web/commit/ee1c0db)), closes [#1748](https://github.com/material-components/material-components-web/issues/1748)
* **ripple:** Apply will-change to surface rather than pseudo-elements ([#1872](https://github.com/material-components/material-components-web/issues/1872)) ([2a69fef](https://github.com/material-components/material-components-web/commit/2a69fef))
* **ripple:** Listen for up events at document level ([#1800](https://github.com/material-components/material-components-web/issues/1800)) ([e9f02ed](https://github.com/material-components/material-components-web/commit/e9f02ed))
* **select:** Disable ripple/state pseudos for native multiselect ([#1781](https://github.com/material-components/material-components-web/issues/1781)) ([e96fe2f](https://github.com/material-components/material-components-web/commit/e96fe2f))
* **select:** Work around glitch with new list styles in Chrome ([#1757](https://github.com/material-components/material-components-web/issues/1757)) ([4c68267](https://github.com/material-components/material-components-web/commit/4c68267))
* **text-field:** allow commit message text-field with dash ([#1850](https://github.com/material-components/material-components-web/issues/1850)) ([2f9dd6f](https://github.com/material-components/material-components-web/commit/2f9dd6f))
* **text-field:** Update outline and label styles according to spec ([#1855](https://github.com/material-components/material-components-web/issues/1855)) ([6ada786](https://github.com/material-components/material-components-web/commit/6ada786))
* **text-field:** updated dependency check test and added special case for text-field ([#1860](https://github.com/material-components/material-components-web/issues/1860)) ([3061a61](https://github.com/material-components/material-components-web/commit/3061a61))
* **textfield:** Add isFocused to adapter in case autofocus attr is present ([#1815](https://github.com/material-components/material-components-web/issues/1815)) ([737f712](https://github.com/material-components/material-components-web/commit/737f712))
* **textfield:** Fix mixin calls for keyframes ([#1735](https://github.com/material-components/material-components-web/issues/1735)) ([cef10e8](https://github.com/material-components/material-components-web/commit/cef10e8))
* **textfield:** Fix placeholder colors ([#1813](https://github.com/material-components/material-components-web/issues/1813)) ([0e9fbe1](https://github.com/material-components/material-components-web/commit/0e9fbe1))
* **textfield:** safari input has rounded corners ([#1793](https://github.com/material-components/material-components-web/issues/1793)) ([2519b09](https://github.com/material-components/material-components-web/commit/2519b09))
* **theme:** replace inline comments in property-values map with multiline comments ([#1746](https://github.com/material-components/material-components-web/issues/1746)) ([f71025f](https://github.com/material-components/material-components-web/commit/f71025f))
* **typography:** change display2 font size to correct value ([#1652](https://github.com/material-components/material-components-web/issues/1652)) ([a943ad6](https://github.com/material-components/material-components-web/commit/a943ad6)), closes [#1638](https://github.com/material-components/material-components-web/issues/1638)


### Chores

* **ripple:** move common ripple styles out of mixins and into [@material](https://github.com/material)/ripple/common ([#1736](https://github.com/material-components/material-components-web/issues/1736)) ([acb47d7](https://github.com/material-components/material-components-web/commit/acb47d7))
* **text-field:** Split out icon into subelement ([#1697](https://github.com/material-components/material-components-web/issues/1697)) ([4e7fa3e](https://github.com/material-components/material-components-web/commit/4e7fa3e))
* **text-field:** Split out label into subelement ([#1693](https://github.com/material-components/material-components-web/issues/1693)) ([e483aae](https://github.com/material-components/material-components-web/commit/e483aae))
* **theme:** Remove constrast tone vars ([#1721](https://github.com/material-components/material-components-web/issues/1721)) ([f9527db](https://github.com/material-components/material-components-web/commit/f9527db))


### Features

* **drawer:** custom sass mixins for color, background, scrim ([#1730](https://github.com/material-components/material-components-web/issues/1730)) ([921a41f](https://github.com/material-components/material-components-web/commit/921a41f))
* **drawer:** Remove obsolete pre-states styles; update demo pages ([#1738](https://github.com/material-components/material-components-web/issues/1738)) ([7c68674](https://github.com/material-components/material-components-web/commit/7c68674))
* **elevation:** Remove transition mixin; use transition-value function ([#1871](https://github.com/material-components/material-components-web/issues/1871)) ([1ebad2c](https://github.com/material-components/material-components-web/commit/1ebad2c))
* **icon-toggle:** Add color theme mixin; remove --primary/--accent modifiers ([#1717](https://github.com/material-components/material-components-web/issues/1717)) ([efd9d5d](https://github.com/material-components/material-components-web/commit/efd9d5d)), closes [#1147](https://github.com/material-components/material-components-web/issues/1147)
* **list:** Rename elements to match spec; don't set size of meta ([#1716](https://github.com/material-components/material-components-web/issues/1716)) ([5dabcdf](https://github.com/material-components/material-components-web/commit/5dabcdf))
* **list:** Use states mixins; change padding behavior to support them ([#1737](https://github.com/material-components/material-components-web/issues/1737)) ([c8772ea](https://github.com/material-components/material-components-web/commit/c8772ea))
* **menu:** Add new anchor positioning functionality ([#1691](https://github.com/material-components/material-components-web/issues/1691)) ([da56619](https://github.com/material-components/material-components-web/commit/da56619)), closes [#1688](https://github.com/material-components/material-components-web/issues/1688)
* **menu:** Remove obsolete pre-states styles; fix dark-mode selector ([#1739](https://github.com/material-components/material-components-web/issues/1739)) ([f82998a](https://github.com/material-components/material-components-web/commit/f82998a))
* **ripple:** Add setUnbounded to foundation ([#1826](https://github.com/material-components/material-components-web/issues/1826)) ([a9e4868](https://github.com/material-components/material-components-web/commit/a9e4868))
* **ripple:** Remove old mixin and obsolete JS logic ([#1784](https://github.com/material-components/material-components-web/issues/1784)) ([617c61d](https://github.com/material-components/material-components-web/commit/617c61d))
* **select:** Move focus handling to surface element for focus shade ([#1803](https://github.com/material-components/material-components-web/issues/1803)) ([255b63e](https://github.com/material-components/material-components-web/commit/255b63e))
* **snackbar:** Emit show or hide event. fixes [#1603](https://github.com/material-components/material-components-web/issues/1603) ([#1755](https://github.com/material-components/material-components-web/issues/1755)) ([3e53614](https://github.com/material-components/material-components-web/commit/3e53614))
* **tab:** sass color mixins ([#1851](https://github.com/material-components/material-components-web/issues/1851)) ([9bb3be5](https://github.com/material-components/material-components-web/commit/9bb3be5))
* **text-field:** Add CSS-only version of outlined text field ([#1824](https://github.com/material-components/material-components-web/issues/1824)) ([dd5ea7b](https://github.com/material-components/material-components-web/commit/dd5ea7b))
* **text-field:** Add dense mode to outlined text field ([#1846](https://github.com/material-components/material-components-web/issues/1846)) ([5a19695](https://github.com/material-components/material-components-web/commit/5a19695))
* **text-field:** Add outline subelement and demo for outlined text field ([#1749](https://github.com/material-components/material-components-web/issues/1749)) ([4ce3582](https://github.com/material-components/material-components-web/commit/4ce3582))
* **text-field:** Add properties for value, disable, value, and required ([#1873](https://github.com/material-components/material-components-web/issues/1873)) ([d7b9345](https://github.com/material-components/material-components-web/commit/d7b9345))
* **text-field:** Add ripple to outlined text field ([#1807](https://github.com/material-components/material-components-web/issues/1807)) ([49fc1c4](https://github.com/material-components/material-components-web/commit/49fc1c4))
* **text-field:** Handle leading/trailing icons in outlined text field ([#1858](https://github.com/material-components/material-components-web/issues/1858)) ([ca0af1b](https://github.com/material-components/material-components-web/commit/ca0af1b))
* **theme:** Switch to new theme demo page ([#1886](https://github.com/material-components/material-components-web/issues/1886)) ([daefeba](https://github.com/material-components/material-components-web/commit/daefeba))
* **theme:** Update baseline theme colors ([#1884](https://github.com/material-components/material-components-web/issues/1884)) ([f19bfbe](https://github.com/material-components/material-components-web/commit/f19bfbe))
* **toolbar:** Add theme color mixins ([#1720](https://github.com/material-components/material-components-web/issues/1720)) ([328df77](https://github.com/material-components/material-components-web/commit/328df77)), closes [#1154](https://github.com/material-components/material-components-web/issues/1154)
* **typography:** Support custom properties in mdc-typography mixin ([#1664](https://github.com/material-components/material-components-web/issues/1664)) ([c50363d](https://github.com/material-components/material-components-web/commit/c50363d))


### BREAKING CHANGES

* **menu:** Removes 5 adapter methods and adds a new setMaxHeight adapter method; adds anchor positioning API to menu foundation; see README for details.
* **text-field:** Remove `addClassToLabel` and `removeClassFromLabel` from `MDCTextFieldAdapter` implementations.
* **ripple:** `registerDocumentInteractionHandler ` and `deregisterDocumentInteractionHandler` APIs have been added to the ripple adapter.
* **elevation:** The `mdc-elevation-transition` mixin has been removed, and the `mdc-elevation-transition-rule` function has been renamed to `mdc-elevation-transition-value`, which should be used instead.
* **text-field:** Please implement `hasClass` method on MDCTextFieldAdapter, and change `getFloatingWidth` method to `getWidth` on MDCTextFieldLabelFoundation.
* **drawer:** Renamed `mdc-permanent-drawer` CSS class to `mdc-drawer--permanent`, renamed `mdc-temporary-drawer` CSS class to `mdc-drawer--temporary`, and renamed `mdc-persistent-drawer` to `mdc-drawer--persistent`. Also renamed all subelement classes by removing the variant from the selectors. Example:

```
mdc-persistent-drawer__drawer --> mdc-drawer__drawer
mdc-persistent-drawer__toolbar-spacer --> mdc-drawer__toolbar-spacer
mdc-temporary-drawer__header --> mdc-drawer__header
mdc-temporary-drawer__header-content --> mdc-drawer__header-content
mdc-permanent-drawer__content --> mdc-drawer__content
```
* **textfield:** Added isFocused() to Text Field adapter
* **select:** JS-enhanced Select should now apply tabindex to the surface element instead of the root element. The adapter APIs related to focus, interaction handling, and tabbability now operate on the surface element instead of the root element.
* **ripple:** The mdc-ripple-color mixin is removed; use the mdc-states-* mixins instead.
* **text-field:** - The return type for `MDCTextFieldAdapter.getNativeInput()` has changed. See the 'NativeInputType` typedef in the adapter.
- MDCTextFieldLabelFoundation has removed:
  - `floatAbove`
  - `deactivateFocus`
  - `setValidity`
- They are replaced with methods for updating the label float and label shake styles:
  - `styleFloat`
  - `styleShake`
* **text-field:** Remove `setIconAttr`, `eventTargetHasClass` and `notifyIconAction` from `MDCTextFieldAdapter` implementations.
* **drawer:** the "mdc-...-drawer--selected" classes are replaced by "mdc-list-item--activated", as it pertains to a specific list item and not the entire drawer.
* **menu:** the "mdc-simple-menu--selected" class is replaced by "mdc-list-item--selected", as it pertains to a specific list item and not the entire menu.
* **list:** List padding is now per-item rather than across the entire list. Separators now span the entire list width by default, with the addition of a mdc-list-divider--padded modifier class to achieve the old default behavior.
* **theme:** `$mdc-theme-primary-tone` and friends have been removed. We now use a private function instead.
* **ripple:** Please update all components which use MDC Ripple to import the new /common file
* **list:** `__start-detail` has been renamed to `__graphic`, and `__end-detail` has been renamed to `__meta`. In addition, meta data tiles no longer have a default width/height (fixes #1644).

Also:
- Format mdc-list README
- Capitalize headings in mdc-list README and demo
* **icon-toggle:** The `--primary` and `--accent` CSS modifier classes have been removed in favor of the new mixin.
* **text-field:** Public method `layout()` and adapter methods `getIdleOutlineStyleValue()` and `isRtl()` were added to MDCTextField. Added a new subcomponent MDCTextFieldOutline, and adapter method `getWidth()` to MDCTextFieldLabel.



<a name="0.27.0"></a>
# [0.27.0](https://github.com/material-components/material-components-web/compare/v0.26.0...v0.27.0) (2017-12-11)


### Bug Fixes

* **demos:** add back button to header on drawer demos page ([#1703](https://github.com/material-components/material-components-web/issues/1703)) ([fa72e42](https://github.com/material-components/material-components-web/commit/fa72e42))
* **drawer:** Change how click events are handled ([3e173e1](https://github.com/material-components/material-components-web/commit/3e173e1))
* **icon-toggle:** Don't nuke tabindex if initializing disabled to false ([#1667](https://github.com/material-components/material-components-web/issues/1667)) ([9ec35b7](https://github.com/material-components/material-components-web/commit/9ec35b7))
* **linear-progress:** default size ([#1694](https://github.com/material-components/material-components-web/issues/1694)) ([35d362c](https://github.com/material-components/material-components-web/commit/35d362c)), closes [#1528](https://github.com/material-components/material-components-web/issues/1528)
* **toolbar:** margin for fixed toolbar ([28b97a5](https://github.com/material-components/material-components-web/commit/28b97a5))


### Chores

* **list:** Rename CSS class to follow BEM naming ([#1660](https://github.com/material-components/material-components-web/issues/1660)) ([7a23183](https://github.com/material-components/material-components-web/commit/7a23183))
* **text-field:** Pass subelement foundations through MDCTextField super constructor ([#1684](https://github.com/material-components/material-components-web/issues/1684)) ([80223f2](https://github.com/material-components/material-components-web/commit/80223f2))


### Features

* **button:** Use mdc-states mixin for button styles ([#1668](https://github.com/material-components/material-components-web/issues/1668)) ([55fbba9](https://github.com/material-components/material-components-web/commit/55fbba9))
* **checkbox:** Use new mdc-states mixin for checkbox styles ([#1672](https://github.com/material-components/material-components-web/issues/1672)) ([dab612c](https://github.com/material-components/material-components-web/commit/dab612c))
* **fab:** Use new mdc-states mixin for fab styles ([#1669](https://github.com/material-components/material-components-web/issues/1669)) ([9ab48b7](https://github.com/material-components/material-components-web/commit/9ab48b7))
* **icon-toggle:** Use new mdc-states mixin for icon-toggle styles ([#1685](https://github.com/material-components/material-components-web/issues/1685)) ([75eb1bc](https://github.com/material-components/material-components-web/commit/75eb1bc))
* **infrastructure:** Add build command for static demo assets ([#1589](https://github.com/material-components/material-components-web/issues/1589)) ([54465d9](https://github.com/material-components/material-components-web/commit/54465d9))
* **list:** Add color theme mixins & --selected/--activated modifiers ([#1663](https://github.com/material-components/material-components-web/issues/1663)) ([6ea948f](https://github.com/material-components/material-components-web/commit/6ea948f)), closes [#1662](https://github.com/material-components/material-components-web/issues/1662)
* **menu:** Fix menu to only fire one event per interaction ([02fe795](https://github.com/material-components/material-components-web/commit/02fe795))
* **radio:** Use new mdc-states mixin for radio styles ([#1673](https://github.com/material-components/material-components-web/issues/1673)) ([5065576](https://github.com/material-components/material-components-web/commit/5065576))
* **ripple:** Add new states mixins ([#1624](https://github.com/material-components/material-components-web/issues/1624)) ([9356449](https://github.com/material-components/material-components-web/commit/9356449))
* **ripple:** Add support for activated and selected states ([#1696](https://github.com/material-components/material-components-web/issues/1696)) ([6f7008c](https://github.com/material-components/material-components-web/commit/6f7008c))
* **select:** Add new UX styles and behavior to select ([99878c1](https://github.com/material-components/material-components-web/commit/99878c1))
* **select:** Use new mdc-states mixin for select styles ([#1704](https://github.com/material-components/material-components-web/issues/1704)) ([3043a54](https://github.com/material-components/material-components-web/commit/3043a54))
* **tabs:** Use new mdc-states mixin for tab styles ([#1674](https://github.com/material-components/material-components-web/issues/1674)) ([f7f1eb0](https://github.com/material-components/material-components-web/commit/f7f1eb0))
* **textfield:** Use mdc-states mixin and add support for focus shade ([#1677](https://github.com/material-components/material-components-web/issues/1677)) ([2918031](https://github.com/material-components/material-components-web/commit/2918031))
* **theme:** Add accessible-ink-color function ([#1719](https://github.com/material-components/material-components-web/issues/1719)) ([49cd750](https://github.com/material-components/material-components-web/commit/49cd750))
* **theme:** Support currentColor in mdc-theme-prop* ([#1657](https://github.com/material-components/material-components-web/issues/1657)) ([7e1255e](https://github.com/material-components/material-components-web/commit/7e1255e))


### BREAKING CHANGES

* **select:** Adds several adapter methods to facilitate the new UX styles. Changes DOM requirements. Refer to https://github.com/material-components/material-components-web/blob/master/packages/mdc-select/README.md for new implementation requirements.
* **text-field:** Please update implementations of MDCTextField to pass in a map of subfoundations to the MDCTextFieldFoundation constructor. Methods getBottomLineFoundation() and getHelperTextFoundation() are no longer in MDCTextFieldAdapter. See the README for mdc-textfield/input for more information.
* **button:** The $mdc-*-button-ripple-opacity variables have been removed, as these values are now available via the state opacity maps in mdc-ripple.
* **drawer:** Adds eventTargetHasClass method to the temporary drawer adapter API.
* **list:** The `mdc-list-item__text__secondary` class was renamed to `mdc-list-item__secondary-text` to follow BEM conventions. See the [BEM FAQ](http://getbem.com/faq/#css-nested-elements) for more details.
* **menu:** Adds an adapter method eventTargetHasClass to check if a given event target has a given class



<a name="0.26.0"></a>
# [0.26.0](https://github.com/material-components/material-components-web/compare/v0.25.0...v0.26.0) (2017-11-27)


### Bug Fixes

* **list:** Add 8px bottom padding ([cd03a0e](https://github.com/material-components/material-components-web/commit/cd03a0e)), closes [#1488](https://github.com/material-components/material-components-web/issues/1488)
* **list:** Make bottom padding match top for dense lists ([#1622](https://github.com/material-components/material-components-web/issues/1622)) ([67354d0](https://github.com/material-components/material-components-web/commit/67354d0))
* **select:** Don't scroll page when select's menu is open ([#1500](https://github.com/material-components/material-components-web/issues/1500)) ([bddd747](https://github.com/material-components/material-components-web/commit/bddd747)), closes [#879](https://github.com/material-components/material-components-web/issues/879)
* **select:** Make CSS-only background transparent ([#1499](https://github.com/material-components/material-components-web/issues/1499)) ([964a419](https://github.com/material-components/material-components-web/commit/964a419))
* **slider:** Properly handle arrow key events in IE ([#1613](https://github.com/material-components/material-components-web/issues/1613)) ([476c81f](https://github.com/material-components/material-components-web/commit/476c81f))
* **textfield:** Should not be in both disabled and invalid state ([#1568](https://github.com/material-components/material-components-web/issues/1568)) ([874a17e](https://github.com/material-components/material-components-web/commit/874a17e))


### Chores

* **text-field:** Split out helper text as a subelement ([#1611](https://github.com/material-components/material-components-web/issues/1611)) ([8107b08](https://github.com/material-components/material-components-web/commit/8107b08))
* **text-field:** Splitting out bottom line as a sub element ([#1585](https://github.com/material-components/material-components-web/issues/1585)) ([b12c576](https://github.com/material-components/material-components-web/commit/b12c576))


### Features

* **text-field:** rename helptext to helper text ([#1576](https://github.com/material-components/material-components-web/issues/1576)) ([1a5acee](https://github.com/material-components/material-components-web/commit/1a5acee))
* **textfield:** helperTextContent setter ([#1569](https://github.com/material-components/material-components-web/issues/1569)) ([875e393](https://github.com/material-components/material-components-web/commit/875e393))


### BREAKING CHANGES

* **text-field:** Please update implementations of MDCTextFieldAdapter to implement the method getHelperTextFoundation. MDCTextFieldAdapter no longer implements addClassToHelperText, removeClassFromHelperText, helperTextHasClass,  setHelperTextAttr, removeHelperTextAttr, and setHelperTextContent. See the README for mdc-textfield/helper-text for more information.
* **textfield:** Adds adapter method to set helper text content.
* **text-field:** Please update implementations of MDCTextFieldAdapter to implement the methods registerBottomLineEventHandler, deregisterBottomLineEventHandler, and getBottomLineFoundation. See the README for mdc-textfield/bottom-line for more information.
* **text-field:** Instances of "helptext" in mdc-textfield/adapter.js has changed to "helperText", and users should update their implementations of the adapter.



<a name="0.25.0"></a>
# [0.25.0](https://github.com/material-components/material-components-web/compare/v0.24.0...v0.25.0) (2017-11-13)


### Bug Fixes

* **button:** Stroked buttons should change the padding of the button ([#1538](https://github.com/material-components/material-components-web/issues/1538)) ([97e5aa8](https://github.com/material-components/material-components-web/commit/97e5aa8))
* **checkbox:** Close path tag to remove IE console error warnings ([1a82689](https://github.com/material-components/material-components-web/commit/1a82689)), closes [#1504](https://github.com/material-components/material-components-web/issues/1504)
* **dialog:** fixed dark-theme dialog copy color ([#1524](https://github.com/material-components/material-components-web/issues/1524)) ([1aa3760](https://github.com/material-components/material-components-web/commit/1aa3760)), closes [#1032](https://github.com/material-components/material-components-web/issues/1032)
* **menu:** Menu opening animation shows scrollbar ([#1513](https://github.com/material-components/material-components-web/issues/1513)) ([94b712a](https://github.com/material-components/material-components-web/commit/94b712a)), closes [#1387](https://github.com/material-components/material-components-web/issues/1387)
* **slider:** Don't hide focus ring on discrete sliders ([#1545](https://github.com/material-components/material-components-web/issues/1545)) ([5a777af](https://github.com/material-components/material-components-web/commit/5a777af)), closes [#1427](https://github.com/material-components/material-components-web/issues/1427)
* **slider:** Fix mobile Chrome by handling all "up" event types ([#1484](https://github.com/material-components/material-components-web/issues/1484)) ([bcc5ec5](https://github.com/material-components/material-components-web/commit/bcc5ec5))
* **snackbar:** Add padding between text and button ([#1572](https://github.com/material-components/material-components-web/issues/1572)) ([93f2d5c](https://github.com/material-components/material-components-web/commit/93f2d5c))


### Features

* **elevation:** Update mixin to accept custom theme color ([#1449](https://github.com/material-components/material-components-web/issues/1449)) ([e02b4c9](https://github.com/material-components/material-components-web/commit/e02b4c9)), closes [#1534](https://github.com/material-components/material-components-web/issues/1534)
* **linear-progress:** Add color theme mixins and remove `--accent` ([#1541](https://github.com/material-components/material-components-web/issues/1541)) ([31d9d7b](https://github.com/material-components/material-components-web/commit/31d9d7b)), closes [#1148](https://github.com/material-components/material-components-web/issues/1148)
* **slider:** Add color theme mixins; default to secondary; remove `--off` ([#1544](https://github.com/material-components/material-components-web/issues/1544)) ([28024e9](https://github.com/material-components/material-components-web/commit/28024e9)), closes [#1151](https://github.com/material-components/material-components-web/issues/1151)
* **text-field:** rename textfield to text-field ([#1485](https://github.com/material-components/material-components-web/issues/1485)) ([8093ad1](https://github.com/material-components/material-components-web/commit/8093ad1))
* **textfield:** Convert some foundation methods from private to public ([#1543](https://github.com/material-components/material-components-web/issues/1543)) ([a8dcc59](https://github.com/material-components/material-components-web/commit/a8dcc59)), closes [#1550](https://github.com/material-components/material-components-web/issues/1550)
* **theme:** Add new tone mixins and deprecate old one ([#1546](https://github.com/material-components/material-components-web/issues/1546)) ([57581ed](https://github.com/material-components/material-components-web/commit/57581ed))
* **theme:** Allow overriding of text themes ([#1481](https://github.com/material-components/material-components-web/issues/1481)) ([f579e0a](https://github.com/material-components/material-components-web/commit/f579e0a))


### Performance Improvements

* **button:** Remove extra CSS, now that ripple handles tap highlight color ([#1520](https://github.com/material-components/material-components-web/issues/1520)) ([0a5fec5](https://github.com/material-components/material-components-web/commit/0a5fec5))


### BREAKING CHANGES

* **linear-progress:** The `mdc-linear-progres--accent` modifier class has been removed. Use Sass color mixins instead.
* **slider:** The `mdc-slider--off` modifier class has been removed as it is being removed from the spec.
* **text-field:** CSS class name "mdc-textfield" is changed to "mdc-text-field", JS objects name "MDCTextfield" is changed to "MDCTextField", .scss file names "mdc-textfield.scss" is changed to "mdc-text-field.scss", global namespace "mdc.textfield" is changed to "mdc.textField". Note that the package name is unchanged.



<a name="0.24.0"></a>
# [0.24.0](https://github.com/material-components/material-components-web/compare/v0.23.0...v0.24.0) (2017-10-30)


### Bug Fixes

* **button:** Revise button minimum width ([#1487](https://github.com/material-components/material-components-web/issues/1487)) ([cb73283](https://github.com/material-components/material-components-web/commit/cb73283))
* **layout-grid:** Import the variables in the mixin ([#1232](https://github.com/material-components/material-components-web/issues/1232)) ([924144b](https://github.com/material-components/material-components-web/commit/924144b))
* **ripple:** Avoid duplicating common styles ([#1463](https://github.com/material-components/material-components-web/issues/1463)) ([756d8a6](https://github.com/material-components/material-components-web/commit/756d8a6))
* **snackbar:** Explicitly use border-box ([#1453](https://github.com/material-components/material-components-web/issues/1453)) ([7455978](https://github.com/material-components/material-components-web/commit/7455978))


### Features

* **button:** Use new ripple mixins, and remove unnecessary mixin ([#1471](https://github.com/material-components/material-components-web/issues/1471)) ([510f356](https://github.com/material-components/material-components-web/commit/510f356))
* **checkbox:** Use new ripple mixins, and remove unnecessary mixin ([#1472](https://github.com/material-components/material-components-web/issues/1472)) ([92b22eb](https://github.com/material-components/material-components-web/commit/92b22eb))
* **fab:** Use new ripple mixins; remove unnecessary mixin/variable ([#1473](https://github.com/material-components/material-components-web/issues/1473)) ([fb798db](https://github.com/material-components/material-components-web/commit/fb798db))
* **icon-toggle:** Add public API for MDCRipple in icon-toggle ([#1396](https://github.com/material-components/material-components-web/issues/1396)) ([f496581](https://github.com/material-components/material-components-web/commit/f496581))
* **icon-toggle:** Use new ripple mixins ([#1474](https://github.com/material-components/material-components-web/issues/1474)) ([cbc3e1c](https://github.com/material-components/material-components-web/commit/cbc3e1c))
* **list:** Use new ripple mixins ([#1475](https://github.com/material-components/material-components-web/issues/1475)) ([0647576](https://github.com/material-components/material-components-web/commit/0647576))
* **radio:** Add theme color mixins and update default color to secondary ([#1410](https://github.com/material-components/material-components-web/issues/1410)) ([da9d48f](https://github.com/material-components/material-components-web/commit/da9d48f)), closes [#1149](https://github.com/material-components/material-components-web/issues/1149)
* **radio:** Use new ripple mixins, and remove unnecessary mixin ([#1476](https://github.com/material-components/material-components-web/issues/1476)) ([94a826d](https://github.com/material-components/material-components-web/commit/94a826d))
* **ripple:** Add new simpler mixins and remove unused CSS vars ([#1452](https://github.com/material-components/material-components-web/issues/1452)) ([a983c01](https://github.com/material-components/material-components-web/commit/a983c01))
* **ripple:** Remove old complex mixins ([#1496](https://github.com/material-components/material-components-web/issues/1496)) ([47c6859](https://github.com/material-components/material-components-web/commit/47c6859))
* **switch:** Add color theme mixins and update default color to secondary ([#1411](https://github.com/material-components/material-components-web/issues/1411)) ([e4b4fa7](https://github.com/material-components/material-components-web/commit/e4b4fa7)), closes [#1144](https://github.com/material-components/material-components-web/issues/1144)
* **tabs:** Use new ripple mixins ([#1492](https://github.com/material-components/material-components-web/issues/1492)) ([253fba0](https://github.com/material-components/material-components-web/commit/253fba0))
* **textfield:** Add mixin allowing customization of border radii ([#1446](https://github.com/material-components/material-components-web/issues/1446)) ([483e3d5](https://github.com/material-components/material-components-web/commit/483e3d5))
* **textfield:** Use new ripple mixins and remove hover ripple styles ([#1477](https://github.com/material-components/material-components-web/issues/1477)) ([2a71ef7](https://github.com/material-components/material-components-web/commit/2a71ef7))
* **theme:** rename all color_palette instances ([#1479](https://github.com/material-components/material-components-web/issues/1479)) ([375661d](https://github.com/material-components/material-components-web/commit/375661d))


### BREAKING CHANGES

* **ripple:** The existing MDC Ripple Sass mixins mdc-ripple-base, mdc-ripple-fg, and mdc-ripple-bg have been removed, replaced by the new easier-to-use mixins mdc-ripple-surface, mdc-ripple-color, and mdc-ripple-radius.
* **radio:** The mdc-radio-ripple mixin has been removed; use mdc-ripple-color directly.
* **fab:** The mdc-fab-ripple mixin and $mdc-fab-light-ripple-config variable have been removed; use MDC Ripple's mdc-ripple-color mixin and opacity variables directly.
* **checkbox:** The mdc-checkbox-ripple mixin has been removed; use mdc-ripple-color directly.
* **button:** The mdc-button-ripple mixin has been removed; use mdc-ripple-color directly.
* **theme:** _color_palette.scss has been renamed to _color-palette.scss in mdc-theme



<a name="0.23.0"></a>
# [0.23.0](https://github.com/material-components/material-components-web/compare/v0.22.0...v0.23.0) (2017-10-16)


### Bug Fixes

* **list item:** Add overflow hidden (#1290) ([05b1201](https://github.com/material-components/material-components-web/commit/05b1201)), closes [#1261](https://github.com/material-components/material-components-web/issues/1261)
* **menu:** Add pointer-events: none to avoid blocking click events (#1421) ([b77895b](https://github.com/material-components/material-components-web/commit/b77895b))
* **slider:** Deregister correct handlers on destroy (#1431) ([928d6b4](https://github.com/material-components/material-components-web/commit/928d6b4))
* **toolbar:** Update menu-icon className (#992) (#1373) ([36577ab](https://github.com/material-components/material-components-web/commit/36577ab))


### Features

* **checkbox:** Add color theme mixins and update default color to secondary (#1365) ([cc7538f](https://github.com/material-components/material-components-web/commit/cc7538f)), closes [#1146](https://github.com/material-components/material-components-web/issues/1146)
* **ripple:** Add optional event parameters to activate/deactivate methods ([891e962](https://github.com/material-components/material-components-web/commit/891e962))
* **textfield:** Add textfield to the Closure whitelist. (#1394) ([8b05e88](https://github.com/material-components/material-components-web/commit/8b05e88))
* **textfield:** Annotate textfield for Closure Compiler. (#1386) ([1152b8d](https://github.com/material-components/material-components-web/commit/1152b8d))


### BREAKING CHANGES

* Please update `mdc-toolbar__icon--menu` to `mdc-toolbar__menu-icon`



<a name="0.22.0"></a>
# [0.22.0](https://github.com/material-components/material-components-web/compare/v0.21.1...v0.22.0) (2017-10-02)


### Bug Fixes

* **button:** Default to primary color ([#1356](https://github.com/material-components/material-components-web/issues/1356)) ([0b808b8](https://github.com/material-components/material-components-web/commit/0b808b8))
* **button:** Ignore CSS variables in Edge for mdc-button-container-fill-color ([5c55e92](https://github.com/material-components/material-components-web/commit/5c55e92))
* **checkbox:** Ignore CSS variables in Edge for __background::before ([67129e9](https://github.com/material-components/material-components-web/commit/67129e9))
* **demos:** Update misleading textfield validation message ([#1377](https://github.com/material-components/material-components-web/issues/1377)) ([99c9596](https://github.com/material-components/material-components-web/commit/99c9596))
* **fab:** Add hover/focus elevation ([#1331](https://github.com/material-components/material-components-web/issues/1331)) ([cb9995d](https://github.com/material-components/material-components-web/commit/cb9995d))
* **fab:** Ignore CSS variables in Edge for mdc-fab-container-color ([bf0f722](https://github.com/material-components/material-components-web/commit/bf0f722))
* **menu:** Only show scrollbar when menu item is too big  ([fe7d4c8](https://github.com/material-components/material-components-web/commit/fe7d4c8)), closes [#1247](https://github.com/material-components/material-components-web/issues/1247)
* **radio:** Ignore CSS variables in Edge for __background::before ([a7e2db4](https://github.com/material-components/material-components-web/commit/a7e2db4))


### Features

* **textfield:** Implement updated UX states for text fields ([#998](https://github.com/material-components/material-components-web/issues/998)) ([45c6cf6](https://github.com/material-components/material-components-web/commit/45c6cf6))
* **theme:** Add Edge opt-out option to mdc-theme-prop ([262e17b](https://github.com/material-components/material-components-web/commit/262e17b))


### BREAKING CHANGES

* **textfield:** DOM change to add a bottom line element. Adapter API changes to consolidate event handlers. Renamed multi-line text field to textarea.



<a name="0.21.1"></a>
## [0.21.1](https://github.com/material-components/material-components-web/compare/v0.21.0...v0.21.1) (2017-09-20)


### Bug Fixes

* **fab:** Fix transitions by importing correct mdc-animation resource (#1325) ([e005460](https://github.com/material-components/material-components-web/commit/e005460)), closes [#1325](https://github.com/material-components/material-components-web/issues/1325)
* **toolbar:** Fix toolbar padding on desktop and mobile (#1327) ([9b79871](https://github.com/material-components/material-components-web/commit/9b79871)), closes [#1327](https://github.com/material-components/material-components-web/issues/1327)



<a name="0.21.0"></a>
# [0.21.0](https://github.com/material-components/material-components-web/compare/v0.20.0...v0.21.0) (2017-09-18)


### Bug Fixes

* **ripple:** Move feature detect CSS to mixins (#1302) ([628b8c4](https://github.com/material-components/material-components-web/commit/628b8c4))
* **slider:** Add two test cases to cover give default value to step for discrete slider (#1262) ([38c40f7](https://github.com/material-components/material-components-web/commit/38c40f7))
* **slider:** Set default step value directly when initialize (#1173) (#1245) ([148f510](https://github.com/material-components/material-components-web/commit/148f510)), closes [#1173](https://github.com/material-components/material-components-web/issues/1173)
* **snackbar:** Drop mdc-button from snackbar's dependency (#1292) ([be502c8](https://github.com/material-components/material-components-web/commit/be502c8))
* **snackbar:** Fix lint error (#1303) ([648f985](https://github.com/material-components/material-components-web/commit/648f985)), closes [#1303](https://github.com/material-components/material-components-web/issues/1303)


### Chores

* **animation:** Removing mixins and CSS classes (#1242) ([3f8c49b](https://github.com/material-components/material-components-web/commit/3f8c49b))
* **fab:** Remove the mdc-fab--plain modifier (#1249) ([f561560](https://github.com/material-components/material-components-web/commit/f561560)), closes [#1143](https://github.com/material-components/material-components-web/issues/1143)


### Code Refactoring

* **button:** Remove primary and accent modifier (#1270) ([3e3c869](https://github.com/material-components/material-components-web/commit/3e3c869))


### Features

* **auto-init:** Fire event on mdcAutoInit complete (#1012) ([08b5a32](https://github.com/material-components/material-components-web/commit/08b5a32)), closes [#954](https://github.com/material-components/material-components-web/issues/954)
* **button:** Add mdc-button-filled-accessible mixin (#1256) ([d37132f](https://github.com/material-components/material-components-web/commit/d37132f))
* **button:** create theme mixin for button (#1244) ([5266776](https://github.com/material-components/material-components-web/commit/5266776))
* **button:** Move disabled style into private base mixin  (#1255) ([2336128](https://github.com/material-components/material-components-web/commit/2336128))
* **button:** Support icon in button (#1281) ([b727c14](https://github.com/material-components/material-components-web/commit/b727c14))
* **fab:** Add mdc-fab-accessible mixin (#1238) ([4ed8b5e](https://github.com/material-components/material-components-web/commit/4ed8b5e))
* **fab:** Implement enter/exit transitions (#1241) ([6d6ba4a](https://github.com/material-components/material-components-web/commit/6d6ba4a))
* **tabs:** Publicize MDCTabBarScrollerFoundation#scrollToTabAtIndex (#1267) ([a8f7216](https://github.com/material-components/material-components-web/commit/a8f7216))


### BREAKING CHANGES

* **snackbar:** Removed the dependency of mdc-button from DOM structure of snackbar.
* **button:** Remove support of `mdc-button--primary` and `mdc-button--accent` modifier classes. For custom and theme button implementation, use button mixins instead. See `demos.scss` for details.
* **fab:** Removes mdc-fab--plain, please update your code to use mdc-fab-accessible mixin instead.
* **animation:** Removes mdc-animation mixins and CSS classes, please reference mdc-animation Sass variables directly.



<a name="0.20.0"></a>
# [0.20.0](https://github.com/material-components/material-components-web/compare/v0.19.0...v0.20.0) (2017-09-05)


### Bug Fixes

* **demos:** Fix trailing whitespace and mixed tabs in dialog demo (#1200) ([e1f5d53](https://github.com/material-components/material-components-web/commit/e1f5d53)), closes [#1200](https://github.com/material-components/material-components-web/issues/1200)
* **demos:** Update first tab bar's layout when toggling RTL (#1204) ([cdd367e](https://github.com/material-components/material-components-web/commit/cdd367e))
* **dialog:** Fix z-index & wrong CSS (#1094) ([88b7167](https://github.com/material-components/material-components-web/commit/88b7167)), closes [#1094](https://github.com/material-components/material-components-web/issues/1094) [#1095](https://github.com/material-components/material-components-web/issues/1095) [#1096](https://github.com/material-components/material-components-web/issues/1096)
* **ripple:** Avoid errors in feature-detect within hidden iframes in Firefox (#1216) ([adbcce2](https://github.com/material-components/material-components-web/commit/adbcce2))
* **ripple:** Don't create dynamic stylesheet for Edge feature-detect (#1206) ([81523a1](https://github.com/material-components/material-components-web/commit/81523a1))


### Features

* **button:** Implement stroked button (#1194) ([56bf37d](https://github.com/material-components/material-components-web/commit/56bf37d)), closes [#987](https://github.com/material-components/material-components-web/issues/987)
* **fab:** Remove disabled styles (#1198) ([959d332](https://github.com/material-components/material-components-web/commit/959d332))
* **textfield:** Add valid setter, so clients can set custom validity ([cb17052](https://github.com/material-components/material-components-web/commit/cb17052)), closes [#1018](https://github.com/material-components/material-components-web/issues/1018)
* **theme:** `mdc-theme-prop` accepts literal color values (#1129) ([e47f3e6](https://github.com/material-components/material-components-web/commit/e47f3e6))
* **theme:** Luminance-aware light/dark tonal variants (#1131) ([90e7556](https://github.com/material-components/material-components-web/commit/90e7556))


### BREAKING CHANGES

* **fab:** Removes styles for disabled FABs, as FABs were not designed to be disabled.



<a name="0.19.0"></a>
# [0.19.0](https://github.com/material-components/material-components-web/compare/v0.18.1...v0.19.0) (2017-08-25)


### Bug Fixes

* **ripple:** Revert #1098 to fix bounded ripples (#1183) ([5769a7b](https://github.com/material-components/material-components-web/commit/5769a7b)), closes [#1183](https://github.com/material-components/material-components-web/issues/1183)


### Features

* **button:** implement unelevated button (#1157) ([3cca7ef](https://github.com/material-components/material-components-web/commit/3cca7ef))



<a name="0.18.1"></a>
## [0.18.1](https://github.com/material-components/material-components-web/compare/v0.18.0...v0.18.1) (2017-08-24)


### Bug Fixes

* **button:** Restore order of disabled styles (#1176) ([6ffed49](https://github.com/material-components/material-components-web/commit/6ffed49))
* **demos:** Fix button demo update from #1176 to work in IE 11 (#1178) ([dadc597](https://github.com/material-components/material-components-web/commit/dadc597)), closes [#1176](https://github.com/material-components/material-components-web/issues/1176) [#1178](https://github.com/material-components/material-components-web/issues/1178)
* **ripple:** Correct unbounded ripple diameter (#1098) ([0f1ca35](https://github.com/material-components/material-components-web/commit/0f1ca35)), closes [#1067](https://github.com/material-components/material-components-web/issues/1067)
* **textfield:** Add left and right margin to helptext ([3a24bca](https://github.com/material-components/material-components-web/commit/3a24bca))



<a name="0.18.0"></a>
# [0.18.0](https://github.com/material-components/material-components-web/compare/v0.17.0...v0.18.0) (2017-08-21)


### Bug Fixes

* Make CSS custom properties compatible with sass-spec 3.5 (#1076) ([264c154](https://github.com/material-components/material-components-web/commit/264c154)), closes [#1075](https://github.com/material-components/material-components-web/issues/1075)
* **button:** Un-break the build by referencing `secondary` theme prop instead of `accent` (#1156) ([d3ff8fc](https://github.com/material-components/material-components-web/commit/d3ff8fc))
* **demos:** Convert NodeList to array for forEach; avoid fat arrow (#1073) ([c6a1f2a](https://github.com/material-components/material-components-web/commit/c6a1f2a))
* **dialog:** Layout footer buttons' ripples after open transition ends (#1087) ([c51fcd5](https://github.com/material-components/material-components-web/commit/c51fcd5))
* **grid-list:** Gracefully degrade tile width. (#1136) ([97575c3](https://github.com/material-components/material-components-web/commit/97575c3))
* **layout-grid:** Enable setting max width of the layout grid (#1086) ([98ba98c](https://github.com/material-components/material-components-web/commit/98ba98c)), closes [#1085](https://github.com/material-components/material-components-web/issues/1085)
* **snackbar:** Stop queued data from modifying current data (#1084) ([eb35255](https://github.com/material-components/material-components-web/commit/eb35255)), closes [#1083](https://github.com/material-components/material-components-web/issues/1083)
* **toolbar:** Wrong placement of last icon when there is a menu (#1068) ([11a8ff3](https://github.com/material-components/material-components-web/commit/11a8ff3)), closes [#1026](https://github.com/material-components/material-components-web/issues/1026)


### Features

* **button:** Update text and raise button baseline styles (#1074) ([09a763a](https://github.com/material-components/material-components-web/commit/09a763a))
* **infrastructure:** Add env var to emit CSS files directly instead of wrapping them in JS (#1133) ([5f6f829](https://github.com/material-components/material-components-web/commit/5f6f829))
* **infrastructure:** Display webpack-dev-server build progress (#1132) ([0754628](https://github.com/material-components/material-components-web/commit/0754628))
* **theme:** Add light/dark vars for primary/secondary color; rename `accent` to `secondary` (#1116) ([2314ad5](https://github.com/material-components/material-components-web/commit/2314ad5))
* **theme:** Add SCSS variables for Material Design color palette (#1117) ([6c26958](https://github.com/material-components/material-components-web/commit/6c26958))


### Performance Improvements

* **infrastructure:** Cut build time in half with opt-in env var (#1128) ([e36639f](https://github.com/material-components/material-components-web/commit/e36639f))


### BREAKING CHANGES

* **dialog:** Adds a new adapter method, layoutFooterRipples, to allow the foundation to
communicate with ripples when the dialog's opening transition ends.



<a name="0.17.0"></a>
# [0.17.0](https://github.com/material-components/material-components-web/compare/v0.16.0...v0.17.0) (2017-08-07)


### Bug Fixes

* **dialog:** Dialog buttons should use primary color (#941) ([b4e8b5a](https://github.com/material-components/material-components-web/commit/b4e8b5a)), closes [#940](https://github.com/material-components/material-components-web/issues/940)
* **ripple:** Feature-detect buggy Edge behavior for custom properties (#1041) ([5cc2115](https://github.com/material-components/material-components-web/commit/5cc2115))
* **select:** menu positioning logic incorrect when select appears near viewport edge #671 (#680) ([874f043](https://github.com/material-components/material-components-web/commit/874f043))
* **textfield:** Add font styles to input, remove from mdc wrapper (#908) ([a498a28](https://github.com/material-components/material-components-web/commit/a498a28))
* **textfield:** Fix textfield input sizes  (#1016) ([e59ee21](https://github.com/material-components/material-components-web/commit/e59ee21)), closes [#1016](https://github.com/material-components/material-components-web/issues/1016) [#1002](https://github.com/material-components/material-components-web/issues/1002)


### Features

* **typography:** Add button style to typography (#1064) ([21c7a54](https://github.com/material-components/material-components-web/commit/21c7a54))



<a name="0.16.0"></a>
# [0.16.0](https://github.com/material-components/material-components-web/compare/v0.15.0...v0.16.0) (2017-07-24)


### Bug Fixes

* **animation:** Update exit curves to match spec (#971) ([4844330](https://github.com/material-components/material-components-web/commit/4844330))
* **button:** Add mdc-typography-base to button (#949) ([3b80525](https://github.com/material-components/material-components-web/commit/3b80525)), closes [#942](https://github.com/material-components/material-components-web/issues/942)
* **card:** Correct text in a card to use text-primar-on-light (#931) ([e3966d9](https://github.com/material-components/material-components-web/commit/e3966d9)), closes [#930](https://github.com/material-components/material-components-web/issues/930)
* **dialog:** allow click events to propagate (#869) ([ef7e540](https://github.com/material-components/material-components-web/commit/ef7e540)), closes [#794](https://github.com/material-components/material-components-web/issues/794)
* **drawer:** Align open & close animations to spec (#976) ([b001aec](https://github.com/material-components/material-components-web/commit/b001aec)), closes [(#976](https://github.com/(/issues/976)
* **drawer:** Temporary drawer is below toolbar (#925) ([cbc8436](https://github.com/material-components/material-components-web/commit/cbc8436))
* **elevation:** Update _mixins.scss so Sass linter passes (#933) ([9e6623e](https://github.com/material-components/material-components-web/commit/9e6623e))
* **list:** Correct list end detail padding (#909) ([d7aa726](https://github.com/material-components/material-components-web/commit/d7aa726)), closes [#904](https://github.com/material-components/material-components-web/issues/904)
* **slider:** Set mdc-slider__thumb-container #user-select property to none (#968) ([b26b98c](https://github.com/material-components/material-components-web/commit/b26b98c))
* **toolbar:** Add `pointer` for `icon` element (#974) ([830259c](https://github.com/material-components/material-components-web/commit/830259c))



<a name="0.15.0"></a>
# [0.15.0](https://github.com/material-components/material-components-web/compare/v0.13.0...v0.15.0) (2017-07-10)


### Bug Fixes

* **base:** Fix compiler warnings (#788) ([56d8fff](https://github.com/material-components/material-components-web/commit/56d8fff)), closes [(#788](https://github.com/(/issues/788)
* **button:** Sets text on raised buttons on dark theme to text-primary-on-primary (#853) ([49170d6](https://github.com/material-components/material-components-web/commit/49170d6))
* **fab:** FAB z-index is wrong (#888) ([3812fbd](https://github.com/material-components/material-components-web/commit/3812fbd)), closes [#872](https://github.com/material-components/material-components-web/issues/872)
* **infrastructure:** Downgrade closure-compiler (#915) ([5b10478](https://github.com/material-components/material-components-web/commit/5b10478))
* **infrastructure:** Harden closure declaration source rewriting (#835) ([7c6da3a](https://github.com/material-components/material-components-web/commit/7c6da3a))
* **layout-grid:** use correct selector for size specific column span (#862) ([0e2a0df](https://github.com/material-components/material-components-web/commit/0e2a0df))
* **ripple:** Remove fg deactivation class when animation finishes ([4985b4b](https://github.com/material-components/material-components-web/commit/4985b4b))
* **toolbar:** Adjusting sibling elements on mobile landscape (#846) ([798091f](https://github.com/material-components/material-components-web/commit/798091f))
* **toolbar:** Fix toolbar margin for desktop (#887) ([0a8a75d](https://github.com/material-components/material-components-web/commit/0a8a75d)), closes [(#887](https://github.com/(/issues/887) [#786](https://github.com/material-components/material-components-web/issues/786)
* **toolbar:** Increase fixed toolbar's z-index from 1 to 4(#897) ([78946c4](https://github.com/material-components/material-components-web/commit/78946c4)), closes [4(#897](https://github.com/4(/issues/897) [#834](https://github.com/material-components/material-components-web/issues/834)

### Features

* **checkbox:** Annotate mdc-checkbox for closure (#867) ([a6956b8](https://github.com/material-components/material-components-web/commit/a6956b8)), closes [#334](https://github.com/material-components/material-components-web/issues/334)
* **framework-examples:** Add Vue continuous slider example (#827) ([6e0a8c9](https://github.com/material-components/material-components-web/commit/6e0a8c9))
* **infrastructure:** Create script for that rewrites .scss imports (#831) ([bd0123b](https://github.com/material-components/material-components-web/commit/bd0123b))
* **layout-grid:** Add fixed column width layout grid modifier. (#816) ([94d62ad](https://github.com/material-components/material-components-web/commit/94d62ad)), closes [(#816](https://github.com/(/issues/816) [#748](https://github.com/material-components/material-components-web/issues/748)
* **layout-grid:** Implement layout grid alignment. (#885) ([1528ed7](https://github.com/material-components/material-components-web/commit/1528ed7)), closes [#749](https://github.com/material-components/material-components-web/issues/749)
* **menu:** annotate mdc-menu for closure compiler ([b188d4f](https://github.com/material-components/material-components-web/commit/b188d4f)), closes [#339](https://github.com/material-components/material-components-web/issues/339)
* **menu:** Export util (#824) ([7d0394b](https://github.com/material-components/material-components-web/commit/7d0394b)), closes [#823](https://github.com/material-components/material-components-web/issues/823)
* **ripple:** Add layout() method to component ([ef99024](https://github.com/material-components/material-components-web/commit/ef99024))
* **ripple:** Annotate mdc-ripple for closure (#856) ([f0f0a86](https://github.com/material-components/material-components-web/commit/f0f0a86)), closes [#341](https://github.com/material-components/material-components-web/issues/341)
* **ripple:** export util from @material/ripple (#751) ([27c172a](https://github.com/material-components/material-components-web/commit/27c172a)), closes [#253](https://github.com/material-components/material-components-web/issues/253)
* **ripple:** Reduce the fade out time for foreground ripple effect ([9394b5f](https://github.com/material-components/material-components-web/commit/9394b5f))
* **slider:** Implement discrete slider and discrete slider with marker (#842) ([e681aae](https://github.com/material-components/material-components-web/commit/e681aae)), closes [#25](https://github.com/material-components/material-components-web/issues/25)
* **snackbar:** Implement full-featured Snackbar component (#852) ([4be947f](https://github.com/material-components/material-components-web/commit/4be947f))
* **textfield:** Implement text field boxes ([cfa3737](https://github.com/material-components/material-components-web/commit/cfa3737)), closes [#673](https://github.com/material-components/material-components-web/issues/673)


### BREAKING CHANGES

* snackbar: Adds adapter methods to capture blur, focus, and interaction events



<a name="0.14.0"></a>
# [0.14.0](https://github.com/material-components/material-components-web/compare/v0.13.0...v0.14.0) (2017-06-26)


### Bug Fixes

* **base:** Fix compiler warnings (#788) ([56d8fff](https://github.com/material-components/material-components-web/commit/56d8fff)), closes [(#788](https://github.com/(/issues/788)
* **button:** Sets text on raised buttons on dark theme to text-primary-on-primary (#853) ([49170d6](https://github.com/material-components/material-components-web/commit/49170d6))
* **infrastructure:** Harden closure declaration source rewriting (#835) ([7c6da3a](https://github.com/material-components/material-components-web/commit/7c6da3a))
* **ripple:** Remove fg deactivation class when animation finishes ([4985b4b](https://github.com/material-components/material-components-web/commit/4985b4b))
* **toolbar:** Adjusting sibling elements on mobile landscape (#846) ([798091f](https://github.com/material-components/material-components-web/commit/798091f))

### Features

* **infrastructure:** Create script for that rewrites .scss imports (#831) ([bd0123b](https://github.com/material-components/material-components-web/commit/bd0123b))
* **layout-grid:** Add fixed column width layout grid modifier. (#816) ([94d62ad](https://github.com/material-components/material-components-web/commit/94d62ad)), closes [(#816](https://github.com/(/issues/816) [#748](https://github.com/material-components/material-components-web/issues/748)
* **menu:** annotate mdc-menu for closure compiler ([b188d4f](https://github.com/material-components/material-components-web/commit/b188d4f)), closes [#339](https://github.com/material-components/material-components-web/issues/339)
* **menu:** Export util (#824) ([7d0394b](https://github.com/material-components/material-components-web/commit/7d0394b)), closes [#823](https://github.com/material-components/material-components-web/issues/823)
* **ripple:** Add layout() method to component ([ef99024](https://github.com/material-components/material-components-web/commit/ef99024))
* **ripple:** export util from @material/ripple (#751) ([27c172a](https://github.com/material-components/material-components-web/commit/27c172a)), closes [#253](https://github.com/material-components/material-components-web/issues/253)
* **ripple:** Reduce the fade out time for foreground ripple effect ([9394b5f](https://github.com/material-components/material-components-web/commit/9394b5f))
* **textfield:** Implement text field boxes ([cfa3737](https://github.com/material-components/material-components-web/commit/cfa3737)), closes [#673](https://github.com/material-components/material-components-web/issues/673)



<a name="0.13.0"></a>
# [0.13.0](https://github.com/material-components/material-components-web/compare/v0.12.0...v0.13.0) (2017-06-12)


### Bug Fixes

* **demos:** Fix non-unique ids in radio demo (#792) ([cada61a](https://github.com/material-components/material-components-web/commit/cada61a)), closes [(#792](https://github.com/(/issues/792)
* **dialog:** Add 8dp padding for side-by-side buttons in RTL (#752) ([07f4ee7](https://github.com/material-components/material-components-web/commit/07f4ee7)), closes [#750](https://github.com/material-components/material-components-web/issues/750)
* **dialog:** Incorrect Text (#744) ([d38756f](https://github.com/material-components/material-components-web/commit/d38756f))
* **drawer:** Prevent scrolling on body when temporary drawer open (#807) ([8686d85](https://github.com/material-components/material-components-web/commit/8686d85))
* **infrastructure:** set Travis CI node version to 7 (#758) ([75ddf28](https://github.com/material-components/material-components-web/commit/75ddf28))
* **menu:** Add disabled list items to menu (#780) ([ef44d3d](https://github.com/material-components/material-components-web/commit/ef44d3d))
* **menu:** Fix wrong menu styling properties (#789) ([76714f2](https://github.com/material-components/material-components-web/commit/76714f2)), closes [(#789](https://github.com/(/issues/789)
* **toolbar:** Improve layout and scrolling logic of items in toolbars (#764) ([f0ff94d](https://github.com/material-components/material-components-web/commit/f0ff94d))
* **toolbar:** rename ambiguous identifiers (#765) (#773) ([0471f1f](https://github.com/material-components/material-components-web/commit/0471f1f))

### Features

* **layout-grid:** make layout grid nestable (#804) ([dec20ab](https://github.com/material-components/material-components-web/commit/dec20ab))
* **layout-grid:** parameterize layout grid (#795) ([99d2bbd](https://github.com/material-components/material-components-web/commit/99d2bbd))
* **slider:** Implement continuous slider component (#781) ([a9d46ab](https://github.com/material-components/material-components-web/commit/a9d46ab))


### BREAKING CHANGES

* drawer: Adapter API for temporary drawers contains two new methods: `addBodyClass` and `removeBodyClass`.
* layout-grid: Add mdc-layout-grid__inner as a wrapper for mdc-layout-grid__cell. All existing implementation need to add this extra wrapper layer after upgrade to the latest layout grid.

This is for proper alignment both in nesting and removing the restriction that margin need to be at least half size of the padding.
* menu: Rename symmetric registerDocumentClickHandler/deregisterDocumentClickHandler adapter methods to registerBodyClickHandler/deregisterBodyClickHandler
* layout-grid: the css custom properties for customize margins and gutters are exposed in format of `mdc-layout-grid-margin-#{$size}`, where valid sizes are `desktop`, `tablet` and `phone`. The old name `mdc-layout-grid-margin` and `mdc-layout-grid-gutter` is no longer available in the new version. Sass variables change from single numeric value to Sass map to accomendate margins and gutters for different screens as well. Visually, the default value of margins and gutters change from 16px to 24px on desktop, while remain the same on tablet and mobile.
* toolbar: The adapter method `getFlexibleRowElementOffsetHeight` has been _renamed_ to `getFirstRowElementOffsetHeight`. Please update your code accordingly.



<a name="0.12.1"></a>
## [0.12.1](https://github.com/material-components/material-components-web/compare/v0.12.0...v0.12.1) (2017-05-31)


### Bug Fixes

* Include the JavaScript for linear-progress  (#760) (#759) ([94e2221](https://github.com/material-components/material-components-web/commit/94e2221)), closes [#759](https://github.com/material-components/material-components-web/issues/759)


<a name="0.12.0"></a>
# [0.12.0](https://github.com/material-components/material-components-web/compare/v0.11.1...v0.12.0) (2017-05-30)


### Bug Fixes

* Add MDCSelectFoundation.strings and missing tests (#698) (#699) ([8a21b4a](https://github.com/material-components/material-components-web/commit/8a21b4a)), closes [#698](https://github.com/material-components/material-components-web/issues/698)
* **card:** Add rounded corners to card component (#656) ([c342724](https://github.com/material-components/material-components-web/commit/c342724))
* **checkbox:** Fix radio button stretching in IE11 (#640) ([34c1198](https://github.com/material-components/material-components-web/commit/34c1198)), closes [(#640](https://github.com/(/issues/640) [#632](https://github.com/material-components/material-components-web/issues/632)
* **demos:** #633 IE11 incorrect layout in hero section (#636) ([b3b4173](https://github.com/material-components/material-components-web/commit/b3b4173)), closes [#633](https://github.com/material-components/material-components-web/issues/633)
* **demos:** Fix misaligned title in Typography Demo (#625) ([d529094](https://github.com/material-components/material-components-web/commit/d529094)), closes [(#625](https://github.com/(/issues/625)
* **dialog:** Add 8px of margin between side-by-side buttons in MDC Dialog (#681) ([4bb620e](https://github.com/material-components/material-components-web/commit/4bb620e))
* **dialog:** Closing Animations not running #433 (#504) ([2b03c6b](https://github.com/material-components/material-components-web/commit/2b03c6b))
* **drawer:** fix RTL closed position of temporary drawer (#592) ([a0c6d2d](https://github.com/material-components/material-components-web/commit/a0c6d2d)), closes [(#592](https://github.com/(/issues/592) [#551](https://github.com/material-components/material-components-web/issues/551)
* **drawer:** Reconcile permanent drawers and large content (#639) ([25414ac](https://github.com/material-components/material-components-web/commit/25414ac))
* **drawer:** Rename drawer slidable _mixins.css and _variables.css to .scss files (#691) ([d3dd2d4](https://github.com/material-components/material-components-web/commit/d3dd2d4))
* **linear-progress:** Fix version number of linear progress indicator (#716) ([7942505](https://github.com/material-components/material-components-web/commit/7942505)), closes [(#716](https://github.com/(/issues/716)
* **list:** Properly position interactive list items in RTL context (#746) ([ae4e87f](https://github.com/material-components/material-components-web/commit/ae4e87f)), closes [#725](https://github.com/material-components/material-components-web/issues/725)
* **menu:** add 8px top and bottom padding (#718) ([1d71a46](https://github.com/material-components/material-components-web/commit/1d71a46)), closes [#708](https://github.com/material-components/material-components-web/issues/708)

### Features

* **base:** Annotate mdc-base for closure (#730) ([e21ec90](https://github.com/material-components/material-components-web/commit/e21ec90)), closes [#331](https://github.com/material-components/material-components-web/issues/331)
* **linear-progress:** Implement Linear Progress indicators (#672) ([c47d1c2](https://github.com/material-components/material-components-web/commit/c47d1c2))
* **snackbar:** Added dismissOnAction option to show method (#459) ([1d2d800](https://github.com/material-components/material-components-web/commit/1d2d800))
* **tabs:** Implement a tab bar scroller component (#689) ([6c1043e](https://github.com/material-components/material-components-web/commit/6c1043e))

### Performance Improvements

* **ripple:** Use passive event listeners on adapter instantiation (#649) ([3dd9a13](https://github.com/material-components/material-components-web/commit/3dd9a13)), closes [#629](https://github.com/material-components/material-components-web/issues/629)


### BREAKING CHANGES

* dialog: -  Dialogs do not require a style="visibility:hidden" attribute in html.
-  registerTransitionEndHandler, deregisterTransitionEndHandler, and isDialog methods must be implemented by the adapter



<a name="0.11.1"></a>
## [0.11.1](https://github.com/material-components/material-components-web/compare/v0.11.0...v0.11.1) (2017-05-17)


### Bug Fixes

* **tabs:** Use proper import for animation (#651) ([c3cb0e0](https://github.com/material-components/material-components-web/commit/c3cb0e0))



<a name="0.11.0"></a>
# [0.11.0](https://github.com/material-components/material-components-web/compare/v0.10.0...v0.11.0) (2017-05-15)


### Bug Fixes

* **drawer:** Always remove overlay when drawer is swiped to close (#555) ([95dbcd0](https://github.com/material-components/material-components-web/commit/95dbcd0)), closes [(#555](https://github.com/(/issues/555)
* **infrastructure:** Disable webpack-dev-server host checking (#571) ([023c851](https://github.com/material-components/material-components-web/commit/023c851))
* **infrastructure:** update stylefmt command to the new params and format (#573) ([c54a797](https://github.com/material-components/material-components-web/commit/c54a797))
* **menu:** Add z-index to MDC Menu to correct stacking related issue (#615) ([01c6ca5](https://github.com/material-components/material-components-web/commit/01c6ca5))
* **ripple:** Ripple should not activate on disabled label click (#532) ([7cc3dc8](https://github.com/material-components/material-components-web/commit/7cc3dc8))
* **tabs:** Typo in package.json ([c031d83](https://github.com/material-components/material-components-web/commit/c031d83))
* **textfield:** Add badInput validity check to textfield (#570) ([e80fe7d](https://github.com/material-components/material-components-web/commit/e80fe7d))
* **textfield:** Make bar respect invalid styling (#585) ([3e11d33](https://github.com/material-components/material-components-web/commit/3e11d33))

### Features

* **card:** Improve RTL support in Cards (#545) ([398c883](https://github.com/material-components/material-components-web/commit/398c883))
* **tabs:** Implement a tab component (#581) ([0c00d3f](https://github.com/material-components/material-components-web/commit/0c00d3f))



<a name="0.10.0"></a>
# [0.10.0](https://github.com/material-components/material-components-web/compare/v0.9.1...v0.10.0) (2017-05-01)


### Bug Fixes

* **checkbox:** Add --disabled modifier to checkbox root element to prevent hover state (#533) ([eb51e32](https://github.com/material-components/material-components-web/commit/eb51e32))
* **drawer:** Remove -16px left positioning for interactive list items (#550) ([9229e0b](https://github.com/material-components/material-components-web/commit/9229e0b)), closes [#526](https://github.com/material-components/material-components-web/issues/526)
* **radio:** Center align radio box (#538) ([83d1815](https://github.com/material-components/material-components-web/commit/83d1815))
* **select:** Nest list-divider style in mdc-select declaration (#516) ([a3d2928](https://github.com/material-components/material-components-web/commit/a3d2928))
* **toolbar:** Prevent cut-offs of the toolbar section content (#540) ([4affc5c](https://github.com/material-components/material-components-web/commit/4affc5c))

### Features

* **animation:** Annotate for closure compiler ([f28f465](https://github.com/material-components/material-components-web/commit/f28f465)), closes [#332](https://github.com/material-components/material-components-web/issues/332)
* **drawer:** Emit open/close events on slidable drawers (#530) ([be85871](https://github.com/material-components/material-components-web/commit/be85871)), closes [(#530](https://github.com/(/issues/530)
* **ripple:** Move getMatchesProperty into createAdapter for Ripple. (#469) (#523) ([74d6e6b](https://github.com/material-components/material-components-web/commit/74d6e6b)), closes [#523](https://github.com/material-components/material-components-web/issues/523)
* **toolbar:** Implement flexible and waterfall toolbar. (#448) (#499) ([43cef6c](https://github.com/material-components/material-components-web/commit/43cef6c))



<a name="0.9.1"></a>
## [0.9.1](https://github.com/material-components/material-components-web/compare/v0.9.0...v0.9.1) (2017-04-18)


### Bug Fixes

* **auto-init:** Register MDCPersistentDrawer (#528) ([bba6e3e](https://github.com/material-components/material-components-web/commit/bba6e3e)), closes [#527](https://github.com/material-components/material-components-web/issues/527)
* **infrastructure:** correct reason why component is shown in summary table. (#519) ([f96a1ca](https://github.com/material-components/material-components-web/commit/f96a1ca))
* **package:** Change scss file to use slash for comment. (#517) ([afec470](https://github.com/material-components/material-components-web/commit/afec470))



<a name="0.9.0"></a>
# [0.9.0](https://github.com/material-components/material-components-web/compare/v0.8.0...v0.9.0) (2017-04-17)


### Bug Fixes

* **checkbox:** Prevent checkboxes and radios from changing size with multiline label (#497) ([2e1023c](https://github.com/material-components/material-components-web/commit/2e1023c))
* **dialog:** Ensure isOpen() returns false when dialog is closed (#465) ([6abc3ee](https://github.com/material-components/material-components-web/commit/6abc3ee)), closes [(#465](https://github.com/(/issues/465)
* **dialog:** Handle focus trapping correctly (#491) ([12bd03e](https://github.com/material-components/material-components-web/commit/12bd03e))
* **grid-list:** Updates the grid-list's foundation to NOT center tile… (#467) ([a758519](https://github.com/material-components/material-components-web/commit/a758519))
* **infrastructure:** Print the entire invalid git commit message. (#510) ([ea8f862](https://github.com/material-components/material-components-web/commit/ea8f862))
* **list:** Update interactive list's with ripple-upgrade to be narrower (#468) ([c062319](https://github.com/material-components/material-components-web/commit/c062319)), closes [#463](https://github.com/material-components/material-components-web/issues/463)
* **toolbar:** Make Toolbar accommodated very long section ([130246f](https://github.com/material-components/material-components-web/commit/130246f)), closes [#508](https://github.com/material-components/material-components-web/issues/508)

### Features

* **checkbox:** Add value property to the component and foundation. (#492) ([ff772ad](https://github.com/material-components/material-components-web/commit/ff772ad))
* **drawer:** Implement persistent drawer (#488) ([79a2352](https://github.com/material-components/material-components-web/commit/79a2352))
* **radio:** Add a value property to the component and foundation. (#490) ([279d3fd](https://github.com/material-components/material-components-web/commit/279d3fd))


### BREAKING CHANGES

* dialog: There are a few changes that need to be taken into
account for this commit:

- Dialogs no longer require an `aria-hidden="true"` attribute.
- Dialogs _do_ require a `style="visibility:hidden"` attribute for
  correct first render.
- `trapFocusOnSurface` and `untrapFocusOnSurface` methods must be
  implemented for the adapter
- `hasClass`, `setAttr`, `registerFocusTrappingHandler`,
  `deregisterFocusTrappingHandler`, `numFocusableTargets`,
  `setDialogFocusFirstTarget`, `setInitialFocus`,
  `getFocusableElements`, `saveElementTabState`,
  `restoreElementTabState`, `makeElementUntabbable`, `setBodyAttr`,
  `rmBodyAttr`, `getFocusedTarget`, and `setFocusedTarget` have all been
  removed from the adapter.
- `applyPassive`, `saveElementTabState`, and `restoreElementTabState`
  have all been removed from `mdcDialog.util`.
* grid-list: Adds getNumberOfTiles to grid-list's adapter API. Please update adapters to implement getNumberOfTiles.



<a name="0.8.0"></a>
# [0.8.0](https://github.com/material-components/material-components-web/compare/v0.7.0...v0.8.0) (2017-04-03)


### Bug Fixes

* **button:** Remove tap highlight when ripple is attached ([32f0b6b](https://github.com/material-components/material-components-web/commit/32f0b6b))
* **dialog:** Center dialog on screen in all supported browsers (#413) (#415) ([c67a12f](https://github.com/material-components/material-components-web/commit/c67a12f))
* **fab:** Ensure ripple styles take correct effect ([0bdf3ee](https://github.com/material-components/material-components-web/commit/0bdf3ee))
* **framework-examples:** Fix VueJS lifecycle beforeDestroy hooks (#417) ([8bca925](https://github.com/material-components/material-components-web/commit/8bca925)), closes [(#417](https://github.com/(/issues/417) [#416](https://github.com/material-components/material-components-web/issues/416)
* **framework-examples:** Fix VueJS snackbar example (#410) ([a1a91ac](https://github.com/material-components/material-components-web/commit/a1a91ac)), closes [(#410](https://github.com/(/issues/410) [#405](https://github.com/material-components/material-components-web/issues/405)
* **select:** Fixing bug with select menu z-index (#460) ([d7784af](https://github.com/material-components/material-components-web/commit/d7784af)), closes [#432](https://github.com/material-components/material-components-web/issues/432)

### Features

* **drawer:** Export util methods (#423) ([1babd7c](https://github.com/material-components/material-components-web/commit/1babd7c)), closes [#422](https://github.com/material-components/material-components-web/issues/422)
* **ripple:** Implement subset of improved interaction response guidelines (#419) ([046e337](https://github.com/material-components/material-components-web/commit/046e337)), closes [#190](https://github.com/material-components/material-components-web/issues/190)
* **toolbar:** Improve toolbar to support multiple row. (#448) ([14ffe53](https://github.com/material-components/material-components-web/commit/14ffe53))


### BREAKING CHANGES

* toolbar: All existing toolbar need to add <div class="mdc-toolbar__row">
to properly align its contents.



<a name="0.7.0"></a>
# [0.7.0](https://github.com/material-components/material-components-web/compare/v0.6.0...v0.7.0) (2017-03-20)


### Bug Fixes

* **infrastructure:** Update publishConfig.ignore to commands.publish.ignore. (#383) ([cc939ea](https://github.com/material-components/material-components-web/commit/cc939ea))

### Features

* **dialog:** Implement a dialog component (#395) ([413b54e](https://github.com/material-components/material-components-web/commit/413b54e))
* **grid-list:** Implement mdc-grid-list (#47) (#359) ([5b84e73](https://github.com/material-components/material-components-web/commit/5b84e73))



<a name="0.6.0"></a>
# [0.6.0](https://github.com/material-components/material-components-web/compare/v0.5.0...v0.6.0) (2017-03-06)


### Bug Fixes

* **checkbox:** Ensure correct positioning in RTL context (#381) ([e296032](https://github.com/material-components/material-components-web/commit/e296032)), closes [#375](https://github.com/material-components/material-components-web/issues/375)
* **form-field:** Make gap btn control and label clickable (#373) ([61a65f6](https://github.com/material-components/material-components-web/commit/61a65f6)), closes [#371](https://github.com/material-components/material-components-web/issues/371)
* **framework-examples:** Fix template syntax in VueJS example (#365) ([465a674](https://github.com/material-components/material-components-web/commit/465a674)), closes [(#365](https://github.com/(/issues/365)
* **ripple:** Provide fallbacks for all custom properties (#367) ([d5873f6](https://github.com/material-components/material-components-web/commit/d5873f6))
* **switch:** Remove checkbox references from SCSS (#352) ([ac88267](https://github.com/material-components/material-components-web/commit/ac88267)), closes [#322](https://github.com/material-components/material-components-web/issues/322)
* **textfield:** Adjust labels when initializing pre-filled textfields ([f8d72ba](https://github.com/material-components/material-components-web/commit/f8d72ba)), closes [#300](https://github.com/material-components/material-components-web/issues/300)
* **toolbar:** Correct class name for mdc-toolbar-fixed-adjust (#321) ([cd5238f](https://github.com/material-components/material-components-web/commit/cd5238f)), closes [#320](https://github.com/material-components/material-components-web/issues/320)

### Features

* **menu:** Move current time retrieval to adapter. ([4d0d587](https://github.com/material-components/material-components-web/commit/4d0d587))
* **ripple:** Implement improved graceful degradation ([bfac404](https://github.com/material-components/material-components-web/commit/bfac404))
* **select:** Add value retrieval mechanisms to JS API ([33d2008](https://github.com/material-components/material-components-web/commit/33d2008)), closes [#232](https://github.com/material-components/material-components-web/issues/232)


### BREAKING CHANGES

* select: **New adapter method:** `getValueForOptionAtIndex(index: string) => string`
should return the "value" of the option at the given index. Please add
this method to your adapter implementations.
* menu: adapters have to implement the new `getAccurateTime`
method.



<a name="0.5.0"></a>
# [0.5.0](https://github.com/material-components/material-components-web/compare/v0.4.0...v0.5.0) (2017-02-21)


### Bug Fixes

* **base:** Ensure this.root_ is available within getDefaultFoundation() (#279) ([c637cb6](https://github.com/material-components/material-components-web/commit/c637cb6)), closes [#242](https://github.com/material-components/material-components-web/issues/242)
* **checkbox:** Added box-sizing to component ([a7f6221](https://github.com/material-components/material-components-web/commit/a7f6221))
* **checkbox:** Disable transitions when using mdc-checkbox-anim* classes (#285) ([3effc35](https://github.com/material-components/material-components-web/commit/3effc35)), closes [#205](https://github.com/material-components/material-components-web/issues/205)
* **demos:** Fix missing whitespace in select demo (#262) ([8a14374](https://github.com/material-components/material-components-web/commit/8a14374)), closes [(#262](https://github.com/(/issues/262)
* **drawer:** Fix Temporary Drawer on IE11 ([19ff4b7](https://github.com/material-components/material-components-web/commit/19ff4b7))
* **icon-toggle:** Remove duplicate "main" property from package.json (#277) ([7f26bfc](https://github.com/material-components/material-components-web/commit/7f26bfc))
* **scripts:** Ensure determine-pkg-versions outputs correct info (#261) ([1097e6f](https://github.com/material-components/material-components-web/commit/1097e6f))
* **scripts:** Generate semver tag within post-release.sh (#263) ([82c3ffe](https://github.com/material-components/material-components-web/commit/82c3ffe))
* **select:** Ensure disabled styles render correctly (#286) ([8d77853](https://github.com/material-components/material-components-web/commit/8d77853)), closes [#276](https://github.com/material-components/material-components-web/issues/276)
* **textfield:** Fix "colr" typo of "color" property. (#316) ([6157b98](https://github.com/material-components/material-components-web/commit/6157b98)), closes [(#316](https://github.com/(/issues/316)
* **toolbar:** Add z-index to fixed toolbars (#317) ([1916a81](https://github.com/material-components/material-components-web/commit/1916a81)), closes [(#317](https://github.com/(/issues/317) [#315](https://github.com/material-components/material-components-web/issues/315)
* **webpack:** Fix tests unable to run ([1cd9e07](https://github.com/material-components/material-components-web/commit/1cd9e07))
* **webpack:** Fix uglifyjs breaking and disable modules for webpack tree shaking to work ([c25d387](https://github.com/material-components/material-components-web/commit/c25d387))

### Features

* **button:** Add user-select: none; to button (#270) ([2b319dd](https://github.com/material-components/material-components-web/commit/2b319dd))
* **form-field:** Make form field labels trigger input ripples. ([c441157](https://github.com/material-components/material-components-web/commit/c441157))
* **toolbar:** Implement mdc-toolbar (#38) (#267) ([3ca957c](https://github.com/material-components/material-components-web/commit/3ca957c))
* **npm-keywords:** Add keywords to components package.json files ([f3cc9ab](https://github.com/material-components/material-components-web/commit/f3cc9ab))
* **ripple:** Add programmatic ripple activation/deactivation. ([acccc9e](https://github.com/material-components/material-components-web/commit/acccc9e))
* **typography:** Add !default to variables ([23a0a12](https://github.com/material-components/material-components-web/commit/23a0a12))



<a name="0.4.0"></a>
# [0.4.0](https://github.com/material-components/material-components-web/compare/v0.3.0...v0.4.0) (2017-02-06)


### Bug Fixes

* **button:** Add text-decoration: none to mdc-button to allow link styles (#210) ([eef6fe8](https://github.com/material-components/material-components-web/commit/eef6fe8))
* **card:** Add bottom margin for 3x media in horizontal blocks (#207) ([2151bd4](https://github.com/material-components/material-components-web/commit/2151bd4))
* **checkbox:** Ensure ripple is activated on keydown (#241) ([b661dae](https://github.com/material-components/material-components-web/commit/b661dae))
* **checkbox:** Use correct animation end event type in adapter (#220) ([fd04c83](https://github.com/material-components/material-components-web/commit/fd04c83))
* **demos:** Fix closing HTML tags in typography demo (#199) ([e53b11b](https://github.com/material-components/material-components-web/commit/e53b11b))
* **demos:** Remove superfluous anchor tags for drawer demo (#223) ([7fa157c](https://github.com/material-components/material-components-web/commit/7fa157c))
* **drawer:** Adds z-index to temporary drawer (#212) ([65b05bf](https://github.com/material-components/material-components-web/commit/65b05bf))
* **icon-toggle:** Use correct fn signature for rmAttr adapter method (#216) ([c82d447](https://github.com/material-components/material-components-web/commit/c82d447))
* **scripts:** Update release scripts for newest lerna version (#259) ([912f5da](https://github.com/material-components/material-components-web/commit/912f5da))

### Features

* **checkbox:** Add ripples to checkboxes (#206) ([8aa1c3d](https://github.com/material-components/material-components-web/commit/8aa1c3d))
* **framework-examples:** Add ripple support to React checkbox example (#233) ([db6a6db](https://github.com/material-components/material-components-web/commit/db6a6db))
* **layout-grid:** Add initial implementation of the layout grid. ([a2e3e04](https://github.com/material-components/material-components-web/commit/a2e3e04))
* **ripple:** Implement improved origin point rules (#249) ([fc20d1a](https://github.com/material-components/material-components-web/commit/fc20d1a))
* **ripple:** Implement new ripple sizing requirements (#244) ([f0d26e6](https://github.com/material-components/material-components-web/commit/f0d26e6)), closes [#187](https://github.com/material-components/material-components-web/issues/187)
* **switch:** Implement css switch component (#235) ([625aa51](https://github.com/material-components/material-components-web/commit/625aa51))



<a name="0.3.0"></a>
# [0.3.0](https://github.com/material-components/material-components-web/compare/v0.2.0...v0.3.0) (2017-01-23)


### Bug Fixes

* **button:** Show active button press feedback on iOS ([07279e2](https://github.com/material-components/material-components-web/commit/07279e2))
* **demos:** Fix closing HTML tags in typography demo (#199) ([e53b11b](https://github.com/material-components/material-components-web/commit/e53b11b)), closes [(#199](https://github.com/(/issues/199)
* **drawer:** Remove `numbers` import from temporary drawer. ([f77951e](https://github.com/material-components/material-components-web/commit/f77951e))
* **fab:** Mdc web/fix misaligned icons mobile safari (#132) ([69397a6](https://github.com/material-components/material-components-web/commit/69397a6)), closes [(#132](https://github.com/(/issues/132)
* **fab:** Show active button press feedback on iOS ([8e7bc5f](https://github.com/material-components/material-components-web/commit/8e7bc5f))
* **framework-examples:** Fix Angular2 example (#123) ([781a0b4](https://github.com/material-components/material-components-web/commit/781a0b4)), closes [(#123](https://github.com/(/issues/123)
* **framework-examples:** fix Aurelia example (#120) (#126) ([71f6162](https://github.com/material-components/material-components-web/commit/71f6162)), closes [(#120](https://github.com/(/issues/120) [(#126](https://github.com/(/issues/126) [#120](https://github.com/material-components/material-components-web/issues/120)
* **framework-examples:** Fix React example (#121) ([03a4607](https://github.com/material-components/material-components-web/commit/03a4607)), closes [(#121](https://github.com/(/issues/121)
* **framework-examples:** Fix VueJS example (#135) ([b79632d](https://github.com/material-components/material-components-web/commit/b79632d)), closes [(#135](https://github.com/(/issues/135)
* **ripple:** Use correct start point for unbounded ripple expansion (#165) ([9c9ad82](https://github.com/material-components/material-components-web/commit/9c9ad82))
* **scripts:** Make minor fixes to release scripts (and docs) (#164) ([9ba020c](https://github.com/material-components/material-components-web/commit/9ba020c)), closes [(#164](https://github.com/(/issues/164)
* **scripts:** Update determine-pkg-versions to use new pkg names (#141) ([652a04a](https://github.com/material-components/material-components-web/commit/652a04a))
* **select:** Prevent overflow on smaller screens (#122) ([fa926db](https://github.com/material-components/material-components-web/commit/fa926db)), closes [#112](https://github.com/material-components/material-components-web/issues/112)
* **textfield:** Support native browser autocomplete on single-line text fields (#180) ([796d5e0](https://github.com/material-components/material-components-web/commit/796d5e0))

### Features

* **button:** Add ink ripple support ([7ef4d9a](https://github.com/material-components/material-components-web/commit/7ef4d9a))
* **fab:** Add ink ripple support ([7460030](https://github.com/material-components/material-components-web/commit/7460030))
* **list:** Add interactivity and ink ripple support to mdc-list-item (#191) ([ce0bbf6](https://github.com/material-components/material-components-web/commit/ce0bbf6))
* **select:** Add multi-select styles to select component (#172) ([c78e7f4](https://github.com/material-components/material-components-web/commit/c78e7f4))


### BREAKING CHANGES

* textfield: Adapter API for textfields contains two new methods. `registerInputInputHandler` and `registerInputKeydownHandler`. To upgrade add these methods to your adapter.



<a name="0.2.0"></a>
# [0.2.0](https://github.com/material-components/material-components-web/compare/v0.1.1...v0.2.0) (2017-01-09)


### Bug Fixes

* **drawer:** Remove `numbers` import from temporary drawer. ([f77951e](https://github.com/material-components/material-components-web/commit/f77951e))
* **fab:** Mdc web/fix misaligned icons mobile safari (#132) ([69397a6](https://github.com/material-components/material-components-web/commit/69397a6)), closes [(#132](https://github.com/(/issues/132)
* **framework-examples:** Fix Angular2 example (#123) ([781a0b4](https://github.com/material-components/material-components-web/commit/781a0b4)), closes [(#123](https://github.com/(/issues/123)
* **framework-examples:** fix Aurelia example (#120) (#126) ([71f6162](https://github.com/material-components/material-components-web/commit/71f6162)), closes [(#120](https://github.com/(/issues/120) [(#126](https://github.com/(/issues/126) [#120](https://github.com/material-components/material-components-web/issues/120)
* **framework-examples:** Fix React example (#121) ([03a4607](https://github.com/material-components/material-components-web/commit/03a4607)), closes [(#121](https://github.com/(/issues/121)
* **framework-examples:** Fix VueJS example (#135) ([b79632d](https://github.com/material-components/material-components-web/commit/b79632d)), closes [(#135](https://github.com/(/issues/135)
* **scripts:** Update determine-pkg-versions to use new pkg names (#141) ([652a04a](https://github.com/material-components/material-components-web/commit/652a04a))
* **select:** Prevent overflow on smaller screens (#122) ([fa926db](https://github.com/material-components/material-components-web/commit/fa926db)), closes [#112](https://github.com/material-components/material-components-web/issues/112)


### BREAKING CHANGES

* fab: Button implementations in certain browsers such as Mobile Safari and IE11 do not adhere to flexbox rules. To center icons in all supported browsers, add a span element as a child of the button and give it a class of `mdc-fab__icon`

example:
```html
<button class="mdc-fab material-icons">
  <span class="mdc-fab__icon">
    favorite_border
  </span>
</button>
```
