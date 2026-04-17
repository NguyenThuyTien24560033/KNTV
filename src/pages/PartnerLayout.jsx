

import { useEffect, useState } from "react";
import { Outlet, useNavigate, Navigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  MapPin,
  MenuSquare,
  Percent,
  Clock,
  Bell,
  User,
  LogOut,
  Star   // ← Thêm icon Star
} from "lucide-react";
import "./PartnerLayout.css";

const PartnerLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem("user");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [role, setRole] = useState(localStorage.getItem("role"));

  useEffect(() => {
    const handleUserChange = () => {
      const stored = localStorage.getItem("user");
      setUser(stored ? JSON.parse(stored) : null);
      setRole(localStorage.getItem("role"));
    };

    window.addEventListener("userChanged", handleUserChange);
    return () => window.removeEventListener("userChanged", handleUserChange);
  }, []);

  if (!user || role !== "partner") {
    return <Navigate to="/partner/login" replace />;
  }

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    window.dispatchEvent(new Event("userChanged"));
    navigate("/");
  };

  // Navigate đến Profile
  const goToProfile = () => {
    navigate("/partner/profile");
  };

  const menuItems = [
    {
      path: "/partner/dashboard",
      icon: <LayoutDashboard size={20} />,
      label: "Dashboard"
    },
    {
      path: "/partner/place",
      icon: <MapPin size={20} />,
      label: "My Place"
    },
    {
      path: "/partner/menu",
      icon: <MenuSquare size={20} />,
      label: "Menu"
    },
    {
      path: "/partner/discount",
      icon: <Percent size={20} />,
      label: "Discount"
    },
    {
      path: "/partner/hours",
      icon: <Clock size={20} />,
      label: "Open Hours"
    },
    {
      path: "/partner/notifications",
      icon: <Bell size={20} />,
      label: "Notifications"
    },
    // ==================== THÊM MỤC RATINGS ====================
    {
      path: "/partner/rating",
      icon: <Star size={20} />,
      label: "Ratings & Reviews"
    }
  ];

  return (
    <div className="partner-layout">
      {/* Sidebar */}
      <aside className="partner-sidebar">
        <div className="sidebar-header">
          <h2>Partner Portal</h2>
          <p>Manage location</p>
        </div>

        <nav className="sidebar-nav">
          {menuItems.map((item) => (
            <button
              key={item.path}
              className={`nav-item ${
                location.pathname === item.path ? "active" : ""
              }`}
              onClick={() => navigate(item.path)}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        {/* User info */}
        <div className="sidebar-footer">
          <div 
            className="user-info" 
            onClick={goToProfile}
            style={{ cursor: "pointer" }}
            title="Click để xem Profile"
          >
            <div className="user-avatar">
              <User size={24} />
            </div>
            <div className="user-details">
              <p className="user-name">{user.name || user.email}</p>
              <p className="user-role">Partner</p>
            </div>
          </div>

          <button className="logout-btn" onClick={handleLogout}>
            <LogOut size={18} />
            <span>Log out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="partner-main">
        <header className="partner-top-header">
          <h1>Welcome back, {user.name || "Partner"}!</h1>
        </header>

        <main className="partner-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default PartnerLayout;




/**
 * PartnerLayout.jsx
 * -----------------
 * Layout chính cho Partner Portal.
 * - Quản lý sidebar với menu điều hướng (Dashboard, Place, Menu, Discount, Hours, Notifications, Ratings).
 * - Hiển thị thông tin user (partner) và cho phép logout.
 * - Bảo vệ route: nếu chưa login hoặc role không phải "partner" thì redirect về trang login.
 * - Dùng <Outlet /> để render nội dung con theo route hiện tại.
 */

// import { useEffect, useState } from "react";
// import { Outlet, useNavigate, Navigate, useLocation } from "react-router-dom";
// import {
//   LayoutDashboard,
//   MapPin,
//   MenuSquare,
//   Percent,
//   Clock,
//   Bell,
//   User,
//   LogOut,
//   Star   // Icon cho Ratings
// } from "lucide-react";
// import "./PartnerLayout.css";

// const PartnerLayout = () => {
//   const navigate = useNavigate();     // Hook điều hướng
//   const location = useLocation();     // Hook lấy path hiện tại

//   // State user lấy từ localStorage
//   const [user, setUser] = useState(() => {
//     try {
//       const stored = localStorage.getItem("user");
//       return stored ? JSON.parse(stored) : null;
//     } catch {
//       return null;
//     }
//   });

//   // State role lấy từ localStorage
//   const [role, setRole] = useState(localStorage.getItem("role"));

//   // Lắng nghe sự kiện userChanged để cập nhật lại user/role khi login/logout
//   useEffect(() => {
//     const handleUserChange = () => {
//       const stored = localStorage.getItem("user");
//       setUser(stored ? JSON.parse(stored) : null);
//       setRole(localStorage.getItem("role"));
//     };

//     window.addEventListener("userChanged", handleUserChange);
//     return () => window.removeEventListener("userChanged", handleUserChange);
//   }, []);

//   // Nếu chưa login hoặc role không phải partner → redirect về trang login
//   if (!user || role !== "partner") {
//     return <Navigate to="/partner/login" replace />;
//   }

//   // Hàm logout: xoá dữ liệu trong localStorage và điều hướng về trang chủ
//   const handleLogout = () => {
//     localStorage.removeItem("user");
//     localStorage.removeItem("token");
//     localStorage.removeItem("role");
//     window.dispatchEvent(new Event("userChanged")); // phát sự kiện để update state
//     navigate("/");
//   };

//   // Hàm điều hướng đến trang Profile
//   const goToProfile = () => {
//     navigate("/partner/profile");
//   };

//   // Danh sách menu sidebar
//   const menuItems = [
//     { path: "/partner/dashboard", icon: <LayoutDashboard size={20} />, label: "Dashboard" },
//     { path: "/partner/place", icon: <MapPin size={20} />, label: "My Place" },
//     { path: "/partner/menu", icon: <MenuSquare size={20} />, label: "Menu" },
//     { path: "/partner/discount", icon: <Percent size={20} />, label: "Discount" },
//     { path: "/partner/hours", icon: <Clock size={20} />, label: "Open Hours" },
//     { path: "/partner/notifications", icon: <Bell size={20} />, label: "Notifications" },
//     // Thêm mục Ratings
//     { path: "/partner/rating", icon: <Star size={20} />, label: "Ratings & Reviews" }
//   ];

//   return (
//     <div className="partner-layout">
//       {/* Sidebar */}
//       <aside className="partner-sidebar">
//         <div className="sidebar-header">
//           <h2>Partner Portal</h2>
//           <p>Manage location</p>
//         </div>

//         {/* Menu điều hướng */}
//         <nav className="sidebar-nav">
//           {menuItems.map((item) => (
//             <button
//               key={item.path}
//               className={`nav-item ${location.pathname === item.path ? "active" : ""}`}
//               onClick={() => navigate(item.path)}
//             >
//               {item.icon}
//               <span>{item.label}</span>
//             </button>
//           ))}
//         </nav>

//         {/* Thông tin user + nút logout */}
//         <div className="sidebar-footer">
//           <div 
//             className="user-info" 
//             onClick={goToProfile}
//             style={{ cursor: "pointer" }}
//             title="Click để xem Profile"
//           >
//             <div className="user-avatar">
//               <User size={24} />
//             </div>
//             <div className="user-details">
//               <p className="user-name">{user.name || user.email}</p>
//               <p className="user-role">Partner</p>
//             </div>
//           </div>

//           <button className="logout-btn" onClick={handleLogout}>
//             <LogOut size={18} />
//             <span>Log out</span>
//           </button>
//         </div>
//       </aside>

//       {/* Main Content */}
//       <div className="partner-main">
//         <header className="partner-top-header">
//           <h1>Welcome back, {user.name || "Partner"}!</h1>
//         </header>

//         <main className="partner-content">
//           {/* Render nội dung con theo route */}
//           <Outlet />
//         </main>
//       </div>
//     </div>
//   );
// };

// export default PartnerLayout;
