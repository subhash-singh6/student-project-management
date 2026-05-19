// frontend/src/pages/student/TeamChat.jsx

import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useSocket } from '../../context/SocketContext'
import API from '../../api/axios'
import { messageService } from '../../services/messageService'
import toast from 'react-hot-toast'

export default function TeamChat() {
  const { user } = useAuth()
  const { socket } = useSocket()
  const navigate = useNavigate()

  const [team, setTeam]         = useState(null)
  const [messages, setMessages] = useState([])
  const [input, setInput]       = useState('')
  const [loading, setLoading]   = useState(true)
  const [typing, setTyping]     = useState(null)
  const bottomRef = useRef()
  const typingTimer = useRef()

  useEffect(() => {
    fetchTeam()
  }, [])

  useEffect(() => {
    if (!socket || !team) return

    // Team room join karo
    socket.emit('join-room', team._id)

    // Messages receive karo
    socket.on('receive-message', (msg) => {
      setMessages(prev => [...prev, msg])
    })

    // Typing indicator
    socket.on('user-typing', ({ name, userId }) => {
      if (userId !== user._id) {
        setTyping(name)
        setTimeout(() => setTyping(null), 2000)
      }
    })

    return () => {
      socket.off('receive-message')
      socket.off('user-typing')
    }
  }, [socket, team])

  useEffect(() => {
    // Auto scroll to bottom
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const fetchTeam = async () => {
    try {
      const res = await API.get('/teams/my')
      const t = res.data.team
      setTeam(t)
      if (t?._id) {
        const msgRes = await messageService.getTeamMessages(t._id)
        setMessages(
          (msgRes.data.messages || []).map((m) => ({
            id: m._id,
            text: m.text,
            senderId: m.sender?._id || m.sender,
            senderName: m.senderName || m.sender?.name,
            time: m.createdAt,
            roomId: t._id,
          }))
        )
      }
    } catch {
      setTeam(null)
    } finally {
      setLoading(false)
    }
  }

  const sendMessage = (e) => {
    e.preventDefault()
    if (!input.trim() || !socket || !team) return

    const msg = {
      id:        Date.now(),
      text:      input.trim(),
      senderId:  user._id,
      senderName: user.name,
      time:      new Date().toISOString(),
      roomId:    team._id,
    }

    // Emit to socket
    socket.emit('send-message', msg)

    // Local mein add karo
    setMessages((prev) => [...prev, msg])

    setInput('')
  }

  const handleTyping = () => {
    if (!socket || !team) return
    socket.emit('typing', { roomId: team._id, name: user.name, userId: user._id })
    clearTimeout(typingTimer.current)
    typingTimer.current = setTimeout(() => {}, 1500)
  }

  const formatTime = (iso) => {
    return new Date(iso).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
  }

  const MEMBER_COLORS = ['#6366f1', '#22d3ee', '#10b981', '#f59e0b', '#ec4899']
  const getMemberColor = (name) => {
    const idx = name?.charCodeAt(0) % MEMBER_COLORS.length
    return MEMBER_COLORS[idx || 0]
  }

  if (loading) return (
    <div style={{ minHeight:'100vh',background:'#070b14',display:'flex',alignItems:'center',justifyContent:'center' }}>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      <div style={{ width:40,height:40,border:'3px solid rgba(34,211,238,0.2)',borderTop:'3px solid #22d3ee',borderRadius:'50%',animation:'spin 1s linear infinite' }} />
    </div>
  )

  if (!team) return (
    <div style={{ minHeight:'100vh',background:'#070b14',display:'flex',alignItems:'center',justifyContent:'center',flexDirection:'column',gap:16 }}>
      <div style={{ fontSize:48,opacity:0.2 }}>💬</div>
      <p style={{ color:'#475569',fontFamily:'sans-serif' }}>Pehle team join karo!</p>
      <button onClick={()=>navigate('/student/team')} style={{ background:'linear-gradient(135deg,#6366f1,#818cf8)',border:'none',borderRadius:10,padding:'10px 24px',color:'white',cursor:'pointer',fontFamily:'sans-serif',fontWeight:600 }}>My Team →</button>
    </div>
  )

  return (
    <div style={{ height:'100vh',background:'#070b14',fontFamily:"'DM Sans',sans-serif",display:'flex',flexDirection:'column' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500&display=swap');
        @keyframes fadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}
        ::-webkit-scrollbar{width:4px}
        ::-webkit-scrollbar-track{background:transparent}
        ::-webkit-scrollbar-thumb{background:rgba(99,102,241,0.3);border-radius:2px}
      `}</style>

      {/* Header */}
      <div style={{ background:'rgba(15,23,42,0.95)',borderBottom:'1px solid rgba(255,255,255,0.06)',padding:'14px 20px',display:'flex',alignItems:'center',justifyContent:'space-between',flexShrink:0 }}>
        <div style={{ display:'flex',alignItems:'center',gap:12 }}>
          <button onClick={()=>navigate('/student/dashboard')} style={{ background:'none',border:'none',color:'#475569',cursor:'pointer',fontSize:18,padding:0 }}>←</button>
          <div style={{ width:38,height:38,background:'linear-gradient(135deg,#6366f1,#22d3ee)',borderRadius:12,display:'flex',alignItems:'center',justifyContent:'center',fontSize:18 }}>💬</div>
          <div>
            <div style={{ fontFamily:'Syne,sans-serif',color:'#f1f5f9',fontWeight:700,fontSize:15 }}>{team.name}</div>
            <div style={{ color:'#475569',fontSize:11 }}>{team.members?.length} members</div>
          </div>
        </div>

        {/* Online members */}
        <div style={{ display:'flex',alignItems:'center',gap:6 }}>
          {team.members?.slice(0,4).map((m,i)=>(
            <div key={i} title={m.user?.name} style={{ width:28,height:28,borderRadius:'50%',background:`linear-gradient(135deg,${getMemberColor(m.user?.name)},${getMemberColor(m.user?.name)}88)`,display:'flex',alignItems:'center',justifyContent:'center',color:'white',fontSize:11,fontWeight:700,marginLeft:i>0?-8:0,border:'2px solid #070b14' }}>
              {m.user?.name?.charAt(0).toUpperCase()}
            </div>
          ))}
          {team.members?.length > 4 && <span style={{ color:'#475569',fontSize:12 }}>+{team.members.length-4}</span>}
        </div>
      </div>

      {/* Messages Area */}
      <div style={{ flex:1,overflowY:'auto',padding:'20px',display:'flex',flexDirection:'column',gap:12 }}>

        {/* Welcome message */}
        {messages.length === 0 && (
          <div style={{ textAlign:'center',margin:'auto',color:'#334155' }}>
            <div style={{ fontSize:48,marginBottom:12,opacity:0.3 }}>💬</div>
            <p style={{ fontSize:14 }}>Chat shuru karo! Team ke saath baat karo.</p>
          </div>
        )}

        {messages.map((msg, i) => {
          const isMe = msg.senderId === user._id
          const color = getMemberColor(msg.senderName)
          const showAvatar = i === 0 || messages[i-1]?.senderId !== msg.senderId

          return (
            <div key={msg.id||i} style={{ display:'flex',justifyContent:isMe?'flex-end':'flex-start',gap:8,animation:'fadeIn 0.3s ease' }}>
              {!isMe && showAvatar && (
                <div style={{ width:32,height:32,borderRadius:'50%',background:`linear-gradient(135deg,${color},${color}88)`,display:'flex',alignItems:'center',justifyContent:'center',color:'white',fontSize:13,fontWeight:700,flexShrink:0,alignSelf:'flex-end' }}>
                  {msg.senderName?.charAt(0).toUpperCase()}
                </div>
              )}
              {!isMe && !showAvatar && <div style={{ width:32,flexShrink:0 }} />}

              <div style={{ maxWidth:'70%' }}>
                {showAvatar && !isMe && (
                  <div style={{ color,fontSize:12,fontWeight:600,marginBottom:4,paddingLeft:4 }}>{msg.senderName}</div>
                )}
                <div style={{
                  background: isMe ? 'linear-gradient(135deg,#6366f1,#818cf8)' : 'rgba(255,255,255,0.06)',
                  borderRadius: isMe ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                  padding: '10px 14px',
                  color: '#f1f5f9',
                  fontSize: 14,
                  lineHeight: 1.5,
                  wordBreak: 'break-word',
                  boxShadow: isMe ? '0 4px 12px rgba(99,102,241,0.3)' : 'none',
                }}>
                  {msg.text}
                </div>
                <div style={{ color:'#334155',fontSize:10,marginTop:4,textAlign:isMe?'right':'left',paddingLeft:4 }}>
                  {formatTime(msg.time)}
                </div>
              </div>
            </div>
          )
        })}

        {/* Typing indicator */}
        {typing && (
          <div style={{ display:'flex',alignItems:'center',gap:8,animation:'fadeIn 0.3s ease' }}>
            <div style={{ color:'#475569',fontSize:13 }}>{typing} typing</div>
            <div style={{ display:'flex',gap:3 }}>
              {[0,1,2].map(i=>(
                <div key={i} style={{ width:5,height:5,borderRadius:'50%',background:'#475569',animation:`pulse 1s ease ${i*0.2}s infinite` }} />
              ))}
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input Area */}
      <div style={{ background:'rgba(15,23,42,0.95)',borderTop:'1px solid rgba(255,255,255,0.06)',padding:'16px 20px',flexShrink:0 }}>
        <form onSubmit={sendMessage} style={{ display:'flex',gap:10,alignItems:'center' }}>
          <input
            value={input}
            onChange={e=>setInput(e.target.value)}
            onKeyPress={handleTyping}
            placeholder="Message type karo..."
            style={{ flex:1,background:'rgba(255,255,255,0.05)',border:'1px solid rgba(255,255,255,0.08)',borderRadius:14,padding:'12px 16px',color:'#f1f5f9',fontSize:14,outline:'none',fontFamily:'DM Sans,sans-serif' }}
          />
          <button type="submit" disabled={!input.trim()} style={{ width:44,height:44,background:input.trim()?'linear-gradient(135deg,#6366f1,#818cf8)':'rgba(255,255,255,0.04)',border:'none',borderRadius:12,color:'white',cursor:input.trim()?'pointer':'not-allowed',fontSize:20,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,transition:'all 0.2s' }}>
            ↑
          </button>
        </form>
      </div>
    </div>
  )
}