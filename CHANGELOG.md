# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [13.0.0](https://github.com/material-components/material-components-web/compare/v12.0.0...v13.0.0) (2021-09-24)


### Bug Fixes

* Fix missing $ripple-target param for ripple mixin ([1340ee9](https://github.com/material-components/material-components-web/commit/1340ee9f7507e6653537d081c53826b5c25b3e22))
* **banner:** Adjusting theme api selectors to use `mdc-button`. ([15981e9](https://github.com/material-components/material-components-web/commit/15981e9d95097895247fbcbd6ad9ad14c46be20e))
* **banner:** Correcting incorrect theme values passed through to button's `theme-mixin`. ([0de2f2e](https://github.com/material-components/material-components-web/commit/0de2f2edcb53e05a97ae79c7f5fc181033fbb0cc))
* **banner:** exclude source from npm package ([#7381](https://github.com/material-components/material-components-web/issues/7381)) ([d48a017](https://github.com/material-components/material-components-web/commit/d48a01771a5c5b080179ac34e4ef34146de5e209)), closes [#7360](https://github.com/material-components/material-components-web/issues/7360)
* **banner:** Removing `action-<state>-label-text-color` values from MDC `light-theme` map. ([d97f8f1](https://github.com/material-components/material-components-web/commit/d97f8f133c7d59bbddc49fe39dd9c714bcbb01d4))
* **button:** cleanup outlined button theme keys ([28d0d75](https://github.com/material-components/material-components-web/commit/28d0d75bb554be14171de19f50d082f837125f37))
* **button:** fix touch target reset in context of link buttons ([3b8d442](https://github.com/material-components/material-components-web/commit/3b8d4429e3373661fef202613389e4f2f00b33ad))
* **button:** remove negative padding around icons ([d470693](https://github.com/material-components/material-components-web/commit/d4706933f473925ec3a1ce6f7152208b31664538))
* **button:** remove rem/em transformers from typography theme-styles ([a395972](https://github.com/material-components/material-components-web/commit/a395972cfaf2260da9f50875a8fe772cc3c69d83))
* **button:** stack ripple behind content ([e1e69fd](https://github.com/material-components/material-components-web/commit/e1e69fd8e5fb5624173bc3836f92e6824596ad04))
* **density:** typo in variable exports ([6df682e](https://github.com/material-components/material-components-web/commit/6df682e746d1c417fe00376ba6ec33bd72159757))
* **dom:** Support providing an owner document for announcer messages. ([6236f35](https://github.com/material-components/material-components-web/commit/6236f3576a7f39f452175206f96c08b08315444b))
* **elevation:** reduce warnings when not providing elevation tokens ([adb9f1a](https://github.com/material-components/material-components-web/commit/adb9f1ad8c85e016bbe714d9b8f2d7d28e610f91))
* **iconbutton:** Fix icon button theme keys/light theme values based on updated tokens. ([42d175e](https://github.com/material-components/material-components-web/commit/42d175efc20e9b36eb86a843b23a60626d36e065))
* **menu:** apply elevation overlay to new lists ([0ad12ed](https://github.com/material-components/material-components-web/commit/0ad12ed3cffe78a27c7005e2ed9b83643ebb5114))
* **sass:** Wrap templated calc expressions in strings ([818f4ee](https://github.com/material-components/material-components-web/commit/818f4ee93de968dfaa9d64929b3edf2d9f8dbe01)), closes [#7391](https://github.com/material-components/material-components-web/issues/7391)
* **slider:** Reorder such that dragstart event is emitted before any other events when handling drag start. ([877e3fb](https://github.com/material-components/material-components-web/commit/877e3fb0dbdaf06cf3a9b4fb0fa731df2093901c))
* **slider:** Replace `innerHTML` with `firstChild` ([37d4db8](https://github.com/material-components/material-components-web/commit/37d4db86667c967ba173e318a124b72109cc1bb5))
* Fix compilation issues with TypeScript 4.4 ([7246447](https://github.com/material-components/material-components-web/commit/72464476cea3755fbcbb64df832e9933ea7b1170))
* **switch:** add pointer cursor ([12f5622](https://github.com/material-components/material-components-web/commit/12f5622e14b68c12542cb2bf7236c5a1f5492add))
* **switch:** distribute correct css ([#7292](https://github.com/material-components/material-components-web/issues/7292)) ([7b6bcb8](https://github.com/material-components/material-components-web/commit/7b6bcb85874e81f33956d1ec544aedcdc882ffed))
* **switch:** elevation theme custom properties not working ([2865629](https://github.com/material-components/material-components-web/commit/28656298a9c01bd585fdb995be7aa96d3c3395e7))
* **switch:** use correct colors for icons in all HCM themes ([d86fb6f](https://github.com/material-components/material-components-web/commit/d86fb6facd014e2c0c1a88108ddbb59595dea5ac))
* **theme:** ensure state selectors negate properly ([7249a30](https://github.com/material-components/material-components-web/commit/7249a3060c6b15eef338b44b77065b47e0b26d52))
* **tooltip:** Add a getActiveElement() method to MDCTooltipAdapter to delegate getting the active element from the correct document. ([e334676](https://github.com/material-components/material-components-web/commit/e3346766f22b23b6c1e04cb2821565d388d57054))
* **tooltip:** Adjust tooltip `focusout` handler. Ensures that interactive tooltips remain open when ChromeVox uses linear navigation to read non-focusable content inside the tooltip. ([7c96e6b](https://github.com/material-components/material-components-web/commit/7c96e6b98a25839d249e1d56478e919564b5ff07))
* **tooltip:** non-persistent tooltips disappear on scroll ([1f9259b](https://github.com/material-components/material-components-web/commit/1f9259b9d7821181d8655537cf80e95b9856dd7c))
* update combined mdc package to use new switch CSS ([077dcfc](https://github.com/material-components/material-components-web/commit/077dcfcfe483b8631f51cc16a89557d056b4db58)), closes [#7304](https://github.com/material-components/material-components-web/issues/7304)
* **tooltip:** allow the Mac zoom service to access plain tooltip contents ([510cf90](https://github.com/material-components/material-components-web/commit/510cf90f289177cf148b2d72cdb773047410731b))


### Code Refactoring

* **fab:** Deprecate legacy Fab theme mixins ([83bdd02](https://github.com/material-components/material-components-web/commit/83bdd022246c1699de71346d5c162e1ded5a0836))
* **iconbutton:** Forward only theme mixins from MDC icon button index module. ([0a90693](https://github.com/material-components/material-components-web/commit/0a906930027e2b55054be08aa8ce0d48dec8c25b))
* **theme:** Rename validate-keys() to validate-theme() ([2fb068f](https://github.com/material-components/material-components-web/commit/2fb068fb0f7a1b0e038ede3a2ab27a972e5b2ee4))


### Features

* **button:** add custom props to outlined button theme-styles ([bf405d2](https://github.com/material-components/material-components-web/commit/bf405d22ae54eef77bbe437228540900aad2f0e0))
* **button:** add custom props to protected button theme-styles ([4ca11fe](https://github.com/material-components/material-components-web/commit/4ca11fe76395824dff6b3e35d954af817ace1591))
* **button:** add custom props to text button theme-styles ([3dd6110](https://github.com/material-components/material-components-web/commit/3dd61109132cf17b5a92a941ecc0f03b0a1cc8d5))
* **button:** add missing transitions to box-shadow/border ([3b92903](https://github.com/material-components/material-components-web/commit/3b9290351308626b4699e2cbdaeb4dc7f04ce1d9))
* **button:** add static-styles-without-ripple for MWC consumption ([f4241a4](https://github.com/material-components/material-components-web/commit/f4241a42a49d130fcf5b5a9df2239276628a85f1))
* **button:** add theme mixin that emits custom properties instead ([4c40586](https://github.com/material-components/material-components-web/commit/4c405863bde72948dd131b07847b798cd8669764))
* **button:** emit custom properties fill button theme-styles ([a80c8b2](https://github.com/material-components/material-components-web/commit/a80c8b2c263b4f69a9df57e9837f7cb4ca438428))
* **button:** m3 elevation + icon base theme modules ([2da3606](https://github.com/material-components/material-components-web/commit/2da3606b97553ef152c9ef485432df2e0287b5de))
* **button:** resolve elevation keys in theme mixin ([843342f](https://github.com/material-components/material-components-web/commit/843342f99a2f76895fedb1ad1b2ff88a96b3fd7d))
* **chips:** Add theming Sass mixin to MDC Filter Chip ([8390093](https://github.com/material-components/material-components-web/commit/83900936a87a32accaab8bc8a1bdc5a998fcf18f))
* **chips:** Add theming Sass mixin to MDC input & suggestion Chip ([860ad06](https://github.com/material-components/material-components-web/commit/860ad06a1dd8bc76334ee5954109b4623f3682db))
* **chips:** Added theme mixins to Assist Chip ([d4e16a6](https://github.com/material-components/material-components-web/commit/d4e16a6c4876a3f144fdd1bade201f5b607b2bf6))
* **chips:** Export all non-deprecated members through chips index ([8647986](https://github.com/material-components/material-components-web/commit/864798678626ba41619324bcd10cf5e070bdd147))
* **chips:** Rename action's exported members to avoid naming collisions ([b49359c](https://github.com/material-components/material-components-web/commit/b49359c3581208ed7f84835c490a094699936f95))
* **chips:** Rename chip set's exported members to avoid naming collisions ([13db34b](https://github.com/material-components/material-components-web/commit/13db34b342741b4bc35b3c6a65a74e2291e41100))
* **chips:** Rename chip's exported members to avoid naming collisions ([470bd34](https://github.com/material-components/material-components-web/commit/470bd34e89b6683cd3a8f71bd1d3acfdf0aac5bf))
* **data-table:** Implement row click feature to MDC data table ([8de07c0](https://github.com/material-components/material-components-web/commit/8de07c02a50247f41cefcbd292b874b82f6d09b1))
* **data-table:** use new select + list templates for pagination ([08398f8](https://github.com/material-components/material-components-web/commit/08398f88046bfc1c3fad494b82c6e905d2fad890))
* **dialog:** Add theme styles mixin to dialog ([21ece53](https://github.com/material-components/material-components-web/commit/21ece536071235455a6905957f3c15dd3a7ddcf8))
* **dialog:** Separate static styles from dialog core-styles mixin ([43d2eed](https://github.com/material-components/material-components-web/commit/43d2eed2a908bae0d747b1ce4459b38cbd68c94a))
* **fab:** create theming file for small fabs ([d082790](https://github.com/material-components/material-components-web/commit/d082790f045f4542a5ebec082ba72ba0a106bcca))
* **fab:** prepare fab-extended for theming in MWC ([ce25bc3](https://github.com/material-components/material-components-web/commit/ce25bc3ecc6836d6c46e3789ff6eeb6faf7c07cf))
* **iconbutton:** Add `.mdc-icon-button--display-flex` class that centers icon via flexbox. When using the new theme API, the icon button should have this class. ([8355e14](https://github.com/material-components/material-components-web/commit/8355e14dc31c618a2102a846cd8cbefa08ad6007))
* **iconbutton:** Add MDC theme mixin that declares custom properties. ([fa7520f](https://github.com/material-components/material-components-web/commit/fa7520f6274cbab3ae7d8298554c4b0ff9e21a54))
* **iconbutton:** Add theme styles mixin. ([65aa63b](https://github.com/material-components/material-components-web/commit/65aa63b0ca587845437a4ee2a0b47556574d800b))
* **menu:** Added getter method to check fixed position status of menu ([fb76c50](https://github.com/material-components/material-components-web/commit/fb76c5069ebe5f62a1b01f6b2f4613d7c6bdeaae))
* **menu:** Adds option to prevent focus from being restored after an item action. ([65084ba](https://github.com/material-components/material-components-web/commit/65084baffaca256dd9eb77aae8fbafd379d8da00))
* **select:** start compatibility work for evolution lists ([e8554db](https://github.com/material-components/material-components-web/commit/e8554dbbf4e9886dbf7a335c4953c1611c378b68))
* **theme:** Added `validate-theme-keys()` mixin to validate theme keys only ([457d89a](https://github.com/material-components/material-components-web/commit/457d89aadf13d719af27435758feb8f6e254fe1e))


### BREAKING CHANGES

* **menu:** Adds new menu adapter method:

  /**
   * @return the attribute string if present on an element at the index
   * provided, null otherwise.
   */
  getAttributeFromElementAtIndex(index: number, attr: string): string|null;

PiperOrigin-RevId: 398575780
* **iconbutton:** MDC iconbutton `_index` Sass module will only export theme mixins.

PiperOrigin-RevId: 391773229
* **theme:** Renamed Sass mixins `validate-keys()` to `validate-theme()` in `@material/theme`

PiperOrigin-RevId: 390671152
* **fab:** Renamed Fab's mixins to deprecate legacy theme mixins.

PiperOrigin-RevId: 387378201





# [12.0.0](https://github.com/material-components/material-components-web/compare/v11.0.0...v12.0.0) (2021-07-27)


### Bug Fixes

* **base:** observer now listens to superclass properties ([88a33cd](https://github.com/material-components/material-components-web/commit/88a33cd70c0e87fcfb9e2ff58967f911ad71ace7))
* **button:** allow Mac zoom service to access button label ([29ac6ec](https://github.com/material-components/material-components-web/commit/29ac6ec1ef7316ecf03dc93ac0d63a3c09250052))
* **button:** Fix non-text buttons with icons to have reduced horizontal padding on the side with the icon. ([197f64f](https://github.com/material-components/material-components-web/commit/197f64fa2a4b78907261e820c5e1e8724777c92c))
* **chips:** Add documentation for action ([3db4d16](https://github.com/material-components/material-components-web/commit/3db4d1680bb4135c44042ac77521c8ff18032d14))
* **chips:** Add documentation for chip; update action docs ([22b83ad](https://github.com/material-components/material-components-web/commit/22b83adadc55d1d2ccf150bc4a4dc28432f1f453))
* **chips:** Add stubbed component methods along with tests ([06930c9](https://github.com/material-components/material-components-web/commit/06930c96b8a27ec886fc7873d7c0d0a4bec0761a))
* **chips:** Document chip set; add root readme ([5b6a460](https://github.com/material-components/material-components-web/commit/5b6a460167986caea058dd3f42c11c1edd761596))
* **chips:** Hide HCM focus indicator for presentational actions ([8c7d994](https://github.com/material-components/material-components-web/commit/8c7d994ae1699fd9e51ea80a073554d12959de3f))
* **chips:** Update chip set links ([4a7939c](https://github.com/material-components/material-components-web/commit/4a7939c9c3f3ec54bc486ee22567f9ca4e8f18bb))
* **circular-progress:** set explicit line-height to prevent inheritance ([e8e39ad](https://github.com/material-components/material-components-web/commit/e8e39ad19d9fae1ddbf065c9047905753ccd5754)), closes [#7118](https://github.com/material-components/material-components-web/issues/7118)
* **dialog:** prevent programmatic click on disabled default button ([e0c3462](https://github.com/material-components/material-components-web/commit/e0c346286a9656819302f04b0cf3f7b948429f74))
* **fab:** Fixed Fab ripple ([84f3db9](https://github.com/material-components/material-components-web/commit/84f3db9ed03fc414f347bfd88be384fe50646bd8)), closes [#7053](https://github.com/material-components/material-components-web/issues/7053)
* **icon-button:** prevent icon shift on press in IE11 ([8fc2927](https://github.com/material-components/material-components-web/commit/8fc29273c49f5bf5006f4df715bee85fbace9cb8))
* **linear-progress:** allow parent visibility prop to propagate to bar ([e543628](https://github.com/material-components/material-components-web/commit/e543628c3924a47ba63f5b7d58a2a931a260d1d3))
* **list:** Add core-styles mixin. ([fc7c4e5](https://github.com/material-components/material-components-web/commit/fc7c4e5ce2451ecd76f7ea3860b18a16e5f31bac))
* **list:** density configuration mixins do not account for leading avatars ([3674c62](https://github.com/material-components/material-components-web/commit/3674c6282db170dcf8331f93d779055c3852076b))
* **list:** Ensure trailing-only variants have leading padding in RTL contexts. ([81e2d4f](https://github.com/material-components/material-components-web/commit/81e2d4ff36518c586972aad4512b43d2bb0cd2d2))
* **list:** Fixed the selected + focused state of list item in HCM ([8ba3e29](https://github.com/material-components/material-components-web/commit/8ba3e298ca18cf8e7e11f07559e27287e74efeb8))
* **list:** Reset selectedIndex to UNSET_INDEX if #setSingleSelection(true) is called and there are no selected list items. ([4eecdea](https://github.com/material-components/material-components-web/commit/4eecdeaf09ed0429aa685ee35ea2ce7970af89cc))
* **list:** Selection lists without a selection focus first item. ([03f525f](https://github.com/material-components/material-components-web/commit/03f525f9ff880f27a43f2e50851a5dc6cd6b022c))
* **list:** Use more descriptive foundation method comments ([08d791f](https://github.com/material-components/material-components-web/commit/08d791f37a159f24686e97df983637947e2a1e87))
* **mdc-list:** invalid syntax in generated .d.ts bundle ([ce82846](https://github.com/material-components/material-components-web/commit/ce828464cdab59cac79add950fcac4f0310ce624))
* **menu:** correct menu opening delay ([a618380](https://github.com/material-components/material-components-web/commit/a6183801a07f109eff3ee209f42631340fbbe4b3)), closes [#5682](https://github.com/material-components/material-components-web/issues/5682) [#4411](https://github.com/material-components/material-components-web/issues/4411)
* **menu-surface:** slightly delay focus restoration to prevent lost focus on mobile devices ([9f68a93](https://github.com/material-components/material-components-web/commit/9f68a932e9d4168da10d8b9c3bb9191afcc3c68f))
* **ripple:** ensure custom properties are always emitted ([caa73ae](https://github.com/material-components/material-components-web/commit/caa73aeeea780ff65d4434fe1f38cec9396209c4))
* **rtl:** do not emit if a left/right value or replacement is null ([ec4ac52](https://github.com/material-components/material-components-web/commit/ec4ac5234c31df882a85a90af4d53b6797c8eb49))
* **rtl:** mixins work with pseudo elements ([f5b6110](https://github.com/material-components/material-components-web/commit/f5b6110d6a3c5ef1253165f5575ed3980748e19c))
* **switch:** export temporary deprecated version ([bd68539](https://github.com/material-components/material-components-web/commit/bd685395b652f448e889c123cda97efd77c85fcd))
* **switch:** misaligned handle when inside some flex containers ([ea1e1b8](https://github.com/material-components/material-components-web/commit/ea1e1b850795bd2b6ab7369a9c1e61d4b0d85f2e))
* **switch:** move ripple behind handle ([3e4c6dc](https://github.com/material-components/material-components-web/commit/3e4c6dca1921caa57e1097c03135a7ddf614f003))
* **switch:** overlay colors not showing and support -5 density ([33579e0](https://github.com/material-components/material-components-web/commit/33579e00bea179170016031fc3f24b70f57d74d2))
* **switch:** prevent collapsing in flex containers ([22f390c](https://github.com/material-components/material-components-web/commit/22f390c4364f0fc407106933154d68ae9e1ed950))
* **switch:** track colors can have opacity and not bleed through ([d923db7](https://github.com/material-components/material-components-web/commit/d923db73aa8db14c0d573208877d8cb6f4a57002))
* **tabscroller:** remove trailing underscore ([105b15b](https://github.com/material-components/material-components-web/commit/105b15b965e41bfaafedfb43e278cd5cb9d22195))
* **text-field:** remove disabled white patch in high contrast mode for Firefox 89+ ([17553e9](https://github.com/material-components/material-components-web/commit/17553e9f806551fba7d7b4d5c3b6de5df96db1af))
* prepare for [#7183](https://github.com/material-components/material-components-web/issues/7183) ([#7188](https://github.com/material-components/material-components-web/issues/7188)) ([77b94e8](https://github.com/material-components/material-components-web/commit/77b94e826c6c8c932bc5974855c645f7316f73af))
* **text-field:** show filled textarea label in Firefox 89+ high contrast ([90e08fc](https://github.com/material-components/material-components-web/commit/90e08fc6b82c805ab74d35b75b2e0c8fc72d6405))
* **textfield:** announce error message again if user blurs already invalid field ([75900a5](https://github.com/material-components/material-components-web/commit/75900a5a916249aa307626f7f6b441086146e1c0))
* **tooltip:** Adding missing `return` statement into `MDCTooltipComponent#isShown` method. ([4d95812](https://github.com/material-components/material-components-web/commit/4d95812f95ea60665fdab32a1ef8ff4d4e36a8b0))
* **tooltip:** Fixing component definition of MDCTooltipAdatper#deregisterAnchorEventHandler. ([d928692](https://github.com/material-components/material-components-web/commit/d928692b52157c91c46c9addf66f93ebdff09145))
* **tooltip:** Fixing logic for determining whether or not the user intends a tooltip to be hidden from the screenreader or not. ([cf5b9eb](https://github.com/material-components/material-components-web/commit/cf5b9eb86b764859ed8228377d4dd6dc7d2193c6))
* Remove lint check from test actions ([#7185](https://github.com/material-components/material-components-web/issues/7185)) ([1ee1fbf](https://github.com/material-components/material-components-web/commit/1ee1fbf01550f9ea19a72671e6fe360722d66385))
* **touch-target:** incorrect position in rtl when width is set ([bd1b4e9](https://github.com/material-components/material-components-web/commit/bd1b4e9d857f0b8fb7b5b9de9b8d5d78823f386d))


### Build System

* set AMD module module names within UMD bundles ([#7233](https://github.com/material-components/material-components-web/issues/7233)) ([9808de0](https://github.com/material-components/material-components-web/commit/9808de09310368c6352a0d40db84a802069d743d))


### Code Refactoring

* **checkbox:** Deprecated old checkbox theme mixin ([22d29cb](https://github.com/material-components/material-components-web/commit/22d29cbb4e7847ae56bf923d70508d1b164c1af6))
* **iconbutton:** Move ripple target to inner element ([33c9a73](https://github.com/material-components/material-components-web/commit/33c9a737af75f30f434565e98ada51b335495f0a))


### Features

* **base:** add MDCObserverFoundation class ([33e6f50](https://github.com/material-components/material-components-web/commit/33e6f50e915d5f2b70076fd0eb0e0d6654acba0c))
* **button:** Add focus indicator to link buttons in HCM. ([cad4896](https://github.com/material-components/material-components-web/commit/cad4896899cc89b1354ba5df95c3870efbb99af5))
* **button:** add typography & state layer keys to theming API ([068fd50](https://github.com/material-components/material-components-web/commit/068fd5028031778ada1f9f8469ac62ed60c9e7ef))
* **button:** employ elevation token resolvers in theming API ([ebb5c73](https://github.com/material-components/material-components-web/commit/ebb5c73bb87f1098d7e300372a811968a2d6c9f0))
* **button:** move icon-size to theming API ([85e9a6a](https://github.com/material-components/material-components-web/commit/85e9a6ac3ca1c9395d0d955326c3c1a7c3fe1a04))
* **card:** Moving ripple into a `mdc-card__ripple` element rather than the `mdc-card__primary-action`. ([8ace3b8](https://github.com/material-components/material-components-web/commit/8ace3b8106499cc9c126abde77258bcae7d5929d))
* **checkbox:** Added new theme mixin in checkbox to match token keys ([33a9548](https://github.com/material-components/material-components-web/commit/33a9548526d90fe41aae1e89c925720505fa5f85))
* **checkbox:** Added new theme mixin in checkbox to match token keys ([8e60818](https://github.com/material-components/material-components-web/commit/8e608183652b1cd051981a4266cae66b5591a148))
* **chips:** Support presentational actions ([8c68530](https://github.com/material-components/material-components-web/commit/8c685301d66ac6c8bc59b6b12930efd23804cce3))
* **dialog:** removing call to `#close` within `#destroy`. ([5631828](https://github.com/material-components/material-components-web/commit/5631828e1541df22feb879a5310e57494ee722a3))
* **dom:** add forced-colors-mode mixin ([8416fb9](https://github.com/material-components/material-components-web/commit/8416fb9195afcba61494bae1206dd1503dffb140))
* **elevation:** Create elevation resolver mixin ([5dfec7a](https://github.com/material-components/material-components-web/commit/5dfec7a1445efb45a7fb4d96ce037cafab205f30))
* **elevation:** Create resolver function ([c18b592](https://github.com/material-components/material-components-web/commit/c18b5925be3041e774b19f5f6f53f7d3a45d2240))
* **elevation:** Simplify box-shadow custom property support ([de48eff](https://github.com/material-components/material-components-web/commit/de48eff0d803b4e6c93834904e486cfea47bb03a))
* **elevation:** Support custom properties in resolver ([07a7375](https://github.com/material-components/material-components-web/commit/07a73750c0ebc1d05e19681c6f072cd5cceddfb6))
* **fab:** Added mixin that auto-generates custom properties for Fab ([8530d35](https://github.com/material-components/material-components-web/commit/8530d351494fc9a88e8e0dfd5e5d58de81a983d9))
* **fab:** Added mixin to auto-generate custom properties for Fab ([14767a8](https://github.com/material-components/material-components-web/commit/14767a8db432f8834d74a31e1577c3557a38c6d9))
* **fab:** Use elevation resolvers ([6e9fc4a](https://github.com/material-components/material-components-web/commit/6e9fc4a423a4657cc5d718aaf13d360c3bd27709))
* **fab:** Use elevation resolvers in custom property themes ([3f691ec](https://github.com/material-components/material-components-web/commit/3f691eccf61489d40e49bdf9f149b1591168c828))
* **iconbutton:** Add support for increased touch target to icon button. ([f43af56](https://github.com/material-components/material-components-web/commit/f43af5633f08e8080daed2e976771448d3effadb))
* **list:** Add public #getFocusedItemIndex to foundation. Also add a `forceUpdate` option to #setSelectedIndex that forces a UI update of the selected item. ([5d06051](https://github.com/material-components/material-components-web/commit/5d060518804437aa1ae3152562f1bb78b1af4aa6))
* **list:** Basic support for three-line lists. ([4bb5eea](https://github.com/material-components/material-components-web/commit/4bb5eea2b81268d4dc2f838beccb44dd4ff2857d))
* **menu:** Add public #getSelectedIndex to foundation. ([f705e80](https://github.com/material-components/material-components-web/commit/f705e8048ae60aceead575dfc35c8bb6233e9d23))
* **radio:** Added theme mixin that declares custom properties in MDC radio ([b87ebf7](https://github.com/material-components/material-components-web/commit/b87ebf74d4ca7de26552a9e55d79280a83ca05a9))
* **radio:** Added theme styles mixin to MDC radio ([464a002](https://github.com/material-components/material-components-web/commit/464a00286cbccfa256beb879631690277776486f))
* **radio:** Added theme styles mixin to Radio ([5823407](https://github.com/material-components/material-components-web/commit/5823407a71dc51fdf9919f3a85f62fcf125ec27b))
* **ripple:** Added theme styles and theme mixin to Ripple ([a2b0f4c](https://github.com/material-components/material-components-web/commit/a2b0f4cee3278c71d3ee2905f60dd37af6ee507c))
* **select:** Add #getUseDefaultValidation method to foundation. ([adeac05](https://github.com/material-components/material-components-web/commit/adeac0549eb04c5d4cd050d2e52378f7edbfa37e))
* **shape:** add shape map theme value support ([ec31ae1](https://github.com/material-components/material-components-web/commit/ec31ae1ed1e6483d972f0eddece0fbf30ac721c2))
* **slider:** Expose changing certain props after initialization to support MWC ([3f36ac7](https://github.com/material-components/material-components-web/commit/3f36ac75c431ee228807e04e985d2064a3274bd7))
* **switch:** add custom property theming support ([f147a22](https://github.com/material-components/material-components-web/commit/f147a2271bba2b4f1ae4df403baf86bac974b120))
* **switch:** add density custom property support ([598fccc](https://github.com/material-components/material-components-web/commit/598fcccc8d8945c0527a0553a6a937ddfdd80a8f))
* **switch:** add new component and foundation ([ef43e6d](https://github.com/material-components/material-components-web/commit/ef43e6d9607c7e8d6495b4a82e2178059dbe37fa))
* **switch:** add updated density styles ([cb162da](https://github.com/material-components/material-components-web/commit/cb162da374f5e5d613e6a4554f0e1efcdc443c04))
* **switch:** add updated RTL styles ([573dc7f](https://github.com/material-components/material-components-web/commit/573dc7ffd479527a885e95f4c8ece270363a31cc))
* **switch:** update switch to new design spec ([0ce2fdb](https://github.com/material-components/material-components-web/commit/0ce2fdb02a62bb31f945144aac58957989ecfba6))
* **switch:** update theme keys ([00b5899](https://github.com/material-components/material-components-web/commit/00b5899dcf803dcdf3795e70a970abafa247e1b3))
* **switch:** Use elevation token resolvers ([e1703be](https://github.com/material-components/material-components-web/commit/e1703bed9ba624d450cddbc5f07b08eb822f46ef))
* **tabs:** Add theming API to tabs ([bd25779](https://github.com/material-components/material-components-web/commit/bd25779b2bc6d10a00fbc19573f94a716f165cdf))
* **tabs:** Added theme-styles() mixin to tabs ([e38d744](https://github.com/material-components/material-components-web/commit/e38d7440f43c3ffe31407f1a76a35c482c42f7c5))
* **test:** Add overline support to two- and three-line lists. ([38d1846](https://github.com/material-components/material-components-web/commit/38d1846cca4f9abbcf2c073add3191bde0e03ffb))
* **test:** Add shape radius mixins to list. ([d5f1f7c](https://github.com/material-components/material-components-web/commit/d5f1f7c722ada3b62265e12e47a6f714d5bd7351))
* **theme:** add map-ext.split() helper function ([ec22e1d](https://github.com/material-components/material-components-web/commit/ec22e1da9746b38de654a18b0161c40c74e4e74f))
* **theme:** add state selector mixins ([d20dc6d](https://github.com/material-components/material-components-web/commit/d20dc6dba8e8824645404d0eaafa763d8b026ef0))
* **theme:** gss.annotate supports named arguments ([c50d20b](https://github.com/material-components/material-components-web/commit/c50d20bab49d5c00dd0a74e8616d02d8d87fba89))
* **theme:** theme.property() supports custom prop declarations ([474836a](https://github.com/material-components/material-components-web/commit/474836ad0f4f92d03ce7dd0c9f923b6ff9abac7c))
* **tooltip:** Adding foundation methods to allow users to configure the tooltip show and hide delay time. ([08db3d7](https://github.com/material-components/material-components-web/commit/08db3d737fa49893d1c3d1d3f7dd07367dd9eaeb))
* **tooltip:** Adds logic for generating a new tooltip position when all "standard" positions for tooltip w/ caret are invalid. ([9bc0eff](https://github.com/material-components/material-components-web/commit/9bc0effaf60a530bed8247f2bb9190dcbbbdec54))
* **tooltip:** Adds logic to determine valid position options for tooltip w/caret, and select which should be used. ([2ebfc53](https://github.com/material-components/material-components-web/commit/2ebfc537439508ea08bcd99991eed4fe838f3550))
* **tooltip:** Adjusting `transform-origin` for tooltips with caret so that the entrance animation originates from the caret. ([1a8d064](https://github.com/material-components/material-components-web/commit/1a8d064838299e07e97e5f30470c76c03074ac42))
* Create token package with resolvers ([9405502](https://github.com/material-components/material-components-web/commit/940550232c7925150e597c4f56433b7e5df59099))
* **tooltip:** Adjusting logic and styles so the caret better matches spec. ([55ad2d7](https://github.com/material-components/material-components-web/commit/55ad2d7d8f9bcc979f5334352620815d6ea9add6))
* **tooltip:** Fixes ordering of values provided to `tranform-origin`. ([25751d2](https://github.com/material-components/material-components-web/commit/25751d2ed4061129f206bdbc6682052b0c76709e))
* **tooltip:** Plain tooltips remain visible if the user hovers over them. ([ccce99c](https://github.com/material-components/material-components-web/commit/ccce99cd630b5a49ed40ba95b0e3d3d6fea74801))


### Reverts

* **checkbox:** Added new theme mixin in checkbox to match token keys ([b4c3f51](https://github.com/material-components/material-components-web/commit/b4c3f513eb1b42fa3844a265ccabb1e8644ea123))


### BREAKING CHANGES

* **tooltip:** - Tooltips intended to be hidden from the screen reader should be annotated with `data-hide-tooltip-from-screenreader="true"` (in addition to using `data-tooltip-id` rather than `aria-describedby`.

PiperOrigin-RevId: 386490861
* Breaking change for the UMD-case where the exports are bound to a global variable. Previously the entry-point would appear in camel-case, but now it's matching the actual package name in dash-case. This is unfortunately not avoidable with the current Webpack tooling. i.e. previous UMD users relying on the globals (which are rather rare anyway), would need to switch from `window.mdc.circularProgress` to `window.mdc['circular-progress]`.
* **checkbox:** Renamed old checkbox theme mixin for deprecation

PiperOrigin-RevId: 384568221
* **iconbutton:** Icon button now requires an inner ripple element with
class `mdc-icon-button__ripple`. See README for details.

PiperOrigin-RevId: 372153409





# [11.0.0](https://github.com/material-components/material-components-web/compare/v10.0.0...v11.0.0) (2021-04-15)


### Bug Fixes

* **banner:** Use role alertdialog. ([a07b6d4](https://github.com/material-components/material-components-web/commit/a07b6d486a7852a2089c9c13d5cf80d4ab65a425))
* **button:** add missing feature-targeting import ([71fe9a0](https://github.com/material-components/material-components-web/commit/71fe9a067878c810fe6a7d01b8e839764d7a802c))
* **button:** Fixed button's icon size scaling on browser zoom ([bc104ba](https://github.com/material-components/material-components-web/commit/bc104bae7c4e1bbcbedb085e6079432f06865cbf))
* **chips:** Expose deprecated resources in top-level TypeScript file ([67d780c](https://github.com/material-components/material-components-web/commit/67d780c795e2a61772f5d1639c202ced3fbc4dc4))
* **chips:** Fix incorrect references between deprecated and non-deprecated resources ([f8579b7](https://github.com/material-components/material-components-web/commit/f8579b7eaa22bf9da04ea5e4ec27418e001a0813))
* **chips:** Make chips wrap by default ([24255c4](https://github.com/material-components/material-components-web/commit/24255c408518dff48ed59c2529ee3d0496d6b40c))
* **chips:** Remove obsolete chips resources now in chips/deprecated/* ([87ac2fd](https://github.com/material-components/material-components-web/commit/87ac2fd5ca4ec7814216d16a0b0ef6a4474d7e92))
* **chips:** Remove obsolete resources ([40dd242](https://github.com/material-components/material-components-web/commit/40dd242d5ce4586002a8e5cb59ce2711572f1cf3))
* **chips:** rename deprecated trailing action classes ([48f4b67](https://github.com/material-components/material-components-web/commit/48f4b67fbd0d43377670673e56cb5868b3a11e1d))
* **chips:** Un-remove obsolete chips resources now in chips/deprecated/* ([7cf6782](https://github.com/material-components/material-components-web/commit/7cf67823ec45a93f5b458060b2ec632479d813c9))
* **chips:** Use deprecated chips in autoinit ([d2a39d3](https://github.com/material-components/material-components-web/commit/d2a39d300e3b9dee6c0d58d34522075f62b261c3))
* **circular-progress:** add annotation ([06dead2](https://github.com/material-components/material-components-web/commit/06dead2d69d09dfde582d0d9fb1473a61358a5f6))
* **dialog:** Add transparent border to dialog surface for HCM support. ([b2fa996](https://github.com/material-components/material-components-web/commit/b2fa996a1faa513fae691920cb339091d65b6c9b))
* **dialog:** Remove the unnecessary border on the dialog title when not needed, this adds an extra line in the UI on high contrast mode. With margins it is possible to keep the previous spacing and only add the border when needed. ([3344d12](https://github.com/material-components/material-components-web/commit/3344d12ad2eb74cfc4ef270290bcc0322ebe8566))
* **dom:** do not cache focusable elements in focus-trap ([7899e0f](https://github.com/material-components/material-components-web/commit/7899e0fe0a87cb255a5216333054207ef2687933))
* **fab:** add alternate decorator only when necessary ([0fd56a8](https://github.com/material-components/material-components-web/commit/0fd56a86b30846de63d7d1520dcecc4d5ece2347))
* **fab:** Apply extended shape radius in Extended FAB's theme mixin ([81911b7](https://github.com/material-components/material-components-web/commit/81911b7077801590c0f47bf17743f3b2b320b863))
* **list:** Correcting the selector mapping for CHILD_ELEMENTS_TO_TOGGLE_TABINDEX and FOCUSABLE_CHILD_ELEMENTS. ([8943b99](https://github.com/material-components/material-components-web/commit/8943b991fd04caab88ae543bad16ba9b47bc7634)), closes [#6829](https://github.com/material-components/material-components-web/issues/6829) [#6829](https://github.com/material-components/material-components-web/issues/6829)
* **list:** do not activate typeahead on certain modifier keys ([f1b1fd5](https://github.com/material-components/material-components-web/commit/f1b1fd5d3fa72c0a5dab305e3d7e782ff1421d7e))
* **progress-indicators:** hide from screenreaders on close ([d3a6862](https://github.com/material-components/material-components-web/commit/d3a6862af3ff4f0e157ebe95bd5f54a47fc14c48))
* **ripple:** Update states-selector() to use `:active:active` to match active specificity styles. ([faa7d32](https://github.com/material-components/material-components-web/commit/faa7d3226edbb15bdfca69e5ae98b2d7afdd861a))
* **select:** do not conduct anchor typeahead when modifier keys pressed ([6f678a9](https://github.com/material-components/material-components-web/commit/6f678a91a400ac3408e06523d18a134cf3513f6b))
* **select:** set hidden input value before firing change event ([2d6ba2c](https://github.com/material-components/material-components-web/commit/2d6ba2c239dfc7d4c2516507b11a32537c163852)), closes [#6904](https://github.com/material-components/material-components-web/issues/6904)
* **shape:** duplication bug with nested custom properties ([f77a4dd](https://github.com/material-components/material-components-web/commit/f77a4dd1a3eb4f6af2b5a7695081408de41211b7))
* **slider:** Fire custom `input` event on input change (i.e. value change via keyboard), mirroring the native `input` event behavior for range inputs. ([ec8f846](https://github.com/material-components/material-components-web/commit/ec8f8465f40bd13f61e2ad26c52314fc27fd5420))
* **slider:** Fix #quantize to use min value as the baseline. ([0f358dd](https://github.com/material-components/material-components-web/commit/0f358ddae37a8703b8b6f0b8e4de846a196d443a))
* **slider:** Fix JS floating point rounding errors by rounding values to a set number of decimal places based on the step size. ([6072ed6](https://github.com/material-components/material-components-web/commit/6072ed6040e1f65e099b876a4065fbb07378c186))
* **slider:** Fix track height. ([67eb0df](https://github.com/material-components/material-components-web/commit/67eb0df80920a53e04fc151b3ab065959e3e84dc))
* **slider:** Improve HCM borders, add missing [@noflip](https://github.com/noflip) annotations. ([e7202cb](https://github.com/material-components/material-components-web/commit/e7202cb576ff762664a3636ec01cebfa5a61be49))
* **slider:** Modify behavior such that for range sliders, presses in the middle of the range change the value (of the closest thumb). This provides a single-pointer alternative option to an otherwise gesture-based interaction. ([0b8cff7](https://github.com/material-components/material-components-web/commit/0b8cff73421489a5322dd39b8504c16ba0f26120))
* **slider:** Throttle slider UI updates. ([7d6a4bb](https://github.com/material-components/material-components-web/commit/7d6a4bb72f210c94161568f964e33cd8b06a8315))
* **slider:** Throw error for invalid initial values based on the step. ([3955d8d](https://github.com/material-components/material-components-web/commit/3955d8d3d2ba2766b59338f0ed7ae640388ce926))
* **tab:** Update ripple adapter to reflect sass ripple-target. ([97c4d40](https://github.com/material-components/material-components-web/commit/97c4d40356fcc89d9eb854ecf322ec7474aa597c))
* **theme:** do not emit when theme.property() replacements are null ([aa0aaf0](https://github.com/material-components/material-components-web/commit/aa0aaf026aae13532b3e3790992e9cc06397aa91))
* **theme:** parsing error when [@import-ing](https://github.com/import-ing) mdc-theme ([b62b126](https://github.com/material-components/material-components-web/commit/b62b1266d66734fcd9d60c7893ea048f83883f8f))
* **theme:** replace works for multiple replacements ([95322b1](https://github.com/material-components/material-components-web/commit/95322b11e3b0c938d9b4de56a1ba80d1ff42596b))
* update README to correct links. ([71e615b](https://github.com/material-components/material-components-web/commit/71e615bc8fa757d22190641db0c2940e24bdf59b))
* **tooltip:** flip precedence of data-tooltip-id and aria-describedby when finding TT id ([b2d22df](https://github.com/material-components/material-components-web/commit/b2d22df5b62003247fa5ca60a23b2ce8b6a17b33))
* **typography:** do not emit styles when setting null from global variable ([f5f1b61](https://github.com/material-components/material-components-web/commit/f5f1b613ce5c0dda39f617adbcfd2bb3f1862a74))


### Code Refactoring

* **snackbar:** Update a11y structure ([c60449b](https://github.com/material-components/material-components-web/commit/c60449bc8a967e14436bec9471df99678a78515a))
* **tooltip:** Moved the anchor element blur event listener from the component to within the foundation. ([0b4a4b2](https://github.com/material-components/material-components-web/commit/0b4a4b2ebe245f2382cb08bbbc34e7ffb4f43763))
* **typography:** Rename typography Sass function from pxToRem() to px-to-rem() ([8f0a11e](https://github.com/material-components/material-components-web/commit/8f0a11e32895f998c326ab4a10601a2e4d5e18db))


### Features

* **base:** add non-statics foundation constructor type ([e3ec22f](https://github.com/material-components/material-components-web/commit/e3ec22f4579292c962ab81d7fee1d31b38b7d036))
* **base:** add observer mixin ([4ceb422](https://github.com/material-components/material-components-web/commit/4ceb42220043f0ca90c57d77efec89ed29ae4508))
* **chips:** Expose "action" component ([03d34bb](https://github.com/material-components/material-components-web/commit/03d34bbad14df501f5faf9d03e62c0727ef6f7da))
* **chips:** Expose "chip" component ([cbc57c6](https://github.com/material-components/material-components-web/commit/cbc57c600f972ec88098d7ad9c4763f57dce0eb4))
* **chips:** Expose "chipset" component ([d6c5bcf](https://github.com/material-components/material-components-web/commit/d6c5bcf3743048e44d5462a2266804a7a75678a7))
* **chips:** Expose top-level resources ([fefc668](https://github.com/material-components/material-components-web/commit/fefc668d77004762598e0cd88f3248a03a6aab1b))
* **chips:** Remove touch target wrapper selector from chip set spacing ([367d88b](https://github.com/material-components/material-components-web/commit/367d88bdb32a24c73f935154d616d1d7abfd9dd8))
* **chips:** Start deprecation of chip ([e683bdf](https://github.com/material-components/material-components-web/commit/e683bdf4a0f6642b87f099b51425898dd4a1b644))
* **chips:** Start deprecation of chip root directory ([73a2271](https://github.com/material-components/material-components-web/commit/73a227194d7c0caf305329f1a8b22eb801a6114b))
* **chips:** Start deprecation of chip set ([148e8cf](https://github.com/material-components/material-components-web/commit/148e8cfccac563305b9fa6fd4a6e8602620d6426))
* **chips:** Start deprecation of chip trailing action ([9eeb35c](https://github.com/material-components/material-components-web/commit/9eeb35c384c78a65215bf8885d5ebb5fb1592cd9))
* **chips:** Truncate long chip labels by default ([f5c6db8](https://github.com/material-components/material-components-web/commit/f5c6db8fc71c654c47c68a4c717f8d8995f43e30))
* **dialog:** Adding `resize` and `orientationchange` event handlers into `MDCDialogFoundation`. ([1e06534](https://github.com/material-components/material-components-web/commit/1e06534774df290b9a29210ee3bcf57515da6e43))
* **dialog:** Adds support for "surface-scrim" over full-screen dialogs. This prevents a "double scrim" from appearing when showing a secondary dialog over a full-screen dialog on larger screens. ([cddb035](https://github.com/material-components/material-components-web/commit/cddb0355362acb031da308f98283f9d4ad9a2c84))
* **dom:** add option to skip restoring focus on release focus ([5c0ab74](https://github.com/material-components/material-components-web/commit/5c0ab74019c6a1925ee8ef7946d8df6d9494bf88))
* **dom:** add tab key keyboard.ts ([dc9c840](https://github.com/material-components/material-components-web/commit/dc9c8402374f46402c73f97e60206517e3186389))
* **fab:** Add theming API to Extended FABs ([f19c86d](https://github.com/material-components/material-components-web/commit/f19c86d13447d984b13b0e1d7e9651e498d8de04))
* **fab:** Added `$focus-outline-width` param to extended-padding() FAB mixin ([8ecd7c9](https://github.com/material-components/material-components-web/commit/8ecd7c9a93c5b885fad9a1e6fd8d17da77c05360))
* **fab:** Added focus outline theme keys to FAB theme mixin ([d6d8d04](https://github.com/material-components/material-components-web/commit/d6d8d04768f9904488a6814ec47a251a03313627))
* **fab:** Added theme mixin to primary FAB variant. ([f19bbc4](https://github.com/material-components/material-components-web/commit/f19bbc4af6493f642dc4b5b45a2dc0083fa293f0))
* **fab:** border custom prop support & add CPs for padding ([a6b3101](https://github.com/material-components/material-components-web/commit/a6b3101fb7641daab20db735b70421311534083b))
* **fix:** Ensure that secondary controls do not ripple. ([1f636b2](https://github.com/material-components/material-components-web/commit/1f636b205b9609d19a96bef707ab87a0f8ca4f1a))
* **fix:** Fix divider layout in right-to-left locales. ([f524626](https://github.com/material-components/material-components-web/commit/f5246264d139124f6abf2cf5e9f8ca98762eb0f7))
* **fix:** Remove old MDC list class names, preparing to release evolution. ([5f0fc44](https://github.com/material-components/material-components-web/commit/5f0fc444a706626a106c2b36116a56e9dc5b8c79))
* **fix:** Remove the "evolution" prefix from list evolution's class names. ([0cde52f](https://github.com/material-components/material-components-web/commit/0cde52f5a007f4b7da16afd45f7445d615d5a2f6))
* **fix:** Simplify divider styles to reflect new design guidance. ([f77c508](https://github.com/material-components/material-components-web/commit/f77c508600d4b0f4ce4a66c63d1064b545149570))
* **linear-progress:** add getBuffer ([9c85d50](https://github.com/material-components/material-components-web/commit/9c85d505bddf9c63ef52508c385ec59f1f947b8e))
* **list:** Add "deprecated" aliases for old list mixins / variables. ([f9cac96](https://github.com/material-components/material-components-web/commit/f9cac96cc2ad0422d73140a65dcffc5e4e8ec519))
* **list:** Add missing "deprecated" aliases for old list mixin. ([302c7a9](https://github.com/material-components/material-components-web/commit/302c7a960f3b2787f253908d963eaaaa0b8adfd4))
* **list:** Finalize list mixin/variable rename. ([c97d7d8](https://github.com/material-components/material-components-web/commit/c97d7d88102f96c4c61a1b7c3329f3efac3727f4))
* **list:** Rename deprecated MDC list class names. ([a678806](https://github.com/material-components/material-components-web/commit/a678806f5618f21a6bd28e3b881f92130b723f6e))
* **list:** Rename deprecated MDC list class names. ([941ca3b](https://github.com/material-components/material-components-web/commit/941ca3b3c4c53ea296149a983b0159c5567e1b2c))
* **list:** Update deprecated list class names so evolution can become default. ([606e767](https://github.com/material-components/material-components-web/commit/606e767ef6d1d98461d8910ece874b65d0143981))
* **list:** Update styles to reference "deprecated" mixins/variables. ([3201cae](https://github.com/material-components/material-components-web/commit/3201cae479a0dbf97c40dda1b9d32a5818d6ab62))
* **list:** Update styles to remove "evolution" prefix from mixins/variables. ([f9c9e39](https://github.com/material-components/material-components-web/commit/f9c9e39d6c0cddf796de7e821ec59e199aeab851))
* **menu:** add maxHeight setter ([bf670da](https://github.com/material-components/material-components-web/commit/bf670dad7247d7ac1db9bf00905921b5c09a5b4d))
* **menu-surface:** add option to always horizontally center on viewport ([23ea2d8](https://github.com/material-components/material-components-web/commit/23ea2d85e760325371c2529af7c99316d876c044))
* **ripple:** add active() mixin for styling active styles. ([9f2e85f](https://github.com/material-components/material-components-web/commit/9f2e85fb8453cab94f54eeb9e2d9e18600ed7fa0))
* **select:** allow programmatic change without firing event ([79ce087](https://github.com/material-components/material-components-web/commit/79ce0878b3233592c3188548711b311e5706d3dd)), closes [#6166](https://github.com/material-components/material-components-web/issues/6166)
* **slider:** Add mixin to customize thumb color in the activated (hover, focus, pressed) state. ([94f50b2](https://github.com/material-components/material-components-web/commit/94f50b260dd6cbf6cca5fbedd2a8681746e2cc1d))
* Add support for "mdc-deprecated-list-*" class names. ([9e52f55](https://github.com/material-components/material-components-web/commit/9e52f554437fa438c9b4c266f8e87ff370ec5dea))
* **switch:** add high-contrast mode focus shim mixin ([c91e8d1](https://github.com/material-components/material-components-web/commit/c91e8d141bc8b519ae1d8c7d1771c0d5110e84ad))
* **theme:** add configuration support for custom-properties ([1f318ff](https://github.com/material-components/material-components-web/commit/1f318ff0f033f9f51c8bf7f76ef997161ff62fd4))
* **theme:** add create-varname() for custom properties ([b522724](https://github.com/material-components/material-components-web/commit/b5227247d730171c02bd71e9b44106cd179aaf2a))
* **theme:** add key store ([07ff0c4](https://github.com/material-components/material-components-web/commit/07ff0c452c896f9f8131532538742bed0ad207c9))
* **tooltip:** Adding logic to position the caret relative to the tooltip. ([76da787](https://github.com/material-components/material-components-web/commit/76da7876cd1452cdabed5169bdbdfd06b4629cda))
* **tooltip:** Adding touchstart/touchend event listeners to tooltip. This allows tooltips attached to non-focusable elements to be surfaced on mobile. ([7cd26af](https://github.com/material-components/material-components-web/commit/7cd26af4dd2033dacce75d2df2d179f81286fe71))
* **tooltip:** Creating an `mdc-tooltip__surface-animation` class that holds all the style properties responsible for animating the tooltip in and out of the page. The existing `mdc-tooltip__surface` class will hold all the style properties that impact the visual appearance of the tooltip. ([56fc269](https://github.com/material-components/material-components-web/commit/56fc26962126e24a7c56124de7f36078409254a7))
* **tooltip:** Expose method that allows users to register additional scroll handlers on elements in the DOM. This should be used in situations where the tooltip anchor is a child of a scrollable element, and will ensure that the tooltip remains attached to the anchor when this element is scrolled. ([24609b8](https://github.com/material-components/material-components-web/commit/24609b82225f763c1dc9da16b1ee9e0dd3c52197))


### BREAKING CHANGES

* **typography:** Renamed typography Sass function from pxToRem() to px-to-rem()

PiperOrigin-RevId: 368489085
* **fix:** the old list implementation has been deprecated and now requires that class names use an "mdc-deprecated-list-*" prefix. The new implementation (list evolution), no longer uses a prefix ("mdc-evolution-list-*" is now just "mdc-list-*").

PiperOrigin-RevId: 364441086
* **snackbar:** Dom structure change, see README.md

PiperOrigin-RevId: 363926666
* **tooltip:**   Added adapter method:
  - registerAnchorEventHandler<K extends EventType>(
      evtType: K, handler: SpecificEventListener<K>): void;
  - deregisterAnchorEventHandler<K extends EventType>(
      evtType: K, handler: SpecificEventListener<K>): void;

PiperOrigin-RevId: 358401984





# [10.0.0](https://github.com/material-components/material-components-web/compare/v9.0.0...v10.0.0) (2021-02-05)


### Bug Fixes

* **data-table:** fix style ordering wrt select & use new variable-width mixin ([afb6889](https://github.com/material-components/material-components-web/commit/afb68894e63c9ed4bb3b3d523cbb4072480117a6)), closes [#6599](https://github.com/material-components/material-components-web/issues/6599)
* **dialog:** add property to customize suppressDefaultPressSelector ([772cc10](https://github.com/material-components/material-components-web/commit/772cc10686cc8994033a556ab70f4be106e902ee))
* **linear-progress:** fix RTL rendering ([c7c5da2](https://github.com/material-components/material-components-web/commit/c7c5da28f2cd2c1b54dd201d3797e112288fa86c))
* **list:** add support for density scaling. ([419e035](https://github.com/material-components/material-components-web/commit/419e035729c1ca1ee2b572ae4b1937e2d8cf04bc))
* **list:** add support for non-interactive list roles. ([fc8b045](https://github.com/material-components/material-components-web/commit/fc8b045f1127709c5929a3cd1c9c7d622db8ed42))
* **list:** ensure divider appears in IE high contrast mode. ([eff7b46](https://github.com/material-components/material-components-web/commit/eff7b46ac916d2eb130f7d826eee047c5f19e6f2))
* **menu:** Remove anchorSize height from calculations when anchored to bottom ([1631198](https://github.com/material-components/material-components-web/commit/16311983787cf46ccd22eaa4d6a076254cb32eea))
* **notched-outline:** fix notched outline no-label style ([99cfb6b](https://github.com/material-components/material-components-web/commit/99cfb6bd53f72240fe76852d0fdaa0b82e7dca39))
* **select:** debounce click on anchor ([b39094d](https://github.com/material-components/material-components-web/commit/b39094d145f9b96c1c75e2b5fcce7b76c9b31bf1))
* **select:** set aria-expanded false earlier when menu closes ([df00c2b](https://github.com/material-components/material-components-web/commit/df00c2b30342877eba7d1e21e8a57141739155a5))
* **slider:** Add aria-hidden to value indicator container, to avoid duplicate value announcements for screenreader users. ([9687353](https://github.com/material-components/material-components-web/commit/96873535640a2e9141ff8e17e64fcb5e28d90f53))
* **slider:** Adjust hidden input dimensions to take slider dimensions, such that screenreader focus indicators show a highlight around the entire slider. ([fd22355](https://github.com/material-components/material-components-web/commit/fd22355f72ab304aec043f53ced92fa9adfef457))
* **slider:** Fire custom change event on input change. ([07deaec](https://github.com/material-components/material-components-web/commit/07deaec27a6f92b9a00c7698c49d3e1a93e504ea))
* **slider:** Fix bug where value indicator container took space and could be hovered over / clicked when hidden. ([832668d](https://github.com/material-components/material-components-web/commit/832668d33389a0b6194d3d8ef53aa8c252aa8f5d))
* **slider:** Mark ripple event handler as passive. Fixes [#6746](https://github.com/material-components/material-components-web/issues/6746) ([abdd100](https://github.com/material-components/material-components-web/commit/abdd10065367738148866c165b339a3e3b9b1fc3))
* **slider:** Remove big step options. Now that we're using a native range input, big step is not customizable - we follow browser defaults for big step. ([ae27b44](https://github.com/material-components/material-components-web/commit/ae27b44b078ebdad3669b03abc9f28ed184db803))
* **slider:** Update both thumbs' value indicator UI's if layout is invoked with undefined `thumb`. ([489d4c2](https://github.com/material-components/material-components-web/commit/489d4c219d1747a8e5de3f210f00898c18201b24))
* **slider:** Use `pointer-events: none` instead of `visibility: hidden` to hide the value indicator container. Adding `visibility: hidden` removes the exit animation since the value indicator is immediately hidden. ([a94bd8d](https://github.com/material-components/material-components-web/commit/a94bd8deb879b0321e8227d26f338789ef3ffb90))
* **slider:** Use mouse/touch events on iOS, to work around pointer events bug. ([671d72d](https://github.com/material-components/material-components-web/commit/671d72d9544d3d1630966ec4e78b5705700defe7)), closes [#6715](https://github.com/material-components/material-components-web/issues/6715)
* **tabs:** Expose min width mixin and set to 90px per spec. ([c4ab987](https://github.com/material-components/material-components-web/commit/c4ab987221d5a3b9ab588321bb0347f5d665505a))
* **theme:** ensure either() works with false values ([8e66dbf](https://github.com/material-components/material-components-web/commit/8e66dbfeebe3d5fec438c69093d7f9941c0fbf10))
* **tooltip:** Adds "will-change" into CSS to prevent the tooltip from "jittering" when animating in. ([7a003ac](https://github.com/material-components/material-components-web/commit/7a003acf09345920d917cb4ab7c298a66e4fe184))
* **tooltip:** Change foundation to check for "dialog" on the anchor element's aria-haspopup attribute instead of checking for "true". ([b8a1a58](https://github.com/material-components/material-components-web/commit/b8a1a58e4ebb49a73725d2e7ae8aef09c07db09d))
* **tooltip:** Clear hideTimeout in handleAnchorMouseEnter so that the tooltip will not be hidden if the user rapidly moves the mouse in and out of the anchor element. ([365c693](https://github.com/material-components/material-components-web/commit/365c69360230540a67dd141f6bec999b2541a7e8))
* **tooltip:** Fix rich tooltip tests to not use aria-describedby to associate rich tooltips with their anchor elements. This is because interactive rich tooltips should not be used with aria-describedby per a11y guidance. ([251ac04](https://github.com/material-components/material-components-web/commit/251ac04c0a976d48a6be33cc7fcd76f6e2700aac))
* adjust meta baseline and update color mixins. ([07f3e01](https://github.com/material-components/material-components-web/commit/07f3e01b75306a7481c7077cd3ed12a87399958e))


### Code Refactoring

* Remove MDC theme's deep-get, used sass:map's get API instead. ([37fbae1](https://github.com/material-components/material-components-web/commit/37fbae10d6fb993c0ea866959fb5564c052002cc))


### Features

* **banner:** Add mobile-stacked variant support to banner. ([a0b2db2](https://github.com/material-components/material-components-web/commit/a0b2db26b550162d2e409489c5ded3381b7c7dc2))
* **button:** Add in HCM support to the mdc button as an opt-in mixin. ([121e1f3](https://github.com/material-components/material-components-web/commit/121e1f303f10e55c9cc5e6508bcd559c6ea7dc7b))
* **button:** consolidate states into button mixins ([637d15d](https://github.com/material-components/material-components-web/commit/637d15da60919641e5571f280562c4fb3491c8f0))
* **button:** thread state keys through theme config ([05f2496](https://github.com/material-components/material-components-web/commit/05f249666dff2bae35a1a6c1e7a5ed89eb193213))
* **checkbox:** Add CSS custom properties to MDC checkbox for density theming ([9244508](https://github.com/material-components/material-components-web/commit/9244508bd82ab65635169cfacd74f1a25ebaab7e))
* **checkbox:** Add validation to MDC Checkbox theme mixin ([2d5f32d](https://github.com/material-components/material-components-web/commit/2d5f32d41cda48ca8e3c1d2244d6fb3bb4c6aa7d))
* **circular-progress:** do not require HTML without whitespaces ([8648b82](https://github.com/material-components/material-components-web/commit/8648b8258f7f87edcc1d58a2bc7db3d78425508f))
* **dialog:** add custom property for z-index ([776c186](https://github.com/material-components/material-components-web/commit/776c1868154e5b99a332f60927b78b32b82fe19f))
* **dialog:** Adding styling for scroll bar dividers, and adding logic to show said dividers only when content is scrolled "behind" the header or footer of the dialog. ([e383944](https://github.com/material-components/material-components-web/commit/e383944e9792ea1971c7814e0e63e2e00f99a468))
* **dialog:** Adds and defines styling for the "header bar" on a full-screen dialog. ([089de51](https://github.com/material-components/material-components-web/commit/089de519c1c2f0378b9852dafd3ca5a304268a44))
* **iconbutton:** Add in HCM support to the mdc iconbutton as an opt-in mixin. ([fd61b04](https://github.com/material-components/material-components-web/commit/fd61b04760d96fcc1c96e43ca8e0663d16f5a995))
* **linear-progress:** remove aria-valuemin/max attrs for indeterminate ([4321323](https://github.com/material-components/material-components-web/commit/4321323e4bea2da8192b81ebdf8c6a9ee1e76aa0))
* **list:** support ctrl + a keyboard shortcut ([eefef49](https://github.com/material-components/material-components-web/commit/eefef49d86c69b1985aa4e5fa5b8809ba1f0a1f4)), closes [#6366](https://github.com/material-components/material-components-web/issues/6366)
* **list:** Update the MDC component for List Evolution. ([766981c](https://github.com/material-components/material-components-web/commit/766981c15a200b374a14c2ab80bf746824bf7434))
* **menu,select:** enable fixed menu position in mwc-select ([b9adb7a](https://github.com/material-components/material-components-web/commit/b9adb7a0f6d2871bcd87664ab857fb62392c27d4)), closes [#2062](https://github.com/material-components/material-components-web/issues/2062)
* **select:** add mixin for variable width ([30c11bf](https://github.com/material-components/material-components-web/commit/30c11bfc24e426c0647645758e4f9d98f589e85c))
* **slider:** Add hidden input to slider, to support forms submission. This is also prep for moving to use an \<input type="range"\> behind the scenes, in order to support touch-based AT's. ([b98d15d](https://github.com/material-components/material-components-web/commit/b98d15d90b19e69066c0b417ee0d8b11ab733e20))
* **slider:** Modify continuous slider to use step value by default, and give clients the option to customize step value for continuous sliders. ([7ad038e](https://github.com/material-components/material-components-web/commit/7ad038e1d37171dc1fc931112b17f085533f7048))
* **slider:** Use input with type="range" to back slider component. This ensures that sliders can be adjusted with touch-based assistive technologies, as the current ARIA spec for sliders is not compatible with e.g. TalkBack/Android. ([9083b7d](https://github.com/material-components/material-components-web/commit/9083b7d61b1dda2c5acefda6e8939870a358e98f))
* **snackbar:** Add 1px transparent border for high contrast support ([15a4d40](https://github.com/material-components/material-components-web/commit/15a4d40dd708775c6120165422c9ebadee4c8f6f))
* **theme:** add either() utility function ([5268222](https://github.com/material-components/material-components-web/commit/5268222c432bb886add05cbb1779909117cf1620))
* **theme:** add validation option to disallow custom properties ([fec7b42](https://github.com/material-components/material-components-web/commit/fec7b42ca54baf37487cadaf96ac8cf559d6ccd0))
* **theme:** Added validation mixin to validate provided theme configuration keys ([1c156d6](https://github.com/material-components/material-components-web/commit/1c156d69d76efcfa39c706f7f6ae74e96c2bd541))
* **theme:** allow lists in replace maps ([d2959b1](https://github.com/material-components/material-components-web/commit/d2959b16ca9a2e4574984b8e459993c9c9a2075a))
* **theme:** emit CSS var() declarations when provided a standalone custom prop ([1a3a396](https://github.com/material-components/material-components-web/commit/1a3a396293df35d9621155e9168df35d39d83fee))
* **tooltip:** Add positioning adjustment and position specification for rich tooltips. Rich tooltips default to the END position and does not support CENTER positioning. ([384a8ee](https://github.com/material-components/material-components-web/commit/384a8eeb163798df6655c8a49c36428ede852e15))
* **tooltip:** Added persistent variant for rich tooltips that shows/hides based on mouse clicks on the anchor element. Clicks on elements other than the anchor will also hide the persistent variant. ([9775856](https://github.com/material-components/material-components-web/commit/9775856508a7256cb7dc93d0c3e47f6d87c08c93))
* **tooltip:** Adds `transform-origin` on tooltip surface so tooltip entrance animation has a direction based on its alignment with the anchor element. ([623af86](https://github.com/material-components/material-components-web/commit/623af861e1852603fd4778fb0abbef58b427333c))
* **tooltip:** Adjust  tooltip position on `scroll` and `resize` events. This ensures that the tooltip remains pinned to the anchor element despite page movement. ([a415276](https://github.com/material-components/material-components-web/commit/a41527604048d218879240aaaf04aff7389053d1))
* **tooltip:** Adjusting tooltip positioning logic so that the tooltip remains within the viewport even if the anchor element is partially off-screen. ([482ff90](https://github.com/material-components/material-components-web/commit/482ff909132b2e8f81791d7128cb0a3d2ff371a8))
* **tooltip:** Change rich tooltip to use position absolute instead of fixed and rely on a position relative parent element so that if the parent has a transform, perspective, or filter property set to something other than none, the positioning would still work. ([0c95c9f](https://github.com/material-components/material-components-web/commit/0c95c9f7bf1e0d465e99fd7dd3f1497d37d871ff))
* **tooltip:** Define styling to set the full-screen dialog size depending on the viewport size. ([fe13dd1](https://github.com/material-components/material-components-web/commit/fe13dd1308dc695898b2c7d3dfbddccc7d38b420))
* **tooltip:** Expose `hide` and `isShown` methods in the MDCTooltip component. This allows MDC clients to create their own class to enforce only one tooltip being shown at a time. ([c5e18b0](https://github.com/material-components/material-components-web/commit/c5e18b0203a3c474384bc5902a15855636ce849b))
* **tooltip:** Hide rich tooltip if mouse leaves rich tooltip. Rich tooltip persists if mouse leaves rich tooltip and enters anchor. ([6d8574f](https://github.com/material-components/material-components-web/commit/6d8574fe1db3a60dfb5a45ce8c6c6718700c2dfd))
* **tooltip:** Reducing minimum threshold distance between tooltip and viewport from 32px to 8px. ([23491cf](https://github.com/material-components/material-components-web/commit/23491cf85b8831896f95879e8aea258d5ca7f653))
* **tooltip:** Restore focus to the anchor element when the ESC button is pressed while the focus is in the tooltip for rich tooltips. Default rich tooltips should have focus restored to anchor and not have rich tooltips show. ([eabf9d5](https://github.com/material-components/material-components-web/commit/eabf9d5c2d9b56e316db98f2d8e16bf12f1ef501))
* **tooltip:** Set up base sass for rich tooltip. Rich tooltips are currently in development and is not yet ready for use. ([4ae94ff](https://github.com/material-components/material-components-web/commit/4ae94ff7816d87fde3285a0c2fd48b94ff0bbdab))
* **tooltip:** Set up rich tooltip to persist if mouse leaves anchor and enters rich tooltip. ([c927a5d](https://github.com/material-components/material-components-web/commit/c927a5d05761d0a80f886b2b7627e600df38c467))
* **tooltip:** The aria-expanded attribute of the anchor element will only be changed for anchor elements with interactive rich tooltips. Non-interactive rich tooltip anchor elements do not have the aria-haspopup and aria-expanded attributes. ([c5dda80](https://github.com/material-components/material-components-web/commit/c5dda809d5e4c110f3b4bb37c9646e572026d58d))
* **tooltip:** When the anchor element blurs, the rich tooltip will only be hidden if the focus is changed to a non-rich tooltip element. ([6871336](https://github.com/material-components/material-components-web/commit/6871336f11f3cc7d94c6314dc049092e0427106c))
* Added global variable to conditionally emit CSS selector fallback declarations ([7b0e2b3](https://github.com/material-components/material-components-web/commit/7b0e2b3775d006126161bd688851d490d19e9558))
* **tooltip:** When the rich tooltip element focuses out, hide the rich tooltip if the new focused element is not the anchor element or an element within the rich tooltip. ([1085c3b](https://github.com/material-components/material-components-web/commit/1085c3b2df7d3c1b528e1b9ba5557975fa959401))


### BREAKING CHANGES

* **theme:** custom-properties.apply() has been renamed to declaration() to better align with css.declaration()
* **tooltip:**   Added adapter methods:
  - getComputedStyleProperty(propertyName: string): string;
  - getParentBoundingRect(): ClientRect|null;
* **tooltip:**   Added adapter method:
  - tooltipContainsElement(element: HTMLElement): boolean;
* Removed `deep-get()` API from mdc-theme, use `sass:map`'s get() API instead.
* **tooltip:**   Added adapter method:
  - anchorContainsElement(element: HTMLElement): boolean;
* **slider:** Slider is now backed by an input of type="range". Additionally, adapter methods (focusInput, isInputFocused, registerInputEventHandler, deregisterInputEventHandler) were added.
* **tooltip:**   Added adapter methods:
  - setAnchorAttribute(attr: string, value: string): void;
  - registerEventHandler<K extends EventType>(
        evtType: K, handler: SpecificEventListener<K>): void;
  - deregisterEventHandler<K extends EventType>(
        evtType: K, handler: SpecificEventListener<K>): void;
* **slider:** Adds slider adapter methods (get/setInputValue, get/setInputAttribute, removeInputAttribute). Slider DOM structure now contains a hidden input.
  

# [9.0.0](https://github.com/material-components/material-components-web/compare/v8.0.0...v9.0.0) (2020-12-29)


### Bug Fixes

* **data-table:** fix style ordering wrt select & use new variable-width mixin ([afb6889](https://github.com/material-components/material-components-web/commit/afb68894e63c9ed4bb3b3d523cbb4072480117a6)), closes [#6599](https://github.com/material-components/material-components-web/issues/6599)
* **list:** add support for density scaling. ([419e035](https://github.com/material-components/material-components-web/commit/419e035729c1ca1ee2b572ae4b1937e2d8cf04bc))
* **list:** add support for non-interactive list roles. ([fc8b045](https://github.com/material-components/material-components-web/commit/fc8b045f1127709c5929a3cd1c9c7d622db8ed42))
* **list:** ensure divider appears in IE high contrast mode. ([eff7b46](https://github.com/material-components/material-components-web/commit/eff7b46ac916d2eb130f7d826eee047c5f19e6f2))
* Adding tests. ([240c5f7](https://github.com/material-components/material-components-web/commit/240c5f74f381967ede9eb1fa13754d2f0282da9e))
* adjust meta baseline and update color mixins. ([07f3e01](https://github.com/material-components/material-components-web/commit/07f3e01b75306a7481c7077cd3ed12a87399958e))
* Document stylelint exceptions ([f89d8b8](https://github.com/material-components/material-components-web/commit/f89d8b8f295c80c7b7e691ec712a30de8a0b26d5))
* **notched-outline:** fix notched outline no-label style ([99cfb6b](https://github.com/material-components/material-components-web/commit/99cfb6bd53f72240fe76852d0fdaa0b82e7dca39))
* **select:** debounce click on anchor ([b39094d](https://github.com/material-components/material-components-web/commit/b39094d145f9b96c1c75e2b5fcce7b76c9b31bf1))
* **slider:** Adjust hidden input dimensions to take slider dimensions, such that screenreader focus indicators show a highlight around the entire slider. ([fd22355](https://github.com/material-components/material-components-web/commit/fd22355f72ab304aec043f53ced92fa9adfef457))
* **slider:** Fix bug where value indicator container took space and could be hovered over / clicked when hidden. ([832668d](https://github.com/material-components/material-components-web/commit/832668d33389a0b6194d3d8ef53aa8c252aa8f5d))
* **slider:** Remove big step options. Now that we're using a native range input, big step is not customizable - we follow browser defaults for big step. ([ae27b44](https://github.com/material-components/material-components-web/commit/ae27b44b078ebdad3669b03abc9f28ed184db803))
* **slider:** Update both thumbs' value indicator UI's if layout is invoked with undefined `thumb`. ([489d4c2](https://github.com/material-components/material-components-web/commit/489d4c219d1747a8e5de3f210f00898c18201b24))
* **tabs:** Expose min width mixin and set to 90px per spec. ([c4ab987](https://github.com/material-components/material-components-web/commit/c4ab987221d5a3b9ab588321bb0347f5d665505a))


### Code Refactoring

* Remove MDC theme's deep-get, used sass:map's get API instead. ([37fbae1](https://github.com/material-components/material-components-web/commit/37fbae10d6fb993c0ea866959fb5564c052002cc))


### Features

* **banner:** Add mobile-stacked variant support to banner. ([a0b2db2](https://github.com/material-components/material-components-web/commit/a0b2db26b550162d2e409489c5ded3381b7c7dc2))
* **checkbox:** Add CSS custom properties to MDC checkbox for density theming ([9244508](https://github.com/material-components/material-components-web/commit/9244508bd82ab65635169cfacd74f1a25ebaab7e))
* **checkbox:** Add validation to MDC Checkbox theme mixin ([2d5f32d](https://github.com/material-components/material-components-web/commit/2d5f32d41cda48ca8e3c1d2244d6fb3bb4c6aa7d))
* **circular-progress:** do not require HTML without whitespaces ([8648b82](https://github.com/material-components/material-components-web/commit/8648b8258f7f87edcc1d58a2bc7db3d78425508f))
* **linear-progress:** remove aria-valuemin/max attrs for indeterminate ([4321323](https://github.com/material-components/material-components-web/commit/4321323e4bea2da8192b81ebdf8c6a9ee1e76aa0))
* **list:** support ctrl + a keyboard shortcut ([eefef49](https://github.com/material-components/material-components-web/commit/eefef49d86c69b1985aa4e5fa5b8809ba1f0a1f4)), closes [#6366](https://github.com/material-components/material-components-web/issues/6366)
* **select:** add mixin for variable width ([30c11bf](https://github.com/material-components/material-components-web/commit/30c11bfc24e426c0647645758e4f9d98f589e85c))
* **slider:** Add hidden input to slider, to support forms submission. This is also prep for moving to use an \<input type="range"\> behind the scenes, in order to support touch-based AT's. ([b98d15d](https://github.com/material-components/material-components-web/commit/b98d15d90b19e69066c0b417ee0d8b11ab733e20))
* **slider:** Modify continuous slider to use step value by default, and give clients the option to customize step value for continuous sliders. ([7ad038e](https://github.com/material-components/material-components-web/commit/7ad038e1d37171dc1fc931112b17f085533f7048))
* **slider:** Use input with type="range" to back slider component. This ensures that sliders can be adjusted with touch-based assistive technologies, as the current ARIA spec for sliders is not compatible with e.g. TalkBack/Android. ([9083b7d](https://github.com/material-components/material-components-web/commit/9083b7d61b1dda2c5acefda6e8939870a358e98f))
* **theme:** Added validation mixin to validate provided theme configuration keys ([1c156d6](https://github.com/material-components/material-components-web/commit/1c156d69d76efcfa39c706f7f6ae74e96c2bd541))
* **tooltip:** Add positioning adjustment and position specification for rich tooltips. Rich tooltips default to the END position and does not support CENTER positioning. ([384a8ee](https://github.com/material-components/material-components-web/commit/384a8eeb163798df6655c8a49c36428ede852e15))
* **tooltip:** Added persistent variant for rich tooltips that shows/hides based on mouse clicks on the anchor element. Clicks on elements other than the anchor will also hide the persistent variant. ([9775856](https://github.com/material-components/material-components-web/commit/9775856508a7256cb7dc93d0c3e47f6d87c08c93))
* **tooltip:** Adjust  tooltip position on `scroll` and `resize` events. This ensures that the tooltip remains pinned to the anchor element despite page movement. ([a415276](https://github.com/material-components/material-components-web/commit/a41527604048d218879240aaaf04aff7389053d1))
* **tooltip:** Adjusting tooltip positioning logic so that the tooltip remains within the viewport even if the anchor element is partially off-screen. ([482ff90](https://github.com/material-components/material-components-web/commit/482ff909132b2e8f81791d7128cb0a3d2ff371a8))
* **tooltip:** Hide rich tooltip if mouse leaves rich tooltip. Rich tooltip persists if mouse leaves rich tooltip and enters anchor. ([6d8574f](https://github.com/material-components/material-components-web/commit/6d8574fe1db3a60dfb5a45ce8c6c6718700c2dfd))
* **tooltip:** Make persistent rich tooltips persist when click target is within the rich tooltip. ([fb194dd](https://github.com/material-components/material-components-web/commit/fb194dd354d2c912f997c500347557edcba1440d))
* **tooltip:** Reducing minimum threshold distance between tooltip and viewport from 32px to 8px. ([23491cf](https://github.com/material-components/material-components-web/commit/23491cf85b8831896f95879e8aea258d5ca7f653))
* **tooltip:** Restore focus to the anchor element when the ESC button is pressed while the focus is in the tooltip for rich tooltips. Default rich tooltips should have focus restored to anchor and not have rich tooltips show. ([eabf9d5](https://github.com/material-components/material-components-web/commit/eabf9d5c2d9b56e316db98f2d8e16bf12f1ef501))
* **tooltip:** Set up base sass for rich tooltip. Rich tooltips are currently in development and is not yet ready for use. ([4ae94ff](https://github.com/material-components/material-components-web/commit/4ae94ff7816d87fde3285a0c2fd48b94ff0bbdab))
* **tooltip:** Set up rich tooltip to persist if mouse leaves anchor and enters rich tooltip. ([c927a5d](https://github.com/material-components/material-components-web/commit/c927a5d05761d0a80f886b2b7627e600df38c467))
* **tooltip:** The aria-expanded attribute of the anchor element will only be changed for anchor elements with interactive rich tooltips. Non-interactive rich tooltip anchor elements do not have the aria-haspopup and aria-expanded attributes. ([c5dda80](https://github.com/material-components/material-components-web/commit/c5dda809d5e4c110f3b4bb37c9646e572026d58d))
* **tooltip:** When the anchor element blurs, the rich tooltip will only be hidden if the focus is changed to a non-rich tooltip element. ([6871336](https://github.com/material-components/material-components-web/commit/6871336f11f3cc7d94c6314dc049092e0427106c))
* **tooltip:** When the rich tooltip element focuses out, hide the rich tooltip if the new focused element is not the anchor element or an element within the rich tooltip. ([1085c3b](https://github.com/material-components/material-components-web/commit/1085c3b2df7d3c1b528e1b9ba5557975fa959401))
* Added global variable to conditionally emit CSS selector fallback declarations ([7b0e2b3](https://github.com/material-components/material-components-web/commit/7b0e2b3775d006126161bd688851d490d19e9558))


### BREAKING CHANGES

* **tooltip:**   Added adapter method:
  - tooltipContainsElement(element: HTMLElement): boolean;
Rich tooltips are currently in development and is not yet ready for use.

PiperOrigin-RevId: 346325244
* Removed `deep-get()` API from mdc-theme, use `sass:map`'s get() API instead.

PiperOrigin-RevId: 345257138
* **tooltip:**   Added adapter method:
  - anchorContainsElement(element: HTMLElement): boolean;
Rich tooltips are currently in development and is not yet ready for use.

PiperOrigin-RevId: 345221617
* **slider:** Slider is now backed by an input of type="range". Additionally, adapter methods (focusInput, isInputFocused, registerInputEventHandler, deregisterInputEventHandler) were added.

PiperOrigin-RevId: 344116908
* **tooltip:**   Added adapter methods:
  - setAnchorAttribute(attr: string, value: string): void;
  - registerEventHandler<K extends EventType>(
        evtType: K, handler: SpecificEventListener<K>): void;
  - deregisterEventHandler<K extends EventType>(
        evtType: K, handler: SpecificEventListener<K>): void;
Rich tooltips are currently in development and is not yet ready for use.

PiperOrigin-RevId: 343894231
* **slider:** Adds slider adapter methods (get/setInputValue, get/setInputAttribute, removeInputAttribute). Slider DOM structure now contains a hidden input.

PiperOrigin-RevId: 343157208





# [8.0.0](https://github.com/material-components/material-components-web/compare/v7.0.0...v8.0.0) (2020-11-02)


### Bug Fixes

* **banner:** Update image to graphic and support material icons ([346069c](https://github.com/material-components/material-components-web/commit/346069ccb2a831b37df62bf71135acad92fd69c3))
* **card:** ensure border-adjacent content renders correctly. ([790ca85](https://github.com/material-components/material-components-web/commit/790ca85fd643229e95f2d1c08811c8e0e5513805))
* **checkbox:** Use secondary and on-secondary as default colors ([b95172e](https://github.com/material-components/material-components-web/commit/b95172e69613c0defe82191b86ed1c1999b74400)), closes [#5730](https://github.com/material-components/material-components-web/issues/5730)
* **chip-set:** crash when only item is removed ([a653b68](https://github.com/material-components/material-components-web/commit/a653b68118e823ae30b1f47f87a4a8e5e69d9186))
* **chips:** Handle IE/Edge specific key names in keyboard navigation logic ([3657f88](https://github.com/material-components/material-components-web/commit/3657f886327182c26f1d1555b2ac67c2128140b5))
* **circular-progress:** Add .npmignore file to ignore typescript files when publishing ([#5801](https://github.com/material-components/material-components-web/issues/5801)) ([f172b0f](https://github.com/material-components/material-components-web/commit/f172b0f90a91d8d3d700763d1496bb7b9c1a8d51)), closes [#5800](https://github.com/material-components/material-components-web/issues/5800)
* **circular-progress:** Default all variables ([430fd02](https://github.com/material-components/material-components-web/commit/430fd025b07b3e15dd699620fbbfca75f74632a3))
* **circular-progress:** display properly inside button ([2bd09a7](https://github.com/material-components/material-components-web/commit/2bd09a706efb991fd71e171db8994f0282a1f02e))
* **circular-progress:** display properly inside button ([000d648](https://github.com/material-components/material-components-web/commit/000d6481570c361cf4c66b55c287eea434b6d11e)), closes [#6388](https://github.com/material-components/material-components-web/issues/6388)
* **circular-progress:** fix determinate transition typo & 4 color keyframes ([a301636](https://github.com/material-components/material-components-web/commit/a3016368df53b1c7967d7d146a9ea53a24442fa9))
* **circular-progress:** Fix naming in package.json and add to jsBundleFactory ([86f7cad](https://github.com/material-components/material-components-web/commit/86f7cad8330dbd600e478610eefd8dd92eb3d8c7))
* **circular-progress:** Force LTR layout ([6a40ef2](https://github.com/material-components/material-components-web/commit/6a40ef217f597138ee2920d2160364649dbf5620))
* **circular-progress:** Switch mixins import to `[@use](https://github.com/use)` ([098ae32](https://github.com/material-components/material-components-web/commit/098ae3285223af2532659dec233537a55c1183f5))
* **circular-progress:** use theme.property() for color mixins ([7bd5075](https://github.com/material-components/material-components-web/commit/7bd5075de978f8499f4cdc3b8359005184fa5192))
* **data-table:** Add noflip annotation to header cell text align ([843f636](https://github.com/material-components/material-components-web/commit/843f636c047b5371cd31b9ae4af76a7ec494b446))
* **data-table:** Check if data table has checkboxes on destroy ([164c073](https://github.com/material-components/material-components-web/commit/164c07365ef405a14e4375db71fbc55931aa9262))
* **data-table:** Fix icon misalignment in sort icon button when sorted down ([610c26c](https://github.com/material-components/material-components-web/commit/610c26c4a1c7928fec0e8d63be3bd76cb7ff76a0))
* **data-table:** Fix JS error in IE11 when setting multiple styles ([d548d7a](https://github.com/material-components/material-components-web/commit/d548d7a923393f4be11a7919542fa07f5a224d29))
* **data-table:** Fix pagination box height ([eb28b6e](https://github.com/material-components/material-components-web/commit/eb28b6ecc65a9979ef0959eac5dbfde5b4d3b2dc))
* **data-table:** Fix row checkbox cell's leading padding to match spec ([38ef450](https://github.com/material-components/material-components-web/commit/38ef4501f630351b32efd31ea2b870e0ed1b1b1d))
* **data-table:** Fixed default feature targeting query params of sort mixins ([e33c49e](https://github.com/material-components/material-components-web/commit/e33c49eaf9c0dbc601f3610af6358cbf2833229c))
* **data-table:** Hover styles for sortable header cell ([d580805](https://github.com/material-components/material-components-web/commit/d5808057fcdf00364731e0896ef7031ac605cf55))
* **data-table:** partial rollback of [#6390](https://github.com/material-components/material-components-web/issues/6390) ([da72839](https://github.com/material-components/material-components-web/commit/da72839f40a432c529bb24e5bc4514842627d3bf))
* **data-table:** Reverse the arrow direction icon for column sorting ([a7c827f](https://github.com/material-components/material-components-web/commit/a7c827f17ce9be631484676ccb6b5f18604803ae))
* **data-table:** Set progress indicator height to table body offset height ([c678a9d](https://github.com/material-components/material-components-web/commit/c678a9d34a3f694511f292c7a62e68749721b63c))
* **data-table:** unable to redefine colors in class-based themi… ([#5751](https://github.com/material-components/material-components-web/issues/5751)) ([4d48051](https://github.com/material-components/material-components-web/commit/4d48051c1099f48e867cf08f070138a7abc719fc))
* **data-table:** unable to redefine colors in class-based theming ([4b45b66](https://github.com/material-components/material-components-web/commit/4b45b662057edd8819f1a515db88e1c12254cc30))
* **datatable:** Fix updating the header checkbox when there are no rows in a datatable ([2ccf996](https://github.com/material-components/material-components-web/commit/2ccf996cc417b888d7ac4ceebdfa4160464a0bb1))
* **dom:** Make dom selectors in dom/announce tests scoped ([fc65fd0](https://github.com/material-components/material-components-web/commit/fc65fd00b91d388d0ad15e50a13567a8e1d425c0))
* **elevation:** Use relative path when importing theme Sass file. ([405a29a](https://github.com/material-components/material-components-web/commit/405a29a2016565f8cb269915c5f6c0d4df133c6d))
* **linear-progress:** disable animations when closed ([a831d47](https://github.com/material-components/material-components-web/commit/a831d4799b281729a932f0690b62b6bce1874799))
* **linear-progress:** performance for indeterminate animations in modern browsers ([fc0eb50](https://github.com/material-components/material-components-web/commit/fc0eb5013603a4d5cb4dbc0a999e94df64cc5005))
* **linear-progress:** Temporary rollback of [#5656](https://github.com/material-components/material-components-web/issues/5656) while updating downstream dependencies ([9cf5e98](https://github.com/material-components/material-components-web/commit/9cf5e9842475e50046462aa1c6d18e326abaee17))
* **list:** No longer emits action event when disabled item selected ([f352d03](https://github.com/material-components/material-components-web/commit/f352d03f4ed48c5019a0a3e10ef12689a5ab5619)), closes [#5571](https://github.com/material-components/material-components-web/issues/5571)
* **mdc-dialog:** second dialog `data-mdc-dialog-initial-focus` doesn't work ([a0ec7e2](https://github.com/material-components/material-components-web/commit/a0ec7e25d0ba26c2e85d5576e6af5e5d65b301a3))
* **menu-surface:** Use margin_to_edge as a viewport margin in calculations for autopositioning. ([4b04cdb](https://github.com/material-components/material-components-web/commit/4b04cdb0fc4da4831340b01292c118b120c1fcb1))
* **menusurface:** Fixing bug where body click listener is not being properly deregistered. ([5511c52](https://github.com/material-components/material-components-web/commit/5511c5254476c817b51bb2ae884f56d328348bd0)), closes [#6557](https://github.com/material-components/material-components-web/issues/6557)
* **menusurface:** synchronous quick menu does not close on button click ([45a6615](https://github.com/material-components/material-components-web/commit/45a6615e33eb8a7e6fc37e9ef43a3be3682b6b0e))
* **radio:** disabled state in IE high contrast mode ([774dcfc](https://github.com/material-components/material-components-web/commit/774dcfc8eb31e766afd0194c54edfe71a7ff7c3e))
* **segmented-button:** Fixed unit test in IE11 ([#6271](https://github.com/material-components/material-components-web/issues/6271)) ([b96fbfc](https://github.com/material-components/material-components-web/commit/b96fbfc7a9b75d7d58ecc53919c26b1cdd05d9ed))
* **segmented-button:** Move include statements to avoid nested classes ([#6380](https://github.com/material-components/material-components-web/issues/6380)) ([bcc5829](https://github.com/material-components/material-components-web/commit/bcc58290a7ac7bbbe191d00be003785017f94d29))
* **segmented-button:** Use empty clientRect in default adapter ([#6343](https://github.com/material-components/material-components-web/issues/6343)) ([9f9aac8](https://github.com/material-components/material-components-web/commit/9f9aac82595ec6eb117e101dc5e0ee0a22e81eee))
* **select:** Deduplicate change events ([4ad1274](https://github.com/material-components/material-components-web/commit/4ad12741e41c5b8e175f2bc8d5053daec6cedf18)), closes [#5570](https://github.com/material-components/material-components-web/issues/5570)
* **select:** do not emit change event when same value selected twice ([e07a708](https://github.com/material-components/material-components-web/commit/e07a7084134b6bbfb1d31a00e410b9d133f28863))
* **select:** ensure enough space for label when outlined menu opening above ([66b8ed7](https://github.com/material-components/material-components-web/commit/66b8ed7e62881b1b22b3b5a32730eac43d563cb7))
* **select:** float label on hidden-input initial value ([744bfe5](https://github.com/material-components/material-components-web/commit/744bfe5d8438b49d995ac5e2760d776a1df9838a))
* **select:** move label before selected text for screenreader a11y ([e139d62](https://github.com/material-components/material-components-web/commit/e139d626eefc941415b876597787753520a45ab1))
* **select:** prevent dropdown icon focus on IE ([b9dff0a](https://github.com/material-components/material-components-web/commit/b9dff0a19ee53e492ef9b06538dfe863214b5fc2)), closes [#6323](https://github.com/material-components/material-components-web/issues/6323)
* **select:** prevent helper text from announcing when hidden ([e056052](https://github.com/material-components/material-components-web/commit/e0560522fc2e390ee25a1968fdde3fde0cab6041))
* **select:** remove gap when outlined opened above with no label ([2fe7012](https://github.com/material-components/material-components-web/commit/2fe70126ae51043d1e733e6d4ec11452e7ed9bc4))
* **select:** remove min-width & dynamic width resizing ([d4cd83a](https://github.com/material-components/material-components-web/commit/d4cd83a857fdf072f547dc597db1f8b30d33a102))
* **select:** remove unnecessary bottom line focus selector ([32fb314](https://github.com/material-components/material-components-web/commit/32fb314cd0cc74f37f0d567a739c115daa96be95))
* **select:** revert 2fed2c1 that delegates to list for single selection logic ([38197b4](https://github.com/material-components/material-components-web/commit/38197b4434959cc8b47124233003c14d9c4a0fbf))
* **shape:** remove deprecated functions ([e2ea4a9](https://github.com/material-components/material-components-web/commit/e2ea4a99e1930ac4981f22a2b919bdbd31e75a95))
* **slider:** Fix bugs with setting slider position before component initialization: ([9110147](https://github.com/material-components/material-components-web/commit/9110147118180dc1de5c7d727fb3ecbe2507882f))
* **slider:** Move inactive track before active track, so active track consistently overlaps inactive track. ([0b7ac96](https://github.com/material-components/material-components-web/commit/0b7ac9609470218d4ed6229c7a624ed5f3984aa8))
* **slider:** Remove `width: 100%` to account for margin around slider track. ([16c563e](https://github.com/material-components/material-components-web/commit/16c563ef71555da9f02707b9f00abb4c5fc3df79))
* **snackbar:** remove use of [@at-root](https://github.com/at-root) ([98d0296](https://github.com/material-components/material-components-web/commit/98d02962b5f1edd9f541f19198dc3d1992720ea3))
* **snackbar:** Update a11y structure to announce label and actions ([40d8e47](https://github.com/material-components/material-components-web/commit/40d8e472600544fcfe8b8b9d91c62cc014995296))
* **snackbar:** Update a11y structure to announce snackbar correctly ([a3176c8](https://github.com/material-components/material-components-web/commit/a3176c8eaada1b6c61f0d678a193a26a25a773c5))
* **switch:** Adjust track width to 36px, align thumb and track. ([d716225](https://github.com/material-components/material-components-web/commit/d71622574c25840013a517749df357f7f93bc4d6))
* **switch:** always set track to transparent border ([9a169f4](https://github.com/material-components/material-components-web/commit/9a169f4b158a3148126ba38bcdfa9d163434d9bb))
* **switch:** use CSS custom properties for theming ([d6315ef](https://github.com/material-components/material-components-web/commit/d6315efe26e7baf45fd88244efbb24c612a95cb4))
* **textfield:** affix outlined alignment Safari bug ([ad4df58](https://github.com/material-components/material-components-web/commit/ad4df58c1e9ba7a893780dc5fe7886179a0361f9))
* **textfield:** autofill filled label not floating correctly ([abcdbcf](https://github.com/material-components/material-components-web/commit/abcdbcfebdcb8a8abe386abb00cd33230e8ef7a1))
* **textfield:** clean up input padding ([8639c26](https://github.com/material-components/material-components-web/commit/8639c269010b77b17f1a5052d57abcb5f7d2892a))
* **textfield:** error when notching outline with no label ([b0ed593](https://github.com/material-components/material-components-web/commit/b0ed593ccbffe7dfec51c94527cbc17000385407)), closes [#6452](https://github.com/material-components/material-components-web/issues/6452)
* **textfield:** helper text a11y interactions ([8a39352](https://github.com/material-components/material-components-web/commit/8a39352c8a787663eecb42b46939b069729fc82c))
* **textfield:** IE11 label overlapping placeholder ([781434a](https://github.com/material-components/material-components-web/commit/781434a92f4dddc9b2d39853e1f5792e89e7b45b))
* **textfield:** move notched outline/label before input ([9e2f6c4](https://github.com/material-components/material-components-web/commit/9e2f6c45016b1ccc665a271dc59134d32916123d))
* **textfield:** remove absolute positioning from icons ([1e13d1d](https://github.com/material-components/material-components-web/commit/1e13d1d5a68632f1b0b5a9134f657d59104969f4))
* **textfield:** remove Chrome icons for date types ([4951e76](https://github.com/material-components/material-components-web/commit/4951e7651ffbd99b382948e48306a23d2fd74fb1))
* **textfield:** remove deprecated dense variant in favor of density ([776291e](https://github.com/material-components/material-components-web/commit/776291ef03205e4063b4040eb66f9648e16b4af6)), closes [#4142](https://github.com/material-components/material-components-web/issues/4142)
* **textfield:** remove fullwidth variant ([69a35e8](https://github.com/material-components/material-components-web/commit/69a35e80ceadb5ef9ffae87345eefbd80b383f51))
* **theme:** add validation to host-aware to ensure proper usage ([defa599](https://github.com/material-components/material-components-web/commit/defa599a8bc17557602bbf35a8a5c760fbb053f1))
* **theme:** do not throw error when setting custom props and null ([85a5272](https://github.com/material-components/material-components-web/commit/85a5272dfeb7ad100598d480dec76b60679485f5))
* **theme:** property() mixin not working with theme key strings ([c1fec42](https://github.com/material-components/material-components-web/commit/c1fec424677fcb77dfc966ff1805d601a103fa30)), closes [#6158](https://github.com/material-components/material-components-web/issues/6158)
* server-side rendering errors in linear progress and slider ([7d0b983](https://github.com/material-components/material-components-web/commit/7d0b983a902deee6941d61906aa5a880628db4e9))
* update circular-progress import paths ([10e8c19](https://github.com/material-components/material-components-web/commit/10e8c191a0c4c9eb1703f25b66668c640f5344a6))
* **theme:** Remove duplicate [@forward](https://github.com/forward) in theme index module ([b2e80a5](https://github.com/material-components/material-components-web/commit/b2e80a5d91fc8552f22614e95f7670225f6b4248))
* **theme:** variable overrides not working with @use/with ([2d72f36](https://github.com/material-components/material-components-web/commit/2d72f365991f17e21b34be523aef3fa32b2b2fdb))
* **typography:** change $styles font-size to a Number ([6d1ea97](https://github.com/material-components/material-components-web/commit/6d1ea9761de927c1653c621444e00172f74d76c7))
* update types and deprecate old ponyfill ([af332d5](https://github.com/material-components/material-components-web/commit/af332d5bef3f826fa7a6078492d54f0444a3fee4))


### Code Refactoring

* **circular-progress:** move all sizing params from CSS to markup ([58ce529](https://github.com/material-components/material-components-web/commit/58ce529ccc29d3b172c1e774c70424eb54aac5dc))
* **linear-progress:** Restructure buffer DOM to allow translucent buffer ([98b8434](https://github.com/material-components/material-components-web/commit/98b843417ef6c0a10460532a37df389b0c7e936f))
* **linear-progress:** Restructure buffer DOM to allow translucent buffer ([9372e49](https://github.com/material-components/material-components-web/commit/9372e493954585c939f341486d0361efb87da806))
* **radio:** forward only theme mixins from MDC radio index module ([72258f8](https://github.com/material-components/material-components-web/commit/72258f89870242ba62c0ce25db680fdecb9640bc))
* **select:** consolidate state theming to single mixins ([e8bf5b2](https://github.com/material-components/material-components-web/commit/e8bf5b2ac6c89778fa38791979e4be941e28db1c))
* **theme:** move CSS declarations to utility mixin ([96a6405](https://github.com/material-components/material-components-web/commit/96a6405345ea1e1a7083bd08f8610384231d6607))


### Documentation

* **select:** update markup to include new selectedText container ([47b500a](https://github.com/material-components/material-components-web/commit/47b500a6cf888458b371734698b366fe2b4c3230))


### Features

* **animation:** Add a linear animation method ([c250ec5](https://github.com/material-components/material-components-web/commit/c250ec52ad1ce21943f4c7f521087bf2e647da00))
* **animation:** Create animation frame helper class ([e34e411](https://github.com/material-components/material-components-web/commit/e34e411b1835efa3f275921ca8c9d33d6df92bec))
* **banner:** Add banner component into MDC catalog ([aa3a3e5](https://github.com/material-components/material-components-web/commit/aa3a3e5a43b1e012e948c5f8f8b7c133d5ba6b0d))
* **banner:** Add fixed banner variant ([fd8af3d](https://github.com/material-components/material-components-web/commit/fd8af3d435e12d28cfc393762c325cc2d1b03f13))
* **banner:** Add fixed-width mixin. ([c61db90](https://github.com/material-components/material-components-web/commit/c61db90a5d3abb032cfa5940b0710770ba19c4a1))
* **banner:** Defining a z-index mixin. ([ccc64ee](https://github.com/material-components/material-components-web/commit/ccc64eea393339f38e54054bbd8865f9f78618bf))
* **banner:** Expose layout method. ([4794b25](https://github.com/material-components/material-components-web/commit/4794b25da9af4bfa7d48f5a6fc172efc45cfd999))
* **banner:** Update banner to be mobile friendly. ([dbc449b](https://github.com/material-components/material-components-web/commit/dbc449b0972362ba3c7fc04e26900d0c3e3d8b66))
* **banner:** Update close() to use CloseReason and provide programmatic way of closing ([ff88df6](https://github.com/material-components/material-components-web/commit/ff88df637a944de239b8860b5f0c38454cc6cc1b))
* **banner:** Update content to be leading as default and add support for optional centered. ([8d5b84f](https://github.com/material-components/material-components-web/commit/8d5b84fb260506c69fa93246aee538db89db8fc3))
* **button:** Expand outlined touch target to include side borders ([ce6cb70](https://github.com/material-components/material-components-web/commit/ce6cb7024d1da3b0e4fb5e2c67ba269dbb3098ec))
* **card:** Add transparent outline to elevated card, so card boundary is shown on high-contrast mode. ([c71ebfa](https://github.com/material-components/material-components-web/commit/c71ebfa02b7f3203317255e377b5cb165a0cfeac))
* **checkbox:** Add CSS custom properties to MDC checkbox theme mixins ([66669e3](https://github.com/material-components/material-components-web/commit/66669e3b668d0579ac71d6896240fd14d6a4322a))
* **checkbox:** Add support for checkbox CSS-only `indeterminate` checkbox ([b273afa](https://github.com/material-components/material-components-web/commit/b273afa93441e6d0375f7df33d5b69d8a7e1cfa8))
* **checkbox:** Added theme configuration support to checkbox ([58eaa9f](https://github.com/material-components/material-components-web/commit/58eaa9f027bb7ced126d3fe97cab5a0f627eb098))
* **checkbox:** Added theme configuration support to checkbox ([fbf73c2](https://github.com/material-components/material-components-web/commit/fbf73c2a6633298d6d65cdfcb8f76151e0e9c600))
* **checkbox:** Separate static styles from checkbox styles ([150f427](https://github.com/material-components/material-components-web/commit/150f427a01a7b20783d287cebe40bb4d93a24ce3))
* **checkbox:** Separate static styles from checkbox styles ([ff87000](https://github.com/material-components/material-components-web/commit/ff870005acef3cb26a6b4f378c012ffdb1061194))
* **checkbox:** Separate static styles from checkbox styles ([4f55400](https://github.com/material-components/material-components-web/commit/4f55400bbde3d85cacf379b7f7a80dd439952b3f))
* **chips:** Add chips styling ([1db5c9f](https://github.com/material-components/material-components-web/commit/1db5c9fc842292715f8b4603ce0b979066f1c639))
* **chips:** Add focus{in|out} handlers ([10af6cf](https://github.com/material-components/material-components-web/commit/10af6cf39cb2ae0a7deb9a951960f115f6ecdace))
* **chips:** Add keyCode support ([82fa986](https://github.com/material-components/material-components-web/commit/82fa986b95be4c16271df50effda1046d015d35c))
* **chips:** Add trailing action feature targeting test ([bec0659](https://github.com/material-components/material-components-web/commit/bec0659206aee793e6970d59c73f7969ab540b69))
* **chips:** Create trailing action business logic ([9ebee4c](https://github.com/material-components/material-components-web/commit/9ebee4ceb998e5fa651d4f147e5e39d43600db6e))
* **chips:** Expose trailing action chip files ([6b48781](https://github.com/material-components/material-components-web/commit/6b48781bf97d3b08b8f35b9eacde2b87748ae2e1))
* **chips:** Restructure trailing action mixins ([05f5e15](https://github.com/material-components/material-components-web/commit/05f5e1583b81bc00dbcd2ae21ee0acc43b3e13b4))
* **circular-progress:** Add foundation methods to get isDeterminate and progress value ([7d8f9c8](https://github.com/material-components/material-components-web/commit/7d8f9c8d73f16c01ed4a941ab9510377a0aae219))
* **circular-progress:** Add Sass styles and tests ([bd33cb5](https://github.com/material-components/material-components-web/commit/bd33cb56bdab7139052aeedbeec363f17b4dfc40))
* **circular-progress:** Add TS for foundation, adapter, component with tests ([548b1d4](https://github.com/material-components/material-components-web/commit/548b1d4057f21e066a4c494a57a0c068c23e18cd))
* **circular-progress:** support track color ([e27c580](https://github.com/material-components/material-components-web/commit/e27c5802fed20af29976f1f84bc39f9b59999ab5))
* **data-table:** Add base styles to support pagination. ([927fa90](https://github.com/material-components/material-components-web/commit/927fa902c3297a5a7cc9436e82cb81f3aabe1b4b))
* **data-table:** Add foundation methods to support loading state. ([e75deb8](https://github.com/material-components/material-components-web/commit/e75deb8540fa70236087d335c9cd6280bd643285))
* **data-table:** Add progress indicator / loading feature to data table ([4497ace](https://github.com/material-components/material-components-web/commit/4497acef8fd636b6ceef3cf055f664c92465e965))
* **data-table:** Add support for applying row checkbox density ([291b355](https://github.com/material-components/material-components-web/commit/291b3553d20c5dda9c5a80e0dda0705b524f41a3))
* **data-table:** Added styles for table in loading state ([35a32aa](https://github.com/material-components/material-components-web/commit/35a32aaeac17e290e2e9f9a1310c5a44a08f624a))
* **data-table:** Added styles to support column sorting. ([17b9699](https://github.com/material-components/material-components-web/commit/17b9699c4454a107043e5a1f9874a091089dd112))
* **data-table:** Added support for sticky header row in data table ([599b8c3](https://github.com/material-components/material-components-web/commit/599b8c3191a888e3debd94ad4934f741c5fb6e23))
* **data-table:** Foundation changes to support column sorting ([6ee0355](https://github.com/material-components/material-components-web/commit/6ee03557260d0a23296e36cba5aaa76fe0cf96a6))
* **data-table:** Set progress indicator styles based on table body height ([c026422](https://github.com/material-components/material-components-web/commit/c0264227393df8eb9259a2b24c23b31fe0ca84f3))
* **dom:** Add keyboard support ([5f24faa](https://github.com/material-components/material-components-web/commit/5f24faacb1ef8996ae81f3a1c1e43910ba67b024))
* **drawer:** expose --mdc-theme-surface custom prop ([319bf66](https://github.com/material-components/material-components-web/commit/319bf66dead88f67dba64f9d50a6f3f0d82aad72)), closes [#6466](https://github.com/material-components/material-components-web/issues/6466)
* **elevation:** add custom props for overlay ([4c354a3](https://github.com/material-components/material-components-web/commit/4c354a36d012e5d241f27380db1d0d9e70769c27))
* **fab:** Add focus outline mixins to MDC Fab ([0f60323](https://github.com/material-components/material-components-web/commit/0f60323a8365901c4ff6fd956161b99d8f413927))
* **fab:** Add focus outline mixins to MDC Fab ([7a9afaf](https://github.com/material-components/material-components-web/commit/7a9afaf4b503bc0d1d135b8d88edd4a7ed02e52e))
* **fab:** support css custom props for extended-padding ([01db890](https://github.com/material-components/material-components-web/commit/01db890532f796ea3e66a9c7d76893bef8689d6f))
* **form-field:** Add support for space-between ([e84b9c8](https://github.com/material-components/material-components-web/commit/e84b9c816d32da6dec058d92fc21dc5ac8fec787)), closes [#5747](https://github.com/material-components/material-components-web/issues/5747)
* **formfield:** add nowrap class/prop to MDC/MWC ([c4b4bba](https://github.com/material-components/material-components-web/commit/c4b4bba9659bf15207e79b1f63fcc9946404d9c7))
* **iconbutton:** Add icon button variant which supports toggling aria label. ([f838c6e](https://github.com/material-components/material-components-web/commit/f838c6e55672268de4e6e3b31b154d4f9050242f))
* **linear-progress:** Add foundation methods to fetch progress and determinate state. ([4dc45af](https://github.com/material-components/material-components-web/commit/4dc45af6c4bc81f5734a24c160046d283c1e9a6d))
* **list:** Add transparent-border for aria-activedescendant usage ([8388a9b](https://github.com/material-components/material-components-web/commit/8388a9bf6f4db77656adcdd604125eb205694b10))
* **menu:** Add mixin to flatten menu top when opened-below anchor ([1e17c49](https://github.com/material-components/material-components-web/commit/1e17c49b360fd0e01c9a74b92978031534003b5b))
* **menu-surface:** Add transition to height for menu resizing animation. ([1e7cb61](https://github.com/material-components/material-components-web/commit/1e7cb61989c95f9b86de3b1f6edb1773c12dfc97))
* **ripple:** Add will-change opt-out param ([e590b37](https://github.com/material-components/material-components-web/commit/e590b376bf20bde50e6f6b62339c0bac2703ccf0))
* **ripple:** Reorganize ripple opacities ([008c4d3](https://github.com/material-components/material-components-web/commit/008c4d3191f9c2a76732688504d2299420734cdd))
* **segmented-button:** add adapters and foundations ([#6165](https://github.com/material-components/material-components-web/issues/6165)) ([6ed717d](https://github.com/material-components/material-components-web/commit/6ed717dddf5f62dd5bfc621388ae07471775612f))
* **segmented-button:** Add component outlines ([#6222](https://github.com/material-components/material-components-web/issues/6222)) ([a0f1202](https://github.com/material-components/material-components-web/commit/a0f1202dc5cd67207877167558742d0b18bf0e32))
* **segmented-button:** Add initial Sass styles ([#6141](https://github.com/material-components/material-components-web/issues/6141)) ([7555383](https://github.com/material-components/material-components-web/commit/75553837cce5cb9d52d5561f5729d110e71af401))
* **segmented-button:** Add MDC segmented button into material-components-web ([596e984](https://github.com/material-components/material-components-web/commit/596e984242fdef685dae49e2c84305e55c9ea724))
* **segmented-button:** Add new package for segmented button ([#6073](https://github.com/material-components/material-components-web/issues/6073)) ([d561860](https://github.com/material-components/material-components-web/commit/d5618602a8ef45a1fdf753c3598afc5e1cadc95b))
* **segmented-button:** Add ripple and touch-target support ([#6277](https://github.com/material-components/material-components-web/issues/6277)) ([e3b7462](https://github.com/material-components/material-components-web/commit/e3b746208db04f3922fabba77986f9f02f422d75))
* **segmented-button:** Add select validations for singleSelect ([#6381](https://github.com/material-components/material-components-web/issues/6381)) ([2e8c3dd](https://github.com/material-components/material-components-web/commit/2e8c3dd2e0622957a373286f14720de36afb5ba4))
* **segmented-button:** Added foundation business logic ([#6198](https://github.com/material-components/material-components-web/issues/6198)) ([e6e2301](https://github.com/material-components/material-components-web/commit/e6e23019d567802c13d0bd6559a35291c48abc91))
* **segmented-button:** Implement components ([#6223](https://github.com/material-components/material-components-web/issues/6223)) ([ac405ea](https://github.com/material-components/material-components-web/commit/ac405eae1b80f719a80dc4fec663b763e73cdf5d))
* **select:** move selectedText into its own text node ([0bc41a9](https://github.com/material-components/material-components-web/commit/0bc41a9c75392352e8a31eb9d46f1a1457ffe732))
* **select:** support hidden input ([fda053e](https://github.com/material-components/material-components-web/commit/fda053eb848395ebfa9266e4535013e1a3be8486)), closes [#5428](https://github.com/material-components/material-components-web/issues/5428)
* **select:** truncate with ellipses by default ([83d83f1](https://github.com/material-components/material-components-web/commit/83d83f131118073943a6a45923b37b3a961bd894))
* **slider:** Add hooks into dragStart/dragEnd events to slider foundation. ([85a1fa9](https://github.com/material-components/material-components-web/commit/85a1fa9eab3010f2c41f5f65ca80a7f34bc46b2c))
* **slider:** Add M2 version of slider. ([8158544](https://github.com/material-components/material-components-web/commit/8158544774c50ba21b114f6fe24786816ba4c4fd))
* **slider:** Add support for customizing tick marks opacity, and document tick mark DOM structure for rendering tick marks before component initialization. ([238216f](https://github.com/material-components/material-components-web/commit/238216fc466a1b0dd5f4f05f10a083949e1b99d9))
* **slider:** Add support for setting `aria-valuetext` on slider thumbs. ([fd608ff](https://github.com/material-components/material-components-web/commit/fd608ff66bbb2f765fa1c092427fba9e61a074f3))
* **slider:** Add support for styling initial thumb/track before component JS initialization. ([08ca4d0](https://github.com/material-components/material-components-web/commit/08ca4d0ec5f359bc3a20bd2a302fa6b733b5e135))
* **slider:** Add support for theming disabled colors. ([d52b165](https://github.com/material-components/material-components-web/commit/d52b165b5869309705068ab58803cef426f1e590))
* **snackbar:** Update stacked layout to add an additional 8px on the label's right padding ([521afaf](https://github.com/material-components/material-components-web/commit/521afaf6e3086285b040c06fc3dbc92f20dc9b06))
* **textfield:** add autovalidation customization ([2ab716c](https://github.com/material-components/material-components-web/commit/2ab716cbda14aca5a8b62cdae3c71c2d629b16f7))
* **textfield:** add filled class variant ([b70bc60](https://github.com/material-components/material-components-web/commit/b70bc601ef570dab4598ae6f3ca51bbf884fac96))
* **textfield:** add forced LTR input ([490fbdc](https://github.com/material-components/material-components-web/commit/490fbdc092c5c59d63f83407b83b37fb524ed0e5))
* **textfield:** add prefix and suffix ([6601d24](https://github.com/material-components/material-components-web/commit/6601d24afdc3a3d0bd2a9b3fcca68c35c9415ec1)), closes [#1892](https://github.com/material-components/material-components-web/issues/1892)
* **textfield:** add specific label-floating class ([a88c8e4](https://github.com/material-components/material-components-web/commit/a88c8e4dc873ae74a3afbae0dc8635dfaa03e67b))
* **textfield:** Create float transition mixin ([ca61b65](https://github.com/material-components/material-components-web/commit/ca61b656fababdf25adaa307963d4f37e6d413ec))
* **textfield:** Limit notched outline max-width ([0ab62a6](https://github.com/material-components/material-components-web/commit/0ab62a65b17192a94102231ca63f54adc39675ae))
* **textfield:** Using touch-target-mixins to increase the touch target size on trailing icons on text fields. ([174c0be](https://github.com/material-components/material-components-web/commit/174c0becfc802e4366e4814758f28cb1ecf2c75a))
* **theme:** add calc() string replacement to property mixin ([79414bf](https://github.com/material-components/material-components-web/commit/79414bf9f93aae12bc394fd518b6cb401e5ddb26))
* **theme:** add deep-get utility ([fb5a4cd](https://github.com/material-components/material-components-web/commit/fb5a4cdeb79de0412a9e0573db1dacb28e8186f3))
* **theme:** add shadow-dom host-aware helpers ([0a2e7fc](https://github.com/material-components/material-components-web/commit/0a2e7fc8976e6481c9225609d7ff5354362472fa)), closes [#6295](https://github.com/material-components/material-components-web/issues/6295)
* **theme:** add state helper functions ([0809012](https://github.com/material-components/material-components-web/commit/08090126b4eff43f82188ee1dae5c8deda33d2ef))
* **tooltip:** Add 500ms delay before showing tooltip. ([a1c6559](https://github.com/material-components/material-components-web/commit/a1c65593d3c1f594a35561569357bb657dd50408))
* **tooltip:** add position options for y-axis ([91ab1c6](https://github.com/material-components/material-components-web/commit/91ab1c62a4e00ae844d444882582d2052aaf228a))
* **tooltip:** Add tooltip component into MDC catalog. ([b9394dc](https://github.com/material-components/material-components-web/commit/b9394dc5da7db3b60497cf81aa5f26a5758d9b37))
* **tooltip:** Adding option to render tooltips as hidden from a screenreader. This should only be utilized in situations where the tooltip label hold information duplicated from an accessible name on the anchor element (e.g. tooltip label is the same as the aria-label on an icon button) ([546277d](https://github.com/material-components/material-components-web/commit/546277d323c484ddf181afffed153f4f17c9f4a7))
* **tooltip:** Adding transparent border around tooltip so it is distinguished from the background in high contrast mode. ([02e372c](https://github.com/material-components/material-components-web/commit/02e372c5f02afaf66e06e733a08c6c704c16843c))
* **tooltip:** Adjusting tooltip z-index so tooltip appears above other content on the page. ([c285200](https://github.com/material-components/material-components-web/commit/c2852000d97ed49c5f8ab82b5911deb1c87a9025))
* **tooltip:** Adjustments to tooltip structure. ([19bea2a](https://github.com/material-components/material-components-web/commit/19bea2ad3d6c6aa36e0d033af7adebd010dcd4fa))
* **tooltip:** Center align tooltip label text. ([5dac1f6](https://github.com/material-components/material-components-web/commit/5dac1f624606fc92682a4266ffd68bea21e57069))
* **tooltip:** Creating method to clear any in-progress animations before starting new ones. ([61f1a8d](https://github.com/material-components/material-components-web/commit/61f1a8d8599f6dfaa7fc6c64d661010df47839b7))
* **tooltip:** Defining a z-index mixin. ([f4848eb](https://github.com/material-components/material-components-web/commit/f4848eb3b57d81fd4fed1396cdc22a83344ccd72))
* **tooltip:** Foundation will now send a notification when the tooltip has been hidden. Methods added into the adapter to allow for this functionality. ([9274f85](https://github.com/material-components/material-components-web/commit/9274f8504a905e04f24fba8f6a0e246d7ae3a638))
* **typography:** add container baseline mixins for flexbox ([69edc6e](https://github.com/material-components/material-components-web/commit/69edc6e2899636cfccb117376bb64dc0a267c588))
* add custom property support for select, textfield, and notched outline ([ec23858](https://github.com/material-components/material-components-web/commit/ec2385881f93b75641db661038aae439b4c217d1))


### Reverts

* "Include tooltip directory for future copybara syncs." ([#6185](https://github.com/material-components/material-components-web/issues/6185)) ([b0c456d](https://github.com/material-components/material-components-web/commit/b0c456d330f31bc890c54d114de1d56ac23fee9f))
* feat(checkbox): Added theme configuration support to checkbox ([cf80012](https://github.com/material-components/material-components-web/commit/cf800124fdaeea04b3fd45f8718a2980dd01a0df))


### BREAKING CHANGES

* **banner:** Added wrapper div to text/graphic for mobile friendly view, see README.md for more info.
* **typography:** `typography.baseline-top()` and `typography.baseline-bottom()` are now private. Use `typography.baseline()` for containers and `typography.text-baseline()` for text with $top and $bottom params.
* **banner:** Dom structure change, see README.md
* **select:** selected text node now needs to be wrapped in an outer `mdc-select__selected-text-container` span; see README for updated markup
* **datatable:** Header checkboxes will now be unchecked if layout is called when there are no rows.
* **banner:** Updated adapter to use CloseReason types
* **checkbox:** Renamed mixin `ripple()` => `ripple-styles()` in MDC checkbox
* **checkbox:** Renamed mixin `ripple()` => `ripple-styles()` in MDC checkbox
* **checkbox:** Renamed mixin `ripple()` => `ripple-styles()` in MDC checkbox
* **theme:** $ie-fallback variable has been moved and renamed to $enable-fallback-declarations in `@material/theme/css`
* **select:** select theming mixins which were previously "stateful" (e.g. `hover-label-color()`) are combined into the non-stateful mixin (e.g. `label-color()`). The default state of the mixin can be set as normal, or a Map of states can be provided to optionally set one or more states of the mixin (e.g. `label-color((hover: blue))`). See the `@material/theme/state` package for more details.
* **textfield:** adapter method `getAttr` added on helper text subcomponent; adapter method `setInputAttr` and `removeInputAttr` added on main component
* **textfield:** the notched outline and label should now appear before the input in the text field's DOM structure for a11y navigation
* **slider:** This upgrades the old slider to a new version of slider that adheres to the M2 design spec. Changes include:
- M2 design (primary instead of secondary color used, larger active track and thumb, improved tick marks UI)
- Range (two-thumb slider) slider
- Pointer events support (for browsers that support pointer events)
- High contrast mode support
- Improved accessibility (follows WAI-ARIA spec for slider)
* **circular-progress:** DOM Changed. See README for updated markup. `$default-size`, `$stroke-width`, and `$container-side-length` variables removed.
* **snackbar:** The right padding of the label for the `mdc-snackbar--stacked` variant will now have an additional 8px
* **data-table:** New adapter method replacing `getTableBodyHeight()` => `getTableHeaderHeight()` and changed return types of this method.
* **textfield:** Default textfields must now specify mdc-text-field--filled. Disabled outlined textfields no longer have a shaded background. Height mixin no longer specifies a baseline override, use typography's baseline-top mixin.
* **textfield:** mdc-text-field--dense and associated mixins/variables have been removed. Use the density() mixin instead.
* **textfield:** removed the following variables: `$input-padding`, `$input-padding-top`, `$input-padding-bottom`, `$outlined-input-padding-top`, `$outlined-input-padding-bottom`, `$input-border-bottom`
* **linear-progress:** DOM for linear progress buffer changed. MDCLinearProgressAdapter method `getBuffer`, `getPrimaryBar`, `setStyle` removed. MDCLinearProgressAdapter method `setBufferBarStyle`, `setPrimaryBarStyle` added.
* **linear-progress:** DOM for linear progress buffer changed. MDCLinearProgressAdapter method `getBuffer`, `getPrimaryBar`, `setStyle` removed. MDCLinearProgressAdapter method `setBufferBarStyle`, `setPrimaryBarStyle` added.
* **radio:** MDC radio _index Sass module will only export theme mixins


# [7.0.0](https://github.com/material-components/material-components-web/compare/v6.0.0...v7.0.0) (2020-06-23)


### Bug Fixes

* **base:** Add EDITING and EDITABLE states to the chip. ([cf3b664](https://github.com/material-components/material-components-web/commit/cf3b664ab1f12b17ea827ad1e2870977b9836e5b))
* **base:** Causes internal text in a chip to not overflow and instead be truncated by ellipsis. ([b83d720](https://github.com/material-components/material-components-web/commit/b83d720ee41acb13e3e6ca69431f718c7887c1de))
* **base:** Make the root property public ([51d4535](https://github.com/material-components/material-components-web/commit/51d4535fe39a2448fbba1ec995bb9980357545fa))
* **base:** Remove "foundation_" from MDCComponent ([8c6d7e0](https://github.com/material-components/material-components-web/commit/8c6d7e0766d8958a8d4ffea35acee9d6841dafd4))
* **base:** Remove trailing underscore "adapter_" ([5b5f62f](https://github.com/material-components/material-components-web/commit/5b5f62f9397100a9dd97c257b930e686837c4ceb))
* **base:** Remove trailing underscore from superclass properties ([62b5f37](https://github.com/material-components/material-components-web/commit/62b5f37db092df4441abdf5e4ee0b32dceee8c7c))
* **button:** Correct misspelling of overflow ([29debfe](https://github.com/material-components/material-components-web/commit/29debfea704941e80f1d337880b4a18142c11561))
* **button:** Correct misspelling of overflow ([99d2fc9](https://github.com/material-components/material-components-web/commit/99d2fc961be8cd7e8316b40dcf9754a536d29991))
* **button:** Correct misspelling of overflow ([28d32f8](https://github.com/material-components/material-components-web/commit/28d32f8e0d923099221fe7d3853177243e0fd243))
* **button:** Move theme-baseline() into base Sass. ([080965f](https://github.com/material-components/material-components-web/commit/080965f3952b32105419558c0167873554234dd0))
* **button:** Remove misspelled label-overlow-ellipsis ([e59906a](https://github.com/material-components/material-components-web/commit/e59906a57e91604f918c8ccd350f93a9a802e412))
* **checkbox:** Use secondary and on-secondary as default colors ([b95172e](https://github.com/material-components/material-components-web/commit/b95172e69613c0defe82191b86ed1c1999b74400)), closes [#5730](https://github.com/material-components/material-components-web/issues/5730)
* **checkbox:** Use superclass properties without trailing underscores ([2e218db](https://github.com/material-components/material-components-web/commit/2e218dbf8810548de27b683ed6e25d5fb1cbbc23))
* **chips:** Handle IE/Edge specific key names in keyboard navigation logic ([3657f88](https://github.com/material-components/material-components-web/commit/3657f886327182c26f1d1555b2ac67c2128140b5))
* **chips:** Use superclass properties without trailing underscores ([cf7747e](https://github.com/material-components/material-components-web/commit/cf7747ef72efb4affe2dd920a6641f730f3bcfcd))
* **circular-progress:** Add .npmignore file to ignore typescript files when publishing ([#5801](https://github.com/material-components/material-components-web/issues/5801)) ([f172b0f](https://github.com/material-components/material-components-web/commit/f172b0f90a91d8d3d700763d1496bb7b9c1a8d51)), closes [#5800](https://github.com/material-components/material-components-web/issues/5800)
* **circular-progress:** fix determinate transition typo & 4 color keyframes ([a301636](https://github.com/material-components/material-components-web/commit/a3016368df53b1c7967d7d146a9ea53a24442fa9))
* **circular-progress:** Fix naming in package.json and add to jsBundleFactory ([86f7cad](https://github.com/material-components/material-components-web/commit/86f7cad8330dbd600e478610eefd8dd92eb3d8c7))
* **circular-progress:** Force LTR layout ([6a40ef2](https://github.com/material-components/material-components-web/commit/6a40ef217f597138ee2920d2160364649dbf5620))
* **circular-progress:** Switch mixins import to `[@use](https://github.com/use)` ([098ae32](https://github.com/material-components/material-components-web/commit/098ae3285223af2532659dec233537a55c1183f5))
* **circularprogress:** Use superclass properties without trailing underscores ([da05f66](https://github.com/material-components/material-components-web/commit/da05f66e10f8efe5c425cec7f140ed399b11bd3f))
* **data-table:** Fix pagination box height ([eb28b6e](https://github.com/material-components/material-components-web/commit/eb28b6ecc65a9979ef0959eac5dbfde5b4d3b2dc))
* **data-table:** Fixed alignment of numeric header cell with sort button. ([2139200](https://github.com/material-components/material-components-web/commit/2139200b3ed2b57d74a02701bfef23a983d19cdf))
* **data-table:** Fixed default feature targeting query params of sort mixins ([e33c49e](https://github.com/material-components/material-components-web/commit/e33c49eaf9c0dbc601f3610af6358cbf2833229c))
* **data-table:** Fixed horizontal scrolling issue with pagination controls ([b065a4d](https://github.com/material-components/material-components-web/commit/b065a4d2bd351b86277f5a2f4d512fb6c243c7ce))
* **data-table:** Hover styles for sortable header cell ([d580805](https://github.com/material-components/material-components-web/commit/d5808057fcdf00364731e0896ef7031ac605cf55))
* **data-table:** Make row checkbox table cell fixed even when table is wide ([a6ac8f6](https://github.com/material-components/material-components-web/commit/a6ac8f629b45e46d598b4b531fed8300fb5a8eef))
* **data-table:** not inverting text alignment in rtl ([bd8d1aa](https://github.com/material-components/material-components-web/commit/bd8d1aafab5c6da614135702f5814447de5ea448))
* **data-table:** Removed overflow-x from root element ([4ebce8d](https://github.com/material-components/material-components-web/commit/4ebce8d787db92afb4c1f9d2a10268a62d188d43))
* **data-table:** Reverse the arrow direction icon for column sorting ([a7c827f](https://github.com/material-components/material-components-web/commit/a7c827f17ce9be631484676ccb6b5f18604803ae))
* **data-table:** unable to redefine colors in class-based themi… ([#5751](https://github.com/material-components/material-components-web/issues/5751)) ([4d48051](https://github.com/material-components/material-components-web/commit/4d48051c1099f48e867cf08f070138a7abc719fc))
* **data-table:** unable to redefine colors in class-based theming ([4b45b66](https://github.com/material-components/material-components-web/commit/4b45b662057edd8819f1a515db88e1c12254cc30))
* **datatable:** Use superclass properties without trailing underscores ([862d0d7](https://github.com/material-components/material-components-web/commit/862d0d7bce4fc30a1947d1ff7cb7286c106dd9e5))
* **dialog:** Change scale(1) to `transform:none` ([9ea5207](https://github.com/material-components/material-components-web/commit/9ea52070f4f9693266a20311cce15700e84696c3))
* **dialog:** Only equalize paddings for scrollable dialogs with titles, since there is no added divider between title/content in this case. ([8135cc0](https://github.com/material-components/material-components-web/commit/8135cc085a5cd548cf8c8fba4bb43a21bcd3fd46))
* **dialog:** Use superclass properties without trailing underscores ([b4e2fe9](https://github.com/material-components/material-components-web/commit/b4e2fe9f4bf690968d0ac47da0ca4a64ee8d7a88))
* **dom:** Clear out announcer regions on document click ([c67667e](https://github.com/material-components/material-components-web/commit/c67667e8e213ed4686889cb3962685444bd885c6))
* **drawer:** Use superclass properties without trailing underscores ([a66493c](https://github.com/material-components/material-components-web/commit/a66493cd8e9717ce32218fb877ca2258ea6ee880))
* **floating-label:** Use superclass properties without trailing underscores ([5cea261](https://github.com/material-components/material-components-web/commit/5cea2610f2f46bbe193683668044116d78b7e2d6))
* **form-field:** Use superclass properties without trailing underscores ([7fd792b](https://github.com/material-components/material-components-web/commit/7fd792bb9841501ecbc35b4024a00e07216fb95b))
* **icon-button:** Use superclass properties without trailing underscores ([740860e](https://github.com/material-components/material-components-web/commit/740860e789992163537cc7138d6c21672adb79d0))
* **line-ripple:** Use superclass properties without trailing underscores ([a4aae3d](https://github.com/material-components/material-components-web/commit/a4aae3d3710ba5eb86f27dee230064dfccf2e73f))
* **linear-progress:** Temporary rollback of [#5656](https://github.com/material-components/material-components-web/issues/5656) while updating downstream dependencies ([9cf5e98](https://github.com/material-components/material-components-web/commit/9cf5e9842475e50046462aa1c6d18e326abaee17))
* **linear-progress:** Use superclass properties without trailing underscores ([8e17857](https://github.com/material-components/material-components-web/commit/8e17857d0a8d301f54fac64cc83804928ec1ff83))
* **list:** No longer emits action event when disabled item selected ([f352d03](https://github.com/material-components/material-components-web/commit/f352d03f4ed48c5019a0a3e10ef12689a5ab5619)), closes [#5571](https://github.com/material-components/material-components-web/issues/5571)
* **list:** Preserve aspect ratio of the original image when using it as the icon or avatar for a list. ([be4a19f](https://github.com/material-components/material-components-web/commit/be4a19f9f0668e4fc303d2e60e81473ac11d68be))
* **list:** Remove obsolete non-interactive class & :not selectors ([2553e86](https://github.com/material-components/material-components-web/commit/2553e86fee2753ec59f1fbc91764bf110ad9d3aa))
* **list:** Use superclass properties without trailing underscores ([4847dd7](https://github.com/material-components/material-components-web/commit/4847dd7645adf463ea947fc2afb346df648a1ffc))
* **menu:** Do not set selectedIndex for menu items that have a negative recomputedIndex. ([ef3a095](https://github.com/material-components/material-components-web/commit/ef3a095336a205fa9473a8c6e4940c3f9cccf5ea))
* **menu:** Use superclass properties without trailing underscores ([0008c8a](https://github.com/material-components/material-components-web/commit/0008c8a91a4da2c0c95fe092395cc575cbf23769))
* **menu-surface:** Use margin_to_edge as a viewport margin in calculations for autopositioning. ([4b04cdb](https://github.com/material-components/material-components-web/commit/4b04cdb0fc4da4831340b01292c118b120c1fcb1))
* **menu-surface:** Use superclass properties without trailing underscores ([62abbc8](https://github.com/material-components/material-components-web/commit/62abbc8d762c6c903d4a13817a0b71555764e0df))
* **menusurface:** open and closed events not fired when already opened or closed ([9cff431](https://github.com/material-components/material-components-web/commit/9cff4318f0fe8a79f8787afd148907328a5223d5))
* **menusurface:** synchronous quick menu does not close on button click ([45a6615](https://github.com/material-components/material-components-web/commit/45a6615e33eb8a7e6fc37e9ef43a3be3682b6b0e))
* **notched-outline:** Use superclass properties without trailing underscores ([49bf31d](https://github.com/material-components/material-components-web/commit/49bf31d5c9c3ee34e9a51ce3b254a9101c578045))
* **radio:** Use superclass properties without trailing underscores ([541638f](https://github.com/material-components/material-components-web/commit/541638fa2ba3410ca1055c5ae563face06fd20be))
* **ripple:** Use superclass properties without trailing underscores ([6167cd0](https://github.com/material-components/material-components-web/commit/6167cd0756a623502f7f84750dcda25226a59794))
* **select:** Also set font size for icon ([c113fc9](https://github.com/material-components/material-components-web/commit/c113fc942a88e2c53b2c36229b2ddff84e6d0eb5))
* **select:** clean up helper text interactions ([654934d](https://github.com/material-components/material-components-web/commit/654934dfaff71dae2b56bd2d4bb04303f5439c3e))
* **select:** Close menu on anchor click when menu is open ([8fa22aa](https://github.com/material-components/material-components-web/commit/8fa22aaccafa3b1ae09164b228d8e1b203337221))
* **select:** Deduplicate change events ([4ad1274](https://github.com/material-components/material-components-web/commit/4ad12741e41c5b8e175f2bc8d5053daec6cedf18)), closes [#5570](https://github.com/material-components/material-components-web/issues/5570)
* **select:** Fix redundant calculations & allow resyncing foundation to options ([ff4bc63](https://github.com/material-components/material-components-web/commit/ff4bc632aeeefb8eca16d774db01f8f176479659)), closes [#5646](https://github.com/material-components/material-components-web/issues/5646) [#5646](https://github.com/material-components/material-components-web/issues/5646) [#5686](https://github.com/material-components/material-components-web/issues/5686) [#5783](https://github.com/material-components/material-components-web/issues/5783)
* **select:** fix screenreader click interactions ([8904f3c](https://github.com/material-components/material-components-web/commit/8904f3cbe922c5b64f5b7297f23c49861ee13f07))
* **select:** fully separate density mixins for filled variants ([d66d22b](https://github.com/material-components/material-components-web/commit/d66d22bf9b9f221ff8b2d713b1e2fc9288f490df))
* **select:** Make compatible with rich list-items ([0a7895f](https://github.com/material-components/material-components-web/commit/0a7895f4d4c22296ad23b2d8a7e1a4dbe231b941))
* **select:** Remove pointer events where unnecessary ([0e052b2](https://github.com/material-components/material-components-web/commit/0e052b24f415b81fbffb45182030dd8b9d68ee98))
* **select:** Set aria-selected="false" properly ([730920f](https://github.com/material-components/material-components-web/commit/730920fbba046b0a7c3821f52877504a78373f1f))
* **select:** Update disabled state ([f83e008](https://github.com/material-components/material-components-web/commit/f83e00898fb57e49e38ef59b3458df4525332302))
* **select:** Update dropdown arrow icon transitions ([15d6544](https://github.com/material-components/material-components-web/commit/15d65448e5dd8a29477b34754264644ad88f8421))
* **select:** Update markup in tests and README ([e3eacef](https://github.com/material-components/material-components-web/commit/e3eacefcc0ca3ca89af34b3e4d3dc13c5a27570b))
* **select:** Use key constants from DOM package ([388b042](https://github.com/material-components/material-components-web/commit/388b042c7193f78874a8854664742fc7285f1386))
* **select:** Use superclass properties without trailing underscores ([c472bbb](https://github.com/material-components/material-components-web/commit/c472bbbd1aa5e362c227a1c5204601362444d22f))
* **slider:** avoid server side rendering error ([95c7355](https://github.com/material-components/material-components-web/commit/95c73550e886c2832aa42cd065552551b6690a61))
* **slider:** mobile sliding regression ([e844443](https://github.com/material-components/material-components-web/commit/e844443878b9711a306e72b951c7ea931b17d837)), closes [#5894](https://github.com/material-components/material-components-web/issues/5894)
* **slider:** two change events fired on each up ([d10412c](https://github.com/material-components/material-components-web/commit/d10412cb24150639acc617caef1c7fac4fb6e4bd))
* **snackbar:** Use superclass properties without trailing underscores ([39b0b8e](https://github.com/material-components/material-components-web/commit/39b0b8e06ef68d5b59515454907b5472ce75b842))
* **snackbar:** Use superclass properties without trailing underscores ([5ea0f3f](https://github.com/material-components/material-components-web/commit/5ea0f3fc47e8bd18fcc8fd3af84fcecc17b3f800))
* **switch:** always set track to transparent border ([9a169f4](https://github.com/material-components/material-components-web/commit/9a169f4b158a3148126ba38bcdfa9d163434d9bb))
* **switch:** use CSS custom properties for theming ([d6315ef](https://github.com/material-components/material-components-web/commit/d6315efe26e7baf45fd88244efbb24c612a95cb4))
* **tab:** Use superclass properties without trailing underscores ([a4b2e61](https://github.com/material-components/material-components-web/commit/a4b2e61d47b515a0ebbdee788e8462d800bea7f3))
* **tab-bar:** Use superclass properties without trailing underscores ([f2de07c](https://github.com/material-components/material-components-web/commit/f2de07c606c8d57942d5f0022e90eecb41b3ad61))
* **tab-indicator:** Use superclass properties without trailing underscores ([d30a214](https://github.com/material-components/material-components-web/commit/d30a214ace1c0ae41fd5d7f8ba4915035fd9235a))
* **tab-scroller:** Use superclass properties without trailing underscores ([96dba1d](https://github.com/material-components/material-components-web/commit/96dba1d3127c9364cff5786a01be8c17f69ab0ee))
* **text-field:** Use superclass properties without trailing underscores ([e6165eb](https://github.com/material-components/material-components-web/commit/e6165eb156d60f8f650c68931854136a1a44fc6e))
* **textfield:** clean up input padding ([8639c26](https://github.com/material-components/material-components-web/commit/8639c269010b77b17f1a5052d57abcb5f7d2892a))
* **textfield:** core-styles now applies sub-element core-styles ([bcdad99](https://github.com/material-components/material-components-web/commit/bcdad99bbf9ac4d2bbc09cf6378c0c040521e514)), closes [#5927](https://github.com/material-components/material-components-web/issues/5927)
* **textfield:** IE11 label overlapping placeholder ([781434a](https://github.com/material-components/material-components-web/commit/781434a92f4dddc9b2d39853e1f5792e89e7b45b))
* fix show/hide clauses in import-only files ([148e448](https://github.com/material-components/material-components-web/commit/148e448de1290e3628fac6eae19609c8e1bffda3))
* **textfield:** remove absolute positioning from icons ([1e13d1d](https://github.com/material-components/material-components-web/commit/1e13d1d5a68632f1b0b5a9134f657d59104969f4))
* mark all packages as side-effect-free ([be7cb05](https://github.com/material-components/material-components-web/commit/be7cb05996a7281d1e0c12c0f4677e4d091a2329))
* server-side rendering errors in linear progress and slider ([7d0b983](https://github.com/material-components/material-components-web/commit/7d0b983a902deee6941d61906aa5a880628db4e9))
* **textfield:** remove deprecated dense variant in favor of density ([776291e](https://github.com/material-components/material-components-web/commit/776291ef03205e4063b4040eb66f9648e16b4af6)), closes [#4142](https://github.com/material-components/material-components-web/issues/4142)
* **textfield:** textarea density label position is now correct ([2f8a227](https://github.com/material-components/material-components-web/commit/2f8a227a289a56702fec6592a87cf8bab422326a))
* **textfield:** textarea min-width not set correctly for Chrome ([0a371b4](https://github.com/material-components/material-components-web/commit/0a371b4fe4ca4452618a867aac1731c6d3136b91))
* **textfield:** update outlined textarea specs ([524b7b8](https://github.com/material-components/material-components-web/commit/524b7b8127e74bc3d551bd3b81e951fc51682665))
* **top-app-bar:** Use superclass properties without trailing underscores ([863ac1b](https://github.com/material-components/material-components-web/commit/863ac1b0f1723883565ca813d56bba0a1c8a832f))


### Code Refactoring

* **linear-progress:** Restructure buffer DOM to allow translucent buffer ([98b8434](https://github.com/material-components/material-components-web/commit/98b843417ef6c0a10460532a37df389b0c7e936f))
* **linear-progress:** Restructure buffer DOM to allow translucent buffer ([9372e49](https://github.com/material-components/material-components-web/commit/9372e493954585c939f341486d0361efb87da806))
* **select:** Fix alignment issues, upgrade anchor to interactive element ([28d10a9](https://github.com/material-components/material-components-web/commit/28d10a96e1d5e5762d5a056ac805070e9fb6a4e1)), closes [#5428](https://github.com/material-components/material-components-web/issues/5428)


### Features

* **button:** Add button ripple-states mixin, for simpler customization of button ripple color. ([ed7f324](https://github.com/material-components/material-components-web/commit/ed7f324636287e95e8d966866a7c72af94377cf6))
* **button:** Expand outlined touch target to include side borders ([ce6cb70](https://github.com/material-components/material-components-web/commit/ce6cb7024d1da3b0e4fb5e2c67ba269dbb3098ec))
* **checkbox:** Add support for checkbox CSS-only `indeterminate` checkbox ([b273afa](https://github.com/material-components/material-components-web/commit/b273afa93441e6d0375f7df33d5b69d8a7e1cfa8))
* **chips:** Add chips styling ([1db5c9f](https://github.com/material-components/material-components-web/commit/1db5c9fc842292715f8b4603ce0b979066f1c639))
* **chips:** Add configurable primary action focus ([deb212d](https://github.com/material-components/material-components-web/commit/deb212de41e1073f7ff00af92e5f37bad0d8c4b0))
* **chips:** Add focus{in|out} handlers ([10af6cf](https://github.com/material-components/material-components-web/commit/10af6cf39cb2ae0a7deb9a951960f115f6ecdace))
* **chips:** Add keyCode support ([82fa986](https://github.com/material-components/material-components-web/commit/82fa986b95be4c16271df50effda1046d015d35c))
* **chips:** Add trailing action feature targeting test ([bec0659](https://github.com/material-components/material-components-web/commit/bec0659206aee793e6970d59c73f7969ab540b69))
* **chips:** Create trailing action business logic ([9ebee4c](https://github.com/material-components/material-components-web/commit/9ebee4ceb998e5fa651d4f147e5e39d43600db6e))
* **chips:** Expose trailing action chip files ([6b48781](https://github.com/material-components/material-components-web/commit/6b48781bf97d3b08b8f35b9eacde2b87748ae2e1))
* **chips:** Reposition trailing action touch target width mixin ([3846ce3](https://github.com/material-components/material-components-web/commit/3846ce311f65156f24dbd229100e660f1285bf5f))
* **chips:** Restructure trailing action mixins ([05f5e15](https://github.com/material-components/material-components-web/commit/05f5e1583b81bc00dbcd2ae21ee0acc43b3e13b4))
* **chips:** Use trailing action component in chip ([058cfd2](https://github.com/material-components/material-components-web/commit/058cfd23caa5c00f29c90f3d2fc9b813581ba974))
* **circular-progress:** Add foundation methods to get isDeterminate and progress value ([7d8f9c8](https://github.com/material-components/material-components-web/commit/7d8f9c8d73f16c01ed4a941ab9510377a0aae219))
* **circular-progress:** Add Sass styles and tests ([bd33cb5](https://github.com/material-components/material-components-web/commit/bd33cb56bdab7139052aeedbeec363f17b4dfc40))
* **circular-progress:** Add TS for foundation, adapter, component with tests ([548b1d4](https://github.com/material-components/material-components-web/commit/548b1d4057f21e066a4c494a57a0c068c23e18cd))
* **data-table:** Add base styles to support pagination. ([927fa90](https://github.com/material-components/material-components-web/commit/927fa902c3297a5a7cc9436e82cb81f3aabe1b4b))
* **data-table:** Add foundation methods to support loading state. ([e75deb8](https://github.com/material-components/material-components-web/commit/e75deb8540fa70236087d335c9cd6280bd643285))
* **data-table:** Added sort status label to sortable column header ([9833dc2](https://github.com/material-components/material-components-web/commit/9833dc28775a02fa4c7c490ae5df1ed198bbb398))
* **data-table:** Added styles for table in loading state ([35a32aa](https://github.com/material-components/material-components-web/commit/35a32aaeac17e290e2e9f9a1310c5a44a08f624a))
* **data-table:** Added styles to support column sorting. ([17b9699](https://github.com/material-components/material-components-web/commit/17b9699c4454a107043e5a1f9874a091089dd112))
* **data-table:** Added styles to support rows per page select menu in pagination ([3ee488f](https://github.com/material-components/material-components-web/commit/3ee488f1c0f65972459f2dbc74b6c3365786df4b))
* **data-table:** Added support for column sorting feature in data table ([06ef147](https://github.com/material-components/material-components-web/commit/06ef147b593d134fcd03f48fc3581d8fd6068865))
* **data-table:** Added support for row header cell and other a11y improvements. ([27533c1](https://github.com/material-components/material-components-web/commit/27533c19e9c72c5a27a33aaa764c1b6a05175cf5))
* **data-table:** Foundation changes to support column sorting ([6ee0355](https://github.com/material-components/material-components-web/commit/6ee03557260d0a23296e36cba5aaa76fe0cf96a6))
* **data-table:** Make rows per page wrap in new line when overflows ([09abc92](https://github.com/material-components/material-components-web/commit/09abc92198d1628c57eee5e75c58da52b223c322))
* **data-table:** Set progress indicator styles based on table body height ([c026422](https://github.com/material-components/material-components-web/commit/c0264227393df8eb9259a2b24c23b31fe0ca84f3))
* **dialog:** Add padding mixin ([ad0c0c1](https://github.com/material-components/material-components-web/commit/ad0c0c1034d0b9257a62d3dd9f5d27aada99f1f7))
* **dom:** Add keyboard support ([5f24faa](https://github.com/material-components/material-components-web/commit/5f24faacb1ef8996ae81f3a1c1e43910ba67b024))
* **drawer:** allow custom properties in width() ([39e6f71](https://github.com/material-components/material-components-web/commit/39e6f71e2e03b75512242d7520678c32c5af2b70))
* **fab:** Add outline in high-contrast mode ([deda86d](https://github.com/material-components/material-components-web/commit/deda86d8cc4665b334c4d21c541a4a30244fee72))
* **floating-label:** add required modifier class ([047e6b3](https://github.com/material-components/material-components-web/commit/047e6b337899a57290283cb0387f33738853cbc2))
* **form-field:** Add support for space-between ([e84b9c8](https://github.com/material-components/material-components-web/commit/e84b9c816d32da6dec058d92fc21dc5ac8fec787)), closes [#5747](https://github.com/material-components/material-components-web/issues/5747)
* **formfield:** add nowrap class/prop to MDC/MWC ([c4b4bba](https://github.com/material-components/material-components-web/commit/c4b4bba9659bf15207e79b1f63fcc9946404d9c7))
* **formfield:** Remove trailing underscores from private properties ([2f052d8](https://github.com/material-components/material-components-web/commit/2f052d82433a852d65785b1054ce4665ad1f6265))
* **iconbutton:** Add icon button variant which supports toggling aria label. ([f838c6e](https://github.com/material-components/material-components-web/commit/f838c6e55672268de4e6e3b31b154d4f9050242f))
* **iconbutton:** Remove trailing underscores from private properties ([119e214](https://github.com/material-components/material-components-web/commit/119e21426d73305fe348798cb7ce88077995fdd0))
* **linear-progress:** Add foundation methods to fetch progress and determinate state. ([4dc45af](https://github.com/material-components/material-components-web/commit/4dc45af6c4bc81f5734a24c160046d283c1e9a6d))
* **linearprogress:** Remove trailing underscores from private properties ([893eb18](https://github.com/material-components/material-components-web/commit/893eb1876220e5313f9db37365049b8c2282109c))
* **list:** add focus indicator in hi-contrast mode ([8602f1b](https://github.com/material-components/material-components-web/commit/8602f1b4da404816513733a21973ec9cbc9acfa3))
* **list:** Add mixin for selected item's text color ([bd8ca96](https://github.com/material-components/material-components-web/commit/bd8ca96788c9cb793288b6aa5c406b220be0bd9c))
* **menu:** Add mixin to flatten menu top when opened-below anchor ([1e17c49](https://github.com/material-components/material-components-web/commit/1e17c49b360fd0e01c9a74b92978031534003b5b))
* **menu-surface:** Add support for flipping menu corner horizontally. ([7b44824](https://github.com/material-components/material-components-web/commit/7b448240263b45c6b474c2f758cd1c02f3c708ad))
* **ripple:** Reorganize ripple opacities ([008c4d3](https://github.com/material-components/material-components-web/commit/008c4d3191f9c2a76732688504d2299420734cdd))
* **rtl:** allow values to be theme keys and custom props ([afb1c11](https://github.com/material-components/material-components-web/commit/afb1c11a9e9048ba7c2ed30e32e892ae483dfccc))
* **select:** Add menu invalid class ([4ba3c9a](https://github.com/material-components/material-components-web/commit/4ba3c9a319dad4101f4d24607a79c01390330acd))
* **select:** Add mixin for min-width ([09f5919](https://github.com/material-components/material-components-web/commit/09f591967a42e4dc27c0f7022d9ae71e94c07c3d))
* **select:** Add openMenu foundation method ([9b0b5f2](https://github.com/material-components/material-components-web/commit/9b0b5f2e034a7f8ab0e68e3afbd7c246447f53e7))
* **select:** Add styles for high-contrast mode in IE ([05cc5c2](https://github.com/material-components/material-components-web/commit/05cc5c20651eed3e40960074db919f0d030c46fb))
* **select:** Auto-align width of menu to select by default ([1b3dd84](https://github.com/material-components/material-components-web/commit/1b3dd846db4da7dcb1baaf2003e35e462cb799b7))
* **select:** Change root to inline-block & add fullwidth flag ([2673adb](https://github.com/material-components/material-components-web/commit/2673adb74397d55c9dcd8e5fd86b3efc87a13a28))
* **select:** changing density also also changes menu's list density ([68a2af1](https://github.com/material-components/material-components-web/commit/68a2af131b82e9b50e70754a2d653d6305dac4b9))
* **select:** Create additional state mixins ([744d751](https://github.com/material-components/material-components-web/commit/744d751a0c0f154d5d0d05def88203b68c3a26a5))
* **select:** extend typeahead to work when menu closed but select focused ([a0dc2b5](https://github.com/material-components/material-components-web/commit/a0dc2b5c4afbf3fd8274c752d43aeeeb11231e5f))
* **select:** flatten menu top when opened below ([912d902](https://github.com/material-components/material-components-web/commit/912d9021dab7712e0ab711fcaffb3933a960c171))
* **select:** gracefully display long labels ([21c4e4e](https://github.com/material-components/material-components-web/commit/21c4e4ed866944c090ae3d6dffe9f5e4725b7ffc))
* **select:** Implement density ([610c68d](https://github.com/material-components/material-components-web/commit/610c68d97646f523eaff0bb26c08baa5903e9211))
* **select:** introduce custom validity ([fd8f8f2](https://github.com/material-components/material-components-web/commit/fd8f8f2b77b0a17e25f78b5a510b7afe4bbd230b))
* **select:** lower dropdown icon size and list leading padding when dense ([32aa236](https://github.com/material-components/material-components-web/commit/32aa23641258671e0eac803c0f41ae78ecce32fd))
* **select:** make selected text more flexible ([2b420c5](https://github.com/material-components/material-components-web/commit/2b420c5b318b7ada726dec774d9e09624bca9822))
* **select:** Replace hardcoded leading margins for options with dummy graphic ([7461aad](https://github.com/material-components/material-components-web/commit/7461aad68924d0f3bb790987b01f802078ebc7df))
* **select:** Support typeahead ([b0fdca4](https://github.com/material-components/material-components-web/commit/b0fdca4921afd58de567bd53b29c9b6e44dac5c1)), closes [#5705](https://github.com/material-components/material-components-web/issues/5705)
* **select:** Update behavior on upArrow/downArrow ([d92d8c9](https://github.com/material-components/material-components-web/commit/d92d8c93ee6d9c030e6d373ac2b8670ac56417ad))
* **select:** Update helper-text interactions ([142b154](https://github.com/material-components/material-components-web/commit/142b1549ee0cf40b1f1531e79e53fe5e826f254d)), closes [#5463](https://github.com/material-components/material-components-web/issues/5463)
* **select:** use floating label's required class ([d86ad3b](https://github.com/material-components/material-components-web/commit/d86ad3b6081234359ff19547649f9d391ea8aa9e))
* **shape:** add shape custom properties ([0743288](https://github.com/material-components/material-components-web/commit/0743288fb04dc8578f0b850d31fad6c00c97ea1c))
* **text-field:** Truncate floating label width w/ icons ([c141801](https://github.com/material-components/material-components-web/commit/c141801d50516a18fe53d4bc78591cefb4f57623))
* **textfield:** add filled class variant ([b70bc60](https://github.com/material-components/material-components-web/commit/b70bc601ef570dab4598ae6f3ca51bbf884fac96))
* **textfield:** add filled textarea variant ([4497b86](https://github.com/material-components/material-components-web/commit/4497b86ed8b3e0ee0781dd6f795aa1ff332d2a3b))
* **textfield:** add forced LTR input ([490fbdc](https://github.com/material-components/material-components-web/commit/490fbdc092c5c59d63f83407b83b37fb524ed0e5))
* **textfield:** add prefix and suffix ([6601d24](https://github.com/material-components/material-components-web/commit/6601d24afdc3a3d0bd2a9b3fcca68c35c9415ec1)), closes [#1892](https://github.com/material-components/material-components-web/issues/1892)
* **textfield:** add specific label-floating class ([a88c8e4](https://github.com/material-components/material-components-web/commit/a88c8e4dc873ae74a3afbae0dc8635dfaa03e67b))
* **textfield:** allow character counter to be moved outside of the textarea. ([84e7ed5](https://github.com/material-components/material-components-web/commit/84e7ed5825d3109c229d0f1f6c3edf97a3548226))
* **textfield:** allow disabled textareas to scroll and resize ([b9776b1](https://github.com/material-components/material-components-web/commit/b9776b1d09b9ccfac38b3dc471dee2fd9fc8558a))
* **textfield:** Create float transition mixin ([ca61b65](https://github.com/material-components/material-components-web/commit/ca61b656fababdf25adaa307963d4f37e6d413ec))
* **textfield:** Limit notched outline max-width ([0ab62a6](https://github.com/material-components/material-components-web/commit/0ab62a65b17192a94102231ca63f54adc39675ae))
* **textfield:** move resize handle for textareas to bottom corner ([ed52af7](https://github.com/material-components/material-components-web/commit/ed52af7677ad37138b6660ca11fbdb209be05b46))
* **textfield:** required outlined modifier for textarea ([b10d0d7](https://github.com/material-components/material-components-web/commit/b10d0d7f1911b381a47d39b5d0bc4543089efb3e))
* **textfield:** support svg icons for textfield ([d91794c](https://github.com/material-components/material-components-web/commit/d91794c7ecafbaef7150d2c88226b96d7e4c4ea6))
* **theme:** add new property mixin and custom property support ([51512a4](https://github.com/material-components/material-components-web/commit/51512a4ac375a6175b4a533ff004ea90a4318c9e))
* **theme:** custom property fallback values are now optional ([01de070](https://github.com/material-components/material-components-web/commit/01de07011d8b4b121a061da66fafe610f5484a51))
* **typography:** add container baseline mixins for flexbox ([69edc6e](https://github.com/material-components/material-components-web/commit/69edc6e2899636cfccb117376bb64dc0a267c588))


### BREAKING CHANGES

* **button:** Correct misspelling of overflow for button's label-overflow-ellipsis mixin
* **button:** Correct misspelling of overflow for button's label-overflow-ellipsis mixin
* **button:** Removes button theme-baseline() mixin, moves mixin contents to base button Sass.
* **chips:** The chip adapter and foundation interfaces have changed. Chips now use the trailing action subcomponent.
* **data-table:** Added a wrapper element to data table's table element to fix horizontal scrolling issue when pagination controls are added.
* **floating-label:** all labels that are part of a required field should now add the mdc-floating-label--required class for required fields to avoid a FOUC
* **linear-progress:** DOM for linear progress buffer changed. MDCLinearProgressAdapter method `getBuffer`, `getPrimaryBar`, `setStyle` removed. MDCLinearProgressAdapter method `setBufferBarStyle`, `setPrimaryBarStyle` added.
* **linear-progress:** DOM for linear progress buffer changed. MDCLinearProgressAdapter method `getBuffer`, `getPrimaryBar`, `setStyle` removed. MDCLinearProgressAdapter method `setBufferBarStyle`, `setPrimaryBarStyle` added.
* **select:** Added adapter method `addMenuClass`, `removeMenuClass`
* **select:** Added adapter methods `isTypeaheadInProgress`, `typeaheadMatchItem`
* **select:** DOM structure for dropdown icon changed; `$dropdown-color` renamed to `$dropdown-icon-color`, `$dropdown-opacity` removed, `$disabled-dropdown-opacity` removed.
* **select:** HTML Markup significantly changed, see README; REMOVED adapter methods `isSelectedTextFocused`, `getSelectedTextAttr`, `setSelectedTextAttr`; ADDED adapter methods `isSelectAnchorFocused`, `getSelectAnchorAttr`, `setSelectAnchorAttr`; removed variables `outlined-dense-label-position-y`, `icon-padding`; added variables `minimum-height-for-filled-label`, `filled-baseline-top`, `selected-text-height`, `anchor-padding-left`, `anchor-padding-left-with-leading-icon`, `anchor-padding-right`.
* **select:** `density` mixin split into `filled-density`, `filled-with-leading-icon-density`; `height` mixin split into `filled-height`, `filled-with-leading-icon-height`
* **select:** `mdc-menu--fullwidth` class replaces custom width class for the menu markup in select
* **select:** adapter method removeAttributeAtIndex removed.
* **select:** added adapter method `removeSelectAnchorAttr`
* **select:** dropdown icon SVG markup now has `mdc-select__dropdown-icon-graphic` class.
* **select:** empty space around `mdc-list-item__text` spans removed in select markup
* **select:** helper text now persistent by default, `mdc-select-helper-text--persistent` removed
* **select:** non-outlined selects now require a `mdc-select--filled` class on its root
* **select:** root of mdc-select is now an inline-block element, use custom width class (i.e. `demo-width-class`) on the root instead of the anchor for width adjustments; alternately, use the new `mdc-select--fullwidth` on the root to expand width to that of its parent container
* **select:** variable `$outline-disabled-border` renamed to `$disabled-outline-color`; icon variable `$icon-opacity` removed, use alpha channel of `$icon-color` instead.
* **textfield:** Default textfields must now specify mdc-text-field--filled. Disabled outlined textfields no longer have a shaded background. Height mixin no longer specifies a baseline override, use typography's baseline-top mixin.
* **textfield:** mdc-text-field--dense and associated mixins/variables have been removed. Use the density() mixin instead.
* **textfield:** mdc-text-field--textarea must now include mdc-text-field--outlined modifier class
* **textfield:** mdc-text-field-SUB_ELEMENT imports have been removed
* **textfield:** removed the following variables: `$input-padding`, `$input-padding-top`, `$input-padding-bottom`, `$outlined-input-padding-top`, `$outlined-input-padding-bottom`, `$input-border-bottom`
* **textfield:** textareas must now add a `mdc-text-field__resizer` span around the textarea (and internal counter if present) if they are resizable
* **textfield:** textareas with internal character counters must specify the `mdc-text-field--with-internal-counter` class. Character counters should move after the textarea element.
* **theme:** `color-hash()` (and checkbox container-colors mixins) no longer works with `var()` values and now only works with custom property Maps created by `custom-properties.create()`
* **typography:** `typography.baseline-top()` and `typography.baseline-bottom()` are now private. Use `typography.baseline()` for containers and `typography.text-baseline()` for text with $top and $bottom params.


# [6.0.0](https://github.com/material-components/material-components-web/compare/v5.1.0...v6.0.0) (2020-04-22)

### Bug Fixes

* **auto-init:** Fixed issue with multiple default exports ([#5464](https://github.com/material-components/material-components-web/issues/5464)) ([8ddd5c6](https://github.com/material-components/material-components-web/commit/8ddd5c6dcbfa6d81a063b37aee4021ebf34d18f0))
* **button:** Fix outline & ink color according to spec guidance ([#5268](https://github.com/material-components/material-components-web/issues/5268)) ([ee1a68c](https://github.com/material-components/material-components-web/commit/ee1a68c54fa9240a334b0462513b855d5dab4807))
* **button:** Fixed  parameter default value in height mixin ([#5244](https://github.com/material-components/material-components-web/issues/5244)) ([b0cecf1](https://github.com/material-components/material-components-web/commit/b0cecf1451c13fd8c159c1b0ca90b2a1e9b907a0))
* **checkbox:** change checkbox event type from change to click and add some logic for IE browser ([#5316](https://github.com/material-components/material-components-web/issues/5316)) ([2e491de](https://github.com/material-components/material-components-web/commit/2e491de555d54f8d41474ccda156e5f9d0666bc4)), closes [#4893](https://github.com/material-components/material-components-web/issues/4893)
* **checkbox:** Disabled state colors in IE11 high contrast mode ([#5263](https://github.com/material-components/material-components-web/issues/5263)) ([d6a1d4b](https://github.com/material-components/material-components-web/commit/d6a1d4bf81b828f214e8bbf941090ef7d8e91c58))
* **checkbox:** Replace unique-id with custom color hash functio… ([#5404](https://github.com/material-components/material-components-web/issues/5404)) ([7be9e4a](https://github.com/material-components/material-components-web/commit/7be9e4a04387b9ca5f8afae6e4edcb3b37e6a86b))
* **checkbox:** update disabled color values ([#5209](https://github.com/material-components/material-components-web/issues/5209)) ([821871e](https://github.com/material-components/material-components-web/commit/821871e04737c5b0c0afded9e8e885680ca25a1f))
* **checkbox:** Use secondary and on-secondary as default colors ([b95172e](https://github.com/material-components/material-components-web/commit/b95172e69613c0defe82191b86ed1c1999b74400)), closes [#5730](https://github.com/material-components/material-components-web/issues/5730)
* **chips:** .d.ts file generated with syntax error ([d154836](https://github.com/material-components/material-components-web/commit/d1548369f2311e164b0920ed651ba211d05543fa))
* **chips:** .d.ts file generated with syntax error ([#5577](https://github.com/material-components/material-components-web/issues/5577)) ([98f7faa](https://github.com/material-components/material-components-web/commit/98f7faa05fa7c88e0231a00942f4ff9dedf4e8c0))
* **chips:** Do not throw error if chip set becomes empty ([#5290](https://github.com/material-components/material-components-web/issues/5290)) ([f978109](https://github.com/material-components/material-components-web/commit/f978109c33d9e67aebe5af3e460174686eea7b4a))
* **chips:** Fix browser back nav in FF when removing chip with… ([#5537](https://github.com/material-components/material-components-web/issues/5537)) ([a1a0deb](https://github.com/material-components/material-components-web/commit/a1a0deb3ea47d5d89efdcab062e438218148b975))
* **chips:** Handle IE/Edge specific key names in keyboard navigation logic ([3657f88](https://github.com/material-components/material-components-web/commit/3657f886327182c26f1d1555b2ac67c2128140b5))
* **chips:** Move touch target inside primary action ([ad3bbf7](https://github.com/material-components/material-components-web/commit/ad3bbf7822d1fe26694b798299c48e8896971e25))
* **circular-progress:** Add .npmignore file to ignore typescript files when publishing ([#5801](https://github.com/material-components/material-components-web/issues/5801)) ([f172b0f](https://github.com/material-components/material-components-web/commit/f172b0f90a91d8d3d700763d1496bb7b9c1a8d51)), closes [#5800](https://github.com/material-components/material-components-web/issues/5800)
* **circular-progress:** fix determinate transition typo & 4 color keyframes ([a301636](https://github.com/material-components/material-components-web/commit/a3016368df53b1c7967d7d146a9ea53a24442fa9))
* **circular-progress:** Fix naming in package.json and add to jsBundleFactory ([86f7cad](https://github.com/material-components/material-components-web/commit/86f7cad8330dbd600e478610eefd8dd92eb3d8c7))
* **circular-progress:** Force LTR layout ([6a40ef2](https://github.com/material-components/material-components-web/commit/6a40ef217f597138ee2920d2160364649dbf5620))
* **circular-progress:** Switch mixins import to `[@use](https://github.com/use)` ([098ae32](https://github.com/material-components/material-components-web/commit/098ae3285223af2532659dec233537a55c1183f5))
* **core:** Fix canary release by excluding test files from default tsconfig ([#5317](https://github.com/material-components/material-components-web/issues/5317)) ([c916008](https://github.com/material-components/material-components-web/commit/c9160084f1f64800e74e0e69673c6b2beca22ee4))
* **data-table:** change svg attribute name viewbox to viewBox ([#5483](https://github.com/material-components/material-components-web/issues/5483)) ([#5493](https://github.com/material-components/material-components-web/issues/5493)) ([f3adce8](https://github.com/material-components/material-components-web/commit/f3adce86f43c15d3e2311363bf317ff68a3bb99d))
* **data-table:** Fix pagination box height ([eb28b6e](https://github.com/material-components/material-components-web/commit/eb28b6ecc65a9979ef0959eac5dbfde5b4d3b2dc))
* **data-table:** Fixed default feature targeting query params of sort mixins ([e33c49e](https://github.com/material-components/material-components-web/commit/e33c49eaf9c0dbc601f3610af6358cbf2833229c))
* **data-table:** Hover styles for sortable header cell ([d580805](https://github.com/material-components/material-components-web/commit/d5808057fcdf00364731e0896ef7031ac605cf55))
* **data-table:** Reverse the arrow direction icon for column sorting ([a7c827f](https://github.com/material-components/material-components-web/commit/a7c827f17ce9be631484676ccb6b5f18604803ae))
* **data-table:** unable to redefine colors in class-based themi… ([#5751](https://github.com/material-components/material-components-web/issues/5751)) ([4d48051](https://github.com/material-components/material-components-web/commit/4d48051c1099f48e867cf08f070138a7abc719fc))
* **data-table:** unable to redefine colors in class-based theming ([4b45b66](https://github.com/material-components/material-components-web/commit/4b45b662057edd8819f1a515db88e1c12254cc30))
* **dialog:** Move aria roles from dialog root to dialog surface… ([#5239](https://github.com/material-components/material-components-web/issues/5239)) ([c704b71](https://github.com/material-components/material-components-web/commit/c704b71d931dd0db191a30ff88a5d0c44f099300))
* **elevation:** Update overlay color mixin ([#5331](https://github.com/material-components/material-components-web/issues/5331)) ([b723dfa](https://github.com/material-components/material-components-web/commit/b723dfa7848c4b96bc24bb148cc5f55f316625ee))
* **fab:** Add missing dep to fab package.json. ([#5236](https://github.com/material-components/material-components-web/issues/5236)) ([e0f6fd9](https://github.com/material-components/material-components-web/commit/e0f6fd931f677874dcad4d91c3d74a2125674e96))
* **fab:** Add overflow: visible to make touch target visible in… ([#5241](https://github.com/material-components/material-components-web/issues/5241)) ([5850080](https://github.com/material-components/material-components-web/commit/58500806e27a0931404631d76bc09646bc64caaf))
* **fab:** Adjust fab line-height ([#5254](https://github.com/material-components/material-components-web/issues/5254)) ([525989b](https://github.com/material-components/material-components-web/commit/525989b5d8dfe86bcb6f65e0f0f0fd138e4b4b76))
* **fab:** Adjust fab line-height to center text ([#5258](https://github.com/material-components/material-components-web/issues/5258)) ([591a6ad](https://github.com/material-components/material-components-web/commit/591a6ad449f98efa7bc00c8afdd2716a6fbe75d9))
* **floatinglabel:** Estimate hidden scroll width ([#5448](https://github.com/material-components/material-components-web/issues/5448)) ([981ec9b](https://github.com/material-components/material-components-web/commit/981ec9b6fd538caadb44f7469745de8f8954c89b))
* **linear-progress:** Temporary rollback of [#5656](https://github.com/material-components/material-components-web/issues/5656) while updating downstream dependencies ([9cf5e98](https://github.com/material-components/material-components-web/commit/9cf5e9842475e50046462aa1c6d18e326abaee17))
* **linear-progress:** support aria attributes (#5248) ([7084b40](https://github.com/material-components/material-components-web/commit/7084b403a4ab6be0856c670eebb39078a4fcbcfe)), closes [#5248](https://github.com/material-components/material-components-web/issues/5248)
* **list:** Ensure disabled colors apply to primary and secondary text ([#5322](https://github.com/material-components/material-components-web/issues/5322)) ([878a08b](https://github.com/material-components/material-components-web/commit/878a08b7cf673ba45f124b400032928b2c273749))
* **list:** No longer emits action event when disabled item selected ([f352d03](https://github.com/material-components/material-components-web/commit/f352d03f4ed48c5019a0a3e10ef12689a5ab5619)), closes [#5571](https://github.com/material-components/material-components-web/issues/5571)
* **menu-surface:** Use margin_to_edge as a viewport margin in calculations for autopositioning. ([4b04cdb](https://github.com/material-components/material-components-web/commit/4b04cdb0fc4da4831340b01292c118b120c1fcb1))
* **menusurface:** open and closed events not fired when already opened or closed ([9cff431](https://github.com/material-components/material-components-web/commit/9cff4318f0fe8a79f8787afd148907328a5223d5))
* **menusurface:** synchronous quick menu does not close on button click ([45a6615](https://github.com/material-components/material-components-web/commit/45a6615e33eb8a7e6fc37e9ef43a3be3682b6b0e))
* **notched-outline:** Restore component test ([#5449](https://github.com/material-components/material-components-web/issues/5449)) ([4269133](https://github.com/material-components/material-components-web/commit/4269133421f7058385255b0676be94c9c1170b2d))
* **radio:** update disabled color values ([#5210](https://github.com/material-components/material-components-web/issues/5210)) ([491fddc](https://github.com/material-components/material-components-web/commit/491fddc31c16f99206b1fa7dce37d43b742e86f5))
* **select:** Deduplicate change events ([4ad1274](https://github.com/material-components/material-components-web/commit/4ad12741e41c5b8e175f2bc8d5053daec6cedf18)), closes [#5570](https://github.com/material-components/material-components-web/issues/5570)
* **select:** Do not fire change event on programmatic change ([#5255](https://github.com/material-components/material-components-web/issues/5255)) ([ec72968](https://github.com/material-components/material-components-web/commit/ec729683b46fb986a880f26870973337ec6788e5))
* **select:** Fix notch outline width when floating ([#5319](https://github.com/material-components/material-components-web/issues/5319)) ([1c494e5](https://github.com/material-components/material-components-web/commit/1c494e5672c142f3f3451aa2270431844d35c88e))
* **slider:** slider track not visible ([#5512](https://github.com/material-components/material-components-web/issues/5512)) ([f2426d2](https://github.com/material-components/material-components-web/commit/f2426d26e683591cee87b4107f990492b47ec837))
* **slider:** two change events fired on each up ([d10412c](https://github.com/material-components/material-components-web/commit/d10412cb24150639acc617caef1c7fac4fb6e4bd))
* **slider:** use secondary custom property color for slider container ([#5132](https://github.com/material-components/material-components-web/issues/5132)) ([aa8e43e](https://github.com/material-components/material-components-web/commit/aa8e43e9afaa1e00080f149bbe497746b57a285a))
* **slider:** Visual bug when slider value is displayed as "-0" ([3fc3ab5](https://github.com/material-components/material-components-web/commit/3fc3ab520ab5399c3b87b094e047a1751f7aa9af))
* **snackbar:** add explicit width for label to wrap in ie11 ([#5497](https://github.com/material-components/material-components-web/issues/5497)) ([cd49033](https://github.com/material-components/material-components-web/commit/cd4903304412d79be8da96499091259b5e954c80))
* **snackbar:** adjust mixins to meet spec ([#5477](https://github.com/material-components/material-components-web/issues/5477)) ([f16f15b](https://github.com/material-components/material-components-web/commit/f16f15b8fda0d8c283bed5551b78620bf2fd3b82))
* **switch:** add transform transition to switch control to avoid overflow-x issues ([8c11ea2](https://github.com/material-components/material-components-web/commit/8c11ea2a3bd7962c6d895c5bd6b849f95b52d10c))
* **switch:** always set track to transparent border ([9a169f4](https://github.com/material-components/material-components-web/commit/9a169f4b158a3148126ba38bcdfa9d163434d9bb))
* **switch:** fix strict generic checks ([7f5e0c2](https://github.com/material-components/material-components-web/commit/7f5e0c23ffb2f547d9bfca6b68927b5861a3112b))
* **switch:** handle aria-checked correctly. ([#5202](https://github.com/material-components/material-components-web/issues/5202)) ([#5357](https://github.com/material-components/material-components-web/issues/5357)) ([d245a1a](https://github.com/material-components/material-components-web/commit/d245a1a544c643b59f77cd2e01b7eb2c1182f6b9))
* **switch:** set track border to be transparent ([#5323](https://github.com/material-components/material-components-web/issues/5323)) ([397905b](https://github.com/material-components/material-components-web/commit/397905b4e34ff9769d3ae18464bc397a0b13050f))
* **switch:** use CSS custom properties for theming ([d6315ef](https://github.com/material-components/material-components-web/commit/d6315efe26e7baf45fd88244efbb24c612a95cb4))
* **testing:** Revert change from [#5299](https://github.com/material-components/material-components-web/issues/5299). ([#5324](https://github.com/material-components/material-components-web/issues/5324)) ([5fb62be](https://github.com/material-components/material-components-web/commit/5fb62bead477f7db9a76d9c0adbfee4e9c110d37))
* **textfield:** add placeholder mixins and fix disabled colors ([#5360](https://github.com/material-components/material-components-web/issues/5360)) ([0a40ced](https://github.com/material-components/material-components-web/commit/0a40ced406f96b5c84cf39457ffe880d00999714))
* **textfield:** add separate classes for leading/trailing icons ([#5367](https://github.com/material-components/material-components-web/issues/5367)) ([70c708d](https://github.com/material-components/material-components-web/commit/70c708deece4c2c0afe38a31a4989abf2b1c1743))
* **textfield:** change root element to <label> ([#5439](https://github.com/material-components/material-components-web/issues/5439)) ([d8d9502](https://github.com/material-components/material-components-web/commit/d8d95020ff94249f8755ca49aaa06a6e9f0813b0))
* **textfield:** clean up input padding ([8639c26](https://github.com/material-components/material-components-web/commit/8639c269010b77b17f1a5052d57abcb5f7d2892a))
* **textfield:** hide filled-variant floating label at <52px ([#5553](https://github.com/material-components/material-components-web/issues/5553)) ([5ff3380](https://github.com/material-components/material-components-web/commit/5ff33802c22acf7d94fd94c9ccdcfcf901397d56))
* **textfield:** IE11 label overlapping placeholder ([781434a](https://github.com/material-components/material-components-web/commit/781434a92f4dddc9b2d39853e1f5792e89e7b45b))
* **textfield:** incorrect mixin forward path ([#5554](https://github.com/material-components/material-components-web/issues/5554)) ([3e782d8](https://github.com/material-components/material-components-web/commit/3e782d8f84c0096f6a6de3e022017fbb05175fa2))
* **textfield:** move ripple to separate element ([c541ebe](https://github.com/material-components/material-components-web/commit/c541ebe157a66e8d2e881fad16cc4dbe30b2c16b))
* **textfield:** outlined trailing icon's position ([#5496](https://github.com/material-components/material-components-web/issues/5496)) ([93e2288](https://github.com/material-components/material-components-web/commit/93e2288b6ef73c13402a1f5122e2f9a4523ed4a4))
* **textfield:** prevent placeholder styles from collapsing with minifiers ([d07c78d](https://github.com/material-components/material-components-web/commit/d07c78daa83389ef428618d334b037da67740b99))
* add missing SASS dependencies ([#5337](https://github.com/material-components/material-components-web/issues/5337)) ([d2ae6e1](https://github.com/material-components/material-components-web/commit/d2ae6e17d19e7139bce45a0f44ce4ba172bbb3e6))
* **textfield:** remove absolute positioning from icons ([1e13d1d](https://github.com/material-components/material-components-web/commit/1e13d1d5a68632f1b0b5a9134f657d59104969f4))
* **textfield:** remove deprecated dense variant in favor of density ([776291e](https://github.com/material-components/material-components-web/commit/776291ef03205e4063b4040eb66f9648e16b4af6)), closes [#4142](https://github.com/material-components/material-components-web/issues/4142)
* **textfield:** use correct disabled colors for IE11 high contrast ([5353985](https://github.com/material-components/material-components-web/commit/535398572daea2ec389c341f4e0c53cb33582b26))
* Remove edge detection for CSS custom properties ([#5264](https://github.com/material-components/material-components-web/issues/5264)) ([fe444ac](https://github.com/material-components/material-components-web/commit/fe444ac29da5447419cf4c25edbdf934c6e388e4))
* server-side rendering errors in linear progress and slider ([7d0b983](https://github.com/material-components/material-components-web/commit/7d0b983a902deee6941d61906aa5a880628db4e9))


### Code Refactoring

* migrate to the Sass module system ([#5453](https://github.com/material-components/material-components-web/issues/5453)) ([faa9af3](https://github.com/material-components/material-components-web/commit/faa9af310d1a18ec2c183830c84eb14d0492feab))
* **grid-list:** Deprecate component ([#5499](https://github.com/material-components/material-components-web/issues/5499)) ([cf33f11](https://github.com/material-components/material-components-web/commit/cf33f113dd89bbfb2873c9ce3fa1525076bfd4ec))
* **linear-progress:** Restructure buffer DOM to allow translucent buffer ([98b8434](https://github.com/material-components/material-components-web/commit/98b843417ef6c0a10460532a37df389b0c7e936f))
* **linear-progress:** Restructure buffer DOM to allow translucent buffer ([9372e49](https://github.com/material-components/material-components-web/commit/9372e493954585c939f341486d0361efb87da806))
* **select:** Fix alignment issues, upgrade anchor to interactive element ([28d10a9](https://github.com/material-components/material-components-web/commit/28d10a96e1d5e5762d5a056ac805070e9fb6a4e1)), closes [#5428](https://github.com/material-components/material-components-web/issues/5428)
* **touchtarget:** Rename mdc-touch-target-component => mdc… ([#5245](https://github.com/material-components/material-components-web/issues/5245)) ([afe0dd1](https://github.com/material-components/material-components-web/commit/afe0dd1bc240a7a88d76b0a3bf1a36044527babd))


### Features

* **button:** Add disabled state color mixins ([#5232](https://github.com/material-components/material-components-web/issues/5232)) ([b5eb51e](https://github.com/material-components/material-components-web/commit/b5eb51e942b8f233bc1a9a5cf4b4d0c94fb8ea57))
* **button:** Add overflow ellipsis mixin ([#5352](https://github.com/material-components/material-components-web/issues/5352)) ([47949b0](https://github.com/material-components/material-components-web/commit/47949b08e0a2ec82178c638d8074c34c745409b4))
* **button:** Expand outlined touch target to include side borders ([ce6cb70](https://github.com/material-components/material-components-web/commit/ce6cb7024d1da3b0e4fb5e2c67ba269dbb3098ec))
* **button:** Setup elevation overlay ([#5256](https://github.com/material-components/material-components-web/issues/5256)) ([3cbee6d](https://github.com/material-components/material-components-web/commit/3cbee6dac7cafbe8986bad0a8593d870b00f5f32))
* **card:** Add elevation overlay structure ([#5282](https://github.com/material-components/material-components-web/issues/5282)) ([aa0eba4](https://github.com/material-components/material-components-web/commit/aa0eba489a33cb523ae1b5ac5b0ab24995731456))
* **checkbox:** Add support for checkbox CSS-only `indeterminate` checkbox ([b273afa](https://github.com/material-components/material-components-web/commit/b273afa93441e6d0375f7df33d5b69d8a7e1cfa8))
* **chips:** Add chips styling ([1db5c9f](https://github.com/material-components/material-components-web/commit/1db5c9fc842292715f8b4603ce0b979066f1c639))
* **chips:** Add elevation overlay structure ([#5279](https://github.com/material-components/material-components-web/issues/5279)) ([3e560b3](https://github.com/material-components/material-components-web/commit/3e560b33a8fbf820a404596d76ae5f743e57b6a2))
* **chips:** Add focus{in|out} handlers ([10af6cf](https://github.com/material-components/material-components-web/commit/10af6cf39cb2ae0a7deb9a951960f115f6ecdace))
* **chips:** Add keyCode support ([82fa986](https://github.com/material-components/material-components-web/commit/82fa986b95be4c16271df50effda1046d015d35c))
* **chips:** Add trailing action feature targeting test ([bec0659](https://github.com/material-components/material-components-web/commit/bec0659206aee793e6970d59c73f7969ab540b69))
* **chips:** Announce when chips are removed ([b3f70eb](https://github.com/material-components/material-components-web/commit/b3f70ebded85240e75c6d1553cc9d0382b22c31d))
* **chips:** Consolidate interaction event handlers ([#5251](https://github.com/material-components/material-components-web/issues/5251)) ([5729943](https://github.com/material-components/material-components-web/commit/5729943baf1726e931e26907c78774f2caec404e))
* **chips:** Create trailing action business logic ([9ebee4c](https://github.com/material-components/material-components-web/commit/9ebee4ceb998e5fa651d4f147e5e39d43600db6e))
* **chips:** Expose trailing action chip files ([6b48781](https://github.com/material-components/material-components-web/commit/6b48781bf97d3b08b8f35b9eacde2b87748ae2e1))
* **chips:** Restructure trailing action mixins ([05f5e15](https://github.com/material-components/material-components-web/commit/05f5e1583b81bc00dbcd2ae21ee0acc43b3e13b4))
* **circular-progress:** Add foundation methods to get isDeterminate and progress value ([7d8f9c8](https://github.com/material-components/material-components-web/commit/7d8f9c8d73f16c01ed4a941ab9510377a0aae219))
* **circular-progress:** Add Sass styles and tests ([bd33cb5](https://github.com/material-components/material-components-web/commit/bd33cb56bdab7139052aeedbeec363f17b4dfc40))
* **circular-progress:** Add TS for foundation, adapter, component with tests ([548b1d4](https://github.com/material-components/material-components-web/commit/548b1d4057f21e066a4c494a57a0c068c23e18cd))
* **data-table:** Add base styles to support pagination. ([927fa90](https://github.com/material-components/material-components-web/commit/927fa902c3297a5a7cc9436e82cb81f3aabe1b4b))
* **data-table:** Add foundation methods to support loading state. ([e75deb8](https://github.com/material-components/material-components-web/commit/e75deb8540fa70236087d335c9cd6280bd643285))
* **data-table:** Added styles for table in loading state ([35a32aa](https://github.com/material-components/material-components-web/commit/35a32aaeac17e290e2e9f9a1310c5a44a08f624a))
* **data-table:** Added styles to support column sorting. ([17b9699](https://github.com/material-components/material-components-web/commit/17b9699c4454a107043e5a1f9874a091089dd112))
* **data-table:** Foundation changes to support column sorting ([6ee0355](https://github.com/material-components/material-components-web/commit/6ee03557260d0a23296e36cba5aaa76fe0cf96a6))
* **data-table:** Set progress indicator styles based on table body height ([c026422](https://github.com/material-components/material-components-web/commit/c0264227393df8eb9259a2b24c23b31fe0ca84f3))
* **dialog:** Add elevation overlay structure ([#5283](https://github.com/material-components/material-components-web/issues/5283)) ([b8bc4a2](https://github.com/material-components/material-components-web/commit/b8bc4a26ea70356cc96de8fd3266890048f0a3ab))
* **dom:** Add focus trap utility. ([#5505](https://github.com/material-components/material-components-web/issues/5505)) ([63f357d](https://github.com/material-components/material-components-web/commit/63f357dbf5c7e84c3961aafc09e0fb4f4a9c3cda))
* **dom:** Add keyboard support ([5f24faa](https://github.com/material-components/material-components-web/commit/5f24faacb1ef8996ae81f3a1c1e43910ba67b024))
* **dom:** Create announcer utility ([32c1df1](https://github.com/material-components/material-components-web/commit/32c1df133f07679b44ce34ed9d11e22035f8d3d9))
* **elevation:** Add elevation overlay mixins ([#5249](https://github.com/material-components/material-components-web/issues/5249)) ([b4cfdc4](https://github.com/material-components/material-components-web/commit/b4cfdc40b7c4a3d3fc48df2b68b7091552c27610))
* **elevation:** Update elevation mixins ([#5304](https://github.com/material-components/material-components-web/issues/5304)) ([ba879b6](https://github.com/material-components/material-components-web/commit/ba879b68bde09d713faa5cd77aea9d2bd2759e33))
* **fab:** Add elevation overlay structure ([#5278](https://github.com/material-components/material-components-web/issues/5278)) ([e89750d](https://github.com/material-components/material-components-web/commit/e89750dc78ea521561a03e020f4414479de5a5b9))
* **fab:** Add outline in high-contrast mode ([deda86d](https://github.com/material-components/material-components-web/commit/deda86d8cc4665b334c4d21c541a4a30244fee72))
* **fab:** Add support for increased touch target to mini FAB. ([#5231](https://github.com/material-components/material-components-web/issues/5231)) ([0c4d8f3](https://github.com/material-components/material-components-web/commit/0c4d8f3923f9a089132ed8dca4062b72d3576aca))
* **floating-label:** add feature targeting for styles ([#5287](https://github.com/material-components/material-components-web/issues/5287)) ([b240bcc](https://github.com/material-components/material-components-web/commit/b240bcc1bbb3cfd1f753918ec1553dbe1bb6d007))
* **form-field:** Add support for space-between ([e84b9c8](https://github.com/material-components/material-components-web/commit/e84b9c816d32da6dec058d92fc21dc5ac8fec787)), closes [#5747](https://github.com/material-components/material-components-web/issues/5747)
* **formfield:** add nowrap class/prop to MDC/MWC ([c4b4bba](https://github.com/material-components/material-components-web/commit/c4b4bba9659bf15207e79b1f63fcc9946404d9c7))
* **icon-button:** Add disabled state color mixins ([#5246](https://github.com/material-components/material-components-web/issues/5246)) ([7161170](https://github.com/material-components/material-components-web/commit/7161170f2e39b73b69b97dec11ebf94e1d3a10c4))
* **iconbutton:** Add icon button variant which supports toggling aria label. ([f838c6e](https://github.com/material-components/material-components-web/commit/f838c6e55672268de4e6e3b31b154d4f9050242f))
* **line-ripple:** add active/inactive states to line-ripple ([b6c7f62](https://github.com/material-components/material-components-web/commit/b6c7f624bc7d88e2e371efcb125c7a6bac55eab7))
* **line-ripple:** add feature targeting for styles ([#5292](https://github.com/material-components/material-components-web/issues/5292)) ([391674a](https://github.com/material-components/material-components-web/commit/391674a2649800f07e3ac1993a5fce157391fbd9))
* **linear-progress:** Add foundation methods to fetch progress and determinate state. ([4dc45af](https://github.com/material-components/material-components-web/commit/4dc45af6c4bc81f5734a24c160046d283c1e9a6d))
* **menu:** Add elevation overlay structure ([#5280](https://github.com/material-components/material-components-web/issues/5280)) ([7fd17ce](https://github.com/material-components/material-components-web/commit/7fd17ce5ed73c86b987c8a8e4cd08ea444fff8b7))
* **menu:** Add mixin to flatten menu top when opened-below anchor ([1e17c49](https://github.com/material-components/material-components-web/commit/1e17c49b360fd0e01c9a74b92978031534003b5b))
* **menu-surface:** Add support for flipping menu corner horizontally. ([7b44824](https://github.com/material-components/material-components-web/commit/7b448240263b45c6b474c2f758cd1c02f3c708ad))
* **notched-outline:** add feature targeting for styles ([#5289](https://github.com/material-components/material-components-web/issues/5289)) ([c483774](https://github.com/material-components/material-components-web/commit/c4837746ccebf375daa4c5dd891fea533bb134f7))
* **progress-indicator:** Add common interface for progress indicators ([#5564](https://github.com/material-components/material-components-web/issues/5564)) ([ea863cb](https://github.com/material-components/material-components-web/commit/ea863cb918b9c096e36a7bc653d6661757e71b64))
* **ripple:** Reorganize ripple opacities ([008c4d3](https://github.com/material-components/material-components-web/commit/008c4d3191f9c2a76732688504d2299420734cdd))
* **switch:** Add elevation overlay structure ([#5281](https://github.com/material-components/material-components-web/issues/5281)) ([50f110a](https://github.com/material-components/material-components-web/commit/50f110a6cf8100e594bdbd6c02ee278c39924008))
* **switch:** Restructure DOM ([#5312](https://github.com/material-components/material-components-web/issues/5312)) ([0ec1fab](https://github.com/material-components/material-components-web/commit/0ec1fabc39222cac4446c8e2b85d74d2a5d21e1a))
* **text-field:** Add disabled state color mixins ([#5208](https://github.com/material-components/material-components-web/issues/5208)) ([66299b6](https://github.com/material-components/material-components-web/commit/66299b64613e8399af263d7021f93f9cdaf74ae3))
* **text-field:** add feature targeting for styles ([#5378](https://github.com/material-components/material-components-web/issues/5378)) ([e8a9936](https://github.com/material-components/material-components-web/commit/e8a993677858893965608a55931d7e54c84e8c5d))
* **text-field:** Truncate floating label width w/ icons ([c141801](https://github.com/material-components/material-components-web/commit/c141801d50516a18fe53d4bc78591cefb4f57623))
* **textfield:** add end-alignment ([#5356](https://github.com/material-components/material-components-web/issues/5356)) ([847dd1a](https://github.com/material-components/material-components-web/commit/847dd1ada08bb0fd905adac7b7836540a0dd7e9c))
* **textfield:** add filled class variant ([b70bc60](https://github.com/material-components/material-components-web/commit/b70bc601ef570dab4598ae6f3ca51bbf884fac96))
* **textfield:** add forced LTR input ([490fbdc](https://github.com/material-components/material-components-web/commit/490fbdc092c5c59d63f83407b83b37fb524ed0e5))
* **textfield:** add prefix and suffix ([6601d24](https://github.com/material-components/material-components-web/commit/6601d24afdc3a3d0bd2a9b3fcca68c35c9415ec1)), closes [#1892](https://github.com/material-components/material-components-web/issues/1892)
* Add index stylesheets to each MDC Web package ([#5539](https://github.com/material-components/material-components-web/issues/5539)) ([1814866](https://github.com/material-components/material-components-web/commit/181486643532e2166dced95daff9da786af3bdd1))
* Add index stylesheets to mdc-image-list and mdc-layout-gr… ([#5546](https://github.com/material-components/material-components-web/issues/5546)) ([3a85313](https://github.com/material-components/material-components-web/commit/3a85313ac121703e8aeac583502adf9863d96a8e))
* Use [@use](https://github.com/use) syntax in material-components-web Sass file and… ([#5573](https://github.com/material-components/material-components-web/issues/5573)) ([b4727e4](https://github.com/material-components/material-components-web/commit/b4727e43aa17afe03b240402ded590c0516267d5))
* **textfield:** add specific label-floating class ([a88c8e4](https://github.com/material-components/material-components-web/commit/a88c8e4dc873ae74a3afbae0dc8635dfaa03e67b))
* **textfield:** allow character counter to be moved outside of the textarea. ([84e7ed5](https://github.com/material-components/material-components-web/commit/84e7ed5825d3109c229d0f1f6c3edf97a3548226))
* **textfield:** Create float transition mixin ([ca61b65](https://github.com/material-components/material-components-web/commit/ca61b656fababdf25adaa307963d4f37e6d413ec))
* **textfield:** Limit notched outline max-width ([0ab62a6](https://github.com/material-components/material-components-web/commit/0ab62a65b17192a94102231ca63f54adc39675ae))
* **typography:** add container baseline mixins for flexbox ([69edc6e](https://github.com/material-components/material-components-web/commit/69edc6e2899636cfccb117376bb64dc0a267c588))


### Reverts

* Revert "feat(switch): Add elevation overlay structure (#5281)" (#5329) ([1fbf5bd](https://github.com/material-components/material-components-web/commit/1fbf5bd1d84b7b02eb7f0a7aff2b9c3eed0b4d3d)), closes [#5281](https://github.com/material-components/material-components-web/issues/5281) [#5329](https://github.com/material-components/material-components-web/issues/5329)
* "fix(checkbox): change checkbox event type from change to click and add some logic for IE browser" ([ba30399](https://github.com/material-components/material-components-web/commit/ba30399adc901ca090c90bb1cad9410c81ae5fd1))
* feat(chips): Consolidate interaction event handlers ([#5251](https://github.com/material-components/material-components-web/issues/5251)) ([#5301](https://github.com/material-components/material-components-web/issues/5301)) ([5e45d77](https://github.com/material-components/material-components-web/commit/5e45d77f3e387eff356f5ce93336d4b872c725c4))
* fix(chips): Do not throw error if chip set becomes empty ([#5300](https://github.com/material-components/material-components-web/issues/5300)) ([d10e8cd](https://github.com/material-components/material-components-web/commit/d10e8cdf3cda4a735b1ae43bb17592f9383c8886))
* fix(select): Do not fire change event on programmatic change ([#5255](https://github.com/material-components/material-components-web/issues/5255)) ([#5302](https://github.com/material-components/material-components-web/issues/5302)) ([ad9dfe7](https://github.com/material-components/material-components-web/commit/ad9dfe706de46d5dc131ad6615aa18f0e3b01133))


### BREAKING CHANGES

* **select:** HTML Markup significantly changed, see README; REMOVED adapter methods `isSelectedTextFocused`, `getSelectedTextAttr`, `setSelectedTextAttr`; ADDED adapter methods `isSelectAnchorFocused`, `getSelectAnchorAttr`, `setSelectAnchorAttr`; removed variables `outlined-dense-label-position-y`, `icon-padding`; added variables `minimum-height-for-filled-label`, `filled-baseline-top`, `selected-text-height`, `anchor-padding-left`, `anchor-padding-left-with-leading-icon`, `anchor-padding-right`.
* **text-field:** Redundant mixins `mdc-text-field-textarea-fill-color`, `mdc-text-field-textarea-stroke-color`, `mdc-text-field-fullwidth-bottom-line-color` removed. Instead, use `mdc-text-field-fill-color`, `mdc-text-field-outline-color`, and `mdc-text-field-bottom-line-color` respectively to achieve the same effect.
* **textfield:** mdc-text-field--dense and associated mixins/variables have been removed. Use the density() mixin instead.
* **textfield:** removed the following variables: `$input-padding`, `$input-padding-top`, `$input-padding-bottom`, `$outlined-input-padding-top`, `$outlined-input-padding-bottom`, `$input-border-bottom`
* **linear-progress:** DOM for linear progress buffer changed. MDCLinearProgressAdapter method `getBuffer`, `getPrimaryBar`, `setStyle` removed. MDCLinearProgressAdapter method `setBufferBarStyle`, `setPrimaryBarStyle` added.
* **linear-progress:** DOM for linear progress buffer changed. MDCLinearProgressAdapter method `getBuffer`, `getPrimaryBar`, `setStyle` removed. MDCLinearProgressAdapter method `setBufferBarStyle`, `setPrimaryBarStyle` added.
* **typography:** `typography.baseline-top()` and `typography.baseline-bottom()` are now private. Use `typography.baseline()` for containers and `typography.text-baseline()` for text with $top and $bottom params.
* **chips:** The touch target and text now appear inside the primary action element. Please see the readme for markup changes.
* **textfield:** filled text fields must include a `<div class="mdc-text-field__ripple"></div>`
* **textfield:** Filled textfields will no longer show a floating label at certain densities. This can be overridden by setting `$mdc-text-field-minimum-height-for-filled-label: 40px`
* **chips:** Both `MDCChipAdapter` and `MDCChipSetAdapter` have new methods. `MDCChipSetFoundation` event handlers now accept the corresponding chip event detail interface as the sole argument. The `root` property has been removed from the `MDCChipRemovalEventDetail` interface.
* **line-ripple:** `mdc-line-ripple-color()` mixin has been renamed to `mdc-line-ripple-active-color()`
* **textfield:** Default textfields must now specify mdc-text-field--filled. Disabled outlined textfields no longer have a shaded background. Height mixin no longer specifies a baseline override, use typography's baseline-top mixin.

* Four variables and a mixin in mdc-textfield were renamed to use a mdc-text-field- prefix when depended on via @import (formerly mdc-required-text-field-label-asterisk_, now required-label-asterisk_).
* **textfield:** icons must use `.mdc-text-field__icon--leading` or `.mdc-text-field__icon--trailing` classes. `mdc-text-field-icon-color()` mixin has been split into `mdc-text-field-leading-icon-color()` and `mdc-text-field-trailing-icon-color()`.
* **switch:** Added setNativeControlAttr method in mdc-switch adapter.
* **checkbox:** remove event listener for 'change' and add event listener for 'click'.
- Add handleClick() method in foundation to handle click event.
- Add setCheck() method into component to change check status.
* **switch:** Switch DOM structure has changed. See switch README for details
* **button:** Variable `$mdc-button-disabled-container-fill-color`
renamed to `$mdc-button-disabled-container-color`.
* Removed `$edgeOptOut` option from `mdc-theme-prop()` Sass mixin.
* **chips:** the handleInteraction and handleTrailingIconInteraction handlers have been removed from the MDCChipFoundation. The handleClick handler has been added to the MDCChipFoundation
* Adds new adapter methods to MDCLinearProgressAdapter.
* **elevation:** Functions moved into the _functions.scss file
* **touchtarget:** Renames mixin from mdc-touch-target-component => mdc-touch-target-margin
* **grid-list:** Per the deprecation notice for grid-list, this component has been
removed from MDC-Web. Some of its functionalities are available in the MDC Image List package instead. It is recommended that you migrate to the mdc-image-list package to continue to receive new features and updates.


# 4.0.0 (2019-11-02)

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

**Note: For older changes, see the [changelog archive](CHANGELOG_ARCHIVE.md).**
