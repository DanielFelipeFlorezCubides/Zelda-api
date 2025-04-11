# Proyecto progresivo JavaScript

Desarrollar una aplicación web funcional que consuma datos de un API (de libre elección), los almacene mediante mecanismos como Local Storage y presente una interfaz responsiva utilizando HTML, CSS y JavaScript.

### **Requisitos del Proyecto:**

1. **Selección del API:**
    - Investigar y seleccionar un API público o con acceso gratuito.
    - Implementar el consumo de datos de dicha API.
2. **Almacenamiento Local:**
    - Guardar información relevante en Local Storage.
    - Permitir la recuperación y visualización de los datos almacenados.
3. **Interfaz Responsiva:**
    - Diseñar una UI atractiva y funcional.
    - Asegurar la adaptabilidad a diferentes tamaños de pantalla (desktop y móvil).
4. **Funcionalidad Dinámica:**
    - Implementar interacciones con JavaScript (eventos, manipulación del DOM, etc.).
    - Garantizar una navegación intuitiva y fluida.
5. **Entrega:**
    - Subir el código a un repositorio en GitHub.
    - Documentar el proyecto en un README detallado con descripción, instrucciones de uso e información del API utilizado.
    - Entregar la URL del repositorio para evaluación.

### **Criterios de Evaluación:**

- **Consumo correcto del API (20%)**: Llamados eficientes, manejo de respuestas y errores.
- **Uso adecuado de Local Storage (20%)**: Almacenamiento, recuperación y eliminación de datos.
- **Diseño responsivo (20%)**: Correcta aplicación de CSS y adaptabilidad.
- **Interactividad y funcionalidad (20%)**: Fluidez en interacciones con JavaScript.
- **Documentación y estructura del código (20%)**: Claridad y organización en el repositorio.

**------------------------------------------------------------------------------------------------------------------------------------------**

# Zelda Wiki

## Descripción General

Zelda Wiki es una aplicación web interactiva que proporciona información detallada sobre los juegos de la saga The Legend of Zelda. La aplicación permite a los usuarios explorar juegos, personajes, lugares y otros elementos del universo de Zelda, con funcionalidades como búsqueda, filtrado por categorías, y un sistema de favoritos.

## Tecnologías Utilizadas

- **HTML5**: Estructura de la página
- **CSS3**: Estilos y diseño responsivo
- **JavaScript (Vanilla)**: Toda la funcionalidad interactiva
- **LocalStorage API**: Almacenamiento de preferencias y favoritos
- **Fetch API**: Comunicación con la API de Zelda

## Funcionalidades Principales

### 1. Exploración de Juegos

- **Pestañas de Categorías**: Filtrado entre juegos de la serie principal y spin-offs
- **Visualización en Tarjetas**: Presentación visual de los juegos con imágenes
- **Detalles Completos**: Acceso a información detallada de cada juego

### 2. Sistema de Búsqueda

- **Búsqueda en Tiempo Real**: Filtrado de juegos según términos de búsqueda
- **Historial de Búsquedas**: Almacenamiento de las últimas 5 búsquedas realizadas

### 3. Sistema de Favoritos

- **Marcar Favoritos**: Posibilidad de marcar juegos como favoritos
- **Persistencia**: Los favoritos se guardan entre sesiones usando localStorage
- **Visualización Dedicada**: Sección especial para ver solo los juegos favoritos

### 4. Exploración por Categorías

- **Categorías Diversas**: Acceso a personajes, lugares, jefes, etc.
- **Navegación Intuitiva**: Interfaz clara para explorar cada categoría

### 5. Preferencias de Usuario

- **Recordar Pestañas**: La última pestaña seleccionada se recuerda en futuras visitas
- **Gestión de Spoilers**: Opción para ocultar permanentemente avisos de spoilers

## Características de LocalStorage

La aplicación utiliza localStorage para mejorar la experiencia de usuario:

1. **Gestión de Spoilers**: Recuerda si el usuario ha cerrado el aviso de spoilers
2. **Juegos Favoritos**: Almacena los juegos marcados como favoritos
3. **Última Pestaña**: Recuerda la última pestaña seleccionada (Main Series o Spin-Offs)
4. **Historial de Búsquedas**: Guarda las últimas 5 búsquedas realizadas

## API Utilizada

La aplicación consume datos de la [Zelda Fan API](https://zelda.fanapis.com/), que proporciona información detallada sobre:

- Juegos
- Personajes
- Lugares
- Items
- Jefes
- Mazmorras

## Cómo Ejecutar el Proyecto

1. **Clonar o Descargar**: Obtén los archivos del proyecto
2. **Servidor Local**: Abre el proyecto usando un servidor local (Live Server, http-server, etc.)
3. **Navegador Web**: Accede a través de cualquier navegador moderno

No se requieren dependencias adicionales ni procesos de compilación.

## Uso de la Aplicación

### Página Principal

- **Explorar Juegos**: Navega entre las pestañas de "Main Series" y "Spin-Offs"
- **Buscar**: Utiliza la barra de búsqueda para encontrar juegos específicos
- **Ver Favoritos**: Haz clic en el botón "Ver Juegos Favoritos" para mostrar tus juegos guardados
- **Marcar Favoritos**: Haz clic en la estrella de cualquier juego para agregarlo a favoritos

### Página de Detalles

- **Información Completa**: Visualiza todos los detalles del juego seleccionado
- **Gestión de Favoritos**: Agrega o quita el juego de tus favoritos
- **Navegación**: Regresa fácilmente a la página principal

### Página de Categorías

- **Explorar Elementos**: Navega por los diferentes elementos de la categoría seleccionada
- **Ver Detalles**: Accede a información detallada de cada elemento

## Posibles Mejoras Futuras

- Implementación de modo oscuro con persistencia en localStorage
- Sistema de notas personales para cada juego
- Comparación lado a lado de diferentes juegos
- Filtros avanzados por año, consola, etc.
- Integración con otras APIs para información adicional

## Créditos

- Datos proporcionados por [Zelda Fan API](https://zelda.fanapis.com/)
- Imágenes y recursos visuales de Nintendo y fuentes oficiales de Zelda