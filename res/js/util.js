function formatDate(date) {
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const months = [  "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    const dayName = days[date.getDay()];
    const day = date.getDate();
    const monthName = months[date.getMonth()];
    const year = date.getFullYear();
    const suffix = (day) => {
        if (day > 3 && day < 21) return "th"; // Special case for 11th-13th
        switch (day % 10) {
            case 1: return "st";
            case 2: return "nd";
            case 3: return "rd";
            default: return "th";
        }
    };

    return `${dayName}, ${day}${suffix(day)} of ${monthName} ${year}`;
}

function getCookieByName(name) {
    const cookies = document.cookie.split(';'); // Split all cookies
    for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim(); // Remove any leading/trailing whitespace
        // Check if this cookie starts with the desired name
        if (cookie.startsWith(`${name}=`)) {
            return cookie.substring(name.length + 1); // Return the value of the cookie
        }
    }
    return null; // Return null if the cookie isn't found
}
