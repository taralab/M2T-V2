let allUserNoteList = {
  "id_1": {
    category: "RRF",
    title: "Analyse budget Q1",
    dateCreated: "2026-04-10",
    dateLastModification: "2026-04-12",
    dateStart: "",
    dateEnd: "2026-04-20",
    status: "A",
    stepArray: [
      {
        id: "stp_k29fla",
        text: "Collecter les données financières",
        checked: true,
        date: "2026-04-15",
        alert: false
      },
      {
        id: "stp_x82mdp",
        text: "Analyser les écarts budgétaires",
        checked: false,
        date: "2026-04-17",
        alert: true
      },
      {
        id: "stp_q91lzn",
        text: "Rédiger le rapport de synthèse",
        checked: false,
        date: "2026-04-19",
        alert: false
      }
    ],
    detail: "Préparer analyse financière",
    priority: "HIGH"
  }
};



let defaultTaskCanvas = {
    category: "Nouvelle categorie",
    title: "Nouvelle tache",
    dateCreated: "",
    dateStart: "",
    dateEnd: "",
    status: "A",
    stepArray: [],
    detail: "",
    priority: "LOW"
};



// Stocke toutes les instances affichées dans la liste
// clé = id de la note
const itemTaskInstance = new Map();



// État global de l’UI (source de vérité)
let uiState = {
  sortType: "status",     // tri actuel
  searchQuery: "",         // texte de recherche actuel
  currentEditId: null // 🔥 ID de la note en cours d'édition
};


const debounceEditTaskvalue = 300; //Delai avant traitement des modifications de la tache

// Les alias
const defaultAliasStatus = {
  A:"A faire",
  B:"En cours",
  C:"En attente",
  D:"Terminée",
  E:"Archivée"
};

const defaultAliasPriority = {
  LOW:"Basse",
  MEDIUM:"Moyenne",
  HIGH:"Haute"
}

let currentTaskEditor = null;








// ------------------------------------------ DATA BASE -------------------------






// Insertion nouvelle activité (ID auto avec préfixe)
async function onInsertNewTaskInDB(newTaskToInsert) {
    try {
        const newTask = {
            type: taskStoreName,
            ...newTaskToInsert,
            _id: `${taskStoreName}_${crypto.randomUUID()}` // génération UUID côté JS
        };

        // Enregistrement dans la DB
        const response = await db.put(newTask);

        // Mise à jour de l'objet avec _rev retourné
        newTask._rev = response.rev;
        if (userSetting.devMode) {
          console.log("[DATABASE] [TASK] Tache insérée :", newTask);
        }

        return newTask;

    } catch (err) {
        console.error("[DATABASE] [TASK] Erreur lors de l'insertion de la tache :", err);
    }
}




// CHARGEMENT EN MODE TEST new ID
async function onLoadTaskFromDB() {

    allUserNoteList = {};
    const BATCH_SIZE = 500;

    try {

        const result = await db.allDocs({
            include_docs: true,
            startkey: `${taskStoreName}_`,
            endkey: `${taskStoreName}_\uffff`
        });

        const rows = result.rows;

        for (let i = 0; i < rows.length; i++) {

            const doc = rows[i].doc;

            // filtrage pour ne garder que les activités valides
            if (doc.type === taskStoreName) {
                allUserNoteList[doc._id] = doc;
            }

            if (i > 0 && i % BATCH_SIZE === 0) {
                await new Promise(r => setTimeout(r, 0));
            }
        }

        if (devMode && rows.length > 0) {

            console.log("[DATABASE] [TASK] taches chargées :", taskStoreName);

            const firstKey = Object.keys(allUserNoteList)[0];
            if (userSetting.devMode) {
              console.log(allUserNoteList[firstKey]);
            }

        }

    } catch (err) {

        console.error("[DATABASE] [TASK] Erreur lors du chargement:", err);

    }
}





/**
 * Supprime un document PouchDB à partir de son ID
 * @param {PouchDB.Database} db - instance de la base
 * @param {string} id - _id du document à supprimer
 * @returns {Promise<boolean>} - true si supprimé, false sinon
 */
async function deleteById(id) {
  if (!id) {
    throw new Error("Paramètres invalides : id est requis");
  }

  try {
    // Récupération du document (nécessaire pour avoir _rev)
    const doc = await db.get(id);

    // Suppression
    await db.remove(doc);

    return true;
  } catch (err) {
    if (err.status === 404) {
      console.warn(`Document introuvable pour id: ${id}`);
      return false;
    }

    console.error("Erreur lors de la suppression :", err);
    throw err;
  }
}


//  -------------------------- Référencement--------------------------------





let taskSortSelectRef = document.getElementById("taskSortSelect"),
  inputTaskSearchRef = document.getElementById("inputTaskSearch"),
  divItemNoteListParentRef = document.getElementById("divItemNoteListParent"),
  btnAddNewTaskRef = document.getElementById("btnAddNewTask");

//Alerte
let  btnAlertIconRef = document.getElementById("btnAlertIcon"),
    divNotifyAlertRef = document.getElementById("divAlertPopup"),
    btnClosePopupAlertRef = document.getElementById("btnClosePopupAlert");

// Editeur de note
let  divTaskEditorContainerRef = document.getElementById("divTaskEditorContainer"),
  btnTaskEditorValiderRef = document.getElementById("btnTaskEditorValider"),
  btnTaskEditorPrintRef = document.getElementById("btnTaskEditorPrint"),
  btnTaskEditorDeleteRef = document.getElementById("btnTaskEditorDelete"),
  selectTaskEditorPriorityRef = document.getElementById("selectTaskEditorPriority"),
  selectTaskEditorStatusRef = document.getElementById("selectTaskEditorStatus"),
  inputTaskEditorCategoryRef = document.getElementById("inputTaskEditorCategory"),
  inputTaskEditorTitleRef = document.getElementById("inputTaskEditorTitle"),
  textareaTaskEditorDetailRef = document.getElementById("textareaTaskEditorDetail"),
  divTaskEditorStepParentRef = document.getElementById("divTaskEditorStepParent"),
  btnTaskEditorAddStepRef = document.getElementById("btnTaskEditorAddStep"),
  btnTaskEditorDateStartRef = document.getElementById("btnTaskEditorDateStart"),
  btnTaskEditorDateEndRef = document.getElementById("btnTaskEditorDateEnd");


// Menu principal

let btnMenuMainPageRef = document.getElementById("btnMenuMainPage"),
  btnMenuSettingRef = document.getElementById("btnMenuSetting");




// *  * * * * * *   *   * * ecouteur d'évènement




function onAddEventListenerForMainItems() {

  //Nouvelle note
  const addNewTask = () => onClickAddNewTask();
  btnAddNewTaskRef.addEventListener("click",addNewTask);
  onAddEventListenerInRegistry("persistantItems",btnAddNewTaskRef,"click",addNewTask);

  // Les tries et recherches
  const changeSortType = () => onChangeSortType();
  taskSortSelectRef.addEventListener("change",changeSortType)
  onAddEventListenerInRegistry("persistantItems",taskSortSelectRef,"change",changeSortType);

  

  // Lors de la saisie utilisateur (avec debounce)
  const onSearchTask = debounce(onSearchInput, 300);
  inputTaskSearchRef.addEventListener("input",onSearchTask);
  onAddEventListenerInRegistry("persistantItems",inputTaskSearchRef,"input",onSearchTask);



  //Alerte notification
  const clickIconAlertNotify = () => onDisplayNotifyAlert();
  btnAlertIconRef.addEventListener("click",clickIconAlertNotify);
  onAddEventListenerInRegistry("persistantItems",btnAlertIconRef,"click",clickIconAlertNotify);

  //ferme popup alert notify
  const closeNotifyAlert = () => onCloseNotifyAlert();
  btnClosePopupAlertRef.addEventListener("click", closeNotifyAlert);
  onAddEventListenerInRegistry("persistantItems",btnClosePopupAlertRef,"click", closeNotifyAlert);


  //----l'editeur de tache-----

  // Valider


  //imprimer

  //Supprimer
  const askDeleteTask = () => onClickDeleteTask();
  btnTaskEditorDeleteRef.addEventListener("click",askDeleteTask);
  onAddEventListenerInRegistry("taskItemEditor",btnTaskEditorDeleteRef,"click",askDeleteTask);

  //priority
  const changePriority = (event) => onTaskPriorityChange(event);
  selectTaskEditorPriorityRef.addEventListener("change",changePriority);
  onAddEventListenerInRegistry("taskItemEditor",selectTaskEditorPriorityRef,"change",changePriority);

  //status
  const changeTaskStatus = (event) => onTaskStatusChange(event);
  selectTaskEditorStatusRef.addEventListener("change",changeTaskStatus);
  onAddEventListenerInRegistry("taskItemEditor",selectTaskEditorStatusRef,"change",changeTaskStatus);

  //Category
  const inputTaskCategory = (event) => onTaskCategoryInput(event);
  inputTaskEditorCategoryRef.addEventListener("input",inputTaskCategory);
  onAddEventListenerInRegistry("taskItemEditor",inputTaskEditorCategoryRef,"input",inputTaskCategory);

  //title
  const inputTaskTitle = (event) => onTaskTitleInput(event);
  inputTaskEditorTitleRef.addEventListener("input",inputTaskTitle);
  onAddEventListenerInRegistry("taskItemEditor",inputTaskEditorTitleRef,"input",inputTaskTitle);

  //detail
  const inputTaskDetail = (event) => onTaskDetailInput(event);
  textareaTaskEditorDetailRef.addEventListener("input",inputTaskDetail);
  onAddEventListenerInRegistry("taskItemEditor",textareaTaskEditorDetailRef,"input",inputTaskDetail);

  //step
  const addStep = () => onAddStep();
  btnTaskEditorAddStepRef.addEventListener("click",addStep);
  onAddEventListenerInRegistry("taskItemEditor",btnTaskEditorAddStepRef,"click",addStep);

  //Date start
  btnTaskEditorDateStartRef.addEventListener("click", (e) => {
    e.stopPropagation();
    openCalendar("dateStart", btnTaskEditorDateStartRef);
  });

  //date end
  btnTaskEditorDateEndRef.addEventListener("click", (e) => {
    e.stopPropagation();
    openCalendar("dateEnd", btnTaskEditorDateEndRef);
  });


  //Menu principal
  const selectMainMenu = () => onChangeMenu("MainPage");
  btnMenuMainPageRef.addEventListener("click",selectMainMenu);
  onAddEventListenerInRegistry("persistantItems",btnMenuMainPageRef,"click",selectMainMenu);

  //menu setting
  const selectSettingMenu = () => onChangeMenu("Setting");
  btnMenuSettingRef.addEventListener("click",selectSettingMenu);
  onAddEventListenerInRegistry("persistantItems",btnMenuSettingRef,"click",selectSettingMenu);


}






// *    *   *   *   *   *   *   *   Class   *   *   *   *   *   *   *   *   *

class ItemNoteList {

  constructor(key, parentRef, priority, category, title, percentValue, meta = {}) {

    this.key = key;

    // 🔥 enregistrement de l'instance dans le registry global
    itemTaskInstance.set(this.key, this);

    this.parentRef = parentRef;
    this.priority = priority;
    this.category = category;
    this.title = title;
    this.percentValue = percentValue;

    this.matchIn = meta.matchIn || [];
    this.highlight = meta.highlight || [];

    this.container = document.createElement("div");
    this.container.classList.add("task-list-item");

    // Click dessus
    this.container.addEventListener("click", () => {
      openTaskEditor(this.key);
    });

    this.render();
    this.parentRef.appendChild(this.container);
  }



  // 🔧 fonction utilitaire de highlight
  highlightText(text, query) {
    if (!query) return text;

    const q = query.toLowerCase();

    return text.replace(
      new RegExp(`(${q})`, "gi"),
      `<span class="highlight">$1</span>`
    );
  }

  render() {

    const query = uiState.searchQuery;
    const { icon, color } = this.getPriorityIcon();

    // 🔍 badge "trouvé dans"
    const extraMatch =
      this.matchIn.includes("detail") ||
      this.matchIn.includes("steps");

    const matchInfo = extraMatch
      ? `<div class="task-list-item-match">
           🔍 trouvé dans :
           ${this.matchIn
             .filter(x => x !== "title" && x !== "category")
             .join(", ")}
         </div>`
      : "";


    // 🧱 HTML principal
    this.container.innerHTML = `
      <div class="task-list-item-image" style="color: ${color}">
        ${icon}
      </div>

      <div class="task-list-item-content">

        <div class="task-list-item-header">

          <div class="task-list-item-texts">

            <!-- CATEGORY -->
            <span class="task-list-item-category">
              [ ${this.highlight.includes("category")
                ? this.highlightText(this.category, query)
                : this.category} ]
            </span>

            <!-- TITLE -->
            <div class="task-list-item-title">
              ${this.highlight.includes("title")
                ? this.highlightText(this.title, query)
                : this.title}
            </div>

            ${matchInfo}

          </div>

          <!-- progression -->
          <div class="task-list-item-percentage">
            ${this.percentValue}%
          </div>

        </div>

        <!-- barre progression -->
        <div class="task-list-item-progress">
          <div
            class="task-list-item-progress-bar"
            style="width: ${this.percentValue}%"
          ></div>
        </div>

      </div>
    `;
  }

  update(data) {

    // 🔄 update title
    if (data.title !== undefined) {
      this.title = data.title;
    }

    // 🔄 update category
    if (data.category !== undefined) {
      this.category = data.category;
    }

    // 🔄 update priorité (🆕 important)
    if (data.priority !== undefined) {
      this.priority = data.priority;
    }

    // 🔄 update progression
    if (data.percentValue !== undefined) {
      this.percentValue = data.percentValue;
    }

    // 🎨 re-render complet (image incluse automatiquement)
    this.render();
  }

  getPriorityIcon() {
    const map = {
      HIGH: {
        icon: "⚡",
        color: "#FF4D4F"
      },

      MEDIUM: {
        icon: `
          <svg viewBox="0 0 24 24" class="priority-icon">
            <rect x="4" y="11" width="16" height="2" rx="1"/>
          </svg>
        `,
        color: "#D98E2F"
      },

      LOW: {
        icon: `
          <svg viewBox="0 0 24 24" class="priority-icon">
            <circle cx="12" cy="12" r="3"/>
          </svg>
        `,
        color: "#5B6FE5"
      }
    };

    return map[this.priority] || map["LOW"];
  }


  setActive(isActive) {
    if (isActive) {
      this.container.classList.add("task-list-item-active");
    } else {
      this.container.classList.remove("task-list-item-active");
    }
  }
}


class ItemStepNote {

  /**
   * Représente une étape dans l'éditeur
   */
  constructor(key, parentRef, checked, text, date, alert) {

    // 🔑 ID unique de l'étape
    this.key = key;

    // 📦 Parent DOM
    this.parentRef = parentRef;

    // 🧠 State local (miroir UI)
    this.checked = checked;
    this.text = text;
    this.date = date;
    this.alert = alert;

    // 🧱 Container principal
    this.container = document.createElement("div");
    this.container.classList.add("task-editor-step-row");

    // 🔥 utile pour debug / futur (drag, etc.)
    this.container.dataset.id = this.key;

    // 🎨 render initial
    this.render();

    // 📌 insertion DOM
    this.parentRef.appendChild(this.container);
  }

  /**
   * Render initial du DOM
   * ⚠️ appelé UNE SEULE FOIS (pas de re-render complet ensuite)
   */
  render() {



    this.container.innerHTML = `
      <button class="task-editor-step-drag">⋮⋮</button>

      <input type="checkbox" class="task-editor-step-checkbox"/>

      <input class="task-editor-step-text" type="text" placeholder="Nouvelle étape" />

      <button class="task-editor-step-date">${formatDateFR(this.date)}</button>

      <button class="task-editor-step-alert">
        <img src="${this.getNotifyIcon()}" alt="Alerte">
      </button>

      <button class="task-editor-step-delete">
        <img src="./images/IconeSupprimer.webp" alt="Supprimer">
      </button>
    `;

    // 📌 Références DOM (important pour éviter querySelector multiple)
    this.refs = {
      checkbox: this.container.querySelector(".task-editor-step-checkbox"),
      text: this.container.querySelector(".task-editor-step-text"),
      alertBtn: this.container.querySelector(".task-editor-step-alert"),
      deleteBtn: this.container.querySelector(".task-editor-step-delete"),
      dateBtn: this.container.querySelector(".task-editor-step-date")
    };

    // 🧠 Injection SAFE du texte (évite HTML injection)
    this.refs.text.value = this.text;

    // 🔄 Sync checkbox
    this.refs.checkbox.checked = this.checked;

    // 🎨 Style checked initial
    if (this.checked) {
      this.refs.text.classList.add("text-checked");
    }

    // 🎧 Bind des événements
    this.bindEvents();
  }

  /**
   * Attache tous les listeners
   */
  bindEvents() {

    // ✅ CHECKBOX
    this.refs.checkbox.addEventListener("change", () => {

      const isChecked = this.refs.checkbox.checked;

      // 🎨 UI immédiate (optimistic UI)
      this.refs.text.classList.toggle("text-checked", isChecked);

      // 🧠 debounce state update
      debouncedUpdateStepChecked(this.key, isChecked);
    });

    // 🔔 BOUTON ALERTE
    this.refs.alertBtn.addEventListener("click", () => {
      this.alert = !this.alert;
      // 🎨 update UI immédiat
      this.refs.alertBtn.querySelector("img").src = this.getNotifyIcon();
      // 🧠 debounce state
      debouncedUpdateStepAlert(this.key, this.alert);
    });

    // ✏️ TEXTE (input)
    this.refs.text.addEventListener("input", () => {
      const newText = this.refs.text.value; 
      debouncedUpdateStepText(this.key, newText);
    });

    // 🗑️ DELETE
    this.refs.deleteBtn.addEventListener("click", () => {

      const noteId = uiState.currentEditId;
      if (!noteId) return;

      // 🧠 suppression dans le state
      allUserNoteList[noteId].stepArray =
        allUserNoteList[noteId].stepArray.filter(s => s.id !== this.key);

      // 🧹 suppression DOM
      this.container.remove();

      // 🔄 update progress liste
      syncListItem(noteId);

      // 💾 3. Marquer pour sauvegarde DB
      markTaskDirty(noteId);
      
    });


    this.refs.dateBtn = this.container.querySelector(".task-editor-step-date");

    this.refs.dateBtn.addEventListener("click", (e) => {
      e.stopPropagation();

      const noteId = uiState.currentEditId;
      if (!noteId) return;

      CalendarModule.open(
        {
          noteId,
          type: "step",
          stepId: this.key   // 🔥 CRUCIAL
        },
        this.refs.dateBtn
      );
    });
  }

  /**
   * Retourne l'icône d'alerte
   */
  getNotifyIcon() {
    return this.alert
      ? "./images/IconeNotifyEnabled.webp"
      : "./images/IconeNotifyDisabled.webp";
  }
}




// *    *   *   *   *   *   Actualisation de la liste * *   *   *   *   *   *   *   






// Quand l’utilisateur change le type de tri
function onChangeSortType() {

  uiState.sortType = document.getElementById("taskSortSelect").value;

  // On réutilise la recherche actuelle
  refreshUI();
}




// Fonction centrale : synchronise search + sort + render
function refreshUI() {

  // 🔎 Résultat enrichi de la recherche
  const searchResult = searchNotes(uiState.searchQuery);

  // 📦 Liste des IDs visibles
  const filteredIds = Object.keys(searchResult);

  // 🎯 Rendu global
  eventUpdateList(
    uiState.sortType,
    filteredIds,
    searchResult
  );

  // 🧠 Réapplique la sélection après reconstruction du DOM
  syncTaskSelection(uiState.currentEditId);
}



// Affichage complet de la liste (tri + groupage + UI)
function eventUpdateList(sortType, filteredIds = null, searchMeta = {}) {
  // Avant de reconstruire toute la liste
  // on vide les anciennes instances
  itemTaskInstance.clear();


  // 📌 container principal
  const parentRef = document.getElementById("divItemNoteListParent");

  // 🧹 reset UI
  parentRef.innerHTML = "";

  // 📦 fallback si pas de filtre
  const baseIds =
    filteredIds && filteredIds.length > 0
      ? filteredIds
      : Object.keys(allUserNoteList);

  // 🚨 CAS VIDE : aucune donnée
  if (baseIds.length === 0) {
    const empty = document.createElement("div");
    empty.classList.add("empty-state");
    empty.textContent = "Aucune tâche à afficher";

    parentRef.appendChild(empty);
    return; // ⛔ important : stop la fonction ici
  }

  // 📦 dataset filtré
  const filteredData = Object.fromEntries(
    baseIds.map(id => [id, allUserNoteList[id]])
  );

  // 🔀 tri
  const sortedIds = getSortedNotesIds(filteredData, sortType);

  // 📊 groupage
  const grouped = groupSortedIds(filteredData, sortedIds, sortType);

  // 📌 ordre métier
  const groupOrderConfig = {
    priority: ["HIGH", "MEDIUM", "LOW"],
    status: ["A", "B", "C","D","E"]
  };

  let orderedGroups;

  // 📌 tri catégorie alphabétique
  if (sortType === "category") {
    orderedGroups = Object.keys(grouped)
      .sort((a, b) => a.localeCompare(b));
  } else {
    orderedGroups =
      groupOrderConfig[sortType] || Object.keys(grouped);
  }

  // 🖼️ rendu final
  orderedGroups.forEach(groupValue => {

    const ids = grouped[groupValue];
    if (!ids) return;

    // 🏷️ label groupe
    const label = document.createElement("div");
    label.classList.add("label");
    const labelText = getGroupLabel(sortType, groupValue) ?? groupValue;
    label.textContent = `${labelText.toUpperCase()} (${ids.length})`;
    parentRef.appendChild(label);

    // 📄 items
    ids.forEach(id => {

      const data = allUserNoteList[id];

      // 📊 progression steps
      const percent = computeTaskProgress(data.stepArray);

      // 🔎 meta recherche (highlight + match info)
      const meta = searchMeta[id] || {
        matchIn: [],
        highlight: []
      };

      // 🧱 composant UI
      new ItemNoteList(
        id,
        parentRef,
        data.priority,
        data.category,
        data.title,
        percent,
        meta,
        data.stepArray
      );
    });

  });
}

//Pour la convertion
function getGroupLabel(sortType, groupValue) {
  switch (sortType) {
    case "status":
      return defaultAliasStatus[groupValue];

    case "priority":
      return defaultAliasPriority[groupValue];

    default:
      return groupValue;
  }
}


// Calcule le % de tâches terminées
function computeTaskProgress(stepArray) {

  if (!stepArray || stepArray.length === 0) return 0;

  const total = stepArray.length;
  const done = stepArray.filter(step => step.checked).length;

  return Math.round((done / total) * 100);
}






//  *   *   *   *   *   *   * TRIE *    *   *   *   *   *   *   *   *   


// Fonction de tri des notes avec hiérarchie dynamique :
// 1. Critère principal → sortType (priority, category, status, etc.)
// 2. Critère secondaire → category (sauf si déjà utilisé en principal)
// 3. Critère tertiaire → title

function getSortedNotesIds(allUserNoteList, sortType) {
  const priorityOrder = {
    HIGH: 1,
    MEDIUM: 2,
    LOW: 3
  };

  return Object.entries(allUserNoteList)
    .map(([id, obj]) => ({ id, ...obj }))
    .sort((a, b) => {

      // 🥇 1. TRI PRINCIPAL
      if (sortType === "priority") {
        // Cas particulier : ordre personnalisé
        const prioA = priorityOrder[a.priority] || 999;
        const prioB = priorityOrder[b.priority] || 999;

        if (prioA !== prioB) {
          return prioA - prioB;
        }

      } else {
        // Cas standard : tri alphabétique sur la propriété ciblée
        const valA = (a[sortType] || "").toLowerCase();
        const valB = (b[sortType] || "").toLowerCase();

        if (valA < valB) return -1;
        if (valA > valB) return 1;
      }

      // 🥈 2. TRI SECONDAIRE → CATEGORY
      // On évite la redondance si le tri principal est déjà "category"
      if (sortType !== "category") {
        const catA = (a.category || "").toLowerCase();
        const catB = (b.category || "").toLowerCase();

        if (catA < catB) return -1;
        if (catA > catB) return 1;
      }

      // 🥉 3. TRI TERTIAIRE → TITLE (fallback final)
      const titleA = (a.title || "").toLowerCase();
      const titleB = (b.title || "").toLowerCase();

      if (titleA < titleB) return -1;
      if (titleA > titleB) return 1;

      // Égalité complète
      return 0;
    })
    .map(item => item.id);
}

// Fonction de groupement
function groupSortedIds(allUserNoteList, sortedIds, sortType) {
  // Objet qui va contenir les groupes
  // Exemple :
  // {
  //   HIGH: ["id_1", "id_5"],
  //   LOW: ["id_3"]
  // }
  const groups = {};

  // On parcourt les IDs déjà triés
  sortedIds.forEach(id => {
    const item = allUserNoteList[id];

    // On récupère la valeur du champ utilisé pour le tri (category, status, priority)
    const key = item[sortType] || "UNKNOWN";

    // Si le groupe n'existe pas encore, on l'initialise
    if (!groups[key]) {
      groups[key] = [];
    }

    // On ajoute l'id dans le bon groupe
    groups[key].push(id);
  });

  // Retourne un objet contenant tous les groupes
  return groups;
}



// *  * * * *  RECHERCHE  * * * * * * 








// Mise à jour de l’état + refresh global
function onSearchInput(e) {
  uiState.searchQuery = e.target.value;
  refreshUI();
}


// Recherche dans toutes les notes
// Retourne :
// - matchIn → où ça match (title/category/detail/steps)
// - highlight → où on doit surligner (title/category uniquement)
function searchNotes(query) {

  // Normalisation de la recherche
  const q = query.toLowerCase().trim();

  // Cas vide → tout est visible, rien à highlight
  if (!q) {
    return Object.fromEntries(
      Object.keys(allUserNoteList).map(id => [
        id,
        {
          matchIn: [],     // zones de correspondance
          highlight: []    // zones à surligner
        }
      ])
    );
  }

  const result = {};

  // Parcours de toutes les notes
  Object.entries(allUserNoteList).forEach(([id, note]) => {

    const matchIn = [];   // info UX ("trouvé dans")
    const highlight = []; // UI (surlignage jaune)

    // 🔎 TITLE → visible + highlight
    if (note.title?.toLowerCase().includes(q)) {
      matchIn.push("title");
      highlight.push("title");
    }

    // 🔎 CATEGORY → visible + highlight
    if (note.category?.toLowerCase().includes(q)) {
      matchIn.push("category");
      highlight.push("category");
    }

    // 🔎 DETAIL → invisible dans liste → badge uniquement
    if (note.detail?.toLowerCase().includes(q)) {
      matchIn.push("detail");
    }

    // 🔎 STEPS → invisible dans liste → badge uniquement
    if (note.stepArray?.some(step =>
      step.text?.toLowerCase().includes(q)
    )) {
      matchIn.push("steps");
    }

    // Si au moins un match → on garde la note
    if (matchIn.length > 0) {
      result[id] = {
        matchIn,
        highlight
      };
    }
  });

  return result;
}







// *  * * * * * * *EDITEUR/MODIFICATION * * * * * * * * *   





function openTaskEditor(noteId) {

  // 👇 gestion du highlight AVANT de changer l’état UI
  syncTaskSelection(noteId);

  //Affiche la div
  divTaskEditorContainerRef.style.display = "flex";

  uiState.currentEditId = noteId;

  const data = allUserNoteList[noteId];

  onSetTaskEditor(data);
}





// Set les éléments dans l'editeur
function onSetTaskEditor(data) {

  inputTaskEditorCategoryRef.value = data.category;
  inputTaskEditorTitleRef.value = data.title;
  textareaTaskEditorDetailRef.value = data.detail;
  selectTaskEditorPriorityRef.value = data.priority;
  selectTaskEditorStatusRef.value = data.status;

  //Vide le parent des étapes
  divTaskEditorStepParentRef.innerHTML = "";
  //remplit avec les nouveaux éléments
  data.stepArray.forEach(stepData=>{
    new ItemStepNote(
      stepData.id,divTaskEditorStepParentRef,
      stepData.checked,
      stepData.text,stepData.date,
      stepData.alert
    );
  });

  //le backGround du selecteur
  updatePrioritySelectBackground(data.priority);


  //Les dates de début et fin
  btnTaskEditorDateStartRef.textContent = formatDateFR(data.dateStart);
  btnTaskEditorDateEndRef.textContent = formatDateFR(data.dateEnd);

  //Initialisation drag N drop
  // ⚠️ IMPORTANT : après DOM ready
  initStepSortable();
}


//Systeme de coloration de la tache en cours
function syncTaskSelection(newTaskId) {

  if (userSetting.devMode) {
    console.log(`Sync task selection → ${newTaskId}`);
  }

  const oldTaskId = uiState.currentEditId;

  // 🔥 CAS 1 : ancienne sélection différente → transition normale
  if (oldTaskId && oldTaskId !== newTaskId) {
    const oldItem = itemTaskInstance.get(oldTaskId);
    oldItem?.setActive(false);
  }

  // 🔥 CAS 2 : nouvelle instance (toujours nécessaire, même si même ID)
  const newItem = itemTaskInstance.get(newTaskId);

  if (newItem) {
    newItem.setActive(true);
  }

  // 🧠 MAJ état (toujours après DOM sync)
  uiState.currentEditId = newTaskId;
}


//traitement couleur priority editeur
function updatePrioritySelectBackground(newPriority) {

  // Liste des classes possibles
  const classes = [
    "backGroundPriorityHigh",
    "backGroundPriorityMedium",
    "backGroundPriorityLow"
  ];

  // Nettoyage : on enlève toutes les classes de priorité
  selectTaskEditorPriorityRef.classList.remove(...classes);

  // Normalisation (sécurité)
  const priority = newPriority?.toUpperCase();

  // Application de la nouvelle classe
  switch (priority) {
    case "HIGH":
      selectTaskEditorPriorityRef.classList.add("backGroundPriorityHigh");
      break;
    case "MEDIUM":
      selectTaskEditorPriorityRef.classList.add("backGroundPriorityMedium");
      break;
    case "LOW":
      selectTaskEditorPriorityRef.classList.add("backGroundPriorityLow");
      break;
    default:
      // Optionnel : aucun style ou fallback
      break;
  }
}




// Met à jour une seule ligne de la liste à partir du state global
function syncListItem(id) {

  // 🔍 récupérer instance UI
  const itemInstance = itemTaskInstance.get(id);

  // si pas affiché → rien à faire
  if (!itemInstance) return;

  // 📦 source de vérité
  const data = allUserNoteList[id];

  if (userSetting.devMode) {
    console.log(data);
  }
  // 🔄 mise à jour ciblée de l'UI
  itemInstance.update({
    title: data.title,
    category: data.category,
    priority: data.priority,
    percentValue: computeTaskProgress(data.stepArray)
  });
}





//modification categorie
function onTaskCategoryInput(e) {
  debouncedUpdateTaskCategory(e.target.value);
}
// debounce global pour la categorie
const debouncedUpdateTaskCategory = debounce((newCategory) => {

  const id = uiState.currentEditId;
  if (!id) return;

  // 🧠 update state
  allUserNoteList[id].category = newCategory;

  // 🔄 sync UI
  syncListItem(id);

  // 💾 3. Marquer pour sauvegarde DB
  markTaskDirty(id);

}, debounceEditTaskvalue);



// Modification du titre
function onTaskTitleInput(e) {
  debouncedUpdateTaskTitle(e.target.value);
}

// debounce global pour le titre
const debouncedUpdateTaskTitle = debounce((newTitle) => {

  const id = uiState.currentEditId;
  if (!id) return;

  // 🧠 update state
  allUserNoteList[id].title = newTitle;

  // 🔄 sync UI
  syncListItem(id);

  // 💾 3. Marquer pour sauvegarde DB
  markTaskDirty(id);

}, debounceEditTaskvalue);




// Modification des détails
function onTaskDetailInput(e) {
  debouncedUpdateTaskDetail(e.target.value);
}

// debounce global pour le titre
const debouncedUpdateTaskDetail = debounce((newDetail) => {

  const id = uiState.currentEditId;
  if (!id) return;

  // 🧠 update state
  allUserNoteList[id].detail = newDetail;


  // 💾 3. Marquer pour sauvegarde DB
  markTaskDirty(id);

}, debounceEditTaskvalue);





// Modification de la priorité
function onTaskPriorityChange(e) {
  debouncedUpdateTaskPriority(e.target.value);
  updatePrioritySelectBackground(e.target.value);
}
// debounce global pour la priorité
const debouncedUpdateTaskPriority = debounce((newPriority) => {

  const id = uiState.currentEditId;
  if (!id) return;

  // 🧠 update state
  allUserNoteList[id].priority = newPriority;


  //si le trie actuel est sur priority, 
  if (uiState.sortType === "priority") {
    //on reactualise toute la liste
    refreshUI();
    if (userSetting.devMode) {
      console.log("Reactualisation");
    }
  }else{
    //Sinon 🔄 sync UI
    syncListItem(id);
    if (userSetting.devMode) {
      console.log("mise a jour instance");
    }
  }

  // 💾 3. Marquer pour sauvegarde DB
  markTaskDirty(id);

}, debounceEditTaskvalue);


// Modification de la priorité
function onTaskStatusChange(e) {
  debouncedUpdateTaskStatus(e.target.value);
}
// debounce global pour la priorité
const debouncedUpdateTaskStatus = debounce((newStatus) => {

  const id = uiState.currentEditId;
  if (!id) return;

  // 🧠 update state
  allUserNoteList[id].status = newStatus;


  //si le trie actuel est sur status, 
  if (uiState.sortType === "status") {
    //on reactualise toute la liste
    refreshUI();
    if (userSetting.devMode) {
      console.log("Reactualisation");
    }
  }else{
    //Sinon 🔄 sync UI
    syncListItem(id);
    if (userSetting.devMode) {
      console.log("mise a jour instance");
    }
  }

  // 💾 3. Marquer pour sauvegarde DB
  markTaskDirty(id);

}, debounceEditTaskvalue);



// CHECKBOX
const debouncedUpdateStepChecked = debounce((stepId, checked) => {

  const noteId = uiState.currentEditId;
  if (!noteId) return;

  const step = allUserNoteList[noteId].stepArray.find(s => s.id === stepId);
  if (!step) return;

  step.checked = checked;

  // 🔄 update progress dans la liste
  syncListItem(noteId);

  // 💾 3. Marquer pour sauvegarde DB
  markTaskDirty(noteId);

}, 200);


// ALERT
const debouncedUpdateStepAlert = debounce((stepId, isEnabled) => {

  const noteId = uiState.currentEditId;
  if (!noteId) return;

  const step = allUserNoteList[noteId].stepArray.find(s => s.id === stepId);
  if (!step) return;

  step.alert = isEnabled;


  // 💾 3. Marquer pour sauvegarde DB
  markTaskDirty(noteId);

}, 200);


// TEXT
const debouncedUpdateStepText = debounce((stepId, text) => {

  const noteId = uiState.currentEditId;
  if (!noteId) return;

  const step = allUserNoteList[noteId].stepArray.find(s => s.id === stepId);
  if (!step) return;

  step.text = text;

// 💾 3. Marquer pour sauvegarde DB
  markTaskDirty(noteId);

}, debounceEditTaskvalue);







/**
 * Ajoute une nouvelle étape
 */
function onAddStep() {

  const noteId = uiState.currentEditId;
  if (!noteId) return;

  const steps = allUserNoteList[noteId].stepArray;

  // ❌ 1. Vérifier si une étape vide existe
  const hasEmptyStep = steps.some(step =>
    !step.text || step.text.trim() === ""
  );

  if (hasEmptyStep) {
    alert("Une étape est vide. Merci de la compléter avant d'en ajouter une nouvelle.");
    return;
  }

  // ✔ 2. Création nouvelle step
  const newStep = {
    id: generateStepId(),
    text: "",
    checked: false,
    date: "",
    alert: false
  };

  // 🧠 3. Ajout au state
  steps.push(newStep);
  // 💾 marquer comme modifié
  markTaskDirty(noteId);

  // 🎨 4. Ajout au DOM
  const stepInstance = new ItemStepNote(
    newStep.id,
    divTaskEditorStepParentRef,
    newStep.checked,
    newStep.text,
    newStep.date,
    newStep.alert
  );

  // 🎯 5. Focus automatique
  setTimeout(() => {
    stepInstance.refs.text.focus();
  }, 0);

}






// STEP DRAG N DROP




function initStepSortable() {

  const container = divTaskEditorStepParentRef;

  new Sortable(container, {

    animation: 150,
    handle: ".task-editor-step-drag", // ✔ drag uniquement sur poignée

    ghostClass: "drag-ghost",
    chosenClass: "drag-chosen",

    onEnd: function () {

      syncStepOrderFromDOM();
    }
  });
}


/**
 * Reconstruit stepArray selon l’ordre DOM
 */
function syncStepOrderFromDOM() {

  const noteId = uiState.currentEditId;
  if (!noteId) return;

  const note = allUserNoteList[noteId];

  const newOrder = [];

  // 🔁 on lit l'ordre DOM
  const stepElements = divTaskEditorStepParentRef.querySelectorAll(".task-editor-step-row");

  stepElements.forEach(el => {

    const id = el.dataset.id;

    const step = note.stepArray.find(s => s.id === id);

    if (step) newOrder.push(step);
  });

  // 🧠 update state
  note.stepArray = newOrder;

  // 📊 recalcul progress
  syncListItem(noteId);

  // 💾 autosave
  markTaskDirty(noteId);
}








// --------------------------- NOUVELLE NOTE ----------------------------




async function onClickAddNewTask() {
  
  //récupère la date du jour
  let dateToday = new Date();

  //Insère la date de création
  defaultTaskCanvas.dateCreated = formatDateISO(dateToday);

  //création de la nouvelle tache en base et recupère l'id généré
  let newTaskAdded = await onInsertNewTaskInDB( defaultTaskCanvas);

  //Insertion dans l'objet principal
  allUserNoteList[newTaskAdded._id] = newTaskAdded;

  //Actualise la page
  refreshUI();

  //Affiche la nouvelle note créé
  openTaskEditor(newTaskAdded._id);

  //Focus sur le titre
  taskEditorFocusTitle();


}

// Focus sur le titre
function taskEditorFocusTitle() {
  requestAnimationFrame(() => {
    inputTaskEditorTitleRef.focus();
    inputTaskEditorTitleRef.select();
  });
}






// ------------------------------------------------ SYSTEM AUTO SAVE DEBOUNCE ---------------------------------------



// ==============================
// 🧠 AUTOSAVE ENGINE - DATABASE
// ==============================

// Set contenant les IDs des tâches modifiées (dirty)
// 👉 évite les doublons automatiquement
const dirtyTasks = new Set();

// Mémoire du dernier état sauvegardé (option optimisation)
const lastSavedState = {};

// Fonction utilitaire : vérifie si une tâche a réellement changé
function hasTaskChanged(id, task) {

  const prev = lastSavedState[id];
  const current = JSON.stringify(task);

  // Si identique → inutile de sauvegarder
  if (prev === current) {
    return false;
  }

  // Sinon on met à jour la mémoire
  lastSavedState[id] = current;
  return true;
}


// ==============================
// 💾 DEBOUNCE GLOBAL DB
// ==============================

// Cette fonction sera appelée après X ms sans nouvelle modif
const debouncedSaveAllTasks = debounce(async () => {

  if (userSetting.devMode) {
    console.log("[DB] 🚀 Début batch save");
  }

  // On parcourt toutes les tâches modifiées
  for (const id of dirtyTasks) {

    const task = allUserNoteList[id];

    // sécurité
    if (!task) continue;

    // 🔍 skip si aucune modification réelle
    if (!hasTaskChanged(id, task)) {
      if (userSetting.devMode) {
        console.log("[DB] ⏭️ skip (no change)", id);
      }
      continue;
    }

    try {
      // 💾 sauvegarde dans PouchDB
      const response = await db.put(task);

      // 🔄 IMPORTANT : mise à jour du _rev
      task._rev = response.rev;
      if (userSetting.devMode) {
        console.log("[DB] ✅ saved", id);
      }

    } catch (err) {
      console.error("[DB] ❌ error", id, err);
    }
  }

  // 🧹 reset après batch
  dirtyTasks.clear();

  //actualisation des alertes
  refreshAlertList();

  if (userSetting.devMode) {
    console.log("[DB] 🧹 Fin batch");
  }

}, 1200); // ⏱️ debounce DB (1.2s recommandé)




// ==============================
// 🏷️ MARQUER UNE TÂCHE "DIRTY"
// ==============================

function markTaskDirty(id) {

  if (!id) return;

  // Ajoute la tâche dans la liste des modifs
  dirtyTasks.add(id);

  // Lance le debounce DB
  debouncedSaveAllTasks();
}








// ----------------------------------------- SUPPRESSION-----------------------------------------










function onClickDeleteTask() {
  //Affiche le popup de suppression
  addEventForGlobalPopupConfirmation(onConfirmDeleteTask,confirmPopupContextData["delete"]);
}



async function onConfirmDeleteTask() {

  //récupère l'id de la tache à supprimer
  const idToDelete = uiState.currentEditId;

  //retire l'élément du state
  delete allUserNoteList[idToDelete];
  //supprime de la base
  await deleteById(idToDelete);

  uiState.currentEditId = null;

  //ferme l'éditeur
  divTaskEditorContainerRef.style.display = "none";

  //refresh UI
  refreshUI();
  refreshAlertList();

}




