// // /**
// //  * 1. Khởi tạo State: Quản lý danh sách thông báo, trạng thái đóng/mở form, dữ liệu form và các trạng thái loading.
// //  * 2. Fetch Data (useEffect): 
// //  * - Kiểm tra ID người dùng từ LocalStorage.
// //  * - Gọi API lấy toàn bộ thông báo, lọc theo partnerId
// //  * 3. Xử lý Form: Cập nhật liên tục dữ liệu người dùng nhập vào state `formData`.
// //  * 4. Gửi Dữ liệu (handleSubmit):
// //  * - Đóng gói dữ liệu form + partnerId + thời gian tạo.
// //  * - POST lên server -> Nếu thành công, cập nhật trực tiếp vào danh sách hiển thị (UI) mà không cần reload trang.
// //  * 5. Xóa Dữ liệu (handleDelete): Gọi API DELETE và lọc bỏ thông báo đó khỏi state hiện tại.
// //  */

// import { useState } from "react";
// import { Toaster, toast } from "sonner";
// import { Bell, Plus, Trash2, Calendar, Clock, X } from "lucide-react";
// import "./PartnerNoti.css";

// const API_BASE = import.meta.env.VITE_Partner_Noti;
// // "http://localhost:3001";

// // Nhận data và onRefresh từ Layout
// const PartnerNoti = ({ data, onRefresh }) => {
//   const [showForm, setShowForm] = useState(false);
//   const [saving, setSaving] = useState(false);

//   const [formData, setFormData] = useState({
//     title: "",
//     message: "",
//     type: "info",
//     date: "",
//     time: ""
//   });

//   const notifications = data || [];

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const user = JSON.parse(localStorage.getItem("user"));

//     if (!user?.id) {
//       toast.error("Session expired. Please log in again.");
//       return;
//     }

//     setSaving(true);

//     const newNotification = {
//       ...formData,
//       partnerId: String(user.id),
//       createdAt: new Date().toISOString(),
//       isRead: false
//     };

//     try {
//       const res = await fetch(`${API_BASE}`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(newNotification)
//       });

//       if (!res.ok) throw new Error("Server error during save.");

//       // Cập nhật lại data tổng ở Layout
//       await onRefresh();
      
//       setShowForm(false);
//       setFormData({ title: "", message: "", type: "info", date: "", time: "" });
//       toast.success("Notification published successfully!");
//     } catch (error) {
//       console.error("Save failed:", error);
//       toast.error("Failed to post notification.");
//     } finally {
//       setSaving(false);
//     }
//   };

//   const handleDelete = async (id) => {
//     if (!window.confirm("Are you sure you want to delete this notification?")) return;

//     try {
//       const res = await fetch(`${API_BASE}${id}`, {
//         method: "DELETE"
//       });

//       if (res.ok) {
//         await onRefresh(); // Cập nhật lại data tổng ở Layout
//         toast.success("Notification deleted.");
//       } else {
//         throw new Error("Delete failed.");
//       }
//     } catch (error) {
//       console.error("Delete error:", error);
//       toast.error("Could not delete the notification.");
//     }
//   };

//   return (
//     <div className="notifications-container">
//       {/* Để Toaster ở đây để toast vẫn hoạt động bình thường */}
//       <Toaster position="top-center" richColors />

//       <div className="notifications-header">
//         <div>
//           <h1>Notifications</h1>
//           <p>Manage announcements for your customers</p>
//         </div>
//         <button
//           className={`add-btn ${showForm ? "cancel" : ""}`}
//           onClick={() => setShowForm(!showForm)}
//         >
//           {showForm ? <X size={20} /> : <Plus size={20} />}
//           {showForm ? "Cancel" : "New Notification"}
//         </button>
//       </div>

//       {showForm && (
//         <div className="notification-form-card">
//           <h3>Create Announcement</h3>
//           <form onSubmit={handleSubmit}>
//             <div className="form-group">
//               <label>Title</label>
//               <input
//                 type="text"
//                 name="title"
//                 value={formData.title}
//                 onChange={handleInputChange}
//                 required
//                 placeholder="e.g., Weekend Special Discount"
//               />
//             </div>

//             <div className="form-group">
//               <label>Message Content</label>
//               <textarea
//                 name="message"
//                 value={formData.message}
//                 onChange={handleInputChange}
//                 required
//                 rows={4}
//                 placeholder="Details of your announcement..."
//               />
//             </div>

//             <div className="form-row">
//               <div className="form-group">
//                 <label>Type</label>
//                 <select name="type" value={formData.type} onChange={handleInputChange}>
//                   <option value="info">Information</option>
//                   <option value="warning">Warning</option>
//                 </select>
//               </div>

//               <div className="form-group">
//                 <label>Display Date</label>
//                 <input type="date" name="date" value={formData.date} onChange={handleInputChange} />
//               </div>

//               <div className="form-group">
//                 <label>Display Time</label>
//                 <input type="time" name="time" value={formData.time} onChange={handleInputChange} />
//               </div>
//             </div>

//             <button type="submit" className="submit-btn" disabled={saving}>
//               {saving ? "Saving..." : <><Bell size={20} /> Publish Now</>}
//             </button>
//           </form>
//         </div>
//       )}

//       <div className="notifications-list">
//         <h3>Published History ({notifications.length})</h3>

//         {notifications.length === 0 ? (
//           <div className="empty-state">
//             <p>No notifications found. Create your first one!</p>
//           </div>
//         ) : (
//           notifications.map((noti) => (
//             <div key={noti.id} className={`notification-card ${noti.type}`}>
//               <div className="notification-icon">
//                 <Bell size={24} />
//               </div>
//               <div className="notification-content">
//                 <div className="notification-title">{noti.title}</div>
//                 <div className="notification-message">{noti.message}</div>
//                 <div className="notification-meta">
//                   {noti.date && (
//                     <span className="time-info">
//                       <Calendar size={14} /> {noti.date} • <Clock size={14} /> {noti.time}
//                     </span>
//                   )}
//                   <span className={`type-badge ${noti.type}`}>
//                     {noti.type.charAt(0).toUpperCase() + noti.type.slice(1)}
//                   </span>
//                 </div>
//               </div>
//               <button className="delete-btn" onClick={() => handleDelete(noti.id)}>
//                 <Trash2 size={18} />
//               </button>
//             </div>
//           ))
//         )}
//       </div>
//     </div>
//   );
// };

// export default PartnerNoti;




// import { useState } from "react";
// import { Toaster, toast } from "sonner";
// import { Bell, Plus, Trash2, Calendar, Clock, X, Edit2, Save } from "lucide-react";
// import "./PartnerNoti.css";

// const PartnerNoti = ({ data, onRefresh }) => {
//   const [showForm, setShowForm] = useState(false);
//   const [editingItem, setEditingItem] = useState(null);
//   const [saving, setSaving] = useState(false);

//   const [formData, setFormData] = useState({
//     title: "",
//     message: "",
//     type: "info",
//     date: "",
//     time: ""
//   });

//   const notifications = data || [];
//   const notiUrl = import.meta.env.VITE_Partner_Noti;

//   const resetForm = () => {
//     setFormData({ title: "", message: "", type: "info", date: "", time: "" });
//     setEditingItem(null);
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleEdit = (noti) => {
//     setEditingItem(noti);
//     setFormData({
//       title: noti.title,
//       message: noti.message,
//       type: noti.type || "info",
//       date: noti.date || "",
//       time: noti.time || ""
//     });
//     setShowForm(true);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const user = JSON.parse(localStorage.getItem("user"));

//     if (!user?.id) {
//       toast.error("Session expired. Please log in again.");
//       return;
//     }

//     setSaving(true);

//     const payload = {
//       ...formData,
//       partnerId: String(user.id),
//       updatedAt: new Date().toISOString(),
//       isRead: false
//     };

//     try {
//       let res;
//       if (editingItem) {
//         // CẬP NHẬT (PATCH)
//         res = await fetch(`${notiUrl}${editingItem.id}`, {
//           method: "PATCH",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify(payload)
//         });
//       } else {
//         // THÊM MỚI (POST)
//         res = await fetch(notiUrl, {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ ...payload, createdAt: new Date().toISOString() })
//         });
//       }

//       if (!res.ok) throw new Error("Server error");

//       await onRefresh(true);
//       setShowForm(false);
//       resetForm();
//       toast.success(editingItem ? "Updated successfully!" : "Published successfully!");
//     } catch (error) {
//       console.error("Save failed:", error);
//       toast.error("Failed to save notification.");
//     } finally {
//       setSaving(false);
//     }
//   };

//   const handleDelete = async (id) => {
//     if (!window.confirm("Are you sure you want to delete this notification?")) return;

//     try {
//       const res = await fetch(`${notiUrl}${id}`, { method: "DELETE" });
//       if (res.ok) {
//         await onRefresh(true);
//         toast.success("Notification deleted.");
//       }
//     } catch (error) {
//       console.error("Delete error:", error);
//       toast.error("Could not delete.");
//     }
//   };

//   return (
//     <div className="notifications-container">
//       <Toaster position="top-center" richColors />

//       <div className="notifications-header">
//         <div>
//           <h1>Notifications</h1>
//           <p>Manage announcements for your customers</p>
//         </div>
//         <button
//           className={`add-btn ${showForm && !editingItem ? "cancel" : ""}`}
//           onClick={() => {
//             if (showForm) {
//               setShowForm(false);
//               resetForm();
//             } else {
//               setShowForm(true);
//             }
//           }}
//         >
//           {showForm && !editingItem ? <X size={20} /> : <Plus size={20} />}
//           {showForm && !editingItem ? "Cancel" : "New Notification"}
//         </button>
//       </div>

//       {showForm && (
//         <div className="notification-form-card">
//           <div className="form-header">
//             <h3>{editingItem ? "Edit Announcement" : "Create Announcement"}</h3>
//             {editingItem && (
//                 <button className="close-btn" onClick={() => {setShowForm(false); resetForm();}}>
//                     <X size={18}/>
//                 </button>
//             )}
//           </div>
          
//           <form onSubmit={handleSubmit}>
//             <div className="form-group">
//               <label>Title</label>
//               <input
//                 type="text"
//                 name="title"
//                 value={formData.title}
//                 onChange={handleInputChange}
//                 required
//                 placeholder="e.g., Weekend Special Discount"
//               />
//             </div>

//             <div className="form-group">
//               <label>Message Content</label>
//               <textarea
//                 name="message"
//                 value={formData.message}
//                 onChange={handleInputChange}
//                 required
//                 rows={4}
//                 placeholder="Details of your announcement..."
//               />
//             </div>

//             <div className="form-row">
//               <div className="form-group">
//                 <label>Type</label>
//                 <select name="type" value={formData.type} onChange={handleInputChange}>
//                   <option value="info">Information</option>
//                   <option value="warning">Warning</option>
//                   <option value="success">Promotion</option>
//                 </select>
//               </div>

//               <div className="form-group">
//                 <label>Display Date</label>
//                 <input type="date" name="date" value={formData.date} onChange={handleInputChange} />
//               </div>

//               <div className="form-group">
//                 <label>Display Time</label>
//                 <input type="time" name="time" value={formData.time} onChange={handleInputChange} />
//               </div>
//             </div>

//             <button type="submit" className="submit-btn" disabled={saving}>
//               {saving ? "Saving..." : (
//                 <>{editingItem ? <Save size={20} /> : <Bell size={20} />} {editingItem ? "Update Now" : "Publish Now"}</>
//               )}
//             </button>
//           </form>
//         </div>
//       )}

//       <div className="notifications-list">
//         <h3>Published History ({notifications.length})</h3>

//         {notifications.length === 0 ? (
//           <div className="empty-state">
//             <p>No notifications found. Create your first one!</p>
//           </div>
//         ) : (
//           notifications.map((noti) => (
//             <div key={noti.id} className={`notification-card ${noti.type}`}>
//               <div className="notification-icon">
//                 <Bell size={24} />
//               </div>
//               <div className="notification-content">
//                 <div className="notification-title">{noti.title}</div>
//                 <div className="notification-message">{noti.message}</div>
//                 <div className="notification-meta">
//                   {noti.date && (
//                     <span className="time-info">
//                       <Calendar size={14} /> {noti.date} • <Clock size={14} /> {noti.time}
//                     </span>
//                   )}
//                   <span className={`type-badge ${noti.type}`}>
//                     {noti.type}
//                   </span>
//                 </div>
//               </div>
//               <div className="notification-actions">
//                 <button className="edit-btn-small" onClick={() => handleEdit(noti)}>
//                   <Edit2 size={18} />
//                 </button>
//                 <button className="delete-btn-small" onClick={() => handleDelete(noti.id)}>
//                   <Trash2 size={18} />
//                 </button>
//               </div>
//             </div>
//           ))
//         )}
//       </div>
//     </div>
//   );
// };

// export default PartnerNoti;



import { useState } from "react";
import { Plus, Edit2, Trash2, Save, X, Bell } from "lucide-react";
import "./PartnerNoti.css";

const PartnerNoti = ({ data, placeId, onRefresh }) => {
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    message: "",
    type: "info",
    date: "",
    time: ""
  });

  // Dữ liệu từ bảng notifications riêng biệt
  const notifications = data || [];

  const resetForm = () => {
    setFormData({ title: "", message: "", type: "info", date: "", time: "" });
    setEditingItem(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!placeId) return alert("Location chưa được xác định!");

    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const partnerId = String(user?.id);
      const notiUrl = import.meta.env.VITE_Partner_Noti; // endpoint bảng notifications

      console.log(">>> [Noti] Target URL:", notiUrl);

      // ✅ Chuẩn hóa Payload y hệt PartnerMenu (có locationId)
      const payload = {
        ...formData,
        locationId: String(placeId),
        partnerId: String(partnerId),
        updatedAt: new Date().toISOString()
      };

      let res;
      if (editingItem) {
        // Cập nhật thông báo cũ
        res = await fetch(`${notiUrl}/${editingItem.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
      } else {
        // Thêm thông báo mới
        res = await fetch(notiUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            ...payload, 
            createdAt: new Date().toISOString(),
            isRead: false 
          })
        });
      }

      console.log(">>> [Noti] Submit Status:", res.status);

      if (res.ok) {
        await onRefresh(true); // Gọi Layout fetch lại để cập nhật danh sách
        setShowForm(false);
        resetForm();
        alert(editingItem ? "Cập nhật thành công!" : "Đăng thông báo thành công!");
      }
    } catch (error) {
      console.error(">>> [Noti] Error:", error);
      alert("Lỗi khi lưu thông báo!");
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      message: item.message,
      type: item.type || "info",
      date: item.date || "",
      time: item.time || ""
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn chắc chắn muốn xóa thông báo này?")) return;
    try {
      const notiUrl = import.meta.env.VITE_Partner_Noti;
      const res = await fetch(`${notiUrl}/${id}`, { method: "DELETE" });
      if (res.ok) {
        await onRefresh(true);
        alert("Xóa thành công!");
      }
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  return (
    <div className="noti-management-container">
      <div className="menu-header">
        <h1>Announcements</h1>
        <button className="add-btn" onClick={() => { resetForm(); setShowForm(true); }}>
          <Plus size={20} /> New notification
        </button>
      </div>

      {showForm && (
        <div className="menu-form-container">
          <form onSubmit={handleSubmit} className="menu-form">
            <div className="form-title">
              {editingItem ? "Edit Notification" : "New Notification"}
              <button type="button" className="close-form" onClick={() => { setShowForm(false); resetForm(); }}>
                <X size={20} />
              </button>
            </div>

            <div className="form-grid">
              <div className="form-group full">
                <label>Title</label>
                <input type="text" name="title" value={formData.title} onChange={handleInputChange} required />
              </div>
              <div className="form-group full">
                <label>Message Content</label>
                <textarea name="message" value={formData.message} onChange={handleInputChange} required rows={3} />
              </div>
              <div className="form-group">
                <label>Type</label>
                <select name="type" value={formData.type} onChange={handleInputChange}>
                  <option value="info">Information</option>
                  <option value="success">Promotion</option>
                  <option value="warning">Alert</option>
                </select>
              </div>
              <div className="form-group">
                <label>Date</label>
                <input type="date" name="date" value={formData.date} onChange={handleInputChange} />
              </div>
            </div>

            <button type="submit" className="submit-btn">
              <Save size={20} /> {editingItem ? "Update Now" : "Post Now"}
            </button>
          </form>
        </div>
      )}

      <div className="menu-list">
        {notifications.length === 0 ? (
          <p className="no-items">Không có thông báo nào.</p>
        ) : (
          notifications.map((noti) => (
            <div key={noti.id} className={`menu-item-card noti-card ${noti.type}`}>
              <div className="menu-item-info">
                <div className="noti-title-row">
                  <Bell size={16} />
                  <h3>{noti.title}</h3>
                </div>
                <p className="description">{noti.message}</p>
                <div className="noti-meta">
                  <span className="category">{noti.type}</span>
                  {noti.date && <span className="date-tag">{noti.date}</span>}
                </div>
              </div>
              <div className="menu-item-actions">
                <button className="edit-btn-small" onClick={() => handleEdit(noti)}>
                  <Edit2 size={18} />
                </button>
                <button className="delete-btn-small" onClick={() => handleDelete(noti.id)}>
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default PartnerNoti;