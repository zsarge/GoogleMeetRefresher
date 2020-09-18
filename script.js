// ==UserScript==
// @name         Google Meet Refresher
// @namespace    https://github.com/zsarge/
// @version      1
// @description  Automatically refreshes Google Meet when the user joins a link before a meeting is properly set up.
// @author       Zack Sargent
// @match        https://meet.google.com/*
// @grant        none
// @run-at       document-end
// ==/UserScript==

var timeUntilReload = 5000;
const increment = 100;
const divClass = "countdownText";
const mainDivClass = "jtEd4b";
// mainDivClass should be a div with the content:
// "You can't create a meeting yourself. Contact your system administrator for more information."

function failedToJoin() {
    let page = document.body.textContent;
    let url = window.location.href;

    if (url.includes("lookup") || url.includes("whoops")) {
        return page.includes("system administrator") || page.includes("Failed")
    }
}

function timeString() {
    // Multiply and divide by 10 to get a decimal place of precision
    let seconds = Math.round(timeUntilReload / 1000)
    let plural = (seconds == 1) ? "second" : "seconds"
    return `This page will refresh in ${seconds} ${plural}.`
}

function appendCoundownDiv() {
        let node = document.createElement("div");
        node.setAttribute('class', divClass);
        let textnode = document.createTextNode(timeString());
        node.appendChild(textnode);
        console.log(node)

        document.body.getElementsByClassName(mainDivClass)[0].appendChild(node);
}

function updateTime() {
    let header = document.body.getElementsByClassName(divClass)
    header[0].textContent = timeString()
    console.log(timeString())
}

// Main Loop
var checkExist = setInterval(() => {
    if (failedToJoin()) {
        updateTime();
        timeUntilReload -= increment;

        if (timeUntilReload < 1) {
            location.reload();
            console.log("reloaded");
            clearInterval(checkExist)
        }
     } else {
         clearInterval(checkExist)
     }
}, increment);

// Main Setup Function
(function() {
    if (failedToJoin()) {
        document.body.getElementsByClassName(mainDivClass)[0].textContent = "Failed to join meeting.";
        appendCoundownDiv();
    }
})();
