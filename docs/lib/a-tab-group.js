// @ts-check
/** @typedef {import('./a-tab').Tab} Tab *//** @typedef {import('./a-tab-panel').TabPanel} TabPanel */// @ts-check
// @ts-check
/**
 * Generates a unique id of the form `${prefix}-${randomString}-${suffix}`.
 *
 * @param {string} [prefix=''] - The prefix to use for the id.
 * @param {string} [suffix=''] - The suffix to use for the id.
 * @returns {string} - The unique id.
 */let t=(t="",e="")=>{let s=Math.random().toString(36).substring(2,8);// Pseudo-random string of six alphanumeric characters.
return`${"string"==typeof t&&""!==t?t+"-":""}${s}${"string"==typeof e&&""!==e?"-"+e:""}`},e="a-tab",s=document.createElement("template"),o=0;s.innerHTML=/* html */`
  <style>
    :host {
      display: inline-block;
      contain: content;
    }

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
 * @summary
 * This is a tab for a <a-tab-group> tab panel.
 * `<a-tab>` should always be used with `role=heading` in the markup so that the semantics remain useable when JavaScript is failing.
 * @extends HTMLElement
 *
 * @tagname a-tab
 *
 * @property {boolean} selected - Whether the tab is selected.
 * @property {boolean} disabled - Whether the tab is disabled.
 * @property {boolean} closable - Whether the tab is closable.
 *
 * @attribute selected - Reflects the selected property.
 * @attribute disabled - Reflects the disabled property.
 * @attribute closable - Reflects the closable property.
 *
 * @csspart base - The component's base wrapper.
 * @csspart close-tab - The close button.
 * @csspart close-tab-icon - The close button icon.
 *
 * @slot - The tab's content.
 *
 * @fires a-tab-close - Fires when the tab's close button is clicked.
 */class l extends HTMLElement{constructor(){if(super(),!this.shadowRoot){let t=this.attachShadow({mode:"open"});t.appendChild(s.content.cloneNode(!0))}}static get observedAttributes(){return["selected","disabled","closable"]}/**
   * Lifecycle method that is called when attributes are changed, added, removed, or replaced.
   *
   * @param {string} name - The name of the attribute.
   * @param {string} oldValue - The old value of the attribute.
   * @param {string} newValue - The new value of the attribute.
   */attributeChangedCallback(t,e,s){if("selected"===t&&e!==s&&this.setAttribute("aria-selected",this.selected.toString()),"disabled"===t&&e!==s&&(this.setAttribute("aria-disabled",this.disabled.toString()),this.setAttribute("tabindex",this.disabled?"-1":"0")),"closable"===t&&e!==s){if(this.closable){let t=document.createElement("span");t.className="tab__close",t.setAttribute("part","close-tab"),t.innerHTML=/* html */'<svg part="close-tab-icon" xmlns="http://www.w3.org/2000/svg" width="0.875em" height="0.875em" fill="currentColor" viewBox="0 0 16 16"><path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z"/></svg>',this.shadowRoot?.querySelector(".tab")?.appendChild(t),t.addEventListener("click",this.#t)}else{let t=this.shadowRoot?.querySelector(".tab__close");t?.removeEventListener("click",this.#t),t?.remove()}}}/**
   * Lifecycle method that is called when the element is first connected to the DOM.
   */connectedCallback(){this.#e("selected"),this.#e("disabled"),this.#e("closable"),this.id||(this.id=t("tab",(++o).toString())),this.setAttribute("slot","tab"),this.setAttribute("role","tab"),this.setAttribute("aria-selected","false"),this.setAttribute("tabindex",this.disabled?"-1":"0")}/**
   * Lifecycle method that is called when the element is disconnected from the DOM.
   */disconnectedCallback(){let t=this.shadowRoot?.querySelector(".tab__close");t?.removeEventListener("click",this.#t)}/**
   * @type {boolean} - Whether the tab is selected.
   * @default false
   * @attribute selected - Reflects the selected property.
   */get selected(){return this.hasAttribute("selected")}set selected(t){t?this.setAttribute("selected",""):this.removeAttribute("selected")}/**
   * @type {boolean} - Whether the tab is disabled.
   * @default false
   * @attribute disabled - Reflects the disabled property.
   */get disabled(){return this.hasAttribute("disabled")}set disabled(t){t?this.setAttribute("disabled",""):this.removeAttribute("disabled")}/**
   * @type {boolean} - Whether the tab is closable.
   * @default false
   * @attribute closable - Reflects the closable property.
   */get closable(){return this.hasAttribute("closable")}set closable(t){t?this.setAttribute("closable",""):this.removeAttribute("closable")}/**
   * Handles the click event on the close button.
   *
   * @param {Event} evt The click event.
   */#t=t=>{t.stopPropagation(),this.dispatchEvent(new CustomEvent(`${e}-close`,{bubbles:!0,composed:!0,detail:{tabId:this.id}}))};/**
   * This is to safe guard against cases where, for instance, a framework may have added the element to the page and set a
   * value on one of its properties, but lazy loaded its definition. Without this guard, the upgraded element would miss that
   * property and the instance property would prevent the class property setter from ever being called.
   *
   * https://developers.google.com/web/fundamentals/web-components/best-practices#lazy-properties
   *
   * @param {'selected' | 'disabled' | 'closable'} prop - The property to upgrade.
   */#e(t){if(Object.prototype.hasOwnProperty.call(this,t)){let e=this[t];delete this[t],this[t]=e}}static defineCustomElement(t=e){"undefined"==typeof window||window.customElements.get(t)||window.customElements.define(t,l)}}l.defineCustomElement();// @ts-check
let a="a-tab-panel",r=document.createElement("template"),i=0;r.innerHTML=/* html */`
  <style>
    :host {
      display: block;
      contain: content;
    }
  </style>

  <div part="base" class="tab-panel">
    <slot></slot>
  </div>
`;/**
 * @summary This is a panel for a `<a-tab-group>` tab panel.
 * @extends HTMLElement
 *
 * @tagname a-tab-panel
 *
 * @csspart base - The component's base wrapper.
 *
 * @slot - The content of the tab panel.
 */class n extends HTMLElement{constructor(){if(super(),!this.shadowRoot){let t=this.attachShadow({mode:"open"});t.appendChild(r.content.cloneNode(!0))}}/**
   * Lifecycle method that is called when the element is first connected to the DOM.
   */connectedCallback(){this.setAttribute("slot","panel"),this.setAttribute("role","tabpanel"),this.id||(this.id=t("panel",(++i).toString()))}static defineCustomElement(t=a){"undefined"==typeof window||window.customElements.get(t)||window.customElements.define(t,n)}}n.defineCustomElement();let c="a-tab-group",d="a-tab",h="a-tab-panel",b="bottom",u="start",p="auto",g="manual",m={DOWN:"ArrowDown",LEFT:"ArrowLeft",RIGHT:"ArrowRight",UP:"ArrowUp",HOME:"Home",END:"End",ENTER:"Enter",SPACE:"Space"},v=document.createElement("template");v.innerHTML=/* html */`
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
      contain: content;
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
    :host([placement="${b}"]) .tab-group {
      flex-direction: column;
    }

    :host([placement="${b}"]) .tab-group__nav {
      order: 1;
    }

    /* placement="start" */
    :host([placement="${u}"]) .tab-group {
      flex-direction: row;
    }

    :host([placement="${u}"]) .tab-group__tabs {
      flex-direction: column;
      align-items: flex-start;
    }

    :host([placement="${u}"]) .tab-group__panels {
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
`;/**
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
 */class f extends HTMLElement{/** @type {boolean} */#s=!1;/** @type {ResizeObserver | null} */#o=null;constructor(){if(super(),!this.shadowRoot){let t=this.attachShadow({mode:"open"});t.appendChild(v.content.cloneNode(!0))}}static get observedAttributes(){return["placement","no-scroll-controls"]}/**
   * Lifecycle method that is called when attributes are changed, added, removed, or replaced.
   *
   * @param {string} name - The name of the attribute.
   * @param {string} oldValue - The old value of the attribute.
   * @param {string} newValue - The new value of the attribute.
   */attributeChangedCallback(t,e,s){"placement"===t&&e!==s&&this.#l(),"no-scroll-controls"===t&&e!==s&&this.#l()}/**
   * @type {string | null} - The placement of the tabs.
   * @default 'top'
   * @attribute placement - Reflects the placement property.
   */get placement(){return this.getAttribute("placement")}set placement(t){null!=t&&this.setAttribute("placement",t)}/**
   * @type {boolean} - Whether or not the scroll controls are enabled.
   * @default false
   * @attribute no-scroll-controls - Reflects the noScrollControls property.
   */get noScrollControls(){return this.hasAttribute("no-scroll-controls")}set noScrollControls(t){t?this.setAttribute("no-scroll-controls",""):this.removeAttribute("no-scroll-controls")}/**
   * @type {number} - The distance in pixels that the tabs will scroll when the scroll buttons are clicked.
   * @default 200
   * @attribute scroll-distance - Reflects the scrollDistance property.
   */get scrollDistance(){let t=Number(this.getAttribute("scroll-distance"));return Math.abs(t)||200}set scrollDistance(t){this.setAttribute("scroll-distance",Math.abs(t).toString()||"200")}/**
   * @type {string} - The activation mode of the tabs.
   * @default 'auto'
   * @attribute activation - Reflects the activation property.
   */get activation(){return this.getAttribute("activation")||p}set activation(t){this.setAttribute("activation",t||p)}/**
   * @type {boolean} - Whether or not the panel transition is enabled.
   * @default false
   * @attribute panel-transition - Reflects the panelTransition property.
   */get panelTransition(){return this.hasAttribute("panel-transition")}set panelTransition(t){t?this.setAttribute("panel-transition",""):this.removeAttribute("panel-transition")}/**
   * Lifecycle method that is called when the element is first connected to the DOM.
   */connectedCallback(){this.#e("placement"),this.#e("noScrollControls"),this.#e("scrollDistance"),this.#e("activation"),this.#e("panelTransition");let t=this.shadowRoot?.querySelector("slot[name=tab]"),e=this.shadowRoot?.querySelector("slot[name=panel]"),s=this.shadowRoot?.querySelector(".tab-group__tabs"),o=this.shadowRoot?.querySelector(".tab-group__nav"),l=Array.from(this.shadowRoot?.querySelectorAll(".tab-group__scroll-button")||[]);t?.addEventListener("slotchange",this.#a),e?.addEventListener("slotchange",this.#a),s?.addEventListener("click",this.#r),s?.addEventListener("keydown",this.#i),l.forEach(t=>t.addEventListener("click",this.#n)),this.addEventListener(`${d}-close`,this.#c),"ResizeObserver"in window&&(this.#o=new ResizeObserver(t=>{let e=t?.[0],s=e?.target,a=s?.scrollWidth>(e?.borderBoxSize?.[0]?.inlineSize||s?.clientWidth);l.forEach(t=>t.hidden=!a),o?.part.toggle("nav--scrollable",a),o?.classList.toggle("tab-group__nav--scrollable",a)})),this.#l(),this.hidden=0===this.#d().length,this.placement=this.placement||"top"}/**
   * Lifecycle method that is called when the element is disconnected from the DOM.
   */disconnectedCallback(){let t=this.shadowRoot?.querySelector("slot[name=tab]"),e=this.shadowRoot?.querySelector("slot[name=panel]"),s=this.shadowRoot?.querySelector(".tab-group__tabs"),o=Array.from(this.shadowRoot?.querySelectorAll(".tab-group__scroll-button")||[]);t?.removeEventListener("slotchange",this.#a),e?.removeEventListener("slotchange",this.#a),s?.removeEventListener("click",this.#r),s?.removeEventListener("keydown",this.#i),o.forEach(t=>t.removeEventListener("click",this.#n)),this.removeEventListener(`${d}-close`,this.#c),this.#h()}#b(){if(!this.#o)return;let t=this.shadowRoot?.querySelector(".tab-group__tabs");t&&(this.#o.unobserve(t),this.#o.observe(t))}#h(){this.#o&&this.#o.disconnect()}/**
   * Links up tabs with their adjacent panels using `aria-controls` and `aria-labelledby`.
   * This method makes sure only one tab is selected at a time.
   */#u(){let t=this.#d();// Hide the tab group if there are no tabs.
this.hidden=0===t.length,// Give each panel a `aria-labelledby` attribute that refers to the tab that controls it.
t.forEach(t=>{let e=t.nextElementSibling;if(!e||e.tagName.toLowerCase()!==h)return console.error(`Tab #${t.id} is not a sibling of a <a-tab-panel>`);t.setAttribute("aria-controls",e.id),e.setAttribute("aria-labelledby",t.id)});// Get the selected non-disabled tab, or the first non-disabled tab.
let e=t.find(t=>t.selected&&!t.disabled)||t.find(t=>!t.disabled);e&&this.#p(e)}/**
   * Get all panels in the tab group.
   *
   * @returns {TabPanel[]} All the panels in the tab group.
   */#g(){return Array.from(this.querySelectorAll(h))}/**
   * Get all tabs in the tab group.
   *
   * @returns {Tab[]} All the tabs in the tab group.
   */#d(){return Array.from(this.querySelectorAll(d))}/**
   * Get the panel for the given tab.
   *
   * @param {Tab} tab The tab whose panel is to be returned.
   * @returns {TabPanel | null} The panel controlled by the given tab.
   */#m(t){let e=t.getAttribute("aria-controls");return this.querySelector(`#${e}`)}/**
   * Get the first non-disabled tab in the tab group.
   *
   * @returns {Tab | undefined} The first tab in the tab group.
   */#v(){let t=this.#d();return t.find(t=>!t.disabled)}/**
   * Get the last non-disabled tab in the tab group.
   *
   * @returns {Tab | undefined} The last tab in the tab group.
   */#f(){let t=this.#d();for(let e=t.length-1;e>=0;e--)if(!t[e].disabled)return t[e]}/**
   * Get the tab that comes before the currently selected one, wrapping around when reaching the first tab.
   * If the currently selected tab is disabled, the method will skip it.
   *
   * @returns {Tab} The previous tab.
   */#w(){let t=this.#d(),e=this.activation===g?t.findIndex(t=>t.matches(":focus"))-1:t.findIndex(t=>t.selected)-1;// Keep looping until we find a non-disabled tab.
for(;t[(e+t.length)%t.length].disabled;)e--;// Add `tabs.length` to make sure the index is a positive number and get the modulus to wrap around if necessary.
return t[(e+t.length)%t.length]}/**
   * Get the tab that comes after the currently selected one, wrapping around when reaching the last tab.
   * If the currently selected tab is disabled, the method will skip it.
   *
   * @returns {Tab} The next tab.
   */#_(){let t=this.#d(),e=this.activation===g?t.findIndex(t=>t.matches(":focus"))+1:t.findIndex(t=>t.selected)+1;// Keep looping until we find a non-disabled tab.
for(;t[e%t.length].disabled;)e++;return t[e%t.length]}/**
   * Handles key events on the tab group.
   *
   * @param {any} evt The keydown event.
   */#i=t=>{let e;if(t.target.tagName.toLowerCase()===d// Ignore any key presses that have a modifier.
&&!t.altKey// Don’t handle modifier shortcuts typically used by assistive technology.
){switch(t.code){case m.LEFT:case m.UP:(e=this.#w())&&(this.activation===g?e.focus():this.selectTab(e));break;case m.RIGHT:case m.DOWN:(e=this.#_())&&(this.activation===g?e.focus():this.selectTab(e));break;case m.HOME:(e=this.#v())&&(this.activation===g?e.focus():this.selectTab(e));break;case m.END:(e=this.#f())&&(this.activation===g?e.focus():this.selectTab(e));break;case m.ENTER:case m.SPACE:(e=t.target)&&this.selectTab(e);break;default:// Any other key press is ignored and passed back to the browser.
return}// The browser might have some native functionality bound to the arrow keys, home or end.
// `preventDefault()` is called to prevent the browser from taking any actions.
t.preventDefault()}};/**
   * Handles click events on the tab group.
   *
   * @param {any} evt The click event.
   */#r=t=>{let e=t.target.closest(d);e&&this.selectTab(e)};/**
   * Handles the scroll button click event.
   *
   * @param {any} evt The click event.
   */#n=t=>{let e=t.target.closest(".tab-group__scroll-button");if(!e)return;let s=this.shadowRoot?.querySelector(".tab-group__tabs");if(!s)return;let o=e.classList.contains("tab-group__scroll-button--start")?u:"end";s.scrollBy({left:o===u?-this.scrollDistance:this.scrollDistance})};/**
   * Handles the tab close button click event.
   *
   * @param {any} evt The click event.
   */#c=t=>{let e=t.target,s=this.#m(e);e&&e.remove(),s&&s.tagName.toLowerCase()===h&&s.remove()};/**
   * Handles the slotchange event on the tab group.
   * This is called every time the user adds or removes a tab or panel.
   */#a=()=>{this.#s=!1,this.#u(),this.#l()};/**
   * Marks all tabs as unselected and hides all the panels.
   * This is called every time the user selects a new tab.
   */#y(){let t=this.#d(),e=this.#g();t.forEach(t=>t.selected=!1),this.#E(()=>e.forEach(t=>t.hidden=!0))}/**
   * Marks the given tab as selected.
   * Additionally, it unhides the panel corresponding to the given tab.
   *
   * @param {Tab} newTab - The tab to be selected.
   */#p(t){// If the tab doesn’t exist or is already selected, abort.
if(// Unselect all tabs and hide all panels.
this.#y(),!t||t.selected)return;// Get the panel that the `newTab` is associated with.
let e=this.#m(t);e&&(t.selected=!0,this.#E(()=>e.hidden=!1),this.#s=!0)}/**
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
   */#l(){let t=this.shadowRoot?.querySelector(".tab-group__nav"),e=Array.from(this.shadowRoot?.querySelectorAll(".tab-group__scroll-button")||[]);this.noScrollControls||this.placement===u||"end"===this.placement?(this.#h(),e.forEach(t=>t.hidden=!0),t?.classList.remove("tab-group__nav--scrollable")):(this.#b(),e.forEach(t=>t.hidden=!1))}/**
   * Starts the panel transition.
   * If the panel transition is enabled, the callback is called when the transition is complete.
   *
   * @param {function} [callback = () => {}]
   */#E(t=()=>{}){// @ts-ignore
let e="function"==typeof document.startViewTransition&&window.matchMedia("(prefers-reduced-motion: no-preference)").matches&&this.#s&&this.panelTransition;// @ts-ignore
e?document.startViewTransition(t):t()}/**
   * This is to safe guard against cases where, for instance, a framework may have added the element to the page and set a
   * value on one of its properties, but lazy loaded its definition. Without this guard, the upgraded element would miss that
   * property and the instance property would prevent the class property setter from ever being called.
   *
   * https://developers.google.com/web/fundamentals/web-components/best-practices#lazy-properties
   *
   * @param {'placement' | 'noScrollControls' | 'scrollDistance' | 'activation' | 'panelTransition'} prop - The property to upgrade.
   */#e(t){if(Object.prototype.hasOwnProperty.call(this,t)){let e=this[t];delete this[t],this[t]=e}}/**
   * Selects the tab at the given index.
   * If the tab at the given index is disabled or already selected, this method does nothing.
   *
   * @param {Number} index The index of the tab to be selected.
   */selectTabByIndex(t){let e=this.#d(),s=e[t];this.selectTab(s)}/**
   * Selects the given tab.
   * If the given tab is disabled or already selected, this method does nothing.
   *
   * @param {Tab} tab The tab to be selected.
   */selectTab(t){!t||t.disabled||t.selected||(this.#p(t),// Queue a microtask to ensure that the tab is focused on the next tick.
setTimeout(()=>t.focus(),0),this.dispatchEvent(new CustomEvent(`${d}-select`,{bubbles:!0,composed:!0,detail:{tabId:t.id}})))}static defineCustomElement(t=c){"undefined"==typeof window||window.customElements.get(t)||window.customElements.define(t,f)}}f.defineCustomElement();export{f as TabGroup};
