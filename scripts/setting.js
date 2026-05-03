

let devMode = false,
    userSetting = {};


const defaultSetting =  {
    isAutoSaveEnabled : false,
    lastSaveDate : {},
    autoSaveFrequency : 7,
    devMode : false,
};




function onAddEventListenerForSetting() {
    
    //gest data
    //Import
    const importData = () => eventImportBdD();
    inputSettingImportRef.addEventListener("change",importData);
    onAddEventListenerInRegistry("setting",inputSettingImportRef,"change",importData);

    //Export
    const manualSave = () => eventSaveData();
    btnSettingManualSaveButtonRef.addEventListener("click",manualSave);
    onAddEventListenerInRegistry("setting",btnSettingManualSaveButtonRef,"click",manualSave);

    //sauvegarde auto
    const changeAutoSave = () => onAutoSaveChange();
    inputSettingAutoSaveToggleRef.addEventListener("change",changeAutoSave);
    onAddEventListenerInRegistry("setting",inputSettingAutoSaveToggleRef,"change",changeAutoSave);

    //sauvegarde frequence
    const changeSaveFrequency = () => onAutoSaveFrequencyChange();
    selectSettingAutoSaveFrequencyRef.addEventListener("change",changeSaveFrequency);
    onAddEventListenerInRegistry("setting",selectSettingAutoSaveFrequencyRef,"change",changeSaveFrequency);

    //devmode
    const changeDevMode = () => onDevModeChange();
    inputSettingDevModeToggleRef.addEventListener("change",changeDevMode);
    onAddEventListenerInRegistry("setting",inputSettingDevModeToggleRef,"change",changeDevMode);

}




//référencement

let btnSettingManualSaveButtonRef,
    inputSettingAutoSaveToggleRef,
    textSettingLastSaveDateRef,
    selectSettingAutoSaveFrequencyRef,
    inputSettingImportRef,
    inputSettingDevModeToggle;

// ----------------------------------------------------


//Ouvre le menu
function onOpenSettingMenu() {

    //Référence
    onReferenceSettingMenu();

    //Ajout écouteur
    onAddEventListenerForSetting();

    //Set les éléments
    onSetSettingMenu();
}




function onReferenceSettingMenu() {
    btnSettingManualSaveButtonRef = document.getElementById("btnSettingManualSaveButton");
    inputSettingAutoSaveToggleRef = document.getElementById("inputSettingAutoSaveToggle");
    textSettingLastSaveDateRef = document.getElementById("textSettingLastSaveDate");
    selectSettingAutoSaveFrequencyRef = document.getElementById("selectSettingAutoSaveFrequency");
    inputSettingImportRef = document.getElementById("inputSettingImport");
    inputSettingDevModeToggleRef = document.getElementById("inputSettingDevModeToggle");
}



//Set les éléments
function onSetSettingMenu() {
    inputSettingAutoSaveToggleRef.checked = userSetting.isAutoSaveEnabled;
    selectSettingAutoSaveFrequencyRef.value = userSetting.autoSaveFrequency;
    textSettingLastSaveDateRef.textContent = userSetting.lastSaveDate.readable;
    inputSettingDevModeToggleRef.checked = userSetting.devMode;
}






// Modification sauvegarde automatique
function onAutoSaveChange() {
  const newValue = inputSettingAutoSaveToggleRef.checked;

  if (userSetting.isAutoSaveEnabled === newValue) return;

  userSetting.isAutoSaveEnabled = newValue;
  debouncedSaveUserSettings();
}


// modification fréquence sauvegarde auto
function onAutoSaveFrequencyChange() {
  const newValue = selectSettingAutoSaveFrequencyRef.value;

  if (userSetting.autoSaveFrequency === newValue) return;

  userSetting.autoSaveFrequency = newValue;
  debouncedSaveUserSettings();
}


// modification devMode
function onDevModeChange() {
  const newValue = inputSettingDevModeToggleRef.checked;

  if (userSetting.devMode === newValue) return;

  userSetting.devMode = newValue;
  debouncedSaveUserSettings();
}


















/**
 * ================================
 * 🔒 ÉTAT INTERNE
 * ================================
 */

// Snapshot du dernier état sauvegardé (pour éviter les writes inutiles)
let lastSavedSettingsHash = null;

// Permet de sérialiser les écritures (évite les conflits simultanés)
let isSaving = false;

// Si une sauvegarde est demandée pendant un save → on relance après
let saveRequestedWhileSaving = false;


/**
 * ================================
 * 🧠 UTILITAIRE : HASH SIMPLE
 * ================================
 * Permet de comparer rapidement l'état courant vs dernier état sauvegardé
 */
function hashSettings(obj) {
  return JSON.stringify(obj);
}


/**
 * ================================
 * 💾 SAVE AVEC RETRY (gestion conflits)
 * ================================
 */
async function saveUserSettingsWithRetry(maxRetries = 3) {

  let attempt = 0;

  while (attempt < maxRetries) {
    try {

      // 🔄 récupérer la dernière version du doc
      const doc = await db.get(settingStoreName);

      // 🧬 appliquer les nouvelles données
      doc.data = userSetting;

      // 💾 sauvegarde
      const response = await db.put(doc);

      if (userSetting.devMode) {
        console.log(`[SETTINGS] ✅ saved (attempt ${attempt + 1})`, response);
      }

      return true;

    } catch (err) {

      // ⚠️ conflit de révision → retry
      if (err.status === 409) {
        attempt++;

        if (userSetting.devMode) {
          console.warn(`[SETTINGS] ⚠️ conflict, retry ${attempt}`);
        }

        continue;
      }

      // ❌ autre erreur → stop
      console.error("[SETTINGS] ❌ error", err);
      return false;
    }
  }

  console.error("[SETTINGS] ❌ failed after retries");
  return false;
}


/**
 * ================================
 * 🚀 DEBOUNCED SAVE PRINCIPAL
 * ================================
 */
const debouncedSaveUserSettings = debounce(async () => {

  const currentHash = hashSettings(userSetting);

  // ⏭️ skip si aucune modification réelle
  if (currentHash === lastSavedSettingsHash) {
    if (userSetting.devMode) {
      console.log("[SETTINGS] ⏭️ skip (no change)");
    }
    return;
  }

  // 🔒 si un save est déjà en cours → on marque qu'un save est demandé
  if (isSaving) {
    saveRequestedWhileSaving = true;

    if (userSetting.devMode) {
      console.log("[SETTINGS] ⏳ save déjà en cours → replanifié");
    }
    return;
  }

  isSaving = true;

  if (userSetting.devMode) {
    console.log("[SETTINGS] 🚀 Début save");
  }

  const success = await saveUserSettingsWithRetry();

  if (success) {
    // ✅ on met à jour le snapshot uniquement si succès
    lastSavedSettingsHash = currentHash;
  }

  isSaving = false;

  // 🔁 si une modif est arrivée pendant le save → on relance
  if (saveRequestedWhileSaving) {
    saveRequestedWhileSaving = false;

    if (userSetting.devMode) {
      console.log("[SETTINGS] 🔁 relance après save");
    }

    debouncedSaveUserSettings();
  }

}, 1500); // ⏱️ ajustable






// QUITTER


//vide les références du menu
function onClearSettingReferences() {
    btnSettingManualSaveButtonRef = null;
    inputSettingAutoSaveToggleRef = null;
    textSettingLastSaveDateRef = null;
    selectSettingAutoSaveFrequencyRef = null;
    inputSettingImportRef = null;
    inputSettingDevModeToggleRef = null;
}



function onLeaveSettingMenu() {
    //Retire les écouteurs d'évènements
    onRemoveEventListenerInRegistry(["setting"]);

    //Vide les références
    onClearSettingReferences();
}