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
```html```
<button class="mdc-fab material-icons">
  <span class="mdc-fab__icon">
    favorite_border
  </span>
</button>
```



