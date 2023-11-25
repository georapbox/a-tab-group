// @ts-check

import { uid } from './utils/uid.js';

const A_TAB_PANEL = 'a-tab-panel';
const template = document.createElement('template');
let panelCounter = 0;

template.innerHTML = /* html */`
  <style>
    :host {
      box-sizing: border-box;
      display: block;
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
  </style>

  <div part="base" class="tab-panel">
    <slot></slot>
  </div>
`;

/**
 * @summary This is a panel for a `<a-tab-group>` tab panel.
 * @documentation https://github.com/georapbox/a-tab-group
 *
 * @tagname a-tab-panel
 * @extends HTMLElement
 *
 * @csspart base - The component's base wrapper.
 *
 * @slot - The content of the tab panel.
 */
class TabPanel extends HTMLElement {
  constructor() {
    super();

    if (!this.shadowRoot) {
      const shadowRoot = this.attachShadow({ mode: 'open' });
      shadowRoot.appendChild(template.content.cloneNode(true));
    }
  }

  /**
   * Lifecycle method that is called when the element is first connected to the DOM.
   */
  connectedCallback() {
    this.setAttribute('slot', 'panel');
    this.setAttribute('role', 'tabpanel');
    this.setAttribute('hidden', '');

    if (!this.id) {
      this.id = uid('panel', (++panelCounter).toString());
    }
  }

  static defineCustomElement(elementName = A_TAB_PANEL) {
    if (typeof window !== 'undefined' && !window.customElements.get(elementName)) {
      window.customElements.define(elementName, TabPanel);
    }
  }
}

TabPanel.defineCustomElement();

export { TabPanel };
