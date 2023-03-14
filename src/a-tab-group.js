import './a-tab';
import './a-tab-panel.js';

/**
 * Define key codes to help with handling keyboard events.
 */
const KEYCODE = {
  DOWN: 'ArrowDown',
  LEFT: 'ArrowLeft',
  RIGHT: 'ArrowRight',
  UP: 'ArrowUp',
  HOME: 'Home',
  END: 'End'
};

const template = document.createElement('template');

template.innerHTML = /* html */`
  <style>
    *,
    *::after,
    *::before {
      box-sizing: inherit;
      margin: 0;
      padding: 0;
    }

    :host([hidden]),
    [hidden] {
      display: none !important;
    }

    :host {
      --selected-tab-color: #0d6efd;
      --scroll-buttons-width: 35px;

      display: block;
      box-sizing: border-box;
    }

    .tab-group__nav {
      position: relative;
    }

    .tab-group__nav--scrollable {
      padding: 0 var(--scroll-buttons-width);
    }

    .tab-group__scroll-button {
      display: flex;
      justify-content: center;
      align-items: center;
      position: absolute;
      top: 0;
      width: var(--scroll-buttons-width);
      height: 100%;
      z-index: 1;
      background-color: transparent;
      border: 0;
      cursor: pointer;
    }

    .tab-group__scroll-button--start {
      left: 0;
    }

    .tab-group__scroll-button--end {
      right: 0;
    }

    .tab-group {
      display: flex;
      width: 100%;
    }

    .tab-group__tabs {
      display: flex;
      overflow-x: auto;
      scrollbar-width: none;
    }

    .tab-group__tabs::-webkit-scrollbar {
      display: none;
    }

    .tab-group__panels {
      padding: 1rem 0;
    }

    ::slotted(a-tab) {
      position: relative;
      display: inline-flex;
      align-items: center;
      padding: 0.75rem 1rem;
      font-size: 1rem;
      white-space: nowrap;
      outline: none;
      cursor: pointer;
    }

    ::slotted(a-tab[selected]) {
      color: var(--selected-tab-color);
    }

    ::slotted(a-tab[disabled]) {
      opacity: 0.7;
      cursor: not-allowed;
    }

    ::slotted(tab-panel) {
      display: block;
      font-size: 1rem;
    }

    /* placement = top */
    .tab-group,
    :host([placement="top"]) .tab-group {
      flex-direction: column;
    }

    /* placement = bottom */
    :host([placement="bottom"]) .tab-group {
      flex-direction: column;
    }

    :host([placement="bottom"]) .tab-group__nav {
      order: 1;
    }

    /* placement = start */
    :host([placement="start"]) .tab-group {
      flex-direction: row;
    }

    :host([placement="start"]) .tab-group__tabs {
      flex-direction: column;
      align-items: flex-start;
    }

    :host([placement="start"]) .tab-group__panels {
      flex: 1;
      padding: 0 1rem;
    }

    :host([placement="start"]) ::slotted(a-tab) {
      width: 100%;
      max-width: 200px;
      white-space: normal;
    }

    /* placement = end */
    :host([placement="end"]) .tab-group {
      flex-direction: row;
    }

    :host([placement="end"]) .tab-group__nav {
      order: 1;
    }

    :host([placement="end"]) .tab-group__tabs {
      flex-direction: column;
      align-items: flex-start;
    }

    :host([placement="end"]) .tab-group__panels {
      flex: 1;
      padding: 0 1rem;
    }

    :host([placement="end"]) ::slotted(a-tab) {
      width: 100%;
      max-width: 200px;
      white-space: normal;
    }
  </style>

  <div part="base" class="tab-group">
    <div class="tab-group__nav">
      <button type="button" part="scroll-button scroll-button--start" class="tab-group__scroll-button tab-group__scroll-button--start" aria-label="Scroll to start">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" part="scroll-button-icon">
          <path fill-rule="evenodd" d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"/>
        </svg>
      </button>

      <div part="tabs" class="tab-group__tabs">
        <slot name="tab"></slot>
      </div>

      <button type="button" part="scroll-button scroll-button--end" class="tab-group__scroll-button tab-group__scroll-button--end" aria-label="Scroll to end">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" part="scroll-button-icon">
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
 * Container element for tabs and panels.
 * All children of `<a-tab-group>` should be either `<a-tab>` or `<a-tab-panel>`.
 *
 * @slot tab - Contains the `<a-tab>` elements.
 * @slot panel - Contains the `<a-tab-panel>` elements.
 *
 * @csspart base - The component's base wrapper.
 * @csspart nav - The navigation cotainer.
 * @csspart scroll-button - The scroll button.
 * @csspart scroll-button--start - The scroll button for the start.
 * @csspart scroll-button--end - The scroll button for the end.
 * @csspart scroll-button-icon - The scroll button icon.
 * @csspart tabs - The container of the tabs.
 * @csspart panels - The container of the tab panels.
 *
 * @cssproperty --selected-tab-color - The color of the selected tab.
 * @cssproperty --scroll-buttons-width - The width of the scroll buttons.
 *
 * @event a-tab-group:change - Fired when the selected tab changes.
 */
class TabGroup extends HTMLElement {
  #resizeObserver;

  constructor() {
    super();

    if (!this.shadowRoot) {
      this.attachShadow({ mode: 'open' });
      this.shadowRoot.appendChild(template.content.cloneNode(true));
    }
  }

  static get observedAttributes() {
    return ['placement', 'no-scroll-controls'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'placement' && oldValue !== newValue) {
      this.#syncNav();
    }

    if (name === 'no-scroll-controls' && oldValue !== newValue) {
      this.#syncNav();
    }
  }

  get placement() {
    return this.getAttribute('placement');
  }

  set placement(value) {
    this.setAttribute('placement', value);
  }

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

  connectedCallback() {
    this.#upgradeProperty('placement');
    this.#upgradeProperty('noScrollControls');

    const tabSlot = this.shadowRoot.querySelector('slot[name=tab]');
    const panelSlot = this.shadowRoot.querySelector('slot[name=panel]');
    const tabsContainer = this.shadowRoot.querySelector('.tab-group__tabs');
    const navContainer = this.shadowRoot.querySelector('.tab-group__nav');
    const scrollButtons = this.shadowRoot.querySelectorAll('.tab-group__scroll-button');

    tabSlot.addEventListener('slotchange', this.#onSlotChange);
    panelSlot.addEventListener('slotchange', this.#onSlotChange);
    tabsContainer.addEventListener('click', this.#onTabClick);
    scrollButtons.forEach(el => el.addEventListener('click', this.#onScrollButtonClick));
    this.addEventListener('keydown', this.#onKeyDown);

    if (!this.hasAttribute('role')) {
      this.setAttribute('role', 'tablist');
    }

    if ('ResizeObserver' in window) {
      this.#resizeObserver = new ResizeObserver(entries => {
        const entry = entries?.[0];
        const targetElement = entry?.target;
        const isElementScrollable = targetElement?.scrollWidth > (entry?.borderBoxSize?.[0]?.inlineSize || targetElement?.clientWidth);
        scrollButtons.forEach(el => el.hidden = !isElementScrollable);
        navContainer.classList.toggle('tab-group__nav--scrollable', isElementScrollable);
      });
    }
  }

  disconnectedCallback() {
    const tabSlot = this.shadowRoot.querySelector('slot[name=tab]');
    const panelSlot = this.shadowRoot.querySelector('slot[name=panel]');
    const tabsContainer = this.shadowRoot.querySelector('.tab-group__tabs');
    const scrollButtons = this.shadowRoot.querySelectorAll('.tab-group__scroll-button');

    tabSlot.removeEventListener('slotchange', this.#onSlotChange);
    panelSlot.removeEventListener('slotchange', this.#onSlotChange);
    tabsContainer.removeEventListener('click', this.#onTabClick);
    scrollButtons.forEach(el => el.removeEventListener('click', this.#onScrollButtonClick));
    this.removeEventListener('keydown', this.#onKeyDown);
    this.#stopResizeObserver();
  }

  #startResizeObserver() {
    if (!this.#resizeObserver) {
      return;
    }

    const scrollElement = this.shadowRoot.querySelector('.tab-group__tabs');

    this.#resizeObserver.unobserve(scrollElement);
    this.#resizeObserver.observe(scrollElement);
  }

  #stopResizeObserver() {
    if (!this.#resizeObserver) {
      return;
    }

    this.#resizeObserver.disconnect();
  }

  /**
   * Links up tabs with their adjacent panels using `aria-controls` and `aria-labelledby`.
   * This method makes sure only one tab is active at a time.
   */
  #linkPanels() {
    const tabs = this.#allTabs();

    // Give each panel a `aria-labelledby` attribute that refers to the tab that controls it.
    tabs.forEach(tab => {
      const panel = tab.nextElementSibling;

      if (!panel || panel.tagName.toLowerCase() !== 'a-tab-panel') {
        throw new Error(`Tab #${tab.id} is not a sibling of a <a-tab-panel>`);
      }

      tab.setAttribute('aria-controls', panel.id);
      panel.setAttribute('aria-labelledby', tab.id);
    });

    // Get the selected tab, or the first tab if none are selected.
    const selectedTab = tabs.find(tab => tab.selected) || tabs.find(tab => !tab.disabled);

    this.#selectTab(selectedTab);
  }

  /**
   * Get all panels in the tab group.
   *
   * @returns {HTMLElement[]} All the panels in the tab group.
   */
  #allPanels() {
    return Array.from(this.querySelectorAll('a-tab-panel'));
  }

  /**
   * Get all tabs in the tab group.
   *
   * @returns {HTMLElement[]} All the tabs in the tab group.
   */
  #allTabs() {
    return Array.from(this.querySelectorAll('a-tab'));
  }

  /**
   * Get the panel for the given tab.
   *
   * @param {HTMLElement} tab The tab whose panel is to be returned.
   * @returns {HTMLElement} The panel controlled by the given tab.
   */
  #panelForTab(tab) {
    const panelId = tab.getAttribute('aria-controls');
    return this.querySelector(`#${panelId}`);
  }

  /**
   * Get the first non-disabled tab in the tab group.
   *
   * @returns {HTMLElement} The first tab in the tab group.
   */
  #firstTab() {
    const tabs = this.#allTabs();
    return tabs.find(tab => !tab.disabled);
  }

  /**
   * Get the last non-disabled tab in the tab group.
   *
   * @returns {HTMLElement} The last tab in the tab group.
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
   * @returns {HTMLElement} The previous tab.
   */
  #prevTab() {
    const tabs = this.#allTabs();
    let newIdx = tabs.findIndex(tab => tab.selected) - 1;

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
   * @returns {HTMLElement} The next tab.
   */
  #nextTab() {
    const tabs = this.#allTabs();
    let newIdx = tabs.findIndex(tab => tab.selected) + 1;

    // Keep looping until we find a non-disabled tab.
    while (tabs[newIdx % tabs.length].disabled) {
      newIdx++;
    }

    return tabs[newIdx % tabs.length];
  }

  /**
   * Handles key events on the tab group.
   *
   * @param {KeyboardEvent} evt The keydown event.
   */
  #onKeyDown = evt => {
    // Ignore any key presses that have a modifier.
    if (evt.target.getAttribute('role') !== 'tab') {
      return;
    }

    // Don’t handle modifier shortcuts typically used by assistive technology.
    if (evt.altKey) {
      return;
    }

    let tab;

    switch (evt.code) {
      case KEYCODE.LEFT:
      case KEYCODE.UP:
        tab = this.#prevTab();
        break;
      case KEYCODE.RIGHT:
      case KEYCODE.DOWN:
        tab = this.#nextTab();
        break;
      case KEYCODE.HOME:
        tab = this.#firstTab();
        break;
      case KEYCODE.END:
        tab = this.#lastTab();
        break;
      // Any other key press is ignored and passed back to the browser.
      default:
        return;
    }

    // The browser might have some native functionality bound to the arrow keys, home or end.
    // `preventDefault()` is called to prevent the browser from taking any actions.
    evt.preventDefault();

    // Select the new tab, that has been determined in the switch-case.
    this.selectTab(tab);
  };

  /**
   * Handles click events on the tab group.
   *
   * @param {MouseEvent} evt The click event.
   */
  #onTabClick = evt => {
    // Ignore clicks that weren't on a tab element.
    const tab = evt.target.closest('[role="tab"]');

    if (!tab || tab.disabled || tab.selected) {
      return;
    }

    // If it was on a tab element, though, select that tab.
    this.selectTab(tab);
  };

  /**
   * Handles the scroll button click event.
   *
   * @param {MouseEvent} evt The click event.
   */
  #onScrollButtonClick = evt => {
    const scrollButton = evt.target.closest('.tab-group__scroll-button');

    if (!scrollButton) {
      return;
    }

    const tabsContainer = this.shadowRoot.querySelector('.tab-group__tabs');
    const direction = scrollButton.classList.contains('tab-group__scroll-button--start') ? 'start' : 'end';
    const scrollAmount = 200;
    const left = direction === 'start' ? -scrollAmount : scrollAmount;

    tabsContainer.scrollBy({
      left,
      behavior: 'smooth'
    });
  };

  /**
   * Handles the slotchange event on the tab group.
   * This is called every time the user adds or removes a tab or panel.
   */
  #onSlotChange = () => {
    try {
      this.#linkPanels();
      this.#syncNav();
    } catch (err) {
      console.error(err);
    }
  };

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
   * Marks the given tab as selected.
   * Additionally, it unhides the panel corresponding to the given tab.
   *
   * @param {HTMLElement} newTab
   */
  #selectTab(newTab) {
    // Unselect all tabs and hide all panels.
    this.#reset();

    if (!newTab) {
      return;
    }

    // Get the panel that the `newTab` is associated with.
    const newPanel = this.#panelForTab(newTab);

    // If that panel doesn’t exist, abort.
    if (!newPanel) {
      return;
    }

    newTab.selected = true;
    newPanel.hidden = false;
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
    const navContainer = this.shadowRoot.querySelector('.tab-group__nav');
    const scrollButtons = this.shadowRoot.querySelectorAll('.tab-group__scroll-button');

    if (this.noScrollControls || this.placement === 'start' || this.placement === 'end') {
      this.#stopResizeObserver();
      scrollButtons.forEach(el => el.hidden = true);
      navContainer.classList.remove('tab-group__nav--scrollable');
    } else {
      this.#startResizeObserver();
      scrollButtons.forEach(el => el.hidden = false);
    }
  }

  /**
   * https://developers.google.com/web/fundamentals/web-components/best-practices#lazy-properties
   * This is to safe guard against cases where, for instance, a framework may have added the element to the page and set a
   * value on one of its properties, but lazy loaded its definition. Without this guard, the upgraded element would miss that
   * property and the instance property would prevent the class property setter from ever being called.
   */
  #upgradeProperty(prop) {
    if (Object.prototype.hasOwnProperty.call(this, prop)) {
      const value = this[prop];
      delete this[prop];
      this[prop] = value;
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

    if (tab && !tab.disabled && !tab.selected) {
      this.#selectTab(tab);

      this.dispatchEvent(new CustomEvent('a-tab-group:change', {
        bubbles: true,
        composed: true,
        detail: {
          tabId: tab.id,
          panelId: this.#panelForTab(tab)?.id
        }
      }));
    }
  }

  /**
   * Selects the given tab.
   * If the given tab is disabled or already selected, this method does nothing.
   *
   * @param {HTMLElement} tab The tab to be selected.
   */
  selectTab(tab) {
    if (tab && !tab.disabled && !tab.selected) {
      this.#selectTab(tab);

      this.dispatchEvent(new CustomEvent('a-tab-group:change', {
        bubbles: true,
        composed: true,
        detail: {
          tabId: tab.id,
          panelId: this.#panelForTab(tab)?.id
        }
      }));
    }
  }
}

if (window.customElements && !window.customElements.get('a-tab-group')) {
  window.customElements.define('a-tab-group', TabGroup);
}
