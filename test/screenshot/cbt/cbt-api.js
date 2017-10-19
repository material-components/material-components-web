const EventEmitter = require('events');

const webdriver = require('selenium-webdriver');
const request = require('request');

class CBTFlow extends EventEmitter {
  constructor({globalConfig, browsers} = {}) {
    super();
    this.globalConfig_ = globalConfig;
    this.browsers_ = browsers;
  }

  catchErrors_(flow) {
    flow.on('uncaughtException', (error) => this.handleWebDriverError_(error));
  }

  handleWebDriverError_(error) {
    console.error('Unhandled exception:', error);
    this.emit('cbt:error', error);
  }

  start() {
    // eslint-disable-next-line no-unused-vars
    const flows = this.browsers_.map((browser) => {
      return webdriver.promise.createFlow((flow) => {
        this.catchErrors_(flow);

        console.log('Connecting to the CrossBrowserTesting remote server...');
        this.emit('cbt:session-starting');

        const driver = new webdriver.Builder()
          .usingServer(this.globalConfig_.remoteHub)
          .withCapabilities(browser)
          .build();

        // All driver calls are automatically queued by flow control.
        // Async functions outside of driver can use call() function.
        console.log('Waiting on the browser to be launched and the session to start...');

        driver.getSession().then(
          (sessionData) => {
            const sessionId = sessionData.id_;
            const session = new CBTSession({
              globalConfig: this.globalConfig_,
              driver,
              sessionId,
            });
            this.emit('cbt:session-started', session);
            console.log(`${sessionId} - See your test run: https://app.crossbrowsertesting.com/selenium/${sessionId}`);
          },
          (error) => {
            this.handleWebDriverError_(error);
          });
      });
    });
  }
}

class CBTSession {
  constructor({globalConfig, driver, sessionId} = {}) {
    this.globalConfig_ = globalConfig;
    this.driver_ = driver;
    this.sessionId_ = sessionId;
    this.catchErrors_();
  }

  get driver() {
    return this.driver_;
  }

  pass() {
    return this.setScore_('pass');
  }

  fail() {
    return this.setScore_('fail');
  }

  takeSnapshot() {
    return this.driver.call(() => {
      // webdriver has built-in promise to use
      const deferred = webdriver.promise.defer();
      const result = {error: false, message: null};

      request.post(
        'https://crossbrowsertesting.com/api/v3/selenium/' + this.sessionId_ + '/snapshots',
        function(error, response, body) {
          if (error) {
            result.error = true;
            result.message = error;
          } else if (response.statusCode !== 200) {
            result.error = true;
            result.message = body;
          } else {
            result.error = false;
            result.message = 'success';
          }
          deferred.fulfill(result);
        })
        .auth(this.globalConfig_.username, this.globalConfig_.authkey);

      return deferred.promise;
    });
  }

  waitFor(selector, timeoutInMs) {
    const by = webdriver.By.css(selector);
    const element = this.driver.findElement(by);
    timeoutInMs = timeoutInMs || 10000;

    return {
      toBePresent: () => {
        return this.driver.wait(webdriver.until.elementLocated(by), timeoutInMs);
      },
      toBeVisible: () => {
        return this.driver.wait(webdriver.until.elementIsVisible(element), timeoutInMs).then();
      },
    };
  }

  querySelector(selector) {
    return this.driver.findElement(webdriver.By.css(selector));
  }

  querySelectorAll(selector) {
    return this.driver.findElements(webdriver.By.css(selector));
  }

  mouseDown(selector) {
    return this.driver.actions().mouseDown(this.querySelector(selector)).perform();
  }

  mouseUp(selector) {
    return this.driver.actions().mouseUp(this.querySelector(selector)).perform();
  }

  catchErrors_() {
    webdriver.promise.controlFlow().on('uncaughtException', (error) => this.handleWebDriverError_(error));
  }

  handleWebDriverError_(/* error */) {
    this.driver.quit();
    this.fail().then((result) => {
      console.error(`${this.sessionId_} - set score to fail; result = `, result);
    });
  }

  setScore_(score) {
    return this.driver.call(() => {
      // webdriver has built-in promise to use
      const deferred = webdriver.promise.defer();
      const result = {error: false, message: null};

      request(
        {
          method: 'PUT',
          uri: 'https://crossbrowsertesting.com/api/v3/selenium/' + this.sessionId_,
          body: {'action': 'set_score', 'score': score},
          json: true,
        },
        function(error, response, body) {
          if (error) {
            result.error = true;
            result.message = error;
          } else if (response.statusCode !== 200) {
            result.error = true;
            result.message = body;
          } else {
            result.error = false;
            result.message = 'success';
          }

          deferred.fulfill(result);
        })
        .auth(this.globalConfig_.username, this.globalConfig_.authkey);

      return deferred.promise;
    });
  }
}

module.exports = {CBTFlow};
