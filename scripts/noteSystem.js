let allUserNoteList = {
  "id_1": {
    category: "RRF",
    title: "Analyse budget Q1",
    dateCreated: "2026-04-10",
    dateLastModification: "2026-04-12",
    dateStart: "2026-04-15",
    dateEnd: "2026-04-20",
    status: "status1",
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
  },

  "id_2": {
    category: "SSI",
    title: "Audit sécurité serveur",
    dateCreated: "2026-04-01",
    dateLastModification: "2026-04-05",
    dateStart: "2026-04-06",
    dateEnd: "2026-04-18",
    status: "status2",
    stepArray: [
      {
        id: "stp_p82jfa",
        text: "Lister les accès utilisateurs",
        checked: true,
        date: "2026-04-06",
        alert: false
      },
      {
        id: "stp_v73nke",
        text: "Analyser les logs de connexion",
        checked: true,
        date: "2026-04-10",
        alert: false
      },
      {
        id: "stp_b19xqw",
        text: "Identifier les failles potentielles",
        checked: false,
        date: "2026-04-15",
        alert: true
      }
    ],
    detail: "Audit des accès",
    priority: "MEDIUM"
  },

  "id_3": {
    category: "REUNION",
    title: "Point équipe hebdo",
    dateCreated: "2026-04-14",
    dateLastModification: "2026-04-14",
    dateStart: "2026-04-17",
    dateEnd: "2026-04-17",
    status: "status1",
    stepArray: [
      {
        id: "stp_h52lks",
        text: "Préparer l'ordre du jour",
        checked: true,
        date: "2026-04-16",
        alert: false
      },
      {
        id: "stp_j91zpe",
        text: "Animer la réunion",
        checked: false,
        date: "2026-04-17",
        alert: false
      }
    ],
    detail: "Réunion équipe",
    priority: "LOW"
  },

  "id_4": {
    category: "DIVERS",
    title: "Organisation bureau",
    dateCreated: "2026-03-20",
    dateLastModification: "2026-04-01",
    dateStart: "2026-04-02",
    dateEnd: "2026-04-25",
    status: "status3",
    stepArray: [],
    detail: "Rangement et tri",
    priority: "LOW"
  },

  "id_5": {
    category: "RRF",
    title: "Clôture mensuelle",
    dateCreated: "2026-03-28",
    dateLastModification: "2026-04-02",
    dateStart: "2026-04-03",
    dateEnd: "2026-04-10",
    status: "status2",
    stepArray: [
      {
        id: "stp_m28dkq",
        text: "Vérifier les écritures comptables",
        checked: true,
        date: "2026-04-04",
        alert: false
      },
      {
        id: "stp_r47xna",
        text: "Valider les comptes",
        checked: true,
        date: "2026-04-08",
        alert: false
      }
    ],
    detail: "Clôture comptable",
    priority: "HIGH"
  },

  "id_6": {
    category: "SSI",
    title: "Mise à jour firewall",
    dateCreated: "2026-04-11",
    dateLastModification: "2026-04-13",
    dateStart: "2026-04-16",
    dateEnd: "2026-04-19",
    status: "status3",
    stepArray: [
      {
        id: "stp_c91vle",
        text: "Sauvegarder la configuration actuelle",
        checked: true,
        date: "2026-04-16",
        alert: false
      },
      {
        id: "stp_d82kfa",
        text: "Appliquer la mise à jour",
        checked: false,
        date: "2026-04-18",
        alert: true
      },
      {
        id: "stp_t73plm",
        text: "Tester les règles réseau",
        checked: false,
        date: "2026-04-19",
        alert: false
      }
    ],
    detail: "Upgrade sécurité",
    priority: "HIGH"
  },

  "id_7": {
    category: "REUNION",
    title: "Réunion client projet X",
    dateCreated: "2026-04-05",
    dateLastModification: "2026-04-06",
    dateStart: "2026-04-08",
    dateEnd: "2026-04-08",
    status: "status2",
    stepArray: [
      {
        id: "stp_n12kwe",
        text: "Préparer les supports de présentation",
        checked: true,
        date: "2026-04-07",
        alert: false
      }
    ],
    detail: "Suivi client",
    priority: "MEDIUM"
  },

  "id_8": {
    category: "DIVERS",
    title: "Commande fournitures",
    dateCreated: "2026-04-09",
    dateLastModification: "2026-04-10",
    dateStart: "2026-04-11",
    dateEnd: "2026-04-15",
    status: "status1",
    stepArray: [
      {
        id: "stp_y82mds",
        text: "Lister les besoins en matériel",
        checked: true,
        date: "2026-04-11",
        alert: false
      },
      {
        id: "stp_u77lqp",
        text: "Comparer les fournisseurs",
        checked: false,
        date: "2026-04-13",
        alert: false
      },
      {
        id: "stp_w55zbn",
        text: "Passer la commande",
        checked: false,
        date: "2026-04-14",
        alert: true
      }
    ],
    detail: "Commander matériel",
    priority: "LOW"
  },

  "id_9": {
    category: "RRF",
    title: "Prévisionnel annuel",
    dateCreated: "2026-02-15",
    dateLastModification: "2026-03-01",
    dateStart: "2026-03-05",
    dateEnd: "2026-04-30",
    status: "status3",
    stepArray: [
      {
        id: "stp_f19dke",
        text: "Collecter les historiques financiers",
        checked: true,
        date: "2026-03-10",
        alert: false
      },
      {
        id: "stp_g28slx",
        text: "Construire les hypothèses budgétaires",
        checked: false,
        date: "2026-04-05",
        alert: false
      },
      {
        id: "stp_k55pld",
        text: "Valider le prévisionnel avec la direction",
        checked: false,
        date: "2026-04-28",
        alert: true
      }
    ],
    detail: "Budget annuel",
    priority: "MEDIUM"
  },

  "id_10": {
    category: "SSI",
    title: "Test intrusion",
    dateCreated: "2026-04-07",
    dateLastModification: "2026-04-09",
    dateStart: "2026-04-12",
    dateEnd: "2026-04-22",
    status: "status1",
    stepArray: [
      {
        id: "stp_l92kfa",
        text: "Définir le périmètre du test",
        checked: true,
        date: "2026-04-12",
        alert: false
      },
      {
        id: "stp_z81mqp",
        text: "Lancer les scans de vulnérabilité",
        checked: false,
        date: "2026-04-15",
        alert: false
      },
      {
        id: "stp_e73xnb",
        text: "Exploiter les failles détectées",
        checked: false,
        date: "2026-04-18",
        alert: true
      },
      {
        id: "stp_r44plk",
        text: "Rédiger le rapport de pentest",
        checked: false,
        date: "2026-04-21",
        alert: false
      }
    ],
    detail: "Pentest interne",
    priority: "HIGH"
  }
};



// let noteToInsert = {
//     category : "",
//     title : "",
//     dateCreated : "format stamp ?",
//     dateLastModification : "format stamp ?",
//     dateStart : "format stamp ?",
//     dateEnd :  "format stamp ?",
//     status : "",
//     stepArray : {},
//     detail : "",
//     priority : "",
// };



//  -------------------------- Référencement--------------------------------





let taskSortSelectRef = document.getElementById("taskSortSelect"),
  inputTaskSearchRef = document.getElementById("inputTaskSearch"),
  divItemNoteListParentRef = document.getElementById("divItemNoteListParent");

// Editeur de note
let  btnTaskEditorValiderRef = document.getElementById("btnTaskEditorValider"),
  btnTaskEditorPrintRef = document.getElementById("btnTaskEditorPrint"),
  btnTaskEditorDelete = document.getElementById("btnTaskEditorDelete"),
  selectTaskEditorPriorityRef = document.getElementById("selectTaskEditorPriority"),
  selectTaskEditorStatusRef = document.getElementById("selectTaskEditorStatus"),
  inputTaskEditorCategoryRef = document.getElementById("inputTaskEditorCategory"),
  inputTaskEditorTitleRef = document.getElementById("inputTaskEditorTitle"),
  textareaTaskEditorDetailRef = document.getElementById("textareaTaskEditorDetail"),
  divTaskEditorStepParentRef = document.getElementById("divTaskEditorStepParent"),
  btnTaskEditorAddStepRef = document.getElementById("btnTaskEditorAddStep"),
  btnTaskEditorDateStartRef = document.getElementById("btnTaskEditorDateStart"),
  btnTaskEditorDateEndRef = document.getElementById("btnTaskEditorDateEnd");






// *  * * * * * *   *   * * ecouteur d'évènement




function onAddEventListenerForMainItems() {
  // Les tries et recherches
  const changeSortType = () => onChangeSortType();
  taskSortSelectRef.addEventListener("change",changeSortType)
  onAddEventListenerInRegistry("persistantItems",taskSortSelectRef,"change",changeSortType);

  

  // Lors de la saisie utilisateur (avec debounce)
  const onSearchTask = debounce(onSearchInput, 300);
  inputTaskSearchRef.addEventListener("input",onSearchTask);
  onAddEventListenerInRegistry("persistantItems",inputTaskSearchRef,"input",onSearchTask);



  //l'editeur de tache

  // Valider


  //imprimer

  //Supprimer

  //priority

  //status

  //Category
  const inputCategory = (event) => onCategoryInput(event);
  inputTaskEditorCategoryRef.addEventListener("input",inputCategory);
  onAddEventListenerInRegistry("taskItemEditor",inputTaskEditorCategoryRef,"input",inputCategory);

  //title
  const inputTitle = (event) => onTitleInput(event);
  inputTaskEditorTitleRef.addEventListener("input",inputTitle);
  onAddEventListenerInRegistry("taskItemEditor",inputTaskEditorTitleRef,"input",inputTitle);

  //detail


  //step

  //Date start

  //date end

}






// *    *   *   *   *   *   *   *   Class   *   *   *   *   *   *   *   *   *

class ItemNoteList {

  constructor(key, parentRef, urgence, category, title, percentValue, meta = {}) {

    this.key = key;

    // 🔥 enregistrement de l'instance dans le registry global
    itemTaskInstance.set(this.key, this);

    this.parentRef = parentRef;
    this.category = category;
    this.title = title;
    this.percentValue = percentValue;

    this.matchIn = meta.matchIn || [];
    this.highlight = meta.highlight || [];

    this.container = document.createElement("div");
    this.container.classList.add("task-list-item");
    // Click dessus
    this.container.addEventListener("click",()=>{
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

    // 🔍 badge "trouvé dans" (uniquement detail/steps)
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
      <div class="task-list-item-image"></div>

      <div class="task-list-item-content">

        <div class="task-list-item-header">

          <div class="task-list-item-texts">

            <!-- CATEGORY avec highlight -->
            <span class="task-list-item-category">
              [ ${this.highlight.includes("category")
                ? this.highlightText(this.category, query)
                : this.category} ]
            </span>

            <!-- TITLE avec highlight -->
            <div class="task-list-item-title">
              ${this.highlight.includes("title")
                ? this.highlightText(this.title, query)
                : this.title}
            </div>

            <!-- badge contextuel -->
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

    // 🔄 update progression
    if (data.percentValue !== undefined) {
      this.percentValue = data.percentValue;
    }

    // 🎨 re-render visuel
    this.render();
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
    status: ["status1", "status2", "status3"]
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
    label.textContent = `${groupValue.toUpperCase()} (${ids.length})`;
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

// Calcule le % de tâches terminées
function computeTaskProgress(stepArray) {

  if (!stepArray || stepArray.length === 0) return 0;

  const total = stepArray.length;
  const done = stepArray.filter(step => step.checked).length;

  return Math.round((done / total) * 100);
}






//  *   *   *   *   *   *   * TRIE *    *   *   *   *   *   *   *   *   





// Fonction de trie d'abord sur soit la priorité, la catégorie ou le status
// Puis sur le titre
function getSortedNotesIds(allUserNoteList, sortType) {
  const priorityOrder = {
    HIGH: 1,
    MEDIUM: 2,
    LOW: 3
  };

  return Object.entries(allUserNoteList)
    .map(([id, obj]) => ({ id, ...obj }))
    .sort((a, b) => {

      // 🔴 Cas spécial PRIORITY
      if (sortType === "priority") {
        const prioA = priorityOrder[a.priority] || 999;
        const prioB = priorityOrder[b.priority] || 999;

        if (prioA !== prioB) {
          return prioA - prioB;
        }
      } else {
        // 🟢 Cas standard (category, status, etc.)
        const valA = (a[sortType] || "").toLowerCase();
        const valB = (b[sortType] || "").toLowerCase();

        if (valA < valB) return -1;
        if (valA > valB) return 1;
      }

      // 🔵 fallback sur title
      const titleA = (a.title || "").toLowerCase();
      const titleB = (b.title || "").toLowerCase();

      if (titleA < titleB) return -1;
      if (titleA > titleB) return 1;

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



// RECHERCHE




// État global de l’UI (source de vérité)
let uiState = {
  sortType: "status",     // tri actuel
  searchQuery: "",         // texte de recherche actuel
  currentEditId: null // 🔥 ID de la note en cours d'édition
};






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

  // 🔥 on stocke l'ID actif
  uiState.currentEditId = noteId;

  const data = allUserNoteList[noteId];

  console.log(data);

  // ici tu remplis ton éditeur avec les données
  onSetTaskEditor(data);
}





// Set les éléments dans l'editeur
function onSetTaskEditor(data) {
  inputTaskEditorCategoryRef.value = data.category;
  inputTaskEditorTitleRef.value = data.title;
  textareaTaskEditorDetailRef.value = data.detail;
}








// Met à jour une seule ligne de la liste à partir du state global
function syncListItem(id) {

  // 🔍 récupérer instance UI
  const item = itemTaskInstance.get(id);

  // si pas affiché → rien à faire
  if (!item) return;

  // 📦 source de vérité
  const data = allUserNoteList[id];

  // 🔄 mise à jour ciblée de l'UI
  item.update({
    title: data.title,
    category: data.category,
    percentValue: computeTaskProgress(data.stepArray)
  });
}



// Stocke toutes les instances affichées dans la liste
// clé = id de la note
const itemTaskInstance = new Map();



//modification categorie
function onCategoryInput(e) {
  debouncedUpdateCategory(e.target.value);
}
// debounce global pour la categorie
const debouncedUpdateCategory = debounce((newCategory) => {

  const id = uiState.currentEditId;
  if (!id) return;

  // 🧠 update state
  allUserNoteList[id].category = newCategory;

  // 🔄 sync UI
  syncListItem(id);

}, 300);



// Modification du titre
function onTitleInput(e) {
  debouncedUpdateTitle(e.target.value);
}

// debounce global pour le titre
const debouncedUpdateTitle = debounce((newTitle) => {

  const id = uiState.currentEditId;
  if (!id) return;

  // 🧠 update state
  allUserNoteList[id].title = newTitle;

  // 🔄 sync UI
  syncListItem(id);

}, 300);


// exemple : toggle checkbox step
function onStepToggle(noteId) {

  debounce(() => {

    // 🧠 update state
    const task = allUserNoteList[noteId];

    task.percentValue = computeTaskProgress(task.stepArray);

    // 🔄 sync UI uniquement
    syncListItem(noteId);

  }, 200)();
}


// si le changement impacte le groupement → refresh global
function handleSortChange() {

  uiState.sortType =
    document.getElementById("taskSortSelect").value;

  // 🚨 ici on rebuild tout
  refreshUI();
}







eventUpdateList("status");
onAddEventListenerForMainItems();







