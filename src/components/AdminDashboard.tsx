import React, { useState, useEffect } from 'react';
import {
  Database,
  Users,
  HardDrive,
  Download,
  Code,
  Trash2,
  ArrowLeft,
  ShieldAlert,
  CheckCircle,
  Copy,
  Check,
  RefreshCw,
  Server,
  Lock,
  ExternalLink,
} from 'lucide-react';
import { StoredUserRecord } from '../types/auth';
import {
  getAllRegisteredUsers,
  clearAllRegisteredUsers,
  exportUsersCSV,
  USERS_STORAGE_KEY,
} from '../services/authService';

interface AdminDashboardProps {
  onBackToApp: () => void;
  onAdminLogout: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onBackToApp,
  onAdminLogout,
}) => {
  const [users, setUsers] = useState<StoredUserRecord[]>(() => getAllRegisteredUsers());
  const [showRawJson, setShowRawJson] = useState<boolean>(false);
  const [copiedJson, setCopiedJson] = useState<boolean>(false);
  const [statusNotice, setStatusNotice] = useState<string | null>(null);

  // Sync users whenever component mounts or updates
  const refreshUsers = () => {
    const list = getAllRegisteredUsers();
    setUsers(list);
    setStatusNotice('Data reloaded from localStorage.');
    setTimeout(() => setStatusNotice(null), 3000);
  };

  const handleClearData = () => {
    if (window.confirm('Are you sure you want to clear all user records from localStorage?')) {
      clearAllRegisteredUsers();
      setUsers([]);
      setStatusNotice('localStorage key "heatwave_users" has been cleared.');
      setTimeout(() => setStatusNotice(null), 3000);
    }
  };

  const handleExportCSV = () => {
    if (users.length === 0) {
      alert('No user records available to export.');
      return;
    }
    exportUsersCSV(users);
    setStatusNotice('Exported heatwave_users.csv successfully!');
    setTimeout(() => setStatusNotice(null), 3000);
  };

  const rawJsonString = JSON.stringify(users, null, 2);

  const handleCopyJson = () => {
    navigator.clipboard.writeText(rawJsonString);
    setCopiedJson(true);
    setTimeout(() => setCopiedJson(false), 2500);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-6 lg:p-8 font-sans relative">
      {/* Top Header Bar */}
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-rose-600 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-amber-500/20">
            <Database className="w-5 h-5 text-slate-950 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                Admin Dashboard - User Data Storage Monitor
              </h1>
              <span className="px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-700/80 text-[10px] font-mono font-bold uppercase tracking-wider flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Live Storage
              </span>
              <span className="px-2 py-0.5 rounded-lg bg-sky-950/80 border border-sky-700/80 text-[10px] font-mono font-bold text-sky-300">
                heat-waverisk-2026
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Firebase Console style monitor inspecting client-side persistence and active user telemetry.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={refreshUsers}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-200 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5 text-amber-400" />
            <span>Refresh</span>
          </button>
          <button
            onClick={onBackToApp}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-200 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-sky-400" />
            <span>Return to App</span>
          </button>
          <button
            onClick={onAdminLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-950/60 hover:bg-rose-900/60 border border-rose-800/80 text-xs font-bold text-rose-300 transition-colors"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Exit Admin</span>
          </button>
        </div>
      </div>

      {/* Ephemeral Notice Toast */}
      {statusNotice && (
        <div className="max-w-7xl mx-auto my-3 p-3 bg-amber-500/15 border border-amber-500/40 rounded-xl text-amber-300 text-xs flex items-center justify-between animate-in fade-in">
          <span>{statusNotice}</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto py-6 space-y-6">
        {/* MANDATED REQUIREMENT: 3 Info Cards on top */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {/* Card 1: Storage Location */}
          <div className="bg-slate-900/90 border border-slate-800 hover:border-slate-700 rounded-3xl p-5 shadow-xl transition-all relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-bl-full pointer-events-none transition-all group-hover:scale-110" />
            <div className="flex items-center gap-2.5 text-amber-400 mb-2">
              <HardDrive className="w-4 h-4" />
              <span className="text-[11px] font-mono uppercase font-bold tracking-wider">Storage Target</span>
            </div>
            <div className="text-sm sm:text-base font-extrabold text-white">
              Browser localStorage
            </div>
            <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 font-mono text-xs text-amber-300">
              key: <span className="text-white font-bold">{USERS_STORAGE_KEY}</span>
            </div>
            <p className="mt-2.5 text-[11px] text-slate-400 leading-relaxed">
              Persists across reloads, page refreshes, and PWA installs on this client device.
            </p>
          </div>

          {/* Card 2: Total Registered Users */}
          <div className="bg-slate-900/90 border border-slate-800 hover:border-slate-700 rounded-3xl p-5 shadow-xl transition-all relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-sky-500/10 rounded-bl-full pointer-events-none transition-all group-hover:scale-110" />
            <div className="flex items-center gap-2.5 text-sky-400 mb-2">
              <Users className="w-4 h-4" />
              <span className="text-[11px] font-mono uppercase font-bold tracking-wider">User Registry</span>
            </div>
            <div className="text-2xl sm:text-3xl font-black font-mono text-white">
              {users.length} <span className="text-xs font-sans font-medium text-slate-400">active profiles</span>
            </div>
            <div className="mt-2 text-xs text-sky-300 flex items-center gap-1.5">
              <CheckCircle className="w-3.5 h-3.5 text-sky-400" />
              <span>Synced with live login state</span>
            </div>
            <p className="mt-2.5 text-[11px] text-slate-400 leading-relaxed">
              Total registered students, outdoor workers, and community members in watch zone.
            </p>
          </div>

          {/* Card 3: Storage Type */}
          <div className="bg-slate-900/90 border border-slate-800 hover:border-slate-700 rounded-3xl p-5 shadow-xl transition-all relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-bl-full pointer-events-none transition-all group-hover:scale-110" />
            <div className="flex items-center gap-2.5 text-purple-400 mb-2">
              <Server className="w-4 h-4" />
              <span className="text-[11px] font-mono uppercase font-bold tracking-wider">Architecture State</span>
            </div>
            <div className="text-sm sm:text-base font-extrabold text-white">
              Client-side (Hackathon Demo)
            </div>
            <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-purple-950/60 border border-purple-800 text-[11px] font-mono text-purple-200">
              <span>Production: <strong>Firebase / MongoDB</strong></span>
            </div>
            <p className="mt-2.5 text-[11px] text-slate-400 leading-relaxed">
              Zero cloud cost for hackathon jury evaluation with seamless migration schema to Cloud Firestore.
            </p>
          </div>
        </div>

        {/* Security Banner Note */}
        <div className="p-3.5 bg-slate-900 border border-amber-500/30 rounded-2xl flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-amber-300">
            <Lock className="w-4 h-4 shrink-0 text-amber-400" />
            <span>
              <strong>Security Protocol:</strong> Only Admin can view this page. Normal users cannot access <code className="bg-slate-950 px-1.5 py-0.5 rounded text-amber-200 font-mono">/admin</code> without authenticated credentials.
            </span>
          </div>
          <span className="hidden sm:inline-block text-[11px] font-mono text-slate-500">
            Session: Authenticated
          </span>
        </div>

        {/* User Data Table Section */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-2xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <span>Logged-In &amp; Registered Users</span>
                <span className="text-xs font-mono font-normal text-slate-400">
                  (localStorage[&apos;heatwave_users&apos;])
                </span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Real-time records created by the user login form and threshold personalizer.
              </p>
            </div>

            {/* Table Action Buttons: Export CSV, View Raw JSON, Clear All Data */}
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={handleExportCSV}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-slate-950 font-bold text-xs shadow-sm transition-all"
                title="Download user table as CSV file"
              >
                <Download className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Export CSV</span>
              </button>
              <button
                onClick={() => setShowRawJson(!showRawJson)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-amber-300 transition-colors"
                title="Inspect raw localStorage string"
              >
                <Code className="w-3.5 h-3.5" />
                <span>{showRawJson ? 'Hide Raw JSON' : 'View Raw JSON'}</span>
              </button>
              <button
                onClick={handleClearData}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-950/70 hover:bg-rose-900/80 border border-rose-800/80 text-xs font-bold text-rose-300 transition-colors"
                title="Clear all records from localStorage"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear All Data</span>
              </button>
            </div>
          </div>

          {/* Table Container */}
          <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-950/60">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900 text-slate-400 font-mono uppercase text-[11px] border-b border-slate-800">
                <tr>
                  <th className="px-4 py-3">Sl No</th>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Location</th>
                  <th className="px-4 py-3 text-center">Personal Limit (°C)</th>
                  <th className="px-4 py-3">Login Time</th>
                  <th className="px-4 py-3">Device Info</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-850">
                {users.length > 0 ? (
                  users.map((u, idx) => (
                    <tr
                      key={u.id || idx}
                      className="hover:bg-slate-900/70 transition-colors"
                    >
                      <td className="px-4 py-3.5 font-mono text-slate-500 font-bold">
                        #{idx + 1}
                      </td>
                      <td className="px-4 py-3.5 font-bold text-white whitespace-nowrap">
                        {u.name}
                      </td>
                      <td className="px-4 py-3.5 text-sky-400 font-mono whitespace-nowrap">
                        {u.email}
                      </td>
                      <td className="px-4 py-3.5 text-slate-300 whitespace-nowrap">
                        📍 {u.location}
                      </td>
                      <td className="px-4 py-3.5 text-center font-mono">
                        <span className="inline-block px-2.5 py-1 rounded-lg bg-purple-950/80 border border-purple-700/80 text-purple-300 font-bold">
                          {u.personalThresholdTempC}°C
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-slate-400 font-mono whitespace-nowrap">
                        {u.loginTime}
                      </td>
                      <td className="px-4 py-3.5 text-slate-300 font-mono text-[11px]">
                        <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800">
                          {u.deviceInfo}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="px-4 py-12 text-center text-slate-500">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <Users className="w-8 h-8 text-slate-600 stroke-[1.5]" />
                        <span className="text-sm font-semibold">No users registered yet</span>
                        <p className="text-xs text-slate-500 max-w-sm">
                          Use the login or signup form on the main page to create user records in localStorage.
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Expandable Raw JSON Code Block for Hackathon Judges */}
          {showRawJson && (
            <div className="mt-4 p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 animate-in fade-in">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-amber-400 flex items-center gap-1.5">
                  <Code className="w-3.5 h-3.5" />
                  <span>localStorage.getItem(&apos;heatwave_users&apos;) [Raw JSON String]</span>
                </span>
                <button
                  onClick={handleCopyJson}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-mono text-slate-300"
                >
                  {copiedJson ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-400" />
                      <span>Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Copy JSON</span>
                    </>
                  )}
                </button>
              </div>
              <pre className="p-3 bg-slate-900/90 rounded-xl overflow-x-auto text-[11px] font-mono text-sky-300 max-h-72 border border-slate-800">
                {rawJsonString}
              </pre>
            </div>
          )}
        </div>

        {/* MANDATED REQUIREMENT: VISUAL PROOF & FLOW DIAGRAM */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-2xl space-y-4">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              <span>Where is data stored? Diagram &amp; Code Proof</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Transparent client-side architecture verified for hackathon jury evaluation.
            </p>
          </div>

          {/* Flow Diagram */}
          <div className="p-4 sm:p-6 bg-slate-950/80 rounded-2xl border border-slate-800 space-y-4">
            <div className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono">
              Data Pipeline &amp; Storage Architecture:
            </div>

            {/* Horizontal flow on desktop, stacked on mobile */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-center">
              {/* Step 1 */}
              <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col items-center justify-center space-y-1">
                <span className="w-7 h-7 rounded-xl bg-amber-500/20 text-amber-400 font-black flex items-center justify-center text-xs">
                  1
                </span>
                <span className="text-xs font-bold text-white">User Login Form</span>
                <span className="text-[10px] text-slate-400">Name, Email, Location, Danger Threshold</span>
              </div>

              {/* Step 2 */}
              <div className="p-3.5 rounded-2xl bg-sky-950/60 border border-sky-800/80 flex flex-col items-center justify-center space-y-1 relative">
                <div className="hidden md:block absolute -left-3 top-1/2 -translate-y-1/2 text-sky-400 font-bold">
                  →
                </div>
                <span className="w-7 h-7 rounded-xl bg-sky-500/20 text-sky-400 font-black flex items-center justify-center text-xs">
                  2
                </span>
                <span className="text-xs font-bold text-sky-200">localStorage (Browser)</span>
                <span className="text-[10px] text-sky-300/80 font-mono">key: heatwave_users</span>
              </div>

              {/* Step 3 */}
              <div className="p-3.5 rounded-2xl bg-emerald-950/60 border border-emerald-800/80 flex flex-col items-center justify-center space-y-1 relative">
                <div className="hidden md:block absolute -left-3 top-1/2 -translate-y-1/2 text-emerald-400 font-bold">
                  →
                </div>
                <span className="w-7 h-7 rounded-xl bg-emerald-500/20 text-emerald-400 font-black flex items-center justify-center text-xs">
                  3
                </span>
                <span className="text-xs font-bold text-emerald-200">Admin Dashboard Table</span>
                <span className="text-[10px] text-emerald-300/80">Real-time monitor &amp; CSV export</span>
              </div>

              {/* Step 4 */}
              <div className="p-3.5 rounded-2xl bg-purple-950/40 border border-purple-800/60 flex flex-col items-center justify-center space-y-1 relative">
                <div className="hidden md:block absolute -left-3 top-1/2 -translate-y-1/2 text-purple-400 font-bold">
                  →
                </div>
                <span className="w-7 h-7 rounded-xl bg-purple-500/20 text-purple-400 font-black flex items-center justify-center text-xs">
                  4
                </span>
                <span className="text-xs font-bold text-purple-200">(Future) Cloud Database</span>
                <span className="text-[10px] text-purple-300/80">Firebase / MongoDB Atlas</span>
              </div>
            </div>

            {/* MANDATED CODE SNIPPET */}
            <div className="mt-4 space-y-1.5">
              <span className="text-[11px] font-mono text-slate-400">
                Verified Storage Setter Call (source: <code className="text-amber-400">authService.ts</code>):
              </span>
              <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 font-mono text-xs text-emerald-400 overflow-x-auto">
                <code>localStorage.setItem(&apos;heatwave_users&apos;, JSON.stringify(users))</code>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
