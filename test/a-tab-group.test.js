import { aTimeout, elementUpdated, expect, fixture, fixtureCleanup, html, oneEvent, triggerFocusFor } from '@open-wc/testing';
import { sendKeys } from '@web/test-runner-commands';
import { spy } from 'sinon';
import '../src/a-tab-group.js';

describe('a-tab-group', () => {
  beforeEach(() => {
    spy(console, 'error');

    // Disable ResizeObserver loop limit exceeded error.
    // https://stackoverflow.com/questions/49384120/resizeobserver-loop-limit-exceeded/64197640#64197640
    const errorHandler = window.onerror;
    window.onerror = (event, source, lineno, colno, error) => {
      if (event.includes('ResizeObserver')) {
        return true;
      } else if (errorHandler) {
        return errorHandler(event, source, lineno, colno, error);
      } else {
        return true;
      }
    };
  });

  afterEach(() => {
    fixtureCleanup();
    console.error.restore();
  });

  describe('accessibility', () => {
    it('passes accessibility test', async () => {
      const el = await fixture(html`
        <a-tab-group>
          <a-tab slot="tab" role="heading">Tab 1</a-tab>
          <a-tab-panel slot="panel">Panel 1</a-tab-panel>
          <a-tab slot="tab" role="heading" disabled>Tab 2</a-tab>
          <a-tab-panel slot="panel">Panel 2</a-tab-panel>
          <a-tab slot="tab" role="heading" closable>Tab 3</a-tab>
          <a-tab-panel slot="panel">Panel 3</a-tab-panel>
        </a-tab-group>
      `);

      await expect(el).to.be.accessible();
    });
  });

  describe('attributes - properties', () => {
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

    it('should remove attribute "no-scroll-controls" if property "noScrollControls" is false', async () => {
      const el = await fixture(html`<a-tab-group no-scroll-controls></a-tab-group>`);
      el.noScrollControls = false;
      await elementUpdated(el);
      expect(el).to.not.have.attribute('no-scroll-controls');
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

    it('if "scrollDistance" property is falsy, it should be set to 200', async () => {
      const el = await fixture(html`<a-tab-group></a-tab-group>`);
      el.scrollDistance = null;
      await elementUpdated(el);
      expect(el.scrollDistance).to.equal(200);
    });

    it('reflects attribute "activation" to property "activation"', async () => {
      const el = await fixture(html`<a-tab-group activation="manual"></a-tab-group>`);
      expect(el.activation).to.equal('manual');
    });

    it('reflects property "activation" to attribute "activation"', async () => {
      const el = await fixture(html`<a-tab-group></a-tab-group>`);
      el.activation = 'manual';
      await elementUpdated(el);
      expect(el.getAttribute('activation')).to.equal('manual');
    });

    it('if "activation" property is falsy, it should be set to "auto"', async () => {
      const el = await fixture(html`<a-tab-group></a-tab-group>`);
      el.activation = null;
      await elementUpdated(el);
      expect(el.activation).to.equal('auto');
    });
  });

  describe('basic functionality', () => {
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

    it('should remove a tab and its panel when clicking on the close button', async () => {
      const el = await fixture(html`
      <a-tab-group>
        <a-tab slot="tab" role="heading" selected>Tab 1</a-tab>
        <a-tab-panel slot="panel">Panel 1</a-tab-panel>
        <a-tab slot="tab" role="heading" closable>Tab 2</a-tab>
        <a-tab-panel slot="panel">Panel 2</a-tab-panel>
        <a-tab slot="tab" role="heading">Tab 3</a-tab>
        <a-tab-panel slot="panel">Panel 3</a-tab-panel>
      </a-tab-group>
    `);

      expect(el.querySelectorAll('a-tab').length).to.equal(3);
      expect(el.querySelectorAll('a-tab-panel').length).to.equal(3);

      el.querySelectorAll('a-tab')[1].shadowRoot.querySelector('.close-tab').click();

      expect(el.querySelectorAll('a-tab').length).to.equal(2);
      expect(el.querySelectorAll('a-tab-panel').length).to.equal(2);
    });
  });

  describe('keyboard navigation', () => {
    it('cycle through tabs using "Right" and "Down" arrow keys when activation is "auto"', async () => {
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

    it('cycle through tabs using "Right" and "Down" arrow keys when activation is "manual"', async () => {
      const el = await fixture(html`
        <a-tab-group activation="manual">
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

      // Pressing right arrow key should focus but not select tab 2
      await sendKeys({ press: 'ArrowRight' });

      expect(el.querySelectorAll('a-tab')[1].matches(':focus')).to.be.true;
      expect(el.querySelectorAll('a-tab')[1].selected).to.be.false;
      expect(el.querySelectorAll('a-tab-panel')[1].hidden).to.be.true;

      // Pressing right arrow key should focus but not select tab 4 (tab 3 is disabled)
      await sendKeys({ press: 'ArrowRight' });

      expect(el.querySelectorAll('a-tab')[3].matches(':focus')).to.be.true;
      expect(el.querySelectorAll('a-tab')[3].selected).to.be.false;
      expect(el.querySelectorAll('a-tab-panel')[3].hidden).to.be.true;

      // Pressing down arrow key should focus back on tab 1
      await sendKeys({ press: 'ArrowDown' });

      expect(el.querySelectorAll('a-tab')[0].matches(':focus')).to.be.true;
      expect(el.querySelectorAll('a-tab')[0].selected).to.be.true;
      expect(el.querySelectorAll('a-tab-panel')[0].hidden).to.be.false;
    });

    it('cycle through tabs using "Left" and "Up" arrow keys when activation is "auto"', async () => {
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

      await triggerFocusFor(el.querySelectorAll('a-tab')[3]);

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

    it('cycle through tabs using "Left" and "Up" arrow keys when activation is "manual"', async () => {
      const el = await fixture(html`
        <a-tab-group activation="manual">
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

      await triggerFocusFor(el.querySelectorAll('a-tab')[3]);

      // Pressing left arrow key should focus but not select tab 2 (tab 3 is disabled)
      await sendKeys({ press: 'ArrowLeft' });

      expect(el.querySelectorAll('a-tab')[1].matches(':focus')).to.be.true;
      expect(el.querySelectorAll('a-tab')[1].selected).to.be.false;
      expect(el.querySelectorAll('a-tab-panel')[1].hidden).to.be.true;

      // Pressing left arrow key should focus but not select tab 1
      await sendKeys({ press: 'ArrowLeft' });

      expect(el.querySelectorAll('a-tab')[0].matches(':focus')).to.be.true;
      expect(el.querySelectorAll('a-tab')[0].selected).to.be.false;
      expect(el.querySelectorAll('a-tab-panel')[0].hidden).to.be.true;

      // Pressing up arrow key should focus back on tab 4
      await sendKeys({ press: 'ArrowUp' });

      expect(el.querySelectorAll('a-tab')[3].matches(':focus')).to.be.true;
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

    it('should focus on the first and last non-disabled tabs when pressing "Home" and "End" keys respectively with activation "manual"', async () => {
      const el = await fixture(html`
        <a-tab-group activation="manual">
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

      // Tab 1 is disabled, so tab 2 should be focused
      expect(el.querySelectorAll('a-tab')[1].matches(':focus')).to.be.true;
      expect(el.querySelectorAll('a-tab')[1].selected).to.be.false;
      expect(el.querySelectorAll('a-tab-panel')[1].hidden).to.be.true;

      await sendKeys({ press: 'End' });

      // Tab 5 is disabled, so tab 4 should be focused
      expect(el.querySelectorAll('a-tab')[3].matches(':focus')).to.be.true;
      expect(el.querySelectorAll('a-tab')[3].selected).to.be.false;
      expect(el.querySelectorAll('a-tab-panel')[3].hidden).to.be.true;
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

    it('should ignore any other key press', async () => {
      const el = await fixture(html`
        <a-tab-group>
          <a-tab slot="tab" role="heading">Tab 1</a-tab>
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

      // Tab 1 should still be selected when pressing "A" key
      await triggerFocusFor(el.querySelectorAll('a-tab')[0]);
      await sendKeys({ press: 'A' });

      expect(el.querySelectorAll('a-tab')[0].selected).to.be.true;
      expect(el.querySelectorAll('a-tab-panel')[0].hidden).to.be.false;
    });
  });

  describe('scroll functionality', () => {
    it('should display scroll buttons if tabs overflow', async () => {
      const el = await fixture(html`
      <a-tab-group style="width: 100px;">
        <a-tab slot="tab" role="heading" selected>Tab 1</a-tab>
        <a-tab-panel slot="panel">Panel 1</a-tab-panel>
        <a-tab slot="tab" role="heading" closable>Tab 2</a-tab>
        <a-tab-panel slot="panel">Panel 2</a-tab-panel>
        <a-tab slot="tab" role="heading">Tab 3</a-tab>
        <a-tab-panel slot="panel">Panel 3</a-tab-panel>
      </a-tab-group>
    `);

      const scrollButtons = el.shadowRoot.querySelectorAll('.tab-group__scroll-button');
      scrollButtons.forEach((button) => {
        expect(button.hidden).to.be.false;
      });
    });

    it('should not display scroll buttons if tabs overflow when "no-scroll-controls" is set', async () => {
      const el = await fixture(html`
      <a-tab-group no-scroll-controls style="width: 100px;">
        <a-tab slot="tab" role="heading" selected>Tab 1</a-tab>
        <a-tab-panel slot="panel">Panel 1</a-tab-panel>
        <a-tab slot="tab" role="heading" closable>Tab 2</a-tab>
        <a-tab-panel slot="panel">Panel 2</a-tab-panel>
        <a-tab slot="tab" role="heading">Tab 3</a-tab>
        <a-tab-panel slot="panel">Panel 3</a-tab-panel>
      </a-tab-group>
    `);

      const scrollButtons = el.shadowRoot.querySelectorAll('.tab-group__scroll-button');
      scrollButtons.forEach((button) => expect(button.hidden).to.be.true);
    });

    it('should scroll tabs towards on scroll button click', async () => {
      const el = await fixture(html`
      <a-tab-group style="width: 100px; --scroll-behavior: auto;">
        <a-tab slot="tab" role="heading" selected>Tab 1</a-tab>
        <a-tab-panel slot="panel">Panel 1</a-tab-panel>
        <a-tab slot="tab" role="heading" closable>Tab 2</a-tab>
        <a-tab-panel slot="panel">Panel 2</a-tab-panel>
        <a-tab slot="tab" role="heading">Tab 3</a-tab>
        <a-tab-panel slot="panel">Panel 3</a-tab-panel>
      </a-tab-group>
    `);

      const scrollButton = el.shadowRoot.querySelector('.tab-group__scroll-button--end');
      scrollButton.click();
      await aTimeout(250); // Wait for scroll to finish.
      const tabsContainer = el.shadowRoot.querySelector('.tab-group__tabs');
      expect(tabsContainer.scrollLeft).to.be.greaterThan(0);
    });
  });

  describe('custom events', () => {
    it('should fire "a-tab-select" event on tab click', async () => {
      const el = await fixture(html`
        <a-tab-group>
          <a-tab id="tab-1" slot="tab" role="heading" selected>Tab 1</a-tab>
          <a-tab-panel id="panel-1" slot="panel">Panel 1</a-tab-panel>
          <a-tab id="tab-2" slot="tab" role="heading">Tab 2</a-tab>
          <a-tab-panel id="panel-2" slot="panel">Panel 2</a-tab-panel>
        </a-tab-group>
      `);

      const listener = oneEvent(el, 'a-tab-select');
      el.querySelectorAll('a-tab')[1].click();
      const { detail } = await listener;
      expect(detail).to.deep.equal({ tabId: 'tab-2' });
    });

    it('should fire "a-tab-close" event on close button click', async () => {
      const el = await fixture(html`
        <a-tab-group>
          <a-tab id="tab-1" slot="tab" role="heading" selected>Tab 1</a-tab>
          <a-tab-panel id="panel-1" slot="panel">Panel 1</a-tab-panel>
          <a-tab id="tab-2" slot="tab" role="heading" closable>Tab 2</a-tab>
          <a-tab-panel id="panel-2" slot="panel">Panel 2</a-tab-panel>
        </a-tab-group>
      `);

      const listener = oneEvent(el, 'a-tab-close');
      el.querySelectorAll('a-tab')[1].shadowRoot.querySelector('.close-tab').click();
      const { detail } = await listener;
      expect(detail).to.deep.equal({ tabId: 'tab-2' });
    });
  });

  describe('errors', () => {
    it('should log an error if a tab is not a sibling of a tab-panel element', async () => {
      await fixture(html`
        <a-tab-group>
          <a-tab id="orphan-tab" slot="tab" role="heading">Tab 1</a-tab>
        </a-tab-group>
      `);

      expect(console.error).to.have.been.calledOnceWithExactly('Tab #orphan-tab is not a sibling of a <a-tab-panel>');
    });
  });
});
