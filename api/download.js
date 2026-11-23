// Direct clean download redirect: /download -> latest NimbusSetup.exe, /download/portable -> NimbusLauncher.exe
const REPO = process.env.NIMBUS_REPO || "watrak77-prog/nimbus-launcher";

module.exports = function handler(req, res) {
	const type = String((req.query && req.query.type) || "setup").toLowerCase();
	const asset = type === "portable" ? "NimbusLauncher.exe" : "NimbusSetup.exe";
	res.setHeader("Cache-Control", "no-store");
	res.redirect(302, `https://github.com/${REPO}/releases/latest/download/${asset}`);
};
