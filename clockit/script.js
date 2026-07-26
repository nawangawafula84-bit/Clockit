// CLOCK
function updateClock() {
  const now = new Date();
  document.getElementById("time").textContent = now.toLocaleTimeString();
  document.getElementById("date").textContent = now.toDateString();
}
setInterval(updateClock, 1000);

// ALARMS
let alarms = [];
function setAlarm() {
  const alarmTime = document.getElementById("alarm-time").value;
  if (!alarmTime) return;
  alarms.push(alarmTime);
  renderAlarms();
}

function renderAlarms() {
  const list = document.getElementById("alarm-list");
  list.innerHTML = "";
  alarms.forEach(time => {
    const li = document.createElement("li");
    li.textContent = time;
    list.appendChild(li);
  });
}

setInterval(() => {
  const now = new Date().toTimeString().slice(0,5);
  alarms.forEach(time => {
    if (time === now) {
      notify("Alarm ringing at " + time);
      showIsland("Alarm: " + time, "alarm");
      playSound("alarm-sound");
    }
  });
}, 1000);

// STOPWATCH
let stopwatchInterval;
let stopwatchTime = 0;

function startStopwatch() {
  if (stopwatchInterval) return;
  stopwatchInterval = setInterval(() => {
    stopwatchTime++;
    document.getElementById("stopwatch-display").textContent =
      new Date(stopwatchTime * 1000).toISOString().substr(11, 8);
  }, 1000);
}

function stopStopwatch() {
  clearInterval(stopwatchInterval);
  stopwatchInterval = null;
  showIsland("Stopwatch stopped", "stopwatch");
  playSound("stopwatch-sound");
}

function resetStopwatch() {
  stopStopwatch();
  stopwatchTime = 0;
  document.getElementById("stopwatch-display").textContent = "00:00:00";
}

// TIMER
let timerInterval;
let timerRemaining = 0;

function startTimer() {
  const minutes = parseInt(document.getElementById("timer-minutes").value);
  if (!minutes) return;
  timerRemaining = minutes * 60;
  updateTimerDisplay();

  clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    timerRemaining--;
    updateTimerDisplay();
    if (timerRemaining <= 0) {
      clearInterval(timerInterval);
      notify("Timer finished!");
      showIsland("Timer Done!", "timer");
      playSound("timer-sound");
    }
  }, 1000);
}

function updateTimerDisplay() {
  const mins = Math.floor(timerRemaining / 60);
  const secs = timerRemaining % 60;
  document.getElementById("timer-display").textContent =
    `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

// NOTIFICATIONS
function notify(msg) {
  if (Notification.permission === "granted") {
    new Notification(msg);
  } else if (Notification.permission !== "denied") {
    Notification.requestPermission().then(permission => {
      if (permission === "granted") {
        new Notification(msg);
      }
    });
  }
}

// SOUND
function playSound(id) {
  const sound = document.getElementById(id);
  if (sound) {
    sound.currentTime = 0;
    sound.play();
  }
}

// DYNAMIC ISLAND
function showIsland(message, type="alarm") {
  const island = document.getElementById("dynamic-island");
  const icon = document.getElementById("island-icon");

  let symbol = "⏰"; 
  let cssClass = "alarm-icon";

  if (type === "timer") { symbol = "⏳"; cssClass = "timer-icon"; }
  if (type