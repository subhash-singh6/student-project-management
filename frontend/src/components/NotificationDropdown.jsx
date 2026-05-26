import { useEffect, useState } from "react";
import { notificationService } from "../services/notificationService";
import toast from "react-hot-toast";
import { FiX, FiBell } from "react-icons/fi"; // Added Icons

export default function NotificationDropdown({ open, setOpen }) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (open) {
      fetchNotifications();
    }
  }, [open]);

  const fetchNotifications = async () => {
    try {
      const data = await notificationService.getAll();
      setNotifications(data.notifications || []);
      setUnreadCount(data.unreadCount || 0);
    } catch (error) {
      toast.error("Failed to load notifications");
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
      );
      setUnreadCount((prev) => (prev > 0 ? prev - 1 : 0));
    } catch (error) {
      toast.error("Action failed");
    }
  };

  const removeNotification = async (id) => {
    try {
      await notificationService.remove(id);
      setNotifications((prev) => prev.filter((n) => n._id !== id));
      toast.success("Notification removed");
    } catch (error) {
      toast.error("Delete failed");
    }
  };

  const markAll = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (error) {
      toast.error("Action failed");
    }
  };

  if (!open) return null;

  return (
    <div className="absolute top-16 right-0 w-[370px] max-w-[95vw] bg-[#0A101F] border border-white/10 rounded-3xl shadow-2xl overflow-hidden z-50">
      
      {/* HEADER */}
      <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <FiBell className="text-blue-400" /> Notifications
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            {unreadCount} unread notifications
          </p>
        </div>
        <button
          onClick={markAll}
          className="text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors"
        >
          Mark all read
        </button>
      </div>

      {/* BODY */}
      <div className="max-h-[450px] overflow-y-auto">
        {loading ? (
          <div className="p-6 text-slate-500 text-sm">Loading notifications...</div>
        ) : notifications.length === 0 ? (
          <div className="p-6 text-slate-500 text-sm text-center">No notifications available.</div>
        ) : (
          notifications.map((n) => (
            <div
              key={n._id}
              className={`p-5 border-b border-white/5 transition-all ${
                !n.isRead ? "bg-blue-600/10" : "bg-transparent"
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div
                  onClick={() => !n.isRead && markAsRead(n._id)}
                  className="flex-1 cursor-pointer"
                >
                  <div className="text-sm font-bold text-white">{n.title}</div>
                  <div className="text-xs text-slate-400 mt-2 leading-relaxed">
                    {n.message}
                  </div>
                  <div className="text-[10px] text-slate-500 mt-3">
                    {new Date(n.createdAt).toLocaleString()}
                  </div>
                </div>
                
                {/* REMOVE BUTTON with Icon */}
                <button
                  onClick={() => removeNotification(n._id)}
                  className="text-slate-500 hover:text-red-400 transition-colors p-1"
                >
                  <FiX size={16} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}