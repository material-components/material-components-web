// Adapted from https://help.crossbrowsertesting.com/selenium-testing/getting-started/javascript/

const {CbtBrowserConfig} = require('./cbt-browser-config');
const {CbtFlow} = require('./cbt-flow');

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
const browsers = CbtBrowserConfig.all(globalConfig);

const cbtFlow = new CbtFlow({globalConfig, browsers});
cbtFlow.on('cbt:session-started', (session) => {
  session.driver.get('https://material-components-web.appspot.com/button.html');

  session.waitFor('.mdc-button').toBeVisible();
  session.takeSnapshot();

  session.mouseDown('.mdc-button');
  session.takeSnapshot();

  session.mouseUp('.mdc-button');
  session.takeSnapshot();

  session.driver.quit();
  session.pass().then(function(result) {
    console.log(`${session.sessionId_} - set score to pass; result = `, result);
  });
});
cbtFlow.start();
