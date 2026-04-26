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
          title: note.title,
          taskID:note._id
        });
      }

      if (isOverdue(note.dateEnd)) {
        overdueTasks.push({
          title: note.title,
          taskID:note._id
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
          taskTitle: note.title,
          taskID:note._id
        });
      }

      // Étapes en retard
      if (isOverdue(step.date)) {
        overdueSteps.push({
          title: step.text,
          taskTitle: note.title,
          taskID:note._id
        });
      }
    });
  });
}



/************************************
 * 6. RENDER
 ************************************/

function renderList(containerId, items, itemType) {
  const container = document.getElementById(containerId);

  container.innerHTML = "";

  if (items.length === 0) {
    container.innerHTML = "";
    return;
  }

  items.forEach(function(item) {
    if (devMode) {
      console.log(item);
    }

    const div = document.createElement("div");
    div.className = "notif-item " + " " + itemType;
    div.className = "notif-item";

    const label = itemType === "step-alert"
      ? "<span class='notif-label-step'>Étape</span>"
      : "<span class='notif-label-task'>Tâche</span>";

    div.innerHTML = `
      ${label}
      <span class='alert-main-text' >${item.title}</span>
      ${item.taskTitle ? `<br><span class='alert-secondary-text'>${item.taskTitle}</span>` : ""}
    `;

    //Lorsque clique sur la notification ouvre la tache en question
    div.addEventListener("click", () => openTaskEditor(item.taskID));

    container.appendChild(div);
  });
}

/************************************
 * 7. RENDER GLOBAL
 ************************************/

function renderNotifications() {

  renderList("notif-today-tasks", todayTasks, "task");
  renderList("notif-overdue-tasks", overdueTasks, "task");

  renderList("notif-today-steps", todaySteps, "step-alert");
  renderList("notif-overdue-steps", overdueSteps, "step-alert");

  const total =
    todayTasks.length +
    overdueTasks.length +
    todaySteps.length +
    overdueSteps.length;


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
 * 9. ACTUALISATION
 ************************************/

//actualisé au lancement, modification date end, étape,
//lors de suppression et validation d'une tache

function refreshAlertList() {
  if (devMode) {
    console.log("Actualisation des alertes");
  }
  //Récupère les éléments dans les taches
  getTaskAlert();


  //Fait le rendu de notification
  renderNotifications();
}


/************************************
 * DIVERS
 ************************************/


//Clique sur notification alerte
function onDisplayNotifyAlert() {
  divNotifyAlertRef.classList.remove("hidden");
}

function onCloseNotifyAlert() {
  divNotifyAlertRef.classList.add("hidden");
}
