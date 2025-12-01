const { ipcRenderer } = require('electron');

const video = document.getElementById('videoPlayer');
const loading = document.getElementById('loading');
const error = document.getElementById('error');

let currentVideoPath = '';
let isLooping = false;

function showLoading() {
    loading.style.display = 'block';
    error.style.display = 'none';
}

function hideLoading() {
    loading.style.display = 'none';
}

function showError(message) {
    error.textContent = message;
    error.style.display = 'block';
    loading.style.display = 'none';
}

function hideError() {
    error.style.display = 'none';
}

video.addEventListener('loadstart', () => {
    showLoading();
    hideError();
});

video.addEventListener('canplay', () => {
    hideLoading();
});

video.addEventListener('ended', () => {
    if (!isLooping) {
        video.currentTime = 0;
    }
    ipcRenderer.send('video-ended');
});

video.addEventListener('error', (e) => {
    hideLoading();
    let errorMessage = 'Failed to load video';
    
    if (video.error) {
        switch (video.error.code) {
            case 1:
                errorMessage = 'Video loading aborted';
                break;
            case 2:
                errorMessage = 'Network error occurred';
                break;
            case 3:
                errorMessage = 'Video format not supported';
                break;
            case 4:
                errorMessage = 'Video file not found or corrupted';
                break;
            default:
                errorMessage = `Video error (code: ${video.error.code})`;
        }
    }
    
    showError(errorMessage);
    ipcRenderer.send('video-error', errorMessage);
});

video.addEventListener('waiting', () => {
    showLoading();
});

video.addEventListener('playing', () => {
    hideLoading();
});

video.addEventListener('timeupdate', () => {
    if (video.duration && !isNaN(video.duration)) {
        ipcRenderer.send('video-time-update', video.currentTime, video.duration);
    }
});

video.addEventListener('loadedmetadata', () => {
    if (video.duration && !isNaN(video.duration)) {
        ipcRenderer.send('video-time-update', video.currentTime, video.duration);
    }
});

ipcRenderer.on('load-video', (event, videoPath) => {
    if (videoPath && videoPath !== currentVideoPath) {
        currentVideoPath = videoPath;
        hideError();
        showLoading();
        
        video.src = `file://${videoPath.replace(/\\/g, '/')}`;
        video.load();
    }
});

ipcRenderer.on('play-video', () => {
    if (video.src) {
        video.play().catch(err => {
            showError('Failed to play video: ' + err.message);
            ipcRenderer.send('video-error', 'Failed to play video: ' + err.message);
        });
    }
});

ipcRenderer.on('pause-video', () => {
    video.pause();
});

ipcRenderer.on('stop-video', () => {
    video.pause();
    video.currentTime = 0;
    hideLoading();
    hideError();
});

ipcRenderer.on('seek-to-first-frame', () => {
    if (video.src) {
        video.currentTime = 0;
        video.pause();
    }
});

ipcRenderer.on('set-loop', (event, looping) => {
    isLooping = looping;
    video.loop = looping;
});

document.addEventListener('keydown', (e) => {
    e.preventDefault();
});

document.addEventListener('contextmenu', (e) => {
    e.preventDefault();
});