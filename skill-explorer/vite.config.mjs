import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const appDir = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(appDir, "data");
const EXTRA_ROOTS = ["D:\\APP\\tafseer\\ready-v5"];

const IGNORE = new Set(["__pycache__", ".git", "node_modules", ".DS_Store"]);
const TEXT_EXTS = new Set([
  "md", "markdown", "txt", "py", "js", "jsx", "ts", "tsx", "json", "yaml", "yml",
  "toml", "cfg", "ini", "conf", "html", "htm", "css", "scss", "sh", "bash",
  "ps1", "bat", "cmd", "csv", "tsv", "log", "xml", "cff", "gitignore", "editorconfig",
]);
const IMAGE_EXTS = new Set(["svg", "png", "jpg", "jpeg", "gif", "webp", "ico", "bmp"]);
const MIME = {
  svg: "image/svg+xml", png: "image/png", jpg: "image/jpeg", jpeg: "image/jpeg",
  gif: "image/gif", webp: "image/webp", ico: "image/x-icon", bmp: "image/bmp",
};
const MAX_TEXT = 2_000_000;
const MAX_RAW = 8_000_000;

const toPosix = (p) => p.replace(/\\/g, "/");
const extOf = (n) => (n.includes(".") ? n.split(".").pop().toLowerCase() : "");

function walk(abs, relBase) {
  const out = [];
  for (const e of fs.readdirSync(abs, { withFileTypes: true })) {
    if (IGNORE.has(e.name)) continue;
    const absP = path.join(abs, e.name);
    const rel = relBase ? relBase + "/" + e.name : e.name;
    if (e.isDirectory()) {
      out.push({ name: e.name, rel, type: "dir", children: walk(absP, rel) });
    } else {
      let size = 0;
      try { size = fs.statSync(absP).size; } catch {}
      out.push({ name: e.name, rel, type: "file", ext: extOf(e.name), size });
    }
  }
  out.sort((a, b) =>
    a.type !== b.type ? (a.type === "dir" ? -1 : 1) : a.name.localeCompare(b.name, "ar", { numeric: true })
  );
  return out;
}

function listRoots() {
  const roots = [];
  if (fs.existsSync(DATA_DIR)) {
    for (const e of fs.readdirSync(DATA_DIR, { withFileTypes: true })) {
      if (e.isDirectory()) roots.push({ name: e.name, path: toPosix(path.join(DATA_DIR, e.name)) });
    }
  }
  for (const r of EXTRA_ROOTS) {
    if (fs.existsSync(r)) roots.push({ name: path.basename(r), path: toPosix(r), external: true });
  }
  return roots;
}

function apiServer() {
  return (req, res, next) => {
    let u;
    try { u = new URL(req.url, "http://localhost"); } catch { return next(); }
    if (!u.pathname.startsWith("/api/")) return next();

    const send = (code, obj) => {
      res.statusCode = code;
      res.setHeader("Content-Type", "application/json; charset=utf-8");
      res.end(JSON.stringify(obj));
    };

    try {
      if (u.pathname === "/api/roots") return send(200, { roots: listRoots() });

      const dir = u.searchParams.get("dir");
      const file = u.searchParams.get("path");

      if (u.pathname === "/api/tree") {
        if (!dir) return send(400, { error: "المعامل dir مطلوب" });
        const abs = path.resolve(dir);
        if (!fs.existsSync(abs) || !fs.statSync(abs).isDirectory())
          return send(404, { error: "المجلد غير موجود: " + dir });
        return send(200, { path: toPosix(abs), name: path.basename(abs), entries: walk(abs, "") });
      }

      if (u.pathname === "/api/file") {
        if (!file) return send(400, { error: "المعامل path مطلوب" });
        const abs = path.resolve(file);
        const st = fs.statSync(abs, { throwIfNoEntry: false });
        if (!st || !st.isFile()) return send(404, { error: "الملف غير موجود" });
        const ext = extOf(abs);
        const base = { path: toPosix(abs), name: path.basename(abs), ext, size: st.size };
        if (IMAGE_EXTS.has(ext)) {
          if (st.size > MAX_RAW) return send(200, { ...base, kind: "too-large" });
          return send(200, { ...base, kind: "image" });
        }
        if (!TEXT_EXTS.has(ext)) return send(200, { ...base, kind: "binary" });
        if (st.size > MAX_TEXT) return send(200, { ...base, kind: "too-large" });
        return send(200, { ...base, kind: "text", content: fs.readFileSync(abs, "utf8") });
      }

      if (u.pathname === "/api/raw") {
        if (!file) return send(400, { error: "المعامل path مطلوب" });
        const abs = path.resolve(file);
        const st = fs.statSync(abs, { throwIfNoEntry: false });
        if (!st || !st.isFile()) return send(404, { error: "الملف غير موجود" });
        if (st.size > MAX_RAW) return send(413, { error: "الملف أكبر من الحد المسموح" });
        const ext = extOf(abs);
        res.setHeader("Content-Type", MIME[ext] || "application/octet-stream");
        res.setHeader("Content-Length", st.size);
        return fs.createReadStream(abs).pipe(res);
      }

      return send(404, { error: "نقطة نهاية غير معروفة" });
    } catch (e) {
      return send(500, { error: String(e && e.message ? e.message : e) });
    }
  };
}

export default defineConfig({
  plugins: [
    react(),
    {
      name: "skill-explorer-api",
      configureServer(s) { s.middlewares.use(apiServer()); },
      configurePreviewServer(s) { s.middlewares.use(apiServer()); },
    },
  ],
  server: { port: 5180, strictPort: true },
});
