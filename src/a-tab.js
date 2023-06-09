const A_TAB = 'a-tab';
const template = document.createElement('template');
let tabCounter = 0;

template.innerHTML = /* html */`
  <style>
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
 * `Tab` is a tab for a `<a-tab-group>` tab panel.
 * `<a-tab>` should always be used with `role=heading` in the markup so that the
 * semantics remain useable when JavaScript is failing.
 *
 * A `<a-tab>` declares which `<a-tab-panel>` it belongs to by
 * using that panel's ID as the value for the `aria-controls` attribute.
 *
 * A `<a-tab>` will automatically generate a unique ID if none is specified.
 */
class Tab extends HTMLElement {
  static get observedAttributes() {
    return ['selected', 'disabled', 'closable'];
  }

  constructor() {
    super();

    if (!this.shadowRoot) {
      this.attachShadow({ mode: 'open' });
      this.shadowRoot.appendChild(template.content.cloneNode(true));
    }
  }

  connectedCallback() {
    this.#upgradeProperty('selected');
    this.#upgradeProperty('disabled');
    this.#upgradeProperty('closable');

    if (!this.id) {
      this.id = `a-tab-generated-${tabCounter++}`;
    }

    this.setAttribute('role', 'tab');
    this.setAttribute('aria-selected', 'false');
    this.setAttribute('tabindex', this.disabled ? -1 : 0);
  }

  disconnectedCallback() {
    const closeButton = this.shadowRoot.querySelector('.tab__close');
    closeButton?.removeEventListener('click', this.#onCloseButtonClick);
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'selected' && oldValue !== newValue) {
      this.setAttribute('aria-selected', this.selected);
    }

    if (name === 'disabled' && oldValue !== newValue) {
      this.setAttribute('aria-disabled', this.disabled);
      this.setAttribute('tabindex', this.disabled ? -1 : 0);
    }

    if (name === 'closable' && oldValue !== newValue) {
      if (this.closable) {
        const closeButton = document.createElement('span');
        closeButton.className = 'tab__close';
        closeButton.part = 'close-tab';
        closeButton.innerHTML = /* html */`<svg part="close-tab-icon" xmlns="http://www.w3.org/2000/svg" width="0.875em" height="0.875em" fill="currentColor" viewBox="0 0 16 16"><path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z"/></svg>`;
        this.shadowRoot.querySelector('.tab').appendChild(closeButton);
        closeButton.addEventListener('click', this.#onCloseButtonClick);
      } else {
        const closeButton = this.shadowRoot.querySelector('.tab__close');
        closeButton?.removeEventListener('click', this.#onCloseButtonClick);
        closeButton?.remove();
      }
    }
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
   * @param {MouseEvent} evt The click event.
   */
  #onCloseButtonClick = evt => {
    evt.stopPropagation();

    this.dispatchEvent(new CustomEvent(`${A_TAB}-close`, {
      bubbles: true,
      composed: true,
      detail: { tabId: this.id }
    }));
  };

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

if (window.customElements && !window.customElements.get(A_TAB)) {
  window.customElements.define(A_TAB, Tab);
}
