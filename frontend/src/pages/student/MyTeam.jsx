import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/axios";
import { useAuth } from "../../constants/context/AuthContext";

export default function MyTeam() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [team, setTeam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [memberEmail, setMemberEmail] = useState("");
  const [editing, setEditing] = useState(false);
  const [editData, setEditData] = useState({ name: "", description: "", maxMembers: 5 });
  const [teamData, setTeamData] = useState({ name: "", description: "", subject: "", category: "", maxMembers: 4 });

  useEffect(() => { fetchMyTeam(); }, []);

  const fetchMyTeam = async () => {
    try { const res = await API.get("/teams/my-team"); setTeam(res.data.team); }
    catch { setTeam(null); } finally { setLoading(false); }
  };

  const handleChange = (e) => setTeamData({ ...teamData, [e.target.name]: e.target.value });

  const createTeam = async () => {
    if (!teamData.name || !teamData.description) return alert("Please fill all required fields.");
    try { const res = await API.post("/teams", teamData); setTeam(res.data.team); }
    catch (err) { alert(err.response?.data?.message || "Team creation failed"); }
  };

  const addMember = async () => {
    if (!memberEmail) return alert("Please enter student email.");
    try { await API.post(`/teams/${team._id}/add-member`, { email: memberEmail }); setMemberEmail(""); fetchMyTeam(); }
    catch (err) { alert(err.response?.data?.message || "Failed to add member"); }
  };

  const removeMember = async (userId) => {
    try { await API.delete(`/teams/${team._id}/remove-member/${userId}`); fetchMyTeam(); }
    catch (err) { alert(err.response?.data?.message || "Failed to remove member"); }
  };

  const updateTeam = async () => {
    try { const res = await API.put(`/teams/${team._id}`, editData); setTeam(res.data.team); setEditing(false); }
    catch (err) { alert(err.response?.data?.message || "Update failed"); }
  };

  const deleteTeam = async () => {
    if (!window.confirm("Are you sure you want to delete this team?")) return;
    try { await API.delete(`/teams/${team._id}`); setTeam(null); }
    catch (err) { alert(err.response?.data?.message || "Delete failed"); }
  };

  const leaveTeam = async () => {
    if (!window.confirm("Leave this team?")) return;
    try { await API.put(`/teams/${team._id}/leave`); setTeam(null); }
    catch (err) { alert(err.response?.data?.message || "Leave failed"); }
  };

  if (loading) return <div className="min-h-screen bg-[#060A12] flex items-center justify-center text-white">Loading...</div>;

  if (!team) return (
    <div className="min-h-screen bg-[#060A12] text-white p-6 md:p-10">
      <div className="flex items-start gap-4 mb-8">
        <button onClick={() => navigate("/student/dashboard")} className="mt-1 px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition text-sm">←</button>
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">Team Management</h1>
          <p className="text-slate-500 text-sm mt-1">Manage your team and collaborate with members.</p>
        </div>
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="bg-[#0B1220] border border-white/5 rounded-[32px] p-6">
          <h2 className="text-xl font-semibold mb-2">{user?.name}</h2>
          <p className="text-indigo-400 text-sm mb-6">Team Leader</p>
          <div className="space-y-4 text-sm"><p>📧 {user?.email}</p><p>🎓 Semester: {user?.semester || "N/A"}</p><p>🏫 Branch: {user?.branch || "N/A"}</p></div>
        </div>
        <div className="xl:col-span-2 bg-[#0B1220] border border-white/5 rounded-[32px] p-6 md:p-8">
          <h2 className="text-2xl font-semibold mb-6">Create New Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <input type="text" name="name" value={teamData.name} onChange={handleChange} placeholder="Team Name" className="bg-[#111827] border border-white/10 rounded-2xl px-4 py-3.5 outline-none" />
            <input type="text" name="subject" value={teamData.subject} onChange={handleChange} placeholder="Subject" className="bg-[#111827] border border-white/10 rounded-2xl px-4 py-3.5 outline-none" />
          </div>
          <textarea name="description" value={teamData.description} onChange={handleChange} placeholder="Describe your team and goals..." className="mt-5 w-full h-36 bg-[#111827] border border-white/10 rounded-2xl px-4 py-3.5 outline-none resize-none" />
          <button onClick={createTeam} className="mt-6 w-full py-4 rounded-2xl font-semibold bg-gradient-to-r from-indigo-500 to-cyan-500 hover:opacity-95 transition">🚀 Create Team</button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#060A12] text-white p-6 md:p-10">
      <div className="flex items-start justify-between gap-4 mb-6">
        <div className="flex items-start gap-4">
          <button onClick={() => navigate("/student/dashboard")} className="mt-1 px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition text-sm">←</button>
          <div><h1 className="text-2xl md:text-3xl font-semibold tracking-tight">{team.name}</h1><p className="text-slate-400 mt-1">Realtime collaboration workspace</p></div>
        </div>
        <span className="px-4 py-2 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 h-fit">Active Team</span>
      </div>

      <div className="bg-[#0B1220] border border-white/5 rounded-[32px] p-6 md:p-8 mb-8">
        <div className="flex flex-col lg:flex-row lg:justify-between gap-10">
          <div className="flex-1">
            <h2 className="text-3xl font-semibold">{user?.name}</h2>
            <p className="text-indigo-400 text-sm mt-2 capitalize">{team.members?.find((m) => m.user?._id === user?._id)?.role || "leader"}</p>
            <div className="mt-8 space-y-4 text-[15px]"><p>📧 {user?.email}</p><p>🎓 Semester: {user?.semester || "N/A"}</p><p>🏫 Branch: {user?.branch || "N/A"}</p></div>
            <div className="flex flex-wrap gap-8 mt-10 text-sm text-slate-400">
              <div className="flex items-center gap-2">👥 <span>{team.members?.length || 0} Members</span></div>
              <div className="flex items-center gap-2">📌 <span>Max: {team.maxMembers}</span></div>
            </div>
          </div>
          <div className="flex items-start gap-3 flex-wrap">
            <button onClick={() => { setEditing(true); setEditData({ name: team.name, description: team.description, maxMembers: team.maxMembers }); }} className="px-5 py-3 rounded-2xl bg-indigo-500 hover:bg-indigo-600 transition text-sm font-medium">✏️ Edit Team</button>
            {team.leader === user._id ? 
              <button onClick={deleteTeam} className="px-5 py-3 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition text-sm font-medium">🗑 Delete</button> :
              <button onClick={leaveTeam} className="px-5 py-3 rounded-2xl bg-orange-500/10 border border-orange-500/20 text-orange-400 hover:bg-orange-500/20 transition text-sm font-medium">🚪 Leave</button>
            }
          </div>
        </div>
      </div>

      {editing && (
        <div className="mb-8 bg-[#0B1220] border border-white/5 rounded-[32px] p-6">
          <h2 className="text-xl font-semibold mb-5">Edit Team</h2>
          <input value={editData.name} onChange={(e) => setEditData({ ...editData, name: e.target.value })} className="w-full bg-[#111827] border border-white/10 rounded-2xl px-4 py-3 mb-4 outline-none" />
          <textarea value={editData.description} onChange={(e) => setEditData({ ...editData, description: e.target.value })} className="w-full h-32 bg-[#111827] border border-white/10 rounded-2xl px-4 py-3 outline-none resize-none" />
          <div className="flex gap-3 mt-5"><button onClick={updateTeam} className="px-6 py-3 rounded-2xl bg-indigo-500">Save Changes</button><button onClick={() => setEditing(false)} className="px-6 py-3 rounded-2xl bg-white/5">Cancel</button></div>
        </div>
      )}

      <div className="bg-[#0B1220] border border-white/5 rounded-[32px] p-6">
        <h2 className="text-xl font-semibold mb-5">Add Team Member</h2>
        <div className="flex flex-col md:flex-row gap-3">
          <input value={memberEmail} onChange={(e) => setMemberEmail(e.target.value)} placeholder="Enter student email" className="flex-1 bg-[#111827] border border-white/10 rounded-2xl px-4 py-3.5 outline-none" />
          <button onClick={addMember} className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-500 to-cyan-500 hover:opacity-95 transition">Add Member</button>
        </div>
      </div>

      <div className="flex justify-end mt-6">
        <button onClick={() => navigate("/student/team-chat")} className="px-7 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-500 to-cyan-500 hover:opacity-95 transition text-sm font-medium">💬 Open Team Chat</button>
      </div>
    </div>
  );
}