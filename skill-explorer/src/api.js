export async function fetchRoots() {
  const r = await fetch("/api/roots");
  if (!r.ok) throw new Error("فشل جلب الجذور");
  return (await r.json()).roots;
}

export async function fetchTree(dir) {
  const r = await fetch("/api/tree?dir=" + encodeURIComponent(dir));
  const j = await r.json();
  if (!r.ok) throw new Error(j.error || "فشل جلب الشجرة");
  return j;
}

export async function fetchFile(path) {
  const r = await fetch("/api/file?path=" + encodeURIComponent(path));
  const j = await r.json();
  if (!r.ok) throw new Error(j.error || "فشل جلب الملف");
  return j;
}

export const rawUrl = (path) => "/api/raw?path=" + encodeURIComponent(path);
