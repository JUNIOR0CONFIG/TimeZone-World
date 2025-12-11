// Variables globales
let currentLocation = null;
let favorites = JSON.parse(localStorage.getItem('timezoneWorldFavorites')) || [];
let filter = 'all';

// Inicializar la aplicación
document.addEventListener('DOMContentLoaded', function() {
    // Configurar ubicación inicial (Nueva York)
    currentLocation = locations[0];
    
    // Inicializar componentes
    initLocationCards();
    initFilterButtons();
    initSearch();
    initFavorites();
    initComparisonSelects();
    initEventListeners();
    
    // Iniciar reloj principal
    updateMainClock();
    setInterval(updateMainClock, 1000);
    
    // Actualizar relojes de comparación
    updateComparisonClocks();
    setInterval(updateComparisonClocks, 1000);
    
    // Actualizar tarjetas de ubicación cada minuto
    setInterval(updateLocationCards, 60000);
    
    // Generar mapa SVG
    generateWorldMap();
    
    // Actualizar enlaces del footer
    updateFooterLinks();
});

// Inicializar tarjetas de ubicación
function initLocationCards() {
    const locationsGrid = document.getElementById('locations-grid');
    locationsGrid.innerHTML = '';
    
    const locationsToShow = filter === 'all' 
        ? locations 
        : locations.filter(loc => loc.continent === filter);
    
    locationsToShow.forEach(location => {
        const locationCard = createLocationCard(location);
        locationsGrid.appendChild(locationCard);
    });
    
    // Marcar la ubicación actual como activa
    markActiveLocation();
}

// Crear tarjeta de ubicación
function createLocationCard(location) {
    const card = document.createElement('div');
    card.className = 'location-card';
    card.dataset.id = location.id;
    
    // Verificar si es favorito
    const isFavorite = favorites.includes(location.id);
    
    // Obtener hora actual para esta ubicación
    const now = new Date();
    const timeString = formatTime(now, location.timezone);
    
    card.innerHTML = `
        <h3>${location.city}</h3>
        <div class="location-country">${location.country}</div>
        <div class="location-time">${timeString}</div>
        <div class="location-timezone">${getTimezoneOffset(location.timezone)}</div>
        <button class="favorite-btn ${isFavorite ? 'active' : ''}" data-id="${location.id}">
            <i class="fas fa-star"></i>
        </button>
    `;
    
    // Agregar evento click a la tarjeta
    card.addEventListener('click', (e) => {
        if (!e.target.classList.contains('favorite-btn')) {
            selectLocation(location.id);
        }
    });
    
    // Agregar evento al botón de favorito
    const favoriteBtn = card.querySelector('.favorite-btn');
    favoriteBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleFavorite(location.id);
    });
    
    return card;
}

// Seleccionar una ubicación
function selectLocation(locationId) {
    const location = getLocationById(locationId);
    if (!location) return;
    
    currentLocation = location;
    
    // Actualizar la visualización principal
    updateMainClock();
    
    // Actualizar tarjetas activas
    markActiveLocation();
    
    // Actualizar mapa
    updateMapHighlight();
    
    // Actualizar selects de comparación si es necesario
    updateComparisonSelects();
}

// Marcar la ubicación activa
function markActiveLocation() {
    document.querySelectorAll('.location-card').forEach(card => {
        card.classList.remove('active');
        if (parseInt(card.dataset.id) === currentLocation.id) {
            card.classList.add('active');
        }
    });
}

// Inicializar botones de filtro
function initFilterButtons() {
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            // Actualizar botón activo
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Cambiar filtro
            filter = this.dataset.filter;
            
            // Actualizar tarjetas
            initLocationCards();
        });
    });
}

// Inicializar búsqueda
function initSearch() {
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');
    
    searchButton.addEventListener('click', performSearch);
    searchInput.addEventListener('keyup', function(e) {
        if (e.key === 'Enter') {
            performSearch();
        }
    });
    
    // Limpiar búsqueda al cambiar filtro
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            searchInput.value = '';
        });
    });
}

// Realizar búsqueda
function performSearch() {
    const searchInput = document.getElementById('search-input');
    const query = searchInput.value.trim();
    
    if (query === '') {
        // Si la búsqueda está vacía, mostrar según el filtro actual
        initLocationCards();
        return;
    }
    
    const results = searchLocations(query);
    const locationsGrid = document.getElementById('locations-grid');
    locationsGrid.innerHTML = '';
    
    if (results.length === 0) {
        locationsGrid.innerHTML = '<p class="no-results">No se encontraron resultados</p>';
        return;
    }
    
    results.forEach(location => {
        const locationCard = createLocationCard(location);
        locationsGrid.appendChild(locationCard);
    });
    
    markActiveLocation();
}

// Actualizar reloj principal
function updateMainClock(timezone = null) {
    const tz = timezone || currentLocation.timezone;
    const now = new Date();
    
    // Actualizar elementos de la interfaz
    document.getElementById('city-name').textContent = currentLocation.city;
    document.getElementById('country-name').textContent = currentLocation.country;
    document.getElementById('current-time').textContent = formatTime(now, tz);
    document.getElementById('current-date').textContent = formatDate(now, tz);
    document.getElementById('timezone').textContent = getTimezoneOffset(tz);
    document.getElementById('day-period').textContent = getDayPeriod(now, tz);
    document.getElementById('day-of-year').textContent = getDayOfYear(now, tz);
}

// Actualizar tarjetas de ubicación
function updateLocationCards() {
    document.querySelectorAll('.location-card').forEach(card => {
        const locationId = parseInt(card.dataset.id);
        const location = getLocationById(locationId);
        
        if (location) {
            const now = new Date();
            const timeString = formatTime(now, location.timezone);
            const timeElement = card.querySelector('.location-time');
            if (timeElement) {
                timeElement.textContent = timeString;
            }
        }
    });
}

// Inicializar favoritos
function initFavorites() {
    updateFavoritesList();
}

// Alternar favorito
function toggleFavorite(locationId) {
    const index = favorites.indexOf(locationId);
    
    if (index === -1) {
        // Agregar a favoritos
        favorites.push(locationId);
        
        // Mostrar notificación
        showNotification('Ubicación agregada a favoritos');
    } else {
        // Eliminar de favoritos
        favorites.splice(index, 1);
        
        // Mostrar notificación
        showNotification('Ubicación eliminada de favoritos');
    }
    
    // Guardar en localStorage
    localStorage.setItem('timezoneWorldFavorites', JSON.stringify(favorites));
    
    // Actualizar lista de favoritos
    updateFavoritesList();
    
    // Actualizar botones de favorito en las tarjetas
    document.querySelectorAll('.favorite-btn').forEach(btn => {
        const id = parseInt(btn.dataset.id);
        if (id === locationId) {
            btn.classList.toggle('active');
        }
    });
}

// Actualizar lista de favoritos
function updateFavoritesList() {
    const favoritesList = document.getElementById('favorites-list');
    favoritesList.innerHTML = '';
    
    if (favorites.length === 0) {
        favoritesList.innerHTML = '<p class="no-favorites">No hay favoritos aún</p>';
        return;
    }
    
    favorites.forEach(favId => {
        const location = getLocationById(favId);
        if (location) {
            const now = new Date();
            const timeString = formatTime(now, location.timezone);
            
            const favoriteItem = document.createElement('div');
            favoriteItem.className = 'favorite-item';
            favoriteItem.innerHTML = `
                ${location.city} - ${timeString}
                <i class="fas fa-times remove-favorite" data-id="${location.id}"></i>
            `;
            
            // Agregar evento para eliminar favorito
            const removeBtn = favoriteItem.querySelector('.remove-favorite');
            removeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                toggleFavorite(location.id);
            });
            
            // Agregar evento para seleccionar la ubicación
            favoriteItem.addEventListener('click', () => {
                selectLocation(location.id);
            });
            
            favoritesList.appendChild(favoriteItem);
        }
    });
}

// Inicializar selects de comparación
function initComparisonSelects() {
    const select1 = document.getElementById('compare-location-1');
    const select2 = document.getElementById('compare-location-2');
    const select3 = document.getElementById('compare-location-3');
    
    // Llenar selects con las ubicaciones
    locations.forEach(location => {
        const option = document.createElement('option');
        option.value = location.timezone;
        option.textContent = `${location.city}, ${location.country}`;
        
        // Clonar opciones para cada select
        select1.appendChild(option.cloneNode(true));
        select2.appendChild(option.cloneNode(true));
        select3.appendChild(option.cloneNode(true));
    });
    
    // Establecer valores por defecto
    select1.value = 'America/New_York';
    select2.value = 'Europe/London';
    select3.value = 'Asia/Tokyo';
    
    // Agregar event listeners
    select1.addEventListener('change', updateComparisonClocks);
    select2.addEventListener('change', updateComparisonClocks);
    select3.addEventListener('change', updateComparisonClocks);
}

// Actualizar selects de comparación
function updateComparisonSelects() {
    // Si la ubicación actual no está en los selects, no hacer nada
    // Esto se puede expandir si se quiere sincronizar
}

// Actualizar relojes de comparación
function updateComparisonClocks() {
    const timezone1 = document.getElementById('compare-location-1').value;
    const timezone2 = document.getElementById('compare-location-2').value;
    const timezone3 = document.getElementById('compare-location-3').value;
    
    const now = new Date();
    
    // Actualizar tiempos
    document.getElementById('compare-time-1').textContent = formatTime(now, timezone1);
    document.getElementById('compare-time-2').textContent = formatTime(now, timezone2);
    document.getElementById('compare-time-3').textContent = formatTime(now, timezone3);
}

// Generar mapa mundial SVG
function generateWorldMap() {
    const mapContainer = document.getElementById('map-container');
    
    // Crear SVG
    const svgNS = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(svgNS, "svg");
    svg.setAttribute("viewBox", "0 0 800 400");
    svg.setAttribute("preserveAspectRatio", "xMidYMid meet");
    
    // Definir continentes simples (formas básicas)
    const continents = [
        { id: "america", name: "América", path: "M150,100 L250,80 L300,150 L280,250 L200,280 L120,220 L100,150 Z", color: "#2c3e50" },
        { id: "europe", name: "Europa", path: "M400,80 L480,70 L500,120 L470,180 L420,200 L380,150 Z", color: "#2c3e50" },
        { id: "asia", name: "Asia", path: "M500,70 L650,60 L700,150 L680,250 L550,280 L480,200 L470,120 Z", color: "#2c3e50" },
        { id: "africa", name: "África", path: "M420,200 L480,180 L500,250 L470,320 L400,350 L360,280 Z", color: "#2c3e50" },
        { id: "oceania", name: "Oceanía", path: "M650,280 L720,260 L750,320 L700,380 L630,350 L620,300 Z", color: "#2c3e50" }
    ];
    
    // Agregar continentes al SVG
    continents.forEach(continent => {
        const path = document.createElementNS(svgNS, "path");
        path.setAttribute("d", continent.path);
        path.setAttribute("fill", continent.color);
        path.setAttribute("stroke", "#34495e");
        path.setAttribute("stroke-width", "2");
        path.setAttribute("data-continent", continent.id);
        path.setAttribute("class", "continent");
        
        // Agregar efecto hover
        path.addEventListener("mouseover", function() {
            this.setAttribute("fill", "#3498db");
        });
        
        path.addEventListener("mouseout", function() {
            // Si no es el continente seleccionado, volver al color original
            if (this.getAttribute("data-continent") !== currentLocation.continent) {
                this.setAttribute("fill", continent.color);
            }
        });
        
        // Agregar evento click
        path.addEventListener("click", function() {
            const continentId = this.getAttribute("data-continent");
            // Cambiar filtro y actualizar
            document.querySelectorAll('.filter-btn').forEach(btn => {
                btn.classList.remove('active');
                if (btn.dataset.filter === continentId) {
                    btn.classList.add('active');
                }
            });
            
            filter = continentId;
            initLocationCards();
        });
        
        svg.appendChild(path);
    });
    
    // Agregar puntos para ubicaciones principales
    const locationsPoints = [
        { continent: "america", x: 200, y: 180, name: "Nueva York" },
        { continent: "europe", x: 440, y: 140, name: "Londres" },
        { continent: "asia", x: 600, y: 160, name: "Tokio" },
        { continent: "africa", x: 460, y: 260, name: "El Cairo" },
        { continent: "oceania", x: 700, y: 320, name: "Sídney" }
    ];
    
    locationsPoints.forEach(point => {
        const circle = document.createElementNS(svgNS, "circle");
        circle.setAttribute("cx", point.x);
        circle.setAttribute("cy", point.y);
        circle.setAttribute("r", "6");
        circle.setAttribute("fill", "#e74c3c");
        circle.setAttribute("stroke", "#fff");
        circle.setAttribute("stroke-width", "2");
        circle.setAttribute("class", "location-point");
        circle.setAttribute("data-location", point.name);
        
        // Agregar tooltip
        const title = document.createElementNS(svgNS, "title");
        title.textContent = point.name;
        circle.appendChild(title);
        
        svg.appendChild(circle);
    });
    
    // Limpiar y agregar SVG al contenedor
    mapContainer.innerHTML = '';
    mapContainer.appendChild(svg);
    
    // Resaltar continente actual
    updateMapHighlight();
}

// Actualizar resaltado del mapa
function updateMapHighlight() {
    const svg = document.querySelector('#map-container svg');
    if (!svg) return;
    
    // Resetear todos los continentes
    svg.querySelectorAll('.continent').forEach(continent => {
        continent.setAttribute("fill", "#2c3e50");
    });
    
    // Resaltar continente actual
    const currentContinent = svg.querySelector(`[data-continent="${currentLocation.continent}"]`);
    if (currentContinent) {
        currentContinent.setAttribute("fill", "#3498db");
    }
}

// Mostrar notificación
function showNotification(message) {
    // Eliminar notificación anterior si existe
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Crear nueva notificación
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #2ecc71;
        color: white;
        padding: 15px 20px;
        border-radius: 10px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.3);
        z-index: 1000;
        animation: slideIn 0.3s ease;
    `;
    
    // Agregar estilos de animación
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(notification);
    
    // Remover después de 3 segundos
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            notification.remove();
            style.remove();
        }, 300);
    }, 3000);
}

// Inicializar event listeners adicionales
function initEventListeners() {
    // Enlace de GitHub
    document.getElementById('github-link').addEventListener('click', function(e) {
        e.preventDefault();
        window.open('https://github.com', '_blank');
    });
    
    // Enlace de API
    document.getElementById('api-link').addEventListener('click', function(e) {
        e.preventDefault();
        showNotification('Usando API de zona horaria del navegador');
    });
    
    // Enlace Acerca de
    document.getElementById('about-link').addEventListener('click', function(e) {
        e.preventDefault();
        showNotification('TimeZone World v1.0 - Desarrollado con HTML, CSS y JavaScript');
    });
}

// Actualizar enlaces del footer
function updateFooterLinks() {
    // Aquí se pueden personalizar los enlaces según sea necesario
}

// Asegurar que las funciones estén disponibles globalmente
window.selectLocation = selectLocation;
window.toggleFavorite = toggleFavorite;