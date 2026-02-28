import { create } from 'zustand'

// ── Mock data ──────────────────────────────────────────────────────────────
export const BRANCHES = ['Andheri', 'Pune', 'Thane', 'Bandra']

export const PIPELINE_STAGES = [
  'New', 'Called', 'Site Visit', 'Food Tasting',
  'Advance Paid', 'Menu Finalized', 'Event Day',
  'Settlement', 'Feedback', 'Converted', 'Lost',
]

export const mockLeads = [
  { id: 1, name: 'Sharma Wedding', contact: 'Raj Sharma', phone: '+91 98765 43210', event: 'Wedding', date: '2026-03-15', guests: 350, budget: 800000, stage: 'Food Tasting', score: 88, lastContact: 4, branch: 'Andheri', exec: 'Priya Sharma' },
  { id: 2, name: 'Mehta Anniversary', contact: 'Suresh Mehta', phone: '+91 98765 11111', event: 'Anniversary', date: '2026-03-20', guests: 150, budget: 300000, stage: 'Site Visit', score: 72, lastContact: 1, branch: 'Bandra', exec: 'Rohan Mehta' },
  { id: 3, name: 'TCS Corporate', contact: 'HR Manager', phone: '+91 98765 22222', event: 'Corporate', date: '2026-04-05', guests: 500, budget: 1200000, stage: 'Called', score: 65, lastContact: 6, branch: 'Andheri', exec: 'Priya Sharma' },
  { id: 4, name: 'Patel Engagement', contact: 'Nila Patel', phone: '+91 98765 33333', event: 'Engagement', date: '2026-03-28', guests: 200, budget: 450000, stage: 'Advance Paid', score: 95, lastContact: 0, branch: 'Pune', exec: 'Kavya Iyer' },
  { id: 5, name: 'Singh Birthday', contact: 'Paramjit Singh', phone: '+91 98765 44444', event: 'Birthday', date: '2026-04-12', guests: 80, budget: 120000, stage: 'New', score: 45, lastContact: 2, branch: 'Thane', exec: 'Amit Desai' },
  { id: 6, name: 'Gupta Wedding', contact: 'Anita Gupta', phone: '+91 98765 55555', event: 'Wedding', date: '2026-05-08', guests: 400, budget: 950000, stage: 'Menu Finalized', score: 92, lastContact: 1, branch: 'Andheri', exec: 'Sneha Patil' },
  { id: 7, name: 'Reliance Event', contact: 'Events Team', phone: '+91 98765 66666', event: 'Corporate', date: '2026-04-20', guests: 300, budget: 600000, stage: 'Called', score: 58, lastContact: 8, branch: 'Bandra', exec: 'Rohan Mehta' },
  { id: 8, name: 'Kumar Wedding', contact: 'Vikram Kumar', phone: '+91 98765 77777', event: 'Wedding', date: '2026-06-14', guests: 280, budget: 700000, stage: 'New', score: 42, lastContact: 3, branch: 'Pune', exec: 'Kavya Iyer' },
]

export const mockBranchHealth = [
  { branch: 'Andheri', score: 87, revenue: 860000, bookings: 34, conversion: 72, outstanding: 240000, staffScore: 91, color: '#3b82f6' },
  { branch: 'Pune',    score: 74, revenue: 640000, bookings: 26, conversion: 65, outstanding: 510000, staffScore: 78, color: '#c9a84c' },
  { branch: 'Thane',   score: 68, revenue: 480000, bookings: 19, conversion: 58, outstanding: 730000, staffScore: 72, color: '#a855f7' },
  { branch: 'Bandra',  score: 82, revenue: 720000, bookings: 30, conversion: 69, outstanding: 320000, staffScore: 85, color: '#22c55e' },
]

export const mockRevenueData = [
  { month: 'Sep', Andheri: 420, Pune: 310, Thane: 260, Bandra: 380 },
  { month: 'Oct', Andheri: 510, Pune: 290, Thane: 310, Bandra: 420 },
  { month: 'Nov', Andheri: 680, Pune: 450, Thane: 390, Bandra: 510 },
  { month: 'Dec', Andheri: 920, Pune: 620, Thane: 500, Bandra: 680 },
  { month: 'Jan', Andheri: 740, Pune: 580, Thane: 440, Bandra: 590 },
  { month: 'Feb', Andheri: 860, Pune: 640, Thane: 480, Bandra: 720 },
]

export const mockStaff = [
  { name: 'Priya Sharma',  branch: 'Andheri', leads: 28, closed: 20, revenue: 3400000, followup: 94, rank: 1 },
  { name: 'Rohan Mehta',   branch: 'Bandra',  leads: 24, closed: 17, revenue: 2900000, followup: 88, rank: 2 },
  { name: 'Kavya Iyer',    branch: 'Pune',    leads: 22, closed: 14, revenue: 2400000, followup: 82, rank: 3 },
  { name: 'Amit Desai',    branch: 'Thane',   leads: 18, closed: 11, revenue: 1900000, followup: 76, rank: 4 },
  { name: 'Sneha Patil',   branch: 'Andheri', leads: 16, closed: 10, revenue: 1700000, followup: 71, rank: 5 },
]

export const mockEvents = [
  { id: 1, name: 'Sharma Wedding',  date: '2026-03-15', guests: 350, hall: 'Grand Ballroom', menu: ['Pani Puri','Dahi Vada','Dal Makhani','Paneer Butter Masala','Gulab Jamun'], dietary: ['4 Jain','2 Vegan'], status: 'Confirmed', branch: 'Andheri' },
  { id: 2, name: 'TCS Annual Meet', date: '2026-03-18', guests: 500, hall: 'Convention Hall', menu: ['Soup','Pasta','Grilled Veg','Biryani','Ice Cream'], dietary: ['15 Diabetic','3 Gluten Free'], status: 'Confirmed', branch: 'Andheri' },
  { id: 3, name: 'Patel Engagement',date: '2026-03-28', guests: 200, hall: 'Pearl Suite',    menu: ['Chaat','Tandoori','Dal','Naan','Kheer'], dietary: ['8 Jain'], status: 'Confirmed', branch: 'Pune' },
  { id: 4, name: 'Mehta Anniversary',date:'2026-03-20', guests: 150, hall: 'Jasmine Hall',   menu: ['Salad','Soup','Main Course','Dessert'], dietary: ['2 Vegan'], status: 'Confirmed', branch: 'Bandra' },
  { id: 5, name: 'Gupta Wedding',    date: '2026-05-08', guests: 400, hall: 'Grand Ballroom', menu: ['Full Gujarati Thali'], dietary: ['All Jain'], status: 'Tentative', branch: 'Andheri' },
]

export const mockInventory = [
  { id: 1, item: 'Basmati Rice',   category: 'Grain',    unit: 'kg',     stock: 280, min: 100, branch: 'Andheri', expiry: '2026-06-01', supplier: 'Shree Traders' },
  { id: 2, item: 'Paneer',         category: 'Dairy',    unit: 'kg',     stock: 18,  min: 20,  branch: 'Andheri', expiry: '2026-03-05', supplier: 'Amul Direct' },
  { id: 3, item: 'Chicken',        category: 'Protein',  unit: 'kg',     stock: 45,  min: 30,  branch: 'Andheri', expiry: '2026-03-03', supplier: 'Fresh Farms' },
  { id: 4, item: 'Tomatoes',       category: 'Vegetable',unit: 'kg',     stock: 60,  min: 40,  branch: 'Pune',    expiry: '2026-03-04', supplier: 'Local Market' },
  { id: 5, item: 'Cooking Oil',    category: 'Oil',      unit: 'litre',  stock: 85,  min: 50,  branch: 'Pune',    expiry: '2026-09-01', supplier: 'Fortune' },
  { id: 6, item: 'Paneer',         category: 'Dairy',    unit: 'kg',     stock: 42,  min: 20,  branch: 'Pune',    expiry: '2026-03-06', supplier: 'Amul Direct' },
  { id: 7, item: 'Whole Spices',   category: 'Spice',    unit: 'kg',     stock: 12,  min: 8,   branch: 'Thane',   expiry: '2026-12-01', supplier: 'Spice World' },
  { id: 8, item: 'Sugar',          category: 'Sweet',    unit: 'kg',     stock: 30,  min: 25,  branch: 'Bandra',  expiry: '2026-12-01', supplier: 'Shree Traders' },
]

export const mockVendors = [
  { id: 1, name: 'Patel Decorators',  category: 'Decoration',  rating: 4.5, events: 24, pending: 45000,  ontime: 92, quality: 88, status: 'Active' },
  { id: 2, name: 'Flash Photography', category: 'Photography', rating: 4.8, events: 18, pending: 0,      ontime: 97, quality: 95, status: 'Active' },
  { id: 3, name: 'Sound Arena AV',    category: 'AV',           rating: 4.2, events: 31, pending: 12000,  ontime: 85, quality: 82, status: 'Active' },
  { id: 4, name: 'SecureForce',       category: 'Security',     rating: 4.6, events: 42, pending: 8000,   ontime: 94, quality: 90, status: 'Active' },
  { id: 5, name: 'Royal Florists',    category: 'Decoration',  rating: 4.3, events: 16, pending: 22000,  ontime: 78, quality: 80, status: 'Inactive' },
]

export const mockInvoices = [
  { id: 'INV-2026-089', client: 'Sharma Wedding',   amount: 848000,  gst: 152640, total: 1000640, status: 'Paid',    date: '2026-02-28', branch: 'Andheri' },
  { id: 'INV-2026-088', client: 'TCS Annual',        amount: 570000,  gst: 102600, total: 672600,  status: 'Pending', date: '2026-02-26', branch: 'Andheri' },
  { id: 'INV-2026-087', client: 'Patel Engagement',  amount: 427500,  gst: 76950,  total: 504450,  status: 'Partial', date: '2026-02-25', branch: 'Pune' },
  { id: 'INV-2026-086', client: 'Mehta Anniversary', amount: 285000,  gst: 51300,  total: 336300,  status: 'Paid',    date: '2026-02-20', branch: 'Bandra' },
]

export const mockDamageReports = [
  { id: 1, event: 'Kumar Reception', hall: 'Grand Ballroom', date: '2026-02-15', items: '2x Chair damaged, 1 table cloth torn', amount: 4500,  status: 'Approved' },
  { id: 2, event: 'Singh Birthday',  hall: 'Pearl Suite',    date: '2026-02-20', items: 'Wall scratch near entrance',            amount: 2000,  status: 'Pending' },
]

export const mockFinanceData = [
  { week: 'Week 1', revenue: 840000,  expenses: 580000, profit: 260000 },
  { week: 'Week 2', revenue: 1120000, expenses: 690000, profit: 430000 },
  { week: 'Week 3', revenue: 760000,  expenses: 510000, profit: 250000 },
  { week: 'Week 4', revenue: 1480000, expenses: 890000, profit: 590000 },
]

// ── Zustand store ───────────────────────────────────────────────────────────
export const useStore = create((set, get) => ({
  // UI state
  activePortal: 'owner',
  activeNav: 'dashboard',
  sidebarOpen: true,

  // Data
  leads: mockLeads,
  inventory: mockInventory,
  vendors: mockVendors,
  invoices: mockInvoices,
  events: mockEvents,
  prepChecklist: [
    { id: 1, item: 'Marinate 350 portions chicken tikka', event: 'Sharma Wedding',  qty: '35 kg',      done: false },
    { id: 2, item: 'Prepare 500 portions biryani base',   event: 'TCS Annual',      qty: '50 kg rice', done: false },
    { id: 3, item: 'Chop vegetables for 200 portions',    event: 'Patel Engagement',qty: '25 kg mixed',done: true  },
    { id: 4, item: 'Prepare Gulab Jamun mix',             event: 'Sharma Wedding',  qty: '15 kg',      done: false },
    { id: 5, item: 'Dahi for Dahi Vada',                  event: 'Sharma Wedding',  qty: '20 litres',  done: true  },
    { id: 6, item: 'Knead dough for 800 naans',           event: 'Multiple',        qty: '40 kg flour',done: false },
  ],
  damageReports: mockDamageReports,
  transferAlerts: [
    { id: 1, item: 'Paneer', from: 'Pune', to: 'Andheri', qty: 25, unit: 'kg', event: 'Sharma Wedding', dueBy: '2026-03-14', status: 'Pending' },
  ],

  // Actions
  setActivePortal: (portal) => set({ activePortal: portal, activeNav: 'main' }),
  setActiveNav: (nav) => set({ activeNav: nav }),
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),

  updateLeadStage: (id, stage) => set((s) => ({
    leads: s.leads.map((l) => l.id === id ? { ...l, stage } : l),
  })),

  toggleChecklistItem: (id) => set((s) => ({
    prepChecklist: s.prepChecklist.map((c) => c.id === id ? { ...c, done: !c.done } : c),
  })),

  approveTransfer: (id) => set((s) => ({
    transferAlerts: s.transferAlerts.map((t) => t.id === id ? { ...t, status: 'Approved' } : t),
  })),

  addLead: (lead) => set((s) => ({
    leads: [{ ...lead, id: Date.now(), score: Math.floor(40 + Math.random() * 50) }, ...s.leads],
  })),

  addDamageReport: (report) => set((s) => ({
    damageReports: [{ ...report, id: Date.now(), status: 'Pending' }, ...s.damageReports],
  })),
}))
