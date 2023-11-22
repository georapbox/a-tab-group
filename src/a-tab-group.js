// @ts-check

/** @typedef {import('./a-tab').Tab} Tab */
/** @typedef {import('./a-tab-panel').TabPanel} TabPanel */

import './a-tab.js';
import './a-tab-panel.js';

const A_TAB_GROUP = 'a-tab-group';
const A_TAB = 'a-tab';
const A_TAB_PANEL = 'a-tab-panel';
const DEFAULT_SCROLL_DISTANCE = 200;
const PLACEMENT_TOP = 'top';
const PLACEMENT_BOTTOM = 'bottom';
const PLACEMENT_START = 'start';
const PLACEMENT_END = 'end';
const ACTIVATION_AUTO = 'auto';
const ACTIVATION_MANUAL = 'manual';

/**
 * Define key codes to help with handling keyboard events.
 */
const KEYCODE = {
  DOWN: 'ArrowDown',
  LEFT: 'ArrowLeft',
  RIGHT: 'ArrowRight',
  UP: 'ArrowUp',
  HOME: 'Home',
  END: 'End',
  ENTER: 'Enter',
  SPACE: 'Space'
};

const template = document.createElement('template');

template.innerHTML = /* html */`
  <style>
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

    .tab-group__nav--scrollable {
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
      border: 0;
      z-index: 1;
      background-color: transparent;
      font-size: inherit;
      cursor: pointer;
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
    :host([placement="${PLACEMENT_BOTTOM}"]) .tab-group {
      flex-direction: column;
    }

    :host([placement="${PLACEMENT_BOTTOM}"]) .tab-group__nav {
      order: 1;
    }

    /* placement="start" */
    :host([placement="${PLACEMENT_START}"]) .tab-group {
      flex-direction: row;
    }

    :host([placement="${PLACEMENT_START}"]) .tab-group__tabs {
      flex-direction: column;
      align-items: flex-start;
    }

    :host([placement="${PLACEMENT_START}"]) .tab-group__panels {
      flex: 1;
      padding: 0 1rem;
    }

    /* placement="end" */
    :host([placement="${PLACEMENT_END}"]) .tab-group {
      flex-direction: row;
    }

    :host([placement="${PLACEMENT_END}"]) .tab-group__nav {
      order: 1;
    }

    :host([placement="${PLACEMENT_END}"]) .tab-group__tabs {
      flex-direction: column;
      align-items: flex-start;
    }

    :host([placement="${PLACEMENT_END}"]) .tab-group__panels {
      flex: 1;
      padding: 0 1rem;
    }
  </style>

  <div part="base" class="tab-group">
    <div part="nav" class="tab-group__nav">
      <button type="button" part="scroll-button scroll-button--start" class="tab-group__scroll-button tab-group__scroll-button--start" aria-label="Scroll to start">
        <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" viewBox="0 0 16 16" part="scroll-button-icon">
          <path fill-rule="evenodd" d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"/>
        </svg>
      </button>

      <div part="tabs" class="tab-group__tabs" role="tablist">
        <slot name="tab"></slot>
      </div>

      <button type="button" part="scroll-button scroll-button--end" class="tab-group__scroll-button tab-group__scroll-button--end" aria-label="Scroll to end">
        <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" viewBox="0 0 16 16" part="scroll-button-icon">
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
 * @extends HTMLElement
 *
 * @tagname a-tab-group
 *
 * @property {string} placement - The placement of the tabs.
 * @property {boolean} noScrollControls - Whether or not the scroll controls are enabled.
 * @property {number} scrollDistance - The distance in pixels that the tabs will scroll when the scroll buttons are clicked.
 * @property {string} activation - The activation mode of the tabs.
 * @property {boolean} panelTransition - Whether or not the panel transition is enabled.
 *
 * @attribute placement - Reflects the placement property.
 * @attribute no-scroll-controls - Reflects the noScrollControls property.
 * @attribute scroll-distance - Reflects the scrollDistance property.
 * @attribute activation - Reflects the activation property.
 * @attribute panel-transition - Reflects the panelTransition property.
 *
 * @slot tab - Used for groupping tabs in the tab group. Must be <a-tab> elements.
 * @slot panel - Used for groupping tab panels in the tab group. Must be <a-tab-panel> elements.
 *
 * @csspart base - The component's base wrapper.
 * @csspart nav - The nav container.
 * @csspart nav--scrollable - The nav container when it is scrollable.
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
 * @fires a-tab-select - Fired when a tab is selected.
 *
 * @method selectTabByIndex - Selects the tab at the given index.
 * @method selectTab - Selects the given tab.
 */
class TabGroup extends HTMLElement {
  /** @type {boolean} */
  #shouldPanelTransitionBeEnabled = false; // Ensure that the first time a panel is shown, there will not be a transition.

  /** @type {ResizeObserver | null} */
  #resizeObserver = null;

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
   * @type {string | null} - The placement of the tabs.
   * @default 'top'
   * @attribute placement - Reflects the placement property.
   */
  get placement() {
    return this.getAttribute('placement');
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
    if (value) {
      this.setAttribute('no-scroll-controls', '');
    } else {
      this.removeAttribute('no-scroll-controls');
    }
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
    return this.getAttribute('activation') || ACTIVATION_AUTO;
  }

  set activation(value) {
    this.setAttribute('activation', value || ACTIVATION_AUTO);
  }

  /**
   * @type {boolean} - Whether or not the panel transition is enabled.
   * @default false
   * @attribute panel-transition - Reflects the panelTransition property.
   */
  get panelTransition() {
    return this.hasAttribute('panel-transition');
  }

  set panelTransition(value) {
    if (value) {
      this.setAttribute('panel-transition', '');
    } else {
      this.removeAttribute('panel-transition');
    }
  }

  /**
   * Lifecycle method that is called when the element is first connected to the DOM.
   */
  connectedCallback() {
    this.#upgradeProperty('placement');
    this.#upgradeProperty('noScrollControls');
    this.#upgradeProperty('scrollDistance');
    this.#upgradeProperty('activation');
    this.#upgradeProperty('panelTransition');

    const tabSlot = this.shadowRoot?.querySelector('slot[name=tab]');
    const panelSlot = this.shadowRoot?.querySelector('slot[name=panel]');
    const tabsContainer = this.shadowRoot?.querySelector('.tab-group__tabs');
    const navContainer = this.shadowRoot?.querySelector('.tab-group__nav');
    /** @type {HTMLButtonElement[]} */
    const scrollButtons = Array.from(this.shadowRoot?.querySelectorAll('.tab-group__scroll-button') || []);

    tabSlot?.addEventListener('slotchange', this.#handleSlotChange);
    panelSlot?.addEventListener('slotchange', this.#handleSlotChange);
    tabsContainer?.addEventListener('click', this.#handleTabClick);
    tabsContainer?.addEventListener('keydown', this.#handleKeyDown);
    scrollButtons.forEach(el => el.addEventListener('click', this.#handleScrollButtonClick));
    this.addEventListener(`${A_TAB}-close`, this.#handleTabClose);

    if ('ResizeObserver' in window) {
      this.#resizeObserver = new ResizeObserver(entries => {
        const entry = entries?.[0];
        const targetElement = entry?.target;
        const isElementScrollable = targetElement?.scrollWidth > (entry?.borderBoxSize?.[0]?.inlineSize || targetElement?.clientWidth);
        scrollButtons.forEach(el => el.hidden = !isElementScrollable);
        navContainer?.part.toggle('nav--scrollable', isElementScrollable);
        navContainer?.classList.toggle('tab-group__nav--scrollable', isElementScrollable);
      });
    }

    this.#syncNav();
    this.hidden = this.#allTabs().length === 0;
    this.placement = this.placement || PLACEMENT_TOP; // Set by default to `top` to reflect the default value in the CSS.
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
    this.removeEventListener(`${A_TAB}-close`, this.#handleTabClose);
    this.#stopResizeObserver();
  }

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

  #stopResizeObserver() {
    if (!this.#resizeObserver) {
      return;
    }

    this.#resizeObserver.disconnect();
  }

  /**
   * Links up tabs with their adjacent panels using `aria-controls` and `aria-labelledby`.
   * This method makes sure only one tab is selected at a time.
   */
  #linkPanels() {
    const tabs = this.#allTabs();

    // Hide the tab group if there are no tabs.
    this.hidden = tabs.length === 0;

    // Give each panel a `aria-labelledby` attribute that refers to the tab that controls it.
    tabs.forEach(tab => {
      const panel = tab.nextElementSibling;

      if (!panel || panel.tagName.toLowerCase() !== A_TAB_PANEL) {
        return console.error(`Tab #${tab.id} is not a sibling of a <a-tab-panel>`);
      }

      tab.setAttribute('aria-controls', panel.id);
      panel.setAttribute('aria-labelledby', tab.id);
    });

    // Get the selected non-disabled tab, or the first non-disabled tab.
    const tab = tabs.find(tab => tab.selected && !tab.disabled) || tabs.find(tab => !tab.disabled);

    if (tab) {
      this.#markTabSelected(tab);
    }
  }

  /**
   * Get all panels in the tab group.
   *
   * @returns {TabPanel[]} All the panels in the tab group.
   */
  #allPanels() {
    return Array.from(this.querySelectorAll(A_TAB_PANEL));
  }

  /**
   * Get all tabs in the tab group.
   *
   * @returns {Tab[]} All the tabs in the tab group.
   */
  #allTabs() {
    return Array.from(this.querySelectorAll(A_TAB));
  }

  /**
   * Get the panel for the given tab.
   *
   * @param {Tab} tab The tab whose panel is to be returned.
   * @returns {TabPanel | null} The panel controlled by the given tab.
   */
  #panelForTab(tab) {
    const panelId = tab.getAttribute('aria-controls');
    return this.querySelector(`#${panelId}`);
  }

  /**
   * Get the first non-disabled tab in the tab group.
   *
   * @returns {Tab | undefined} The first tab in the tab group.
   */
  #firstTab() {
    const tabs = this.#allTabs();
    return tabs.find(tab => !tab.disabled);
  }

  /**
   * Get the last non-disabled tab in the tab group.
   *
   * @returns {Tab | undefined} The last tab in the tab group.
   */
  #lastTab() {
    const tabs = this.#allTabs();

    for (let i = tabs.length - 1; i >= 0; i--) {
      if (!tabs[i].disabled) {
        return tabs[i];
      }
    }
  }

  /**
   * Get the tab that comes before the currently selected one, wrapping around when reaching the first tab.
   * If the currently selected tab is disabled, the method will skip it.
   *
   * @returns {Tab} The previous tab.
   */
  #prevTab() {
    const tabs = this.#allTabs();
    let newIdx = this.activation === ACTIVATION_MANUAL
      ? tabs.findIndex(tab => tab.matches(':focus')) - 1
      : tabs.findIndex(tab => tab.selected) - 1;

    // Keep looping until we find a non-disabled tab.
    while (tabs[(newIdx + tabs.length) % tabs.length].disabled) {
      newIdx--;
    }

    // Add `tabs.length` to make sure the index is a positive number and get the modulus to wrap around if necessary.
    return tabs[(newIdx + tabs.length) % tabs.length];
  }

  /**
   * Get the tab that comes after the currently selected one, wrapping around when reaching the last tab.
   * If the currently selected tab is disabled, the method will skip it.
   *
   * @returns {Tab} The next tab.
   */
  #nextTab() {
    const tabs = this.#allTabs();
    let newIdx = this.activation === ACTIVATION_MANUAL
      ? tabs.findIndex(tab => tab.matches(':focus')) + 1
      : tabs.findIndex(tab => tab.selected) + 1;

    // Keep looping until we find a non-disabled tab.
    while (tabs[newIdx % tabs.length].disabled) {
      newIdx++;
    }

    return tabs[newIdx % tabs.length];
  }

  /**
   * Handles key events on the tab group.
   *
   * @param {any} evt The keydown event.
   */
  #handleKeyDown = evt => {
    if (
      evt.target.tagName.toLowerCase() !== A_TAB // Ignore any key presses that have a modifier.
      || evt.altKey // Don’t handle modifier shortcuts typically used by assistive technology.
    ) {
      return;
    }

    let tab;

    switch (evt.code) {
      case KEYCODE.LEFT:
      case KEYCODE.UP:
        tab = this.#prevTab();
        if (tab) {
          this.activation === ACTIVATION_MANUAL ? tab.focus() : this.selectTab(tab);
        }
        break;
      case KEYCODE.RIGHT:
      case KEYCODE.DOWN:
        tab = this.#nextTab();
        if (tab) {
          this.activation === ACTIVATION_MANUAL ? tab.focus() : this.selectTab(tab);
        }
        break;
      case KEYCODE.HOME:
        tab = this.#firstTab();
        if (tab) {
          this.activation === ACTIVATION_MANUAL ? tab.focus() : this.selectTab(tab);
        }
        break;
      case KEYCODE.END:
        tab = this.#lastTab();
        if (tab) {
          this.activation === ACTIVATION_MANUAL ? tab.focus() : this.selectTab(tab);
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
   * @param {any} evt The click event.
   */
  #handleTabClick = evt => {
    const tab = evt.target.closest(A_TAB);

    if (tab) {
      this.selectTab(tab);
    }
  };

  /**
   * Handles the scroll button click event.
   *
   * @param {any} evt The click event.
   */
  #handleScrollButtonClick = evt => {
    const scrollButton = evt.target.closest('.tab-group__scroll-button');

    if (!scrollButton) {
      return;
    }

    const tabsContainer = this.shadowRoot?.querySelector('.tab-group__tabs');

    if (!tabsContainer) {
      return;
    }

    const direction = scrollButton.classList.contains('tab-group__scroll-button--start') ? PLACEMENT_START : PLACEMENT_END;

    tabsContainer.scrollBy({
      left: direction === PLACEMENT_START ? -this.scrollDistance : this.scrollDistance
    });
  };

  /**
   * Handles the tab close button click event.
   *
   * @param {any} evt The click event.
   */
  #handleTabClose = evt => {
    const tab = evt.target;
    const panel = this.#panelForTab(tab);

    if (tab) {
      tab.remove();
    }

    if (panel && panel.tagName.toLowerCase() === A_TAB_PANEL) {
      panel.remove();
    }
  };

  /**
   * Handles the slotchange event on the tab group.
   * This is called every time the user adds or removes a tab or panel.
   */
  #handleSlotChange = () => {
    this.#shouldPanelTransitionBeEnabled = false;
    this.#linkPanels();
    this.#syncNav();
  };

  /**
   * Marks all tabs as unselected and hides all the panels.
   * This is called every time the user selects a new tab.
   */
  #reset() {
    const tabs = this.#allTabs();
    const panels = this.#allPanels();

    tabs.forEach(tab => tab.selected = false);
    this.#startPanelTransition(() => panels.forEach(panel => panel.hidden = true));
  }

  /**
   * Marks the given tab as selected.
   * Additionally, it unhides the panel corresponding to the given tab.
   *
   * @param {Tab} newTab - The tab to be selected.
   */
  #markTabSelected(newTab) {
    // Unselect all tabs and hide all panels.
    this.#reset();

    // If the tab doesn’t exist or is already selected, abort.
    if (!newTab || newTab.selected) {
      return;
    }

    // Get the panel that the `newTab` is associated with.
    const newPanel = this.#panelForTab(newTab);

    // If that panel doesn’t exist, abort.
    if (!newPanel) {
      return;
    }

    newTab.selected = true;
    this.#startPanelTransition(() => newPanel.hidden = false);
    this.#shouldPanelTransitionBeEnabled = true;
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

    if (this.noScrollControls || this.placement === PLACEMENT_START || this.placement === PLACEMENT_END) {
      this.#stopResizeObserver();
      scrollButtons.forEach(el => el.hidden = true);
      navContainer?.classList.remove('tab-group__nav--scrollable');
    } else {
      this.#startResizeObserver();
      scrollButtons.forEach(el => el.hidden = false);
    }
  }

  /**
   * Starts the panel transition.
   * If the panel transition is enabled, the callback is called when the transition is complete.
   *
   * @param {function} [callback = () => {}]
   */
  #startPanelTransition(callback = () => {}) {
    // @ts-ignore
    const isPanelTransitionEnabled = typeof document.startViewTransition === 'function'
      && window.matchMedia('(prefers-reduced-motion: no-preference)').matches
      && this.#shouldPanelTransitionBeEnabled
      && this.panelTransition;

    // @ts-ignore
    isPanelTransitionEnabled ? document.startViewTransition(callback) : callback();
  }

  /**
   * This is to safe guard against cases where, for instance, a framework may have added the element to the page and set a
   * value on one of its properties, but lazy loaded its definition. Without this guard, the upgraded element would miss that
   * property and the instance property would prevent the class property setter from ever being called.
   *
   * https://developers.google.com/web/fundamentals/web-components/best-practices#lazy-properties
   *
   * @param {'placement' | 'noScrollControls' | 'scrollDistance' | 'activation' | 'panelTransition'} prop - The property to upgrade.
   */
  #upgradeProperty(prop) {
    /** @type {any} */
    const instance = this;

    if (Object.prototype.hasOwnProperty.call(instance, prop)) {
      const value = instance[prop];
      delete instance[prop];
      instance[prop] = value;
    }
  }

  /**
   * Selects the tab at the given index.
   * If the tab at the given index is disabled or already selected, this method does nothing.
   *
   * @param {Number} index The index of the tab to be selected.
   */
  selectTabByIndex(index) {
    const tabs = this.#allTabs();
    const tab = tabs[index];

    this.selectTab(tab);
  }

  /**
   * Selects the given tab.
   * If the given tab is disabled or already selected, this method does nothing.
   *
   * @param {Tab} tab The tab to be selected.
   */
  selectTab(tab) {
    if (tab && !tab.disabled && !tab.selected) {
      this.#markTabSelected(tab);

      // Queue a microtask to ensure that the tab is focused on the next tick.
      setTimeout(() => tab.focus(), 0);

      this.dispatchEvent(new CustomEvent(`${A_TAB}-select`, {
        bubbles: true,
        composed: true,
        detail: { tabId: tab.id }
      }));
    }
  }

  static defineCustomElement(elementName = A_TAB_GROUP) {
    if (typeof window !== 'undefined' && !window.customElements.get(elementName)) {
      window.customElements.define(elementName, TabGroup);
    }
  }
}

TabGroup.defineCustomElement();

export { TabGroup };
