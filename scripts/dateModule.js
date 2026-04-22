
function openCalendar(type, element) {

  const noteId = uiState.currentEditId;
  if (!noteId) return;

  CalendarModule.open(
    {
      noteId,
      type
    },
    element
  );
}


// =========================
// CALENDAR MODULE
// =========================
function createCalendarModule() {

  // =========================
  // STATE INTERNE
  // =========================
  let activeContext = null;
  let activeElement = null;
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
  // HELPERS
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

    // 💾 3. Marquer pour sauvegarde DB
    markTaskDirty(noteId);
  }

    function refreshTaskEditorUI() {

        const task = allUserNoteList[uiState.currentEditId];
        if (!task) return;

        btnTaskEditorDateStartRef.textContent =
            formatDateFR(task.dateStart);

        btnTaskEditorDateEndRef.textContent =
            formatDateFR(task.dateEnd);
    }

    function positionCalendar(element) {
        const rect = element.getBoundingClientRect();

        calendar.style.left = rect.left + "px";
        calendar.style.top = rect.bottom + 8 + "px";
    }

  // =========================
  // RENDER
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

    monthLabel.textContent = currentDate.toLocaleDateString("fr-FR", {
      month: "long",
      year: "numeric"
    });

    const offset = (firstDay + 6) % 7;

    for (let i = 0; i < offset; i++) {
      grid.appendChild(document.createElement("div"));
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const d = new Date(year, month, day);

      const div = document.createElement("div");
      div.classList.add("calendar-day");
      div.textContent = day;

      if (selectedDate && d.toDateString() === selectedDate.toDateString()) {
        div.classList.add("selected");
      }

    div.addEventListener("click", (e) => {
        e.stopPropagation();

        setDateToContext(d);

        refreshTaskEditorUI(); // 🔥 IMPORTANT
        refreshStepsUI(); // 🔥 IMPORTANT
        close();
    });

      grid.appendChild(div);
    }
  }

  // =========================
  // OPEN / CLOSE
  // =========================
  function open(context, element) {
    activeContext = context;
    activeElement = element;

    const isoDate = getDateFromContext();

    currentDate = isoDate
      ? new Date(isoDate + "T00:00:00")
      : new Date();

    positionCalendar(element);
    render();

    calendar.classList.remove("hidden");
  }

  function close() {
    calendar.classList.add("hidden");
    activeContext = null;
    activeElement = null;

    refreshTaskEditorUI(); // 🔥 update visuel ici
  }

  // =========================
  // EVENTS
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

  document.addEventListener("click", (e) => {
    if (!calendar.contains(e.target) && e.target !== activeElement) {
      close();
    }
  });

  calendar.addEventListener("click", (e) => {
    e.stopPropagation();
  });

  // =========================
  // API PUBLIQUE
  // =========================
  return {
    open,
    close
  };
}


function refreshStepsUI() {
  const note = allUserNoteList[uiState.currentEditId];
  if (!note) return;

  note.stepArray.forEach(step => {
    const el = document.querySelector(`[data-id="${step.id}"] .task-editor-step-date`);
    if (el) {
      el.textContent = formatDateFR(step.date);
    }
  });
}

const CalendarModule = createCalendarModule();