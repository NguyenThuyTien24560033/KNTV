// // 1. Khởi tạo State: Quản lý danh sách món ăn (menuItems), trạng thái đóng/mở form (showForm), đối tượng đang sửa (editingItem) và ID của địa điểm (placeId).

// // 2. Nhận diện & Kiểm tra User: Truy xuất thông tin người dùng từ localStorage. Nếu chưa đăng nhập, thông báo lỗi và dừng tiến trình.

// // 3. Xác định Địa điểm (Location): Gọi API tìm địa điểm (locations) dựa trên partnerId của user. Lưu placeId đầu tiên tìm thấy để làm gốc quản lý menu.

// // 4. Tải Menu (Fetch): Dựa trên placeId vừa lấy, gọi API truy vấn danh sách món ăn tương ứng để hiển thị lên giao diện.

// // 5. Quản lý Nhập liệu: Sử dụng formData để lưu trữ thông tin món ăn (tên, giá, mô tả...). Hàm handleInputChange cập nhật liên tục thay đổi từ các ô nhập và thẻ select.

// // 6. Xử lý Gửi Form (Submit): - Nếu đang sửa: Gửi yêu cầu PATCH để cập nhật thông tin món cũ.

// // Nếu thêm mới: Gửi yêu cầu POST bao gồm dữ liệu form, placeId, partnerId và thời gian tạo.

// // 7. Chỉnh sửa (Edit): Khi nhấn icon Edit, đổ ngược dữ liệu của món đó vào formData và mở form để người dùng thay đổi.

// // 8. Xóa món (Delete): Hiển thị xác nhận (Confirm). Nếu đồng ý, gửi yêu cầu DELETE lên server dựa theo ID món.

// // 9. Đồng bộ & Làm mới: Sau mỗi thao tác Thêm/Sửa/Xóa thành công, gọi lại hàm fetchMenu để cập nhật danh sách mới nhất từ Server.

// // 10. Trạng thái Trống (Empty State): Kiểm tra độ dài danh sách món; nếu bằng 0, hiển thị thông báo hướng dẫn người dùng thêm món mới để lấp đầy menu.



// import { useState, useEffect } from "react";
// import { Plus, Edit2, Trash2, Save, X } from "lucide-react";
// import "./PartnerMenu.css";

// const PartnerMenu = () => {
//   const [menuItems, setMenuItems] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [showForm, setShowForm] = useState(false);
//   const [editingItem, setEditingItem] = useState(null);
//   const [placeId, setPlaceId] = useState(null);

//   // Form data
//   const [formData, setFormData] = useState({
//     name: "",
//     price: "",
//     description: "",
//     category: "",
//     image: ""
//   });

//   useEffect(() => {
//     fetchMenu();
//   }, []);

//   // const fetchMenu = async () => {
//   //   try {
//   //     const user = JSON.parse(localStorage.getItem("user"));
//   //     if (!user) {
//   //       alert("Not logged in!");
//   //       setLoading(false);
//   //       return;
//   //     }

//   //     // Lấy place theo partnerId 
//   //     const placeRes = await fetch(
//   //       `http://localhost:3001/locations?partnerId=${user.id}`
//   //     );
//   //     const placeData = await placeRes.json();
//   //     if (placeData.length === 0) {
//   //       alert("No locations found for this partner!");
//   //       setLoading(false);
//   //       return;
//   //     }

//   //     const currentPlaceId = placeData[0].id;
//   //     setPlaceId(currentPlaceId);

//   //     // Lấy menu theo placeId
//   //     const menuRes = await fetch(
//   //       `http://localhost:3001/menu?placeId=${currentPlaceId}`
//   //     );
//   //     const menuData = await menuRes.json();
//   //     setMenuItems(menuData);
//   //   } catch (error) {
//   //     console.error("Error loading menu:", error);
//   //   } finally {
//   //     setLoading(false);
//   //   }
//   // };

// //   const fetchMenu = async () => {
// //   try {
// //     const user = JSON.parse(localStorage.getItem("user"));
// //     console.log("--- [MENU LOAD] 1. User từ LocalStorage:", user);

// //     // Lấy place theo partnerId 
// //     const partnerIdForFetch = String(user?.id);
// //     const placeRes = await fetch(
// //       `http://localhost:3001/locations?partnerId=${partnerIdForFetch}`
// //     );
// //     const placeData = await placeRes.json();
    
// //     console.log("--- [MENU LOAD] 2. Dữ liệu Location tìm được:", placeData);

// //     if (placeData.length === 0) {
// //       console.error("--- [ERROR] Không tìm thấy location cho partnerId:", partnerIdForFetch);
// //       setLoading(false);
// //       return;
// //     }

// //     const currentPlaceId = String(placeData[0].id);
// //     setPlaceId(currentPlaceId);
// //     console.log("--- [MENU LOAD] 3. Đã chốt placeId để lọc Menu:", currentPlaceId);

// //     // Lấy menu theo placeId
// //     const menuRes = await fetch(
// //       `http://localhost:3001/menu?placeId=${currentPlaceId}`
// //     );
// //     const menuData = await menuRes.json();
    
// //     console.log(`--- [MENU LOAD] 4. Danh sách món ăn của place [${currentPlaceId}]:`, menuData);
// //     setMenuItems(menuData);

// //   } catch (error) {
// //     console.error("--- [ERROR] Lỗi khi load Menu:", error);
// //   } finally {
// //     setLoading(false);
// //   }
// // };

// // const fetchMenu = async () => {
// //   try {
// //     const user = JSON.parse(localStorage.getItem("user"));
// //     console.log("--- [MENU LOAD] 1. User từ LocalStorage:", user);

// //     const partnerIdForFetch = String(user?.id);
// //     const placeRes = await fetch(
// //       `http://localhost:3001/locations?partnerId=${partnerIdForFetch}`
// //     );
// //     const placeData = await placeRes.json();
    
// //     console.log("--- [MENU LOAD] 2. Dữ liệu Location tìm được:", placeData);

// //     if (placeData.length === 0) {
// //       console.error("--- [ERROR] Không tìm thấy location cho partnerId:", partnerIdForFetch);
// //       setLoading(false);
// //       return;
// //     }

// //     // CHỖ QUAN TRỌNG NHẤT ĐÂY NÈ TIÊN:
// //     // Ép kiểu String để "2" (số) thành ""2"" (chuỗi)
// //     const currentPlaceId = String(placeData[0].id); 
    
// //     setPlaceId(currentPlaceId);
// //     console.log("--- [MENU LOAD] 3. Đã chốt placeId để lọc Menu:", currentPlaceId);

// //     // Bây giờ fetch sẽ chạy đúng: http://localhost:3001/menu?placeId=2
// //     // (Lúc này json-server sẽ so khớp chuỗi "2" với chuỗi "2" trong db.json)
// //     const menuRes = await fetch(
// //       `http://localhost:3001/menu?placeId=${currentPlaceId}`
// //     );
// //     const menuData = await menuRes.json();
    
// //     console.log(`--- [MENU LOAD] 4. Danh sách món ăn của place [${currentPlaceId}]:`, menuData);
// //     setMenuItems(menuData);

// //   } catch (error) {
// //     console.error("--- [ERROR] Lỗi khi load Menu:", error);
// //   } finally {
// //     setLoading(false);
// //   }
// // };
  
// // const fetchMenu = async (overridePlaceId = null) => {
// //   try {
// //     const user = JSON.parse(localStorage.getItem("user"));
// //     const partnerIdForFetch = String(user?.id);

// //     let currentPlaceId = overridePlaceId;

// //     if (!currentPlaceId) {
// //       const placeRes = await fetch(
// //         `http://localhost:3001/locations?partnerId=${partnerIdForFetch}`
// //       );
// //       const placeData = await placeRes.json();
// //       if (placeData.length === 0) { setLoading(false); return; }
// //       currentPlaceId = String(placeData[0].id);
// //       setPlaceId(currentPlaceId);
// //     }

// //     const menuRes = await fetch(
// //       `http://localhost:3001/menu?placeId=${currentPlaceId}`
// //     );
// //     const menuData = await menuRes.json();
// //     console.log("✅ Menu loaded:", menuData); // Debug
// //     setMenuItems(menuData);

// //   } catch (error) {
// //     console.error("Error:", error);
// //   } finally {
// //     setLoading(false);
// //   }
// // };


// const fetchMenu = async () => {
//   try {
//     const user = JSON.parse(localStorage.getItem("user"));
//     const partnerIdForFetch = String(user?.id);

//     const placeRes = await fetch(
//       `http://localhost:3001/locations?partnerId=${partnerIdForFetch}`
//     );
//     const placeData = await placeRes.json();

//     if (placeData.length === 0) return;

//     // const currentPlaceId = String(placeData[0].id);
//     const currentPlaceId = placeData[0].id;

//     setPlaceId(currentPlaceId);

//     const menuRes = await fetch(
//       `http://localhost:3001/menu?placeId=${currentPlaceId}`
//     );
//     const menuData = await menuRes.json();

//     console.log("✅ Menu loaded:", menuData);
//     setMenuItems(menuData);

//   } catch (error) {
//     console.error(error);
//   } finally {
//     setLoading(false);
//   }
// };


// const resetForm = () => {
//     setFormData({
//       name: "",
//       price: "",
//       description: "",
//       category: "",
//       image: ""
//     });
//     setEditingItem(null);
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   // const handleSubmit = async (e) => {
//   //   e.preventDefault();
//   //   if (!placeId) return alert("Location not defined!");

//   //   try {
//   //     // Lấy partnerId từ user đang đăng nhập
//   //     const user = JSON.parse(localStorage.getItem("user"));
//   //     const partnerId = String(user?.id); 

//   //     if (editingItem) {
//   //       // Cập nhật món
//   //       await fetch(`http://localhost:3001/menu/${editingItem.id}`, {
//   //         method: "PATCH",
//   //         headers: { "Content-Type": "application/json" },
//   //         body: JSON.stringify(formData)
//   //       });
//   //     } else {
//   //       // Thêm món mới
//   //       await fetch("http://localhost:3001/menu", {
//   //         method: "POST",
//   //         headers: { "Content-Type": "application/json" },
//   //         body: JSON.stringify({
//   //           ...formData,
//   //           placeId: String(placeId),
//   //           partnerId: String(partnerId), 
//   //           createdAt: new Date().toISOString()
//   //         })
//   //       });
//   //     }

//   //     fetchMenu();
//   //     setShowForm(false);
//   //     resetForm();
//   //     alert(editingItem ? "Update successfully!" : "Adding new item successfully!");
//   //   } catch (error) {
//   //     console.error("Error:", error);
//   //     alert("Error!");
//   //   }
//   // };

// //   const handleSubmit = async (e) => {
// //   e.preventDefault();
  
// //   // Kiểm tra nếu chưa có placeId thì không cho gửi
// //   if (!placeId) {
// //     alert("Location not defined! Please check your location page.");
// //     return;
// //   }

// //   try {
// //     const user = JSON.parse(localStorage.getItem("user"));
// //     const currentPartnerId = String(user?.id); // Lấy partnerId từ user đang login

// //     // Đóng gói dữ liệu chuẩn bị gửi lên Server
// //     const payload = {
// //       ...formData,
// //       price: Number(formData.price), // Giá tiền nên để kiểu số để sau này dễ tính toán
// //       placeId: String(placeId),      // ID địa điểm bắt buộc là String
// //       partnerId: currentPartnerId,   // ID người chủ bắt buộc là String
// //       createdAt: new Date().toISOString()
// //     };

// //     if (editingItem) {
// //       // 1. CẬP NHẬT MÓN CŨ
// //       await fetch(`http://localhost:3001/menu/${editingItem.id}`, {
// //         method: "PATCH",
// //         headers: { "Content-Type": "application/json" },
// //         body: JSON.stringify(payload) // Gửi full payload để đảm bảo không mất ID
// //       });
// //     } else {
// //       // 2. TẠO MÓN MỚI TOÀN BỘ
// //       const response = await fetch("http://localhost:3001/menu", {
// //         method: "POST",
// //         headers: { "Content-Type": "application/json" },
// //         body: JSON.stringify(payload)
// //       });

// //       if (!response.ok) throw new Error("Failed to add new item");
// //     }

// //     // Sau khi lưu xong, gọi fetchMenu để nó load lại danh sách mới nhất
// //     await fetchMenu(); 
    
// //     // Đóng form và reset
// //     setShowForm(false);
// //     resetForm();
// //     alert(editingItem ? "Update successfully!" : "Added new item successfully!");

// //   } catch (error) {
// //     console.error("Submit Error:", error);
// //     alert("Something went wrong!");
// //   }
// // };

// const handleSubmit = async (e) => {
//   e.preventDefault();
//   console.log("--- [SUBMIT] Bắt đầu xử lý gửi Form ---");

//   if (!placeId) {
//     console.error("--- [ERROR] Không có placeId, không thể lưu!");
//     return alert("Location not defined!");
//   }

//   try {
//     const user = JSON.parse(localStorage.getItem("user"));
//     const partnerId = String(user?.id);

//     // Tạo object dữ liệu chuẩn
//     const payload = {
//       ...formData,
//       price: Number(formData.price), // Ép kiểu số cho giá
//       // placeId: String(placeId),      // Ép kiểu chuỗi cho ID
//       placeId: Number(placeId),
//       partnerId: String(partnerId),  // Ép kiểu chuỗi cho ID
//       createdAt: new Date().toISOString()
//     };

//     console.log("--- [SUBMIT] 5. Dữ liệu chuẩn bị gửi lên Server:", payload);

//     let res;
//     if (editingItem) {
//       console.log("--- [SUBMIT] Đang thực hiện PATCH (Cập nhật) ID:", editingItem.id);
//       res = await fetch(`http://localhost:3001/menu/${editingItem.id}`, {
//         method: "PATCH",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload)
//       });
//     } else {
//       console.log("--- [SUBMIT] Đang thực hiện POST (Thêm mới) ---");
//       res = await fetch("http://localhost:3001/menu", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload)
//       });
//     }

//     const result = await res.json();
//     console.log("--- [SUBMIT] 6. Kết quả trả về từ Server:", result);

//     // if (res.ok) {
//     //   console.log("--- [SUBMIT] Thành công! Đang reload Menu... ---");
//     //   await fetchMenu();
//     //   setShowForm(false);
//     //   resetForm();
//     //   alert(editingItem ? "Update successfully!" : "Adding new item successfully!");
//     if (res.ok) {
//   await fetchMenu(placeId); // ← Bypass state, truyền thẳng
//   setShowForm(false);
//   resetForm();
//   alert(editingItem ? "Update successfully!" : "Adding new item successfully!");


//     } else {
//       throw new Error("Server response not OK");
//     }

//   } catch (error) {
//     console.error("--- [ERROR] Lỗi khi lưu món ăn:", error);
//     alert("Error!");
//   }
// };
//   const handleEdit = (item) => {
//     setEditingItem(item);
//     setFormData({
//       name: item.name,
//       price: item.price,
//       description: item.description || "",
//       category: item.category || "",
//       image: item.image || ""
//     });
//     setShowForm(true);
//   };

//   const handleDelete = async (id) => {
//     if (!window.confirm("Are you sure you want to delete this item??")) return;
//     try {
//       await fetch(`http://localhost:3001/menu/${id}`, { method: "DELETE" });
//       fetchMenu();
//       alert("Delete successfully!");
//     } catch (error) {
//       console.error("Delete err:", error);
//     }
//   };

//   if (loading) return <div className="loading">Loading...</div>;

//   return (
//     <div className="menu-container">
//       <div className="menu-header">
//         <h1>Menu</h1>
//         <button
//           className="add-btn"
//           onClick={() => {
//             resetForm();
//             setShowForm(true);
//           }}
//         >
//           <Plus size={20} />
//           New item
//         </button>
//       </div>

//       {showForm && (
//         <div className="menu-form-container">
//           <form onSubmit={handleSubmit} className="menu-form">
//             <div className="form-title">
//               {editingItem ? "Edit item" : "New item"}
//               <button
//                 type="button"
//                 className="close-form"
//                 onClick={() => {
//                   setShowForm(false);
//                   resetForm();
//                 }}
//               >
//                 <X size={20} />
//               </button>
//             </div>

//             <div className="form-grid">
//               <div className="form-group">
//                 <label>Name item</label>
//                 <input
//                   type="text"
//                   name="name"
//                   value={formData.name}
//                   onChange={handleInputChange}
//                   required
//                 />
//               </div>

//               <div className="form-group">
//                 <label>Price (VNĐ)</label>
//                 <input
//                   type="number"
//                   name="price"
//                   value={formData.price}
//                   onChange={handleInputChange}
//                   required
//                 />
//               </div>

//               <div className="form-group">
//                 <label>Category</label>
//                 <select
//                   name="category"
//                   value={formData.category}
//                   onChange={handleInputChange}
//                   required
//                 >
//                   <option value="">-- Select Category --</option>
//                   <option value="Meat">Meat</option>
//                   <option value="Seafood">Seafood</option>
//                   <option value="Vegetarian">Vegetarian</option>
//                   <option value="Street Food">Street Food</option>
//                   <option value="Family-style">Family-style</option>
//                   <option value="Set meals">Set meals</option>
//                   <option value="Hotpot">Hotpot</option>
//                 </select>
//               </div>

//               <div className="form-group">
//                 <label>URL image</label>
//                 <input
//                   type="text"
//                   name="image"
//                   value={formData.image}
//                   onChange={handleInputChange}
//                 />
//               </div>

//               <div className="form-group full">
//                 <label>Description</label>
//                 <textarea
//                   name="description"
//                   value={formData.description}
//                   onChange={handleInputChange}
//                   rows={4}
//                 />
//               </div>
//             </div>

//             <button type="submit" className="submit-btn">
//               <Save size={20} />
//               {editingItem ? "Update item" : "Add item"}
//             </button>
//           </form>
//         </div>
//       )}

//       <div className="menu-list">
//         {menuItems.length === 0 ? (
//           <p className="no-items">Your menu is empty. Start by adding a new item!</p>
//         ) : (
//           menuItems.map((item) => (
//             <div key={item.id} className="menu-item-card">
//               <div className="menu-item-image">
//                 {item.image ? <img src={item.image} alt={item.name} /> : <div className="no-image-small">No Image</div>}
//               </div>
//               <div className="menu-item-info">
//                 <h3>{item.name}</h3>
//                 <p className="price">{Number(item.price).toLocaleString("vi-VN")} ₫</p>
//                 {item.category && <p className="category">{item.category}</p>}
//                 {item.description && <p className="description">{item.description}</p>}
//               </div>
//               <div className="menu-item-actions">
//                 <button className="edit-btn-small" onClick={() => handleEdit(item)}>
//                   <span style={{ display: 'none' }}>ID: {item.partnerId}</span>
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

// export default PartnerMenu;


import { useState } from "react"; // Bỏ useEffect vì data do cha truyền xuống
import { Plus, Edit2, Trash2, Save, X } from "lucide-react";
import "./PartnerMenu.css";

// Thêm props: data (danh sách món), placeId (ID địa điểm), onRefresh (hàm gọi fetch lại ở Layout)
const PartnerMenu = ({ data, placeId, onRefresh }) => {
  // GIỮ NGUYÊN STATE QUẢN LÝ FORM
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
    category: "",
    image: ""
  });

  // menuItems bây giờ chính là data từ props
  const menuItems = data || [];

  const resetForm = () => {
    setFormData({ name: "", price: "", description: "", category: "", image: "" });
    setEditingItem(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // GIỮ NGUYÊN LOGIC SUBMIT CỦA TIÊN
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!placeId) return alert("Location not defined!");

    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const partnerId = String(user?.id);

      const payload = {
        ...formData,
        price: Number(formData.price),
        placeId: Number(placeId), // Dùng placeId từ props
        partnerId: partnerId,
        createdAt: new Date().toISOString()
      };

      let res;
      if (editingItem) {
        res = await fetch(`http://localhost:3001/menu/${editingItem.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
      } else {
        res = await fetch("http://localhost:3001/menu", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
      }

      if (res.ok) {
        // THAY ĐỔI: Gọi hàm refresh của Layout để fetch lại data tổng
        await onRefresh(); 
        setShowForm(false);
        resetForm();
        alert(editingItem ? "Update successfully!" : "Adding new item successfully!");
      }
    } catch (error) {
      console.error(error);
      alert("Error!");
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      price: item.price,
      description: item.description || "",
      category: item.category || "",
      image: item.image || ""
    });
    setShowForm(true);
  };

  // GIỮ NGUYÊN LOGIC DELETE
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    try {
      await fetch(`http://localhost:3001/menu/${id}`, { method: "DELETE" });
      await onRefresh(); // Refresh lại data tổng ở Layout
      alert("Delete successfully!");
    } catch (error) {
      console.error("Delete err:", error);
    }
  };

  // GIAO DIỆN GIỮ NGUYÊN 100%
  return (
    <div className="menu-container">
      <div className="menu-header">
        <h1>Menu Management</h1>
        <button className="add-btn" onClick={() => { resetForm(); setShowForm(true); }}>
          <Plus size={20} /> New item
        </button>
      </div>

      {showForm && (
        <div className="menu-form-container">
          <form onSubmit={handleSubmit} className="menu-form">
            <div className="form-title">
              {editingItem ? "Edit item" : "New item"}
              <button type="button" className="close-form" onClick={() => { setShowForm(false); resetForm(); }}>
                <X size={20} />
              </button>
            </div>
            <div className="form-grid">
              <div className="form-group">
                <label>Name item</label>
                <input type="text" name="name" value={formData.name} onChange={handleInputChange} required />
              </div>
              <div className="form-group">
                <label>Price (VNĐ)</label>
                <input type="number" name="price" value={formData.price} onChange={handleInputChange} required />
              </div>
              <div className="form-group">
                <label>Category</label>
                <select name="category" value={formData.category} onChange={handleInputChange} required>
                  <option value="">-- Select Category --</option>
                  <option value="Meat">Meat</option>
                  <option value="Seafood">Seafood</option>
                  <option value="Vegetarian">Vegetarian</option>
                  <option value="Street Food">Street Food</option>
                  <option value="Family-style">Family-style</option>
                  <option value="Set meals">Set meals</option>
                  <option value="Hotpot">Hotpot</option>
                </select>
              </div>
              <div className="form-group">
                <label>URL image</label>
                <input type="text" name="image" value={formData.image} onChange={handleInputChange} />
              </div>
              <div className="form-group full">
                <label>Description</label>
                <textarea name="description" value={formData.description} onChange={handleInputChange} rows={4} />
              </div>
            </div>
            <button type="submit" className="submit-btn">
              <Save size={20} /> {editingItem ? "Update item" : "Add item"}
            </button>
          </form>
        </div>
      )}

      <div className="menu-list">
        {menuItems.length === 0 ? (
          <p className="no-items">Your menu is empty. Start by adding a new item!</p>
        ) : (
          menuItems.map((item) => (
            <div key={item.id} className="menu-item-card">
              <div className="menu-item-image">
                {item.image ? <img src={item.image} alt={item.name} /> : <div className="no-image-small">No Image</div>}
              </div>
              <div className="menu-item-info">
                <h3>{item.name}</h3>
                <p className="price">{Number(item.price).toLocaleString("vi-VN")} ₫</p>
                {item.category && <p className="category">{item.category}</p>}
                {item.description && <p className="description">{item.description}</p>}
              </div>
              <div className="menu-item-actions">
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

export default PartnerMenu;