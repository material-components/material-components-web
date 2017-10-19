// Adapted from https://help.crossbrowsertesting.com/selenium-testing/getting-started/javascript/

const webdriver = require('selenium-webdriver');

const BrowserConfig = require('./browser-config');
const {CBTFlow} = require('./cbt-api');

const remoteHub = process.env.CBT_REMOTE_HUB || 'http://hub.crossbrowsertesting.com:80/wd/hub';
const username = process.env.CBT_USERNAME;
const authkey = process.env.CBT_AUTHKEY;
const build = process.env.CBT_BUILD || '7521e673f5e9c4faed464407840d1938a1366b80';

const globalConfig = {
  username,
  authkey,
  remoteHub,
  build: `[commit: ${build}]`,
  name: 'Button demo page',
};
const browsers = BrowserConfig.all(globalConfig);

const cbtFlow = new CBTFlow({globalConfig, browsers});
cbtFlow.on('cbt:session-started', ({session, driver} = {}) => {
  // load your URL
  driver.get('https://material-components-web.appspot.com/button.html');

  driver.wait(webdriver.until.elementLocated(webdriver.By.css('.mdc-button')), 10000);

  session.takeSnapshot();

  // // find checkout and click it
  // driver.findElement(webdriver.By.id('username')).sendKeys('tester@crossbrowsertesting.com');
  //
  // // send keys to element to enter text
  // driver.findElement(webdriver.By.xpath('//*[@type=\'password\']')).sendKeys('test123');
  //
  // // take snapshot via cbt api
  // driver.call(() => session.takeSnapshot());
  //
  // // click the archive button
  // driver.findElement(webdriver.By.css('button[type=submit]')).click();
  //
  // // wait on logged in message
  // driver.wait(webdriver.until.elementLocated(webdriver.By.id('logged-in-message')), 10000);
  //
  // // take snapshot via cbt api
  // driver.call(() => session.takeSnapshot());

  // quit the driver
  driver.quit();

  // set the score as passing
  session.pass().then(function(result) {
    console.log(`${session.sessionId_} - set score to pass; result = `, result);
  });
});
cbtFlow.start();
