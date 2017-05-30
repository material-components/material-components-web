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
