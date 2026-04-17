let allUserNoteList = {};


let noteToInsert = {
    tag : "",
    title : "",
    dateCreated : "format stamp ?",
    dateLastModification : "format stamp ?",
    dateStart : "format stamp ?",
    dateEnd :  "format stamp ?",
    status : "",
    stepArray : {},
    detail : "",
    priority : "",
};








// *    *   *   *   *   *   *   *   Class   *   *   *   *   *   *   *   *   *




class ItemNoteList {
    constructor(key,parentRef,urgence,category,title,percentValue) {
        this.key = key;
        this.parentRef = parentRef;
        this.urgence = urgence;
        this.category = category;
        this.title = title;
        this.percentValue = percentValue;

        // Création du container principal

        this.container = document.createElement("div");
        this.container.classList.add("task-list-item");
        this.container.id = `divContainerItemList_${this.key}`;


        //rendu
        this.render();

        //insertion dans le parent
        this.parentRef.appendChild(this.container);
    }


    render(){
        this.container.innerHTML = `
            <div class="task-list-item-image"></div>

            <!-- contenu -->
            <div class="task-list-item-content">

                <!-- ligne du haut -->
                <div class="task-list-item-header">
                
                <div class="task-list-item-texts">
                    <span class="task-list-item-category">[ ${this.category} ]</span>
                    <div class="task-list-item-title">
                    ${this.title}
                    </div>
                </div>

                <div class="task-list-item-percentage">${this.percentValue}%</div>

                </div>

                <!-- barre de progression -->
                <div class="task-list-item-progress">
                <div class="task-list-item-progress-bar" style="width: ${this.percentValue}%;"></div>
                </div>
            </div>
        `;
    }
}



// TEST
let parentRef = document.getElementById("divItemNoteListParent");

new ItemNoteList("citron",parentRef,"URGENT","RRF","Formation des unités",80);

