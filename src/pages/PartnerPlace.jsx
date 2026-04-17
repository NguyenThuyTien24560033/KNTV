// // 1. Setup ban đầu: Khởi tạo các state quản lý dữ liệu địa điểm (place), form nhập liệu (formData), trạng thái sửa (isEditing) và loading/saving.

// // 2. Nhận diện Partner: Lấy thông tin user từ LocalStorage ngay khi component mount để xác định đối tượng đang đăng nhập.

// // 3. Kiểm tra quyền truy cập: Nếu không tìm thấy user (chưa login), bắn lỗi qua Toast và dừng mọi tiến trình tải dữ liệu.

// // 4. Tải dữ liệu (Fetch): Gọi API lấy danh sách địa điểm theo 'partnerId' từ server để hiển thị thông tin riêng của đối tác đó.

// // 5. Kiểm tra dữ liệu trống: 
// //    - Nếu data rỗng -> Báo lỗi "Partner chưa có địa điểm" trong console và reset trắng form.
// //    - Nếu có data -> Lấy bản ghi đầu tiên (data[0]) để làm dữ liệu gốc.

// // 6. Đồng bộ Form: Đổ dữ liệu từ API vào 'formData' để người dùng có thể xem và chuẩn bị chỉnh sửa trên giao diện.

// // 7. Theo dõi nhập liệu: Dùng hàm 'handleInputChange' để cập nhật liên tục các thay đổi từ bàn phím vào state 'formData'.

// // 8. Gửi cập nhật (PATCH): Khi nhấn Save, kiểm tra ID hợp lệ rồi gửi yêu cầu cập nhật một phần dữ liệu lên Server (giữ nguyên partnerId).

// // 9. Đồng bộ kết quả: Nhận respond từ Server -> Chuyển JSON thành Object -> Cập nhật lại giao diện bằng dữ liệu mới nhất.

// // 10. Hoàn tất & Dọn dẹp: Hiển thị Toast thành công -> Tắt chế độ chỉnh sửa (isEditing = false) -> Tắt trạng thái 'saving' ở khối finally.





import { useState, useEffect } from "react";
import { Toaster, toast } from "sonner";
import {
  Save,
  Edit2
} from "lucide-react";
import "./PartnerPlace.css";

const API_BASE = "http://localhost:3001";

const PartnerPlace = () => {
  //state
  const [place, setPlace] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    phone: "",
    description: "",
    image: "",
    category: "",
  });


useEffect(() => {
  const fetchPlace = async () => {
    try {
      //lấy data user
      // const user = JSON.parse(localStorage.getItem("user"));
      // console.table(user);
      const rawUser = localStorage.getItem("user");
        const user = JSON.parse(rawUser);

        console.log("--- KIỂM TRA LOCALSTORAGE ---");
        console.log("Dữ liệu thô (string):", rawUser);
        console.table(user); // In dạng bảng cho đẹp
        console.log("Kiểu dữ liệu của ID:", typeof user?.id);

      //check xem login chưa
      if (!user){
        toast.error("Not logged in!"); 
        setLoading(false);
        return; 
      }

      //lấy partnerId bằng id 
      const partnerId = String(user.id); 
      // 
      // const partnerId = Number(user.id); 

      console.log("Đang gọi API với partnerId:", partnerId);

      //nhận respond từ backend
      const res = await fetch(
        `${API_BASE}/locations?partnerId=${partnerId}`
      );

      //chuyển res thành object
      const data = await res.json();

      //logic đúng là partner luôn tồn tại ít nhất 1 place
      if (data.length === 0) {
        console.error("Partner has no location! Please check the database.");
        setPlace(null);
        setFormData({
          name: "",
          address: "",
          phone: "",
          description: "",
          image: "",
          category: "",
        });
        return;
      }

      const currentPlace = data[0];

      setPlace(currentPlace);
      setFormData({
        name: currentPlace.name || "",
        address: currentPlace.address || "",
        phone: currentPlace.phone || "",
        description: currentPlace.description || "",
        image: currentPlace.image || "",
        category: currentPlace.category || "",
      });

    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  fetchPlace();
}, []);



  // input
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };


  //xử lí click save
  const handleSave = async () => {
    //check xem place có hợp lệ ko
    if (!place?.id) {
     toast.error("No location found to update!");
      return;
    }

    setSaving(true);

    try {
     
      //gửi API để chỉnh sửa
      const res = await fetch(`${API_BASE}/locations/${place.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          partnerId: place.partnerId, 
        }),
      });

      //nhận respond
      const resultText = await res.text();
      console.log("Server response:", resultText);

      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

      //chuyển thành object
      const updatedPlace = JSON.parse(resultText);

      //update data
      setPlace(updatedPlace);
      setFormData({
        name: updatedPlace.name || "",
        address: updatedPlace.address || "",
        phone: updatedPlace.phone || "",
        description: updatedPlace.description || "",
        image: updatedPlace.image || "",
        category: updatedPlace.category || "",
      });

      setIsEditing(false);
      toast.success("Update successful!");
    } catch (err) {
      console.error("Save failed:", err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="place-container">
      <div className="place-header">
        <Toaster position="top-center" richColors />
        <h1>Location Information</h1>

        <button
          className="edit-btn"
          onClick={() => setIsEditing(!isEditing)}
        >
          {isEditing ? "Cancel" : (
            <>
              <Edit2 size={18} /> Edit
            </>
          )}
        </button>
      </div>

  


      {place ? (
        <div className="place-content">
          {/* IMAGE */}
          <div className="place-image-section">
            <div className="image-preview">
              {formData.image ? (
                <img src={formData.image} alt="Place" />
              ) : (
                <div className="no-image">
                  <p>No image</p>
                </div>
              )}
            </div>

            {isEditing && (
              <input
                type="text"
                name="image"
                placeholder="Image URL..."
                value={formData.image}
                onChange={handleInputChange}
                className="image-url-input"
              />
            )}
          </div>

          {/* FORM */}
          <div className="place-form">
            <div className="form-group">
              <label>Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                disabled={!isEditing}
              />
            </div>

            <div className="form-group">
              <label>Address</label>
              <div className="input-with-icon">
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Phone</label>
              <div className="input-with-icon">
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Category</label>
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                disabled={!isEditing}
              />
            </div>

            <div className="form-group full">
              <label>Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                disabled={!isEditing}
                rows={5}
              />
            </div>

            {isEditing && (
              <button
                className="save-btn"
                onClick={handleSave}
                disabled={saving}
              >
                <Save size={20} />
                {saving ? "Saving..." : "Save"}
              </button>
            )}
          </div>
        </div>
      ) : (
        <p style={{ marginTop: "20px" }}>
          No locations found.
        </p>
      )}
    </div>
  );
};

export default PartnerPlace;




/**
 * PartnerPlace.jsx
 * -----------------
 * Component quản lý thông tin địa điểm của Partner.
 * Flow:
 *  1. Khởi tạo state quản lý dữ liệu địa điểm (place), form nhập liệu (formData), trạng thái sửa (isEditing), loading/saving.
 *  2. Lấy thông tin user từ localStorage để xác định partner đang đăng nhập.
 *  3. Nếu chưa login → báo lỗi qua Toast và dừng tiến trình.
 *  4. Fetch dữ liệu location theo partnerId từ JSON Server.
 *  5. Nếu không có dữ liệu → báo lỗi trong console, reset trắng form.
 *  6. Nếu có dữ liệu → lấy bản ghi đầu tiên làm dữ liệu gốc.
 *  7. Đổ dữ liệu vào formData để hiển thị và chuẩn bị chỉnh sửa.
 *  8. Theo dõi nhập liệu qua handleInputChange để cập nhật state formData.
 *  9. Khi Save → gửi PATCH request lên server, giữ nguyên partnerId.
 * 10. Nhận dữ liệu mới từ server → cập nhật lại state và giao diện, hiển thị Toast thành công.
 */

// import { useState, useEffect } from "react";
// import { Toaster, toast } from "sonner";
// import { Save, Edit2 } from "lucide-react";
// import "./PartnerPlace.css";

// const API_BASE = "http://localhost:3001";

// const PartnerPlace = () => {
//   // ==================== STATE ====================
//   const [place, setPlace] = useState(null); // dữ liệu địa điểm hiện tại
//   const [isEditing, setIsEditing] = useState(false); // trạng thái chỉnh sửa
//   const [loading, setLoading] = useState(true); // trạng thái loading khi fetch
//   const [saving, setSaving] = useState(false); // trạng thái saving khi PATCH
//   const [formData, setFormData] = useState({
//     name: "",
//     address: "",
//     phone: "",
//     description: "",
//     image: "",
//     category: "",
//   });

//   // ==================== FETCH DATA ====================
//   useEffect(() => {
//     const fetchPlace = async () => {
//       try {
//         // Lấy thông tin user từ localStorage
//         const user = JSON.parse(localStorage.getItem("user"));

//         // Nếu chưa login → báo lỗi và dừng
//         if (!user) {
//           toast.error("Not logged in!");
//           setLoading(false);
//           return;
//         }

//         const partnerId = user.id;

//         // Fetch dữ liệu location theo partnerId
//         const res = await fetch(`${API_BASE}/locations?partnerId=${partnerId}`);
//         const data = await res.json();

//         // Nếu không có dữ liệu location
//         if (data.length === 0) {
//           console.error("Partner has no location! Please check the database.");
//           setPlace(null);
//           setFormData({
//             name: "",
//             address: "",
//             phone: "",
//             description: "",
//             image: "",
//             category: "",
//           });
//           return;
//         }

//         // Nếu có dữ liệu → lấy bản ghi đầu tiên
//         const currentPlace = data[0];
//         setPlace(currentPlace);

//         // Đổ dữ liệu vào formData
//         setFormData({
//           name: currentPlace.name || "",
//           address: currentPlace.address || "",
//           phone: currentPlace.phone || "",
//           description: currentPlace.description || "",
//           image: currentPlace.image || "",
//           category: currentPlace.category || "",
//         });
//       } catch (error) {
//         console.error("Error:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchPlace();
//   }, []);

//   // ==================== HANDLE INPUT ====================
//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     // Cập nhật formData theo input
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   // ==================== HANDLE SAVE ====================
//   const handleSave = async () => {
//     // Kiểm tra place hợp lệ
//     if (!place?.id) {
//       toast.error("No location found to update!");
//       return;
//     }

//     setSaving(true);

//     try {
//       // Gửi PATCH request lên server
//       const res = await fetch(`${API_BASE}/locations/${place.id}`, {
//         method: "PATCH",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           ...formData,
//           partnerId: place.partnerId, // giữ nguyên partnerId
//         }),
//       });

//       const resultText = await res.text();
//       console.log("Server response:", resultText);

//       if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

//       // Chuyển dữ liệu mới thành object
//       const updatedPlace = JSON.parse(resultText);

//       // Cập nhật lại state
//       setPlace(updatedPlace);
//       setFormData({
//         name: updatedPlace.name || "",
//         address: updatedPlace.address || "",
//         phone: updatedPlace.phone || "",
//         description: updatedPlace.description || "",
//         image: updatedPlace.image || "",
//         category: updatedPlace.category || "",
//       });

//       setIsEditing(false);
//       toast.success("Update successful!");
//     } catch (err) {
//       console.error("Save failed:", err);
//       toast.error("Update failed!");
//     } finally {
//       setSaving(false);
//     }
//   };

//   // ==================== RENDER ====================
//   if (loading) return <div className="loading">Loading...</div>;

//   return (
//     <div className="place-container">
//       <div className="place-header">
//         <Toaster position="top-center" richColors />
//         <h1>Location Information</h1>

//         {/* Nút Edit/Cancel */}
//         <button className="edit-btn" onClick={() => setIsEditing(!isEditing)}>
//           {isEditing ? "Cancel" : (
//             <>
//               <Edit2 size={18} /> Edit
//             </>
//           )}
//         </button>
//       </div>

//       {place ? (
//         <div className="place-content">
//           {/* IMAGE */}
//           <div className="place-image-section">
//             <div className="image-preview">
//               {formData.image ? (
//                 <img src={formData.image} alt="Place" />
//               ) : (
//                 <div className="no-image">
//                   <p>No image</p>
//                 </div>
//               )}
//             </div>

//             {isEditing && (
//               <input
//                 type="text"
//                 name="image"
//                 placeholder="Image URL..."
//                 value={formData.image}
//                 onChange={handleInputChange}
//                 className="image-url-input"
//               />
//             )}
//           </div>

//           {/* FORM */}
//           <div className="place-form">
//             <div className="form-group">
//               <label>Name</label>
//               <input
//                 type="text"
//                 name="name"
//                 value={formData.name}
//                 onChange={handleInputChange}
//                 disabled={!isEditing}
//               />
//             </div>

//             <div className="form-group">
//               <label>Address</label>
//               <input
//                 type="text"
//                 name="address"
//                 value={formData.address}
//                 onChange={handleInputChange}
//                 disabled={!isEditing}
//               />
//             </div>

//             <div className="form-group">
//               <label>Phone</label>
//               <input
//                 type="tel"
//                 name="phone"
//                 value={formData.phone}
//                 onChange={handleInputChange}
//                 disabled={!isEditing}
//               />
//             </div>

//             <div className="form-group">
//               <label>Category</label>
//               <input
//                 type="text"
//                 name="category"
//                 value={formData.category}
//                 onChange={handleInputChange}
//                 disabled={!isEditing}
//               />
//             </div>

//             <div className="form-group full">
//               <label>Description</label>
//               <textarea
//                 name="description"
//                 value={formData.description}
//                 onChange={handleInputChange}
//                 disabled={!isEditing}
//                 rows={5}
//               />
//             </div>

//             {/* Nút Save */}
//             {isEditing && (
//               <button
//                 className="save-btn"
//                 onClick={handleSave}
//                 disabled={saving}
//               >
//                 <Save size={20} />
//                 {saving ? "Saving..." : "Save"}
//               </button>
//             )}
//           </div>
//         </div>
//       ) : (
//         <p style={{ marginTop: "20px" }}>No locations found.</p>
//       )}
//     </div>
//   );
// };

// export default PartnerPlace;
