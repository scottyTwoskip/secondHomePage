// Variables
const toDoBtn = document.getElementById('toggle-todo');
const timeTrackerBtn = document.getElementById('toggle-time-tracker');
const toDoMinimize = document.querySelector('.to-do-list-window-button');
const timeTrackerMinimize = document.querySelector('.time-tracker-window-button');
const startStopBtn = document.getElementById('startStopBtn');
const logSessionBtn = document.getElementById('logSessionBtn');
const cancelBtn = document.getElementById('cancelBtn');
const timeContainer = document.getElementById('time-container');
const dateContainer = document.getElementById('date-container');
const toDoList = document.getElementById('to-do-list');
const timeTracker = document.getElementById('time-tracker');
const stopwatchDisplay = document.getElementById('stopwatch');
const timeLogsList = document.getElementById('timeLogs');

let stopwatchInterval = null;
let stopwatchStartTime = null; // Initialize as null for clearer intent on reset
let isStopwatchRunning = false;

// Update Date and Time
function updateDateTime() {
    const now = new Date();
    timeContainer.textContent = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
    dateContainer.textContent = `${now.getMonth() + 1}/${now.getDate()}/${now.getFullYear()}`;
}
setInterval(updateDateTime, 1000);

[toDoBtn, toDoMinimize, timeTrackerBtn, timeTrackerMinimize].forEach(btn => {
    btn.addEventListener('click', () => {
        const target = btn === toDoBtn || btn === toDoMinimize ? toDoList : timeTracker;
        toggleActive(target);
    });
});

function toggleActive(element) {
    element.classList.toggle('active');
    element.classList.toggle('hidden');
}

function updateStopwatch() {
    const now = Date.now();
    const elapsed = now - stopwatchStartTime;
    stopwatchDisplay.textContent = formatStopwatch(elapsed);
}

function formatStopwatch(milliseconds) {
    let totalSeconds = Math.floor(milliseconds / 1000);
    let hours = Math.floor(totalSeconds / 3600);
    totalSeconds %= 3600;
    let minutes = Math.floor(totalSeconds / 60);
    let seconds = totalSeconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

startStopBtn.addEventListener('click', () => {
    if (isStopwatchRunning) {
        clearInterval(stopwatchInterval);
        isStopwatchRunning = false;
        startStopBtn.textContent = 'Start';
        logSessionBtn.classList.remove('hidden');
    } else {
        stopwatchStartTime = Date.now();
        stopwatchInterval = setInterval(updateStopwatch, 1000);
        isStopwatchRunning = true;
        startStopBtn.textContent = 'Stop';
        logSessionBtn.classList.add('hidden');
    }
});

function resetStopwatch() {
    clearInterval(stopwatchInterval);
    stopwatchDisplay.textContent = '00:00:00';
    stopwatchStartTime = null;
    isStopwatchRunning = false;
    startStopBtn.textContent = 'Start';
}

cancelBtn.addEventListener('click', () => {
    if (window.confirm("Are you sure?")) {
        resetStopwatch();
    }
});

logSessionBtn.addEventListener('click', async () => {
    const endTime = new Date().getTime();
    if (stopwatchStartTime && endTime > stopwatchStartTime) {
        await postSession({
            startedAt: stopwatchStartTime,
            endedAt: endTime
        });
        resetStopwatch();
        fetchAndDisplaySessions(); // Refresh session list after logging new session
    }
});

async function postSession(sessionData) {
    try {
        const response = await fetch('http://localhost:3000/api/sessions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ startedAt: sessionData.startedAt, endedAt: sessionData.endedAt }),
        });

        if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.statusText}`);
        }

        logSessionBtn.classList.add('hidden');
    } catch (error) {
        console.error('Error posting session:', error);
    }
    console.log(sessionData)
}

async function fetchAndDisplaySessions() {
    try {
        const response = await fetch('http://localhost:3000/api/sessions');
        if (!response.ok) throw new Error(`Failed to fetch sessions: ${response.statusText}`);

        const sessions = await response.json();
        console.log(sessions)
        timeLogsList.innerHTML = '';
        let totalDuration = 0;

        sessions.forEach(session => {
            const sessionDuration = session.endedAt ? (session.endedAt - session.startedAt) / 1000 : 0;
            totalDuration += sessionDuration;

            const logItem = document.createElement('li');
            logItem.textContent = `${new Date(session.startedAt).toLocaleString()} - Duration: ${formatStopwatch(sessionDuration * 1000)}`;
            timeLogsList.appendChild(logItem);
        });

        document.getElementById('total-hours').textContent = `Total Time: ${formatStopwatch(totalDuration * 1000)}`;
    } catch (error) {
        console.error('Error fetching sessions:', error);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    updateDateTime();
    fetchAndDisplaySessions();
});
