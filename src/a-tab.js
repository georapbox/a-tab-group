let tabCounter = 0;

/**
 * `Tab` is a tab for a `<a-tab-group>` tab panel.
 * `<a-tab>` should always be used with `role=heading` in the markup so that the
 * semantics remain useable when JavaScript is failing.
 *
 * A `<a-tab>` declares which `<a-tab-panel>` it belongs to by
 * using that panel's ID as the value for the `aria-controls` attribute.
 *
 * A `<a-tab>` will automatically generate a unique ID if none is specified.
 *
 * @property {boolean} selected - Whether the tab is selected.
 * @attribute {boolean} selected - Whether the tab is selected.
 *
 * @property {boolean} disabled - Whether the tab is disabled.
 * @attribute {boolean} disabled - Whether the tab is disabled.
 */
class Tab extends HTMLElement {
  constructor() {
    super();
  }

  static get observedAttributes() {
    return ['selected', 'disabled'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'selected' && oldValue !== newValue) {
      this.setAttribute('aria-selected', this.selected);
      this.setAttribute('tabindex', this.selected ? 0 : -1);
    }

    if (name === 'disabled' && oldValue !== newValue) {
      this.setAttribute('aria-disabled', this.disabled);
      this.setAttribute('tabindex', this.disabled ? -1 : 0);
    }
  }

  connectedCallback() {
    this.#upgradeProperty('selected');
    this.#upgradeProperty('disabled');

    this.setAttribute('role', 'tab');

    if (!this.id) {
      this.id = `a-tab-generated-${tabCounter++}`;
    }

    this.setAttribute('aria-selected', 'false');
    this.setAttribute('tabindex', -1);
  }

  get selected() {
    return this.hasAttribute('selected');
  }

  set selected(value) {
    if (value) {
      this.setAttribute('selected', '');
    } else {
      this.removeAttribute('selected');
    }
  }

  get disabled() {
    return this.hasAttribute('disabled');
  }

  set disabled(value) {
    if (value) {
      this.setAttribute('disabled', '');
    } else {
      this.removeAttribute('disabled');
    }
  }

  /**
   * https://developers.google.com/web/fundamentals/web-components/best-practices#lazy-properties
   * This is to safe guard against cases where, for instance, a framework may have added the element to the page and set a
   * value on one of its properties, but lazy loaded its definition. Without this guard, the upgraded element would miss that
   * property and the instance property would prevent the class property setter from ever being called.
   */
  #upgradeProperty(prop) {
    if (Object.prototype.hasOwnProperty.call(this, prop)) {
      const value = this[prop];
      delete this[prop];
      this[prop] = value;
    }
  }
}

if (window.customElements && !window.customElements.get('a-tab')) {
  window.customElements.define('a-tab', Tab);
}
