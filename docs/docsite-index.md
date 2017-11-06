---
# This file is used by the docsite to generate the platform index page.
title: "Material Components for the Web"
layout: "homepage"
path: /
---

{% contentfor benefits %}
<ul class="benefits-list">
  <li class="benefits-list-item">
    <h3>Accurate &amp; up to date</h3>
    <p>Implement <a href="https://material.io/guidelines">Material Design</a> with pixel-perfect components, maintained by Google engineers and designers</p>
  </li>
  <li class="benefits-list-item">
    <h3>Seamless integrations</h3>
    <p>Use components designed to work in any context, allowing seamless integration with libraries like React, AngularJS, and server-side rendering</p>
  </li>
  <li class="benefits-list-item">
    <h3>Industry standards</h3>
    <p>Take advantage of components developed with minimal dependencies and tested for flexibility, accessibility, and internationalization</p>
  </li>
</ul>
{% endcontentfor %}

# Getting Started

Get up and running with Material Components for web

1.  {: .step-list-item } ### Install the library

    Start by installing the library from [npm](https://npmjs.com):

    ```
    npm install --save material-components-web
    ```

2.  {: .step-list-item } ### Include the stylesheet
    
    Include the MDC-Web stylesheet in the head of your file
    
    ```html
    <html class="mdc-typography">
      <head>
        <title>Material Components for the web</title>
        <link rel="stylesheet"
              href="node_modules/material-components-web/dist/material-components-web.css">
      </head>
    ```

3.  {: .step-list-item } ### Add components

    Add components to the body of your HTML

    ```html
      <body>
        <h2 class="mdc-typography--display2">Hello, Material Components!</h2>
        <div class="mdc-text-field" data-mdc-auto-init="MDCTextField">
          <input type="text" class="mdc-text-field__input" id="demo-input">
          <label for="demo-input" class="mdc-text-field__label">Tell us how you feel!</label>
        </div>
      </body>
    ```

4.  {: .step-list-item } ### Add scripts and instantiate

    Add the MDC-Web scripts and call MDC Auto Init. 

    ```html
    <script src="node_modules/material-components-web/dist/material-components-web.js"></script>
    <script>mdc.autoInit()</script>
    ```

    A full example of the HTML could look like this:
    
    ```html
    <!DOCTYPE html>
    <html class="mdc-typography">
      <head>
        <title>Material Components for the web</title>
        <link rel="stylesheet"
              href="node_modules/material-components-web/dist/material-components-web.css">
      </head>
      <body>
        <h2 class="mdc-typography--display2">Hello, Material Components!</h2>
        <div class="mdc-text-field" data-mdc-auto-init="MDCTextField">
          <input type="text" class="mdc-text-field__input" id="demo-input">
          <label for="demo-input" class="mdc-text-field__label">Tell us how you feel!</label>
        </div>
        <script src="node_modules/material-components-web/dist/material-components-web.js"></script>
        <script>mdc.autoInit()</script>
      </body>
    </html>
    ```

5.  {: .step-list-item } ### What's next?

    <ul class="icon-list">
      <li class="icon-list-item icon-list-item--guide">
        <a href="getting-started.md">Read the Getting Started Guide</a>
      </li>
      <li class="icon-list-item icon-list-item--components">
        <a href="../packages">View the Component Documentation</a>
      </li>
      <li class="icon-list-item icon-list-item--github">
        <a href="https://github.com/material-components/material-components-web/">View the project on GitHub</a>
      </li>
    </ul>
{: .step-list }
