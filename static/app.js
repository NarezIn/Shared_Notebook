document.addEventListener("DOMContentLoaded", () => {
    const noteBox = document.getElementById("noteBox")
    const saveBtn = document.getElementById("saveBtn")
    const boldBtn = document.getElementById("boldBtn")
    const italicBtn = document.getElementById("italicBtn")

    const statusSpan = document.getElementById("status")

    //Encapsulated function: GET notes_data
    async function loadNote(){
        const res = await fetch('/note');
        const text = await res.text();
        noteBox.value = text;
    }

    //POST notes_data
    async function saveNote(){
        const res = await fetch("/note", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({text: noteBox.value})
        });
        statusSpan.textContent = "Just Saved!";
    }

    loadNote();
    saveBtn.addEventListener('click', saveNote);
})