//target where the to do is going to be entered and where it will be displayed
// track the date, important?, text area text. 
//display these on page when pressing add
//add delete function to list items

//IMPORTANT!!!!!!
//review code before starting
//still need an EDIT BTN!

// Variables
// Get elements from the DOM
const dateInput = document.getElementById('date');
const importantInput = document.getElementById('important-checkbox');
const textArea = document.querySelector('textarea');
const tdlForm = document.getElementById('tdl-form');
const TDL = document.getElementById('to-dos');

tdlForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const li = document.createElement('li');
    let dateContainer;

    if (importantInput.checked) {
        dateContainer = document.createElement('div');
        dateContainer.className = 'date-display important';
        dateContainer.textContent = dateInput.value || "Important";
    } else if (dateInput.value) {
        dateContainer = document.createElement('div');
        dateContainer.className = 'date-display';
        dateContainer.textContent = dateInput.value;
    }

    if (dateContainer) {
        li.appendChild(dateContainer);
    }

    let textSpan = document.createElement('span');
    textSpan.textContent = textArea.value;
    li.appendChild(textSpan);

    // Create a container for the buttons
    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'button-container';

    // Edit button functionality
    const editBtn = document.createElement('button');
    editBtn.className = 'tdlEdit';
    editBtn.textContent = '✏️';
    editBtn.onclick = () => {
        if (editBtn.textContent === '✏️') {
            const textarea = document.createElement('textarea');
            textarea.className = 'editInput';
            textarea.value = textSpan.textContent;
            li.replaceChild(textarea, textSpan);
            textarea.focus();
            editBtn.textContent = '💾';
        } else {
            const textarea = li.querySelector('.editInput');
            const newSpan = document.createElement('span');
            newSpan.textContent = textarea.value;
            li.replaceChild(newSpan, textarea);
            textSpan = newSpan; // Update reference to the new span
            editBtn.textContent = '✏️';
        }
    };

    // Delete button functionality
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'tdlDelete';
    deleteBtn.textContent = '🗑️';
    deleteBtn.onclick = () => {
        if (confirm("Are you sure?")) {
            li.remove();
        }
    };

    // Add buttons to the button container
    buttonContainer.appendChild(editBtn);
    buttonContainer.appendChild(deleteBtn);

    // Add the button container to the list item
    li.appendChild(buttonContainer);

    // Append the new item to the list
    TDL.appendChild(li);
});
