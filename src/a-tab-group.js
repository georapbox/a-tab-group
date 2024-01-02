// @ts-check

/**
 * Represents a value that may be of type T, or null.
 *
 * @template T
 * @typedef {T | null} Nullable
 */

/** @typedef {import('./a-tab').Tab} Tab */
/** @typedef {import('./a-tab-panel').TabPanel} TabPanel */

import './a-tab.js';
import './a-tab-panel.js';
import { upgradeProperty } from './utils/upgrade-property.js';

/**
 * The default scroll distance in pixels that the
 * tabs will scroll when the scroll buttons are clicked.
 */
const DEFAULT_SCROLL_DISTANCE = 200;

/**
 * The available placements for the tabs.
 */
const PLACEMENT = {
  TOP: 'top',
  BOTTOM: 'bottom',
  START: 'start',
  END: 'end'
};

/**
 * The valid placements for the tabs.
 */
const validPlacements = Object.entries(PLACEMENT).map(([, value]) => value);

/**
 * The available activation modes for the tabs.
 */
const ACTIVATION = {
  AUTO: 'auto',
  MANUAL: 'manual'
};

/**
 * Defines key codes to help with handling keyboard events.
 */
const KEYCODE = {
  DOWN: 'ArrowDown',
  LEFT: 'ArrowLeft',
  RIGHT: 'ArrowRight',
  UP: 'ArrowUp',
  HOME: 'Home',
  END: 'End',
  ENTER: 'Enter',
  SPACE: ' '
};

const styles = /* css */`
  :host {
    --selected-tab-color: #005fcc;
    --selected-tab-bg-color: transparent;
    --tabs-scroll-behavior: smooth;
    --scroll-button-width: 2.125em;
    --scroll-button-height: 2.125em;
    --scroll-button-inline-offset: 0rem;

    box-sizing: border-box;
    display: block;
    contain: content;
  }

  @media (prefers-reduced-motion: reduce) {
    :host {
      --tabs-scroll-behavior: auto;
    }
  }

  :host([hidden]),
  [hidden],
  ::slotted([hidden]) {
    display: none !important;
  }

  :host *,
  :host *::before,
  :host *::after {
    box-sizing: inherit;
  }

  .tab-group {
    display: flex;
    width: 100%;
  }

  .tab-group__nav {
    position: relative;
  }

  .tab-group__nav--has-scroll-controls {
    padding: 0 calc(var(--scroll-button-width) + var(--scroll-button-inline-offset));
  }

  .tab-group__scroll-button {
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: var(--scroll-button-width);
    height: var(--scroll-button-height);
    padding: 0; /* Required for iOS, otherwise the svg is not visible: https://stackoverflow.com/questions/66532071/flex-svg-behaving-strange-in-ios-safari-14-0-3 */
    border: 0;
    z-index: 1;
    background-color: transparent;
    font-size: inherit;
    cursor: pointer;
    color: currentColor;
  }

  .tab-group__scroll-button--start {
    left: var(--scroll-button-inline-offset);
  }

  .tab-group__scroll-button--end {
    right: var(--scroll-button-inline-offset);
  }

  .tab-group__tabs {
    display: flex;
    padding: 0.25rem;
    overflow-x: auto;
    scroll-behavior: var(--tabs-scroll-behavior);
    scrollbar-width: none;
  }

  .tab-group__tabs::-webkit-scrollbar {
    display: none;
  }

  .tab-group__panels {
    padding: 1rem 0;
  }

  /* placement="top" */
  .tab-group,
  :host([placement="top"]) .tab-group {
    flex-direction: column;
  }

  /* placement="bottom" */
  :host([placement="${PLACEMENT.BOTTOM}"]) .tab-group {
    flex-direction: column;
  }

  :host([placement="${PLACEMENT.BOTTOM}"]) .tab-group__nav {
    order: 1;
  }

  /* placement="start" */
  :host([placement="${PLACEMENT.START}"]) .tab-group {
    flex-direction: row;
  }

  :host([placement="${PLACEMENT.START}"]) .tab-group__tabs {
    flex-direction: column;
    align-items: flex-start;
  }

  :host([placement="${PLACEMENT.START}"]) .tab-group__panels {
    flex: 1;
    padding: 0 1rem;
  }

  /* placement="end" */
  :host([placement="${PLACEMENT.END}"]) .tab-group {
    flex-direction: row;
  }

  :host([placement="${PLACEMENT.END}"]) .tab-group__nav {
    order: 1;
  }

  :host([placement="${PLACEMENT.END}"]) .tab-group__tabs {
    flex-direction: column;
    align-items: flex-start;
  }

  :host([placement="${PLACEMENT.END}"]) .tab-group__panels {
    flex: 1;
    padding: 0 1rem;
  }
`;

const template = document.createElement('template');

template.innerHTML = /* html */`
  <style>
    ${styles}
  </style>

  <div part="base" class="tab-group">
    <div part="nav" class="tab-group__nav">
      <button type="button" part="scroll-button scroll-button--start" class="tab-group__scroll-button tab-group__scroll-button--start" aria-label="Scroll to start" tabindex="-1">
        <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" viewBox="0 0 16 16" part="scroll-button-icon">
          <path fill-rule="evenodd" d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"/>
        </svg>
      </button>

      <div part="tabs" class="tab-group__tabs" role="tablist" tabindex="-1">
        <slot name="tab"></slot>
      </div>

      <button type="button" part="scroll-button scroll-button--end" class="tab-group__scroll-button tab-group__scroll-button--end" aria-label="Scroll to end" tabindex="-1">
        <svg xmlns="http://www.w3.org/2000/svg" width="1rem" height="1em" fill="currentColor" viewBox="0 0 16 16" part="scroll-button-icon">
          <path fill-rule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"/>
        </svg>
      </button>
    </div>

    <div part="panels" class="tab-group__panels">
      <slot name="panel"></slot>
    </div>
  </div>
`;

/**
 * @summary Container element for tabs and panels. All children of <a-tab-group> should be either `<a-tab>` or `<a-tab-panel>`.
 * @documentation https://github.com/georapbox/a-tab-group
 *
 * @tagname a-tab-group
 * @extends HTMLElement
 *
 * @property {string} placement - The placement of the tabs.
 * @property {boolean} noScrollControls - Whether or not the scroll controls are enabled.
 * @property {number} scrollDistance - The distance in pixels that the tabs will scroll when the scroll buttons are clicked.
 * @property {string} activation - The activation mode of the tabs.
 * @property {boolean} noTabCycling - Whether or not the tabs should cycle when reaching the first or last tab using the keyboard.
 *
 * @attribute placement - Reflects the placement property.
 * @attribute no-scroll-controls - Reflects the noScrollControls property.
 * @attribute scroll-distance - Reflects the scrollDistance property.
 * @attribute activation - Reflects the activation property.
 * @attribute no-tab-cycling - Reflects the noTabCycling property.
 *
 * @slot tab - Used for groupping tabs in the tab group. Must be <a-tab> elements.
 * @slot panel - Used for groupping tab panels in the tab group. Must be <a-tab-panel> elements.
 *
 * @csspart base - The component's base wrapper.
 * @csspart nav - The nav container.
 * @csspart nav--has-scroll-controls - The nav container when the scroll controls are enabled and visible.
 * @csspart scroll-button - The scroll button.
 * @csspart scroll-button--start - The scroll button for scrolling towards the start.
 * @csspart scroll-button--end - The scroll button for scrolling towards the end.
 * @csspart scroll-button-icon - The scroll button icon.
 * @csspart tabs - The tabs container.
 * @csspart panels - The panels container.
 *
 * @cssproperty --selected-tab-color - The color of the selected tab.
 * @cssproperty --selected-tab-bg-color - The background color of the selected tab.
 * @cssproperty --tabs-scroll-behavior - The scroll behavior of the tabs container.
 * @cssproperty --scroll-button-width - The width of the scroll buttons.
 * @cssproperty --scroll-button-height - The height of the scroll buttons.
 * @cssproperty --scroll-button-inline-offset - The inline offset of the scroll buttons.
 *
 * @event a-tab-show - Fired when a tab is shown.
 * @event a-tab-hide - Fired when a tab is shown.
 *
 * @method selectTabByIndex - Selects the tab at the given index.
 * @method selectTabById - Selects the tab with the given id.
 * @method selectTab - Selects the given tab.
 */
class TabGroup extends HTMLElement {
  /** @type {Nullable<ResizeObserver>} */
  #resizeObserver = null;

  /** @type {Nullable<number>} */
  #rafId = null;

  /** @type {boolean} */
  #hasTabSlotChangedOnce = false;

  constructor() {
    super();

    if (!this.shadowRoot) {
      const shadowRoot = this.attachShadow({ mode: 'open' });
      shadowRoot.appendChild(template.content.cloneNode(true));
    }
  }

  static get observedAttributes() {
    return ['placement', 'no-scroll-controls'];
  }

  /**
   * Lifecycle method that is called when attributes are changed, added, removed, or replaced.
   *
   * @param {string} name - The name of the attribute.
   * @param {string} oldValue - The old value of the attribute.
   * @param {string} newValue - The new value of the attribute.
   */
  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'placement' && oldValue !== newValue) {
      this.#syncNav();
    }

    if (name === 'no-scroll-controls' && oldValue !== newValue) {
      this.#syncNav();
    }
  }

  /**
   * @type {Nullable<string>} - The placement of the tabs.
   * @default 'top'
   * @attribute placement - Reflects the placement property.
   */
  get placement() {
    return this.getAttribute('placement') || PLACEMENT.TOP;
  }

  set placement(value) {
    if (value != null) {
      this.setAttribute('placement', value);
    }
  }

  /**
   * @type {boolean} - Whether or not the scroll controls are enabled.
   * @default false
   * @attribute no-scroll-controls - Reflects the noScrollControls property.
   */
  get noScrollControls() {
    return this.hasAttribute('no-scroll-controls');
  }

  set noScrollControls(value) {
    this.toggleAttribute('no-scroll-controls', !!value);
  }

  /**
   * @type {number} - The distance in pixels that the tabs will scroll when the scroll buttons are clicked.
   * @default 200
   * @attribute scroll-distance - Reflects the scrollDistance property.
   */
  get scrollDistance() {
    const value = Number(this.getAttribute('scroll-distance'));
    return Math.abs(value) || DEFAULT_SCROLL_DISTANCE;
  }

  set scrollDistance(value) {
    this.setAttribute('scroll-distance', Math.abs(value).toString() || DEFAULT_SCROLL_DISTANCE.toString());
  }

  /**
   * @type {string} - The activation mode of the tabs.
   * @default 'auto'
   * @attribute activation - Reflects the activation property.
   */
  get activation() {
    return this.getAttribute('activation') || ACTIVATION.AUTO;
  }

  set activation(value) {
    this.setAttribute('activation', value || ACTIVATION.AUTO);
  }

  /**
   * @type {boolean} - Whether or not the tabs should cycle when reaching the first or last tab using the keyboard.
   * @default false
   * @attribute no-tab-cycling - Reflects the noTabCycling property.
   */
  get noTabCycling() {
    return this.hasAttribute('no-tab-cycling');
  }

  set noTabCycling(value) {
    this.toggleAttribute('no-tab-cycling', !!value);
  }

  /**
   * Lifecycle method that is called when the element is first connected to the DOM.
   */
  connectedCallback() {
    this.#upgradeProperty('placement');
    this.#upgradeProperty('noScrollControls');
    this.#upgradeProperty('scrollDistance');
    this.#upgradeProperty('activation');
    this.#upgradeProperty('noTabCycling');

    const tabSlot = this.shadowRoot?.querySelector('slot[name=tab]');
    const panelSlot = this.shadowRoot?.querySelector('slot[name=panel]');
    const tabsContainer = this.shadowRoot?.querySelector('.tab-group__tabs');
    const navContainer = this.shadowRoot?.querySelector('.tab-group__nav');
    const scrollButtons = Array.from(this.shadowRoot?.querySelectorAll('.tab-group__scroll-button') || []);

    tabSlot?.addEventListener('slotchange', this.#handleSlotChange);
    panelSlot?.addEventListener('slotchange', this.#handleSlotChange);
    tabsContainer?.addEventListener('click', this.#handleTabClick);
    tabsContainer?.addEventListener('keydown', this.#handleKeyDown);
    scrollButtons.forEach(el => el.addEventListener('click', this.#handleScrollButtonClick));
    this.addEventListener('a-tab-close', this.#handleTabClose);

    if ('ResizeObserver' in window) {
      this.#resizeObserver = new ResizeObserver(entries => {
        this.#rafId = window.requestAnimationFrame(() => {
          const entry = entries?.[0];
          const targetElement = entry?.target;
          const isElementScrollable = targetElement?.scrollWidth > targetElement?.clientWidth;
          scrollButtons.forEach(el => el.toggleAttribute('hidden', !isElementScrollable));
          navContainer?.part.toggle('nav--has-scroll-controls', isElementScrollable);
          navContainer?.classList.toggle('tab-group__nav--has-scroll-controls', isElementScrollable);
        });
      });
    }

    this.#hideEmptyTabGroup();
    this.#syncNav();
    this.placement = validPlacements.includes(this.placement || '') ? this.placement : PLACEMENT.TOP;
  }

  /**
   * Lifecycle method that is called when the element is disconnected from the DOM.
   */
  disconnectedCallback() {
    const tabSlot = this.shadowRoot?.querySelector('slot[name=tab]');
    const panelSlot = this.shadowRoot?.querySelector('slot[name=panel]');
    const tabsContainer = this.shadowRoot?.querySelector('.tab-group__tabs');
    const scrollButtons = Array.from(this.shadowRoot?.querySelectorAll('.tab-group__scroll-button') || []);

    tabSlot?.removeEventListener('slotchange', this.#handleSlotChange);
    panelSlot?.removeEventListener('slotchange', this.#handleSlotChange);
    tabsContainer?.removeEventListener('click', this.#handleTabClick);
    tabsContainer?.removeEventListener('keydown', this.#handleKeyDown);
    scrollButtons.forEach(el => el.removeEventListener('click', this.#handleScrollButtonClick));
    this.removeEventListener('a-tab-close', this.#handleTabClose);
    this.#stopResizeObserver();
  }

  /**
   * Starts observing the tabs container for resize events.
   */
  #startResizeObserver() {
    if (!this.#resizeObserver) {
      return;
    }

    const scrollElement = this.shadowRoot?.querySelector('.tab-group__tabs');

    if (scrollElement) {
      this.#resizeObserver.unobserve(scrollElement);
      this.#resizeObserver.observe(scrollElement);
    }
  }

  /**
   * Stops observing the tabs container for resize events.
   */
  #stopResizeObserver() {
    if (!this.#resizeObserver) {
      return;
    }

    this.#resizeObserver.disconnect();

    if (this.#rafId !== null) {
      window.cancelAnimationFrame(this.#rafId);
      this.#rafId = null;
    }
  }

  /**
   * Gets the direction of the tab group.
   *
   * @returns {string} The direction of the tab group.
   */
  #getDirection() {
    return getComputedStyle(this).direction || 'ltr';
  }

  /**
   * Hides the tab group if there are no tabs.
   */
  #hideEmptyTabGroup() {
    this.hidden = this.#allTabs().length === 0;
  }

  /**
   * Links up tabs with their adjacent panels using `aria-controls` and `aria-labelledby`.
   * This method makes sure only one tab is selected at a time.
   */
  #linkPanels() {
    const tabs = this.#allTabs();

    this.#hideEmptyTabGroup();

    // Give each panel a `aria-labelledby` attribute that refers to the tab that controls it.
    tabs.forEach(tab => {
      const panel = tab.nextElementSibling;

      if (!panel || panel.tagName.toLowerCase() !== 'a-tab-panel') {
        return console.error(`Tab #${tab.id} is not a sibling of a <a-tab-panel>`);
      }

      tab.setAttribute('aria-controls', panel.id);
      panel.setAttribute('aria-labelledby', tab.id);
    });
  }

  /**
   * Get all panels in the tab group.
   *
   * @returns {TabPanel[]} All the panels in the tab group.
   */
  #allPanels() {
    return Array.from(this.querySelectorAll('a-tab-panel'));
  }

  /**
   * Get all tabs in the tab group.
   *
   * @returns {Tab[]} All the tabs in the tab group.
   */
  #allTabs() {
    return Array.from(this.querySelectorAll('a-tab'));
  }

  /**
   * Get the panel for the given tab.
   *
   * @param {Tab} tab - The tab whose panel is to be returned.
   * @returns {Nullable<TabPanel>} - The panel controlled by the given tab.
   */
  #panelForTab(tab) {
    const panelId = tab.getAttribute('aria-controls');
    return this.querySelector(`#${panelId}`);
  }

  /**
   * Get the first non-disabled tab in the tab group.
   *
   * @returns {Nullable<Tab>} The first tab in the tab group.
   */
  #firstTab() {
    const tabs = this.#allTabs();
    return tabs.find(tab => !tab.disabled) || null;
  }

  /**
   * Get the last non-disabled tab in the tab group.
   *
   * @returns {Nullable<Tab>} The last tab in the tab group.
   */
  #lastTab() {
    const tabs = this.#allTabs();

    for (let i = tabs.length - 1; i >= 0; i--) {
      if (!tabs[i].disabled) {
        return tabs[i];
      }
    }

    return null;
  }

  /**
   * Get the tab that comes before the currently selected one, wrapping around when reaching the first tab.
   * If the currently selected tab is disabled, the method will skip it.
   *
   * @returns {Nullable<Tab>} The previous tab.
   */
  #prevTab() {
    const tabs = this.#allTabs();
    let newIdx = this.activation === ACTIVATION.MANUAL
      ? tabs.findIndex(tab => tab.matches(':focus')) - 1
      : tabs.findIndex(tab => tab.selected) - 1;

    // Keep looping until we find a non-disabled tab.
    while (tabs[(newIdx + tabs.length) % tabs.length].disabled) {
      newIdx--;
    }

    // Stop cycling through tabs if we reach the beginning and tab cycling is disabled.
    if (this.noTabCycling && newIdx < 0) {
      return null;
    }

    // Add `tabs.length` to make sure the index is a positive number and get the modulus to wrap around if necessary.
    return tabs[(newIdx + tabs.length) % tabs.length];
  }

  /**
   * Get the tab that comes after the currently selected one, wrapping around when reaching the last tab.
   * If the currently selected tab is disabled, the method will skip it.
   *
   * @returns {Nullable<Tab>} The next tab.
   */
  #nextTab() {
    const tabs = this.#allTabs();
    let newIdx = this.activation === ACTIVATION.MANUAL
      ? tabs.findIndex(tab => tab.matches(':focus')) + 1
      : tabs.findIndex(tab => tab.selected) + 1;

    // Keep looping until we find a non-disabled tab.
    while (tabs[newIdx % tabs.length].disabled) {
      newIdx++;
    }

    // Stop cycling through tabs if we reach the end and tab cycling is disabled.
    if (this.noTabCycling && newIdx >= tabs.length) {
      return null;
    }

    return tabs[newIdx % tabs.length];
  }

  /**
   * Marks all tabs as unselected and hides all the panels.
   * This is called every time the user selects a new tab.
   */
  #reset() {
    const tabs = this.#allTabs();
    const panels = this.#allPanels();

    tabs.forEach(tab => tab.selected = false);
    panels.forEach(panel => panel.hidden = true);
  }

  /**
   * Syncs the tab group navigation with the current state of the tab group.
   *
   * This is called every time the user:
   * - adds or removes a tab or panel
   * - changes the placement of the tabs
   * - enables or disables the scroll controls
   *
   * If the tabs container is scrollable and the scroll controls are enabled,
   * the scroll buttons are displayed and the resize observer is started,
   * otherwise they are hidden and the resize observer is stopped.
   */
  #syncNav() {
    const navContainer = this.shadowRoot?.querySelector('.tab-group__nav');

    /** @type {HTMLButtonElement[]} */
    const scrollButtons = Array.from(this.shadowRoot?.querySelectorAll('.tab-group__scroll-button') || []);

    if (this.noScrollControls || this.placement === PLACEMENT.START || this.placement === PLACEMENT.END) {
      this.#stopResizeObserver();
      scrollButtons.forEach(el => el.hidden = true);
      navContainer?.part.remove('nav--has-scroll-controls');
      navContainer?.classList.remove('tab-group__nav--has-scroll-controls');
    } else {
      this.#startResizeObserver();
      scrollButtons.forEach(el => el.hidden = false);
    }
  }

  /**
   * Sets the selected tab when the slot changes.
   * This is called every time the user adds or removes a tab or panel.
   * This is useful when the user closes the selected tab and we need to select a new one.
   */
  #setSelectedTabOnSlotChange() {
    const tabs = this.#allTabs();

    // Get the selected non-disabled tab, or the first non-disabled tab.
    const tab = tabs.find(tab => tab.selected && !tab.disabled) || tabs.find(tab => !tab.disabled);

    if (tab) {
      if (this.#hasTabSlotChangedOnce && !tab.selected) {
        this.dispatchEvent(new CustomEvent('a-tab-show', {
          bubbles: true,
          composed: true,
          detail: { tabId: tab.id }
        }));
      }

      this.#setSelectedTab(tab);
    }
  }

  /**
   * Sets the given tab as selected and shows the panel corresponding to the given tab.
   * Differentiates from `selectTab()` in that it does not emit any events or focus the tab.
   * Used internally to set the selected tab when a tab is selected by a side effect,
   * eg. when a tabs and panels are added or removeda and there is a need to select a new tab.
   *
   * @param {Tab} tab - The tab to be selected.
   */
  #setSelectedTab(tab) {
    this.#reset();

    if (tab) {
      tab.selected = true;
    }

    const panel = this.#panelForTab(tab);

    if (panel) {
      panel.hidden = false;
    }
  }

  /**
   * Handles the slotchange event on the tab group.
   * This is called every time the user adds or removes a tab or panel.
   *
   * @param {any} evt - The slotchange event.
   */
  #handleSlotChange = evt => {
    this.#linkPanels();
    this.#syncNav();
    this.#setSelectedTabOnSlotChange();

    if (evt.target.name === 'tab') {
      this.#hasTabSlotChangedOnce = true;
    }
  };

  /**
   * Handles key events on the tab group.
   *
   * @param {any} evt - The keydown event.
   */
  #handleKeyDown = evt => {
    if (
      evt.target.tagName.toLowerCase() !== 'a-tab' // Ignore any key presses that have a modifier.
      || evt.altKey // Don’t handle modifier shortcuts typically used by assistive technology.
    ) {
      return;
    }

    const placement = validPlacements.includes(this.placement || '') ? this.placement : PLACEMENT.TOP;
    const orientation = [PLACEMENT.TOP, PLACEMENT.BOTTOM].includes(placement || '') ? 'horizontal' : 'vertical';
    const direction = this.#getDirection();
    let tab = null;

    switch (evt.key) {
      case KEYCODE.LEFT:
        if (orientation === 'horizontal') {
          tab = direction === 'ltr' ? this.#prevTab() : this.#nextTab();
          if (tab) {
            this.activation === ACTIVATION.MANUAL ? tab.focus() : this.selectTab(tab);
          }
        }
        break;
      case KEYCODE.RIGHT:
        if (orientation === 'horizontal') {
          tab = direction === 'ltr' ? this.#nextTab() : this.#prevTab();
          if (tab) {
            this.activation === ACTIVATION.MANUAL ? tab.focus() : this.selectTab(tab);
          }
        }
        break;
      case KEYCODE.UP:
        if (orientation === 'vertical') {
          tab = this.#prevTab();
          if (tab) {
            this.activation === ACTIVATION.MANUAL ? tab.focus() : this.selectTab(tab);
          }
        }
        break;
      case KEYCODE.DOWN:
        if (orientation === 'vertical') {
          tab = this.#nextTab();
          if (tab) {
            this.activation === ACTIVATION.MANUAL ? tab.focus() : this.selectTab(tab);
          }
        }
        break;
      case KEYCODE.HOME:
        tab = this.#firstTab();
        if (tab) {
          this.activation === ACTIVATION.MANUAL ? tab.focus() : this.selectTab(tab);
        }
        break;
      case KEYCODE.END:
        tab = this.#lastTab();
        if (tab) {
          this.activation === ACTIVATION.MANUAL ? tab.focus() : this.selectTab(tab);
        }
        break;
      case KEYCODE.ENTER:
      case KEYCODE.SPACE:
        tab = evt.target;
        if (tab) {
          this.selectTab(tab);
        }
        break;
      default:
        // Any other key press is ignored and passed back to the browser.
        return;
    }

    // The browser might have some native functionality bound to the arrow keys, home or end.
    // `preventDefault()` is called to prevent the browser from taking any actions.
    evt.preventDefault();
  };

  /**
   * Handles click events on the tab group.
   *
   * @param {any} evt - The click event.
   */
  #handleTabClick = evt => {
    const tab = evt.target.closest('a-tab');

    if (tab) {
      this.selectTab(tab);
    }
  };

  /**
   * Handles the scroll button click event.
   *
   * @param {any} evt - The click event.
   */
  #handleScrollButtonClick = evt => {
    const scrollButton = evt.target.closest('.tab-group__scroll-button');
    const tabsContainer = this.shadowRoot?.querySelector('.tab-group__tabs');

    if (!scrollButton || !tabsContainer) {
      return;
    }

    const sign = scrollButton.classList.contains('tab-group__scroll-button--start') ? -1 : 1;
    const offsetLeft = tabsContainer.scrollLeft;

    tabsContainer.scrollTo({
      left: offsetLeft + sign * this.scrollDistance
    });
  };

  /**
   * Handles the tab close button click event.
   *
   * @param {any} evt - The click event.
   */
  #handleTabClose = evt => {
    const tab = evt.target;
    const panel = this.#panelForTab(tab);

    if (tab) {
      tab.remove();

      tab.selected && this.dispatchEvent(new CustomEvent('a-tab-hide', {
        bubbles: true,
        composed: true,
        detail: { tabId: tab.id }
      }));
    }

    if (panel && panel.tagName.toLowerCase() === 'a-tab-panel') {
      panel.remove();
    }
  };

  /**
   * Wrapper for the `upgradeProperty` function.
   *
   * @param {'placement' | 'noScrollControls' | 'scrollDistance' | 'activation' | 'noTabCycling'} prop - The property to upgrade.
   */
  #upgradeProperty(prop) {
    return upgradeProperty(prop, this);
  }

  /**
   * Selects the tab at the given index.
   * If the tab at the given index is disabled or already selected, this method does nothing.
   *
   * @param {number} index - The index of the tab to be selected.
   */
  selectTabByIndex(index) {
    const tabs = this.#allTabs();
    const tab = tabs[index];

    if (tab) {
      this.selectTab(tab);
    }
  }

  /**
   * Selects the tab with the given id.
   * If the tab with the given id is disabled or already selected, this method does nothing.
   *
   * @param {string} id - The id of the tab to be selected.
   */
  selectTabById(id) {
    const tabs = this.#allTabs();
    const tab = tabs.find(tab => tab.id === id);

    if (tab) {
      this.selectTab(tab);
    }
  }

  /**
   * Selects the given tab.
   * If the given tab is disabled or already selected, this method does nothing.
   *
   * @param {Tab} tab - The tab to be selected.
   */
  selectTab(tab) {
    const oldTab = this.#allTabs().find(t => t.selected);

    if (!tab || tab.disabled || tab.selected || tab.tagName.toLowerCase() !== 'a-tab') {
      return;
    }

    this.#setSelectedTab(tab);

    // Queue a microtask to ensure that the tab is focused on the next tick.
    setTimeout(() => {
      tab.scrollIntoView({ inline: 'nearest', block: 'nearest' });
      tab.focus();
    }, 0);

    if (oldTab) {
      this.dispatchEvent(new CustomEvent('a-tab-hide', {
        bubbles: true,
        composed: true,
        detail: { tabId: oldTab.id }
      }));
    }

    this.dispatchEvent(new CustomEvent('a-tab-show', {
      bubbles: true,
      composed: true,
      detail: { tabId: tab.id }
    }));
  }

  static defineCustomElement(elementName = 'a-tab-group') {
    if (typeof window !== 'undefined' && !window.customElements.get(elementName)) {
      window.customElements.define(elementName, TabGroup);
    }
  }
}

TabGroup.defineCustomElement();

export { TabGroup };
