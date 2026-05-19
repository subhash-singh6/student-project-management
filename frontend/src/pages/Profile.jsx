// frontend/src/pages/Profile.jsx

import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import API from '../api/axios'
import toast from 'react-hot-toast'

export default function Profile() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const fileRef = useRef()

  const [profile, setProfile]     = useState(null)
  const [loading, setLoading]     = useState(true)
  const [saving, setSaving]       = useState(false)
  const [activeTab, setActiveTab] = useState('profile')
  const [avatarPreview, setAvatarPreview] = useState(null)

  const [form, setForm] = useState({
    name: '', phone: '', expertise: '', organization: '',
    subjects: '', branch: '', semester: '',
  })

  const [passwords, setPasswords] = useState({
    currentPassword: '', newPassword: '', confirmPassword: '',
  })

  useEffect(() => { fetchProfile() }, [])

  const fetchProfile = async () => {
    try {
      const res = await API.get('/profile')
      setProfile(res.data.user)
      setForm({
        name:         res.data.user.name || '',
        phone:        res.data.user.phone || '',
        expertise:    res.data.user.expertise?.join(', ') || '',
        organization: res.data.user.organization || '',
        subjects:     res.data.user.subjects?.join(', ') || '',
        branch:       res.data.user.branch || '',
        semester:     res.data.user.semester || '',
      })
    } catch {
      toast.error('Profile load nahi hua!')
    } finally {
      setLoading(false)
    }
  }

  const handleAvatarChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    if (file.size > 2 * 1024 * 1024) return toast.error('File 2MB se choti honi chahiye!')
    setAvatarPreview(URL.createObjectURL(file))
    handleAvatarUpload(file)
  }

  const handleAvatarUpload = async (file) => {
    const formData = new FormData()
    formData.append('avatar', file)
    try {
      const res = await API.post('/profile/avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      toast.success('Avatar update ho gaya! 🖼️')
      // Auth context update karo
      const updated = { ...user, avatar: res.data.avatarUrl }
      localStorage.setItem('user', JSON.stringify(updated))
    } catch {
      toast.error('Avatar upload nahi hua!')
    }
  }

  const handleUpdateProfile = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const payload = { ...form }
      if (form.expertise) payload.expertise = form.expertise.split(',').map(e => e.trim())
      if (form.subjects)  payload.subjects  = form.subjects.split(',').map(s => s.trim())
      await API.put('/profile/update', payload)
      toast.success('Profile update ho gaya! ✅')
      fetchProfile()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error aaya!')
    } finally {
      setSaving(false)
    }
  }

  const handleChangePassword = async (e) => {
    e.preventDefault()
    if (passwords.newPassword !== passwords.confirmPassword)
      return toast.error('Naye passwords match nahi karte!')
    if (passwords.newPassword.length < 6)
      return toast.error('Password kam se kam 6 characters ka hona chahiye!')
    setSaving(true)
    try {
      await API.put('/profile/change-password', {
        currentPassword: passwords.currentPassword,
        newPassword:     passwords.newPassword,
      })
      toast.success('Password change ho gaya! 🔐')
      setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' })
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error aaya!')
    } finally {
      setSaving(false)
    }
  }

  const getDashboardPath = () => {
    if (user?.role === 'student') return '/student/dashboard'
    if (user?.role === 'mentor')  return '/mentor/dashboard'
    return '/teacher/dashboard'
  }

  const ROLE_COLOR = {
    student: { color: '#6366f1', bg: 'rgba(99,102,241,0.12)' },
    mentor:  { color: '#22d3ee', bg: 'rgba(34,211,238,0.12)' },
    teacher: { color: '#f59e0b', bg: 'rgba(245,158,11,0.12)' },
  }
  const rc = ROLE_COLOR[user?.role] || ROLE_COLOR.student

  if (loading) return (
    <div style={{ minHeight:'100vh',background:'#070b14',display:'flex',alignItems:'center',justifyContent:'center' }}>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      <div style={{ width:40,height:40,border:'3px solid rgba(99,102,241,0.2)',borderTop:'3px solid #6366f1',borderRadius:'50%',animation:'spin 1s linear infinite' }} />
    </div>
  )

  const avatarSrc = avatarPreview || (profile?.avatar ? `http://localhost:5000${profile.avatar}` : null)

  return (
    <div style={{ minHeight:'100vh',background:'#070b14',fontFamily:"'DM Sans',sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500&display=swap');
        @keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
        .tab-btn:hover{background:rgba(255,255,255,0.05) !important;}
        .avatar-overlay{opacity:0;transition:opacity 0.2s;}
        .avatar-wrap:hover .avatar-overlay{opacity:1 !important;}
      `}</style>

      <div style={{ maxWidth:900,margin:'0 auto',padding:'32px 24px' }}>

        {/* Header */}
        <div style={{ marginBottom:28,animation:'fadeUp 0.4s ease' }}>
          <button onClick={()=>navigate(getDashboardPath())} style={{ background:'none',border:'none',color:'#475569',cursor:'pointer',fontSize:13,marginBottom:8,display:'block',padding:0 }}>← Dashboard</button>
          <h1 style={{ fontFamily:'Syne,sans-serif',fontSize:28,fontWeight:800,color:'#f1f5f9',margin:0 }}>👤 My Profile</h1>
        </div>

        <div style={{ display:'grid',gridTemplateColumns:'280px 1fr',gap:24,animation:'fadeUp 0.4s ease 0.1s both' }}>

          {/* Left — Avatar Card */}
          <div>
            <div style={{ background:'rgba(15,23,42,0.9)',border:'1px solid rgba(255,255,255,0.06)',borderRadius:20,padding:28,textAlign:'center',marginBottom:16 }}>

              {/* Avatar */}
              <div className="avatar-wrap" style={{ position:'relative',display:'inline-block',marginBottom:16,cursor:'pointer' }} onClick={()=>fileRef.current?.click()}>
                {avatarSrc ? (
                  <img src={avatarSrc} alt="Avatar" style={{ width:96,height:96,borderRadius:'50%',objectFit:'cover',border:'3px solid #6366f1' }} />
                ) : (
                  <div style={{ width:96,height:96,borderRadius:'50%',background:'linear-gradient(135deg,#6366f1,#22d3ee)',display:'flex',alignItems:'center',justifyContent:'center',color:'white',fontSize:36,fontWeight:800,margin:'0 auto' }}>
                    {profile?.name?.charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="avatar-overlay" style={{ position:'absolute',inset:0,borderRadius:'50%',background:'rgba(0,0,0,0.6)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:20 }}>📷</div>
              </div>

              <input ref={fileRef} type="file" accept="image/*" onChange={handleAvatarChange} style={{ display:'none' }} />

              <p style={{ color:'#475569',fontSize:12,marginBottom:16 }}>Click to change avatar</p>

              <h2 style={{ fontFamily:'Syne,sans-serif',color:'#f1f5f9',fontSize:18,fontWeight:700,margin:'0 0 6px' }}>{profile?.name}</h2>
              <p style={{ color:'#64748b',fontSize:13,margin:'0 0 12px' }}>{profile?.email}</p>

              <span style={{ background:rc.bg,color:rc.color,padding:'5px 16px',borderRadius:20,fontSize:13,fontWeight:600,textTransform:'capitalize' }}>
                {profile?.role}
              </span>

              {/* Role-specific info */}
              <div style={{ marginTop:20,display:'flex',flexDirection:'column',gap:8 }}>
                {profile?.branch && (
                  <div style={{ background:'rgba(255,255,255,0.03)',borderRadius:10,padding:'8px 12px',color:'#94a3b8',fontSize:12 }}>🏫 {profile.branch} • Sem {profile.semester}</div>
                )}
                {profile?.organization && (
                  <div style={{ background:'rgba(255,255,255,0.03)',borderRadius:10,padding:'8px 12px',color:'#94a3b8',fontSize:12 }}>🏢 {profile.organization}</div>
                )}
                {profile?.expertise?.length > 0 && (
                  <div style={{ display:'flex',flexWrap:'wrap',gap:4,justifyContent:'center' }}>
                    {profile.expertise.map(e=>(
                      <span key={e} style={{ background:'rgba(99,102,241,0.1)',color:'#818cf8',padding:'2px 8px',borderRadius:20,fontSize:11 }}>{e}</span>
                    ))}
                  </div>
                )}
                {profile?.phone && (
                  <div style={{ color:'#64748b',fontSize:12 }}>📱 {profile.phone}</div>
                )}
              </div>

              {/* Logout */}
              <button onClick={()=>{logout();navigate('/login')}} style={{ marginTop:20,width:'100%',background:'rgba(239,68,68,0.1)',border:'1px solid rgba(239,68,68,0.2)',borderRadius:10,padding:'9px',color:'#ef4444',cursor:'pointer',fontFamily:'Syne,sans-serif',fontWeight:600,fontSize:13 }}>
                Logout
              </button>
            </div>
          </div>

          {/* Right — Tabs */}
          <div>
            {/* Tab Buttons */}
            <div style={{ display:'flex',gap:4,marginBottom:20,background:'rgba(15,23,42,0.9)',border:'1px solid rgba(255,255,255,0.06)',borderRadius:14,padding:6 }}>
              {[
                { key:'profile',  label:'✏️ Edit Profile' },
                { key:'password', label:'🔐 Password' },
              ].map(tab=>(
                <button key={tab.key} className="tab-btn" onClick={()=>setActiveTab(tab.key)} style={{ flex:1,background:activeTab===tab.key?'rgba(99,102,241,0.2)':'transparent',border:`1px solid ${activeTab===tab.key?'rgba(99,102,241,0.3)':'transparent'}`,borderRadius:10,padding:'10px',color:activeTab===tab.key?'#818cf8':'#64748b',cursor:'pointer',fontFamily:'Syne,sans-serif',fontWeight:600,fontSize:13,transition:'all 0.2s' }}>
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Edit Profile Tab */}
            {activeTab==='profile' && (
              <div style={{ background:'rgba(15,23,42,0.9)',border:'1px solid rgba(255,255,255,0.06)',borderRadius:20,padding:24 }}>
                <h2 style={{ fontFamily:'Syne,sans-serif',color:'#f1f5f9',fontSize:17,margin:'0 0 20px' }}>✏️ Edit Profile</h2>
                <form onSubmit={handleUpdateProfile} style={{ display:'flex',flexDirection:'column',gap:14 }}>
                  <div>
                    <label style={{ fontSize:12,color:'#475569',marginBottom:6,display:'block',textTransform:'uppercase',letterSpacing:1 }}>Full Name</label>
                    <input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} className="custom-input" />
                  </div>
                  <div>
                    <label style={{ fontSize:12,color:'#475569',marginBottom:6,display:'block',textTransform:'uppercase',letterSpacing:1 }}>Phone</label>
                    <input value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})} placeholder="+91 98765 43210" className="custom-input" />
                  </div>

                  {user?.role==='student' && (
                    <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:12 }}>
                      <div>
                        <label style={{ fontSize:12,color:'#475569',marginBottom:6,display:'block',textTransform:'uppercase',letterSpacing:1 }}>Branch</label>
                        <select value={form.branch} onChange={e=>setForm({...form,branch:e.target.value})} className="custom-input">
                          <option value="CSE">CSE</option>
                          <option value="ECE">ECE</option>
                          <option value="ME">ME</option>
                          <option value="CE">CE</option>
                          <option value="IT">IT</option>
                        </select>
                      </div>
                      <div>
                        <label style={{ fontSize:12,color:'#475569',marginBottom:6,display:'block',textTransform:'uppercase',letterSpacing:1 }}>Semester</label>
                        <input type="number" min="1" max="8" value={form.semester} onChange={e=>setForm({...form,semester:e.target.value})} className="custom-input" />
                      </div>
                    </div>
                  )}

                  {user?.role==='mentor' && (<>
                    <div>
                      <label style={{ fontSize:12,color:'#475569',marginBottom:6,display:'block',textTransform:'uppercase',letterSpacing:1 }}>Organization</label>
                      <input value={form.organization} onChange={e=>setForm({...form,organization:e.target.value})} className="custom-input" />
                    </div>
                    <div>
                      <label style={{ fontSize:12,color:'#475569',marginBottom:6,display:'block',textTransform:'uppercase',letterSpacing:1 }}>Expertise (comma separated)</label>
                      <input value={form.expertise} onChange={e=>setForm({...form,expertise:e.target.value})} placeholder="React, Node.js" className="custom-input" />
                    </div>
                  </>)}

                  {user?.role==='teacher' && (
                    <div>
                      <label style={{ fontSize:12,color:'#475569',marginBottom:6,display:'block',textTransform:'uppercase',letterSpacing:1 }}>Subjects (comma separated)</label>
                      <input value={form.subjects} onChange={e=>setForm({...form,subjects:e.target.value})} placeholder="DBMS, Web Dev" className="custom-input" />
                    </div>
                  )}

                  <button type="submit" disabled={saving} className="btn-primary" style={{ marginTop:4 }}>
                    {saving ? 'Saving...' : 'Save Changes →'}
                  </button>
                </form>
              </div>
            )}

            {/* Password Tab */}
            {activeTab==='password' && (
              <div style={{ background:'rgba(15,23,42,0.9)',border:'1px solid rgba(255,255,255,0.06)',borderRadius:20,padding:24 }}>
                <h2 style={{ fontFamily:'Syne,sans-serif',color:'#f1f5f9',fontSize:17,margin:'0 0 20px' }}>🔐 Change Password</h2>
                <form onSubmit={handleChangePassword} style={{ display:'flex',flexDirection:'column',gap:14 }}>
                  <div>
                    <label style={{ fontSize:12,color:'#475569',marginBottom:6,display:'block',textTransform:'uppercase',letterSpacing:1 }}>Current Password</label>
                    <input type="password" value={passwords.currentPassword} onChange={e=>setPasswords({...passwords,currentPassword:e.target.value})} placeholder="••••••••" className="custom-input" />
                  </div>
                  <div>
                    <label style={{ fontSize:12,color:'#475569',marginBottom:6,display:'block',textTransform:'uppercase',letterSpacing:1 }}>New Password</label>
                    <input type="password" value={passwords.newPassword} onChange={e=>setPasswords({...passwords,newPassword:e.target.value})} placeholder="Min 6 characters" className="custom-input" />
                  </div>
                  <div>
                    <label style={{ fontSize:12,color:'#475569',marginBottom:6,display:'block',textTransform:'uppercase',letterSpacing:1 }}>Confirm New Password</label>
                    <input type="password" value={passwords.confirmPassword} onChange={e=>setPasswords({...passwords,confirmPassword:e.target.value})} placeholder="Dobara likho" className="custom-input" />
                    {passwords.newPassword && passwords.confirmPassword && (
                      <p style={{ fontSize:12,marginTop:6,color:passwords.newPassword===passwords.confirmPassword?'#10b981':'#ef4444' }}>
                        {passwords.newPassword===passwords.confirmPassword ? '✅ Passwords match' : '❌ Passwords match nahi karte'}
                      </p>
                    )}
                  </div>
                  <button type="submit" disabled={saving} style={{ background:'linear-gradient(135deg,#10b981,#059669)',border:'none',borderRadius:10,padding:'13px',color:'white',cursor:'pointer',fontFamily:'Syne,sans-serif',fontWeight:700,fontSize:14,marginTop:4 }}>
                    {saving ? 'Changing...' : 'Change Password 🔐'}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}