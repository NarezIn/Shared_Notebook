document.addEventListener("DOMContentLoaded", () => {
    const noteBox = document.getElementById("noteBox");
    const saveBtn = document.getElementById("saveBtn");
    const boldBtn = document.getElementById("boldBtn");
    const italicBtn = document.getElementById("italicBtn");
    const preview = document.getElementById("preview");

    const statusSpan = document.getElementById("status");
    const userColumn = document.getElementById("userColumn");
    let username = localStorage.getItem("username");
    

    async function getAnonyUser(){
        if (username) return username;
        const res = await fetch("new_anony_user");
        const data = await res.json();

        username = data.username;
        localStorage.setItem("username", username);
        return username;
    }

    //would send a GET request and call notes_data in backend
    async function loadNote(){
        const res = await fetch('/note');
        const notes = await res.json();

        userColumn.textContent = notes.map(n => n.username).join('\n');
        noteBox.value = notes.map(n => n.text).join("\n");
        preview.innerHTML = renderMarkdown(noteBox.value);
        //Try const fullText = notes.map(n => n.text).join("\n");
        //and then see nteoBox.value = fullText;
    }

    //POST notes_data
    async function saveNote(){
        const user = await getAnonyUser();
        const lines = noteBox.value.split("\n");

        await fetch("/note", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                username: user,
                text: lines
            })
        });

        await loadNote();
        statusSpan.textContent = "Just Saved!";//This raises an error.... Resolve it later.
    }

    function renderMarkdown(text) {
        // bold: **text** → <b>text</b>
        text = text.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>');
        // italic: *text* → <i>text</i>
        text = text.replace(/\*(.*?)\*/g, '<i>$1</i>');
        return text;
    }

    function setPreviewInnerHTML(){
        preview.innerHTML = renderMarkdown(noteBox.value);
    }

    function boldNote(){
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
        let offset = 0;
        
        const lines = selected.split("\n");
        const processedLines = lines.map(line => {
            if (line.startsWith("**") && line.endsWith("**")) {
                offset -= 4;
                return line.slice(2, -2);
            } 
            else {
                offset += 4;
                return "**" + line + "**";
            }
        });
        const newSelected = processedLines.join("\n");

        const scrollPosi = noteBox.scrollTop;//remember the scroll position, cuz setting noteBox.value would auto-scroll to the buttom.
        noteBox.value = before + newSelected + after;

        noteBox.focus();//restore cursor focus after modifying text value
        noteBox.selectionStart = start;
        noteBox.selectionEnd = end + offset;//to keep the selection of text the same after clicking btn.

        noteBox.scrollTop = scrollPosi;//restore scroll position.
        noteBox.dispatchEvent(new Event('input'));//manually kindle 'input', so rendered markdown would display bold text right after clicking boldBtn.
    }

    function italicizeNote(){
        /* 
        * Applies italic formatting to selected text.
        * Basically the same as boldNote.
        * If you/I want to know what some snippets of code in this function do, just look at boldNote().
        * 
        * NOT UPDATED YET.
        */
        alert("This feature is not supported right now!");
        return;
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
    noteBox.addEventListener("input", setPreviewInnerHTML);
})