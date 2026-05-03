

let dbName = `M2T_db`,
    taskStoreName = "Task",
    settingStoreName = "Setting";




// -----------------------------------  pouch DB -------------------------------------





// Créer (ou ouvrir si elle existe déjà) une base de données PouchDB
let  db = new PouchDB(dbName, { auto_compaction: true });//avec la suppression automatique des anciennes révisions

// Vérifier si la base est bien créée
let intialDbCountInfo = null;
db.info().then(info => {
    console.log(' [DATABASE] Base créée/ouverte :', info);
    intialDbCountInfo = info.doc_count;
    }
);


let lastHiddenTime = null;

/**
 * ================================
 * 🧠 FLUSH GLOBAL AVANT SORTIE
 * ================================
 * Objectif :
 * - Forcer l’exécution des debounces
 * - Limiter la perte de données
 *
 * ⚠️ Important :
 * - "flush()" déclenche la fonction mais n'attend PAS les await internes
 * - donc on est en "best effort" (limite navigateur)
 */


/**
 * ================================
 * 👁️ VISIBILITY CHANGE
 * ================================
 * Déclenché quand :
 * - changement d’onglet
 * - minimisation
 * - parfois fermeture
 */
window.addEventListener("visibilitychange", () => {

  if (document.visibilityState === "hidden") {

    console.log("[DB] ⚠️ visibilitychange → flush before background");

    // 🕒 IMPORTANT : timestamp de sortie
    lastHiddenTime = Date.now();

    // 🔄 flush tasks
    if (debouncedSaveAllTasks.flush) {
      debouncedSaveAllTasks.flush();
    }

    // 🔄 flush settings
    if (debouncedSaveUserSettings.flush) {
      debouncedSaveUserSettings.flush();
    }
  }

  if (document.visibilityState === "visible") {

    console.log("[APP] 👀 back in app");

    const now = Date.now();
    const SIX_HOURS = 21_600_000;

    if (lastHiddenTime && (now - lastHiddenTime > SIX_HOURS)) {

      console.log("[APP] 🔄 long inactivity detected → refresh UI");

      updateMainDisplayDate();
      refreshAlertList();
    }

    // 🧹 reset
    lastHiddenTime = null;
  }
});



/**
 * ================================
 * 🚪 PAGEHIDE (PLUS FIABLE)
 * ================================
 * Déclenché quand :
 * - fermeture onglet
 * - navigation
 * - reload
 *
 * 👉 plus fiable que visibilitychange seul
 */
window.addEventListener("pagehide", () => {

  console.log("[DB] ⚠️ pagehide → force flush");

  // 🔄 tâches
  if (debouncedSaveAllTasks.flush) {
    debouncedSaveAllTasks.flush();
  }

  // 🔄 settings
  if (debouncedSaveUserSettings.flush) {
    debouncedSaveUserSettings.flush();
  }
});





// Création des éléments de base
async function onCreateDBStore() {
    async function createStore(storeId, data) {
        try {
            let existing;
            try {
                existing = await db.get(storeId);
            } catch (err) {
                if (err.status !== 404) { // Si ce n'est pas une erreur "document non trouvé", on affiche l'erreur
                    console.error(`[DATABASE] Erreur lors de la vérification du store ${storeId}:`, err);
                    return;
                }
                existing = null;
            }

            if (!existing) {
                await db.put({ _id: storeId, ...data });
                console.log(`[DATABASE] Création du store ${storeId.toUpperCase()}`);
            } else {
                console.log(`[DATABASE] Le store ${storeId.toUpperCase()} existe déjà`);
            }
        } catch (err) {
            console.error(`[DATABASE] Erreur lors de la création du store ${storeId}:`, err);
        }
    }

    // Création des stores
    //Setting
    await createStore(settingStoreName, {
      type: settingStoreName,
      data:{
        isAutoSaveEnabled : defaultSetting.isAutoSaveEnabled,
        lastSaveDate : defaultSetting.lastSaveDate,
        autoSaveFrequency : defaultSetting.autoSaveFrequency,
        devMode : defaultSetting.devMode
      }  
    });


}



// Fonction pour récupérer les données des stores
async function onLoadStores() {
    try {
        
        const settings = await db.get(settingStoreName).catch(() => null);
        if (settings) {

            userSetting = {
                isAutoSaveEnabled : settings.data.isAutoSaveEnabled ?? defaultSetting.isAutoSaveEnabled,
                lastSaveDate : settings.data.lastSaveDate || defaultSetting.lastSaveDate,
                autoSaveFrequency : settings.data.autoSaveFrequency || defaultSetting.autoSaveFrequency,
                devMode : settings.data.devMode ?? defaultSetting.devMode
            };
        }

        if (userSetting.devMode){console.log("[DATABASE] Données chargées :", {userSetting });};
    } catch (err) {
        console.error("[DATABASE] Erreur lors du chargement des stores :", err);
    }
}



// Procésus de lancement de l'application
async function initApp() {
    await onCreateDBStore(); // 1️⃣ Création des stores si inexistnat

    await onLoadStores(); // Chargement des stores
    await onLoadTaskFromDB();
}



// Appel de la fonction après l'initialisation
initApp().then(() => firstActualisation());


async function firstActualisation() {
    eventUpdateList("status");
    onAddEventListenerForMainItems();

    refreshAlertList();

    updateMainDisplayDate();
};