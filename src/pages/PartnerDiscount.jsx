



// import { useState, useEffect } from "react";
// import { Plus, Edit2, Trash2, Save, X, Percent } from "lucide-react";
// import "./PartnerDiscount.css";

// const API_BASE = "http://localhost:3001";

// const PartnerDiscount = () => {
//   const [discounts, setDiscounts] = useState([]); // danh sách khuyến mãi
//   const [loading, setLoading] = useState(true); // trạng thái loading
//   const [showForm, setShowForm] = useState(false); // hiển thị form
//   const [editingItem, setEditingItem] = useState(null); // item đang edit
//   const [placeId, setPlaceId] = useState(null); // id địa điểm

//   // Form data
//   const [formData, setFormData] = useState({
//     title: "",
//     description: "",
//     discountPercent: "",
//     startDate: "",
//     endDate: "",
//     code: ""   // discount code (optional)
//   });

//   useEffect(() => {
//     fetchDiscounts(); // load data khi mount
//   }, []);

//   const fetchDiscounts = async () => {
//     try {
//       const user = JSON.parse(localStorage.getItem("user"));
//       if (!user) {
//         alert("You are not logged in!"); // chưa đăng nhập
//         setLoading(false);
//         return;
//       }

//       // get placeId of partner
//       const placeRes = await fetch(`${API_BASE}/locations?partnerId=${user.id}`);
//       const placeData = await placeRes.json();

//       if (placeData.length === 0) {
//         alert("No location found!"); // không có địa điểm
//         setLoading(false);
//         return;
//       }

//       const currentPlaceId = placeData[0].id;
//       setPlaceId(currentPlaceId);

//       // get discounts by placeId
//       const discountRes = await fetch(`${API_BASE}/discounts?placeId=${currentPlaceId}`);
//       const discountData = await discountRes.json();
//       setDiscounts(discountData);
//     } catch (error) {
//       console.error("Error loading discounts:", error); // lỗi load
//     } finally {
//       setLoading(false);
//     }
//   };

//   const resetForm = () => {
//     setFormData({
//       title: "",
//       description: "",
//       discountPercent: "",
//       startDate: "",
//       endDate: "",
//       code: ""
//     });
//     setEditingItem(null); // reset edit
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value })); // cập nhật input
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!placeId) return alert("No location yet!"); // chưa có place

//     try {
//       const user = JSON.parse(localStorage.getItem("user"));

//       if (editingItem) {
//         // Update existing discount
//         await fetch(`${API_BASE}/discounts/${editingItem.id}`, {
//           method: "PATCH",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify(formData)
//         });
//       } else {
//         // Create new discount
//         await fetch(`${API_BASE}/discounts`, {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({
//             ...formData,
//             placeId: Number(placeId),
//             partnerId: String(user.id),
//             createdAt: new Date().toISOString()
//           })
//         });
//       }

//       fetchDiscounts();   // reload list
//       setShowForm(false);
//       resetForm();
//       alert(editingItem ? "Discount updated successfully!" : "New discount added successfully!");
//     } catch (error) {
//       console.error("Error:", error);
//       alert("Something went wrong!"); // lỗi chung
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
//     setShowForm(true); // mở form edit
//   };

//   const handleDelete = async (id) => {
//     if (!window.confirm("Are you sure you want to delete this discount?")) return; // confirm xóa

//     try {
//       await fetch(`${API_BASE}/discounts/${id}`, { method: "DELETE" });
//       fetchDiscounts();
//       alert("Discount deleted!");
//     } catch (error) {
//       console.error("Delete error:", error); // lỗi xóa
//     }
//   };

//   if (loading) return <div className="loading">Loading...</div>;

//   return (
//     <div className="discount-container">
//       <div className="discount-header">
//         <h1>Discount Management</h1>
//         <button
//           className="add-btn"
//           onClick={() => {
//             resetForm();
//             setShowForm(true);
//           }}
//         >
//           <Plus size={20} />
//           Add New Discount
//         </button>
//       </div>

//       {/* Form add/edit */}
//       {showForm && (
//         <div className="discount-form-container">
//           <form onSubmit={handleSubmit} className="discount-form">
//             <div className="form-title">
//               {editingItem ? "Edit Discount" : "Add New Discount"}
//               <button type="button" className="close-form" onClick={() => { setShowForm(false); resetForm(); }}>
//                 <X size={20} />
//               </button>
//             </div>

//             <div className="form-grid">
//               <div className="form-group">
//                 <label>Discount Title</label>
//                 <input type="text" name="title" value={formData.title} onChange={handleInputChange} required />
//               </div>

//               <div className="form-group">
//                 <label>Discount Percent (%)</label>
//                 <input type="number" name="discountPercent" value={formData.discountPercent} onChange={handleInputChange} required />
//               </div>

//               <div className="form-group">
//                 <label>Start Date</label>
//                 <input type="date" name="startDate" value={formData.startDate} onChange={handleInputChange} />
//               </div>

//               <div className="form-group">
//                 <label>End Date</label>
//                 <input type="date" name="endDate" value={formData.endDate} onChange={handleInputChange} />
//               </div>

//               <div className="form-group">
//                 <label>Discount Code (optional)</label>
//                 <input type="text" name="code" value={formData.code} onChange={handleInputChange} placeholder="e.g. SUMMER20" />
//               </div>

//               <div className="form-group full">
//                 <label>Description</label>
//                 <textarea name="description" value={formData.description} onChange={handleInputChange} rows={4} />
//               </div>
//             </div>

//             <button type="submit" className="submit-btn">
//               <Save size={20} />
//               {editingItem ? "Update" : "Add Discount"}
//             </button>
//           </form>
//         </div>
//       )}

//       {/* Discount list */}
//       <div className="discount-list">
//         {discounts.length === 0 ? (
//           <p className="no-items">No discounts yet. Create one!</p>
//         ) : (
//           discounts.map((item) => (
//             <div key={item.id} className="discount-card">
//               <div className="discount-header-card">
//                 <Percent size={28} />
//                 <h3>{item.title}</h3>
//                 <span className="discount-percent">-{item.discountPercent}%</span>
//               </div>

//               <p className="discount-desc">{item.description}</p>

//               {item.code && <p className="discount-code">Code: <strong>{item.code}</strong></p>}

//               <div className="discount-date">
//                 {item.startDate && item.endDate && (
//                   <small>{item.startDate} → {item.endDate}</small>
//                 )}
//               </div>

//               <div className="discount-actions">
//                 <button className="edit-btn-small" onClick={() => handleEdit(item)}>
//                   <Edit2 size={18} />
//                 </button>
//                 <button className="delete-btn-small" onClick={() => handleDelete(item.id)}>
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

// export default PartnerDiscount;



import { useState } from "react";
import { Plus, Edit2, Trash2, Save, X, Percent } from "lucide-react";
import "./PartnerDiscount.css";

const API_BASE = "http://localhost:3001";

// Nhận data, placeId và hàm onRefresh từ Layout cha
const PartnerDiscount = ({ data, placeId, onRefresh }) => {
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    discountPercent: "",
    startDate: "",
    endDate: "",
    code: ""
  });

  const discounts = data || [];

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      discountPercent: "",
      startDate: "",
      endDate: "",
      code: ""
    });
    setEditingItem(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!placeId) return alert("No location yet!");

    try {
      const user = JSON.parse(localStorage.getItem("user"));

      if (editingItem) {
        await fetch(`${API_BASE}/discounts/${editingItem.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData)
        });
      } else {
        await fetch(`${API_BASE}/discounts`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...formData,
            placeId: Number(placeId),
            partnerId: String(user.id),
            createdAt: new Date().toISOString()
          })
        });
      }

      await onRefresh(); // Gọi Layout fetch lại toàn bộ data
      setShowForm(false);
      resetForm();
      alert(editingItem ? "Discount updated successfully!" : "New discount added successfully!");
    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong!");
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      description: item.description || "",
      discountPercent: item.discountPercent || "",
      startDate: item.startDate || "",
      endDate: item.endDate || "",
      code: item.code || ""
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this discount?")) return;
    try {
      await fetch(`${API_BASE}/discounts/${id}`, { method: "DELETE" });
      await onRefresh(); // Báo cho Layout cập nhật lại
      alert("Discount deleted!");
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  return (
    <div className="discount-container">
      <div className="discount-header">
        <h1>Discount Management</h1>
        <button className="add-btn" onClick={() => { resetForm(); setShowForm(true); }}>
          <Plus size={20} /> Add New Discount
        </button>
      </div>

      {showForm && (
        <div className="discount-form-container">
          <form onSubmit={handleSubmit} className="discount-form">
            <div className="form-title">
              {editingItem ? "Edit Discount" : "Add New Discount"}
              <button type="button" className="close-form" onClick={() => { setShowForm(false); resetForm(); }}>
                <X size={20} />
              </button>
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label>Discount Title</label>
                <input type="text" name="title" value={formData.title} onChange={handleInputChange} required />
              </div>
              <div className="form-group">
                <label>Discount Percent (%)</label>
                <input type="number" name="discountPercent" value={formData.discountPercent} onChange={handleInputChange} required />
              </div>
              <div className="form-group">
                <label>Start Date</label>
                <input type="date" name="startDate" value={formData.startDate} onChange={handleInputChange} />
              </div>
              <div className="form-group">
                <label>End Date</label>
                <input type="date" name="endDate" value={formData.endDate} onChange={handleInputChange} />
              </div>
              <div className="form-group">
                <label>Discount Code (optional)</label>
                <input type="text" name="code" value={formData.code} onChange={handleInputChange} placeholder="e.g. SUMMER20" />
              </div>
              <div className="form-group full">
                <label>Description</label>
                <textarea name="description" value={formData.description} onChange={handleInputChange} rows={4} />
              </div>
            </div>

            <button type="submit" className="submit-btn">
              <Save size={20} /> {editingItem ? "Update" : "Add Discount"}
            </button>
          </form>
        </div>
      )}

      <div className="discount-list">
        {discounts.length === 0 ? (
          <p className="no-items">No discounts yet. Create one!</p>
        ) : (
          discounts.map((item) => (
            <div key={item.id} className="discount-card">
              <div className="discount-header-card">
                <Percent size={28} />
                <h3>{item.title}</h3>
                <span className="discount-percent">-{item.discountPercent}%</span>
              </div>
              <p className="discount-desc">{item.description}</p>
              {item.code && <p className="discount-code">Code: <strong>{item.code}</strong></p>}
              <div className="discount-date">
                {item.startDate && item.endDate && (
                  <small>{item.startDate} → {item.endDate}</small>
                )}
              </div>
              <div className="discount-actions">
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