import { elementUpdated, expect, fixture, fixtureCleanup, html } from '@open-wc/testing';
import '../src/a-tab.js';

describe('a-tab', () => {
  afterEach(() => {
    fixtureCleanup();
  });

  /**
   * Attributes/properties
   */
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
