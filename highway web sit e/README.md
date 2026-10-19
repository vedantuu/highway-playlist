# Desi Highway Radio — 3D Animated Highway

A browser-based Three.js highway experience with automatically moving traffic, scrolling Indian roadside scenery, a chase camera, speed controls, day/night toggle, and a music-library UI.

## Run it in VS Code
1. Extract the ZIP.
2. Open the `desi_highway_radio_3d` folder in VS Code.
3. Install the **Live Server** extension if you don't already have it.
4. Right-click `index.html` → **Open with Live Server**.
5. Click **START YOUR DRIVE**. Traffic moves automatically. Use ← / → or A / D to steer the camera-followed car, and ↑ / ↓ to adjust the displayed speed.

Internet is needed for the Three.js and Google Fonts CDN links.

## Add real music
The UI is wired to local MP3 paths, but music files are not included. Add MP3 files to `assets/music/` using the filenames below, or change the `tracks` array in `app.js` to match your files:
- `kesariya.mp3`
- `gulabi-sharara.mp3`
- `ilahi.mp3`
- `chogada.mp3`
- `maan-meri-jaan.mp3`
- `apna-bana-le.mp3`

Only add music files you have the right to use. If files are absent, the visual player still works and shows a helpful message when playback is attempted.

## Controls
- Start screen: start the animated drive
- Arrow keys / A-D: shift the player car's lane
- Arrow Up / Down: increase/decrease displayed speed
- +/- buttons: adjust speed
- Density slider: change the amount of traffic
- Change: toggle daylight/night mode
- Camera view: chase camera / driver view
- Player: play, pause, next, previous, shuffle, repeat, search

## Notes
This is a real-time 3D scene made with procedural geometry rather than a pre-rendered background. It is a stylized-realistic prototype, not a full commercial driving simulator. Traffic and roadside scenery animate continuously. You can improve realism further by replacing procedural vehicles with licensed GLB/GLTF vehicle models.


## Added in the updated version
- **＋ Add songs** lets you select one or multiple audio files from your computer and add them to the playlist.
- Added songs can be selected and played from the playlist using the built-in player.
- Search filters songs; searches of 2+ characters are recorded in Recent History.
- Played tracks are recorded in Recent History.
- History stays in this browser using local storage. The actual uploaded audio files are selected locally each session; re-add them after refreshing the page.
- Clear button clears both search and play history.
