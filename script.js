const btnNote = document.getElementById('btn-note');
const menu = document.getElementById('menu');
const poisk = document.getElementById('poisk');
const btnPoisk = document.getElementById('poisk__znach-btn');
const zadacha = document.getElementById('zadacha');
const overlay = document.getElementById('overlay');
const btnNoteClose = document.getElementById('okno__close');
const oknoForm = document.getElementById('okno-form');
const oknoInput = document.getElementById('okno__input');
const oknoSelect = document.getElementById('okno__select');
const oknoSaveBtn = document.getElementById('okno-save');

let activeTag = 1;
let editingId = null;

const tags = [
  { id: 1, title: 'Все' },
  { id: 2, title: 'Идеи' },
  { id: 3, title: 'Личное' },
  { id: 4, title: 'Работа' },
  { id: 5, title: 'Список покупок' }
];

// === Работа с данными ===
function loadNotes() {
  const data = localStorage.getItem('data');
  return data ? JSON.parse(data) : [
    { id: 1, title: 'Сдать отчет', tag: 4, updateAt: new Date().toDateString() },
    { id: 2, title: 'Купить продукты', tag: 5, updateAt: new Date().toDateString() },
    { id: 3, title: 'Заметка', tag: 2, updateAt: new Date().toDateString() }
  ];
}

function saveNotes(notes) {
  localStorage.setItem('data', JSON.stringify(notes));
}

let notes = loadNotes();

// === Поиск по Enter ===
poisk.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    e.preventDefault();
    render();
  }
});

// === Создание DOM-элементов ===
const createTag = (tag) => {
  const li = document.createElement('li');
  li.className = 'teg';
  li.textContent = tag.title;
  li.addEventListener('click', () => {
    activeTag = tag.id;
    render();
  });
  return li;
};

const createNote = (note) => {
  const div = document.createElement('div');
  div.className = 'zadacha1__vnut';
  
  const tagTitle = tags.find(t => t.id === note.tag)?.title || '—';
  
  div.innerHTML = `
    <span class="zad1">${note.title}</span>
    <span class="zad2">${tagTitle}</span>
    <span class="zad3">${note.updateAt}</span>
  `;
  return div;
};

// === Фильтрация ===
function getFilteredNotes() {
  const search = poisk.value.trim().toLowerCase();
  return notes.filter(note =>
    note.title.toLowerCase().startsWith(search) &&
    (activeTag === 1 || note.tag === activeTag)
  );
}

// === Рендеринг ===
function render() {
  const filtered = getFilteredNotes();
  zadacha.innerHTML = filtered.length
    ? filtered.map(createNote).join('')
    : '<p>Ничего не найдено</p>';
}

// === Модальное окно ===
function openModal(note = null) {
  editingId = note?.id || null;
  
  // Заполняем select
  oknoSelect.innerHTML = tags
    .filter(t => t.id !== 1)
    .map(t => `<option value="${t.id}">${t.title}</option>`)
    .join('');

  // Заполняем поля
  oknoInput.value = note?.title || '';
  if (note) oknoSelect.value = note.tag;

  // Управление кнопкой "Удалить"
  const delBtn = document.getElementById('delete-btn');
  if (delBtn) delBtn.remove();

  if (note) {
    const btn = document.createElement('button');
    btn.id = 'delete-btn';
    btn.className = 'okno__btn-delete';
    btn.style.background = 'red';
    btn.textContent = 'Удалить';
    btn.onclick = () => {
      notes = notes.filter(n => n.id !== note.id);
      saveNotes(notes);
      render();
      closeModal();
    };
    oknoForm.appendChild(btn);
  }

  overlay.classList.add('overlay_open');
}

function closeModal() {
  overlay.classList.remove('overlay_open');
  editingId = null;
}

// === Сохранение ===
function onSave(e) {
  e.preventDefault();
  const title = oknoInput.value.trim();
  if (!title) return alert('Заголовок не может быть пустым!');

  if (editingId) {
    const note = notes.find(n => n.id === editingId);
    if (note) {
      note.title = title;
      note.tag = +oknoSelect.value;
      note.updateAt = new Date().toDateString();
    }
  } else {
    notes.unshift({
      id: Math.max(0, ...notes.map(n => n.id)) + 1,
      title,
      tag: +oknoSelect.value,
      updateAt: new Date().toDateString()
    });
  }

  saveNotes(notes);
  render();
  closeModal();
}

// === Инициализация ===
function init() {
  // Меню тегов
  menu.append(...tags.map(createTag));

  // Обработчики
  btnPoisk.addEventListener('click', render);
  btnNote.addEventListener('click', () => openModal());
  btnNoteClose.addEventListener('click', closeModal);
  oknoSaveBtn.addEventListener('click', onSave);

  render();
}

init();
