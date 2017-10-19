const EventEmitter = require('events');
const webdriver = require('selenium-webdriver');
const {CbtSession} = require('./cbt-session');

class CbtFlow extends EventEmitter {
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
            const session = new CbtSession({
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

module.exports = {CbtFlow};
