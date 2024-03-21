//variables
//mainpage buttons
const toDoBtn = document.getElementById('toggle-todo')
const timeTrackerBtn = document.getElementById('toggle-time-tracker')
//minimize buttons
const toDoMinimize = document.querySelector('.to-do-list-window-button')
const timeTrackerMinimize = document.querySelector('.time-tracker-window-button')
//time-tracker buttons
const startStopBtn = document.getElementById('startStopBtn');
const logTimeBtn = document.getElementById('logTimeBtn')
//divs
const timeContainer = document.getElementById('time-container')
const dateContainer = document.getElementById('date-container')
//tdl divs
const toDoList = document.getElementById('to-do-list')
//time-tracker divs
const timeTracker = document.getElementById('time-tracker');
const stopwatchDisplay = document.getElementById('stopwatch');
const timeLogsList = document.getElementById('timeLogs')



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

//timeTracker starts here:
let stopwatchInterval = null;
let stopwatchStartTime = 0;
let stopwatchElapsed = 0;
let isStopwatchRunning = false;

//function to update stopwatch display
function updateStopwatch() {
    const now = Date.now()
    const elapsedTime = now - stopwatchStartTime
    stopwatchElapsed = elapsedTime
    stopwatchDisplay.textContent = formatStopwatch(stopwatchElapsed)
}

//format stopwatch here
function formatStopwatch(milliseconds) {
    let totalSeconds = Math.floor(milliseconds / 1000)
    let minutes = Math.floor(totalSeconds / 60)
    let seconds = totalSeconds % 60;
    let millisecondsDisplay = milliseconds % 1000

    minutes = String(minutes).padStart(2, '0')
    seconds = String(seconds).padStart(2, '0')
    millisecondsDisplay = String(millisecondsDisplay).padStart(3, '0').substring(0, 2)

    return `${minutes}:${seconds}.${millisecondsDisplay}`
}
// event listener for start btn
startStopBtn.addEventListener('click', () => {
    if (isStopwatchRunning) {
        clearInterval(stopwatchInterval)
        isStopwatchRunning = false
        startStopBtn.textContent = 'Start'
        if (stopwatchElapsed > 0) {
            logTimeBtn.classList.remove('hidden')
        }
    } else {
        if (!stopwatchElapsed) {
            stopwatchStartTime = Date.now()
        } else {
            stopwatchStartTime = Date.now() - stopwatchElapsed
        }
        stopwatchInterval = setInterval(updateStopwatch, 10)
        isStopwatchRunning = true
        startStopBtn.textContent = 'Stop'
        logTimeBtn.classList.add('hidden')
    }
})

//logTime event listener
logTimeBtn.addEventListener('click', () => {
    const logItem = document.createElement('li')
    const logTime = formatStopwatch(stopwatchElapsed)
    const now = new Date()
    const logDate = now.toLocaleDateString('en-US')
    const logDateTime = `${logTime} on ${logDate}`
    logItem.textContent = logDateTime
    timeLogsList.appendChild(logItem)
    //after logging, resets the stop watch
    resetStopwatch()
    logTimeBtn.classList.add('hidden')
})

//reset stopwatch function
function resetStopwatch() {
    stopwatchElapsed = 0
    stopwatchDisplay.textContent = '00:00:00'
    stopwatchStartTime = 0
    clearInterval(stopwatchInterval)
    isStopwatchRunning = false
    startStopBtn.textContent = 'Start'
}



