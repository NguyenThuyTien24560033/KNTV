
// // userEffect: chạy logic theo thời gian thực
// //useState: lưu data
// //useRef: giữ refernence DOM or value tránh việc re-render
// import { useEffect, useState, useRef } from "react";
// //useNavigate: điều hướng giữa các trang
// //Link: chuyển trang mà ko reload, chỉ đổi component
// import { Link, useNavigate } from "react-router-dom";
// //import css
// import "./Header.css";
// import FilterSearch from "./FilterSearch";
// //import icon user từ lucide-react
// import { User } from "lucide-react";

// const Header = ({ onLoginClick }) => {
//   //lấy role từ localStorage
//   const [role, setRole] = useState(localStorage.getItem("role"));
//   //dùng navigate để chuyển trang
//   const navigate = useNavigate();

//   //lấy user từ localStorage
//   const [user, setUser] = useState(() => {
//     //lấy user từ localStorage dạng string lưu vào stored
//     const stored = localStorage.getItem("user");
//     //check xem user tồn tại ko
//     //có thì parse nó thành object
//     //ko có thì trả về null
//     return stored ? JSON.parse(stored) : null;
//   });

//   //bảng menu hiện tại ko mở, có trạng thái false
//   const [menuOpen, setMenuOpen] = useState(false);
//   //dùng để xử lí cái DOM của menu, tạo con trỏ menuRef trỏ tới menu
//   const menuRef = useRef(null);

//   //dùng useEffect({...},[]) để render 1 lần
//   // update user khi login/logout
//   useEffect(() => {
//     const handleUserChange = () => {
//       //lấy user từ localStorage, kiểm tra và cập nhật user
//       const stored = localStorage.getItem("user");
//       setUser(stored ? JSON.parse(stored) : null);
//       //lấy role từ localStorage và cập nhật role
//       setRole(localStorage.getItem("role")); 
//     };
//     //lắng nghe event có tên "userChanged", nếu lắng nghe được gọi hàm handleUserChange
//     window.addEventListener("userChanged", handleUserChange);
//     return () =>
//       //sau khi lắng nghe xong cần xóa listener để tránh việc leak memory
//       window.removeEventListener("userChanged", handleUserChange);
//   }, []);

//   // click ngoài menu -> đóng dropdown
//   //useEffect(()=>{},[]): render 1 lần
//   useEffect(() => {
//     //hàm xử lí khi click ngoài menu
//     const handleClickOutside = (e) => {
//       //menuRef.current: menu hiện tại có tồn tại
//       //menuRef.current.contains(e.target): phần vừa click vào có nằm trong menu ko
//       if (menuRef.current && !menuRef.current.contains(e.target)) {
//         //đóng menu
//         setMenuOpen(false);
//       }
//     };
//     //lắng nghe click trên toàn trang, nếu nghe thì gọi hàm handleClickOutside xử lí
//     document.addEventListener("click", handleClickOutside);
//     //sau khi lắng nghe xong thì xóa listener để tránh việc leak memory
//     return () => document.removeEventListener("click", handleClickOutside);
//   }, []);

//   // logout
//   const handleLogout = () => {
//     //xóa user
//     localStorage.removeItem("user");
//     //xóa token
//     localStorage.removeItem("token");
//     //xóa quyền
//     localStorage.removeItem("role"); 
//     //phát tín hiệu toàn web "userChanged"
//     //handleUserChange sẽ lắng nghe tín hiệu và thực hiện
//     window.dispatchEvent(new Event("userChanged"));
//     //đóng menu
//     setMenuOpen(false);
//     //trở về path: / => home
//     navigate("/");
//   };

//   // search
//   const [keyword, setKeyword] = useState("");

//   return (
//     <header className="main-header">
//       <div className="top-content-header">
//         <nav className="main-top-header">
//         {/* both */}
//           <Link to="/" className="nav-item">
//             Home
//           </Link>
//           {/* user */}
//           {role === "user" && (
//             <>
//               <Link to="/my-trips" className="nav-item">
//                 My Trips
//               </Link>

//               <Link to="/history" className="nav-item">
//                 History
//               </Link>
//             </>
//           )}

//           {/* both */}
//           <Link to="/locations" className="nav-item">
//             Locations
//           </Link>

//           {/* partner */}
//           {role === "partner" && (
//             <>
//               <Link to="/add-location" className="nav-item">
//                 Add Location
//               </Link>

//               <Link to="/manage" className="nav-item">
//                 Manage
//               </Link>
//             </>
//           )}
//         </nav>

//         {/* LOGIN / USER */}
//         {/* ref={menuRef}: react ko truy cập trực tiếp DOM nên tạo ra 1 con trỏ useRef */}
//         <div className="login-container-bt" ref={menuRef}>
//         {/* kiểm tra xem user đã login chưa */}
//           {user ? (
//             <div className="user-menu">
//               {/* nút bấm, click vào thì update ngược trạng thái của menu */}
//               <button
//                 className="user-btn"
//                 onClick={() => setMenuOpen(!menuOpen)}
//               >
//                 {/* icon user kích thước 30 */}
//                 <User className="user-icon" size={30} />
//                 {/* //hiển thị name, ko có thì email */}
//                 <span className="user-name">
//                   {user.name || user.email}
//                 </span>
//               </button>
//               {/* //khi menu được mở */}
//               {menuOpen && (
//                 <div className="dropdown-menu">
//                   {/* //profile path:/profile */}
//                   {/* //click vô thì đóng menu */}
//                   <Link
//                     to="/profile"
//                     className="dropdown-item"
//                     onClick={() => setMenuOpen(false)}
//                   >
//                     Profile
//                   </Link>
//                   {/* //nút logout, click thì gọi handleLogout xử lí */}
//                   <button className="dropdown-item" onClick={handleLogout}>
//                     Logout
//                   </button>
//                 </div>
//               )}
//             </div>
//           ) : (
           
//             <button
//               className="login-bt"
//               onClick={() => onLoginClick && onLoginClick()}
//             >
//               Login
//             </button>
//           )}
//         </div>
//       </div>

//       {/* SEARCH */}
//       <div className="header-search">
//         <FilterSearch />
//       </div>
//     </header>
//   );
// };

// export default Header;



import { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Header.css";
import FilterSearch from "./FilterSearch";
import { User } from "lucide-react";

const Header = ({ onLoginClick }) => {
  const [role, setRole] = useState(localStorage.getItem("role"));
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });

  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  // Cập nhật user & role khi login/logout
  useEffect(() => {
    const handleUserChange = () => {
      const stored = localStorage.getItem("user");
      setUser(stored ? JSON.parse(stored) : null);
      setRole(localStorage.getItem("role"));
    };

    window.addEventListener("userChanged", handleUserChange);
    return () => window.removeEventListener("userChanged", handleUserChange);
  }, []);

  // Click ngoài dropdown → đóng menu
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    window.dispatchEvent(new Event("userChanged"));
    setMenuOpen(false);
    navigate("/");
  };

  return (
    <header className="main-header">
      <div className="top-content-header">
        <nav className="main-top-header">
          {/* Link chung cho cả 2 role */}
          <Link to="/" className="nav-item">
            Home
          </Link>

          <Link to="/locations" className="nav-item">
            Locations
          </Link>

          {/* ==================== USER ROLE ==================== */}
          {role === "user" && (
            <>
              <Link to="/my-trips" className="nav-item">
                My Trips
              </Link>
              <Link to="/history" className="nav-item">
                History
              </Link>
            </>
          )}

          {/* ==================== PARTNER ROLE ==================== */}
          {role === "partner" && (
            <>
              <Link to="/partner/dashboard" className="nav-item">
                Dashboard
              </Link>
              <Link to="/partner/place" className="nav-item">
                My Place
              </Link>
              <Link to="/partner/menu" className="nav-item">
                Menu
              </Link>
              <Link to="/partner/discount" className="nav-item">
                Discount
              </Link>
              <Link to="/partner/hours" className="nav-item">
                Hours
              </Link>
              <Link to="/partner/notifications" className="nav-item">
                Notifications
              </Link>
            </>
          )}
        </nav>

        {/* USER MENU / LOGIN */}
        <div className="login-container-bt" ref={menuRef}>
          {user ? (
            <div className="user-menu">
              <button
                className="user-btn"
                onClick={() => setMenuOpen(!menuOpen)}
              >
                <User className="user-icon" size={30} />
                <span className="user-name">
                  {user.name || user.email}
                </span>
              </button>

              {menuOpen && (
                <div className="dropdown-menu">
                  {/* Profile chung (sau này có thể tách riêng cho partner) */}
                  <Link
                    to="/profile"
                    className="dropdown-item"
                    onClick={() => setMenuOpen(false)}
                  >
                    Profile
                  </Link>

                  {/* Nếu là partner, có thể thêm link Manage nhanh */}
                  {role === "partner" && (
                    <Link
                      to="/partner/dashboard"
                      className="dropdown-item"
                      onClick={() => setMenuOpen(false)}
                    >
                      Partner Dashboard
                    </Link>
                  )}

                  <button className="dropdown-item" onClick={handleLogout}>
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button className="login-bt" onClick={onLoginClick}>
              Login
            </button>
          )}
        </div>
      </div>

      {/* Search bar */}
      <div className="header-search">
        <FilterSearch />
      </div>
    </header>
  );
};

export default Header;