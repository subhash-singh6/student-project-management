// frontend/src/pages/student/TeamChat.jsx

import { useEffect, useRef, useState } from "react";
import { 
  MessageSquare, Send, ArrowLeft, Plus, Users, 
  Clock, CornerDownLeft 
} from "lucide-react";
import API from "../../api/axios";
import { socket } from "../../socket";
import { useAuth } from "../../constants/context/AuthContext";
import DashboardLayout from "../../layouts/DashboardLayout";

export default function TeamChat() {
  const { user } = useAuth();
  const [team, setTeam] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const [typing, setTyping] = useState("");
  const bottomRef = useRef(null);
  const typingTimeout = useRef(null);

  useEffect(() => { fetchMyTeam(); }, []);

  const fetchMyTeam = async () => {
    try {
      const res = await API.get("/teams/my-team");
      setTeam(res.data.team);
      if (res.data.team?._id) fetchMessages(res.data.team._id);
      else setLoading(false);
    } catch (err) { setLoading(false); }
  };

  const fetchMessages = async (teamId) => {
    try {
      const res = await API.get(`/messages/team/${teamId}`);
      setMessages(res.data.messages || []);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  useEffect(() => {
    if (!team || !user) return;
    socket.connect();
    socket.emit("join-room", team._id);
    socket.off("receive-message");
    socket.off("user-typing");

    socket.on("receive-message", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    socket.on("user-typing", (data) => {
      if (data.userId !== user._id) {
        setTyping(`${data.name} is typing...`);
        clearTimeout(typingTimeout.current);
        typingTimeout.current = setTimeout(() => setTyping(""), 2000);
      }
    });

    return () => {
      socket.off("receive-message");
      socket.off("user-typing");
    };
  }, [team, user]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  const sendMessage = () => {
    if (!text.trim() || !team) return;
    socket.emit("send-message", {
      roomId: team._id,
      teamId: team._id,
      senderId: user._id,
      senderName: user.name,
      text,
      createdAt: new Date(),
    });
    setText("");
  };

  const handleTyping = (e) => {
    setText(e.target.value);
    socket.emit("typing", { roomId: team._id, name: user.name, userId: user._id });
  };

  if (loading) return <DashboardLayout title="Team Chat"><div className="h-[70vh] flex items-center justify-center text-slate-500">Loading chat...</div></DashboardLayout>;

  if (!team) return (
    <DashboardLayout title="Team Chat" subtitle="No active team">
      <div className="h-[70vh] flex flex-col items-center justify-center text-center p-6">
        <div className="text-indigo-500 mb-5 opacity-50"><MessageSquare size={64} strokeWidth={1} /></div>
        <h2 className="text-xl font-medium text-white">No Team Found</h2>
        <p className="text-slate-500 text-sm mt-2">Create or join a team to start collaborating.</p>
        <div className="flex gap-3 mt-8">
          <button onClick={() => navigate("/student/dashboard")} className="px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-slate-300 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition">
            Back to Dashboard
          </button>
          <button onClick={async () => { try { await API.post("/teams", { name: `${user.name}'s Team`, description: "Workspace" }); window.location.reload(); } catch (err) { alert("Failed"); } }} className="px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition flex items-center gap-2">
            <Plus size={14} /> Create Team
          </button>
        </div>
      </div>
    </DashboardLayout>
  );

  return (
    <DashboardLayout title="Team Chat" subtitle="Collaboration space" portalLabel="Internal">
      <div className="h-[80vh] flex flex-col bg-[#0B1220] border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
        <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
          <div>
            <h2 className="text-white font-medium flex items-center gap-2"><MessageSquare size={18} className="text-indigo-400" /> {team.name}</h2>
            <p className="text-slate-500 text-[10px] uppercase tracking-widest flex items-center gap-1 mt-1"><Users size={12} /> {team.members?.length || 0} Members</p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.length === 0 && <div className="h-full flex items-center justify-center text-slate-600 text-sm italic">Start the conversation...</div>}
          {messages.map((msg, i) => {
            const isMine = msg.sender?._id === user._id || msg.senderId === user._id;
            return (
              <div key={i} className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[70%] px-4 py-2.5 rounded-2xl text-sm ${isMine ? "bg-indigo-600 text-white" : "bg-white/5 border border-white/10 text-slate-200"}`}>
                  {!isMine && <p className="text-[10px] font-bold mb-1 text-cyan-400">{msg.sender?.name || msg.senderName}</p>}
                  <p className="leading-relaxed">{msg.text}</p>
                  <p className="text-[9px] opacity-50 mt-1 flex items-center gap-1"><Clock size={9} /> {new Date(msg.createdAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                </div>
              </div>
            );
          })}
          {typing && <p className="text-[11px] text-indigo-400 italic px-2">{typing}</p>}
          <div ref={bottomRef} />
        </div>

        <div className="p-4 border-t border-white/5 bg-[#080d17] flex gap-3">
          <input
            value={text}
            onChange={handleTyping}
            onKeyDown={(e) => { if (e.key === "Enter") sendMessage(); }}
            placeholder="Type your message..."
            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 outline-none focus:border-indigo-500/50"
          />
          <button onClick={sendMessage} className="bg-indigo-600 hover:bg-indigo-700 px-6 rounded-xl text-white transition-all flex items-center gap-2">
            <Send size={16} /> <span className="hidden md:inline text-xs font-medium">Send</span>
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
}