function setEventListeners(container, shadowDOM) {

    const q1 = shadowDOM.getElementById("q1");
    const yes1 = shadowDOM.getElementById("yes-1");
    const no1 = shadowDOM.getElementById("no-1");

    const q2 = shadowDOM.getElementById("q2");
    const yes2 = shadowDOM.getElementById("yes-2");
    const no2 = shadowDOM.getElementById("no-2");

    const timer = shadowDOM.getElementById("timer");


    yes1.addEventListener("click", () => {
        q1.style.display = "none";
        q2.style.display = "block";
    })

    no1.addEventListener("click", () => {
        q1.style.display = "none";
        timer.style.display = "block";
    })

    yes2.addEventListener("click", () => {
        q2.style.display = "none";
        container.style.display = "none";
    })

    no2.addEventListener("click", () => {
        q2.style.display = "none";
        timer.style.display = "block";
    })
}
function block() {
    // alert("we should see something") // just to test we properly capture urls

    const container = document.createElement("div");
    container.id = "extension-container";

    container.style.position = "fixed";
    container.style.top = "0";
    container.style.left = "0";
    container.style.width = "100vw";
    container.style.height = "100vh";
    container.style.zIndex = "9999";
    container.style.display = "flex";
    container.style.alignItems = "center";
    container.style.justifyContent = "center";
    container.style.backgroundColor = "rgba(0, 0, 0, 0.8)";

    document.body.appendChild(container);
    const shadowDOM = container.attachShadow({ mode: "open" });

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
            setEventListeners(container, shadowDOM);
        })
        .catch(error => {console.error("failed to style", error)});
    }).catch(error => {console.error("failed to block site", error)});
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", block);
} else {
    block();
}