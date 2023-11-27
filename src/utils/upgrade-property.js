// @ts-check

/**
 * This is to safe guard against cases where, for instance, a framework may have added the element to the page and set a
 * value on one of its properties, but lazy loaded its definition. Without this guard, the upgraded element would miss that
 * property and the instance property would prevent the class property setter from ever being called.
 *
 * https://developers.google.com/web/fundamentals/web-components/best-practices#lazy-properties
 *
 * @param {string} prop - The property to upgrade.
 * @param {any} instance - The instance of the tab.
 */
const upgradeProperty = (prop, instance) => {
  if (Object.prototype.hasOwnProperty.call(instance, prop)) {
    const value = instance[prop];
    delete instance[prop];
    instance[prop] = value;
  }
};

export { upgradeProperty };
