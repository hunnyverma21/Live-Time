const timeDisplay = document.getElementById("timeDisplay");
const periodDisplay = document.getElementById("period");
const dateLabel = document.getElementById("dateLabel");
const locationLabel = document.getElementById("locationLabel");
const timezoneLabel = document.getElementById("timezoneLabel");
const timezoneSelect = document.getElementById("timezoneSelect");
const format12 = document.getElementById("format12");
const format24 = document.getElementById("format24");

let selectedZone = timezoneSelect.value;
let use24Hour = false;

function getTimeParts(timeZone, hour12) {
  const now = new Date();
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12
  });
  return formatter.formatToParts(now).reduce((acc, part) => {
    if (part.type !== "literal") acc[part.type] = part.value;
    return acc;
  }, {});
}

function updateMainClock() {
  const selectedOption = timezoneSelect.options[timezoneSelect.selectedIndex];
  const label = selectedOption.dataset.label || selectedOption.textContent;
  const parts = getTimeParts(selectedZone, !use24Hour);
  timeDisplay.textContent = `${parts.hour}:${parts.minute}:${parts.second}`;
  periodDisplay.textContent = use24Hour ? "" : (parts.dayPeriod || "");
  locationLabel.textContent = label;
  timezoneLabel.textContent = selectedZone;
  dateLabel.textContent = new Intl.DateTimeFormat("en-US", {
    timeZone: selectedZone, weekday: "long", day: "numeric", month: "long", year: "numeric"
  }).format(new Date());
}

function updateMiniClock(id, zone) {
  document.getElementById(id).textContent = new Intl.DateTimeFormat("en-US", {
    timeZone: zone, hour: "2-digit", minute: "2-digit", hour12: !use24Hour
  }).format(new Date());
}

function updateAll() {
  updateMainClock();
  updateMiniClock("nyTime", "America/New_York");
  updateMiniClock("londonTime", "Europe/London");
  updateMiniClock("tokyoTime", "Asia/Tokyo");
}

timezoneSelect.addEventListener("change", (event) => {
  selectedZone = event.target.value;
  updateAll();
});

function setFormat(is24) {
  use24Hour = is24;
  format12.classList.toggle("active", !is24);
  format24.classList.toggle("active", is24);
  format12.setAttribute("aria-pressed", String(!is24));
  format24.setAttribute("aria-pressed", String(is24));
  updateAll();
}
format12.addEventListener("click", () => setFormat(false));
format24.addEventListener("click", () => setFormat(true));

setFormat(false);
updateAll();
setInterval(updateAll, 1000);
