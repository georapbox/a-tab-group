// @ts-check

import { uid } from './utils/uid.js';

const A_TAB = 'a-tab';
const template = document.createElement('template');
let tabCounter = 0;

template.innerHTML = /* html */`
  <style>
    :host {
      box-sizing: border-box;
      display: inline-block;
      contain: content;
    }

    :host([hidden]),
    [hidden] {
      display: none !important;
    }

    :host *,
    :host *::before,
    :host *::after {
      box-sizing: inherit;
    }

    .tab {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.375rem 0.75rem;
      white-space: nowrap;
      cursor: pointer;
    }

    :host([disabled]) .tab {
      opacity: 0.7;
      cursor: not-allowed;
    }

    :host([selected]) .tab {
      color: var(--selected-tab-color);
      background-color: var(--selected-tab-bg-color);
    }

    .tab__close {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 0.25rem;
      font-size: inherit;
      cursor: pointer;
    }
  </style>

  <div part="base" class="tab">
    <slot></slot>
  </div>
`;

/**
 * @summary
 * This is a tab for a <a-tab-group> tab panel.
 * `<a-tab>` should always be used with `role=heading` in the markup so that the semantics remain useable when JavaScript is failing.
 * @extends HTMLElement
 *
 * @tagname a-tab
 *
 * @property {boolean} selected - Whether the tab is selected.
 * @property {boolean} disabled - Whether the tab is disabled.
 * @property {boolean} closable - Whether the tab is closable.
 *
 * @attribute selected - Reflects the selected property.
 * @attribute disabled - Reflects the disabled property.
 * @attribute closable - Reflects the closable property.
 *
 * @csspart base - The component's base wrapper.
 * @csspart close-tab - The close button.
 * @csspart close-tab-icon - The close button icon.
 *
 * @slot - The tab's content.
 *
 * @fires a-tab-close - Fires when the tab's close button is clicked.
 */
class Tab extends HTMLElement {
  constructor() {
    super();

    if (!this.shadowRoot) {
      const shadowRoot = this.attachShadow({ mode: 'open' });
      shadowRoot.appendChild(template.content.cloneNode(true));
    }
  }

  static get observedAttributes() {
    return ['selected', 'disabled', 'closable'];
  }

  /**
   * Lifecycle method that is called when attributes are changed, added, removed, or replaced.
   *
   * @param {string} name - The name of the attribute.
   * @param {string} oldValue - The old value of the attribute.
   * @param {string} newValue - The new value of the attribute.
   */
  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'selected' && oldValue !== newValue) {
      this.setAttribute('aria-selected', this.selected.toString());
    }

    if (name === 'disabled' && oldValue !== newValue) {
      this.setAttribute('aria-disabled', this.disabled.toString());
      this.setAttribute('tabindex', this.disabled ? '-1' : '0');
    }

    if (name === 'closable' && oldValue !== newValue) {
      if (this.closable) {
        const closeButton = document.createElement('span');
        closeButton.className = 'tab__close';
        closeButton.setAttribute('part', 'close-tab');
        closeButton.innerHTML = /* html */`<svg part="close-tab-icon" xmlns="http://www.w3.org/2000/svg" width="0.875em" height="0.875em" fill="currentColor" viewBox="0 0 16 16"><path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z"/></svg>`;
        this.shadowRoot?.querySelector('.tab')?.appendChild(closeButton);
        closeButton.addEventListener('click', this.#handleCloseButtonClick);
      } else {
        const closeButton = this.shadowRoot?.querySelector('.tab__close');
        closeButton?.removeEventListener('click', this.#handleCloseButtonClick);
        closeButton?.remove();
      }
    }
  }

  /**
   * Lifecycle method that is called when the element is first connected to the DOM.
   */
  connectedCallback() {
    this.#upgradeProperty('selected');
    this.#upgradeProperty('disabled');
    this.#upgradeProperty('closable');

    if (!this.id) {
      this.id = uid('tab', (++tabCounter).toString());
    }

    this.setAttribute('slot', 'tab');
    this.setAttribute('role', 'tab');
    this.setAttribute('aria-selected', 'false');
    this.setAttribute('tabindex', this.disabled ? '-1' : '0');
  }

  /**
   * Lifecycle method that is called when the element is disconnected from the DOM.
   */
  disconnectedCallback() {
    const closeButton = this.shadowRoot?.querySelector('.tab__close');
    closeButton?.removeEventListener('click', this.#handleCloseButtonClick);
  }

  /**
   * @type {boolean} - Whether the tab is selected.
   * @default false
   * @attribute selected - Reflects the selected property.
   */
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

  /**
   * @type {boolean} - Whether the tab is disabled.
   * @default false
   * @attribute disabled - Reflects the disabled property.
   */
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
   * @type {boolean} - Whether the tab is closable.
   * @default false
   * @attribute closable - Reflects the closable property.
   */
  get closable() {
    return this.hasAttribute('closable');
  }

  set closable(value) {
    if (value) {
      this.setAttribute('closable', '');
    } else {
      this.removeAttribute('closable');
    }
  }

  /**
   * Handles the click event on the close button.
   *
   * @param {Event} evt The click event.
   */
  #handleCloseButtonClick = evt => {
    evt.stopPropagation();

    this.dispatchEvent(new CustomEvent(`${A_TAB}-close`, {
      bubbles: true,
      composed: true,
      detail: { tabId: this.id }
    }));
  };

  /**
   * This is to safe guard against cases where, for instance, a framework may have added the element to the page and set a
   * value on one of its properties, but lazy loaded its definition. Without this guard, the upgraded element would miss that
   * property and the instance property would prevent the class property setter from ever being called.
   *
   * https://developers.google.com/web/fundamentals/web-components/best-practices#lazy-properties
   *
   * @param {'selected' | 'disabled' | 'closable'} prop - The property to upgrade.
   */
  #upgradeProperty(prop) {
    /** @type {any} */
    const instance = this;

    if (Object.prototype.hasOwnProperty.call(instance, prop)) {
      const value = instance[prop];
      delete instance[prop];
      instance[prop] = value;
    }
  }

  static defineCustomElement(elementName = A_TAB) {
    if (typeof window !== 'undefined' && !window.customElements.get(elementName)) {
      window.customElements.define(elementName, Tab);
    }
  }
}

Tab.defineCustomElement();

export { Tab };
