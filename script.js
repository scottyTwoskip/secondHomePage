//NOTES:
// 2. total hours needs to be changed to days hours and mins and seconds
// 3. delete button needs to be added to log list and organize a drop down menu for it
//maybe add a delete option to the drop down menu that deletes selected logs


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
const resetBtn = document.getElementById('resetBtn');
const editResetDropdown = document.getElementById('edit-reset-total-hours');
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
let totalTimeInSeconds = 0

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
//reset btn event listener
resetBtn.addEventListener('click', () => {
    const confirmReset = window.confirm("Are you sure?");

    if (confirmReset) {
        if (isStopwatchRunning) {
            clearInterval(stopwatchInterval);
            isStopwatchRunning = false;
        }
        resetStopwatch();
    } else {
        console.log('Reset cancelled.');
    }
})
//total time
function updateTotalHours() {
    const totalDays = Math.floor(totalTimeInSeconds / (3600 * 24));
    const hoursLeft = totalTimeInSeconds % (3600 * 24);
    const totalHours = Math.floor(hoursLeft / 3600);
    const totalMinutes = Math.floor((hoursLeft % 3600) / 60);
    const totalSeconds = hoursLeft % 60;
    // Formatting total time string to include days, hours, minutes, and seconds
    const formattedTotalTime = `${String(totalDays).padStart(2, '0')} days, ${String(totalHours).padStart(2, '0')} hours, ${String(totalMinutes).padStart(2, '0')} minutes, ${String(totalSeconds).padStart(2, '0')} seconds`;
    document.getElementById('total-hours').textContent = `Total Time: ${formattedTotalTime}`;
}

//logTime and total time event listener
logTimeBtn.addEventListener('click', () => {
    const logItem = document.createElement('li');
    const logTime = formatStopwatch(stopwatchElapsed);
    const now = new Date();
    const logDate = now.toLocaleDateString('en-US');
    const logDateTime = `${logTime} on ${logDate}`;
    logItem.textContent = logDateTime;
    timeLogsList.appendChild(logItem);

    // Delete button creation
    const deleteBtn = document.createElement('button');
    deleteBtn.classList.add('delete-btn')
    deleteBtn.textContent = 'Delete';
    deleteBtn.onclick = function () {
        // Ask for confirmation before deletion
        const isConfirmed = window.confirm("Are you sure you want to delete this log?");
        if (isConfirmed) {
            this.parentElement.remove(); // Removes the parent element (li) if confirmed
        }
    };

    logItem.appendChild(deleteBtn); // Adding the delete button to the log item
    timeLogsList.appendChild(logItem);

    // Total time logic
    const elapsedTimeInSeconds = Math.floor(stopwatchElapsed / 1000);
    totalTimeInSeconds += elapsedTimeInSeconds;
    updateTotalHours();

    // Resets the stopwatch after logging
    resetStopwatch();
    logTimeBtn.classList.add('hidden');
});

//initializing total hours
updateTotalHours()

//reset stopwatch function
function resetStopwatch() {
    stopwatchElapsed = 0
    stopwatchDisplay.textContent = '00:00:00'
    stopwatchStartTime = 0
    clearInterval(stopwatchInterval)
    isStopwatchRunning = false
    startStopBtn.textContent = 'Start'
}
//total hours drop down logic
editResetDropdown.addEventListener('change', () => {
    const selectedAction = editResetDropdown.value
    if (selectedAction === 'reset') {
        const confirmReset = confirm('Are you sure you want to reset the total hours?')
        if (confirmReset) {
            totalTimeInSeconds = 0
            updateTotalHours()
        }
    } else if (selectedAction === 'edit') {
        const newTotalTime = prompt('Enter new total time in HOURS:')
        const hoursToSeconds = parseFloat(newTotalTime) * 3600
        if (!isNaN(hoursToSeconds) && hoursToSeconds >= 0) {
            totalTimeInSeconds = hoursToSeconds
            updateTotalHours()
        } else {
            alert('Invalid total hours input')
        }
    }
    editResetDropdown.value = ''
})

