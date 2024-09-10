/*!
 * @georapbox/a-tab-group
 * A custom element to create a group of tabs and tab panels.
 *
 * @version 2.4.1
 * @homepage https://github.com/georapbox/a-tab-group#readme
 * @author George Raptis <georapbox@gmail.com>
 * @license MIT
 */
var h=(a="",t="")=>{let e=typeof a=="string"&&a!==""?a+"-":"",s=typeof t=="string"&&t!==""?"-"+t:"",i=Math.random().toString(36).substring(2,8);return`${e}${i}${s}`};var b=(a,t)=>{if(Object.prototype.hasOwnProperty.call(t,a)){let e=t[a];delete t[a],t[a]=e}};var E=0,C=`
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
`,w=document.createElement("template");w.innerHTML=`
  <style>
    ${C}
  </style>

  <div part="base" class="tab">
    <slot></slot>
  </div>
`;var u=class a extends HTMLElement{constructor(){super(),this.shadowRoot||this.attachShadow({mode:"open"}).appendChild(w.content.cloneNode(!0))}static get observedAttributes(){return["selected","disabled","closable"]}attributeChangedCallback(t,e,s){if(t==="selected"&&e!==s&&(this.setAttribute("aria-selected",this.selected.toString()),this.setAttribute("tabindex",this.disabled||!this.selected?"-1":"0")),t==="disabled"&&e!==s&&(this.setAttribute("aria-disabled",this.disabled.toString()),this.setAttribute("tabindex",this.disabled||!this.selected?"-1":"0")),t==="closable"&&e!==s)if(this.closable){let i=document.createElement("span");i.className="tab__close",i.setAttribute("part","close-tab"),i.innerHTML='<svg part="close-tab-icon" xmlns="http://www.w3.org/2000/svg" width="0.875em" height="0.875em" fill="currentColor" viewBox="0 0 16 16" aria-hidden="true"><path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z"/></svg>',this.shadowRoot?.querySelector(".tab")?.appendChild(i),i.addEventListener("click",this.#e)}else{let i=this.shadowRoot?.querySelector(".tab__close");i?.removeEventListener("click",this.#e),i?.remove()}}connectedCallback(){this.#s("selected"),this.#s("disabled"),this.#s("closable"),this.id||(this.id=h("tab",(++E).toString())),this.setAttribute("slot","tab"),this.setAttribute("role","tab"),this.setAttribute("aria-selected","false"),this.setAttribute("tabindex",this.disabled||!this.selected?"-1":"0")}disconnectedCallback(){this.shadowRoot?.querySelector(".tab__close")?.removeEventListener("click",this.#e)}get selected(){return this.hasAttribute("selected")}set selected(t){this.toggleAttribute("selected",!!t)}get disabled(){return this.hasAttribute("disabled")}set disabled(t){this.toggleAttribute("disabled",!!t)}get closable(){return this.hasAttribute("closable")}set closable(t){this.toggleAttribute("closable",!!t)}#e=t=>{t.stopPropagation(),this.dispatchEvent(new CustomEvent("a-tab-close",{bubbles:!0,composed:!0,detail:{tabId:this.id}}))};#s(t){return b(t,this)}static defineCustomElement(t="a-tab"){typeof window<"u"&&!window.customElements.get(t)&&window.customElements.define(t,a)}};u.defineCustomElement();var L=0,S=`
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
`,T=document.createElement("template");T.innerHTML=`
  <style>
    ${S}
  </style>

  <div part="base" class="tab-panel">
    <slot></slot>
  </div>
`;var p=class a extends HTMLElement{constructor(){super(),this.shadowRoot||this.attachShadow({mode:"open"}).appendChild(T.content.cloneNode(!0))}connectedCallback(){this.setAttribute("slot","panel"),this.setAttribute("role","tabpanel"),this.setAttribute("hidden",""),this.id||(this.id=h("panel",(++L).toString()))}static defineCustomElement(t="a-tab-panel"){typeof window<"u"&&!window.customElements.get(t)&&window.customElements.define(t,a)}};p.defineCustomElement();var y=200,n={TOP:"top",BOTTOM:"bottom",START:"start",END:"end"},l={LTR:"ltr",RTL:"rtl"},R=Object.entries(n).map(([,a])=>a),r={AUTO:"auto",MANUAL:"manual"},c={DOWN:"ArrowDown",LEFT:"ArrowLeft",RIGHT:"ArrowRight",UP:"ArrowUp",HOME:"Home",END:"End",ENTER:"Enter",SPACE:" "},x=`
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

  :host([dir="${l.RTL}"]) .tab-group__scroll-button--start,
  :host(:dir(${l.RTL})) .tab-group__scroll-button--start {
    right: var(--scroll-button-inline-offset);
    left: auto;
    transform: translateY(-50%) rotate(180deg);
  }

  :host([dir="${l.RTL}"]) .tab-group__scroll-button--end,
  :host(:dir(${l.RTL})) .tab-group__scroll-button--end {
    left: var(--scroll-button-inline-offset);
    right: auto;
    transform: translateY(-50%) rotate(180deg);
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
  :host([placement="${n.TOP}"]) .tab-group {
    flex-direction: column;
  }

  /* placement="bottom" */
  :host([placement="${n.BOTTOM}"]) .tab-group {
    flex-direction: column;
  }

  :host([placement="${n.BOTTOM}"]) .tab-group__nav {
    order: 1;
  }

  /* placement="start" */
  :host([placement="${n.START}"]) .tab-group {
    flex-direction: row;
  }

  :host([placement="${n.START}"]) .tab-group__tabs {
    flex-direction: column;
    align-items: flex-start;
  }

  :host([placement="${n.START}"]) .tab-group__panels {
    flex: 1;
    padding: 0 1rem;
  }

  /* placement="end" */
  :host([placement="${n.END}"]) .tab-group {
    flex-direction: row;
  }

  :host([placement="${n.END}"]) .tab-group__nav {
    order: 1;
  }

  :host([placement="${n.END}"]) .tab-group__tabs {
    flex-direction: column;
    align-items: flex-start;
  }

  :host([placement="${n.END}"]) .tab-group__panels {
    flex: 1;
    padding: 0 1rem;
  }
`,A=document.createElement("template");A.innerHTML=`
  <style>${x}</style>

  <div part="base" class="tab-group">
    <div part="nav" class="tab-group__nav">
      <button type="button" part="scroll-button scroll-button--start" class="tab-group__scroll-button tab-group__scroll-button--start" aria-label="Scroll to start">
        <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" viewBox="0 0 16 16" part="scroll-button-icon">
          <path fill-rule="evenodd" d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"/>
        </svg>
      </button>

      <div part="tabs" class="tab-group__tabs" role="tablist" tabindex="-1">
        <slot name="tab"></slot>
      </div>

      <button type="button" part="scroll-button scroll-button--end" class="tab-group__scroll-button tab-group__scroll-button--end" aria-label="Scroll to end">
        <svg xmlns="http://www.w3.org/2000/svg" width="1rem" height="1em" fill="currentColor" viewBox="0 0 16 16" part="scroll-button-icon">
          <path fill-rule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"/>
        </svg>
      </button>
    </div>

    <div part="panels" class="tab-group__panels">
      <slot name="panel"></slot>
    </div>
  </div>
`;var f=class a extends HTMLElement{#e=null;#s=null;#l=!1;constructor(){super(),this.shadowRoot||this.attachShadow({mode:"open"}).appendChild(A.content.cloneNode(!0))}static get observedAttributes(){return["placement","no-scroll-controls"]}attributeChangedCallback(t,e,s){t==="placement"&&e!==s&&this.#i(),t==="no-scroll-controls"&&e!==s&&this.#i()}get placement(){return this.getAttribute("placement")||n.TOP}set placement(t){t!=null&&this.setAttribute("placement",t)}get noScrollControls(){return this.hasAttribute("no-scroll-controls")}set noScrollControls(t){this.toggleAttribute("no-scroll-controls",!!t)}get scrollDistance(){let t=Number(this.getAttribute("scroll-distance"));return Math.abs(t)||y}set scrollDistance(t){this.setAttribute("scroll-distance",Math.abs(t).toString()||y.toString())}get activation(){return this.getAttribute("activation")||r.AUTO}set activation(t){this.setAttribute("activation",t||r.AUTO)}get noTabCycling(){return this.hasAttribute("no-tab-cycling")}set noTabCycling(t){this.toggleAttribute("no-tab-cycling",!!t)}connectedCallback(){this.#o("placement"),this.#o("noScrollControls"),this.#o("scrollDistance"),this.#o("activation"),this.#o("noTabCycling");let t=this.shadowRoot?.querySelector("slot[name=tab]"),e=this.shadowRoot?.querySelector("slot[name=panel]"),s=this.shadowRoot?.querySelector(".tab-group__tabs"),i=this.shadowRoot?.querySelector(".tab-group__nav"),o=Array.from(this.shadowRoot?.querySelectorAll(".tab-group__scroll-button")||[]);t?.addEventListener("slotchange",this.#n),e?.addEventListener("slotchange",this.#n),s?.addEventListener("click",this.#g),s?.addEventListener("keydown",this.#p),o.forEach(d=>d.addEventListener("click",this.#f)),this.addEventListener("a-tab-close",this.#m),"ResizeObserver"in window&&(this.#e=new ResizeObserver(d=>{this.#s=window.requestAnimationFrame(()=>{let v=d?.[0]?.target,g=v?.scrollWidth>v?.clientWidth;o.forEach(_=>_.toggleAttribute("hidden",!g)),i?.part.toggle("nav--has-scroll-controls",g),i?.classList.toggle("tab-group__nav--has-scroll-controls",g)})})),this.#h(),this.#i()}disconnectedCallback(){let t=this.shadowRoot?.querySelector("slot[name=tab]"),e=this.shadowRoot?.querySelector("slot[name=panel]"),s=this.shadowRoot?.querySelector(".tab-group__tabs"),i=Array.from(this.shadowRoot?.querySelectorAll(".tab-group__scroll-button")||[]);t?.removeEventListener("slotchange",this.#n),e?.removeEventListener("slotchange",this.#n),s?.removeEventListener("click",this.#g),s?.removeEventListener("keydown",this.#p),i.forEach(o=>o.removeEventListener("click",this.#f)),this.removeEventListener("a-tab-close",this.#m),this.#c()}#v(){if(!this.#e)return;let t=this.shadowRoot?.querySelector(".tab-group__tabs");t&&(this.#e.unobserve(t),this.#e.observe(t))}#c(){this.#e&&(this.#e.disconnect(),this.#s!==null&&(window.cancelAnimationFrame(this.#s),this.#s=null))}#d(){return window.CSS.supports("selector(:dir(ltr))")?this.matches(":dir(ltr)")?l.LTR:l.RTL:window.getComputedStyle(this).direction||l.LTR}#h(){this.hidden=this.#t().length===0}#w(){let t=this.#t();this.#h(),t.forEach(e=>{let s=e.nextElementSibling;if(!s||s.tagName.toLowerCase()!=="a-tab-panel")return console.error(`Tab #${e.id} is not a sibling of a <a-tab-panel>`);e.setAttribute("aria-controls",s.id),s.setAttribute("aria-labelledby",e.id)})}#T(){return Array.from(this.querySelectorAll("a-tab-panel"))}#t(){return Array.from(this.querySelectorAll("a-tab"))}#b(t){let e=t.getAttribute("aria-controls");return this.querySelector(`#${e}`)}#y(){return this.#t().find(e=>!e.disabled)||null}#A(){let t=this.#t();for(let e=t.length-1;e>=0;e--)if(!t[e].disabled)return t[e];return null}#a(){let t=this.#t(),e=this.activation===r.MANUAL?t.findIndex(s=>s.matches(":focus"))-1:t.findIndex(s=>s.selected)-1;for(;t[(e+t.length)%t.length].disabled;)e--;return this.noTabCycling&&e<0?null:t[(e+t.length)%t.length]}#r(){let t=this.#t(),e=this.activation===r.MANUAL?t.findIndex(s=>s.matches(":focus"))+1:t.findIndex(s=>s.selected)+1;for(;t[e%t.length].disabled;)e++;return this.noTabCycling&&e>=t.length?null:t[e%t.length]}#_(){let t=this.#t(),e=this.#T();t.forEach(s=>s.selected=!1),e.forEach(s=>s.hidden=!0)}#i(){let t=this.shadowRoot?.querySelector(".tab-group__nav"),e=this.shadowRoot?.querySelector(".tab-group__tabs"),s=Array.from(this.shadowRoot?.querySelectorAll(".tab-group__scroll-button")||[]);this.noScrollControls||this.placement===n.START||this.placement===n.END?(this.#c(),s.forEach(i=>i.hidden=!0),t?.part.remove("nav--has-scroll-controls"),t?.classList.remove("tab-group__nav--has-scroll-controls"),e?.setAttribute("aria-orientation","vertical")):(this.#v(),s.forEach(i=>i.hidden=!1),e?.setAttribute("aria-orientation","horizontal"))}#E(){let t=this.#t(),e=t.find(s=>s.selected&&!s.disabled)||t.find(s=>!s.disabled);e&&(this.#l&&!e.selected&&this.dispatchEvent(new CustomEvent("a-tab-show",{bubbles:!0,composed:!0,detail:{tabId:e.id}})),this.#u(e))}#u(t){this.#_(),t&&(t.selected=!0);let e=this.#b(t);e&&(e.hidden=!1)}#n=t=>{this.#w(),this.#i(),this.#E(),t.target.name==="tab"&&(this.#l=!0)};#p=t=>{if(t.target.tagName.toLowerCase()!=="a-tab"||t.altKey)return;let e=R.includes(this.placement||"")?this.placement:n.TOP,s=[n.TOP,n.BOTTOM].includes(e||"")?"horizontal":"vertical",i=this.#d(),o=null;switch(t.key){case c.LEFT:s==="horizontal"&&(o=i===l.LTR?this.#a():this.#r(),o&&(this.activation===r.MANUAL?o.focus():this.selectTab(o)));break;case c.RIGHT:s==="horizontal"&&(o=i===l.LTR?this.#r():this.#a(),o&&(this.activation===r.MANUAL?o.focus():this.selectTab(o)));break;case c.UP:s==="vertical"&&(o=this.#a(),o&&(this.activation===r.MANUAL?o.focus():this.selectTab(o)));break;case c.DOWN:s==="vertical"&&(o=this.#r(),o&&(this.activation===r.MANUAL?o.focus():this.selectTab(o)));break;case c.HOME:o=this.#y(),o&&(this.activation===r.MANUAL?o.focus():this.selectTab(o));break;case c.END:o=this.#A(),o&&(this.activation===r.MANUAL?o.focus():this.selectTab(o));break;case c.ENTER:case c.SPACE:o=t.target,o&&this.selectTab(o);break;default:return}t.preventDefault()};#g=t=>{let e=t.target.closest("a-tab");e&&this.selectTab(e)};#f=t=>{let e=t.target.closest(".tab-group__scroll-button"),s=this.shadowRoot?.querySelector(".tab-group__tabs");if(!e||!s)return;let i=e.classList.contains("tab-group__scroll-button--start"),o=this.#d()===l.LTR,d=i?o?-1:1:o?1:-1,m=s.scrollLeft;s.scrollTo({left:m+d*this.scrollDistance})};#m=t=>{let e=t.target,s=this.#b(e);e&&(e.remove(),e.selected&&this.dispatchEvent(new CustomEvent("a-tab-hide",{bubbles:!0,composed:!0,detail:{tabId:e.id}}))),s&&s.tagName.toLowerCase()==="a-tab-panel"&&s.remove()};#o(t){return b(t,this)}selectTabByIndex(t){let s=this.#t()[t];s&&this.selectTab(s)}selectTabById(t){let s=this.#t().find(i=>i.id===t);s&&this.selectTab(s)}selectTab(t){let e=this.#t().find(s=>s.selected);!t||t.disabled||t.selected||t.tagName.toLowerCase()!=="a-tab"||(this.#u(t),window.requestAnimationFrame(()=>{t.scrollIntoView({inline:"nearest",block:"nearest"}),t.focus()}),e&&this.dispatchEvent(new CustomEvent("a-tab-hide",{bubbles:!0,composed:!0,detail:{tabId:e.id}})),this.dispatchEvent(new CustomEvent("a-tab-show",{bubbles:!0,composed:!0,detail:{tabId:t.id}})))}static defineCustomElement(t="a-tab-group"){typeof window<"u"&&!window.customElements.get(t)&&window.customElements.define(t,a)}};f.defineCustomElement();export{u as ATab,f as ATabGroup,p as ATabPanel};
