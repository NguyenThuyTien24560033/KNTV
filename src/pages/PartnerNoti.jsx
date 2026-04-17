/**
 * 1. Khởi tạo State: Quản lý danh sách thông báo, trạng thái đóng/mở form, dữ liệu form và các trạng thái loading.
 * 2. Fetch Data (useEffect): 
 * - Kiểm tra ID người dùng từ LocalStorage.
 * - Gọi API lấy toàn bộ thông báo, lọc theo partnerId
 * 3. Xử lý Form: Cập nhật liên tục dữ liệu người dùng nhập vào state `formData`.
 * 4. Gửi Dữ liệu (handleSubmit):
 * - Đóng gói dữ liệu form + partnerId + thời gian tạo.
 * - POST lên server -> Nếu thành công, cập nhật trực tiếp vào danh sách hiển thị (UI) mà không cần reload trang.
 * 5. Xóa Dữ liệu (handleDelete): Gọi API DELETE và lọc bỏ thông báo đó khỏi state hiện tại.
 */


import { useState, useEffect } from "react";
import { Toaster, toast } from "sonner";
import { Bell, Plus, Trash2, Calendar, Clock, X } from "lucide-react";
import "./PartnerNoti.css";

const API_BASE = "http://localhost:3001";

const PartnerNoti = () => {
  //state
  const [notifications, setNotifications] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form 
  const [formData, setFormData] = useState({
    title: "",
    message: "",
    type: "info",
    date: "",
    time: ""
  });

  useEffect(() => {
  const fetchNotifications = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));

      if (!user?.id) {
        toast.error("Access denied. Please log in!");
        setLoading(false);
        return;
      }

      const partnerId = String(user.id);

      const res = await fetch(`${API_BASE}/notifications`);
      if (!res.ok) throw new Error("Failed to fetch notifications");

      const all = await res.json();

      const filtered = all
        .filter((n) => String(n.partnerId) === partnerId)
        .sort((a, b) => b.id - a.id); 

      setNotifications(filtered);

    } catch (error) {
      console.error("Fetch error:", error);
      toast.error("Could not load notifications from server.");
    } finally {
      setLoading(false);
    }
  };

  fetchNotifications();
}, []); 

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user?.id) {
      toast.error("Session expired. Please log in again.");
      return;
    }

    setSaving(true);

    const newNotification = {
      ...formData,
      partnerId: String(user.id),
      createdAt: new Date().toISOString(),
      isRead: false
    };

    try {
      const res = await fetch(`${API_BASE}/notifications`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newNotification)
      });

      if (!res.ok) throw new Error("Server error during save.");

      const savedNoti = await res.json();

      
      setNotifications([savedNoti, ...notifications]);

      
      setShowForm(false);
      setFormData({ title: "", message: "", type: "info", date: "", time: "" });
      toast.success("Notification published successfully!");
    } catch (error) {
      console.error("Save failed:", error);
      toast.error("Failed to post notification.");
    } finally {
      setSaving(false);
    }
  };

  
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this notification?")) return;

    try {
      const res = await fetch(`${API_BASE}/notifications/${id}`, {
        method: "DELETE"
      });

      if (res.ok) {
        setNotifications(notifications.filter((n) => n.id !== id));
        toast.success("Notification deleted.");
      } else {
        throw new Error("Delete failed.");
      }
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Could not delete the notification.");
    }
  };

  if (loading) return <div className="loading">Loading notifications...</div>;

  return (
    <div className="notifications-container">
      <Toaster position="top-center" richColors />

      <div className="notifications-header">
        <div>
          <h1>Notifications</h1>
          <p>Manage announcements for your customers</p>
        </div>
        <button
          className={`add-btn ${showForm ? "cancel" : ""}`}
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? <X size={20} /> : <Plus size={20} />}
          {showForm ? "Cancel" : "New Notification"}
        </button>
      </div>

     
      {showForm && (
        <div className="notification-form-card">
          <h3>Create Announcement</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                placeholder="e.g., Weekend Special Discount"
              />
            </div>

            <div className="form-group">
              <label>Message Content</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                required
                rows={4}
                placeholder="Details of your announcement..."
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Type</label>
                <select name="type" value={formData.type} onChange={handleInputChange}>
                  <option value="info">Information</option>
                  <option value="warning">Warning</option>
                </select>
              </div>

              <div className="form-group">
                <label>Display Date</label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label>Display Time</label>
                <input
                  type="time"
                  name="time"
                  value={formData.time}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <button type="submit" className="submit-btn" disabled={saving}>
              {saving ? (
                "Saving..."
              ) : (
                <>
                  <Bell size={20} /> Publish Now
                </>
              )}
            </button>
          </form>
        </div>
      )}

      {/* NOTIFICATION LIST */}
      <div className="notifications-list">
        <h3>Published History ({notifications.length})</h3>

        {notifications.length === 0 ? (
          <div className="empty-state">
            <p>No notifications found. Create your first one!</p>
          </div>
        ) : (
          notifications.map((noti) => (
            <div key={noti.id} className={`notification-card ${noti.type}`}>
              <div className="notification-icon">
                <Bell size={24} />
              </div>
              <div className="notification-content">
                <div className="notification-title">{noti.title}</div>
                <div className="notification-message">{noti.message}</div>
                <div className="notification-meta">
                  {noti.date && (
                    <span className="time-info">
                      <Calendar size={14} /> {noti.date} • <Clock size={14} /> {noti.time}
                    </span>
                  )}
                  <span className={`type-badge ${noti.type}`}>
                    {noti.type.charAt(0).toUpperCase() + noti.type.slice(1)}
                  </span>
                </div>
              </div>
              <button
                className="delete-btn"
                onClick={() => handleDelete(noti.id)}
                title="Delete notification"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default PartnerNoti;