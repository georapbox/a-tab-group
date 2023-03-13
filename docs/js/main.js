const isLocalhost = window.location.href.includes('127.0.0.1') || window.location.href.includes('localhost');
const componentUrl = isLocalhost ? '../../dist/a-tab-group.js' : '../lib/a-tab-group.js';

import(componentUrl).catch(err => {
  console.error(err);
});
