export function configure(config) {
    const components = [
        './button/mdc-button',
        './checkbox/mdc-checkbox',
        './ripple/mdc-ripple'
    ];
    config.globalResources(components);
}
