//Khởi tạo (State): Quản lý trạng thái đóng/mở form, dữ liệu nhập (email, pass...) và trạng thái chờ (loading).
//Kiểm tra (Validate): Xác thực định dạng email, độ dài mật khẩu và khớp mật khẩu (khi đăng ký).
//Xử lý Đăng ký (Register): Kiểm tra email tồn tại trên Server -> Gửi POST request để tạo mới user.
//Xử lý Đăng nhập (Login): Gửi GET request kèm query để xác thực tài khoản từ Server.
//Lưu trữ (Storage): Lưu thông tin User, Role và Token vào localStorage nếu thành công.
//Đồng bộ (Dispatch): Phát tín hiệu userChanged để các Component khác (như Header) cập nhật lại giao diện.

import { useState } from "react";
import "./UserLogin.css";
import { Toaster, toast } from "sonner";
import { useNavigate } from "react-router-dom";

const UserLogin = ({ onBack }) => {
  //isLogin = true là form Đăng nhập, false là form Đăng ký
  const [isLogin, setIsLogin] = useState(true);

  // Các state lưu giá trị từ ô nhập liệu
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  // Trạng thái đang gửi dữ liệu lên server
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();


  // Hàm kiểm tra dữ liệu đầu vào trước khi gửi đi
  const validate = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      toast.error("Email invalid");
      return false;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return false;
    }

    // Chỉ kiểm tra khớp mật khẩu khi đang ở chế độ Đăng ký
    if (!isLogin && password !== confirmPassword) {
      toast.error("Passwords do not match");
      return false;
    }

    return true;
  };

  //REGISTER
  const registerUser = async () => {
    try {
      const res = await fetch(import.meta.env.VITE_Register, { // Thay bằng endpoint thật
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          email: email,
          password: password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        console.log("No OK:", data);
        // Backend thật trả về lỗi (ví dụ: Email already exists)
        toast.error(data.message || "Registration failed");
        return null;
      }

      toast.success("Register success!");
      setIsLogin(true);
      return data;
    } catch (err) {
      console.log("Backend Error:", err);
      toast.error("Server connection error");
      return null;
    }
  };

  // LOGIN 
  const loginUser = async () => {
    try {
      // Tiên
      const res = await fetch(
        `${API}?email=${email}&password=${password}`
      );

      // Khang
      // const res = await fetch(import.meta.env.VITE_Login, { // Thay bằng endpoint thật
      //   method: "POST", // BẮT BUỘC dùng POST
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ email, password }),
      //   // credentials: "include" là để trình duyệt tự lưu Cookie HttpOnly nếu Backend có gửi kèm
      //   credentials: "include", 
      // });

      const data = await res.json();

      if (!res.ok) {
        console.log("No OK:", data);
        toast.error(data.message || "Invalid credentials");
        return null;
      }

      // data thường trả về: { token: "...", user: { id, name, role... } }
      return data; 
    } catch (err) {
      console.log("Backend Error:", err);
      toast.error("Server connection error");
      return null;
    }
  };

//   const loginUser = async () => {
//   try {
//     const res = await fetch("http://localhost:3001/api/login", { // Thay endpoint thật của Backend
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({ email, password }),
//       // Quan trọng: Để trình duyệt tự nhận và lưu Cookie nếu Backend trả về Set-Cookie
//       credentials: "include", 
//     });

//     if (!res.ok) {
//       const errorData = await res.json();
//       toast.error(errorData.message || "Login failed");
//       return null;
//     }

//     const data = await res.json();
//     // data bây giờ thường sẽ có dạng: { token: "abc...", user: { id: 1, name: "..." } }
//     return data; 
//   } catch (err) {
//     toast.error("Network error");
//     return null;
//   }
// };

  // Hàm xử lý chính khi nhấn nút Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!validate()) {
      setLoading(false);
      return;
    }

    try {
      if (isLogin) {
        const response = await loginUser();

        if (response) {
          // response ở đây là 'data' từ loginUser trả về
          const { token, user } = response;

          // LƯU DỮ LIỆU THẬT
          localStorage.setItem("token", token); 
          localStorage.setItem("user", JSON.stringify(user));
          localStorage.setItem("role", user.role);
          localStorage.setItem("userId", user.id);

          window.dispatchEvent(new Event("userChanged"));
          toast.success("Login success!");
          navigate("/");
          if (onBack) onBack();
        }
      } else {
        const result = await registerUser();
        if (result) {
          setUsername("");
          setEmail("");
          setPassword("");
          setConfirmPassword("");
        }
      }
    } catch (err) {
      toast.error("An error occurred");
    } finally {
      setLoading(false);
    }
  };

//   const handleSubmit = async (e) => {
//   e.preventDefault();
//   setLoading(true);

//   if (!validate()) {
//     setLoading(false);
//     return;
//   }

//   try {
//     if (isLogin) {
//       const result = await loginUser();

//       if (result) {
//         // Lưu Token THẬT từ Backend trả về, không dùng "fake-token" nữa
//         localStorage.setItem("token", result.token); 
        
//         // Lưu thông tin user
//         localStorage.setItem("user", JSON.stringify(result.user));
//         localStorage.setItem("role", result.user.role);
//         localStorage.setItem("userId", result.user.id);

//         window.dispatchEvent(new Event("userChanged"));
//         toast.success("Login success!");
//         navigate("/");
//         if (onBack) onBack();
//       }
//     } else {
//       // Logic register cũng nên đổi thành POST body thay vì query
//       await registerUser();
//     }
//   } catch (err) {
//     toast.error("Something went wrong");
//   } finally {
//     setLoading(false);
//   }
// };

  return (
    <div className="login-container">
      <Toaster position="top-center" richColors />

      <div className="login-box">
        <span
          className="close-x"
          onClick={() => {
            if (onBack) onBack();
            navigate("/");
          }}
        >
          &times;
        </span>

        <h2 className="title">Welcome to Travel</h2>

        <div className="tab">
          <button
            className={isLogin ? "active" : ""}
            onClick={() => setIsLogin(true)}
          >
            Login
          </button>

          <button
            className={!isLogin ? "active" : ""}
            onClick={() => setIsLogin(false)}
          >
            Register
          </button>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          {/*username chỉ hiện khi register */}
          {!isLogin && (
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          )}

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {!isLogin && (
            <input
              type="password"
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          )}

          <button type="submit" disabled={loading}>
            {loading ? "Processing..." : isLogin ? "Login" : "Register"}
          </button>

          <p className="switch-text">
            {isLogin ? (
              <>
                Don’t have an account?{" "}
                <span onClick={() => setIsLogin(false)}>
                  Sign up
                </span>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <span onClick={() => setIsLogin(true)}>
                  Login
                </span>
              </>
            )}
          </p>
        </form>
      </div>
    </div>
  );
};

export default UserLogin;