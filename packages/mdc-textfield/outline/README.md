<!--docs:
title: "Text Field Outline"
layout: detail
section: components
excerpt: "The outline is a border around the text field"
iconId: text_field
path: /catalog/input-controls/text-fields/outline/
-->

# Text Field Outline

The outline is a border around all sides of the text field. This is used for the Outlined variation of Text Fields.

## Design & API Documentation

<ul class="icon-list">
  <li class="icon-list-item icon-list-item--spec">
    <a href="https://material.io/guidelines/components/text-fields.html#text-fields-field-variations">Material Design guidelines: Text Field Variations</a>
  </li>
</ul>

## Usage

#### MDCTextFieldOutline API

##### MDCTextFieldOutline.foundation

MDCTextFieldOutlineFoundation. This allows the parent MDCTextField component to access the public methods on the MDCTextFieldOutlineFoundation class.

### Using the foundation class

Method Signature | Description
--- | ---
getWidth() => number | Returns the width of the outline element
getHeight() => number | Returns the height of the outline element
setOutlinePathAttr(value: string) => void | Sets the "d" attribute of the outline element's SVG path

#### The full foundation API

##### MDCTextFieldOutlineFoundation.updateSvgPath(width: number, height: number, labelWidth: number, radius: number, isRtl: boolean)

Updates the SVG path of the focus outline element based on the given width and height of the text field element, the width of the label element, the corner radius, and the RTL context.
