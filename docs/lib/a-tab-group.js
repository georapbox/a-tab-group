const t="a-tab",e=document.createElement("template");let s=0;e.innerHTML=/* html */`
  <style>
    .tab {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.375rem 0.75rem;
      white-space: nowrap;
      cursor: pointer;
    }

    :host([disabled]) .tab {
      opacity: 0.7;
      cursor: not-allowed;
    }

    :host([selected]) .tab {
      color: var(--selected-tab-color);
      background-color: var(--selected-tab-bg-color);
    }

    .tab__close {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 0.25rem;
      font-size: inherit;
      cursor: pointer;
    }
  </style>

  <div part="base" class="tab">
    <slot></slot>
  </div>
`;/**
 * `Tab` is a tab for a `<a-tab-group>` tab panel.
 * `<a-tab>` should always be used with `role=heading` in the markup so that the
 * semantics remain useable when JavaScript is failing.
 *
 * A `<a-tab>` declares which `<a-tab-panel>` it belongs to by
 * using that panel's ID as the value for the `aria-controls` attribute.
 *
 * A `<a-tab>` will automatically generate a unique ID if none is specified.
 */class o extends HTMLElement{static get observedAttributes(){return["selected","disabled","closable"]}constructor(){super(),this.shadowRoot||(this.attachShadow({mode:"open"}),this.shadowRoot.appendChild(e.content.cloneNode(!0)))}connectedCallback(){this.#t("selected"),this.#t("disabled"),this.#t("closable"),this.id||(this.id=`a-tab-generated-${s++}`),this.setAttribute("role","tab"),this.setAttribute("aria-selected","false"),this.setAttribute("tabindex",this.disabled?-1:0)}disconnectedCallback(){let t=this.shadowRoot.querySelector(".tab__close");t?.removeEventListener("click",this.#e)}attributeChangedCallback(t,e,s){if("selected"===t&&e!==s&&this.setAttribute("aria-selected",this.selected),"disabled"===t&&e!==s&&(this.setAttribute("aria-disabled",this.disabled),this.setAttribute("tabindex",this.disabled?-1:0)),"closable"===t&&e!==s){if(this.closable){let t=document.createElement("span");t.className="tab__close",t.part="close-tab",t.innerHTML=/* html */'<svg part="close-tab-icon" xmlns="http://www.w3.org/2000/svg" width="0.875em" height="0.875em" fill="currentColor" viewBox="0 0 16 16"><path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z"/></svg>',this.shadowRoot.querySelector(".tab").appendChild(t),t.addEventListener("click",this.#e)}else{let t=this.shadowRoot.querySelector(".tab__close");t?.removeEventListener("click",this.#e),t?.remove()}}}get selected(){return this.hasAttribute("selected")}set selected(t){t?this.setAttribute("selected",""):this.removeAttribute("selected")}get disabled(){return this.hasAttribute("disabled")}set disabled(t){t?this.setAttribute("disabled",""):this.removeAttribute("disabled")}get closable(){return this.hasAttribute("closable")}set closable(t){t?this.setAttribute("closable",""):this.removeAttribute("closable")}/**
   * Handles the click event on the close button.
   *
   * @param {MouseEvent} evt The click event.
   */#e=e=>{e.stopPropagation(),this.dispatchEvent(new CustomEvent(`${t}-close`,{bubbles:!0,composed:!0,detail:{tabId:this.id}}))};/**
   * https://developers.google.com/web/fundamentals/web-components/best-practices#lazy-properties
   * This is to safe guard against cases where, for instance, a framework may have added the element to the page and set a
   * value on one of its properties, but lazy loaded its definition. Without this guard, the upgraded element would miss that
   * property and the instance property would prevent the class property setter from ever being called.
   */#t(t){if(Object.prototype.hasOwnProperty.call(this,t)){let e=this[t];delete this[t],this[t]=e}}}window.customElements&&!window.customElements.get(t)&&window.customElements.define(t,o);const a="a-tab-panel",l=document.createElement("template");let r=0;l.innerHTML=/* html */`
  <div part="base" class="tab-panel">
    <slot></slot>
  </div>
`;/**
 * `TabPanel` is a panel for a `<a-tab-group>` tab panel.
 */class i extends HTMLElement{constructor(){super(),this.shadowRoot||(this.attachShadow({mode:"open"}),this.shadowRoot.appendChild(l.content.cloneNode(!0)))}connectedCallback(){this.setAttribute("role","tabpanel"),this.id||(this.id=`a-tab-panel-generated-${r++}`)}}window.customElements&&!window.customElements.get(a)&&window.customElements.define(a,i);const n="a-tab-group",c="a-tab",d="a-tab-panel",h="bottom",b="start",u="auto",p="manual",m={DOWN:"ArrowDown",LEFT:"ArrowLeft",RIGHT:"ArrowRight",UP:"ArrowUp",HOME:"Home",END:"End",ENTER:"Enter",SPACE:"Space"},g=document.createElement("template");g.innerHTML=/* html */`
  <style>
    *,
    *::after,
    *::before {
      box-sizing: inherit;
      margin: 0;
      padding: 0;
    }

    :host([hidden]),
    [hidden],
    ::slotted([hidden]) {
      display: none !important;
    }

    :host {
      --selected-tab-color: #005fcc;
      --selected-tab-bg-color: transparent;
      --tabs-scroll-behavior: smooth;
      --scroll-button-width: 2.125em;
      --scroll-button-height: 2.125em;
      --scroll-button-inline-offset: 0rem;

      display: block;
      box-sizing: border-box;
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
    :host([placement="${h}"]) .tab-group {
      flex-direction: column;
    }

    :host([placement="${h}"]) .tab-group__nav {
      order: 1;
    }

    /* placement="start" */
    :host([placement="${b}"]) .tab-group {
      flex-direction: row;
    }

    :host([placement="${b}"]) .tab-group__tabs {
      flex-direction: column;
      align-items: flex-start;
    }

    :host([placement="${b}"]) .tab-group__panels {
      flex: 1;
      padding: 0 1rem;
    }

    /* placement="end" */
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
  </style>

  <div part="base" class="tab-group">
    <div class="tab-group__nav">
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
`;/**
 * Container element for tabs and panels.
 * All children of `<a-tab-group>` should be either `<a-tab>` or `<a-tab-panel>`.
 */class v extends HTMLElement{#s=!1;#o;static get observedAttributes(){return["placement","no-scroll-controls"]}constructor(){super(),this.shadowRoot||(this.attachShadow({mode:"open"}),this.shadowRoot.appendChild(g.content.cloneNode(!0)))}connectedCallback(){this.#t("placement"),this.#t("noScrollControls"),this.#t("scrollDistance"),this.#t("activation"),this.#t("panelTransition");let t=this.shadowRoot.querySelector("slot[name=tab]"),e=this.shadowRoot.querySelector("slot[name=panel]"),s=this.shadowRoot.querySelector(".tab-group__tabs"),o=this.shadowRoot.querySelector(".tab-group__nav"),a=Array.from(this.shadowRoot.querySelectorAll(".tab-group__scroll-button"));t.addEventListener("slotchange",this.#a),e.addEventListener("slotchange",this.#a),s.addEventListener("click",this.#l),s.addEventListener("keydown",this.#r),a.forEach(t=>t.addEventListener("click",this.#i)),this.addEventListener(`${c}-close`,this.#n),"ResizeObserver"in window&&(this.#o=new ResizeObserver(t=>{let e=t?.[0],s=e?.target,l=s?.scrollWidth>(e?.borderBoxSize?.[0]?.inlineSize||s?.clientWidth);a.forEach(t=>t.hidden=!l),o.classList.toggle("tab-group__nav--scrollable",l)})),this.#c(),this.hidden=0===this.#d().length,this.placement=this.placement||"top"}disconnectedCallback(){let t=this.shadowRoot.querySelector("slot[name=tab]"),e=this.shadowRoot.querySelector("slot[name=panel]"),s=this.shadowRoot.querySelector(".tab-group__tabs"),o=Array.from(this.shadowRoot.querySelectorAll(".tab-group__scroll-button"));t.removeEventListener("slotchange",this.#a),e.removeEventListener("slotchange",this.#a),s.removeEventListener("click",this.#l),s.removeEventListener("keydown",this.#r),o.forEach(t=>t.removeEventListener("click",this.#i)),this.removeEventListener(`${c}-close`,this.#n),this.#h()}attributeChangedCallback(t,e,s){"placement"===t&&e!==s&&this.#c(),"no-scroll-controls"===t&&e!==s&&this.#c()}get placement(){return this.getAttribute("placement")}set placement(t){this.setAttribute("placement",t)}get noScrollControls(){return this.hasAttribute("no-scroll-controls")}set noScrollControls(t){t?this.setAttribute("no-scroll-controls",""):this.removeAttribute("no-scroll-controls")}get scrollDistance(){return Math.abs(this.getAttribute("scroll-distance"))||200}set scrollDistance(t){this.setAttribute("scroll-distance",Math.abs(t)||200)}get activation(){return this.getAttribute("activation")||u}set activation(t){this.setAttribute("activation",t||u)}get panelTransition(){return this.hasAttribute("panel-transition")}set panelTransition(t){t?this.setAttribute("panel-transition",""):this.removeAttribute("panel-transition")}#b(){if(!this.#o)return;let t=this.shadowRoot.querySelector(".tab-group__tabs");this.#o.unobserve(t),this.#o.observe(t)}#h(){this.#o&&this.#o.disconnect()}/**
   * Links up tabs with their adjacent panels using `aria-controls` and `aria-labelledby`.
   * This method makes sure only one tab is selected at a time.
   */#u(){let t=this.#d();// Hide the tab group if there are no tabs.
this.hidden=0===t.length,// Give each panel a `aria-labelledby` attribute that refers to the tab that controls it.
t.forEach(t=>{let e=t.nextElementSibling;if(!e||e.tagName.toLowerCase()!==d)return console.error(`Tab #${t.id} is not a sibling of a <a-tab-panel>`);t.setAttribute("aria-controls",e.id),e.setAttribute("aria-labelledby",t.id)});// Get the selected non-disabled tab, or the first non-disabled tab.
let e=t.find(t=>t.selected&&!t.disabled)||t.find(t=>!t.disabled);this.#p(e)}/**
   * Get all panels in the tab group.
   *
   * @returns {HTMLElement[]} All the panels in the tab group.
   */#m(){return Array.from(this.querySelectorAll(d))}/**
   * Get all tabs in the tab group.
   *
   * @returns {HTMLElement[]} All the tabs in the tab group.
   */#d(){return Array.from(this.querySelectorAll(c))}/**
   * Get the panel for the given tab.
   *
   * @param {HTMLElement} tab The tab whose panel is to be returned.
   * @returns {HTMLElement} The panel controlled by the given tab.
   */#g(t){let e=t.getAttribute("aria-controls");return this.querySelector(`#${e}`)}/**
   * Get the first non-disabled tab in the tab group.
   *
   * @returns {HTMLElement} The first tab in the tab group.
   */#v(){let t=this.#d();return t.find(t=>!t.disabled)}/**
   * Get the last non-disabled tab in the tab group.
   *
   * @returns {HTMLElement} The last tab in the tab group.
   */#w(){let t=this.#d();for(let e=t.length-1;e>=0;e--)if(!t[e].disabled)return t[e]}/**
   * Get the tab that comes before the currently selected one, wrapping around when reaching the first tab.
   * If the currently selected tab is disabled, the method will skip it.
   *
   * @returns {HTMLElement} The previous tab.
   */#f(){let t=this.#d(),e=this.activation===p?t.findIndex(t=>t.matches(":focus"))-1:t.findIndex(t=>t.selected)-1;// Keep looping until we find a non-disabled tab.
for(;t[(e+t.length)%t.length].disabled;)e--;// Add `tabs.length` to make sure the index is a positive number and get the modulus to wrap around if necessary.
return t[(e+t.length)%t.length]}/**
   * Get the tab that comes after the currently selected one, wrapping around when reaching the last tab.
   * If the currently selected tab is disabled, the method will skip it.
   *
   * @returns {HTMLElement} The next tab.
   */#_(){let t=this.#d(),e=this.activation===p?t.findIndex(t=>t.matches(":focus"))+1:t.findIndex(t=>t.selected)+1;// Keep looping until we find a non-disabled tab.
for(;t[e%t.length].disabled;)e++;return t[e%t.length]}/**
   * Handles key events on the tab group.
   *
   * @param {KeyboardEvent} evt The keydown event.
   */#r=t=>{let e;if(t.target.tagName.toLowerCase()===c// Ignore any key presses that have a modifier.
&&!t.altKey// Don’t handle modifier shortcuts typically used by assistive technology.
){switch(t.code){case m.LEFT:case m.UP:e=this.#f(),this.activation===p?e.focus():this.selectTab(e);break;case m.RIGHT:case m.DOWN:e=this.#_(),this.activation===p?e.focus():this.selectTab(e);break;case m.HOME:e=this.#v(),this.activation===p?e.focus():this.selectTab(e);break;case m.END:e=this.#w(),this.activation===p?e.focus():this.selectTab(e);break;case m.ENTER:case m.SPACE:e=t.target,this.selectTab(e);break;default:// Any other key press is ignored and passed back to the browser.
return}// The browser might have some native functionality bound to the arrow keys, home or end.
// `preventDefault()` is called to prevent the browser from taking any actions.
t.preventDefault()}};/**
   * Handles click events on the tab group.
   *
   * @param {MouseEvent} evt The click event.
   */#l=t=>{let e=t.target.closest(c);this.selectTab(e)};/**
   * Handles the scroll button click event.
   *
   * @param {MouseEvent} evt The click event.
   */#i=t=>{let e=t.target.closest(".tab-group__scroll-button");if(!e)return;let s=this.shadowRoot.querySelector(".tab-group__tabs"),o=e.classList.contains("tab-group__scroll-button--start")?b:"end";s.scrollBy({left:o===b?-this.scrollDistance:this.scrollDistance})};/**
   * Handles the tab close button click event.
   *
   * @param {MouseEvent} evt The click event.
   */#n=t=>{let e=t.target,s=this.#g(e);e&&s.tagName.toLowerCase()===d&&(s.remove(),e.remove())};/**
   * Handles the slotchange event on the tab group.
   * This is called every time the user adds or removes a tab or panel.
   */#a=()=>{this.#s=!1,this.#u(),this.#c()};/**
   * Marks all tabs as unselected and hides all the panels.
   * This is called every time the user selects a new tab.
   */#y(){let t=this.#d(),e=this.#m();t.forEach(t=>t.selected=!1),this.#E(()=>e.forEach(t=>t.hidden=!0))}/**
   * Marks the given tab as selected.
   * Additionally, it unhides the panel corresponding to the given tab.
   *
   * @param {HTMLElement} newTab
   */#p(t){// If the tab doesn’t exist or is already selected, abort.
if(// Unselect all tabs and hide all panels.
this.#y(),!t||t.selected)return;// Get the panel that the `newTab` is associated with.
let e=this.#g(t);e&&(t.selected=!0,this.#E(()=>e.hidden=!1),this.#s=!0)}/**
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
   */#c(){let t=this.shadowRoot.querySelector(".tab-group__nav"),e=Array.from(this.shadowRoot.querySelectorAll(".tab-group__scroll-button"));this.noScrollControls||this.placement===b||"end"===this.placement?(this.#h(),e.forEach(t=>t.hidden=!0),t.classList.remove("tab-group__nav--scrollable")):(this.#b(),e.forEach(t=>t.hidden=!1))}/**
   * Starts the panel transition.
   * If the panel transition is enabled, the callback is called when the transition is complete.
   *
   * @param {function} [callback = () => {}]
   */#E(t=()=>{}){let e="function"==typeof document.startViewTransition&&window.matchMedia("(prefers-reduced-motion: no-preference)").matches&&this.#s&&this.panelTransition;e?document.startViewTransition(t):t()}/**
   * https://developers.google.com/web/fundamentals/web-components/best-practices#lazy-properties
   * This is to safe guard against cases where, for instance, a framework may have added the element to the page and set a
   * value on one of its properties, but lazy loaded its definition. Without this guard, the upgraded element would miss that
   * property and the instance property would prevent the class property setter from ever being called.
   */#t(t){if(Object.prototype.hasOwnProperty.call(this,t)){let e=this[t];delete this[t],this[t]=e}}/**
   * Selects the tab at the given index.
   * If the tab at the given index is disabled or already selected, this method does nothing.
   *
   * @param {Number} index The index of the tab to be selected.
   */selectTabByIndex(t){let e=this.#d(),s=e[t];this.selectTab(s)}/**
   * Selects the given tab.
   * If the given tab is disabled or already selected, this method does nothing.
   *
   * @param {HTMLElement} tab The tab to be selected.
   */selectTab(t){!t||t.disabled||t.selected||(this.#p(t),// Queue a microtask to ensure that the tab is focused on the next tick.
setTimeout(()=>t.focus(),0),this.dispatchEvent(new CustomEvent(`${c}-select`,{bubbles:!0,composed:!0,detail:{tabId:t.id}})))}}window.customElements&&!window.customElements.get(n)&&window.customElements.define(n,v);//# sourceMappingURL=a-tab-group.js.map

//# sourceMappingURL=a-tab-group.js.map
