function block() {
    alert("we should see something")

    const container = document.createElement("div");
    container.id = "extension-container";

    // container.style.position = "fixed";
    // container.style.top = "0";
    // container.style.left = "0";
    // container.style.width = "100%";
    // container.style.height = "100%";
    // container.style.zIndex = "9999";

    document.body.appendChild(container);
    const shadowDOM = container.attachShadow({ mode: "closed" });

    const blocker = chrome.runtime.getURL("blocker.html");
    const styles = chrome.runtime.getURL("styles.css");

    fetch(blocker)
    .then(res => res.text())
    .then(html => {
        const styleElement = document.createElement("style");

        fetch(styles)
        .then(stylesRes => stylesRes.text())
        .then(css => {
            styleElement.textContent = css;
            shadowDOM.appendChild(styleElement);
            const blockerContainer = document.createElement("div");
            blockerContainer.innerHTML = html;
            shadowDOM.appendChild(blockerContainer);
        })
        .catch(error => {console.error("failed to style", error)});
    }).catch(error => {console.error("failed to block site", error)});
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", block);
} else {
    block();
}