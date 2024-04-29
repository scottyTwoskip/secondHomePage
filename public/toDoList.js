document.addEventListener('DOMContentLoaded', () => {
    loadToDos()
})

const dateInput = document.getElementById('date')
const importantInput = document.getElementById('important-checkbox')
const textArea = document.querySelector('textarea')
const tdlForm = document.getElementById('tdl-form')
const TDL = document.getElementById('to-dos')

// Loads To-Dos from the backend
async function loadToDos() {
    try {
        const response = await fetch('http://localhost:3000/api/toDos')
        if (!response.ok) {
            throw new Error('Failed to fetch todos')
        }
        const todos = await response.json()
        todos.forEach(todo => addTodoToList(todo))
    } catch (error) {
        console.error('Error loading To-Dos:', error.message)
    }
}

// Handles new To-Do form submissions
tdlForm.addEventListener('submit', async (e) => {
    e.preventDefault()

    let isoDate = ''
    if (dateInput.value) {
        isoDate = new Date(`${dateInput.value}T00:00:00`).toISOString()
    }

    const toDoData = {
        date: isoDate,
        toDo: textArea.value,
        important: importantInput.checked
    }

    try {
        const response = await fetch('http://localhost:3000/api/toDos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(toDoData)
        })
        if (!response.ok) {
            throw new Error('Failed to create a new ToDo')
        }
        const newTodo = await response.json()
        addTodoToList(newTodo)
        textArea.value = ''
        importantInput.checked = false
        dateInput.value = ''
    } catch (error) {
        console.error('Error creating To-Do:', error.message)
    }
})

// Adds a To-Do item to the DOM
function addTodoToList(todo) {
    const li = document.createElement('li')
    li.id = `todo-${todo._id}`

    if (todo.date || todo.important) {
        const dateContainer = document.createElement('div')
        dateContainer.className = todo.date && !todo.important ? 'date-display' : (todo.important ? 'date-display important' : '')
        dateContainer.textContent = todo.date ? new Date(todo.date).toLocaleDateString() : 'Important!'
        li.appendChild(dateContainer)
    }

    const textSpan = document.createElement('span')
    textSpan.textContent = todo.toDo
    li.appendChild(textSpan)

    const buttonContainer = createButtonContainer(todo)
    li.appendChild(buttonContainer)

    TDL.appendChild(li)
}

// Creates buttons for editing and deleting a To-Do
function createButtonContainer(todo) {
    const buttonContainer = document.createElement('div')
    buttonContainer.className = 'button-container'

    const editBtn = createEditButton(todo)
    const deleteBtn = createDeleteButton(todo._id)

    buttonContainer.appendChild(editBtn)
    buttonContainer.appendChild(deleteBtn)

    return buttonContainer
}

// Toggles between edit and save modes for a To-Do item
function toggleEditSave(todo, editBtn) {
    const listItem = document.getElementById(`todo-${todo._id}`)
    if (!listItem) {
        console.error('List item not found.')
        return
    }

    const currentTextDisplay = listItem.querySelector('span') || listItem.querySelector('textarea')
    if (!currentTextDisplay) {
        console.error('Text display element not found.')
        return
    }

    if (editBtn.textContent === '✏️') {
        const textarea = document.createElement('textarea')
        textarea.className = 'editInput'
        textarea.value = currentTextDisplay.textContent
        currentTextDisplay.replaceWith(textarea)
        textarea.focus()
        editBtn.textContent = '💾'
    } else {
        const updatedText = listItem.querySelector('textarea').value
        updateToDo(todo._id, { toDo: updatedText }).then(() => {
            const newSpan = document.createElement('span')
            newSpan.textContent = updatedText
            listItem.querySelector('textarea').replaceWith(newSpan)
            editBtn.textContent = '✏️'
        }).catch(error => console.error('Failed to update ToDo:', error))
    }
}

// Creates the edit button for a To-Do
function createEditButton(todo) {
    const editBtn = document.createElement('button')
    editBtn.className = 'tdlEdit'
    editBtn.textContent = '✏️'
    editBtn.addEventListener('click', () => toggleEditSave(todo, editBtn))
    return editBtn
}

// Creates the delete button for a To-Do
function createDeleteButton(id) {
    const deleteBtn = document.createElement('button')
    deleteBtn.className = 'tdlDelete'
    deleteBtn.textContent = '🗑️'
    deleteBtn.onclick = async () => {
        if (confirm("Are you sure?")) {
            const response = await fetch(`http://localhost:3000/api/toDos/${id}`, {
                method: 'DELETE'
            })
            if (response.ok) {
                document.getElementById(`todo-${id}`).remove()
            } else {
                console.error('Failed to delete ToDo')
            }
        }
    }

    return deleteBtn
}

// Updates a To-Do in the backend
async function updateToDo(id, data) {
    try {
        const response = await fetch(`http://localhost:3000/api/toDos/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        if (!response.ok) {
            throw new Error('Failed to update ToDo')
        }
    } catch (error) {
        console.error('Error updating ToDo:', error.message)
    }
}
