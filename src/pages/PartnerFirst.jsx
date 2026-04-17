
// import { useState, useEffect } from "react";
// import {
//   MapPin,
//   Clock,
//   TrendingUp,
//   Star,
//   MenuSquare,
//   Percent,
//   Bell,
//   Phone
// } from "lucide-react";
// import { useNavigate } from "react-router-dom";   // ← Thêm useNavigate
// import "./PartnerFirst.css";

// const API_BASE = "http://localhost:3001";

// const PartnerFirst = () => {
//   const navigate = useNavigate();   // ← Khai báo navigate

//   const [place, setPlace] = useState(null);
//   const [isOpenNow, setIsOpenNow] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const [stats, setStats] = useState({ rating: 0, activeDiscounts: 0 });

//   // ==================== HELPER FUNCTIONS ====================
//   const getTodaySchedule = (schedule) => {
//     if (!schedule || !Array.isArray(schedule) || schedule.length === 0) return null;

//     const todayIndex = new Date().getDay();
//     const englishDays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
//     const todayNameEn = englishDays[todayIndex];

//     let todaySchedule = schedule.find(day => day.day === todayNameEn);

//     if (!todaySchedule) {
//       const vietDays = ["Chủ Nhật", "Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7"];
//       const todayNameVi = vietDays[todayIndex];
//       todaySchedule = schedule.find(day => 
//         day.day === todayNameVi || (day.day && day.day.includes(todayNameVi))
//       );
//     }
//     return todaySchedule;
//   };

//   const parseTimeToMinutes = (timeStr) => {
//     if (!timeStr || typeof timeStr !== "string") return 0;
//     const [hours, minutes] = timeStr.split(":").map(Number);
//     if (isNaN(hours) || isNaN(minutes)) return 0;
//     return hours * 60 + minutes;
//   };

//   const calculateIsOpenNow = (isOpenToday, todaySchedule) => {
//     if (isOpenToday === false) return false;
//     if (!todaySchedule || todaySchedule.isClosed === true) return false;

//     const now = new Date();
//     const currentMin = now.getHours() * 60 + now.getMinutes();
//     const openMin = parseTimeToMinutes(todaySchedule.openTime);
//     let closeMin = parseTimeToMinutes(todaySchedule.closeTime);

//     if (closeMin <= openMin && closeMin !== 0) closeMin += 24 * 60;

//     return currentMin >= openMin && currentMin < closeMin;
//   };

//   // ==================== FETCH DATA ====================
//   useEffect(() => {
//     const fetchDashboardData = async () => {
//       try {
//         const user = JSON.parse(localStorage.getItem("user"));
//         if (!user) throw new Error("Not logged in");

//         const placeRes = await fetch(`${API_BASE}/locations?partnerId=${user.id}`);
//         const places = await placeRes.json();

//         if (places.length === 0) {
//           setPlace(null);
//           setLoading(false);
//           return;
//         }

//         const currentPlace = places[0];
//         setPlace(currentPlace);

//         // Lấy hours
//         const hoursRes = await fetch(`${API_BASE}/hours?placeId=${currentPlace.id}`);
//         const hoursData = await hoursRes.json();

//         let computedIsOpen = false;
//         if (hoursData.length > 0) {
//           const record = hoursData[0];
//           const todaySchedule = getTodaySchedule(record.schedule);
//           computedIsOpen = calculateIsOpenNow(record.isOpenToday ?? true, todaySchedule);
//         } else {
//           computedIsOpen = currentPlace.isOpen || false;
//         }

//         setIsOpenNow(computedIsOpen);

//         // Lấy discounts
//         const discountRes = await fetch(`${API_BASE}/discounts?placeId=${currentPlace.id}`);
//         const discountData = await discountRes.json();

//         const now = new Date();
//         const activeDiscounts = discountData.filter((d) => {
//           if (!d.startDate || !d.endDate) return false;
//           const start = new Date(d.startDate);
//           const end = new Date(d.endDate);
//           end.setHours(23, 59, 59, 999);
//           return now >= start && now <= end;
//         });

//         setStats({
//           rating: currentPlace.rating || 4.5,
//           activeDiscounts: activeDiscounts.length,
//         });

//       } catch (error) {
//         console.error("Failed to fetch dashboard data:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchDashboardData();
//   }, []);

//   if (loading) {
//     return <div className="loading">Loading...</div>;
//   }

//   return (
//     <div className="dashboard-container">
//       <div className="dashboard-header">
//         <h1>Dashboard</h1>
//         <p className="welcome-text">
//           Welcome back! Here is an overview of your locations today.
//         </p>
//       </div>

//       {place ? (
//         <div className="place-card">
//           <div className="place-image">
//             <img
//               src={place.image || "https://via.placeholder.com/600x300"}
//               alt={place.name}
//             />
//           </div>
//           <div className="place-info">
//             <h2>{place.name}</h2>
//             <p className="place-address">
//               <MapPin size={18} /> {place.address || "DN"}
//             </p>
//             {place.phone && (
//               <p className="place-phone">
//                 <Phone size={18} /> {place.phone}
//               </p>
//             )}
//             <div className="place-status">
//               <span className={`status-dot ${isOpenNow ? "open" : "closed"}`}></span>
//               {isOpenNow ? "Open Now" : "Closed Now"}
//             </div>
//           </div>
//         </div>
//       ) : (
//         <p style={{ marginTop: "20px" }}>No locations found.</p>
//       )}

//       {/* Stats Grid - Click vào Ratings để đi đến trang đánh giá */}
//       <div className="stats-grid">
//         <div 
//           className="stat-card rating-card" 
//           onClick={() => navigate("/partner/rating")}   // ← Click để chuyển trang
//           style={{ cursor: "pointer" }}
//           title="Click để xem chi tiết đánh giá"
//         >
//           <Star size={28} />
//           <h3>{stats.rating}</h3>
//           <p>Ratings</p>
//         </div>

//         <div className="stat-card">
//           <TrendingUp size={28} />
//           <h3>{stats.activeDiscounts}</h3>
//           <p>Active Discounts</p>
//         </div>
//       </div>

//       {/* Quick Actions */}
//       <div className="quick-actions">
//         <div className="actions-grid">
//           <button
//             className="action-btn primary"
//             onClick={() => navigate("/partner/hours")}
//           >
//             <Clock size={20} />
//             Update Opening Hours
//           </button>

//           <button
//             className="action-btn"
//             onClick={() => navigate("/partner/menu")}
//           >
//             <MenuSquare size={20} />
//             Menu
//           </button>

//           <button
//             className="action-btn"
//             onClick={() => navigate("/partner/discount")}
//           >
//             <Percent size={20} />
//             Add New Discount
//           </button>

//           <button
//             className="action-btn"
//             onClick={() => navigate("/partner/notifications")}
//           >
//             <Bell size={20} />
//             Notification
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PartnerFirst;






// /**
//  * PartnerFirst.jsx
//  * -----------------
//  * Component Dashboard dành cho Partner (đối tác).
//  * - Hiển thị thông tin địa điểm (location) của partner sau khi login.
//  * - Kiểm tra giờ mở cửa hôm nay để xác định trạng thái "Open/Closed".
//  * - Lấy dữ liệu khuyến mãi (discounts) và tính số lượng khuyến mãi đang hoạt động.
//  * - Hiển thị rating, số lượng discount, và các nút hành động nhanh (update hours, menu, discount, notification).
//  * 
//  * Lưu ý:
//  * - Dữ liệu được fetch từ JSON Server (API_BASE).
//  * - Partner login xong sẽ có object `user` lưu trong localStorage.
//  * - Khi backend thật có, chỉ cần đổi API_BASE sang URL backend.
//  */

// // import { useState, useEffect } from "react";
// // import {
// //   MapPin,
// //   Clock,
// //   TrendingUp,
// //   Star,
// //   MenuSquare,
// //   Percent,
// //   Bell,
// //   Phone
// // } from "lucide-react";
// // import { useNavigate } from "react-router-dom";   // Hook để điều hướng trang
// // import "./PartnerFirst.css";

// // // Địa chỉ API JSON Server
// // const API_BASE = "http://localhost:3001";

// // const PartnerFirst = () => {
// //   const navigate = useNavigate();   // Khai báo navigate để chuyển trang

// //   // State quản lý dữ liệu
// //   const [place, setPlace] = useState(null);               // Địa điểm hiện tại của partner
// //   const [isOpenNow, setIsOpenNow] = useState(false);      // Trạng thái mở cửa hiện tại
// //   const [loading, setLoading] = useState(true);           // Loading state
// //   const [stats, setStats] = useState({ rating: 0, activeDiscounts: 0 }); // Thống kê rating và discount

// //   // ==================== HELPER FUNCTIONS ====================

// //   // Hàm lấy lịch mở cửa hôm nay từ dữ liệu schedule
// //   const getTodaySchedule = (schedule) => {
// //     if (!schedule || !Array.isArray(schedule) || schedule.length === 0) return null;

// //     const todayIndex = new Date().getDay(); // 0 = Sunday, 1 = Monday...
// //     const englishDays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
// //     const todayNameEn = englishDays[todayIndex];

// //     // Tìm theo tên tiếng Anh
// //     let todaySchedule = schedule.find(day => day.day === todayNameEn);

// //     // Nếu không có, thử tìm theo tên tiếng Việt
// //     if (!todaySchedule) {
// //       const vietDays = ["Chủ Nhật", "Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7"];
// //       const todayNameVi = vietDays[todayIndex];
// //       todaySchedule = schedule.find(day => 
// //         day.day === todayNameVi || (day.day && day.day.includes(todayNameVi))
// //       );
// //     }
// //     return todaySchedule;
// //   };

// //   // Chuyển giờ dạng "HH:mm" thành số phút để dễ so sánh
// //   const parseTimeToMinutes = (timeStr) => {
// //     if (!timeStr || typeof timeStr !== "string") return 0;
// //     const [hours, minutes] = timeStr.split(":").map(Number);
// //     if (isNaN(hours) || isNaN(minutes)) return 0;
// //     return hours * 60 + minutes;
// //   };

// //   // Kiểm tra hiện tại có đang mở cửa không
// //   const calculateIsOpenNow = (isOpenToday, todaySchedule) => {
// //     if (isOpenToday === false) return false;
// //     if (!todaySchedule || todaySchedule.isClosed === true) return false;

// //     const now = new Date();
// //     const currentMin = now.getHours() * 60 + now.getMinutes();
// //     const openMin = parseTimeToMinutes(todaySchedule.openTime);
// //     let closeMin = parseTimeToMinutes(todaySchedule.closeTime);

// //     // Nếu giờ đóng <= giờ mở (qua ngày hôm sau) thì cộng thêm 24h
// //     if (closeMin <= openMin && closeMin !== 0) closeMin += 24 * 60;

// //     return currentMin >= openMin && currentMin < closeMin;
// //   };

// //   // ==================== FETCH DATA ====================
// //   useEffect(() => {
// //     const fetchDashboardData = async () => {
// //       try {
// //         // Lấy thông tin user từ localStorage
// //         const user = JSON.parse(localStorage.getItem("user"));
// //         if (!user) throw new Error("Not logged in");

// //         // Lấy danh sách địa điểm của partner
// //         const placeRes = await fetch(`${API_BASE}/locations?partnerId=${user.id}`);
// //         const places = await placeRes.json();

// //         if (places.length === 0) {
// //           setPlace(null);
// //           setLoading(false);
// //           return;
// //         }

// //         const currentPlace = places[0]; // Lấy địa điểm đầu tiên
// //         setPlace(currentPlace);

// //         // Lấy giờ mở cửa (hours)
// //         const hoursRes = await fetch(`${API_BASE}/hours?placeId=${currentPlace.id}`);
// //         const hoursData = await hoursRes.json();

// //         let computedIsOpen = false;
// //         if (hoursData.length > 0) {
// //           const record = hoursData[0];
// //           const todaySchedule = getTodaySchedule(record.schedule);
// //           computedIsOpen = calculateIsOpenNow(record.isOpenToday ?? true, todaySchedule);
// //         } else {
// //           // Nếu không có dữ liệu hours thì fallback sang field isOpen
// //           computedIsOpen = currentPlace.isOpen || false;
// //         }

// //         setIsOpenNow(computedIsOpen);

// //         // Lấy danh sách khuyến mãi (discounts)
// //         const discountRes = await fetch(`${API_BASE}/discounts?placeId=${currentPlace.id}`);
// //         const discountData = await discountRes.json();

// //         const now = new Date();
// //         const activeDiscounts = discountData.filter((d) => {
// //           if (!d.startDate || !d.endDate) return false;
// //           const start = new Date(d.startDate);
// //           const end = new Date(d.endDate);
// //           end.setHours(23, 59, 59, 999); // set cuối ngày
// //           return now >= start && now <= end;
// //         });

// //         // Cập nhật thống kê
// //         setStats({
// //           rating: currentPlace.rating || 4.5,
// //           activeDiscounts: activeDiscounts.length,
// //         });

// //       } catch (error) {
// //         console.error("Failed to fetch dashboard data:", error);
// //       } finally {
// //         setLoading(false);
// //       }
// //     };

// //     fetchDashboardData();
// //   }, []);

// //   // ==================== RENDER ====================
// //   if (loading) {
// //     return <div className="loading">Loading...</div>;
// //   }

// //   return (
// //     <div className="dashboard-container">
// //       {/* Header */}
// //       <div className="dashboard-header">
// //         <h1>Dashboard</h1>
// //         <p className="welcome-text">
// //           Welcome back! Here is an overview of your locations today.
// //         </p>
// //       </div>

// //       {/* Thông tin địa điểm */}
// //       {place ? (
// //         <div className="place-card">
// //           <div className="place-image">
// //             <img
// //               src={place.image || "https://via.placeholder.com/600x300"}
// //               alt={place.name}
// //             />
// //           </div>
// //           <div className="place-info">
// //             <h2>{place.name}</h2>
// //             <p className="place-address">
// //               <MapPin size={18} /> {place.address || "DN"}
// //             </p>
// //             {place.phone && (
// //               <p className="place-phone">
// //                 <Phone size={18} /> {place.phone}
// //               </p>
// //             )}
// //             <div className="place-status">
// //               <span className={`status-dot ${isOpenNow ? "open" : "closed"}`}></span>
// //               {isOpenNow ? "Open Now" : "Closed Now"}
// //             </div>
// //           </div>
// //         </div>
// //       ) : (
// //         <p style={{ marginTop: "20px" }}>No locations found.</p>
// //       )}

// //       {/* Stats Grid */}
// //       <div className="stats-grid">
// //         <div 
// //           className="stat-card rating-card" 
// //           onClick={() => navigate("/partner/rating")}   // Click để chuyển trang rating
// //           style={{ cursor: "pointer" }}
// //           title="Click để xem chi tiết đánh giá"
// //         >
// //           <Star size={28} />
// //           <h3>{stats.rating}</h3>
// //           <p>Ratings</p>
// //         </div>

// //         <div className="stat-card">
// //           <TrendingUp size={28} />
// //           <h3>{stats.activeDiscounts}</h3>
// //           <p>Active Discounts</p>
// //         </div>
// //       </div>

// //       {/* Quick Actions */}
// //       <div className="quick-actions">
// //         <div className="actions-grid">
// //           <button
// //             className="action-btn primary"
// //             onClick={() => navigate("/partner/hours")}
// //           >
// //             <Clock size={20} />
// //             Update Opening Hours
// //           </button>

// //           <button
// //             className="action-btn"
// //             onClick={() => navigate("/partner/menu")}
// //           >
// //             <MenuSquare size={20} />
// //             Menu
// //           </button>
// //           <button
// //             className="action-btn"
// //             onClick={() => navigate("/partner/discount")}
// //           >
// //             <Percent size={20} />
// //             Add New Discount
// //           </button>

// //           <button
// //             className="action-btn"
// //             onClick={() => navigate("/partner/notifications")}
// //           >
// //             <Bell size={20} />
// //             Notification
// //           </button>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // export default PartnerFirst;



import { useState, useEffect } from "react";
import {
  MapPin, Clock, TrendingUp, Star,
  MenuSquare, Percent, Bell, Phone
} from "lucide-react";
import "./PartnerFirst.css";

const PartnerFirst = ({ data, onSwitchTab }) => {
  const [isOpenNow, setIsOpenNow] = useState(false);
  const [stats, setStats] = useState({ rating: 0, activeDiscounts: 0 });

  // Lấy place đầu tiên từ fullData truyền xuống
  const place = data?.locations?.[0] || null;

  // ==================== HELPER FUNCTIONS (Giữ nguyên logic của Tiên) ====================
  const getTodaySchedule = (schedule) => {
    if (!schedule || !Array.isArray(schedule) || schedule.length === 0) return null;
    const todayIndex = new Date().getDay();
    const englishDays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    return schedule.find(day => day.day === englishDays[todayIndex]);
  };

  const calculateIsOpenNow = (hoursRecord) => {
    if (!hoursRecord || hoursRecord.isOpenToday === false) return false;
    const todaySchedule = getTodaySchedule(hoursRecord.schedule);
    if (!todaySchedule || todaySchedule.isClosed) return false;

    const now = new Date();
    const currentMin = now.getHours() * 60 + now.getMinutes();
    const parse = (t) => {
      const [h, m] = t.split(":").map(Number);
      return h * 60 + m;
    };
    const openMin = parse(todaySchedule.openTime);
    let closeMin = parse(todaySchedule.closeTime);
    if (closeMin <= openMin && closeMin !== 0) closeMin += 1440;

    return currentMin >= openMin && currentMin < closeMin;
  };

  // ==================== XỬ LÝ DATA TỪ PROPS ====================
  useEffect(() => {
    if (place) {
      // 1. Tính toán trạng thái đóng/mở
      // Ở đây dùng data.hours_data (giả sử Tiên fetch kèm trong fullData)
      setIsOpenNow(calculateIsOpenNow(data.hours_record));

      // 2. Tính toán Discount đang active
      const now = new Date();
      const activeCount = (data.discounts || []).filter(d => {
        const start = new Date(d.startDate);
        const end = new Date(d.endDate);
        end.setHours(23, 59, 59);
        return now >= start && now <= end;
      }).length;

      setStats({
        rating: place.rating || 4.5,
        activeDiscounts: activeCount,
      });
    }
  }, [data, place]);

  if (!place) return <div className="no-data">No locations found. Please add a place first.</div>;

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <p className="welcome-text">Overview of your locations today.</p>
      </div>

      <div className="place-card">
        <div className="place-image">
          <img src={place.image || "https://via.placeholder.com/600x300"} alt={place.name} />
        </div>
        <div className="place-info">
          <h2>{place.name}</h2>
          <p className="place-address"><MapPin size={18} /> {place.address}</p>
          <div className="place-status">
            <span className={`status-dot ${isOpenNow ? "open" : "closed"}`}></span>
            {isOpenNow ? "Open Now" : "Closed Now"}
          </div>
        </div>
      </div>

      <div className="stats-grid">
        {/* THAY navigate THÀNH onSwitchTab */}
        <div className="stat-card rating-card" onClick={() => onSwitchTab("rating")}>
          <Star size={28} />
          <h3>{stats.rating}</h3>
          <p>Ratings</p>
        </div>

        <div className="stat-card">
          <TrendingUp size={28} />
          <h3>{stats.activeDiscounts}</h3>
          <p>Active Discounts</p>
        </div>
      </div>

      <div className="quick-actions">
        <div className="actions-grid">
          {/* Chuyển Tab cực nhanh không cần load trang */}
          <button className="action-btn primary" onClick={() => onSwitchTab("hours")}>
            <Clock size={20} /> Update Hours
          </button>
          <button className="action-btn" onClick={() => onSwitchTab("menu")}>
            <MenuSquare size={20} /> Menu
          </button>
          <button className="action-btn" onClick={() => onSwitchTab("discount")}>
            <Percent size={20} /> Add Discount
          </button>
          <button className="action-btn" onClick={() => onSwitchTab("notifications")}>
            <Bell size={20} /> Notifications
          </button>
        </div>
      </div>
    </div>
  );
};

export default PartnerFirst;