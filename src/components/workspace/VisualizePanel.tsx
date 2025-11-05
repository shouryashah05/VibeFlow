import cytoscape from 'cytoscape';
import { useEffect, useMemo, useRef } from 'react';
import { Bar, Line, Pie } from 'react-chartjs-2';
import { ensureChartsRegistered } from '../../lib/registerCharts';
import type { ProcessedProject } from '../../types';

interface VisualizePanelProps {
  project: ProcessedProject | null;
  isUploading: boolean;
}

export const VisualizePanel = ({ project, isUploading }: VisualizePanelProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const cyRef = useRef<cytoscape.Core | null>(null);

  useEffect(() => {
    ensureChartsRegistered();
  }, []);

  useEffect(() => {
    if (!containerRef.current) {
      return;
    }

    cyRef.current?.destroy();

    if (!project || project.files.length === 0) {
      return;
    }

    cyRef.current = cytoscape({
      container: containerRef.current,
      elements: project.graphElements,
      style: [
        {
          selector: 'node',
          style: {
            'background-color': '#0E6FFF',
            label: 'data(label)',
            color: '#e2e8f0',
            'text-outline-color': '#0E1A2B',
            'text-outline-width': 1,
            'font-size': 10,
            'overlay-padding': '6px',
          },
        },
        {
          selector: 'edge',
          style: {
            width: 1.5,
            'line-color': '#1f2937',
            'target-arrow-color': '#1f2937',
            'target-arrow-shape': 'triangle',
            'curve-style': 'bezier',
          },
        },
      ],
      layout: {
        name: 'breadthfirst',
        fit: true,
        directed: true,
        padding: 40,
        spacingFactor: 1.3,
      },
    });

    return () => {
      cyRef.current?.destroy();
      cyRef.current = null;
    };
  }, [project]);

  const extensionChart = useMemo(() => {
    if (!project || project.summary.extensionHistogram.length === 0) {
      return null;
    }

    const labels = project.summary.extensionHistogram.map((item) => item.extension);
    const data = project.summary.extensionHistogram.map((item) => item.count);

    return {
      data: {
        labels,
        datasets: [
          {
            label: 'Files',
            data,
            backgroundColor: labels.map((_, index) =>
              index % 3 === 0 ? 'rgba(45, 226, 230, 0.6)' : index % 3 === 1 ? 'rgba(14, 111, 255, 0.6)' : 'rgba(127, 90, 240, 0.6)',
            ),
            borderWidth: 0,
          },
        ],
      },
      options: {
        plugins: {
          legend: { display: false },
        },
        scales: {
          x: {
            ticks: { color: '#94a3b8' },
            grid: { color: 'rgba(148, 163, 184, 0.1)' },
          },
          y: {
            ticks: { color: '#94a3b8' },
            grid: { color: 'rgba(148, 163, 184, 0.08)' },
          },
        },
      },
    };
  }, [project]);

  const lineChart = useMemo(() => {
    if (!project || project.topFilesByLines.length === 0) {
      return null;
    }

    const labels = project.topFilesByLines.map((item) => item.path.split('/').pop() ?? item.path);
    const data = project.topFilesByLines.map((item) => item.lines);

    return {
      data: {
        labels,
        datasets: [
          {
            label: 'Lines of code',
            data,
            borderColor: '#2DE2E6',
            backgroundColor: 'rgba(45, 226, 230, 0.25)',
            tension: 0.35,
            fill: true,
          },
        ],
      },
      options: {
        plugins: {
          legend: { labels: { color: '#e2e8f0' } },
        },
        scales: {
          x: {
            ticks: { color: '#94a3b8' },
            grid: { display: false },
          },
          y: {
            ticks: { color: '#94a3b8' },
            grid: { color: 'rgba(148, 163, 184, 0.1)' },
          },
        },
      },
    };
  }, [project]);

  const donutChart = useMemo(() => {
    if (!project || project.summary.extensionHistogram.length === 0) {
      return null;
    }

    const labels = project.summary.extensionHistogram.map((item) => item.extension);
    const data = project.summary.extensionHistogram.map((item) => item.count);

    return {
      data: {
        labels,
        datasets: [
          {
            data,
            backgroundColor: labels.map((_, index) =>
              index % 3 === 0 ? 'rgba(14, 111, 255, 0.65)' : index % 3 === 1 ? 'rgba(127, 90, 240, 0.65)' : 'rgba(45, 226, 230, 0.65)',
            ),
            borderColor: '#0b1120',
          },
        ],
      },
      options: {
        plugins: {
          legend: {
            labels: {
              color: '#e2e8f0',
            },
          },
        },
      },
    };
  }, [project]);

  if (!project || project.files.length === 0) {
    return (
      <div className="mx-auto max-w-3xl rounded-3xl border border-dashed border-slate-700 bg-slate-900/30 p-12 text-center">
        <h2 className="text-2xl font-semibold text-white">Upload a project to visualise</h2>
        <p className="mt-4 text-sm text-slate-400">
          We will build an interactive dependency graph and charts summarising your codebase. Drop a folder above to get started.
        </p>
        {isUploading ? (
          <p className="mt-6 text-sm text-cobalt">Processing folder …</p>
        ) : null}
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <div className="rounded-3xl border border-slate-800/70 bg-slate-950/40 p-4 shadow-[0_0_35px_rgba(14,111,255,0.08)]">
        <h2 className="px-2 text-sm font-semibold uppercase tracking-[0.35em] text-slate-400">
          Project Graph
        </h2>
        <div ref={containerRef} className="mt-4 h-[420px] rounded-2xl bg-slate-950/80" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {extensionChart ? (
          <div className="rounded-3xl border border-slate-800/70 bg-slate-950/40 p-6 shadow-[0_0_35px_rgba(45,226,230,0.08)]">
            <h3 className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-400">
              File Types
            </h3>
            <Bar data={extensionChart.data} options={extensionChart.options} />
          </div>
        ) : null}

        {donutChart ? (
          <div className="rounded-3xl border border-slate-800/70 bg-slate-950/40 p-6 shadow-[0_0_35px_rgba(127,90,240,0.12)]">
            <h3 className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-400">
              Composition
            </h3>
            <Pie data={donutChart.data} options={donutChart.options} />
          </div>
        ) : null}
      </div>

      {lineChart ? (
        <div className="rounded-3xl border border-slate-800/70 bg-slate-950/40 p-6 shadow-[0_0_35px_rgba(14,111,255,0.12)]">
          <h3 className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-400">
            Richest Files
          </h3>
          <Line data={lineChart.data} options={lineChart.options} />
        </div>
      ) : null}
    </div>
  );
};
