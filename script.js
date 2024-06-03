document.getElementById('saveButton').addEventListener('click', saveText);
document.getElementById('searchButton').addEventListener('click', searchText);
document.getElementById('clearButton').addEventListener('click', clearTexts);

function saveText() {
    const textInput = document.getElementById('textInput');
    const text = textInput.value.trim();
    if (text) {
        let savedTexts = JSON.parse(localStorage.getItem('texts')) || [];
        savedTexts.push(text);
        localStorage.setItem('texts', JSON.stringify(savedTexts));
        textInput.value = '';
        displaySavedTexts();
    }
}

function searchText() {
    const searchInput = document.getElementById('searchInput').value.trim().toLowerCase();
    const savedTexts = JSON.parse(localStorage.getItem('texts')) || [];
    const searchResults = document.getElementById('searchResults');
    searchResults.innerHTML = '';

    savedTexts.forEach((text) => {
        if (text.toLowerCase().includes(searchInput)) {
            const resultDiv = document.createElement('div');
            resultDiv.innerHTML = highlightText(text, searchInput);
            searchResults.appendChild(resultDiv);
        }
    });
}

function highlightText(text, searchInput) {
    const index = text.toLowerCase().indexOf(searchInput);
    if (index !== -1) {
        const highlightedText = text.substring(0, index) + 
                               '<span class="highlight">' + 
                               text.substring(index, index + searchInput.length) + 
                               '</span>' + 
                               text.substring(index + searchInput.length);
        return highlightedText;
    }
    return text;
}

function displaySavedTexts() {
    const savedTexts = JSON.parse(localStorage.getItem('texts')) || [];
    const savedTextsDiv = document.getElementById('savedTexts');
    savedTextsDiv.innerHTML = '';

    savedTexts.forEach((text, index) => {
        const textDiv = document.createElement('div');
        textDiv.textContent = text;
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Удалить';
        deleteButton.className = 'delete-button';
        deleteButton.addEventListener('click', () => deleteText(index));
        textDiv.appendChild(deleteButton);
        savedTextsDiv.appendChild(textDiv);
    });
}

function deleteText(index) {
    let savedTexts = JSON.parse(localStorage.getItem('texts')) || [];
    savedTexts.splice(index, 1);
    localStorage.setItem('texts', JSON.stringify(savedTexts));
    displaySavedTexts();
}

function clearTexts() {
    localStorage.removeItem('texts');
    displaySavedTexts();
    document.getElementById('searchResults').innerHTML = '';
}

// Initial display of saved texts
displaySavedTexts();