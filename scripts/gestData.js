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






async function eventImportBdD(inputRef) {
    let isSaveVersionValid = true;
    const fileInput = document.getElementById(inputRef);
    let textResultRef = document.getElementById("pImportActivityResult");


    if (fileInput.files.length > 0) {
        textResultRef.innerHTML = "Veuillez patienter...";
        const selectedFile = fileInput.files[0];
        const reader = new FileReader();

        reader.onload = async function (e) {
            const rawText = e.target.result;

            // Fonction d'attente
            const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

            // Vérifie l'intégrité du fichier avant de parser
            async function tryParseJsonWithIntegrity(text, maxAttempts = 3, delay = 2000) {
                for (let attempt = 1; attempt <= maxAttempts; attempt++) {
                    if (
                        text.startsWith("{") &&
                        text.trim().endsWith("}") &&
                        text.includes('"__integrity":') &&
                        text.length > 100
                    ) {
                        try {
                            return JSON.parse(text);
                        } catch (e) {
                            console.warn(`[IMPORT] Tentative ${attempt} : JSON.parse échoué`);
                        }
                    }

                    if (attempt < maxAttempts) {
                        console.warn(`[IMPORT] Tentative ${attempt} échouée, nouvelle tentative dans ${delay}ms...`);
                        textResultRef.innerHTML = `Tentative d'import ${attempt} : Echec. Nouvelle tentative dans 2 secondes...`;
                        await wait(delay);
                    }
                }

                throw new Error("❌ Base inférieure à V3 non acceptée!");
            }

            try {
                const jsonData = await tryParseJsonWithIntegrity(rawText);

                // Détection du formatVersion (_v0 si inexistant = ancien format)
                const version = jsonData.formatVersion || 0;
                let importedDocs = [];

                switch (version) {
                    case 0:
                        console.log("[IMPORT] V0 plus supporté");
                        isSaveVersionValid = false;
                        break;

                    default:
                        throw new Error("⚠️ Format de fichier inconnu.");
                }

                if (!isSaveVersionValid) {
                    alert("Les sauvegardes inférieures à XX ne sont plus autorisées dans l'application");
                    textResultRef.innerHTML = "Sauvegardes inférieures à XX non autorisées !";
                    return;
                }

                await deleteBase();

                db = new PouchDB(dbName, { auto_compaction: true });
                await db.info().then(info => console.log(' [DATABASE] Base créée/ouverte :', info));

                await onCreateDBStore();

                await importBdD(importedDocs);

                textResultRef.innerHTML = "Importation réussie !";

            } catch (error) {
                console.error('[IMPORT] Erreur lors du traitement du fichier :', error);
                textResultRef.innerHTML = `Erreur d'importation : ${error.message}`;
            }
        };

        reader.readAsText(selectedFile);
    } else {
        console.error('[IMPORT] Aucun fichier sélectionné.');
        textResultRef.innerHTML = "Aucun fichier sélectionné !";
    }
}

