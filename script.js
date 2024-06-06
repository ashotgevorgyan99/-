document.getElementById('saveButton').addEventListener('click', saveData);
document.getElementById('searchButton').addEventListener('click', searchFiles);
document.getElementById('clearButton').addEventListener('click', clearData);
document.getElementById('showAllButton').addEventListener('click', showAllFiles);

let editIndex = null;

function saveData() {
    const text = document.getElementById('textInput').value.trim();
    const link = document.getElementById('linkInput').value.trim();
    const file = document.getElementById('imageInput').files[0];

    if (!text && !link && !file && editIndex === null) {
        alert('Введите текст, ссылку или выберите файл для сохранения');
        return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
        let savedData = JSON.parse(localStorage.getItem('data')) || [];
        const imageData = file ? e.target.result : '';

        if (editIndex !== null) {
            // Update existing item
            savedData[editIndex] = { text, link, image: imageData };
            editIndex = null;
        } else {
            // Add new item
            savedData.push({ text, link, image: imageData });
        }

        localStorage.setItem('data', JSON.stringify(savedData));
        clearInputs();
        searchFiles(); // Refresh the search results
    };
    if (file) {
        reader.readAsDataURL(file);
    } else {
        let savedData = JSON.parse(localStorage.getItem('data')) || [];
        if (editIndex !== null) {
            savedData[editIndex] = { text, link, image: savedData[editIndex].image };
            editIndex = null;
        } else {
            savedData.push({ text, link, image: '' });
        }
        localStorage.setItem('data', JSON.stringify(savedData));
        clearInputs();
        searchFiles(); // Refresh the search results
    }
}

function searchFiles() {
    const searchInput = document.getElementById('searchInput').value.trim().toLowerCase();
    const savedData = JSON.parse(localStorage.getItem('data')) || [];
    const searchResults = document.getElementById('searchResults');
    searchResults.innerHTML = ''; // Очищаем результаты поиска

    savedData.forEach((item, index) => {
        if ((item.text && item.text.toLowerCase().includes(searchInput)) || 
            (item.link && item.link.toLowerCase().includes(searchInput))) {
            const resultDiv = document.createElement('div');
            resultDiv.className = 'saved-item';

            if (item.text) {
                const textElement = document.createElement('p');
                textElement.innerHTML = highlightText(item.text, searchInput);
                resultDiv.appendChild(textElement);
            }

            if (item.link) {
                const linkElement = document.createElement('a');
                linkElement.href = item.link;
                linkElement.innerHTML = highlightText(item.link, searchInput);
                linkElement.target = "_blank";
                resultDiv.appendChild(linkElement);
            }

            if (item.image) {
                const imgElement = document.createElement('img');
                imgElement.src = item.image;
                imgElement.style.width = '100px';
                imgElement.style.height = '100px';
                imgElement.addEventListener('click', () => openModal(item.image));
                resultDiv.appendChild(imgElement);
            }

            const editDeleteDiv = document.createElement('div');
            editDeleteDiv.className = 'edit-delete-buttons';

            const editButton = document.createElement('button');
            editButton.textContent = 'Изменить';
            editButton.addEventListener('click', () => editItem(index));
            editDeleteDiv.appendChild(editButton);

            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Удалить';
            deleteButton.addEventListener('click', () => deleteItem(index));
            editDeleteDiv.appendChild(deleteButton);

            resultDiv.appendChild(editDeleteDiv);
            searchResults.appendChild(resultDiv);
        }
    });
}

function showAllFiles() {
    const savedData = JSON.parse(localStorage.getItem('data')) || [];
    const allFilesResults = document.getElementById('allFilesResults');
    allFilesResults.innerHTML = ''; // Очищаем результаты

    savedData.forEach((item, index) => {
        const resultDiv = document.createElement('div');
        resultDiv.className = 'saved-item';

        if (item.text) {
            const textElement = document.createElement('p');
            textElement.textContent = item.text;
            resultDiv.appendChild(textElement);
        }

        if (item.link) {
            const linkElement = document.createElement('a');
            linkElement.href = item.link;
            linkElement.textContent = item.link;
            linkElement.target = "_blank";
            resultDiv.appendChild(linkElement);
        }

        if (item.image) {
            const imgElement = document.createElement('img');
            imgElement.src = item.image;
            imgElement.style.width = '100px';
            imgElement.style.height = '100px';
            imgElement.addEventListener('click', () => openModal(item.image));
            resultDiv.appendChild(imgElement);
        }

        const editDeleteDiv = document.createElement('div');
        editDeleteDiv.className = 'edit-delete-buttons';

        const editButton = document.createElement('button');
        editButton.textContent = 'Изменить';
        editButton.addEventListener('click', () => editItem(index));
        editDeleteDiv.appendChild(editButton);

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Удалить';
        deleteButton.addEventListener('click', () => deleteItem(index));
        editDeleteDiv.appendChild(deleteButton);

        resultDiv.appendChild(editDeleteDiv);
        allFilesResults.appendChild(resultDiv);
    });
}

function clearData() {
    localStorage.removeItem('data');
    document.getElementById('searchResults').innerHTML = '';
    document.getElementById('allFilesResults').innerHTML = '';
}

function highlightText(text, searchInput) {
    const regex = new RegExp(`(${searchInput})`, 'gi');
    return text.replace(regex, "<span class='highlight'>$1</span>");
}

function openModal(imageSrc) {
    const modal = document.getElementById('imageModal');
    const modalImage = document.getElementById('modalImage');
    modal.style.display = 'block';
    modalImage.src = imageSrc;

    const closeModal = document.querySelector('.close');
    closeModal.onclick = function() {
        modal.style.display = 'none';
    }
}

function editItem(index) {
    const savedData = JSON.parse(localStorage.getItem('data')) || [];
    const item = savedData[index];

    document.getElementById('textInput').value = item.text || '';
    document.getElementById('linkInput').value = item.link || '';
    // Note: Image file input cannot be set programmatically for security reasons.

    editIndex = index;
}

function deleteItem(index) {
    const savedData = JSON.parse(localStorage.getItem('data')) || [];
    savedData.splice(index, 1);
    localStorage.setItem('data', JSON.stringify(savedData));
    searchFiles();
}

function clearInputs() {
    document.getElementById('textInput').value = '';
    document.getElementById('linkInput').value = '';
    document.getElementById('imageInput').value = '';
}
