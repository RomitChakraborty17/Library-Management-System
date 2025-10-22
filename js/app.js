// Simple client-side library manager using localStorage
const STORAGE_KEY = 'web-library-books';
let books = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');

const form = document.getElementById('bookForm');
const tbody = document.querySelector('#books tbody');
const search = document.getElementById('search');
const clearStorage = document.getElementById('clearStorage');

function save() { localStorage.setItem(STORAGE_KEY, JSON.stringify(books)); }
function render(filter=''){
  tbody.innerHTML='';
  const rows = books.filter(b => (b.title + ' ' + b.author).toLowerCase().includes(filter.toLowerCase()));
  for(const b of rows){
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${escapeHtml(b.title)}</td><td>${escapeHtml(b.author)}</td><td>${escapeHtml(b.year||'')}</td><td>
      <button class="action" data-id="${b.id}" data-action="edit">Edit</button>
      <button class="action" data-id="${b.id}" data-action="delete">Delete</button>
    </td>`;
    tbody.appendChild(tr);
  }
}

function escapeHtml(s){ return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

form.addEventListener('submit', e => {
  e.preventDefault();
  const title = document.getElementById('title').value.trim();
  const author = document.getElementById('author').value.trim();
  const year = document.getElementById('year').value.trim();
  if(!title || !author) return alert('Title and Author required');

  const idField = form.getAttribute('data-edit-id');
  if(idField){
    const idx = books.findIndex(x=>x.id===idField);
    if(idx>=0){ books[idx].title = title; books[idx].author = author; books[idx].year = year; }
    form.removeAttribute('data-edit-id');
  } else {
    books.push({ id: Date.now().toString(36), title, author, year });
  }
  save(); render(search.value);
  form.reset();
});

tbody.addEventListener('click', e=>{
  const btn = e.target.closest('button'); if(!btn) return;
  const id = btn.dataset.id; const action = btn.dataset.action;
  if(action==='delete'){ books = books.filter(b=>b.id!==id); save(); render(search.value); }
  if(action==='edit'){ const b = books.find(x=>x.id===id); if(!b) return; document.getElementById('title').value = b.title; document.getElementById('author').value = b.author; document.getElementById('year').value = b.year || ''; form.setAttribute('data-edit-id', b.id); }
});

search.addEventListener('input', ()=> render(search.value));
clearStorage.addEventListener('click', ()=>{ if(confirm('Clear all books?')){ books=[]; save(); render(); } });

render();
