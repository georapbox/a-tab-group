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
      display: flex;
      flex-wrap: wrap;
      box-sizing: border-box;
    }

    .base {
      width: 100%;
    }

    .tabs-container {
      display: flex;
      overflow-x: auto;
      border-bottom: 1px solid #e4e4e7;
      scrollbar-width: none;
    }

    .tabs-container::-webkit-scrollbar {
      display: none;
    }

    .tab-panels-container {
      padding: 1rem 0;
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
      color: #0ea5e9;
    }

    ::slotted(a-tab[disabled]) {
      opacity: 0.7;
      cursor: not-allowed;
    }

    ::slotted(tab-panel) {
      display: block;
      font-size: 1rem;
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
 * `TabGroup` is a container element for tabs and panels.
 *
 * All children of `<a-tab-group>` should be either `<a-tab>` or `<a-tab-panel>`.
 * This element is stateless, meaning that no values are cached and therefore, changes during runtime work.
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

  connectedCallback() {
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
   * Additionally, the method makes sure only one tab is active.
   */
  #linkPanels() {
    const tabs = this.#allTabs();

    // Give each panel a `aria-labelledby` attribute that refers to the tab that controls it.
    tabs.forEach(tab => {
      const panel = tab.nextElementSibling;

      if (panel.tagName.toLowerCase() !== 'a-tab-panel') {
        console.error(`Tab #${tab.id} is not a sibling of a <a-tab-panel>`);
        return;
      }

      tab.setAttribute('aria-controls', panel.id);
      panel.setAttribute('aria-labelledby', tab.id);
    });

    // The element checks if any of the tabs have been marked as selected.
    // If not, the first tab is now selected.
    const selectedTab = tabs.find(tab => tab.selected) || tabs[0];

    // Next, switch to the selected tab. `selectTab()` takes care of
    // marking all other tabs as deselected and hiding all other panels.
    this.selectTab(selectedTab);
  }

  /**
   * Returns all the panels in the tab panel.
   *
   * @returns {HTMLElement[]} All the panels in the tab panel.
   */
  #allPanels() {
    return Array.from(this.querySelectorAll('a-tab-panel'));
  }

  /**
   * Returns all the tabs in the tab panel.
   *
   * @returns {HTMLElement[]} All the tabs in the tab panel.
   */
  #allTabs() {
    return Array.from(this.querySelectorAll('a-tab'));
  }

  /**
   * Returns the panel that the given tab controls.
   *
   * @param {HTMLElement} tab The tab whose panel is to be returned.
   * @returns {HTMLElement} The panel controlled by the given tab.
   */
  #panelForTab(tab) {
    const panelId = tab.getAttribute('aria-controls');
    return this.querySelector(`#${panelId}`);
  }

  /**
   * Returns the tab that comes before the currently selected
   * one, wrapping around when reaching the first one.
   *
   * @returns {HTMLElement} The previous tab.
   */
  #prevTab() {
    const tabs = this.#allTabs();
    // Find the index of the currently selected element and subtracts one to get the index of the previous element.
    const newIdx = tabs.findIndex(tab => tab.selected) - 1;
    // Add `tabs.length` to make sure the index is a positive number and get the modulus to wrap around if necessary.
    return tabs[(newIdx + tabs.length) % tabs.length];
  }

  /**
   * Gets the first tab in the tab panel.
   *
   * @returns {HTMLElement} The first tab.
   */
  #firstTab() {
    return this.#allTabs()[0];
  }

  /**
   * Gets the last tab in the tab panel.
   *
   * @returns {HTMLElement} The last tab.
   */
  #lastTab() {
    const tabs = this.#allTabs();
    return tabs[tabs.length - 1];
  }

  /**
   * Gets the tab that comes after the currently selected one,
   * wrapping around when reaching the last tab.
   *
   * @returns {HTMLElement} The next tab.
   */
  #nextTab() {
    const tabs = this.#allTabs();
    const newIdx = tabs.findIndex(tab => tab.selected) + 1;
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
    // The element calls `preventDefault()` to prevent the browser from taking any actions.
    evt.preventDefault();

    // Select the new tab, that has been determined in the switch-case.
    const isNewTabSelected = this.selectTab(tab);

    if (isNewTabSelected) {
      this.dispatchEvent(new Event('a-tab-group:change', {
        bubbles: true,
        composed: true
      }));
    }
  };

  /**
   * Handles click events on the tab group.
   *
   * @param {MouseEvent} evt The click event.
   */
  #onClick = evt => {
    // Ignore clicks that weren't on a tab element.
    const tab = evt.target.closest('[role="tab"]');

    if (!tab) {
      return;
    }

    // If it was on a tab element, though, select that tab.
    const isNewTabSelected = this.selectTab(tab);

    if (isNewTabSelected) {
      this.dispatchEvent(new Event('a-tab-group:change', {
        bubbles: true,
        composed: true
      }));
    }
  };

  /**
   * Handles the slotchange event on the tab group.
   * This is called every time the user adds or removes a tab or panel.
   */
  #onSlotChange = () => {
    this.#linkPanels();
  };

  /**
   * Marks all tabs as deselected and hides all the panels.
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
   * @returns {boolean} `true` if the tab was successfully selected, `false` otherwise.
   */
  selectTab(newTab) {
    if (!newTab || newTab.selected || newTab.disabled) {
      // If the tab is already selected or disabled abort.
      return false;
    }

    // Get the panel that the `newTab` is associated with.
    const newPanel = this.#panelForTab(newTab);

    // If that panel doesn’t exist, abort.
    if (!newPanel) {
      return false;
    }

    // Deselect all tabs and hide all panels.
    this.#reset();

    newTab.selected = true;
    newPanel.hidden = false;

    return true;
  }

  /**
   * Marks the tab as selected by its index.
   * Additionally, it unhides the panel corresponding to the given tab.
   *
   * @param {Number} index The index of the tab to be selected.
   */
  selectTabByIndex(index) {
    const tabs = this.#allTabs();
    const tab = tabs[index];

    if (tab) {
      this.selectTab(tab);
    }
  }
}

if (window.customElements && !window.customElements.get('a-tab-group')) {
  window.customElements.define('a-tab-group', TabGroup);
}
