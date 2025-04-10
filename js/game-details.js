document.addEventListener("DOMContentLoaded", async () => {
    console.log("Página de detalles del juego inicializada");

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
        
        // Redirigir a la página principal con el término de búsqueda
        window.location.href = `../index.html?search=${encodeURIComponent(searchTerm)}`;
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

    // Obtener el ID del juego de la URL
    const urlParams = new URLSearchParams(window.location.search);
    const gameId = urlParams.get("id");
    
    if (!gameId) {
        showError("No se especificó un ID de juego válido");
        return;
    }
    
    try {
        // Cargar los detalles del juego desde la API
        const response = await fetch(`https://zelda.fanapis.com/api/games/${gameId}`);
        const data = await response.json();
        
        if (!data.success || !data.data) {
            showError("No se pudo cargar la información del juego");
            return;
        }
        
        const game = data.data;
        displayGameDetails(game);
        
        // Agregar botón de favorito
        addFavoriteButton(game);
        
    } catch (error) {
        console.error("Error al cargar los detalles del juego:", error);
        showError("Error al cargar los detalles del juego");
    }
    
    function displayGameDetails(game) {
        // Actualizar el título de la página
        document.title = `${game.name} - Tloz Wiki`;
        
        // Actualizar la imagen del juego
        const imageContainer = document.querySelector(".game-image");
        const gameImage = document.createElement("img");
        
        // Extraer el nombre corto del juego para buscar la imagen correspondiente
        const shortName = getShortGameName(game.name);
        gameImage.src = `../storage/img/Zelda_${shortName}.png`;
        gameImage.alt = game.name;
        gameImage.onerror = function() {
            // Si no se encuentra la imagen específica, usar una genérica
            this.src = "../storage/img/Zelda.png";
        };
        
        imageContainer.appendChild(gameImage);
        
        // Actualizar la información del juego
        document.querySelector(".game-title").textContent = game.name;
        document.getElementById("developer").textContent = game.developer || "No disponible";
        document.getElementById("publisher").textContent = game.publisher || "No disponible";
        document.getElementById("released").textContent = game.released_date || "No disponible";
        document.getElementById("description").textContent = game.description || "No hay descripción disponible para este juego.";
    }
    
    function addFavoriteButton(game) {
        // Verificar si el juego está en favoritos
        const favorites = JSON.parse(localStorage.getItem("favoriteGames") || "[]");
        const isFavorite = favorites.some(fav => fav.id === game.id);
        
        // Crear botón de favorito
        const favButton = document.createElement("button");
        favButton.className = "favorite-button";
        favButton.innerHTML = isFavorite ? "★ Quitar de favoritos" : "☆ Agregar a favoritos";
        favButton.style.display = "block";
        favButton.style.margin = "20px 0";
        favButton.style.padding = "10px 20px";
        favButton.style.backgroundColor = isFavorite ? "gold" : "#245681";
        favButton.style.color = "white";
        favButton.style.border = "none";
        favButton.style.borderRadius = "5px";
        favButton.style.cursor = "pointer";
        favButton.style.fontSize = "16px";
        
        favButton.addEventListener("click", () => {
            toggleFavorite(game, favButton);
        });
        
        // Agregar botón después de la descripción
        const descriptionContainer = document.querySelector(".game-description");
        descriptionContainer.after(favButton);
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
            button.innerHTML = "★ Quitar de favoritos";
            button.style.backgroundColor = "gold";
            showToast(`${game.name} agregado a favoritos`);
        } else {
            // Quitar de favoritos
            favorites.splice(index, 1);
            button.innerHTML = "☆ Agregar a favoritos";
            button.style.backgroundColor = "#245681";
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
    
    function showError(message) {
        const container = document.querySelector(".game-container");
        container.innerHTML = `
            <div class="error-message">
                <h2>${message}</h2>
                <p>Por favor, vuelve a la <a href="../index.html">página principal</a> e intenta de nuevo.</p>
            </div>
        `;
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
});