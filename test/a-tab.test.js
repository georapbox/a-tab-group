import { elementUpdated, expect, fixture, fixtureCleanup, html, oneEvent } from '@open-wc/testing';
import '../src/a-tab.js';

describe('a-tab', () => {
  afterEach(() => {
    fixtureCleanup();
  });

  describe('attributes - properties', () => {
    it('reflects attribute "selected" to property "selected"', async () => {
      const el = await fixture(html`<a-tab selected></a-tab>`);
      expect(el.selected).to.be.true;
    });

    it('reflects property "selected" to attribute "selected"', async () => {
      const el = await fixture(html`<a-tab></a-tab>`);
      el.selected = true;
      await elementUpdated(el);
      expect(el.hasAttribute('selected')).to.be.true;
    });

    it('should remove "selected" attribute when property "selected" is set to false', async () => {
      const el = await fixture(html`<a-tab selected></a-tab>`);
      el.selected = false;
      await elementUpdated(el);
      expect(el).to.not.have.attribute('selected');
    });

    it('reflects attribute "disabled" to property "disabled"', async () => {
      const el = await fixture(html`<a-tab disabled></a-tab>`);
      expect(el.disabled).to.be.true;
    });

    it('reflects property "disabled" to attribute "disabled"', async () => {
      const el = await fixture(html`<a-tab></a-tab>`);
      el.disabled = true;
      await elementUpdated(el);
      expect(el.hasAttribute('disabled')).to.be.true;
    });

    it('should remove "disabled" attribute when property "disabled" is set to false', async () => {
      const el = await fixture(html`<a-tab disabled></a-tab>`);
      el.disabled = false;
      await elementUpdated(el);
      expect(el).to.not.have.attribute('disabled');
    });

    it('reflects attribute "closable" to property "closable"', async () => {
      const el = await fixture(html`<a-tab closable></a-tab>`);
      expect(el.closable).to.be.true;
    });

    it('reflects property "closable" to attribute "closable"', async () => {
      const el = await fixture(html`<a-tab></a-tab>`);
      el.closable = true;
      await elementUpdated(el);
      expect(el.hasAttribute('closable')).to.be.true;
    });

    it('should remove "closable" attribute when property "closable" is set to false', async () => {
      const el = await fixture(html`<a-tab closable></a-tab>`);
      el.closable = false;
      await elementUpdated(el);
      expect(el).to.not.have.attribute('closable');
    });
  });

  describe('slots', () => {
    it('should have default/unnamed slot', async () => {
      const el = await fixture(html`<a-tab></a-tab>`);
      const slot = el.shadowRoot.querySelector('slot:not([name])');
      expect(slot).to.exist;
    });

    it('should add a tab text to the default/unnamed slot', async () => {
      const el = await fixture(html`<a-tab></a-tab>`);
      const slot = el.shadowRoot.querySelector('slot:not([name])');
      const tabText = document.createTextNode('TAB');
      el.appendChild(tabText);
      await elementUpdated(el);
      expect(slot.assignedNodes()).to.include(tabText);
    });
  });

  describe('CSS Parts', () => {
    it('should have "base" part', async () => {
      const el = await fixture(html`<a-tab></a-tab>`);
      const base = el.shadowRoot.querySelector('[part="base"]');
      expect(base).to.exist;
    });

    it('should have "close-tab" part', async () => {
      const el = await fixture(html`<a-tab closable></a-tab>`);
      const closeButton = el.shadowRoot.querySelector('[part="close-tab"]');
      expect(closeButton).to.exist;
    });

    it('should have "close-tab-icon" part', async () => {
      const el = await fixture(html`<a-tab closable></a-tab>`);
      const closeButtonIcon = el.shadowRoot.querySelector('[part="close-tab-icon"]');
      expect(closeButtonIcon).to.exist;
    });
  });

  describe('custom events', () => {
    it('should fire "a-tab-close" event on close button click', async () => {
      const el = await fixture(html`<a-tab id="tab-1" role="heading" closable></a-tab>`);
      const listener = oneEvent(el, 'a-tab-close');
      const closeButton = el.shadowRoot.querySelector('.tab__close');
      closeButton.click();
      const { detail } = await listener;
      expect(detail).to.deep.equal({ tabId: 'tab-1' });
    });
  });
});
