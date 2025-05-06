document.addEventListener('DOMContentLoaded', function () {
    const jsonOutput = document.getElementById('jsonOutput');
    const backButton = document.createElement('button');
    backButton.textContent = 'Назад';
    backButton.className = 'back-button';
    backButton.style.display = 'none'; // Спочатку прихована
    document.body.insertBefore(backButton, jsonOutput);

    let currentState = 'brand'; // Поточний стан
    let selectedBrand = null;
    let selectedModel = null;

    fetch('./js/image_sources.json')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            const groupedData = groupData(data);
            showBrands(groupedData);

            backButton.addEventListener('click', function () {
                if (currentState === 'model') {
                    showBrands(groupedData);
                } else if (currentState === 'year') {
                    showModels(groupedData[selectedBrand]);
                } else if (currentState === 'images') {
                    showYears(groupedData[selectedBrand][selectedModel]);
                }
            });
        })
        .catch(error => {
            console.error('Error fetching JSON:', error);
            jsonOutput.textContent = `Error fetching JSON: ${error.message}`;
        });

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
                groupedData[brand][model] = [];
            }
            if (!groupedData[brand][model].includes(year)) {
                groupedData[brand][model].push(year);
            }
        }
        return groupedData;
    }

    function showBrands(groupedData) {
        currentState = 'brand';
        backButton.style.display = 'none'; // Приховуємо кнопку "Назад"
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
        backButton.style.display = 'block'; // Показуємо кнопку "Назад"
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
        backButton.style.display = 'block'; // Показуємо кнопку "Назад"
        jsonOutput.innerHTML = ''; // Очищення попереднього вмісту

        years.forEach(year => {
            const yearButton = document.createElement('button');
            yearButton.textContent = year;
            yearButton.className = 'filter-button';
            yearButton.addEventListener('click', function () {
                showImages(year);
            });
            jsonOutput.appendChild(yearButton);
        });
    }

    function showImages(year) {
        currentState = 'images';
        backButton.style.display = 'block'; // Показуємо кнопку "Назад"
        jsonOutput.innerHTML = ''; // Очищення попереднього вмісту

        const carContainer = document.createElement('div');
        carContainer.className = 'car-container';

        fetch('./js/image_sources.json')
            .then(response => response.json())
            .then(data => {
                const images = Object.entries(data).filter(([key]) => {
                    const parts = key.split('/');
                    return parts[0] === selectedBrand && parts[1] === selectedModel && parts[2] === year;
                });

                images.forEach(([key, url]) => {
                    const carItem = document.createElement('div');
                    carItem.className = 'car-item';

                    const img = document.createElement('img');
                    img.src = url;
                    img.alt = `${selectedBrand} ${selectedModel} ${year}`;
                    img.onerror = () => {
                        img.src = 'https://via.placeholder.com/150?text=No+Image';
                    };

                    carItem.appendChild(img);
                    carContainer.appendChild(carItem);
                });

                jsonOutput.appendChild(carContainer);
            });
    }
});