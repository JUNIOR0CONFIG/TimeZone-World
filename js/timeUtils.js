// Utilidades para manejo de tiempo y fechas

// Función para formatear la hora
function formatTime(date, timezone = null) {
    let options = {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
        timeZone: timezone || Intl.DateTimeFormat().resolvedOptions().timeZone
    };
    
    return date.toLocaleTimeString('es-ES', options);
}

// Función para formatear la fecha
function formatDate(date, timezone = null) {
    let options = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        timeZone: timezone || Intl.DateTimeFormat().resolvedOptions().timeZone
    };
    
    const formattedDate = date.toLocaleDateString('es-ES', options);
    return formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);
}

// Función para obtener la diferencia horaria respecto a UTC
function getTimezoneOffset(timezone) {
    const now = new Date();
    const localTime = now.toLocaleString('en-US', { timeZone: timezone, timeZoneName: 'short' });
    const timezoneName = localTime.split(' ').pop();
    
    // Calcular offset
    const date = new Date();
    const utcDate = new Date(date.toLocaleString('en-US', { timeZone: 'UTC' }));
    const tzDate = new Date(date.toLocaleString('en-US', { timeZone: timezone }));
    const offset = (tzDate.getTime() - utcDate.getTime()) / (1000 * 60 * 60);
    
    // Formatear offset
    const sign = offset >= 0 ? '+' : '-';
    const hours = Math.abs(Math.floor(offset));
    const minutes = Math.abs((offset % 1) * 60);
    
    return `UTC${sign}${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}

// Función para determinar si es de día o de noche
function getDayPeriod(date, timezone) {
    const options = { 
        hour: 'numeric', 
        hour12: false, 
        timeZone: timezone 
    };
    
    const hour = parseInt(date.toLocaleString('en-US', options));
    
    if (hour >= 6 && hour < 12) {
        return "Mañana";
    } else if (hour >= 12 && hour < 18) {
        return "Tarde";
    } else if (hour >= 18 && hour < 22) {
        return "Anochecer";
    } else {
        return "Noche";
    }
}

// Función para obtener el día del año
function getDayOfYear(date, timezone) {
    const start = new Date(date.getFullYear(), 0, 0);
    const diff = date - start;
    const oneDay = 1000 * 60 * 60 * 24;
    const day = Math.floor(diff / oneDay);
    return `Día ${day}`;
}

// Función para obtener la hora en una zona horaria específica
function getTimeInTimezone(timezone) {
    return new Date().toLocaleString('en-US', { timeZone: timezone });
}

// Función para calcular la diferencia horaria entre dos zonas
function getTimeDifference(timezone1, timezone2) {
    const now = new Date();
    const time1 = new Date(now.toLocaleString('en-US', { timeZone: timezone1 }));
    const time2 = new Date(now.toLocaleString('en-US', { timeZone: timezone2 }));
    
    const diff = (time1.getTime() - time2.getTime()) / (1000 * 60 * 60);
    return diff;
}

// Función para actualizar el reloj en tiempo real
function startClock(updateFunction, timezone = null) {
    updateFunction(timezone);
    setInterval(() => updateFunction(timezone), 1000);
}

// Exportar funciones para uso en otros archivos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        formatTime,
        formatDate,
        getTimezoneOffset,
        getDayPeriod,
        getDayOfYear,
        getTimeInTimezone,
        getTimeDifference,
        startClock
    };
}