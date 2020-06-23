# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

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
