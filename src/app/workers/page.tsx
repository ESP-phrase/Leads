'use client'

import { useState, useEffect } from 'react'
import { Users, Plus, Phone, Mail, Briefcase, Trash2, ToggleLeft, ToggleRight, Edit2, Check, X } from 'lucide-react'
import Sidebar from '@/components/Sidebar'

interface Worker {
  id: string
  name: string
  phone: string | null
  email: string | null
  role: string
  active: boolean
  _count: { leads: number }
}

const ROLES = ['Agent', 'Senior Agent', 'Manager', 'Admin']

export default function WorkersPage() {
  const [workers, setWorkers] = useState<Worker[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)

  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [role, setRole] = useState('Agent')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function load() {
    const res = await fetch('/api/workers')
    setWorkers(await res.json())
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  function openAdd() {
    setEditId(null); setName(''); setPhone(''); setEmail(''); setRole('Agent')
    setError(null); setShowForm(true)
  }

  function openEdit(w: Worker) {
    setEditId(w.id); setName(w.name); setPhone(w.phone ?? ''); setEmail(w.email ?? ''); setRole(w.role)
    setError(null); setShowForm(true)
  }

  async function handleSave() {
    if (!name.trim()) { setError('Name is required'); return }
    setSaving(true); setError(null)
    const url   = editId ? `/api/workers/${editId}` : '/api/workers'
    const method = editId ? 'PATCH' : 'POST'
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, phone, email, role }),
    })
    if (!res.ok) {
      const { error: e } = await res.json().catch(() => ({ error: 'Failed' }))
      setError(e); setSaving(false); return
    }
    setShowForm(false); setSaving(false)
    load()
  }

  async function toggleActive(w: Worker) {
    await fetch(`/api/workers/${w.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ active: !w.active }),
    })
    load()
  }

  async function handleDelete(id: string) {
    if (!confirm('Remove this worker? Their leads will be unassigned.')) return
    await fetch(`/api/workers/${id}`, { method: 'DELETE' })
    load()
  }

  const active   = workers.filter(w => w.active)
  const inactive = workers.filter(w => !w.active)

  return (
    <div className="flex min-h-screen pb-20 md:pb-0" style={{ background: '#0d0e0b', color: '#d4dfc4' }}>
      <Sidebar />
      <main className="flex-1 p-8 max-w-4xl">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-xl font-bold text-white">Workers</h1>
            <p className="text-sm mt-0.5" style={{ color: '#4a5a3a' }}>
              {workers.length} team member{workers.length !== 1 ? 's' : ''} · {active.length} active
            </p>
          </div>
          <button onClick={openAdd}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg font-semibold text-sm"
            style={{ background: '#c8f135', color: '#0d0e0b' }}>
            <Plus size={15} />Add Worker
          </button>
        </div>

        {/* Add / Edit form */}
        {showForm && (
          <div className="rounded-xl p-6 mb-6 border border-[#2e3828]" style={{ background: '#111310' }}>
            <h2 className="font-bold text-white mb-4">{editId ? 'Edit Worker' : 'New Worker'}</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 sm:col-span-1">
                <label className="block text-xs font-semibold mb-1.5" style={{ color: '#4a5a3a' }}>NAME *</label>
                <input value={name} onChange={e => setName(e.target.value)} placeholder="Jane Smith"
                  className="w-full rounded-lg px-3 py-2.5 text-sm text-white placeholder-[#2a3a1a] focus:outline-none focus:ring-1 focus:ring-[#c8f13540]"
                  style={{ background: '#0d0e0b', border: '1px solid #1e2218' }} />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: '#4a5a3a' }}>ROLE</label>
                <select value={role} onChange={e => setRole(e.target.value)}
                  className="w-full rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#c8f13540]"
                  style={{ background: '#0d0e0b', border: '1px solid #1e2218' }}>
                  {ROLES.map(r => <option key={r}>{r}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: '#4a5a3a' }}>PHONE</label>
                <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="+1 555 000 0000"
                  className="w-full rounded-lg px-3 py-2.5 text-sm text-white placeholder-[#2a3a1a] focus:outline-none focus:ring-1 focus:ring-[#c8f13540]"
                  style={{ background: '#0d0e0b', border: '1px solid #1e2218' }} />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: '#4a5a3a' }}>EMAIL</label>
                <input value={email} onChange={e => setEmail(e.target.value)} placeholder="jane@example.com"
                  className="w-full rounded-lg px-3 py-2.5 text-sm text-white placeholder-[#2a3a1a] focus:outline-none focus:ring-1 focus:ring-[#c8f13540]"
                  style={{ background: '#0d0e0b', border: '1px solid #1e2218' }} />
              </div>
            </div>
            {error && (
              <p className="mt-3 text-xs px-3 py-2 rounded-lg" style={{ background: '#2a0d0d', color: '#d45a5a', border: '1px solid #401515' }}>
                {error}
              </p>
            )}
            <div className="flex gap-3 mt-5">
              <button onClick={handleSave} disabled={saving}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold disabled:opacity-50"
                style={{ background: '#c8f135', color: '#0d0e0b' }}>
                <Check size={14} />{saving ? 'Saving…' : editId ? 'Save Changes' : 'Add Worker'}
              </button>
              <button onClick={() => setShowForm(false)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold border border-[#1e2218]"
                style={{ color: '#6b7a5a' }}>
                <X size={14} />Cancel
              </button>
            </div>
          </div>
        )}

        {loading ? (
          <p className="text-sm" style={{ color: '#4a5a3a' }}>Loading…</p>
        ) : workers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
                 style={{ background: '#c8f13510', border: '1px solid #c8f13520' }}>
              <Users size={28} style={{ color: '#c8f135' }} />
            </div>
            <p className="text-white font-bold text-lg mb-2">No workers yet</p>
            <p className="text-sm" style={{ color: '#3a4a2a' }}>Add your first team member to start assigning leads.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {[{ label: 'Active', list: active }, { label: 'Inactive', list: inactive }]
              .filter(g => g.list.length > 0)
              .map(group => (
                <div key={group.label}>
                  <p className="text-xs font-semibold mb-3 uppercase tracking-wider" style={{ color: '#3a4a2a' }}>{group.label}</p>
                  <div className="space-y-2">
                    {group.list.map(w => (
                      <div key={w.id}
                        className="flex items-center justify-between rounded-xl px-5 py-4 border border-[#1e2218]"
                        style={{ background: '#111310', opacity: w.active ? 1 : 0.5 }}>
                        <div className="flex items-center gap-4 min-w-0">
                          <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-sm"
                               style={{ background: '#c8f13520', color: '#c8f135' }}>
                            {w.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-semibold text-white">{w.name}</p>
                              <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: '#1e2218', color: '#6b7a5a' }}>
                                {w.role}
                              </span>
                            </div>
                            <div className="flex items-center gap-3 mt-0.5">
                              {w.phone && (
                                <span className="text-xs flex items-center gap-1" style={{ color: '#4a5a3a' }}>
                                  <Phone size={10} />{w.phone}
                                </span>
                              )}
                              {w.email && (
                                <span className="text-xs flex items-center gap-1" style={{ color: '#4a5a3a' }}>
                                  <Mail size={10} />{w.email}
                                </span>
                              )}
                              <span className="text-xs flex items-center gap-1" style={{ color: '#4a5a3a' }}>
                                <Briefcase size={10} />{w._count.leads} lead{w._count.leads !== 1 ? 's' : ''}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0 ml-4">
                          <button onClick={() => openEdit(w)} title="Edit"
                            className="p-2 rounded-lg border border-[#1e2218] transition-colors hover:border-[#2e3828]"
                            style={{ color: '#6b7a5a' }}>
                            <Edit2 size={13} />
                          </button>
                          <button onClick={() => toggleActive(w)} title={w.active ? 'Deactivate' : 'Activate'}
                            className="p-2 rounded-lg border border-[#1e2218] transition-colors hover:border-[#2e3828]"
                            style={{ color: w.active ? '#c8f135' : '#6b7a5a' }}>
                            {w.active ? <ToggleRight size={15} /> : <ToggleLeft size={15} />}
                          </button>
                          <button onClick={() => handleDelete(w.id)} title="Remove"
                            className="p-2 rounded-lg border border-[#1e2218] transition-colors hover:border-[#401515]"
                            style={{ color: '#6b7a5a' }}>
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
          </div>
        )}
      </main>
    </div>
  )
}
