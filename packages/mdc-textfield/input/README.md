<!--docs:
title: "Text Field Input"
layout: detail
section: components
excerpt: "The input element is where the user enters text"
iconId: input
path: /catalog/input-controls/text-fields/input/
-->

# Text Field Input

The input element is where the user enters text.

## Design & API Documentation

<ul class="icon-list">
  <li class="icon-list-item icon-list-item--spec">
    <a href="https://material.io/guidelines/components/text-fields.html#text-fields-field-types">Material Design guidelines: Text Field Types</a>
  </li>
</ul>


## Usage

#### MDCTextFieldInput API

##### MDCTextFieldInput.foundation

MDCTextFieldInputFoundation. This allows the parent MDCTextField component to access the public methods on the MDCTextFieldInputFoundation class.

### Using the foundation class

Method Signature | Description
--- | ---
`registerEventHandler(evtType: string, handler: EventListener) => void` | Registers an event listener on the input element for a given event
`deregisterEventHandler(evtType: string, handler: EventListener) => void` | Deregisters an event listener on the input element for a given event
`getNativeInput() => {value: string, disabled: boolean, badInput: boolean, checkValidity: () => boolean}?` | Returns an object representing the native text input element, with a similar API shape. The object returned should include the `value`, `disabled` and `badInput` properties, as well as the `checkValidity()` function. We _never_ alter the value within our code, however we _do_ update the disabled property, so if you choose to duck-type the return value for this method in your implementation it's important to keep this in mind. Also note that this method can return null, which the foundation will handle gracefully.
`notifyFocusAction() => void` | Emits a custom event "MDCTextFieldInput:focus" denoting the input is focused
`notifyBlurAction() => void` | Emits a custom event "MDCTextFieldInput:blur" denoting the input is blurred
`notifyPressedAction() => void` | Emits a custom event "MDCTextFieldInput:pressed" denoting the input is pressed

#### The full foundation API

##### MDCTextFieldInputFoundation.isBadInput() => boolean

True if the input fails validity checks.

##### MDCTextFieldInputFoundation.getValue() => string

Returns the value in the input.

##### MDCTextFieldInputFoundation.checkValidity() => boolean

Returns the result of the checkValidity() call in the native input.

##### MDCTextFieldInputFoundation.isDisabled() => boolean

True if the input is disabled.

##### MDCTextFieldInputFoundation.setDisabled(disabled)

Sets the input disabled or enabled.

##### MDCTextFieldInputFoundation.setReceivedUserInput(receivedUserInput)

Sets whether user input was received.