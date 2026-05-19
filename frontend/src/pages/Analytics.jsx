// frontend/src/pages/Analytics.jsx
// Chart.js use ho raha hai — already installed hai

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import API from '../api/axios'
import toast from 'react-hot-toast'
import {
  Chart as ChartJS,
  CategoryScale, LinearScale, BarElement,
  Title, Tooltip, Legend, ArcElement,
  PointElement, LineElement, Filler,
} from 'chart.js'
import { Bar, Doughnut, Line } from 'react-chartjs-2'

ChartJS.register(
  CategoryScale, LinearScale, BarElement,
  Title, Tooltip, Legend, ArcElement,
  PointElement, LineElement, Filler
)

const CHART_DEFAULTS = {
  plugins: {
    legend: { labels: { color: '#94a3b8', font: { family: 'DM Sans' } } },
  },
  scales: {
    x: { ticks: { color: '#475569' }, grid: { color: 'rgba(255,255,255,0.04)' } },
    y: { ticks: { color: '#475569' }, grid: { color: 'rgba(255,255,255,0.04)' } },
  },
}

export default function Analytics() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [data, setData]     = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => { fetchData() }, [])

  const fetchData = async () => {
    try {
      const res = await API.get('/projects')
      const projects = res.data.projects || []
      setData(projects)
    } catch {
      toast.error('Data load nahi hua!')
    } finally {
      setLoading(false)
    }
  }

  const getDashboardPath = () => {
    if (user?.role === 'student') return '/student/dashboard'
    if (user?.role === 'mentor')  return '/mentor/dashboard'
    return '/teacher/dashboard'
  }

  if (loading) return (
    <div style={{ minHeight:'100vh',background:'#070b14',display:'flex',alignItems:'center',justifyContent:'center' }}>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      <div style={{ width:40,height:40,border:'3px solid rgba(99,102,241,0.2)',borderTop:'3px solid #6366f1',borderRadius:'50%',animation:'spin 1s linear infinite' }} />
    </div>
  )

  // Data process karo
  const projects = data || []
  const statusCount = {
    pending:      projects.filter(p=>p.status==='pending').length,
    approved:     projects.filter(p=>p.status==='approved').length,
    'in-progress':projects.filter(p=>p.status==='in-progress').length,
    completed:    projects.filter(p=>p.status==='completed').length,
    rejected:     projects.filter(p=>p.status==='rejected').length,
  }

  const categoryCount = {}
  projects.forEach(p => {
    categoryCount[p.category||'Other'] = (categoryCount[p.category||'Other']||0) + 1
  })

  const monthCount = {}
  projects.forEach(p => {
    const month = new Date(p.createdAt).toLocaleString('en-IN',{month:'short',year:'2-digit'})
    monthCount[month] = (monthCount[month]||0) + 1
  })

  const gradeCount = { 'A+':0, 'A':0, 'B+':0, 'B':0, 'C':0, 'D':0, 'F':0 }
  projects.forEach(p => {
    if (p.grade && gradeCount[p.grade] !== undefined) gradeCount[p.grade]++
  })

  // Chart configs
  const statusChart = {
    labels: ['Pending','Approved','In Progress','Completed','Rejected'],
    datasets: [{
      label: 'Projects',
      data: Object.values(statusCount),
      backgroundColor: ['rgba(245,158,11,0.7)','rgba(16,185,129,0.7)','rgba(99,102,241,0.7)','rgba(34,211,238,0.7)','rgba(239,68,68,0.7)'],
      borderColor:     ['#f59e0b','#10b981','#6366f1','#22d3ee','#ef4444'],
      borderWidth: 2, borderRadius: 8,
    }],
  }

  const categoryChart = {
    labels: Object.keys(categoryCount),
    datasets: [{
      data: Object.values(categoryCount),
      backgroundColor: ['rgba(99,102,241,0.8)','rgba(34,211,238,0.8)','rgba(16,185,129,0.8)','rgba(245,158,11,0.8)','rgba(239,68,68,0.8)','rgba(167,139,250,0.8)'],
      borderColor: ['#6366f1','#22d3ee','#10b981','#f59e0b','#ef4444','#a78bfa'],
      borderWidth: 2,
    }],
  }

  const monthLabels = Object.keys(monthCount).slice(-6)
  const submissionTrend = {
    labels: monthLabels.length > 0 ? monthLabels : ['Jan','Feb','Mar','Apr','May','Jun'],
    datasets: [{
      label: 'Projects Submitted',
      data: monthLabels.length > 0 ? monthLabels.map(m=>monthCount[m]) : [0,0,0,0,0,0],
      borderColor: '#6366f1',
      backgroundColor: 'rgba(99,102,241,0.1)',
      borderWidth: 2, fill: true, tension: 0.4,
      pointBackgroundColor: '#6366f1',
      pointBorderColor: '#fff', pointRadius: 5,
    }],
  }

  const gradeChart = {
    labels: Object.keys(gradeCount),
    datasets: [{
      label: 'Students',
      data: Object.values(gradeCount),
      backgroundColor: ['rgba(16,185,129,0.7)','rgba(16,185,129,0.5)','rgba(99,102,241,0.7)','rgba(99,102,241,0.5)','rgba(245,158,11,0.7)','rgba(249,115,22,0.7)','rgba(239,68,68,0.7)'],
      borderColor: ['#10b981','#10b981','#6366f1','#6366f1','#f59e0b','#f97316','#ef4444'],
      borderWidth: 2, borderRadius: 8,
    }],
  }

  const totalProjects  = projects.length
  const completedPct   = totalProjects > 0 ? Math.round((statusCount.completed/totalProjects)*100) : 0
  const avgProgress    = totalProjects > 0 ? Math.round(projects.reduce((a,p)=>a+p.progress,0)/totalProjects) : 0
  const gradedCount    = projects.filter(p=>p.grade).length

  return (
    <div style={{ minHeight:'100vh',background:'#070b14',fontFamily:"'DM Sans',sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500&display=swap');
        @keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
      `}</style>

      <div style={{ maxWidth:1200,margin:'0 auto',padding:'32px 24px' }}>

        {/* Header */}
        <div style={{ marginBottom:28,animation:'fadeUp 0.4s ease' }}>
          <button onClick={()=>navigate(getDashboardPath())} style={{ background:'none',border:'none',color:'#475569',cursor:'pointer',fontSize:13,marginBottom:8,display:'block',padding:0 }}>← Dashboard</button>
          <h1 style={{ fontFamily:'Syne,sans-serif',fontSize:28,fontWeight:800,color:'#f1f5f9',margin:0 }}>📊 Analytics Dashboard</h1>
          <p style={{ color:'#475569',fontSize:13,marginTop:4 }}>Project performance overview</p>
        </div>

        {/* Summary Stats */}
        <div style={{ display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:14,marginBottom:24,animation:'fadeUp 0.4s ease 0.1s both' }}>
          {[
            { label:'Total Projects',  value:totalProjects,  icon:'📁', color:'#6366f1', bg:'rgba(99,102,241,0.1)',  border:'rgba(99,102,241,0.2)' },
            { label:'Completion Rate', value:`${completedPct}%`, icon:'✅', color:'#10b981', bg:'rgba(16,185,129,0.1)', border:'rgba(16,185,129,0.2)' },
            { label:'Avg Progress',    value:`${avgProgress}%`,  icon:'📈', color:'#22d3ee', bg:'rgba(34,211,238,0.1)', border:'rgba(34,211,238,0.2)' },
            { label:'Graded',          value:gradedCount,    icon:'⭐', color:'#f59e0b', bg:'rgba(245,158,11,0.1)', border:'rgba(245,158,11,0.2)' },
          ].map(s=>(
            <div key={s.label} style={{ background:s.bg,border:`1px solid ${s.border}`,borderRadius:18,padding:'20px 18px' }}>
              <div style={{ fontSize:24,marginBottom:10 }}>{s.icon}</div>
              <div style={{ fontSize:28,fontWeight:800,color:s.color,fontFamily:'Syne,sans-serif' }}>{s.value}</div>
              <div style={{ color:'#475569',fontSize:12,marginTop:6 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Charts Row 1 */}
        <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:20,marginBottom:20,animation:'fadeUp 0.4s ease 0.2s both' }}>

          {/* Status Bar Chart */}
          <div style={{ background:'rgba(15,23,42,0.9)',border:'1px solid rgba(255,255,255,0.06)',borderRadius:20,padding:24 }}>
            <h3 style={{ fontFamily:'Syne,sans-serif',color:'#f1f5f9',fontSize:16,margin:'0 0 20px' }}>📊 Project Status</h3>
            {totalProjects > 0 ? (
              <Bar data={statusChart} options={{ ...CHART_DEFAULTS, responsive:true, plugins:{ ...CHART_DEFAULTS.plugins, legend:{display:false} } }} />
            ) : (
              <div style={{ textAlign:'center',padding:'40px 0',color:'#334155' }}>No data yet</div>
            )}
          </div>

          {/* Category Doughnut */}
          <div style={{ background:'rgba(15,23,42,0.9)',border:'1px solid rgba(255,255,255,0.06)',borderRadius:20,padding:24 }}>
            <h3 style={{ fontFamily:'Syne,sans-serif',color:'#f1f5f9',fontSize:16,margin:'0 0 20px' }}>📂 Category Distribution</h3>
            {Object.keys(categoryCount).length > 0 ? (
              <div style={{ maxWidth:280,margin:'0 auto' }}>
                <Doughnut data={categoryChart} options={{ responsive:true, plugins:{ legend:{ position:'bottom', labels:{ color:'#94a3b8', padding:12, font:{family:'DM Sans',size:12} } } } }} />
              </div>
            ) : (
              <div style={{ textAlign:'center',padding:'40px 0',color:'#334155' }}>No data yet</div>
            )}
          </div>
        </div>

        {/* Charts Row 2 */}
        <div style={{ display:'grid',gridTemplateColumns:'1.5fr 1fr',gap:20,animation:'fadeUp 0.4s ease 0.3s both' }}>

          {/* Submission Trend Line */}
          <div style={{ background:'rgba(15,23,42,0.9)',border:'1px solid rgba(255,255,255,0.06)',borderRadius:20,padding:24 }}>
            <h3 style={{ fontFamily:'Syne,sans-serif',color:'#f1f5f9',fontSize:16,margin:'0 0 20px' }}>📈 Submission Trend</h3>
            <Line data={submissionTrend} options={{ ...CHART_DEFAULTS, responsive:true }} />
          </div>

          {/* Grade Distribution */}
          <div style={{ background:'rgba(15,23,42,0.9)',border:'1px solid rgba(255,255,255,0.06)',borderRadius:20,padding:24 }}>
            <h3 style={{ fontFamily:'Syne,sans-serif',color:'#f1f5f9',fontSize:16,margin:'0 0 20px' }}>⭐ Grade Distribution</h3>
            {gradedCount > 0 ? (
              <Bar data={gradeChart} options={{ ...CHART_DEFAULTS, responsive:true, plugins:{ ...CHART_DEFAULTS.plugins, legend:{display:false} } }} />
            ) : (
              <div style={{ textAlign:'center',padding:'40px 0',color:'#334155' }}>
                <div style={{ fontSize:32,marginBottom:8,opacity:0.2 }}>⭐</div>
                <p style={{ fontSize:13 }}>Abhi koi grade nahi diya gaya</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}