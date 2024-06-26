// Variables
const startStopBtn = document.getElementById('startStopBtn');
const logSessionBtn = document.getElementById('logSessionBtn');
const cancelBtn = document.getElementById('cancelBtn');
const timeContainer = document.getElementById('time-container');
const dateContainer = document.getElementById('date-container');
const stopwatchDisplay = document.getElementById('stopwatch');
const sessionLogsList = document.getElementById('sessionLogs');
const addSessionBtn = document.getElementById('addSessionBtn');
const addSessionInput = document.getElementById('addSessionInput'); // New input field

let stopwatchInterval = null;
let stopwatchStartTime = null;
let isStopwatchRunning = false;
let accumulatedTime = 0;

// Update Date and Time
function updateDateTime() {
    const now = new Date();
    timeContainer.textContent = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
    dateContainer.textContent = `${now.getMonth() + 1}/${now.getDate()}/${now.getFullYear()}`;
}
setInterval(updateDateTime, 1000);

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
        const now = Date.now();
        accumulatedTime += now - stopwatchStartTime;
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
    accumulatedTime = 0;
    isStopwatchRunning = false;
    startStopBtn.textContent = 'Start';
}

cancelBtn.addEventListener('click', () => {
    if (window.confirm("Are you sure?")) {
        resetStopwatch();
    }
});

logSessionBtn.addEventListener('click', async () => {
    if (accumulatedTime > 0) {
        const endedAt = stopwatchStartTime + accumulatedTime;
        await postSession({
            startedAt: stopwatchStartTime,
            endedAt: endedAt
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
            throw new Error(`Network response was not ok: ${response.statusText}`)
        }

        logSessionBtn.classList.add('hidden')
    } catch (error) {
        console.error('Error posting session:', error)
    }
}

async function fetchAndDisplaySessions() {
    try {
        const response = await fetch('http://localhost:3000/api/sessions')
        if (!response.ok) throw new Error(`Failed to fetch sessions: ${response.statusText}`)

        const sessions = await response.json()
        const sessionLogsList = document.getElementById('sessionLogs')
        sessionLogsList.innerHTML = ''
        let totalDuration = 0

        sessions.forEach(session => {
            const sessionDuration = session.endedAt ? (session.endedAt - session.startedAt) / 1000 : 0
            totalDuration += sessionDuration


            const logItem = document.createElement('li')


            const dateTimeSpan = document.createElement('span')
            dateTimeSpan.className = 'date-time'
            dateTimeSpan.textContent = new Date(session.startedAt).toLocaleString(undefined, {
                year: 'numeric', month: 'short', day: 'numeric',
                hour: '2-digit', minute: '2-digit', second: '2-digit'
            });
            logItem.appendChild(dateTimeSpan)


            const durationSpan = document.createElement('span')
            durationSpan.className = 'duration'
            durationSpan.textContent = ` - Duration: ${formatStopwatch(sessionDuration * 1000)}`
            logItem.appendChild(durationSpan)

            const sessionDeleteBtn = document.createElement('button')
            sessionDeleteBtn.textContent = 'Delete'
            sessionDeleteBtn.className = 'session-delete-btn'
            sessionDeleteBtn.onclick = () => deleteSession(session._id)
            logItem.appendChild(sessionDeleteBtn)

            sessionLogsList.appendChild(logItem)
        });

        document.getElementById('total-hours').textContent = `Total Time: ${formatStopwatch(totalDuration * 1000)}`
    } catch (error) {
        console.error('Error fetching sessions:', error)
    }
}


async function addSession(sessionData) {
    try {
        const response = await fetch('http://localhost:3000/api/sessions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(sessionData),
        });

        if (!response.ok) {
            throw new Error(`Failed to add session: ${response.statusText}`);
        }

        fetchAndDisplaySessions(); // Refresh session list after adding a new session
    } catch (error) {
        console.error('Error adding session:', error);
    }
}


addSessionBtn.addEventListener('click', () => {
    // Toggle visibility of the input field
    addSessionInput.classList.toggle('hidden');
});

addSessionInput.addEventListener('keyup', (event) => {
    if (event.key === 'Enter') {
        const durationString = addSessionInput.value.trim();
        if (durationString === '') {
            return; // Empty input
        }

        const durationMinutes = parseInt(durationString);
        if (isNaN(durationMinutes) || durationMinutes <= 0) {
            alert('Please enter a valid duration in minutes.');
            return;
        }

        const durationMilliseconds = durationMinutes * 60 * 1000;
        const startedAt = Date.now() - durationMilliseconds;
        const endedAt = Date.now();

        addSession({ startedAt, endedAt });

        // Clear input field and hide it
        addSessionInput.value = '';
        addSessionInput.classList.add('hidden');
    }
});


async function deleteSession(sessionId) {
    const confirmSessionDelete = window.confirm('are you sure you want to delete this session?')
    if (confirmSessionDelete) {
        try {
            const response = await fetch(`http://localhost:3000/api/sessions/${sessionId}`, {
                method: 'DELETE'
            })
            if (!response.ok) {
                throw new Error('failed to delete session')
            }
            //deleting from front end here by reseting
            fetchAndDisplaySessions()
        } catch (error) {
            console.error('error deleting session:', error)
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    updateDateTime()
    fetchAndDisplaySessions()
});
