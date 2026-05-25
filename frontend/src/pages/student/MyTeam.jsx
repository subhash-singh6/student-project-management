// frontend/src/pages/student/TeamChat.jsx

import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../constants/context/AuthContext'
import { useSocket } from '../../constants/context/SocketContext'
import API from '../../api/axios'
import { messageService } from '../../services/messageService'

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

    socket.emit('join-room', team._id)

    socket.on('receive-message', (msg) => {
      setMessages(prev => [...prev, msg])
    })

    socket.on('user-typing', ({ name, userId }) => {
      if (userId !== user._id) {
        setTyping(name)
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

    socket.emit('send-message', msg)
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

  const MEMBER_COLORS = ['text-cyan-400', 'text-emerald-400', 'text-blue-400', 'text-purple-400', 'text-rose-400']
  const MEMBER_BGS = ['from-cyan-500', 'from-emerald-500', 'from-blue-500', 'from-purple-500', 'from-rose-500']
  
  const getMemberIndex = (name) => {
    return (name?.charCodeAt(0) || 0) % MEMBER_COLORS.length
  }

  if (loading) return (
    <div className="min-h-screen bg-[#070b14] flex flex-col items-center justify-center gap-5 font-sans">
      <div className="w-14 h-14 border-4 border-cyan-500/20 border-t-cyan-400 rounded-full animate-spin" />
      <p className="text-sm font-semibold tracking-widest text-slate-400 animate-pulse">Establishing Workspace Streams...</p>
    </div>
  )

  if (!team) return (
    <div className="min-h-screen bg-[#070b14] flex flex-col items-center justify-center gap-6 text-center px-4 font-sans">
      <div className="text-6xl opacity-25 animate-bounce">💬</div>
      <div>
        <h2 className="text-xl font-black text-white tracking-tight">No Active Workspace Found</h2>
        <p className="text-xs text-slate-500 font-bold mt-1.5 max-w-xs leading-relaxed">
          Please initialize or join a team squad inside your launchpad before accessing the group server module.
        </p>
      </div>
      <button 
        onClick={() => navigate('/student/team')} 
        className="px-6 py-3 text-xs font-black tracking-widest uppercase text-[#070b14] bg-gradient-to-r from-cyan-400 to-blue-500 rounded-xl hover:opacity-90 shadow-lg shadow-cyan-500/20 transition-all active:scale-95"
      >
        Access My Team Roster
      </button>
    </div>
  )

  return (
    <div className="h-screen bg-[#070b14] text-slate-100 font-sans flex flex-col relative overflow-hidden">
      
      {/* Background Neon Blurred Blobs */}
      <div aria-hidden className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-gradient-to-br from-cyan-500/5 to-transparent blur-[80px]" />
        <div className="absolute bottom-0 left-0 w-[450px] h-[450px] rounded-full bg-gradient-to-tr from-blue-500/5 to-transparent blur-[90px]" />
      </div>

      {/* HEADER PANEL */}
      <header className="bg-[#0b1324]/80 backdrop-blur-xl border-b border-white/[0.04] px-5 py-4 flex items-center justify-between flex-shrink-0 relative z-10">
        <div className="flex items-center gap-4 min-w-0">
          <button 
            onClick={() => navigate('/student/dashboard')} 
            className="w-9 h-9 bg-white/[0.02] border border-white/5 hover:border-white/10 text-slate-400 hover:text-white rounded-xl flex items-center justify-center text-sm transition-all active:scale-95"
          >
            ←
          </button>
          
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 via-blue-500 to-indigo-500 flex items-center justify-center text-lg shadow-md shadow-cyan-500/10">
            💬
          </div>
          
          <div className="overflow-hidden">
            <h1 className="font-extrabold text-sm sm:text-base text-white tracking-tight truncate">{team.name}</h1>
            <p className="text-[10px] font-bold text-cyan-400 tracking-wider uppercase mt-0.5">{team.members?.length || 0} Synced Nodes</p>
          </div>
        </div>

        {/* Online Sync Roster */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <div className="items-center -space-x-2.5 hidden sm:flex">
            {team.members?.slice(0, 4).map((m, i) => {
              const name = m.user?.name || 'User'
              const idx = getMemberIndex(name)
              return (
                <div 
                  key={i} 
                  title={name} 
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-white text-[10px] font-black border-2 border-[#070b14] shadow-md bg-gradient-to-br ${MEMBER_BGS[idx]} to-slate-800`}
                >
                  {name.charAt(0).toUpperCase()}
                </div>
              )
            })}
          </div>
          {team.members?.length > 4 && (
            <span className="text-[10px] font-extrabold bg-white/[0.03] border border-white/5 px-2 py-1 rounded-md text-slate-500">
              +{team.members.length - 4}
            </span>
          )}
        </div>
      </header>

      {/* MAIN STREAM SPACE */}
      <main className="flex-1 overflow-y-auto px-5 py-6 flex flex-col gap-5 relative z-10 scrollbar-thin">
        {messages.length === 0 && (
          <div className="text-center my-auto flex flex-col items-center justify-center gap-3">
            <div className="text-5xl opacity-20 animate-pulse">📡</div>
            <div className="max-w-xs">
              <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest">Secure Broadcast Channel</h3>
              <p className="text-[11px] text-slate-500 font-semibold leading-relaxed mt-1">
                Zero log artifacts streaming in terminal. Enter a transmission query below to message teammates.
              </p>
            </div>
          </div>
        )}

        {/* Message Compilations */}
        {messages.map((msg, i) => {
          const isMe = msg.senderId === user._id
          const idx = getMemberIndex(msg.senderName)
          const showAvatar = i === 0 || messages[i - 1]?.senderId !== msg.senderId

          return (
            <div 
              key={msg.id || i} 
              className={`flex items-end gap-3 max-w-full sm:max-w-3xl animate-fadeUp ${isMe ? 'self-end flex-row-reverse' : 'self-start'}`}
            >
              {!isMe ? (
                showAvatar ? (
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-black flex-shrink-0 shadow-md border border-white/5 bg-gradient-to-br ${MEMBER_BGS[idx]} to-slate-900`}>
                    {msg.senderName?.charAt(0).toUpperCase()}
                  </div>
                ) : (
                  <div className="w-8 flex-shrink-0" />
                )
              ) : null}

              <div className="flex flex-col max-w-[82%] sm:max-w-md">
                {showAvatar && !isMe && (
                  <span className={`text-[11px] font-bold tracking-tight mb-1 ml-1 ${MEMBER_COLORS[idx]}`}>
                    {msg.senderName}
                  </span>
                )}
                
                <div 
                  className={`px-4 py-3 text-sm font-medium tracking-normal leading-relaxed break-words border ${
                    isMe 
                      ? 'bg-gradient-to-br from-cyan-400 to-blue-500 text-[#070b14] border-cyan-400/20 rounded-[18px] rounded-br-[4px] font-semibold shadow-lg shadow-cyan-500/5' 
                      : 'bg-[#0f172a]/90 text-slate-200 border-white/[0.04] rounded-[18px] rounded-bl-[4px]'
                  }`}
                >
                  {msg.text}
                </div>
                
                <span className={`text-[9px] font-bold text-slate-500 mt-1 tracking-wider px-1 ${isMe ? 'text-right' : 'text-left'}`}>
                  {formatTime(msg.time)}
                </span>
              </div>
            </div>
          )
        })}

        {/* Typing Indicators */}
        {typing && (
          <div className="flex items-center gap-3 self-start pl-11 animate-pulse">
            <span className="text-[11px] font-bold tracking-wide text-cyan-400/80 uppercase">{typing} logging input</span>
            <div className="flex items-center gap-1 h-3">
              <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce [animation-delay:-0.3s]" />
              <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce [animation-delay:-0.15s]" />
              <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce" />
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </main>

      {/* FOOTER CONTROLS */}
      <footer className="bg-[#0b1324]/90 backdrop-blur-xl border-t border-white/[0.04] p-4 sm:p-5 flex-shrink-0 relative z-10">
        <form onSubmit={sendMessage} className="flex items-center gap-3 max-w-7xl mx-auto">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleTyping}
            placeholder="Type your secure terminal transmission message..."
            className="flex-1 bg-white/[0.03] border border-white/5 focus:border-cyan-500/30 rounded-xl px-4 py-3.5 text-sm text-slate-200 placeholder-slate-600 font-medium outline-none transition-all focus:shadow-xl focus:shadow-black/20"
          />
          <button 
            type="submit" 
            disabled={!input.trim()} 
            className={`w-12 h-12 rounded-xl text-lg font-black flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
              input.trim() 
                ? 'bg-gradient-to-br from-cyan-400 to-blue-500 text-[#070b14] cursor-pointer shadow-lg shadow-cyan-400/10 active:scale-95' 
                : 'bg-white/[0.02] border border-white/5 text-slate-600 cursor-not-allowed'
            }`}
          >
            ↑
          </button>
        </form>
      </footer>
    </div>
  )
}