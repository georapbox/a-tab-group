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
The component will throw an error if a `<a-tab>` is not a sibling of a `<a-tab-panel>`.

```html
<a-tab-group>
  <a-tab slot="tab" role="heading">Tab 1</a-tab>
  <a-tab-panel slot="panel">Panel 1</a-tab-panel>

  <a-tab slot="tab" role="heading">Tab 2</a-tab>
  <a-tab-panel slot="panel">Panel 2</a-tab-panel>

  <a-tab slot="tab" role="heading" disabled>Tab 3 (disabled)</a-tab>
  <a-tab-panel slot="panel">Panel 3</a-tab-panel>

  <a-tab slot="tab" role="heading">Tab 4</a-tab>
  <a-tab-panel slot="panel">Panel 4</a-tab-panel>
</a-tab-group>
```

### Style

By default, the component comes with the bare minimum styling. However, you can customise the styles of the various elements of the component using either [CSS Parts](#css-parts) or [CSS Custom Properties](#css-custom-properties).

## API

### Properties

#### Properties for tab group

| Name | Reflects | Type | Required | Default | Description |
| ---- | -------- | ---- | -------- | ------- | ----------- |
| `placement` | ✓ | `'top' \| 'bottom' \| 'start' \| 'end'` | - | `'top'` | The placement of the tabs. |
| `noScrollControls`<br>*`no-scroll-controls`* | ✓ | Boolean | - | `false` | Disables the scroll buttons that appear when tabs overflow. |

#### Properties for tabs

| Name | Reflects | Type | Required | Default | Description |
| ---- | -------- | ---- | -------- | ------- | ----------- |
| `selected` | ✓ | Boolean | - | `false` | Determines if a tab is selected. Only one tab is selected at a time. If more than one tab is marked as selected, only the first one will be actually selected. If no tab is marked as selected, the first non-disabled tab will be selected by default. If a disabled tab is marked as selected, it will be ignored and the first non-disabled tab will be selected. |
| `disabled` | ✓ | Boolean | - | `false` | Determines if a tab is disabled. Disabled tabs cannot be selected. |

### Slots

| Name | Description |
| ---- | ----------- |
| `tab` | Used for groupping tabs in the tab group. Must be `<a-tab>` elements. |
| `panel` | Used for groupping tab panels in the tab group. Must be `<a-tab-panel>` elements. |

### CSS Parts

| Name | Description |
| ---- | ----------- |
| `base` | The component's base wrapper. |
| `nav` | The tab group's navigation container. |
| `scroll-button` | The scroll buttons that show when tabs are scrollable. |
| `scroll-button--start` | The scroll button for scrolling towards the start. |
| `scroll-button--end` | The scroll button for scrolling towards the end. |
| `scroll-button-icon` | The scroll button icon. |
| `tabs` | The container that wraps the tabs. |
| `panels` | The container that wraps the tab panels. |

### CSS Custom Properties

| Name | Description | Default |
| ---- | ----------- | ------- |
| `--selected-tab-color` | The color of the selected tab. | `#0d6efd` |
| `--selected-tab-bg-color` | The background color of the selected tab. | `transparent` |
| `--focus-box-shadow-color` | The color of the box shadow of the focused tab. | `#9bc0fe` |
| `--focus-box-shadow` | The box shadow of the focused tab. | `0 0 0 0.25rem var(--focus-box-shadow-color)` |
| `--tabs-scroll-behavior` | The scroll behavior of the tabs. | `smooth` |
| `--scroll-button-width` | The width of the scroll buttons. | `34px` |
| `--scroll-button-height` | The height of the scroll buttons. | `34px` |
| `--scroll-button-inline-offset` | This is the value of the `left` property for the start button and the `right` property for the end button. | `0rem` |

### Methods

| Name | Type | Description | Arguments |
| ---- | ---- | ----------- | --------- |
| `selectTab` | Prototype | Selects the given tab. If the given tab is disabled or already selected, this method does nothing. | `tab: HTMLElement` |
| `selectTabByIndex` | Prototype | Selects the tab at the given index. If the tab at the given index is disabled or already selected, this method does nothing. | `index: String` |

### Events

| Name | Description | Event Detail |
| ---- | ----------- | ------------ |
| `a-tab-group:change` | Emitted when the selected tab changes. | `{tabId: String, panelId: String}` |

## Changelog

For API updates and breaking changes, check the [CHANGELOG][changelog].

## License

[The MIT License (MIT)][license]
