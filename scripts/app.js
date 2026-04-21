

let dbName = `M2T_db`,
    taskStoreName = "Task";



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
