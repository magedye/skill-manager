import { useCallback, useEffect, useState } from "react";
import { fetchRoots, fetchTree, fetchFile } from "./api.js";
import { flattenTree, analyze } from "./parse.js";
import FileTree from "./components/FileTree.jsx";
import FileView from "./components/FileView.jsx";
import GraphView from "./components/GraphView.jsx";
import FlowView from "./components/FlowView.jsx";

const PARSE_EXTS = new Set(["md", "py", "js", "ts", "json", "yaml", "yml", "toml", "txt", "cfg", "ini", "sh"]);
const PARSE_MAX = 512_000;
const CONCURRENCY = 6;

async function pool(items, worker, onDone) {
  let i = 0;
  const runners = Array.from({ length: Math.min(CONCURRENCY, items.length) }, async () => {
    while (i < items.length) {
      const it = items[i++];
      await worker(it);
      onDone();
    }
  });
  await Promise.all(runners);
}

export default function App() {
  const [roots, setRoots] = useState([]);
  const [root, setRoot] = useState(null);
  const [tree, setTree] = useState(null);
  const [files, setFiles] = useState([]);
  const [contents, setContents] = useState({});
  const [selected, setSelected] = useState(null);
  const [tab, setTab] = useState(() => new URLSearchParams(location.search).get("tab") || "file");
  const [progress, setProgress] = useState(null);
  const [error, setError] = useState(null);
  const [customDir, setCustomDir] = useState("");
  const [history, setHistory] = useState([]);
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem("theme");
    if (saved === "dark" || saved === "light") return saved;
    return matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  });

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => setTheme((t) => (t === "dark" ? "light" : "dark"));

  const pushHistory = (state) =>
    setHistory((h) => {
      const last = h[h.length - 1];
      if (last && last.tab === state.tab && last.rel === state.rel) return h;
      return [...h.slice(-29), state];
    });

  const currentState = () => ({ tab, rel: selected?.rel });

  const changeTab = (t) => {
    if (t === tab) return;
    pushHistory(currentState());
    setTab(t);
  };

  // switchTab=false: تحديد الملف دون مغادرة التبويب الحالي (نقر الشجرة)
  const openFile = (f, switchTab = true) => {
    if (!f) return;
    if (f.rel === selected?.rel && (!switchTab || tab === "file")) return;
    pushHistory(currentState());
    setSelected(f);
    if (switchTab) setTab("file");
  };

  const goBack = () => {
    if (!history.length) return;
    const prev = history[history.length - 1];
    setHistory(history.slice(0, -1));
    setTab(prev.tab);
    if (prev.rel) {
      const f = files.find((x) => x.rel === prev.rel);
      if (f) setSelected(f);
    }
  };

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") goBack();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [history, files, tab, selected]);

  const loadRoot = useCallback(async (r) => {
    setRoot(r);
    setTree(null); setFiles([]); setContents({}); setSelected(null); setError(null);
    try {
      const t = await fetchTree(r.path);
      setTree(t);
      const flat = flattenTree(t.entries);
      setFiles(flat);

      const parseTargets = flat.filter((f) => PARSE_EXTS.has(f.ext) && f.size <= PARSE_MAX);
      setProgress({ done: 0, total: parseTargets.length });
      const acc = {};
      await pool(parseTargets, async (f) => {
        try {
          const d = await fetchFile(r.path + "/" + f.rel);
          if (d.kind === "text") acc[f.rel] = d.content;
        } catch {}
      }, () => setProgress((p) => (p ? { ...p, done: p.done + 1 } : p)));
      setContents(acc);
      setProgress(null);

      const skillRel = flat.find((f) => /^SKILL\.md$/i.test(f.name))?.rel;
      const start = skillRel ? flat.find((f) => f.rel === skillRel) : flat.find((f) => f.ext === "md");
      if (start) setSelected(start);
    } catch (e) {
      setError(String(e.message || e));
      setProgress(null);
    }
  }, []);

  useEffect(() => {
    fetchRoots()
      .then((rs) => {
        setRoots(rs);
        if (rs.length) loadRoot(rs[0]);
      })
      .catch((e) => setError(String(e.message || e)));
  }, [loadRoot]);

  const analysis = files.length && Object.keys(contents).length
    ? analyze(files, contents)
    : null;

  const openCustom = () => {
    const p = customDir.trim();
    if (!p) return;
    const r = { name: p.replace(/[\\/]+$/, "").split(/[\\/]/).pop(), path: p, external: true };
    setRoots((rs) => (rs.some((x) => x.path === p) ? rs : [...rs, r]));
    loadRoot(r);
  };

  const selectInPlace = (f) => openFile(f, false);

  return (
    <div className="app">
      <header className="topbar">
        <div className="brand">
          <span className="logo">🧭</span>
          <div>
            <div className="brand-name">مستكشف المهارات</div>
            <div className="brand-sub" dir="auto">
              {root ? (analysis?.skillMeta?.name ? analysis.skillMeta.name : root.name) : "Skill Explorer"}
            </div>
          </div>
        </div>
        {analysis?.skillMeta?.description && (
          <div className="skill-desc" dir="auto">{analysis.skillMeta.description}</div>
        )}
        <nav className="tabs">
          <button className={"tab back" + (history.length ? "" : " off")} onClick={goBack}
            disabled={!history.length} title="العودة إلى الشاشة السابقة (Esc)">
            → رجوع
          </button>
          <button className={"tab" + (tab === "file" ? " on" : "")} onClick={() => changeTab("file")}>الملف</button>
          <button className={"tab" + (tab === "graph" ? " on" : "")} onClick={() => changeTab("graph")}>
            الخريطة {analysis ? `(${analysis.edges.length})` : ""}
          </button>
          <button className={"tab" + (tab === "flow" ? " on" : "")} onClick={() => changeTab("flow")}>التدفق</button>
          <button className="tab theme-toggle" onClick={toggleTheme}
            title={theme === "dark" ? "التبديل إلى النمط النهاري" : "التبديل إلى النمط الليلي"}>
            {theme === "dark" ? "☀️" : "🌙"}
          </button>
        </nav>
      </header>

      <div className="body">
        <aside className="sidebar">
          <div className="roots">
            <div className="side-title">المهارات المتاحة</div>
            {roots.map((r) => (
              <button key={r.path} className={"root-item" + (root?.path === r.path ? " active" : "")}
                onClick={() => loadRoot(r)} title={r.path}>
                <span className="dot k-doc" />
                <span dir="auto">{r.name}</span>
              </button>
            ))}
            <div className="custom-root">
              <input value={customDir} onChange={(e) => setCustomDir(e.target.value)}
                placeholder="مسار مجلد مهارة آخر…" dir="ltr" />
              <button className="btn" onClick={openCustom}>إضافة</button>
            </div>
          </div>

          {progress && (
            <div className="progress">
              تحليل الملفات… {progress.done}/{progress.total}
            </div>
          )}
          {error && <div className="error">{error}</div>}

          {tree && (
            <FileTree tree={tree} files={files} selectedRel={selected?.rel} onSelect={selectInPlace} />
          )}
        </aside>

        <main className="main">
          {tab === "file" && <FileView file={selected} rootName={root?.name} rootPath={root?.path} />}
          {tab === "graph" && (analysis
            ? <GraphView files={files} analysis={analysis} selectedRel={selected?.rel} onSelect={(f) => openFile(f)} theme={theme} />
            : <div className="pane empty">{progress ? "جارٍ التحليل…" : "لا بيانات"}</div>)}
          {tab === "flow" && (analysis
            ? <FlowView files={files} analysis={analysis} selectedRel={selected?.rel} onSelect={(f) => openFile(f)} />
            : <div className="pane empty">{progress ? "جارٍ التحليل…" : "لا بيانات"}</div>)}
        </main>
      </div>
    </div>
  );
}
