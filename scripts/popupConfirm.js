

// Confirmation suppression editeur (activity, template,templateSession, session)
let btnGlobalPopupCancelEventListener = null,
    btnGlobalPopupConfirmEventListener = null;


const confirmPopupContextData = {
    delete : {
        mainText :"Êtes-vous sûr de vouloir supprimer ?",
        secondaryText:"Cette action est irréversible. Toutes les données associées seront définitivement supprimées.",
        confirmBtnText : "Supprimer",
        iconRef:"🗑️"
    },
    cloturer: {
        mainText :"",
        secondaryText:"",
        confirmBtnText : "",
        iconRef:""
    } 
};




function addEventForGlobalPopupConfirmation(confirmPopupFunction,contextData) {

    if (devMode === true) {
        console.log("[EVENT-LISTENER] Ajoute évènement pour confirmation :", confirmPopupFunction);
    }




    // Annulation
    let cancelBtnTarget = document.getElementById("btnPopupConfirmCancel");
    // retire l'évènement s'il éxistait
    if (btnGlobalPopupCancelEventListener && cancelBtnTarget) {
        cancelBtnTarget.removeEventListener("click",btnGlobalPopupCancelEventListener);
        btnGlobalPopupCancelEventListener = null;
    }

    btnGlobalPopupCancelEventListener = () => {
        removeEventForGlobalPopupConfirmation();
    }

    cancelBtnTarget.addEventListener("click",btnGlobalPopupCancelEventListener);


    // Confirmation

    let confirmBtnTarget = document.getElementById("btnPopupConfirmValid");
    // retire l'évènement s'il éxistait
    if (btnGlobalPopupConfirmEventListener && confirmBtnTarget) {
        confirmBtnTarget.removeEventListener("click",btnGlobalPopupConfirmEventListener);
        btnGlobalPopupConfirmEventListener = null;
    }

    btnGlobalPopupConfirmEventListener = (event) =>{
        confirmPopupFunction(event);
    }
    
    confirmBtnTarget.addEventListener("click",btnGlobalPopupConfirmEventListener);


    // Set les éléments text
    document.getElementById("divPopupConfirmIcon").textContent = contextData.iconRef;
    document.getElementById("popupConfirmMainText").textContent = contextData.mainText;
    document.getElementById("popupConfirmSecondaryText").textContent = contextData.secondaryText;
    document.getElementById("btnPopupConfirmValid").textContent = contextData.confirmBtnText;

    // Affiche 
    document.getElementById("divGlobalPopupConfirmation").style.display = "flex";
}



function removeEventForGlobalPopupConfirmation() {
    if (devMode === true) {
        console.log("[EVENT-LISTENER] retrait des évènements pour confirmation suppression");
    }


    // Bouton d'Annulation
    let cancelBtnTarget = document.getElementById("divGlobalPopupConfirmation");
    if (btnGlobalPopupCancelEventListener && cancelBtnTarget) {
        cancelBtnTarget.removeEventListener("click",btnGlobalPopupCancelEventListener);
        btnGlobalPopupCancelEventListener = null;
    }

    // Bouton de confirmation
    let confirmBtnTarget = document.getElementById("btnPopupConfirmValid");
    if (btnGlobalPopupConfirmEventListener && confirmBtnTarget) {
        confirmBtnTarget.removeEventListener("click",btnGlobalPopupConfirmEventListener);
        btnGlobalPopupConfirmEventListener = null;
    }

    // Retire l'affichage
    document.getElementById("divGlobalPopupConfirmation").style.display = "none";
}

