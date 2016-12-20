import {browser, element, by, By, $, $$, ExpectedConditions} from 'aurelia-protractor-plugin/protractor';

export class PageObject_Skeleton {

  constructor() {

  }

  getCurrentPageTitle() {
    return browser.getTitle();
  }

  navigateTo(href) {
    element(by.css('a[href="' + href + '"]')).click();
    return browser.waitForRouterComplete();
  }
}
