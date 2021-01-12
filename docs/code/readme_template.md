# README Template

Copy the snippet and replace the following

* Component name related
  * `COMPONENT_TITLE`: title case of the component, e.g. Layout Grid
  * `COMPONENT_ID`: lower dash case name of the component, e.g. layout-grid
  * `COMPONENT_NAME`: capitalized name of the component, e.g. Layout grid
  * `MODULE_NAME`: name of the Node module, e.g. layout-grid
  * `JS_COMPONENT_NAME`: name of the JS component class, e.g. MDCLayoutGrid
* [Spec](https://material.io/guidelines) related
  * `ONE_SENTENCE_FROM_SPEC`: explaining what the component is
  * `LINK_TO_SPEC`, link to spec: the same article you copied the one sentence from
  * `NAME_OF_ARTICLE`: name of the article in spec
* [Catalog site](https://material.io/components/web/catalog/) related
  * `SHORT_EXCERPT`: short excerpt about the component
  * `ICON_ID`: id for the icon representing the component
  * `SCREENSHOT_NAME`: name of the screenshot image of the component
  * `SCREENSHOT_WIDTH`: width of the screenshot image of the component
  * `LINK_TO_CATALOG_SERVER`: link to the component page on [Catalog](https://material-components.github.io/material-components-web-catalog/)
* Usage sections
  * `BASIC_USAGE_SECTION`: see [README standards on Basic Usage](readme_standards.md#basic-usage)
  * `VARIANTS_SECTION`: see [README standards on Variants](readme_standards.md#variants)
  * `STYLE_CUSTOMIZATION_SECTION`: see [README standards on Style Customization](readme_standards.md#style-customization)
  * `MDC_COMPONENT_SECTION`: see [README standards on `MDCComponent` Properties and Methods](readme_standards.md#mdccomponent-properties-and-methods)
  * `FRAMEWORKS_SECTION`: see [README standards on Usage within Web Frameworks](readme_standards.md#usage-within-web-frameworks)

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
npm install @material/<MODULE_NAME>
```

## Basic Usage

<BASIC_USAGE_SECTION>

## Variants

<VARIANTS_SECTION>

## Style Customization

<STYLE_CUSTOMIZATION_SECTION>

## `<JS_COMPONENT_NAME>` Properties and Methods

<MDC_COMPONENT_SECTION>

## Usage within Web Frameworks

If you are using a JavaScript framework, such as React or Angular, you can create a <COMPONENT_NAME> for your framework. Depending on your needs, you can use the _Simple Approach: Wrapping MDC Web Vanilla Components_, or the _Advanced Approach: Using Foundations and Adapters_. Please follow the instructions [here](../../docs/integrating-into-frameworks.md).

<FRAMEWORKS_SECTION>
~~~
