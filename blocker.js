function setOverlay(container, shadowDOM) {



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
    const m = shadowDOM.getElementById("m");
    const s = shadowDOM.getElementById("s");

    // check if its already blocked
    const endBlock = new Date(localStorage.getItem("endBlock"));
    const now = new Date();
    if (endBlock > now) {
        q1.style.display="none";
        start.style.display = "none";
        m.readOnly = true;
        s.readOnly = true;
        m.addEventListener("wheel", e => e.preventDefault());
        s.addEventListener("wheel", e => e.preventDefault());
        let remaining = new Date(endBlock - now);
        remaining = remaining.getSeconds();
        const minutes = Math.floor(remaining / 60)
        const seconds = remaining % 60;
        setTimer(minutes, seconds, remaining);
        timer.style.display="block";

    }
    console.log("endblock: ", endBlock);
    console.log("endblock as date: ", Date(endBlock));


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
        start.style.display = "none";
        m.readOnly = true;
        s.readOnly = true;
        m.addEventListener("wheel", e => e.preventDefault());
        s.addEventListener("wheel", e => e.preventDefault());

        const minutes = parseInt(m.value);
        const seconds = parseInt(s.value);
        const remaining = minutes * 60 + seconds

        setTimer(minutes, seconds, remaining);

    })
}

function setTimer(minutes, seconds, remaining) {
    const startBlock = new Date();
    const endBlock = startBlock;
    console.log("its currently: ", startBlock);
    console.log("setting timer to: ", minutes, ":", seconds);
    endBlock.setSeconds(startBlock.getSeconds() + seconds);
    endBlock.setMinutes(startBlock.getMinutes() + minutes);
    console.log("so itll unblock at: ", endBlock);
    localStorage.setItem("blocked", true); 
    localStorage.setItem("endBlock", endBlock); 

    const shadowDOM = document.getElementById("extension-container").shadowRoot;
    const m = shadowDOM.getElementById("m");
    const s = shadowDOM.getElementById("s");

    setInterval(() => {
        if (remaining <= 0) {
            localStorage.setItem("blocked", false);
            localStorage.removeItem("endBlock");
            document.getElementById("extension-container").style.display = "none"; 
            return;
        } 
        let remainingMin = Math.floor(remaining / 60);
        let remainingSec = remaining % 60;
        m.value = remainingMin;
        s.value = ("0" + remainingSec).slice(-2);
        remaining--;
    }, 1000);
}


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
            setOverlay(container, shadowDOM);
        })
        .catch(error => {console.error("failed to style", error)});
    }).catch(error => {console.error("failed to block site", error)});
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", block);
} else {
    block();
}