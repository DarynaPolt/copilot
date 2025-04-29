document.addEventListener('DOMContentLoaded', function () {
    const fetchButton = document.getElementById('fetchButton');
    const jsonOutput = document.getElementById('jsonOutput');

    if (!fetchButton) {
        console.error('Button with ID "fetchButton" not found!');
        return;
    }

    fetchButton.addEventListener('click', function () {
        console.log('Fetch button clicked!');
        fetch('js/sample.json')
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                jsonOutput.innerHTML = ''; // Очищення попереднього вмісту

                // Групування за марками, моделями та роками
                const groupedData = {};
                for (const [key, url] of Object.entries(data)) {
                    const parts = key.split('/');
                    const brand = parts[0]; // Марка машини
                    const model = parts[1]; // Модель машини
                    const year = parts[2]; // Рік машини

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

                // Створення кнопок для марок
                for (const brand of Object.keys(groupedData)) {
                    const brandButton = document.createElement('button');
                    brandButton.textContent = brand;
                    brandButton.style.margin = '10px';
                    brandButton.style.padding = '10px';
                    brandButton.style.cursor = 'pointer';

                    brandButton.addEventListener('click', function () {
                        jsonOutput.innerHTML = ''; // Очищення попереднього вмісту
                        for (const model of Object.keys(groupedData[brand])) {
                            const modelButton = document.createElement('button');
                            modelButton.textContent = model;
                            modelButton.style.margin = '10px';
                            modelButton.style.padding = '10px';
                            modelButton.style.cursor = 'pointer';

                            modelButton.addEventListener('click', function () {
                                jsonOutput.innerHTML = ''; // Очищення попереднього вмісту
                                for (const year of Object.keys(groupedData[brand][model])) {
                                    const yearButton = document.createElement('button');
                                    yearButton.textContent = year;
                                    yearButton.style.margin = '10px';
                                    yearButton.style.padding = '10px';
                                    yearButton.style.cursor = 'pointer';

                                    yearButton.addEventListener('click', function () {
                                        jsonOutput.innerHTML = ''; // Очищення попереднього вмісту
                                        const cars = groupedData[brand][model][year];

                                        cars.forEach(url => {
                                            const carContainer = document.createElement('div');
                                            carContainer.style.textAlign = 'center';
                                            carContainer.style.marginBottom = '20px';

                                            const img = document.createElement('img');
                                            img.src = url;
                                            img.alt = `${brand} ${model} ${year}`;
                                            img.style.width = '150px';
                                            img.style.height = '150px';
                                            img.style.objectFit = 'cover';
                                            img.style.border = '2px solid #ff99aa';
                                            img.style.borderRadius = '5px';
                                            img.style.margin = '10px';

                                            carContainer.appendChild(img);
                                            jsonOutput.appendChild(carContainer);
                                        });
                                    });

                                    jsonOutput.appendChild(yearButton);
                                }
                            });

                            jsonOutput.appendChild(modelButton);
                        }
                    });

                    jsonOutput.appendChild(brandButton);
                }
            })
            .catch(error => {
                console.error('Error fetching JSON:', error);
                jsonOutput.textContent = `Error: ${error.message}`;
            });
    });
});