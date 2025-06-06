chrome.storage.local.get({
    speedupYoutubeAds: !1
}, (e => {
    const o = document.querySelector("#speedupYoutubeAds");
    o.checked = e.speedupYoutubeAds, o.onchange = e => {
        chrome.storage.local.set({
            speedupYoutubeAds: o.checked
        }, (e => { }))
    }
}));