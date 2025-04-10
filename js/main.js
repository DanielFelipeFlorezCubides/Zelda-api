document.addEventListener("DOMContentLoaded", async () => {
    console.log("Zelda Wiki inicializada");

    // Cargar datos de la API
    let gamesData = [];
    try {
        const response = await fetch("https://zelda.fanapis.com/api/games");
        const data = await response.json();
        gamesData = data.data;
        console.log("Datos cargados:", gamesData);
        
        // Inicializar la página con los juegos de la serie principal
        displayGames("main");
    } catch (error) {
        console.error("Error al cargar datos:", error);
    }

    // 1. Funcionalidad para ocultar el mensaje de spoiler
    const dismissButton = document.querySelector(".header_warning_close a");
    const warningMessage = document.querySelector(".header_warning");
    
    dismissButton.addEventListener("click", (e) => {
        e.preventDefault();
        warningMessage.style.display = "none";
    });

    // 2. Funcionalidad de búsqueda
    const searchForm = document.querySelector(".logo_class_form");
    const searchInput = searchForm.querySelector("input");
    
    searchForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const searchTerm = searchInput.value.toLowerCase().trim();
        
        if (searchTerm === "") return;
        
        const filteredGames = gamesData.filter(game => 
            game.name.toLowerCase().includes(searchTerm) || 
            (game.description && game.description.toLowerCase().includes(searchTerm))
        );
        
        displaySearchResults(filteredGames);
    });

    // 3. Funcionalidad de pestañas
    const mainSeriesTab = document.querySelector(".section_tabs div a:first-child");
    const spinOffsTab = document.querySelector(".section_tabs div a:last-child");
    
    mainSeriesTab.addEventListener("click", (e) => {
        e.preventDefault();
        displayGames("main");
        highlightTab(mainSeriesTab, spinOffsTab);
    });
    
    spinOffsTab.addEventListener("click", (e) => {
        e.preventDefault();
        displayGames("spinoff");
        highlightTab(spinOffsTab, mainSeriesTab);
    });
    
    // Función para resaltar la pestaña activa
    function highlightTab(activeTab, inactiveTab) {
        activeTab.style.backgroundColor = "#1c4668";
        activeTab.style.transform = "scale(1.05)";
        inactiveTab.style.backgroundColor = "#245681";
        inactiveTab.style.transform = "scale(1)";
    }
    
    // Inicializar con la pestaña de serie principal activa
    highlightTab(mainSeriesTab, spinOffsTab);

    // Función para mostrar juegos según el tipo
    function displayGames(type) {
        const titlesContainer = document.querySelector(".section_titles");
        titlesContainer.innerHTML = "";
        
        // Filtrar juegos según el tipo (main o spinoff)
        let filteredGames;
        
        if (type === "main") {
            // Juegos principales: tienen "The Legend of Zelda" en el nombre pero NO son spin-offs conocidos
            filteredGames = gamesData.filter(game => {
                // Excluir juegos que sabemos que son spin-offs
                const isSpinOff = 
                    game.name.includes("Four Swords") || 
                    game.name.includes("Tri Force Heroes") || 
                    game.name.includes("Hyrule Warriors");
                
                // Incluir solo los que tienen "The Legend of Zelda" y NO son spin-offs
                return game.name.includes("The Legend of Zelda") && !isSpinOff;
            });
        } else {
            // Spin-offs: NO tienen "The Legend of Zelda" en el nombre O son spin-offs conocidos
            filteredGames = gamesData.filter(game => {
                // Incluir juegos que sabemos que son spin-offs
                const isKnownSpinOff = 
                    game.name.includes("Four Swords") || 
                    game.name.includes("Tri Force Heroes") || 
                    game.name.includes("Hyrule Warriors");
                
                // Incluir juegos que NO tienen "The Legend of Zelda" en el nombre
                const isNotMainSeries = !game.name.includes("The Legend of Zelda");
                
                // O son spin-offs conocidos con "The Legend of Zelda" en el nombre
                return isNotMainSeries || (game.name.includes("The Legend of Zelda") && isKnownSpinOff);
            });
        }
        
        console.log(`Juegos filtrados (${type}):`, filteredGames.length);
        
        // Crear contenedor para las imágenes
        const leftColumn = document.createElement("div");
        leftColumn.className = "section_titles_images";
        
        const rightColumn = document.createElement("div");
        rightColumn.className = "section_titles_images";
        
        // Distribuir juegos en dos columnas
        filteredGames.forEach((game, index) => {
            const gameCard = createGameCard(game);
            
            if (index % 2 === 0) {
                leftColumn.appendChild(gameCard);
            } else {
                rightColumn.appendChild(gameCard);
            }
        });
        
        titlesContainer.appendChild(leftColumn);
        titlesContainer.appendChild(rightColumn);
    }
    
    // Función para mostrar resultados de búsqueda
    function displaySearchResults(games) {
        const titlesContainer = document.querySelector(".section_titles");
        titlesContainer.innerHTML = "";
        
        if (games.length === 0) {
            const noResults = document.createElement("div");
            noResults.className = "no-results";
            noResults.textContent = "No se encontraron resultados para tu búsqueda.";
            noResults.style.color = "white";
            noResults.style.fontSize = "20px";
            noResults.style.textAlign = "center";
            noResults.style.padding = "50px";
            titlesContainer.appendChild(noResults);
            return;
        }
        
        // Crear contenedor para las imágenes
        const leftColumn = document.createElement("div");
        leftColumn.className = "section_titles_images";
        
        const rightColumn = document.createElement("div");
        rightColumn.className = "section_titles_images";
        
        // Distribuir juegos en dos columnas
        games.forEach((game, index) => {
            const gameCard = createGameCard(game);
            
            if (index % 2 === 0) {
                leftColumn.appendChild(gameCard);
            } else {
                rightColumn.appendChild(gameCard);
            }
        });
        
        titlesContainer.appendChild(leftColumn);
        titlesContainer.appendChild(rightColumn);
    }
    
    // Función para crear una tarjeta de juego
    function createGameCard(game) {
        const gameLink = document.createElement("a");
        gameLink.href = `game-details.html?id=${game.id}`;
        
        const gameImage = document.createElement("img");
        // Extraer el nombre corto del juego para buscar la imagen correspondiente
        const shortName = getShortGameName(game.name);
        gameImage.src = `./storage/img/Zelda_${shortName}.png`;
        gameImage.alt = game.name;
        gameImage.onerror = function() {
            // Si no se encuentra la imagen específica, usar una genérica
            this.src = "./storage/img/Zelda.png";
        };
        
        // Agregar un título para mostrar el nombre del juego al pasar el mouse
        gameImage.title = game.name;
        
        gameLink.appendChild(gameImage);
        return gameLink;
    }
    
    // Función para obtener el nombre corto del juego para las imágenes
    function getShortGameName(fullName) {
        // Mapeo de nombres completos a abreviaturas para las imágenes
        const nameMap = {
            "The Legend of Zelda": "",
            "The Legend of Zelda: A Link to the Past": "ALTP",
            "The Legend of Zelda: Ocarina of Time": "OoT",
            "The Legend of Zelda: Majora's Mask": "MM",
            "The Legend of Zelda: The Wind Waker": "WW",
            "The Legend of Zelda: Twilight Princess": "TP",
            "The Legend of Zelda: Breath of the Wild": "BOTW",
            "The Legend of Zelda: Oracle of Ages": "OoA",
            "The Legend of Zelda: Oracle of Seasons": "OoS",
            "The Legend of Zelda: Four Swords": "FS",
            "The Legend of Zelda: Four Swords Adventures": "FSA",
            "The Legend of Zelda: The Minish Cap": "MC",
            "The Legend of Zelda: Phantom Hourglass": "PH",
            "The Legend of Zelda: Spirit Tracks": "ST",
            "BS The Legend of Zelda: Ancient Stone Tablets": "AST",
            "The Legend of Zelda: Link's Awakening": "LA",
            "The Legend of Zelda: Link's Awakening DX": "LA",
            "The Legend of Zelda: Tri Force Heroes": "TFH",
            "Zelda II: The Adventure of Link": "2",
            "Hyrule Warriors": "HW",
            "Zelda: The Wand of Gamelon": "TWOG"
        };
        
        for (const [key, value] of Object.entries(nameMap)) {
            if (fullName === key) return value;
        }
        
        return "";
    }
    
    // 5. Funcionalidad para las categorías
    const categoryLinks = document.querySelectorAll(".categories_group div a");
    
    categoryLinks.forEach(link => {
        link.addEventListener("click", (e) => {
            e.preventDefault();
            const category = link.textContent.toLowerCase();
            window.location.href = `category.html?type=${category}`;
        });
    });
});