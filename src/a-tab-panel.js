const A_TAB_PANEL = 'a-tab-panel';
const template = document.createElement('template');
let panelCounter = 0;

template.innerHTML = /* html */`
  <style>
    :host {
      display: block;
      contain: content;
    }
  </style>

  <div part="base" class="tab-panel">
    <slot></slot>
  </div>
`;

/**
 * `TabPanel` is a panel for a `<a-tab-group>` tab panel.
 */
class TabPanel extends HTMLElement {
  constructor() {
    super();

    if (!this.shadowRoot) {
      this.attachShadow({ mode: 'open' });
      this.shadowRoot.appendChild(template.content.cloneNode(true));
    }
  }

  connectedCallback() {
    this.setAttribute('slot', 'panel');
    this.setAttribute('role', 'tabpanel');

    if (!this.id) {
      this.id = `a-tab-panel-generated-${panelCounter++}`;
    }
  }
}

if (window.customElements && !window.customElements.get(A_TAB_PANEL)) {
  window.customElements.define(A_TAB_PANEL, TabPanel);
}

export { TabPanel };