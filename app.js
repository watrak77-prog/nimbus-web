// Nimbus Client Website — live GitHub Releases + Download Counter (1,789+ base) & interactive HUD preview.
const REPO = "watrak77-prog/nimbus-launcher";
const BASE_DOWNLOADS = 1789;
const $ = (id) => document.getElementById(id);

let currentDownloads = BASE_DOWNLOADS;
let activeModCat = "all";

// Mobile menu
$("burger").addEventListener("click", () => $("nav-links").classList.toggle("open"));
document.querySelectorAll("#nav-links a").forEach((a) => a.addEventListener("click", () => $("nav-links").classList.remove("open")));

// ------------------------------------------------------------------ Cinematic Motion Graphic Engine
function initCinema() {
	const stage = $("cinema");
	const canvas = $("cinema-canvas");
	if (!stage || !canvas) return;
	const ctx = canvas.getContext("2d");
	if (!ctx) return;

	const reducedMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
	const SCENE_MS = 4800;
	const SCENE_META = [
		{
			pills: ["540+ FPS Stack", "Any Nickname", "Skins & Capes"],
			accent: [30, 215, 96],
			secondary: [56, 189, 248],
		},
		{
			pills: ["60+ Built-in Mods", "Pixel Waypoints", "Lunar-Grade HUD"],
			accent: [56, 189, 248],
			secondary: [129, 140, 248],
		},
		{
			pills: ["Sodium + Lithium", "Iris Shaders", "1.21.11 – 26.3"],
			accent: [129, 140, 248],
			secondary: [30, 215, 96],
		},
	];

	let sceneIdx = 0;
	let sceneTimer = null;
	const scenes = Array.from(stage.querySelectorAll(".cm-scene"));
	const segs = Array.from(stage.querySelectorAll(".cm-seg"));
	const pillEls = [$("cm-pill-1"), $("cm-pill-2"), $("cm-pill-3")];
	const pillTxts = [$("cm-p1-txt"), $("cm-p2-txt"), $("cm-p3-txt")];

	function setScene(idx) {
		sceneIdx = (idx + SCENE_META.length) % SCENE_META.length;
		scenes.forEach((el, i) => el.classList.toggle("active", i === sceneIdx));
		segs.forEach((seg, i) => {
			seg.classList.remove("active", "done");
			if (i < sceneIdx) seg.classList.add("done");
			if (i === sceneIdx) {
				void seg.offsetWidth; // restart progress bar animation
				seg.classList.add("active");
			}
		});
		const meta = SCENE_META[sceneIdx];
		pillEls.forEach((el) => el && el.classList.add("swap"));
		setTimeout(() => {
			meta.pills.forEach((txt, i) => { if (pillTxts[i]) pillTxts[i].textContent = txt; });
			pillEls.forEach((el) => el && el.classList.remove("swap"));
		}, 190);
		clearInterval(sceneTimer);
		sceneTimer = setInterval(() => setScene(sceneIdx + 1), SCENE_MS);
	}

	segs.forEach((seg) => seg.addEventListener("click", () => setScene(Number(seg.dataset.seg || 0))));
	setScene(0);

	// Subtle live telemetry flicker
	const fpsEl = $("cm-fps");
	const msEl = $("cm-ms");
	setInterval(() => {
		const fps = 518 + Math.round(Math.sin(performance.now() * 0.002) * 28 + Math.random() * 14);
		if (fpsEl) fpsEl.textContent = String(fps);
		if (msEl) msEl.textContent = (1000 / fps).toFixed(1);
	}, 650);

	// Mouse 3D tilt + parallax
	let mx = 0, my = 0, tx = 0, ty = 0;
	const centerEl = $("cm-center");
	stage.addEventListener("pointermove", (e) => {
		const r = stage.getBoundingClientRect();
		tx = ((e.clientX - r.left) / r.width - 0.5) * 2;
		ty = ((e.clientY - r.top) / r.height - 0.5) * 2;
		if (!reducedMotion) {
			stage.style.transform = `perspective(1000px) rotateY(${(tx * 4.5).toFixed(2)}deg) rotateX(${(-ty * 3.5).toFixed(2)}deg)`;
			if (centerEl) centerEl.style.transform = `translate(calc(-50% + ${(tx * 10).toFixed(1)}px), calc(-50% + ${(ty * 8).toFixed(1)}px))`;
		}
	});
	stage.addEventListener("pointerleave", () => {
		tx = 0; ty = 0;
		stage.style.transform = "";
		if (centerEl) centerEl.style.transform = "translate(-50%, -50%)";
	});

	// 3D Cube geometry (voxel blocks floating in space)
	const CUBE_VERTS = [
		[-1, -1, -1], [1, -1, -1], [1, 1, -1], [-1, 1, -1],
		[-1, -1, 1], [1, -1, 1], [1, 1, 1], [-1, 1, 1],
	];
	const CUBE_FACES = [
		[0, 1, 2, 3], [4, 5, 6, 7], [0, 1, 5, 4],
		[2, 3, 7, 6], [0, 3, 7, 4], [1, 2, 6, 5],
	];
	const cubes = [
		{ x: -0.35, y: -0.24, z: 0.9, size: 22, rx: 0.5, ry: 0.7, vx: 0.008, vy: 0.011, phase: 0.2, hue: "emerald" },
		{ x: 0.36, y: -0.20, z: 1.0, size: 19, rx: 1.1, ry: 0.2, vx: -0.009, vy: 0.010, phase: 1.8, hue: "cyan" },
		{ x: -0.37, y: 0.14, z: 0.85, size: 15, rx: 0.3, ry: 1.4, vx: 0.012, vy: -0.008, phase: 3.1, hue: "violet" },
		{ x: 0.35, y: 0.16, z: 0.95, size: 24, rx: 0.8, ry: 0.5, vx: -0.007, vy: -0.011, phase: 4.4, hue: "emerald" },
		{ x: 0.08, y: -0.33, z: 1.25, size: 12, rx: 1.5, ry: 0.9, vx: 0.013, vy: 0.009, phase: 2.5, hue: "cyan" },
		{ x: -0.14, y: 0.24, z: 1.2, size: 13, rx: 0.4, ry: 0.4, vx: -0.011, vy: 0.012, phase: 5.2, hue: "white" },
	];

	// Floating luminous particles
	const particles = Array.from({ length: 48 }, () => ({
		x: Math.random(),
		y: Math.random(),
		r: 0.8 + Math.random() * 1.9,
		vy: 0.00025 + Math.random() * 0.00055,
		vx: (Math.random() - 0.5) * 0.0002,
		alpha: 0.2 + Math.random() * 0.65,
		phase: Math.random() * Math.PI * 2,
	}));

	let W = 540, H = 448, dpr = 1;
	function resize() {
		const rect = stage.getBoundingClientRect();
		W = Math.max(300, rect.width);
		H = Math.max(300, rect.height);
		dpr = Math.min(window.devicePixelRatio || 1, 2);
		canvas.width = Math.round(W * dpr);
		canvas.height = Math.round(H * dpr);
		ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
	}
	resize();
	window.addEventListener("resize", resize);

	let curA = [30, 215, 96];
	let curB = [56, 189, 248];
	const lerp = (a, b, f) => a + (b - a) * f;

	function drawCube(c, t) {
		const cx = W * 0.5 + (c.x * W) + mx * 18;
		const cy = H * 0.43 + (c.y * H) + Math.sin(t * 0.0014 + c.phase) * 9 + my * 14;
		const ax = c.rx + t * 0.0006 * (c.vx > 0 ? 1 : -1);
		const ay = c.ry + t * 0.0008 * (c.vy > 0 ? 1 : -1);
		const cosX = Math.cos(ax), sinX = Math.sin(ax);
		const cosY = Math.cos(ay), sinY = Math.sin(ay);
		const s = c.size;

		const pts = CUBE_VERTS.map(([vx, vy, vz]) => {
			// rotate Y then X
			const x1 = vx * cosY - vz * sinY;
			const z1 = vx * sinY + vz * cosY;
			const y2 = vy * cosX - z1 * sinX;
			const z2 = vy * sinX + z1 * cosX;
			const p = 180 / (180 + z2 * s);
			return [cx + x1 * s * p, cy + y2 * s * p, z2];
		});

		const colors = {
			emerald: ["rgba(30, 215, 96, 0.14)", "rgba(74, 222, 128, 0.72)"],
			cyan: ["rgba(56, 189, 248, 0.14)", "rgba(125, 211, 252, 0.7)"],
			violet: ["rgba(139, 92, 246, 0.15)", "rgba(167, 139, 250, 0.72)"],
			white: ["rgba(226, 232, 240, 0.10)", "rgba(226, 232, 240, 0.55)"],
		}[c.hue];

		const sortedFaces = CUBE_FACES
			.map((f) => ({ f, z: (pts[f[0]][2] + pts[f[1]][2] + pts[f[2]][2] + pts[f[3]][2]) * 0.25 }))
			.sort((a, b) => a.z - b.z);

		for (const { f } of sortedFaces) {
			ctx.beginPath();
			ctx.moveTo(pts[f[0]][0], pts[f[0]][1]);
			ctx.lineTo(pts[f[1]][0], pts[f[1]][1]);
			ctx.lineTo(pts[f[2]][0], pts[f[2]][1]);
			ctx.lineTo(pts[f[3]][0], pts[f[3]][1]);
			ctx.closePath();
			ctx.fillStyle = colors[0];
			ctx.fill();
			ctx.strokeStyle = colors[1];
			ctx.lineWidth = 1.1;
			ctx.stroke();
		}
	}

	function frame(now) {
		mx = lerp(mx, tx, 0.06);
		my = lerp(my, ty, 0.06);
		const target = SCENE_META[sceneIdx];
		for (let i = 0; i < 3; i++) {
			curA[i] = lerp(curA[i], target.accent[i], 0.03);
			curB[i] = lerp(curB[i], target.secondary[i], 0.03);
		}
		const rgbA = `${curA[0] | 0}, ${curA[1] | 0}, ${curA[2] | 0}`;
		const rgbB = `${curB[0] | 0}, ${curB[1] | 0}, ${curB[2] | 0}`;

		ctx.clearRect(0, 0, W, H);

		// 1. Volumetric aurora nebulae
		const g1 = ctx.createRadialGradient(
			W * (0.28 + Math.sin(now * 0.0004) * 0.08 + mx * 0.05),
			H * (0.24 + Math.cos(now * 0.0005) * 0.06),
			10, W * 0.3, H * 0.25, W * 0.65
		);
		g1.addColorStop(0, `rgba(${rgbA}, 0.24)`);
		g1.addColorStop(1, "rgba(0,0,0,0)");
		ctx.fillStyle = g1;
		ctx.fillRect(0, 0, W, H);

		const g2 = ctx.createRadialGradient(
			W * (0.76 + Math.cos(now * 0.00045) * 0.07 - mx * 0.05),
			H * (0.34 + Math.sin(now * 0.00035) * 0.05),
			10, W * 0.74, H * 0.35, W * 0.58
		);
		g2.addColorStop(0, `rgba(${rgbB}, 0.22)`);
		g2.addColorStop(1, "rgba(0,0,0,0)");
		ctx.fillStyle = g2;
		ctx.fillRect(0, 0, W, H);

		// 2. 3D Perspective Minecraft Horizon Grid gliding forward
		const horizonY = H * 0.57 + my * 8;
		const vanishX = W * 0.5 + mx * 24;
		ctx.save();
		ctx.beginPath();
		ctx.rect(0, horizonY, W, H - horizonY);
		ctx.clip();

		// Horizontal perspective lines moving toward viewer
		const speed = (now * 0.00035) % 1;
		for (let i = 0; i < 12; i++) {
			const p = Math.pow((i + speed) / 12, 2.15);
			const y = horizonY + p * (H - horizonY);
			const alpha = Math.min(0.32, p * 0.42);
			ctx.strokeStyle = `rgba(${rgbA}, ${alpha.toFixed(3)})`;
			ctx.lineWidth = 1;
			ctx.beginPath();
			ctx.moveTo(0, y);
			ctx.lineTo(W, y);
			ctx.stroke();
		}
		// Vertical converging perspective beams
		for (let i = -8; i <= 8; i++) {
			const bottomX = vanishX + i * (W * 0.13);
			const grad = ctx.createLinearGradient(vanishX, horizonY, bottomX, H);
			grad.addColorStop(0, `rgba(${rgbB}, 0.02)`);
			grad.addColorStop(0.5, `rgba(${rgbA}, 0.18)`);
			grad.addColorStop(1, `rgba(${rgbA}, 0.03)`);
			ctx.strokeStyle = grad;
			ctx.lineWidth = 1;
			ctx.beginPath();
			ctx.moveTo(vanishX, horizonY);
			ctx.lineTo(bottomX, H);
			ctx.stroke();
		}
		ctx.restore();

		// Horizon glow line
		const hGlow = ctx.createLinearGradient(0, horizonY, W, horizonY);
		hGlow.addColorStop(0, "rgba(0,0,0,0)");
		hGlow.addColorStop(0.3, `rgba(${rgbA}, 0.35)`);
		hGlow.addColorStop(0.7, `rgba(${rgbB}, 0.35)`);
		hGlow.addColorStop(1, "rgba(0,0,0,0)");
		ctx.strokeStyle = hGlow;
		ctx.lineWidth = 1.4;
		ctx.beginPath();
		ctx.moveTo(0, horizonY);
		ctx.lineTo(W, horizonY);
		ctx.stroke();

		// 3. Animated FPS Performance Waveform along the horizon
		ctx.beginPath();
		for (let x = 0; x <= W; x += 6) {
			const nx = x / W;
			const env = Math.sin(nx * Math.PI);
			const wave =
				Math.sin(nx * 10 - now * 0.0032) * 9 +
				Math.sin(nx * 22 + now * 0.0021) * 4 +
				Math.cos(nx * 5 - now * 0.0014) * 6;
			const y = horizonY - 8 + wave * env;
			if (x === 0) ctx.moveTo(x, y);
			else ctx.lineTo(x, y);
		}
		ctx.strokeStyle = `rgba(${rgbA}, 0.42)`;
		ctx.lineWidth = 1.6;
		ctx.stroke();

		// 4. Floating luminous embers & stars
		for (const p of particles) {
			p.y -= p.vy;
			p.x += p.vx;
			if (p.y < -0.05) { p.y = 1.05; p.x = Math.random(); }
			if (p.x < -0.05) p.x = 1.05;
			if (p.x > 1.05) p.x = -0.05;
			const twinkle = 0.55 + 0.45 * Math.sin(now * 0.003 + p.phase);
			ctx.beginPath();
			ctx.arc(p.x * W + mx * 8, p.y * H + my * 6, p.r, 0, Math.PI * 2);
			ctx.fillStyle = `rgba(226, 240, 255, ${(p.alpha * twinkle).toFixed(3)})`;
			ctx.fill();
		}

		// 5. Rotating 3D Voxel Minecraft Cubes
		for (const c of cubes) drawCube(c, now);

		if (!reducedMotion) requestAnimationFrame(frame);
	}

	requestAnimationFrame(frame);
}
initCinema();

// ------------------------------------------------------------------ Interactive FPS Benchmark Presets
const FPS_PRESETS = {
	laptop: { nimbus: 195, vanilla: 54, nPct: 78, vPct: 22 },
	mid:    { nimbus: 480, vanilla: 135, nPct: 92, vPct: 26 },
	high:   { nimbus: 940, vanilla: 280, nPct: 98, vPct: 30 },
};
document.querySelectorAll(".pp-btn").forEach((btn) => btn.addEventListener("click", () => {
	document.querySelectorAll(".pp-btn").forEach((b) => b.classList.toggle("active", b === btn));
	const p = FPS_PRESETS[btn.dataset.preset] || FPS_PRESETS.mid;
	$("fps-nimbus").textContent = p.nimbus + " FPS";
	$("fps-vanilla").textContent = p.vanilla + " FPS";
	$("bar-nimbus").style.width = p.nPct + "%";
	$("bar-vanilla").style.width = p.vPct + "%";
}));

// ------------------------------------------------------------------ Built-in Modules Catalog
const MODULES = [
	{ name: "FPS Counter", cat: "hud", desc: "Frames per second HUD with custom background and colors." },
	{ name: "CPS Counter", cat: "hud", desc: "Real-time left and right click speed display." },
	{ name: "Keystrokes", cat: "hud", desc: "Live WASD, Space, and mouse button overlay." },
	{ name: "Potion Effects", cat: "hud", desc: "Clean active potion list or Vanilla icon timers." },
	{ name: "Armor Status", cat: "hud", desc: "Armor durability slots next to your hotbar with low warnings." },
	{ name: "Scoreboard", cat: "hud", desc: "Movable, scalable scoreboard with optional score hiding." },
	{ name: "Coordinates & Biome", cat: "hud", desc: "X/Y/Z coordinates, facing direction, and biome display." },
	{ name: "Direction HUD", cat: "hud", desc: "Clean top-of-screen compass bar." },
	{ name: "Ping & Tab Numbers", cat: "hud", desc: "Live ping HUD plus numeric ping in the tab list." },
	{ name: "Combo & Reach", cat: "hud", desc: "Hit combo counter and last attack reach distance." },
	{ name: "Totem & Potion Counter", cat: "hud", desc: "Remaining Totems of Undying and healing potions counter." },
	{ name: "Speed & Memory", cat: "hud", desc: "Movement speed (b/s) and JVM memory usage." },
	{ name: "Waypoints", cat: "render", desc: "Jitter-free world/server waypoints + automatic death markers." },
	{ name: "Team View", cat: "render", desc: "Live teammate markers with Hypixel Mod API support." },
	{ name: "Crosshair Editor", cat: "render", desc: "Pixel-by-pixel custom crosshair designer & presets." },
	{ name: "Combat Hitboxes", cat: "render", desc: "Player hitboxes that highlight red when within reach." },
	{ name: "Fullbright & No Fog", cat: "render", desc: "Fullbright plus per-type lava, water, and terrain fog toggles." },
	{ name: "Time & Weather Changer", cat: "render", desc: "Client-side custom time of day and weather." },
	{ name: "Low Fire & Low Shield", cat: "render", desc: "Lowered first-person fire and shield overlays." },
	{ name: "TNT Countdown", cat: "render", desc: "Explosion countdown timer displayed above primed TNT." },
	{ name: "Block Outline & Hit Color", cat: "render", desc: "Custom block selection outline and damage tint color." },
	{ name: "Freelook (Perspective)", cat: "mechanic", desc: "360° free camera look without changing movement direction." },
	{ name: "Smooth Zoom", cat: "mechanic", desc: "Cinematic zoom with scroll-wheel magnification." },
	{ name: "Toggle Sprint & Sneak", cat: "mechanic", desc: "Toggleable sprint and sneak with HUD status indicator." },
	{ name: "No Hurt Cam", cat: "mechanic", desc: "Removes screen shake when taking damage." },
	{ name: "Host World", cat: "mechanic", desc: "Host singleplayer worlds online via e4mc / UPnP in 1 click." },
	{ name: "Proxy Tunnel", cat: "mechanic", desc: "Built-in per-server or global SOCKS5 / SOCKS4 / HTTP proxy." },
	{ name: "AutoText & Hotkeys", cat: "mechanic", desc: "Custom chat/command hotkeys and chat-triggered actions." },
	{ name: "Shulker & Food Preview", cat: "mechanic", desc: "Shulker box tooltip preview and hunger saturation overlay." },
	{ name: "Sound Volumes", cat: "mechanic", desc: "Per-sound volume mixer for any Minecraft sound effect." },
	{ name: "Sodium", cat: "perf", desc: "Modern rendering engine for massive FPS boosts." },
	{ name: "Lithium", cat: "perf", desc: "Faster game physics, AI, and chunk ticking." },
	{ name: "FerriteCore", cat: "perf", desc: "Drastically reduces Minecraft RAM usage." },
	{ name: "Entity & More Culling", cat: "perf", desc: "Skips rendering hidden entities and occluded block faces." },
	{ name: "ImmediatelyFast", cat: "perf", desc: "Accelerates HUD, text, block entity, and entity rendering." },
	{ name: "Iris Shaders & Flashback", cat: "perf", desc: "Optional 1-click Iris Shaders and Flashback replay recorder." },
];

function esc(s) {
	return String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
}

function renderModules() {
	const q = ($("mod-search").value || "").trim().toLowerCase();
	const list = MODULES.filter((m) => {
		if (activeModCat !== "all" && m.cat !== activeModCat) return false;
		if (!q) return true;
		return (m.name + " " + m.desc).toLowerCase().includes(q);
	});
	const grid = $("mod-grid");
	if (!list.length) {
		grid.innerHTML = '<div class="ch-skeleton">No matching modules.</div>';
		return;
	}
	grid.innerHTML = list.map((m) => `<div class="m-item">
		<div class="m-top">
			<strong>${esc(m.name)}</strong>
			<span class="m-tag ${m.cat}">${m.cat === "perf" ? "FPS" : m.cat}</span>
		</div>
		<p>${esc(m.desc)}</p>
	</div>`).join("");
}

document.querySelectorAll(".mc-cat").forEach((btn) => btn.addEventListener("click", () => {
	activeModCat = btn.dataset.cat;
	document.querySelectorAll(".mc-cat").forEach((b) => b.classList.toggle("active", b === btn));
	renderModules();
}));
$("mod-search").addEventListener("input", renderModules);

// ------------------------------------------------------------------ Live Release & Download Counter
function fmtNum(n) {
	return Number(n || 0).toLocaleString("en-US");
}

function fmtMB(bytes) {
	if (!bytes) return "";
	return (bytes / (1024 * 1024)).toFixed(1) + " MB";
}

function animateCounter(el, target) {
	const start = Math.max(0, target - 85);
	const duration = 700;
	const t0 = performance.now();
	function step(now) {
		const p = Math.min(1, (now - t0) / duration);
		const eased = 1 - Math.pow(1 - p, 3);
		el.textContent = fmtNum(Math.round(start + (target - start) * eased));
		if (p < 1) requestAnimationFrame(step);
	}
	requestAnimationFrame(step);
}

function showToast(msg) {
	const t = $("toast");
	t.textContent = msg;
	t.classList.add("show");
	clearTimeout(t._h);
	t._h = setTimeout(() => t.classList.remove("show"), 3200);
}

function renderReleaseData(data) {
	const latest = data.latest || {};
	const tag = latest.tag || "v1.0.15";

	$("nav-ver").textContent = tag;
	$("hero-pill-text").textContent = `Version ${tag} live · Windows & Linux Mint · MC 1.21.11 – 26.3`;
	document.querySelectorAll(".js-ver-label").forEach((el) => {
		el.textContent = `Nimbus Client ${tag} · Windows 10/11`;
	});
	document.querySelectorAll(".js-linux-ver-label").forEach((el) => {
		el.textContent = `NimbusLauncher.deb · ${tag} · Mint / Ubuntu`;
	});

	const setup = latest.setup;
	const portable = latest.portable;
	const linuxDeb = latest.linuxDeb;
	const linuxTar = latest.linuxTar;
	if (setup && setup.url) {
		document.querySelectorAll(".js-dl-setup").forEach((a) => { a.href = setup.url; });
		const sz = fmtMB(setup.size);
		$("dl-setup-meta").textContent = `NimbusSetup.exe · ${tag}${sz ? " · " + sz : ""}`;
	}
	if (portable && portable.url) {
		document.querySelectorAll(".js-dl-portable").forEach((a) => { a.href = portable.url; });
		const sz = fmtMB(portable.size);
		$("dl-portable-meta").textContent = `NimbusLauncher.exe · ${tag}${sz ? " · " + sz : ""}`;
	}
	if (linuxDeb && linuxDeb.url) {
		document.querySelectorAll(".js-dl-linux").forEach((a) => { a.href = linuxDeb.url; });
		const sz = fmtMB(linuxDeb.size);
		if ($("dl-linux-meta")) $("dl-linux-meta").textContent = `NimbusLauncher.deb · ${tag}${sz ? " · " + sz : ""}`;
	}
	if (linuxTar && linuxTar.url) {
		document.querySelectorAll(".js-dl-linux-tar").forEach((a) => { a.href = linuxTar.url; });
		const sz = fmtMB(linuxTar.size);
		if ($("dl-linux-tar-meta")) $("dl-linux-tar-meta").textContent = `NimbusLauncher-linux.tar.gz · ${tag}${sz ? " · " + sz : ""}`;
	}

	const localClicks = Number(localStorage.getItem("nimbus_dl_bump") || 0);
	currentDownloads = Math.max(BASE_DOWNLOADS, Number(data.totalDownloads || BASE_DOWNLOADS)) + localClicks;
	animateCounter($("stat-downloads"), currentDownloads);

	const list = data.releases || [];
	const box = $("changelog-list");
	if (!list.length) {
		box.innerHTML = '<div class="ch-skeleton">See full release history on GitHub.</div>';
		return;
	}
	box.innerHTML = list.map((r) => {
		const date = r.published_at
			? new Date(r.published_at).toLocaleDateString("en-US", { dateStyle: "medium" })
			: "";
		const notes = String(r.notes || "").trim() || `Nimbus Launcher ${r.tag}`;
		return `<article class="ch-card">
			<div class="ch-head">
				<span class="ch-tag">${esc(r.tag)}</span>
				<span class="ch-date">${esc(date)}</span>
			</div>
			<p class="ch-body">${esc(notes)}</p>
			<a class="ch-link" href="${esc(r.url)}" target="_blank" rel="noopener">View release on GitHub →</a>
		</article>`;
	}).join("");
}

async function fetchRelease() {
	try {
		const r = await fetch("/api/release");
		if (r.ok) {
			const ct = r.headers.get("content-type") || "";
			if (ct.includes("application/json")) {
				renderReleaseData(await r.json());
				return;
			}
		}
	} catch { /* local static preview fallback below */ }

	try {
		const gh = await fetch(`https://api.github.com/repos/${REPO}/releases?per_page=30`);
		if (!gh.ok) throw new Error("gh");
		const list = (await gh.json()).filter((x) => !x.draft && !x.prerelease);
		let ghDl = 0;
		for (const r of list) {
			for (const a of r.assets || []) {
				const n = String(a.name || "").toLowerCase();
				if (n.endsWith(".exe") || n.endsWith(".deb") || n.endsWith(".tar.gz")) ghDl += Number(a.download_count || 0);
			}
		}
		const top = list[0];
		const pick = (n) => {
			const a = (top && top.assets || []).find((x) => x.name.toLowerCase() === n.toLowerCase());
			return a ? { name: a.name, url: a.browser_download_url, size: a.size, downloads: a.download_count } : null;
		};
		renderReleaseData({
			totalDownloads: BASE_DOWNLOADS + ghDl,
			latest: top ? {
				tag: top.tag_name, version: top.tag_name.replace(/^v/i, ""), published_at: top.published_at,
				url: top.html_url, notes: top.body || "",
				setup: pick("NimbusSetup.exe"), portable: pick("NimbusLauncher.exe"),
				linuxDeb: pick("NimbusLauncher.deb"), linuxTar: pick("NimbusLauncher-linux.tar.gz"),
			} : {},
			releases: list.slice(0, 6).map((r) => ({
				tag: r.tag_name, version: r.tag_name.replace(/^v/i, ""),
				published_at: r.published_at, url: r.html_url, notes: r.body || "",
			})),
		});
	} catch {
		renderReleaseData({ totalDownloads: BASE_DOWNLOADS, latest: { tag: "v1.0.15", version: "1.0.15" }, releases: [] });
	}
}

// OS Platform Switcher (auto-detects Linux Mint / Ubuntu)
function setOsTab(os) {
	const isLin = os === "linux";
	document.querySelectorAll(".os-tab").forEach((b) => {
		const on = b.dataset.os === (isLin ? "linux" : "win");
		b.classList.toggle("active", on);
		b.setAttribute("aria-selected", on ? "true" : "false");
	});
	$("cta-win").classList.toggle("os-hidden", isLin);
	$("cta-linux").classList.toggle("os-hidden", !isLin);
	$("linux-cmd").classList.toggle("os-hidden", !isLin);
	const navDl = document.querySelector(".btn-nav-dl");
	if (navDl) {
		navDl.classList.toggle("js-dl-linux", isLin);
		navDl.classList.toggle("js-dl-setup", !isLin);
		navDl.href = isLin ? ($("dl-linux")?.href || "/download/linux") : ($("dl-setup")?.href || "/download");
	}
}
document.querySelectorAll(".os-tab").forEach((b) => b.addEventListener("click", () => setOsTab(b.dataset.os)));
if ($("lc-copy")) {
	$("lc-copy").addEventListener("click", () => {
		navigator.clipboard?.writeText("sudo apt install ./NimbusLauncher.deb").then(() => showToast("Copied apt install command!"));
	});
}
if (/Linux/i.test(navigator.userAgent) && !/Android/i.test(navigator.userAgent)) {
	setOsTab("linux");
}

document.addEventListener("click", (e) => {
	const link = e.target.closest(".js-dl-setup, .js-dl-portable, .js-dl-linux, .js-dl-linux-tar");
	if (!link) return;
	const bumped = Number(localStorage.getItem("nimbus_dl_bump") || 0) + 1;
	localStorage.setItem("nimbus_dl_bump", String(Math.min(bumped, 5)));
	currentDownloads += 1;
	$("stat-downloads").textContent = fmtNum(currentDownloads);
	showToast("Starting Nimbus Client download — thank you!");
});

renderModules();
fetchRelease();
