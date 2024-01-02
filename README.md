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
Every `<a-tab>` should have a corresponding `<a-tab-panel>` as a sibling, otherwise the component will log an error.

```html
<a-tab-group>
  <a-tab role="heading">Tab 1</a-tab>
  <a-tab-panel>Panel 1</a-tab-panel>

  <a-tab role="heading">Tab 2</a-tab>
  <a-tab-panel>Panel 2</a-tab-panel>

  <a-tab role="heading" disabled>Tab 3 (disabled)</a-tab>
  <a-tab-panel>Panel 3</a-tab-panel>

  <a-tab role="heading" closable>Tab 4</a-tab>
  <a-tab-panel>Panel 4</a-tab-panel>
</a-tab-group>
```

### Style

By default, the component comes with the bare minimum styling. However, you can customise the styles of the various elements of the component using either [CSS Parts](#css-parts) or [CSS Custom Properties](#css-custom-properties). You can also check the [demo][demo] for a working example.

## API

### Properties

#### &lt;a-tab-group&gt; properties

| Name | Reflects | Type | Required | Default | Description |
| ---- | -------- | ---- | -------- | ------- | ----------- |
| `placement` | ✓ | `'top' \| 'bottom' \| 'start' \| 'end'` | - | `'top'` | The placement of the tabs. The placement is achieved purely with CSS, therefore when stylng the component, you should take into account the `placement` attribute if you plan to support more than one placement, eg `a-tab-group[placement="bottom"] { ... }`. |
| `noScrollControls`<br>*`no-scroll-controls`* | ✓ | boolean | - | `false` | Disables the scroll buttons that appear when tabs overflow. |
| `scrollDistance`<br>*`scroll-distance`* | ✓ | number | - | `200` | The distance to scroll when the scroll buttons are clicked. It fallsback to the default value if not provided, or its value is `0`. |
| `activation` | ✓ | `'auto' \| 'manual'` | - | `'auto'` | If set to `'auto'`, navigating the tabs using the keyboard (`Left`, `Right`, `Up`, `Down`, `Home`, `End` arrow keys) will automatically select the tab. If set to `'manual'`, the tab will receive focus but will not be selected until the user presses the `Enter` or `Space` key. |
| `noTabCycling`<br>*`no-tab-cycling`* | ✓ | boolean | - | `false` | Disables tab cycling when the user reaches the first or last tab using the keyboard. |

#### &lt;a-tab&gt; properties

| Name | Reflects | Type | Required | Default | Description |
| ---- | -------- | ---- | -------- | ------- | ----------- |
| `selected` | ✓ | boolean | - | `false` | Determines if a tab is selected. Only one tab is selected at a time. If more than one tab is marked as selected, only the first one will be actually selected. If no tab is marked as selected, the first non-disabled tab will be selected by default. If a disabled tab is marked as selected, it will be ignored and the first non-disabled tab will be selected. It is highly recommended to set this property manually only during the initial render. If you need to programmatically select a tab, use the `selectTab`, `selectTabByIndex` or `selectTabById` methods instead, that will automatically update the `selected` property and link the tab to its corresponding tab panel. |
| `disabled` | ✓ | boolean | - | `false` | Determines if a tab is disabled. Disabled tabs cannot be selected. |
| `closable` | ✓ | boolean | - | `false` | Determines if a tab is closable. |

### Slots

| Name | Description |
| ---- | ----------- |
| `tab` | Used for groupping tabs in the tab group. Must be `<a-tab>` elements. It will be added automatically if not provided. |
| `panel` | Used for groupping tab panels in the tab group. Must be `<a-tab-panel>` elements. It will be added automatically if not provided. |

### CSS Parts

#### &lt;a-tab-group&gt; CSS Parts

| Name | Description |
| ---- | ----------- |
| `base` | The tab groups's base wrapper. |
| `nav` | The tab group's navigation container. |
| `nav--has-scroll-controls` | The tab group's navigation container when scroll controls are enabled and visible. |
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
| `--tabs-scroll-behavior` | The scroll behavior of the tabs. If reduce motion is enabled, the scroll behavior will be set to `auto`. | `smooth` |
| `--scroll-button-width` | The width of the scroll buttons. | `2.125em` |
| `--scroll-button-height` | The height of the scroll buttons. | `2.125em` |
| `--scroll-button-inline-offset` | This is the value of the `left` property for the start scroll button and the `right` property for the end scroll button. | `0rem` |

### Methods

| Name | Type | Description | Arguments |
| ---- | ---- | ----------- | --------- |
| `selectTab`<sup>1</sup> | Instance | Selects the given tab. If the given tab is disabled or already selected, this method does nothing. | `tab: HTMLElement` |
| `selectTabByIndex`<sup>1</sup> | Instance | Selects the tab at the given index. If the tab at the given index is disabled or already selected, this method does nothing. | `index: number` |
| `selectTabById`<sup>1</sup> | Instance | Selects the tab with the given id. If the tab with the given id is disabled or already selected, this method does nothing. This is mostly useful if you provide your own ids to the tabs. | `id: string` |

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
| `a-tab-show` | Emitted when a tab is shown (not in the initial render). | `{tabId: string}` |
| `a-tab-hide` | Emitted when a tab is hidden. It is also emitted if the user closes a closable tab. | `{tabId: string}` |
| `a-tab-close` | Emitted when a tab is closed by the user (if the tab is closable). | `{tabId: string}` |

## Changelog

For API updates and breaking changes, check the [CHANGELOG][changelog].

## License

[The MIT License (MIT)][license]
