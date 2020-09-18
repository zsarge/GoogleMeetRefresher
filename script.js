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
var mainDivClass = "";
// mainDivClass should be a div with the content:
// "You can't create a meeting yourself. Contact your system administrator for more information."

const errorText = "You can't create a meeting yourself";
const customText = "Failed to join meeting.";

function getClassWithText(tags, text) {
    for (var i = 0; i < tags.length; i++) {
        if (tags[i].textContent.includes(text)) {
            // make sure it is just text, and not a parent node
            if (tags[i].childNodes.length == 1) {
                // this is the div we want to work with
                return tags[i].className
            }
        }
    }
}

function failedToJoin() {
    let page = document.body.textContent;
    let url = window.location.href;

    if (url.includes("lookup") || url.includes("whoops")) {
        return page.includes(errorText) || page.includes(customText)
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

// Main Setup Function
(function() {
    if (failedToJoin()) {
        // Replace default error with custom text
        var divTags = document.getElementsByTagName("div");
        mainDivClass = getClassWithText(divTags, errorText);
        document.body.getElementsByClassName(mainDivClass)[0].textContent = customText;

        // Create countdown element
        appendCoundownDiv();
    }
})();

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
