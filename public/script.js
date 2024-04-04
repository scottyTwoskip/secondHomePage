// Variables
const toDoBtn = document.getElementById('toggle-todo');
const timeTrackerBtn = document.getElementById('toggle-time-tracker');
const toDoMinimize = document.querySelector('.to-do-list-window-button');
const timeTrackerMinimize = document.querySelector('.time-tracker-window-button');
const startStopBtn = document.getElementById('startStopBtn');
const logTimeBtn = document.getElementById('logTimeBtn');
const resetBtn = document.getElementById('resetBtn');
const editResetDropdown = document.getElementById('edit-reset-total-hours');
const timeContainer = document.getElementById('time-container');
const dateContainer = document.getElementById('date-container');
const toDoList = document.getElementById('to-do-list');
const timeTracker = document.getElementById('time-tracker');
const stopwatchDisplay = document.getElementById('stopwatch');
const timeLogsList = document.getElementById('timeLogs');

let stopwatchInterval = null;
let stopwatchStartTime = 0;
let stopwatchElapsed = 0;
let isStopwatchRunning = false;
let totalTimeInSeconds = 0;

// Update Date and Time
function updateDateTime() {
    const now = new Date();
    timeContainer.textContent = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
    dateContainer.textContent = `${now.getMonth() + 1}/${now.getDate()}/${now.getFullYear()}`;
}
setInterval(updateDateTime, 1000);

// Toggle Visibility Functions
function toggleActive(element) {
    element.classList.toggle('active');
    element.classList.toggle('hidden');
}

[toDoBtn, toDoMinimize, timeTrackerBtn, timeTrackerMinimize].forEach(btn => {
    btn.addEventListener('click', () => {
        const target = btn === toDoBtn || btn === toDoMinimize ? toDoList : timeTracker;
        toggleActive(target);
    });
});

// Update Stopwatch Display
function updateStopwatch() {
    stopwatchElapsed = Date.now() - stopwatchStartTime;
    stopwatchDisplay.textContent = formatStopwatch(stopwatchElapsed);
}

// Format Stopwatch
function formatStopwatch(milliseconds) {
    let totalSeconds = Math.floor(milliseconds / 1000);
    let minutes = Math.floor(totalSeconds / 60);
    let seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

// Start/Stop Button
startStopBtn.addEventListener('click', () => {
    if (isStopwatchRunning) {
        clearInterval(stopwatchInterval);
        isStopwatchRunning = false;
        startStopBtn.textContent = 'Start';
        logTimeBtn.classList.remove('hidden');
    } else {
        stopwatchStartTime = Date.now()
        stopwatchInterval = setInterval(updateStopwatch, 1000);
        isStopwatchRunning = true;
        startStopBtn.textContent = 'Stop';
        logTimeBtn.classList.add('hidden');
    }
});

// Reset Stopwatch
function resetStopwatch() {
    stopwatchElapsed = 0;
    stopwatchDisplay.textContent = '00:00';
    stopwatchStartTime = 0;
    clearInterval(stopwatchInterval);
    isStopwatchRunning = false;
    startStopBtn.textContent = 'Start';
}

// Reset Button Event Listener
resetBtn.addEventListener('click', () => {
    if (window.confirm("Are you sure?")) {
        resetStopwatch();
    }
});

// Log Time and Total Time Event Listener
logTimeBtn.addEventListener('click', async () => {
    // Assuming a separate function to handle POST request for log
    postLog({
        seconds: Math.floor(stopwatchElapsed / 1000),
        date: new Date().toISOString()
    });
    resetStopwatch();
});

// Function to Post a New Log
async function postLog(logData) {
    try {
        const response = await fetch('http://localhost:3000/api/logs', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(logData),
        });

        if (!response.ok) throw new Error('Network response was not ok');

        logTimeBtn.classList.add('hidden');
        // Call fetchLogs() if you have it to refresh the list of logs
    } catch (error) {
        console.error('Error adding log:', error);
    }
}
async function fetchLogs() {
    try {
        const response = await fetch('http://localhost:3000/api/logs');
        if (!response.ok) throw new Error('Failed to fetch logs');

        const logs = await response.json();
        timeLogsList.innerHTML = ''; // Clear existing logs from the list
        logs.forEach(log => {
            const logItem = document.createElement('li');
            logItem.textContent = `${new Date(log.date).toLocaleDateString('en-US')} - ${formatStopwatch(log.seconds * 1000)}`;
            // Add delete functionality to each log
            const deleteBtn = createDeleteButton(log._id);
            logItem.appendChild(deleteBtn);
            timeLogsList.appendChild(logItem);
        });
    } catch (error) {
        console.error('Error fetching logs:', error);
    }
}

// Create Delete Button for Each Log
function createDeleteButton(logId) {
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.classList.add('delete-btn');
    deleteBtn.onclick = () => deleteLog(logId);
    return deleteBtn;
}

// Delete Log Function
async function deleteLog(logId) {
    if (!window.confirm('Are you sure you want to delete this log?')) return;
    try {
        const response = await fetch(`/api/logs/${logId}`, {
            method: 'DELETE',
        });
        if (!response.ok) throw new Error('Failed to delete log');
        fetchLogs(); // Refresh the logs displayed
    } catch (error) {
        console.error('Error deleting log:', error);
    }
}

// Function to Fetch and Display Total Time
async function fetchAndDisplayTotalTime() {
    try {
        const response = await fetch('/api/totalTime');
        if (!response.ok) throw new Error('Failed to fetch total time');

        const { totalTime } = await response.json();
        totalTimeInSeconds = totalTime; // Update the global totalTimeInSeconds variable
        updateTotalHours(); // Update the display
    } catch (error) {
        console.error('Error fetching total time:', error);
    }
}

// Modify logTimeBtn click event listener to update total time
logTimeBtn.addEventListener('click', async () => {
    const totalTimeInSeconds = Math.floor(stopwatchElapsed / 1000);
    try {
        await fetch('/api/totalTime', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ totalTimeInSeconds, startedAt: stopwatchStartTime }),
        });
        fetchAndDisplayTotalTime();
    } catch (error) {
        console.error('Error updating total time:', error);
    }
    resetStopwatch();
});

// Initialization
document.addEventListener('DOMContentLoaded', () => {
    updateDateTime();
    fetchAndDisplayTotalTime();
    fetchLogs();
});

