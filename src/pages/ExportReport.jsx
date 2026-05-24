import { useMemo, useState } from 'react';
import { Check, Clipboard, Download } from 'lucide-react';
import { PageHeader } from '../components/layout/PageHeader.jsx';
import { Card, CardTitle } from '../components/ui/Card.jsx';
import { Button } from '../components/ui/Button.jsx';
import { createArchitectureReport } from '../utils/reportGenerator.js';

export function ExportReport() {
  const report = useMemo(() => createArchitectureReport(), []);
  const [copied, setCopied] = useState(false);

  async function copyReport() {
    await navigator.clipboard.writeText(report);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  function downloadReport() {
    const blob = new Blob([report], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'react-renderflow-architecture-report.md';
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-4">
      <PageHeader
        eyebrow="Export"
        title="Generate an architecture report"
        description="Create a Markdown report summarizing render reductions, wasted work, simulated cost savings, and recommended refactors."
      >
        <div className="grid grid-cols-2 gap-2 sm:flex">
          <Button variant="secondary" onClick={copyReport}>
            {copied ? <Check className="h-4 w-4" /> : <Clipboard className="h-4 w-4" />}
            {copied ? 'Copied' : 'Copy'}
          </Button>
          <Button onClick={downloadReport}>
            <Download className="h-4 w-4" />
            Download
          </Button>
        </div>
      </PageHeader>

      <Card>
        <CardTitle>Markdown Preview</CardTitle>
        <pre className="mt-4 max-h-[620px] overflow-auto whitespace-pre-wrap rounded-lg border border-white/10 bg-slate-950 p-4 font-mono text-xs leading-6 text-slate-200">
          {report}
        </pre>
      </Card>
    </div>
  );
}
