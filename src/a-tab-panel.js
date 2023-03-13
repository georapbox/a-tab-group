let panelCounter = 0;

/**
 * `TabPanel` is a panel for a `<a-tab-group>` tab panel.
 *
 * @csspart tab-panel - The tab panel.
 */
class TabPanel extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.setAttribute('role', 'tabpanel');
    this.part.add('tab-panel');

    if (!this.id) {
      this.id = `a-tab-panel-generated-${panelCounter++}`;
    }
  }
}

if (window.customElements && !window.customElements.get('a-tab-panel')) {
  window.customElements.define('a-tab-panel', TabPanel);
}
