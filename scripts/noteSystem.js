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

let noteToInsert = {
    category : "",
    title : "",
    dateCreated : "format stamp ?",
    dateLastModification : "format stamp ?",
    dateStart : "format stamp ?",
    dateEnd :  "format stamp ?",
    status : "",
    stepArray : {},
    detail : "",
    priority : "",
};








// *    *   *   *   *   *   *   *   Class   *   *   *   *   *   *   *   *   *




class ItemNoteList {
    constructor(key,parentRef,urgence,category,title,percentValue) {
        this.key = key;
        this.parentRef = parentRef;
        this.urgence = urgence;
        this.category = category;
        this.title = title;
        this.percentValue = percentValue;

        // Création du container principal

        this.container = document.createElement("div");
        this.container.classList.add("task-list-item");
        this.container.id = `divContainerItemList_${this.key}`;


        //rendu
        this.render();

        //insertion dans le parent
        this.parentRef.appendChild(this.container);
    }


    render(){
        this.container.innerHTML = `
            <div class="task-list-item-image"></div>

            <!-- contenu -->
            <div class="task-list-item-content">

                <!-- ligne du haut -->
                <div class="task-list-item-header">
                
                <div class="task-list-item-texts">
                    <span class="task-list-item-category">[ ${this.category} ]</span>
                    <div class="task-list-item-title">
                    ${this.title}
                    </div>
                </div>

                <div class="task-list-item-percentage">${this.percentValue}%</div>

                </div>

                <!-- barre de progression -->
                <div class="task-list-item-progress">
                <div class="task-list-item-progress-bar" style="width: ${this.percentValue}%;"></div>
                </div>
            </div>
        `;
    }
}




// *    *   *   *   *   *   Actualisation de la liste * *   *   *   *   *   *   *   

// Quand l’utilisateur change le type de tri
function onChangeSortType() {

  uiState.sortType = document.getElementById("taskFilterSelect").value;

  // On réutilise la recherche actuelle
  refreshUI();
}




// Fonction centrale : applique search + sort + render
function refreshUI() {

  // 1. On récupère les IDs filtrés par recherche
  const filteredIds = searchNotes(uiState.searchQuery);

  // 2. On met à jour la liste avec tri + groupage
  eventUpdateList(uiState.sortType, filteredIds);
}

function eventUpdateList(sortType, filteredIds = null) {

  const parentRef = document.getElementById("divItemNoteListParent");
  parentRef.innerHTML = "";

  // IDs de base (filtrés ou tout)
  const baseIds = filteredIds || Object.keys(allUserNoteList);

  // On reconstruit un dataset filtré
  const filteredData = Object.fromEntries(
    baseIds.map(id => [id, allUserNoteList[id]])
  );

  // Tri + groupage
  const sortedIds = getSortedNotesIds(filteredData, sortType);
  const grouped = groupSortedIds(filteredData, sortedIds, sortType);

  // Ordres métier
  const groupOrderConfig = {
    priority: ["HIGH", "MEDIUM", "LOW"],
    status: ["status1", "status2", "status3"]
  };

  let orderedGroups;

  if (sortType === "category") {
    orderedGroups = Object.keys(grouped).sort((a, b) => a.localeCompare(b));
  } else {
    orderedGroups = groupOrderConfig[sortType] || Object.keys(grouped);
  }

  // Render UI
  orderedGroups.forEach(groupValue => {

    const ids = grouped[groupValue];
    if (!ids) return;

    // Label du groupe
    const label = document.createElement("div");
    label.classList.add("label");
    label.textContent = `${groupValue.toUpperCase()} (${ids.length})`;
    parentRef.appendChild(label);

    // Items
    ids.forEach(id => {
      const data = allUserNoteList[id];

      const percent = computeTaskProgress(data.stepArray);

      new ItemNoteList(
        id,
        parentRef,
        data.priority,
        data.category,
        data.title,
        percent
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
  searchQuery: ""         // texte de recherche actuel
};


// Fonction debounce : limite les appels répétés
function debounce(fn, delay = 300) {
  let timeout;

  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), delay);
  };
}

// Lors de la saisie utilisateur (avec debounce)
const inputSearch = document.getElementById("inputTaskSearch");

inputSearch.addEventListener(
  "input",
  debounce(onSearchInput, 300)
);



// Mise à jour de l’état + refresh global
function onSearchInput(e) {
  uiState.searchQuery = e.target.value;
  refreshUI();
}


// Retourne les IDs qui matchent la recherche
function searchNotes(query) {
  const q = query.toLowerCase().trim();

  // Si rien n’est tapé → on retourne tout
  if (!q) {
    return Object.keys(allUserNoteList);
  }

  return Object.entries(allUserNoteList)
    .filter(([id, note]) => matchesNote(note, q))
    .map(([id]) => id);
}

// Vérifie si une note correspond à la recherche
function matchesNote(note, q) {

  // recherche dans le titre
  if (note.title?.toLowerCase().includes(q)) return true;

  // recherche dans la catégorie
  if (note.category?.toLowerCase().includes(q)) return true;

  // recherche dans le détail
  if (note.detail?.toLowerCase().includes(q)) return true;

  // recherche dans les étapes
  if (note.stepArray?.some(step =>
    step.text?.toLowerCase().includes(q)
  )) return true;

  return false;
}





eventUpdateList("status");








