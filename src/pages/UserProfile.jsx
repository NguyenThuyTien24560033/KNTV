//Điều hướng: Nếu không tìm thấy user, hệ thống tự động đẩy người dùng về trang /users (Login).
//Đổ dữ liệu: Nếu có user, dữ liệu được chuyển từ dạng JSON sang Object để hiển thị lên giao diện và điền sẵn vào Form chỉnh sửa.
//Profile Update
//Theo dõi nhập liệu: Hàm handleChange cập nhật liên tục những gì người dùng gõ vào state formData.
//Lưu dữ liệu (handleSave):
//Gửi request PUT lên API kèm theo dữ liệu mới.
//Nếu thành công: Cập nhật lại localStorage, cập nhật state hiển thị, thông báo thành công và đóng chế độ sửa.
//Phát một sự kiện (userChanged) để các phần khác của website (như Menu/Navbar) cập nhật lại tên hiển thị.
// Change Password
//Hiển thị: Nhấn nút sẽ mở một giao diện đè lên (Modal).
//Kiểm chứng: * Kiểm tra mật khẩu cũ có khớp với mật khẩu hiện tại không.
//Kiểm tra mật khẩu mới và mật khẩu xác nhận có trùng nhau không.
//Cập nhật: Nếu hợp lệ, gửi request PUT lên server để ghi đè mật khẩu mới. Reset toàn bộ các ô nhập mật khẩu về rỗng sau khi xong.
//Logout
//Xóa dấu vết: Xóa sạch user, token, role trong bộ nhớ trình duyệt (localStorage).
//Đồng bộ: Phát sự kiện userChanged để toàn bộ ứng dụng biết trạng thái đã đăng xuất.
//Chuyển hướng: Đưa người dùng quay về trang chủ /.

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./UserProfile.css";
import { User } from "lucide-react";
import { Toaster, toast } from "sonner";

const UserProfile = () => {
  const navigate = useNavigate();
  // Khởi tạo các state: thông tin user, trạng thái chỉnh sửa, form nhập liệu và đổi mật khẩu
  const [user, setUser] = useState(null);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [showChangePassword, setShowChangePassword] = useState(false);
  // Các state riêng cho chức năng đổi mật khẩu
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // API
  const API = "http://localhost:3001/users";

  //Kiểm tra đăng nhập khi component mount
  
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    //Lấy dữ liệu từ localStorage, nếu không có thì điều hướng về trang login
    if (!storedUser) {
      navigate("/users");
      return;
    }
    // Chuyển đổi chuỗi JSON từ localStorage thành đối tượng JS để sử dụng
    const userData = JSON.parse(storedUser);
    // Cập nhật thông tin người dùng hiện tại vào state chính
    setUser(userData);
    // Khởi tạo dữ liệu ban đầu cho form chỉnh sửa (để các ô input có sẵn dữ liệu cũ)
    setFormData(userData);
  }, []);

  // Hàm xử lý khi người dùng nhập liệu vào các ô input
  const handleChange = (e) => {
    // Cập nhật formData: giữ nguyên các trường cũ, chỉ thay đổi trường đang nhập [e.target.name]
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  //UPDATE PROFILE 
  const handleSave = async () => {
    try {
      const res = await fetch(`${API}/${user.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          // Giữ lại dữ liệu cũ (như role, id...)
          ...user,
          // Ghi đè các dữ liệu mới từ form
          ...formData,
        }),
      });

      // Nhận dữ liệu phản hồi đã cập nhật từ server
      const data = await res.json();
      // Cập nhật lại localStorage
      localStorage.setItem("user", JSON.stringify(data));
      setUser(data);
      setFormData(data);
      setEditing(false);
      // Bắn sự kiện để các component khác cập nhật theo
      window.dispatchEvent(new Event("userChanged"));
      toast.success("Update successful!");
    } catch (err) {
      toast.error("Update failed");
    }
  };

  // Hàm đăng xuất
  const handleLogout = () => {
    // Xóa
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    // Thông báo cho toàn ứng dụng biết user đã logout
    window.dispatchEvent(new Event("userChanged"));
    navigate("/");
  };

  //CHANGE PASSWORD
  const handleChangePassword = async (e) => {
    // Ngăn trang web bị tải lại khi submit form
    e.preventDefault();

    if (oldPassword !== user.password) {
      toast.error("Old password incorrect");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      const res = await fetch(`${API}/${user.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...user,
          // Chỉ thay đổi trường mật khẩu
          password: newPassword,
        }),
      });

      const data = await res.json();

      localStorage.setItem("user", JSON.stringify(data));
      setUser(data);

      toast.success("Password changed!");
      setShowChangePassword(false);
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      toast.error("Change password failed");
    }
  };

  if (!user) return null;

  return (
    <div className="profile-container">
      <Toaster position="top-center" richColors />

      {showChangePassword ? (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Change Password</h3>

            <form onSubmit={handleChangePassword}>
              <input
                type="password"
                placeholder="Old password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                required
              />

              <input
                type="password"
                placeholder="New password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />

              <input
                type="password"
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />

              <button type="submit">Save</button>
            </form>

            <button
              onClick={() => setShowChangePassword(false)}
              className="close-btn"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="profile-card">
          <User className="profile-icon" />

          <div className="profile-info">
            <input
              name="name"
              value={formData.name || ""}
              onChange={handleChange}
              disabled={!editing}
              placeholder="Name"
            />

            <input
              name="email"
              value={formData.email || ""}
              onChange={handleChange}
              disabled={!editing}
              placeholder="Email"
            />

            <input
              name="phoneNumber"
              value={formData.phoneNumber || ""}
              onChange={handleChange}
              disabled={!editing}
              placeholder="Phone"
            />

            <input
              name="address"
              value={formData.address || ""}
              onChange={handleChange}
              disabled={!editing}
              placeholder="Address"
            />
          </div>

          <div className="button-group">
            {!editing ? (
              <>
                {user.role !== "partner" && (
                  <>
                    <button onClick={() => setEditing(true)}>
                      Edit
                    </button>

                    <button
                      onClick={() => setShowChangePassword(true)}
                    >
                      Change Password
                    </button>
                  </>
                )}

                <button onClick={handleLogout}>Logout</button>
              </>
            ) : (
              <>
                <button onClick={handleSave}>Save</button>

                <button
                  onClick={() => {
                    setEditing(false);
                    setFormData(user);
                  }}
                >
                  Cancel
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;