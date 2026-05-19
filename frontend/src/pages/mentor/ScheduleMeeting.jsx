// frontend/src/pages/mentor/ScheduleMeeting.jsx

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import API from '../../api/axios'
import toast from 'react-hot-toast'

export default function ScheduleMeeting() {
  const navigate = useNavigate()
  const [students, setStudents] = useState([])
  const [loading, setLoading]   = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [meetings, setMeetings] = useState(() => {
    const saved = localStorage.getItem('spms_meetings')
    return saved ? JSON.parse(saved) : []
  })
  const [form, setForm] = useState({
    studentId: '', title: '', date: '', time: '', link: '', notes: '',
  })

  useEffect(() => { fetchStudents() }, [])

  const fetchStudents = async () => {
    try {
      const res = await API.get('/mentor/students')
      setStudents(res.data.students || [])
    } catch {
      toast.error('Students load nahi hue!')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.studentId || !form.title || !form.date || !form.time)
      return toast.error('Sab zaroori fields bharo!')
    setSubmitting(true)
    try {
      await API.post('/mentor/meeting', form)
      const student = students.find(s => s._id === form.studentId)
      const newMeeting = {
        ...form,
        id: Date.now(),
        studentName: student?.name || 'Unknown',
        createdAt: new Date().toISOString(),
      }
      const updated = [newMeeting, ...meetings]
      setMeetings(updated)
      localStorage.setItem('spms_meetings', JSON.stringify(updated))
      toast.success('Meeting schedule ho gayi! 📅')
      setForm({ studentId:'', title:'', date:'', time:'', link:'', notes:'' })
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error aaya!')
    } finally {
      setSubmitting(false)
    }
  }

  const deleteMeeting = (id) => {
    const updated = meetings.filter(m => m.id !== id)
    setMeetings(updated)
    localStorage.setItem('spms_meetings', JSON.stringify(updated))
    toast.success('Meeting removed.')
  }

  if (loading) return (
    <div style={{ minHeight:'100vh',background:'#070b14',display:'flex',alignItems:'center',justifyContent:'center' }}>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      <div style={{ width:40,height:40,border:'3px solid rgba(245,158,11,0.2)',borderTop:'3px solid #f59e0b',borderRadius:'50%',animation:'spin 1s linear infinite' }} />
    </div>
  )

  return (
    <div style={{ minHeight:'100vh',background:'#070b14',fontFamily:"'DM Sans',sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500&display=swap');
        @keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
        .meet-card:hover{border-color:rgba(245,158,11,0.3) !important;}
      `}</style>

      <div style={{ maxWidth:900,margin:'0 auto',padding:'32px 24px' }}>

        <div style={{ marginBottom:32,animation:'fadeUp 0.4s ease' }}>
          <button onClick={()=>navigate('/mentor/dashboard')} style={{ background:'none',border:'none',color:'#475569',cursor:'pointer',fontSize:13,marginBottom:8,display:'block',padding:0 }}>← Back to Dashboard</button>
          <h1 style={{ fontFamily:'Syne,sans-serif',fontSize:28,fontWeight:800,color:'#f1f5f9',margin:0,letterSpacing:'-1px' }}>📅 Schedule Meeting</h1>
        </div>

        <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:24,animation:'fadeUp 0.4s ease 0.1s both' }}>

          {/* Schedule Form */}
          <div style={{ background:'rgba(15,23,42,0.9)',border:'1px solid rgba(245,158,11,0.2)',borderRadius:20,padding:24 }}>
            <h2 style={{ fontFamily:'Syne,sans-serif',color:'#f1f5f9',fontSize:18,margin:'0 0 20px' }}>✨ New Meeting</h2>
            <form onSubmit={handleSubmit} style={{ display:'flex',flexDirection:'column',gap:14 }}>
              <div>
                <label style={{ fontSize:12,color:'#475569',marginBottom:6,display:'block',textTransform:'uppercase',letterSpacing:1 }}>Student *</label>
                <select value={form.studentId} onChange={e=>setForm({...form,studentId:e.target.value})} className="custom-input">
                  <option value="">Student select karo</option>
                  {students.map(s=>(
                    <option key={s._id} value={s._id}>{s.name} — {s.branch}</option>
                  ))}
                </select>
              </div>
              <div>
                <label style={{ fontSize:12,color:'#475569',marginBottom:6,display:'block',textTransform:'uppercase',letterSpacing:1 }}>Meeting Title *</label>
                <input value={form.title} onChange={e=>setForm({...form,title:e.target.value})} placeholder="e.g. Weekly Progress Review" className="custom-input" />
              </div>
              <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:12 }}>
                <div>
                  <label style={{ fontSize:12,color:'#475569',marginBottom:6,display:'block',textTransform:'uppercase',letterSpacing:1 }}>Date *</label>
                  <input type="date" value={form.date} onChange={e=>setForm({...form,date:e.target.value})} className="custom-input" />
                </div>
                <div>
                  <label style={{ fontSize:12,color:'#475569',marginBottom:6,display:'block',textTransform:'uppercase',letterSpacing:1 }}>Time *</label>
                  <input type="time" value={form.time} onChange={e=>setForm({...form,time:e.target.value})} className="custom-input" />
                </div>
              </div>
              <div>
                <label style={{ fontSize:12,color:'#475569',marginBottom:6,display:'block',textTransform:'uppercase',letterSpacing:1 }}>Meeting Link (Google Meet etc.)</label>
                <input value={form.link} onChange={e=>setForm({...form,link:e.target.value})} placeholder="https://meet.google.com/..." className="custom-input" />
              </div>
              <div>
                <label style={{ fontSize:12,color:'#475569',marginBottom:6,display:'block',textTransform:'uppercase',letterSpacing:1 }}>Notes</label>
                <textarea value={form.notes} onChange={e=>setForm({...form,notes:e.target.value})} placeholder="Meeting agenda ya notes..." className="custom-input" rows={2} style={{ resize:'vertical' }} />
              </div>
              <button type="submit" disabled={submitting} style={{ background:'linear-gradient(135deg,#f59e0b,#f97316)',border:'none',borderRadius:10,padding:'13px',color:'white',cursor:'pointer',fontFamily:'Syne,sans-serif',fontWeight:700,fontSize:14,marginTop:4 }}>
                {submitting?'Scheduling...':'Schedule Meeting →'}
              </button>
            </form>
          </div>

          {/* Meetings List */}
          <div>
            <h2 style={{ fontFamily:'Syne,sans-serif',color:'#f1f5f9',fontSize:18,margin:'0 0 16px' }}>📋 Upcoming Meetings</h2>
            {meetings.length===0 ? (
              <div style={{ background:'rgba(15,23,42,0.9)',border:'1px solid rgba(255,255,255,0.06)',borderRadius:20,padding:'48px 24px',textAlign:'center' }}>
                <div style={{ fontSize:40,marginBottom:12,opacity:0.2 }}>📅</div>
                <p style={{ color:'#475569',fontSize:14 }}>Koi meeting schedule nahi hai abhi.</p>
              </div>
            ) : (
              <div style={{ display:'flex',flexDirection:'column',gap:12 }}>
                {meetings.map((m,i)=>(
                  <div key={m.id} className="meet-card" style={{ background:'rgba(15,23,42,0.9)',border:'1px solid rgba(255,255,255,0.06)',borderRadius:16,padding:18,transition:'border 0.2s',animation:`fadeUp 0.4s ease ${i*0.06}s both` }}>
                    <div style={{ display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:10 }}>
                      <div>
                        <div style={{ color:'#f1f5f9',fontFamily:'Syne,sans-serif',fontWeight:700,fontSize:14 }}>{m.title}</div>
                        <div style={{ color:'#f59e0b',fontSize:12,marginTop:3 }}>👤 {m.studentName}</div>
                      </div>
                      <button onClick={()=>deleteMeeting(m.id)} style={{ background:'rgba(239,68,68,0.1)',border:'1px solid rgba(239,68,68,0.2)',borderRadius:8,padding:'4px 10px',color:'#ef4444',cursor:'pointer',fontSize:11 }}>Remove</button>
                    </div>
                    <div style={{ display:'flex',gap:12,flexWrap:'wrap' }}>
                      <span style={{ color:'#64748b',fontSize:12 }}>📆 {new Date(m.date).toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'})}</span>
                      <span style={{ color:'#64748b',fontSize:12 }}>⏰ {m.time}</span>
                      {m.link && <a href={m.link} target="_blank" rel="noreferrer" style={{ color:'#6366f1',fontSize:12 }}>🔗 Join</a>}
                    </div>
                    {m.notes && <div style={{ marginTop:8,color:'#475569',fontSize:12,fontStyle:'italic' }}>{m.notes}</div>}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}