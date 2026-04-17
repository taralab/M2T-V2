let allUserNoteList = {
  "id_1": {
    category: "RRF",
    title: "Analyse budget Q1",
    dateCreated: "2026-04-10",
    dateLastModification: "2026-04-12",
    dateStart: "2026-04-15",
    dateEnd: "2026-04-20",
    status: "status1",
    stepArray: {},
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
    stepArray: {},
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
    stepArray: {},
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
    stepArray: {},
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
    stepArray: {},
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
    stepArray: {},
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
    stepArray: {},
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
    stepArray: {},
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
    stepArray: {},
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
    stepArray: {},
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

function onChangeSortType() {
    
    let newSortType = document.getElementById("taskFilterSelect").value;

    eventUpdateList(newSortType);
}





function eventUpdateList(sortType) {

  const sortedIds = getSortedNotesIds(allUserNoteList, sortType);
  const grouped = groupSortedIds(allUserNoteList, sortedIds, sortType);

  const parentRef = document.getElementById("divItemNoteListParent");
  parentRef.innerHTML = "";

  // 🔹 Ordres métier fixes
  const groupOrderConfig = {
    priority: ["HIGH", "MEDIUM", "LOW"],
    status: ["status1", "status2", "status3"]
  };

  let orderedGroups;

  if (sortType === "category") {
    // 🔸 Tri alphabétique dynamique
    orderedGroups = Object.keys(grouped)
      .sort((a, b) => a.localeCompare(b));
  } else {
    // 🔸 Ordre métier si défini
    orderedGroups = groupOrderConfig[sortType] || Object.keys(grouped);
  }

  orderedGroups.forEach(groupValue => {

    const ids = grouped[groupValue];
    if (!ids) return;

    // 🔹 Label
    const label = document.createElement("div");
    label.classList.add("label");
    label.textContent = `${groupValue.toUpperCase()} (${ids.length})`;
    parentRef.appendChild(label);

    // 🔹 Items
    ids.forEach(id => {
      const data = allUserNoteList[id];

      new ItemNoteList(
        id,
        parentRef,
        data.priority,
        data.category,
        data.title,
        80
      );
    });

  });
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







eventUpdateList("status");








