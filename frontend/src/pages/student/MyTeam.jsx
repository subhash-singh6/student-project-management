// frontend/src/pages/student/MyTeam.jsx

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import API from '../../api/axios'
import toast from 'react-hot-toast'

export default function MyTeam() {
  const navigate = useNavigate()
  const [team, setTeam]           = useState(null)
  const [loading, setLoading]     = useState(true)
  const [showCreate, setShowCreate] = useState(false)
  const [showAdd, setShowAdd]     = useState(false)
  const [teamName, setTeamName]   = useState('')
  const [teamDesc, setTeamDesc]   = useState('')
  const [memberEmail, setMemberEmail] = useState('')
  const [memberRole, setMemberRole]   = useState('developer')
  const [submitting, setSubmitting]   = useState(false)

  useEffect(() => { fetchTeam() }, [])

  const fetchTeam = async () => {
    try {
      const res = await API.get('/teams/my')
      setTeam(res.data.team)
    } catch {
      setTeam(null)
    } finally {
      setLoading(false)
    }
  }

  const createTeam = async (e) => {
    e.preventDefault()
    if (!teamName) return toast.error('Team name zaroori hai!')
    setSubmitting(true)
    try {
      await API.post('/teams', { name: teamName, description: teamDesc })
      toast.success('Team ban gayi! 🎉')
      setShowCreate(false)
      setTeamName('')
      setTeamDesc('')
      fetchTeam()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error aaya!')
    } finally {
      setSubmitting(false)
    }
  }

  const addMember = async (e) => {
    e.preventDefault()
    if (!memberEmail) return toast.error('Email daalo!')
    setSubmitting(true)
    try {
      await API.post(`/teams/${team._id}/add-member`, { email: memberEmail, role: memberRole })
      toast.success('Member add ho gaya! 🎉')
      setShowAdd(false)
      setMemberEmail('')
      fetchTeam()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error aaya!')
    } finally {
      setSubmitting(false)
    }
  }

  const removeMember = async (userId, name) => {
    if (!confirm(`${name} ko remove karna chahte ho?`)) return
    try {
      await API.delete(`/teams/${team._id}/remove-member/${userId}`)
      toast.success('Member remove ho gaya.')
      fetchTeam()
    } catch {
      toast.error('Remove nahi hua!')
    }
  }

  const ROLE_COLORS = {
    leader:    { color: '#f59e0b', bg: 'rgba(245,158,11,0.12)' },
    developer: { color: '#6366f1', bg: 'rgba(99,102,241,0.12)' },
    designer:  { color: '#ec4899', bg: 'rgba(236,72,153,0.12)' },
    tester:    { color: '#10b981', bg: 'rgba(16,185,129,0.12)' },
    member:    { color: '#94a3b8', bg: 'rgba(148,163,184,0.12)' },
  }

  if (loading) return (
    <div style={{ minHeight:'100vh',background:'#070b14',display:'flex',alignItems:'center',justifyContent:'center' }}>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      <div style={{ width:40,height:40,border:'3px solid rgba(34,211,238,0.2)',borderTop:'3px solid #22d3ee',borderRadius:'50%',animation:'spin 1s linear infinite' }} />
    </div>
  )

  return (
    <div style={{ minHeight:'100vh',background:'#070b14',fontFamily:"'DM Sans',sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500&display=swap');
        @keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
        .member-row:hover{background:rgba(255,255,255,0.04) !important;}
      `}</style>

      <div style={{ maxWidth:800,margin:'0 auto',padding:'32px 24px' }}>

        {/* Header */}
        <div style={{ marginBottom:32,animation:'fadeUp 0.4s ease' }}>
          <button onClick={()=>navigate('/student/dashboard')} style={{ background:'none',border:'none',color:'#475569',cursor:'pointer',fontSize:13,marginBottom:8,display:'block',padding:0 }}>← Back to Dashboard</button>
          <h1 style={{ fontFamily:'Syne,sans-serif',fontSize:28,fontWeight:800,color:'#f1f5f9',margin:0,letterSpacing:'-1px' }}>👥 My Team</h1>
        </div>

        {/* No Team State */}
        {!team && !showCreate && (
          <div style={{ textAlign:'center',padding:'80px 0',background:'rgba(15,23,42,0.9)',border:'1px solid rgba(255,255,255,0.06)',borderRadius:24,animation:'fadeUp 0.4s ease' }}>
            <div style={{ fontSize:56,marginBottom:16,opacity:0.3 }}>👥</div>
            <h2 style={{ fontFamily:'Syne,sans-serif',color:'#f1f5f9',fontSize:20,marginBottom:8 }}>Koi Team Nahi</h2>
            <p style={{ color:'#475569',fontSize:14,marginBottom:28 }}>Apni team banao ya kisi team mein join karo</p>
            <button onClick={()=>setShowCreate(true)} style={{ background:'linear-gradient(135deg,#22d3ee,#6366f1)',border:'none',borderRadius:12,padding:'12px 28px',color:'white',cursor:'pointer',fontFamily:'Syne,sans-serif',fontWeight:700,fontSize:15,boxShadow:'0 0 20px rgba(34,211,238,0.3)' }}>
              + Team Banao
            </button>
          </div>
        )}

        {/* Create Team Form */}
        {showCreate && (
          <div style={{ background:'rgba(15,23,42,0.95)',border:'1px solid rgba(34,211,238,0.3)',borderRadius:20,padding:28,marginBottom:20,animation:'fadeUp 0.3s ease' }}>
            <h2 style={{ fontFamily:'Syne,sans-serif',color:'#f1f5f9',fontSize:18,margin:'0 0 20px' }}>✨ New Team</h2>
            <form onSubmit={createTeam} style={{ display:'flex',flexDirection:'column',gap:14 }}>
              <div>
                <label style={{ fontSize:12,color:'#475569',marginBottom:6,display:'block',textTransform:'uppercase',letterSpacing:1 }}>Team Name *</label>
                <input value={teamName} onChange={e=>setTeamName(e.target.value)} placeholder="e.g. Team Alpha" className="custom-input" />
              </div>
              <div>
                <label style={{ fontSize:12,color:'#475569',marginBottom:6,display:'block',textTransform:'uppercase',letterSpacing:1 }}>Description</label>
                <input value={teamDesc} onChange={e=>setTeamDesc(e.target.value)} placeholder="Team ke baare mein..." className="custom-input" />
              </div>
              <div style={{ display:'flex',gap:10 }}>
                <button type="submit" disabled={submitting} style={{ flex:1,background:'linear-gradient(135deg,#22d3ee,#6366f1)',border:'none',borderRadius:10,padding:'12px',color:'white',cursor:'pointer',fontFamily:'Syne,sans-serif',fontWeight:700,fontSize:14 }}>
                  {submitting?'Creating...':'Create Team →'}
                </button>
                <button type="button" onClick={()=>setShowCreate(false)} style={{ flex:1,background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.08)',borderRadius:10,color:'#94a3b8',cursor:'pointer',fontFamily:'Syne,sans-serif',fontWeight:600 }}>Cancel</button>
              </div>
            </form>
          </div>
        )}

        {/* Team Details */}
        {team && (
          <div style={{ animation:'fadeUp 0.4s ease' }}>

            {/* Team Header Card */}
            <div style={{ background:'linear-gradient(135deg,rgba(34,211,238,0.1) 0%,rgba(99,102,241,0.07) 100%)',border:'1px solid rgba(34,211,238,0.2)',borderRadius:20,padding:'24px 28px',marginBottom:20 }}>
              <div style={{ display:'flex',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap',gap:12 }}>
                <div>
                  <h2 style={{ fontFamily:'Syne,sans-serif',color:'#f1f5f9',fontSize:24,fontWeight:800,margin:'0 0 6px',letterSpacing:'-0.5px' }}>{team.name}</h2>
                  {team.description && <p style={{ color:'#64748b',fontSize:13,margin:0 }}>{team.description}</p>}
                </div>
                <div style={{ display:'flex',gap:10,alignItems:'center' }}>
                  <div style={{ background:'rgba(255,255,255,0.06)',border:'1px solid rgba(255,255,255,0.08)',borderRadius:12,padding:'6px 14px',color:'#94a3b8',fontSize:13 }}>
                    👥 {team.members?.length}/{team.maxMembers} members
                  </div>
                  <button onClick={()=>setShowAdd(!showAdd)} style={{ background:'rgba(34,211,238,0.12)',border:'1px solid rgba(34,211,238,0.25)',borderRadius:12,padding:'8px 16px',color:'#22d3ee',cursor:'pointer',fontFamily:'Syne,sans-serif',fontWeight:700,fontSize:13 }}>
                    + Add Member
                  </button>
                </div>
              </div>
            </div>

            {/* Add Member Form */}
            {showAdd && (
              <div style={{ background:'rgba(15,23,42,0.95)',border:'1px solid rgba(99,102,241,0.3)',borderRadius:16,padding:20,marginBottom:16,animation:'fadeUp 0.3s ease' }}>
                <h3 style={{ fontFamily:'Syne,sans-serif',color:'#f1f5f9',fontSize:15,margin:'0 0 14px' }}>➕ Add New Member</h3>
                <form onSubmit={addMember} style={{ display:'flex',gap:10,flexWrap:'wrap' }}>
                  <input value={memberEmail} onChange={e=>setMemberEmail(e.target.value)} placeholder="Member ka email" className="custom-input" style={{ flex:2,minWidth:200 }} />
                  <select value={memberRole} onChange={e=>setMemberRole(e.target.value)} className="custom-input" style={{ flex:1,minWidth:130 }}>
                    <option value="developer">👨‍💻 Developer</option>
                    <option value="designer">🎨 Designer</option>
                    <option value="tester">🧪 Tester</option>
                    <option value="member">👤 Member</option>
                  </select>
                  <button type="submit" disabled={submitting} style={{ background:'linear-gradient(135deg,#6366f1,#818cf8)',border:'none',borderRadius:10,padding:'12px 20px',color:'white',cursor:'pointer',fontFamily:'Syne,sans-serif',fontWeight:700,whiteSpace:'nowrap' }}>
                    {submitting?'Adding...':'Add →'}
                  </button>
                </form>
              </div>
            )}

            {/* Members List */}
            <div style={{ background:'rgba(15,23,42,0.9)',border:'1px solid rgba(255,255,255,0.06)',borderRadius:20,overflow:'hidden' }}>
              <div style={{ padding:'16px 24px',borderBottom:'1px solid rgba(255,255,255,0.05)' }}>
                <span style={{ color:'#334155',fontSize:11,fontWeight:600,letterSpacing:2,textTransform:'uppercase' }}>Team Members</span>
              </div>
              {team.members?.map((m,i)=>{
                const rc = ROLE_COLORS[m.role]||ROLE_COLORS.member
                return (
                  <div key={m.user?._id||i} className="member-row" style={{ display:'flex',justifyContent:'space-between',alignItems:'center',padding:'16px 24px',borderBottom:'1px solid rgba(255,255,255,0.04)',transition:'background 0.2s' }}>
                    <div style={{ display:'flex',alignItems:'center',gap:14 }}>
                      <div style={{ width:42,height:42,background:'linear-gradient(135deg,#6366f1,#22d3ee)',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',color:'white',fontWeight:800,fontSize:16,flexShrink:0 }}>
                        {m.user?.name?.charAt(0).toUpperCase()||'?'}
                      </div>
                      <div>
                        <div style={{ color:'#f1f5f9',fontSize:15,fontWeight:600 }}>{m.user?.name||'Unknown'}</div>
                        <div style={{ color:'#475569',fontSize:12,marginTop:2 }}>{m.user?.email}</div>
                      </div>
                    </div>
                    <div style={{ display:'flex',alignItems:'center',gap:10 }}>
                      <span style={{ background:rc.bg,color:rc.color,padding:'4px 12px',borderRadius:20,fontSize:12,fontWeight:600 }}>{m.role}</span>
                      {m.role!=='leader' && (
                        <button onClick={()=>removeMember(m.user?._id,m.user?.name)} style={{ background:'rgba(239,68,68,0.1)',border:'1px solid rgba(239,68,68,0.2)',borderRadius:8,padding:'5px 12px',color:'#ef4444',cursor:'pointer',fontSize:12,fontWeight:600,transition:'all 0.2s' }}>Remove</button>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}