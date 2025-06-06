(() => {
    var e = {
        748: e => {
            const t = "pip_fve_",
                n = "pip_from_script_",
                o = "pip_from_content_";

            function r(e, t) {
                return e + "#" + t
            }

            function i(e, t) {
                new MutationObserver((function (n, o) {
                    let r = document.documentElement.getAttribute(e);
                    if (r) {
                        document.documentElement.removeAttribute(e);
                        let [n, o] = function (e) {
                            return e.split("#")
                        }(r);
                        t(n, o)
                    }
                })).observe(document.documentElement, {
                    attributeFilter: [e]
                })
            }

            function u(e, t) {
                document.documentElement.setAttribute(e, t)
            }
            e.exports = {
                listenToScript: function (e) {
                    i(n, e)
                },
                listenToContent: function (e) {
                    i(o, e)
                },
                sendFromScript: function (e, t = "") {
                    let o = r(e, t);
                    u(n, o)
                },
                sendFromContent: function (e, t = "") {
                    let n = r(e, t);
                    u(o, n)
                },
                windowMessage: function (e, n = Math.random()) {
                    try {
                        e = t + e, chrome.storage.local.set({
                            [e]: n
                        }), chrome.storage.local.remove([e], (() => { }))
                    } catch { }
                },
                setStorageChangeHandler: function (e) {
                    chrome.storage.onChanged.addListener(((n, o) => function (e, n, o) {
                        if ("local" !== n) return;
                        let r = Object.keys(e);
                        for (let n of r) {
                            if (!n.startsWith(t)) continue;
                            let r = n.substring(8),
                                i = e[n].newValue;
                            void 0 !== i && o(r, i)
                        }
                    }(n, o, e)))
                },
                setDocAttribute: u,
                getDocAttribute: function (e) {
                    return document.documentElement.getAttribute(e)
                },
                getSizeStr: function (e, t) {
                    return e + "," + t
                },
                parseSizeStr: function (e) {
                    let [t, n] = e.split(",");
                    return [parseInt(t), parseInt(n)]
                }
            }
        }
    },
        t = {};

    function n(o) {
        var r = t[o];
        if (void 0 !== r) return r.exports;
        var i = t[o] = {
            exports: {}
        };
        return e[o](i, i.exports, n), i.exports
    } (() => {
        const e = n(748),
            t = "ping_pip";
        let o = !1;
        new MutationObserver((function (e, t) {
            if ("www.disneyplus.com" === window.location.hostname) {
                if (document.body.hasAttribute("data-duration")) return;
                let e = document.querySelector(".time-remaining-label");
                if (e) {
                    let t = function (e) {
                        console.log({
                            time: e
                        });
                        let t = e.split(":"),
                            n = 0;
                        return 3 === t.length ? (n += 3600 * parseInt(t[0]), n += 60 * parseInt(t[1]), n += parseInt(t[2])) : 2 === t.length ? (n += 60 * parseInt(t[0]), n += parseInt(t[1])) : 1 === t.length && (n += parseInt(t[0])), console.log({
                            seconds: n
                        }), n
                    }(e.textContent),
                        n = document.querySelector("video").currentTime + t;
                    document.body.setAttribute("data-duration", n)
                }
            }
        })).observe(document.documentElement, {
            childList: !0,
            subtree: !0
        }), e.listenToScript(((t, n) => {
            if ("resize" === t) try {
                chrome.storage.local.set({
                    resize: n
                }, (() => { }))
            } catch (e) {
                console.log(e)
            } else e.windowMessage(t)
        })), e.setStorageChangeHandler((function (n, r) {
            "mouseenter" === n ? o = !0 : "mouseleave" === n && (o = !1), documentPictureInPicture.window && n === t && e.sendFromContent(r)
        })), document.body.addEventListener("keydown", (function (n) {
            o && (32 === n.keyCode && documentPictureInPicture.window || [32, 37, 38, 39, 40].includes(n.keyCode) && (n.preventDefault(), e.windowMessage(t, n.keyCode)))
        })),
            function () {
                let t = {};
                chrome.storage.local.get({
                    speedupYoutubeAds: !1,
                    resize: null
                }, (n => {
                    console.log({
                        results: n
                    }), Object.assign(t, n),
                        function (t) {
                            e.setDocAttribute("speedupYoutubeAds", t.speedupYoutubeAds), t.resize && e.setDocAttribute("resize", t.resize)
                        }(t)
                }))
            }()
    })()
})();