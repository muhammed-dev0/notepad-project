const parent = document.querySelector("body");
let mainSect = document.querySelector("#main-menu");
let settingSect = document.querySelector("#setting");
let addSect = document.querySelector("#adds-menu");
let header = document.querySelector("header");
let currentEditingId = null;

parent.addEventListener("click", (e) => {
    let buttons = e.target.closest("button")
    if (!buttons) return;
    let buttonsTask = buttons.dataset.task;

    switch (buttonsTask) {
        case "setting-page":
            settingOpen();
            break;

        case "return2":
            return2Main();
            break;

        case "add":
            addOpen();
            break;

        case "return3":
            return3Main();
            break;

        case "option":
            bgChange();
            break;

        case "save":
            saveNote();
            break;

        case "delete":
            deleteNotes(buttons.dataset.id);
            break;
    }

})

function settingOpen() {
    settingSect.classList.add("display-grid");
    header.classList.add("none");
    mainSect.classList.add("none");
}

function return2Main() {
    header.classList.remove("none");
    mainSect.classList.remove("none");
    settingSect.classList.remove("display-grid");
}

function addOpen() {
    header.classList.add("none");
    mainSect.classList.add("none");
    addSect.classList.add("display-grid");
}

function return3Main() {
    header.classList.remove("none");
    mainSect.classList.remove("none");
    addSect.classList.remove("display-grid");

    input.value = "";
    texteare.value = "";
}

let isActive = false;

function bgChange(){
    isActive = !isActive;

    if (isActive) {
        document.body.classList.add("ligth-mode");
    } else {
        document.body.classList.remove("ligth-mode")
    }
}

let notes = JSON.parse(localStorage.getItem("notes")) || [];
const input = document.querySelector(".input");
const texteare = document.querySelector(".text");
const emptyCont = document.querySelector("#empty-container");
const notesContainer = document.querySelector("#notes-container");

function saveNote() {
    if (texteare.value === "" && input.value === "") return;
    if (currentEditingId !== null) {
        notes = notes.map((note) => {
            if (note.id === currentEditingId) {
                return {
                    id: note.id,
                    title: input.value,
                    text: texteare.value
                }
            }
            return note;
        })
        currentEditingId = null;
    } else {
        const noteObject = {
            title: input.value,
            text: texteare.value,
            id: Date.now()
        }
        notes.push(noteObject);
    }

    localStorage.setItem("notes", JSON.stringify(notes));
    render(notes);
    input.value = "";
    texteare.value = "";
    return3Main();
}

function render(data) {
    const noteList = document.querySelector("#list");
    noteList.innerHTML = "";
    if (notes.length > 0) {
        emptyCont.classList.add("none")
        notesContainer.classList.add("display-flex");
    } else {
        emptyCont.classList.remove("none")
        notesContainer.classList.remove("display-flex");
    }

    data.forEach((item) => {
        let li = document.createElement("li");
        const delBtn = document.createElement("button");
        const spanContainer = document.createElement("div");
        const titleSpan = document.createElement("span");
        const textSpan = document.createElement("span");
        delBtn.innerHTML = '<img src="delete.svg" alt="Delete">';
        li.dataset.id = item.id;
        delBtn.dataset.task = "delete";
        delBtn.dataset.id = item.id;
        titleSpan.className = "title-text";
        textSpan.className = "text-span";
        li.className = "item-notes"

        titleSpan.textContent = item.title.length > 23 ? item.title.substring(0, 23) + "..." : item.title;
        textSpan.textContent = item.text.length > 29 ? item.text.substring(0, 29) + "..." : item.text
        spanContainer.append(titleSpan, textSpan)
        li.append(spanContainer, delBtn);
        noteList.append(li);

        li.addEventListener("click", (e) => editNotes(e, item.id));
    })
}

function editNotes(e, noteId) {
    if (e.target.closest("button")) return;
    const idAsNumber = Number(noteId);
    const originalNote = notes.find((n) => n.id === idAsNumber)

    if (originalNote) {
        input.value = originalNote.title
        texteare.value = originalNote.text;
        currentEditingId = originalNote.id;
    }

    addOpen();
}

window.addEventListener("load", () => {
    render(notes)
})

const searchInput = document.querySelector(".search-inp");
function filterNotes() {
    searchInput.addEventListener("input", () => {
        const filteredList = notes.filter((datas) => {
            return datas.title.toLowerCase().includes(searchInput.value.toLowerCase()) || datas.text.toLowerCase().includes(searchInput.value.toLowerCase());
        })
        render(filteredList)
    })
}
filterNotes();

function deleteNotes(id) {
    notes = notes.filter((note) => note.id !== Number(id));
    localStorage.setItem("notes", JSON.stringify(notes));
    render(notes);
}