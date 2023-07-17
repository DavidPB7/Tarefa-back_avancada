const ul = document.querySelector('.grid main ul')
const input = document.querySelector('input')
const addLinkForm = document.querySelector('.input-link form')
const li = document.createElement('li')
const imgs = document.querySelectorAll('img')
const formEdit = document.querySelector('.editLink')
const inputEdit = document.querySelector('.editar input')
const h1 = document.querySelector('h1')
const menuMobile = document.querySelector('.menu-toggle')
const nav = document.querySelector('#nav-main')


// Função que carrega o conteúdo da API.
async function load() {
    try {
        const response = await fetch('http://localhost:3000/link/');
        const data = await response.json();

        data.forEach(({_id, name, url }) => addElement({_id, name, url}))
    } catch (error) {
        console.error("Ocorreu um erro:", error)
    }
}

load()

function addElement({_id, name, url}) {
    // Cria elementos html
    const li = document.createElement('li')
    const link = document.createElement('a')
    const div = document.createElement('div')
    const spanEditLink = document.createElement('span')
    const spanDeleteLink = document.createElement('span')
    const inputHiddenId = document.createElement('input')

    // Insere classes necessárias nos elementos
    link.classList.add("link-name")
    div.classList.add("acoes");
    spanEditLink.classList.add( "material-symbols-outlined", "editButton")
    spanDeleteLink.classList.add( "material-symbols-outlined", "deleteButton")

    spanEditLink.innerHTML = "edit"
    spanDeleteLink.innerHTML = "delete"

    inputHiddenId.type = 'hidden';
    inputHiddenId.value = _id

    link.innerHTML = name
    link.href = url
    link.target = "_blank"

    spanEditLink.addEventListener('click', () => {
        hideLinks(name, url, _id);
    })

    spanDeleteLink.addEventListener('click', () => {
        removeElement(name, url, li, _id)
    })

    // Adiciona elementos na interface
    ul.appendChild(li)
    li.appendChild(link)
    li.appendChild(div)
    div.appendChild(spanEditLink) 
    div.appendChild(spanDeleteLink)
    li.appendChild(inputHiddenId)
}

async function removeElement(name, url, li, _id) {
    if(confirm("Deseja apagar o link selecionado")) {
        await fetch(`http://localhost:3000/link/${_id}`, {
            method:'DELETE'
        })
        ul.removeChild(li);
    }
}


function hideLinks(name, url, _id) {
    const input = document.createElement('input')
    input.type = 'hidden';
    input.value = _id
    formEdit.appendChild(input)

    formEdit.style.display = "block";
    inputEdit.value = `${name}, ${url}`
    this.oldUrl = url;  
    ul.style.display = "none";
    addLinkForm.style.display = "none";
    h1.innerHTML = "Informe novos dados"
}

async function updateLink() {
    const inputId = document.querySelector('form input[type="hidden"]')
    const id = inputId.value
    const { value } = inputEdit

    const [name, url] = value.split(',')

    await fetch(`http://localhost:3000/link/${id}`, {
        method:'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({name, url})
    })

    location.reload();
}

formEdit.addEventListener('submit', (event) => {
    event.preventDefault();

    updateLink();
})

addLinkForm.addEventListener('submit', (event) => {
    
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

    fetch(`http://localhost:3000/link`, {
        method:'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({name, url})
    })

})

menuMobile.addEventListener('click', () => {
    nav.style.display = nav.style.display === 'block' ? 'none' : 'block'
})