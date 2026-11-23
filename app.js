// Nimbus Client Website — live GitHub Releases + Download Counter (1,789+ base) & interactive HUD preview.
const REPO = "watrak77-prog/nimbus-launcher";
const BASE_DOWNLOADS = 1789;
const $ = (id) => document.getElementById(id);

let currentDownloads = BASE_DOWNLOADS;
let activeModCat = "all";

// Mobile menu
$("burger").addEventListener("click", () => $("nav-links").classList.toggle("open"));
document.querySelectorAll("#nav-links a").forEach((a) => a.addEventListener("click", () => $("nav-links").classList.remove("open")));

// ------------------------------------------------------------------ Interactive Showcase Tabs & HUD Toggles
document.querySelectorAll(".sc-tab").forEach((btn) => btn.addEventListener("click", () => {
	document.querySelectorAll(".sc-tab").forEach((b) => b.classList.toggle("active", b === btn));
	document.querySelectorAll(".sc-pane").forEach((p) => p.classList.toggle("active", p.id === "sc-" + btn.dataset.sc));
}));
document.querySelectorAll(".ht-chip").forEach((chip) => chip.addEventListener("click", () => {
	chip.classList.toggle("on");
	const target = $(chip.dataset.hw);
	if (target) target.classList.toggle("hidden", !chip.classList.contains("on"));
}));

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
	const tag = latest.tag || "v1.0.13";

	$("nav-ver").textContent = tag;
	$("hero-pill-text").textContent = `Version ${tag} live · Minecraft 1.21.11 – 26.3`;
	document.querySelectorAll(".js-ver-label").forEach((el) => {
		el.textContent = `Nimbus Client ${tag} · Windows 10/11`;
	});

	const setup = latest.setup;
	const portable = latest.portable;
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
				if (String(a.name || "").toLowerCase().endsWith(".exe")) ghDl += Number(a.download_count || 0);
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
			} : {},
			releases: list.slice(0, 6).map((r) => ({
				tag: r.tag_name, version: r.tag_name.replace(/^v/i, ""),
				published_at: r.published_at, url: r.html_url, notes: r.body || "",
			})),
		});
	} catch {
		renderReleaseData({ totalDownloads: BASE_DOWNLOADS, latest: { tag: "v1.0.13", version: "1.0.13" }, releases: [] });
	}
}

document.addEventListener("click", (e) => {
	const link = e.target.closest(".js-dl-setup, .js-dl-portable");
	if (!link) return;
	const bumped = Number(localStorage.getItem("nimbus_dl_bump") || 0) + 1;
	localStorage.setItem("nimbus_dl_bump", String(Math.min(bumped, 5)));
	currentDownloads += 1;
	$("stat-downloads").textContent = fmtNum(currentDownloads);
	showToast("Starting Nimbus Client download — thank you!");
});

renderModules();
fetchRelease();
