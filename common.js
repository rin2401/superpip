(() => {
    let e = {};

    function t() {
        return (new Date).getTime()
    }

    function s() {
        e.requestId && function (t = {}) {
            chrome.runtime?.id && n((() => {
                let s = {
                    trim_version: "pictureinpicture",
                    page_title: document.title,
                    ...t
                };
                s.page_location || (s.page_location = document.location.href), s.page_referrer || (s.page_referrer = document.referrer), e.requestId && (s.request_id = e.requestId), chrome.runtime.sendMessage({
                    action: "analyze",
                    event: "page_view",
                    params: s
                })
            }))
        }({
            request_id: e.requestId
        })
    }

    function n(t) {
        chrome.storage.local.get(["settings"], (function (s) {
            Object.assign(e, s.settings), t()
        }))
    }
    chrome.runtime.onMessage.addListener(((n, r, o) => function (n, r) {
        if (r({}), "releaseNoteVersionReceived" === n.action) {
            e.savedReleaseNoteTime = t();
            let r = n.releaseNoteVersion;
            e.savedReleaseNoteVersion !== r.v ? (e.savedReleaseNoteVersion = r.v, chrome.storage.local.set({
                settings: e
            }, (() => {
                chrome.runtime?.id && chrome.runtime.sendMessage({
                    action: "getReleaseNoteContent"
                }, (() => { }))
            }))) : chrome.storage.local.set({
                settings: e
            }, (() => { })), 200 === n.status && s()
        } else if ("releaseNoteContentReceived" === n.action) {
            let t = n.releaseNoteContent;
            t.requestId && (e.requestId = t.requestId, chrome.storage.local.set({
                settings: e
            }))
        }
    }(n, o))), n((() => {
        ! function () {
            let n = e.savedReleaseNoteTime;
            n && t() - n < 36e5 ? s() : chrome.runtime?.id && chrome.runtime.sendMessage({
                action: "getReleaseNoteVersion",
                requestId: e.requestId
            }, (() => { }))
        }()
    }))
})();