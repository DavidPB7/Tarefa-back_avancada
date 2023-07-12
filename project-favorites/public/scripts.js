const ul = document.querySelector('ul')
const input = document.querySelector('input')
const form = document.querySelector('form')
const li = document.createElement('li')
const imgs = document.querySelectorAll('img')
const formEdit = document.querySelector('.editar')
const inputEdit = document.querySelector('.editar input')
const h1 = document.querySelector('h1')


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
    const li = document.createElement('li') 
    const a = document.createElement('a')
    const input = document.createElement('input')
    const span = document.createElement('span')
    const edit = document.createElement('span');

    input.type = 'hidden';
    input.value = _id
    span.innerHTML = "delete";
    span.classList.add("deleteButton", "material-symbols-outlined")
    edit.innerHTML = "edit";
    edit.classList.add("editButton", "material-symbols-outlined");

    edit.addEventListener('click', () => {
        hideLinks(name, url, _id);
    })

    span.addEventListener('click', () => {
        removeElement(name, url, li, _id)
    })

    a.innerHTML = name
    a.href = url
    a.target = "_blank"
    ul.appendChild(li);
    li.appendChild(a);
    li.appendChild(edit);
    li.appendChild(span)
    li.appendChild(input)
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
    form.style.display = "none";
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

    fetch(`http://localhost:3000/link`, {
        method:'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({name, url})
    })

    
})