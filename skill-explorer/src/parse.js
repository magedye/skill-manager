// تحليل علاقات ملفات المهارة: من يشير إلى من، وبأي طريقة.
// الأنواع: link (رابط ماركداون) · ref (مسار داخل نص/كود) · import (استيراد بايثون) · open (قراءة ملف)

export function flattenTree(entries, out = []) {
  for (const e of entries) {
    if (e.type === "dir") flattenTree(e.children, out);
    else out.push(e);
  }
  return out;
}

export function fileKind(f) {
  if (/^SKILL\.md$/i.test(f.name)) return "skill";
  if (f.ext === "md") return "doc";
  if (["py", "js", "jsx", "ts", "tsx", "sh", "ps1"].includes(f.ext)) return "script";
  if (["txt", "json", "csv", "tsv"].includes(f.ext)) return "data";
  if (["svg", "png", "jpg", "jpeg", "gif", "webp", "ico"].includes(f.ext)) return "image";
  return "other";
}

export const KIND_LABEL = {
  skill: "SKILL.md", doc: "مستند", script: "سكربت", data: "بيانات", image: "صورة", other: "أخرى",
};
export const EDGE_LABEL = { link: "رابط", ref: "إشارة", import: "استيراد", open: "قراءة ملف" };

function normalizeRef(r) {
  r = r.replace(/\\/g, "/").split("#")[0].trim();
  if (r.startsWith("./")) r = r.slice(2);
  if (!r || r.startsWith("http") || r.startsWith("mailto:")) return null;
  return r;
}

function resolveRef(ref, fromRel, targetSet) {
  const cands = [];
  const dir = fromRel.includes("/") ? fromRel.slice(0, fromRel.lastIndexOf("/")) : "";
  if (dir) {
    cands.push(dir + "/" + ref);
    // صعود مستوى واحد للمسارات النسبية من مجلد فرعي
    const up = dir.includes("/") ? dir.slice(0, dir.lastIndexOf("/")) : "";
    cands.push(up + "/" + ref);
  }
  cands.push(ref);
  for (const c of cands) if (targetSet.has(c)) return c;
  return null;
}

function pushEdge(edges, from, to, type, order) {
  if (from === to) return;
  const key = from + "\u0000" + to + "\u0000" + type;
  if (edges.some((e) => e.key === key)) return;
  edges.push({ key, from, to, type, order });
}

function extractFromMarkdown(content, rel, targetSet, edges) {
  const linkRe = /\[([^\]]*)\]\(\s*([^)\s]+)[^)]*\)/g;
  let m;
  while ((m = linkRe.exec(content))) {
    const ref = normalizeRef(m[2]);
    if (!ref) continue;
    const t = resolveRef(ref, rel, targetSet);
    if (t) pushEdge(edges, rel, t, "link", m.index);
  }
  const codeRe = /`([^`\n]{2,200}?)`/g;
  while ((m = codeRe.exec(content))) {
    const raw = m[1].trim();
    if (!/\.[A-Za-z0-9]{1,8}$/.test(raw) || /\s/.test(raw)) continue;
    const ref = normalizeRef(raw);
    if (!ref) continue;
    const t = resolveRef(ref, rel, targetSet);
    if (t) pushEdge(edges, rel, t, "ref", m.index);
  }
}

function extractFromPython(content, rel, targetSet, edges) {
  let m;
  const impRe = /(?:^|\n)\s*(?:from\s+\.?([A-Za-z_][\w]*)\s+import|import\s+([A-Za-z_][\w]*))/g;
  while ((m = impRe.exec(content))) {
    const mod = m[1] || m[2];
    if (!mod) continue;
    const t = resolveRef(mod + ".py", rel, targetSet);
    if (t) pushEdge(edges, rel, t, "import", m.index);
  }
  const openRe = /(?:open|Path)\(\s*(['"])([^'"]+)\1/g;
  while ((m = openRe.exec(content))) {
    const ref = normalizeRef(m[2]);
    if (!ref) continue;
    const t = resolveRef(ref, rel, targetSet);
    if (t) pushEdge(edges, rel, t, "open", m.index);
  }
  const strRe = /(['"])([\w\-./\\]+\.(?:py|md|txt|json|csv|svg|yml|yaml))\1/g;
  while ((m = strRe.exec(content))) {
    const ref = normalizeRef(m[2]);
    if (!ref) continue;
    const t = resolveRef(ref, rel, targetSet);
    if (t) pushEdge(edges, rel, t, "ref", m.index);
  }
}

export function parseFrontmatter(content) {
  const out = {};
  const m = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!m) return out;
  for (const line of m[1].split(/\r?\n/)) {
    const kv = line.match(/^([A-Za-z_-]+):\s*(.*)$/);
    if (kv) out[kv[1].trim()] = kv[2].trim().replace(/^["']|["']$/g, "");
  }
  return out;
}

export function analyze(files, contents) {
  const targetSet = new Set(files.map((f) => f.rel));
  const edges = [];
  for (const f of files) {
    const c = contents[f.rel];
    if (!c) continue;
    if (f.ext === "md") extractFromMarkdown(c, f.rel, targetSet, edges);
    else if (f.ext === "py") extractFromPython(c, f.rel, targetSet, edges);
  }
  const byFrom = new Map();
  const byTo = new Map();
  for (const e of [...edges].sort((a, b) => a.order - b.order)) {
    if (!byFrom.has(e.from)) byFrom.set(e.from, []);
    byFrom.get(e.from).push(e);
    if (!byTo.has(e.to)) byTo.set(e.to, []);
    byTo.get(e.to).push(e);
  }
  const skillFile = files.find((f) => fileKind(f) === "skill") ||
    files.find((f) => f.rel.toLowerCase().includes("skill.md"));
  let skillMeta = null;
  if (skillFile && contents[skillFile.rel]) {
    skillMeta = parseFrontmatter(contents[skillFile.rel]);
  }
  return { edges, byFrom, byTo, skillFile, skillMeta };
}
