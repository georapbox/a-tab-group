# CHANGELOG

## v2.3.1 (2024-08-22)

- Replace parcel with esbuild for bundling.
- Update ESLint to use flat configuration.
- Use Prettier for code formatting.
- Update dev dependencies.

## v2.3.0 (2024-06-04)

- Re-export `ATabPanel` and `ATab` classes from the package. Fixes [#7](https://github.com/georapbox/a-tab-group/issues/7).
- Updated dev dependencies.

## v2.2.1 (2024-01-20)

- Do not add `placement="top"` attribute to host element when connected to DOM if is not set by the user intentionally. This change is made to avoid unnecessary attribute mutations. Fixes [#5](https://github.com/georapbox/a-tab-group/issues/5).
- Updated dev dependencies.

## v2.2.0 (2024-01-03)

- Added `no-tab-cycling` attribute to `a-tab-group` element, which disables tab cycling when the user reaches the first or last tab using the keyboard.

## v2.1.0 (2023-12-18)

## Bug Fixes

- Handled navigation with arrow keys appropriately according to directionality of the element, eg. when the orientation is `horizontal` and the directionality is `rtl`, the `Left` arrow key should navigate to the next tab and the `Right` arrow key should navigate to the previous tab.
- Limited the execution rate of resize observer callback to the refresh rate of the browser to avoid `ResizeObserver loop completed with undelivered notifications.` warning in Safari.

### Other Changes

- Refactored arrow keys navigation to use the "Left" and "Right" keys for horizontal navigation and the "Up" and "Down" keys for vertical navigation.
- Updated arrow keys navigation to use `KeyboardEvent.key` instead of `KeyboardEvent.code` for better support in different keyboard layouts.
- Remove `nav--scrollable` CSS Part from navigation container and replace it with `nav--has-scroll-controls` CSS Part, which is added when scroll controls are enabled and visible.

## v2.0.0 (2023-11-27)

### Breaking Changes

- Removed `a-tab-select` event from `a-tab` element. Use `a-tab-show` event instead.
- Removed experimental view transitions on panels via `panel-transition` attribute. It was not working as expected and it will be re-evaluated in the future.

### Other Changes

- Added default display values to host elements (`a-tab`, `a-tab-panel`).
- Added `contain: content` to host elements (`a-tab-group`, `a-tab`, `a-tab-panel`) to prevent layout thrashing.
- Provided better ergonomics by automatically setting the `slot` attribute to `a-tab` and `a-tab-panel` respectively, if not provided.
- Added `nav--scrollable` CSS Part to navigation container when tabs are scrollable, to allow for more specific styling.
- Added `a-tab-show` event to `a-tab` element, which is fired when the tab is shown.
- Added `a-tab-hide` event to `a-tab` element, which is fired when the tab is hidden.
- Added `selectTabById()` method to `a-tab-group` element, which selects the tab with the given id.
- Generate types declarations for the components.
- Update dev dependencies.

### Bug Fixes

- Added missing `nav` CSS Part to `a-tab-group` element.
- Fixed navigation scrolling issues on iOS.
- Fixed navigation scroll buttons bug on iOS that caused the buttons to not be visible when the tabs were scrollable.

## v1.2.0 (2023-10-13)

- Added experimental view transitions on panels via `panel-transition` attribute.
- Updated dev dependencies.

## v1.1.0 (2023-03-22)

- Added Shadow DOM to `a-tab` and `a-tab-panel` to prevent global styles from affecting the default styles of the elements.
- Removed hardcoded `font-size` from `a-tab` and `a-tab-panel` to allow inherit the font size from the parent element.
- Used relative size units for scroll button icons and tab close button icons, to allow inherit the font size from the parent element.

## v1.0.0 (2023-03-21)

- Initial release
