import lolex from 'lolex';

let instance;

function install() {
  if (instance) {
    console.log('A clock instance already exists! Uninstalling it first...');
    instance.uninstall();
  }
  instance = lolex.install();
  return instance;
}

function uninstall() {
  if (instance) {
    instance.uninstall();
    instance = undefined;
  }
}

export {install, uninstall};
