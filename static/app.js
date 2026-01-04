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

    async function boldNote(){
        /*
        * Applies bold formatting to selected text. Unbold the text if text is already bold.
        * preserves cursor/selection position.
        */
        const start = noteBox.selectionStart;
        const end = noteBox.selectionEnd;
        //Pops out a message if the user clicks boldBtn before selecting any text.
        if (start == end){
            alert("Please select a chunk of text first...")
            return;
        }
        const value = noteBox.value;
        let before = value.slice(0, start);
        let selected = value.slice(start, end);
        let after = value.slice(end);
        let backOffset = 0;
        let frontOffset = 0;

        if (selected.startsWith("**") && selected.endsWith("**")){
            selected = selected.slice(2, -2);
            backOffset = -4;
        }
        else if (value.slice(start - 2, start) == "**" && value.slice(end, end + 2) == "**"){
            before = value.slice(0, start - 2);
            after = value.slice(end + 2);
            frontOffset = -2;
            backOffset = -2;
        }
        else{
            selected = "**" + selected + "**";
            backOffset = 4;
        }
        noteBox.value = before + selected + after;
        noteBox.focus();//restore cursor focus after modifying text value
        noteBox.selectionStart = start + frontOffset;
        noteBox.selectionEnd = end + backOffset;//To keep the selection of text the same after clicking btn.
    }

    async function italicizeNote(){
        /* 
        * Applies italic formatting to selected text.
        * Basically the same as boldNote.
        * If you/I want to know what some snippets of code in this function do, just look at boldNote().
        * 
        * NOT UPDATED YET.
        */
        const start = noteBox.selectionStart;
        const end = noteBox.selectionEnd;
        if (start == end){
            alert("Please select a chunk of text first...")
            return;
        }
        const before = noteBox.value.slice(0, start);
        const editing = noteBox.value.slice(start, end);
        const after = noteBox.value.slice(end);

        noteBox.value = before + "*" + editing + "*" + after;
        noteBox.focus();
        noteBox.selectionStart = start;
        noteBox.selectionEnd = end + 2;
    }

    loadNote();
    saveBtn.addEventListener('click', saveNote);
    boldBtn.addEventListener('click', boldNote);
    italicBtn.addEventListener('click', italicizeNote);
})