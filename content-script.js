alert("should block");

var style = document.createElement('link');
style.rel = 'stylesheet';
style.type = 'text/css';
style.href = chrome.runtime.getURL('styles.css');
(document.head||document.documentElement).appendChild(style);

document.addEventListener("DOMContentLoaded", () => {
    const overlay = document.createElement("div");
    overlay.id("blocker-overlay");

    const message = document.createElement("div");
    message.id("blocker-msg");
    message.innerHTML = `
        <h2>Site Blocked</h2>
        <p>This website is blocked, monkey brain.</p>
    `;

    overlay.appendChild(message);
    document.body.appendChild(overlay);
});
