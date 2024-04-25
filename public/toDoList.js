//target where the to do is going to be entered and where it will be displayed
// track the date, important?, text area text. 
//display these on page when pressing add

//variables
const dateInput = document.getElementById('date')
const importantInput = document.getElementById('important-checkbox')
const textArea = document.querySelector('textarea')
const tdlForm = document.getElementById('tdl-form')
const TDL = document.getElementById('to-dos')

tdlForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const li = document.createElement('li');
    let dateContainer;  // This will hold the div element for the date

    if (importantInput.checked) {
        dateContainer = document.createElement('div');
        dateContainer.className = 'date-display important'; // Both classes are on the same div
        dateContainer.textContent = dateInput.value ? dateInput.value : "Important";
    } else {
        if (dateInput.value) {
            dateContainer = document.createElement('div');
            dateContainer.className = 'date-display';
            dateContainer.textContent = dateInput.value;
        }
    }

    // Add the date container if it exists
    if (dateContainer) {
        li.appendChild(dateContainer);
    }

    // Add the text area content
    li.appendChild(document.createTextNode(textArea.value));

    // Append the new li to the TDL list
    TDL.appendChild(li);
});

