
// import { useState, useEffect } from "react";
// import { Edit2, Trash2, Check, Search } from "lucide-react";
// import { useNavigate } from "react-router-dom";
// import "./HistoryPage.css";

// const API = "http://localhost:3001";

// export default function HistoryPage() {
//   const [plans, setPlans] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();

//   // Fetch danh sách các chuyến đi
//   useEffect(() => {
//     fetchPlans();
//   }, []);

//   const fetchPlans = async () => {
//     try {
//       // Lưu ý: Tùy vào cấu trúc DB của bạn, có thể fetch từ /trips hoặc /tripVersions
//       const res = await fetch(`${API}/tripVersions`);
//       const data = await res.json();

//       // Nhóm dữ liệu hoặc lọc các bản Final (nếu bạn dùng chung bảng tripVersions)
//       // Ở đây mình map theo logic bạn đã viết để hiển thị thông tin cơ bản
//       const formatted = data.map((trip) => ({
//         id: trip.tripId || trip.id,
//         dbId: trip.id, // ID thực của row trong json-server để xóa/sửa
//         title: trip.title || `Trip to ${trip.location || "Unknown"}`,
//         destination: trip.location || "Unknown",
//         startDate: trip.departure_date,
//         endDate: trip.return_date,
//         budget: trip.budget,
//         isSaved: trip.isFinal || false, // Dựa trên field isFinal ở OutputPage
//       }));

//       // Nếu có nhiều version cùng tripId, lọc lấy bản mới nhất hoặc bản Final
//       setPlans(formatted);
//     } catch (err) {
//       console.error("Fetch trips error:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleRowClick = (id) => {
//     navigate(`/output/${id}`);
//   };

//   const handleDelete = async (e, id) => {
//     e.stopPropagation(); // Chặn chuyển trang khi bấm xóa
//     if (!window.confirm("Bạn có chắc chắn muốn xóa kế hoạch này?")) return;

//     try {
//       const res = await fetch(`${API}/tripVersions/${id}`, { method: "DELETE" });
//       if (res.ok) {
//         setPlans((prev) => prev.filter((plan) => plan.dbId !== id));
//       }
//     } catch (err) {
//       console.error(err);
//       alert("Không thể xóa kế hoạch này!");
//     }
//   };

//   const handleEdit = (e, id) => {
//     e.stopPropagation();
//     navigate(`/output/${id}`);
//   };

//   const filteredPlans = plans.filter((plan) => {
//     const search = searchTerm.toLowerCase();
//     return (
//       plan.title?.toLowerCase().includes(search) ||
//       plan.destination?.toLowerCase().includes(search)
//     );
//   });

//   return (
//     <div className="history-container">
//       <div className="history-content">
//         <header className="history-header">
//           <h1>Lịch sử chuyến đi</h1>
//           <div className="search-wrapper">
//             <Search className="search-icon" size={20} />
//             <input
//               type="text"
//               placeholder="Tìm kiếm chuyến đi hoặc địa điểm..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//             />
//           </div>
//         </header>

//         {loading ? (
//           <div className="status-message">Đang tải danh sách...</div>
//         ) : filteredPlans.length === 0 ? (
//           <div className="status-message">Bạn chưa có kế hoạch nào.</div>
//         ) : (
//           <div className="history-list">
//             {filteredPlans.map((plan) => (
//               <div
//                 key={plan.dbId}
//                 className={`history-card ${plan.isSaved ? "is-final" : ""}`}
//                 onClick={() => handleRowClick(plan.id)}
//               >
//                 {/* Trạng thái đã chốt (Final) */}
//                 <div className={`status-indicator ${plan.isSaved ? "saved" : ""}`}>
//                   {plan.isSaved ? <Check size={16} color="white" /> : null}
//                 </div>

//                 <div className="plan-info">
//                   <h3 className="plan-title">{plan.title}</h3>
//                   <p className="plan-details">
//                     {plan.destination} • {plan.startDate} - {plan.endDate}
//                   </p>
//                 </div>

//                 <div className="plan-meta">
//                   <div className="budget-info">
//                     <span>Ngân sách</span>
//                     <strong>{plan.budget?.toLocaleString("vi-VN")} ₫</strong>
//                   </div>

//                   <div className="action-buttons">
//                     {!plan.isSaved && (
//                       <button 
//                         className="action-btn edit" 
//                         onClick={(e) => handleEdit(e, plan.id)}
//                         title="Chỉnh sửa"
//                       >
//                         <Edit2 size={18} />
//                       </button>
//                     )}
//                     <button 
//                       className="action-btn delete" 
//                       onClick={(e) => handleDelete(e, plan.dbId)}
//                       title="Xóa"
//                     >
//                       <Trash2 size={18} />
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }



/**
 * HistoryPage.jsx
 * Component hiển thị danh sách các plan đã tạo
 * Flow:
 *  - Fetch tất cả tripVersions từ backend
 *  - Hiển thị danh sách plan (tối đa 5 cho mỗi input)
 *  - Cho phép search, edit (nếu chưa save), delete
 *  - Nếu plan đã save → chỉ xem, không chỉnh sửa
 */

import { useState, useEffect } from "react";
import { Edit2, Trash2, Check, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./HistoryPage.css";


export default function HistoryPage() {
  const [plans, setPlans] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch danh sách các chuyến đi
  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const res = await fetch(import.meta.env.VITE_HISTORY);
      const data = await res.json();

      // Chuẩn hóa dữ liệu để hiển thị
      const formatted = data.map((trip) => ({
        id: trip.id, // ID dùng để navigate
        title: trip.title || `Trip to ${trip.location || "Unknown"}`,
        destination: trip.location || "Unknown",
        startDate: trip.departure_date,
        endDate: trip.return_date,
        budget: trip.budget,
        isSaved: trip.saved || false, // field saved từ OutputPage
      }));

      setPlans(formatted);
    } catch (err) {
      console.error("Fetch trips error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Click vào card → navigate sang OutputPage
  const handleRowClick = (id) => {
    navigate(`/output/${id}`);
  };

  // Xóa plan
  const handleDelete = async (e, id) => {
    e.stopPropagation(); // Chặn navigate khi bấm nút delete
    if (!window.confirm("Are you sure you want to delete this plan?")) return;

    try {
      const res = await fetch(`${import.meta.env.VITE_HISTORY}${id}`, { method: "DELETE" });
      if (res.ok) {
        setPlans((prev) => prev.filter((plan) => plan.id !== id));
      }
    } catch (err) {
      console.error(err);
      alert("Failed to delete this plan!");
    }
  };

  // Edit plan (chỉ nếu chưa save)
  const handleEdit = (e, id) => {
    e.stopPropagation();
    navigate(`/output/${id}`);
  };

  // Search filter
  const filteredPlans = plans.filter((plan) => {
    const search = searchTerm.toLowerCase();
    return (
      plan.title?.toLowerCase().includes(search) ||
      plan.destination?.toLowerCase().includes(search)
    );
  });

  return (
    <div className="history-container">
      <div className="history-content">
        <header className="history-header">
          <h1>Trip History</h1>
          <div className="search-wrapper">
            <Search className="search-icon" size={20} />
            <input
              type="text"
              placeholder="Search trip or destination..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </header>

        {loading ? (
          <div className="status-message">Loading plans...</div>
        ) : filteredPlans.length === 0 ? (
          <div className="status-message">No plans found.</div>
        ) : (
          <div className="history-list">
            {filteredPlans.map((plan) => (
              <div
                key={plan.id}
                className={`history-card ${plan.isSaved ? "is-final" : ""}`}
                onClick={() => handleRowClick(plan.id)}
              >
                {/* Trạng thái đã save */}
                <div className={`status-indicator ${plan.isSaved ? "saved" : ""}`}>
                  {plan.isSaved ? <Check size={16} color="white" /> : null}
                </div>

                <div className="plan-info">
                  <h3 className="plan-title">{plan.title}</h3>
                  <p className="plan-details">
                    {plan.destination} • {plan.startDate} - {plan.endDate}
                  </p>
                </div>

                <div className="plan-meta">
                  <div className="budget-info">
                    <span>Budget</span>
                    <strong>{plan.budget?.toLocaleString("en-US")} ₫</strong>
                  </div>

                  <div className="action-buttons">
                    {!plan.isSaved && (
                      <button 
                        className="action-btn edit" 
                        onClick={(e) => handleEdit(e, plan.id)}
                        title="Edit"
                      >
                        <Edit2 size={18} />
                      </button>
                    )}
                    <button 
                      className="action-btn delete" 
                      onClick={(e) => handleDelete(e, plan.id)}
                      title="Delete"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
