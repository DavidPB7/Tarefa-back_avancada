const ul = document.querySelector('ul')
const input = document.querySelector('input')
const form = document.querySelector('form')
const li = document.createElement('li')
const imgs = document.querySelectorAll('img')
const formEdit = document.querySelector('.editar')
const inputEdit = document.querySelector('.editar input')
const h1 = document.querySelector('h1')

const oldUrl = '';

// Função que carrega o conteúdo da API.
async function load() {
    // fetch está como await para evitar que entre num esquema de promisse e só devolva o conteúdo após a iteração qua acontece em seguida.
    const res = await fetch('http://localhost:3000/')
        .then(data => data.json())
    // Iterando no vetor com o conteúdo (JSON) que está vindo da API e adicionando-os no frontend.
    res.urls.map(({ name, url }) => addElement({ name, url }))
}

load()


function addElement({ name, url }) {
    const li = document.createElement('li') 
    const span = document.createElement('span')
    const edit = document.createElement('span');

    span.innerHTML = "x";
    span.classList.add("deleteButton")
    edit.innerHTML = "editar";
    edit.classList.add("editButton");

    edit.addEventListener('click', () => {
        formEdit.style.display = "block";
        inputEdit.value = `${name}, ${url}`
        this.oldUrl = url;  
        ul.style.display = "none";
        form.style.display = "none";
        h1.innerHTML = "Informe novos dados"
    })

    span.addEventListener('click', () => {
        if(confirm("Deseja apagar o link selecionado")) {
            fetch(`http://localhost:3000/?name=${name}&url=${url}&del=1/`)
            ul.removeChild(li);
        }
    })

    li.innerHTML = `${name} ${url}`
    li.appendChild(span)
    ul.appendChild(li);
    li.appendChild(edit);
}

    // function removeElement(element) {
    //     ul.removeChild(li);
    //     alert('Tem certeza que quer remover o elemento?')
    // }


formEdit.addEventListener('submit', (event) => {
    event.preventDefault();

    let { value } = inputEdit

    const [name, url] = value.split(',')

    fetch(`http://localhost:3000/?name=${name}&url=${oldUrl}&newUrl=${url}/`)
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