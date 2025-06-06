(() => {
    "use strict";
    chrome.action.onClicked.addListener((e => {
        chrome.scripting.executeScript({
            target: {
                tabId: e.id,
                allFrames: false
            },
            world: "MAIN",
            files: ["script.js"]
        })
    }))
})();