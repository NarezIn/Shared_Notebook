const noteBox = document.getElementById("noteBox")
const saveBtn = document.getElementById("saveBtn")
const boldBtn = document.getElementById("boldBtn")

//GET notes_data
fetch('/note')
    .then(res => res.text())
    .then(text => noteBox.value = text)

//POST notes_data
saveBtn.addEventListener('click', () => {
    fetch("/note", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({text: noteBox.value})
    });
});