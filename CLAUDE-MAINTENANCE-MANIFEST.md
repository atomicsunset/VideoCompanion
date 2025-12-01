# FNP VIDEO COMPANION - CLAUDE MAINTENANCE MANIFEST

**For Claude Code AI Assistant - Complete Project Knowledge Base**

## PROJECT OVERVIEW
- **Name**: FNP Video Companion
- **Version**: 1.0.0
- **Built**: September 11, 2025
- **Purpose**: Professional dual-monitor video player for broadcast production
- **Client**: Friday Night Pigskin Productions
- **Status**: Production Ready ✅

## ARCHITECTURE & TECHNOLOGY STACK
```
Technology: Electron (Node.js + Chromium)
Platform: Windows 64-bit
Framework: HTML5 + JavaScript + CSS
Video: HTML5 video element
Packaging: electron-packager
```

## FILE STRUCTURE
```
Video-Companion/
├── src/
│   ├── main.js                 # Electron main process
│   ├── main.html              # Control interface UI
│   ├── main-renderer.js       # Control interface logic
│   ├── player.html            # Clean video output UI
│   └── player-renderer.js     # Video player logic
├── package.json               # Dependencies & build config
├── dist/
│   └── FNP Video Companion UPDATED/  # Final distribution
└── CLAUDE-MAINTENANCE-MANIFEST.md    # This file
```

## KEY FEATURES IMPLEMENTED
- ✅ Dual monitor support (control + clean video output)
- ✅ Video playlist with drag-and-drop
- ✅ First frame preview on selection
- ✅ Large time remaining display (top of interface)
- ✅ Professional broadcast controls
- ✅ End-of-video behavior: return to first frame of same video
- ✅ Loop toggle (rarely used)
- ✅ Self-contained portable executable
- ✅ Muted audio (video feeds only)

## CRITICAL BUSINESS LOGIC

### Video End Behavior (IMPORTANT!)
```javascript
// In main-renderer.js - video-ended event handler
ipcRenderer.on('video-ended', () => {
    isPlaying = false;
    if (isLooping && currentIndex >= 0) {
        playVideoAtIndex(currentIndex);
    } else {
        ipcRenderer.invoke('seek-to-first-frame');  // KEY: Stay on first frame
        updateUI();
    }
});
```
**WHY**: Videos have 2-second splashscreen intro. Must return to first frame after completion, NOT advance to next video. Operator controls timing manually.

### Video Selection vs Playing
```javascript
// Two separate actions:
selectVideo(index)    // Load video, show first frame, don't play
playVideoAtIndex(index)  // Load video and immediately start playback
```

### Time Display Logic
```javascript
// Large MM:SS countdown timer at TOP of interface
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
```

## IPC COMMUNICATION ARCHITECTURE
```javascript
// Main Process (main.js) ←→ Renderer Processes
'load-video'           // Load video file path
'play-video'          // Start playback
'pause-video'         // Pause playback
'stop-video'          // Stop and reset to start
'seek-to-first-frame' // Critical for end-of-video behavior
'set-loop'            // Toggle looping
'video-ended'         // Video completion signal
'video-time-update'   // Time remaining updates
'video-error'         // Error handling
```

## WINDOW MANAGEMENT
```javascript
// Two windows:
mainWindow    // Control interface on primary monitor
playerWindow  // Clean video on secondary monitor (fullscreen, no frame)

// Auto-positioning:
const displays = screen.getAllDisplays();
const primaryDisplay = screen.getPrimaryDisplay();
const secondaryDisplay = displays.length > 1 ? displays[1] : displays[0];
```

## PLAYLIST STATE MANAGEMENT
```javascript
let playlist = [];         // Array of video objects {name, path}
let currentIndex = -1;     // Currently playing video
let selectedIndex = -1;    // Currently selected video (may not be playing)
let isPlaying = false;     // Playback state
let isLooping = false;     // Loop mode (rarely used)
let videoDuration = 0;     // Current video duration
let currentTime = 0;       // Current playback position
```

## BUILD & DISTRIBUTION PROCESS
```bash
# Development
npm start                    # Launch in dev mode

# Building executable
npm run package             # Creates portable Windows executable
# Output: dist-new/FNP Video Companion-win32-x64/

# Final distribution folder
dist/FNP Video Companion UPDATED/
├── FNP Video Companion.exe    # Main executable (172MB)
├── *.dll files                # Required dependencies
├── resources/                 # App code and assets
├── locales/                   # Language support
└── USER-GUIDE.txt            # Complete user documentation
```

## DEPENDENCIES
```json
{
  "electron": "^27.0.0",
  "electron-builder": "^24.6.4",
  "electron-packager": "^17.1.2"
}
```

## KNOWN LIMITATIONS & QUIRKS
- GPU process warnings normal for Electron (can ignore)
- File locks during rebuild (kill processes first)
- Requires both .exe and supporting files (not truly single-file)
- Only works reliably with MP4 format for broadcast use
- Audio permanently muted (by design)

## TROUBLESHOOTING GUIDE

### Build Issues
```bash
# If build fails due to file locks:
1. Close all running instances
2. Use different output directory: --out=dist-new
3. Copy to final location manually
```

### Runtime Issues
- **Video won't load**: Check file path, ensure MP4 format
- **No second monitor**: App detects automatically, uses primary if only one
- **Time display wrong**: Check video duration metadata

## USER EXPERIENCE DESIGN PRINCIPLES
1. **"Point and click" simplicity** - No technical knowledge required
2. **Broadcast timing control** - Manual advancement, no auto-play surprises
3. **Visual clarity** - Large timer, clear status indicators
4. **Professional reliability** - Consistent behavior, graceful error handling

## TESTING CHECKLIST
- [ ] Dual monitor detection and positioning
- [ ] Video loading and first frame display
- [ ] Playlist drag-and-drop functionality
- [ ] Time remaining countdown accuracy
- [ ] End-of-video behavior (must return to first frame)
- [ ] Control button states and validation
- [ ] File format compatibility (MP4 primary)
- [ ] Clean video output (no UI elements on second monitor)

## FUTURE ENHANCEMENT IDEAS
- Fullscreen toggle for single monitor setups
- Video preview thumbnails in playlist
- Keyboard shortcuts for common operations
- Multiple playlist management
- Video transition effects
- Remote control via network API

## DEVELOPMENT HISTORY
**Session Date**: September 11, 2025
**Development Time**: Single session (approximately 3-4 hours)
**Starting Point**: "Never built anything from scratch"
**Ending Point**: Production-ready broadcast software

**Key Milestones**:
1. Initial Electron app setup
2. Dual window architecture implementation
3. Video playback system integration
4. Playlist management with drag-and-drop
5. Professional UI design and layout
6. Broadcast-specific logic implementation
7. End-of-video behavior refinement
8. Large timer display repositioning
9. Portable executable creation
10. Documentation and user guide creation

## CONTACT & MAINTENANCE
- **Original Development Session**: Claude Code AI Assistant
- **Project Owner**: Friday Night Pigskin Productions
- **Maintenance Access**: Reference this manifest for complete context

## EMERGENCY REBUILD INSTRUCTIONS
If you need to rebuild from source:
```bash
1. cd to project directory
2. npm install
3. npm run package
4. Copy dist-new/FNP Video Companion-win32-x64/ to desired location
5. Test with sample MP4 files
```

---

**This manifest contains complete project knowledge for maintenance, updates, and troubleshooting. Reference it for full context on architecture, business logic, and user requirements.**