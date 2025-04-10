document.addEventListener("DOMContentLoaded", async () => {
    console.log("Página de categoría inicializada");

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

    // Obtener el tipo de categoría de la URL
    const urlParams = new URLSearchParams(window.location.search);
    const categoryType = urlParams.get("type");
    
    if (!categoryType) {
        showError("No se especificó una categoría válida");
        return;
    }
    
    // Actualizar el título de la categoría
    const categoryTitle = document.querySelector(".category-title");
    categoryTitle.textContent = categoryType.charAt(0).toUpperCase() + categoryType.slice(1);
    
    try {
        // Cargar los elementos de la categoría desde la API
        const response = await fetch(`https://zelda.fanapis.com/api/${categoryType}`);
        const data = await response.json();
        
        if (!data.success || !data.data) {
            showError("No se pudo cargar la información de la categoría");
            return;
        }
        
        displayCategoryItems(data.data);
        
    } catch (error) {
        console.error("Error al cargar los elementos de la categoría:", error);
        showError("Error al cargar los elementos de la categoría");
    }
    
    function displayCategoryItems(items) {
        const container = document.querySelector(".category-items");
        container.innerHTML = "";
        
        if (items.length === 0) {
            container.innerHTML = "<p>No hay elementos disponibles en esta categoría.</p>";
            return;
        }
        
        // Crear una tarjeta para cada elemento
        items.forEach(item => {
            const card = document.createElement("div");
            card.className = "category-card";
            
            const name = document.createElement("h2");
            name.textContent = item.name;
            
            const description = document.createElement("p");
            description.textContent = item.description || "No hay descripción disponible.";
            
            // Crear un enlace para ver más detalles (actualizado con la nueva ruta)
            const link = document.createElement("a");
            link.href = `${categoryType}-details.html?id=${item.id}`;
            link.textContent = "Ver detalles";
            link.className = "details-link";
            
            card.appendChild(name);
            card.appendChild(description);
            card.appendChild(link);
            
            container.appendChild(card);
        });
    }
    
    function showError(message) {
        const container = document.querySelector(".category-items");
        container.innerHTML = `
            <div class="error-message">
                <h2>${message}</h2>
                <p>Por favor, vuelve a la <a href="../index.html">página principal</a> e intenta de nuevo.</p>
            </div>
        `;
    }
});