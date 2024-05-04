let currentTab = 'plans'; // Default tab

function changeTab(tab) {
    currentTab = tab; // Update the current tab
    document.getElementById('tabContent').innerHTML = `
        <input type="text" id="${tab}Title" placeholder="Message Topic" class="message-topic">
        <textarea id="${tab}Text" placeholder="Write your ${tab}..."></textarea>
        <button onclick="saveContent('${tab}')">Save</button>
        <div id="saved${capitalizeFirstLetter(tab)}"></div>
        <button onclick="showAllNotesDetails('${tab}')">View All Notes</button>
    `;
    loadContent(tab);
}

function saveContent(tab) {
    const titleInput = document.getElementById(`${tab}Title`);
    const textArea = document.getElementById(`${tab}Text`);
    const title = titleInput.value;
    const content = textArea.value;

    if (title && content) {
        const timestamp = new Date().toISOString();
        const savedContent = JSON.parse(localStorage.getItem(tab) || '[]');
        savedContent.push({ title, content, timestamp });
        localStorage.setItem(tab, JSON.stringify(savedContent));

        // Clear input fields
        titleInput.value = '';
        textArea.value = '';
        loadContent(tab); // Refresh the content display
    } else {
        alert("Title or content cannot be empty");
    }
}

function loadContent(tab) {
    const savedContent = JSON.parse(localStorage.getItem(tab) || '[]');
    const contentDiv = document.getElementById(`saved${capitalizeFirstLetter(tab)}`);
    contentDiv.innerHTML = '';
    savedContent.forEach((note, index) => {
        const noteElement = document.createElement('div');
        noteElement.className = 'note';
        noteElement.innerHTML = `
            <span onclick="showNoteDetails('${tab}', ${index})">${note.title} - ${new Date(note.timestamp).toLocaleString()}</span>
            <button class="delete-btn" onclick="deleteNote('${tab}', ${index}, event)">X</button>
        `;
        contentDiv.appendChild(noteElement);
    });
}

function deleteNote(tab, index, event) {
    event.stopPropagation(); // Prevent opening the note details
    const savedContent = JSON.parse(localStorage.getItem(tab));
    savedContent.splice(index, 1);
    localStorage.setItem(tab, JSON.stringify(savedContent));
    loadContent(tab);
}

function showAllNotesDetails(tab) {
    const savedContent = JSON.parse(localStorage.getItem(tab) || '[]');
    if (savedContent.length === 0) {
        alert("No notes to display.");
        return;
    }
    let allNotesHtml = '<h2>All Notes</h2>';

    savedContent.forEach(note => {
        const noteDate = new Date(note.timestamp);
        const formattedDate = noteDate.toLocaleString();
        allNotesHtml += `<div class="note-detail">
            <h3>${note.title}</h3>
            <p>${note.content}</p>
            <p><em>${formattedDate}</em></p>
            <hr>
        </div>`;
    });

    // Set modal title and content dynamically
    document.getElementById('noteTitle').innerText = 'All Notes'; // Display "All Notes" as a title
    document.getElementById('noteContent').innerHTML = allNotesHtml;
    document.getElementById('noteDetailModal').style.display = 'block';
}

function showNoteDetails(tab, index) {
    const savedContent = JSON.parse(localStorage.getItem(tab));
    const note = savedContent[index];
    const noteDate = new Date(note.timestamp);
    const formattedDate = noteDate.toLocaleString();
    
    document.getElementById('noteTitle').innerText = note.title;
    document.getElementById('noteContent').innerHTML = `
        <p>${note.content}</p>
        <p><em>${formattedDate}</em></p>
    `;
    document.getElementById('noteDetailModal').style.display = 'block';
}

function closeModal() {
    document.getElementById('noteDetailModal').style.display = 'none';
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

window.onload = () => changeTab(currentTab);
