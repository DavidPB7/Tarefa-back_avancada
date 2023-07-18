const ul = document.querySelector('.grid main ul');
const input = document.querySelector('input');
const addLinkForm = document.querySelector('.input-link form');
const menuMobile = document.querySelector('.menu-toggle');
const nav = document.querySelector('#nav-main');

// Função que carrega o conteúdo da API.
async function load() {
  try {
    const response = await fetch('http://localhost:3000/link/');
    const data = await response.json();

    data.forEach(({ _id, name, url }) => addElement({ _id, name, url }));
  } catch (error) {
    console.error("Ocorreu um erro:", error);
  }
}

load();

function addElement({ _id, name, url }) {
  const li = document.createElement('li');
  const link = document.createElement('a');
  const div = document.createElement('div');
  const spanEditLink = document.createElement('span');
  const spanDeleteLink = document.createElement('span');
  const inputHiddenId = document.createElement('input');

  link.classList.add('link-name');
  div.classList.add('acoes');
  spanEditLink.classList.add('material-symbols-outlined', 'editButton');
  spanDeleteLink.classList.add('material-symbols-outlined', 'deleteButton');

  spanEditLink.innerHTML = 'edit';
  spanDeleteLink.innerHTML = 'delete';

  inputHiddenId.type = 'hidden';
  inputHiddenId.value = _id;

  link.innerHTML = name;
  link.href = url;
  link.target = '_blank';

  spanEditLink.addEventListener('click', () => {
    hideLinkAndShowInput(link, li, url, _id);
  });

  spanDeleteLink.addEventListener('click', () => {
    removeElement(li, _id);
  });

  ul.appendChild(li);
  li.appendChild(link);
  li.appendChild(div);
  div.appendChild(spanEditLink);
  div.appendChild(spanDeleteLink);
  li.appendChild(inputHiddenId);
}

async function removeElement(li, id) {
  if (confirm('Deseja apagar o link selecionado?')) {
    await fetch(`http://localhost:3000/link/${id}`, {
      method: 'DELETE',
    });
    li.remove();
  }
}

async function updateLink(inputEdit, id) {
  const { value } = inputEdit;
  const [name, url] = value.split(',');

  await fetch(`http://localhost:3000/link/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name, url }),
  });

  location.reload();
}

function hideLinkAndShowInput(link, li, url, id) {
  if (li.firstChild instanceof HTMLFormElement) {
    li.firstChild.remove();
    link.style.display = '';
    return;
  }

  const formEdit = document.createElement('form');
  const inputEdit = document.createElement('input');

  formEdit.appendChild(inputEdit);

  inputEdit.type = 'text';
  inputEdit.classList.add('inputEdit');
  inputEdit.value = `${link.innerHTML},${url}`;
  link.style.display = 'none';
  li.insertBefore(formEdit, li.firstChild);

  formEdit.addEventListener('submit', (event) => {
    event.preventDefault();
    updateLink(inputEdit, id);
  });
}

addLinkForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const { value } = input;

  if (!value) {
    return alert('Preencha o campo!');
  }

  const [name, url] = value.split(',');

  if (!url) {
    return alert('O texto não está formatado da maneira correta.');
  }

  if (!/^http/.test(url)) {
    return alert('Digite a URL da maneira correta.');
  }

  addElement({ name, url });

  input.value = '';

  fetch('http://localhost:3000/link', {
    method: 'POST', 
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name, url }),
  });
});

menuMobile.addEventListener('click', () => {
  nav.style.display = nav.style.display === 'block' ? 'none' : 'block';
});
