
// =========================
// CALENDAR MODULE
// =========================
const CalendarModule = (() => {

  // =========================
  // STATE INTERNE
  // =========================
  let activeContext = null;   // { noteId, type, stepId }
  let activeElement = null;   // élément DOM cliqué
  let currentDate = new Date();

  // =========================
  // DOM
  // =========================
  const calendar = document.getElementById("calendar");
  const grid = calendar.querySelector(".calendar-grid");
  const monthLabel = calendar.querySelector(".month");
  const prevBtn = calendar.querySelector(".prev");
  const nextBtn = calendar.querySelector(".next");

  // =========================
  // OUVERTURE
  // =========================
  function open(context, element) {
    activeContext = context;
    activeElement = element;

    const isoDate = getDateFromContext();

    // on convertit ISO → Date uniquement ici
    currentDate = isoDate
      ? new Date(isoDate + "T00:00:00")
      : new Date();

    positionCalendar(element);
    render();

    calendar.classList.remove("hidden");
  }

  // =========================
  // FERMETURE
  // =========================
  function close() {
    calendar.classList.add("hidden");
    activeContext = null;
    activeElement = null;
  }

  // =========================
  // LECTURE DATA (ISO)
  // =========================
  function getDateFromContext() {
    if (!activeContext) return null;

    const { noteId, type, stepId } = activeContext;
    const note = allUserNoteList[noteId];
    if (!note) return null;

    if (type === "dateStart") return note.dateStart;
    if (type === "dateEnd") return note.dateEnd;

    if (type === "step") {
      const step = note.stepArray.find(s => s.id === stepId);
      return step?.date || null;
    }

    return null;
  }

  // =========================
  // ECRITURE DATA (ISO)
  // =========================
  function setDateToContext(dateObj) {
    if (!activeContext) return;

    const { noteId, type, stepId } = activeContext;
    const note = allUserNoteList[noteId];
    if (!note) return;

    const iso = formatDateISO(dateObj);

    if (type === "dateStart") note.dateStart = iso;
    if (type === "dateEnd") note.dateEnd = iso;

    if (type === "step") {
      const step = note.stepArray.find(s => s.id === stepId);
      if (step) step.date = iso;
    }

    updateUI(iso);
  }

  // =========================
  // UPDATE DOM
  // =========================
  function updateUI(isoDate) {
    if (!activeElement) return;

    activeElement.textContent = formatDateFR(isoDate);
  }

  // =========================
  // RENDER CALENDRIER
  // =========================
  function render() {
    grid.innerHTML = "";

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const selectedISO = getDateFromContext();
    const selectedDate = selectedISO
      ? new Date(selectedISO + "T00:00:00")
      : null;

    // label mois
    monthLabel.textContent = currentDate.toLocaleDateString("fr-FR", {
      month: "long",
      year: "numeric"
    });

    // offset lundi
    const offset = (firstDay + 6) % 7;

    // cases vides
    for (let i = 0; i < offset; i++) {
      grid.appendChild(document.createElement("div"));
    }

    // jours
    for (let day = 1; day <= daysInMonth; day++) {
      const d = new Date(year, month, day);

      const div = document.createElement("div");
      div.classList.add("day");
      div.textContent = day;

      // highlight sélection
      if (selectedDate && d.toDateString() === selectedDate.toDateString()) {
        div.classList.add("selected");
      }

      div.addEventListener("click", (e) => {
        e.stopPropagation();
        setDateToContext(d);
        close();
      });

      grid.appendChild(div);
    }
  }

  // =========================
  // NAVIGATION MOIS
  // =========================
  prevBtn.onclick = (e) => {
    e.stopPropagation();
    currentDate.setMonth(currentDate.getMonth() - 1);
    render();
  };

  nextBtn.onclick = (e) => {
    e.stopPropagation();
    currentDate.setMonth(currentDate.getMonth() + 1);
    render();
  };

  // =========================
  // POSITION POPUP
  // =========================
  function positionCalendar(element) {
    const rect = element.getBoundingClientRect();

    calendar.style.left = rect.left + "px";
    calendar.style.top = rect.bottom + 8 + "px";
  }

  // =========================
  // CLICK OUTSIDE
  // =========================
  document.addEventListener("click", (e) => {
    if (
      !calendar.contains(e.target) &&
      e.target !== activeElement
    ) {
      close();
    }
  });

  // empêche fermeture interne
  calendar.addEventListener("click", (e) => {
    e.stopPropagation();
  });

  // =========================
  // API PUBLIQUE
  // =========================
  return {
    open
  };

})();



