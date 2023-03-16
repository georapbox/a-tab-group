const isLocalhost = window.location.href.includes('127.0.0.1') || window.location.href.includes('localhost');
const componentUrl = isLocalhost ? '../../dist/a-tab-group.js' : '../lib/a-tab-group.js';
const form = document.querySelector('form');
const addTabButton = document.getElementById('add-tab-button');
const removeTabButton = document.getElementById('remove-tab-button');
const tabGroup = document.querySelector('a-tab-group');
const consoleEl = document.getElementById('console');

function randomText() {
  const texts = [
    'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Esse qui at soluta unde doloremque laboriosam atque, similique animi! Recusandae libero fugit ad consequatur facilis praesentium maxime commodi quia quidem nostrum?',
    'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Cupiditate labore aut, exercitationem veniam non accusantium est iure quas suscipit ratione omnis laborum officiis voluptates tempore magnam dolor iste quia nihil.',
    'Lorem ipsum dolor sit amet consectetur adipisicing elit. Labore ipsam suscipit dicta odio fugiat libero voluptates rerum ea doloremque quia dignissimos, quasi mollitia atque saepe. Quae sed accusantium accusamus atque!',
    'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Doloribus animi quod dolore, consequatur tenetur provident enim maiores eveniet ipsa dolorum est. Saepe nam officiis modi, illo nostrum quibusdam autem eligendi.',
    'Lorem ipsum dolor sit amet consectetur adipisicing elit. Ut minus nostrum necessitatibus magni unde delectus commodi labore facere consectetur. Doloremque labore iure fugiat omnis nam recusandae, minus provident temporibus sed.',
    'Lorem ipsum dolor sit amet consectetur adipisicing elit. Commodi consectetur nulla, vero doloremque nam autem fugiat praesentium deleniti officiis reprehenderit harum aliquam iure impedit similique saepe nemo. Eligendi, nobis porro.',
    'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Officia facere ipsum corrupti fugiat repudiandae rerum vel explicabo! Voluptate corrupti voluptatibus consequuntur neque. Provident, quos illum! Ratione dolorem architecto totam quo.',
    'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Est iste, odio quasi dolorum neque aperiam, at suscipit blanditiis earum id qui et dolorem aut enim possimus. Beatae incidunt in culpa.'
  ];

  return texts[Math.floor(Math.random() * texts.length)];
}

function createTab(id) {
  const tab = document.createElement('a-tab');
  tab.id = `tab-${id}`;
  tab.setAttribute('slot', 'tab');
  tab.textContent = `Tab ${id}`;
  tabGroup.appendChild(tab);

  const panel = document.createElement('a-tab-panel');
  panel.id = `tab-panel-${id}`;
  panel.setAttribute('slot', 'panel');
  panel.innerHTML = `<h3>Tab panel ${id}</h3><p>${randomText()}</p>`;
  tabGroup.appendChild(panel);
}

function removeTab(id) {
  const tab = document.getElementById(`tab-${id}`);
  const panel = document.getElementById(`tab-panel-${id}`);

  tab && tab.remove();
  panel && panel.remove();
}

import(componentUrl).then(() => {
  form.addEventListener('input', evt => {
    if (evt.target.name === 'placement') {
      tabGroup.setAttribute('placement', evt.target.value);
    }

    if (evt.target.name === 'scroll-distance') {
      tabGroup.setAttribute('scroll-distance', evt.target.value);
    }

    if (evt.target.name === 'no-scroll-controls') {
      tabGroup.toggleAttribute('no-scroll-controls', evt.target.checked);
    }

    if (evt.target.name === 'custom-style') {
      tabGroup.classList.toggle('custom-style', evt.target.checked);
    }
  });

  addTabButton.addEventListener('click', () => {
    const totalTabs = document.querySelectorAll('a-tab').length;
    createTab(totalTabs + 1);
  });

  removeTabButton.addEventListener('click', () => {
    const allTabs = document.querySelectorAll('a-tab');

    removeTab(allTabs.length);
  });

  document.addEventListener('a-tab-group:change', evt => {
    consoleEl.innerHTML = `a-tab-group:change -> ${JSON.stringify(evt.detail)}`;
  });
}).catch(err => {
  console.error(err);
});
