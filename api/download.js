// Direct clean download redirects:
//   /download           -> NimbusSetup.exe (Windows Installer)
//   /download/portable  -> NimbusLauncher.exe (Windows Portable)
//   /download/linux     -> NimbusLauncher.deb (Linux Mint / Ubuntu / Debian)
//   /download/linux-tar -> NimbusLauncher-linux.tar.gz (Portable Linux)
const REPO = process.env.NIMBUS_REPO || "watrak77-prog/nimbus-launcher";

const ASSETS = {
	setup: "NimbusSetup.exe",
	portable: "NimbusLauncher.exe",
	linux: "NimbusLauncher.deb",
	"linux-tar": "NimbusLauncher-linux.tar.gz",
};

module.exports = function handler(req, res) {
	const type = String((req.query && req.query.type) || "setup").toLowerCase();
	const asset = ASSETS[type] || ASSETS.setup;
	res.setHeader("Cache-Control", "no-store");
	res.redirect(302, `https://github.com/${REPO}/releases/latest/download/${asset}`);
};
