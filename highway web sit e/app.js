/* Desi Highway Radio — procedural Three.js highway simulation.
   Uses generated 3D geometry, so no external 3D assets are required. */
(() => {
  'use strict';
  const canvas = document.querySelector('#scene');
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x8eafc5);
  scene.fog = new THREE.Fog(0x8eafc5, 90, 430);
  const camera = new THREE.PerspectiveCamera(58, innerWidth / innerHeight, .1, 900);
  camera.position.set(0, 5.2, 13);
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.8)); renderer.setSize(innerWidth, innerHeight);
  renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.05;
  scene.add(new THREE.HemisphereLight(0xd9edff, 0x5c4d3c, 2.1));
  const sun = new THREE.DirectionalLight(0xffe4bd, 3.1); sun.position.set(-45, 70, -30); sun.castShadow = true; sun.shadow.mapSize.set(1024, 1024); scene.add(sun);
  const mat = (color, roughness = .8, metalness = 0) => new THREE.MeshStandardMaterial({ color, roughness, metalness });
  const roadMat = mat(0x343b40, .94), shoulderMat = mat(0x777a76), dirtMat = mat(0x9b8b6b), grassMat = mat(0x61745a), whiteMat = mat(0xf2eee3), yellowMat = mat(0xe9b84f);
  const asphalt = new THREE.Mesh(new THREE.PlaneGeometry(15, 650), roadMat); asphalt.rotation.x = -Math.PI / 2; asphalt.position.set(0, -.08, -270); asphalt.receiveShadow = true; scene.add(asphalt);
  const leftShoulder = new THREE.Mesh(new THREE.PlaneGeometry(2.3, 650), shoulderMat); leftShoulder.rotation.x = -Math.PI / 2; leftShoulder.position.set(-8.65, -.07, -270); scene.add(leftShoulder);
  const rightShoulder = leftShoulder.clone(); rightShoulder.position.x = 8.65; scene.add(rightShoulder);
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(800, 800), dirtMat); ground.rotation.x = -Math.PI / 2; ground.position.set(0, -.2, -270); scene.add(ground);
  // distant haze hills
  for (let i = 0; i < 15; i++) { const hill = new THREE.Mesh(new THREE.SphereGeometry(1, 16, 10), mat(i % 2 ? 0x778a7b : 0x8a9b86)); hill.scale.set(20 + Math.random() * 28, 3 + Math.random() * 7, 9 + Math.random() * 9); hill.position.set(-180 + i * 26, -1, -340 - Math.random() * 20); scene.add(hill); }
  const roadMarks = [];
  for (let z = -600; z < 18; z += 11) { const dash = new THREE.Mesh(new THREE.BoxGeometry(.16, .025, 4.2), whiteMat); dash.position.set(0, .01, z); scene.add(dash); roadMarks.push(dash); }
  for (const x of [-7.45, 7.45]) { const edge = new THREE.Mesh(new THREE.BoxGeometry(.13, .025, 650), yellowMat); edge.position.set(x, .015, -270); scene.add(edge); }
  const laneLines = [];
  for (const x of [-2.5, 2.5]) for (let z = -600; z < 10; z += 16) { const m = new THREE.Mesh(new THREE.BoxGeometry(.09, .02, 6.5), whiteMat); m.position.set(x, .01, z); scene.add(m); laneLines.push(m); }
  const roadside = [];
  function makeTree(x, z) { const g = new THREE.Group(); const trunk = new THREE.Mesh(new THREE.CylinderGeometry(.12, .22, 2.2, 7), mat(0x584433)); trunk.position.y = 1.1; g.add(trunk); const crown = new THREE.Mesh(new THREE.SphereGeometry(1, 9, 7), mat([0x496449, 0x62764b, 0x75835b][Math.floor(Math.random() * 3)])); crown.scale.set(.8 + Math.random() * .5, 1.1 + Math.random() * .7, .8 + Math.random() * .5); crown.position.y = 2.6; g.add(crown); g.position.set(x, 0, z); scene.add(g); roadside.push({ group: g, side: Math.sign(x) }); }
  function makeBuilding(x, z) { const g = new THREE.Group(); let w = 2 + Math.random() * 4, h = 1.5 + Math.random() * 4; const body = new THREE.Mesh(new THREE.BoxGeometry(w, h, 2.5), mat([0xc1a07a, 0xb4a28b, 0x8d9b9d, 0xd2c6ad][Math.floor(Math.random() * 4)])); body.position.y = h / 2; g.add(body); const roof = new THREE.Mesh(new THREE.BoxGeometry(w + .25, .18, 2.7), mat(0x766b5d)); roof.position.y = h + .08; g.add(roof); for (let yy = .7; yy < h - .25; yy += .8)for (let xx = -w / 2 + .45; xx < w / 2 - .2; xx += .8) { const win = new THREE.Mesh(new THREE.BoxGeometry(.25, .28, .035), mat(0x5e777e, .3)); win.position.set(xx, yy, 1.27); g.add(win); } g.position.set(x, 0, z); scene.add(g); roadside.push({ group: g, side: Math.sign(x) }); }
  for (let z = -600; z < 0; z += 13) { makeTree(-12 - Math.random() * 18, z); makeTree(12 + Math.random() * 18, z - 5); if (Math.random() < .17) { makeBuilding(-18 - Math.random() * 10, z - 4); makeBuilding(18 + Math.random() * 10, z - 10); } }
  function makeSign(x, z, label) { const g = new THREE.Group(); const poleMat = mat(0x656c6d, .55, .35), signMat = mat(0x126343, .55); const pole = new THREE.Mesh(new THREE.CylinderGeometry(.08, .1, 4, 8), poleMat); pole.position.y = 2; g.add(pole); const board = new THREE.Mesh(new THREE.BoxGeometry(4.5, 1.2, .12), signMat); board.position.y = 4; g.add(board); const texture = document.createElement('canvas'); texture.width = 512; texture.height = 128; const ctx = texture.getContext('2d'); ctx.fillStyle = '#fff'; ctx.font = 'bold 36px Arial'; ctx.textAlign = 'center'; ctx.fillText(label, 256, 52); ctx.font = '25px Arial'; ctx.fillText('HIGHWAY • INDIA', 256, 92); const tex = new THREE.CanvasTexture(texture); const txt = new THREE.Mesh(new THREE.PlaneGeometry(4.35, 1.08), new THREE.MeshBasicMaterial({ map: tex, transparent: true })); txt.position.set(0, 4, .071); g.add(txt); g.position.set(x, 0, z); scene.add(g); roadside.push({ group: g, side: Math.sign(x) }); }
  makeSign(-10, -85, 'RAJKOT  24 km'); makeSign(10, -235, 'JAMNAGAR  72 km'); makeSign(-10, -390, 'AHMEDABAD  210 km');
  // Vehicle model builder: believable silhouettes, colored bodies, glass, lights and wheels.
  const vehicleMaterials = [0xd9dedf, 0x1d3547, 0x8d3026, 0x6f7779, 0xe4e1d8, 0x243a31, 0xb47a39, 0x1d2025, 0x9ba8b1].map(c => mat(c, .35, .18));
  const glassMat = new THREE.MeshStandardMaterial({ color: 0x172a35, metalness: .25, roughness: .22 });
  const rubber = mat(0x17191a, .95), rim = mat(0x9ca6a8, .35, .7), lamp = new THREE.MeshBasicMaterial({ color: 0xfff1d1 }), tailLamp = new THREE.MeshBasicMaterial({ color: 0xf33825 });
  const vehicleGroups = [];
  function box(parent, w, h, d, material, x, y, z) { const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), material); m.position.set(x, y, z); m.castShadow = true; m.receiveShadow = true; parent.add(m); return m; }
  function wheel(parent, x, y, z, r = .34) { const wh = new THREE.Mesh(new THREE.CylinderGeometry(r, r, .19, 12), rubber); wh.rotation.z = Math.PI / 2; wh.position.set(x, y, z); wh.castShadow = true; parent.add(wh); const hub = new THREE.Mesh(new THREE.CylinderGeometry(r * .45, r * .45, .2, 10), rim); hub.rotation.z = Math.PI / 2; hub.position.copy(wh.position); parent.add(hub); return wh; }
  function buildVehicle(type, colorIndex = 0) {
    const g = new THREE.Group(), bodymat = vehicleMaterials[colorIndex % vehicleMaterials.length]; let width = 1.8, length = 3.8, height = 1.25;
    if (type === 'truck') { width = 2.25; length = 7.1; height = 1.55; box(g, width, .85, length * .48, bodymat, 0, 1.15, -.9); box(g, width, .4, length * .43, mat(0x7c8587), 0, 1.75, -2.95); box(g, width * .96, 1.15, length * .39, mat([0xb3b7b6, 0x9b8d76, 0x4c666d][colorIndex % 3]), 0, 2.4, -2.95); box(g, 1.55, .95, 1.45, bodymat, 0, 1.45, 1.65); box(g, 1.35, .5, .05, glassMat, 0, 2, 2.38); for (const x of [-.9, .9]) for (const z of [-3.3, -1.1, 1.8]) wheel(g, x, .48, z, .42); }
    else if (type === 'bus') { width = 2.1; length = 6.8; height = 2.35; box(g, width, 2.1, length, bodymat, 0, 1.55, 0); box(g, 1.8, .6, 1.05, glassMat, 0, 2.45, 2.93); for (let z = -2.45; z < 2.5; z += .85) { box(g, .45, .48, .025, glassMat, -.78, 2.15, z); box(g, .45, .48, .025, glassMat, .78, 2.15, z); } for (const x of [-.95, .95]) for (const z of [-2.4, 2.25]) wheel(g, x, .48, z, .38); }
    else if (type === 'bike' || type === 'auto') {
      width = type === 'bike' ? .72 : 1.45; length = type === 'bike' ? 1.9 : 2.6; height = type === 'bike' ? 1.25 : 1.7; if (type === 'bike') { wheel(g, 0, .35, -.65, .29); wheel(g, 0, .35, .65, .29); box(g, .35, .32, .7, bodymat, 0, .75, 0); box(g, .25, .5, .28, glassMat, 0, 1.15, -.12); const rider = mat(0x2c3338); const head = new THREE.Mesh(new THREE.SphereGeometry(.17, 10, 8), mat(0x382a22)); head.position.set(0, 1.55, -.08); g.add(head); box(g, .42, .48, .28, rider, 0, 1.22, .02); }
      else { box(g, width, 1, length, bodymat, 0, .8, 0); box(g, 1.15, .65, 1.05, glassMat, 0, 1.55, -.05); for (const x of [-.65, .65]) for (const z of [-.8, .8]) wheel(g, x, .34, z, .28); }
    }
    else { box(g, width, .62, length * .6, bodymat, 0, .68, 0); box(g, width * .78, .6, length * .43, bodymat, 0, 1.25, -.12); box(g, width * .68, .46, length * .32, glassMat, 0, 1.29, -.1); box(g, .5, .24, .25, bodymat, 0, 1.7, -.1); for (const x of [-.67, .67]) for (const z of [-1.1, 1.05]) wheel(g, x, .36, z, .31); box(g, .27, .16, .04, lamp, -.55, .72, 1.92); box(g, .27, .16, .04, lamp, .55, .72, 1.92); }
    if (type === 'truck' || type === 'bus') { box(g, .28, .18, .04, tailLamp, -.7, .75, length / 2); box(g, .28, .18, .04, tailLamp, .7, .75, length / 2); }
    g.userData = { type, width, length, baseY: 0 }; return g;
  }
  const trafficTypes = ['car', 'car', 'car', 'suv', 'truck', 'bus', 'bike', 'auto'];
  function addTraffic(z, lane) {
    const type = trafficTypes[Math.floor(Math.random() * trafficTypes.length)]; const v = buildVehicle(type, Math.floor(Math.random() * vehicleMaterials.length)); v.position.set(lane, 0, z); v.rotation.y = Math.PI; // front points toward far road; rear is visible to player
    v.userData.speed = .10 + Math.random() * .12; v.userData.lane = lane; v.userData.phase = Math.random() * 6.28; scene.add(v); vehicleGroups.push(v);
  }
  function addPlayerCar() { const car = buildVehicle('suv', 0); car.scale.set(1.05, 1.05, 1.05); car.position.set(0, 0, 7); car.rotation.y = 0; scene.add(car); return car; }
  const player = addPlayerCar();
  for (let i = 0; i < 18; i++) { const lanes = [-5, -2.5, 2.5, 5]; addTraffic(-18 - Math.random() * 520, lanes[Math.floor(Math.random() * lanes.length)]); }
  let targetX = 0, speed = 82, running = false, night = false, rain = false, cameraFront = false, elapsed = 0, last = performance.now(), shuffle = false, repeat = false, trackIndex = 0, audio = null, audioEnabled = false;
  const tracks = [
    { title: 'Kesariya', artist: 'Arijit Singh • Bollywood', time: '3:42', file: 'assets/music/kesariya.mp3', demo: true },
    { title: 'Gulabi Sharara', artist: 'Inder Arya • Pahadi', time: '3:56', file: 'assets/music/gulabi-sharara.mp3', demo: true },
    { title: 'Ilahi', artist: 'Arijit Singh • Bollywood', time: '3:34', file: 'assets/music/ilahi.mp3', demo: true },
    { title: 'Chogada', artist: 'Darshan Raval • Gujarati', time: '4:09', file: 'assets/music/chogada.mp3', demo: true },
    { title: 'Maan Meri Jaan', artist: 'King • Indian Pop', time: '3:14', file: 'assets/music/maan-meri-jaan.mp3', demo: true },
    { title: 'Apna Bana Le', artist: 'Arijit Singh • Bollywood', time: '4:21', file: 'assets/music/apna-bana-le.mp3', demo: true }
  ];
  let recentHistory = [];
  try { recentHistory = JSON.parse(localStorage.getItem('dhrHistory') || '[]') } catch (e) { recentHistory = [] }
  let searchHistory = [];
  try { searchHistory = JSON.parse(localStorage.getItem('dhrSearchHistory') || '[]') } catch (e) { searchHistory = [] }
  function saveHistory() { try { localStorage.setItem('dhrHistory', JSON.stringify(recentHistory.slice(0, 12))); localStorage.setItem('dhrSearchHistory', JSON.stringify(searchHistory.slice(0, 12))) } catch (e) { } }
  function addHistory(kind, title, artist = '') { const entry = { kind, title, artist, at: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }; const list = kind === 'search' ? searchHistory : recentHistory; const index = list.findIndex(x => x.title.toLowerCase() === title.toLowerCase()); if (index >= 0) list.splice(index, 1); list.unshift(entry); if (kind === 'search') searchHistory = list.slice(0, 12); else recentHistory = list.slice(0, 12); saveHistory(); renderHistory(); }
  function renderHistory() { const root = $('#historyList'); if (!root) return; root.innerHTML = ''; const combined = [...searchHistory.map(x => ({ ...x, kind: 'search' })), ...recentHistory.map(x => ({ ...x, kind: 'play' }))].sort((a, b) => String(b.at).localeCompare(String(a.at))).slice(0, 8); if (!combined.length) { root.innerHTML = '<div class="history-empty">Songs you search or play will appear here.</div>'; return; } combined.forEach(item => { const row = document.createElement('div'); row.className = 'history-item'; row.innerHTML = `<span class="history-symbol">${item.kind === 'search' ? '⌕' : '♫'}</span><span class="history-meta"><b>${escapeText(item.title)}</b><small>${item.kind === 'search' ? 'Searched' : 'Played'}${item.artist ? ' · ' + escapeText(item.artist) : ''}</small></span>`; row.addEventListener('click', () => { if (item.kind === 'play') { const found = tracks.findIndex(t => t.title === item.title); if (found >= 0) selectTrack(found, true); else { const foundUpload = tracks.findIndex(t => t.title === item.title); if (foundUpload >= 0) selectTrack(foundUpload, true); } } else { $('#search').value = item.title; renderPlaylist(item.title); } }); root.appendChild(row); }); }
  function escapeText(s) { return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])); }
  const $ = s => document.querySelector(s);
  function toast(msg) { const t = $('#toast'); t.textContent = msg; t.classList.add('show'); clearTimeout(toast.timer); toast.timer = setTimeout(() => t.classList.remove('show'), 2300); }
  function renderPlaylist(filter = '') { const root = $('#playlist'); root.innerHTML = ''; tracks.forEach((t, i) => { if (!(`${t.title} ${t.artist}`.toLowerCase().includes(filter.toLowerCase()))) return; const row = document.createElement('div'); row.className = 'song' + (i === trackIndex ? ' selected' : ''); row.innerHTML = `<span class="song-index">${String(i + 1).padStart(2, '0')}</span><span class="song-meta"><b>${escapeText(t.title)}</b><small>${escapeText(t.artist)}</small></span><span class="song-time">${t.time || '--:--'}</span>`; row.addEventListener('click', () => selectTrack(i, true)); root.appendChild(row); }); if (!root.children.length) root.innerHTML = '<div class="history-empty">No matching songs. Try another search or add songs.</div>'; }
  function selectTrack(i, playIt = false) { if (!tracks.length) return; trackIndex = (i + tracks.length) % tracks.length; const t = tracks[trackIndex]; $('#trackTitle').textContent = t.title; $('#trackArtist').textContent = t.artist || 'Your music library'; $('#duration').textContent = t.time || '--:--'; $('#progressBar').style.width = '0%'; $('#elapsed').textContent = '0:00'; renderPlaylist($('#search').value); if (audio) { audio.pause(); if (audio._objectUrl) { URL.revokeObjectURL(audio._objectUrl); } audio = null; } audio = new Audio(); audio.preload = 'metadata'; audio.volume = +$('#ambience').value / 100; const src = t.objectUrl || t.file; audio.src = src; audio.addEventListener('loadedmetadata', () => { if (isFinite(audio.duration)) $('#duration').textContent = fmt(audio.duration); }); audio.addEventListener('timeupdate', () => { if (!audio || !isFinite(audio.duration)) return; $('#progressBar').style.width = (audio.currentTime / audio.duration * 100) + '%'; $('#elapsed').textContent = fmt(audio.currentTime); }); audio.addEventListener('ended', () => { if (repeat) { audio.currentTime = 0; audio.play().catch(() => { }); } else nextTrack(); }); audio.addEventListener('error', () => { if (t.demo) toast('This sample track has no audio file. Use + Add songs to play your music.'); else toast('This audio file could not be played. Try MP3, WAV or OGG.'); }); if (playIt) { audioEnabled = true; audio.play().then(() => { $('#play').textContent = 'Ⅱ'; addHistory('play', t.title, t.artist); }).catch(() => { if (t.demo) toast('Add your own audio using + Add songs to play music.'); else toast('Browser could not play this file. Try another audio format.'); $('#play').textContent = '▶'; }); } else $('#play').textContent = '▶'; }
  function fmt(s) { s = Math.floor(s || 0); return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`; }
  function nextTrack() { selectTrack(shuffle ? Math.floor(Math.random() * tracks.length) : trackIndex + 1, true); }
  function setSpeed(v) { speed = Math.max(30, Math.min(140, v)); $('#speedValue').textContent = speed; $('#speedMeter').style.width = (speed / 140 * 100) + '%'; }
  $('#play').onclick = () => { if (!audio) selectTrack(trackIndex, false); audioEnabled = true; if (audio.paused) { audio.play().then(() => { $('#play').textContent = 'Ⅱ'; addHistory('play', tracks[trackIndex].title, tracks[trackIndex].artist); }).catch(() => toast('Use + Add songs to choose audio from your computer.')); } else { audio.pause(); $('#play').textContent = '▶'; } };
  $('#next').onclick = nextTrack; $('#prev').onclick = () => selectTrack(trackIndex - 1, true);
  $('#shuffle').onclick = () => { shuffle = !shuffle; $('#shuffle').classList.toggle('active', shuffle); toast(shuffle ? 'Shuffle on' : 'Shuffle off'); };
  $('#repeat').onclick = () => { repeat = !repeat; $('#repeat').classList.toggle('active', repeat); toast(repeat ? 'Repeat current track' : 'Repeat off'); };
  $('#search').addEventListener('input', e => renderPlaylist(e.target.value));
  $('#slower').onclick = () => setSpeed(speed - 10); $('#faster').onclick = () => setSpeed(speed + 10);
  $('#left').onpointerdown = () => targetX = Math.max(-4.8, targetX - 1.6); $('#right').onpointerdown = () => targetX = Math.min(4.8, targetX + 1.6);
  $('#left').onkeydown = $('#right').onkeydown = () => { };
  addEventListener('keydown', e => { if (e.key === 'ArrowLeft' || e.key === 'a') targetX = Math.max(-4.8, targetX - 1); if (e.key === 'ArrowRight' || e.key === 'd') targetX = Math.min(4.8, targetX + 1); if (e.key === 'ArrowUp') setSpeed(speed + 5); if (e.key === 'ArrowDown') setSpeed(speed - 5); });
  $('#density').oninput = e => { const want = +e.target.value; while (vehicleGroups.length < want) addTraffic(-520 - Math.random() * 100, [-5, -2.5, 2.5, 5][Math.floor(Math.random() * 4)]); while (vehicleGroups.length > want) { const v = vehicleGroups.pop(); scene.remove(v); } $('#trafficCount').textContent = want + ' VEHICLES'; };
  $('#weatherToggle').onclick = () => { night = !night; rain = !night; scene.background = new THREE.Color(night ? 0x101e35 : 0x8eafc5); scene.fog.color.set(night ? 0x101e35 : 0x8eafc5); scene.fog.near = night ? 45 : 90; scene.fog.far = night ? 300 : 430; sun.intensity = night ? .22 : 3.1; sun.color.set(night ? 0x7899ff : 0xffe4bd); $('#weatherLabel').textContent = night ? 'Night drive' : 'Clear skies'; $('.weather>span').textContent = night ? '☾' : '☀'; toast(night ? 'Night mode enabled' : 'Daylight restored'); };
  $('#ambience').oninput = e => { if (audio) audio.volume = +e.target.value / 100; };
  $('#soundToggle').onclick = () => { audioEnabled = !audioEnabled; if (audio) { audio.muted = !audioEnabled; } $('#soundToggle').textContent = audioEnabled ? '🔊' : '🔇'; toast(audioEnabled ? 'Sound on' : 'Sound muted'); };
  $('#cameraToggle').onclick = () => { cameraFront = !cameraFront; $('#cameraToggle').textContent = cameraFront ? 'Driver view ↗' : 'Behind car ↗'; toast(cameraFront ? 'Driver camera' : 'Chase camera'); };
  $('#startDrive').onclick = () => { $('#startOverlay').classList.add('hidden'); running = true; toast('Traffic is moving. Enjoy the drive!'); };
  renderPlaylist(); renderHistory(); selectTrack(0, false);
  function animate(now) {
    requestAnimationFrame(animate); const dt = Math.min((now - last) / 1000, .04); last = now; elapsed += dt;
    // Scroll lane markings and roadside props towards the viewer: continuous forward motion.
    const move = (speed / 82) * dt * 27;
    for (const m of roadMarks) { m.position.z += move; if (m.position.z > 15) m.position.z -= 616; }
    for (const m of laneLines) { m.position.z += move; if (m.position.z > 15) m.position.z -= 616; }
    for (const item of roadside) { item.group.position.z += move; if (item.group.position.z > 20) item.group.position.z -= 620; }
    // Automatic traffic: cars drift toward the camera, then recycle at the horizon.
    for (const v of vehicleGroups) { v.position.z += move * (.38 + v.userData.speed); v.position.x += Math.sin(elapsed * .35 + v.userData.phase) * dt * .05; if (v.position.z > 17) { v.position.z = -450 - Math.random() * 160; v.position.x = [-5, -2.5, 2.5, 5][Math.floor(Math.random() * 4)]; } }
    player.position.x += (targetX - player.position.x) * Math.min(1, dt * 2.6); player.position.y = Math.sin(elapsed * 7) * .008;
    if (running) { camera.position.x += (player.position.x * .48 - camera.position.x) * dt * 1.4; camera.position.y += (cameraFront ? 2.5 : 5.1 - camera.position.y) * dt * 1.5; camera.position.z += (cameraFront ? 2.5 : 13 - camera.position.z) * dt * 1.5; const look = new THREE.Vector3(player.position.x * .25, cameraFront ? 1.6 : 1.15, cameraFront ? -80 : -34); camera.lookAt(look); }
    else { camera.position.set(0, 5.2, 13); camera.lookAt(0, 1, -32); }
    if (cameraFront) { camera.position.x = player.position.x; camera.position.z = player.position.z - 1.8; camera.position.y = 2.3; camera.lookAt(player.position.x, 1, -100); }
    renderer.render(scene, camera); requestAnimationFrame;
  }
  requestAnimationFrame(animate);

  // Add one or many audio files directly from the user's device.
  const songFiles = $('#songFiles');
  $('#addSongsBtn').addEventListener('click', () => songFiles.click());
  songFiles.addEventListener('change', event => {
    const picked = Array.from(event.target.files || []).filter(file => file.type.startsWith('audio/') || /\.(mp3|wav|ogg|m4a|aac|flac|opus)$/i.test(file.name));
    if (!picked.length) { toast('Choose audio files such as MP3, WAV or OGG.'); return; }
    picked.forEach(file => {
      const objectUrl = URL.createObjectURL(file);
      const cleanName = file.name.replace(/\.[^.]+$/, '').replace(/[_-]+/g, ' ').trim();
      tracks.push({ title: cleanName || file.name, artist: 'Added from your device', time: '--:--', objectUrl, fileName: file.name, demo: false });
    });
    renderPlaylist($('#search').value);
    const firstNew = tracks.length - picked.length;
    selectTrack(firstNew, false);
    toast(`${picked.length} song${picked.length === 1 ? '' : 's'} added to your library`);
    songFiles.value = '';
  });
  let searchTimer;
  $('#search').addEventListener('input', e => {
    renderPlaylist(e.target.value);
    clearTimeout(searchTimer);
    const query = e.target.value.trim();
    if (query.length >= 2) searchTimer = setTimeout(() => addHistory('search', query), 650);
  });
  $('#clearSearch').addEventListener('click', () => { $('#search').value = ''; renderPlaylist(''); $('#search').focus(); });
  $('#clearHistory').addEventListener('click', () => { recentHistory = []; searchHistory = []; saveHistory(); renderHistory(); toast('Search and play history cleared'); });

  addEventListener('resize', () => { camera.aspect = innerWidth / innerHeight; camera.updateProjectionMatrix(); renderer.setSize(innerWidth, innerHeight); });
})();