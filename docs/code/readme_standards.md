# README Standards

MDC Web component documentation serves two purposes:

* Populate the [Catalog Site](https://material.io/components/web/catalog/)
* Highlight how to use our APIs, for our external developers (see Usage section)

> Developers should not have to read our code to know how to use our APIs

## README Template

Please follow the [README template](readme_template.md) *exactly*. This format is
read/understood by the [Catalog Site](https://material.io/components/web/catalog/)

## Usage

Under the 'Usage' section, you will document all

* HTML Structure
* CSS Classes
* JavaScript
* Sass Variables and Mixins

### HTML Structure

HTML Structure is documented with a code snippet, e.g.

```html
<button class="mdc-button">Foo</button>
```

Any additional optional HTML should be documented in separate code snippets.

### CSS Classes

CSS Classes are documented in a [tabular format](#tabular-format)

```
CSS Class | Description
--- | ---
`mdc-foo` | Sets the foo
```

Remember to document `<COMPONENT_NAME>--theme-dark` CSS class if the component
changes its appearance in Dark Theme context.

### JavaScript

TODO: Finalize standards for documenting JavaScript

### Sass Variables and Mixins

Sass variables are documented in a tabular format (See Tabular Format section).

```
Variable | Description
--- | ---
`mdc-foo` | Default foo
```

Sass mixins, including their method signature, are documented in a
tabular format (See Tabular Format section).

```
Mixin | Description
--- | ---
`mdc-foo($value)` | Sets the foo
```

### Tabular format

The tabular format is meant to

* Keep documentation short
* Facilitate showing changes in APIs, through row diffs

All tables should follow this pattern:

```
<COLUMN_NAME> | Description
--- | ---
<INLINE_CODE> | <ONE_SENTENCE_DESCRIPTION>
```

* `COLUMN_NAME` should be title case
* `INLINE_CODE` should always be formatted as inline code
* `ONE_SENTENCE_DESCRIPTION` is one sentence

If you need more than one sentence to describe code, then create a row with a
summary description. Then create another subsection below the table, titled
with `INLINE_CODE`, and write the longer description in this section. Do not
add multiple sentences to the tabular format, as this will make the table more
difficult to read.

If a table feels too long, and there is a pattern to the rows, you can use an
uppercase angled brackets, e.g. `<FOO>` format to explain the pattern. Add a
note above the table detailing what the uppercase angled brackets means,
including an example of a valid pattern match.
