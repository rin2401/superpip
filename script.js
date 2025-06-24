function findLargestPlayingVideo() {
    const videos = Array.from(document.querySelectorAll('video'))
        .filter(video => video.readyState != 0)
        // .filter(video => video.disablePictureInPicture == false)
        .sort((v1, v2) => {
            const v1Rect = v1.getClientRects()[0] || { width: 0, height: 0 };
            const v2Rect = v2.getClientRects()[0] || { width: 0, height: 0 };
            return ((v2Rect.width * v2Rect.height) - (v1Rect.width * v1Rect.height));
        });

    if (videos.length === 0) {
        return;
    }
    console.log(videos);

    videos[0].disablePictureInPicture = false;

    return videos[0];
}

async function requestPictureInPicture(video) {
    await video.requestPictureInPicture();
    video.setAttribute('__pip__', true);
    video.addEventListener('leavepictureinpicture', event => {
        video.removeAttribute('__pip__');
    }, { once: true });
    new ResizeObserver(maybeUpdatePictureInPictureVideo).observe(video);
}

function maybeUpdatePictureInPictureVideo(entries, observer) {
    const observedVideo = entries[0].target;
    if (!document.querySelector('[__pip__]')) {
        observer.unobserve(observedVideo);
        return;
    }
    const video = findLargestPlayingVideo();
    if (video && !video.hasAttribute('__pip__')) {
        observer.unobserve(observedVideo);
        requestPictureInPicture(video);
    }
}

// (async () => {
//     const video = findLargestPlayingVideo();
//     if (!video) {
//         return;
//     }
//     if (video.hasAttribute('__pip__')) {
//         document.exitPictureInPicture();
//         return;
//     }
//     await requestPictureInPicture(video);
// })();


var e = {
    464: e => {
        e.exports = {
            PLAYBACK_CONTROLS: '\n    <span class="subtitles">\n    </span>\n    <div class="controls">\n        <div class="control-row">\n            <input id="pipProgress" type="range" min="0" max="100" step="0.1" />\n        </div>\n        <div class="control-row second-row">\n            <div class="control-group">\n                <button data-action="play" title="Play / Pause (␣)" class="pip-play noselect">\n                    <svg width="13" height="13" viewBox="6 6 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">\n                        <path d="M15 12.3301L9 16.6603L9 8L15 12.3301Z" fill="#fff" />\n                    </svg>\n                </button>\n            </div>\n            <div class="control-group control-group-rewind">\n                <button data-action="rewind" title="Rewind (←)" class="noselect">\n                    <svg xmlns="http://www.w3.org/2000/svg" fill="#fff" width="13" height="13" viewBox="0 0 24 24" role="img" aria-hidden="true">\n                        <path fill-rule="evenodd" clip-rule="evenodd" d="M11.0198 2.04817C13.3222 1.8214 15.6321 2.39998 17.5557 3.68532C19.4794 4.97066 20.8978 6.88324 21.5694 9.09717C22.241 11.3111 22.1242 13.6894 21.2388 15.8269C20.3534 17.9643 18.7543 19.7286 16.714 20.8192C14.6736 21.9098 12.3182 22.2592 10.0491 21.8079C7.77999 21.3565 5.73759 20.1323 4.26989 18.3439C2.80219 16.5555 2 14.3136 2 12L0 12C-2.74181e-06 14.7763 0.962627 17.4666 2.72387 19.6127C4.48511 21.7588 6.93599 23.2278 9.65891 23.7694C12.3818 24.3111 15.2083 23.8918 17.6568 22.5831C20.1052 21.2744 22.0241 19.1572 23.0866 16.5922C24.149 14.0273 24.2892 11.1733 23.4833 8.51661C22.6774 5.85989 20.9752 3.56479 18.6668 2.02238C16.3585 0.479973 13.5867 -0.214321 10.8238 0.0578004C8.71195 0.265799 6.70517 1.02858 5 2.2532V1H3V5C3 5.55228 3.44772 6 4 6H8V4H5.99999C7.45608 2.90793 9.19066 2.22833 11.0198 2.04817ZM2 4V7H5V9H1C0.447715 9 0 8.55228 0 8V4H2ZM14.125 16C13.5466 16 13.0389 15.8586 12.6018 15.5758C12.1713 15.2865 11.8385 14.8815 11.6031 14.3609C11.3677 13.8338 11.25 13.2135 11.25 12.5C11.25 11.7929 11.3677 11.1758 11.6031 10.6488C11.8385 10.1217 12.1713 9.71671 12.6018 9.43388C13.0389 9.14463 13.5466 9 14.125 9C14.7034 9 15.2077 9.14463 15.6382 9.43388C16.0753 9.71671 16.4116 10.1217 16.6469 10.6488C16.8823 11.1758 17 11.7929 17 12.5C17 13.2135 16.8823 13.8338 16.6469 14.3609C16.4116 14.8815 16.0753 15.2865 15.6382 15.5758C15.2077 15.8586 14.7034 16 14.125 16ZM14.125 14.6501C14.5151 14.6501 14.8211 14.4637 15.043 14.0909C15.2649 13.7117 15.3759 13.1814 15.3759 12.5C15.3759 11.8186 15.2649 11.2916 15.043 10.9187C14.8211 10.5395 14.5151 10.3499 14.125 10.3499C13.7349 10.3499 13.4289 10.5395 13.207 10.9187C12.9851 11.2916 12.8741 11.8186 12.8741 12.5C12.8741 13.1814 12.9851 13.7117 13.207 14.0909C13.4289 14.4637 13.7349 14.6501 14.125 14.6501ZM8.60395 15.8554V10.7163L7 11.1405V9.81956L10.1978 9.01928V15.8554H8.60395Z" fill="currentColor" />\n                    </svg>\n                </button>\n            </div>\n            <div class="control-group control-group-forward">\n                <button data-action="forward" title="Forward (→)" class="noselect">\n                    <svg xmlns="http://www.w3.org/2000/svg" fill="#fff" width="13" height="13" viewBox="0 0 24 24" role="img" aria-hidden="true">\n                        <path fill-rule="evenodd" clip-rule="evenodd" d="M6.4443 3.68532C8.36795 2.39998 10.6778 1.8214 12.9802 2.04817C14.8093 2.22833 16.5439 2.90793 18 4H16V6H20C20.5523 6 21 5.55229 21 5V1H19V2.2532C17.2948 1.02859 15.2881 0.2658 13.1762 0.057802C10.4133 -0.214319 7.64154 0.479975 5.33316 2.02238C3.02478 3.56479 1.32262 5.85989 0.516718 8.51661C-0.289188 11.1733 -0.148981 14.0273 0.913451 16.5922C1.97588 19.1572 3.8948 21.2744 6.34325 22.5831C8.79169 23.8918 11.6182 24.3111 14.3411 23.7694C17.064 23.2278 19.5149 21.7588 21.2761 19.6127C23.0374 17.4666 24 14.7763 24 12L22 12C22 14.3136 21.1978 16.5555 19.7301 18.3439C18.2624 20.1323 16.22 21.3565 13.9509 21.8079C11.6818 22.2592 9.32641 21.9098 7.28604 20.8192C5.24567 19.7286 3.64657 17.9643 2.76121 15.8269C1.87585 13.6894 1.75901 11.3111 2.4306 9.09718C3.10219 6.88324 4.52065 4.97067 6.4443 3.68532ZM22 4V7H19V9H23C23.5523 9 24 8.55229 24 8V4H22ZM12.6018 15.5758C13.0389 15.8586 13.5466 16 14.125 16C14.7034 16 15.2078 15.8586 15.6382 15.5758C16.0753 15.2865 16.4116 14.8815 16.6469 14.3609C16.8823 13.8338 17 13.2135 17 12.5C17 11.7929 16.8823 11.1759 16.6469 10.6488C16.4116 10.1217 16.0753 9.71671 15.6382 9.43389C15.2078 9.14463 14.7034 9 14.125 9C13.5466 9 13.0389 9.14463 12.6018 9.43389C12.1713 9.71671 11.8385 10.1217 11.6031 10.6488C11.3677 11.1759 11.25 11.7929 11.25 12.5C11.25 13.2135 11.3677 13.8338 11.6031 14.3609C11.8385 14.8815 12.1713 15.2865 12.6018 15.5758ZM15.043 14.0909C14.8211 14.4637 14.5151 14.6501 14.125 14.6501C13.7349 14.6501 13.429 14.4637 13.207 14.0909C12.9851 13.7117 12.8741 13.1814 12.8741 12.5C12.8741 11.8186 12.9851 11.2916 13.207 10.9187C13.429 10.5395 13.7349 10.3499 14.125 10.3499C14.5151 10.3499 14.8211 10.5395 15.043 10.9187C15.2649 11.2916 15.3759 11.8186 15.3759 12.5C15.3759 13.1814 15.2649 13.7117 15.043 14.0909ZM8.60395 10.7163V15.8554H10.1978V9.01929L7 9.81956V11.1405L8.60395 10.7163Z" />\n                    </svg>\n                </button>\n            </div>\n            <div class="control-group control-group-speed">\n                <button data-action="speed" title="Playback speed" class="noselect">\n                    <svg xmlns="http://www.w3.org/2000/svg" fill="#fff" width="13" height="13" viewBox="0 0 20 20" enable-background="new 0 0 20 20" xml:space="preserve">\n                        <path d="M10,20C4.5,20,0,15.5,0,10S4.5,0,10,0s10,4.5,10,10S15.5,20,10,20z M10,2c-4.4,0-8,3.6-8,8s3.6,8,8,8s8-3.6,8-8S14.4,2,10,2z"/>\n                        <path d="M8.6,11.4c-0.8-0.8-2.8-5.7-2.8-5.7s4.9,2,5.7,2.8c0.8,0.8,0.8,2,0,2.8C10.6,12.2,9.4,12.2,8.6,11.4z"/>\n                    </svg>\n                </button>\n            </div>\n            <div class="control-group control-group-next">\n                <button data-action="next" title="Next video">\n                    <svg width="13" height="13" viewBox="10 10 16 16" xmlns="http://www.w3.org/2000/svg">\n                        <path class="ytp-svg-fill" d="M 12,24 20.5,18 12,12 V 24 z M 22,12 v 12 h 2 V 12 h -2 z" fill="#fff" />\n                    </svg>\n                </button>\n            </div>\n            <div class="control-group">\n                <button data-action="mute" title="Mute / Unmute" class="pip-unmuted noselect">\n                    <svg width="13" height="13" fill="#fff" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">\n                        <path d="M16 21c3.527-1.547 5.999-4.909 5.999-9S19.527 4.547 16 3v2c2.387 1.386 3.999 4.047 3.999 7S18.387 17.614 16 19v2z"/><path d="M16 7v10c1.225-1.1 2-3.229 2-5s-.775-3.9-2-5zM4 17h2.697L14 21.868V2.132L6.697 7H4c-1.103 0-2 .897-2 2v6c0 1.103.897 2 2 2z"/>\n                    </svg>\n                </button>\n                <input id="pipVolume" type="range" min="0" max="100" />\n            </div>\n            <div class="control-group align-right">\n                <button data-action="crop" title="Remove borders (C)" class="noselect">\n                    <svg width="13" height="13" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" fill="none">\n                        <path fill="#fff" fill-rule="evenodd" d="M5.5 2a1 1 0 00-2 0v2H2a1 1 0 000 2h12v7h2V5a1 1 0 00-1-1H5.5V2zm-2 5v8a1 1 0 001 1H14v2a1 1 0 102 0v-2h2a1 1 0 100-2H5.5V7h-2z"/>\n                    </svg>\n                </button>\n            </div>\n            <div class="control-group control-group-time">\n                <div class="control-time control-time-1"></div>\n                <div class="control-time control-time-2"></div>\n            </div>\n        </div>\n    </div>\n',
            SPEED_CONTROLS: '\n    <div class="ytp-settings-menu" data-layer="6" id="ytp-id-18" tabindex="0">\n        <div class="ytp-panel">\n            <div class="ytp-panel-menu" role="menu">\n                <div class="ytp-menuitem ytp-drc-menu-item" role="menuitemcheckbox" aria-checked="false" tabindex="0">\n                    <div class="ytp-menuitem-label">0.5</div>\n                </div>\n                <div class="ytp-menuitem" aria-haspopup="true" role="menuitem" tabindex="0" aria-checked="false">\n                    <div class="ytp-menuitem-label">0.75</div>\n                </div>\n                <div class="ytp-menuitem" aria-haspopup="true" role="menuitem" tabindex="0" aria-checked="true">\n                    <div class="ytp-menuitem-label">Normal</div>\n                </div>\n                <div class="ytp-menuitem" aria-haspopup="true" role="menuitem" tabindex="0" aria-checked="false">\n                    <div class="ytp-menuitem-label">1.25</div>\n                </div>\n                <div class="ytp-menuitem" aria-haspopup="true" role="menuitem" tabindex="0" aria-checked="false">\n                    <div class="ytp-menuitem-label">1.5</div>\n                </div>\n                <div class="ytp-menuitem" aria-haspopup="true" role="menuitem" tabindex="0" aria-checked="false">\n                    <div class="ytp-menuitem-label">2.0</div>\n                </div>\n            </div>\n        </div>\n    </div>\n',
            PLAY_BUTTON_SVG: '\n    <svg width="13" height="13" viewBox="6 6 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">\n        <path d="M15 12.3301L9 16.6603L9 8L15 12.3301Z" fill="#fff" />\n    </svg>\n',
            PAUSE_BUTTON_SVG: '\n    <svg width="13" height="13" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">\n    <path fill="#fff" d="M120.16 45A20.162 20.162 0 0 0 100 65.16v381.68A20.162 20.162 0 0 0 120.16 467h65.68A20.162 20.162 0 0 0 206 446.84V65.16A20.162 20.162 0 0 0 185.84 45h-65.68zm206 0A20.162 20.162 0 0 0 306 65.16v381.68A20.162 20.162 0 0 0 326.16 467h65.68A20.162 20.162 0 0 0 412 446.84V65.16A20.162 20.162 0 0 0 391.84 45h-65.68z"/>\n    </svg>\n',
            UNMUTED_BUTTON_SVG: '\n    <svg width="13" height="13" fill="#fff" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">\n        <path d="M16 21c3.527-1.547 5.999-4.909 5.999-9S19.527 4.547 16 3v2c2.387 1.386 3.999 4.047 3.999 7S18.387 17.614 16 19v2z"/>\n        <path d="M16 7v10c1.225-1.1 2-3.229 2-5s-.775-3.9-2-5zM4 17h2.697L14 21.868V2.132L6.697 7H4c-1.103 0-2 .897-2 2v6c0 1.103.897 2 2 2z"/>\n    </svg>\n',
            MUTED_BUTTON_SVG: '\n    <svg width="13" height="13" fill="#fff" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">\n        <path d="M16 7v10M4 17h2.697L14 21.868V2.132L6.697 7H4c-1.103 0-2 .897-2 2v6c0 1.103.897 2 2 2z"/>\n    </svg>\n'
        }
    },
    944: e => {
        const t = Object.freeze({
            YOUTUBE: 0,
            NETFLIX: 1,
            DISNEY: 2,
            PRIMEVIDEO: 3,
            TWITCH: 4
        });
        let n = null;

        function o() {
            let e = document.querySelector(".html5-video-player");
            return e && e.classList.contains("ad-showing")
        }

        function i(e) {
            var t;
            t = e.playbackRate, Math.abs(t - 6.1) < 1e-6 || (e.setAttribute("oldspeed", e.playbackRate), e.setAttribute("oldvolume", e.volume), e.playbackRate = 6.1, e.volume = .2)
        }

        function r() {
            switch (window.location.hostname) {
                case "www.youtube.com":
                    return t.YOUTUBE;
                case "www.netflix.com":
                    return t.NETFLIX;
                case "www.disneyplus.com":
                    return t.DISNEY;
                case "www.primevideo.com":
                    return t.PRIMEVIDEO;
                case "www.twitch.tv":
                    return t.TWITCH;
                default:
                    return null
            }
        }
        e.exports = {
            Site: t,
            getSite: r,
            siteStyles: function () {
                let e = r();
                if (e === t.YOUTUBE) {
                    return "\n    #pipController .controls .control-row .control-group.control-group-next {\n        display: flex !important;\n    }\n\n    .ytp-caption-window-container {\n        width: 100%;\n        height: 100%;\n        position: absolute;\n        top: 0;\n        pointer-events: none;\n    }\n\n    .caption-window {\n        position: absolute;\n        line-height: normal;\n        z-index: 40;\n        pointer-events: auto;\n        cursor: move;\n        cursor: -webkit-grab;\n        cursor: grab;\n        -moz-user-select: none;\n        -ms-user-select: none;\n        -webkit-user-select: none;\n    }\n\n    body:hover .caption-window.ytp-caption-window-bottom {\n        margin-bottom: 49px;\n        overflow-wrap: normal;\n        display: block;\n    }\n\n    .ytp-caption-segment {\n        font-size: max(3.2vw, 12px) !important;\n    }\n\n    .ytp-caption-window-bottom .caption-visual-line:not(:nth-last-child(2)):not(:last-child) {\n        display: none !important;\n    }\n"
                }
                else if (e === t.NETFLIX) {
                    return "\n    body:hover .player-timedtext {\n        margin-bottom: 49px;\n    }\n"
                }
                else if (e === t.DISNEY) {
                    return "\n    .dss-hls-subtitle-overlay {\n        width: 100% !important;\n        height: 100% !important;\n    }\n\n    .dss-hls-subtitle-overlay .dss-subtitle-renderer-cue-positioning-box {\n        width: 100% !important;\n        height: auto !important;\n        top: auto !important;\n        bottom: 0 !important;\n    }\n\n    body:hover .dss-hls-subtitle-overlay .dss-subtitle-renderer-cue-positioning-box {\n        margin-bottom: 49px;\n    }\n\n    .dss-hls-subtitle-overlay span.dss-subtitle-renderer-cue {\n        font-size: max(2.8vw, 12px) !important;\n    }\n"
                }
                else if (e === t.PRIMEVIDEO) {
                    return "\n    .atvwebplayersdk-captions-overlay {\n        font-family: Arial, sans-serif;\n    }\n\n    .atvwebplayersdk-captions-overlay div:has(> p) {\n        bottom: 15px !important;\n    }\n\n    body:hover .atvwebplayersdk-captions-overlay p {\n        margin-bottom: 49px !important;\n    }\n\n    .atvwebplayersdk-captions-overlay span {\n        font-size: max(2.8vw, 12px) !important;\n    }\n"
                }
                else if (e === t.TWITCH) {
                    return "\n    .control-group-rewind, .control-group-forward, .control-group-speed {\n        display: none !important;\n    }\n"
                }
                else {
                    return "\n    .art-subtitle {\n opacity: 1!important;\n        display: block !important;\n        align-items: center;\n        justify-content: center;\n     user-select: none;\n        text-align: center;\n        width: 100%;\n        overflow: visible !important;\n        text-overflow: ellipsis;\n        white-space: normal;\n        font-size: 13px;\n        color: #eee;\n       position: fixed;\n    background: transparent;\n        font-family: sans-serif;\n        color: white;\n        border-radius: 4px;\n        padding: 0px 5px 0px;\n        margin: 0;\n        z-index: 9999;\n        box-sizing: border-box;\n        bottom: 10px;\n        left: 0;\n        width: 100%;}\n.art-subtitle-line:has(.art-subtitle-english) {\n	color: yellow;\n}"
                }
            },
            enterPiPHandler: function (e, o) {
                let i = r();
                if (i === t.YOUTUBE) {
                    let e = document.querySelector(".ytp-caption-window-container");
                    e && o.append(e)
                } else if (i === t.NETFLIX) {
                    let e = document.querySelector(".player-timedtext");
                    e && o.append(e)
                } else if (i === t.DISNEY) {
                    let t = document.querySelector(".dss-hls-subtitle-overlay");
                    t && o.append(t), e.document.querySelector("#pipProgress").classList.add("disabled")
                } else if (i === t.PRIMEVIDEO) {
                    let e = document.querySelectorAll(".atvwebplayersdk-captions-overlay");
                    if (e.length) {
                        let t = e[e.length - 1];
                        n = t.parentElement, o.append(t)
                    }
                } else if (i === t.TWITCH) {
                    e.document.querySelector("#pipProgress").classList.add("disabled")
                } else {
                    let e = document.querySelector(".art-subtitle");
                    console.log("PiP:", e)
                    e && o.prepend(e)
                }
            },
            exitPiPHandler: function (e) {
                let o = r();
                if (o === t.YOUTUBE) {
                    let t = document.querySelector(".html5-video-player"),
                        n = e.target.querySelector(".ytp-caption-window-container");
                    n && t.append(n)
                } else if (o === t.NETFLIX) {
                    let t = e.target.querySelector(".player-timedtext");
                    t && document.querySelector('[data-uia="video-canvas"]').children[0].children[0].append(t)
                } else if (o === t.DISNEY) {
                    let t = e.target.querySelector(".dss-hls-subtitle-overlay");
                    t && document.querySelector(".btm-media-client").append(t)
                } else if (o === t.PRIMEVIDEO) {
                    let t = e.target.querySelector(".atvwebplayersdk-captions-overlay");
                    t && n && (n.append(t), n = null)
                } else if (o === t.TWITCH) {
                    console.log("Twitch")
                } else {
                    let t = e.target.querySelector(".art-subtitle");
                    console.log("Exit:", t)
                    t && document.querySelector(".art-poster").after(t)
                }
            },
            metadataLoadedHandler: function (e, n) {
                let l = e.target;
                documentPictureInPicture.window ? r() === t.YOUTUBE && (o() ? n.speedupYoutubeAds && i(l) : function (e) {
                    let t = e.getAttribute("oldspeed"),
                        n = e.getAttribute("oldvolume");
                    t ? (console.log({
                        oldSpeed: t,
                        oldVolume: n
                    }), e.playbackRate = parseFloat(t), e.volume = parseFloat(n)) : (e.playbackRate = 1, e.volume = 1)
                }(l), console.log("metadata loaded:", l.duration, l.currentSrc, o())) : console.log("called outside of PiP somehow")
            },
            firstLoadedHandler: function (e) {
                r() === t.YOUTUBE && o() && i(e)
            }
        }
    },
    52: e => {
        e.exports = {
            controlStyles: '\n    body {background-color: #000;\n        margin: 0;\n    }\n\n    .video-wrapper {\n        display: flex;\n        height: 100%;\n    }\n\n    .video-wrapper video {\n        width: 100% !important;\n        height: auto !important;\n    }\n\n    .video-wrapper video.almost-perfect {\n        object-fit: fill;\n    }\n\n    #pipController {\n        position: fixed;\n        opacity: 0;\n        background: transparent;\n        font-family: sans-serif;\n        color: white;\n        border-radius: 4px;\n        padding: 3px 5px 0;\n        margin: 0;\n        z-index: 9999999;\n        box-sizing: border-box;\n        bottom: 0;\n        left: 0;\n        width: 100%;\n        transition: opacity 0.2s cubic-bezier(0, 0, 0.2, 1);\n    }\n\n    body:hover #pipController {\n        opacity: 1;\n    }\n\n    .noselect {\n        -webkit-tap-highlight-color: transparent;\n        -webkit-touch-callout: none;\n        -webkit-user-select: none;\n        -khtml-user-select: none;\n        -moz-user-select: none;\n        -ms-user-select: none;\n        user-select: none;\n    }\n    .noselect:focus {\n        outline: none !important;\n    }\n\n    #pipController .controls {\n        display: flex;\n        line-height: 1.8em;\n        font-family: sans-serif;\n        font-size: 13px;\n        user-select: none;\n        align-items: center;\n        gap: 8px;\n        flex-direction: column;\n        margin: 8px 2px 4px;\n    }\n\n    #pipController .controls .control-time {\n        font-size: 11px;\n    }\n\n    #pipController .controls .control-time-2 {\n        white-space: pre;\n    }\n\n    #pipController .controls .control-group-time.hidden {\n        display: none !important;\n    }\n\n    #pipController .controls .control-group-time .control-time-2.hidden {\n        display: none !important;\n    }\n\n    #pipController .subtitles {\n        display: flex;\n        align-items: center;\n        justify-content: center;\n        height: 30px;\n        line-height: 15px;\n        user-select: none;\n        text-align: center;\n        width: 100%;\n        overflow: visible !important;\n        text-overflow: ellipsis;\n        white-space: normal;\n        font-size: 13px;\n        font-family: Roboto, "Arial Unicode Ms", Arial, Helvetica, Verdana, "PT Sans Caption", sans-serif;\n        color: #eee;\n    }\n\n    #pipController .subtitles.hidden {\n        display: none;\n    }\n\n    #pipController .controls button {\n        display: flex;\n        border: none;\n        background: none;\n        cursor: pointer;\n        color: #fff;\n        font-weight: normal;\n        padding: 5px;\n        border-radius: 13px;\n        margin: 0;\n        font-size: 16px;\n        font-family: "Lucida Console", Monaco, monospace;\n        transition: color 0.2s;\n        align-items: center;\n        height: unset;\n    }\n\n    #pipController .controls button:hover {\n        background-color: #727272;\n    }\n\n    #pipController .controls .control-row {\n        display: flex;\n        flex-direction: row;\n        width: 100%;\n        align-items: center;\n        gap: calc(1.6%);\n        margin: 0 3px;\n    }\n\n    #pipController .controls .control-row.second-row {\n        margin: 0 2px 0 -2px;\n    }\n\n    #pipController .controls .control-row .control-group {\n        flex-direction: row;\n        margin: 0;\n        gap: 0;\n        align-items: center;\n    }\n\n    #pipController .controls .control-row .control-group:not(.control-group-next) {\n        display: flex;\n    }\n\n    #pipController .controls .control-row .control-group.control-group-next {\n        display: none;\n    }\n\n    #pipController .controls .control-row .control-group.align-right {\n        margin-left: auto;\n    }\n\n    #pipController .draggable {\n        display: flex;\n        margin: 0;\n        font-family: arial, sans-serif;\n        user-select: none;\n    }\n\n    #pipController .draggable svg {\n        height: 16px;\n        width: 16px;\n    }\n\n    #pipController button:hover {\n        color: #fff;\n    }\n\n    #pipController button:active {\n        color: #fff;\n        font-weight: bold;\n    }\n\n    #pipVolume, #pipProgress {\n        height: 3px;\n        outline: none;\n        border: none;\n        margin: 0;\n        width: 100%;\n    }\n\n    #pipVolume {\n        width: 44px !important;\n    }\n\n    #pipProgress {\n        flex-grow: 1\n    }\n\n    #pipController input {\n        cursor: pointer;\n        appearance: none;\n        outline: none;\n        background: linear-gradient( to right, rgba(246, 75, 75, 1) var(--litters-range), rgba(127, 127, 127, 0.86) var(--litters-range));\n    }\n\n    #pipController input.disabled {\n        cursor: default;\n        pointer-events: none;\n    }\n\n    #pipController input::-webkit-slider-thumb {\n        cursor: pointer;\n        appearance: none;\n        width: 8px;\n        height: 8px;\n        background: #eee;\n        border-radius: 50%;\n    }\n\n    .ytp-settings-menu {\n        bottom: 28px;\n        z-index: 70;\n        will-change: width, height;\n        border-radius: 8px;\n        position: absolute;\n        overflow: hidden;\n        border-radius: 10px;\n        background: rgba(28, 28, 28, .85);\n        text-shadow: 0 0 2px rgba(0, 0, 0, .5);\n        -webkit-transition: opacity .1s cubic-bezier(0,0,.2,1);\n        transition: opacity .1s cubic-bezier(0,0,.2,1);\n        -moz-user-select: none;\n        -ms-user-select: none;\n        -webkit-user-select: none;\n        width: 76px;\n        height: 128px;\n    }\n\n    .ytp-settings-menu:not(.show) {\n        display: none;\n    }\n\n    .ytp-panel {\n        position: absolute;\n        bottom: 0;\n        right: 0;\n        overflow-y: auto;\n        overflow-x: hidden;\n        width: 100%;\n        padding: 4px 0;\n    }\n\n    .ytp-menuitem:not([aria-disabled=true]) {\n        cursor: pointer;\n    }\n\n    .ytp-menuitem {\n        display: table-row;\n        cursor: default;\n        outline: none;\n        height: 20px;\n    }\n\n    .ytp-menuitem-label {\n        font-size: 10px;\n        font-weight: 500;\n        padding-left: 0;\n        display: table-cell;\n        vertical-align: middle;\n        padding-left: 28px;\n        padding-right: 15px;\n        border-bottom: none;\n    }\n\n    .ytp-menuitem[aria-checked=true] .ytp-menuitem-label {\n        background-image: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIHZpZXdCb3g9IjAgMCAyNCAyNCIgdmVyc2lvbj0iMS4xIj48cGF0aCBkPSJNOSAxNi4yTDQuOCAxMmwtMS40IDEuNEw5IDE5IDIxIDdsLTEuNC0xLjRMOSAxNi4yeiIgZmlsbD0iI2ZmZiIgLz48L3N2Zz4=);\n        background-repeat: no-repeat;\n        background-position: left 6px center;\n        background-size: 14px 14px;\n        -moz-background-size: 14px 14px;\n        -webkit-background-size: 14px 14px;\n    }\n\n    .ytp-menuitem:not([aria-disabled=true]):hover {\n        background-color: rgba(255, 255, 255, .1);\n    }\n\n    .ytp-gradient-bottom2 {\n        height: 100%;\n        width: 100%;\n        bottom: 0;\n        z-index: 2;\n        background-position: bottom;\n        background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAACSCAYAAACE56BkAAAAAXNSR0IArs4c6QAAAPVJREFUKFNlyOlHGAAcxvHuY93H1n1fW1v3fbej+zAmI5PIRGYiM5JEEkkiiSSRRPoj83nze9Pz4uPrSUh4tURPEpKDFJWKtCBdZSAzeKOykB3kqFzkBfmqAIVBkSrGW7wLSlQpyoJyVYHKoEpVoyaoVXWoDxpUI5qCZtWC98EH1YqPwSfVhvagQ3WiK+hWPegN+lQ/BoJBNYRhjASjagzjwYSaxOfgi/qKb8GUmsZMMKvmMB8sqEUsYRnf8QMr+IlV/MIa1rGB39jEFv7gL7axg3/4j13sYR8HOMQRjnGCU5zhHBe4xBWucYNb3OEeD3jEE55fAOe7I9q0+rDDAAAAAElFTkSuQmCC");\n        position: absolute;\n        background-repeat: repeat-x;\n        transition: opacity .25s cubic-bezier(0,0,.2,1);\n        pointer-events: none;\n        opacity: 0;\n    }\n\n    body:hover .ytp-gradient-bottom2 {\n        opacity: 0.95;\n    }\n'
        }
    },
    748: e => {
        const t = "pip_fve_",
            n = "pip_from_script_",
            o = "pip_from_content_";

        function i(e, t) {
            return e + "#" + t
        }

        function r(e, t) {
            new MutationObserver((function (n, o) {
                let i = document.documentElement.getAttribute(e);
                if (i) {
                    document.documentElement.removeAttribute(e);
                    let [n, o] = function (e) {
                        return e.split("#")
                    }(i);
                    t(n, o)
                }
            })).observe(document.documentElement, {
                attributeFilter: [e]
            })
        }

        function l(e, t) {
            document.documentElement.setAttribute(e, t)
        }
        e.exports = {
            listenToScript: function (e) {
                r(n, e)
            },
            listenToContent: function (e) {
                r(o, e)
            },
            sendFromScript: function (e, t = "") {
                let o = i(e, t);
                l(n, o)
            },
            sendFromContent: function (e, t = "") {
                let n = i(e, t);
                l(o, n)
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
                    let i = Object.keys(e);
                    for (let n of i) {
                        if (!n.startsWith(t)) continue;
                        let i = n.substring(8),
                            r = e[n].newValue;
                        void 0 !== r && o(i, r)
                    }
                }(n, o, e)))
            },
            setDocAttribute: l,
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
};
var t = {};

function n(o) {
    var i = t[o];
    if (void 0 !== i) return i.exports;
    var r = t[o] = {
        exports: {}
    };
    return e[o](r, r.exports, n), r.exports
}

(async () => {
    const e = n(944),
        t = n(748),
        o = n(52),
        i = n(464);
    let r, l, a = null,
        s = null,
        c = {
            speedupYoutubeAds: !1,
            height: 225,
            width: 400
        };

    function d(e, t) {
        e && (e.innerHTML = escapeHTMLPolicy.createHTML(t))
    }

    function u(e) {
        return e.document.querySelector("video")
    }

    function p(e) {
        const t = u(e);
        t && (t.paused ? t.play() : t.pause())
    }

    function m(e) {
        return e.document.querySelector(".ytp-settings-menu")
    }

    function g(e, t) {
        return Math.abs(e - t) < 1e-6
    }

    function h(e, t) {
        ! function (e) {
            let t = e.document.querySelector('[aria-checked="true"]');
            t && t.setAttribute("aria-checked", "false")
        }(e);
        let n = 2;
        g(t, .5) ? n = 0 : g(t, .75) ? n = 1 : g(t, 1) ? n = 2 : g(t, 1.25) ? n = 3 : g(t, 1.5) ? n = 4 : g(t, 2) && (n = 5), Array.from(e.document.querySelectorAll(".ytp-menuitem"))[n].setAttribute("aria-checked", "true")
    }

    function f() {
        return !!window.location.href.match(/https:\/\/.+\.netflix\.com\//)
    }

    function v(e) {
        document.documentElement.setAttribute("seeking", !0);
        var t, n, o = Math.floor(1e3 * parseFloat(e)),
            i = (n = (t = window.netflix.appContext.state.playerApp.getAPI().videoPlayer).getAllPlayerSessionIds()[0], t.getVideoPlayerBySessionId(n));
        i.seek(i.getCurrentTime() + o), document.documentElement.removeAttribute("seeking")
    }

    function y(e) {
        if ((e = documentPictureInPicture.window).innerWidth * r > e.innerHeight * l) {
            let t = Math.floor(e.innerHeight * l / r + .5),
                n = e.innerWidth;
            e.resizeBy(t - n, 0)
        } else if (e.innerWidth * r < e.innerHeight * l) {
            let t = Math.floor(e.innerWidth * r / l + .5),
                n = e.innerHeight;
            e.resizeBy(0, t - n)
        } else console.log("already perfect. nothing to do")
    }

    function w(e) {
        let t = e.value + "%";
        e.style.setProperty("--litters-range", t)
    }

    function b(e) {
        return document.body.hasAttribute("data-duration") ? parseFloat(document.body.getAttribute("data-duration")) : e.duration
    }

    function x(e) {
        f() ? function (e) {
            u(e) && v(-10)
        }(e) : function (e) {
            const t = u(e);
            t && (t.currentTime = t.currentTime - 10)
        }(e)
    }

    function C(e) {
        f() ? function (e) {
            u(e) && v(10)
        }(e) : function (e) {
            const t = u(e);
            t && (t.currentTime = t.currentTime + 10)
        }(e)
    }

    function S(e, t, n) {
        if (e.document.querySelector("#pipController")) return;
        let o = e.document.createElement("div");
        o.id = "pipController", d(o, i.PLAYBACK_CONTROLS);
        let r = e.document.createElement("div");
        d(r, i.SPEED_CONTROLS), o.append(r), t.append(o);
        let l = e.document.createElement("div");
        l.classList.add("ytp-gradient-bottom2"), t.append(l), e.document.querySelector('button[data-action="play"]').addEventListener("click", (() => {
            p(e)
        })), e.document.querySelector('button[data-action="rewind"]').addEventListener("click", (() => {
            x(e)
        })), e.document.querySelector('button[data-action="forward"]').addEventListener("click", (() => {
            C(e)
        }));
        let a = function (e) {
            return e.document.body.querySelector('#pipController button[data-action="speed"]')
        }(e);
        a.addEventListener("click", (t => {
            ! function (e, t) {
                let n = u(e).playbackRate,
                    o = m(e);
                if (o.classList.contains("show")) o.classList.remove("show");
                else {
                    o.classList.add("show");
                    let i = t.target.getBoundingClientRect();
                    o.style.left = i.left - 5 + "px", o.focus(), h(e, n)
                }
            }(e, t)
        })), e.document.querySelector('button[data-action="next"]').addEventListener("click", (() => {
            ! function () {
                let e = document.querySelector(".ytp-next-button.ytp-button");
                e && e.click()
            }()
        })), e.document.querySelector('button[data-action="mute"]').addEventListener("click", (() => {
            ! function (e) {
                const t = u(e);
                t && (t.muted = !t.muted)
            }(e)
        })), e.document.querySelector('button[data-action="crop"]').addEventListener("click", (() => {
            y(e)
        })), e.document.querySelector("#pipVolume").addEventListener("input", (t => {
            let n = parseInt(t.target.value);
            ! function (e, t) {
                const n = u(e);
                n && (n.volume = t)
            }(e, n / 100), w(t.target)
        })), e.document.querySelector("#pipProgress").addEventListener("input", (t => {
            let n = parseFloat(t.target.value) / 100;
            f() ? function (e, t) {
                const n = u(e);
                n && function (e) {
                    document.documentElement.setAttribute("seeking", !0);
                    var t, n, o = Math.floor(1e3 * parseFloat(e));
                    (t = window.netflix.appContext.state.playerApp.getAPI().videoPlayer, n = t.getAllPlayerSessionIds()[0], t.getVideoPlayerBySessionId(n)).seek(o), setTimeout((() => {
                        document.documentElement.removeAttribute("seeking")
                    }), 500)
                }(Math.floor(n.duration * t + .5))
            }(e, n) : function (e, t) {
                const n = u(e);
                n && (n.currentTime = Math.floor(b(n) * t + .5))
            }(e, n)
        })), e.document.querySelectorAll(".ytp-menuitem").forEach((t => {
            t.addEventListener("click", (t => {
                ! function (e, t) {
                    let n = t.target.textContent,
                        o = 1;
                    "normal" !== n.toLowerCase() && (o = parseFloat(n)), u(e).playbackRate = o, h(e, o);
                    let i = m(e);
                    i && i.classList.contains("show") && setTimeout((() => {
                        i.classList.remove("show")
                    }), 300)
                }(e, t)
            }))
        }));
        let s = e.document.querySelector(".ytp-settings-menu");
        s.addEventListener("blur", (e => {
            e.currentTarget.contains(e.relatedTarget) || a.parentElement.contains(e.relatedTarget) || s.classList.contains("show") && s.classList.remove("show")
        })), n.addEventListener("click", (() => {
            p(e)
        }))
    }

    function A(e) {
        return !e.paused
    }

    function L() {
        a && (clearInterval(a), a = null)
    }

    function E(e) {
        try {
            let t = new Date(1e3 * e).toISOString().substr(11, 8);
            return t = t.replace(/^00:/, "").replace(/^0/, ""), t
        } catch (e) {
            return ""
        }
    }

    function k(e, t, n) {
        u(e) && (37 === n ? x(e) : 39 === n ? C(e) : 38 === n ? function (e) {
            const t = u(e);
            if (!t) return;
            let n = t.volume + .1;
            n > 1 && (n = 1), t.volume = n
        }(e) : 40 === n ? function (e) {
            const t = u(e);
            if (!t) return;
            let n = t.volume - .1;
            n < 0 && (n = 0), t.volume = n
        }(e) : 32 === n ? p(e) : 69 === n ? function (e) {
            let t = Math.floor((e.innerWidth + 20) * r / l + .5);
            e.resizeBy(20, t - e.innerHeight)
        }(e) : 83 === n ? function (e) {
            let t = Math.floor((e.innerWidth - 20) * r / l + .5);
            e.resizeBy(-20, t - e.innerHeight)
        }(e) : 67 === n ? y(e) : 80 === n && t && t.altKey && documentPictureInPicture.window && documentPictureInPicture.window.close())
    }

    function M(n) {
        let o = n.target.querySelector("video");
        o.onloadedmetadata = null, s && (s.append(o), s = null), e.exitPiPHandler(n), L(), t.sendFromScript("mouseleave"), window.focus()
    }
    escapeHTMLPolicy = trustedTypes.createPolicy("forceInner", {
        createHTML: e => e
    })

    t.listenToContent(((e, t) => {
        console.log({
            msgKeyStr: e,
            _msgValue: t
        });
        let n = documentPictureInPicture.window;
        n && k(n, null, parseInt(e))
    }))

    {
        c.speedupYoutubeAds = "true" === t.getDocAttribute("speedupYoutubeAds");
        let e = t.getDocAttribute("resize");
        if (e) {
            let [n, o] = t.parseSizeStr(e);
            n && o && (c.height = n, c.width = o)
        }
    }

    {
        if (documentPictureInPicture.window) {
            documentPictureInPicture.window.close();
        } else {
            const n = findLargestPlayingVideo();
            console.log("findLargestPlayingVideo", n);

            if (!n) return;
            s = n.parentElement;
            let p = await documentPictureInPicture.requestWindow({
                height: c.height,
                width: c.width
            });
            l = n.videoWidth, r = n.videoHeight;
            let m = p.document.createElement("div");
            m.classList.add("video-wrapper"), p.document.body.append(m), n.classList.add("noselect"), m.append(n), S(p, m, n),
                function (e, t) {
                    L(), a = setInterval((() => {
                        ! function (e, t) {
                            document.documentElement.hasAttribute("seeking") || function (e, t) {
                                let n = function (e) {
                                    return e.document.body.querySelector('#pipController button[data-action="play"]')
                                }(e);
                                n && (t.playing ? n.classList.contains("pip-play") && (n.classList.remove("pip-play"), n.classList.add("pip-pause"), d(n, i.PAUSE_BUTTON_SVG)) : n.classList.contains("pip-pause") && (n.classList.add("pip-play"), n.classList.remove("pip-pause"), d(n, i.PLAY_BUTTON_SVG)));
                                let o = function (e) {
                                    return e.document.body.querySelector('#pipController button[data-action="mute"]')
                                }(e);
                                o && (t.muted ? o.classList.contains("pip-unmuted") && (o.classList.add("pip-muted"), o.classList.remove("pip-unmuted"), d(o, i.MUTED_BUTTON_SVG)) : o.classList.contains("pip-muted") && (o.classList.add("pip-unmuted"), o.classList.remove("pip-muted"), d(o, i.UNMUTED_BUTTON_SVG)));
                                let r = function (e) {
                                    return e.document.body.querySelector("#pipProgress")
                                }(e);
                                if (r) {
                                    let e = t.currentTime / t.duration,
                                        n = Math.floor(1e3 * e + .5) / 10;
                                    r.value = n, w(r)
                                }
                                let l = function (e) {
                                    return e.document.body.querySelector("#pipController .control-time-1")
                                }(e),
                                    a = function (e) {
                                        return e.document.body.querySelector("#pipController .control-time-2")
                                    }(e);
                                if (l) {
                                    let e = E(t.currentTime);
                                    if (t.duration === 1 / 0) l.textContent = e, a.textContent = "";
                                    else {
                                        let n = E(t.duration);
                                        l.textContent = e, a.textContent = " / " + n
                                    }
                                }
                                let s = function (e) {
                                    return e.document.body.querySelector("#pipVolume")
                                }(e);
                                s && (s.value = 100 * t.volume, w(s))
                            }(e, {
                                playbackRate: t.playbackRate,
                                playing: A(t),
                                muted: t.muted,
                                volume: t.volume,
                                currentTime: t.currentTime,
                                duration: b(t)
                            })
                        }(e, t)
                    }), 200)
                }(p, n);
            const g = document.createElement("style");
            g.textContent = o.controlStyles;
            let h = e.siteStyles();
            h && (g.textContent += "\n" + h), p.document.head.appendChild(g), e.enterPiPHandler(p, m), p.addEventListener("pagehide", M), p.addEventListener("resize", (e => {
                ! function (e) {
                    let n = u(e),
                        o = r / l,
                        i = e.innerHeight / e.innerWidth;
                    Math.abs(o - i) < .005 ? n.classList.add("almost-perfect") : n.classList.remove("almost-perfect");
                    let a = function (e) {
                        return e.document.querySelector("#pipController")
                    }(e),
                        s = function (e) {
                            return e.document.querySelector(".ytp-gradient-bottom2")
                        }(e),
                        c = e.innerWidth;
                    if (e.innerWidth * r > e.innerHeight * l) c = Math.floor(e.innerHeight * l / r + .5), a.style = `width: ${c}px; left: calc(50% - ${c / 2}px);`, s.style = `width: ${c}px; left: calc(50% - ${c / 2}px);`;
                    else if (e.innerWidth * r < e.innerHeight * l) {
                        let t = Math.floor(e.innerWidth * r / l + .5);
                        a.style = `bottom: calc(50% - ${t / 2}px);`, s.style = `height: ${t}px; bottom: calc(50% - ${t / 2}px);`
                    }
                    let d = e.document.querySelector(".control-group-time .control-time-2"),
                        p = e.document.querySelector(".control-group-time");
                    c < 320 ? d.classList.add("hidden") : d.classList.remove("hidden"), c < 280 ? p.classList.add("hidden") : p.classList.remove("hidden"), t.sendFromScript("resize", t.getSizeStr(e.innerHeight, e.innerWidth))
                }(p)
            })), p.addEventListener("keydown", (e => {
                e.preventDefault(), k(p, e, e.keyCode)
            })), p.document.addEventListener("mouseenter", (() => {
                t.sendFromScript("mouseenter")
            })), p.document.addEventListener("mouseleave", (() => {
                t.sendFromScript("mouseleave")
            })), n.onloadedmetadata = t => {
                e.metadataLoadedHandler(t, c)
            }
        }
    }
})();