<!--docs:
title: "Chips"
layout: detail
section: components
excerpt: "Chips are compact elements that represent an attribute, text, entity, or action."
iconId: chip
path: /catalog/chips/
-->

# Chips

**Contents**

* [Using chip](#using-chips)
* [Chips](#chips)
* [API](#api)

>Looking for deprecated chips resources? Visit the [deprecated readme](deprecated/README.md).

## Using chips

Chips are compact elements that allow users to enter information, select a choice, filter content, or trigger an action. Chips must always be used inside a chip set.

### Installing chips

```
npm install @material/chips
```

### Styles

```scss
@use "@material/chips/styles";
```

### JavaScript instantiation

**Note**: there's work planned to replace the `mdc-evolution-*` prefix of chips with the standard `mdc-chip-*` prefix.

```js
import {MDCChipSet} from '@material/chips';
const chipset = new MDCChipSet(document.querySelector('.mdc-evolution-chip-set'));
```

## Chips

Chips are comprised of [chip sets](./chip-set) which are comprised of [chip](./chip) instances which are in turn comprised of [actions](./action). See the readme for each subcomponent for more detail.

### Basic action chip set example

```html
<span class="mdc-evolution-chip-set" role="grid">
  <span class="mdc-evolution-chip-set__chips" role="presentation">
    <span class="mdc-evolution-chip" role="row" id="c0">
      <span class="mdc-evolution-chip__cell mdc-evolution-chip__cell--primary" role="gridcell">
        <button class="mdc-evolution-chip__action mdc-evolution-chip__action--primary" type="button" tabindex="0">
          <span class="mdc-evolution-chip__ripple mdc-evolution-chip__ripple--primary"></span>
          <span class="mdc-evolution-chip__text-label">Chip one</span>
        </button>
      </span>
    </span>
    <span class="mdc-evolution-chip" role="row" id="c1">
      <span class="mdc-evolution-chip__cell mdc-evolution-chip__cell--primary" role="gridcell">
        <button class="mdc-evolution-chip__action mdc-evolution-chip__action--primary" type="button" tabindex="-1">
          <span class="mdc-evolution-chip__ripple mdc-evolution-chip__ripple--primary"></span>
          <span class="mdc-evolution-chip__text-label">Chip two</span>
        </button>
      </span>
    </span>
  </span>
</span>
```

## API

See the readme of each subcomponent for more detail.

- [Chip set API](./chip-set#api)
- [Chip API](./chip#api)
- [Action API](./action#api)

### Usage within frameworks

If you are using a JavaScript framework, such as React or Angular, you can create chips for your framework. Depending on your needs, you can use the _Simple Approach: Wrapping MDC Web Vanilla Components_, or the _Advanced Approach: Using Foundations and Adapters_. Please follow the instructions [here](../../../docs/integrating-into-frameworks.md).
