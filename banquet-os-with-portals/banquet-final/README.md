# 🏛 BanquetOS — Management Platform

A production-ready, Vizcom-inspired **Banquet Management System** frontend built with:

- **React 18** + **Vite 5**
- **Tailwind CSS** — custom design system
- **React Router DOM** v6
- **Axios** — API integration ready
- **Recharts** — all dashboards
- **Zustand** — lightweight state management
- **Lucide React** — icons

---

## 🚀 Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

---

## ✨ Features

### Vizcom-Style Reveal Effect
- Hover over the hero banner on the Owner Dashboard
- An orange bounding box follows your cursor
- Reveals a full-color render of a 3D car sketch — mirroring the Vizcom sketch-to-render interaction

### 7 Complete Portals

| Portal | Key Features |
|--------|-------------|
| 👑 **Owner** | Branch health scores, multi-branch revenue charts, staff leaderboard |
| 📞 **Sales** | Kanban pipeline, AI lead scoring, Smart Follow-Up Suggester, WhatsApp one-click |
| 🍽 **Kitchen** | 14-day event view, auto-generated prep checklist, dish feedback history |
| 📦 **Inventory** | Real-time stock, cross-branch transfer alerts, supplier performance |
| 🏗 **Property** | Setup timeline, availability calendar, damage report → finance auto-sync |
| 🤝 **Vendor** | Vendor directory, PO management, invoice approval workflow |
| 💰 **Finance** | GST invoice generation, payment recording, revenue charts, export |

---

## 🌟 Three Star Moments

### 1. Smart Follow-Up Suggester
The system doesn't just remind you to follow up — it generates context-aware suggestions:
- *"Food tasting was 4 days ago — send menu confirmation while taste memory is fresh"*
- *"Lead has gone cold for 6 days — re-engage with festive offer"*

### 2. Cross-Branch Stock Transfer
System automatically flags:
- Andheri has Paneer shortage (18kg, needs 35kg for Sharma Wedding)
- Pune has 42kg surplus
- Suggests transfer → Manager approves in one click

### 3. Damage → Settlement Automation
- Property Manager logs damage with photo
- Finance portal **automatically** deducts from settlement
- Owner dashboard reflects margin impact
- Zero manual entry across three portals

---

## 📁 Project Structure

```
src/
├── components/
│   ├── ui/              # Shared UI components (Badge, Modal, StatCard, etc.)
│   ├── layout/          # Sidebar + TopBar
│   └── SketchReveal.jsx # Vizcom-style hover reveal effect
├── pages/
│   ├── owner/           # Owner Dashboard
│   ├── sales/           # Sales Portal
│   ├── kitchen/         # Kitchen Portal
│   ├── inventory/       # Inventory Portal
│   ├── property/        # Property Manager
│   ├── vendor/          # Vendor Portal
│   └── finance/         # Finance Portal
├── store/
│   └── useStore.js      # Zustand store + mock data
├── App.jsx
├── main.jsx
└── index.css            # Global Tailwind + design tokens
```

---

## 🔌 API Integration

Replace mock data in `src/store/useStore.js` with Axios calls:

```js
import axios from 'axios'

const api = axios.create({ baseURL: '/api/v1' })

// Example: fetch leads
const fetchLeads = async () => {
  const { data } = await api.get('/leads')
  useStore.setState({ leads: data })
}
```

---

## 🎨 Design System

Dark theme inspired by Vizcom's product UI:
- **Font**: Instrument Serif (display) + DM Sans (body)
- **Colors**: Deep navy backgrounds, gold accent (#c9a84c), blue brand (#3b82f6)
- **Components**: All custom-built with Tailwind CSS classes in `index.css`

---

## 📦 Build

```bash
npm run build    # Production build
npm run preview  # Preview production build
```
