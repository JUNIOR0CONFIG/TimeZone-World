// Datos de ubicaciones con sus husos horarios
const locations = [
    // América
    { id: 1, city: "Nueva York", country: "Estados Unidos", timezone: "America/New_York", continent: "america", code: "US" },
    { id: 2, city: "Los Ángeles", country: "Estados Unidos", timezone: "America/Los_Angeles", continent: "america", code: "US" },
    { id: 3, city: "Ciudad de México", country: "México", timezone: "America/Mexico_City", continent: "america", code: "MX" },
    { id: 4, city: "Toronto", country: "Canadá", timezone: "America/Toronto", continent: "america", code: "CA" },
    { id: 5, city: "São Paulo", country: "Brasil", timezone: "America/Sao_Paulo", continent: "america", code: "BR" },
    { id: 6, city: "Buenos Aires", country: "Argentina", timezone: "America/Argentina/Buenos_Aires", continent: "america", code: "AR" },
    { id: 7, city: "Santiago", country: "Chile", timezone: "America/Santiago", continent: "america", code: "CL" },
    { id: 8, city: "Lima", country: "Perú", timezone: "America/Lima", continent: "america", code: "PE" },
    
    // Europa
    { id: 9, city: "Londres", country: "Reino Unido", timezone: "Europe/London", continent: "europe", code: "GB" },
    { id: 10, city: "París", country: "Francia", timezone: "Europe/Paris", continent: "europe", code: "FR" },
    { id: 11, city: "Berlín", country: "Alemania", timezone: "Europe/Berlin", continent: "europe", code: "DE" },
    { id: 12, city: "Madrid", country: "España", timezone: "Europe/Madrid", continent: "europe", code: "ES" },
    { id: 13, city: "Roma", country: "Italia", timezone: "Europe/Rome", continent: "europe", code: "IT" },
    { id: 14, city: "Moscú", country: "Rusia", timezone: "Europe/Moscow", continent: "europe", code: "RU" },
    { id: 15, city: "Ámsterdam", country: "Países Bajos", timezone: "Europe/Amsterdam", continent: "europe", code: "NL" },
    { id: 16, city: "Estocolmo", country: "Suecia", timezone: "Europe/Stockholm", continent: "europe", code: "SE" },
    
    // Asia
    { id: 17, city: "Tokio", country: "Japón", timezone: "Asia/Tokyo", continent: "asia", code: "JP" },
    { id: 18, city: "Pekín", country: "China", timezone: "Asia/Shanghai", continent: "asia", code: "CN" },
    { id: 19, city: "Singapur", country: "Singapur", timezone: "Asia/Singapore", continent: "asia", code: "SG" },
    { id: 20, city: "Seúl", country: "Corea del Sur", timezone: "Asia/Seoul", continent: "asia", code: "KR" },
    { id: 21, city: "Bangkok", country: "Tailandia", timezone: "Asia/Bangkok", continent: "asia", code: "TH" },
    { id: 22, city: "Dubái", country: "Emiratos Árabes", timezone: "Asia/Dubai", continent: "asia", code: "AE" },
    { id: 23, city: "Nueva Delhi", country: "India", timezone: "Asia/Kolkata", continent: "asia", code: "IN" },
    { id: 24, city: "Yakarta", country: "Indonesia", timezone: "Asia/Jakarta", continent: "asia", code: "ID" },
    
    // África
    { id: 25, city: "El Cairo", country: "Egipto", timezone: "Africa/Cairo", continent: "africa", code: "EG" },
    { id: 26, city: "Johannesburgo", country: "Sudáfrica", timezone: "Africa/Johannesburg", continent: "africa", code: "ZA" },
    { id: 27, city: "Nairobi", country: "Kenia", timezone: "Africa/Nairobi", continent: "africa", code: "KE" },
    { id: 28, city: "Lagos", country: "Nigeria", timezone: "Africa/Lagos", continent: "africa", code: "NG" },
    { id: 29, city: "Casablanca", country: "Marruecos", timezone: "Africa/Casablanca", continent: "africa", code: "MA" },
    
    // Oceanía
    { id: 30, city: "Sídney", country: "Australia", timezone: "Australia/Sydney", continent: "oceania", code: "AU" },
    { id: 31, city: "Melbourne", country: "Australia", timezone: "Australia/Melbourne", continent: "oceania", code: "AU" },
    { id: 32, city: "Auckland", country: "Nueva Zelanda", timezone: "Pacific/Auckland", continent: "oceania", code: "NZ" },
    { id: 33, city: "Honolulú", country: "Estados Unidos", timezone: "Pacific/Honolulu", continent: "oceania", code: "US" },
    { id: 34, city: "Fiyi", country: "Fiyi", timezone: "Pacific/Fiji", continent: "oceania", code: "FJ" }
];

// Función para obtener todas las ubicaciones
function getAllLocations() {
    return locations;
}

// Función para obtener ubicaciones por continente
function getLocationsByContinent(continent) {
    if (continent === 'all') {
        return locations;
    }
    return locations.filter(location => location.continent === continent);
}

// Función para buscar ubicaciones por texto
function searchLocations(query) {
    const lowerQuery = query.toLowerCase();
    return locations.filter(location => 
        location.city.toLowerCase().includes(lowerQuery) || 
        location.country.toLowerCase().includes(lowerQuery)
    );
}

// Función para obtener ubicación por ID
function getLocationById(id) {
    return locations.find(location => location.id === id);
}

// Función para obtener ubicación por zona horaria
function getLocationByTimezone(timezone) {
    return locations.find(location => location.timezone === timezone);
}

// Exportar funciones para uso en otros archivos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        getAllLocations,
        getLocationsByContinent,
        searchLocations,
        getLocationById,
        getLocationByTimezone,
        locations
    };
}