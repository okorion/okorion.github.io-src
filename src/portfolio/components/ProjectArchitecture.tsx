import {
  Background,
  Controls,
  Handle,
  MarkerType,
  type Node,
  type NodeProps,
  Position,
  ReactFlow,
} from "@xyflow/react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  type ArchitectureStep,
  architectures,
  type PreviewKind,
} from "../architectureContent";
import "@xyflow/react/dist/style.css";
import "../architecture.css";

function Miniature({ kind, labels }: { kind: PreviewKind; labels: string[] }) {
  return (
    <span
      className={`architecture-mini architecture-mini--${kind}`}
      aria-hidden="true"
    >
      <span className="architecture-mini-bar">
        <i />
        <i />
        <i />
        <span>{labels[0]}</span>
      </span>
      {kind === "scene" ? (
        <svg viewBox="0 0 240 110" fill="none">
          <path
            className="mini-grid"
            d="M26 79 120 35 214 79 120 123ZM49 90 143 46M73 101 167 57M97 112 190 68M49 68 143 112M73 57 167 101M97 46 190 90"
          />
          <path className="mini-cube-top" d="m92 39 28-15 28 15-28 16Z" />
          <path className="mini-cube-left" d="M92 39v33l28 16V55Z" />
          <path className="mini-cube-right" d="M148 39v33l-28 16V55Z" />
          <path className="mini-axis" d="M120 88v-25m0 25 28 13m-28-13-28 13" />
          <rect
            className="mini-panel"
            x="8"
            y="10"
            width="39"
            height="44"
            rx="3"
          />
          <path className="mini-grid" d="M15 20h25M15 29h18M15 38h21" />
        </svg>
      ) : kind === "diagram" ? (
        <svg viewBox="0 0 240 110" fill="none">
          <path className="mini-axis" d="M61 55h46m30 0h24M137 55v30h24" />
          <rect
            className="mini-panel"
            x="13"
            y="40"
            width="48"
            height="30"
            rx="5"
          />
          <rect
            className="mini-cube-top"
            x="107"
            y="40"
            width="30"
            height="30"
            rx="5"
          />
          <rect
            className="mini-panel"
            x="161"
            y="15"
            width="65"
            height="40"
            rx="5"
          />
          <rect
            className="mini-panel"
            x="161"
            y="71"
            width="65"
            height="27"
            rx="5"
          />
        </svg>
      ) : kind === "chart" ? (
        <svg viewBox="0 0 240 110" fill="none">
          <path
            className="mini-grid"
            d="M25 23h190M25 48h190M25 73h190M25 98h190"
          />
          <path className="mini-axis" d="M25 14v84h190" />
          {[39, 78, 117, 156].map((x, index) => (
            <rect
              key={x}
              className="mini-cube-top"
              x={x}
              y={62 - index * 12}
              width="24"
              height={36 + index * 12}
              rx="3"
            />
          ))}
        </svg>
      ) : kind === "timeline" ? (
        <span className="mini-timeline">
          <span>
            0<span>PROGRESS</span>1
          </span>
          <i />
          <b />
          <i />
          <em />
        </span>
      ) : (
        <span className="mini-lines">
          {labels.map((label, index) => (
            <span key={label}>
              <b>
                {kind === "code"
                  ? `${index + 1}`
                  : kind === "review"
                    ? "✓"
                    : kind === "files"
                      ? "↳"
                      : "·"}
              </b>
              <span>{label}</span>
              <i />
            </span>
          ))}
          {kind === "table" && (
            <span className="mini-table-foot">
              <i />
              <i />
              <i />
            </span>
          )}
        </span>
      )}
    </span>
  );
}

function StepCard({
  step,
  active,
  onSelect,
}: {
  step: ArchitectureStep;
  active: boolean;
  onSelect: (id: string) => void;
}) {
  return (
    <button
      className="architecture-card nodrag nopan"
      type="button"
      aria-pressed={active}
      aria-label={`${step.title} 구조 설명`}
      onClick={() => onSelect(step.id)}
    >
      <span className="architecture-card-title">
        {step.title}
        <span aria-hidden="true">↗</span>
      </span>
      <Miniature kind={step.preview} labels={step.labels} />
      <span className="architecture-card-subtitle">{step.subtitle}</span>
    </button>
  );
}

type StepNode = Node<
  { step: ArchitectureStep; active: boolean; onSelect: (id: string) => void },
  "architecture"
>;

function ArchitectureNode({ data }: NodeProps<StepNode>) {
  return (
    <>
      <Handle type="target" position={Position.Left} id="left" />
      <Handle type="target" position={Position.Top} id="top" />
      <StepCard
        step={data.step}
        active={data.active}
        onSelect={data.onSelect}
      />
      <Handle type="source" position={Position.Right} id="right" />
      <Handle type="source" position={Position.Bottom} id="bottom" />
    </>
  );
}

const nodeTypes = { architecture: ArchitectureNode };
const fitOptions = { padding: 0.08, maxZoom: 1 };

export default function ProjectArchitecture({
  projectId,
}: {
  projectId: string;
}) {
  const content = architectures[projectId];
  const container = useRef<HTMLElement>(null);
  const [width, setWidth] = useState(0);
  const [selected, setSelected] = useState(content?.steps[0].id ?? "");
  const select = useCallback((id: string) => setSelected(id), []);
  useEffect(() => {
    const element = container.current;
    if (!element) return;
    const observer = new ResizeObserver(([entry]) =>
      setWidth(Math.round(entry.contentRect.width)),
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);
  const nodes = useMemo<StepNode[]>(
    () =>
      content?.steps.map((step) => ({
        id: step.id,
        type: "architecture",
        position: step.position,
        data: { step, active: step.id === selected, onSelect: select },
        draggable: false,
        selectable: false,
        focusable: false,
      })) ?? [],
    [content, selected, select],
  );
  const edges = useMemo(
    () =>
      content?.links.map((link) => ({
        id: `${link.from}-${link.to}`,
        source: link.from,
        target: link.to,
        sourceHandle: link.vertical ? "bottom" : "right",
        targetHandle: link.vertical ? "top" : "left",
        type: "smoothstep",
        label: link.label,
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: "var(--architecture-edge)",
        },
        style: { strokeDasharray: link.optional ? "5 4" : undefined },
        focusable: false,
        selectable: false,
      })) ?? [],
    [content],
  );
  if (!content) return null;
  const active =
    content.steps.find((step) => step.id === selected) ?? content.steps[0];
  const compact = width < 900;
  return (
    <section
      className="project-architecture"
      ref={container}
      aria-labelledby="architecture-title"
    >
      <header className="architecture-heading">
        <div>
          <p className="eyebrow">HOW IT WORKS</p>
          <h2 id="architecture-title">프로젝트 구조</h2>
        </div>
        <p>{content.summary}</p>
      </header>
      <div className="architecture-board">
        <div className="architecture-board-heading">
          <span>입력에서 결과까지</span>
          <span>카드를 선택해 역할 확인</span>
        </div>
        {width > 0 &&
          (compact ? (
            <ol className="architecture-mobile">
              {content.steps.map((step) => (
                <li key={step.id}>
                  <StepCard
                    step={step}
                    active={selected === step.id}
                    onSelect={select}
                  />
                  {selected === step.id && (
                    <p className="architecture-mobile-description">
                      {step.description}
                    </p>
                  )}
                  <ul
                    className="architecture-connections"
                    aria-label={`${step.title}의 연결`}
                  >
                    {content.links
                      .filter((link) => link.from === step.id)
                      .map((link) => (
                        <li key={link.to}>
                          <span aria-hidden="true">↳</span> {link.label} →{" "}
                          <strong>
                            {
                              content.steps.find(
                                (target) => target.id === link.to,
                              )?.title
                            }
                          </strong>
                        </li>
                      ))}
                  </ul>
                </li>
              ))}
            </ol>
          ) : (
            <div
              className="architecture-canvas"
              style={{ height: projectId === "mermaid-sky" ? 710 : 580 }}
            >
              <ReactFlow
                key={width}
                nodes={nodes}
                edges={edges}
                nodeTypes={nodeTypes}
                fitView
                fitViewOptions={fitOptions}
                minZoom={0.5}
                maxZoom={1.5}
                nodesDraggable={false}
                nodesConnectable={false}
                elementsSelectable={false}
                edgesFocusable={false}
                nodesFocusable={false}
                deleteKeyCode={null}
                panOnDrag={true}
                panOnScroll={false}
                zoomOnScroll={false}
                zoomOnPinch={true}
                zoomOnDoubleClick={false}
                preventScrolling={false}
                ariaLabelConfig={{
                  "controls.zoomIn.ariaLabel": "구조도 확대",
                  "controls.zoomOut.ariaLabel": "구조도 축소",
                  "controls.fitView.ariaLabel": "구조도 전체 보기",
                }}
                aria-label="프로젝트 구성과 데이터 흐름"
              >
                <Background gap={22} size={1} />
                <Controls
                  showInteractive={false}
                  aria-label="구조도 보기 조절"
                />
              </ReactFlow>
            </div>
          ))}
        {!compact && (
          <div
            className="architecture-description"
            aria-live="polite"
            aria-atomic="true"
          >
            <span>선택한 구성</span>
            <h3>{active.title}</h3>
            <p>{active.description}</p>
          </div>
        )}
      </div>
      <div className="architecture-footnote">
        <p>{content.note}</p>
        <p>카드 속 화면은 구조 이해를 위한 축약 그림입니다.</p>
      </div>
      {!compact && (
        <details className="architecture-text-flow">
          <summary>연결 관계를 텍스트로 읽기</summary>
          <ul>
            {content.links.map((link) => (
              <li key={`${link.from}-${link.to}`}>
                {content.steps.find((step) => step.id === link.from)?.title} →{" "}
                {content.steps.find((step) => step.id === link.to)?.title}{" "}
                <span>({link.label})</span>
              </li>
            ))}
          </ul>
        </details>
      )}
    </section>
  );
}
