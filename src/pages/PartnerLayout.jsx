

import { useState, useEffect } from "react";
import { 
  LayoutDashboard, 
  UtensilsCrossed, 
  Clock, 
  Tag, 
  Bell, 
  Star, 
  LogOut, 
  Menu as MenuIcon,
  X,
  User 
} from "lucide-react";
import { useNavigate } from "react-router-dom";


import PartnerDiscount from "./PartnerDiscount.jsx";
import PartnerFirst from "./PartnerFirst.jsx";
import PartnerHours from "./PartnerHour.jsx";
import PartnerMenu from "./PartnerMenu";
import PartnerRating from "./PartnerRating.jsx";
import PartnerNoti from "./PartnerNoti.jsx";
import PartnerProfile from "./PartnerProfile.jsx"; // 1. Import PartnerProfile
import "./PartnerLayout.css";

const PartnerLayout = () => {
  const navigate = useNavigate();
  
  // 1. STATE QUẢN LÝ UI
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  // 2. STATE DỮ LIỆU TẬP TRUNG
  const [fullData, setFullData] = useState({
    locations: [],
    menu: [],
    discounts: [],
    hours_record: null,
    notifications: [],
    reviews: []
  });
  const [loading, setLoading] = useState(true);

  // 3. HÀM FETCH DỮ LIỆU TỐI ƯU (CHỈ GỌI 1 LẦN DUY NHẤT)
  const fetchAllPartnerData = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user) {
        navigate("/partner/login");
        return;
      }
      const partnerId = String(user.id);

      // SỬ DỤNG BIẾN MÔI TRƯỜNG TỪ .ENV
      // Vì dữ liệu lồng nhau, ta chỉ cần gọi đến endpoint Location
      const res = await fetch(`${import.meta.env.VITE_Location}?partnerId=${partnerId}`);
      
      if (!res.ok) {
        console.error("Lỗi phản hồi từ Backend:", res.status);
        return;
      }

      const data = await res.json();
      
      // Kiểm tra nếu có dữ liệu trả về (thường là mảng khi dùng filter)
      if (Array.isArray(data) && data.length > 0) {
        const target = data[0]; // Cục dữ liệu tổng lồng nhau

        // "Mổ xẻ" dữ liệu lồng nhau và đưa vào state tập trung
        setFullData({
          locations: [target], 
          menu: target.menu || [],
          discounts: target.discounts || [],
          hours_record: target.hours || null,
          notifications: target.notifications || [],
          reviews: (target.comments || []).sort((a, b) => b.id - a.id)
        });
      }
    } catch (error) {
      console.error("Layout Fetching Error:", error);
    } finally {
      setLoading(false);
    }
  };
// const fetchAllPartnerData = async () => {
//     try {
//       const user = JSON.parse(localStorage.getItem("user"));
//       console.log("1. Check User LocalStorage:", user); // Kiểm tra user có tồn tại không

//       if (!user) {
//         navigate("/partner/login");
//         return;
//       }
//       const partnerId = String(user.id);
//       const apiUrl = `${import.meta.env.VITE_Location}?partnerId=${partnerId}`;
//       console.log("2. Fetching URL:", apiUrl); // Kiểm tra URL có bị lỗi // hay thiếu / không

//       const res = await fetch(apiUrl);
//       if (!res.ok) {
//         console.error("3. API Response Error:", res.status, res.statusText);
//         return;
//       }

//       const data = await res.json();
//       console.log("4. Raw Data from API:", data); // QUAN TRỌNG: Xem cấu trúc thực tế của target

//       if (Array.isArray(data) && data.length > 0) {
//         const target = data[0];
//         console.log("5. Target Location Object:", target); // Kiểm tra các key menu, discounts có tồn tại không

//         setFullData({
//           locations: [target], 
//           menu: target.menu || [],
//           discounts: target.discounts || [],
//           hours_record: target.hours || null,
//           notifications: target.notifications || [],
//           reviews: (target.comments || []).sort((a, b) => b.id - a.id)
//         });
//       } else {
//         console.warn("6. No data found for partnerId:", partnerId);
//       }
//     } catch (error) {
//       console.error("7. Catch Block Error:", error);
//     } finally {
//       setLoading(false);
//     }
//   };
  useEffect(() => {
    fetchAllPartnerData();
  }, []);



  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  if (loading) return <div className="layout-loading">Loading system data...</div>;

  // Cấu hình Sidebar
  const sidebarItems = [
    { id: "dashboard", label: "Dashboard", icon: <LayoutDashboard size={20} /> },
    { id: "menu", label: "Menu Management", icon: <UtensilsCrossed size={20} /> },
    { id: "hours", label: "Operating Hours", icon: <Clock size={20} /> },
    { id: "discount", label: "Promotions", icon: <Tag size={20} /> },
    { id: "notification", label: "Announcements", icon: <Bell size={20} /> },
    { id: "rating", label: "Customer Reviews", icon: <Star size={20} /> },
    { id: "profile", label: "Profile", icon: <User size={20} /> },
  ];

  return (
    <div className="partner-layout-container">
      {/* SIDEBAR AREA */}
      <aside className={`partner-sidebar ${isSidebarOpen ? "open" : "closed"}`}>
        <div className="sidebar-header">
          <div className="logo-brand">PARTNER HUB</div>
          <button className="mobile-toggle" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
            {isSidebarOpen ? <X size={18} /> : <MenuIcon size={18} />}
          </button>
        </div>

        <nav className="sidebar-nav">
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              className={`nav-item ${activeTab === item.id ? "active" : ""}`}
              onClick={() => setActiveTab(item.id)}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button className="logout-btn" onClick={handleLogout}>
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* CONTENT AREA */}
      <main className="partner-main-content">
        <header className="content-top-bar">
          <div className="header-info">
            <h2>{fullData.locations[0]?.name || "Partner Name"}</h2>
            <p>{fullData.locations[0]?.address}</p>
          </div>
        </header>

        <div className="scrollable-content">
          {/* PHÂN PHÁT DỮ LIỆU CHO CÁC COMPONENT CON (KHÔNG FETCH LẠI) */}
          
          {activeTab === "dashboard" && (
            <PartnerFirst data={fullData} onSwitchTab={(id) => setActiveTab(id)} />
          )}

          {activeTab === "menu" && (
            <PartnerMenu 
              data={fullData.menu} 
              placeId={fullData.locations[0]?.id} 
              onRefresh={fetchAllPartnerData} 
            />
          )}

          {activeTab === "hours" && (
            <PartnerHours 
              data={fullData.hours_record} 
              placeId={fullData.locations[0]?.id} 
              onRefresh={fetchAllPartnerData} 
            />
          )}

          {activeTab === "discount" && (
            <PartnerDiscount 
              data={fullData.discounts} 
              placeId={fullData.locations[0]?.id} 
              onRefresh={fetchAllPartnerData} 
            />
          )}

          {/* {activeTab === "notification" && (
            <PartnerNoti 
              data={fullData.notifications} 
              onRefresh={fetchAllPartnerData} 
            />
          )} */}
          {/* SỬA ĐOẠN NÀY TRONG PartnerLayout.jsx */}

{activeTab === "notification" && (
  <PartnerNoti 
    data={fullData.notifications} 
    // THÊM DÒNG DƯỚI ĐÂY VÀO
    placeId={fullData.locations[0]?.id} 
    onRefresh={fetchAllPartnerData} 
  />
)}

          {activeTab === "rating" && (
            <PartnerRating 
              data={fullData.reviews} 
              onRefresh={fetchAllPartnerData} 
            />
          )}

          {activeTab === "profile" && (
            <PartnerProfile />
          )}
        </div>
      </main>
    </div>
  );
};

export default PartnerLayout;

