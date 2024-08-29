import '../lib/browser-window.js';

const url = window.location.href;
const isLocalhost = url.includes('127.0.0.1') || url.includes('localhost');
const componentUrl = isLocalhost ? '../../dist/a-tab-group.js' : '../lib/a-tab-group.js';
const form = document.querySelector('form');
const tabGroupEl = document.querySelector('a-tab-group');
const eventsEl = document.getElementById('events');
const clearEventsBtn = document.getElementById('clearEventsBtn');

import(componentUrl);

document.addEventListener('DOMContentLoaded', () => {
  window.hljs.highlightAll();
});

form.addEventListener('submit', evt => {
  evt.preventDefault();
});

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

const handleEvents = evt => {
  const div = document.createElement('div');
  div.style.margin = '0 0 0.25rem 0';
  div.style.color =
    evt.type === 'a-tab-show' ? 'var(--green)' : evt.type === 'a-tab-hide' ? 'var(--orange)' : 'var(--red)';
  div.textContent = `${evt.type} => ${JSON.stringify(evt.detail)}`;
  eventsEl.appendChild(div);
  eventsEl.scrollTop = eventsEl.scrollHeight;

  if (isLocalhost) {
    console.log(evt.type, evt.detail);
  }
};

clearEventsBtn.addEventListener('click', () => {
  eventsEl.innerHTML = '';
});

document.addEventListener('a-tab-show', handleEvents);
document.addEventListener('a-tab-hide', handleEvents);
document.addEventListener('a-tab-close', handleEvents);

if (getComputedStyle(tabGroupEl).direction === 'rtl') {
  document.querySelectorAll('input[name="dir"]')[1].checked = true;
}
