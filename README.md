[![npm version](https://img.shields.io/npm/v/@georapbox/a-tab-group.svg)](https://www.npmjs.com/package/@georapbox/a-tab-group)
[![npm license](https://img.shields.io/npm/l/@georapbox/a-tab-group.svg)](https://www.npmjs.com/package/@georapbox/a-tab-group)

[demo]: https://georapbox.github.io/a-tab-group/
[license]: https://georapbox.mit-license.org/@2023
[changelog]: https://github.com/georapbox/a-tab-group/blob/main/CHANGELOG.md

# &lt;a-tab-group&gt;

A custom element to create a group of tabs and tab panels.

[API documentation](#api) &bull; [Demo][demo]

## Install

```sh
$ npm install --save @georapbox/a-tab-group
```

## Usage

### Script

```js
import './node_modules/@georapbox/a-tab-group/dist/a-tab-group.js';
```

### Markup

All children of `<a-tab-group>` should be either `<a-tab>` or `<a-tab-panel>`. 
The `<a-tab>` elements should be placed in the `tab` slot, and the `<a-tab-panel>` elements should be placed in the `panel` slot.
The component will log an error if a `<a-tab>` is not a sibling of a `<a-tab-panel>`.

```html
<a-tab-group>
  <a-tab slot="tab" role="heading">Tab 1</a-tab>
  <a-tab-panel slot="panel">Panel 1</a-tab-panel>

  <a-tab slot="tab" role="heading">Tab 2</a-tab>
  <a-tab-panel slot="panel">Panel 2</a-tab-panel>

  <a-tab slot="tab" role="heading" disabled>Tab 3 (disabled)</a-tab>
  <a-tab-panel slot="panel">Panel 3</a-tab-panel>

  <a-tab slot="tab" role="heading" closable>Tab 4</a-tab>
  <a-tab-panel slot="panel">Panel 4</a-tab-panel>
</a-tab-group>
```

### Style

By default, the component comes with the bare minimum styling. However, you can customise the styles of the various elements of the component using either [CSS Parts](#css-parts) or [CSS Custom Properties](#css-custom-properties).

Below is an example of how you can customise the styles of the component using CSS Custom Properties and CSS Parts.

```css
/* Style tab group */
a-tab-group {
  --selected-tab-color: #ffffff;
  --selected-tab-bg-color: #005fcc;
  --scroll-button-inline-offset: 0.25rem;

  border: 1px solid #dee2e6;
  border-radius: 0.25rem;
  background-color: #ffffff;
  overflow: hidden;
}

/* Style scroll buttons */
a-tab-group::part(scroll-button) {
  border-radius: 0.25rem;
}

/* Style tabs container */
a-tab-group::part(tabs) {
  padding: 0.5rem;
}

/* Style tab panels container */
a-tab-group::part(panels) {
  padding: 1rem;
  border-width: 1px 0 0 0;
  border-style: solid;
  border-color: #dee2e6;
}

a-tab-group[placement="bottom"]::part(panels) {
  border-width: 0 0 1px 0;
}

a-tab-group[placement="start"]::part(panels) {
  border-width: 0 0 0 1px;
}

a-tab-group[placement="end"]::part(panels) {
  border-width: 0 1px 0 0;
}

/* Style tabs */
a-tab-group[placement="top"] a-tab,
a-tab-group[placement="bottom"] a-tab {
  margin: 0 0.25rem;
}

a-tab-group[placement="start"] a-tab,
a-tab-group[placement="end"] a-tab {
  margin: 0.25rem 0;
}

a-tab-group a-tab::part(base) {
  border-radius: 0.25rem;
}

a-tab-group a-tab[selected]::part(close-tab) {
  color: var(--selected-tab-color);
}
```

## API

### Properties

#### &lt;a-tab-group&gt; properties

| Name | Reflects | Type | Required | Default | Description |
| ---- | -------- | ---- | -------- | ------- | ----------- |
| `placement` | ✓ | `'top' \| 'bottom' \| 'start' \| 'end'` | - | `'top'` | The placement of the tabs. The placement is achieved purely with CSS, therefore when stylng the component, you should take into account the `placement` attribute if you plan to support more than one placement, eg `a-tab-group[placement="bottom"] { ... }`. |
| `noScrollControls`<br>*`no-scroll-controls`* | ✓ | Boolean | - | `false` | Disables the scroll buttons that appear when tabs overflow. |
| `scrollDistance`<br>*`scroll-distance`* | ✓ | Number | - | `200` | The distance to scroll when the scroll buttons are clicked. It fallsback to the default value if not provided, or its value is `0`. |
| `activation` | ✓ | `'auto' \| 'manual'` | - | `'auto'` | If set to `'auto'`, navigating the tabs using the keyboard (`Left`, `Right`, `Up`, `Down`, `Home`, `End` arrow keys) will automatically select the tab. If set to `'manual'`, the tab will receive focus but will not be selected until the user presses the `Enter` or `Space` key. |

#### &lt;a-tab&gt; properties

| Name | Reflects | Type | Required | Default | Description |
| ---- | -------- | ---- | -------- | ------- | ----------- |
| `selected` | ✓ | Boolean | - | `false` | Determines if a tab is selected. Only one tab is selected at a time. If more than one tab is marked as selected, only the first one will be actually selected. If no tab is marked as selected, the first non-disabled tab will be selected by default. If a disabled tab is marked as selected, it will be ignored and the first non-disabled tab will be selected. It is highly recommended to set this property manually only during the initial render. If you need to programmatically select a tab, use the `selectTab` or `selectTabByIndex` methods instead, that will automatically update the `selected` property and link the tab to its corresponding tab panel. |
| `disabled` | ✓ | Boolean | - | `false` | Determines if a tab is disabled. Disabled tabs cannot be selected. |
| `closable` | ✓ | Boolean | - | `false` | Determines if a tab is closable. |

### Slots

| Name | Description |
| ---- | ----------- |
| `tab` | Used for groupping tabs in the tab group. Must be `<a-tab>` elements. |
| `panel` | Used for groupping tab panels in the tab group. Must be `<a-tab-panel>` elements. |

### CSS Parts

#### &lt;a-tab-group&gt; CSS Parts

| Name | Description |
| ---- | ----------- |
| `base` | The tab groups's base wrapper. |
| `nav` | The tab group's navigation container. |
| `scroll-button` | The scroll buttons that show when tabs are scrollable. |
| `scroll-button--start` | The scroll button for scrolling towards the start. |
| `scroll-button--end` | The scroll button for scrolling towards the end. |
| `scroll-button-icon` | The scroll button icon. |
| `tabs` | The container that wraps the tabs. |
| `panels` | The container that wraps the tab panels. |

#### &lt;a-tab&gt; CSS Parts

| Name | Description |
| ---- | ----------- |
| `base` | The tab's base wrapper. |
| `close-tab` | The close tab button. |
| `close-tab-icon` | The close tab icon. |

#### &lt;a-tab-panel&gt; CSS Parts

| Name | Description |
| ---- | ----------- |
| `base` | The tab panel's base wrapper. |

### CSS Custom Properties

| Name | Description | Default |
| ---- | ----------- | ------- |
| `--selected-tab-color` | The color of the selected tab. | `#005fcc` |
| `--selected-tab-bg-color` | The background color of the selected tab. | `transparent` |
| `--tabs-scroll-behavior` | The scroll behavior of the tabs. | `smooth` |
| `--scroll-button-width` | The width of the scroll buttons. | `2.125em` |
| `--scroll-button-height` | The height of the scroll buttons. | `2.125em` |
| `--scroll-button-inline-offset` | This is the value of the `left` property for the start scroll button and the `right` property for the end scroll button. | `0rem` |

### Methods

| Name | Type | Description | Arguments |
| ---- | ---- | ----------- | --------- |
| `selectTab`<sup>1</sup> | Prototype | Selects the given tab. If the given tab is disabled or already selected, this method does nothing. | `tab: HTMLElement` |
| `selectTabByIndex`<sup>1</sup> | Prototype | Selects the tab at the given index. If the tab at the given index is disabled or already selected, this method does nothing. | `index: String` |

<sup>1</sup> These methods are only available after the component has been defined. If you need to call these methods before the component has been defined, you can use the `whenDefined` method of the `CustomElementRegistry` interface. For example:

```js
Promise.all([
  customElements.whenDefined('a-tab-group'),
  customElements.whenDefined('a-tab'),
  customElements.whenDefined('a-tab-panel')
]).then(() => {
  /* call methods here */
});
```

### Events

| Name | Description | Event Detail |
| ---- | ----------- | ------------ |
| `a-tab-select` | Emitted when a tab is selected (not in the initial render). | `{tabId: String}` |
| `a-tab-close` | Emitted when a tab is closed. | `{tabId: String}` |

## Changelog

For API updates and breaking changes, check the [CHANGELOG][changelog].

## License

[The MIT License (MIT)][license]
