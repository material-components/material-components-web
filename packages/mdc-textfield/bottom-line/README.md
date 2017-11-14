<!--docs:
title: "Text Field Bottom Line"
layout: detail
section: components
excerpt: "The bottom line indicates where to enter text, displayed below the label"
iconId: text_field
path: /catalog/input-controls/text-fields/bottom-line/
-->

# Text Field Bottom Line

The bottom line indicates where to enter text, displayed below the label. When a text field is active or contains an error, the line’s color and thickness vary.

## Design & API Documentation

<ul class="icon-list">
  <li class="icon-list-item icon-list-item--spec">
    <a href="https://material.io/guidelines/components/text-fields.html#text-fields-layout">Material Design guidelines: Text Fields Layout</a>
  </li>
</ul>


## Usage

#### MDCTextFieldBottomLine API

##### MDCTextFieldBottomLine.foundation

MDCTextFieldBottomLineFoundation. This allows the parent MDCTextField component to access the public methods on the MDCTextFieldBottomLineFoundation class.

### Using the foundation class


Method Signature | Description
--- | ---
addClass(className: string) => void | Adds a class to the root element
removeClass(className: string) => void | Removes a class from the root element
setAttr(attr: string, value: string) => void | Sets an attribute with a given value on the root element
registerEventHandler(evtType: string, handler: EventListener) => void | Registers an event listener on the root element for a given event
deregisterEventHandler(handler: EventListener) => void | Deregisters an event listener on the root element for a given event
notifyAnimationEnd() => void | Emits a custom event "MDCTextFieldBottomLine:animation-end" denoting the bottom line has finished its animation; either the activate or deactivate animation |

#### The full foundation API

##### MDCTextFieldBottomLineFoundation.activate()

Activates the bottom line

##### MDCTextFieldBottomLineFoundation.deactivate()

Deactivates the bottom line

##### MDCTextFieldBottomLineFoundation.setTransformOrigin(evt: Event)

Sets the transform origin given a user's click location.

##### MDCTextFieldBottomLineFoundation.handleTransitionEnd(evt: Event)

Handles a transition end event
