import { useMemo } from "react";
import { fileKind, KIND_LABEL, EDGE_LABEL } from "../parse.js";

const ICON = { skill: "★", doc: "📄", script: "🐍", data: "🧬", image: "🖼", other: "▪" };
const FOLDER_RANK = { "": 0, methodology: 1, quality: 2, scripts: 3, assets: 4 };

function naturalLabel(rel) {
  const parts = rel.split("/");
  return parts[parts.length - 1];
}

// بناء شجرة التدفق: من SKILL.md نزولاً عبر العلاقات بترتيب ظهورها في المستند
function buildFlowTree(analysis, files) {
  const start = analysis?.skillFile?.rel;
  if (!start || !analysis) return null;
  const byFrom = analysis.byFrom;
  const fileMap = new Map(files.map((f) => [f.rel, f]));
  const root = { rel: start, via: null, children: [], depth: 0 };
  const visited = new Set([start]);

  function expand(node, depth) {
    if (depth >= 4) return;
    const outs = (byFrom.get(node.rel) || []).slice().sort((a, b) => a.order - b.order);
    for (const e of outs) {
      const f = fileMap.get(e.to);
      if (!f) continue;
      const k = fileKind(f);
      if (k === "image" || k === "other") continue; // تظهر في القسم السفلي بدلاً من التدفق
      if (visited.has(e.to)) {
        node.children.push({ rel: e.to, via: e.type, children: [], depth: depth + 1, backref: true });
        continue;
      }
      visited.add(e.to);
      const child = { rel: e.to, via: e.type, children: [], depth: depth + 1 };
      node.children.push(child);
      expand(child, depth + 1);
    }
  }
  expand(root, 0);
  return { root, visited, fileMap };
}

function Step({ node, analysis, files, selectedRel, onSelect, level }) {
  const f = files.find((x) => x.rel === node.rel);
  if (!f) return null;
  const k = fileKind(f);
  const active = selectedRel === node.rel;
  return (
    <li className={"flow-step" + (active ? " active" : "") + (node.backref ? " backref" : "")}>
      <button className="flow-card" onClick={() => onSelect && onSelect(f)} title={node.rel}>
        <span className={"dot k-" + k} style={{ marginLeft: 6 }} />
        <span className="flow-icon">{ICON[k]}</span>
        <span className="flow-name" dir="auto">{naturalLabel(node.rel)}</span>
        <span className="flow-dir" dir="ltr">{node.rel}</span>
        {node.via && <span className="chip via">{EDGE_LABEL[node.via]}</span>}
      </button>
      {node.children.length > 0 && (
        <ul className="flow-children">
          {node.children.map((c, i) => (
            <Step key={node.rel + "/" + c.rel + "/" + i} node={c} analysis={analysis} files={files}
              selectedRel={selectedRel} onSelect={onSelect} level={level + 1} />
          ))}
        </ul>
      )}
    </li>
  );
}

export default function FlowView({ files, analysis, selectedRel, onSelect }) {
  const flow = useMemo(() => buildFlowTree(analysis, files), [analysis, files]);

  const orphans = useMemo(() => {
    if (!flow) return [];
    return files
      .filter((f) => {
        const k = fileKind(f);
        if (k === "image") return false;
        return !flow.visited.has(f.rel);
      })
      .sort((a, b) => {
        const ra = FOLDER_RANK[a.rel.includes("/") ? a.rel.split("/")[0] : ""] ?? 9;
        const rb = FOLDER_RANK[b.rel.includes("/") ? b.rel.split("/")[0] : ""] ?? 9;
        if (ra !== rb) return ra - rb;
        return a.rel.localeCompare(b.rel, "ar", { numeric: true });
      });
  }, [flow, files]);

  if (!flow) {
    return <div className="pane empty">لا يوجد SKILL.md لبدء التدفق — استخدم الخريطة للاستعراض</div>;
  }

  return (
    <div className="pane flow-pane">
      <div className="flow-intro">
        التدفق المنطقي يبدأ من <b>SKILL.md</b> ويتفرع بترتيب الإشارات كما وردت في النصوص.
        البطاقات الملوّنة باهتة تعني إشارة عائدة لملف ظهر سابقاً.
      </div>
      <ul className="flow-root">
        <Step node={flow.root} analysis={analysis} files={files} selectedRel={selectedRel} onSelect={onSelect} level={0} />
      </ul>

      {orphans.length > 0 && (
        <div className="orphans">
          <div className="orphans-title">ملفات غير مُشار إليها في التدفق ({orphans.length})</div>
          <div className="orphans-list">
            {orphans.map((f) => (
              <button key={f.rel} className={"chip file-chip" + (selectedRel === f.rel ? " active" : "")}
                onClick={() => onSelect && onSelect(f)} title={f.rel} dir="ltr">
                {ICON[fileKind(f)]} {f.rel}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
