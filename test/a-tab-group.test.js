import { aTimeout, elementUpdated, expect, fixture, fixtureCleanup, html, oneEvent, triggerFocusFor } from '@open-wc/testing';
import { sendKeys } from '@web/test-runner-commands';
import sinon from 'sinon';
import '../src/a-tab-group.js';

describe('a-tab-group', () => {
  beforeEach(() => {
    sinon.spy(console, 'error');

    // Disable ResizeObserver loop limit exceeded error.
    // https://stackoverflow.com/questions/49384120/resizeobserver-loop-limit-exceeded/64197640#64197640
    const errorHandler = window.onerror;
    window.onerror = (event, source, lineno, colno, error) => {
      if (event.includes('ResizeObserver') || event === 'Script error.') {
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
          <a-tab role="heading">Tab 1</a-tab>
          <a-tab-panel>Panel 1</a-tab-panel>
          <a-tab role="heading" disabled>Tab 2</a-tab>
          <a-tab-panel>Panel 2</a-tab-panel>
          <a-tab role="heading" closable>Tab 3</a-tab>
          <a-tab-panel>Panel 3</a-tab-panel>
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

  describe('slots', () => {
    it('should have "tab" slot', async () => {
      const el = await fixture(html`<a-tab-group></a-tab-group>`);
      const tabSlot = el.shadowRoot.querySelector('slot[name="tab"]');
      expect(tabSlot).to.exist;
    });

    it('should have "panel" slot', async () => {
      const el = await fixture(html`<a-tab-group></a-tab-group>`);
      const panelSlot = el.shadowRoot.querySelector('slot[name="panel"]');
      expect(panelSlot).to.exist;
    });

    it('should add "tab" and "panel" slot attributes to tabs and panels respectively if not provided by default', async () => {
      const el = await fixture(html`
        <a-tab-group>
          <a-tab role="heading">Tab 1</a-tab>
          <a-tab-panel>Panel 1</a-tab-panel>
        </a-tab-group>
      `);

      expect(el.querySelector('a-tab')).to.have.attribute('slot', 'tab');
      expect(el.querySelector('a-tab-panel')).to.have.attribute('slot', 'panel');
    });
  });

  describe('CSS Parts', () => {
    it('should have "base" CSS part', async () => {
      const el = await fixture(html`<a-tab-group></a-tab-group>`);
      const base = el.shadowRoot.querySelector('[part="base"]');
      expect(base).to.exist;
    });

    it('should have "nav" CSS part', async () => {
      const el = await fixture(html`<a-tab-group></a-tab-group>`);
      const nav = el.shadowRoot.querySelector('[part*="nav"]');
      expect(nav).to.exist;
    });

    it('should have "nav--has-scroll-controls" CSS part if nav container is small enough and scroll controls are enabled', async () => {
      const el = await fixture(html`
        <!-- Small container to ensure nav is scrollable -->
        <a-tab-group style="width: 50px;">
          <a-tab role="heading">Tab 1</a-tab>
          <a-tab-panel>Panel 1</a-tab-panel>
          <a-tab role="heading">Tab 2</a-tab>
          <a-tab-panel>Panel 2</a-tab-panel>
        </a-tab-group>
      `);
      await elementUpdated(el);
      await aTimeout(100); // Wait for ResizeObserver
      const nav = el.shadowRoot.querySelector('[part*="nav--has-scroll-controls"]');
      expect(nav).to.exist;
    });

    it('should not have "nav--has-scroll-controls" CSS part if nav container is small enough but scroll controls are not enabled', async () => {
      const el = await fixture(html`
        <!-- Small container to ensure nav is scrollable -->
        <a-tab-group no-scroll-controls style="width: 50px;">
          <a-tab role="heading">Tab 1</a-tab>
          <a-tab-panel>Panel 1</a-tab-panel>
          <a-tab role="heading">Tab 2</a-tab>
          <a-tab-panel>Panel 2</a-tab-panel>
        </a-tab-group>
      `);
      await elementUpdated(el);
      await aTimeout(100); // Wait for ResizeObserver
      const nav = el.shadowRoot.querySelector('[part*="nav--has-scroll-controls"]');
      expect(nav).to.not.exist;
    });

    it('should have "scroll-button" CSS part', async () => {
      const el = await fixture(html`<a-tab-group></a-tab-group>`);
      const scrollButton = el.shadowRoot.querySelector('[part*="scroll-button"]');
      expect(scrollButton).to.exist;
    });

    it('should have "scroll-button--start" CSS part', async () => {
      const el = await fixture(html`<a-tab-group></a-tab-group>`);
      const scrollButtonStart = el.shadowRoot.querySelector('[part*="scroll-button--start"]');
      expect(scrollButtonStart).to.exist;
    });

    it('should have "scroll-button--end" CSS part', async () => {
      const el = await fixture(html`<a-tab-group></a-tab-group>`);
      const scrollButtonEnd = el.shadowRoot.querySelector('[part*="scroll-button--end"]');
      expect(scrollButtonEnd).to.exist;
    });

    it('should have "scroll-button-icon" CSS part', async () => {
      const el = await fixture(html`<a-tab-group></a-tab-group>`);
      const scrollButtonIcon = el.shadowRoot.querySelector('[part*="scroll-button-icon"]');
      expect(scrollButtonIcon).to.exist;
    });

    it('should have "tabs" CSS part', async () => {
      const el = await fixture(html`<a-tab-group></a-tab-group>`);
      const tabs = el.shadowRoot.querySelector('[part*="tabs"]');
      expect(tabs).to.exist;
    });

    it('should have "panels" CSS part', async () => {
      const el = await fixture(html`<a-tab-group></a-tab-group>`);
      const panels = el.shadowRoot.querySelector('[part*="panels"]');
      expect(panels).to.exist;
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
          <a-tab role="heading">Tab 1</a-tab>
          <a-tab-panel>Panel 1</a-tab-panel>
          <a-tab role="heading">Tab 2</a-tab>
          <a-tab-panel>Panel 2</a-tab-panel>
        </a-tab-group>
      `);

      expect(el.querySelectorAll('a-tab')).to.have.length(2);
      expect(el.querySelectorAll('a-tab-panel')).to.have.length(2);
    });

    it('should select the first tab if no tab is selected', async () => {
      const el = await fixture(html`
        <a-tab-group>
          <a-tab role="heading">Tab 1</a-tab>
          <a-tab-panel>Panel 1</a-tab-panel>
          <a-tab role="heading">Tab 2</a-tab>
          <a-tab-panel>Panel 2</a-tab-panel>
        </a-tab-group>
      `);

      expect(el.querySelector('a-tab[selected]')).to.equal(el.querySelector('a-tab'));
    });

    it('should select the second tab if the second tab is selected', async () => {
      const el = await fixture(html`
        <a-tab-group>
          <a-tab role="heading">Tab 1</a-tab>
          <a-tab-panel>Panel 1</a-tab-panel>
          <a-tab role="heading" selected>Tab 2</a-tab>
          <a-tab-panel>Panel 2</a-tab-panel>
        </a-tab-group>
      `);

      expect(el.querySelector('a-tab[selected]')).to.equal(el.querySelectorAll('a-tab')[1]);
    });

    it('should hide panels if their tabs are not selected', async () => {
      const el = await fixture(html`
        <a-tab-group>
          <a-tab role="heading" selected>Tab 1</a-tab>
          <a-tab-panel>Panel 1</a-tab-panel>
          <a-tab role="heading">Tab 2</a-tab>
          <a-tab-panel>Panel 2</a-tab-panel>
          <a-tab role="heading">Tab 3</a-tab>
          <a-tab-panel>Panel 3</a-tab-panel>
        </a-tab-group>
      `);

      expect(el.querySelectorAll('a-tab-panel')[0].hidden).to.be.false;
      expect(el.querySelectorAll('a-tab-panel')[1].hidden).to.be.true;
      expect(el.querySelectorAll('a-tab-panel')[2].hidden).to.be.true;
    });

    it('should select tab on click', async () => {
      const el = await fixture(html`
        <a-tab-group>
          <a-tab role="heading" selected>Tab 1</a-tab>
          <a-tab-panel>Panel 1</a-tab-panel>
          <a-tab role="heading">Tab 2</a-tab>
          <a-tab-panel>Panel 2</a-tab-panel>
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
          <a-tab role="heading" selected>Tab 1</a-tab>
          <a-tab-panel>Panel 1</a-tab-panel>
          <a-tab role="heading" disabled>Tab 2</a-tab>
          <a-tab-panel>Panel 2</a-tab-panel>
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
          <a-tab role="heading" selected>Tab 1</a-tab>
          <a-tab-panel>Panel 1</a-tab-panel>
          <a-tab role="heading">Tab 2</a-tab>
          <a-tab-panel>Panel 2</a-tab-panel>
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
          <a-tab role="heading" selected>Tab 1</a-tab>
          <a-tab-panel>Panel 1</a-tab-panel>
          <a-tab role="heading" disabled>Tab 2</a-tab>
          <a-tab-panel>Panel 2</a-tab-panel>
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
          <a-tab role="heading" selected>Tab 1</a-tab>
          <a-tab-panel>Panel 1</a-tab-panel>
          <a-tab role="heading">Tab 2</a-tab>
          <a-tab-panel>Panel 2</a-tab-panel>
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
          <a-tab role="heading" selected>Tab 1</a-tab>
          <a-tab-panel>Panel 1</a-tab-panel>
          <a-tab role="heading" disabled>Tab 2</a-tab>
          <a-tab-panel>Panel 2</a-tab-panel>
        </a-tab-group>
      `);

      await elementUpdated(el);

      el.selectTabByIndex(1);

      expect(el.querySelectorAll('a-tab')[0].selected).to.be.true;
      expect(el.querySelectorAll('a-tab-panel')[0].hidden).to.be.false;

      expect(el.querySelectorAll('a-tab')[1].selected).to.be.false;
      expect(el.querySelectorAll('a-tab-panel')[1].hidden).to.be.true;
    });

    it('should select a tab when calling "selectTabById" method', async () => {
      const el = await fixture(html`
        <a-tab-group>
          <a-tab role="heading" id="tab-1" selected>Tab 1</a-tab>
          <a-tab-panel id="panel-1">Panel 1</a-tab-panel>
          <a-tab role="heading" id="tab-2">Tab 2</a-tab>
          <a-tab-panel id="panel-2">Panel 2</a-tab-panel>
        </a-tab-group>
      `);

      await elementUpdated(el);

      el.selectTabById('tab-2');

      expect(el.querySelectorAll('a-tab')[0].selected).to.be.false;
      expect(el.querySelectorAll('a-tab-panel')[0].hidden).to.be.true;

      expect(el.querySelectorAll('a-tab')[1].selected).to.be.true;
      expect(el.querySelectorAll('a-tab-panel')[1].hidden).to.be.false;
    });

    it('should not select a tab when calling "selectTabById" method if tab is disabled', async () => {
      const el = await fixture(html`
        <a-tab-group>
          <a-tab role="heading" id="tab-1" selected>Tab 1</a-tab>
          <a-tab-panel id="panel-1">Panel 1</a-tab-panel>
          <a-tab role="heading" id="tab-2" disabled>Tab 2</a-tab>
          <a-tab-panel id="panel-2">Panel 2</a-tab-panel>
        </a-tab-group>
      `);

      await elementUpdated(el);

      el.selectTabById('tab-2');

      expect(el.querySelectorAll('a-tab')[0].selected).to.be.true;
      expect(el.querySelectorAll('a-tab-panel')[0].hidden).to.be.false;

      expect(el.querySelectorAll('a-tab')[1].selected).to.be.false;
      expect(el.querySelectorAll('a-tab-panel')[1].hidden).to.be.true;
    });

    it('should select the first non-disabled tab if a tab is disabled but also selected', async () => {
      const el = await fixture(html`
        <a-tab-group>
          <a-tab role="heading" disabled selected>Tab 1</a-tab>
          <a-tab-panel>Panel 1</a-tab-panel>
          <a-tab role="heading">Tab 2</a-tab>
          <a-tab-panel>Panel 2</a-tab-panel>
          <a-tab role="heading">Tab 3</a-tab>
          <a-tab-panel>Panel 3</a-tab-panel>
        </a-tab-group>
      `);

      // Tab 1 is disabled, so tab 2 should be selected
      expect(el.querySelectorAll('a-tab')[1].selected).to.be.true;
      expect(el.querySelectorAll('a-tab-panel')[1].hidden).to.be.false;
    });

    it('should remove a tab and its panel when clicking on the close button', async () => {
      const el = await fixture(html`
        <a-tab-group>
          <a-tab role="heading" selected>Tab 1</a-tab>
          <a-tab-panel>Panel 1</a-tab-panel>
          <a-tab role="heading" closable>Tab 2</a-tab>
          <a-tab-panel>Panel 2</a-tab-panel>
          <a-tab role="heading">Tab 3</a-tab>
          <a-tab-panel>Panel 3</a-tab-panel>
        </a-tab-group>
      `);

      expect(el.querySelectorAll('a-tab').length).to.equal(3);
      expect(el.querySelectorAll('a-tab-panel').length).to.equal(3);

      el.querySelectorAll('a-tab')[1].shadowRoot.querySelector('.tab__close').click();

      expect(el.querySelectorAll('a-tab').length).to.equal(2);
      expect(el.querySelectorAll('a-tab-panel').length).to.equal(2);
    });
  });

  describe('keyboard navigation', () => {
    it('cycle through tabs using "Right" arrow keys when activation="auto" and placement="top', async () => {
      const el = await fixture(html`
        <a-tab-group>
          <a-tab role="heading" selected>Tab 1</a-tab>
          <a-tab-panel>Panel 1</a-tab-panel>
          <a-tab role="heading">Tab 2</a-tab>
          <a-tab-panel>Panel 2</a-tab-panel>
          <a-tab role="heading" disabled>Tab 3</a-tab>
          <a-tab-panel>Panel 3</a-tab-panel>
          <a-tab role="heading">Tab 4</a-tab>
          <a-tab-panel>Panel 4</a-tab-panel>
        </a-tab-group>
      `);

      // Tab 1 should be selected by default
      expect(el.querySelectorAll('a-tab')[0].selected).to.be.true;
      expect(el.querySelectorAll('a-tab-panel')[0].hidden).to.be.false;

      await triggerFocusFor(el.querySelectorAll('a-tab')[0]);

      // Pressing "Right" arrow key should select tab 2
      await sendKeys({ press: 'ArrowRight' });

      expect(el.querySelectorAll('a-tab')[1].selected).to.be.true;
      expect(el.querySelectorAll('a-tab-panel')[1].hidden).to.be.false;

      // Pressing "Right" arrow key should select tab 4 (tab 3 is disabled)
      await sendKeys({ press: 'ArrowRight' });

      expect(el.querySelectorAll('a-tab')[3].selected).to.be.true;
      expect(el.querySelectorAll('a-tab-panel')[3].hidden).to.be.false;

      // Pressing "Right" arrow key should select tab 1 again
      await sendKeys({ press: 'ArrowRight' });

      expect(el.querySelectorAll('a-tab')[0].selected).to.be.true;
      expect(el.querySelectorAll('a-tab-panel')[0].hidden).to.be.false;
    });

    it('cycle through tabs using "Down" arrow keys when activation="auto" and placement="start"', async () => {
      const el = await fixture(html`
        <a-tab-group placement="start">
          <a-tab role="heading" selected>Tab 1</a-tab>
          <a-tab-panel>Panel 1</a-tab-panel>
          <a-tab role="heading">Tab 2</a-tab>
          <a-tab-panel>Panel 2</a-tab-panel>
          <a-tab role="heading" disabled>Tab 3</a-tab>
          <a-tab-panel>Panel 3</a-tab-panel>
          <a-tab role="heading">Tab 4</a-tab>
          <a-tab-panel>Panel 4</a-tab-panel>
        </a-tab-group>
      `);

      // Tab 1 should be selected by default
      expect(el.querySelectorAll('a-tab')[0].selected).to.be.true;
      expect(el.querySelectorAll('a-tab-panel')[0].hidden).to.be.false;

      await triggerFocusFor(el.querySelectorAll('a-tab')[0]);

      // Pressing "Down" arrow key should select tab 2
      await sendKeys({ press: 'ArrowDown' });

      expect(el.querySelectorAll('a-tab')[1].selected).to.be.true;
      expect(el.querySelectorAll('a-tab-panel')[1].hidden).to.be.false;

      // Pressing "Down" arrow key should select tab 4 (tab 3 is disabled)
      await sendKeys({ press: 'ArrowDown' });

      expect(el.querySelectorAll('a-tab')[3].selected).to.be.true;
      expect(el.querySelectorAll('a-tab-panel')[3].hidden).to.be.false;

      // Pressing "Down" arrow key should select tab 1 again
      await sendKeys({ press: 'ArrowDown' });

      expect(el.querySelectorAll('a-tab')[0].selected).to.be.true;
      expect(el.querySelectorAll('a-tab-panel')[0].hidden).to.be.false;
    });

    it('cycle through tabs using "Right" arrow keys when activation="manual" and placement="top"', async () => {
      const el = await fixture(html`
        <a-tab-group activation="manual">
          <a-tab role="heading" selected>Tab 1</a-tab>
          <a-tab-panel>Panel 1</a-tab-panel>
          <a-tab role="heading">Tab 2</a-tab>
          <a-tab-panel>Panel 2</a-tab-panel>
          <a-tab role="heading" disabled>Tab 3</a-tab>
          <a-tab-panel>Panel 3</a-tab-panel>
          <a-tab role="heading">Tab 4</a-tab>
          <a-tab-panel>Panel 4</a-tab-panel>
        </a-tab-group>
      `);

      // Tab 1 should be selected by default
      expect(el.querySelectorAll('a-tab')[0].selected).to.be.true;
      expect(el.querySelectorAll('a-tab-panel')[0].hidden).to.be.false;

      await triggerFocusFor(el.querySelectorAll('a-tab')[0]);

      // Pressing "Right" arrow key should focus but not select tab 2
      await sendKeys({ press: 'ArrowRight' });

      expect(el.querySelectorAll('a-tab')[1].matches(':focus')).to.be.true;
      expect(el.querySelectorAll('a-tab')[1].selected).to.be.false;
      expect(el.querySelectorAll('a-tab-panel')[1].hidden).to.be.true;

      // Pressing "Right" arrow key should focus but not select tab 4 (tab 3 is disabled)
      await sendKeys({ press: 'ArrowRight' });

      expect(el.querySelectorAll('a-tab')[3].matches(':focus')).to.be.true;
      expect(el.querySelectorAll('a-tab')[3].selected).to.be.false;
      expect(el.querySelectorAll('a-tab-panel')[3].hidden).to.be.true;

      // Pressing "Right" arrow key should focus back on tab 1
      await sendKeys({ press: 'ArrowRight' });

      expect(el.querySelectorAll('a-tab')[0].matches(':focus')).to.be.true;
      expect(el.querySelectorAll('a-tab')[0].selected).to.be.true;
      expect(el.querySelectorAll('a-tab-panel')[0].hidden).to.be.false;
    });

    it('cycle through tabs using "Down" arrow keys when activation="manual" and placement="start"', async () => {
      const el = await fixture(html`
        <a-tab-group activation="manual" placement="start">
          <a-tab role="heading" selected>Tab 1</a-tab>
          <a-tab-panel>Panel 1</a-tab-panel>
          <a-tab role="heading">Tab 2</a-tab>
          <a-tab-panel>Panel 2</a-tab-panel>
          <a-tab role="heading" disabled>Tab 3</a-tab>
          <a-tab-panel>Panel 3</a-tab-panel>
          <a-tab role="heading">Tab 4</a-tab>
          <a-tab-panel>Panel 4</a-tab-panel>
        </a-tab-group>
      `);

      // Tab 1 should be selected by default
      expect(el.querySelectorAll('a-tab')[0].selected).to.be.true;
      expect(el.querySelectorAll('a-tab-panel')[0].hidden).to.be.false;

      await triggerFocusFor(el.querySelectorAll('a-tab')[0]);

      // Pressing "Down" arrow key should focus but not select tab 2
      await sendKeys({ press: 'ArrowDown' });

      expect(el.querySelectorAll('a-tab')[1].matches(':focus')).to.be.true;
      expect(el.querySelectorAll('a-tab')[1].selected).to.be.false;
      expect(el.querySelectorAll('a-tab-panel')[1].hidden).to.be.true;

      // Pressing "Down" arrow key should focus but not select tab 4 (tab 3 is disabled)
      await sendKeys({ press: 'ArrowDown' });

      expect(el.querySelectorAll('a-tab')[3].matches(':focus')).to.be.true;
      expect(el.querySelectorAll('a-tab')[3].selected).to.be.false;
      expect(el.querySelectorAll('a-tab-panel')[3].hidden).to.be.true;

      // Pressing "Down" arrow key should focus back on tab 1
      await sendKeys({ press: 'ArrowDown' });

      expect(el.querySelectorAll('a-tab')[0].matches(':focus')).to.be.true;
      expect(el.querySelectorAll('a-tab')[0].selected).to.be.true;
      expect(el.querySelectorAll('a-tab-panel')[0].hidden).to.be.false;
    });

    it('cycle through tabs using "Left" arrow keys when activation="auto" and placement="top"', async () => {
      const el = await fixture(html`
        <a-tab-group>
          <a-tab role="heading">Tab 1</a-tab>
          <a-tab-panel>Panel 1</a-tab-panel>
          <a-tab role="heading">Tab 2</a-tab>
          <a-tab-panel>Panel 2</a-tab-panel>
          <a-tab role="heading" disabled>Tab 3</a-tab>
          <a-tab-panel>Panel 3</a-tab-panel>
          <a-tab role="heading" selected>Tab 4</a-tab>
          <a-tab-panel>Panel 4</a-tab-panel>
        </a-tab-group>
      `);

      // Tab 4 should be selected by default
      expect(el.querySelectorAll('a-tab')[3].selected).to.be.true;
      expect(el.querySelectorAll('a-tab-panel')[3].hidden).to.be.false;

      await triggerFocusFor(el.querySelectorAll('a-tab')[3]);

      // Pressing "Left" arrow key should select tab 2 (tab 3 is disabled)
      await sendKeys({ press: 'ArrowLeft' });

      expect(el.querySelectorAll('a-tab')[1].selected).to.be.true;
      expect(el.querySelectorAll('a-tab-panel')[1].hidden).to.be.false;

      // Pressing "Left" arrow key should select tab 1
      await sendKeys({ press: 'ArrowLeft' });

      expect(el.querySelectorAll('a-tab')[0].selected).to.be.true;
      expect(el.querySelectorAll('a-tab-panel')[0].hidden).to.be.false;

      // Pressing "Left" arrow key should select tab 4 again
      await sendKeys({ press: 'ArrowLeft' });

      expect(el.querySelectorAll('a-tab')[3].selected).to.be.true;
      expect(el.querySelectorAll('a-tab-panel')[3].hidden).to.be.false;
    });

    it('cycle through tabs using "Up" arrow keys when activation="auto" and placement="start"', async () => {
      const el = await fixture(html`
        <a-tab-group placement="start">
          <a-tab role="heading">Tab 1</a-tab>
          <a-tab-panel>Panel 1</a-tab-panel>
          <a-tab role="heading">Tab 2</a-tab>
          <a-tab-panel>Panel 2</a-tab-panel>
          <a-tab role="heading" disabled>Tab 3</a-tab>
          <a-tab-panel>Panel 3</a-tab-panel>
          <a-tab role="heading" selected>Tab 4</a-tab>
          <a-tab-panel>Panel 4</a-tab-panel>
        </a-tab-group>
      `);

      // Tab 4 should be selected by default
      expect(el.querySelectorAll('a-tab')[3].selected).to.be.true;
      expect(el.querySelectorAll('a-tab-panel')[3].hidden).to.be.false;

      await triggerFocusFor(el.querySelectorAll('a-tab')[3]);

      // Pressing "Up" arrow key should select tab 2 (tab 3 is disabled)
      await sendKeys({ press: 'ArrowUp' });

      expect(el.querySelectorAll('a-tab')[1].selected).to.be.true;
      expect(el.querySelectorAll('a-tab-panel')[1].hidden).to.be.false;

      // Pressing "Up" arrow key should select tab 1
      await sendKeys({ press: 'ArrowUp' });

      expect(el.querySelectorAll('a-tab')[0].selected).to.be.true;
      expect(el.querySelectorAll('a-tab-panel')[0].hidden).to.be.false;

      // Pressing "Up" arrow key should select tab 4 again
      await sendKeys({ press: 'ArrowUp' });

      expect(el.querySelectorAll('a-tab')[3].selected).to.be.true;
      expect(el.querySelectorAll('a-tab-panel')[3].hidden).to.be.false;
    });

    it('cycle through tabs using "Left" arrow keys when activation="manual" and placement="top"', async () => {
      const el = await fixture(html`
        <a-tab-group activation="manual">
          <a-tab role="heading">Tab 1</a-tab>
          <a-tab-panel>Panel 1</a-tab-panel>
          <a-tab role="heading">Tab 2</a-tab>
          <a-tab-panel>Panel 2</a-tab-panel>
          <a-tab role="heading" disabled>Tab 3</a-tab>
          <a-tab-panel>Panel 3</a-tab-panel>
          <a-tab role="heading" selected>Tab 4</a-tab>
          <a-tab-panel>Panel 4</a-tab-panel>
        </a-tab-group>
      `);

      // Tab 4 should be selected by default
      expect(el.querySelectorAll('a-tab')[3].selected).to.be.true;
      expect(el.querySelectorAll('a-tab-panel')[3].hidden).to.be.false;

      await triggerFocusFor(el.querySelectorAll('a-tab')[3]);

      // Pressing "Left" arrow key should focus but not select tab 2 (tab 3 is disabled)
      await sendKeys({ press: 'ArrowLeft' });

      expect(el.querySelectorAll('a-tab')[1].matches(':focus')).to.be.true;
      expect(el.querySelectorAll('a-tab')[1].selected).to.be.false;
      expect(el.querySelectorAll('a-tab-panel')[1].hidden).to.be.true;

      // Pressing "Left" arrow key should focus but not select tab 1
      await sendKeys({ press: 'ArrowLeft' });

      expect(el.querySelectorAll('a-tab')[0].matches(':focus')).to.be.true;
      expect(el.querySelectorAll('a-tab')[0].selected).to.be.false;
      expect(el.querySelectorAll('a-tab-panel')[0].hidden).to.be.true;

      // Pressing "Left" arrow key should focus back on tab 4
      await sendKeys({ press: 'ArrowLeft' });

      expect(el.querySelectorAll('a-tab')[3].matches(':focus')).to.be.true;
      expect(el.querySelectorAll('a-tab')[3].selected).to.be.true;
      expect(el.querySelectorAll('a-tab-panel')[3].hidden).to.be.false;
    });

    it('cycle through tabs using "Up" arrow keys when activation="manual" and placement="start"', async () => {
      const el = await fixture(html`
        <a-tab-group activation="manual" placement="start">
          <a-tab role="heading">Tab 1</a-tab>
          <a-tab-panel>Panel 1</a-tab-panel>
          <a-tab role="heading">Tab 2</a-tab>
          <a-tab-panel>Panel 2</a-tab-panel>
          <a-tab role="heading" disabled>Tab 3</a-tab>
          <a-tab-panel>Panel 3</a-tab-panel>
          <a-tab role="heading" selected>Tab 4</a-tab>
          <a-tab-panel>Panel 4</a-tab-panel>
        </a-tab-group>
      `);

      // Tab 4 should be selected by default
      expect(el.querySelectorAll('a-tab')[3].selected).to.be.true;
      expect(el.querySelectorAll('a-tab-panel')[3].hidden).to.be.false;

      await triggerFocusFor(el.querySelectorAll('a-tab')[3]);

      // Pressing "Up" arrow key should focus but not select tab 2 (tab 3 is disabled)
      await sendKeys({ press: 'ArrowUp' });

      expect(el.querySelectorAll('a-tab')[1].matches(':focus')).to.be.true;
      expect(el.querySelectorAll('a-tab')[1].selected).to.be.false;
      expect(el.querySelectorAll('a-tab-panel')[1].hidden).to.be.true;

      // Pressing "Up" arrow key should focus but not select tab 1
      await sendKeys({ press: 'ArrowUp' });

      expect(el.querySelectorAll('a-tab')[0].matches(':focus')).to.be.true;
      expect(el.querySelectorAll('a-tab')[0].selected).to.be.false;
      expect(el.querySelectorAll('a-tab-panel')[0].hidden).to.be.true;

      // Pressing "Up" arrow key should focus back on tab 4
      await sendKeys({ press: 'ArrowUp' });

      expect(el.querySelectorAll('a-tab')[3].matches(':focus')).to.be.true;
      expect(el.querySelectorAll('a-tab')[3].selected).to.be.true;
      expect(el.querySelectorAll('a-tab-panel')[3].hidden).to.be.false;
    });

    it('should select the first and last tab when pressing "Home" and "End" keys respectively', async () => {
      const el = await fixture(html`
        <a-tab-group>
          <a-tab role="heading">Tab 1</a-tab>
          <a-tab-panel>Panel 1</a-tab-panel>
          <a-tab role="heading">Tab 2</a-tab>
          <a-tab-panel>Panel 2</a-tab-panel>
          <a-tab role="heading" selected>Tab 3</a-tab>
          <a-tab-panel>Panel 3</a-tab-panel>
          <a-tab role="heading">Tab 4</a-tab>
          <a-tab-panel>Panel 4</a-tab-panel>
          <a-tab role="heading">Tab 5</a-tab>
          <a-tab-panel>Panel 5</a-tab-panel>
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
          <a-tab role="heading" disabled>Tab 1</a-tab>
          <a-tab-panel>Panel 1</a-tab-panel>
          <a-tab role="heading">Tab 2</a-tab>
          <a-tab-panel>Panel 2</a-tab-panel>
          <a-tab role="heading" selected>Tab 3</a-tab>
          <a-tab-panel>Panel 3</a-tab-panel>
          <a-tab role="heading">Tab 4</a-tab>
          <a-tab-panel>Panel 4</a-tab-panel>
          <a-tab role="heading" disabled>Tab 5</a-tab>
          <a-tab-panel>Panel 5</a-tab-panel>
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
          <a-tab role="heading" disabled>Tab 1</a-tab>
          <a-tab-panel>Panel 1</a-tab-panel>
          <a-tab role="heading">Tab 2</a-tab>
          <a-tab-panel>Panel 2</a-tab-panel>
          <a-tab role="heading" selected>Tab 3</a-tab>
          <a-tab-panel>Panel 3</a-tab-panel>
          <a-tab role="heading">Tab 4</a-tab>
          <a-tab-panel>Panel 4</a-tab-panel>
          <a-tab role="heading" disabled>Tab 5</a-tab>
          <a-tab-panel>Panel 5</a-tab-panel>
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
          <a-tab role="heading" selected>Tab 1</a-tab>
          <a-tab-panel>Panel 1</a-tab-panel>
          <a-tab role="heading">Tab 2</a-tab>
          <a-tab-panel>Panel 2</a-tab-panel>
          <a-tab role="heading">Tab 3</a-tab>
          <a-tab-panel>Panel 3</a-tab-panel>
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
          <a-tab role="heading">Tab 1</a-tab>
          <a-tab-panel>Panel 1</a-tab-panel>
          <a-tab role="heading">Tab 2</a-tab>
          <a-tab-panel>Panel 2</a-tab-panel>
          <a-tab role="heading">Tab 3</a-tab>
          <a-tab-panel>Panel 3</a-tab-panel>
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
          <a-tab role="heading" selected>Tab 1</a-tab>
          <a-tab-panel>Panel 1</a-tab-panel>
          <a-tab role="heading" closable>Tab 2</a-tab>
          <a-tab-panel>Panel 2</a-tab-panel>
          <a-tab role="heading">Tab 3</a-tab>
          <a-tab-panel>Panel 3</a-tab-panel>
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
          <a-tab role="heading" selected>Tab 1</a-tab>
          <a-tab-panel>Panel 1</a-tab-panel>
          <a-tab role="heading" closable>Tab 2</a-tab>
          <a-tab-panel>Panel 2</a-tab-panel>
          <a-tab role="heading">Tab 3</a-tab>
          <a-tab-panel>Panel 3</a-tab-panel>
        </a-tab-group>
      `);

      const scrollButtons = el.shadowRoot.querySelectorAll('.tab-group__scroll-button');
      scrollButtons.forEach((button) => expect(button.hidden).to.be.true);
    });

    it('should scroll tabs towards on scroll button click', async () => {
      const el = await fixture(html`
        <a-tab-group style="width: 100px; --scroll-behavior: auto;">
          <a-tab role="heading" selected>Tab 1</a-tab>
          <a-tab-panel>Panel 1</a-tab-panel>
          <a-tab role="heading" closable>Tab 2</a-tab>
          <a-tab-panel>Panel 2</a-tab-panel>
          <a-tab role="heading">Tab 3</a-tab>
          <a-tab-panel>Panel 3</a-tab-panel>
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
    it('should fire "a-tab-show" event when tab is shown', async () => {
      const el = await fixture(html`
        <a-tab-group>
          <a-tab id="tab-1" role="heading" selected>Tab 1</a-tab>
          <a-tab-panel id="panel-1">Panel 1</a-tab-panel>
          <a-tab id="tab-2" role="heading">Tab 2</a-tab>
          <a-tab-panel id="panel-2">Panel 2</a-tab-panel>
        </a-tab-group>
      `);

      const listener = oneEvent(el, 'a-tab-show');
      el.querySelectorAll('a-tab')[1].click();
      const { detail } = await listener;
      expect(detail).to.deep.equal({ tabId: 'tab-2' });
    });

    it('should fire "a-tab-hide" event when tab is hidden', async () => {
      const el = await fixture(html`
        <a-tab-group>
          <a-tab id="tab-1" role="heading" selected>Tab 1</a-tab>
          <a-tab-panel id="panel-1">Panel 1</a-tab-panel>
          <a-tab id="tab-2" role="heading">Tab 2</a-tab>
          <a-tab-panel id="panel-2">Panel 2</a-tab-panel>
        </a-tab-group>
      `);

      const listener = oneEvent(el, 'a-tab-hide');
      el.querySelectorAll('a-tab')[1].click();
      const { detail } = await listener;
      expect(detail).to.deep.equal({ tabId: 'tab-1' });
    });

    it('should not fire "a-tab-hide" event when tab is hidden if tab is closed by user and is not currently selected', async () => {
      const el = await fixture(html`
        <a-tab-group>
          <a-tab id="tab-1" role="heading" selected>Tab 1</a-tab>
          <a-tab-panel id="panel-1">Panel 1</a-tab-panel>
          <a-tab id="tab-2" role="heading" closable>Tab 2</a-tab>
          <a-tab-panel id="panel-2">Panel 2</a-tab-panel>
        </a-tab-group>
      `);

      const spy = sinon.spy();
      el.addEventListener('a-tab-hide', spy);
      el.querySelectorAll('a-tab')[1].shadowRoot.querySelector('.tab__close').click();
      expect(spy).not.to.have.been.called;
    });
  });

  describe('errors', () => {
    it('should log an error if a tab is not a sibling of a tab-panel element', async () => {
      await fixture(html`
        <a-tab-group>
          <a-tab id="orphan-tab" role="heading">Tab 1</a-tab>
        </a-tab-group>
      `);

      expect(console.error).to.have.been.calledOnceWithExactly('Tab #orphan-tab is not a sibling of a <a-tab-panel>');
    });
  });
});
