



// // // import { useState, useEffect } from "react";
// // // import { Plus, Edit2, Trash2, Save, X, Percent } from "lucide-react";
// // // import "./PartnerDiscount.css";

// // // const API_BASE = "http://localhost:3001";

// // // const PartnerDiscount = () => {
// // //   const [discounts, setDiscounts] = useState([]); // danh sách khuyến mãi
// // //   const [loading, setLoading] = useState(true); // trạng thái loading
// // //   const [showForm, setShowForm] = useState(false); // hiển thị form
// // //   const [editingItem, setEditingItem] = useState(null); // item đang edit
// // //   const [placeId, setPlaceId] = useState(null); // id địa điểm

// // //   // Form data
// // //   const [formData, setFormData] = useState({
// // //     title: "",
// // //     description: "",
// // //     discountPercent: "",
// // //     startDate: "",
// // //     endDate: "",
// // //     code: ""   // discount code (optional)
// // //   });

// // //   useEffect(() => {
// // //     fetchDiscounts(); // load data khi mount
// // //   }, []);

// // //   const fetchDiscounts = async () => {
// // //     try {
// // //       const user = JSON.parse(localStorage.getItem("user"));
// // //       if (!user) {
// // //         alert("You are not logged in!"); // chưa đăng nhập
// // //         setLoading(false);
// // //         return;
// // //       }

// // //       // get placeId of partner
// // //       const placeRes = await fetch(`${API_BASE}/locations?partnerId=${user.id}`);
// // //       const placeData = await placeRes.json();

// // //       if (placeData.length === 0) {
// // //         alert("No location found!"); // không có địa điểm
// // //         setLoading(false);
// // //         return;
// // //       }

// // //       const currentPlaceId = placeData[0].id;
// // //       setPlaceId(currentPlaceId);

// // //       // get discounts by placeId
// // //       const discountRes = await fetch(`${API_BASE}/discounts?placeId=${currentPlaceId}`);
// // //       const discountData = await discountRes.json();
// // //       setDiscounts(discountData);
// // //     } catch (error) {
// // //       console.error("Error loading discounts:", error); // lỗi load
// // //     } finally {
// // //       setLoading(false);
// // //     }
// // //   };

// // //   const resetForm = () => {
// // //     setFormData({
// // //       title: "",
// // //       description: "",
// // //       discountPercent: "",
// // //       startDate: "",
// // //       endDate: "",
// // //       code: ""
// // //     });
// // //     setEditingItem(null); // reset edit
// // //   };

// // //   const handleInputChange = (e) => {
// // //     const { name, value } = e.target;
// // //     setFormData(prev => ({ ...prev, [name]: value })); // cập nhật input
// // //   };

// // //   const handleSubmit = async (e) => {
// // //     e.preventDefault();
// // //     if (!placeId) return alert("No location yet!"); // chưa có place

// // //     try {
// // //       const user = JSON.parse(localStorage.getItem("user"));

// // //       if (editingItem) {
// // //         // Update existing discount
// // //         await fetch(`${API_BASE}/discounts/${editingItem.id}`, {
// // //           method: "PATCH",
// // //           headers: { "Content-Type": "application/json" },
// // //           body: JSON.stringify(formData)
// // //         });
// // //       } else {
// // //         // Create new discount
// // //         await fetch(`${API_BASE}/discounts`, {
// // //           method: "POST",
// // //           headers: { "Content-Type": "application/json" },
// // //           body: JSON.stringify({
// // //             ...formData,
// // //             placeId: Number(placeId),
// // //             partnerId: String(user.id),
// // //             createdAt: new Date().toISOString()
// // //           })
// // //         });
// // //       }

// // //       fetchDiscounts();   // reload list
// // //       setShowForm(false);
// // //       resetForm();
// // //       alert(editingItem ? "Discount updated successfully!" : "New discount added successfully!");
// // //     } catch (error) {
// // //       console.error("Error:", error);
// // //       alert("Something went wrong!"); // lỗi chung
// // //     }
// // //   };

// // //   const handleEdit = (item) => {
// // //     setEditingItem(item);
// // //     setFormData({
// // //       title: item.title,
// // //       description: item.description || "",
// // //       discountPercent: item.discountPercent || "",
// // //       startDate: item.startDate || "",
// // //       endDate: item.endDate || "",
// // //       code: item.code || ""
// // //     });
// // //     setShowForm(true); // mở form edit
// // //   };

// // //   const handleDelete = async (id) => {
// // //     if (!window.confirm("Are you sure you want to delete this discount?")) return; // confirm xóa

// // //     try {
// // //       await fetch(`${API_BASE}/discounts/${id}`, { method: "DELETE" });
// // //       fetchDiscounts();
// // //       alert("Discount deleted!");
// // //     } catch (error) {
// // //       console.error("Delete error:", error); // lỗi xóa
// // //     }
// // //   };

// // //   if (loading) return <div className="loading">Loading...</div>;

// // //   return (
// // //     <div className="discount-container">
// // //       <div className="discount-header">
// // //         <h1>Discount Management</h1>
// // //         <button
// // //           className="add-btn"
// // //           onClick={() => {
// // //             resetForm();
// // //             setShowForm(true);
// // //           }}
// // //         >
// // //           <Plus size={20} />
// // //           Add New Discount
// // //         </button>
// // //       </div>

// // //       {/* Form add/edit */}
// // //       {showForm && (
// // //         <div className="discount-form-container">
// // //           <form onSubmit={handleSubmit} className="discount-form">
// // //             <div className="form-title">
// // //               {editingItem ? "Edit Discount" : "Add New Discount"}
// // //               <button type="button" className="close-form" onClick={() => { setShowForm(false); resetForm(); }}>
// // //                 <X size={20} />
// // //               </button>
// // //             </div>

// // //             <div className="form-grid">
// // //               <div className="form-group">
// // //                 <label>Discount Title</label>
// // //                 <input type="text" name="title" value={formData.title} onChange={handleInputChange} required />
// // //               </div>

// // //               <div className="form-group">
// // //                 <label>Discount Percent (%)</label>
// // //                 <input type="number" name="discountPercent" value={formData.discountPercent} onChange={handleInputChange} required />
// // //               </div>

// // //               <div className="form-group">
// // //                 <label>Start Date</label>
// // //                 <input type="date" name="startDate" value={formData.startDate} onChange={handleInputChange} />
// // //               </div>

// // //               <div className="form-group">
// // //                 <label>End Date</label>
// // //                 <input type="date" name="endDate" value={formData.endDate} onChange={handleInputChange} />
// // //               </div>

// // //               <div className="form-group">
// // //                 <label>Discount Code (optional)</label>
// // //                 <input type="text" name="code" value={formData.code} onChange={handleInputChange} placeholder="e.g. SUMMER20" />
// // //               </div>

// // //               <div className="form-group full">
// // //                 <label>Description</label>
// // //                 <textarea name="description" value={formData.description} onChange={handleInputChange} rows={4} />
// // //               </div>
// // //             </div>

// // //             <button type="submit" className="submit-btn">
// // //               <Save size={20} />
// // //               {editingItem ? "Update" : "Add Discount"}
// // //             </button>
// // //           </form>
// // //         </div>
// // //       )}

// // //       {/* Discount list */}
// // //       <div className="discount-list">
// // //         {discounts.length === 0 ? (
// // //           <p className="no-items">No discounts yet. Create one!</p>
// // //         ) : (
// // //           discounts.map((item) => (
// // //             <div key={item.id} className="discount-card">
// // //               <div className="discount-header-card">
// // //                 <Percent size={28} />
// // //                 <h3>{item.title}</h3>
// // //                 <span className="discount-percent">-{item.discountPercent}%</span>
// // //               </div>

// // //               <p className="discount-desc">{item.description}</p>

// // //               {item.code && <p className="discount-code">Code: <strong>{item.code}</strong></p>}

// // //               <div className="discount-date">
// // //                 {item.startDate && item.endDate && (
// // //                   <small>{item.startDate} → {item.endDate}</small>
// // //                 )}
// // //               </div>

// // //               <div className="discount-actions">
// // //                 <button className="edit-btn-small" onClick={() => handleEdit(item)}>
// // //                   <Edit2 size={18} />
// // //                 </button>
// // //                 <button className="delete-btn-small" onClick={() => handleDelete(item.id)}>
// // //                   <Trash2 size={18} />
// // //                 </button>
// // //               </div>
// // //             </div>
// // //           ))
// // //         )}
// // //       </div>
// // //     </div>
// // //   );
// // // };

// // // export default PartnerDiscount;



// // import { useState } from "react";
// // import { Plus, Edit2, Trash2, Save, X, Percent } from "lucide-react";
// // import "./PartnerDiscount.css";

// // const API_BASE = "http://localhost:3001";

// // // Nhận data, placeId và hàm onRefresh từ Layout cha
// // const PartnerDiscount = ({ data, placeId, onRefresh }) => {
// //   const [showForm, setShowForm] = useState(false);
// //   const [editingItem, setEditingItem] = useState(null);

// //   const [formData, setFormData] = useState({
// //     title: "",
// //     description: "",
// //     discountPercent: "",
// //     startDate: "",
// //     endDate: "",
// //     code: ""
// //   });

// //   const discounts = data || [];

// //   const resetForm = () => {
// //     setFormData({
// //       title: "",
// //       description: "",
// //       discountPercent: "",
// //       startDate: "",
// //       endDate: "",
// //       code: ""
// //     });
// //     setEditingItem(null);
// //   };

// //   const handleInputChange = (e) => {
// //     const { name, value } = e.target;
// //     setFormData(prev => ({ ...prev, [name]: value }));
// //   };

// //   const handleSubmit = async (e) => {
// //     e.preventDefault();
// //     if (!placeId) return alert("No location yet!");

// //     try {
// //       const user = JSON.parse(localStorage.getItem("user"));

// //       if (editingItem) {
// //         await fetch(`${API_BASE}/discounts/${editingItem.id}`, {
// //           method: "PATCH",
// //           headers: { "Content-Type": "application/json" },
// //           body: JSON.stringify(formData)
// //         });
// //       } else {
// //         await fetch(`${API_BASE}/discounts`, {
// //           method: "POST",
// //           headers: { "Content-Type": "application/json" },
// //           body: JSON.stringify({
// //             ...formData,
// //             placeId: Number(placeId),
// //             partnerId: String(user.id),
// //             createdAt: new Date().toISOString()
// //           })
// //         });
// //       }

// //       await onRefresh(); // Gọi Layout fetch lại toàn bộ data
// //       setShowForm(false);
// //       resetForm();
// //       alert(editingItem ? "Discount updated successfully!" : "New discount added successfully!");
// //     } catch (error) {
// //       console.error("Error:", error);
// //       alert("Something went wrong!");
// //     }
// //   };

// //   const handleEdit = (item) => {
// //     setEditingItem(item);
// //     setFormData({
// //       title: item.title,
// //       description: item.description || "",
// //       discountPercent: item.discountPercent || "",
// //       startDate: item.startDate || "",
// //       endDate: item.endDate || "",
// //       code: item.code || ""
// //     });
// //     setShowForm(true);
// //   };

// //   const handleDelete = async (id) => {
// //     if (!window.confirm("Are you sure you want to delete this discount?")) return;
// //     try {
// //       await fetch(`${API_BASE}/discounts/${id}`, { method: "DELETE" });
// //       await onRefresh(); // Báo cho Layout cập nhật lại
// //       alert("Discount deleted!");
// //     } catch (error) {
// //       console.error("Delete error:", error);
// //     }
// //   };

// //   return (
// //     <div className="discount-container">
// //       <div className="discount-header">
// //         <h1>Discount Management</h1>
// //         <button className="add-btn" onClick={() => { resetForm(); setShowForm(true); }}>
// //           <Plus size={20} /> Add New Discount
// //         </button>
// //       </div>

// //       {showForm && (
// //         <div className="discount-form-container">
// //           <form onSubmit={handleSubmit} className="discount-form">
// //             <div className="form-title">
// //               {editingItem ? "Edit Discount" : "Add New Discount"}
// //               <button type="button" className="close-form" onClick={() => { setShowForm(false); resetForm(); }}>
// //                 <X size={20} />
// //               </button>
// //             </div>

// //             <div className="form-grid">
// //               <div className="form-group">
// //                 <label>Discount Title</label>
// //                 <input type="text" name="title" value={formData.title} onChange={handleInputChange} required />
// //               </div>
// //               <div className="form-group">
// //                 <label>Discount Percent (%)</label>
// //                 <input type="number" name="discountPercent" value={formData.discountPercent} onChange={handleInputChange} required />
// //               </div>
// //               <div className="form-group">
// //                 <label>Start Date</label>
// //                 <input type="date" name="startDate" value={formData.startDate} onChange={handleInputChange} />
// //               </div>
// //               <div className="form-group">
// //                 <label>End Date</label>
// //                 <input type="date" name="endDate" value={formData.endDate} onChange={handleInputChange} />
// //               </div>
// //               <div className="form-group">
// //                 <label>Discount Code (optional)</label>
// //                 <input type="text" name="code" value={formData.code} onChange={handleInputChange} placeholder="e.g. SUMMER20" />
// //               </div>
// //               <div className="form-group full">
// //                 <label>Description</label>
// //                 <textarea name="description" value={formData.description} onChange={handleInputChange} rows={4} />
// //               </div>
// //             </div>

// //             <button type="submit" className="submit-btn">
// //               <Save size={20} /> {editingItem ? "Update" : "Add Discount"}
// //             </button>
// //           </form>
// //         </div>
// //       )}

// //       <div className="discount-list">
// //         {discounts.length === 0 ? (
// //           <p className="no-items">No discounts yet. Create one!</p>
// //         ) : (
// //           discounts.map((item) => (
// //             <div key={item.id} className="discount-card">
// //               <div className="discount-header-card">
// //                 <Percent size={28} />
// //                 <h3>{item.title}</h3>
// //                 <span className="discount-percent">-{item.discountPercent}%</span>
// //               </div>
// //               <p className="discount-desc">{item.description}</p>
// //               {item.code && <p className="discount-code">Code: <strong>{item.code}</strong></p>}
// //               <div className="discount-date">
// //                 {item.startDate && item.endDate && (
// //                   <small>{item.startDate} → {item.endDate}</small>
// //                 )}
// //               </div>
// //               <div className="discount-actions">
// //                 <button className="edit-btn-small" onClick={() => handleEdit(item)}>
// //                   <Edit2 size={18} />
// //                 </button>
// //                 <button className="delete-btn-small" onClick={() => handleDelete(item.id)}>
// //                   <Trash2 size={18} />
// //                 </button>
// //               </div>
// //             </div>
// //           ))
// //         )}
// //       </div>
// //     </div>
// //   );
// // };

// // export default PartnerDiscount;




// // import { useState } from "react";
// // import { Plus, Edit2, Trash2, Save, X, Percent } from "lucide-react";
// // import "./PartnerDiscount.css";

// // // Nhận data, placeId và hàm onRefresh từ Layout cha
// // const PartnerDiscount = ({ data, placeId, onRefresh }) => {
// //   const [showForm, setShowForm] = useState(false);
// //   const [editingItem, setEditingItem] = useState(null);
// //   const [saving, setSaving] = useState(false);

// //   // SỬA: Dùng env với giá trị dự phòng để tránh lỗi undefined
// //   const discountUrl = import.meta.env.VITE_Location_Discount;

// //   const [formData, setFormData] = useState({
// //     title: "",
// //     description: "",
// //     discountPercent: "",
// //     startDate: "",
// //     endDate: "",
// //     code: ""
// //   });

// //   const discounts = data || [];

// //   const resetForm = () => {
// //     setFormData({
// //       title: "",
// //       description: "",
// //       discountPercent: "",
// //       startDate: "",
// //       endDate: "",
// //       code: ""
// //     });
// //     setEditingItem(null);
// //   };

// //   const handleInputChange = (e) => {
// //     const { name, value } = e.target;
// //     setFormData(prev => ({ ...prev, [name]: value }));
// //   };

// //   const handleSubmit = async (e) => {
// //     e.preventDefault();
// //     if (!placeId) return alert("No location yet!");

// //     setSaving(true);
// //     try {
// //       const user = JSON.parse(localStorage.getItem("user"));
// //       const payload = {
// //         ...formData,
// //         placeId: String(placeId), // Ép kiểu string cho đồng bộ db
// //         partnerId: String(user?.id),
// //         updatedAt: new Date().toISOString()
// //       };

// //       let res;
// //       if (editingItem) {
// //         // SỬA: Dùng discountUrl từ env
// //         res = await fetch(`${discountUrl}/${editingItem.id}`, {
// //           method: "PATCH",
// //           headers: { "Content-Type": "application/json" },
// //           body: JSON.stringify(payload)
// //         });
// //       } else {
// //         // SỬA: Dùng discountUrl từ env cho POST
// //         res = await fetch(discountUrl, {
// //           method: "POST",
// //           headers: { "Content-Type": "application/json" },
// //           body: JSON.stringify({
// //             ...payload,
// //             createdAt: new Date().toISOString()
// //           })
// //         });
// //       }

// //       if (res.ok) {
// //         await onRefresh(); // Gọi Layout fetch lại toàn bộ data
// //         setShowForm(false);
// //         resetForm();
// //         alert(editingItem ? "Cập nhật mã giảm giá thành công!" : "Thêm mã giảm giá mới thành công!");
// //       } else {
// //         alert("Có lỗi xảy ra khi lưu!");
// //       }
// //     } catch (error) {
// //       console.error("Error:", error);
// //       alert("Không thể kết nối đến máy chủ!");
// //     } finally {
// //       setSaving(false);
// //     }
// //   };

// //   const handleEdit = (item) => {
// //     setEditingItem(item);
// //     setFormData({
// //       title: item.title,
// //       description: item.description || "",
// //       discountPercent: item.discountPercent || "",
// //       startDate: item.startDate || "",
// //       endDate: item.endDate || "",
// //       code: item.code || ""
// //     });
// //     setShowForm(true);
// //   };

// //   const handleDelete = async (id) => {
// //     if (!window.confirm("Bạn có chắc chắn muốn xóa mã giảm giá này không?")) return;
// //     try {
// //       // SỬA: Dùng discountUrl từ env
// //       const res = await fetch(`${discountUrl}/${id}`, { method: "DELETE" });
// //       if (res.ok) {
// //         await onRefresh();
// //         alert("Đã xóa mã giảm giá!");
// //       }
// //     } catch (error) {
// //       console.error("Delete error:", error);
// //       alert("Lỗi khi xóa!");
// //     }
// //   };

// //   return (
// //     <div className="discount-container">
// //       <div className="discount-header">
// //         <h1>Discount Management</h1>
// //         <button className="add-btn" onClick={() => { resetForm(); setShowForm(true); }}>
// //           <Plus size={20} /> Add New Discount
// //         </button>
// //       </div>

// //       {showForm && (
// //         <div className="discount-form-overlay">
// //           <form onSubmit={handleSubmit} className="discount-form">
// //             <div className="form-title">
// //               <h2>{editingItem ? "Edit Discount" : "Add New Discount"}</h2>
// //               <button type="button" className="close-form" onClick={() => { setShowForm(false); resetForm(); }}>
// //                 <X size={20} />
// //               </button>
// //             </div>

// //             <div className="form-grid">
// //               <div className="form-group">
// //                 <label>Discount Title</label>
// //                 <input type="text" name="title" value={formData.title} onChange={handleInputChange} required placeholder="Ví dụ: Giảm giá mùa hè" />
// //               </div>
// //               <div className="form-group">
// //                 <label>Discount Percent (%)</label>
// //                 <input type="number" name="discountPercent" value={formData.discountPercent} onChange={handleInputChange} required min="1" max="100" />
// //               </div>
// //               <div className="form-group">
// //                 <label>Start Date</label>
// //                 <input type="date" name="startDate" value={formData.startDate} onChange={handleInputChange} />
// //               </div>
// //               <div className="form-group">
// //                 <label>End Date</label>
// //                 <input type="date" name="endDate" value={formData.endDate} onChange={handleInputChange} />
// //               </div>
// //               <div className="form-group">
// //                 <label>Discount Code (optional)</label>
// //                 <input type="text" name="code" value={formData.code} onChange={handleInputChange} placeholder="e.g. SUMMER20" />
// //               </div>
// //               <div className="form-group full">
// //                 <label>Description</label>
// //                 <textarea name="description" value={formData.description} onChange={handleInputChange} rows={3} placeholder="Mô tả ngắn gọn về chương trình..." />
// //               </div>
// //             </div>

// //             <div className="form-actions">
// //               <button type="submit" className="submit-btn" disabled={saving}>
// //                 <Save size={20} /> {saving ? "Saving..." : (editingItem ? "Update" : "Add Discount")}
// //               </button>
// //             </div>
// //           </form>
// //         </div>
// //       )}

// //       <div className="discount-list">
// //         {discounts.length === 0 ? (
// //           <div className="no-items-box">
// //             <Percent size={48} />
// //             <p>Chưa có chương trình giảm giá nào.</p>
// //           </div>
// //         ) : (
// //           discounts.map((item) => (
// //             <div key={item.id} className="discount-card">
// //               <div className="discount-header-card">
// //                 <div className="icon-badge">
// //                   <Percent size={24} />
// //                 </div>
// //                 <div className="title-area">
// //                   <h3>{item.title}</h3>
// //                   <span className="discount-pill">-{item.discountPercent}%</span>
// //                 </div>
// //               </div>
              
// //               <div className="discount-body">
// //                 <p className="discount-desc">{item.description}</p>
// //                 {item.code && (
// //                   <div className="code-tag">
// //                     <span>Code:</span> <strong>{item.code}</strong>
// //                   </div>
// //                 )}
// //                 <div className="discount-date">
// //                   {item.startDate || item.endDate ? (
// //                     <span>📅 {item.startDate || "..."} — {item.endDate || "..."}</span>
// //                   ) : (
// //                     <span>Vô thời hạn</span>
// //                   )}
// //                 </div>
// //               </div>

// //               <div className="discount-actions">
// //                 <button className="edit-btn-small" onClick={() => handleEdit(item)} title="Sửa">
// //                   <Edit2 size={16} />
// //                 </button>
// //                 <button className="delete-btn-small" onClick={() => handleDelete(item.id)} title="Xóa">
// //                   <Trash2 size={16} />
// //                 </button>
// //               </div>
// //             </div>
// //           ))
// //         )}
// //       </div>
// //     </div>
// //   );
// // };

// // export default PartnerDiscount;



// import { useState } from "react";
// import { Plus, Edit2, Trash2, Save, X, Percent } from "lucide-react";
// import "./PartnerDiscount.css";

// const PartnerDiscount = ({ data, placeId, onRefresh }) => {
//   const [showForm, setShowForm] = useState(false);
//   const [editingItem, setEditingItem] = useState(null);
//   const [saving, setSaving] = useState(false);

//   // Fix lỗi undefined bằng fallback URL
//   const discountUrl = import.meta.env.VITE_Location_Discount || "http://localhost:3001/discounts";

//   const [formData, setFormData] = useState({
//     title: "",
//     description: "",
//     discountPercent: "",
//     startDate: "",
//     endDate: "",
//     code: ""
//   });

//   const discounts = data || [];

//   const resetForm = () => {
//     setFormData({
//       title: "",
//       description: "",
//       discountPercent: "",
//       startDate: "",
//       endDate: "",
//       code: ""
//     });
//     setEditingItem(null);
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!placeId) return alert("Location ID is missing!");

//     setSaving(true);
//     try {
//       const user = JSON.parse(localStorage.getItem("user"));
      
//       // Đồng bộ dữ liệu để tránh lỗi 500 (ép kiểu ID thành string)
//       const payload = {
//         ...formData,
//         discountPercent: Number(formData.discountPercent),
//         placeId: String(placeId),
//         partnerId: String(user?.id),
//         updatedAt: new Date().toISOString()
//       };

//       let res;
//       if (editingItem) {
//         // PATCH: Cập nhật bản ghi đã có
//         res = await fetch(`${discountUrl}/${editingItem.id}`, {
//           method: "PATCH",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify(payload)
//         });
//       } else {
//         // POST: Thêm mới
//         res = await fetch(discountUrl, {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({
//             ...payload,
//             createdAt: new Date().toISOString()
//           })
//         });
//       }

//       if (res.ok) {
//         await onRefresh(); 
//         setShowForm(false);
//         resetForm();
//         alert(editingItem ? "Updated successfully!" : "Added successfully!");
//       } else {
//         const errorData = await res.json();
//         console.error("Server Error:", errorData);
//         alert("Failed to save. Please check console.");
//       }
//     } catch (error) {
//       console.error("Network Error:", error);
//       alert("Could not connect to server!");
//     } finally {
//       setSaving(false);
//     }
//   };

//   const handleEdit = (item) => {
//     setEditingItem(item);
//     setFormData({
//       title: item.title,
//       description: item.description || "",
//       discountPercent: item.discountPercent || "",
//       startDate: item.startDate || "",
//       endDate: item.endDate || "",
//       code: item.code || ""
//     });
//     setShowForm(true);
//   };

//   const handleDelete = async (id) => {
//     if (!window.confirm("Are you sure you want to delete this discount?")) return;
//     try {
//       const res = await fetch(`${discountUrl}/${id}`, { 
//         method: "DELETE" 
//       });
      
//       if (res.ok) {
//         await onRefresh();
//         alert("Deleted!");
//       } else if (res.status === 500) {
//         alert("Server error (500). Try restarting json-server or manual delete in db.json");
//       }
//     } catch (error) {
//       console.error("Delete error:", error);
//     }
//   };

//   return (
//     <div className="discount-container">
//       <div className="discount-header">
//         <div>
//           <h1>Discount Management</h1>
//           <p className="subtitle">Manage coupons and special offers</p>
//         </div>
//         <button className="add-btn" onClick={() => { resetForm(); setShowForm(true); }}>
//           <Plus size={20} /> Add Discount
//         </button>
//       </div>

//       {showForm && (
//         <div className="discount-form-overlay">
//           <div className="discount-modal">
//             <form onSubmit={handleSubmit} className="discount-form">
//               <div className="form-title">
//                 <h2>{editingItem ? "Edit Offer" : "New Offer"}</h2>
//                 <button type="button" className="close-btn-icon" onClick={() => { setShowForm(false); resetForm(); }}>
//                   <X size={24} />
//                 </button>
//               </div>

//               <div className="form-grid">
//                 <div className="form-group">
//                   <label>Offer Title</label>
//                   <input type="text" name="title" value={formData.title} onChange={handleInputChange} required placeholder="e.g. Happy Hour" />
//                 </div>
//                 <div className="form-group">
//                   <label>Value (%)</label>
//                   <input type="number" name="discountPercent" value={formData.discountPercent} onChange={handleInputChange} required min="1" max="100" />
//                 </div>
//                 <div className="form-group">
//                   <label>From Date</label>
//                   <input type="date" name="startDate" value={formData.startDate} onChange={handleInputChange} />
//                 </div>
//                 <div className="form-group">
//                   <label>To Date</label>
//                   <input type="date" name="endDate" value={formData.endDate} onChange={handleInputChange} />
//                 </div>
//                 <div className="form-group full">
//                   <label>Promo Code (if any)</label>
//                   <input type="text" name="code" value={formData.code} onChange={handleInputChange} placeholder="e.g. WELCOME65" />
//                 </div>
//                 <div className="form-group full">
//                   <label>Conditions / Description</label>
//                   <textarea name="description" value={formData.description} onChange={handleInputChange} rows={3} placeholder="Tell customers more about this deal..." />
//                 </div>
//               </div>

//               <div className="form-footer">
//                 <button type="button" className="cancel-btn" onClick={() => setShowForm(false)}>Cancel</button>
//                 <button type="submit" className="submit-btn" disabled={saving}>
//                   <Save size={18} /> {saving ? "Saving..." : (editingItem ? "Save Changes" : "Create Now")}
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}

//       <div className="discount-grid-display">
//         {discounts.length === 0 ? (
//           <div className="empty-state">
//             <div className="empty-icon"><Percent size={40} /></div>
//             <p>No active discounts found for this location.</p>
//           </div>
//         ) : (
//           discounts.map((item) => (
//             <div key={item.id} className="discount-card-item">
//               <div className="card-badge">-{item.discountPercent}%</div>
//               <div className="card-content">
//                 <h3>{item.title}</h3>
//                 <p className="card-desc">{item.description}</p>
//                 {item.code && <div className="card-code">Code: <span>{item.code}</span></div>}
//                 <div className="card-date">
//                   📅 {item.startDate || "N/A"} - {item.endDate || "N/A"}
//                 </div>
//               </div>
//               <div className="card-actions-overlay">
//                 <button className="action-icon edit" onClick={() => handleEdit(item)}><Edit2 size={16} /></button>
//                 <button className="action-icon delete" onClick={() => handleDelete(item.id)}><Trash2 size={16} /></button>
//               </div>
//             </div>
//           ))
//         )}
//       </div>
//     </div>
//   );
// };

// export default PartnerDiscount;


import { useState } from "react";
import { Plus, Edit2, Trash2, Save, X, Percent } from "lucide-react";
import "./PartnerDiscount.css";

const PartnerDiscount = ({ data, placeId, onRefresh }) => {
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    title: "", 
    discountPercent: "", 
    description: "", 
    startDate: "", 
    endDate: "", 
    code: ""
  });

  const discounts = data || [];

  const resetForm = () => {
    setFormData({ title: "", discountPercent: "", description: "", startDate: "", endDate: "", code: "" });
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
      const discountUrl = import.meta.env.VITE_Location_Discount || "http://localhost:3001/discounts";

      // ✅ Dùng locationId cho đúng với db.json và đồng bộ với PartnerMenu
      const payload = {
        ...formData,
        discountPercent: Number(formData.discountPercent),
        locationId:      String(placeId),
        partnerId:       String(partnerId),
        updatedAt:       new Date().toISOString()
      };

      let res;
      if (editingItem) {
        res = await fetch(`${discountUrl}/${editingItem.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
      } else {
        res = await fetch(discountUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...payload, createdAt: new Date().toISOString() })
        });
      }

      if (res.ok) {
        await onRefresh();
        setShowForm(false);
        resetForm();
        alert(editingItem ? "Cập nhật thành công!" : "Thêm mã giảm giá thành công!");
      }
    } catch (error) {
      console.error(error);
      alert("Lỗi khi lưu mã giảm giá!");
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      title:           item.title,
      discountPercent: item.discountPercent,
      description:     item.description || "",
      startDate:       item.startDate   || "",
      endDate:         item.endDate     || "",
      code:            item.code        || ""
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn chắc chắn muốn xóa mã này?")) return;
    try {
      const discountUrl = import.meta.env.VITE_Location_Discount || "http://localhost:3001/discounts";
      const res = await fetch(`${discountUrl}/${id}`, { method: "DELETE" });
      if (res.ok) {
        await onRefresh();
        alert("Xóa thành công!");
      }
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  return (
    <div className="discount-container">
      <div className="discount-header">
        <h1>Discount Management</h1>
        <button className="add-btn" onClick={() => { resetForm(); setShowForm(true); }}>
          <Plus size={20} /> New discount
        </button>
      </div>

      {showForm && (
        <div className="discount-form-container">
          <form onSubmit={handleSubmit} className="discount-form">
            <div className="form-title">
              {editingItem ? "Edit discount" : "New discount"}
              <button
                type="button"
                className="close-form"
                onClick={() => { setShowForm(false); resetForm(); }}
              >
                <X size={20} />
              </button>
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label>Discount Title</label>
                <input
                  type="text" name="title"
                  value={formData.title}
                  onChange={handleInputChange} required
                />
              </div>
              <div className="form-group">
                <label>Discount (%)</label>
                <input
                  type="number" name="discountPercent"
                  value={formData.discountPercent}
                  onChange={handleInputChange} required
                />
              </div>
              <div className="form-group">
                <label>Start Date</label>
                <input
                  type="date" name="startDate"
                  value={formData.startDate}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label>End Date</label>
                <input
                  type="date" name="endDate"
                  value={formData.endDate}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group full">
                <label>Promo Code (Optional)</label>
                <input
                  type="text" name="code"
                  value={formData.code}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group full">
                <label>Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                />
              </div>
            </div>

            <button type="submit" className="submit-btn">
              <Save size={20} /> {editingItem ? "Update discount" : "Add discount"}
            </button>
          </form>
        </div>
      )}

      <div className="discount-list">
        {discounts.length === 0 ? (
          <p className="no-items">Danh sách trống. Hãy thêm mã giảm giá!</p>
        ) : (
          discounts.map((item) => (
            <div key={item.id} className="discount-item-card">
              <div className="discount-item-icon">
                <Percent size={32} />
              </div>
              <div className="discount-item-info">
                <h3>{item.title}</h3>
                <p className="percent">Giảm {item.discountPercent}%</p>
                {item.code && <p className="code">Mã: <strong>{item.code}</strong></p>}
                <p className="date">{item.startDate} - {item.endDate}</p>
                {item.description && <p className="description">{item.description}</p>}
              </div>
              <div className="discount-item-actions">
                <button className="edit-btn-small" onClick={() => handleEdit(item)}>
                  <Edit2 size={18} />
                </button>
                <button className="delete-btn-small" onClick={() => handleDelete(item.id)}>
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

export default PartnerDiscount;