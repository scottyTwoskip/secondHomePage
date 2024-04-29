document.addEventListener('DOMContentLoaded', () => {
    loadToDos();
});

const dateInput = document.getElementById('date');
const importantInput = document.getElementById('important-checkbox');
const textArea = document.querySelector('textarea');
const tdlForm = document.getElementById('tdl-form');
const TDL = document.getElementById('to-dos');

async function loadToDos() {
    try {
        const response = await fetch('http://localhost:3000/api/toDos');
        if (!response.ok) {
            throw new Error('Failed to fetch todos');
        }
        const todos = await response.json();
        todos.forEach(todo => addTodoToList(todo));
    } catch (error) {
        console.error('Error loading To-Dos:', error.message);
    }
}

tdlForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const toDoData = {
        date: dateInput.value,
        toDo: textArea.value,
        important: importantInput.checked
    };

    try {
        const response = await fetch('http://localhost:3000/api/toDos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(toDoData)
        });
        if (!response.ok) {
            throw new Error('Failed to create a new ToDo');
        }
        const newTodo = await response.json();
        addTodoToList(newTodo);
        textArea.value = '';
        importantInput.checked = false;
        dateInput.value = '';
    } catch (error) {
        console.error('Error creating To-Do:', error.message);
    }
});

function addTodoToList(todo) {
    const li = document.createElement('li');
    li.id = `todo-${todo._id}`;

    if (todo.date || todo.important) {
        const dateContainer = document.createElement('div');
        dateContainer.className = todo.date && !todo.important ? 'date-display' : (todo.important ? 'date-display important' : '');
        dateContainer.textContent = todo.date ? new Date(todo.date).toLocaleDateString() : 'Important!';
        li.appendChild(dateContainer);
    }

    const textSpan = document.createElement('span');
    textSpan.textContent = todo.toDo;
    li.appendChild(textSpan);

    const buttonContainer = createButtonContainer(todo);
    li.appendChild(buttonContainer);

    TDL.appendChild(li);
}

function createButtonContainer(todo) {
    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'button-container';

    const editBtn = createEditButton(todo);
    const deleteBtn = createDeleteButton(todo._id);

    buttonContainer.appendChild(editBtn);
    buttonContainer.appendChild(deleteBtn);

    return buttonContainer;
}

function createEditButton(todo) {
    const editBtn = document.createElement('button');
    editBtn.className = 'tdlEdit';
    editBtn.textContent = '✏️';
    editBtn.onclick = () => {
        const textarea = document.createElement('textarea');
        textarea.className = 'editInput';
        textarea.value = todo.toDo;
        const textSpan = document.getElementById(`todo-${todo._id}`).querySelector('span');
        textSpan.parentNode.replaceChild(textarea, textSpan);
        textarea.focus();
        editBtn.textContent = '💾';
        editBtn.onclick = async () => {
            const updatedText = textarea.value;
            updateToDo(todo._id, { toDo: updatedText });
            const newSpan = document.createElement('span');
            newSpan.textContent = updatedText;
            textarea.parentNode.replaceChild(newSpan, textarea);
            editBtn.textContent = '✏️';
        };
    };

    return editBtn;
}

function createDeleteButton(id) {
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'tdlDelete';
    deleteBtn.textContent = '🗑️';
    deleteBtn.onclick = async () => {
        if (confirm("Are you sure?")) {
            const response = await fetch(`http://localhost:3000/api/toDos/${id}`, {
                method: 'DELETE'
            });
            if (response.ok) {
                document.getElementById(`todo-${id}`).remove();
            } else {
                console.error('Failed to delete ToDo');
            }
        }
    };

    return deleteBtn;
}

async function updateToDo(id, data) {
    try {
        const response = await fetch(`http://localhost:3000/api/toDos/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        if (!response.ok) {
            throw new Error('Failed to update ToDo');
        }
    } catch (error) {
        console.error('Error updating ToDo:', error.message);
    }
}
