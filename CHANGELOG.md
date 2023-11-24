# CHANGELOG

## v1.3.0 (2023-11-27)

### Bug Fixes

- Add missing `nav` CSS Part to `a-tab-group` element.
- Fix navigation scrolling issues on iOS.
- Fix navigation scroll buttons bug on iOS that caused the buttons to not be visible when the tabs were scrollable.

### Other Changes

- Add default display values to host elements (`a-tab`, `a-tab-panel`).
- Add `contain: content` to host elements (`a-tab-group`, `a-tab`, `a-tab-panel`) to prevent layout thrashing.
- Provide better ergonomics by automatically setting the `slot` attribute to `a-tab` and `a-tab-panel` respectively, if not provided.
- Add `nav--scrollable` CSS Part to navigation container when tabs are scrollable, to allow for more specific styling.
- Add `a-tab-show` event to `a-tab` element, which is fired when the tab is shown and deprecate the `a-tab-select` event.
- Add `a-tab-hide` event to `a-tab` element, which is fired when the tab is hidden.
- Add `selectTabById()` method to `a-tab-group` element, which selects the tab with the given id.
- Remove experimental view transitions on panels via `panel-transition` attribute. It was not working as expected and it will be re-evaluated in the future.
- Generate types declarations for the components.
- Update dev dependencies.

## v1.2.0 (2023-10-13)

- Add experimental view transitions on panels via `panel-transition` attribute.
- Update dev dependencies.

## v1.1.0 (2023-03-22)

- Add Shadow DOM to `a-tab` and `a-tab-panel` to prevent global styles from affecting the default styles of the elements.
- Remove hardcoded `font-size` from `a-tab` and `a-tab-panel` to allow inherit the font size from the parent element.
- Use relative size units for scroll button icons and tab close button icons, to allow inherit the font size from the parent element.

## v1.0.0 (2023-03-21)

- Initial release
