

// import { useState, useEffect } from "react";
// import { 
//   LayoutDashboard, 
//   UtensilsCrossed, 
//   Clock, 
//   Tag, 
//   Bell, 
//   Star, 
//   LogOut, 
//   Menu as MenuIcon,
//   X 
// } from "lucide-react";
// import { useNavigate } from "react-router-dom";

// // Import các Block Items
// import PartnerDiscount from "./PartnerDiscount.jsx";
// import PartnerFirst from "./PartnerFirst.jsx";
// import PartnerHours from "./PartnerHour.jsx";
// import PartnerMenu from "./PartnerMenu";
// import PartnerRating from "./PartnerRating.jsx";
// import PartnerNoti from "./PartnerNoti.jsx";
// import "./PartnerLayout.css";

// const API_BASE = "http://localhost:3001";

// const PartnerLayout = () => {
//   const navigate = useNavigate();
  
//   // 1. STATE QUẢN LÝ TAB & UI
//   const [activeTab, setActiveTab] = useState("dashboard");
//   const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
//   // 2. STATE DỮ LIỆU TẬP TRUNG
//   const [fullData, setFullData] = useState({
//     locations: [],
//     menu: [],
//     discounts: [],
//     hours_record: null,
//     notifications: [],
//     reviews: []
//   });
//   const [loading, setLoading] = useState(true);

//   // 3. HÀM FETCH DỮ LIỆU (Gọi 1 lần dùng cho tất cả)
//   const fetchAllPartnerData = async () => {
//     try {
//       const user = JSON.parse(localStorage.getItem("user"));
//       if (!user) {
//         navigate("/partner/login");
//         return;
//       }
//       const partnerId = String(user.id);

//       // Bước 1: Lấy thông tin quán (Location)
//       const locRes = await fetch(`${API_BASE}/locations?partnerId=${partnerId}`);
//       const locations = await locRes.json();
      
//       if (locations.length > 0) {
//         const pId = locations[0].id;

//         // Bước 2: Fetch song song tất cả tài nguyên bằng Promise.all
//         const [menuRes, discRes, hourRes, notiRes, reviewRes] = await Promise.all([
//           fetch(`${API_BASE}/menu?placeId=${pId}`),
//           fetch(`${API_BASE}/discounts?placeId=${pId}`),
//           fetch(`${API_BASE}/hours?placeId=${pId}`),
//           fetch(`${API_BASE}/notifications`),
//           fetch(`${API_BASE}/comments?placeId=${pId}`)
//         ]);

//         const menu = await menuRes.json();
//         const discounts = await discRes.json();
//         const hoursData = await hourRes.json();
//         const allNoti = await notiRes.json();
//         const reviews = await reviewRes.json();

//         // Bước 3: Lọc thông báo theo Partner
//         const filteredNoti = allNoti
//           .filter((n) => String(n.partnerId) === partnerId)
//           .sort((a, b) => b.id - a.id);

//         setFullData({
//           locations,
//           menu,
//           discounts,
//           hours_record: hoursData.length > 0 ? hoursData[0] : null,
//           notifications: filteredNoti,
//           reviews: reviews.sort((a, b) => b.id - a.id)
//         });
//       }
//     } catch (error) {
//       console.error("Layout Fetching Error:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchAllPartnerData();
//   }, []);

//   const handleLogout = () => {
//     localStorage.removeItem("user");
//     navigate("/");
//   };

//   if (loading) return <div className="layout-loading">Loading system data...</div>;

//   // Cấu hình Sidebar
//   const sidebarItems = [
//     { id: "dashboard", label: "Dashboard", icon: <LayoutDashboard size={20} /> },
//     { id: "menu", label: "Menu Management", icon: <UtensilsCrossed size={20} /> },
//     { id: "hours", label: "Operating Hours", icon: <Clock size={20} /> },
//     { id: "discount", label: "Promotions", icon: <Tag size={20} /> },
//     { id: "notification", label: "Announcements", icon: <Bell size={20} /> },
//     { id: "rating", label: "Customer Reviews", icon: <Star size={20} /> },
//   ];

//   return (
//     <div className="partner-layout-container">
//       {/* SIDEBAR AREA */}
//       <aside className={`partner-sidebar ${isSidebarOpen ? "open" : "closed"}`}>
//         <div className="sidebar-header">
//           <div className="logo-brand">PARTNER HUB</div>
//           <button className="mobile-toggle" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
//             {isSidebarOpen ? <X size={18} /> : <MenuIcon size={18} />}
//           </button>
//         </div>

//         <nav className="sidebar-nav">
//           {sidebarItems.map((item) => (
//             <button
//               key={item.id}
//               className={`nav-item ${activeTab === item.id ? "active" : ""}`}
//               onClick={() => setActiveTab(item.id)}
//             >
//               {item.icon}
//               <span>{item.label}</span>
//             </button>
//           ))}
//         </nav>

//         <div className="sidebar-footer">
//           <button className="logout-btn" onClick={handleLogout}>
//             <LogOut size={18} />
//             <span>Logout</span>
//           </button>
//         </div>
//       </aside>

//       {/* CONTENT AREA */}
//       <main className="partner-main-content">
//         <header className="content-top-bar">
//           <div className="header-info">
//             <h2>{fullData.locations[0]?.name || "Partner Name"}</h2>
//             <p>{fullData.locations[0]?.address}</p>
//           </div>
//         </header>

//         <div className="scrollable-content">
//           {/* LOGIC: CHỈ RENDER 1 ITEM DUY NHẤT KHỚP VỚI ACTIVETAB */}
          
//           {activeTab === "dashboard" && (
//             <PartnerFirst data={fullData} onSwitchTab={(id) => setActiveTab(id)} />
//           )}

//           {activeTab === "menu" && (
//             <PartnerMenu 
//               data={fullData.menu} 
//               placeId={fullData.locations[0]?.id} 
//               onRefresh={fetchAllPartnerData} 
//             />
//           )}

//           {activeTab === "hours" && (
//             <PartnerHours 
//               data={fullData.hours_record} 
//               placeId={fullData.locations[0]?.id} 
//               onRefresh={fetchAllPartnerData} 
//             />
//           )}

//           {activeTab === "discount" && (
//             <PartnerDiscount 
//               data={fullData.discounts} 
//               placeId={fullData.locations[0]?.id} 
//               onRefresh={fetchAllPartnerData} 
//             />
//           )}

//           {activeTab === "notification" && (
//             <PartnerNoti 
//               data={fullData.notifications} 
//               onRefresh={fetchAllPartnerData} 
//             />
//           )}

//           {activeTab === "rating" && (
//             <PartnerRating 
//               data={fullData.reviews} 
//               onRefresh={fetchAllPartnerData} 
//             />
//           )}
//         </div>
//       </main>
//     </div>
//   );
// };

// export default PartnerLayout;



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
  User // Thêm icon User từ lucide-react
} from "lucide-react";
import { useNavigate } from "react-router-dom";

// Import các Block Items
import PartnerDiscount from "./PartnerDiscount.jsx";
import PartnerFirst from "./PartnerFirst.jsx";
import PartnerHours from "./PartnerHour.jsx";
import PartnerMenu from "./PartnerMenu";
import PartnerRating from "./PartnerRating.jsx";
import PartnerNoti from "./PartnerNoti.jsx";
import PartnerProfile from "./PartnerProfile.jsx"; // 1. Import PartnerProfile
import "./PartnerLayout.css";

const API_BASE = "http://localhost:3001";

const PartnerLayout = () => {
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  const [fullData, setFullData] = useState({
    locations: [],
    menu: [],
    discounts: [],
    hours_record: null,
    notifications: [],
    reviews: []
  });
  const [loading, setLoading] = useState(true);

  const fetchAllPartnerData = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user) {
        navigate("/partner/login");
        return;
      }
      const partnerId = String(user.id);

      const locRes = await fetch(`${API_BASE}/locations?partnerId=${partnerId}`);
      const locations = await locRes.json();
      
      if (locations.length > 0) {
        const pId = locations[0].id;

        const [menuRes, discRes, hourRes, notiRes, reviewRes] = await Promise.all([
          fetch(`${API_BASE}/menu?placeId=${pId}`),
          fetch(`${API_BASE}/discounts?placeId=${pId}`),
          fetch(`${API_BASE}/hours?placeId=${pId}`),
          fetch(`${API_BASE}/notifications`),
          fetch(`${API_BASE}/comments?placeId=${pId}`)
        ]);

        const menu = await menuRes.json();
        const discounts = await discRes.json();
        const hoursData = await hourRes.json();
        const allNoti = await notiRes.json();
        const reviews = await reviewRes.json();

        const filteredNoti = allNoti
          .filter((n) => String(n.partnerId) === partnerId)
          .sort((a, b) => b.id - a.id);

        setFullData({
          locations,
          menu,
          discounts,
          hours_record: hoursData.length > 0 ? hoursData[0] : null,
          notifications: filteredNoti,
          reviews: reviews.sort((a, b) => b.id - a.id)
        });
      }
    } catch (error) {
      console.error("Layout Fetching Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllPartnerData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  if (loading) return <div className="layout-loading">Loading system data...</div>;

  // 2. Thêm mục Profile vào sidebarItems
  const sidebarItems = [
    { id: "dashboard", label: "Dashboard", icon: <LayoutDashboard size={20} /> },
    { id: "menu", label: "Menu Management", icon: <UtensilsCrossed size={20} /> },
    { id: "hours", label: "Operating Hours", icon: <Clock size={20} /> },
    { id: "discount", label: "Promotions", icon: <Tag size={20} /> },
    { id: "notification", label: "Announcements", icon: <Bell size={20} /> },
    { id: "rating", label: "Customer Reviews", icon: <Star size={20} /> },
    { id: "profile", label: "Profile", icon: <User size={20} /> }, // Thêm ở đây
  ];

  return (
    <div className="partner-layout-container">
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

      <main className="partner-main-content">
        <header className="content-top-bar">
          <div className="header-info">
            <h2>{fullData.locations[0]?.name || "Partner Name"}</h2>
            <p>{fullData.locations[0]?.address}</p>
          </div>
        </header>

        <div className="scrollable-content">
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

          {activeTab === "notification" && (
            <PartnerNoti 
              data={fullData.notifications} 
              onRefresh={fetchAllPartnerData} 
            />
          )}

          {activeTab === "rating" && (
            <PartnerRating 
              data={fullData.reviews} 
              onRefresh={fetchAllPartnerData} 
            />
          )}

          {/* 3. LOGIC RENDER PROFILE */}
          {activeTab === "profile" && (
            <PartnerProfile />
          )}
        </div>
      </main>
    </div>
  );
};

export default PartnerLayout;