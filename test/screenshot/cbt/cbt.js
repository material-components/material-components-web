// Adapted from https://help.crossbrowsertesting.com/selenium-testing/getting-started/javascript/

const webdriver = require('selenium-webdriver');
const SeleniumServer = require('selenium-webdriver/remote').SeleniumServer;
const request = require('request');
const remoteHub = 'http://hub.crossbrowsertesting.com:80/wd/hub';

const username = process.env.CBT_USERNAME;
const authkey = process.env.CBT_AUTHKEY;

const browserConfigFactory = {
  common: function(...overrides) {
    return Object.assign({
      'build': '1.0',
      'record_video': 'true',
      'record_network': 'true',
      'username': username,
      'password': authkey,
    }, ...overrides);
  },

  desktop: function(...overrides) {
    return browserConfigFactory.common({
      'screenResolution': '1400x900',
    }, ...overrides);
  },
};

const browsers = [
  browserConfigFactory.desktop({
    'browserName': 'Chrome',
    'version': '48x64',
    'platform': 'Mac OSX 10.8',
  }),
  browserConfigFactory.desktop({
    'browserName': 'Firefox',
    'version': '46',
    'platform': 'Mac OSX 10.8',
  }),
  browserConfigFactory.desktop({
    'browserName': 'Safari',
    'version': '6.2',
    'platform': 'Mac OSX 10.8',
  }),
];

// eslint-disable-next-line no-unused-vars
const flows = browsers.map(function(browser) {
  return webdriver.promise.createFlow(function() {
    let sessionId = null;

    // register general error handler
    webdriver.promise.controlFlow().on('uncaughtException', webdriverErrorHandler);

    console.log('Connection to the CrossBrowserTesting remote server');

    const caps = Object.assign({}, browser, {name: 'Button demo page'});
    const driver = new webdriver.Builder()
      .usingServer(remoteHub)
      .withCapabilities(caps)
      .build();

    // console.log('driver is ', driver)

    // All driver calls are automatically queued by flow control.
    // Async functions outside of driver can use call() function.
    console.log('Waiting on the browser to be launched and the session to start');

    driver.getSession().then(function(session) {
      sessionId = session.id_; // need for API calls
      console.log(`${sessionId} - See your test run at: https://app.crossbrowsertesting.com/selenium/${sessionId}`);
    });

    // load your URL
    driver.get('https://material-components-web.appspot.com/button.html');

    driver.wait(webdriver.until.elementLocated(webdriver.By.css('.mdc-button')), 10000);

    // take snapshot via cbt api
    driver.call(takeSnapshot);

    // // find checkout and click it
    // driver.findElement(webdriver.By.id('username')).sendKeys('tester@crossbrowsertesting.com');
    //
    // // send keys to element to enter text
    // driver.findElement(webdriver.By.xpath('//*[@type=\'password\']')).sendKeys('test123');
    //
    // // take snapshot via cbt api
    // driver.call(takeSnapshot);
    //
    // // click the archive button
    // driver.findElement(webdriver.By.css('button[type=submit]')).click();
    //
    // // wait on logged in message
    // driver.wait(webdriver.until.elementLocated(webdriver.By.id('logged-in-message')), 10000);
    //
    // // take snapshot via cbt api
    // driver.call(takeSnapshot);

    // quit the driver
    driver.quit();

    // set the score as passing
    driver.call(setScore, null, 'pass').then(function(result) {
      console.log(`${sessionId} - set score to pass; result = `, result);
    });

    // Call API to set the score
    function setScore(score) {
      // webdriver has built-in promise to use
      const deferred = webdriver.promise.defer();
      const result = {error: false, message: null};

      if (sessionId) {
        request({
          method: 'PUT',
          uri: 'https://crossbrowsertesting.com/api/v3/selenium/' + sessionId,
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
          .auth(username, authkey);
      } else {
        result.error = true;
        result.message = 'Session Id was not defined';
        deferred.fulfill(result);
      }

      return deferred.promise;
    }

    // Call API to get a snapshot
    function takeSnapshot() {
      // webdriver has built-in promise to use
      const deferred = webdriver.promise.defer();
      const result = {error: false, message: null};

      if (sessionId) {
        request.post(
          'https://crossbrowsertesting.com/api/v3/selenium/' + sessionId + '/snapshots',
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
            // console.log('fulfilling promise in takeSnapshot')
            deferred.fulfill(result);
          })
          .auth(username, authkey);
      } else {
        result.error = true;
        result.message = 'Session Id was not defined';
        deferred.fulfill(result); // never call reject as we don't need this to actually stop the test
      }

      return deferred.promise;
    }

    // general error catching function
    function webdriverErrorHandler(err) {
      console.error('There was an unhandled exception! ' + err);

      // if we had a session, end it and mark failed
      if (driver && sessionId) {
        driver.quit();
        setScore('fail').then(function(result) {
          console.error(`${sessionId} - set score to fail; result = `, result);
        });
      }
    }
  });
});
