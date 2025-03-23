function block() {
    const overlay = document.createElement("div");
    overlay.id = "blocker-overlay";

    const message = document.createElement("div");
    message.id = "blocker-message";
    message.innerHTML = `
        <h2>Site Blocked</h2>
        <p>This website is blocked, monkey brain.</p>
    `;

    overlay.appendChild(message);
    document.body.appendChild(overlay);
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", block);
} else {
    block();
}
