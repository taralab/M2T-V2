let currentExportVersion = 0;//version actuel des fichers d'import/export


























// ---------------------------------------- SAUVEGARDE ---------------------------------------------------


// Lors d'un export manual ou auto
// Step 1 sauvegarde de la date du jour dans setting
// Step 2 réinitialisation des chrono et minuteur avant export
// Step 3 lancement de export

async function eventSaveData() {

    //Traitement date de sauvegarde
    let saveDate = getSaveFormattedDateNow();
    userSetting.lastSaveDate = saveDate;

    //actualise l'affichage
    textSettingLastSaveDateRef.textContent = userSetting.lastSaveDate.readable;

    // Enregistrement date/heure dans les paramètres
    // Sauvegarde la modification
    await updateDocumentInDB(settingStoreName, (doc) => {
        doc.data = userSetting;
        return doc;
    });


    // suite à enregistrement de la date, export des données
    await exportDBToJson(saveDate.technical);

}




//récupère la date actuelle dans tous les formats
// Native : 
// Readable : mardi 26 mars 2026 à 10h05
// Technical : 2026-03-26_1005
function getSaveFormattedDateNow() {
  const now = new Date();

  // --- Format lisible FR ---
  const readable = new Intl.DateTimeFormat("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(now);

  const hours = now.getHours().toString().padStart(2, "0");
  const minutes = now.getMinutes().toString().padStart(2, "0");

  const readableFull = `${readable} à ${hours}h${minutes}`;

  // --- Format technique ---
  const year = now.getFullYear();
  const month = (now.getMonth() + 1).toString().padStart(2, "0");
  const day = now.getDate().toString().padStart(2, "0");

  const technical = `${year}-${month}-${day}_${hours}${minutes}`;

  return {
    native: now,
    readable: readableFull,
    technical: technical,
  };
}






async function exportDBToJson(saveDate) {
  try {
    // 1. Récupération des données
    const result = await db.allDocs({ include_docs: true });
    const exportedDocs = result.rows
      .map(row => row.doc)
      .filter(doc => !doc._deleted);

    // 2. Création du contenu
    const fullExport = {
      formatVersion: currentExportVersion,
      documents: exportedDocs,
      __integrity: {
        exportComplete: true,
        timestamp: Date.now()
      }
    };

    const jsonData = JSON.stringify(fullExport, null, 2);

    // 3. Nom du fichier
    const fileName = `M2T_V${currentExportVersion}_SAVE_${saveDate}.json`;

    // 4. Création du Blob
    const blob = new Blob([jsonData], { type: "application/json" });

    // 5. Création d’un lien temporaire
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");

    a.href = url;
    a.download = fileName;

    // 6. Déclenchement du téléchargement
    document.body.appendChild(a);
    a.click();

    // 7. Cleanup
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    if (devMode === true) {
      console.log("✅ Fichier téléchargé :", fileName);
    }

  } catch (err) {
    console.error("❌ Erreur pendant l’exportation :", err);
  }
}





// --------------------------------------------- IMPORT ------------------------------------------------------------




async function eventImportBdD() {

    /*
    =====================================================
    IMPORT DATABASE EVENT
    =====================================================

    Gère :
    - lecture du fichier JSON
    - validation structurelle
    - vérification version
    - suppression / recréation DB
    - import des documents
    - feedback UI succès / erreur

    =====================================================
    */

    /*
    -----------------------------------------------------
    VARIABLES
    -----------------------------------------------------
    */

    let isSaveVersionValid = true;

    const fileInput = inputSettingImportRef;

    const successBox =
        document.getElementById("settingImportSuccess");

    const errorBox =
        document.getElementById("settingImportError");

    /*
    -----------------------------------------------------
    RESET UI FEEDBACK
    -----------------------------------------------------
    */

    successBox.classList.add("hidden");
    errorBox.classList.add("hidden");

    /*
    -----------------------------------------------------
    CHECK FILE SELECTION
    -----------------------------------------------------
    */

    if (fileInput.files.length <= 0) {

        showImportError(
            "Aucun fichier sélectionné."
        );

        return;
    }

    /*
    -----------------------------------------------------
    FILE VARIABLES
    -----------------------------------------------------
    */

    const selectedFile =
        fileInput.files[0];

    const reader =
        new FileReader();

    /*
    -----------------------------------------------------
    FILE LOADED
    -----------------------------------------------------
    */

    reader.onload = async function (e) {

        const rawText =
            e.target.result;

        /*
        =====================================================
        WAIT FUNCTION
        =====================================================
        */

        const wait = (ms) =>
            new Promise(resolve =>
                setTimeout(resolve, ms)
            );

        /*
        =====================================================
        JSON INTEGRITY VALIDATION
        =====================================================

        Vérifie :
        - structure JSON
        - présence intégrité
        - taille minimale
        - parsing valide

        =====================================================
        */

        async function tryParseJsonWithIntegrity(
            text,
            maxAttempts = 3,
            delay = 1000
        ) {

            for (
                let attempt = 1;
                attempt <= maxAttempts;
                attempt++
            ) {

                const isValidStructure =

                    text.startsWith("{") &&
                    text.trim().endsWith("}") &&
                    text.includes('"__integrity":') &&
                    text.length > 100;

                if (isValidStructure) {

                    try {

                        return JSON.parse(text);

                    } catch (e) {

                        console.warn(
                            `[IMPORT] JSON.parse échoué - tentative ${attempt}`
                        );
                    }
                }

                /*
                ---------------------------------------------
                RETRY DELAY
                ---------------------------------------------
                */

                if (attempt < maxAttempts) {

                    console.warn(
                        `[IMPORT] Nouvelle tentative dans ${delay}ms`
                    );

                    await wait(delay);
                }
            }

            /*
            ---------------------------------------------
            INVALID FILE
            ---------------------------------------------
            */

            throw new Error(
                "Sauvegarde invalide ou corrompue."
            );
        }

        /*
        =====================================================
        IMPORT PROCESS
        =====================================================
        */

        try {

            /*
            -------------------------------------------------
            PARSE JSON
            -------------------------------------------------
            */

            const jsonData =
                await tryParseJsonWithIntegrity(rawText);

            console.log(
                "[IMPORT] JSON chargé :",
                jsonData
            );

            /*
            -------------------------------------------------
            FORMAT VERSION
            -------------------------------------------------
            */

            const version =
                jsonData.formatVersion ?? 0;

            /*
            -------------------------------------------------
            IMPORTED DOCUMENTS
            -------------------------------------------------
            */

            let importedDocs = [];

            /*
            -------------------------------------------------
            VERSION MANAGEMENT
            -------------------------------------------------
            */

            switch (version) {

                /*
                =============================================
                VERSION 0
                =============================================
                */

                case 0:

                    isSaveVersionValid = true;

                    importedDocs =
                        jsonData.documents ?? [];

                    /*
                    -----------------------------------------
                    VALIDATE DOCUMENT ARRAY
                    -----------------------------------------
                    */

                    if (
                        !Array.isArray(importedDocs)
                    ) {

                        throw new Error(
                            "Structure de sauvegarde invalide."
                        );
                    }

                    break;

                /*
                =============================================
                FUTURE VERSIONS
                =============================================

                case 1:
                    ...
                    break;

                */

                default:

                    throw new Error(
                        "Version de sauvegarde inconnue."
                    );
            }

            /*
            -------------------------------------------------
            VERSION NOT SUPPORTED
            -------------------------------------------------
            */

            if (!isSaveVersionValid) {

                showImportError(
                    "Cette sauvegarde n'est plus compatible."
                );

                return;
            }

            /*
            =====================================================
            DATABASE RESET
            =====================================================
            */

            console.log(
                "[IMPORT] Suppression ancienne base..."
            );

            await deleteBase();

            /*
            -------------------------------------------------
            RECREATE DATABASE
            -------------------------------------------------
            */

            db = new PouchDB(
                dbName,
                {
                    auto_compaction: true
                }
            );

            await db.info().then(info => {

                console.log(
                    "[DATABASE] Base créée :",
                    info
                );
            });

            /*
            -------------------------------------------------
            CREATE STORES
            -------------------------------------------------
            */

            await onCreateDBStore();

            /*
            =====================================================
            IMPORT DOCUMENTS
            =====================================================
            */

            console.log(
                `[IMPORT] ${importedDocs.length} documents à importer`
            );

            await importBdD(importedDocs);

            /*
            =====================================================
            IMPORT SUCCESS
            =====================================================
            */

            showImportSuccess(
                "Données importées avec succès."
            );

            /*
            -------------------------------------------------
            RESET INPUT
            -------------------------------------------------
            */

            fileInput.value = "";

            /*
            -------------------------------------------------
            RELOAD
            -------------------------------------------------
            */

            setTimeout(() => {

                window.location.reload();

            }, 1200);
            console.log(
                "[IMPORT] Import terminé avec succès."
            );
        }

        /*
        =====================================================
        IMPORT ERROR
        =====================================================
        */

        catch (error) {

            console.error(
                "[IMPORT] Erreur :",
                error
            );

            showImportError(
                error.message ||
                "Erreur lors de l'import."
            );
        }
    };

    /*
    =====================================================
    READ FILE
    =====================================================
    */

    reader.readAsText(selectedFile);

    /*
    =====================================================
    UI HELPERS
    =====================================================
    */

    /*
    -----------------------------------------------------
    SUCCESS MESSAGE
    -----------------------------------------------------
    */

    function showImportSuccess(message) {

        successBox.querySelector(
            ".setting-feedback-text"
        ).textContent = message;

        successBox.classList.remove("hidden");

        errorBox.classList.add("hidden");

        autoHide(successBox);
    }

    /*
    -----------------------------------------------------
    ERROR MESSAGE
    -----------------------------------------------------
    */

    function showImportError(message) {

        errorBox.querySelector(
            ".setting-feedback-text"
        ).textContent = message;

        errorBox.classList.remove("hidden");

        successBox.classList.add("hidden");

        autoHide(errorBox);
    }

    /*
    -----------------------------------------------------
    AUTO HIDE FEEDBACK
    -----------------------------------------------------
    */

    function autoHide(element) {

        setTimeout(() => {

            element.classList.add("hidden");

        }, 5000);
    }
}





async function importBdD(dataToImport) {
    console.log("IMPORTBDD");

    for (const e of dataToImport) {
        // TASK
        if (e.type === taskStoreName) {
            const tempTaskToInsertFormat = {
                category: e.category,
                title: e.title,
                dateCreated: e.dateCreated,
                dateStart: e.dateStart,
                dateEnd: e.dateEnd,
                status: e.status,
                stepArray: e.stepArray,
                detail: e.detail,
                priority: e.priority
            };
            await onInsertNewTaskInDB(tempTaskToInsertFormat);

            //SETTING
            }else if (e.type === settingStoreName){
                const tempSettingToUpdate = {

                isAutoSaveEnabled :
                    e.data.isAutoSaveEnabled
                    ?? defaultSetting.isAutoSaveEnabled,

                lastSaveDate :
                    e.data.lastSaveDate
                    ?? {},

                autoSaveFrequency :
                    e.data.autoSaveFrequency
                    ?? defaultSetting.autoSaveFrequency,

                devMode :
                    e.data.devMode
                    ?? defaultSetting.devMode
            };

            // Sauvegarde la modification
            await updateDocumentInDB(settingStoreName, (doc) => {
                doc.data = tempSettingToUpdate;
                return doc;
            });
        }
    }
};


async function deleteBase() {
    try {
        // Supprimer complètement la base de données (y compris les séquences et métadonnées)
        await new PouchDB(dbName).destroy();
        console.log("[DELETE] La base de données a été complètement supprimée.");
    } catch (error) {
        console.error("[DELETE] Erreur lors de la suppression complète de la base :", error);
    }
}
