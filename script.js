document.getElementById('saveButton').addEventListener('click', saveData);
document.getElementById('searchInput').addEventListener('input', searchData);
document.getElementById('clearButton').addEventListener('click', clearData);
document.getElementById('saveEditButton').addEventListener('click', saveEditedData);
document.getElementById('closeEditModal').addEventListener('click', closeEditModal);

let editIndex = -1;

function saveData() {
    const text = document.getElementById('textInput').value.trim();
    const link = document.getElementById('linkInput').value.trim();
    const file = document.getElementById('imageInput').files[0];

    if (text || link || file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            let savedData = JSON.parse(localStorage.getItem('data')) || [];
            const imageData = file ? e.target.result : '';
            savedData.push({ text, link, image: imageData });
            localStorage.setItem('data', JSON.stringify(savedData));
            displaySavedData();
        };
        if (file) {
            reader.readAsDataURL(file);
        } else {
            let savedData = JSON.parse(localStorage.getItem('data')) || [];
            savedData.push({ text, link, image: '' });
            localStorage.setItem('data', JSON.stringify(savedData));
            displaySavedData();
        }
    }
}

function searchData() {
    const searchInput = document.getElementById('searchInput').value.trim().toLowerCase();
    const savedData = JSON.parse(localStorage.getItem('data')) || [];
    const searchResults = document.getElementById('searchResults');
    searchResults.innerHTML = '';

    savedData.forEach((item, index) => {
        if ((item.text && item.text.toLowerCase().includes(searchInput)) || 
            (item.link && item.link.toLowerCase().includes(searchInput)) || 
            (item.image && item.image.toLowerCase().includes(searchInput))) {
            const resultDiv = document.createElement('div');
            resultDiv.className = 'saved-item';
            resultDiv.innerHTML = highlightText(item.text || item.link, searchInput);

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

            const editButton = document.createElement('button');
            editButton.textContent = 'Редактировать';
            editButton.className = 'edit-button';
            editButton.addEventListener('click', () => editData(index));
            resultDiv.appendChild(editButton);

            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Удалить';
            deleteButton.className = 'delete-button';
            deleteButton.addEventListener('click', () => deleteData(index));
            resultDiv.appendChild(deleteButton);

            searchResults.prepend(resultDiv); // добавление найденного результата в начало списка
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

function displaySavedData() {
    const savedData = JSON.parse(localStorage.getItem('data')) || [];
    const savedDataDiv = document.getElementById('savedData');
    savedDataDiv.innerHTML = '';

    savedData.forEach((item, index) => {
        const dataDiv = document.createElement('div');
        dataDiv.className = 'saved-item';
        
        if (item.text) {
            const textElement = document.createElement('p');
            textElement.textContent = item.text;
            dataDiv.appendChild(textElement);
        }

        if (item.link) {
            const linkElement = document.createElement('a');
            linkElement.href = item.link;
            linkElement.textContent = item.link;
            linkElement.target = "_blank";
            dataDiv.appendChild(linkElement);
        }

        if (item.image) {
            const imgElement = document.createElement('img');
            imgElement.src = item.image;
            imgElement.addEventListener('click', () => openModal(item.image));
            dataDiv.appendChild(imgElement);
        }

        const editButton = document.createElement('button');
        editButton.textContent = 'Редактировать';
        editButton.className = 'edit-button';
        editButton.addEventListener('click', () => editData(index));
        dataDiv.appendChild(editButton);

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Удалить';
        deleteButton.className = 'delete-button';
        deleteButton.addEventListener('click', () => deleteData(index));
        dataDiv.appendChild(deleteButton);

        savedDataDiv.appendChild(dataDiv);
    });

    // Скрыть сохраненные данные
    savedDataDiv.style.display = 'none';
}

function deleteData(index) {
    let savedData = JSON.parse(localStorage.getItem('data')) || [];
    savedData.splice(index, 1);
    localStorage.setItem('data', JSON.stringify(savedData));
    displaySavedData();
}

function clearData() {
    localStorage.removeItem('data');
    displaySavedData();
    document.getElementById('searchResults').innerHTML = '';
}

// Modal functionality
function openModal(src) {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.id = 'imageModal';
    modal.innerHTML = `
        <span class="close" id="closeModal">&times;</span>
        <img class="modal-content" id="modalImage" src="${src}" style="max-width: 80%; max-height: 80%;">
    `;
    document.body.appendChild(modal);

    const closeModal = document.getElementById('closeModal');
    closeModal.onclick = function() {
        modal.style.display = "none";
        modal.remove();
    };

    modal.style.display = "block";
}

function editData(index) {
    editIndex = index;
    const savedData = JSON.parse(localStorage.getItem('data')) || [];
    document.getElementById('editInput').value = savedData[index].text || savedData[index].link || '';
    document.getElementById('editModal').style.display = 'block';
}

function closeEditModal() {
    document.getElementById('editModal').style.display = 'none';
    editIndex = -1;
}

function saveEditedData() {
    const newText = document.getElementById('editInput').value.trim();
    if (newText && editIndex > -1) {
        let savedData = JSON.parse(localStorage.getItem('data')) || [];
        savedData[editIndex].text = newText;
        localStorage.setItem('data', JSON.stringify(savedData));
        displaySavedData();
        closeEditModal();
    }
}

// Initial display of saved data
displaySavedData();
