//variables
//mainpage buttons
const toDoBtn = document.getElementById('toggle-todo')
const timeTrackerBtn = document.getElementById('toggle-time-tracker')
//minimize buttons
const toDoMinimize = document.querySelector('.to-do-list-window-button')
const timeTrackerMinimize = document.querySelector('.time-tracker-window-button')
//divs
const timeContainer = document.getElementById('time-container')
const dateContainer = document.getElementById('date-container')
const toDoList = document.getElementById('to-do-list')
const timeTracker = document.getElementById('time-tracker');


//time and date
function updateDateTime() {
    const now = new Date()
    //time
    const hours = String(now.getHours()).padStart(2, '0')
    const mins = String(now.getMinutes()).padStart(2, '0')
    const seconds = String(now.getSeconds()).padStart(2, '0')
    const currentTime = `${hours}:${mins}:${seconds}`
    //date
    const month = String(now.getMonth() + 1).padStart(2, '0'); // getMonth() is zero-based; add 1
    const day = String(now.getDate()).padStart(2, '0');
    const year = now.getFullYear();
    const currentDate = `${month}/${day}/${year}`;
    //add
    timeContainer.textContent = currentTime
    dateContainer.textContent = currentDate
}


//this updates time and date every second
setInterval(updateDateTime, 1000)
updateDateTime()

//toggle apps functionallity 
function toggleActive(element) {
    element.classList.toggle('active')
    element.classList.toggle('hidden')
}
//toggle tdl visibility
toDoBtn.addEventListener('click', () => {
    toggleActive(toDoList)
})
toDoMinimize.addEventListener('click', () => {
    toggleActive(toDoList)
})
//toggle time tracker visibility
timeTrackerBtn.addEventListener('click', () => {
    toggleActive(timeTracker)
})
timeTrackerMinimize.addEventListener('click', () => {
    toggleActive(timeTracker)
})
