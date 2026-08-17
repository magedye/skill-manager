import { useEffect, useMemo, useRef, useState } from "react";
import { Network } from "vis-network/standalone/esm/vis-network";
import { fileKind, KIND_LABEL, EDGE_LABEL } from "../parse.js";

const GROUP_COLOR = {
  skill: "#7c3aed", doc: "#2563eb", script: "#16a34a",
  data: "#d97706", image: "#db2777", other: "#64748b",
};
const GROUP_SHAPE = { skill: "star", doc: "box", script: "dot", data: "triangle", image: "diamond", other: "dot" };
const GROUP_SIZE = { skill: 20, doc: 14, script: 12, data: 10, image: 9, other: 8 };

export default function GraphView({ files, analysis, selectedRel, onSelect, theme }) {
  const containerRef = useRef(null);
  const netRef = useRef(null);
  const [hidden, setHidden] = useState(new Set());

  const dark = theme === "dark";
  const ink = dark ? "#d3dcef" : "#313c55";
  const nodeBorder = dark ? "#1a2132" : "#ffffff";
  const edgeColor = dark ? "#55628a" : "#8d99b0";
  const edgeFontColor = dark ? "#a6b1c8" : "#5d6a83";
  const edgeHover = dark ? "#7d8db0" : "#6b7890";
  const edgeHighlight = dark ? "#9dc1fb" : "#1d4ed8";

  const kinds = useMemo(() => {
    const s = new Set(files.map(fileKind));
    return [...s];
  }, [files]);

  const graph = useMemo(() => {
    if (!analysis) return { nodes: [], edges: [] };
    const nodes = files
      .filter((f) => !hidden.has(fileKind(f)))
      .map((f) => {
        const k = fileKind(f);
        return {
          id: f.rel,
          label: f.name,
          group: k,
          title: f.rel,
          shape: GROUP_SHAPE[k],
          size: GROUP_SIZE[k],
          color: { background: GROUP_COLOR[k], border: nodeBorder, highlight: { background: GROUP_COLOR[k], border: ink } },
          font: { size: 12, color: ink, face: "Segoe UI, Tahoma" },
          chosen: { node: true },
        };
      });
    const ids = new Set(nodes.map((n) => n.id));
    const edges = analysis.edges
      .filter((e) => ids.has(e.from) && ids.has(e.to))
      .map((e, i) => ({
        id: "e" + i,
        from: e.from,
        to: e.to,
        label: EDGE_LABEL[e.type] || e.type,
        arrows: "to",
        color: { color: edgeColor, highlight: edgeHighlight, hover: edgeHover },
        font: { size: 9, color: edgeFontColor, strokeWidth: 0 },
        smooth: { enabled: false },
      }));
    return { nodes, edges };
  }, [files, analysis, hidden, theme]);

  useEffect(() => {
    if (!containerRef.current) return;
    const net = new Network(
      containerRef.current,
      { nodes: graph.nodes, edges: graph.edges },
      {
        physics: { enabled: true, solver: "forceAtlas2Based", forceAtlas2Based: { gravitationalConstant: -55, springLength: 90, springConstant: 0.09 }, stabilization: { iterations: 250, fit: true } },
        interaction: { hover: true, navigationButtons: false, keyboard: false },
        edges: { selectionWidth: 2 },
        nodes: { borderWidth: 1.5, shadow: { enabled: false } },
      }
    );
    net.on("click", (ev) => {
      if (ev.nodes.length) {
        const rel = ev.nodes[0];
        const f = files.find((x) => x.rel === rel);
        if (f && onSelect) onSelect(f);
      }
    });
    netRef.current = net;
    return () => { net.destroy(); netRef.current = null; };
  }, [graph]);

  useEffect(() => {
    const net = netRef.current;
    if (!net || !selectedRel) return;
    net.selectNodes([selectedRel]);
  }, [selectedRel]);

  const toggle = (k) => {
    setHidden((h) => {
      const n = new Set(h);
      if (n.has(k)) n.delete(k); else n.add(k);
      return n;
    });
  };

  return (
    <div className="pane graph-pane">
      <div className="graph-toolbar">
        <span className="graph-title">خريطة العلاقات — السهم يعني "يشير إلى / يستخدم"</span>
        <div className="legend">
          {kinds.map((k) => (
            <label key={k} className={"legend-item" + (hidden.has(k) ? " off" : "")}>
              <input type="checkbox" checked={!hidden.has(k)} onChange={() => toggle(k)} />
              <span className="dot" style={{ background: GROUP_COLOR[k] }} />
              {KIND_LABEL[k]} ({files.filter((f) => fileKind(f) === k).length})
            </label>
          ))}
        </div>
        <button className="btn" onClick={() => netRef.current?.fit({ animation: { duration: 400 } })}>
          احتواء الكل
        </button>
      </div>
      <div className="graph-canvas" ref={containerRef} dir="ltr" />
      <div className="graph-hint">{analysis ? analysis.edges.length + " علاقة بين " + files.length + " ملفاً — اسحب لتحريك، عجلة الفأرة للتقريب، انقر ملفاً لفتحه" : ""}</div>
    </div>
  );
}
