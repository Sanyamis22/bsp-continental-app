'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { 
  FiRefreshCw, 
  FiSearch, 
  FiTrendingUp, 
  FiClock, 
  FiCheckCircle, 
  FiAlertCircle, 
  FiFileText, 
  FiShield, 
  FiX, 
  FiActivity,
  FiEye,
  FiCalendar,
  FiUsers,
  FiArrowUpRight
} from 'react-icons/fi';
import type { RequestDTO, RequestDocumentDTO } from "@/types/request";

export default function AdminDashboardAnalytics() {
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('ALL'); // ALL, CIBIL, PROPERTY
  const [chartMetric, setChartMetric] = useState<'total' | 'cibil' | 'property'>('total');
  const [isLoading, setIsLoading] = useState(false);
  const [requests, setRequests] = useState<RequestDTO[]>([]);
  const [selectedRecord, setSelectedRecord] = useState<RequestDTO | null>(null);

  // Dynamic Metrics: CIBIL aur Property
  const [metrics, setMetrics] = useState({
    total: 0,
    cibil: 0,
    property: 0,
    todayTotal: 0
  });

  // Rolling 7 Days
  const past7Days = useMemo(() => {
    const days: { fullDate: string; displayDate: string }[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      days.push({
        fullDate: d.toISOString().split('T')[0],
        displayDate: d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric' })
      });
    }
    return days;
  }, []);

  // Chart Data: Total, CIBIL, Property
  const chartData = useMemo(() => {
    return past7Days.map(day => {
      const dayRequests = requests.filter((r) => {
        const reqDate = new Date(r.createdAt || Date.now()).toISOString().split('T')[0];
        return reqDate === day.fullDate;
      });

      const total = dayRequests.length;
      const cibil = dayRequests.filter(r => r.serviceType === 'CIBIL Audit' || r.serviceType === 'CIBIL_SCORE').length;
      const property = dayRequests.filter(r => r.serviceType === 'Property Vetting' || r.serviceType === 'PROPERTY_VETTING' || r.serviceType === 'Property Compliance').length;

      return {
        ...day,
        total,
        cibil,
        property
      };
    });
  }, [requests, past7Days]);

  const maxChartVal = useMemo(() => {
    const vals = chartData.map(d => d[chartMetric]);
    const max = Math.max(...vals, 1);
    return max < 5 ? 5 : max;
  }, [chartData, chartMetric]);

  const fetchLedgerData = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/requests');
      const data = await res.json();

      if (res.ok && data.success) {
        processLedgerData(data.data || []);
      } else {
        setRequests([]);
      }
    } catch (err) {
      console.error("Fetch Live Ledger Error:", err);
      setRequests([]);
    } finally {
      setIsLoading(false);
    }
  };

  const processLedgerData = (data: RequestDTO[]) => {
    setRequests(data);
    const todayStr = new Date().toISOString().split('T')[0];

    const total = data.length;
    const cibil = data.filter((r: RequestDTO) => r.serviceType === 'CIBIL Audit' || r.serviceType === 'CIBIL_SCORE').length;
    const property = data.filter((r: RequestDTO) => r.serviceType === 'Property Vetting' || r.serviceType === 'PROPERTY_VETTING' || r.serviceType === 'Property Compliance').length;
    const todayTotal = data.filter((r: RequestDTO) => new Date(r.createdAt || Date.now()).toISOString().split('T')[0] === todayStr).length;

    setMetrics({ total, cibil, property, todayTotal });
  };

  useEffect(() => {
    fetchLedgerData();
  }, []);

  const filteredRequests = useMemo(() => {
    return requests.filter(item => {
      const matchesSearch = 
        (item.userName || item.clientName)?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.userPhone || item.mobileNumber)?.includes(searchQuery) ||
        (item.userEmail || item.email)?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item._id?.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;

      if (activeFilter === 'ALL') return true;
      if (activeFilter === 'CIBIL') return item.serviceType === 'CIBIL Audit' || item.serviceType === 'CIBIL_SCORE';
      if (activeFilter === 'PROPERTY') return item.serviceType === 'Property Vetting' || item.serviceType === 'PROPERTY_VETTING' || item.serviceType === 'Property Compliance';
      return true;
    });
  }, [requests, searchQuery, activeFilter]);

  const handleBarClick = (dateStr: string) => {
    router.push(`/admin/dashboard/requests?date=${dateStr}`);
  };

  return (
    <div className="w-full min-h-screen bg-[#FAFBFD] text-slate-900 select-none antialiased p-4 sm:p-8 lg:p-10 transition-all duration-300 space-y-6">

      {/* ─── 1. Header Bar ─── */}
      <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-[#217044] text-white flex items-center justify-center shadow-xs shrink-0">
            <FiActivity size={22} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-slate-950 uppercase tracking-tight">
                Control Hub
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#E5A812]/15 text-[#966b00] border border-[#E5A812]/30">
                {metrics.todayTotal} New Today
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              Live monitoring for CIBIL audits aur Property verification desk.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <button
            type="button"
            onClick={() => router.push('/admin/dashboard/leads')}
            className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#217044] hover:bg-[#185332] text-white text-xs font-bold uppercase tracking-wider transition-all active:scale-95 shadow-xs cursor-pointer"
          >
            <FiUsers size={15} />
            <span>Leads</span>
            <FiArrowUpRight size={14} className="text-[#E5A812]" />
          </button>

          <button 
            type="button"
            onClick={fetchLedgerData}
            disabled={isLoading}
            className="inline-flex items-center justify-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold uppercase tracking-wider px-3.5 py-2.5 rounded-xl transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
          >
            <FiRefreshCw className={isLoading ? "animate-spin" : ""} size={14} />
            <span>Sync</span>
          </button>
        </div>
      </div>

      {/* ─── 2. Metric Cards ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        <div className="bg-white border border-slate-200/80 p-4 sm:p-5 rounded-2xl shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Today / Total</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-slate-900 font-mono">{metrics.todayTotal}</span>
              <span className="text-xs font-semibold text-slate-400 font-mono">/ {metrics.total} Files</span>
            </div>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md inline-block">
              ● Live Sync
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-[#217044]">
            <FiCalendar size={22} />
          </div>
        </div>

        <div className="bg-white border border-slate-200/80 p-4 sm:p-5 rounded-2xl shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-blue-500 uppercase tracking-wider block">CIBIL Checks</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-blue-600 font-mono">{metrics.cibil}</span>
              <span className="text-xs font-semibold text-slate-400">Audits</span>
            </div>
            <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md inline-block">
              Score Diagnostics
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600">
            <FiShield size={22} />
          </div>
        </div>

        <div className="bg-white border border-slate-200/80 p-4 sm:p-5 rounded-2xl shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-amber-500 uppercase tracking-wider block">Property Vetting</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-amber-600 font-mono">{metrics.property}</span>
              <span className="text-xs font-semibold text-slate-400">Records</span>
            </div>
            <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md inline-block">
              Title & Deed Check
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600">
            <FiFileText size={22} />
          </div>
        </div>
      </div>

      {/* ─── 3. Ratio Matrix & Trend Chart ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        
        {/* Service Volume Ratio */}
        <div className="lg:col-span-4 bg-white border border-slate-200/80 p-5 rounded-3xl shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight">Service Volume Ratio</h3>
            <p className="text-[11px] font-medium text-slate-400 mt-0.5">
              Breakdown of CIBIL vs Property records.
            </p>
          </div>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold text-slate-700">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-600" /> CIBIL Score Audits
                </span>
                <span className="font-mono">{metrics.total ? Math.round((metrics.cibil / metrics.total) * 100) : 0}%</span>
              </div>
              <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-600 rounded-full transition-all duration-500" 
                  style={{ width: `${metrics.total ? (metrics.cibil / metrics.total) * 100 : 0}%` }}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold text-slate-700">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Property Vetting
                </span>
                <span className="font-mono">{metrics.total ? Math.round((metrics.property / metrics.total) * 100) : 0}%</span>
              </div>
              <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-amber-500 rounded-full transition-all duration-500" 
                  style={{ width: `${metrics.total ? (metrics.property / metrics.total) * 100 : 0}%` }}
                />
              </div>
            </div>
          </div>

          <div className="p-3 bg-[#F8FAFC] border border-slate-100 rounded-2xl text-[11px] font-semibold text-[#217044] flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#217044] animate-pulse shrink-0" />
            <span>Encrypted central database synced</span>
          </div>
        </div>

        {/* Trend Chart */}
        <div className="lg:col-span-8 bg-white border border-slate-200/80 p-5 rounded-3xl shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <FiTrendingUp className="text-[#217044]" size={16} />
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight">7-Day Activity Trend</h3>
              </div>
              <p className="text-[11px] text-slate-400 font-medium">Daily requests activity.</p>
            </div>

            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-bold w-fit">
              {([
                { id: 'total', label: 'All' },
                { id: 'cibil', label: 'CIBIL' },
                { id: 'property', label: 'Property' }
              ] as const).map(item => (
                <button
                  key={item.id}
                  onClick={() => setChartMetric(item.id)}
                  className={`px-3 py-1 rounded-lg transition-all text-[11px] font-bold uppercase tracking-wider cursor-pointer ${
                    chartMetric === item.id 
                      ? 'bg-white text-slate-950 shadow-2xs font-black' 
                      : 'text-slate-500 hover:text-black'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <div className="h-48 pt-6 flex items-end justify-between gap-2 px-2 relative">
            <div className="absolute inset-x-0 top-0 border-b border-dashed border-slate-100 text-[9px] font-mono text-slate-300">
              Max: {maxChartVal}
            </div>

            {chartData.map((day, idx) => {
              const val = day[chartMetric];
              const heightPercent = Math.max(Math.round((val / maxChartVal) * 100), 8);

              return (
                <div 
                  key={idx} 
                  onClick={() => handleBarClick(day.fullDate)}
                  className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group cursor-pointer"
                  title={`${day.displayDate}: ${val} Requests`}
                >
                  <span className="opacity-0 group-hover:opacity-100 text-[10px] font-mono font-bold text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded transition-opacity">
                    {val}
                  </span>

                  <div className="w-full max-w-[32px] bg-slate-100 rounded-xl overflow-hidden p-0.5 flex items-end h-full group-hover:bg-slate-200 transition-colors">
                    <motion.div 
                      initial={{ height: "0%" }}
                      animate={{ height: `${heightPercent}%` }}
                      transition={{ duration: 0.4, delay: idx * 0.04 }}
                      className={`w-full rounded-lg transition-colors ${
                        chartMetric === 'cibil' ? 'bg-blue-600' :
                        chartMetric === 'property' ? 'bg-amber-500' : 'bg-[#217044]'
                      }`}
                    />
                  </div>

                  <span className="text-[10px] font-semibold text-slate-400 group-hover:text-black transition-colors mt-0.5 truncate">
                    {day.displayDate}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* ─── 4. Filter Console ─── */}
      <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <input
            type="text"
            placeholder="Search applicant name, phone, or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#F8FAFC] border border-slate-200/90 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#217044] font-medium"
          />
          <FiSearch className="absolute left-3 top-2.5 text-slate-400" size={14} />
        </div>

        <div className="flex items-center gap-1.5 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          {[
            { id: 'ALL', label: 'All Files' },
            { id: 'CIBIL', label: 'CIBIL' },
            { id: 'PROPERTY', label: 'Property' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                activeFilter === tab.id
                  ? "bg-[#217044] text-white shadow-2xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* ─── 5. Ledger Table ─── */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[650px]">
            <thead>
              <tr className="border-b border-slate-100 bg-[#FAFBFD] text-[10px] uppercase font-mono tracking-wider font-bold text-slate-400">
                <th className="p-3.5 pl-6">Applicant</th>
                <th className="p-3.5">Contact</th>
                <th className="p-3.5">Service</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5">Date</th>
                <th className="p-3.5 pr-6 text-right">View</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs font-medium">
              {filteredRequests.map((req) => (
                <tr key={req._id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="p-3.5 pl-6">
                    <div className="font-extrabold text-slate-900">{req.userName || req.clientName || "Anonymous"}</div>
                    <div className="font-mono text-[10px] text-slate-400">#{req._id?.substring(18)}</div>
                  </td>

                  <td className="p-3.5">
                    <div className="font-bold text-slate-800 font-mono text-[11px]">{req.userPhone || req.mobileNumber || 'N/A'}</div>
                    <div className="text-[10px] text-slate-400 font-mono truncate max-w-[140px]">{req.userEmail || req.email}</div>
                  </td>

                  <td className="p-3.5">
                    <span className={`text-[10px] font-black px-2.5 py-1 rounded-md uppercase font-mono ${
                      req.serviceType === 'CIBIL Audit' || req.serviceType === 'CIBIL_SCORE'
                        ? 'bg-blue-50 text-blue-700 border border-blue-100'
                        : 'bg-amber-50 text-amber-700 border border-amber-100'
                    }`}>
                      {req.serviceType === 'CIBIL Audit' || req.serviceType === 'CIBIL_SCORE' ? 'CIBIL Audit' : 'Property Vetting'}
                    </span>
                  </td>

                  <td className="p-3.5">
                    <span className={`inline-flex items-center gap-1 text-[10px] font-black px-2 py-0.5 rounded-full uppercase ${
                      req.status === 'Approved' || req.status === 'COMPLETED'
                        ? 'bg-emerald-50 text-[#217044]'
                        : req.status === 'In Review' || req.status === 'PROCESSING'
                        ? 'bg-blue-50 text-blue-700'
                        : 'bg-amber-50 text-amber-700'
                    }`}>
                      {(req.status === 'Approved' || req.status === 'COMPLETED') && <FiCheckCircle size={11} />}
                      {(req.status === 'In Review' || req.status === 'PROCESSING') && <FiClock size={11} />}
                      {(req.status === 'Pending' || req.status === 'PENDING') && <FiAlertCircle size={11} />}
                      <span>{req.status || 'Pending'}</span>
                    </span>
                  </td>

                  <td className="p-3.5 text-slate-400 font-mono text-[11px]">
                    {new Date(req.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                  </td>

                  <td className="p-3.5 pr-6 text-right">
                    <button
                      onClick={() => setSelectedRecord(req)}
                      className="p-2 rounded-xl bg-slate-100 hover:bg-[#217044] hover:text-white text-slate-600 transition-all active:scale-95 cursor-pointer"
                    >
                      <FiEye size={14} />
                    </button>
                  </td>
                </tr>
              ))}

              {filteredRequests.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-400 font-semibold text-xs">
                    {isLoading ? "Loading records..." : "Koi request record nahi mila."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ─── 6. Inspection Modal ─── */}
      <AnimatePresence>
        {selectedRecord && (
          <div className="fixed inset-0 z-[75] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedRecord(null)}
              className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative z-10 w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-slate-100 space-y-4"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h3 className="text-sm font-black text-slate-900 uppercase">File Details</h3>
                  <p className="text-[11px] text-slate-400 font-mono">ID: {selectedRecord._id}</p>
                </div>
                <button
                  onClick={() => setSelectedRecord(null)}
                  className="p-1.5 text-slate-400 hover:text-black rounded-full bg-slate-50 cursor-pointer"
                >
                  <FiX size={16} />
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div className="grid grid-cols-2 gap-2 bg-[#F8FAFC] p-3 rounded-2xl border border-slate-100">
                  <div>
                    <span className="text-slate-400 font-bold block uppercase text-[9px]">Client</span>
                    <span className="font-extrabold text-slate-900">{selectedRecord.userName || selectedRecord.clientName || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-bold block uppercase text-[9px]">Contact</span>
                    <span className="font-mono font-bold text-slate-800 truncate block">{selectedRecord.userPhone || selectedRecord.mobileNumber || selectedRecord.userEmail}</span>
                  </div>
                </div>

                <div className="bg-[#F8FAFC] p-3 rounded-2xl border border-slate-100 space-y-1">
                  <span className="text-slate-400 font-bold block uppercase text-[9px]">Payload Meta</span>
                  <pre className="text-[#217044] bg-white p-2.5 rounded-xl font-mono text-[10px] border border-slate-200 overflow-x-auto max-h-36">
                    {JSON.stringify(selectedRecord.details || selectedRecord.metaDataLogs || {}, null, 2)}
                  </pre>
                </div>
              </div>

              <button
                onClick={() => setSelectedRecord(null)}
                className="w-full py-3 rounded-xl bg-[#217044] hover:bg-[#185332] text-white font-black text-xs uppercase tracking-wider transition-all cursor-pointer shadow-xs"
              >
                Close
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}