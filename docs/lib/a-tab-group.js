let t=(t="",e="")=>{let s=Math.random().toString(36).substring(2,8);return`${"string"==typeof t&&""!==t?t+"-":""}${s}${"string"==typeof e&&""!==e?"-"+e:""}`},e=(t,e)=>{if(Object.prototype.hasOwnProperty.call(e,t)){let s=e[t];delete e[t],e[t]=s}},s=0,o=`
  :host {
    box-sizing: border-box;
    display: inline-block;
    contain: content;
  }

  :host([hidden]),
  [hidden] {
    display: none !important;
  }

  :host *,
  :host *::before,
  :host *::after {
    box-sizing: inherit;
  }

  .tab {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    width: 100%;
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
`,a=document.createElement("template");a.innerHTML=`
  <style>
    ${o}
  </style>

  <div part="base" class="tab">
    <slot></slot>
  </div>
`;class l extends HTMLElement{constructor(){super(),this.shadowRoot||this.attachShadow({mode:"open"}).appendChild(a.content.cloneNode(!0))}static get observedAttributes(){return["selected","disabled","closable"]}attributeChangedCallback(t,e,s){if("selected"===t&&e!==s&&this.setAttribute("aria-selected",this.selected.toString()),"disabled"===t&&e!==s&&(this.setAttribute("aria-disabled",this.disabled.toString()),this.setAttribute("tabindex",this.disabled?"-1":"0")),"closable"===t&&e!==s){if(this.closable){let t=document.createElement("span");t.className="tab__close",t.setAttribute("part","close-tab"),t.innerHTML='<svg part="close-tab-icon" xmlns="http://www.w3.org/2000/svg" width="0.875em" height="0.875em" fill="currentColor" viewBox="0 0 16 16"><path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z"/></svg>',this.shadowRoot?.querySelector(".tab")?.appendChild(t),t.addEventListener("click",this.#t)}else{let t=this.shadowRoot?.querySelector(".tab__close");t?.removeEventListener("click",this.#t),t?.remove()}}}connectedCallback(){this.#e("selected"),this.#e("disabled"),this.#e("closable"),this.id||(this.id=t("tab",(++s).toString())),this.setAttribute("slot","tab"),this.setAttribute("role","tab"),this.setAttribute("aria-selected","false"),this.setAttribute("tabindex",this.disabled?"-1":"0")}disconnectedCallback(){let t=this.shadowRoot?.querySelector(".tab__close");t?.removeEventListener("click",this.#t)}get selected(){return this.hasAttribute("selected")}set selected(t){this.toggleAttribute("selected",!!t)}get disabled(){return this.hasAttribute("disabled")}set disabled(t){this.toggleAttribute("disabled",!!t)}get closable(){return this.hasAttribute("closable")}set closable(t){this.toggleAttribute("closable",!!t)}#t=t=>{t.stopPropagation(),this.dispatchEvent(new CustomEvent("a-tab-close",{bubbles:!0,composed:!0,detail:{tabId:this.id}}))};#e(t){return e(t,this)}static defineCustomElement(t="a-tab"){"undefined"==typeof window||window.customElements.get(t)||window.customElements.define(t,l)}}l.defineCustomElement();let i=0,r=`
  :host {
    box-sizing: border-box;
    display: block;
    contain: content;
  }

  :host([hidden]),
  [hidden] {
    display: none !important;
  }

  :host *,
  :host *::before,
  :host *::after {
    box-sizing: inherit;
  }
`,n=document.createElement("template");n.innerHTML=`
  <style>
    ${r}
  </style>

  <div part="base" class="tab-panel">
    <slot></slot>
  </div>
`;class c extends HTMLElement{constructor(){super(),this.shadowRoot||this.attachShadow({mode:"open"}).appendChild(n.content.cloneNode(!0))}connectedCallback(){this.setAttribute("slot","panel"),this.setAttribute("role","tabpanel"),this.setAttribute("hidden",""),this.id||(this.id=t("panel",(++i).toString()))}static defineCustomElement(t="a-tab-panel"){"undefined"==typeof window||window.customElements.get(t)||window.customElements.define(t,c)}}c.defineCustomElement();let d={TOP:"top",BOTTOM:"bottom",START:"start",END:"end"},h=Object.entries(d).map(([,t])=>t),b={AUTO:"auto",MANUAL:"manual"},u={DOWN:"ArrowDown",LEFT:"ArrowLeft",RIGHT:"ArrowRight",UP:"ArrowUp",HOME:"Home",END:"End",ENTER:"Enter",SPACE:" "},p=`
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
  :host([placement="${d.BOTTOM}"]) .tab-group {
    flex-direction: column;
  }

  :host([placement="${d.BOTTOM}"]) .tab-group__nav {
    order: 1;
  }

  /* placement="start" */
  :host([placement="${d.START}"]) .tab-group {
    flex-direction: row;
  }

  :host([placement="${d.START}"]) .tab-group__tabs {
    flex-direction: column;
    align-items: flex-start;
  }

  :host([placement="${d.START}"]) .tab-group__panels {
    flex: 1;
    padding: 0 1rem;
  }

  /* placement="end" */
  :host([placement="${d.END}"]) .tab-group {
    flex-direction: row;
  }

  :host([placement="${d.END}"]) .tab-group__nav {
    order: 1;
  }

  :host([placement="${d.END}"]) .tab-group__tabs {
    flex-direction: column;
    align-items: flex-start;
  }

  :host([placement="${d.END}"]) .tab-group__panels {
    flex: 1;
    padding: 0 1rem;
  }
`,g=document.createElement("template");g.innerHTML=`
  <style>
    ${p}
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
`;class m extends HTMLElement{#s=null;#o=null;#a=!1;constructor(){super(),this.shadowRoot||this.attachShadow({mode:"open"}).appendChild(g.content.cloneNode(!0))}static get observedAttributes(){return["placement","no-scroll-controls"]}attributeChangedCallback(t,e,s){"placement"===t&&e!==s&&this.#l(),"no-scroll-controls"===t&&e!==s&&this.#l()}get placement(){return this.getAttribute("placement")}set placement(t){null!=t&&this.setAttribute("placement",t)}get noScrollControls(){return this.hasAttribute("no-scroll-controls")}set noScrollControls(t){this.toggleAttribute("no-scroll-controls",!!t)}get scrollDistance(){return Math.abs(Number(this.getAttribute("scroll-distance")))||200}set scrollDistance(t){this.setAttribute("scroll-distance",Math.abs(t).toString()||"200")}get activation(){return this.getAttribute("activation")||b.AUTO}set activation(t){this.setAttribute("activation",t||b.AUTO)}connectedCallback(){this.#e("placement"),this.#e("noScrollControls"),this.#e("scrollDistance"),this.#e("activation");let t=this.shadowRoot?.querySelector("slot[name=tab]"),e=this.shadowRoot?.querySelector("slot[name=panel]"),s=this.shadowRoot?.querySelector(".tab-group__tabs"),o=this.shadowRoot?.querySelector(".tab-group__nav"),a=Array.from(this.shadowRoot?.querySelectorAll(".tab-group__scroll-button")||[]);t?.addEventListener("slotchange",this.#i),e?.addEventListener("slotchange",this.#i),s?.addEventListener("click",this.#r),s?.addEventListener("keydown",this.#n),a.forEach(t=>t.addEventListener("click",this.#c)),this.addEventListener("a-tab-close",this.#d),"ResizeObserver"in window&&(this.#s=new ResizeObserver(t=>{this.#o=window.requestAnimationFrame(()=>{let e=t?.[0],s=e?.target,l=s?.scrollWidth>s?.clientWidth;a.forEach(t=>t.toggleAttribute("hidden",!l)),o?.part.toggle("nav--has-scroll-controls",l),o?.classList.toggle("tab-group__nav--has-scroll-controls",l)})})),this.#h(),this.#l(),this.placement=h.includes(this.placement||"")?this.placement:d.TOP}disconnectedCallback(){let t=this.shadowRoot?.querySelector("slot[name=tab]"),e=this.shadowRoot?.querySelector("slot[name=panel]"),s=this.shadowRoot?.querySelector(".tab-group__tabs"),o=Array.from(this.shadowRoot?.querySelectorAll(".tab-group__scroll-button")||[]);t?.removeEventListener("slotchange",this.#i),e?.removeEventListener("slotchange",this.#i),s?.removeEventListener("click",this.#r),s?.removeEventListener("keydown",this.#n),o.forEach(t=>t.removeEventListener("click",this.#c)),this.removeEventListener("a-tab-close",this.#d),this.#b()}#u(){if(!this.#s)return;let t=this.shadowRoot?.querySelector(".tab-group__tabs");t&&(this.#s.unobserve(t),this.#s.observe(t))}#b(){this.#s&&(this.#s.disconnect(),null!==this.#o&&(window.cancelAnimationFrame(this.#o),this.#o=null))}#p(){return getComputedStyle(this).direction}#h(){this.hidden=0===this.#g().length}#m(){let t=this.#g();this.#h(),t.forEach(t=>{let e=t.nextElementSibling;if(!e||"a-tab-panel"!==e.tagName.toLowerCase())return console.error(`Tab #${t.id} is not a sibling of a <a-tab-panel>`);t.setAttribute("aria-controls",e.id),e.setAttribute("aria-labelledby",t.id)})}#v(){return Array.from(this.querySelectorAll("a-tab-panel"))}#g(){return Array.from(this.querySelectorAll("a-tab"))}#f(t){let e=t.getAttribute("aria-controls");return this.querySelector(`#${e}`)}#w(){return this.#g().find(t=>!t.disabled)}#T(){let t=this.#g();for(let e=t.length-1;e>=0;e--)if(!t[e].disabled)return t[e]}#y(){let t=this.#g(),e=this.activation===b.MANUAL?t.findIndex(t=>t.matches(":focus"))-1:t.findIndex(t=>t.selected)-1;for(;t[(e+t.length)%t.length].disabled;)e--;return t[(e+t.length)%t.length]}#_(){let t=this.#g(),e=this.activation===b.MANUAL?t.findIndex(t=>t.matches(":focus"))+1:t.findIndex(t=>t.selected)+1;for(;t[e%t.length].disabled;)e++;return t[e%t.length]}#A(){let t=this.#g(),e=this.#v();t.forEach(t=>t.selected=!1),e.forEach(t=>t.hidden=!0)}#l(){let t=this.shadowRoot?.querySelector(".tab-group__nav"),e=Array.from(this.shadowRoot?.querySelectorAll(".tab-group__scroll-button")||[]);this.noScrollControls||this.placement===d.START||this.placement===d.END?(this.#b(),e.forEach(t=>t.hidden=!0),t?.part.remove("nav--has-scroll-controls"),t?.classList.remove("tab-group__nav--has-scroll-controls")):(this.#u(),e.forEach(t=>t.hidden=!1))}#E(){let t=this.#g(),e=t.find(t=>t.selected&&!t.disabled)||t.find(t=>!t.disabled);e&&(this.#a&&!e.selected&&this.dispatchEvent(new CustomEvent("a-tab-show",{bubbles:!0,composed:!0,detail:{tabId:e.id}})),this.#C(e))}#C(t){this.#A(),t&&(t.selected=!0);let e=this.#f(t);e&&(e.hidden=!1)}#i=t=>{this.#m(),this.#l(),this.#E(),"tab"===t.target.name&&(this.#a=!0)};#n=t=>{if("a-tab"!==t.target.tagName.toLowerCase()||t.altKey)return;let e=h.includes(this.placement||"")?this.placement:d.TOP,s=[d.TOP,d.BOTTOM].includes(e||"")?"horizontal":"vertical",o=this.#p(),a=null;switch(t.key){case u.LEFT:"horizontal"===s&&(a="ltr"===o?this.#y():this.#_())&&(this.activation===b.MANUAL?a.focus():this.selectTab(a));break;case u.RIGHT:"horizontal"===s&&(a="ltr"===o?this.#_():this.#y())&&(this.activation===b.MANUAL?a.focus():this.selectTab(a));break;case u.UP:"vertical"===s&&(a=this.#y())&&(this.activation===b.MANUAL?a.focus():this.selectTab(a));break;case u.DOWN:"vertical"===s&&(a=this.#_())&&(this.activation===b.MANUAL?a.focus():this.selectTab(a));break;case u.HOME:(a=this.#w())&&(this.activation===b.MANUAL?a.focus():this.selectTab(a));break;case u.END:(a=this.#T())&&(this.activation===b.MANUAL?a.focus():this.selectTab(a));break;case u.ENTER:case u.SPACE:(a=t.target)&&this.selectTab(a);break;default:return}t.preventDefault()};#r=t=>{let e=t.target.closest("a-tab");e&&this.selectTab(e)};#c=t=>{let e=t.target.closest(".tab-group__scroll-button"),s=this.shadowRoot?.querySelector(".tab-group__tabs");if(!e||!s)return;let o=e.classList.contains("tab-group__scroll-button--start")?-1:1,a=s.scrollLeft;s.scrollTo({left:a+o*this.scrollDistance})};#d=t=>{let e=t.target,s=this.#f(e);e&&(e.remove(),e.selected&&this.dispatchEvent(new CustomEvent("a-tab-hide",{bubbles:!0,composed:!0,detail:{tabId:e.id}}))),s&&"a-tab-panel"===s.tagName.toLowerCase()&&s.remove()};#e(t){return e(t,this)}selectTabByIndex(t){let e=this.#g()[t];e&&this.selectTab(e)}selectTabById(t){let e=this.#g().find(e=>e.id===t);e&&this.selectTab(e)}selectTab(t){let e=this.#g().find(t=>t.selected);!t||t.disabled||t.selected||"a-tab"!==t.tagName.toLowerCase()||(this.#C(t),setTimeout(()=>{t.scrollIntoView({inline:"nearest",block:"nearest"}),t.focus()},0),e&&this.dispatchEvent(new CustomEvent("a-tab-hide",{bubbles:!0,composed:!0,detail:{tabId:e.id}})),this.dispatchEvent(new CustomEvent("a-tab-show",{bubbles:!0,composed:!0,detail:{tabId:t.id}})))}static defineCustomElement(t="a-tab-group"){"undefined"==typeof window||window.customElements.get(t)||window.customElements.define(t,m)}}m.defineCustomElement();export{m as TabGroup};
