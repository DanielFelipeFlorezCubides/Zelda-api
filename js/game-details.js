document.addEventListener("DOMContentLoaded", async () => {
    console.log("Página de detalles del juego inicializada");

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
        
        // Redirigir a la página principal con el término de búsqueda
        window.location.href = `../index.html?search=${encodeURIComponent(searchTerm)}`;
    });

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