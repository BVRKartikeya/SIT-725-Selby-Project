// Session timeout: 5 minutes
const SESSION_TIMEOUT = 5 * 60 * 1000;
let sessionTimer;

function resetSessionTimer() {
  clearTimeout(sessionTimer);
  sessionTimer = setTimeout(() => {
    alert("Session expired due to inactivity.");
    logout();
  }, SESSION_TIMEOUT);
}

function logout() {
  localStorage.removeItem('user_email');
  window.location.href = 'index.html';
}

document.addEventListener('mousemove', resetSessionTimer);
document.addEventListener('keydown', resetSessionTimer);

window.onload = function () {
  resetSessionTimer();

  if (window.location.pathname.includes("listing.html")) {
    const urlEmail = new URLSearchParams(window.location.search).get("email");
    const storedEmail = localStorage.getItem("user_email");

    if (urlEmail) {
      localStorage.setItem("user_email", urlEmail);
    } else if (!storedEmail) {
      alert("Please login to continue.");
      logout();
    }
  }
};
