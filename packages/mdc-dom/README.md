<!--docs:
title: "DOM"
layout: detail
section: components
excerpt: "DOM manipulation utilities."
path: /catalog/dom/
-->

# DOM

MDC DOM contains ... TODO

Most of the time, you shouldn't need to depend on `mdc-dom` directly. It is useful however if you'd like to write custom components that follow MDC Web's pattern and elegantly integrate with the MDC Web ecosystem.

## Installation

First install the module:

```
npm install @material/dom
```

Then include it in your code in one of the following ways:

#### ES2015+

```javascript
import {matches} from '@material/dom/ponyfill';
```

#### CommonJS

```javascript
const {matches} = require('@material/dom/ponyfill');
```

#### AMD

```javascript
require(['path/to/mdc-dom/ponyfill'], function(ponyfill) {
  const matches = ponyfill.matches;
});
```

#### Vanilla

```javascript
const matches = mdc.dom.ponyfill.matches;
```

## Usage

TODO
