// Get user info from URL parameters or localStorage
window.onload = function() {
    const urlParams = new URLSearchParams(window.location.search);
    const userEmail = urlParams.get('email') || localStorage.getItem('userEmail');
    
    if (userEmail) {
        document.getElementById('welcomeMessage').textContent = `Welcome, ${userEmail}`;
        localStorage.setItem('userEmail', userEmail);
    } else {
        // Redirect to login if no user info
        window.location.href = '../index.html';
    }
};

function logout() {
    localStorage.removeItem('userEmail');
    window.location.href = '../index.html';
}