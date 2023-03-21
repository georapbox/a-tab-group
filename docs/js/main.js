const isLocalhost = window.location.href.includes('127.0.0.1') || window.location.href.includes('localhost');
const componentUrl = isLocalhost ? '../../dist/a-tab-group.js' : '../lib/a-tab-group.js';
const form = document.querySelector('form');
const tabGroupEl = document.querySelector('a-tab-group');
const consoleEl = document.getElementById('console');

import(componentUrl).then(() => {
  form.addEventListener('input', evt => {
    const field = evt.target;

    if (evt.target.name === 'custom-style') {
      return tabGroupEl.classList.toggle('custom-style', evt.target.checked);
    }

    if (field.type === 'checkbox') {
      tabGroupEl.toggleAttribute(field.name, field.checked);
    } else {
      tabGroupEl.setAttribute(field.name, field.value);
    }
  });

  document.addEventListener('a-tab-select', evt => {
    consoleEl.innerHTML = `a-tab-select -> ${JSON.stringify(evt.detail)}`;
  });

  document.addEventListener('a-tab-close', evt => {
    consoleEl.innerHTML = `a-tab-close -> ${JSON.stringify(evt.detail)}`;
  });
}).catch(err => {
  console.error(err);
});
