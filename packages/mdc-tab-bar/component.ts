/**
 * @license
 * Copyright 2018 Google Inc.
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

import {MDCComponent} from '@material/base/component';
import {CustomEventListener, SpecificEventListener} from '@material/base/types';
import {MDCTabScroller, MDCTabScrollerFactory} from '@material/tab-scroller/component';
import {MDCTab, MDCTabFactory} from '@material/tab/component';
import {MDCTabFoundation} from '@material/tab/foundation';
import {MDCTabInteractionEvent} from '@material/tab/types';

import {MDCTabBarAdapter} from './adapter';
import {MDCTabBarFoundation} from './foundation';
import {MDCTabBarActivatedEventDetail} from './types';

const {strings} = MDCTabBarFoundation;

let tabIdCounter = 0;

/** MDC Tab Bar */
export class MDCTabBar extends MDCComponent<MDCTabBarFoundation> {
  static override attachTo(root: Element): MDCTabBar {
    return new MDCTabBar(root);
  }

  private tabList!: MDCTab[];                 // assigned in initialize()
  private tabScroller!: MDCTabScroller|null;  // assigned in initialize()
  private handleTabInteraction!:
      CustomEventListener<MDCTabInteractionEvent>;  // assigned in
                                                    // initialSyncWithDOM()
  private handleKeyDown!:
      SpecificEventListener<'keydown'>;  // assigned in initialSyncWithDOM()

  set focusOnActivate(focusOnActivate: boolean) {
    for (const tab of this.tabList) {
      tab.focusOnActivate = focusOnActivate;
    }
  }

  set useAutomaticActivation(useAutomaticActivation: boolean) {
    this.foundation.setUseAutomaticActivation(useAutomaticActivation);
  }

  override initialize(
      tabFactory: MDCTabFactory = (el) => new MDCTab(el),
      tabScrollerFactory:
          MDCTabScrollerFactory = (el) => new MDCTabScroller(el),
  ) {
    this.tabList = this.instantiateTabs(tabFactory);
    this.tabScroller = this.instantiatetabScroller(tabScrollerFactory);
  }

  override initialSyncWithDOM() {
    this.handleTabInteraction = (evt) => {
      this.foundation.handleTabInteraction(evt);
    };
    this.handleKeyDown = (evt) => {
      this.foundation.handleKeyDown(evt);
    };

    this.listen(
        MDCTabFoundation.strings.INTERACTED_EVENT, this.handleTabInteraction);
    this.listen('keydown', this.handleKeyDown);

    for (let i = 0; i < this.tabList.length; i++) {
      if (this.tabList[i].active) {
        this.scrollIntoView(i);
        break;
      }
    }
  }

  override destroy() {
    super.destroy();
    this.unlisten(
        MDCTabFoundation.strings.INTERACTED_EVENT, this.handleTabInteraction);
    this.unlisten('keydown', this.handleKeyDown);
    for (const tab of this.tabList) {
      tab.destroy();
    }

    if (this.tabScroller) {
      this.tabScroller.destroy();
    }
  }

  override getDefaultFoundation() {
    // DO NOT INLINE this variable. For backward compatibility, foundations take
    // a Partial<MDCFooAdapter>. To ensure we don't accidentally omit any
    // methods, we need a separate, strongly typed adapter variable.
    // tslint:disable:object-literal-sort-keys Methods should be in the same order as the adapter interface.
    const adapter: MDCTabBarAdapter = {
      scrollTo: (scrollX) => {
        this.tabScroller!.scrollTo(scrollX);
      },
      incrementScroll: (scrollXIncrement) => {
        this.tabScroller!.incrementScroll(scrollXIncrement);
      },
      getScrollPosition: () => this.tabScroller!.getScrollPosition(),
      getScrollContentWidth: () => this.tabScroller!.getScrollContentWidth(),
      getOffsetWidth: () => (this.root as HTMLElement).offsetWidth,
      isRTL: () => window.getComputedStyle(this.root).getPropertyValue(
                       'direction') === 'rtl',
      setActiveTab: (index) => {
        this.foundation.activateTab(index);
      },
      activateTabAtIndex: (index, clientRect) => {
        this.tabList[index].activate(clientRect);
      },
      deactivateTabAtIndex: (index) => {
        this.tabList[index].deactivate();
      },
      focusTabAtIndex: (index) => {
        this.tabList[index].focus();
      },
      getTabIndicatorClientRectAtIndex: (index) =>
          this.tabList[index].computeIndicatorClientRect(),
      getTabDimensionsAtIndex: (index) =>
          this.tabList[index].computeDimensions(),
      getPreviousActiveTabIndex: () => {
        for (let i = 0; i < this.tabList.length; i++) {
          if (this.tabList[i].active) {
            return i;
          }
        }
        return -1;
      },
      getFocusedTabIndex: () => {
        const tabElements = this.getTabElements();
        const activeElement = document.activeElement!;
        return tabElements.indexOf(activeElement);
      },
      getIndexOfTabById: (id) => {
        for (let i = 0; i < this.tabList.length; i++) {
          if (this.tabList[i].id === id) {
            return i;
          }
        }
        return -1;
      },
      getTabListLength: () => this.tabList.length,
      notifyTabActivated: (index) => {
        this.emit<MDCTabBarActivatedEventDetail>(
            strings.TAB_ACTIVATED_EVENT, {index}, true);
      },
    };
    // tslint:enable:object-literal-sort-keys
    return new MDCTabBarFoundation(adapter);
  }

  /**
   * Activates the tab at the given index
   * @param index The index of the tab
   */
  activateTab(index: number) {
    this.foundation.activateTab(index);
  }

  /**
   * Scrolls the tab at the given index into view
   * @param index THe index of the tab
   */
  scrollIntoView(index: number) {
    this.foundation.scrollIntoView(index);
  }

  /**
   * Returns all the tab elements in a nice clean array
   */
  private getTabElements(): Element[] {
    return [].slice.call(this.root.querySelectorAll(strings.TAB_SELECTOR));
  }

  /**
   * Instantiates tab components on all child tab elements
   */
  private instantiateTabs(tabFactory: MDCTabFactory) {
    return this.getTabElements().map((el) => {
      el.id = el.id || `mdc-tab-${++tabIdCounter}`;
      return tabFactory(el);
    });
  }

  /**
   * Instantiates tab scroller component on the child tab scroller element
   */
  private instantiatetabScroller(tabScrollerFactory: MDCTabScrollerFactory):
      MDCTabScroller|null {
    const tabScrollerElement =
        this.root.querySelector(strings.TAB_SCROLLER_SELECTOR);
    if (tabScrollerElement) {
      return tabScrollerFactory(tabScrollerElement);
    }
    return null;
  }
}
