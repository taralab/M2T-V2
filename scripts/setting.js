

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



    //Export
    const manualSave = () => eventSaveData();
    btnSettingManualSaveButtonRef.addEventListener("click",manualSave);
    onAddEventListenerInRegistry("setting",btnSettingManualSaveButtonRef,"click",manualSave);

}




//référencement

let btnSettingManualSaveButtonRef,
    inputSettingAutoSaveToggleRef,
    textSettingLastSaveDateRef,
    selectSettingAutoSaveFrequencyRef,
    inputSettingImport,
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