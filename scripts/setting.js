

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
    let settingManualSaveButtonRef = document.getElementById("settingManualSaveButton");
    const manualSave = () => eventSaveData();
    settingManualSaveButtonRef.addEventListener("click",manualSave);
    onAddEventListenerInRegistry("setting",settingManualSaveButtonRef,"click",manualSave);

}



// ----------------------------------------------------


//Ouvre le menu
function onOpenSettingMenu() {
    onAddEventListenerForSetting();
}





// QUITTER

function onLeaveSettingMenu() {
    //Retire les écouteurs d'évènements
    onRemoveEventListenerInRegistry(["setting"]);
}