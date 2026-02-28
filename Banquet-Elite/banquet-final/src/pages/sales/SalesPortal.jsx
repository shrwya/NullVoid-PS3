<<<<<<< HEAD
import { Alert, Badge, SectionHead, ScoreChip, Tabs, Modal, Field } from '../../components/ui'
import { PIPELINE_STAGES } from '../../store/useStore'
import React, { useState, useEffect } from 'react'



=======
import React, { useState } from 'react'
import { Alert, Badge, SectionHead, ScoreChip, Tabs, Modal, Field } from '../../components/ui'
import { useStore, PIPELINE_STAGES } from '../../store/useStore'
>>>>>>> 98a5c27041215de0b2297d38a2959e5e90e869ca

function getFollowUpSuggestion(lead) {
  if (lead.stage === 'Food Tasting' && lead.lastContact >= 3)
    return `Food tasting was ${lead.lastContact} days ago — send a personalized menu confirmation. High conversion probability while taste memory is fresh.`
  if (lead.stage === 'Called' && lead.lastContact === 0)
    return 'Just called — send venue brochure and availability calendar within the hour while interest peaks.'
  if (lead.lastContact >= 6)
    return `Lead has gone cold (${lead.lastContact} days). Re-engage with a limited-time festive offer or complimentary food tasting invite.`
  if (lead.event === 'Wedding' && lead.budget > 700000)
    return 'High-value wedding lead. Offer a personal meeting with senior manager + complimentary food tasting to accelerate decision.'
  if (lead.stage === 'Site Visit')
    return 'Post-visit — send personalized hall photos, floor plan, and a tailored package quote within 24 hours.'
  return 'Follow up with availability confirmation and package details tailored to their event type and guest count.'
}

function getWhatsAppTemplate(stage) {
  const t = {
    'New':           'Hi! Thank you for your interest in our venue. We\'d love to host your special event. Can we schedule a quick call to understand your requirements?',
    'Called':        'Hi! As discussed, I\'m attaching our venue brochure and packages. We have some great options for your event. When would you like to visit?',
    'Site Visit':    'Thank you for visiting us! We hope you loved the space. Our team loved showing you around 😊 Would you like to proceed with a food tasting?',
    'Food Tasting':  'Thank you for the food tasting! I hope you enjoyed the experience. We\'d love to confirm your booking. Shall we discuss the advance payment?',
    'Advance Paid':  '🎉 Booking confirmed! Welcome to the BanquetOS family. Our team will contact you for menu finalization within 48 hours.',
    'Menu Finalized':'Your menu is finalized! We\'re all set for your event. Our team will reach out 3 days before for final coordination.',
  }
  return t[stage] || 'Following up on your inquiry. Please let us know how we can assist you — our team is here to help!'
}

export default function SalesPortal() {
<<<<<<< HEAD

const [leads, setLeads] = useState([])
=======
  const { leads, updateLeadStage, addLead } = useStore()
>>>>>>> 98a5c27041215de0b2297d38a2959e5e90e869ca
  const [tab, setTab] = useState('pipeline')
  const [selectedLead, setSelectedLead] = useState(null)
  const [showAdd, setShowAdd] = useState(false)
  const [newLead, setNewLead] = useState({ name: '', contact: '', phone: '', event: 'Wedding', guests: '', budget: '', branch: 'Andheri', stage: 'New' })

  const byStage = PIPELINE_STAGES.reduce((acc, s) => {
    acc[s] = leads.filter((l) => l.stage === s)
    return acc
  }, {})

<<<<<<< HEAD
  useEffect(() => {
  loadLeads()
}, [])

const loadLeads = async () => {
  const res = await fetch("http://localhost:8000/leads")
  const data = await res.json()
  setLeads(data)
}

const updateLeadStage = async (id, stage) => {
  try {
    const res = await fetch(`http://localhost:8000/leads/${id}/stage`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ stage })
    })

    if (!res.ok) throw new Error("Update failed")

    // reload data from DB
    await loadLeads()

    // update modal UI instantly
    setSelectedLead(prev => ({
      ...prev,
      stage
    }))
  } catch (err) {
    console.error(err)
    alert("Stage update failed")
  }
}

=======
>>>>>>> 98a5c27041215de0b2297d38a2959e5e90e869ca
  const tabs = [
    { id: 'pipeline',  icon: '📋', label: 'Pipeline' },
    { id: 'leads',     icon: '👤', label: 'All Leads' },
    { id: 'whatsapp',  icon: '💬', label: 'WhatsApp Hub' },
    { id: 'scoring',   icon: '🤖', label: 'AI Scoring' },
    { id:'users', icon:'👤', label:'Add User' }
  ]

  const [customer, setCustomer] = useState({
  name: "",
  contact: "",
  phone: "",
  event: "Wedding",
  guests: "",
  budget: "",
  branch: "Andheri",
  stage: "New"
})

  return (
    <div className="space-y-4 animate-fade-up">
      <Tabs tabs={tabs} active={tab} onChange={setTab} />

      {tab === 'pipeline' && (
        <div>
          <Alert type="gold" icon="🤖">
            AI flagged <strong>3 high-priority leads</strong>. Sharma Wedding (88 pts) is ripe for conversion — food tasting was 4 days ago.
          </Alert>
          <div className="kanban-wrap">
            {PIPELINE_STAGES.slice(0, 9).map((stage) => (
              <div key={stage} className="kanban-col">
                <div className="kanban-col-head">
                  <span className="kanban-col-label">{stage}</span>
                  <span className="kanban-count">{(byStage[stage] || []).length}</span>
                </div>
                {(byStage[stage] || []).map((lead) => (
<<<<<<< HEAD
                  <div key={lead._id} className="kanban-card" onClick={() => setSelectedLead(lead)}>
=======
                  <div key={lead.id} className="kanban-card" onClick={() => setSelectedLead(lead)}>
>>>>>>> 98a5c27041215de0b2297d38a2959e5e90e869ca
                    <div className="text-[12px] font-semibold text-slate-200 mb-0.5">{lead.name}</div>
                    <div className="text-[11px] text-slate-500">{lead.contact}</div>
                    <div className="text-[11px] text-slate-500">👥 {lead.guests} • ₹{Math.round(lead.budget / 100000)}L</div>
                    <div className="flex gap-1.5 mt-2">
                      <ScoreChip score={lead.score} />
                      {lead.lastContact > 0 && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-white/5 text-slate-500">
                          ⏰ {lead.lastContact}d
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "users" && (
  <div className="card p-5">
    <SectionHead title="➕ Add New Customer Lead" />

    <div className="grid grid-cols-2 gap-3 mt-3">

      <Field label="Lead / Event Name">
        <input
          className="input"
          value={customer.name}
          onChange={(e) =>
            setCustomer({ ...customer, name: e.target.value })
          }
          placeholder="e.g. Sharma Wedding"
        />
      </Field>

      <Field label="Contact Person">
        <input
          className="input"
          value={customer.contact}
          onChange={(e) =>
            setCustomer({ ...customer, contact: e.target.value })
          }
        />
      </Field>

      <Field label="Phone">
        <input
          className="input"
          value={customer.phone}
          onChange={(e) =>
            setCustomer({ ...customer, phone: e.target.value })
          }
        />
      </Field>

      <Field label="Event Type">
        <select
          className="input"
          value={customer.event}
          onChange={(e) =>
            setCustomer({ ...customer, event: e.target.value })
          }
        >
          {["Wedding","Engagement","Birthday","Corporate","Anniversary"].map(e =>
            <option key={e}>{e}</option>
          )}
        </select>
      </Field>

      <Field label="Guests">
        <input
          className="input"
          type="number"
          value={customer.guests}
          onChange={(e) =>
            setCustomer({ ...customer, guests: e.target.value })
          }
        />
      </Field>

      <Field label="Budget (₹)">
        <input
          className="input"
          type="number"
          value={customer.budget}
          onChange={(e) =>
            setCustomer({ ...customer, budget: e.target.value })
          }
        />
      </Field>

      <Field label="Branch">
        <select
          className="input"
          value={customer.branch}
          onChange={(e) =>
            setCustomer({ ...customer, branch: e.target.value })
          }
        >
          {["Andheri","Pune","Thane","Bandra"].map(b =>
            <option key={b}>{b}</option>
          )}
        </select>
      </Field>

    </div>

    <button
      className="btn btn-primary mt-4"
    onClick={async () => {
  try {
    const res = await fetch("http://10.130.121.25:8000/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...customer,
        stage: "New"
      }),
    });

    if (!res.ok) throw new Error("Failed");

    alert("Customer Lead Added!");

    setCustomer({
      name: "",
      contact: "",
      phone: "",
      event: "Wedding",
      guests: "",
      budget: "",
      branch: "Andheri",
      stage: "New"
    });

  } catch (err) {
    alert("Error adding customer");
  }
}}
    >
      ➕ Add Customer
    </button>
  </div>
)}

      {tab === 'leads' && (
        <div className="card p-5">
          <SectionHead title="All Leads" action={{ label: '+ New Lead', fn: () => setShowAdd(true) }} />
          <div className="overflow-x-auto">
            <table className="tbl">
              <thead>
                <tr>
                  {['Lead', 'Contact', 'Event', 'Date', 'Guests', 'Budget', 'Stage', 'AI Score', 'Last Contact', 'Actions'].map((h) => (
                    <th key={h}>{h}</th>
                  ))}
                </tr>
              </thead>
<<<<<<< HEAD
             <tbody>
  {[...leads]
    .sort((a, b) => (b.score || 0) - (a.score || 0))
    .map((lead) => (
      <tr
        key={lead._id}
        className="cursor-pointer"
        onClick={() => setSelectedLead(lead)}
      >
        <td className="font-medium text-slate-200">{lead.name}</td>
        <td>{lead.contact}</td>
        <td><Badge type="blue">{lead.event}</Badge></td>
        <td>{lead.date}</td>
        <td>{lead.guests}</td>
        <td>₹{Math.round(lead.budget / 1000)}K</td>
        <td>
          <Badge type={
            ['Advance Paid','Menu Finalized','Converted'].includes(lead.stage)
              ? 'green'
              : lead.stage === 'Lost'
              ? 'red'
              : lead.stage === 'New'
              ? 'gray'
              : 'orange'
          }>
            {lead.stage}
          </Badge>
        </td>
        <td><ScoreChip score={lead.score} /></td>
        <td>
          <span style={{
            color:
              lead.lastContact > 5
                ? '#ef4444'
                : lead.lastContact > 2
                ? '#f97316'
                : '#94a3b8'
          }}>
            {lead.lastContact === 0 ? 'Today' : `${lead.lastContact}d ago`}
          </span>
        </td>
        <td>
          <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
            <button className="btn btn-ghost btn-xs" onClick={() => setSelectedLead(lead)}>👁</button>
            <button
              className="btn btn-whatsapp btn-xs"
              onClick={() => {
  const msg = encodeURIComponent(
    getWhatsAppTemplate(selectedLead.stage)
  )

  window.open(
    `https://wa.me/${selectedLead.phone}?text=${msg}`,
    "_blank"
  )
}}
            >
              💬
            </button>
          </div>
        </td>
      </tr>
    ))}
</tbody>
=======
              <tbody>
                {leads.map((lead) => (
                  <tr key={lead.id} className="cursor-pointer" onClick={() => setSelectedLead(lead)}>
                    <td className="font-medium text-slate-200">{lead.name}</td>
                    <td>{lead.contact}</td>
                    <td><Badge type="blue">{lead.event}</Badge></td>
                    <td>{lead.date}</td>
                    <td>{lead.guests}</td>
                    <td>₹{Math.round(lead.budget / 1000)}K</td>
                    <td>
                      <Badge type={
                        ['Advance Paid', 'Menu Finalized', 'Converted'].includes(lead.stage) ? 'green' :
                        lead.stage === 'Lost' ? 'red' :
                        lead.stage === 'New' ? 'gray' : 'orange'
                      }>{lead.stage}</Badge>
                    </td>
                    <td><ScoreChip score={lead.score} /></td>
                    <td>
                      <span style={{ color: lead.lastContact > 5 ? '#ef4444' : lead.lastContact > 2 ? '#f97316' : '#94a3b8' }}>
                        {lead.lastContact === 0 ? 'Today' : `${lead.lastContact}d ago`}
                      </span>
                    </td>
                    <td>
                      <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
                        <button className="btn btn-ghost btn-xs" onClick={() => setSelectedLead(lead)}>👁</button>
                        <button className="btn btn-whatsapp btn-xs"
                          onClick={() => alert('WhatsApp sent:\n\n' + getWhatsAppTemplate(lead.stage))}>
                          💬
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
>>>>>>> 98a5c27041215de0b2297d38a2959e5e90e869ca
            </table>
          </div>
        </div>
      )}

      {tab === 'whatsapp' && (
        <div>
          <Alert type="blue" icon="💬">
            One-click templates send the right message for each pipeline stage. No typing, no copy-paste.
          </Alert>
          <div className="grid grid-cols-2 gap-4">
            {PIPELINE_STAGES.slice(0, 6).map((stage) => (
              <div key={stage} className="card p-4">
                <div className="text-[13px] font-semibold text-slate-200 mb-2">{stage}</div>
                <div className="text-[12px] text-slate-400 leading-relaxed mb-3 p-3 bg-surface2 rounded-lg">
                  {getWhatsAppTemplate(stage)}
                </div>
                <button
                  className="btn btn-whatsapp btn-sm w-full justify-center"
                  onClick={() => alert(`Sending to ${leads.filter(l => l.stage === stage).length} leads in ${stage} stage`)}
                >
                  💬 Send to {leads.filter((l) => l.stage === stage).length} leads in this stage
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'scoring' && (
        <div>
          <Alert type="gold" icon="🤖">
            AI scoring based on: budget, guest count, response time, pipeline stage, event type, and seasonal factors.
          </Alert>
          <div className="card p-5">
            <SectionHead title="Lead Scoring Breakdown" />
            <div className="overflow-x-auto">
              <table className="tbl">
                <thead>
                  <tr>
                    {['Lead', 'Stage', 'Budget', 'Guests', 'Response Time', 'AI Score', 'Priority', 'Recommendation'].map((h) => (
                      <th key={h}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[...leads].sort((a, b) => b.score - a.score).map((lead) => (
<<<<<<< HEAD
                    <tr key={lead._id}>
=======
                    <tr key={lead.id}>
>>>>>>> 98a5c27041215de0b2297d38a2959e5e90e869ca
                      <td className="font-medium text-slate-200">{lead.name}</td>
                      <td><Badge type="gray">{lead.stage}</Badge></td>
                      <td>₹{Math.round(lead.budget / 1000)}K</td>
                      <td>{lead.guests}</td>
                      <td style={{ color: lead.lastContact > 5 ? '#ef4444' : lead.lastContact > 2 ? '#f97316' : '#22c55e' }}>
                        {lead.lastContact === 0 ? 'Today' : `${lead.lastContact}d`}
                      </td>
                      <td>
                        <ScoreChip score={lead.score} />
                      </td>
                      <td>
                        <Badge type={lead.score >= 80 ? 'green' : lead.score >= 60 ? 'orange' : 'red'}>
                          {lead.score >= 80 ? '🔥 Hot' : lead.score >= 60 ? '⚡ Warm' : '❄️ Cold'}
                        </Badge>
                      </td>
                      <td className="text-[12px] text-slate-400 max-w-[180px]" style={{ whiteSpace: 'normal' }}>
                        {getFollowUpSuggestion(lead).slice(0, 70)}...
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Lead Detail Modal */}
      <Modal open={!!selectedLead} onClose={() => setSelectedLead(null)} title={selectedLead?.name || ''} maxWidth="max-w-xl">
        {selectedLead && (
          <>
            <Badge type={selectedLead.stage === 'Advance Paid' ? 'green' : 'blue'}>{selectedLead.stage}</Badge>
            <div className="grid grid-cols-2 gap-3 my-4">
              {[
                ['Contact', selectedLead.contact],
                ['Phone', selectedLead.phone],
                ['Event Type', selectedLead.event],
                ['Event Date', selectedLead.date],
                ['Guests', selectedLead.guests],
                ['Budget', '₹' + selectedLead.budget?.toLocaleString('en-IN')],
                ['Branch', selectedLead.branch],
                ['Sales Exec', selectedLead.exec],
              ].map(([k, v]) => (
                <div key={k}>
                  <div className="text-[10px] text-slate-500 uppercase tracking-wider mb-0.5">{k}</div>
                  <div className="text-[13px] font-medium text-slate-200">{v}</div>
                </div>
              ))}
            </div>

            <div className="divider" />

            {/* AI Suggestion */}
            <div className="card-gold p-4 mb-4 rounded-xl">
              <div className="text-[10px] text-amber-400 uppercase tracking-widest mb-2">🤖 Smart Follow-Up Suggestion</div>
              <div className="text-[13px] text-slate-200 leading-relaxed">
                {getFollowUpSuggestion(selectedLead)}
              </div>
            </div>

            {/* WhatsApp template */}
            <div className="mb-4">
              <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-2">💬 WhatsApp Template</div>
              <div className="text-[12px] text-slate-400 p-3 bg-surface2 rounded-lg leading-relaxed">
                {getWhatsAppTemplate(selectedLead.stage)}
              </div>
            </div>

            {/* Move stage */}
<<<<<<< HEAD
           <div className="mb-4">
  <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-2">
    Move to Stage
  </div>

  <select
    className="input text-[12px]"
    value={selectedLead.stage}
    onChange={(e) =>
      updateLeadStage(selectedLead._id, e.target.value)
    }
  >
    {PIPELINE_STAGES.map((s) => (
      <option key={s}>{s}</option>
    ))}
  </select>
</div>
=======
            <div className="mb-4">
              <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-2">Move to Stage</div>
              <select
                className="input text-[12px]"
                value={selectedLead.stage}
                onChange={(e) => updateLeadStage(selectedLead.id, e.target.value)}
              >
                {PIPELINE_STAGES.map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>
>>>>>>> 98a5c27041215de0b2297d38a2959e5e90e869ca

            <div className="flex gap-2">
              <button className="btn btn-whatsapp flex-1 justify-center"
                onClick={() => alert('WhatsApp sent!')}>💬 Send WhatsApp</button>
              <button className="btn btn-primary flex-1 justify-center"
                onClick={() => alert('Call logged!')}>📞 Log Call</button>
              <button className="btn btn-ghost btn-sm"
                onClick={() => setSelectedLead(null)}>Close</button>
            </div>
          </>
        )}
      </Modal>

      {/* Add Lead Modal */}
      <Modal open={showAdd} onClose={() => setShowAdd(false)} title="➕ Add New Lead">
        <div className="space-y-0">
          <Field label="Lead / Event Name">
            <input className="input" value={newLead.name} onChange={(e) => setNewLead({ ...newLead, name: e.target.value })} placeholder="e.g. Sharma Wedding" />
          </Field>
          <Field label="Contact Person">
            <input className="input" value={newLead.contact} onChange={(e) => setNewLead({ ...newLead, contact: e.target.value })} />
          </Field>
          <Field label="Phone">
            <input className="input" value={newLead.phone} onChange={(e) => setNewLead({ ...newLead, phone: e.target.value })} />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Event Type">
              <select className="input" value={newLead.event} onChange={(e) => setNewLead({ ...newLead, event: e.target.value })}>
                {['Wedding','Engagement','Birthday','Corporate','Anniversary'].map((e) => <option key={e}>{e}</option>)}
              </select>
            </Field>
            <Field label="Branch">
              <select className="input" value={newLead.branch} onChange={(e) => setNewLead({ ...newLead, branch: e.target.value })}>
                {['Andheri','Pune','Thane','Bandra'].map((b) => <option key={b}>{b}</option>)}
              </select>
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Guests"><input className="input" type="number" value={newLead.guests} onChange={(e) => setNewLead({ ...newLead, guests: e.target.value })} /></Field>
            <Field label="Budget (₹)"><input className="input" type="number" value={newLead.budget} onChange={(e) => setNewLead({ ...newLead, budget: e.target.value })} /></Field>
          </div>
        </div>
        <div className="flex gap-2 mt-4">
<<<<<<< HEAD
     <button
  className="btn btn-primary flex-1 justify-center"
  onClick={async () => {
    await fetch("http://localhost:8000/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newLead)
    })

    setShowAdd(false)
    await loadLeads()
    alert("Lead added!")
  }}
>
  ✅ Add Lead
</button>
=======
          <button className="btn btn-primary flex-1 justify-center"
            onClick={() => { addLead(newLead); setShowAdd(false); alert('Lead added with AI score!') }}>
            ✅ Add Lead
          </button>
>>>>>>> 98a5c27041215de0b2297d38a2959e5e90e869ca
          <button className="btn btn-ghost" onClick={() => setShowAdd(false)}>Cancel</button>
        </div>
      </Modal>
    </div>
  )
}