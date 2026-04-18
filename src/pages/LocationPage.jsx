


import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Star, MapPin, ChevronLeft, ChevronRight } from "lucide-react";
import "./LocationPage.css";

const API_BASE = "http://localhost:3001";

const LocationPage = () => {
  const [locations, setLocations] = useState([]);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("q") || "";
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 30;
  const navigate = useNavigate();

  // ✅ Fetch dữ liệu từ API
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [locRes, comRes] = await Promise.all([
          fetch(`${API_BASE}/locations`),
          fetch(`${API_BASE}/comments`),
        ]);
        const locData = await locRes.json();
        const comData = await comRes.json();
        setLocations(locData);
        setComments(comData);
        setCurrentPage(1);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [searchQuery]);

  // ✅ Lọc dữ liệu theo tìm kiếm
  const filteredData = locations.filter((loc) =>
    loc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (loc.city && loc.city.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // ✅ Logic Phân trang
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ⭐ TÍNH RATING TRUNG BÌNH (Đã sửa lỗi ép kiểu String/Number)
  const getAverageRating = (locationId) => {
    const locationComments = comments.filter(
      (c) => String(c.locationId) === String(locationId)
    );
    if (locationComments.length === 0) return null;
    
    const total = locationComments.reduce((sum, c) => sum + Number(c.rating), 0);
    return (total / locationComments.length).toFixed(1);
  };

  // ⭐ ĐẾM SỐ REVIEW (Đã sửa lỗi ép kiểu)
  const getReviewCount = (locationId) => {
    return comments.filter((c) => String(c.locationId) === String(locationId)).length;
  };

  if (loading) {
    return (
      <div className="location-page">
        <p className="loading-status">Đang tải danh sách địa điểm...</p>
      </div>
    );
  }

  return (
    <div className="location-page">
      {searchQuery && (
        <h2 className="search-title">Kết quả tìm kiếm cho: "{searchQuery}"</h2>
      )}

      <div className="location-grid">
        {currentItems.length > 0 ? (
          currentItems.map((loc) => {
            const avgRating = getAverageRating(loc.id);
            const reviewCount = getReviewCount(loc.id);

            return (
              <div
                key={loc.id}
                className="location-card"
                onClick={() => navigate(`/locations/${loc.id}`)}
              >
                <div className="image-container">
                  <img
                    src={loc.image || "https://placehold.co/300x200"}
                    alt={loc.name}
                    className="location-image"
                  />
                </div>
                <div className="location-info">
                  <h3>{loc.name}</h3>
                  <p className="location-address">
                    <MapPin size={16} className="icon-inline" />
                    {loc.city || loc.address}
                  </p>
                  
                  {/* Hiển thị Rating nếu có comment */}
                  {avgRating ? (
                    <div className="rating">
                      <Star size={18} fill="#fbbf24" color="#fbbf24" />
                      <span className="rating-value">{avgRating}</span>
                      <span className="review-count">({reviewCount} đánh giá)</span>
                    </div>
                  ) : (
                    <div className="rating no-rating">
                      <Star size={18} color="#ccc" />
                      <span>Chưa có đánh giá</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <p className="no-results">Không tìm thấy địa điểm nào.</p>
        )}
      </div>

      {/* Điều khiển Phân trang */}
      {totalPages > 1 && (
        <div className="pagination">
          <button
            disabled={currentPage === 1}
            onClick={() => handlePageChange(currentPage - 1)}
            className="page-btn"
          >
            <ChevronLeft size={20} />
          </button>
          
          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index + 1}
              onClick={() => handlePageChange(index + 1)}
              className={`page-number ${
                currentPage === index + 1 ? "active" : ""
              }`}
            >
              {index + 1}
            </button>
          ))}

          <button
            disabled={currentPage === totalPages}
            onClick={() => handlePageChange(currentPage + 1)}
            className="page-btn"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      )}
    </div>
  );
};

export default LocationPage;



/**
 * LocationDetail.jsx
 * Component hiển thị chi tiết một địa điểm
 * Flow:
 *  - Fetch chi tiết địa điểm theo id
 *  - Fetch comment liên quan
 *  - Hiển thị thông tin + danh sách comment
 *  - Cho phép user thêm comment và rating
 */

// import { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import { Star, MapPin } from "lucide-react";
// import "./LocationDetail.css";

// const API_BASE = "http://localhost:3001";

// export default function LocationDetail() {
//   const { id } = useParams();
//   const [location, setLocation] = useState(null);
//   const [comments, setComments] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const [newComment, setNewComment] = useState("");
//   const [newRating, setNewRating] = useState(0);

//   // Fetch dữ liệu chi tiết
//   useEffect(() => {
//     const fetchData = async () => {
//       setLoading(true);
//       try {
//         const [locRes, comRes] = await Promise.all([
//           fetch(`${API_BASE}/locations/${id}`),
//           fetch(`${API_BASE}/comments?locationId=${id}`),
//         ]);
//         const locData = await locRes.json();
//         const comData = await comRes.json();
//         setLocation(locData);
//         setComments(comData);
//       } catch (error) {
//         console.error("Error fetching detail:", error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchData();
//   }, [id]);

//   // Tính rating trung bình
//   const averageRating = comments.length
//     ? (comments.reduce((sum, c) => sum + Number(c.rating), 0) / comments.length).toFixed(1)
//     : null;

//   // Submit comment mới
//   const handleSubmitComment = async () => {
//     if (!newComment || newRating <= 0) {
//       alert("Please enter comment and rating!");
//       return;
//     }

//     const payload = {
//       locationId: id,
//       text: newComment,
//       rating: newRating,
//       created_at: new Date().toISOString(),
//     };

//     try {
//       const res = await fetch(`${API_BASE}/comments`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload),
//       });
//       if (res.ok) {
//         const saved = await res.json();
//         setComments([...comments, saved]);
//         setNewComment("");
//         setNewRating(0);
//         alert("Comment submitted successfully!");
//       }
//     } catch (err) {
//       console.error(err);
//       alert("Failed to submit comment!");
//     }
//   };

//   if (loading) return <div className="location-detail">Loading...</div>;
//   if (!location) return <div className="location-detail">No data found</div>;

//   return (
//     <div className="location-detail">
//       <div className="detail-header">
//         <img
//           src={location.image || "https://placehold.co/600x400"}
//           alt={location.name}
//           className="detail-image"
//         />
//         <div className="detail-info">
//           <h2>{location.name}</h2>
//           <p>
//             <MapPin size={16} /> {location.city || location.address}
//           </p>
//           {averageRating ? (
//             <div className="rating">
//               <Star size={18} fill="#fbbf24" color="#fbbf24" />
//               <span>{averageRating} / 5</span>
//               <span>({comments.length} reviews)</span>
//             </div>
//           ) : (
//             <p>No rating yet</p>
//           )}
//         </div>
//       </div>

//       <div className="detail-description">
//         <p>{location.description || "No description available."}</p>
//       </div>

//       {/* Comment list */}
//       <div className="comments-section">
//         <h3>Reviews</h3>
//         {comments.length > 0 ? (
//           comments.map((c) => (
//             <div key={c.id} className="comment-card">
//               <p>{c.text}</p>
//               <div className="comment-meta">
//                 <Star size={16} fill="#fbbf24" color="#fbbf24" />
//                 <span>{c.rating}</span>
//               </div>
//             </div>
//           ))
//         ) : (
//           <p>No comments yet.</p>
//         )}
//       </div>

//       {/* Add comment */}
//       <div className="add-comment">
//         <h3>Add your review</h3>
//         <textarea
//           value={newComment}
//           onChange={(e) => setNewComment(e.target.value)}
//           placeholder="Write your comment..."
//         />
//         <input
//           type="number"
//           min="1"
//           max="5"
//           value={newRating}
//           onChange={(e) => setNewRating(Number(e.target.value))}
//           placeholder="Rating (1-5)"
//         />
//         <button onClick={handleSubmitComment}>Submit</button>
//       </div>
//     </div>
//   );
// }
