const ul = document.querySelector('ul')
const input = document.querySelector('input')
const form = document.querySelector('form')
const li = document.createElement('li')
const imgs = document.querySelectorAll('img')
const formEdit = document.querySelector('.editar')
const inputEdit = document.querySelector('.editar input')
const h1 = document.querySelector('h1')

const oldUrl = '';

function addElement({ name, url }) {
    const li = document.createElement('li') 
    const a = document.createElement('a')
    const span = document.createElement('span')
    const edit = document.createElement('span');

    span.innerHTML = "delete";
    span.classList.add("deleteButton", "material-symbols-outlined")
    edit.innerHTML = "edit";
    edit.classList.add("editButton", "material-symbols-outlined");

    edit.addEventListener('click', () => {
        hideLinks(name, url);
    })

    span.addEventListener('click', () => {
        removeElement(name, url, li)
    })

    a.innerHTML = name
    a.href = url
    a.target = "_blank"
    ul.appendChild(li);
    li.appendChild(a);
    li.appendChild(edit);
    li.appendChild(span)
}

async function removeElement(name, url, li) {
    if(confirm("Deseja apagar o link selecionado")) {
        await fetch(`http://localhost:3000/?name=${name}&url=${url}&del=1/`)
        ul.removeChild(li);
    }
}


function hideLinks(name, url) {
    formEdit.style.display = "block";
    inputEdit.value = `${name}, ${url}`
    this.oldUrl = url;  
    ul.style.display = "none";
    form.style.display = "none";
    h1.innerHTML = "Informe novos dados"
}

async function updateLink() {
    const { value } = inputEdit

    const [name, url] = value.split(',')

    await fetch(`http://localhost:3000/?name=${name}&url=${this.oldUrl}&newUrl=${url}`);

    location.reload();
}

formEdit.addEventListener('submit', (event) => {
    event.preventDefault();

    updateLink();
})

form.addEventListener('submit', (event) => {
    
    event.preventDefault();

    let { value } = input

    if (!value)
        return alert('Preencha o campo!')

    const [name, url] = value.split(',')

    if (!url)
        return alert('O texto não está formatado da maneira correta.')

    if (!/^http/.test(url))
        return alert('Digite a url da maneira correta.')

    addElement({ name, url })

    input.value = ''

    fetch(`http://localhost:3000/?name=${name}&url=${url}/`)
})

// Função que carrega o conteúdo da API.
async function load() {
    // fetch está como await para evitar que entre num esquema de promisse e só devolva o conteúdo após a iteração qua acontece em seguida.
    const res = await fetch('http://localhost:3000/')
        .then(data => data.json())
    // Iterando no vetor com o conteúdo (JSON) que está vindo da API e adicionando-os no frontend.
    res.urls.map(({ name, url }) => addElement({ name, url }))
}

load()