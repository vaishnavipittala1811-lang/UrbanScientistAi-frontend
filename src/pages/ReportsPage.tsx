import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { UrbanReport } from '../types';
import { FileText, MapPin, Download, Printer, PlusCircle, CheckCircle2, ShieldCheck, RefreshCw } from 'lucide-react';

export const ReportsPage: React.FC = () => {
  const [reports, setReports] = useState<UrbanReport[]>([]);
  const [district, setDistrict] = useState<string>('Hyderabad');
  const [city, setCity] = useState<string>('Hyderabad Central');
  const [summary, setSummary] = useState<string>('');
  const [recommendations, setRecommendations] = useState<string>('');
  const [generating, setGenerating] = useState<boolean>(false);
  const [selectedReport, setSelectedReport] = useState<UrbanReport | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadReports() {
      try {
        const list = await api.getAllReports();
        setReports(list);
        if (list.length > 0) setSelectedReport(list[0]);
      } catch (err) {
        console.error('Failed to load reports:', err);
      } finally {
        setLoading(false);
      }
    }
    loadReports();
  }, []);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setGenerating(true);
    try {
      const rep = await api.generateReport({
        district,
        city,
        summary: summary || undefined,
        recommendations: recommendations || undefined,
      });
      setReports([rep, ...reports]);
      setSelectedReport(rep);
      setSummary('');
      setRecommendations('');
    } catch (err) {
      console.error('Failed to generate report:', err);
    } finally {
      setGenerating(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex-1 p-6 space-y-6 max-w-7xl mx-auto w-full">
      {/* Header */}
      <div className="border-b border-[#1E293B] pb-5 space-y-1">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5" />
            📍 Telangana, India
          </span>
          <span className="text-xs text-gray-500 font-mono">Executive Briefings</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          UrbanScientist AI — Telangana Urban Intelligence Report
        </h1>
        <p className="text-sm text-gray-400">
          AI-powered urban analysis and decision support for Telangana, India.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Report Generator Form & Archive */}
        <div className="lg:col-span-5 space-y-6">
          {/* New Report Form */}
          <form
            onSubmit={handleGenerate}
            className="p-5 rounded-2xl bg-[#111726] border border-[#1E293B] space-y-4 shadow-xl"
          >
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <PlusCircle className="w-4 h-4 text-emerald-400" />
              Generate District Intelligence Report
            </h3>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-gray-400">District Scope:</label>
                <input
                  type="text"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  placeholder="e.g. Hyderabad, Warangal"
                  className="w-full bg-[#161F33] text-gray-200 rounded-lg p-2 border border-[#222F4C] focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-gray-400">City / Node:</label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g. Central Zone"
                  className="w-full bg-[#161F33] text-gray-200 rounded-lg p-2 border border-[#222F4C] focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="space-y-1 text-xs">
              <label className="font-semibold text-gray-400">Custom Executive Note (Optional):</label>
              <textarea
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                placeholder="Leave blank for automated scientific AI synthesis..."
                rows={2}
                className="w-full bg-[#161F33] text-gray-200 rounded-lg p-2 border border-[#222F4C] focus:outline-none focus:border-emerald-500"
              />
            </div>

            <button
              type="submit"
              disabled={generating}
              className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-emerald-500/20 transition-all"
            >
              {generating ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  Generating Report...
                </>
              ) : (
                <>
                  <FileText className="w-3.5 h-3.5" />
                  Generate Official Report
                </>
              )}
            </button>
          </form>

          {/* Past Reports List */}
          <div className="p-5 rounded-2xl bg-[#111726] border border-[#1E293B] space-y-3">
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              Generated Reports Archive ({reports.length})
            </h4>

            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
              {reports.map((rep) => (
                <div
                  key={rep.reportId}
                  onClick={() => setSelectedReport(rep)}
                  className={`p-3 rounded-xl border cursor-pointer transition-all text-xs ${
                    selectedReport?.reportId === rep.reportId
                      ? 'bg-[#161F33] border-emerald-500'
                      : 'bg-[#0B0F19] border-[#1E293B] hover:border-[#222F4C]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white">{rep.district} ({rep.city})</span>
                    <span className="text-[10px] font-mono text-emerald-400">{rep.reportId}</span>
                  </div>
                  <p className="text-[11px] text-gray-500 mt-1">
                    Scope: {rep.geographicScope} • Score: {rep.healthScore}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Official Printable Report Document Preview */}
        <div className="lg:col-span-7">
          {selectedReport ? (
            <div className="p-8 rounded-2xl bg-[#111726] border border-[#222F4C] space-y-6 shadow-2xl print:bg-white print:text-black print:border-none">
              {/* Report Header */}
              <div className="border-b border-[#1E293B] pb-5 flex items-start justify-between">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold uppercase tracking-wider mb-2">
                    <MapPin className="w-3 h-3" />
                    Geographic Scope: {selectedReport.geographicScope}
                  </div>
                  <h2 className="text-xl font-black text-white tracking-tight">
                    {selectedReport.title}
                  </h2>
                  <p className="text-xs text-gray-400 mt-1">
                    {selectedReport.subtitle}
                  </p>
                </div>

                <div className="flex items-center gap-2 print:hidden">
                  <button
                    onClick={handlePrint}
                    className="p-2 rounded-lg bg-[#161F33] hover:bg-[#222F4C] border border-[#222F4C] text-gray-200"
                    title="Print Report"
                  >
                    <Printer className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Meta strip */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 rounded-xl bg-[#0B0F19] border border-[#1E293B] text-xs font-mono">
                <div>
                  <span className="text-[10px] text-gray-500 block">Report ID</span>
                  <span className="font-bold text-emerald-400">{selectedReport.reportId}</span>
                </div>
                <div>
                  <span className="text-[10px] text-gray-500 block">District / City</span>
                  <span className="text-gray-200">{selectedReport.district} / {selectedReport.city}</span>
                </div>
                <div>
                  <span className="text-[10px] text-gray-500 block">Urban Health Score</span>
                  <span className="font-bold text-white">{selectedReport.healthScore} / 100</span>
                </div>
                <div>
                  <span className="text-[10px] text-gray-500 block">Authority</span>
                  <span className="text-gray-200">{selectedReport.generatedBy}</span>
                </div>
              </div>

              {/* Executive Summary */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-gray-200 uppercase tracking-wider">
                  Executive Scientific Summary
                </h4>
                <p className="text-xs text-gray-300 leading-relaxed bg-[#161F33]/50 p-4 rounded-xl border border-[#222F4C]">
                  {selectedReport.summary}
                </p>
              </div>

              {/* Civil Interventions & Recommendations */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-gray-200 uppercase tracking-wider">
                  Strategic Civic Recommendations
                </h4>
                <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20 text-xs text-gray-300 leading-relaxed space-y-1">
                  {selectedReport.recommendations}
                </div>
              </div>

              {/* Validation Footer */}
              <div className="pt-4 border-t border-[#1E293B] flex items-center justify-between text-[11px] text-gray-500">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  Validated by UrbanScientist AI Regional Decision Core
                </span>
                <span>Telangana, India</span>
              </div>
            </div>
          ) : (
            <div className="p-12 rounded-2xl bg-[#111726] border border-[#1E293B] text-center text-gray-500 text-xs">
              Select or generate a report to inspect.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
