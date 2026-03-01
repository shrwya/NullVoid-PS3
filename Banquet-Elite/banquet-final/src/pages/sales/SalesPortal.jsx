import React, { useState, useEffect } from "react";
import {
  Badge,
  SectionHead,
  ScoreChip,
  Tabs,
  Modal,
  Field,
} from "../../components/ui";
import { PIPELINE_STAGES } from "../../store/useStore";

/* ================= MENU OPTIONS ================= */

const DISH_OPTIONS = [
  "Paneer Butter Masala",
  "Dal Makhani",
  "Veg Biryani",
  "Chicken Biryani",
  "Butter Naan",
  "Tandoori Roti",
  "Hakka Noodles",
  "Manchurian",
  "Gulab Jamun",
  "Ice Cream",
];

/* ================= STAGE CONFIG ================= */

const STAGE_CONFIG = {
  New:            { color: "#94a3b8", dot: "#94a3b8",  glow: "rgba(148,163,184,0.15)" },
  Called:         { color: "#60a5fa", dot: "#60a5fa",  glow: "rgba(96,165,250,0.15)"  },
  "Site Visit":   { color: "#34d399", dot: "#34d399",  glow: "rgba(52,211,153,0.15)"  },
  "Food Tasting": { color: "#f59e0b", dot: "#f59e0b",  glow: "rgba(245,158,11,0.15)"  },
  "Advance Paid": { color: "#a78bfa", dot: "#a78bfa",  glow: "rgba(167,139,250,0.15)" },
  "Menu Finalized":{ color: "#f97316", dot: "#f97316", glow: "rgba(249,115,22,0.15)"  },
  "Event Day":    { color: "#c9a84c", dot: "#c9a84c",  glow: "rgba(201,168,76,0.15)"  },
  Settled:        { color: "#10b981", dot: "#10b981",  glow: "rgba(16,185,129,0.15)"  },
};

/* ================= AI SCORING ================= */

function calculateLeadScore(lead) {
  let score = 0;
  const budget = Number(lead.budget || 0);
  const guests = Number(lead.guests || 0);
  if (budget > 1000000) score += 40;
  else if (budget > 500000) score += 30;
  else if (budget > 200000) score += 20;
  if (guests > 500) score += 25;
  else if (guests > 200) score += 15;
  if (lead.event === "Wedding") score += 20;
  if (lead.event === "Corporate") score += 10;
  score += (lead.menu?.length || 0) * 2;
  if (lead.stage === "New") score += 10;
  return score;
}

function ScoreBar({ score }) {
  const pct = Math.min(100, score);
  const color =
    score >= 80 ? "#10b981" :
    score >= 50 ? "#f59e0b" :
    "#94a3b8";
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1 rounded-full" style={{ background: "rgba(255,255,255,0.08)" }}>
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${pct}%`, background: color }}
        />
      </div>
      <span className="text-[11px] font-bold tabular-nums" style={{ color, minWidth: 24 }}>
        {score}
      </span>
    </div>
  );
}

/* ================= STAT CARD ================= */

function StatCard({ label, value, icon, accent }) {
  return (
    <div
      className="relative rounded-2xl p-4 overflow-hidden"
      style={{
        background: "linear-gradient(145deg, #111520 0%, #161c2a 100%)",
        border: "1px solid rgba(30,42,62,0.8)",
        boxShadow: "0 4px 24px rgba(0,0,0,0.3)",
      }}
    >
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{ background: `linear-gradient(90deg, transparent, ${accent}55, transparent)` }}
      />
      <div className="flex items-start justify-between mb-3">
        <span className="text-[10px] uppercase tracking-[0.15em] text-slate-500">{label}</span>
        <span className="text-lg opacity-70">{icon}</span>
      </div>
      <div className="text-2xl font-bold text-white leading-none">{value}</div>
    </div>
  );
}

/* ================= PIPELINE CARD ================= */

function LeadCard({ lead, onClick }) {
  const score = calculateLeadScore(lead);
  const cfg = STAGE_CONFIG[lead.stage] || STAGE_CONFIG["New"];
  const scoreColor = score >= 80 ? "#10b981" : score >= 50 ? "#f59e0b" : "#94a3b8";

  return (
    <div
      onClick={onClick}
      className="rounded-xl p-3 mb-2 cursor-pointer transition-all duration-200"
      style={{
        background: "linear-gradient(145deg, #0d1017 0%, #131922 100%)",
        border: "1px solid rgba(255,255,255,0.05)",
        boxShadow: "0 2px 12px rgba(0,0,0,0.3)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = cfg.color + "44";
        e.currentTarget.style.transform = "translateY(-1px)";
        e.currentTarget.style.boxShadow = `0 4px 20px rgba(0,0,0,0.4), 0 0 0 1px ${cfg.color}22`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "rgba(255,255,255,0.05)";
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 2px 12px rgba(0,0,0,0.3)";
      }}
    >
      {/* Name + event type */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <div>
          <div className="text-[13px] font-semibold text-white leading-tight">{lead.name}</div>
          <div className="text-[11px] text-slate-500 mt-0.5">{lead.contact}</div>
        </div>
        {lead.event && (
          <span
            className="text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0"
            style={{
              background: cfg.glow,
              color: cfg.color,
              border: `1px solid ${cfg.color}33`,
            }}
          >
            {lead.event}
          </span>
        )}
      </div>

      {/* Stats row */}
      <div className="flex items-center gap-3 mb-2.5 text-[11px] text-slate-500">
        {lead.guests && (
          <span className="flex items-center gap-1">
            <span>👥</span> {lead.guests}
          </span>
        )}
        {lead.budget && (
          <span className="flex items-center gap-1">
            <span>💰</span> ₹{Number(lead.budget).toLocaleString("en-IN")}
          </span>
        )}
        {lead.eventFrom && (
          <span className="flex items-center gap-1">
            <span>📅</span> {lead.eventFrom}
          </span>
        )}
      </div>

      {/* Score bar */}
      <ScoreBar score={score} />
    </div>
  );
}

/* ================= MAIN COMPONENT ================= */

export default function SalesPortal() {
  const emptyLead = {
    name: "",
    contact: "",
    phone: "",
    event: "Wedding",
    guests: "",
    budget: "",
    branch: "Andheri",
    stage: "New",
    eventFrom: "",
    eventTo: "",
    menu: [],
  };

  const [leads, setLeads] = useState([]);
  const [tab, setTab] = useState("pipeline");
  const [selectedLead, setSelectedLead] = useState(null);
  const [customer, setCustomer] = useState(emptyLead);

  /* ================= FETCH ================= */

  async function fetchLeads() {
    try {
      const res = await fetch("http://127.0.0.1:8000/leads");
      const data = await res.json();
      setLeads(data);
    } catch (err) {
      console.log("Backend not reachable", err);
    }
  }

  useEffect(() => {
    fetchLeads();
  }, []);

  /* ================= ADD CUSTOMER ================= */

  async function addCustomer() {
    try {
      await fetch("http://127.0.0.1:8000/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(customer),
      });
      setCustomer(emptyLead);
      fetchLeads();
      alert("Customer Added!");
    } catch {
      alert("Error adding customer");
    }
  }

  /* ================= PIPELINE GROUP ================= */

  const byStage = PIPELINE_STAGES.reduce((acc, stage) => {
    acc[stage] = leads.filter((l) => l.stage === stage);
    return acc;
  }, {});

  /* ================= STATS ================= */

  const totalLeads = leads.length;
  const hotLeads = leads.filter((l) => calculateLeadScore(l) >= 80).length;
  const pipelineValue = leads.reduce((s, l) => s + Number(l.budget || 0), 0);
  const avgScore = totalLeads
    ? Math.round(leads.reduce((s, l) => s + calculateLeadScore(l), 0) / totalLeads)
    : 0;

  const tabs = [
    { id: "pipeline", label: "📋 Pipeline" },
    { id: "scoring",  label: "🤖 AI Scoring" },
    { id: "users",    label: "➕ Add Lead"   },
  ];

  /* ──────────────────────────────────────────────────── */

  return (
    <div className="space-y-5">

      {/* ── STAT STRIP ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard label="Total Leads"     value={totalLeads}  icon="📋" accent="#60a5fa" />
        <StatCard label="Hot Leads 🔥"    value={hotLeads}    icon="🎯" accent="#f59e0b" />
        <StatCard
          label="Pipeline Value"
          value={`₹${(pipelineValue / 100000).toFixed(1)}L`}
          icon="💰"
          accent="#c9a84c"
        />
        <StatCard label="Avg AI Score"    value={avgScore}    icon="🤖" accent="#a78bfa" />
      </div>

      {/* ── TABS ── */}
      <Tabs tabs={tabs} active={tab} onChange={setTab} />

      {/* ══════════════════ PIPELINE ══════════════════ */}

      {tab === "pipeline" && (
        <div className="flex gap-3 overflow-x-auto pb-3 no-scrollbar">
          {PIPELINE_STAGES.map((stage) => {
            const cfg = STAGE_CONFIG[stage] || STAGE_CONFIG["New"];
            const stageLeads = byStage[stage] || [];
            return (
              <div
                key={stage}
                className="flex-shrink-0 rounded-2xl p-3"
                style={{
                  minWidth: 220,
                  background: "linear-gradient(180deg, #111520 0%, #0e1118 100%)",
                  border: `1px solid ${cfg.color}22`,
                }}
              >
                {/* Column header */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-1.5">
                    <div
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ background: cfg.dot }}
                    />
                    <span
                      className="text-[10px] font-bold uppercase tracking-[0.12em]"
                      style={{ color: cfg.color }}
                    >
                      {stage}
                    </span>
                  </div>
                  <span
                    className="text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                    style={{ background: cfg.glow, color: cfg.color }}
                  >
                    {stageLeads.length}
                  </span>
                </div>

                {/* Cards */}
                {stageLeads.length === 0 ? (
                  <div className="py-6 text-center text-[11px] text-slate-700">
                    No leads
                  </div>
                ) : (
                  stageLeads.map((lead) => (
                    <LeadCard
                      key={lead._id}
                      lead={lead}
                      onClick={() => setSelectedLead(lead)}
                    />
                  ))
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* ══════════════════ ADD LEAD ══════════════════ */}

      {tab === "users" && (
        <div
          className="rounded-2xl overflow-hidden"
          style={{
            background: "linear-gradient(145deg, #111520 0%, #0e1118 100%)",
            border: "1px solid rgba(201,168,76,0.15)",
          }}
        >
          {/* Header */}
          <div
            className="px-6 py-4 border-b"
            style={{ borderColor: "rgba(255,255,255,0.05)" }}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center text-base"
                style={{ background: "rgba(201,168,76,0.12)", border: "1px solid rgba(201,168,76,0.25)" }}
              >
                ➕
              </div>
              <div>
                <div className="text-[14px] font-semibold text-white">Add Customer Lead</div>
                <div className="text-[11px] text-slate-500">Fill in details to create a new lead</div>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-6">

            {/* Fields grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { label: "Name",         key: "name",      type: "text"   },
                { label: "Contact",      key: "contact",   type: "text"   },
                { label: "Phone",        key: "phone",     type: "text"   },
                { label: "Guests",       key: "guests",    type: "number" },
                { label: "Budget (₹)",   key: "budget",    type: "number" },
                { label: "Event From",   key: "eventFrom", type: "date"   },
                { label: "Event To",     key: "eventTo",   type: "date"   },
              ].map(({ label, key, type }) => (
                <div key={key}>
                  <label className="block text-[10px] uppercase tracking-[0.12em] text-slate-500 mb-1.5">
                    {label}
                  </label>
                  <input
                    type={type}
                    className="input"
                    value={customer[key]}
                    onChange={(e) => setCustomer({ ...customer, [key]: e.target.value })}
                  />
                </div>
              ))}
            </div>

            {/* Menu Selection */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-[10px] uppercase tracking-[0.12em] text-slate-500">
                  Menu Selection
                </span>
                <span
                  className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                  style={{ background: "rgba(201,168,76,0.12)", color: "#c9a84c", border: "1px solid rgba(201,168,76,0.25)" }}
                >
                  {(customer.menu || []).length} selected
                </span>
              </div>

              <div
                className="grid grid-cols-2 gap-2 p-4 rounded-xl"
                style={{ background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.05)" }}
              >
                {DISH_OPTIONS.map((dish) => {
                  const checked = (customer.menu || []).includes(dish);
                  return (
                    <label
                      key={dish}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-lg cursor-pointer transition-all text-[12px]"
                      style={{
                        background: checked ? "rgba(201,168,76,0.08)" : "rgba(255,255,255,0.02)",
                        border: `1px solid ${checked ? "rgba(201,168,76,0.3)" : "rgba(255,255,255,0.05)"}`,
                        color: checked ? "#e8c56a" : "#94a3b8",
                      }}
                    >
                      <input
                        type="checkbox"
                        className="accent-amber-400 w-3.5 h-3.5 flex-shrink-0"
                        checked={checked}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setCustomer({ ...customer, menu: [...customer.menu, dish] });
                          } else {
                            setCustomer({ ...customer, menu: customer.menu.filter((d) => d !== dish) });
                          }
                        }}
                      />
                      {dish}
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Submit */}
            <div className="flex justify-end pt-2">
              <button
                onClick={addCustomer}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-[13px] transition-all duration-200 hover:scale-105 active:scale-95"
                style={{
                  background: "linear-gradient(135deg, #c9a84c 0%, #b8922e 100%)",
                  color: "#000",
                  boxShadow: "0 4px 20px rgba(201,168,76,0.3)",
                }}
              >
                Add Customer →
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ══════════════════ AI SCORING ══════════════════ */}

      {tab === "scoring" && (
        <div
          className="rounded-2xl overflow-hidden"
          style={{
            background: "linear-gradient(145deg, #111520 0%, #0e1118 100%)",
            border: "1px solid rgba(167,139,250,0.15)",
          }}
        >
          {/* Header */}
          <div
            className="px-6 py-4 border-b flex items-center justify-between"
            style={{ borderColor: "rgba(255,255,255,0.05)" }}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center text-base"
                style={{ background: "rgba(167,139,250,0.12)", border: "1px solid rgba(167,139,250,0.25)" }}
              >
                🤖
              </div>
              <div>
                <div className="text-[14px] font-semibold text-white">AI Lead Scoring Engine</div>
                <div className="text-[11px] text-slate-500">Ranked by conversion probability</div>
              </div>
            </div>
            <div className="text-[11px] text-slate-600">{leads.length} leads</div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                  {["#", "Name", "Event", "Guests", "Budget", "Score", "Priority"].map((h) => (
                    <th
                      key={h}
                      className="px-4 py-3 text-left text-[10px] uppercase tracking-[0.12em] font-medium text-slate-600"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[...leads]
                  .map((lead) => ({ ...lead, aiScore: calculateLeadScore(lead) }))
                  .sort((a, b) => b.aiScore - a.aiScore)
                  .map((lead, idx) => {
                    const isHot  = lead.aiScore > 80;
                    const isWarm = lead.aiScore > 50;
                    return (
                      <tr
                        key={lead._id}
                        className="group transition-colors"
                        style={{ borderBottom: "1px solid rgba(255,255,255,0.03)" }}
                        onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.015)"}
                        onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                      >
                        <td className="px-4 py-3 text-[11px] text-slate-700 font-mono">{idx + 1}</td>
                        <td className="px-4 py-3">
                          <div className="text-[13px] font-semibold text-white">{lead.name}</div>
                          <div className="text-[11px] text-slate-600">{lead.contact}</div>
                        </td>
                        <td className="px-4 py-3 text-[12px] text-slate-400">{lead.event}</td>
                        <td className="px-4 py-3 text-[12px] text-slate-400">{lead.guests}</td>
                        <td className="px-4 py-3 text-[12px] text-slate-400">
                          ₹{Number(lead.budget || 0).toLocaleString("en-IN")}
                        </td>
                        <td className="px-4 py-3" style={{ minWidth: 120 }}>
                          <ScoreBar score={lead.aiScore} />
                        </td>
                        <td className="px-4 py-3">
                          {isHot ? (
                            <span
                              className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full"
                              style={{ background: "rgba(16,185,129,0.12)", color: "#10b981", border: "1px solid rgba(16,185,129,0.25)" }}
                            >
                              🔥 Hot
                            </span>
                          ) : isWarm ? (
                            <span
                              className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full"
                              style={{ background: "rgba(245,158,11,0.12)", color: "#f59e0b", border: "1px solid rgba(245,158,11,0.25)" }}
                            >
                              ⚡ Warm
                            </span>
                          ) : (
                            <span
                              className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full"
                              style={{ background: "rgba(148,163,184,0.1)", color: "#64748b", border: "1px solid rgba(148,163,184,0.15)" }}
                            >
                              Cold
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>

            {leads.length === 0 && (
              <div className="py-16 text-center text-slate-700 text-[13px]">
                No leads yet — add one above
              </div>
            )}
          </div>
        </div>
      )}

      {/* ══════════════════ LEAD DETAIL MODAL ══════════════════ */}

      <Modal
        open={!!selectedLead}
        onClose={() => setSelectedLead(null)}
        title={selectedLead?.name}
      >
        {selectedLead && (
          <div className="space-y-4">

            {/* Stage badge */}
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-slate-500 uppercase tracking-widest">Stage</span>
              <span
                className="text-[11px] font-bold px-2.5 py-1 rounded-full"
                style={{
                  background: (STAGE_CONFIG[selectedLead.stage] || STAGE_CONFIG["New"]).glow,
                  color:      (STAGE_CONFIG[selectedLead.stage] || STAGE_CONFIG["New"]).color,
                  border:     `1px solid ${(STAGE_CONFIG[selectedLead.stage] || STAGE_CONFIG["New"]).color}33`,
                }}
              >
                {selectedLead.stage}
              </span>
            </div>

            {/* AI Score */}
            <div>
              <div className="text-[11px] text-slate-500 uppercase tracking-widest mb-2">AI Score</div>
              <ScoreBar score={calculateLeadScore(selectedLead)} />
            </div>

            {/* Details */}
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: "Event",   value: selectedLead.event   },
                { label: "Guests",  value: selectedLead.guests  },
                { label: "Budget",  value: selectedLead.budget ? `₹${Number(selectedLead.budget).toLocaleString("en-IN")}` : "—" },
                { label: "Phone",   value: selectedLead.phone   },
                { label: "Branch",  value: selectedLead.branch  },
                { label: "From",    value: selectedLead.eventFrom },
                { label: "To",      value: selectedLead.eventTo   },
              ].map(({ label, value }) => value && (
                <div
                  key={label}
                  className="p-2.5 rounded-lg"
                  style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}
                >
                  <div className="text-[9px] text-slate-600 uppercase tracking-widest mb-0.5">{label}</div>
                  <div className="text-[12px] text-slate-300 font-medium">{value}</div>
                </div>
              ))}
            </div>

            {/* Menu */}
            {(selectedLead.menu || []).length > 0 && (
              <div>
                <div className="text-[11px] text-slate-500 uppercase tracking-widest mb-2">
                  Menu ({selectedLead.menu.length} dishes)
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {selectedLead.menu.map((dish, i) => (
                    <span
                      key={i}
                      className="text-[11px] px-2.5 py-1 rounded-full"
                      style={{
                        background: "rgba(201,168,76,0.08)",
                        color: "#c9a84c",
                        border: "1px solid rgba(201,168,76,0.2)",
                      }}
                    >
                      {dish}
                    </span>
                  ))}
                </div>
              </div>
            )}

          </div>
        )}
      </Modal>

    </div>
  );
}
