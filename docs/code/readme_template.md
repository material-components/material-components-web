# README Template

Copy the snippet and replace the following

* Component name related
  * `COMPONENT_TITLE`, title case of the component, e.g. Layout Grid
  * `COMPONENT_ID`, lower dash case name of the component, e.g. layout-grid
  * `COMPONENT_NAME`, capitalized name of the component, e.g. Layout grid
  * `MODULE_NAME`, name of the Node module, e.g. layout-grid
* [Spec](https://material.io/guidelines) related
  * `ONE_SENTENCE_FROM_SPEC`, explaining what
the component is
  * `LINK_TO_SPEC`, link to spec, the same article you copied the one sentence from
  * `NAME_OF_ARTICLE`, name of the article in spec
* [Catalog site](https://material.io/components/web/catalog/) related
  * `SHORT_EXCERPT`, short excerpt about the component
  * `ICON_ID`, id for the icon representing the component
  * `SCREENSHOT_NAME`, name of the screenshot image of the component
  * `SCREENSHOT_WIDTH`, width of the screenshot image of the component
* `LINK_TO_CATALOG_SERVER`, link to a page on [Catalog Server](https://material-components-web.appspot.com/)
* `USAGE_SECTIONS`, see [Usage standards](readme_standards.md)

TODO: Come up with best practices for Catalog site related fields

~~~
<!--docs:
title: "<COMPONENT_TITLE>"
layout: detail
section: components
excerpt: "<SHORT_EXCERPT>"
iconId: <ICON_ID>
path: /catalog/<COMPONENT_ID>/
-->

# <COMPONENT_TITLE>

<!--<div class="article__asset">
  <a class="article__asset-link"
     href="<LINK_TO_CATALOG_SERVER>">
    <img src="{{ site.rootpath }}/images/mdc_web_screenshots/<SCREENSHOT_NAME>.png"
    width="<SCREENSHOT_WIDTH>" alt="<COMPONENT_NAME> screenshot">
  </a>
</div>-->

<ONE_SENTENCE_FROM_SPEC>

## Design & API Documentation

<ul class="icon-list">
  <li class="icon-list-item icon-list-item--spec">
    <a href="<LINK_TO_SPEC>">Material Design guidelines: <NAME_OF_ARTICLE></a>
  </li>
  <li class="icon-list-item icon-list-item--link">
    <a href="<LINK_TO_CATALOG_SERVER>">Demo</a>
  </li>
</ul>

## Installation

```
npm install --save @material/<MODULE_NAME>
```

## Usage

<USAGE_SECTIONS>
~~~
