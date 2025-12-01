const { ipcRenderer } = require('electron');
const path = require('path');

let playlist = [];
let currentIndex = -1;
let selectedIndex = -1;
let isPlaying = false;
let isLooping = false;
let videoDuration = 0;
let currentTime = 0;

const elements = {
    playlist: document.getElementById('playlist'),
    playlistContainer: document.getElementById('playlistContainer'),
    emptyState: document.getElementById('emptyState'),
    status: document.getElementById('status'),
    playBtn: document.getElementById('playBtn'),
    pauseBtn: document.getElementById('pauseBtn'),
    stopBtn: document.getElementById('stopBtn'),
    nextBtn: document.getElementById('nextBtn'),
    prevBtn: document.getElementById('prevBtn'),
    loopBtn: document.getElementById('loopBtn'),
    clearBtn: document.getElementById('clearBtn'),
    timeDisplay: document.getElementById('timeDisplay')
};

function updateUI() {
    elements.emptyState.style.display = playlist.length === 0 ? 'block' : 'none';
    
    const hasPlaylist = playlist.length > 0;
    const hasSelection = selectedIndex >= 0 && selectedIndex < playlist.length;
    const hasCurrentVideo = currentIndex >= 0 && currentIndex < playlist.length;
    
    elements.playBtn.disabled = !hasSelection;
    elements.pauseBtn.disabled = !hasCurrentVideo || !isPlaying;
    elements.stopBtn.disabled = !hasCurrentVideo;
    elements.nextBtn.disabled = !hasPlaylist || currentIndex >= playlist.length - 1;
    elements.prevBtn.disabled = !hasPlaylist || currentIndex <= 0;
    elements.clearBtn.disabled = !hasPlaylist;
    
    if (hasCurrentVideo) {
        const current = playlist[currentIndex];
        elements.status.textContent = `${isPlaying ? 'Playing' : 'Loaded'}: ${current.name}`;
    } else if (hasPlaylist) {
        elements.status.textContent = `${playlist.length} video(s) in playlist - Select one to play`;
    } else {
        elements.status.textContent = 'Ready - No video loaded';
    }
    
    updateTimeDisplay();
}

function renderPlaylist() {
    elements.playlist.innerHTML = '';
    
    playlist.forEach((video, index) => {
        const li = document.createElement('li');
        let className = 'playlist-item';
        if (index === currentIndex) className += ' current';
        if (index === selectedIndex) className += ' selected';
        li.className = className;
        li.draggable = true;
        li.dataset.index = index;
        
        li.innerHTML = `
            <div class="video-info">
                <div class="video-name">${video.name}</div>
                <div class="video-path">${video.path}</div>
            </div>
            <div class="item-controls">
                <button onclick="selectVideo(${index})">Select</button>
                <button onclick="playVideoAtIndex(${index})">Play</button>
                <button onclick="removeVideo(${index})">Remove</button>
            </div>
        `;
        
        li.addEventListener('dragstart', handleDragStart);
        li.addEventListener('dragover', handleDragOver);
        li.addEventListener('drop', handleDrop);
        li.addEventListener('dragend', handleDragEnd);
        
        elements.playlist.appendChild(li);
    });
    
    updateUI();
}

function addVideos(filePaths) {
    const videoExtensions = ['.mp4', '.avi', '.mov', '.mkv', '.wmv'];
    
    filePaths.forEach(filePath => {
        const ext = path.extname(filePath).toLowerCase();
        if (videoExtensions.includes(ext)) {
            const name = path.basename(filePath);
            if (!playlist.find(v => v.path === filePath)) {
                playlist.push({ name, path: filePath });
            }
        }
    });
    
    renderPlaylist();
}

async function addFiles() {
    const files = await ipcRenderer.invoke('select-files');
    if (files.length > 0) {
        addVideos(files);
    }
}

async function selectVideo(index) {
    if (index >= 0 && index < playlist.length) {
        selectedIndex = index;
        const video = playlist[selectedIndex];
        await ipcRenderer.invoke('load-video', video.path);
        await ipcRenderer.invoke('seek-to-first-frame');
        renderPlaylist();
    }
}

async function playVideoAtIndex(index) {
    if (index >= 0 && index < playlist.length) {
        selectedIndex = index;
        currentIndex = index;
        const video = playlist[currentIndex];
        await ipcRenderer.invoke('load-video', video.path);
        await ipcRenderer.invoke('play-video');
        isPlaying = true;
        renderPlaylist();
    }
}

async function playVideo() {
    if (selectedIndex >= 0) {
        currentIndex = selectedIndex;
        await ipcRenderer.invoke('play-video');
        isPlaying = true;
        updateUI();
    }
}

async function pauseVideo() {
    await ipcRenderer.invoke('pause-video');
    isPlaying = false;
    updateUI();
}

async function stopVideo() {
    await ipcRenderer.invoke('stop-video');
    isPlaying = false;
    updateUI();
}

async function nextVideo() {
    if (currentIndex < playlist.length - 1) {
        await playVideoAtIndex(currentIndex + 1);
    }
}

async function prevVideo() {
    if (currentIndex > 0) {
        await playVideoAtIndex(currentIndex - 1);
    }
}

function removeVideo(index) {
    playlist.splice(index, 1);
    if (currentIndex >= index) {
        currentIndex--;
    }
    if (currentIndex >= playlist.length) {
        currentIndex = playlist.length - 1;
    }
    if (playlist.length === 0) {
        currentIndex = -1;
        selectedIndex = -1;
        stopVideo();
    }
    renderPlaylist();
}

function clearPlaylist() {
    playlist = [];
    currentIndex = -1;
    selectedIndex = -1;
    stopVideo();
    renderPlaylist();
}

function toggleLoop() {
    isLooping = !isLooping;
    elements.loopBtn.textContent = `Loop: ${isLooping ? 'On' : 'Off'}`;
    ipcRenderer.invoke('set-loop', isLooping);
}

function updateTimeDisplay() {
    if (currentIndex >= 0 && videoDuration > 0) {
        const remaining = Math.max(0, videoDuration - currentTime);
        const minutes = Math.floor(remaining / 60);
        const seconds = Math.floor(remaining % 60);
        elements.timeDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    } else {
        elements.timeDisplay.textContent = '--:--';
    }
}

elements.playlistContainer.addEventListener('dragover', (e) => {
    e.preventDefault();
    elements.playlistContainer.classList.add('drag-over');
});

elements.playlistContainer.addEventListener('dragleave', (e) => {
    if (!elements.playlistContainer.contains(e.relatedTarget)) {
        elements.playlistContainer.classList.remove('drag-over');
    }
});

elements.playlistContainer.addEventListener('drop', (e) => {
    e.preventDefault();
    elements.playlistContainer.classList.remove('drag-over');
    
    const files = Array.from(e.dataTransfer.files).map(file => file.path);
    addVideos(files);
});

let draggedIndex = -1;

function handleDragStart(e) {
    draggedIndex = parseInt(e.target.dataset.index);
    e.target.classList.add('dragging');
}

function handleDragOver(e) {
    e.preventDefault();
}

function handleDrop(e) {
    e.preventDefault();
    const targetIndex = parseInt(e.target.closest('.playlist-item').dataset.index);
    
    if (draggedIndex !== targetIndex && draggedIndex !== -1) {
        const draggedItem = playlist[draggedIndex];
        playlist.splice(draggedIndex, 1);
        playlist.splice(targetIndex, 0, draggedItem);
        
        if (currentIndex === draggedIndex) {
            currentIndex = targetIndex;
        } else if (currentIndex > draggedIndex && currentIndex <= targetIndex) {
            currentIndex--;
        } else if (currentIndex < draggedIndex && currentIndex >= targetIndex) {
            currentIndex++;
        }
        
        if (selectedIndex === draggedIndex) {
            selectedIndex = targetIndex;
        } else if (selectedIndex > draggedIndex && selectedIndex <= targetIndex) {
            selectedIndex--;
        } else if (selectedIndex < draggedIndex && selectedIndex >= targetIndex) {
            selectedIndex++;
        }
        
        renderPlaylist();
    }
}

function handleDragEnd(e) {
    e.target.classList.remove('dragging');
    draggedIndex = -1;
}

ipcRenderer.on('video-ended', () => {
    isPlaying = false;
    if (isLooping && currentIndex >= 0) {
        playVideoAtIndex(currentIndex);
    } else {
        ipcRenderer.invoke('seek-to-first-frame');
        updateUI();
    }
});

ipcRenderer.on('video-time-update', (event, time, duration) => {
    currentTime = time;
    videoDuration = duration;
    updateUI();
});

ipcRenderer.on('video-error', (event, error) => {
    isPlaying = false;
    elements.status.textContent = `Error: ${error}`;
    updateUI();
});

updateUI();