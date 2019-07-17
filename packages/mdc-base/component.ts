/**
 * @license
 * Copyright 2016 Google Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

import {MDCFoundation} from './foundation';
import {CustomEventListener, EventType, SpecificEventListener} from './types';

export class MDCComponent<FoundationType extends MDCFoundation> {
  /**
   * Subclasses must implement this as a convenience method to instantiate and return an instance of the class
   * using the root element provided. This will be used within `mdc-auto-init`, and in the future its presence
   * may be enforced via a custom lint rule.
   * @param root DOM node that the component should attach to.
   */
  static attachTo(root: Element): MDCComponent<MDCFoundation<{}>> {
    // Subclasses which extend MDCBase should provide an attachTo() method that takes a root element and
    // returns an instantiated component with its root set to that element. Also note that in the cases of
    // subclasses, an explicit foundation class will not have to be passed in; it will simply be initialized
    // from getDefaultFoundation().
    return new MDCComponent(root, new MDCFoundation({}));
  }

  /**
   * The root element passed into the constructor as the first argument.
   */
  protected root_: Element;
  /**
   * The foundation class for this component. This is either passed in as an optional second argument to the
   * constructor, or assigned the result of calling `getDefaultFoundation()`
   */
  protected foundation_: FoundationType;

  constructor(
      root: Element,
      foundation?: FoundationType,
      ...args: Array<unknown>
  ) {
    this.root_ = root;
    this.initialize(...args);
    // Note that we initialize foundation here and not within the constructor's default param so that
    // this.root_ is defined and can be used within the foundation class.
    this.foundation_ = foundation === undefined ? this.getDefaultFoundation() : foundation;
    this.foundation_.init();
    this.initialSyncWithDOM();
  }

  /**
   * Called after the root element is attached to the component, but _before_ the foundation is
   * instantiated. Any positional arguments passed to the component constructor after the root element, along
   * with the optional foundation 2nd argument, will be provided to this method. This is a good place to do any
   * setup work normally done within a constructor function.
   * @param _args
   */
  /* istanbul ignore next: method param only exists for typing purposes; it does not need to be unit tested */
  initialize(..._args: Array<unknown>) {
    // Subclasses can override this to do any additional setup work that would be considered part of a
    // "constructor". Essentially, it is a hook into the parent constructor before the foundation is
    // initialized. Any additional arguments besides root and foundation will be passed in here.
  }

  /**
   * Returns an instance of a foundation class properly configured for the component. Called when no foundation
   * instance is given within the constructor. Subclasses **must** implement this method.
   */
  getDefaultFoundation(): FoundationType {
    // Subclasses must override this method to return a properly configured foundation class for the
    // component.
    throw new Error('Subclasses must override getDefaultFoundation to return a properly configured ' +
        'foundation class');
  }

  /**
   * Called within the constructor. Subclasses may override this method if they wish to perform initial
   * synchronization of state with the host DOM element. For example, a slider may want to check if its host
   * element contains a pre-set value, and adjust its internal state accordingly. Note that the same caveats
   * apply to this method as to foundation class lifecycle methods. Defaults to a no-op.
   */
  initialSyncWithDOM() {
    // Subclasses should override this method if they need to perform work to synchronize with a host DOM
    // object. An example of this would be a form control wrapper that needs to synchronize its internal state
    // to some property or attribute of the host DOM. Please note: this is *not* the place to perform DOM
    // reads/writes that would cause layout / paint, as this is called synchronously from within the constructor.
  }

  /**
   * Subclasses may override this method if they wish to perform any additional cleanup work when a component
   * is destroyed. For example, a component may want to deregister a window resize listener.
   */
  destroy() {
    // Subclasses may implement this method to release any resources / deregister any listeners they have
    // attached. An example of this might be deregistering a resize event from the window object.
    this.foundation_.destroy();
  }

  /**
   * Wrapper method to add an event listener to the component's root element. This is most useful when
   * listening for custom events.
   */
  listen<K extends EventType>(
    evtType: K, handler: SpecificEventListener<K>, options?: AddEventListenerOptions | boolean): void;
  listen<E extends Event>(
    evtType: string, handler: CustomEventListener<E>, options?: AddEventListenerOptions | boolean): void;
  listen(evtType: string, handler: EventListener, options?: AddEventListenerOptions | boolean) {
    this.root_.addEventListener(evtType, handler, options);
  }

  /**
   * Wrapper method to remove an event listener to the component's root element. This is most useful when
   * unlistening for custom events. Note that this is simply a proxy to `this.root_.removeEventListener`.
   */
  unlisten<K extends EventType>(
    evtType: K, handler: SpecificEventListener<K>, options?: AddEventListenerOptions | boolean): void;
  unlisten<E extends Event>(
    evtType: string, handler: CustomEventListener<E>, options?: AddEventListenerOptions | boolean): void;
  unlisten(evtType: string, handler: EventListener, options?: AddEventListenerOptions | boolean) {
    this.root_.removeEventListener(evtType, handler, options);
  }

  /**
   * Dispatches a custom event of type `type` with detail `data` from the component's root node. It also takes
   * an optional shouldBubble argument to specify if the event should bubble. This is the preferred way of
   * dispatching events within our vanilla components.
   */
  emit<T extends object>(evtType: string, evtData: T, shouldBubble = false) {
    let evt: CustomEvent<T>;
    if (typeof CustomEvent === 'function') {
      evt = new CustomEvent<T>(evtType, {
        bubbles: shouldBubble,
        detail: evtData,
      });
    } else {
      evt = document.createEvent('CustomEvent');
      evt.initCustomEvent(evtType, shouldBubble, false, evtData);
    }

    this.root_.dispatchEvent(evt);
  }
}

// tslint:disable-next-line:no-default-export Needed for backward compatibility with MDC Web v0.44.0 and earlier.
export default MDCComponent;
