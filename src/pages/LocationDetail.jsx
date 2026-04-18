

// import { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { Star, MessageCircle, ArrowLeft } from "lucide-react";
// import UserFeedBack from "./UserFeedBack";
// import "./LocationDetail.css";

// const API = "http://localhost:3001";

// const LocationDetail = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();

//   const [location, setLocation] = useState(null);
//   const [comments, setComments] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [openSection, setOpenSection] = useState(null);
//   const [showReviewModal, setShowReviewModal] = useState(false);

//   // Lấy thông tin địa điểm + danh sách đánh giá
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         // Lấy thông tin địa điểm
//         const locRes = await fetch(`${API}/locations/${id}`);
//         if (!locRes.ok) throw new Error("Location not found");
//         const locData = await locRes.json();
//         setLocation(locData);

//         // Lấy danh sách đánh giá
//         const commentRes = await fetch(`${API}/comments?locationId=${id}`);
//         if (commentRes.ok) {
//           const commentData = await commentRes.json();
//           setComments(Array.isArray(commentData) ? commentData : []);
//         }
//       } catch (err) {
//         console.error("Error fetching data:", err);
//         setLocation(null);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [id]);

//   const toggleSection = (section) => {
//     setOpenSection(openSection === section ? null : section);
//   };

//   // Callback khi người dùng gửi đánh giá thành công → refresh danh sách
//   const handleReviewSubmitted = () => {
//     // Refresh comments
//     fetch(`${API}/comments?locationId=${id}`)
//       .then(res => res.ok ? res.json() : [])
//       .then(data => setComments(Array.isArray(data) ? data : []));
//   };

//   if (loading) return <div className="loading">Đang tải thông tin địa điểm...</div>;
//   if (!location) return <div className="error">Không tìm thấy địa điểm này.</div>;

//   return (
//     <div className="location-detail">
//       <button className="back-btn" onClick={() => navigate("/locations")}>
//         <ArrowLeft size={20} /> Quay lại
//       </button>

//       <img
//         src={location.image}
//         alt={location.name}
//         className="location-image"
//       />

//       <h1>{location.name}</h1>
//       <p className="description">{location.description}</p>

// {/* Address */}
// <div className="section">
//   <h3>📍 Địa chỉ</h3>
//   <div className="dropdown">
//     <p>{location.address}</p>
//   </div>
// </div>

// {/* Opening Hours */}
// <div className="section">
//   <h3>⏰ Giờ mở cửa</h3>
//   <div className="dropdown">
//     <p>{location.openingHours || "Chưa cập nhật"}</p>
//   </div>
// </div>

//       {/* Menu */}
//       <div className="section">
//         <h3 onClick={() => toggleSection("menu")}>🍽️ Thực đơn</h3>
//         {openSection === "menu" && (
//           <div className="dropdown">
//             {location.menu?.length > 0 ? (
//               location.menu.map((item, index) => (
//                 <p key={index}>- {item}</p>
//               ))
//             ) : (
//               <p>Chưa có thông tin thực đơn</p>
//             )}
//           </div>
//         )}
//       </div>

//       {/* Discount */}
//       <div className="section">
//         <h3 onClick={() => toggleSection("discount")}>🎟️ Khuyến mãi</h3>
//         {openSection === "discount" && (
//           <div className="dropdown">
//             <p>{location.discount || "Hiện chưa có khuyến mãi"}</p>
//           </div>
//         )}
//       </div>

//       {/* ==================== REVIEWS SECTION ==================== */}
//       <div className="reviews-section">
//         <div className="reviews-header">
//           <h2>
//             <MessageCircle size={24} /> Đánh giá từ khách hàng 
//             <span className="review-count">({comments.length})</span>
//           </h2>
//           <button 
//             className="write-review-btn"
//             onClick={() => setShowReviewModal(true)}
//           >
//             <Star size={20} /> Viết đánh giá
//           </button>
//         </div>

//         <div className="comments-list">
//           {comments.length === 0 ? (
//             <p className="no-comments">Chưa có đánh giá nào. Hãy là người đầu tiên chia sẻ!</p>
//           ) : (
//             comments.map((comment) => (
//               <div key={comment.id} className="comment-item">
//                 <div className="comment-header">
//                   <div className="user-info">
//                     <span className="user-avatar">{comment.name?.charAt(0)?.toUpperCase()}</span>
//                     <strong>{comment.name}</strong>
//                   </div>
//                   <div className="comment-rating">
//                     {Array.from({ length: 5 }).map((_, i) => (
//                       <Star
//                         key={i}
//                         size={18}
//                         fill={i < comment.rating ? "#fbbf24" : "none"}
//                         color="#fbbf24"
//                       />
//                     ))}
//                   </div>
//                 </div>
//                 <p className="comment-content">{comment.content}</p>
//                 <small className="comment-time">
//                   {new Date(comment.createdAt).toLocaleDateString("vi-VN")}
//                 </small>
//               </div>
//             ))
//           )}
//         </div>
//       </div>

//       {/* Modal viết đánh giá */}
//       {showReviewModal && (
//         <UserFeedBack 
//           placeId={id} 
//           onClose={() => setShowReviewModal(false)} 
//           onReviewSubmitted={handleReviewSubmitted}
//         />
//       )}
//     </div>
//   );
// };

// export default LocationDetail;




/**
 * LocationDetail.jsx
 * Component hiển thị chi tiết một địa điểm
 * Flow:
 *  - Fetch chi tiết địa điểm theo id
 *  - Fetch comment liên quan
 *  - Hiển thị thông tin + danh sách comment
 *  - Cho phép user thêm review qua UserFeedBack
 */

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Star, MessageCircle, ArrowLeft } from "lucide-react";
import UserFeedBack from "./UserFeedBack";
import "./LocationDetail.css";



const LocationDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [location, setLocation] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openSection, setOpenSection] = useState(null);
  const [showReviewModal, setShowReviewModal] = useState(false);

  // Fetch dữ liệu địa điểm + comment
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Lấy thông tin địa điểm
        const locRes = await fetch(`${import.meta.env.VITE_Location}${id}`);
        if (!locRes.ok) throw new Error("Location not found");
        const locData = await locRes.json();
        setLocation(locData);

        // Lấy danh sách đánh giá
        const commentRes = await fetch(`${import.meta.env.VITE_Location_Comment}?locationId=${id}`);
        if (commentRes.ok) {
          const commentData = await commentRes.json();
          setComments(Array.isArray(commentData) ? commentData : []);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setLocation(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // Toggle mở/đóng section (menu, discount)
  const toggleSection = (section) => {
    setOpenSection(openSection === section ? null : section);
  };

  // Callback khi user gửi review thành công → refresh comments
  const handleReviewSubmitted = () => {
    fetch(`${import.meta.env.VITE_Location_Comment}?locationId=${id}`)
      .then(res => res.ok ? res.json() : [])
      .then(data => setComments(Array.isArray(data) ? data : []));
  };

  if (loading) return <div className="loading">Loading location details...</div>;
  if (!location) return <div className="error">Location not found.</div>;

  return (
    <div className="location-detail">
      {/* Nút quay lại */}
      <button className="back-btn" onClick={() => navigate("/locations")}>
        <ArrowLeft size={20} /> Back
      </button>

      {/* Hình ảnh + tên + mô tả */}
      <img
        src={location.image || "https://placehold.co/600x400"}
        alt={location.name}
        className="location-image"
      />

      <h1>{location.name}</h1>
      <p className="description">{location.description}</p>

      {/* Address */}
      <div className="section">
        <h3>📍 Address</h3>
        <div className="dropdown">
          <p>{location.address || "No address available"}</p>
        </div>
      </div>

      {/* Opening Hours */}
      <div className="section">
        <h3>⏰ Opening Hours</h3>
        <div className="dropdown">
          <p>{location.openingHours || "Not updated yet"}</p>
        </div>
      </div>

      {/* Menu */}
      <div className="section">
        <h3 onClick={() => toggleSection("menu")}>🍽️ Menu</h3>
        {openSection === "menu" && (
          <div className="dropdown">
            {location.menu?.length > 0 ? (
              location.menu.map((item, index) => (
                <p key={index}>- {item}</p>
              ))
            ) : (
              <p>No menu information</p>
            )}
          </div>
        )}
      </div>

      {/* Discount */}
      <div className="section">
        <h3 onClick={() => toggleSection("discount")}>🎟️ Discount</h3>
        {openSection === "discount" && (
          <div className="dropdown">
            <p>{location.discount || "No discount available"}</p>
          </div>
        )}
      </div>

      {/* ==================== REVIEWS SECTION ==================== */}
      <div className="reviews-section">
        <div className="reviews-header">
          <h2>
            <MessageCircle size={24} /> Customer Reviews 
            <span className="review-count">({comments.length})</span>
          </h2>
          <button 
            className="write-review-btn"
            onClick={() => setShowReviewModal(true)}
          >
            <Star size={20} /> Write a review
          </button>
        </div>

        {/* Danh sách comment */}
        <div className="comments-list">
          {comments.length === 0 ? (
            <p className="no-comments">No reviews yet. Be the first to share!</p>
          ) : (
            comments.map((comment) => (
              <div key={comment.id} className="comment-item">
                <div className="comment-header">
                  <div className="user-info">
                    <span className="user-avatar">{comment.name?.charAt(0)?.toUpperCase()}</span>
                    <strong>{comment.name}</strong>
                  </div>
                  <div className="comment-rating">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        size={18}
                        fill={i < comment.rating ? "#fbbf24" : "none"}
                        color="#fbbf24"
                      />
                    ))}
                  </div>
                </div>
                <p className="comment-content">{comment.content}</p>
                <small className="comment-time">
                  {new Date(comment.createdAt).toLocaleDateString("en-GB")}
                </small>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Modal viết đánh giá */}
      {showReviewModal && (
        <UserFeedBack 
          placeId={id} 
          onClose={() => setShowReviewModal(false)} 
          onReviewSubmitted={handleReviewSubmitted}
        />
      )}
    </div>
  );
};

export default LocationDetail;
