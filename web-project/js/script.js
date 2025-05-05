document.addEventListener('DOMContentLoaded', function () {
    const fetchButton = document.getElementById('fetchButton');
    const jsonOutput = document.getElementById('jsonOutput');

    if (!fetchButton) {
        console.error('Button with ID "fetchButton" not found!');
        return;
    }

    let currentState = 'brand'; // Поточний стан фільтрації
    let selectedBrand = null;
    let selectedModel = null;

    fetchButton.addEventListener('click', function () {
        if (currentState === 'brand') {
            fetchData('./js/image_sources.json'); // Завантаження нового файлу
        } else if (currentState === 'model') {
            showBrands();
        } else if (currentState === 'year') {
            showModels(selectedBrand);
        } else if (currentState === 'images') {
            showYears(selectedBrand, selectedModel);
        }
    });

    function fetchData(filePath) {
        fetch(filePath)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                jsonOutput.innerHTML = ''; // Очищення попереднього вмісту
                const groupedData = groupData(data);
                showBrands(groupedData);
            })
            .catch(error => {
                console.error('Error fetching JSON:', error);
                jsonOutput.textContent = `Error fetching JSON: ${error.message}`;
            });
    }

    function groupData(data) {
        const groupedData = {};
        for (const [key, url] of Object.entries(data)) {
            const parts = key.split('/');
            const brand = parts[0];
            const model = parts[1];
            const year = parts[2];

            if (!groupedData[brand]) {
                groupedData[brand] = {};
            }
            if (!groupedData[brand][model]) {
                groupedData[brand][model] = {};
            }
            if (!groupedData[brand][model][year]) {
                groupedData[brand][model][year] = [];
            }
            groupedData[brand][model][year].push(url);
        }
        return groupedData;
    }

    function showBrands(groupedData) {
        currentState = 'brand';
        jsonOutput.innerHTML = ''; // Очищення попереднього вмісту

        for (const brand of Object.keys(groupedData)) {
            const brandButton = document.createElement('button');
            brandButton.textContent = brand;
            brandButton.className = 'filter-button';
            brandButton.addEventListener('click', function () {
                selectedBrand = brand;
                showModels(groupedData[brand]);
            });
            jsonOutput.appendChild(brandButton);
        }
    }

    function showModels(models) {
        currentState = 'model';
        jsonOutput.innerHTML = ''; // Очищення попереднього вмісту

        for (const model of Object.keys(models)) {
            const modelButton = document.createElement('button');
            modelButton.textContent = model;
            modelButton.className = 'filter-button';
            modelButton.addEventListener('click', function () {
                selectedModel = model;
                showYears(models[model]);
            });
            jsonOutput.appendChild(modelButton);
        }
    }

    function showYears(years) {
        currentState = 'year';
        jsonOutput.innerHTML = ''; // Очищення попереднього вмісту

        for (const year of Object.keys(years)) {
            const yearButton = document.createElement('button');
            yearButton.textContent = year;
            yearButton.className = 'filter-button';
            yearButton.addEventListener('click', function () {
                showImages(years[year]);
            });
            jsonOutput.appendChild(yearButton);
        }
    }

    function showImages(images) {
        currentState = 'images';
        jsonOutput.innerHTML = ''; // Очищення попереднього вмісту

        const carContainer = document.createElement('div');
        carContainer.className = 'car-container';

        images.forEach(url => {
            const carItem = document.createElement('div');
            carItem.className = 'car-item';

            const img = document.createElement('img');
            img.src = url;
            img.alt = 'Car Image';
            img.onerror = () => {
                img.src = 'https://via.placeholder.com/150?text=No+Image';
            };

            carItem.appendChild(img);
            carContainer.appendChild(carItem);
        });

        jsonOutput.appendChild(carContainer);
    }
});