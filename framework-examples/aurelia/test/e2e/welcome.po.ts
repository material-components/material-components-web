import {browser, element, by, By, $, $$, ExpectedConditions} from 'aurelia-protractor-plugin/protractor';

export class PageObject_Welcome {
  getGreeting() {
    return element(by.tagName('h2')).getText();
  }

  setFirstname(value) {
    let firstName = element(by.valueBind('firstName'));
    return firstName.clear().then(() => firstName.sendKeys(value));
  }

  setLastname(value) {
    let lastName = element(by.valueBind('lastName'));
    return lastName.clear().then(() => lastName.sendKeys(value));
  }

  getFullname() {
    return element(by.css('.help-block')).getText();
  }

  pressSubmitButton() {
    return element(by.css('button[type="submit"]')).click();
  }

  openAlertDialog() {
    return browser.wait(async () => {
      await this.pressSubmitButton();

      await browser.wait(ExpectedConditions.alertIsPresent(), 5000);

      return browser.switchTo().alert().then(
        // use alert.accept instead of alert.dismiss which results in a browser crash
        function(alert) { alert.accept(); return true; },
        function() { return false; }
      );
    });
  }
}
