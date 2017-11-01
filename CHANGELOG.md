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
