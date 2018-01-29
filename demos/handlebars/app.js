
var buttonExampleList = require('./button-example-list.handlebars');

document.addEventListener('DOMContentLoaded', function() {
  var div = document.createElement('div');
  div.innerHTML = buttonExampleList({
    demo: [
      {
        name: 'Text Button',
        baseStyle: 'mdc-button',
        states: [
          {
            name: 'Baseline',
            style: '',
          }, {
            name: 'Compact',
            style: 'mdc-button--compact',
          }, {
            name: 'Dense',
            style: 'mdc-button--dense',
          }, {
            name: 'Secondary',
            style: 'secondary-text-button',
          }],
        icon: true,
        link: true,
      },
      {
        name: 'Raised Button',
        baseStyle: 'mdc-button mdc-button--raised',
        states: [
          {
            name: 'Baseline',
            style: '',
          }, {
            name: 'Compact',
            style: 'mdc-button--compact',
          }, {
            name: 'Dense',
            style: 'mdc-button--dense',
          }, {
            name: 'Secondary',
            style: 'secondary-filled-button',
          }],
        icon: true,
        link: true,
      },
      {
        name: 'Unelevated Button (Experimental)',
        baseStyle: 'mdc-button mdc-button--mdc-button--unelevated',
        states: [
          {
            name: 'Baseline',
            style: '',
          }, {
            name: 'Compact',
            style: 'mdc-button--compact',
          }, {
            name: 'Dense',
            style: 'mdc-button--dense',
          }, {
            name: 'Secondary',
            style: 'secondary-filled-button',
          }],
        icon: true,
        link: true,
      },
      {
        name: 'Stroked Button (Experimental)',
        baseStyle: 'mdc-button mdc-button--mdc-button--stroked',
        states: [
          {
            name: 'Baseline',
            style: '',
          }, {
            name: 'Compact',
            style: 'mdc-button--compact',
          }, {
            name: 'Dense',
            style: 'mdc-button--dense',
          }, {
            name: 'Secondary',
            style: 'secondary-filled-button',
          }],
        icon: true,
        link: true,
      },
      {
        name: 'Custom button (Experimental)',
        baseStyle: 'mdc-button',
        states: [
          {
            name: 'Corder Radius',
            style: 'mdc-button--unelevated big-round-corner-button',
          }, {
            name: 'Thick Stroke Width',
            style: 'mdc-button--stroked thick-stroke-button',
          }],
      },
    ],
  });

  document.body.appendChild(div);
});
