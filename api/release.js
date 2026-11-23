// Vercel Serverless Function: fetches latest Nimbus Launcher release & real download counts from GitHub.
// Cached at Vercel's Edge CDN so GitHub rate limits are never hit and responses stay instant.

const REPO = process.env.NIMBUS_REPO || "watrak77-prog/nimbus-launcher";
const BASE_DOWNLOADS = Number(process.env.BASE_DOWNLOADS || 1789);

function pickAsset(assets, name) {
	const a = (assets || []).find((x) => String(x.name || "").toLowerCase() === name.toLowerCase());
	if (!a) return null;
	return {
		name: a.name,
		url: a.browser_download_url,
		size: a.size || 0,
		downloads: a.download_count || 0,
	};
}

module.exports = async function handler(req, res) {
	res.setHeader("Access-Control-Allow-Origin", "*");
	res.setHeader("Cache-Control", "public, s-maxage=180, stale-while-revalidate=600");

	const headers = {
		"User-Agent": "NimbusClient-Web/1.0",
		"Accept": "application/vnd.github+json",
	};
	if (process.env.GITHUB_TOKEN) {
		headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
	}

	try {
		const gh = await fetch(`https://api.github.com/repos/${REPO}/releases?per_page=50`, { headers });
		if (!gh.ok) throw new Error(`GitHub HTTP ${gh.status}`);
		const list = await gh.json();
		const published = (Array.isArray(list) ? list : []).filter((r) => !r.draft && !r.prerelease);

		let githubDownloads = 0;
		for (const r of published) {
			for (const a of r.assets || []) {
				const n = String(a.name || "").toLowerCase();
				if (n.endsWith(".exe")) {
					githubDownloads += Number(a.download_count || 0);
				}
			}
		}

		const top = published[0] || null;
		const latest = top
			? {
				tag: top.tag_name,
				version: String(top.tag_name || "").replace(/^v/i, ""),
				name: top.name || top.tag_name,
				published_at: top.published_at,
				url: top.html_url,
				notes: top.body || "",
				setup: pickAsset(top.assets, "NimbusSetup.exe"),
				portable: pickAsset(top.assets, "NimbusLauncher.exe"),
			}
			: {
				tag: "v1.0.13",
				version: "1.0.13",
				name: "Nimbus Launcher 1.0.13",
				published_at: new Date().toISOString(),
				url: `https://github.com/${REPO}/releases/latest`,
				notes: "",
				setup: {
					name: "NimbusSetup.exe",
					url: `https://github.com/${REPO}/releases/latest/download/NimbusSetup.exe`,
					size: 0,
					downloads: 0,
				},
				portable: {
					name: "NimbusLauncher.exe",
					url: `https://github.com/${REPO}/releases/latest/download/NimbusLauncher.exe`,
					size: 0,
					downloads: 0,
				},
			};

		const releases = published.slice(0, 6).map((r) => ({
			tag: r.tag_name,
			version: String(r.tag_name || "").replace(/^v/i, ""),
			name: r.name || r.tag_name,
			published_at: r.published_at,
			url: r.html_url,
			notes: r.body || "",
		}));

		return res.status(200).json({
			repo: REPO,
			baseDownloads: BASE_DOWNLOADS,
			githubDownloads,
			totalDownloads: BASE_DOWNLOADS + githubDownloads,
			latest,
			releases,
		});
	} catch (err) {
		return res.status(200).json({
			repo: REPO,
			baseDownloads: BASE_DOWNLOADS,
			githubDownloads: 0,
			totalDownloads: BASE_DOWNLOADS,
			fallback: true,
			latest: {
				tag: "v1.0.13",
				version: "1.0.13",
				name: "Nimbus Launcher 1.0.13",
				published_at: null,
				url: `https://github.com/${REPO}/releases/latest`,
				notes: "Latest Nimbus Client & Launcher release.",
				setup: {
					name: "NimbusSetup.exe",
					url: `https://github.com/${REPO}/releases/latest/download/NimbusSetup.exe`,
					size: 0,
					downloads: 0,
				},
				portable: {
					name: "NimbusLauncher.exe",
					url: `https://github.com/${REPO}/releases/latest/download/NimbusLauncher.exe`,
					size: 0,
					downloads: 0,
				},
			},
			releases: [],
		});
	}
};
