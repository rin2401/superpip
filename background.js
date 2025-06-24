chrome.action.onClicked.addListener((tab => {
    chrome.scripting.executeScript({
        target: {
            tabId: tab.id,
            allFrames: true
        },
        world: "MAIN",
        files: ["script.js"]
    })
}))
