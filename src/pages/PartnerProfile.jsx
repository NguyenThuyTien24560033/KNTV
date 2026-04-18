

// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import "./PartnerProfile.css";

// const API_BASE = "http://localhost:3001";

// const PartnerProfile = () => {
//   const navigate = useNavigate();

//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);
//   const [message, setMessage] = useState({ type: "", text: "" });

//   const [showEditModal, setShowEditModal] = useState(false);
//   const [showPasswordModal, setShowPasswordModal] = useState(false);

//   const [formData, setFormData] = useState({
//     name: "",
//     phoneNumber: "",
//   });

//   const [passwordData, setPasswordData] = useState({
//     currentPassword: "",
//     newPassword: "",
//     confirmPassword: "",
//   });

//   // ==================== LOAD USER ====================
//   useEffect(() => {
//     const storedUser = localStorage.getItem("user");

//     if (!storedUser) {
//       setLoading(false);
//       return;
//     }

//     const parsedUser = JSON.parse(storedUser);

//     // 🔥 ép id về string cho chắc
//     parsedUser.id = String(parsedUser.id);

//     console.log("USER:", parsedUser);

//     setUser(parsedUser);
//     setFormData({
//       name: parsedUser.name || "",
//       phoneNumber: parsedUser.phoneNumber || "",
//     });

//     setLoading(false);
//   }, []);

//   // ==================== INPUT ====================
//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handlePasswordInputChange = (e) => {
//     const { name, value } = e.target;
//     setPasswordData((prev) => ({ ...prev, [name]: value }));
//   };

//   // ==================== UPDATE PROFILE ====================
//   const handleUpdateProfile = async (e) => {
//     e.preventDefault();

//     if (!user?.id) {
//       setMessage({ type: "error", text: "Không tìm thấy user ID!" });
//       return;
//     }

//     setSaving(true);
//     setMessage({ type: "", text: "" });

//     try {
//       // 🔥 check tồn tại
//       const check = await fetch(`${API_BASE}/users/${user.id}`);
//       if (!check.ok) throw new Error("User không tồn tại!");

//       const res = await fetch(`${API_BASE}/users/${user.id}`, {
//         method: "PATCH",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           name: formData.name,
//           phoneNumber: formData.phoneNumber,
//         }),
//       });

//       if (res.ok) {
//         const updatedUser = {
//           ...user,
//           name: formData.name,
//           phoneNumber: formData.phoneNumber,
//         };

//         localStorage.setItem("user", JSON.stringify(updatedUser));
//         setUser(updatedUser);

//         setMessage({ type: "success", text: "Cập nhật thành công!" });
//         setShowEditModal(false);
//       } else {
//         setMessage({ type: "error", text: "Cập nhật thất bại!" });
//       }
//     } catch (err) {
//       console.error(err);
//       setMessage({ type: "error", text: err.message });
//     } finally {
//       setSaving(false);
//     }
//   };

//   // ==================== CHANGE PASSWORD ====================
//   const handleChangePassword = async (e) => {
//     e.preventDefault();

//     if (!user?.id) {
//       setMessage({ type: "error", text: "Không tìm thấy user!" });
//       return;
//     }

//     // 🔥 json-server không check → tự check
//     if (passwordData.currentPassword !== user.password) {
//       setMessage({ type: "error", text: "Sai mật khẩu hiện tại!" });
//       return;
//     }

//     if (passwordData.newPassword !== passwordData.confirmPassword) {
//       setMessage({ type: "error", text: "Mật khẩu không khớp!" });
//       return;
//     }

//     if (passwordData.newPassword.length < 6) {
//       setMessage({ type: "error", text: "Mật khẩu >= 6 ký tự!" });
//       return;
//     }

//     setSaving(true);
//     setMessage({ type: "", text: "" });

//     try {
//       // 🔥 check tồn tại
//       const check = await fetch(`${API_BASE}/users/${user.id}`);
//       if (!check.ok) throw new Error("User không tồn tại!");

//       const res = await fetch(`${API_BASE}/users/${user.id}`, {
//         method: "PATCH",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           password: passwordData.newPassword,
//         }),
//       });

//       if (res.ok) {
//         const updatedUser = {
//           ...user,
//           password: passwordData.newPassword,
//         };

//         localStorage.setItem("user", JSON.stringify(updatedUser));
//         setUser(updatedUser);

//         setMessage({ type: "success", text: "Đổi mật khẩu thành công!" });
//         setShowPasswordModal(false);

//         setPasswordData({
//           currentPassword: "",
//           newPassword: "",
//           confirmPassword: "",
//         });
//       } else {
//         setMessage({ type: "error", text: "Đổi mật khẩu thất bại!" });
//       }
//     } catch (err) {
//       console.error(err);
//       setMessage({ type: "error", text: err.message });
//     } finally {
//       setSaving(false);
//     }
//   };

//   if (loading) return <div className="loading">Đang tải...</div>;

//   return (
//     <div className="profile-container">
//       <h2>Thông tin cá nhân</h2>

//       {message.text && <div className={`message ${message.type}`}>{message.text}</div>}

//       <p>Email: {user?.email}</p>
//       <p>Tên: {user?.name}</p>
//       <p>SĐT: {user?.phoneNumber}</p>

//       <button onClick={() => setShowEditModal(true)}>Chỉnh sửa</button>
//       <button onClick={() => setShowPasswordModal(true)}>Đổi mật khẩu</button>

//       {/* EDIT */}
//       {showEditModal && (
//         <form onSubmit={handleUpdateProfile}>
//           <input
//             name="name"
//             value={formData.name}
//             onChange={handleInputChange}
//             placeholder="Tên"
//           />
//           <input
//             name="phoneNumber"
//             value={formData.phoneNumber}
//             onChange={handleInputChange}
//             placeholder="SĐT"
//           />
//           <button type="submit">{saving ? "Đang lưu..." : "Lưu"}</button>
//         </form>
//       )}

//       {/* PASSWORD */}
//       {showPasswordModal && (
//         <form onSubmit={handleChangePassword}>
//           <input
//             type="password"
//             name="currentPassword"
//             placeholder="Mật khẩu hiện tại"
//             value={passwordData.currentPassword}
//             onChange={handlePasswordInputChange}
//           />
//           <input
//             type="password"
//             name="newPassword"
//             placeholder="Mật khẩu mới"
//             value={passwordData.newPassword}
//             onChange={handlePasswordInputChange}
//           />
//           <input
//             type="password"
//             name="confirmPassword"
//             placeholder="Nhập lại mật khẩu"
//             value={passwordData.confirmPassword}
//             onChange={handlePasswordInputChange}
//           />
//           <button type="submit">{saving ? "Đang xử lý..." : "Đổi mật khẩu"}</button>
//         </form>
//       )}
//     </div>
//   );
// };

// export default PartnerProfile;




/**
 * PartnerProfile.jsx
 * ------------------
 * Component quản lý thông tin cá nhân của Partner.
 * - Hiển thị thông tin cơ bản (email, name, phone number).
 * - Cho phép chỉnh sửa profile (name, phone number).
 * - Cho phép đổi mật khẩu (tự kiểm tra currentPassword, newPassword, confirmPassword).
 * - Dữ liệu được lưu và cập nhật qua JSON Server (API_BASE).
 * - Đồng bộ lại LocalStorage sau khi cập nhật để giữ trạng thái đăng nhập.
 * 
 * Luồng hoạt động:
 * 1. Load user từ LocalStorage khi component mount.
 * 2. Nếu không có user → dừng và báo lỗi.
 * 3. Hiển thị thông tin user hiện tại.
 * 4. Cho phép mở modal chỉnh sửa profile hoặc đổi mật khẩu.
 * 5. Khi submit form → gọi API PATCH để cập nhật dữ liệu.
 * 6. Cập nhật lại LocalStorage và state user.
 * 7. Hiển thị thông báo thành công/thất bại (toàn bộ bằng tiếng Anh).
 */

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./PartnerProfile.css";

const API_BASE = "http://localhost:3001";

const PartnerProfile = () => {
  const navigate = useNavigate();

  // State quản lý user và trạng thái
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  // State quản lý modal
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  // State form chỉnh sửa profile
  const [formData, setFormData] = useState({
    name: "",
    phoneNumber: "",
  });

  // State form đổi mật khẩu
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // ==================== LOAD USER ====================
  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      setLoading(false);
      return;
    }

    const parsedUser = JSON.parse(storedUser);
    parsedUser.id = String(parsedUser.id); // ép id về string

    setUser(parsedUser);
    setFormData({
      name: parsedUser.name || "",
      phoneNumber: parsedUser.phoneNumber || "",
    });

    setLoading(false);
  }, []);

  // ==================== INPUT HANDLERS ====================
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordInputChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
  };

  // ==================== UPDATE PROFILE ====================
  const handleUpdateProfile = async (e) => {
    e.preventDefault();

    if (!user?.id) {
      setMessage({ type: "error", text: "User ID not found!" });
      return;
    }

    setSaving(true);
    setMessage({ type: "", text: "" });

    try {
      const check = await fetch(`${API_BASE}/users/${user.id}`);
      if (!check.ok) throw new Error("User does not exist!");

      const res = await fetch(`${API_BASE}/users/${user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          phoneNumber: formData.phoneNumber,
        }),
      });

      if (res.ok) {
        const updatedUser = {
          ...user,
          name: formData.name,
          phoneNumber: formData.phoneNumber,
        };

        localStorage.setItem("user", JSON.stringify(updatedUser));
        setUser(updatedUser);

        setMessage({ type: "success", text: "Profile updated successfully!" });
        setShowEditModal(false);
      } else {
        setMessage({ type: "error", text: "Profile update failed!" });
      }
    } catch (err) {
      console.error(err);
      setMessage({ type: "error", text: err.message });
    } finally {
      setSaving(false);
    }
  };

  // ==================== CHANGE PASSWORD ====================
  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (!user?.id) {
      setMessage({ type: "error", text: "User not found!" });
      return;
    }

    // json-server không check → tự kiểm tra
    if (passwordData.currentPassword !== user.password) {
      setMessage({ type: "error", text: "Incorrect current password!" });
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ type: "error", text: "Passwords do not match!" });
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setMessage({ type: "error", text: "Password must be at least 6 characters!" });
      return;
    }

    setSaving(true);
    setMessage({ type: "", text: "" });

    try {
      const check = await fetch(`${API_BASE}/users/${user.id}`);
      if (!check.ok) throw new Error("User does not exist!");

      const res = await fetch(`${API_BASE}/users/${user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          password: passwordData.newPassword,
        }),
      });

      if (res.ok) {
        const updatedUser = {
          ...user,
          password: passwordData.newPassword,
        };

        localStorage.setItem("user", JSON.stringify(updatedUser));
        setUser(updatedUser);

        setMessage({ type: "success", text: "Password changed successfully!" });
        setShowPasswordModal(false);

        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      } else {
        setMessage({ type: "error", text: "Password change failed!" });
      }
    } catch (err) {
      console.error(err);
      setMessage({ type: "error", text: err.message });
    } finally {
      setSaving(false);
    }
  };

  // ==================== RENDER ====================
  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="profile-container">
      <h2>Profile Information</h2>

      {/* Hiển thị thông báo */}
      {message.text && <div className={`message ${message.type}`}>{message.text}</div>}

      {/* Thông tin cơ bản */}
      <p>Email: {user?.email}</p>
      <p>Name: {user?.name}</p>
      <p>Phone: {user?.phoneNumber}</p>

      {/* Nút mở modal */}
      <button onClick={() => setShowEditModal(true)}>Edit Profile</button>
      <button onClick={() => setShowPasswordModal(true)}>Change Password</button>

      {/* Modal chỉnh sửa profile */}
      {showEditModal && (
        <form onSubmit={handleUpdateProfile}>
          <input
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Name"
          />
          <input
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleInputChange}
            placeholder="Phone Number"
          />
          <button type="submit">{saving ? "Saving..." : "Save"}</button>
        </form>
      )}

      {/* Modal đổi mật khẩu */}
      {showPasswordModal && (
        <form onSubmit={handleChangePassword}>
          <input
            type="password"
            name="currentPassword"
            placeholder="Current Password"
            value={passwordData.currentPassword}
            onChange={handlePasswordInputChange}
          />
          <input
            type="password"
            name="newPassword"
            placeholder="New Password"
            value={passwordData.newPassword}
            onChange={handlePasswordInputChange}
          />
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={passwordData.confirmPassword}
            onChange={handlePasswordInputChange}
          />
          <button type="submit">{saving ? "Processing..." : "Change Password"}</button>
        </form>
      )}
    </div>
  );
};

export default PartnerProfile;
