const btnNote = document.getElementById('btn-note')
const menu = document.getElementById('menu')
const poisk = document.getElementById('poisk')
const btnPoisk = document.getElementById('poisk__znach-btn')
const zadacha = document.getElementById('zadacha')
const overlay = document.getElementById('overlay')
const btnNoteClose = document.getElementById('okno__close')
const oknoForm = document.getElementById('okno-form')
const oknoInput = document.getElementById('okno__input')
const oknoSelect = document.getElementById('okno__select')
const oknoSavebtn = document.getElementById('okno-save')

let activeTag = 1
let editingItem = null
let maxId = null

const tags = [
    {
        id: 1,
        title: 'Все'
    },
    {
        id: 2,
        title: 'Идеи'
    },
    {
        id: 3,
        title: 'Личное'
    },
    {
        id: 4,
        title: 'Работа'
    },
    {
        id: 5,
        title: 'Список покупок'
    }]
const notes = initDate()
const notes = [
    {
        id: 1,
        title: 'Сдать отчет',
        tag: 4,
        updateAt: new Date().toDateString()
    },
    {
        id: 2,
        title: 'Купить продукты',
        tag: 5,
        updateAt: new Date().toDateString()
    },
    {
        id: 3,
        title: 'Заметка',
        tag: 2,
        updateAt: new Date().toDateString()
    }
]
poisk.addEventListener('keydown', function(event){ //поиск по нажатию enter
    if (event.key === 'Enter' || event.keyCode === 13){
    event.preventDefault(); //предотвращаем стандартное действие enter
    btnPoisk.click(); //имитируем клик по кнопке
}
});

function createTag(tag){
    const element = document.createElement('li')
    element.classList.add('teg')
    element.innerText = tag.title
    return element
}

function createNote(note){
    const element = document.createElement('div')
    element.classList.add("zadacha1__vnut")

    const title = document.createElement('span')
    title.innerText = note.title
    title.classList.add("zad1")

    const tag = document.createElement('span')
    tag.classList.add("zad2")
    tag.innerText = tags.find( obj => obj.id === note.tag).title

    const date = document.createElement('span')
    date.classList.add("zad3")
    date.innerText = note.updateAt

    element.appendChild(title)
    element.appendChild(tag)
    element.appendChild(date)
    return element
}

function getNotes(searchValue){
    const filteredNotes = notes.filter((i) => {
        return i.title.startsWith(searchValue)
    })
    return filteredNotes
}

function renderMenu(){
    for(let tag of tags){
        const element = createTag(tag)
        element.addEventListener("click",() =>{
            activeTag = tag.id
            render()
        })
        menu.appendChild(element)
    }
}

function render(){
    zadacha.innerHTML=''
    let filtered = getNotes(poisk.value)

    //let filtered = notes
    if (activeTag !== 1){
        filtered=filtered.filter(i => i.tag === activeTag)
    }
    if(filtered.length === 0){
        zadacha.innerText = 'Ничего не найдено'
        return
    }
    for (let i of filtered){
        const element = createNote(i)
        zadacha.appendChild(element)
    }
}

function onDelete(id){
    const idx = notes.findIndex(i => i.id === id)
    notes.splice(idx,1)
    closeModal1()
    render()
}

function openModal(){
    overlay.classList.add("overlay_open")
    modalTitle.value= editingItem.title
    for (let tag of tags){
        const option = document.createElement('option')
        option.value= tag.id
        option.innerText= tag.title
        oknoSelect.appendChild(option)
    }
    if (editingItem.id){
        btnDel = document.createElement('button')
        btnDel.classList.add('okno__btn-save')
        btnDel.style.background = 'red'
        btnDel.innerText = 'Удалить'
        btnDel.addEventListener('click', (e) => {
            e.preventDefault()
            onDelete(editingItem.id)
        })
        modalForm.appendChild(btnDel)
    }
    //TODD select form
}

function closeModal(){
    overlay.classList.toggle("overlay_open")
    oknoSelect.innerHTML=""
    editingItem= null
    btnDel.remove()
    //TODD clear form
}

function getMaxId(){
    let max = 0
    for (let i of notes){
        if (i.id>max){
            max= i.id
        }
    }
    return max
}

function initDate(){
    const rawData = localStorage.getItem('data')
    if (rawData === null){
        return []
    }
    return JSON.parse(rawData)
}

function saveToLocal(){
    localStorage.setItem('data',JSON.stringify(notes))
}

function onSave(){
    if (!editingItem){
        closeModal()
        return
    }
    //if new element
    if(!editingItem.id){
        notes.unshift({
            id: ++maxId,
            title: oknoInput.value,
            tag: +oknoSelect.value,
            updateAt: editingItem.updateAt
        })
        //render()
        //editingItem=null
        //closeModal()
    }
    if (editingItem.id){
        const item = notes.find(i => i.id === editingItem.id)
        item.title = oknoInput.value// не дописала
        item.tag = oknoSelect.value
    }
}

function init(){
    maxId=getMaxId
    renderMenu()
    render()
    btnPoisk.addEventListener('click',render)
    btnNote.addEventListener('click',() =>{
        editingItem={
            id: null,
            title: null,
            tag: null,
            updateAt: new Date().toDateString()
        }
        openModal()
    })
    btnNoteClose.addEventListener('click', () =>{
        closeModal()
    })
    oknoSavebtn.addEventListener('click',(e) =>{
        e.preventDefault()
        onSave()
    })
}

init()