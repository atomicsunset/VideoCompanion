# Video Companion

A dual-monitor video player designed for clean video output to a second display.

## Features

- **Dual Monitor Support**: Main control interface on primary monitor, fullscreen video on secondary monitor
- **Playlist Management**: Drag-and-drop MP4 files to create playlists
- **Clean Video Output**: No OSD, controls, or UI elements on the video display
- **Simple Controls**: Play, pause, stop, next, previous, and playlist management
- **Muted Audio**: Audio is always muted as specified

## Installation

1. Install Node.js (if not already installed)
2. Run `npm install` to install dependencies
3. Run `npm start` to launch the application

## Usage

1. **Launch**: Run `npm start`
2. **Add Videos**: 
   - Click "Add Files" button to select MP4 files
   - Or drag-and-drop MP4 files directly onto the playlist area
3. **Play Videos**: 
   - Click "Play" next to any video in the playlist
   - Use the main controls: Play, Pause, Stop, Next, Previous
4. **Monitor Setup**: 
   - Control interface appears on your primary monitor
   - Video playback is fullscreen on your secondary monitor (or primary if only one monitor)
   - The video window has no controls or UI elements

## Controls

- **Add Files**: Open file dialog to select video files
- **Play**: Start/resume video playback
- **Pause**: Pause current video
- **Stop**: Stop video and hide player window
- **Next**: Play next video in playlist
- **Previous**: Play previous video in playlist  
- **Clear All**: Remove all videos from playlist

## Drag and Drop

- Drag MP4 files from Windows Explorer directly onto the playlist
- Reorder playlist items by dragging them within the list
- Remove individual videos using the "Remove" button on each item

## Technical Details

- Built with Electron for cross-platform compatibility
- Uses HTML5 video element for reliable MP4 playback
- Automatic monitor detection and positioning
- Video window is frameless and fullscreen on secondary display