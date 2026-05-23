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

    // Join team workspace room
    socket.emit('join-room', team._id)

    // Receive message stream listeners
    socket.on('receive-message', (msg) => {
      setMessages(prev => [...prev, msg])
    })

    // Typing indicators broadcast
    socket.on('user-typing', ({ name, userId }) => {
      if (userId !== user._id) {
        setTyping(name)
        // Clear indicator automatically after 2 seconds
        if (typingTimer.current) clearTimeout(typingTimer.current)
        typingTimer.current = setTimeout(() => setTyping(null), 2000)
      }
    })

    return () => {
      socket.off('receive-message')
      socket.off('user-typing')
      if (typingTimer.current) clearTimeout(typingTimer.current)
    }
  }, [socket, team])

  useEffect(() => {
    // Smooth scrolling anchor sequence
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, typing])

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
      id:      Date.now(),
      text:      input.trim(),
      senderId:  user._id,
      senderName: user.name,
      time:      new Date().toISOString(),
      roomId:    team._id,
    }

    // Emit live to WebSocket Node
    socket.emit('send-message', msg)

    // Mount structural sequence locally
    setMessages((prev) => [...prev, msg])
    setInput('')
  }

  const handleTyping = () => {
    if (!socket || !team) return
    socket.emit('typing', { roomId: team._id, name: user.name, userId: user._id })
  }

  const formatTime = (iso) => {
    return new Date(iso).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
  }

  const MEMBER_COLORS = ['#22d3ee', '#34d399', '#60a5fa', '#a78bfa', '#f43f5e']
  const getMemberColor = (name) => {
    const idx = name?.charCodeAt(0) % MEMBER_COLORS.length
    return MEMBER_COLORS[idx || 0]
  }

  if (loading) return (
    <div className="min-h-screen bg-[#070b14] flex flex-col items-center justify-center gap-5">
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
      <div className="w-14 h-14 border-4 border-teal-500/20 border-t-teal-400 rounded-full" style={{ animation: 'spin 1s linear infinite' }} />
      <p className="text-sm font-semibold tracking-widest text-[#94a3b8] animate-pulse">Establishing Workspace Streams...</p>
    </div>
  )

  if (!team) return (
    <div className="min-h-screen bg-[#070b14] flex flex-col items-center justify-center gap-6 text-center px-4">
      <div className="text-6xl opacity-20 animate-bounce">💬</div>
      <div>
        <h2 className="text-xl font-extrabold text-white tracking-tight">No Active Workspace Found</h2>
        <p className="text-xs text-[#475569] font-bold mt-1.5 max-w-xs leading-relaxed">
          Please initialize or join a team squad inside your launchpad before accessing the group server module.
        </p>
      </div>
      <button 
        onClick={() => navigate('/student/team')} 
        className="px-6 py-3 text-xs font-black tracking-widest uppercase text-[#070b14] bg-gradient-to-r from-teal-400 to-cyan-500 rounded-xl hover:opacity-90 shadow-lg shadow-teal-500/20 transition-all active:scale-95"
      >
        Access My Team Roster
      </button>
    </div>
  )

  return (
    <div className="h-screen bg-[#070b14] text-[#f8fafc] font-sans flex flex-col relative overflow-hidden">
      
      {/* ── Injection Styles ──────────────────────────────── */}
      <style>{`
        @keyframes fadeUp { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
        @keyframes wave { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-4px); } }
        
        .anim-fade-up { animation: fadeUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) both; }
        .typing-dot { animation: wave 1.2s ease-in-out infinite; }
        
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(20, 184, 166, 0.15); border-radius: 10px; }
        ::-webkit-scrollbar-thumb:hover { background: rgba(20, 184, 166, 0.3); }
      `}</style>

      {/* ── Background Blurred Aura Nodes ──────────────────── */}
      <div aria-hidden className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full bg-gradient-to-br from-teal-500/5 to-transparent blur-[80px]" />
        <div className="absolute bottom-0 left-0 w-[450px] h-[450px] rounded-full bg-gradient-to-tr from-cyan-500/5 to-transparent blur-[90px]" />
      </div>

      {/* ── HEADER NAVIGATION PANEL ──────────────────────── */}
      <header className="bg-[#0b1324]/80 backdrop-blur-xl border-b border-white/[0.04] px-5 py-4 flex items-center justify-between flex-shrink-0 relative z-10">
        <div className="flex items-center gap-4 min-w-0">
          <button 
            onClick={() => navigate('/student/dashboard')} 
            className="w-9 h-9 bg-white/[0.02] border border-white/5 hover:border-white/10 text-slate-400 hover:text-white rounded-xl flex items-center justify-center text-sm transition-all active:scale-95"
            title="Return to Hub"
          >
            ←
          </button>
          
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-400 via-cyan-500 to-blue-500 flex items-center justify-center text-lg shadow-md shadow-teal-500/10">
            💬
          </div>
          
          <div className="overflow-hidden">
            <h1 className="font-display font-extrabold text-sm sm:text-base text-white tracking-tight truncate">{team.name}</h1>
            <p className="text-[10px] font-bold text-teal-400 tracking-wider uppercase mt-0.5">{team.members?.length || 0} Synced Nodes</p>
          </div>
        </div>

        {/* Sync Status Rosters Overlap */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <div className="flex items-center -space-x-2.5 hidden sm:flex">
            {team.members?.slice(0, 4).map((m, i) => {
              const name = m.user?.name || 'User'
              const color = getMemberColor(name)
              return (
                <div 
                  key={i} 
                  title={name} 
                  className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[10px] font-black border-2 border-[#070b14] shadow-md transition-transform hover:-translate-y-0.5 cursor-pointer"
                  style={{ background: `linear-gradient(135deg, ${color}, ${color}dd)` }}
                >
                  {name.charAt(0).toUpperCase()}
                </div>
              )
            })}
          </div>
          {team.members?.length > 4 && (
            <span className="text-[10px] font-extrabold bg-white/[0.03] border border-white/5 px-2 py-1 rounded-md text-[#475569] font-mono">
              +{team.members.length - 4}
            </span>
          )}
        </div>
      </header>

      {/* ── MAIN STREAM CHAT STREAM SPACE ────────────────── */}
      <main className="flex-1 overflow-y-auto px-5 py-6 flex flex-col gap-5 relative z-10">
        
        {/* Dynamic Static Dashboard Empty Array Indicator */}
        {messages.length === 0 && (
          <div className="text-center my-auto flex flex-col items-center justify-center gap-3">
            <div className="text-5xl opacity-20 animate-pulse">📡</div>
            <div className="max-w-xs">
              <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest">Secure Broadcast Channel</h3>
              <p className="text-[11px] text-[#475569] font-semibold leading-relaxed mt-1">
                Zero log artifacts streaming in terminal. Enter a transmission query below to message teammates.
              </p>
            </div>
          </div>
        )}

        {/* Messages Compilation Engine */}
        {messages.map((msg, i) => {
          const isMe = msg.senderId === user._id
          const color = getMemberColor(msg.senderName)
          // Evaluate avatar stacking logic parameters
          const showAvatar = i === 0 || messages[i - 1]?.senderId !== msg.senderId

          return (
            <div 
              key={msg.id || i} 
              className={`anim-fade-up flex items-end gap-3 max-w-full sm:max-w-3xl ${isMe ? 'self-end flex-row-reverse' : 'self-start'}`}
            >
              {/* Node Avatar Construct */}
              {!isMe ? (
                showAvatar ? (
                  <div 
                    title={msg.senderName}
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-black flex-shrink-0 shadow-md border border-white/5"
                    style={{ background: `linear-gradient(135deg, ${color}, ${color}cc)` }}
                  >
                    {msg.senderName?.charAt(0).toUpperCase()}
                  </div>
                ) : (
                  <div className="w-8 flex-shrink-0" />
                )
              ) : null}

              {/* Message Payload Package Bubble */}
              <div className="flex flex-col max-w-[82%] sm:max-w-md">
                {showAvatar && !isMe && (
                  <span 
                    className="text-[11px] font-bold tracking-tight mb-1 ml-1"
                    style={{ color: color }}
                  >
                    {msg.senderName}
                  </span>
                )}
                
                <div 
                  className={`px-4 py-3 text-sm font-medium tracking-normal leading-relaxed break-words border ${
                    isMe 
                      ? 'bg-gradient-to-br from-teal-500 to-cyan-500 text-[#070b14] border-teal-400/20 rounded-[18px] rounded-br-[4px] font-semibold shadow-md shadow-teal-500/5' 
                      : 'bg-[#0f172a]/90 text-slate-200 border-white/[0.04] rounded-[18px] rounded-bl-[4px]'
                  }`}
                >
                  {msg.text}
                </div>
                
                <span className={`text-[9px] font-bold text-[#475569] mt-1 tracking-wider px-1 ${isMe ? 'text-right' : 'text-left'}`}>
                  {formatTime(msg.time)}
                </span>
              </div>
            </div>
          )
        })}

        {/* Dynamic Fluid Typing Nodes Component */}
        {typing && (
          <div className="anim-fade-up flex items-center gap-3 self-start pl-11">
            <span className="text-[11px] font-bold tracking-wide text-teal-400/80 uppercase">{typing} logging input</span>
            <div className="flex items-center gap-1.5 h-3">
              {[0, 1, 2].map((i) => (
                <div 
                  key={i} 
                  className="typing-dot w-1.5 h-1.5 rounded-full bg-teal-500/60"
                  style={{ animationDelay: `${i * 0.2}s` }}
                />
              ))}
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </main>

      {/* ── TERMINAL FOOTER CONTROLS ─────────────────────── */}
      <footer className="bg-[#0b1324]/90 backdrop-blur-xl border-t border-white/[0.04] p-4 sm:p-5 flex-shrink-0 relative z-10">
        <form onSubmit={sendMessage} className="flex items-center gap-3 max-w-7xl mx-auto">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleTyping}
            placeholder="Type your secure terminal transmission message..."
            className="flex-1 bg-white/[0.03] border border-white/5 focus:border-teal-500/30 rounded-xl px-4 py-3.5 text-sm text-slate-200 placeholder-[#475569] font-medium outline-none transition-all focus:shadow-xl focus:shadow-black/20"
          />
          <button 
            type="submit" 
            disabled={!input.trim()} 
            className={`w-12 h-12 rounded-xl text-lg font-black flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
              input.trim() 
                ? 'bg-gradient-to-br from-teal-400 to-cyan-500 text-[#070b14] cursor-pointer shadow-lg shadow-teal-400/10 active:scale-95' 
                : 'bg-white/[0.02] border border-white/5 text-[#475569] cursor-not-allowed'
            }`}
          >
            ↑
          </button>
        </form>
      </footer>
    </div>
  )
}