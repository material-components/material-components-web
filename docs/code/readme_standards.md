# README Standards

MDC Web component documentation serves two purposes:

* Populate the [Catalog Site](https://material.io/components/web/catalog/)
* Highlight how to use our APIs, for our external developers.

## README Template

Please follow the [README template](readme_template.md) *exactly*. This format is
read/understood by the [Catalog Site](https://material.io/components/web/catalog/)

## Basic Usage

The 'Basic Usage' section documents the bare minimum to get the most basic version of this component up and running, including:
* HTML structure
* Style import
* JavaScript import and instantiation, if applicable

~~~
### HTML Structure

```html
<button class="mdc-button">Foo</button>
```
~~~

In the 'Styles' subsection, include any mixin invocations necessary to make the component look as desired.
~~~
### Styles

```scss
@import "@material/button/mdc-button";

// Include necessary mixin invocations here
```
~~~

In the 'JavaScript Instantiation' subsection, include a note about importing a JavaScript component with a link to our importing documentation.
~~~
### JavaScript Instantiation

```js
import {MDCButton} from '@material/button';

const button = new MDCButton(document.querySelector('.mdc-button'));
```

>See [Importing the JS component](../../docs/importing-js.md) for more information on how to import JavaScript.
~~~

## Variants

If the component has variants, add a subsection for each variant, under the 'Variants' section. Include a short description of the variant along with the necessary HTML structure.

~~~
### Foo Button

Short description of Foo Button.

```html
<button class="mdc-button mdc-button--foo">Foo</button>
```
~~~

## Style Customization

CSS Classes are documented in a [tabular format](#tabular-format).

~~~
### CSS Classes

CSS Class | Description
--- | ---
`mdc-foo` | Indicates the foo
~~~

Sass mixins are documented in [tabular format](#tabular-format).

~~~
### Sass Mixins

Mixin | Description
--- | ---
`mdc-foo($value)` | Sets the foo
~~~

Add a section for additional information if applicable.

~~~
### Additional Information

#### Some special case

Explanation of this special case.
~~~

## `MDCComponent` Properties and Methods

This section documents the properties and methods of the vanilla JS component class, e.g. `MDCButton`. They are documented in [tabular format](#tabular-format).

~~~
Property | Value Type | Description
--- | --- | ---
`foo` | String | Proxies to the foundation's `getFoo`/`setFoo` methods
~~~

~~~
Method Signature | Description
--- | ---
`doFoo() => void` | Does the foo
~~~

## Usage within Web Frameworks

This section documents usage of the Adapter and the Foundation. Methods are documented in a [tabular format](#tabular-format).

~~~
#### `MDCTextFieldAdapter`

Method Signature | Description
--- | ---
`getFoo() => string` | Returns the foo
~~~

~~~
#### `MDCTextFieldFoundation`

Method Signature | Description
--- | ---
`getBar() => string` | Returns the bar
~~~

## Tabular format

The tabular format is meant to

* Keep documentation short
* Facilitate showing changes in APIs, through row diffs

All tables should follow this pattern:

```
<COLUMN_NAME> | Description
--- | ---
<INLINE_CODE> | <ONE_LINE_DESCRIPTION>
```

* `COLUMN_NAME` should be title case, e.g. Method Signature
* `INLINE_CODE` should always be formatted as inline code, e.g. `foo`
* `ONE_LINE_DESCRIPTION` should not be more than one line long

If you need more than one sentence to describe code, create a row with a
summary description. Then create a note below the table with the longer description, formatted in this way:

~~~
>_NOTE_: This is the long description.
~~~

Do not add multiple sentences to the tabular format, as this will make the table more difficult to read.
