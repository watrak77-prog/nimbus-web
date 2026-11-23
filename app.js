// Nimbus Client Website — live GitHub Releases + Download Counter (1789+ base), interactive HUD preview, PL/EN i18n.
const REPO = "watrak77-prog/nimbus-launcher";
const BASE_DOWNLOADS = 1789;
const $ = (id) => document.getElementById(id);

let lang = (localStorage.getItem("nimbus_lang") || "pl") === "en" ? "en" : "pl";
let currentDownloads = BASE_DOWNLOADS;
let activeModCat = "all";
let latestData = null;

// ------------------------------------------------------------------ i18n (PL / EN)
const I18N = {
	pl: {
		nav_features: "Funkcje", nav_modules: "Moduły", nav_versions: "Wersje", nav_changelog: "Zmiany", nav_faq: "FAQ",
		nav_download: "Pobierz",
		hero_title: "Minecraft szybszy.<br><span>Czystszy. Twój.</span>",
		hero_sub: "Nowoczesny klient i launcher Minecraft na Fabric inspirowany najlepszymi klientami PvP — 60+ wbudowanych modułów, stos FPS, pixel-locked Waypointy, własne skiny i pelerynki oraz Modrinth Explorer. Całkowicie za darmo, bez paywalli.",
		dl_setup_title: "Pobierz Instalator",
		dl_portable_title: "Wersja Portable",
		meta_safe: "Nie dotyka folderu .minecraft (read-only)",
		meta_autoupdate: "Auto-aktualizacje przez GitHub",
		stat_downloads: "Pobrań", stat_versions: "Wersji MC (1.21–26.3)", stat_modules: "Wbudowanych modułów", stat_free: "Darmowy",
		sc_tab_hud: "HUD w grze", sc_tab_menu: "Menu główne", sc_tab_launcher: "Launcher", sc_try: "Przetestuj moduły:",
		perf_eye: "OPTYMALIZACJA FABRIC",
		perf_title: "Wbudowany stos FPS, który działa od pierwszego kliknięcia",
		perf_desc: "Nimbus automatycznie dobiera i aktualizuje Sodium, Lithium, FerriteCore, EntityCulling, MoreCulling i ImmediatelyFast dla każdej wersji Minecraft — zero ręcznego szukania kompatybilnych plików .jar.",
		perf_laptop: "Laptop / iGPU", perf_mid: "Średni PC", perf_high: "Gaming PC",
		perf_note: "* Wartości orientacyjne (12 chunków, 1080p, świat singleplayer) — realny przyrost zależy od karty graficznej i procesora.",
		feat_eye: "DLACZEGO NIMBUS",
		feat_title: "Wszystko, czego potrzebujesz — w jednym lekkim kliencie",
		feat_sub: "Zaprojektowany od zera bez zbędnego obciążenia, w pełni zgodny z ekosystemem Fabric i Modrinth.",
		f1_t: "Inteligentny stos FPS", f1_d: "Sodium, Lithium, FerriteCore, EntityCulling, MoreCulling i ImmediatelyFast zarządzane osobno dla każdej wersji, z automatycznym wykrywaniem konfliktów.",
		f2_t: "Edytor HUD i 60+ modułów", f2_d: "Przeciągaj elementy HUD z przyciąganiem do linii, skaluj kółkiem myszy, twórz profile ustawień i personalizuj wygląd jednym klawiszem.",
		f3_t: "Płynne Waypointy i Team View", f3_d: "Waypointy z dokładną projekcją kamery (zero drgania), automatyczne punkty śmierci oraz wsparcie dla Team View na Hypixelu.",
		f4_t: "Własne skiny i 50+ pelerynek", f4_d: "Ustaw skina dowolnego gracza lub wgraj własny plik PNG bezpośrednio w launcherze albo w grze — plus kolekcja ponad 50 oficjalnych pelerynek.",
		f5_t: "Host World i Tunel Proxy", f5_d: "Udostępniaj swój świat singleplayer znajomym przez internet jednym kliknięciem (e4mc / UPnP) oraz łącz się z serwerami przez SOCKS5/HTTP proxy.",
		f6_t: "Modrinth, Profile i Backupy", f6_d: "Instaluj mody, paczki tekstur i shadery prosto z Modrinth, twórz izolowane profile modów, uruchamiaj wybrane światy i rób kopie .zip 1 kliknięciem.",
		mod_eye: "WBUDOWANE MODUŁY", mod_title: "Ponad 60 modułów gotowych od razu po instalacji",
		cat_all: "Wszystkie", cat_mech: "Mechaniki",
		ver_eye: "WSPARCIE WERSJI", ver_title: "Jedna aplikacja na najnowsze wersje Minecrafta",
		ver_sub: "Każda wersja Nimbusa ma własny, odizolowany zestaw modów Fabric — a launcher pozwala też uruchamiać starsze wersje Vanilla i Fabric.",
		ch_eye: "HISTORIA WYDAŃ", ch_title: "Ostatnie aktualizacje na żywo z GitHub", ch_all: "Wszystkie wydania",
		s1_t: "Pobierz instalator", s1_d: "Kliknij „Pobierz Instalator” (NimbusSetup.exe) albo wybierz wersję Portable bez instalacji.",
		s2_t: "Wybierz nick i wersję", s2_d: "Launcher automatycznie zaimportuje Twoje serwery i ustawienia z .minecraft (tylko do odczytu).",
		s3_t: "Graj z pełnym FPS", s3_d: "Kliknij LAUNCH GAME — Fabric, Java i mody wydajnościowe pobiorą się same. W grze wciśnij prawy Shift.",
		faq_title: "Najczęściej zadawane pytania",
		q1: "Czy Nimbus Client modyfikuje mój folder .minecraft?",
		a1: "Nie! Folder .minecraft jest traktowany wyłącznie do odczytu (read-only). Wszystkie pliki, mody, konfiguracje i światy Nimbusa zapisują się w osobnym, bezpiecznym katalogu ~/.nimbusclient.",
		q2: "Windows SmartScreen pokazał komunikat „System Windows ochronił ten komputer” — czy plik jest bezpieczny?",
		a2: "Tak. Komunikat SmartScreen pojawia się w Windows przy każdym nowym programie indie, który nie posiada płatnego certyfikatu EV (kosztującego kilka tysięcy zł rocznie). Wystarczy kliknąć „Więcej informacji” → „Uruchom mimo to”. Wszystkie wydania są publikowane bezpośrednio w publicznym repozytorium GitHub.",
		q3: "Czy potrzebuję konta premium Minecraft, żeby korzystać z Nimbusa?",
		a3: "Nie — launcher obsługuje konta offline (non-premium), dzięki czemu możesz grać w singleplayer oraz na serwerach non-premium, a dodatkowo ustawić własnego skina i pelerynkę w zakładce Skins.",
		q4: "Jak aktualizować Nimbus Launcher i moda w środku?",
		a4: "Launcher automatycznie sprawdza najnowszy release na GitHubie przy każdym uruchomieniu (albo po kliknięciu „Check Updates” w Settings) i aktualizuje jednocześnie siebie oraz wszystkie 6 wersji moda Nimbus.",
		q5: "Czy mogę dodawać własne mody Fabric, paczki tekstur i shadery?",
		a5: "Tak! Możesz pobierać je 1 kliknięciem w zakładce Explore (Modrinth) albo po prostu przeciągnąć własne pliki .jar / .zip do zakładki Content. Dodatkowo możesz tworzyć osobne profile (np. PvP i Survival) z oddzielnymi modami.",
		fc_title: "Gotowy na płynniejszego Minecrafta?",
		fc_sub: "Dołącz do graczy korzystających z Nimbus Client. Instalacja trwa mniej niż 30 sekund.",
		footer_disc: "Nieoficjalny projekt Minecraft. Nie jest zatwierdzony przez ani powiązany z Mojang AB lub Microsoft.",
		search_ph: "Szukaj modułu (np. Waypoints, Zoom)…",
		dl_toast: "Rozpoczęto pobieranie Nimbus Client — dzięki!",
		view_gh: "Zobacz wydanie na GitHub →",
	},
	en: {
		nav_features: "Features", nav_modules: "Modules", nav_versions: "Versions", nav_changelog: "Changelog", nav_faq: "FAQ",
		nav_download: "Download",
		hero_title: "Play Minecraft Faster.<br><span>Cleaner. Yours.</span>",
		hero_sub: "A modern Fabric Minecraft client & launcher inspired by top PvP clients — 60+ built-in modules, automatic FPS stack, pixel-locked Waypoints, custom Skins & Capes, and Modrinth Explorer. 100% free, zero paywalls.",
		dl_setup_title: "Download Installer",
		dl_portable_title: "Portable Build",
		meta_safe: "Never modifies .minecraft (read-only)",
		meta_autoupdate: "Auto-updates via GitHub Releases",
		stat_downloads: "Downloads", stat_versions: "MC Versions (1.21–26.3)", stat_modules: "Built-in Modules", stat_free: "Free Forever",
		sc_tab_hud: "In-Game HUD", sc_tab_menu: "Title Screen", sc_tab_launcher: "Launcher", sc_try: "Try modules:",
		perf_eye: "FABRIC OPTIMIZATION",
		perf_title: "Built-in FPS stack that works out of the box",
		perf_desc: "Nimbus automatically fetches and updates Sodium, Lithium, FerriteCore, EntityCulling, MoreCulling, and ImmediatelyFast per Minecraft version — with automatic mod conflict checks.",
		perf_laptop: "Laptop / iGPU", perf_mid: "Mid-Range PC", perf_high: "Gaming PC",
		perf_note: "* Illustrative benchmarks (12 render distance, 1080p singleplayer) — actual gains depend on your CPU & GPU.",
		feat_eye: "WHY NIMBUS",
		feat_title: "Everything you need — in one lightweight client",
		feat_sub: "Built from the ground up with zero bloat, fully compatible with the Fabric & Modrinth ecosystem.",
		f1_t: "Smart FPS Stack", f1_d: "Sodium, Lithium, FerriteCore, EntityCulling, MoreCulling, and ImmediatelyFast managed per version with automatic compatibility checks.",
		f2_t: "HUD Editor & 60+ Modules", f2_d: "Drag HUD elements with snap guides, scroll to resize, switch setting profiles, and customize everything with Right Shift.",
		f3_t: "Smooth Waypoints & Team View", f3_d: "Exact camera-projected waypoints (zero jitter), automatic death markers, and Hypixel Team View integration.",
		f4_t: "Custom Skins & 50+ Capes", f4_d: "Wear any premium player's skin or upload your own PNG right from the launcher or in-game — plus 50+ official Minecraft capes.",
		f5_t: "Host World & Proxy Tunnel", f5_d: "Host singleplayer worlds over the internet in 1 click (e4mc / UPnP) and connect to servers through SOCKS5/HTTP proxies.",
		f6_t: "Modrinth, Profiles & Backups", f6_d: "Install Mods, Resource Packs, and Shaders straight from Modrinth, create isolated mod profiles, launch worlds directly, and zip backups.",
		mod_eye: "BUILT-IN MODULES", mod_title: "Over 60 modules ready right after install",
		cat_all: "All", cat_mech: "Mechanics",
		ver_eye: "VERSION SUPPORT", ver_title: "One client for the newest Minecraft releases",
		ver_sub: "Each Nimbus version gets its own isolated Fabric mods folder — and the launcher also runs older Vanilla & Fabric versions.",
		ch_eye: "RELEASE HISTORY", ch_title: "Live changelog straight from GitHub", ch_all: "All Releases",
		s1_t: "Download Installer", s1_d: "Click Download Installer (NimbusSetup.exe) or grab the zero-install Portable .exe.",
		s2_t: "Pick Nickname & Version", s2_d: "The launcher imports your servers and settings from .minecraft safely in read-only mode.",
		s3_t: "Play at Full FPS", s3_d: "Hit LAUNCH GAME — Fabric, Java, and performance mods install automatically. Press Right Shift in-game.",
		faq_title: "Frequently Asked Questions",
		q1: "Does Nimbus Client modify my .minecraft folder?",
		a1: "Never! Your .minecraft directory is strictly read-only. All Nimbus files, mods, profiles, configs, and worlds live in an isolated ~/.nimbusclient folder.",
		q2: "Windows SmartScreen showed 'Windows protected your PC' — is it safe?",
		a2: "Yes. Windows SmartScreen warns on indie executables that aren't signed with an expensive EV certificate. Click 'More info' → 'Run anyway'. Every build is published openly on GitHub Releases.",
		q3: "Do I need a premium Minecraft account to use Nimbus?",
		a3: "No — the launcher supports offline accounts for singleplayer and non-premium servers, complete with custom PNG/player skins and capes.",
		q4: "How do updates work?",
		a4: "The launcher automatically checks GitHub Releases on launch (or via Check Updates in Settings) and updates both itself and all 6 bundled Nimbus mod jars.",
		q5: "Can I add custom Fabric mods, resource packs, and shaders?",
		a5: "Yes! Browse and install them in 1 click from Explore (Modrinth) or drag & drop .jar / .zip files into Content. You can also create separate mod profiles (e.g. PvP vs Survival).",
		fc_title: "Ready for a faster Minecraft?",
		fc_sub: "Join players running Nimbus Client. Setup takes under 30 seconds.",
		footer_disc: "Not an official Minecraft product. Not approved by or associated with Mojang AB or Microsoft.",
		search_ph: "Search modules (e.g. Waypoints, Zoom, Sodium)…",
		dl_toast: "Starting Nimbus Client download — thank you!",
		view_gh: "View release on GitHub →",
	},
};

function applyLang() {
	document.documentElement.lang = lang;
	$("lang-toggle").textContent = lang.toUpperCase();
	const dict = I18N[lang];
	document.querySelectorAll("[data-i18n]").forEach((el) => {
		const k = el.dataset.i18n;
		if (dict[k]) el.textContent = dict[k];
	});
	document.querySelectorAll("[data-i18n-html]").forEach((el) => {
		const k = el.dataset.i18nHtml;
		if (dict[k]) el.innerHTML = dict[k];
	});
	$("mod-search").placeholder = dict.search_ph;
	if (latestData) renderReleaseData(latestData);
	renderModules();
}

$("lang-toggle").addEventListener("click", () => {
	lang = lang === "pl" ? "en" : "pl";
	localStorage.setItem("nimbus_lang", lang);
	applyLang();
});

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
	{ name: "FPS Counter", cat: "hud", pl: "Licznik klatek na sekundę z opcjami tła i kolorów.", en: "Frames per second HUD with custom background and colors." },
	{ name: "CPS Counter", cat: "hud", pl: "Oddzielny licznik kliknięć LPM i PPM w czasie rzeczywistym.", en: "Real-time left and right click speed display." },
	{ name: "Keystrokes", cat: "hud", pl: "Podświetlane klawisze WASD, Spacja oraz przyciski myszy.", en: "Live WASD, Space, and mouse button overlay." },
	{ name: "Potion Effects", cat: "hud", pl: "Czytelna lista efektów mikstur lub timery na ikonach Vanilla.", en: "Clean active potion list or Vanilla icon timers." },
	{ name: "Armor Status", cat: "hud", pl: "Wytrzymałość zbroi i tarczy obok paska szybkiego wyboru.", en: "Armor durability slots next to your hotbar with low warnings." },
	{ name: "Scoreboard", cat: "hud", pl: "Przesuwalny i skalowalny scoreboard z opcją ukrycia czerwonych liczb.", en: "Movable, scalable scoreboard with optional score hiding." },
	{ name: "Coordinates & Biome", cat: "hud", pl: "Współrzędne X/Y/Z, kierunek świata i nazwa biomu.", en: "X/Y/Z coordinates, facing direction, and biome display." },
	{ name: "Direction HUD", cat: "hud", pl: "Kompas u góry ekranu w stylu Lunar Client.", en: "Clean top-of-screen compass bar." },
	{ name: "Ping & Tab Numbers", cat: "hud", pl: "Aktualny ping na HUD oraz liczbowy ping na Tab-liście.", en: "Live ping HUD plus numeric ping in the tab list." },
	{ name: "Combo & Reach", cat: "hud", pl: "Licznik serii trafień oraz dystans ostatniego ciosu.", en: "Hit combo counter and last attack reach distance." },
	{ name: "Totem & Potion Counter", cat: "hud", pl: "Liczba totemów i mikstur leczenia w ekwipunku.", en: "Remaining Totems of Undying and healing potions counter." },
	{ name: "Speed & Memory", cat: "hud", pl: "Prędkość poruszania (b/s) i zużycie pamięci RAM.", en: "Movement speed (b/s) and JVM memory usage." },
	{ name: "Waypoints", cat: "render", pl: "Pixel-locked waypointy per serwer/świat + auto Death Waypoint.", en: "Jitter-free world/server waypoints + automatic death markers." },
	{ name: "Team View", cat: "render", pl: "Znaczniki drużyny na żywo (kompatybilne z Hypixel Mod API).", en: "Live teammate markers with Hypixel Mod API support." },
	{ name: "Crosshair Editor", cat: "render", pl: "Edytor celownika piksel-po-pikselu + gotowe presety.", en: "Pixel-by-pixel custom crosshair designer & presets." },
	{ name: "Combat Hitboxes", cat: "render", pl: "Hitboxy graczy zmieniające kolor, gdy cel jest w zasięgu.", en: "Player hitboxes that highlight red when within reach." },
	{ name: "Fullbright & No Fog", cat: "render", pl: "Pełna jasność i niezależne usuwanie mgły lawy, wody i terenu.", en: "Fullbright plus per-type lava, water, and terrain fog toggles." },
	{ name: "Time & Weather Changer", cat: "render", pl: "Własna pora dnia i pogoda po stronie klienta.", en: "Client-side custom time of day and weather." },
	{ name: "Low Fire & Low Shield", cat: "render", pl: "Obniżony ogień i tarcza dla lepszej widoczności w PvP.", en: "Lowered first-person fire and shield overlays." },
	{ name: "TNT Countdown", cat: "render", pl: "Licznik czasu do wybuchu nad odpalonym TNT.", en: "Explosion countdown timer displayed above primed TNT." },
	{ name: "Block Outline & Hit Color", cat: "render", pl: "Własny kolor obrysu bloku oraz błysku obrażeń.", en: "Custom block selection outline and damage tint color." },
	{ name: "Freelook (Perspective)", cat: "mechanic", pl: "Rozglądanie się kamerą 360° bez obracania postaci.", en: "360° free camera look without changing movement direction." },
	{ name: "Smooth Zoom", cat: "mechanic", pl: "Płynny zoom z regulacją przybliżenia kółkiem myszy.", en: "Cinematic zoom with scroll-wheel magnification." },
	{ name: "Toggle Sprint & Sneak", cat: "mechanic", pl: "Stały sprint/kucanie jednym naciśnięciem klawisza.", en: "Toggleable sprint and sneak with HUD status indicator." },
	{ name: "No Hurt Cam", cat: "mechanic", pl: "Usuwa trzęsienie kamery przy otrzymywaniu obrażeń.", en: "Removes screen shake when taking damage." },
	{ name: "Host World", cat: "mechanic", pl: "Hostuj świat znajomym przez internet (e4mc / UPnP) bez konfiguracji.", en: "Host singleplayer worlds online via e4mc / UPnP in 1 click." },
	{ name: "Proxy Tunnel", cat: "mechanic", pl: "Wbudowane łączenie z serwerami przez SOCKS5 / SOCKS4 / HTTP.", en: "Built-in per-server or global SOCKS5 / SOCKS4 / HTTP proxy." },
	{ name: "AutoText & Hotkeys", cat: "mechanic", pl: "Szybkie komendy pod skrótami klawiszowymi i auto-akcje czatu.", en: "Custom chat/command hotkeys and chat-triggered actions." },
	{ name: "Shulker & Food Preview", cat: "mechanic", pl: "Podgląd zawartości shulkerów oraz dokładnej saturacji jedzenia.", en: "Shulker box tooltip preview and hunger saturation overlay." },
	{ name: "Sound Volumes", cat: "mechanic", pl: "Indywidualna głośność dla każdego pojedynczego dźwięku w grze.", en: "Per-sound volume mixer for any Minecraft sound effect." },
	{ name: "Sodium", cat: "perf", pl: "Nowoczesny silnik renderowania — ogromny wzrost FPS.", en: "Modern rendering engine for massive FPS boosts." },
	{ name: "Lithium", cat: "perf", pl: "Szybsza fizyka, AI mobów i logika chunków bez zmiany mechanik.", en: "Faster game physics, AI, and chunk ticking." },
	{ name: "FerriteCore", cat: "perf", pl: "Znacznie mniejsze zużycie pamięci RAM przez grę.", en: "Drastically reduces Minecraft RAM usage." },
	{ name: "Entity & More Culling", cat: "perf", pl: "Pomija rysowanie niewidocznych mobów i zasłoniętych ścian bloków.", en: "Skips rendering hidden entities and occluded block faces." },
	{ name: "ImmediatelyFast", cat: "perf", pl: "Przyspiesza renderowanie HUD, tekstu, skrzyń i bytów.", en: "Accelerates HUD, text, block entity, and entity rendering." },
	{ name: "Iris Shaders & Flashback", cat: "perf", pl: "Opcjonalne shadery Iris oraz nagrywanie powtórek Flashback.", en: "Optional 1-click Iris Shaders and Flashback replay recorder." },
];

function renderModules() {
	const q = ($("mod-search").value || "").trim().toLowerCase();
	const list = MODULES.filter((m) => {
		if (activeModCat !== "all" && m.cat !== activeModCat) return false;
		if (!q) return true;
		return (m.name + " " + m.pl + " " + m.en).toLowerCase().includes(q);
	});
	const grid = $("mod-grid");
	if (!list.length) {
		grid.innerHTML = `<div class="ch-skeleton">${lang === "pl" ? "Brak pasujących modułów." : "No matching modules."}</div>`;
		return;
	}
	grid.innerHTML = list.map((m) => `<div class="m-item">
		<div class="m-top">
			<strong>${esc(m.name)}</strong>
			<span class="m-tag ${m.cat}">${m.cat === "perf" ? "FPS" : m.cat}</span>
		</div>
		<p>${esc(lang === "pl" ? m.pl : m.en)}</p>
	</div>`).join("");
}

document.querySelectorAll(".mc-cat").forEach((btn) => btn.addEventListener("click", () => {
	activeModCat = btn.dataset.cat;
	document.querySelectorAll(".mc-cat").forEach((b) => b.classList.toggle("active", b === btn));
	renderModules();
}));
$("mod-search").addEventListener("input", renderModules);

// ------------------------------------------------------------------ Live Release & Download Counter
function esc(s) {
	return String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
}

function fmtNum(n) {
	return Number(n || 0).toLocaleString(lang === "pl" ? "pl-PL" : "en-US");
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
	latestData = data;
	const latest = data.latest || {};
	const tag = latest.tag || "v1.0.13";
	const ver = latest.version || "1.0.13";

	$("nav-ver").textContent = tag;
	$("hero-pill-text").textContent = lang === "pl"
		? `Wersja ${tag} dostępna · Minecraft 1.21.11 – 26.3`
		: `Version ${tag} live · Minecraft 1.21.11 – 26.3`;
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

	// Render changelog
	const list = data.releases || [];
	const box = $("changelog-list");
	if (!list.length) {
		box.innerHTML = `<div class="ch-skeleton">${lang === "pl" ? "Zobacz pełną historię zmian na GitHub." : "See full release history on GitHub."}</div>`;
		return;
	}
	box.innerHTML = list.map((r) => {
		const date = r.published_at
			? new Date(r.published_at).toLocaleDateString(lang === "pl" ? "pl-PL" : "en-US", { dateStyle: "medium" })
			: "";
		const notes = String(r.notes || "").trim() || `Nimbus Launcher ${r.tag}`;
		return `<article class="ch-card">
			<div class="ch-head">
				<span class="ch-tag">${esc(r.tag)}</span>
				<span class="ch-date">${esc(date)}</span>
			</div>
			<p class="ch-body">${esc(notes)}</p>
			<a class="ch-link" href="${esc(r.url)}" target="_blank" rel="noopener">${esc(I18N[lang].view_gh)}</a>
		</article>`;
	}).join("");
}

async function fetchRelease() {
	// 1. Prefer Vercel serverless endpoint (/api/release) for Edge-cached GitHub stats
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

	// 2. Fallback: direct public GitHub API (works even when opened locally without Vercel CLI)
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

// Optimistic +1 feedback on download click (actual persistent increment happens on GitHub Release asset download)
document.addEventListener("click", (e) => {
	const link = e.target.closest(".js-dl-setup, .js-dl-portable");
	if (!link) return;
	const bumped = Number(localStorage.getItem("nimbus_dl_bump") || 0) + 1;
	localStorage.setItem("nimbus_dl_bump", String(Math.min(bumped, 5)));
	currentDownloads += 1;
	$("stat-downloads").textContent = fmtNum(currentDownloads);
	showToast(I18N[lang].dl_toast);
});

applyLang();
fetchRelease();
