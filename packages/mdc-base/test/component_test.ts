/**
 * @license
 * Copyright 2020 Google Inc.
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

import {MDCComponent} from '../../mdc-base/component';
import {MDCFoundation} from '../../mdc-base/foundation';
import {emitEvent} from '../../../testing/dom/events';

class FakeComponent extends MDCComponent<MDCFoundation> {
  initializeArgs!: unknown[];
  initializeComesBeforeFoundation!: boolean;
  synced!: boolean;

  override getDefaultFoundation() {
    const defaultFoundation = {
      isDefaultFoundation: true,
      init: jasmine.createSpy('init'),
      rootElementAtTimeOfCall: this.root,
    } as any;
    return defaultFoundation;
  }

  override initialize(...args: unknown[]) {
    this.initializeArgs = args;
    this.initializeComesBeforeFoundation = !this.foundation;
  }

  override initialSyncWithDOM() {
    this.synced = true;
  }
}

describe('MDCComponent', () => {
  it('provides a static attachTo() method that returns a basic instance with the specified root',
     () => {
       const root = document.createElement('div');
       const b = MDCComponent.attachTo(root);
       expect(b instanceof MDCComponent).toBeTruthy();
     });

  it('takes a root node constructor param and assigns it to the "root" property',
     () => {
       const root = document.createElement('div');
       const f = new FakeComponent(root);
       expect(f['root']).toEqual(root);
     });

  it('takes an optional foundation constructor param and assigns it to the "foundation" property',
     () => {
       const root = document.createElement('div');
       const foundation = {init: () => {}} as any;
       const f = new FakeComponent(root, foundation);
       expect(f['foundation']).toEqual(foundation);
     });

  it('assigns the result of "getDefaultFoundation()" to "foundation" by default',
     () => {
       const root = document.createElement('div');
       const f = new FakeComponent(root);
       expect((f['foundation'] as any).isDefaultFoundation).toBeTruthy();
     });

  it('calls the foundation\'s init() method within the constructor', () => {
    const root = document.createElement('div');
    const foundation = {init: jasmine.createSpy('init')};
    // Testing side effects of constructor
    // eslint-disable-next-line no-new
    new FakeComponent(root, foundation as any);
    expect(foundation.init).toHaveBeenCalled();
  });

  it('throws an error if getDefaultFoundation() is not overridden', () => {
    const root = document.createElement('div');
    expect(() => new MDCComponent(root)).toThrow();
  });

  it('calls initialSyncWithDOM() when initialized', () => {
    const root = document.createElement('div');
    const f = new FakeComponent(root);
    expect(f.synced).toBeTruthy();
  });

  it('provides a default initialSyncWithDOM() no-op if none provided by subclass',
     () => {
       expect(MDCComponent.prototype.initialSyncWithDOM.bind({})).not.toThrow();
     });

  it('provides a default destroy() method which calls the foundation\'s destroy() method',
     () => {
       const root = document.createElement('div');
       const foundation = {
         init: jasmine.createSpy('init'),
         destroy: jasmine.createSpy('destroy')
       };
       const f = new FakeComponent(root, foundation as any);
       f.destroy();
       expect(foundation.destroy).toHaveBeenCalled();
     });

  it('#initialize is called within constructor and passed any additional positional component args',
     () => {
       const f = new FakeComponent(
           document.createElement('div'), /* foundation */ undefined, 'foo',
           42);
       expect(f.initializeArgs).toEqual(['foo', 42]);
     });

  it('#initialize is called before getDefaultFoundation()', () => {
    const f = new FakeComponent(document.createElement('div'));
    expect(f.initializeComesBeforeFoundation).toBeTruthy();
  });

  it('#listen adds an event listener to the root element', () => {
    const root = document.createElement('div');
    const f = new FakeComponent(root);
    const handler = jasmine.createSpy('eventHandler');
    f.listen('FakeComponent:customEvent', handler);
    emitEvent(root, 'FakeComponent:customEvent');
    expect(handler).toHaveBeenCalledWith(jasmine.anything());
  });

  it('#unlisten removes an event listener from the root element', () => {
    const root = document.createElement('div');
    const f = new FakeComponent(root);
    const handler = jasmine.createSpy('eventHandler');
    root.addEventListener('FakeComponent:customEvent', handler);
    f.unlisten('FakeComponent:customEvent', handler);
    emitEvent(root, 'FakeComponent:customEvent');
    expect(handler).not.toHaveBeenCalledWith(jasmine.anything());
  });

  it('#emit dispatches a custom event with the supplied data', () => {
    const root = document.createElement('div');
    const f = new FakeComponent(root);
    const handler = jasmine.createSpy('eventHandler');
    let event: any = null;
    handler.withArgs(jasmine.any(Object)).and.callFake((e: any) => {
      event = e;
    });
    const data = {eventData: true};
    const type = 'customeventtype';

    root.addEventListener(type, handler);
    f.emit(type, data);

    expect(event !== null).toBeTruthy();
    // assertion above ensures non-null event, but compiler doesn't know this
    // tslint:disable:no-unnecessary-type-assertion
    expect(event!.type).toEqual(type);
    expect(event!.detail).toEqual(data);
    // tslint:enable:no-unnecessary-type-assertion
  });

  it('#emit dispatches a custom event with the supplied data where custom events aren\'t available',
     () => {
       const root = document.createElement('div');
       const f = new FakeComponent(root);
       const handler = jasmine.createSpy('eventHandler');
       let event: any = null;
       handler.withArgs(jasmine.any(Object)).and.callFake((e: any) => {
         event = e;
       });
       const data = {eventData: true};
       const type = 'customeventtype';

       root.addEventListener(type, handler);

       const {CustomEvent} = (window as any);
       (window as any).CustomEvent = undefined;
       try {
         f.emit(type, data);
       } finally {
         (window as any).CustomEvent = CustomEvent;
       }

       expect(event !== null).toBeTruthy();
       // assertion above ensures non-null event, but compiler doesn't know this
       // tslint:disable:no-unnecessary-type-assertion
       expect(event!.type).toEqual(type);
       expect(event!.detail).toEqual(data);
       // tslint:enable:no-unnecessary-type-assertion
     });

  it('(regression) ensures that this.root is available for use within getDefaultFoundation()',
     () => {
       const root = document.createElement('div');
       const f = new FakeComponent(root);
       expect((f['foundation'] as any).rootElementAtTimeOfCall).toEqual(root);
     });
});
