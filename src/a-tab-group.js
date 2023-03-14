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
      --selected-tab-color: #0ea5e9;

      display: block;
      box-sizing: border-box;
    }

    .base {
      display: flex;
      width: 100%;
    }

    .tabs-container {
      display: flex;
      overflow-x: auto;
      border-width: 0 0 1px 0;
      border-style: solid;
      border-color: #e4e4e7;
      scrollbar-width: none;
    }

    .tabs-container::-webkit-scrollbar {
      display: none;
    }

    .tab-panels-container {
      padding-block: 1rem;
    }

    ::slotted(a-tab) {
      position: relative;
      display: inline-flex;
      align-items: center;
      justify-content: center;
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

    /* Start placement */
    .base,
    :host([placement="top"]) .base {
      flex-direction: column;
    }

    /* Bottom placement */
    :host([placement="bottom"]) .base {
      flex-direction: column;
    }

    :host([placement="bottom"]) .tabs-container {
      border-width: 1px 0 0 0;
      order: 1;
    }

    /* Start placement */
    :host([placement="start"]) .base {
      flex-direction: row;
    }

    :host([placement="start"]) .tabs-container {
      border-width: 0 1px 0 0;
      flex-direction: column;
      align-items: flex-start;
    }

    :host([placement="start"]) .tab-panels-container {
      flex: 1;
      padding-inline: 1rem;
      padding-block: 0;
    }

    /* End placement */
    :host([placement="end"]) .base {
      flex-direction: row;
    }

    :host([placement="end"]) .tabs-container {
      border-width: 0 0 0 1px;
      flex-direction: column;
      align-items: flex-start;
      order: 1;
    }

    :host([placement="end"]) .tab-panels-container {
      flex: 1;
      padding-inline: 1rem;
      padding-block: 0;
    }
  </style>

  <div part="base" class="base">
    <div part="tabs-container" class="tabs-container">
      <slot name="tab"></slot>
    </div>
    <div part="tab-panels-container" class="tab-panels-container">
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
 * @csspart tabs-container - The container of the tabs.
 * @csspart tab-panels-container - The container of the tab panels.
 */
class TabGroup extends HTMLElement {
  #tabSlot;
  #panelSlot;

  constructor() {
    super();

    if (!this.shadowRoot) {
      this.attachShadow({ mode: 'open' });
      this.shadowRoot.appendChild(template.content.cloneNode(true));
    }
  }

  get placement() {
    return this.getAttribute('placement');
  }

  set placement(value) {
    this.setAttribute('placement', value);
  }

  connectedCallback() {
    this.#upgradeProperty('placement');

    this.#tabSlot = this.shadowRoot.querySelector('slot[name=tab]');
    this.#panelSlot = this.shadowRoot.querySelector('slot[name=panel]');

    this.#tabSlot.addEventListener('slotchange', this.#onSlotChange);
    this.#panelSlot.addEventListener('slotchange', this.#onSlotChange);
    this.addEventListener('keydown', this.#onKeyDown);
    this.addEventListener('click', this.#onClick);

    if (!this.hasAttribute('role')) {
      this.setAttribute('role', 'tablist');
    }
  }

  disconnectedCallback() {
    this.#tabSlot.removeEventListener('slotchange', this.#onSlotChange);
    this.#panelSlot.removeEventListener('slotchange', this.#onSlotChange);
    this.removeEventListener('keydown', this.#onKeyDown);
    this.removeEventListener('click', this.#onClick);
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
  #onClick = evt => {
    // Ignore clicks that weren't on a tab element.
    const tab = evt.target.closest('[role="tab"]');

    if (!tab || tab.disabled || tab.selected) {
      return;
    }

    // If it was on a tab element, though, select that tab.
    this.selectTab(tab);
  };

  /**
   * Handles the slotchange event on the tab group.
   * This is called every time the user adds or removes a tab or panel.
   */
  #onSlotChange = () => {
    try {
      this.#linkPanels();
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
