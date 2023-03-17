import { elementUpdated, expect, fixture, fixtureCleanup, html, oneEvent, triggerFocusFor } from '@open-wc/testing';
import { sendKeys } from '@web/test-runner-commands';
import { spy } from 'sinon';
import '../src/a-tab-group.js';

describe('a-tab-group', () => {
  beforeEach(() => {
    spy(console, 'error');
  });

  afterEach(() => {
    fixtureCleanup();
    console.error.restore();
  });

  /**
   * Accessibility
   */
  it('passes accessibility test', async () => {
    const el = await fixture(html`
      <a-tab-group>
        <a-tab slot="tab" role="heading">Tab 1</a-tab>
        <a-tab-panel slot="panel">Panel 1</a-tab-panel>
        <a-tab slot="tab" role="heading" disabled>Tab 2</a-tab>
        <a-tab-panel slot="panel">Panel 2</a-tab-panel>
      </a-tab-group>
    `);

    await expect(el).to.be.accessible();
  });

  /**
   * Attributes/properties
   */
  it('reflects attribute "placement" to property "placement"', async () => {
    const el = await fixture(html`<a-tab-group placement="top"></a-tab-group>`);
    expect(el.placement).to.equal('top');
  });

  it('reflects property "placelement" to attribute "placement"', async () => {
    const el = await fixture(html`<a-tab-group></a-tab-group>`);
    el.placement = 'top';
    await elementUpdated(el);
    expect(el.getAttribute('placement')).to.equal('top');
  });

  it('reflects attribute "no-scroll-controls" to property "noScrollControls"', async () => {
    const el = await fixture(html`<a-tab-group no-scroll-controls></a-tab-group>`);
    expect(el.noScrollControls).to.be.true;
  });

  it('reflects property "noScrollControls" to attribute "no-scroll-controls"', async () => {
    const el = await fixture(html`<a-tab-group></a-tab-group>`);
    el.noScrollControls = true;
    await elementUpdated(el);
    expect(el).to.have.attribute('no-scroll-controls');
  });

  it('reflects attribute "scroll-distance" to property "scrollDistance"', async () => {
    const el = await fixture(html`<a-tab-group scroll-distance="100"></a-tab-group>`);
    expect(el.scrollDistance).to.equal(100);
  });

  it('reflects property "scrollDistance" to attribute "scroll-distance"', async () => {
    const el = await fixture(html`<a-tab-group></a-tab-group>`);
    el.scrollDistance = 100;
    await elementUpdated(el);
    expect(el.getAttribute('scroll-distance')).to.equal('100');
  });

  /**
   * Tabs/panels
   */
  it('should be hidden if no tabs', async () => {
    const el = await fixture(html`<a-tab-group></a-tab-group>`);

    expect(el.hidden).to.be.true;
  });

  it('should display 2 tabs and 2 panels', async () => {
    const el = await fixture(html`
      <a-tab-group>
        <a-tab slot="tab" role="heading">Tab 1</a-tab>
        <a-tab-panel slot="panel">Panel 1</a-tab-panel>
        <a-tab slot="tab" role="heading">Tab 2</a-tab>
        <a-tab-panel slot="panel">Panel 2</a-tab-panel>
      </a-tab-group>
    `);

    expect(el.querySelectorAll('a-tab')).to.have.length(2);
    expect(el.querySelectorAll('a-tab-panel')).to.have.length(2);
  });

  it('should select the first tab if no tab is selected', async () => {
    const el = await fixture(html`
      <a-tab-group>
        <a-tab slot="tab" role="heading">Tab 1</a-tab>
        <a-tab-panel slot="panel">Panel 1</a-tab-panel>
        <a-tab slot="tab" role="heading">Tab 2</a-tab>
        <a-tab-panel slot="panel">Panel 2</a-tab-panel>
      </a-tab-group>
    `);

    expect(el.querySelector('a-tab[selected]')).to.equal(el.querySelector('a-tab'));
  });

  it('should select the second tab if the second tab is selected', async () => {
    const el = await fixture(html`
      <a-tab-group>
        <a-tab slot="tab" role="heading">Tab 1</a-tab>
        <a-tab-panel slot="panel">Panel 1</a-tab-panel>
        <a-tab slot="tab" role="heading" selected>Tab 2</a-tab>
        <a-tab-panel slot="panel">Panel 2</a-tab-panel>
      </a-tab-group>
    `);

    expect(el.querySelector('a-tab[selected]')).to.equal(el.querySelectorAll('a-tab')[1]);
  });

  it('should hide panels if their tabs are not selected', async () => {
    const el = await fixture(html`
      <a-tab-group>
        <a-tab slot="tab" role="heading" selected>Tab 1</a-tab>
        <a-tab-panel slot="panel">Panel 1</a-tab-panel>
        <a-tab slot="tab" role="heading">Tab 2</a-tab>
        <a-tab-panel slot="panel">Panel 2</a-tab-panel>
        <a-tab slot="tab" role="heading">Tab 3</a-tab>
        <a-tab-panel slot="panel">Panel 3</a-tab-panel>
      </a-tab-group>
    `);

    expect(el.querySelectorAll('a-tab-panel')[0].hidden).to.be.false;
    expect(el.querySelectorAll('a-tab-panel')[1].hidden).to.be.true;
    expect(el.querySelectorAll('a-tab-panel')[2].hidden).to.be.true;
  });

  /**
   * Navigation
   */
  it('should select tab on click', async () => {
    const el = await fixture(html`
      <a-tab-group>
        <a-tab slot="tab" role="heading" selected>Tab 1</a-tab>
        <a-tab-panel slot="panel">Panel 1</a-tab-panel>
        <a-tab slot="tab" role="heading">Tab 2</a-tab>
        <a-tab-panel slot="panel">Panel 2</a-tab-panel>
      </a-tab-group>
    `);

    el.querySelectorAll('a-tab')[1].click();
    await elementUpdated(el);

    expect(el.querySelectorAll('a-tab')[0].selected).to.be.false;
    expect(el.querySelectorAll('a-tab-panel')[0].hidden).to.be.true;

    expect(el.querySelectorAll('a-tab')[1].selected).to.be.true;
    expect(el.querySelectorAll('a-tab-panel')[1].hidden).to.be.false;
  });

  it('should not select tab on click if disabled', async () => {
    const el = await fixture(html`
      <a-tab-group>
        <a-tab slot="tab" role="heading" selected>Tab 1</a-tab>
        <a-tab-panel slot="panel">Panel 1</a-tab-panel>
        <a-tab slot="tab" role="heading" disabled>Tab 2</a-tab>
        <a-tab-panel slot="panel">Panel 2</a-tab-panel>
      </a-tab-group>
    `);

    el.querySelectorAll('a-tab')[1].click();
    await elementUpdated(el);

    expect(el.querySelectorAll('a-tab')[0].selected).to.be.true;
    expect(el.querySelectorAll('a-tab-panel')[0].hidden).to.be.false;

    expect(el.querySelectorAll('a-tab')[1].selected).to.be.false;
    expect(el.querySelectorAll('a-tab-panel')[1].hidden).to.be.true;
  });

  it('should select a tab when calling "selectTab" method', async () => {
    const el = await fixture(html`
      <a-tab-group>
        <a-tab slot="tab" role="heading" selected>Tab 1</a-tab>
        <a-tab-panel slot="panel">Panel 1</a-tab-panel>
        <a-tab slot="tab" role="heading">Tab 2</a-tab>
        <a-tab-panel slot="panel">Panel 2</a-tab-panel>
      </a-tab-group>
    `);

    await elementUpdated(el);

    el.selectTab(el.querySelectorAll('a-tab')[1]);

    expect(el.querySelectorAll('a-tab')[0].selected).to.be.false;
    expect(el.querySelectorAll('a-tab-panel')[0].hidden).to.be.true;

    expect(el.querySelectorAll('a-tab')[1].selected).to.be.true;
    expect(el.querySelectorAll('a-tab-panel')[1].hidden).to.be.false;
  });

  it('should not select a tab when calling "selectTab" method if tab is disabled', async () => {
    const el = await fixture(html`
      <a-tab-group>
        <a-tab slot="tab" role="heading" selected>Tab 1</a-tab>
        <a-tab-panel slot="panel">Panel 1</a-tab-panel>
        <a-tab slot="tab" role="heading" disabled>Tab 2</a-tab>
        <a-tab-panel slot="panel">Panel 2</a-tab-panel>
      </a-tab-group>
    `);

    await elementUpdated(el);

    el.selectTab(el.querySelectorAll('a-tab')[1]);

    expect(el.querySelectorAll('a-tab')[0].selected).to.be.true;
    expect(el.querySelectorAll('a-tab-panel')[0].hidden).to.be.false;

    expect(el.querySelectorAll('a-tab')[1].selected).to.be.false;
    expect(el.querySelectorAll('a-tab-panel')[1].hidden).to.be.true;
  });

  it('should select a tab when calling "selectTabByIndex" method', async () => {
    const el = await fixture(html`
      <a-tab-group>
        <a-tab slot="tab" role="heading" selected>Tab 1</a-tab>
        <a-tab-panel slot="panel">Panel 1</a-tab-panel>
        <a-tab slot="tab" role="heading">Tab 2</a-tab>
        <a-tab-panel slot="panel">Panel 2</a-tab-panel>
      </a-tab-group>
    `);

    await elementUpdated(el);

    el.selectTabByIndex(1);

    expect(el.querySelectorAll('a-tab')[0].selected).to.be.false;
    expect(el.querySelectorAll('a-tab-panel')[0].hidden).to.be.true;

    expect(el.querySelectorAll('a-tab')[1].selected).to.be.true;
    expect(el.querySelectorAll('a-tab-panel')[1].hidden).to.be.false;
  });

  it('should not select a tab when calling "selectTabByIndex" method if tab is disabled', async () => {
    const el = await fixture(html`
      <a-tab-group>
        <a-tab slot="tab" role="heading" selected>Tab 1</a-tab>
        <a-tab-panel slot="panel">Panel 1</a-tab-panel>
        <a-tab slot="tab" role="heading" disabled>Tab 2</a-tab>
        <a-tab-panel slot="panel">Panel 2</a-tab-panel>
      </a-tab-group>
    `);

    await elementUpdated(el);

    el.selectTabByIndex(1);

    expect(el.querySelectorAll('a-tab')[0].selected).to.be.true;
    expect(el.querySelectorAll('a-tab-panel')[0].hidden).to.be.false;

    expect(el.querySelectorAll('a-tab')[1].selected).to.be.false;
    expect(el.querySelectorAll('a-tab-panel')[1].hidden).to.be.true;
  });

  it('should cycle through tabs when pressing "ArrowRight" or "ArrowDown" keys, omitting disabled tabs', async () => {
    const el = await fixture(html`
      <a-tab-group>
        <a-tab slot="tab" role="heading" selected>Tab 1</a-tab>
        <a-tab-panel slot="panel">Panel 1</a-tab-panel>
        <a-tab slot="tab" role="heading">Tab 2</a-tab>
        <a-tab-panel slot="panel">Panel 2</a-tab-panel>
        <a-tab slot="tab" role="heading" disabled>Tab 3</a-tab>
        <a-tab-panel slot="panel">Panel 3</a-tab-panel>
        <a-tab slot="tab" role="heading">Tab 4</a-tab>
        <a-tab-panel slot="panel">Panel 4</a-tab-panel>
      </a-tab-group>
    `);

    // Tab 1 should be selected by default
    expect(el.querySelectorAll('a-tab')[0].selected).to.be.true;
    expect(el.querySelectorAll('a-tab-panel')[0].hidden).to.be.false;

    await triggerFocusFor(el.querySelectorAll('a-tab')[0]);

    // Pressing right arrow key should select tab 2
    await sendKeys({ press: 'ArrowRight' });

    expect(el.querySelectorAll('a-tab')[1].selected).to.be.true;
    expect(el.querySelectorAll('a-tab-panel')[1].hidden).to.be.false;

    // Pressing right arrow key should select tab 4 (tab 3 is disabled)
    await sendKeys({ press: 'ArrowRight' });

    expect(el.querySelectorAll('a-tab')[3].selected).to.be.true;
    expect(el.querySelectorAll('a-tab-panel')[3].hidden).to.be.false;

    // Pressing down arrow key should select tab 1 again
    await sendKeys({ press: 'ArrowDown' });

    expect(el.querySelectorAll('a-tab')[0].selected).to.be.true;
    expect(el.querySelectorAll('a-tab-panel')[0].hidden).to.be.false;
  });

  it('should cycle through tabs when pressing "ArrowLeft" or "ArrowUp" keys', async () => {
    const el = await fixture(html`
      <a-tab-group>
        <a-tab slot="tab" role="heading">Tab 1</a-tab>
        <a-tab-panel slot="panel">Panel 1</a-tab-panel>
        <a-tab slot="tab" role="heading">Tab 2</a-tab>
        <a-tab-panel slot="panel">Panel 2</a-tab-panel>
        <a-tab slot="tab" role="heading" disabled>Tab 3</a-tab>
        <a-tab-panel slot="panel">Panel 3</a-tab-panel>
        <a-tab slot="tab" role="heading" selected>Tab 4</a-tab>
        <a-tab-panel slot="panel">Panel 4</a-tab-panel>
      </a-tab-group>
    `);

    // Tab 4 should be selected by default
    expect(el.querySelectorAll('a-tab')[3].selected).to.be.true;
    expect(el.querySelectorAll('a-tab-panel')[3].hidden).to.be.false;

    await triggerFocusFor(el.querySelectorAll('a-tab')[0]);

    // Pressing left arrow key should select tab 2 (tab 3 is disabled)
    await sendKeys({ press: 'ArrowLeft' });

    expect(el.querySelectorAll('a-tab')[1].selected).to.be.true;
    expect(el.querySelectorAll('a-tab-panel')[1].hidden).to.be.false;

    // Pressing left arrow key should select tab 1
    await sendKeys({ press: 'ArrowLeft' });

    expect(el.querySelectorAll('a-tab')[0].selected).to.be.true;
    expect(el.querySelectorAll('a-tab-panel')[0].hidden).to.be.false;

    // Pressing up arrow key should select tab 4 again
    await sendKeys({ press: 'ArrowUp' });

    expect(el.querySelectorAll('a-tab')[3].selected).to.be.true;
    expect(el.querySelectorAll('a-tab-panel')[3].hidden).to.be.false;
  });

  it('should select the first and last tab when pressing "Home" and "End" keys respectively', async () => {
    const el = await fixture(html`
      <a-tab-group>
        <a-tab slot="tab" role="heading">Tab 1</a-tab>
        <a-tab-panel slot="panel">Panel 1</a-tab-panel>
        <a-tab slot="tab" role="heading">Tab 2</a-tab>
        <a-tab-panel slot="panel">Panel 2</a-tab-panel>
        <a-tab slot="tab" role="heading" selected>Tab 3</a-tab>
        <a-tab-panel slot="panel">Panel 3</a-tab-panel>
        <a-tab slot="tab" role="heading">Tab 4</a-tab>
        <a-tab-panel slot="panel">Panel 4</a-tab-panel>
        <a-tab slot="tab" role="heading">Tab 5</a-tab>
        <a-tab-panel slot="panel">Panel 5</a-tab-panel>
      </a-tab-group>
    `);

    // Tab 3 should be selected by default
    expect(el.querySelectorAll('a-tab')[2].selected).to.be.true;
    expect(el.querySelectorAll('a-tab-panel')[2].hidden).to.be.false;

    await triggerFocusFor(el.querySelectorAll('a-tab')[0]);
    await sendKeys({ press: 'Home' });

    expect(el.querySelectorAll('a-tab')[0].selected).to.be.true;
    expect(el.querySelectorAll('a-tab-panel')[0].hidden).to.be.false;

    await sendKeys({ press: 'End' });

    expect(el.querySelectorAll('a-tab')[4].selected).to.be.true;
    expect(el.querySelectorAll('a-tab-panel')[4].hidden).to.be.false;
  });

  it('should select the first and last non-disabled tabs when pressing "Home" and "End" keys respectively', async () => {
    const el = await fixture(html`
      <a-tab-group>
        <a-tab slot="tab" role="heading" disabled>Tab 1</a-tab>
        <a-tab-panel slot="panel">Panel 1</a-tab-panel>
        <a-tab slot="tab" role="heading">Tab 2</a-tab>
        <a-tab-panel slot="panel">Panel 2</a-tab-panel>
        <a-tab slot="tab" role="heading" selected>Tab 3</a-tab>
        <a-tab-panel slot="panel">Panel 3</a-tab-panel>
        <a-tab slot="tab" role="heading">Tab 4</a-tab>
        <a-tab-panel slot="panel">Panel 4</a-tab-panel>
        <a-tab slot="tab" role="heading" disabled>Tab 5</a-tab>
        <a-tab-panel slot="panel">Panel 5</a-tab-panel>
      </a-tab-group>
    `);

    // Tab 3 should be selected by default
    expect(el.querySelectorAll('a-tab')[2].selected).to.be.true;
    expect(el.querySelectorAll('a-tab-panel')[2].hidden).to.be.false;

    await triggerFocusFor(el.querySelectorAll('a-tab')[0]);
    await sendKeys({ press: 'Home' });

    // Tab 1 is disabled, so tab 2 should be selected
    expect(el.querySelectorAll('a-tab')[1].selected).to.be.true;
    expect(el.querySelectorAll('a-tab-panel')[1].hidden).to.be.false;

    await sendKeys({ press: 'End' });

    // Tab 5 is disabled, so tab 4 should be selected
    expect(el.querySelectorAll('a-tab')[3].selected).to.be.true;
    expect(el.querySelectorAll('a-tab-panel')[3].hidden).to.be.false;
  });

  it('should select a tab when focusing on it and pressing "Enter" or "Space" keys', async () => {
    const el = await fixture(html`
      <a-tab-group>
        <a-tab slot="tab" role="heading" selected>Tab 1</a-tab>
        <a-tab-panel slot="panel">Panel 1</a-tab-panel>
        <a-tab slot="tab" role="heading">Tab 2</a-tab>
        <a-tab-panel slot="panel">Panel 2</a-tab-panel>
        <a-tab slot="tab" role="heading">Tab 3</a-tab>
        <a-tab-panel slot="panel">Panel 3</a-tab-panel>
      </a-tab-group>
    `);

    // Tab 1 should be selected by default
    expect(el.querySelectorAll('a-tab')[0].selected).to.be.true;
    expect(el.querySelectorAll('a-tab-panel')[0].hidden).to.be.false;

    // Tab 2 should be selected when pressing "Enter" key
    await triggerFocusFor(el.querySelectorAll('a-tab')[1]);
    await sendKeys({ press: 'Enter' });

    expect(el.querySelectorAll('a-tab')[1].selected).to.be.true;
    expect(el.querySelectorAll('a-tab-panel')[1].hidden).to.be.false;

    // Tab 3 should be selected when pressing "Space" key
    await triggerFocusFor(el.querySelectorAll('a-tab')[2]);
    await sendKeys({ press: 'Space' });

    expect(el.querySelectorAll('a-tab')[2].selected).to.be.true;
    expect(el.querySelectorAll('a-tab-panel')[2].hidden).to.be.false;
  });

  it('should select the first non-disabled tab if a tab is disabled but also selected', async () => {
    const el = await fixture(html`
      <a-tab-group>
        <a-tab slot="tab" role="heading" disabled selected>Tab 1</a-tab>
        <a-tab-panel slot="panel">Panel 1</a-tab-panel>
        <a-tab slot="tab" role="heading">Tab 2</a-tab>
        <a-tab-panel slot="panel">Panel 2</a-tab-panel>
        <a-tab slot="tab" role="heading">Tab 3</a-tab>
        <a-tab-panel slot="panel">Panel 3</a-tab-panel>
      </a-tab-group>
    `);

    // Tab 1 is disabled, so tab 2 should be selected
    expect(el.querySelectorAll('a-tab')[1].selected).to.be.true;
    expect(el.querySelectorAll('a-tab-panel')[1].hidden).to.be.false;
  });

  /**
   * Events
   */
  it('should fire "a-tab-group:change" event on tab click', async () => {
    const el = await fixture(html`
      <a-tab-group>
        <a-tab id="tab-1" slot="tab" role="heading" selected>Tab 1</a-tab>
        <a-tab-panel id="panel-1" slot="panel">Panel 1</a-tab-panel>
        <a-tab id="tab-2" slot="tab" role="heading">Tab 2</a-tab>
        <a-tab-panel id="panel-2" slot="panel">Panel 2</a-tab-panel>
      </a-tab-group>
    `);

    const listener = oneEvent(el, 'a-tab-group:change');

    el.querySelectorAll('a-tab')[1].click();

    const { detail } = await listener;

    expect(detail).to.deep.equal({
      tabId: 'tab-2',
      panelId: 'panel-2'
    });
  });

  /**
   * Errors
   */
  it('should log an error if a tab is not a sibling of a tab-panel element', async () => {
    await fixture(html`
      <a-tab-group>
        <a-tab id="orphan-tab" slot="tab" role="heading">Tab 1</a-tab>
      </a-tab-group>
    `);

    expect(console.error).to.have.been.calledOnceWithExactly('Tab #orphan-tab is not a sibling of a <a-tab-panel>');
  });
});
