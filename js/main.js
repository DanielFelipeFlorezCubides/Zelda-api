document.addEventListener("DOMContentLoaded", async () => {
    console.log("Zelda Wiki inicializada");

    // Cargar datos de la API
    let gamesData = [];
    try {
        const response = await fetch("https://zelda.fanapis.com/api/games");
        const data = await response.json();
        gamesData = data.data;
        console.log("Datos cargados:", gamesData);
        
        // 3. Funcionalidad de pestañas con localStorage
        const mainSeriesTab = document.querySelector(".section_tabs div a:first-child");
        const spinOffsTab = document.querySelector(".section_tabs div a:last-child");

        // Verificar si hay una pestaña guardada en localStorage
        const savedTab = localStorage.getItem("selectedTab") || "main";
        displayGames(savedTab);
        
        // Resaltar la pestaña guardada
        if (savedTab === "main") {
            highlightTab(mainSeriesTab, spinOffsTab);
        } else {
            highlightTab(spinOffsTab, mainSeriesTab);
        }
        
        mainSeriesTab.addEventListener("click", (e) => {
            e.preventDefault();
            displayGames("main");
            highlightTab(mainSeriesTab, spinOffsTab);
            // Guardar selección en localStorage
            localStorage.setItem("selectedTab", "main");
        });
        
        spinOffsTab.addEventListener("click", (e) => {
            e.preventDefault();
            displayGames("spinoff");
            highlightTab(spinOffsTab, mainSeriesTab);
            // Guardar selección en localStorage
            localStorage.setItem("selectedTab", "spinoff");
        });
        
    } catch (error) {
        console.error("Error al cargar datos:", error);
    }

    // 1. Funcionalidad para ocultar el mensaje de spoiler con localStorage
    const dismissButton = document.querySelector(".header_warning_close a");
    const warningMessage = document.querySelector(".header_warning");
    
    // Verificar si el usuario ya cerró el mensaje anteriormente
    if (localStorage.getItem("spoilerDismissed") === "true") {
        warningMessage.style.display = "none";
    }
    
    dismissButton.addEventListener("click", (e) => {
        e.preventDefault();
        warningMessage.style.display = "none";
        // Guardar en localStorage que el usuario cerró el mensaje
        localStorage.setItem("spoilerDismissed", "true");
    });

    // 2. Funcionalidad de búsqueda
    const searchForm = document.querySelector(".logo_class_form");
    const searchInput = searchForm.querySelector("input");
    
    searchForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const searchTerm = searchInput.value.toLowerCase().trim();
        
        if (searchTerm === "") return;
        
        // Guardar búsquedas recientes en localStorage (máximo 5)
        saveRecentSearch(searchTerm);
        
        const filteredGames = gamesData.filter(game => 
            game.name.toLowerCase().includes(searchTerm) || 
            (game.description && game.description.toLowerCase().includes(searchTerm))
        );
        
        displaySearchResults(filteredGames);
    });
    
    // Función para guardar búsquedas recientes
    function saveRecentSearch(term) {
        let recentSearches = JSON.parse(localStorage.getItem("recentSearches") || "[]");
        
        // Evitar duplicados
        if (!recentSearches.includes(term)) {
            // Agregar al inicio
            recentSearches.unshift(term);
            
            // Mantener solo las 5 búsquedas más recientes
            if (recentSearches.length > 5) {
                recentSearches = recentSearches.slice(0, 5);
            }
            
            localStorage.setItem("recentSearches", JSON.stringify(recentSearches));
        }
    }
    
    // Función para resaltar la pestaña activa
    function highlightTab(activeTab, inactiveTab) {
        activeTab.style.backgroundColor = "#1c4668";
        activeTab.style.transform = "scale(1.05)";
        inactiveTab.style.backgroundColor = "#245681";
        inactiveTab.style.transform = "scale(1)";
    }

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
    
    // Función para crear una tarjeta de juego con botón de favorito
    function createGameCard(game) {
        const gameContainer = document.createElement("div");
        gameContainer.className = "game-card-container";
        gameContainer.style.position = "relative";
        gameContainer.style.display = "inline-block";
        gameContainer.style.margin = "10px 0";
        
        const gameLink = document.createElement("a");
        gameLink.href = `views/game-details.html?id=${game.id}`;
        
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
        gameContainer.appendChild(gameLink);
        
        // Verificar si el juego está en favoritos
        const favorites = JSON.parse(localStorage.getItem("favoriteGames") || "[]");
        const isFavorite = favorites.some(fav => fav.id === game.id);
        
        // Crear botón de favorito
        const favButton = document.createElement("button");
        favButton.className = "favorite-button";
        favButton.innerHTML = isFavorite ? "★" : "☆"; // Estrella llena o vacía
        favButton.style.position = "absolute";
        favButton.style.top = "5px";
        favButton.style.right = "5px";
        favButton.style.background = isFavorite ? "gold" : "white";
        favButton.style.border = "none";
        favButton.style.borderRadius = "50%";
        favButton.style.width = "30px";
        favButton.style.height = "30px";
        favButton.style.cursor = "pointer";
        favButton.style.fontSize = "20px";
        favButton.style.display = "flex";
        favButton.style.justifyContent = "center";
        favButton.style.alignItems = "center";
        favButton.style.zIndex = "10";
        
        favButton.addEventListener("click", (e) => {
            e.preventDefault(); // Evitar que se active el enlace
            e.stopPropagation(); // Evitar que el evento se propague
            
            toggleFavorite(game, favButton);
        });
        
        gameContainer.appendChild(favButton);
        
        return gameContainer;
    }
    
    // Función para alternar el estado de favorito de un juego
    function toggleFavorite(game, button) {
        let favorites = JSON.parse(localStorage.getItem("favoriteGames") || "[]");
        
        // Verificar si el juego ya está en favoritos
        const index = favorites.findIndex(fav => fav.id === game.id);
        
        if (index === -1) {
            // Agregar a favoritos
            favorites.push({
                id: game.id,
                name: game.name,
                shortName: getShortGameName(game.name)
            });
            button.innerHTML = "★"; // Estrella llena
            button.style.background = "gold";
            showToast(`${game.name} agregado a favoritos`);
        } else {
            // Quitar de favoritos
            favorites.splice(index, 1);
            button.innerHTML = "☆"; // Estrella vacía
            button.style.background = "white";
            showToast(`${game.name} eliminado de favoritos`);
        }
        
        // Guardar en localStorage
        localStorage.setItem("favoriteGames", JSON.stringify(favorites));
    }
    
    // Función para mostrar un mensaje toast
    function showToast(message) {
        // Crear elemento toast
        const toast = document.createElement("div");
        toast.className = "toast";
        toast.textContent = message;
        
        // Estilos para el toast
        toast.style.position = "fixed";
        toast.style.bottom = "20px";
        toast.style.left = "50%";
        toast.style.transform = "translateX(-50%)";
        toast.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
        toast.style.color = "white";
        toast.style.padding = "10px 20px";
        toast.style.borderRadius = "5px";
        toast.style.zIndex = "1000";
        
        // Agregar al DOM
        document.body.appendChild(toast);
        
        // Eliminar después de 3 segundos
        setTimeout(() => {
            toast.style.opacity = "0";
            toast.style.transition = "opacity 0.5s ease";
            
            // Eliminar del DOM después de la transición
            setTimeout(() => {
                document.body.removeChild(toast);
            }, 500);
        }, 3000);
    }
    
    // Función para obtener el nombre corto del juego para las imágenes
    function getShortGameName(fullName) {
        // Mapeo de nombres completos a abreviaturas para las imágenes
        const nameMap = {
            "The Legend of Zelda": "",
            "The Legend of Zelda: A Link to the Past": "ALTP",
            "The Legend of Zelda: Ocarina of Time": "Oot",
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
            window.location.href = `views/category.html?type=${category}`;
        });
    });
    
    // Agregar botón para ver favoritos
    createFavoritesButton();
    
    // Función para crear botón de favoritos
    function createFavoritesButton() {
        const mainSection = document.querySelector("main");
        const tabsSection = document.querySelector(".section_tabs");
        
        const favButton = document.createElement("button");
        favButton.textContent = "Ver Juegos Favoritos";
        favButton.className = "favorites-button";
        favButton.style.display = "block";
        favButton.style.margin = "20px auto";
        favButton.style.padding = "10px 20px";
        favButton.style.backgroundColor = "#245681";
        favButton.style.color = "white";
        favButton.style.border = "none";
        favButton.style.borderRadius = "5px";
        favButton.style.cursor = "pointer";
        favButton.style.fontSize = "16px";
        
        favButton.addEventListener("click", () => {
            displayFavoriteGames();
        });
        
        mainSection.insertBefore(favButton, tabsSection.nextSibling);
    }
    
    // Función para mostrar juegos favoritos
    function displayFavoriteGames() {
        const favorites = JSON.parse(localStorage.getItem("favoriteGames") || "[]");
        
        if (favorites.length === 0) {
            showToast("No tienes juegos favoritos guardados");
            return;
        }
        
        const titlesContainer = document.querySelector(".section_titles");
        titlesContainer.innerHTML = "";
        
        // Título para la sección
        const title = document.createElement("h2");
        title.textContent = "Tus Juegos Favoritos";
        title.style.color = "gold";
        title.style.textAlign = "center";
        title.style.margin = "20px 0";
        titlesContainer.appendChild(title);
        
        // Crear contenedor para las imágenes
        const leftColumn = document.createElement("div");
        leftColumn.className = "section_titles_images";
        
        const rightColumn = document.createElement("div");
        rightColumn.className = "section_titles_images";
        
        // Buscar los juegos favoritos en los datos completos
        favorites.forEach((favorite, index) => {
            const game = gamesData.find(g => g.id === favorite.id);
            
            if (game) {
                const gameCard = createGameCard(game);
                
                if (index % 2 === 0) {
                    leftColumn.appendChild(gameCard);
                } else {
                    rightColumn.appendChild(gameCard);
                }
            }
        });
        
        titlesContainer.appendChild(leftColumn);
        titlesContainer.appendChild(rightColumn);
    }
});