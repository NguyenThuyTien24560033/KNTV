// 1. Setup ban đầu: Khởi tạo state (email, password, loading, ẩn/hiện pass) và hook điều hướng (navigate).

// 2. Chặn mặc định: e.preventDefault() để trang không load lại khi nhấn nút.

// 3. Chống spam: Dùng state 'loading' để chặn user nhấn Submit liên tục khi đang xử lý.

// 4. Gọi API: Fetch dữ liệu từ server theo email và password.

// 5. Kiểm tra tài khoản: 
//    - Nếu không tìm thấy data -> Báo lỗi "Sai email/pass".
//    - Nếu tìm thấy nhưng role != "partner" -> Báo lỗi "Từ chối truy cập".

// 6. Lưu trữ: Lưu thông tin User và Token vào LocalStorage để duy trì trạng thái đăng nhập.

// 7. Đồng bộ: Bắn event 'userChanged' để các component khác cập nhật giao diện ngay lập tức.

// 8. Hoàn tất: Hiển thị thông báo thành công -> Đóng Modal -> Chuyển hướng về Dashboard/PartnerFirst.

// 9. Dọn dẹp: Tắt trạng thái 'loading' dù thành công hay thất bại (khối finally).








//useState: Hook quản lí state/data của components
import { useState } from "react";
//useNavigate: Hook chuyển trang/điều hướng các path
import { useNavigate } from "react-router-dom";
//Toaster, toast: lần lượt là component gốc và hàm: dùng để làm thông báo pop-up đẹp hơn
import { Toaster, toast } from "sonner";
import { Eye, EyeOff, X } from "lucide-react";
//import css 
import "./PartnerLogin.css";

//API
const API_BASE = "http://localhost:3001";

//
const PartnerLogin = ({ onClose }) => {
  //hàm điều hướng
  const navigate = useNavigate();

  //khai báo và khởi tạo các state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  //hàm handleSubmit: xử lí khi user nhấn nút submit
  const handleSubmit = async (e) => {
    //ngăn browser reload
    e.preventDefault();

    //khi click nút submit bật state loading để tránh liên tục gửi các request như nhau/ nhấn submit liên tục
    if (loading) return;
    //update state loading để bắt đầu xử lí
    setLoading(true);

    try {
     //gửi request
      const res = await fetch(
        `${API_BASE}/users?email=${email}&password=${password}`
      );
      //nhận respond dạng json -> object
      const data = await res.json().catch(() => null);

      //check xem respond trả về có hợp lệ ko
      if (!data || data.length === 0) {
        toast.error("Incorrect email or password");
        return;
      }

      //vì respond trả về là 1 array nên để thuận tiện thì lấy 1 account đầu
      const user = data[0];

      // check role
      if (user.role !== "partner") {
        toast.error("Access denied: Not a Partner account.");
        return;
      }

      // lưu token
      localStorage.setItem("token", "fake-partner-token");
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("role", user.role);
      //thông báo login thành công
      toast.success("Login successful!");

      // phát đi event userChanged để components khác lắng nghe
      window.dispatchEvent(new Event("userChanged"));

      // đóng modal nếu có
      if (onClose) {
        setTimeout(onClose, 800);
      }

      // chuyển trang
      setTimeout(() => {
        navigate("/partner");
      }, 1000);
    } catch (err) {
      console.error("Login Error:", err);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   if (loading) return;
  //   setLoading(true);

  //   try {
  //     // 1. CHUYỂN SANG POST: Gửi email/pass trong body để bảo mật
  //     const res = await fetch(`${API_BASE}/api/partner/login`, { // Thay endpoint thật ở đây
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({ email, password }),
  //       // 2. COOKIE: Cho phép trình duyệt nhận/gửi Cookie HttpOnly từ Backend
  //       credentials: "include", 
  //     });

  //     const result = await res.json();

  //     // 3. KIỂM TRA TRẠNG THÁI: Backend thật thường trả status 200/201 nếu OK
  //     if (!res.ok) {
  //       toast.error(result.message || "Incorrect email or password");
  //       return;
  //     }

  //     // 4. CHECK ROLE: Đảm bảo user đăng nhập là partner
  //     if (result.user.role !== "partner") {
  //       toast.error("Access denied: Not a Partner account.");
  //       return;
  //     }

  //     // 5. LƯU TOKEN THẬT: Không dùng "fake-partner-token" nữa
  //     localStorage.setItem("token", result.token); 
  //     localStorage.setItem("user", JSON.stringify(result.user));
  //     localStorage.setItem("role", result.user.role);

  //     toast.success("Login successful!");
  //     window.dispatchEvent(new Event("userChanged"));

  //     if (onClose) {
  //       setTimeout(onClose, 800);
  //     }

  //     setTimeout(() => {
  //       navigate("/partner/dashboard");
  //     }, 1000);

  //   } catch (err) {
  //     console.error("Login Error:", err);
  //     toast.error("Network error. Please try again.");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  return (
    <div className="login-overlay">
      <div className="login-container">
        <Toaster position="top-center" richColors />

        {/* khi click x truyền onClose để đóng modal */}
        <button className="close-x" onClick={onClose}>
          <X size={24} />
        </button>

        {/* tiêu đề và mô tả */}
        <div className="login-header">
          <h2>Partner Login</h2>
          <p>Sign in to manage locations</p>
        </div>


        <form onSubmit={handleSubmit} className="login-form">
          {/* Email */}
          <div className="input-group">
            <label>Email</label>
            <div className="input-wrapper">
              <input
                type="email"
                placeholder="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Password */}
          <div className="input-group">
            <label>Password</label>
            <div className="input-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="login-btn"
            disabled={loading}
          >
            {loading ? "Loading..." : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PartnerLogin;