
let mainDisplayDateRef = document.getElementById("mainDisplayDate");

//Set la date du jour
function updateMainDisplayDate() {
    const formatted = new Intl.DateTimeFormat('fr-FR', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    }).format(new Date());

    const result = formatted.charAt(0).toUpperCase() + formatted.slice(1);

    mainDisplayDateRef.textContent = result;
}





// Fonction unique pour modifier tous les types de documents

async function updateDocumentInDB(docId, updateCallback) {
    try {
        // Récupérer le document
        const doc = await db.get(docId);

        if (!doc._id || !doc._rev) {
            throw new Error("Le document ne contient pas d'_id ou de _rev !");
        }

        // Appliquer la mise à jour avec la fonction callback
        const updatedDoc = updateCallback({ ...doc });

        // Sauvegarde en base
        const response = await db.put(updatedDoc);

        if (devMode === true){
            console.log(`Document ${docId} mis à jour avec succès :`, response);
        };
        return true;
    } catch (err) {
        console.error(`Erreur lors de la mise à jour du document ${docId} :`, err.message);
        return false;
    }
}





// Registre des listeners


// pour stocker tous les écouteurs d'évènements
const allEventListenerRegistry = {
    //l'éditeur d'un item
    persistantItems:[],
    taskItemEditor:[],
    setting:[]
}


//fonction pour gérer un ajout
function onAddEventListenerInRegistry(category, elementRef, actionType, calledFunction) {
    allEventListenerRegistry[category].push({elementRef, actionType, calledFunction });
}


//ATTENTION : categoryArray est un tableau. Exemple d'appel unique
//onRemoveEventListenerInRegistry(["categoryArray"])
function onRemoveEventListenerInRegistry(categoryArray) {
    categoryArray.forEach(category => {
        // Vérifie si la catégorie existe dans le registre
        if (allEventListenerRegistry[category]) {
            // Si des écouteurs sont présents pour cette catégorie
            allEventListenerRegistry[category].forEach(({ elementRef, actionType, calledFunction }) => {
                elementRef.removeEventListener(actionType, calledFunction);
            });
            // Vide le tableau après suppression
            allEventListenerRegistry[category] = [];
            if(true){
                console.log(`[EVENT-LISTENER] : Tous les écouteurs de ${category} ont été supprimés.`);
            }
        } else {
            console.warn(`[EVENT-LISTENER] : La catégorie ${category} n'existe pas dans le registre.`);
        }
    });
}

function onConsoleLogEventListenerRegistry() {
    let result = {};
    Object.keys(allEventListenerRegistry).forEach(category=>{
        result[category] = allEventListenerRegistry[category].length;
    });
    console.log("[EVENT-LISTENER]", result);
}





// Fonction debounce : limite les appels répétés
function debounce(fn, delay = 300) {
  let timeout;

  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), delay);
  };
}




// Formatage date

const EMPTY_DATE_LABEL = "📅 Non définie";

function formatDateFR(dateStr) {

    if (!dateStr) return EMPTY_DATE_LABEL;

    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return EMPTY_DATE_LABEL;

    const today = new Date();

    // comparaison correcte
    if (date.toDateString() === today.toDateString()) {
        return "Aujourd’hui";
    }

    return new Intl.DateTimeFormat("fr-FR", {
        day: "numeric",
        month: "short",
        year: "numeric"
    }).format(date);
}

// =========================
// UTILS
// =========================
function formatDateISO(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}



function generateStepId() {
  return "step_" + Date.now() + "_" + Math.floor(Math.random() * 1000);
}



// GESTION DES CHANGEMENTS DE MENU
let currentMenu = "MainPage";

function onChangeMenu(menuTarget) {


    console.log(`demande de changement de menu pour ${menuTarget}`);

    //Aucune action si clique sur le menu en cours
    if (currentMenu === menuTarget) {
        
        if (userSetting.devMode) {
            console.log("Aucune action c'est le même menu");
        }
        return;
    }

    //Traitement pour quitter l'ancien menu 
    onLeaveMenu(currentMenu);


    //Traitement pour le nouveau menu
    switch (menuTarget) {
        case "MainPage":
            btnMenuMainPageRef.classList.add("active");
            document.getElementById("sectionMainPage").classList.remove("hidden");
            document.getElementById("divToolbarSearch").classList.remove("hidden");
            document.getElementById("divMainPageTop").classList.remove("hidden");
            break;

        case "Setting":
            btnMenuSettingRef.classList.add("active");
            document.getElementById("sectionSettingPage").classList.remove("hidden");
            onOpenSettingMenu();
            break;

        case "Timeline":

            break;
    
        default:
            console.error(`[ NAVIGATION ] Erreur : Aucune correspondance pour le nouveau menu : ${menuTarget}`);
            break;
    }


    //Définit le menu choisi comme celui en cours
    currentMenu = menuTarget;

}

//fonction pour quitter un menu
function onLeaveMenu(menuTarget) {
    
    switch (menuTarget) {
        case "MainPage":
            // Retire le marqueur "active" sur le bouton
            btnMenuMainPageRef.classList.remove("active");
            document.getElementById("sectionMainPage").classList.add("hidden");
            document.getElementById("divToolbarSearch").classList.add("hidden");
            document.getElementById("divMainPageTop").classList.add("hidden");
            break;

        case "Setting":
            btnMenuSettingRef.classList.remove("active");
            document.getElementById("sectionSettingPage").classList.add("hidden");
            onLeaveSettingMenu();
            break;

        case "Timeline":

            break;
    
        default:
            console.error(`[ NAVIGATION ] Erreur : Aucune correspondance pour le nouveau menu : ${menuTarget}`);
            break;
    }
}