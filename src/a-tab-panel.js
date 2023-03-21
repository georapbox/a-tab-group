const A_TAB_PANEL = 'a-tab-panel';
let panelCounter = 0;

/**
 * `TabPanel` is a panel for a `<a-tab-group>` tab panel.
 */
class TabPanel extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.setAttribute('role', 'tabpanel');

    if (!this.id) {
      this.id = `a-tab-panel-generated-${panelCounter++}`;
    }
  }
}

if (window.customElements && !window.customElements.get(A_TAB_PANEL)) {
  window.customElements.define(A_TAB_PANEL, TabPanel);
}
