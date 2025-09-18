// Get time-based greeting
function getTimeBasedGreeting() {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
}

// Get user info from URL parameters or localStorage
window.onload = function() {
    const urlParams = new URLSearchParams(window.location.search);
    const userEmail = urlParams.get('email') || localStorage.getItem('userEmail');
    const userName = urlParams.get('name') || localStorage.getItem('userName') || userEmail;
    
    if (userEmail) {
        const greeting = getTimeBasedGreeting();
        document.getElementById('welcomeMessage').textContent = `${greeting}, ${userName}!`;
        localStorage.setItem('userEmail', userEmail);
        if (userName !== userEmail) localStorage.setItem('userName', userName);
    } else {
        // Redirect to login if no user info
        window.location.href = '../index.html';
    }
};

function logout() {
    localStorage.removeItem('userEmail');
    window.location.href = '../index.html';
}