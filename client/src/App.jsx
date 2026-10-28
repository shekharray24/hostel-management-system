import React, { useEffect, useState, createContext, useContext } from 'react';
import { Routes, Route, Navigate, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, Users, DoorOpen, BedDouble, WalletCards, LogOut, 
  Menu, X, Search, Plus, Trash2, Pencil, CheckCircle2, AlertCircle, 
  Building2, GraduationCap, CircleDollarSign, Activity, ChevronRight, ShieldCheck 
} from 'lucide-react';
import api, { messageOf } from './api';

const AuthContext = createContext(null);
const useAuth = () => useContext(AuthContext);

const money = (n) => 
  new Intl.NumberFormat('en-IN', { 
    style: 'currency', 
    currency: 'INR', 
    maximumFractionDigits: 0 
  }).format(Number(n || 0));

function App() {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('hostel_user'));
    } catch {
      return null;
    }
  });

  const login = (data) => { 
    localStorage.setItem('hostel_token', data.token); 
    localStorage.setItem('hostel_user', JSON.stringify(data.user)); 
    setUser(data.user); 
  };

  const logout = () => { 
    localStorage.removeItem('hostel_token'); 
    localStorage.removeItem('hostel_user'); 
    setUser(null); 
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      <Routes>
        <Route path="/login" element={user ? <Navigate to="/" replace /> : <AuthPage />} />
        <Route path="/*" element={user ? <Shell /> : <Navigate to="/login" replace />} />
      </Routes>
    </AuthContext.Provider>
  );
}

function AuthPage() {
  const { login } = useAuth();
  const [register, setRegister] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const submit = async (e) => {
    e.preventDefault(); 
    setBusy(true); 
    setError(''); 
    try {
      const { data } = await api.post(`/auth/${register ? 'register' : 'login'}`, form);
      login(data);
    } catch (err) {
      setError(messageOf(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="auth-screen">
      <div className="auth-decoration">
        <div className="brand-mark large"><Building2 size={28} /></div>
        <span className="eyebrow">HOSTEL OPERATIONS, SIMPLIFIED</span>
        <h1>A better way to<br /><em>manage your hostel.</em></h1>
        <p>One workspace for students, rooms, allocations and fees.</p>
        <div className="auth-mini-stats">
          <div><strong>01</strong><span>Students</span></div>
          <div><strong>02</strong><span>Rooms</span></div>
          <div><strong>03</strong><span>Payments</span></div>
        </div>
      </div>
      <div className="auth-card">
        <div className="auth-mobile-brand">
          <div className="brand-mark"><Building2 /></div>
          <strong>HostelHub</strong>
        </div>
        <span className="eyebrow">{register ? 'GET STARTED' : 'WELCOME BACK'}</span>
        <h2>{register ? 'Create admin account' : 'Sign in to HostelHub'}</h2>
        <p className="muted">
          {register ? 'Set up your hostel management workspace.' : 'Enter your details to access your dashboard.'}
        </p>
        {error && <div className="alert error"><AlertCircle size={17} />{error}</div>}
        <form onSubmit={submit} className="form-stack">
          {register && (
            <Field 
              label="Full name" 
              value={form.name} 
              onChange={v => setForm({ ...form, name: v })} 
              required 
              placeholder="Your name" 
            />
          )}
          <Field 
            label="Email address" 
            type="email" 
            value={form.email} 
            onChange={v => setForm({ ...form, email: v })} 
            required 
            placeholder="admin@hostel.com" 
          />
          <Field 
            label="Password" 
            type="password" 
            value={form.password} 
            onChange={v => setForm({ ...form, password: v })} 
            required 
            minLength={register ? 8 : undefined} 
            placeholder={register ? 'At least 8 characters' : 'Enter your password'} 
          />
          <button className="btn primary full" disabled={busy}>
            {busy ? 'Please wait…' : register ? 'Create account' : 'Sign in'}
            <ChevronRight size={17} />
          </button>
        </form>
        <p className="auth-switch">
          {register ? 'Already have an account?' : 'New to HostelHub?'}{' '}
          <button onClick={() => { setRegister(!register); setError(''); }}>
            {register ? 'Sign in' : 'Create admin account'}
          </button>
        </p>
        <div className="secure-note">
          <ShieldCheck size={15} /> Secure access with JWT authentication
        </div>
      </div>
    </div>
  );
}

function Shell() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const location = useLocation();

  useEffect(() => setOpen(false), [location.pathname]);

  const nav = [
    { to: '/', label: 'Overview', icon: LayoutDashboard }, 
    { to: '/students', label: 'Students', icon: Users }, 
    { to: '/rooms', label: 'Rooms', icon: DoorOpen }, 
    { to: '/allocations', label: 'Room allocation', icon: BedDouble }, 
    { to: '/fees', label: 'Fee management', icon: WalletCards }
  ];
  
  const title = nav.find(n => n.to === location.pathname)?.label || 'Hostel management';

  return (
    <div className="app-shell">
      <aside className={`sidebar ${open ? 'sidebar-open' : ''}`}>
        <div className="brand">
          <div className="brand-mark"><Building2 size={20} /></div>
          <div><strong>HostelHub</strong><span>MANAGEMENT SUITE</span></div>
          <button className="icon-btn mobile-close" onClick={() => setOpen(false)}>
            <X size={19} />
          </button>
        </div>
        <div className="nav-label">WORKSPACE</div>
        <nav>
          {nav.map(n => (
            <NavLink 
              key={n.to} 
              end={n.to === '/'} 
              to={n.to} 
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
              <n.icon size={18} />
              <span>{n.label}</span>
              {n.to === '/' && <span className="nav-dot" />}
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="sidebar-help">
            <div className="help-icon"><ShieldCheck size={18} /></div>
            <strong>Your data, protected</strong>
            <p>Signed-in admin workspace with protected API access.</p>
          </div>
          <div className="profile">
            <div className="avatar">{(user?.name || 'A').slice(0, 1).toUpperCase()}</div>
            <div className="profile-text">
              <strong>{user?.name || 'Administrator'}</strong>
              <span>Administrator</span>
            </div>
            <button className="icon-btn" title="Sign out" onClick={logout}>
              <LogOut size={17} />
            </button>
          </div>
        </div>
      </aside>

      {open && <div className="scrim" onClick={() => setOpen(false)} />}
      
      <main className="main-area">
        <header className="topbar">
          <div className="topbar-left">
            <button className="icon-btn mobile-menu" onClick={() => setOpen(true)}>
              <Menu size={21} />
            </button>
            <div>
              <div className="breadcrumb">Workspace <span>/</span> <b>{title}</b></div>
              <div className="topbar-title">{title}</div>
            </div>
          </div>
          <div className="topbar-right">
            <span className="status-chip"><span /> System online</span>
            <div className="avatar small">{(user?.name || 'A').slice(0, 1).toUpperCase()}</div>
          </div>
        </header>
        <div className="page-wrap">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/students" element={<Students />} />
            <Route path="/rooms" element={<Rooms />} />
            <Route path="/allocations" element={<Allocations />} />
            <Route path="/fees" element={<Fees />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          <footer>HostelHub <span>·</span> Hostel operations dashboard</footer>
        </div>
      </main>
    </div>
  );
}

function Field({ label, value, onChange, type = 'text', required = false, placeholder = '', minLength, options, ...rest }) { 
  return (
    <label className="field">
      <span>{label}{required && <i> *</i>}</span>
      {options ? (
        <select value={value} onChange={e => onChange(e.target.value)} required={required} {...rest}>
          {options.map(o => (
            <option key={o.value ?? o} value={o.value ?? o}>{o.label ?? o}</option>
          ))}
        </select>
      ) : (
        <input 
          type={type} 
          value={value ?? ''} 
          onChange={e => onChange(e.target.value)} 
          required={required} 
          placeholder={placeholder} 
          minLength={minLength} 
          {...rest} 
        />
      )}
    </label>
  ); 
}

function Toast({ toast }) {
  if (!toast) return null; 
  return (
    <div className={`toast ${toast.type || 'success'}`}>
      {toast.type === 'error' ? <AlertCircle size={18} /> : <CheckCircle2 size={18} />} {toast.text}
    </div>
  );
}

function useToast() { 
  const [toast, setToast] = useState(null); 
  const show = (text, type = 'success') => { 
    setToast({ text, type }); 
    setTimeout(() => setToast(null), 3500); 
  }; 
  return [toast, show]; 
}

function PageHeader({ eyebrow, title, description, action }) { 
  return (
    <div className="page-heading">
      <div>
        <div className="eyebrow">{eyebrow}</div>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      {action}
    </div>
  ); 
}

function StatCard({ label, value, caption, icon: Icon, tone = 'blue' }) { 
  return (
    <div className="stat-card">
      <div className={`stat-icon ${tone}`}><Icon size={20} /></div>
      <div className="stat-label">{label}</div>
      <div className="stat-value">{value}</div>
      <div className="stat-caption">{caption}</div>
    </div>
  ); 
}

function Dashboard() {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => { 
    api.get('/dashboard')
      .then(r => setData(r.data))
      .catch(e => setError(messageOf(e))); 
  }, []);

  return (
    <>
      <PageHeader 
        eyebrow="HOSTEL AT A GLANCE" 
        title="Good day, administrator 👋" 
        description="Here’s what’s happening across your hostel today." 
      />
      <div className="welcome-banner">
        <div>
          <div className="banner-label"><Activity size={15} /> LIVE OVERVIEW</div>
          <h2>Everything in one place.</h2>
          <p>Keep student records, room occupancy and fee collections on track.</p>
        </div>
        <div className="banner-art">
          <div className="art-circle"><Building2 size={47} /></div>
          <div className="art-chip"><CheckCircle2 size={15} /> Operations organized</div>
        </div>
      </div>
      {error && <div className="alert error"><AlertCircle size={17} />{error}</div>}
      {!data && !error ? (
        <div className="loading">Loading dashboard…</div>
      ) : (
        <>
          <div className="stats-grid">
            <StatCard label="Total students" value={data?.students ?? '—'} caption="Registered residents" icon={GraduationCap} tone="blue" />
            <StatCard label="Total rooms" value={data?.rooms ?? '—'} caption="Rooms in the hostel" icon={DoorOpen} tone="violet" />
            <StatCard label="Available beds" value={data?.availableBeds ?? '—'} caption={`${data?.occupancyRate ?? 0}% occupancy rate`} icon={BedDouble} tone="green" />
            <StatCard label="Pending fees" value={money(data?.pendingFees)} caption="Outstanding payments" icon={CircleDollarSign} tone="orange" />
          </div>
          <div className="dashboard-grid">
            <section className="panel">
              <div className="panel-head">
                <div>
                  <h3>Room occupancy</h3>
                  <p>Current bed utilization</p>
                </div>
                <span className="subtle-badge">LIVE</span>
              </div>
              <div className="occupancy-content">
                <div className="donut" style={{ '--percent': `${data?.occupancyRate || 0}%` }}>
                  <div><strong>{data?.occupancyRate || 0}%</strong><span>occupied</span></div>
                </div>
                <div className="occupancy-legend">
                  <div><i className="legend-dot occupied-dot" /><span>Occupied beds</span><b>{data?.occupiedBeds ?? 0}</b></div>
                  <div><i className="legend-dot available-dot" /><span>Available beds</span><b>{data?.availableBeds ?? 0}</b></div>
                </div>
              </div>
            </section>
            
            <section className="panel">
              <div className="panel-head">
                <div>
                  <h3>Fee collection</h3>
                  <p>Payment summary</p>
                </div>
                <WalletCards size={20} className="muted-icon" />
              </div>
              <div className="fee-total">{money(data?.collectedFees)}<span> collected</span></div>
              <div className="fee-bar">
                <span style={{ 
                  width: `${(data?.collectedFees || 0) + (data?.pendingFees || 0) ? (data.collectedFees / (data.collectedFees + data.pendingFees)) * 100 : 0}%` 
                }} />
              </div>
              <div className="fee-summary">
                <div><span>Paid</span><strong>{money(data?.collectedFees)}</strong></div>
                <div><span>Pending</span><strong>{money(data?.pendingFees)}</strong></div>
              </div>
              <div className="panel-footnote">Totals are calculated from recorded fee entries.</div>
            </section>

            <section className="panel recent-panel">
              <div className="panel-head">
                <div>
                  <h3>Recently added students</h3>
                  <p>Your latest resident records</p>
                </div>
                <GraduationCap size={20} className="muted-icon" />
              </div>
              {data?.recentStudents?.length ? (
                <div className="recent-list">
                  {data.recentStudents.map(s => (
                    <div className="recent-row" key={s._id}>
                      <div className="avatar student-avatar">{s.fullName?.slice(0, 1).toUpperCase()}</div>
                      <div className="recent-info">
                        <strong>{s.fullName}</strong>
                        <span>{s.studentId} · {s.course || 'Course not specified'}</span>
                      </div>
                      <ChevronRight size={17} className="muted-icon" />
                    </div>
                  ))}
                </div>
              ) : (
                <Empty text="No students added yet. Add your first student in Student Management." />
              )}
            </section>
          </div>
        </>
      )}
    </>
  );
}

function Empty({ text }) { 
  return (
    <div className="empty-state">
      <div className="empty-icon"><Building2 size={22} /></div>
      <p>{text}</p>
    </div>
  ); 
}

function Modal({ title, subtitle, onClose, children, wide = false }) { 
  return (
    <div className="modal-backdrop" onMouseDown={e => e.target === e.currentTarget && onClose()}>
      <div className={`modal ${wide ? 'wide' : ''}`}>
        <div className="modal-head">
          <div>
            <h2>{title}</h2>
            <p>{subtitle}</p>
          </div>
          <button className="icon-btn" onClick={onClose}><X size={20} /></button>
        </div>
        {children}
      </div>
    </div>
  ); 
}

function SearchBox({ value, onChange, placeholder = 'Search records...' }) { 
  return (
    <div className="search-box">
      <Search size={17} />
      <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} />
      {value && <button onClick={() => onChange('')}><X size={14} /></button>}
    </div>
  ); 
}

function TableShell({ children, empty, colSpan = 5 }) { 
  return (
    <div className="table-wrap">
      <table>{children}</table>
      {empty && <div className="table-empty">{empty}</div>}
    </div>
  ); 
}

function Students() {
  const [rows, setRows] = useState([]);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [toast, show] = useToast();

  const blank = { 
    studentId: '', fullName: '', email: '', phone: '', 
    gender: 'Other', course: '', year: '', guardianName: '', 
    guardianPhone: '', address: '' 
  };
  const [form, setForm] = useState(blank);

  const load = () => api.get('/students', { params: { search } })
    .then(r => setRows(r.data))
    .catch(e => show(messageOf(e), 'error'));

  useEffect(() => { 
    const t = setTimeout(load, 220); 
    return () => clearTimeout(t); 
  }, [search]);

  const open = (s = null) => { 
    setEditing(s); 
    setForm(s ? { ...blank, ...s } : blank); 
    setError(''); 
    setModal(true); 
  };

  const submit = async (e) => {
    e.preventDefault(); 
    setBusy(true); 
    setError(''); 
    try {
      if (editing) {
        await api.put(`/students/${editing._id}`, form);
      } else {
        await api.post('/students', form);
      }
      setModal(false);
      show(editing ? 'Student updated successfully.' : 'Student added successfully.');
      load();
    } catch (e) {
      setError(messageOf(e));
    } finally {
      setBusy(false);
    }
  };

  const remove = async (s) => {
    if (!confirm(`Delete student ${s.fullName}? This cannot be undone.`)) return; 
    try {
      await api.delete(`/students/${s._id}`);
      show('Student deleted.');
      load();
    } catch (e) {
      show(messageOf(e), 'error');
    }
  };

  return (
    <>
      <PageHeader 
        eyebrow="RESIDENT DIRECTORY" 
        title="Student management" 
        description="Create and maintain student records and contact information." 
        action={<button className="btn primary" onClick={() => open()}><Plus size={17} /> Add student</button>} 
      />
      <div className="toolbar">
        <SearchBox value={search} onChange={setSearch} placeholder="Search name, ID, course or email" />
        <span className="record-count">{rows.length} {rows.length === 1 ? 'student' : 'students'}</span>
      </div>
      <div className="panel table-panel">
        <TableShell empty={!rows.length ? <Empty text={search ? 'No students match your search.' : 'No student records yet. Add a student to get started.'} /> : null}>
          <thead>
            <tr>
              <th>STUDENT</th>
              <th>STUDENT ID</th>
              <th>COURSE / YEAR</th>
              <th>CONTACT</th>
              <th>GENDER</th>
              <th className="right">ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(s => (
              <tr key={s._id}>
                <td>
                  <div className="person-cell">
                    <div className="avatar student-avatar">{s.fullName?.slice(0, 1).toUpperCase()}</div>
                    <div>
                      <strong>{s.fullName}</strong>
                      <span>{s.email || 'No email added'}</span>
                    </div>
                  </div>
                </td>
                <td><span className="code-pill">{s.studentId}</span></td>
                <td>{s.course || '—'}<span className="cell-sub">{s.year || ''}</span></td>
                <td>{s.phone || '—'}</td>
                <td><span className="soft-tag">{s.gender}</span></td>
                <td>
                  <div className="row-actions">
                    <button className="icon-btn" title="Edit" onClick={() => open(s)}><Pencil size={16} /></button>
                    <button className="icon-btn danger-icon" title="Delete" onClick={() => remove(s)}><Trash2 size={16} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </TableShell>
      </div>
      <Toast toast={toast} />
      {modal && (
        <Modal 
          title={editing ? 'Edit student' : 'Add a student'} 
          subtitle="Enter the student's personal and academic details." 
          onClose={() => setModal(false)} 
          wide
        >
          <form onSubmit={submit} className="modal-form">
            <div className="form-grid">
              <Field label="Student ID" value={form.studentId} onChange={v => setForm({ ...form, studentId: v })} required placeholder="e.g. STU-2026-001" />
              <Field label="Full name" value={form.fullName} onChange={v => setForm({ ...form, fullName: v })} required placeholder="Student full name" />
              <Field label="Email" type="email" value={form.email} onChange={v => setForm({ ...form, email: v })} placeholder="student@example.com" />
              <Field label="Phone" value={form.phone} onChange={v => setForm({ ...form, phone: v })} placeholder="Phone number" />
              <Field label="Gender" value={form.gender} onChange={v => setForm({ ...form, gender: v })} options={['Male', 'Female', 'Other']} />
              <Field label="Course" value={form.course} onChange={v => setForm({ ...form, course: v })} placeholder="e.g. B.Tech CSE" />
              <Field label="Year / Semester" value={form.year} onChange={v => setForm({ ...form, year: v })} placeholder="e.g. 3rd year" />
              <Field label="Guardian name" value={form.guardianName} onChange={v => setForm({ ...form, guardianName: v })} placeholder="Guardian full name" />
              <Field label="Guardian phone" value={form.guardianPhone} onChange={v => setForm({ ...form, guardianPhone: v })} placeholder="Guardian phone" />
              <Field label="Address" value={form.address} onChange={v => setForm({ ...form, address: v })} placeholder="Home address" />
            </div>
            {error && <div className="alert error">{error}</div>}
            <div className="modal-actions">
              <button type="button" className="btn secondary" onClick={() => setModal(false)}>Cancel</button>
              <button className="btn primary" disabled={busy}>{busy ? 'Saving…' : editing ? 'Save changes' : 'Add student'}</button>
            </div>
          </form>
        </Modal>
      )}
    </>
  );
}

function Rooms() {
  const [rows, setRows] = useState([]);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [toast, show] = useToast();

  const blank = { roomNumber: '', block: 'A', floor: 0, roomType: 'Double', capacity: 2, monthlyFee: 0, facilities: [] };
  const [form, setForm] = useState(blank);

  const load = () => api.get('/rooms')
    .then(r => setRows(r.data))
    .catch(e => show(messageOf(e), 'error'));

  useEffect(() => { load(); }, []);

  const open = (r = null) => { 
    setEditing(r); 
    setForm(r ? { ...blank, ...r, facilities: r.facilities || [] } : blank); 
    setError(''); 
    setModal(true); 
  };

  const submit = async (e) => {
    e.preventDefault(); 
    setBusy(true); 
    setError(''); 
    try {
      const payload = { 
        ...form, 
        floor: Number(form.floor), 
        capacity: Number(form.capacity), 
        monthlyFee: Number(form.monthlyFee) 
      };
      if (editing) {
        await api.put(`/rooms/${editing._id}`, payload);
      } else {
        await api.post('/rooms', payload);
      }
      setModal(false);
      show(editing ? 'Room updated.' : 'Room added.');
      load();
    } catch (e) {
      setError(messageOf(e));
    } finally {
      setBusy(false);
    }
  };

  const remove = async (r) => {
    if (!confirm(`Delete room ${r.roomNumber}?`)) return; 
    try {
      await api.delete(`/rooms/${r._id}`);
      show('Room deleted.');
      load();
    } catch (e) {
      show(messageOf(e), 'error');
    }
  };

  const toggleFacility = f => setForm({ 
    ...form, 
    facilities: form.facilities.includes(f) ? form.facilities.filter(x => x !== f) : [...form.facilities, f] 
  });

  return (
    <>
      <PageHeader 
        eyebrow="SPACE & CAPACITY" 
        title="Room management" 
        description="Manage room inventory, facilities, capacity and availability." 
        action={<button className="btn primary" onClick={() => open()}><Plus size={17} /> Add room</button>} 
      />
      <div className="room-summary">
        <div><span>Total rooms</span><strong>{rows.length}</strong></div>
        <div><span>Total capacity</span><strong>{rows.reduce((a, r) => a + r.capacity, 0)} <small>beds</small></strong></div>
        <div><span>Available beds</span><strong>{rows.reduce((a, r) => a + r.available, 0)}</strong></div>
        <div><span>Full rooms</span><strong>{rows.filter(r => r.available === 0).length}</strong></div>
      </div>
      {!rows.length ? (
        <div className="panel"><Empty text="No rooms added yet. Create a room to start managing capacity." /></div>
      ) : (
        <div className="room-grid">
          {rows.map(r => (
            <div className="room-card" key={r._id}>
              <div className="room-card-top">
                <div className="room-icon"><DoorOpen size={21} /></div>
                <span className={`room-status ${r.available ? 'available' : 'full'}`}>
                  {r.available ? 'Available' : 'Full'}
                </span>
              </div>
              <div className="room-number">Room {r.roomNumber}</div>
              <div className="room-meta">Block {r.block} <span>·</span> Floor {r.floor} <span>·</span> {r.roomType}</div>
              <div className="room-capacity">
                <div><span>Occupancy</span><strong>{r.occupied} <small>/ {r.capacity} beds</small></strong></div>
                <div className="mini-progress">
                  <span style={{ width: `${Math.min(100, r.capacity ? r.occupied / r.capacity * 100 : 0)}%` }} />
                </div>
              </div>
              <div className="facility-tags">
                {(r.facilities || []).length ? (
                  (r.facilities || []).slice(0, 3).map(f => <span key={f}>{f}</span>)
                ) : (
                  <span>No facilities listed</span>
                )}
              </div>
              <div className="room-card-bottom">
                <strong>{money(r.monthlyFee)}<small> / bed / month</small></strong>
                <div className="row-actions">
                  <button className="icon-btn" title="Edit room" onClick={() => open(r)}><Pencil size={16} /></button>
                  <button className="icon-btn danger-icon" title="Delete room" onClick={() => remove(r)}><Trash2 size={16} /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      <Toast toast={toast} />
      {modal && (
        <Modal 
          title={editing ? 'Edit room' : 'Add a room'} 
          subtitle="Configure the room's location, capacity and monthly fee." 
          onClose={() => setModal(false)}
        >
          <form onSubmit={submit} className="modal-form">
            <div className="form-grid">
              <Field label="Room number" value={form.roomNumber} onChange={v => setForm({ ...form, roomNumber: v })} required placeholder="e.g. 101" />
              <Field label="Block" value={form.block} onChange={v => setForm({ ...form, block: v })} required />
              <Field label="Floor" type="number" value={form.floor} onChange={v => setForm({ ...form, floor: v })} required />
              <Field label="Room type" value={form.roomType} onChange={v => setForm({ ...form, roomType: v })} options={['Single', 'Double', 'Triple', 'Dormitory']} />
              <Field label="Bed capacity" type="number" min="1" value={form.capacity} onChange={v => setForm({ ...form, capacity: v })} required />
              <Field label="Monthly fee (₹)" type="number" min="0" value={form.monthlyFee} onChange={v => setForm({ ...form, monthlyFee: v })} required />
            </div>
            <div className="field">
              <span>Facilities</span>
              <div className="check-options">
                {['Wi-Fi', 'Attached bathroom', 'AC', 'Study table', 'Wardrobe', 'Balcony', 'Laundry'].map(f => (
                  <label key={f}>
                    <input type="checkbox" checked={form.facilities.includes(f)} onChange={() => toggleFacility(f)} />
                    {f}
                  </label>
                ))}
              </div>
            </div>
            {error && <div className="alert error">{error}</div>}
            <div className="modal-actions">
              <button type="button" className="btn secondary" onClick={() => setModal(false)}>Cancel</button>
              <button className="btn primary" disabled={busy}>{busy ? 'Saving…' : editing ? 'Save changes' : 'Add room'}</button>
            </div>
          </form>
        </Modal>
      )}
    </>
  );
}

function Allocations() {
  const [rows, setRows] = useState([]);
  const [students, setStudents] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ student: '', room: '', notes: '' });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [toast, show] = useToast();
  const [search, setSearch] = useState('');

  const load = () => api.get('/allocations')
    .then(r => setRows(r.data))
    .catch(e => show(messageOf(e), 'error'));

  useEffect(() => {
    load();
    api.get('/students').then(r => setStudents(r.data));
    api.get('/rooms').then(r => setRooms(r.data)).catch(() => {});
  }, []);

  const open = () => { 
    setForm({ student: '', room: '', notes: '' }); 
    setError(''); 
    setModal(true); 
  };

  const submit = async (e) => {
    e.preventDefault(); 
    setBusy(true); 
    setError(''); 
    try {
      await api.post('/allocations', form);
      setModal(false);
      show('Room allocated successfully.');
      load();
      api.get('/rooms').then(r => setRooms(r.data));
    } catch (e) {
      setError(messageOf(e));
    } finally {
      setBusy(false);
    }
  };

  const deallocate = async (a) => {
    if (!confirm(`Deallocate ${a.student?.fullName || 'this student'} from room ${a.room?.roomNumber || ''}?`)) return; 
    try {
      await api.patch(`/allocations/${a._id}/deallocate`);
      show('Student deallocated.');
      load();
      api.get('/rooms').then(r => setRooms(r.data));
    } catch (e) {
      show(messageOf(e), 'error');
    }
  };

  const filtered = rows.filter(a => 
    `${a.student?.fullName} ${a.student?.studentId} ${a.room?.roomNumber} ${a.room?.block}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );
  
  const activeStudentIds = new Set(rows.filter(a => a.status === 'active').map(a => a.student?._id));
  const availableRooms = rooms.filter(r => r.available > 0);

  return (
    <>
      <PageHeader
        eyebrow="RESIDENT PLACEMENT"
        title="Room allocation"
        description="Assign students to rooms and keep occupancy records accurate."
        action={<button className="btn primary" onClick={open}><Plus size={17} /> Allocate room</button>}
      />

      <div className="allocation-banner">
        <div className="allocation-banner-icon"><BedDouble size={23} /></div>
        <div>
          <strong>{rows.filter(a => a.status === 'active').length} active allocations</strong>
          <p>Assign a student to one available bed. Each student can have only one active allocation.</p>
        </div>
        <div className="allocation-banner-count">
          <strong>{availableRooms.reduce((n, r) => n + r.available, 0)}</strong>
          <span>beds available</span>
        </div>
      </div>

      <div className="toolbar">
        <SearchBox value={search} onChange={setSearch} placeholder="Search student or room" />
        <span className="record-count">{filtered.length} records</span>
      </div>

      <div className="panel table-panel">
        <TableShell
          empty={!filtered.length ? <Empty text="No allocations found. Allocate a room to a student to get started." /> : null}
        >
          <thead>
            <tr>
              <th>STUDENT</th>
              <th>ROOM</th>
              <th>ALLOCATED ON</th>
              <th>STATUS</th>
              <th className="right">ACTION</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(a => (
              <tr key={a._id}>
                <td>
                  <div className="person-cell">
                    <div className="avatar student-avatar">{a.student?.fullName?.slice(0, 1).toUpperCase() || '?'}</div>
                    <div>
                      <strong>{a.student?.fullName || 'Deleted student'}</strong>
                      <span>{a.student?.studentId || '—'}</span>
                    </div>
                  </div>
                </td>
                <td>
                  <strong>Room {a.room?.roomNumber || '—'}</strong>
                  <span className="cell-sub">Block {a.room?.block || '—'}</span>
                </td>
                <td>
                  {new Date(a.allocatedAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                </td>
                <td>
                  <span className={`status-tag ${a.status}`}>{a.status === 'active' ? 'Active' : 'Ended'}</span>
                </td>
                <td className="right">
                  {a.status === 'active' ? (
                    <button className="btn small-btn secondary" onClick={() => deallocate(a)}>Deallocate</button>
                  ) : (
                    <span className="muted">—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </TableShell>
      </div>

      <Toast toast={toast} />

      {modal && (
        <Modal title="Allocate a room" subtitle="Choose a student and an available room." onClose={() => setModal(false)}>
          <form onSubmit={submit} className="modal-form">
            <Field
              label="Student"
              value={form.student}
              onChange={v => setForm({ ...form, student: v })}
              required
              options={[
                { value: '', label: 'Select a student…' }, 
                ...students
                  .filter(s => !activeStudentIds.has(s._id))
                  .map(s => ({ value: s._id, label: `${s.fullName} (${s.studentId})` }))
              ]}
            />
            <Field
              label="Available room"
              value={form.room}
              onChange={v => setForm({ ...form, room: v })}
              required
              options={[
                { value: '', label: 'Select a room…' }, 
                ...availableRooms.map(r => ({ 
                  value: r._id, 
                  label: `Room ${r.roomNumber} · Block ${r.block} · ${r.available} bed(s) left` 
                }))
              ]}
            />
            <Field
              label="Notes (optional)"
              value={form.notes}
              onChange={v => setForm({ ...form, notes: v })}
              placeholder="Allocation notes"
            />
            {!students.filter(s => !activeStudentIds.has(s._id)).length && (
              <div className="alert">All students already have an active room allocation, or no students exist yet.</div>
            )}
            {error && <div className="alert error">{error}</div>}
            <div className="modal-actions">
              <button type="button" className="btn secondary" onClick={() => setModal(false)}>Cancel</button>
              <button 
                className="btn primary" 
                disabled={busy || !students.filter(s => !activeStudentIds.has(s._id)).length || !availableRooms.length}
              >
                {busy ? 'Allocating…' : 'Confirm allocation'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </>
  );
}

function Fees() {
  const [rows, setRows] = useState([]);
  const [students, setStudents] = useState([]);
  const [status, setStatus] = useState('all');
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ 
    student: '', title: 'Hostel Fee', amount: '', 
    dueDate: '', paymentMethod: 'UPI', notes: '' 
  });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [toast, show] = useToast();

  const load = () => api.get('/fees', { params: status === 'all' ? {} : { status } })
    .then(r => setRows(r.data))
    .catch(e => show(messageOf(e), 'error'));

  useEffect(() => { load(); }, [status]);
  useEffect(() => { api.get('/students').then(r => setStudents(r.data)); }, []);

  const filtered = rows.filter(f => 
    `${f.student?.fullName} ${f.student?.studentId} ${f.title}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const open = () => { 
    setForm({ student: '', title: 'Hostel Fee', amount: '', dueDate: '', paymentMethod: 'UPI', notes: '' }); 
    setError(''); 
    setModal(true); 
  };

  const submit = async (e) => {
    e.preventDefault(); 
    setBusy(true); 
    setError(''); 
    try {
      await api.post('/fees', { 
        ...form, 
        amount: Number(form.amount), 
        dueDate: new Date(`${form.dueDate}T23:59:59`) 
      });
      setModal(false);
      show('Fee record created.');
      load();
    } catch (e) {
      setError(messageOf(e));
    } finally {
      setBusy(false);
    }
  };

  const pay = async (f) => {
    if (!confirm(`Mark ${money(f.amount)} fee for ${f.student?.fullName} as paid?`)) return; 
    try {
      await api.patch(`/fees/${f._id}/pay`, { paymentMethod: f.paymentMethod || 'UPI' });
      show('Payment marked as paid.');
      load();
    } catch (e) {
      show(messageOf(e), 'error');
    }
  };

  const remove = async (f) => {
    if (!confirm('Delete this fee record?')) return; 
    try {
      await api.delete(`/fees/${f._id}`);
      show('Fee record deleted.');
      load();
    } catch (e) {
      show(messageOf(e), 'error');
    }
  };

  const pending = rows.filter(f => f.status === 'pending').reduce((a, f) => a + f.amount, 0);
  const paid = rows.filter(f => f.status === 'paid').reduce((a, f) => a + f.amount, 0);

  return (
    <>
      <PageHeader
        eyebrow="BILLING & PAYMENTS"
        title="Fee management"
        description="Create hostel fee records, monitor due payments and record collections."
        action={<button className="btn primary" onClick={open}><Plus size={17} /> Add fee record</button>}
      />

      <div className="fee-stats">
        <div className="fee-stat-card">
          <div className="fee-stat-icon orange"><WalletCards size={19} /></div>
          <div><span>Pending amount</span><strong>{money(pending)}</strong><small>In current view</small></div>
        </div>
        <div className="fee-stat-card">
          <div className="fee-stat-icon green"><CheckCircle2 size={19} /></div>
          <div><span>Paid amount</span><strong>{money(paid)}</strong><small>In current view</small></div>
        </div>
        <div className="fee-stat-card">
          <div className="fee-stat-icon blue"><Users size={19} /></div>
          <div><span>Fee records</span><strong>{rows.length}</strong><small>In current view</small></div>
        </div>
      </div>

      <div className="toolbar">
        <SearchBox value={search} onChange={setSearch} placeholder="Search student or fee title" />
        <div className="toolbar-right">
          <div className="filter-tabs">
            {[['all', 'All'], ['pending', 'Pending'], ['paid', 'Paid']].map(([v, l]) => (
              <button key={v} className={status === v ? 'selected' : ''} onClick={() => setStatus(v)}>{l}</button>
            ))}
          </div>
          <span className="record-count">{filtered.length} records</span>
        </div>
      </div>

      <div className="panel table-panel">
        <TableShell
          empty={!filtered.length ? <Empty text="No fee records found. Add a fee record to start tracking payments." /> : null}
        >
          <thead>
            <tr>
              <th>STUDENT</th>
              <th>FEE DETAILS</th>
              <th>DUE DATE</th>
              <th>AMOUNT</th>
              <th>STATUS</th>
              <th className="right">ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(f => (
              <tr key={f._id}>
                <td>
                  <div className="person-cell">
                    <div className="avatar student-avatar">{f.student?.fullName?.slice(0, 1).toUpperCase() || '?'}</div>
                    <div>
                      <strong>{f.student?.fullName || 'Deleted student'}</strong>
                      <span>{f.student?.studentId || '—'}</span>
                    </div>
                  </div>
                </td>
                <td>
                  <strong>{f.title}</strong>
                  <span className="cell-sub">{f.paymentMethod || 'Payment method not set'}</span>
                </td>
                <td>
                  {new Date(f.dueDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                </td>
                <td><strong>{money(f.amount)}</strong></td>
                <td>
                  <span className={`status-tag ${f.status}`}>{f.status === 'paid' ? 'Paid' : 'Pending'}</span>
                </td>
                <td>
                  <div className="row-actions">
                    {f.status === 'pending' && (
                      <button className="btn small-btn paid-btn" onClick={() => pay(f)}>Mark paid</button>
                    )}
                    <button className="icon-btn danger-icon" title="Delete fee record" onClick={() => remove(f)}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </TableShell>
      </div>

      <Toast toast={toast} />

      {modal && (
        <Modal title="Create fee record" subtitle="Add a hostel charge for a registered student." onClose={() => setModal(false)}>
          <form onSubmit={submit} className="modal-form">
            <Field
              label="Student"
              value={form.student}
              onChange={v => setForm({ ...form, student: v })}
              required
              options={[
                { value: '', label: 'Select a student…' }, 
                ...students.map(s => ({ value: s._id, label: `${s.fullName} (${s.studentId})` }))
              ]}
            />
            <Field
              label="Fee title"
              value={form.title}
              onChange={v => setForm({ ...form, title: v })}
              required
              placeholder="e.g. October hostel fee"
            />
            <div className="form-grid">
              <Field label="Amount (₹)" type="number" min="0" value={form.amount} onChange={v => setForm({ ...form, amount: v })} required />
              <Field label="Due date" type="date" value={form.dueDate} onChange={v => setForm({ ...form, dueDate: v })} required />
            </div>
            <Field
              label="Payment method (when paid)"
              value={form.paymentMethod}
              onChange={v => setForm({ ...form, paymentMethod: v })}
              options={['UPI', 'Cash', 'Bank Transfer', 'Card', 'Other']}
            />
            <Field
              label="Notes (optional)"
              value={form.notes}
              onChange={v => setForm({ ...form, notes: v })}
              placeholder="Additional notes"
            />
            {error && <div className="alert error">{error}</div>}
            <div className="modal-actions">
              <button type="button" className="btn secondary" onClick={() => setModal(false)}>Cancel</button>
              <button className="btn primary" disabled={busy || !students.length}>
                {busy ? 'Saving…' : 'Create fee record'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </>
  );
}

export default App;