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


var PLAYBACK_CONTROLS = `
<span class="subtitles">
</span>
<div class="controls">
    <div class="control-row">
        <input id="pipProgress" type="range" min="0" max="100" step="0.1" />
    </div>
    <div class="control-row second-row">
        <div class="control-group">
            <button data-action="play" title="Play / Pause (␣)" class="pip-play noselect">
                <svg width="13" height="13" viewBox="6 6 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M15 12.3301L9 16.6603L9 8L15 12.3301Z" fill="#fff" />
                </svg>
            </button>
        </div>
        <div class="control-group control-group-rewind">
            <button data-action="rewind" title="Rewind (←)" class="noselect">
                <svg xmlns="http://www.w3.org/2000/svg" fill="#fff" width="13" height="13" viewBox="0 0 24 24" role="img" aria-hidden="true">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M11.0198 2.04817C13.3222 1.8214 15.6321 2.39998 17.5557 3.68532C19.4794 4.97066 20.8978 6.88324 21.5694 9.09717C22.241 11.3111 22.1242 13.6894 21.2388 15.8269C20.3534 17.9643 18.7543 19.7286 16.714 20.8192C14.6736 21.9098 12.3182 22.2592 10.0491 21.8079C7.77999 21.3565 5.73759 20.1323 4.26989 18.3439C2.80219 16.5555 2 14.3136 2 12L0 12C-2.74181e-06 14.7763 0.962627 17.4666 2.72387 19.6127C4.48511 21.7588 6.93599 23.2278 9.65891 23.7694C12.3818 24.3111 15.2083 23.8918 17.6568 22.5831C20.1052 21.2744 22.0241 19.1572 23.0866 16.5922C24.149 14.0273 24.2892 11.1733 23.4833 8.51661C22.6774 5.85989 20.9752 3.56479 18.6668 2.02238C16.3585 0.479973 13.5867 -0.214321 10.8238 0.0578004C8.71195 0.265799 6.70517 1.02858 5 2.2532V1H3V5C3 5.55228 3.44772 6 4 6H8V4H5.99999C7.45608 2.90793 9.19066 2.22833 11.0198 2.04817ZM2 4V7H5V9H1C0.447715 9 0 8.55228 0 8V4H2ZM14.125 16C13.5466 16 13.0389 15.8586 12.6018 15.5758C12.1713 15.2865 11.8385 14.8815 11.6031 14.3609C11.3677 13.8338 11.25 13.2135 11.25 12.5C11.25 11.7929 11.3677 11.1758 11.6031 10.6488C11.8385 10.1217 12.1713 9.71671 12.6018 9.43388C13.0389 9.14463 13.5466 9 14.125 9C14.7034 9 15.2077 9.14463 15.6382 9.43388C16.0753 9.71671 16.4116 10.1217 16.6469 10.6488C16.8823 11.1758 17 11.7929 17 12.5C17 13.2135 16.8823 13.8338 16.6469 14.3609C16.4116 14.8815 16.0753 15.2865 15.6382 15.5758C15.2077 15.8586 14.7034 16 14.125 16ZM14.125 14.6501C14.5151 14.6501 14.8211 14.4637 15.043 14.0909C15.2649 13.7117 15.3759 13.1814 15.3759 12.5C15.3759 11.8186 15.2649 11.2916 15.043 10.9187C14.8211 10.5395 14.5151 10.3499 14.125 10.3499C13.7349 10.3499 13.4289 10.5395 13.207 10.9187C12.9851 11.2916 12.8741 11.8186 12.8741 12.5C12.8741 13.1814 12.9851 13.7117 13.207 14.0909C13.4289 14.4637 13.7349 14.6501 14.125 14.6501ZM8.60395 15.8554V10.7163L7 11.1405V9.81956L10.1978 9.01928V15.8554H8.60395Z" fill="currentColor" />
                </svg>
            </button>
        </div>
        <div class="control-group control-group-forward">
            <button data-action="forward" title="Forward (→)" class="noselect">
                <svg xmlns="http://www.w3.org/2000/svg" fill="#fff" width="13" height="13" viewBox="0 0 24 24" role="img" aria-hidden="true">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M6.4443 3.68532C8.36795 2.39998 10.6778 1.8214 12.9802 2.04817C14.8093 2.22833 16.5439 2.90793 18 4H16V6H20C20.5523 6 21 5.55229 21 5V1H19V2.2532C17.2948 1.02859 15.2881 0.2658 13.1762 0.057802C10.4133 -0.214319 7.64154 0.479975 5.33316 2.02238C3.02478 3.56479 1.32262 5.85989 0.516718 8.51661C-0.289188 11.1733 -0.148981 14.0273 0.913451 16.5922C1.97588 19.1572 3.8948 21.2744 6.34325 22.5831C8.79169 23.8918 11.6182 24.3111 14.3411 23.7694C17.064 23.2278 19.5149 21.7588 21.2761 19.6127C23.0374 17.4666 24 14.7763 24 12L22 12C22 14.3136 21.1978 16.5555 19.7301 18.3439C18.2624 20.1323 16.22 21.3565 13.9509 21.8079C11.6818 22.2592 9.32641 21.9098 7.28604 20.8192C5.24567 19.7286 3.64657 17.9643 2.76121 15.8269C1.87585 13.6894 1.75901 11.3111 2.4306 9.09718C3.10219 6.88324 4.52065 4.97067 6.4443 3.68532ZM22 4V7H19V9H23C23.5523 9 24 8.55229 24 8V4H22ZM12.6018 15.5758C13.0389 15.8586 13.5466 16 14.125 16C14.7034 16 15.2078 15.8586 15.6382 15.5758C16.0753 15.2865 16.4116 14.8815 16.6469 14.3609C16.8823 13.8338 17 13.2135 17 12.5C17 11.7929 16.8823 11.1759 16.6469 10.6488C16.4116 10.1217 16.0753 9.71671 15.6382 9.43389C15.2078 9.14463 14.7034 9 14.125 9C13.5466 9 13.0389 9.14463 12.6018 9.43389C12.1713 9.71671 11.8385 10.1217 11.6031 10.6488C11.3677 11.1759 11.25 11.7929 11.25 12.5C11.25 13.2135 11.3677 13.8338 11.6031 14.3609C11.8385 14.8815 12.1713 15.2865 12.6018 15.5758ZM15.043 14.0909C14.8211 14.4637 14.5151 14.6501 14.125 14.6501C13.7349 14.6501 13.429 14.4637 13.207 14.0909C12.9851 13.7117 12.8741 13.1814 12.8741 12.5C12.8741 11.8186 12.9851 11.2916 13.207 10.9187C13.429 10.5395 13.7349 10.3499 14.125 10.3499C14.5151 10.3499 14.8211 10.5395 15.043 10.9187C15.2649 11.2916 15.3759 11.8186 15.3759 12.5C15.3759 13.1814 15.2649 13.7117 15.043 14.0909ZM8.60395 10.7163V15.8554H10.1978V9.01929L7 9.81956V11.1405L8.60395 10.7163Z" />
                </svg>
            </button>
        </div>
        <div class="control-group control-group-speed">
            <button data-action="speed" title="Playback speed" class="noselect">
                <svg xmlns="http://www.w3.org/2000/svg" fill="#fff" width="13" height="13" viewBox="0 0 20 20" enable-background="new 0 0 20 20" xml:space="preserve">
                    <path d="M10,20C4.5,20,0,15.5,0,10S4.5,0,10,0s10,4.5,10,10S15.5,20,10,20z M10,2c-4.4,0-8,3.6-8,8s3.6,8,8,8s8-3.6,8-8S14.4,2,10,2z"/>
                    <path d="M8.6,11.4c-0.8-0.8-2.8-5.7-2.8-5.7s4.9,2,5.7,2.8c0.8,0.8,0.8,2,0,2.8C10.6,12.2,9.4,12.2,8.6,11.4z"/>
                </svg>
            </button>
        </div>
        <div class="control-group control-group-next">
            <button data-action="next" title="Next video">
                <svg width="13" height="13" viewBox="10 10 16 16" xmlns="http://www.w3.org/2000/svg">
                    <path class="ytp-svg-fill" d="M 12,24 20.5,18 12,12 V 24 z M 22,12 v 12 h 2 V 12 h -2 z" fill="#fff" />
                </svg>
            </button>
        </div>
        <div class="control-group">
            <button data-action="mute" title="Mute / Unmute" class="pip-unmuted noselect">
                <svg width="13" height="13" fill="#fff" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M16 21c3.527-1.547 5.999-4.909 5.999-9S19.527 4.547 16 3v2c2.387 1.386 3.999 4.047 3.999 7S18.387 17.614 16 19v2z"/><path d="M16 7v10c1.225-1.1 2-3.229 2-5s-.775-3.9-2-5zM4 17h2.697L14 21.868V2.132L6.697 7H4c-1.103 0-2 .897-2 2v6c0 1.103.897 2 2 2z"/>
                </svg>
            </button>
            <input id="pipVolume" type="range" min="0" max="100" />
        </div>
        <div class="control-group align-right">
            <button data-action="crop" title="Remove borders (C)" class="noselect">
                <svg width="13" height="13" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" fill="none">
                    <path fill="#fff" fill-rule="evenodd" d="M5.5 2a1 1 0 00-2 0v2H2a1 1 0 000 2h12v7h2V5a1 1 0 00-1-1H5.5V2zm-2 5v8a1 1 0 001 1H14v2a1 1 0 102 0v-2h2a1 1 0 100-2H5.5V7h-2z"/>
                </svg>
            </button>
        </div>
        <div class="control-group control-group-time">
            <div class="control-time control-time-1"></div>
            <div class="control-time control-time-2"></div>
        </div>
    </div>
</div>
`
var SPEED_CONTROLS = `
<div class="ytp-settings-menu" data-layer="6" id="ytp-id-18" tabindex="0">
    <div class="ytp-panel">
        <div class="ytp-panel-menu" role="menu">
            <div class="ytp-menuitem ytp-drc-menu-item" role="menuitemcheckbox" aria-checked="false" tabindex="0">
                <div class="ytp-menuitem-label">0.5</div>
            </div>
            <div class="ytp-menuitem" aria-haspopup="true" role="menuitem" tabindex="0" aria-checked="false">
                <div class="ytp-menuitem-label">0.75</div>
            </div>
            <div class="ytp-menuitem" aria-haspopup="true" role="menuitem" tabindex="0" aria-checked="true">
                <div class="ytp-menuitem-label">Normal</div>
            </div>
            <div class="ytp-menuitem" aria-haspopup="true" role="menuitem" tabindex="0" aria-checked="false">
                <div class="ytp-menuitem-label">1.25</div>
            </div>
            <div class="ytp-menuitem" aria-haspopup="true" role="menuitem" tabindex="0" aria-checked="false">
                <div class="ytp-menuitem-label">1.5</div>
            </div>
            <div class="ytp-menuitem" aria-haspopup="true" role="menuitem" tabindex="0" aria-checked="false">
                <div class="ytp-menuitem-label">2.0</div>
            </div>
        </div>
    </div>
</div>
`

var PLAY_BUTTON_SVG = `<svg width="13" height="13" viewBox="6 6 12 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M15 12.3301L9 16.6603L9 8L15 12.3301Z" fill="#fff" /></svg>`
var PAUSE_BUTTON_SVG = `<svg width="13" height="13" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"><path fill="#fff" d="M120.16 45A20.162 20.162 0 0 0 100 65.16v381.68A20.162 20.162 0 0 0 120.16 467h65.68A20.162 20.162 0 0 0 206 446.84V65.16A20.162 20.162 0 0 0 185.84 45h-65.68zm206 0A20.162 20.162 0 0 0 306 65.16v381.68A20.162 20.162 0 0 0 326.16 467h65.68A20.162 20.162 0 0 0 412 446.84V65.16A20.162 20.162 0 0 0 391.84 45h-65.68z"/></svg>`
var UNMUTED_BUTTON_SVG = `<svg width="13" height="13" fill="#fff" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M16 21c3.527-1.547 5.999-4.909 5.999-9S19.527 4.547 16 3v2c2.387 1.386 3.999 4.047 3.999 7S18.387 17.614 16 19v2z"/><path d="M16 7v10c1.225-1.1 2-3.229 2-5s-.775-3.9-2-5zM4 17h2.697L14 21.868V2.132L6.697 7H4c-1.103 0-2 .897-2 2v6c0 1.103.897 2 2 2z"/></svg>`
var MUTED_BUTTON_SVG = `<svg width="13" height="13" fill="#fff" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M16 7v10M4 17h2.697L14 21.868V2.132L6.697 7H4c-1.103 0-2 .897-2 2v6c0 1.103.897 2 2 2z"/></svg>`

var CONTROLER_STYLES = `
body {background-color: #000;
    margin: 0;
}

.video-wrapper {
    display: flex;
    height: 100%;
}

.video-wrapper video {
    width: 100% !important;
    height: auto !important;
}

.video-wrapper video.almost-perfect {
    object-fit: fill;
}

#pipController {
    position: fixed;
    opacity: 0;
    background: transparent;
    font-family: sans-serif;
    color: white;
    border-radius: 4px;
    padding: 3px 5px 0;
    margin: 0;
    z-index: 9999999;
    box-sizing: border-box;
    bottom: 0;
    left: 0;
    width: 100%;
    transition: opacity 0.2s cubic-bezier(0, 0, 0.2, 1);
}

body:hover #pipController {
    opacity: 1;
}

.noselect {
    -webkit-tap-highlight-color: transparent;
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
}
.noselect:focus {
    outline: none !important;
}

#pipController .controls {
    display: flex;
    line-height: 1.8em;
    font-family: sans-serif;
    font-size: 13px;
    user-select: none;
    align-items: center;
    gap: 8px;
    flex-direction: column;
    margin: 8px 2px 4px;
}

#pipController .controls .control-time {
    font-size: 11px;
}

#pipController .controls .control-time-2 {
    white-space: pre;
}

#pipController .controls .control-group-time.hidden {
    display: none !important;
}

#pipController .controls .control-group-time .control-time-2.hidden {
    display: none !important;
}

#pipController .subtitles {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 30px;
    line-height: 15px;
    user-select: none;
    text-align: center;
    width: 100%;
    overflow: visible !important;
    text-overflow: ellipsis;
    white-space: normal;
    font-size: 13px;
    font-family: Roboto, "Arial Unicode Ms", Arial, Helvetica, Verdana, "PT Sans Caption", sans-serif;
    color: #eee;
}

#pipController .subtitles.hidden {
    display: none;
}

#pipController .controls button {
    display: flex;
    border: none;
    background: none;
    cursor: pointer;
    color: #fff;
    font-weight: normal;
    padding: 5px;
    border-radius: 13px;
    margin: 0;
    font-size: 16px;
    font-family: "Lucida Console", Monaco, monospace;
    transition: color 0.2s;
    align-items: center;
    height: unset;
}

#pipController .controls button:hover {
    background-color: #727272;
}

#pipController .controls .control-row {
    display: flex;
    flex-direction: row;
    width: 100%;
    align-items: center;
    gap: calc(1.6%);
    margin: 0 3px;
}

#pipController .controls .control-row.second-row {
    margin: 0 2px 0 -2px;
}

#pipController .controls .control-row .control-group {
    flex-direction: row;
    margin: 0;
    gap: 0;
    align-items: center;
}

#pipController .controls .control-row .control-group:not(.control-group-next) {
    display: flex;
}

#pipController .controls .control-row .control-group.control-group-next {
    display: none;
}

#pipController .controls .control-row .control-group.align-right {
    margin-left: auto;
}

#pipController .draggable {
    display: flex;
    margin: 0;
    font-family: arial, sans-serif;
    user-select: none;
}

#pipController .draggable svg {
    height: 16px;
    width: 16px;
}

#pipController button:hover {
    color: #fff;
}

#pipController button:active {
    color: #fff;
    font-weight: bold;
}

#pipVolume, #pipProgress {
    height: 3px;
    outline: none;
    border: none;
    margin: 0;
    width: 100%;
}

#pipVolume {
    width: 44px !important;
}

#pipProgress {
    flex-grow: 1
}

#pipController input {
    cursor: pointer;
    appearance: none;
    outline: none;
    background: linear-gradient( to right, rgba(246, 75, 75, 1) var(--litters-range), rgba(127, 127, 127, 0.86) var(--litters-range));
}

#pipController input.disabled {
    cursor: default;
    pointer-events: none;
}

#pipController input::-webkit-slider-thumb {
    cursor: pointer;
    appearance: none;
    width: 8px;
    height: 8px;
    background: #eee;
    border-radius: 50%;
}

.ytp-settings-menu {
    bottom: 28px;
    z-index: 70;
    will-change: width, height;
    border-radius: 8px;
    position: absolute;
    overflow: hidden;
    border-radius: 10px;
    background: rgba(28, 28, 28, .85);
    text-shadow: 0 0 2px rgba(0, 0, 0, .5);
    -webkit-transition: opacity .1s cubic-bezier(0,0,.2,1);
    transition: opacity .1s cubic-bezier(0,0,.2,1);
    -moz-user-select: none;
    -ms-user-select: none;
    -webkit-user-select: none;
    width: 76px;
    height: 128px;
}

.ytp-settings-menu:not(.show) {
    display: none;
}

.ytp-panel {
    position: absolute;
    bottom: 0;
    right: 0;
    overflow-y: auto;
    overflow-x: hidden;
    width: 100%;
    padding: 4px 0;
}

.ytp-menuitem:not([aria-disabled=true]) {
    cursor: pointer;
}

.ytp-menuitem {
    display: table-row;
    cursor: default;
    outline: none;
    height: 20px;
}

.ytp-menuitem-label {
    font-size: 10px;
    font-weight: 500;
    padding-left: 0;
    display: table-cell;
    vertical-align: middle;
    padding-left: 28px;
    padding-right: 15px;
    border-bottom: none;
}

.ytp-menuitem[aria-checked=true] .ytp-menuitem-label {
    background-image: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIHZpZXdCb3g9IjAgMCAyNCAyNCIgdmVyc2lvbj0iMS4xIj48cGF0aCBkPSJNOSAxNi4yTDQuOCAxMmwtMS40IDEuNEw5IDE5IDIxIDdsLTEuNC0xLjRMOSAxNi4yeiIgZmlsbD0iI2ZmZiIgLz48L3N2Zz4=);
    background-repeat: no-repeat;
    background-position: left 6px center;
    background-size: 14px 14px;
    -moz-background-size: 14px 14px;
    -webkit-background-size: 14px 14px;
}

.ytp-menuitem:not([aria-disabled=true]):hover {
    background-color: rgba(255, 255, 255, .1);
}

.ytp-gradient-bottom2 {
    height: 100%;
    width: 100%;
    bottom: 0;
    z-index: 2;
    background-position: bottom;
    background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAACSCAYAAACE56BkAAAAAXNSR0IArs4c6QAAAPVJREFUKFNlyOlHGAAcxvHuY93H1n1fW1v3fbej+zAmI5PIRGYiM5JEEkkiiSSRRPoj83nze9Pz4uPrSUh4tURPEpKDFJWKtCBdZSAzeKOykB3kqFzkBfmqAIVBkSrGW7wLSlQpyoJyVYHKoEpVoyaoVXWoDxpUI5qCZtWC98EH1YqPwSfVhvagQ3WiK+hWPegN+lQ/BoJBNYRhjASjagzjwYSaxOfgi/qKb8GUmsZMMKvmMB8sqEUsYRnf8QMr+IlV/MIa1rGB39jEFv7gL7axg3/4j13sYR8HOMQRjnGCU5zhHBe4xBWucYNb3OEeD3jEE55fAOe7I9q0+rDDAAAAAElFTkSuQmCC");
    position: absolute;
    background-repeat: repeat-x;
    transition: opacity .25s cubic-bezier(0,0,.2,1);
    pointer-events: none;
    opacity: 0;
}

body:hover .ytp-gradient-bottom2 {
    opacity: 0.95;
}
`

var YOUTUBE_STYLE = `    
#pipController .controls .control-row .control-group.control-group-next {
    display: flex !important;
}

.ytp-caption-window-container {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    pointer-events: none;
}

.caption-window {
    position: absolute;
    line-height: normal;
    z-index: 40;
    pointer-events: auto;
    cursor: move;
    cursor: -webkit-grab;
    cursor: grab;
    -moz-user-select: none;
    -ms-user-select: none;
    -webkit-user-select: none;
}

body:hover .caption-window.ytp-caption-window-bottom {
    margin-bottom: 49px;
    overflow-wrap: normal;
    display: block;
}

.ytp-caption-segment {
    font-size: max(3.2vw, 12px) !important;
}

.ytp-caption-window-bottom .caption-visual-line:not(:nth-last-child(2)):not(:last-child) {
    display: none !important;
}
`

var NETFLIX_STYLE = `
body:hover .player-timedtext {
    margin-bottom: 49px;
}
`
var ART_STYLE = `

.art-subtitle {
    opacity: 1!important;
    display: block !important;
    align-items: center;
    justify-content: center;
    user-select: none;
    text-align: center;
    width: 100%;
    overflow: visible !important;
    text-overflow: ellipsis;
    white-space: normal;
    font-size: 13px;
    color: #eee;
    position: fixed;
    background: transparent;
    font-family: sans-serif;
    color: white;
    border-radius: 4px;
    padding: 0px 5px 0px;
    margin: 0;
    z-index: 9999;
    box-sizing: border-box;
    bottom: 10px;
    left: 0;
    width: 100%;
}
.art-subtitle-line:has(.art-subtitle-english) {
    color: yellow;
}
`

var DISNEY_STYLE = `
.dss-hls-subtitle-overlay {
    width: 100% !important;
    height: 100% !important;
}

.dss-hls-subtitle-overlay .dss-subtitle-renderer-cue-positioning-box {
    width: 100% !important;
    height: auto !important;
    top: auto !important;
    bottom: 0 !important;
}

body:hover .dss-hls-subtitle-overlay .dss-subtitle-renderer-cue-positioning-box {
    margin-bottom: 49px;
}

.dss-hls-subtitle-overlay span.dss-subtitle-renderer-cue {
    font-size: max(2.8vw, 12px) !important;
}
`

var PRIMEVIDEO_STYLE = `
.atvwebplayersdk-captions-overlay {
    font-family: Arial, sans-serif;
}

.atvwebplayersdk-captions-overlay div:has(> p) {
    bottom: 15px !important;
}

body:hover .atvwebplayersdk-captions-overlay p {
    margin-bottom: 49px !important;
}

.atvwebplayersdk-captions-overlay span {
    font-size: max(2.8vw, 12px) !important;
}
`

var TWITCH_STYLE = `
.control-group-rewind, .control-group-forward, .control-group-speed {
    display: none !important;
}
`

var modules = {
    464: e => {
        e.exports = {
            PLAYBACK_CONTROLS: PLAYBACK_CONTROLS,
            SPEED_CONTROLS: SPEED_CONTROLS,
            PLAY_BUTTON_SVG: PLAY_BUTTON_SVG,
            PAUSE_BUTTON_SVG: PAUSE_BUTTON_SVG,
            UNMUTED_BUTTON_SVG: UNMUTED_BUTTON_SVG,
            MUTED_BUTTON_SVG: MUTED_BUTTON_SVG
        }
    },
    944: e => {
        const Site = Object.freeze({
            YOUTUBE: 0,
            NETFLIX: 1,
            DISNEY: 2,
            PRIMEVIDEO: 3,
            TWITCH: 4
        });
        let n = null;

        function isAdShowing() {
            let e = document.querySelector(".html5-video-player");
            return e && e.classList.contains("ad-showing")
        }

        function setControlerValue(e) {
            var t = e.playbackRate
            if (!Math.abs(t - 6.1) < 1e-6) {
                e.setAttribute("oldspeed", e.playbackRate)
                e.setAttribute("oldvolume", e.volume)
                e.playbackRate = 6.1
                e.volume = .2
            }
        }

        function getSite() {
            switch (window.location.hostname) {
                case "www.youtube.com":
                    return Site.YOUTUBE;
                case "www.netflix.com":
                    return Site.NETFLIX;
                case "www.disneyplus.com":
                    return Site.DISNEY;
                case "www.primevideo.com":
                    return Site.PRIMEVIDEO;
                case "www.twitch.tv":
                    return Site.TWITCH;
                default:
                    return null
            }
        }

        function siteStyles() {
            let site = getSite();
            if (site === Site.YOUTUBE) {
                return YOUTUBE_STYLE
            }
            else if (site === Site.NETFLIX) {
                return NETFLIX_STYLE
            }
            else if (site === Site.DISNEY) {
                return DISNEY_STYLE
            }
            else if (site === Site.PRIMEVIDEO) {
                return PRIMEVIDEO_STYLE
            }
            else if (site === Site.TWITCH) {
                return TWITCH_STYLE
            } else {
                return ART_STYLE
            }
        }

        function enterPiPHandler(e, o) {
            let i = getSite();
            if (i === Site.YOUTUBE) {
                let e = document.querySelector(".ytp-caption-window-container");
                e && o.append(e)
            } else if (i === Site.NETFLIX) {
                let e = document.querySelector(".player-timedtext");
                e && o.append(e)
            } else if (i === Site.DISNEY) {
                let t = document.querySelector(".dss-hls-subtitle-overlay");
                t && o.append(t), e.document.querySelector("#pipProgress").classList.add("disabled")
            } else if (i === Site.PRIMEVIDEO) {
                let e = document.querySelectorAll(".atvwebplayersdk-captions-overlay");
                if (e.length) {
                    let t = e[e.length - 1];
                    n = t.parentElement, o.append(t)
                }
            } else if (i === Site.TWITCH) {
                e.document.querySelector("#pipProgress").classList.add("disabled")
            } else {
                let e = document.querySelector(".art-subtitle");
                console.log("PiP:", e)
                e && o.prepend(e)
            }
        }

        function exitPiPHandler(e) {
            let o = getSite();
            if (o === Site.YOUTUBE) {
                let t = document.querySelector(".html5-video-player");
                let n = e.target.querySelector(".ytp-caption-window-container");
                n && t.append(n)
            } else if (o === Site.NETFLIX) {
                let t = e.target.querySelector(".player-timedtext");
                t && document.querySelector('[data-uia="video-canvas"]').children[0].children[0].append(t)
            } else if (o === Site.DISNEY) {
                let t = e.target.querySelector(".dss-hls-subtitle-overlay");
                t && document.querySelector(".btm-media-client").append(t)
            } else if (o === Site.PRIMEVIDEO) {
                let t = e.target.querySelector(".atvwebplayersdk-captions-overlay");
                t && n && (n.append(t), n = null)
            } else if (o === Site.TWITCH) {
                console.log("Twitch")
            } else {
                let t = e.target.querySelector(".art-subtitle");
                console.log("Exit:", t)
                if (t) {
                    document.querySelector(".art-poster").after(t)
                }
            }
        }

        function metadataLoadedHandler(e, n) {
            let l = e.target;
            documentPictureInPicture.window ? getSite() === Site.YOUTUBE && (isAdShowing() ? n.speedupYoutubeAds && setControlerValue(l) : function (e) {
                let t = e.getAttribute("oldspeed"),
                    n = e.getAttribute("oldvolume");
                t ? (console.log({
                    oldSpeed: t,
                    oldVolume: n
                }), e.playbackRate = parseFloat(t), e.volume = parseFloat(n)) : (e.playbackRate = 1, e.volume = 1)
            }(l), console.log("metadata loaded:", l.duration, l.currentSrc, isAdShowing())) : console.log("called outside of PiP somehow")
        }

        function firstLoadedHandler(e) {
            getSite() === Site.YOUTUBE && isAdShowing() && setControlerValue(e)
        }

        e.exports = {
            Site: Site,
            getSite: getSite,
            siteStyles: siteStyles,
            enterPiPHandler: enterPiPHandler,
            exitPiPHandler: exitPiPHandler,
            metadataLoadedHandler: metadataLoadedHandler,
            firstLoadedHandler: firstLoadedHandler
        }
    },
    52: e => {
        e.exports = {
            controlStyles: CONTROLER_STYLES
        }
    },
    748: e => {
        const pip_fve_ = "pip_fve_";
        const pip_from_script_ = "pip_from_script_";
        const pip_from_content_ = "pip_from_content_";

        function formatMessage(e, t) {
            return e + "#" + t
        }

        function observe(e, func) {
            new MutationObserver((function (n, o) {
                let i = document.documentElement.getAttribute(e);
                if (i) {
                    document.documentElement.removeAttribute(e);
                    let [n, o] = function (e) {
                        return e.split("#")
                    }(i);
                    func(n, o)
                }
            })).observe(document.documentElement, {
                attributeFilter: [e]
            })
        }

        function setAttribute(e, t) {
            document.documentElement.setAttribute(e, t)
        }
        e.exports = {
            listenToScript: function (e) {
                observe(pip_from_script_, e)
            },
            listenToContent: function (e) {
                observe(pip_from_content_, e)
            },
            sendFromScript: function (e, t = "") {
                let o = formatMessage(e, t);
                setAttribute(pip_from_script_, o)
            },
            sendFromContent: function (e, t = "") {
                let n = formatMessage(e, t);
                setAttribute(pip_from_content_, n)
            },
            windowMessage: function (e, n = Math.random()) {
                try {
                    e = pip_fve_ + e, chrome.storage.local.set({
                        [e]: n
                    }), chrome.storage.local.remove([e], (() => { }))
                } catch { }
            },
            setStorageChangeHandler: function (e) {
                chrome.storage.onChanged.addListener(((n, o) => function (e, n, o) {
                    if ("local" !== n) return;
                    let i = Object.keys(e);
                    for (let n of i) {
                        if (!n.startsWith(pip_fve_)) continue;
                        let i = n.substring(8),
                            r = e[n].newValue;
                        void 0 !== r && o(i, r)
                    }
                }(n, o, e)))
            },
            setDocAttribute: setAttribute,
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
var loadedModules = {};

function getModule(idx) {
    var m = loadedModules[idx];
    if (m) {
        return m.exports
    }
    m = {
        exports: {}
    };
    loadedModules[idx] = m

    if (modules[idx]) {
        modules[idx](m)
    }

    return m.exports
}

(async () => {
    const subtitleHandler = getModule(944)
    const pipHandler = getModule(748)
    const controlStyles = getModule(52)
    const controlButtonStyles = getModule(464)

    let videoHeight = null;
    let videoWidth = null;
    let intervalTask = null;
    let parentVideo = null;

    let windowConfig = {
        speedupYoutubeAds: false,
        height: 225,
        width: 400
    };

    const escapeHTMLPolicy = trustedTypes.createPolicy("forceInner", {
        createHTML: e => e
    })

    function setHtml(e, html) {
        if (e) {
            e.innerHTML = escapeHTMLPolicy.createHTML(html)
        }
    }

    function getVideo(e) {
        return e.document.querySelector("video")
    }

    function togglePlay(e) {
        const video = getVideo(e);
        if (!video) return;
        if (video.paused) {
            video.play()
        } else {
            video.pause()
        }
    }

    function getSettingsMenu(e) {
        return e.document.querySelector(".ytp-settings-menu")
    }

    function isEqual(e, t) {
        return Math.abs(e - t) < 1e-6
    }

    function checkMenu(e, t) {
        let ariaChecked = e.document.querySelector('[aria-checked="true"]');

        if (ariaChecked) {
            ariaChecked.setAttribute("aria-checked", "false")
        }

        let n = 2;
        if (isEqual(t, .5)) {
            n = 0
        } else if (isEqual(t, .75)) {
            n = 1
        } else if (isEqual(t, 1)) {
            n = 2
        } else if (isEqual(t, 1.25)) {
            n = 3
        } else if (isEqual(t, 1.5)) {
            n = 4
        } else if (isEqual(t, 2)) {
            n = 5
        }
        Array.from(e.document.querySelectorAll(".ytp-menuitem"))[n].setAttribute("aria-checked", "true")
    }

    function isNetflix() {
        return window.location.href.match(/https:\/\/.+\.netflix\.com\//)
    }

    function seekPiP(e) {
        document.documentElement.setAttribute("seeking", 1);
        var t, n, o = Math.floor(1e3 * parseFloat(e));
        t = window.netflix.appContext.state.playerApp.getAPI().videoPlayer;
        n = t.getAllPlayerSessionIds()[0];
        var i = t.getVideoPlayerBySessionId(n);

        i.seek(i.getCurrentTime() + o);
        document.documentElement.removeAttribute("seeking")
    }

    function cropPiP() {
        let window = documentPictureInPicture.window
        if (window.innerWidth * videoHeight > window.innerHeight * videoWidth) {
            let t = Math.floor(window.innerHeight * videoWidth / videoHeight + .5)
            let n = window.innerWidth;
            window.resizeBy(t - n, 0)
        } else if (window.innerWidth * videoHeight < window.innerHeight * videoWidth) {
            let t = Math.floor(window.innerWidth * videoHeight / videoWidth + .5)
            let n = window.innerHeight;
            window.resizeBy(0, t - n)
        } else {
            console.log("already perfect. nothing to do")
        }
    }

    function setSliderValue(e) {
        let t = e.value + "%";
        e.value = t
        e.style.setProperty("--litters-range", t)

        // console.log("setSliderValue:", e)
    }

    function getDuration(e) {
        if (document.body.hasAttribute("data-duration")) {
            return parseFloat(document.body.getAttribute("data-duration"))
        } else {
            return e.duration
        }
    }

    function seekBackward(e) {
        const video = getVideo(e);
        if (!video) return;

        if (isNetflix()) {
            seekPiP(-10)
        } else {
            video.currentTime = video.currentTime - 10
        }
    }

    function seekForward(e) {
        const video = getVideo(e);
        if (!video) return;
        if (isNetflix()) {
            seekPiP(10)
        } else {
            video.currentTime = video.currentTime + 10
        }
    }

    function setupPiP(pipDiv, pipWindow, video) {
        if (pipDiv.document.querySelector("#pipController")) {
            return;
        }

        let pipController = pipDiv.document.createElement("div")
        pipController.id = "pipController"
        setHtml(pipController, controlButtonStyles.PLAYBACK_CONTROLS)

        let speedControler = pipDiv.document.createElement("div")
        setHtml(speedControler, controlButtonStyles.SPEED_CONTROLS)
        pipController.append(speedControler)
        pipWindow.append(pipController)

        let gradientDiv = pipDiv.document.createElement("div")
        gradientDiv.classList.add("ytp-gradient-bottom2")
        pipWindow.append(gradientDiv)

        pipDiv.document.querySelector('button[data-action="play"]').addEventListener("click", () => togglePlay(pipDiv))

        pipDiv.document.querySelector('button[data-action="rewind"]').addEventListener("click", () => seekBackward(pipDiv))

        pipDiv.document.querySelector('button[data-action="forward"]').addEventListener("click", () => seekForward(pipDiv))

        let speedBtn = pipDiv.document.body.querySelector('#pipController button[data-action="speed"]');

        speedBtn.addEventListener("click", (t => {
            let n = getVideo(pipDiv).playbackRate;
            let o = getSettingsMenu(pipDiv);

            if (o.classList.contains("show")) {
                o.classList.remove("show");
            } else {
                o.classList.add("show");
                let i = t.target.getBoundingClientRect();
                o.style.left = i.left - 5 + "px"
                o.focus()
                checkMenu(pipDiv, n)
            }
        }))

        pipDiv.document.querySelector('button[data-action="next"]').addEventListener("click", (() => {
            let e = document.querySelector(".ytp-next-button.ytp-button");
            if (e) {
                e.click()
            }
        }))

        pipDiv.document.querySelector('button[data-action="mute"]').addEventListener("click", (() => {
            const t = getVideo(pipDiv);
            if (t) {
                t.muted = !t.muted
            }
        }))

        pipDiv.document.querySelector('button[data-action="crop"]').addEventListener("click", cropPiP)

        pipDiv.document.querySelector("#pipVolume").addEventListener("input", (t => {
            let volume = parseInt(t.target.value);
            console.log("pipVolume:", volume)
            const video = getVideo(pipDiv);
            if (video) {
                video.volume = volume / 100
            }
            setSliderValue(t.target)
        }))

        pipDiv.document.querySelector("#pipProgress").addEventListener("input", (t => {
            let n = parseFloat(t.target.value) / 100;
            let video = getVideo(pipDiv);
            if (!video) return;
            if (isNetflix()) {
                document.documentElement.setAttribute("seeking", 1);
                let duration = Math.floor(video.duration * n + .5)
                duration = Math.floor(1e3 * parseFloat(duration));
                var videoPlayer = window.netflix.appContext.state.playerApp.getAPI().videoPlayer
                var sessionId = videoPlayer.getAllPlayerSessionIds()[0]
                videoPlayer.getVideoPlayerBySessionId(sessionId).seek(duration)

                setTimeout((() => {
                    document.documentElement.removeAttribute("seeking")
                }), 500)

            } else {
                video.currentTime = Math.floor(getDuration(video) * n + .5)
            }
        }))

        pipDiv.document.querySelectorAll(".ytp-menuitem").forEach((t => {
            t.addEventListener("click", (t => {
                let n = t.target.textContent;
                let o = 1;
                if (n.toLowerCase() !== "normal") {
                    o = parseFloat(n)
                }

                getVideo(pipDiv).playbackRate = o
                checkMenu(pipDiv, o)
                let i = getSettingsMenu(pipDiv);
                if (i && i.classList.contains("show")) {
                    setTimeout((() => {
                        i.classList.remove("show")
                    }), 300)
                }
            }))
        }))

        let settingMenu = pipDiv.document.querySelector(".ytp-settings-menu");
        settingMenu.addEventListener("blur", (e => {
            if (e.currentTarget.contains(e.relatedTarget) || speedBtn.parentElement.contains(e.relatedTarget) || settingMenu.classList.contains("show")) {
                settingMenu.classList.remove("show")
            }
        }))

        video.addEventListener("click", (() => {
            togglePlay(pipDiv)
        }))
    }

    function isPlaying(e) {
        return !e.paused
    }

    function stopInterval() {
        if (intervalTask) {
            clearInterval(intervalTask)
            intervalTask = null
        }
    }

    function formatTime(e) {
        try {
            let t = new Date(1e3 * e).toISOString().substr(11, 8);
            return t = t.replace(/^00:/, "").replace(/^0/, ""), t
        } catch (e) {
            return ""
        }
    }

    function controlEvent(e, t, keyCode) {
        const video = getVideo(e);
        if (!video) return;

        if (37 === keyCode) {
            seekBackward(e)
        } else if (39 === keyCode) {
            seekForward(e)
        } else if (38 === keyCode) {
            let n = video.volume + .1;
            if (n > 1) {
                n = 1
            }
            video.volume = n
        } else if (40 === keyCode) {
            let volume = video.volume - .1;
            if (volume < 0) {
                volume = 0
            }
            video.volume = volume
        } else if (32 === keyCode) {
            togglePlay(e)
        } else if (69 === keyCode) {
            let t = Math.floor((e.innerWidth + 20) * videoHeight / videoWidth + .5);
            e.resizeBy(20, t - e.innerHeight)
        } else if (83 === keyCode) {
            let t = Math.floor((e.innerWidth - 20) * videoHeight / videoWidth + .5);
            e.resizeBy(-20, t - e.innerHeight)
        } else if (67 === keyCode) {
            cropPiP(e)
        } else if (80 === keyCode && video.altKey && documentPictureInPicture.window) {
            documentPictureInPicture.window.close()
        }
    }

    function exitPiP(n) {
        let o = n.target.querySelector("video");
        o.onloadedmetadata = null
        if (parentVideo) {
            parentVideo.append(o)
            parentVideo = null
        }
        subtitleHandler.exitPiPHandler(n)
        stopInterval()
        pipHandler.sendFromScript("mouseleave")
        window.focus()
    }

    pipHandler.listenToContent(((e, t) => {
        console.log({
            msgKeyStr: e,
            _msgValue: t
        });
        let n = documentPictureInPicture.window;
        if (!n) return;
        controlEvent(n, null, parseInt(e))
    }))

    windowConfig.speedupYoutubeAds = "true" === pipHandler.getDocAttribute("speedupYoutubeAds");
    let sizeStr = pipHandler.getDocAttribute("resize");
    if (sizeStr) {
        let [n, o] = pipHandler.parseSizeStr(sizeStr);
        if (n && o) {
            windowConfig.height = n
            windowConfig.width = o
        }
    }

    if (documentPictureInPicture.window) {
        documentPictureInPicture.window.close();
    } else {
        const video = findLargestPlayingVideo();
        console.log("findLargestPlayingVideo", video);

        if (!video) {
            return;
        }

        parentVideo = video.parentElement;
        let windowPiP = await documentPictureInPicture.requestWindow({
            height: windowConfig.height,
            width: windowConfig.width
        });
        videoWidth = video.videoWidth
        videoHeight = video.videoHeight

        let videoWrapper = windowPiP.document.createElement("div");
        videoWrapper.classList.add("video-wrapper")
        windowPiP.document.body.append(videoWrapper)

        video.classList.add("noselect")
        videoWrapper.append(video)

        setupPiP(windowPiP, videoWrapper, video)

        stopInterval()
        intervalTask = setInterval(() => {
            if (document.documentElement.hasAttribute("seeking")) return;

            let playBtn = windowPiP.document.body.querySelector('#pipController button[data-action="play"]')
            let state = {
                playbackRate: playBtn.playbackRate,
                playing: isPlaying(playBtn),
                muted: playBtn.muted,
                volume: playBtn.volume,
                currentTime: playBtn.currentTime,
                duration: getDuration(playBtn)
            }

            if (playBtn) {
                if (state.playing) {
                    if (playBtn.classList.contains("pip-play")) {
                        playBtn.classList.remove("pip-play");
                        playBtn.classList.add("pip-pause");
                        setHtml(playBtn, controlButtonStyles.PAUSE_BUTTON_SVG)
                    }
                } else {
                    if (playBtn.classList.contains("pip-pause")) {
                        playBtn.classList.add("pip-play");
                        playBtn.classList.remove("pip-pause");
                        setHtml(playBtn, controlButtonStyles.PLAY_BUTTON_SVG)
                    }
                }
            }

            let muteBtn = windowPiP.document.body.querySelector('#pipController button[data-action="mute"]')
            if (muteBtn) {
                if (state.muted) {
                    if (muteBtn.classList.contains("pip-unmuted")) {
                        muteBtn.classList.add("pip-muted");
                        muteBtn.classList.remove("pip-unmuted");
                        setHtml(muteBtn, controlButtonStyles.MUTED_BUTTON_SVG)
                    }
                } else {
                    if (muteBtn.classList.contains("pip-muted")) {
                        muteBtn.classList.add("pip-unmuted");
                        muteBtn.classList.remove("pip-muted");
                        setHtml(muteBtn, controlButtonStyles.UNMUTED_BUTTON_SVG)
                    }
                }
            }

            let pipProgress = windowPiP.document.body.querySelector("#pipProgress")
            if (pipProgress) {
                let e = state.currentTime / state.duration
                let n = Math.floor(1e3 * e + .5) / 10;
                pipProgress.value = n
                setSliderValue(pipProgress)
            }

            let controlTime1 = windowPiP.document.body.querySelector("#pipController .control-time-1")
            let controlTime2 = windowPiP.document.body.querySelector("#pipController .control-time-2")
            if (controlTime1) {
                let e = formatTime(state.currentTime);
                if (state.duration === 1 / 0) {
                    controlTime1.textContent = e
                    controlTime2.textContent = ""
                } else {
                    let n = formatTime(state.duration);
                    controlTime1.textContent = e
                    controlTime2.textContent = " / " + n
                }
            }

            let pipVolume = windowPiP.document.body.querySelector("#pipVolume")
            if (pipVolume) {
                pipVolume.value = 100 * state.volume
                setSliderValue(pipVolume)
            }
        }, 200)

        const styleEle = document.createElement("style");
        styleEle.textContent = controlStyles.controlStyles;

        let siteStyle = subtitleHandler.siteStyles();
        if (siteStyle) {
            styleEle.textContent += "\n" + siteStyle
        }

        windowPiP.document.head.appendChild(styleEle)
        subtitleHandler.enterPiPHandler(windowPiP, videoWrapper)
        windowPiP.addEventListener("pagehide", exitPiP)

        windowPiP.addEventListener("resize", function (e) {
            let n = getVideo(this)
            let o = videoHeight / videoWidth
            let i = this.innerHeight / this.innerWidth

            if (Math.abs(o - i) < .005) {
                n.classList.add("almost-perfect")
            } else {
                n.classList.remove("almost-perfect")
            }

            let a = this.document.querySelector("#pipController")
            let s = this.document.querySelector(".ytp-gradient-bottom2")

            let c = this.innerWidth
            if (this.innerWidth * videoHeight > this.innerHeight * videoWidth) {
                c = Math.floor(this.innerHeight * videoWidth / videoHeight + .5)
                a.style = `width: ${c}px; left: calc(50 % - ${c / 2}px); `
                s.style = `width: ${c} px; left: calc(50 % - ${c / 2}px); `
            } else if (this.innerWidth * videoHeight < this.innerHeight * videoWidth) {
                let t = Math.floor(this.innerWidth * videoHeight / videoWidth + .5)
                a.style = `bottom: calc(50 % - ${t / 2}px); `
                s.style = `height: ${t} px; bottom: calc(50 % - ${t / 2}px); `
            }

            let d = this.document.querySelector(".control-group-time .control-time-2")
            let q = this.document.querySelector(".control-group-time")

            if (c < 320) {
                d.classList.add("hidden")
            } else {
                d.classList.remove("hidden")
            }

            if (c < 280) {
                q.classList.add("hidden")
            } else {
                q.classList.remove("hidden")
            }

            pipHandler.sendFromScript("resize", pipHandler.getSizeStr(this.innerHeight, this.innerWidth))
        })

        windowPiP.addEventListener("keydown", function (e) {
            e.preventDefault()
            controlEvent(this, e, e.keyCode)
        })

        windowPiP.document.addEventListener("mouseenter", function () {
            pipHandler.sendFromScript("mouseenter")
        })

        windowPiP.document.addEventListener("mouseleave", function () {
            pipHandler.sendFromScript("mouseleave")
        })

        video.onloadedmetadata = function (t) {
            subtitleHandler.metadataLoadedHandler(t, windowConfig)
        }
    }
})();