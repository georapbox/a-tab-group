import { elementUpdated, expect, fixture, fixtureCleanup, html } from '@open-wc/testing';
import '../src/a-tab-panel.js';

describe('a-tab-panel', () => {
  afterEach(() => {
    fixtureCleanup();
  });

  describe('slots', () => {
    it('should have default/unnamed slot', async () => {
      const el = await fixture(html`<a-tab-panel></a-tab-panel>`);
      const slot = el.shadowRoot.querySelector('slot:not([name])');
      expect(slot).to.exist;
    });

    it('should add a panel text to the default/unnamed slot', async () => {
      const el = await fixture(html`<a-tab-panel></a-tab-panel>`);
      const slot = el.shadowRoot.querySelector('slot:not([name])');
      const panelText = document.createTextNode('PANEL');
      el.appendChild(panelText);
      await elementUpdated(el);
      expect(slot.assignedNodes()).to.include(panelText);
    });
  });
});
