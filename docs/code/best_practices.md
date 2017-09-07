# Best Practices

MDC Web follows naming and documentation best practices to keep our code
consistent, and our APIs user friendly. We follow isolation best practices to
keep our code loosely coupled. And we follow performace best practices to keep
our components fast.

### Naming

*  Match [spec](https://material.io/guidelines) whenever possible. If the nomenclature used in spec conflicts with a natively implemented element or pattern, reach out for guidance
*  Use the [BEM naming convention](http://getbem.com/naming/) for CSS classes

### Documentation

* Keep documentation short, don't use ten words when one will do
* Let Material Design guidelines cover when/why to use a component

### Isolation

*  Never reference [element](https://developer.mozilla.org/en-US/docs/Web/API/Element) directly in the Foundation

TODO: Add more notes about how to isolate subsystems from component specifics

### Performance

*  Only animate properties that will run on the GPU
*  Use `requestAnimationFrame`
*  Avoid constant synchronous DOM reads/writes
*  Reduce the number of composite layers
