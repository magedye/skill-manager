import { useEffect, useMemo, useState } from "react";
import { fetchFile, rawUrl } from "../api.js";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

function humanSize(n) {
  if (n == null) return "";
  if (n < 1024) return n + " B";
  if (n < 1024 * 1024) return (n / 1024).toFixed(1) + " KB";
  return (n / (1024 * 1024)).toFixed(2) + " MB";
}

export default function FileView({ file, rootName, rootPath }) {
  const [data, setData] = useState(null);
  const [err, setErr] = useState(null);

  useEffect(() => {
    setData(null);
    setErr(null);
    if (!file) return;
    const abs = file.path || (rootPath ? rootPath + "/" + file.rel : file.rel);
    fetchFile(abs)
      .then(setData)
      .catch((e) => setErr(String(e.message || e)));
  }, [file, rootPath]);

  if (!file) {
    return <div className="pane empty">اختر ملفاً من الشجرة لعرضه</div>;
  }
  if (err) return <div className="pane empty">خطأ: {err}</div>;
  if (!data) return <div className="pane empty">جارٍ التحميل…</div>;

  const rel = file.rel || data.path;

  return (
    <div className="pane file-pane">
      <div className="file-head">
        <div className="file-title" dir="auto">
          <span className={"dot k-" + (data.kind || "text")} />
          {rootName ? rootName + "/" : ""}{rel}
        </div>
        <div className="file-meta">
          <span className="chip">{humanSize(data.size)}</span>
          {data.content ? <span className="chip">{data.content.split("\n").length} سطر</span> : null}
          <span className="chip">{data.kind === "image" ? "صورة" : data.ext || "—"}</span>
        </div>
      </div>

      <div className="file-body">
        {data.kind === "text" && file.ext === "md" ? (
          <div className="md-body" dir="auto">
            <Markdown remarkPlugins={[remarkGfm]}>{data.content}</Markdown>
          </div>
        ) : data.kind === "text" ? (
          <pre className="code-body" dir="ltr">{data.content}</pre>
        ) : data.kind === "image" ? (
          <div className="img-body">
            <img src={rawUrl(data.path)} alt={data.name} />
          </div>
        ) : data.kind === "too-large" ? (
          <div className="notice">ملف كبير ({humanSize(data.size)}) — معاينة النص متاحة حتى 2MB.</div>
        ) : (
          <div className="notice">ملف ثنائي (zip/pyc…) لا يمكن معاينته نصياً. الحجم: {humanSize(data.size)}</div>
        )}
      </div>
    </div>
  );
}
