# CHANGELOG

## v1.3.0 (2023-11-XX)

### Bug Fixes

- Add missing `nav` CSS Part to `a-tab-group` element.

### Other Changes

- Add default display values to host elements (`a-tab`, `a-tab-panel`).
- Add `contain: content` to host elements (`a-tab-group`, `a-tab`, `a-tab-panel`) to prevent layout thrashing.
- Provide better ergonomics by automatically setting the `slot` attribute to `a-tab` and `a-tab-panel` respectively, if not provided.
- Add `nav--scrollable` CSS Part to navigation container when tabs are scrollable, to allow for more specific styling.
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
