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
const btnDel = document.createElement('button');

let activeTag = 1
let editingItem = null
let maxId = 0

const tags = [
    { id: 1,title: 'Все'},
    { id: 2,title: 'Идеи'},
    { id: 3,title: 'Личное'},
    { id: 4,title: 'Работа'},
    { id: 5,title: 'Список покупок'}]

function initDate(){
    const rawData = localStorage.getItem('data')
    if (rawData===null){
        const defaultNotes = [
            { id: 1,title: 'Сдать отчет',tag: 4,updateAt: new Date().toDateString()},
            { id: 2,title: 'Купить продукты',tag: 5,updateAt: new Date().toDateString()},
            {id: 3,title: 'Заметка',tag: 2,updateAt: new Date().toDateString()}
        ]
        localStorage.setItem('data', JSON.stringify(defaultNotes))
        return defaultNotes
    }
    return JSON.parse(rawData)
}
const notes = initDate()

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

function getNotes(searchValue) {
    return notes.filter(note => 
        note.title.toLowerCase().startsWith(searchValue.toLowerCase())
    );
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

    
    if (activeTag !== 1){
        filtered=filtered.filter(note => note.tag === activeTag)
    }
    if (filtered.length === 0){
        zadacha.innerText = 'Ничего не найдено'
        return
    }
    for (let note of filtered){
        const element = createNote(note)
        zadacha.appendChild(element)
    }
}

function onDelete(id){
    const idx = notes.findIndex(note => note.id === id)
    if (idx !== -1){
        notes.splice(idx,1)
        saveToLocal()
        render()
    }
    closeModal()
}

function openModal(){
    overlay.classList.add("overlay_open")
    oknoSelect.innerHTML = ''
    for (let tag of tags){
        if (tag.id === 1) continue
        const option = document.createElement('option')
        option.value= tag.id
        option.innerText= tag.title
        oknoSelect.appendChild(option)
    }
    if ( editingItem && editingItem.id){
        oknoInput.value = editingItem.title || ''
        oknoSelect.value = editingItem.tag || tags[1].id;
        const oldDelBtn = document.getElementById('delete-btn')
        if (oldDelBtn) oldDelBtn.remove()
        
        btnDel.id = 'delete-btn';
        btnDel.classList.add('okno__btn-delete')
        btnDel.style.background = 'red'
        btnDel.innerText = 'Удалить'
        btnDel.addEventListener('click', (e) => {
            e.preventDefault()
            onDelete(editingItem.id)
        })
        oknoForm.appendChild(btnDel)
    } else {
        oknoInput.value = ''
        oknoSelect.value = tags[1].id
        const delBtn = document.getElementById('delete-btn')
        if (delBtn) delBtn.remove()
    }
}

function closeModal(){
    overlay.classList.remove("overlay_open")
    editingItem= null
    const delBtn = document.getElementById('delete-btn')
    if (delBtn) delBtn.remove()
}

function getMaxId(){
    let max = 0
    for (let note of notes){
        if (note.id>max){
            max= note.id
        }
    }
    return max
}

function saveToLocal(){
    localStorage.setItem('data',JSON.stringify(notes))
}

function onSave(e){
    e.preventDefault()
    const title = oknoInput.value.trim();
    if (!title) {
        alert('Заголовок не может быть пустым!');
        return;
    }

    if(!editingItem.id){
        const newNote = {
            id: ++maxId,
            title: title,
            tag: +oknoSelect.value,
            updateAt: new Date().toDateString()
        }
        notes.unshift(newNote)
    } else{
        const item = notes.find(note => note.id === editingItem.id)
        if (item){
            item.title = title
            item.tag = oknoSelect.value
            item.updateAt = new Date().toDateString()
        }
    }
    saveToLocal()
    render()
    closeModal()
}

function init(){
    maxId=getMaxId()
    renderMenu()
    render()
    btnPoisk.addEventListener('click',render)
    btnNote.addEventListener('click',() =>{
        editingItem={
            id: null,
            title: '',
            tag: tags[1].id,
            updateAt: new Date().toDateString()
        }
        openModal()
    })
   btnNoteClose.addEventListener('click', closeModal);
    oknoSavebtn.addEventListener('click', onSave)
}

init()
