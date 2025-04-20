function setEventListeners(container, shadowDOM) {

    const q1 = shadowDOM.getElementById("q1");
    const yes1 = shadowDOM.getElementById("yes-1");
    const no1 = shadowDOM.getElementById("no-1");

    const q2 = shadowDOM.getElementById("q2");
    const yes2 = shadowDOM.getElementById("yes-2");
    const no2 = shadowDOM.getElementById("no-2");

    const q3 = shadowDOM.getElementById("q3");
    const yes3 = shadowDOM.getElementById("yes-3");
    const no3 = shadowDOM.getElementById("no-3");

    const timer = shadowDOM.getElementById("timer");
    const start = shadowDOM.getElementById("start");


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
        q3.style.display = "block";
    })

    no2.addEventListener("click", () => {
        container.style.display = "none";
    })

    yes3.addEventListener("click", () => {
        container.style.display = "none";
    })

    no3.addEventListener("click", () => {
        q3.style.display = "none";
        timer.style.display = "block";
    })

    start.addEventListener("click", () => {
        const minutes = parseInt(shadowDOM.getElementById("m").value);
        const seconds = parseInt(shadowDOM.getElementById("s").value);
        setTimer(minutes, seconds)

    })
}

function setTimer(m, s) {
    const startBlock = new Date();
    const endBlock = startBlock;
    console.log("its currently: ", startBlock);
    console.log("setting timer to: ", m, ":", s);
    endBlock.setSeconds(startBlock.getSeconds() + s);
    endBlock.setMinutes(startBlock.getMinutes() + m);
    console.log("so itll unblock at: ", endBlock);
    localStorage.setItem("blocked", true); 
    localStorage.setItem("endBlock", endBlock); 
}

function updateTimer() {
    const now = new Date();
    const endBlock = new Date(localStorage.getItem("endBlock"));
    // const blocked = localStorage.getItem("blocked");
    // if (blocked === "false" || blocked === null) {
    //     // return;
    // }
    // if (now >= endBlock) {
    //     // localStorage.setItem("blocked", false);
    //     // localStorage.removeItem("endBlock");
    //     // document.getElementById("extension-container").style.display = "none";
    // } else {
        const remaining = endBlock - now;
        const minutes = Math.floor(remaining / 1000 / 60) % 60;
        const seconds = Math.floor(remaining / 1000) % 60;

        const shadowDOM = document.getElementById("extension-container").shadowRoot;
        shadowDOM.getElementById("m").innerHTML = minutes;
        shadowDOM.getElementById("s").innerHTML = seconds;
        console.log("time left: ", minutes, seconds);
    }
// }


function isBlocked() {
    const blocked = localStorage.getItem("blocked");
    if (blocked === "true") {
    setInterval(updateTimer, 1000);
}
}

setInterval(isBlocked, 1000);




function block() {

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