# Local Development

Use this document to run demos for local development of Material Components Web project.

## Create demo assets

Create `demo/` folder inside component package folder that you're working on. For example, `packages/mdc-checkbox/demo/`

### HTML

Add HTML structure to required to render component (Copy HTML structure from component README files).

Sample HTML structure for checkbox:

```html
<div class="mdc-form-field">
  <div class="mdc-checkbox">
    <input type="checkbox"
           class="mdc-checkbox__native-control"
           id="checkbox-1"/>
    <div class="mdc-checkbox__background">
      <svg class="mdc-checkbox__checkmark"
           viewBox="0 0 24 24">
        <path class="mdc-checkbox__checkmark-path"
              fill="none"
              d="M1.73,12.91 8.1,19.28 22.79,4.59"/>
      </svg>
      <div class="mdc-checkbox__mixedmark"></div>
    </div>
    <div class="mdc-checkbox__ripple"></div>
  </div>
  <label for="checkbox-1">Checkbox 1</label>
</div>

<script type="module" src="./index.ts"></script>
```

We'll create demo `index.ts` file in following steps.

### Sass

Include Sass files required to style target components using relative path (relative to `demo/` folder).

```scss
@use "../../mdc-form-field/mdc-form-field";
@use "../mdc-checkbox";
```

### TypeScript

```ts
import {MDCFormField} from '../../mdc-form-field/component';
import {MDCCheckbox} from '../component';

const checkboxEl = document.querySelector<HTMLElement>('.mdc-checkbox');
const formFieldEl = document.querySelector<HTMLElement>('.mdc-form-field');

if (checkboxEl && formFieldEl) {
  const checkbox = new MDCCheckbox();
  const formField = new MDCFormField();
  formField.input = checkbox;
}
```

## Run dev server

We'll use [Parcel.js](https://parceljs.org) bundler to compile & run dev server. Use `index.html` created above as entry point to parcel bundler CLI.

```shell
npm i
npx parcel packages/mdc-checkbox/demo/index.html
```

Now open http://localhost:1234/ in your browser.
