


// Registre des listeners


// pour stocker tous les écouteurs d'évènements
const allEventListenerRegistry = {
    //l'éditeur d'un item
    persistantItems:[],
    taskItemEditor:[]
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

  return new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  }).format(date);
}


function generateStepId() {
  return "step_" + Date.now() + "_" + Math.floor(Math.random() * 1000);
}