//target where the to do is going to be entered and where it will be displayed
// track the date, important?, text area text. 
//display these on page when pressing add

//variables
const dateInput = document.getElementById('date')
const importantInput = document.getElementById('important-checkbox')
const textArea = document.querySelector('textarea')
const tdlForm = document.getElementById('tdl-form')

tdlForm.addEventListener('submit', (e) => {
    e.preventDefault()

    console.log(`${dateInput.value}`)
    console.log(importantInput.checked)
    console.log(textArea.value)
})
