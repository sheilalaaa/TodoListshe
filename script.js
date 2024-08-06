// Menambahkan event listener untuk memuat todos saat konten DOM selesai dimuat
document.addEventListener('DOMContentLoaded', loadTodos);

// Menambahkan event listener untuk menambahkan todo baru saat form disubmit
document.getElementById('todo-form').addEventListener('submit', addTodo);

// Menambahkan event listener untuk memfilter todos saat nilai dropdown filter berubah
document.getElementById('filter').addEventListener('change', filterTodos);

// Fungsi untuk memuat semua todos dari local storage saat halaman dimuat
function loadTodos() {
    const todos = JSON.parse(localStorage.getItem('todos')) || [];
    todos.forEach(todo => displayTodo(todo));
}

// Fungsi untuk menambahkan todo baru
function addTodo(e) {
    e.preventDefault();
    
    // Mendapatkan teks tugas dari input
    const taskText = document.getElementById('new-task').value;
    if (taskText === '') return;

    // Membuat objek todo baru
    const todo = {
        text: taskText,
        completed: false,
        date: new Date().toISOString()
    };

    // Menyimpan todo baru ke local storage
    const todos = JSON.parse(localStorage.getItem('todos')) || [];
    todos.push(todo);
    localStorage.setItem('todos', JSON.stringify(todos));
    
    // Menampilkan todo baru di halaman
    displayTodo(todo);
    document.getElementById('new-task').value = ''; // Mengosongkan input setelah menambahkan tugas
}

// Fungsi untuk menampilkan todo di halaman
function displayTodo(todo) {
    const li = document.createElement('li');
    li.textContent = todo.text;
    li.className = todo.completed ? 'completed' : '';

    // Membuat tombol untuk menandai tugas sebagai selesai atau belum selesai
    const completeButton = document.createElement('button');
    completeButton.textContent = todo.completed ? 'Uncomplete' : 'Complete';
    completeButton.addEventListener('click', function() {
        todo.completed = !todo.completed; // Mengubah status tugas
        updateLocalStorage(todo); // Memperbarui local storage
        li.classList.toggle('completed'); // Menambahkan atau menghapus kelas 'completed'
        completeButton.textContent = todo.completed ? 'Uncomplete' : 'Complete';
        moveTodoElement(li, todo.completed); // Memindahkan elemen todo ke kolom yang sesuai
    });

    // Membuat tombol untuk menghapus tugas
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.addEventListener('click', function() {
        li.remove(); // Menghapus elemen todo dari halaman
        removeTodoFromLocalStorage(todo); // Menghapus todo dari local storage
    });

    // Menambahkan tombol ke elemen li
    li.appendChild(completeButton);
    li.appendChild(deleteButton);

    // Menambahkan elemen li ke kolom yang sesuai
    if (todo.completed) {
        document.getElementById('completed-tasks').appendChild(li);
    } else {
        document.getElementById('uncompleted-tasks').appendChild(li);
    }
}

// Fungsi untuk memperbarui local storage setelah status todo berubah
function updateLocalStorage(updatedTodo) {
    const todos = JSON.parse(localStorage.getItem('todos')) || [];
    const newTodos = todos.map(todo => todo.text === updatedTodo.text ? updatedTodo : todo);
    localStorage.setItem('todos', JSON.stringify(newTodos));
}

// Fungsi untuk menghapus todo dari local storage
function removeTodoFromLocalStorage(todoToRemove) {
    const todos = JSON.parse(localStorage.getItem('todos')) || [];
    const newTodos = todos.filter(todo => todo.text !== todoToRemove.text);
    localStorage.setItem('todos', JSON.stringify(newTodos));
}

// Fungsi untuk memindahkan elemen todo antara kolom uncompleted dan completed
function moveTodoElement(li, completed) {
    if (completed) {
        document.getElementById('completed-tasks').appendChild(li);
    } else {
        document.getElementById('uncompleted-tasks').appendChild(li);
    }
}

// Fungsi untuk memfilter todos berdasarkan status atau tanggal
function filterTodos() {
    const filterValue = document.getElementById('filter').value;
    const todos = JSON.parse(localStorage.getItem('todos')) || [];
    let filteredTodos;

    // Memfilter todos berdasarkan nilai filter
    switch (filterValue) {
        case 'completed':
            filteredTodos = todos.filter(todo => todo.completed);
            break;
        case 'uncompleted':
            filteredTodos = todos.filter(todo => !todo.completed);
            break;
        case 'all':
            filteredTodos = todos;
            break;
        default:
            filteredTodos = todos.filter(todo => todo.date.includes(filterValue));
            break;
    }

    // Mengosongkan daftar todos di halaman
    document.getElementById('uncompleted-tasks').innerHTML = '';
    document.getElementById('completed-tasks').innerHTML = '';

    // Menampilkan todos yang sudah difilter di halaman
    filteredTodos.forEach(todo => displayTodo(todo));
}
