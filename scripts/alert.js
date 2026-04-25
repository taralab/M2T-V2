/************************************
 * 1. HELPERS DATE (ROBUSTES)
 ************************************/

function normalizeDate(date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0); // supprime l'effet des heures
  return d;
}

function isToday(date) {
  if (!date) return false;

  const d = normalizeDate(date);
  const now = normalizeDate(new Date());

  return d.getTime() === now.getTime();
}

function isOverdue(date) {
  if (!date) return false;

  const d = normalizeDate(date);
  const now = normalizeDate(new Date());

  return d < now;
}


/************************************
 * 2. TABLEAUX RESULTATS
 ************************************/

let todayTasks = [],
    overdueTasks = [],
    todaySteps = [],
    overdueSteps = [];


/************************************
 * 3. EXTRACTION DES DONNÉES
 ************************************/

function getTaskAlert() {

  // Reset
  todayTasks = [];
  overdueTasks = [];
  todaySteps = [];
  overdueSteps = [];

  // ⚠️ allUserNoteList est un objet → Object.values obligatoire
  Object.values(allUserNoteList).forEach(function(note) {

    /*************** TÂCHES ***************/

    if (note.dateEnd) {

      if (isToday(note.dateEnd)) {
        todayTasks.push({
          title: note.title
        });
      }

      if (isOverdue(note.dateEnd)) {
        overdueTasks.push({
          title: note.title
        });
      }
    }


    /*************** ÉTAPES ***************/

    if (!note.stepArray || note.stepArray.length === 0) return;

    note.stepArray.forEach(function(step) {

      /**
       * 🎯 FILTRE MÉTIER IMPORTANT
       * On ignore les étapes si :
       * - elles sont terminées
       * - OU si alert = false
       */
      if (step.checked === true) return;
      if (step.alert !== true) return;
      if (!step.date) return;

      // Étapes du jour
      if (isToday(step.date)) {
        todaySteps.push({
          title: step.text,
          taskTitle: note.title
        });
      }

      // Étapes en retard
      if (isOverdue(step.date)) {
        overdueSteps.push({
          title: step.text,
          taskTitle: note.title
        });
      }
    });
  });
}



/************************************
 * 6. RENDER
 ************************************/

function renderList(containerId, items, type, itemType) {
  const container = document.getElementById(containerId);

  container.innerHTML = "";

  if (items.length === 0) {
    container.innerHTML = "<small style='color:#999'>Aucun élément</small>";
    return;
  }

  items.forEach(function(item) {

    const div = document.createElement("div");
    div.className = "notif-item " + type + " " + itemType;

    const label = itemType === "step"
      ? "<span class='notif-label'>Étape</span>"
      : "<span class='notif-label'>Tâche</span>";

    div.innerHTML = `
      ${label}
      <strong>${item.title}</strong>
      ${item.taskTitle ? `<br><small>${item.taskTitle}</small>` : ""}
    `;

    container.appendChild(div);
  });
}

/************************************
 * 7. RENDER GLOBAL
 ************************************/

function renderNotifications() {

  renderList("notif-today-tasks", todayTasks, "today", "task");
  renderList("notif-overdue-tasks", overdueTasks, "overdue", "task");

  renderList("notif-today-steps", todaySteps, "today", "step");
  renderList("notif-overdue-steps", overdueSteps, "overdue", "step");

  const total =
    todayTasks.length +
    overdueTasks.length +
    todaySteps.length +
    overdueSteps.length;

  // badge dans le popup
  document.getElementById("notif-badge").innerText = total;

  // badge sur la cloche
  const bellBadge = document.getElementById("alertIconBadge");

  if (total > 0) {
    bellBadge.innerText = total > 9 ? "9+" : total;
    bellBadge.classList.remove("hidden");
  } else {
    bellBadge.classList.add("hidden");
  }
}

/************************************
 * 8. TOGGLE POPUP pour ouvrir ou fermer
 ************************************/

const btnAlertIconRef = document.getElementById("btnAlertIcon");
const divNotifyAlertRef = document.getElementById("divAlertPopup");

btnAlertIconRef.addEventListener("click", function() {
  divNotifyAlertRef.classList.toggle("hidden");
});


/************************************
 * 9. INIT
 ************************************/

//actualisé au lancement, modification date end, étape,
//lors de suppression et validation d'une tache

function refreshAlertList() {
  console.log("Actualisation des alertes");

  //Récupère les éléments dans les taches
  getTaskAlert();


  //Fait le rendu de notification
  renderNotifications();
}

