// import { useState, useEffect } from "react";
// import { Star, MessageCircle, Send, ArrowLeft } from "lucide-react";
// import { useNavigate } from "react-router-dom";
// import "./PartnerRating.css";

// const API_BASE = "http://localhost:3001";

// const PartnerRating = () => {
//   const navigate = useNavigate();
//   const [reviews, setReviews] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [replyingTo, setReplyingTo] = useState(null); // id của review đang trả lời
//   const [replyText, setReplyText] = useState("");
//   const [submitting, setSubmitting] = useState(false);

//   // Lấy placeId từ user (partner)
//   const getPlaceId = async () => {
//     const user = JSON.parse(localStorage.getItem("user"));
//     if (!user) return null;

//     const res = await fetch(`${API_BASE}/locations?partnerId=${user.id}`);
//     const data = await res.json();
//     return data.length > 0 ? data[0].id : null;
//   };

//   // Fetch tất cả đánh giá của place
//   const fetchReviews = async () => {
//     try {
//       const placeId = await getPlaceId();
//       if (!placeId) {
//         setReviews([]);
//         setLoading(false);
//         return;
//       }

//       const res = await fetch(`${API_BASE}/reviews?placeId=${placeId}`);
//       const data = await res.json();
//       setReviews(data);
//     } catch (error) {
//       console.error("Lỗi khi tải đánh giá:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchReviews();
//   }, []);

//   // Gửi trả lời comment
//   const handleReply = async (reviewId) => {
//     if (!replyText.trim()) return;

//     setSubmitting(true);
//     try {
//       const res = await fetch(`${API_BASE}/reviews/${reviewId}/reply`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           reply: replyText.trim(),
//           repliedBy: "Partner" // hoặc lấy tên partner từ user
//         }),
//       });

//       if (res.ok) {
//         setReplyText("");
//         setReplyingTo(null);
//         fetchReviews(); // refresh danh sách
//       } else {
//         alert("Không thể gửi trả lời. Vui lòng thử lại!");
//       }
//     } catch (error) {
//       console.error(error);
//       alert("Lỗi kết nối server!");
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   const renderStars = (rating) => {
//     return Array.from({ length: 5 }).map((_, i) => (
//       <Star
//         key={i}
//         size={18}
//         fill={i < rating ? "#fbbf24" : "none"}
//         stroke={i < rating ? "#fbbf24" : "#d1d5db"}
//       />
//     ));
//   };

//   if (loading) return <div className="loading">Đang tải đánh giá...</div>;

//   return (
//     <div className="rating-container">
//       <div className="rating-header">
//         <button className="back-btn" onClick={() => navigate(-1)}>
//           <ArrowLeft size={20} /> Quay lại
//         </button>
//         <h1>Đánh giá từ khách hàng</h1>
//         <p className="review-count">{reviews.length} đánh giá</p>
//       </div>

//       {reviews.length === 0 ? (
//         <div className="no-reviews">
//           <MessageCircle size={60} />
//           <h3>Chưa có đánh giá nào</h3>
//           <p>Khi khách hàng đánh giá, chúng sẽ xuất hiện tại đây.</p>
//         </div>
//       ) : (
//         <div className="reviews-list">
//           {reviews.map((review) => (
//             <div key={review.id} className="review-card">
//               <div className="review-header">
//                 <div className="user-info">
//                   <div className="user-avatar">
//                     {review.userName?.charAt(0).toUpperCase() || "U"}
//                   </div>
//                   <div>
//                     <p className="user-name">{review.userName || "Khách hàng"}</p>
//                     <p className="review-date">
//                       {new Date(review.createdAt).toLocaleDateString("vi-VN")}
//                     </p>
//                   </div>
//                 </div>
//                 <div className="review-stars">
//                   {renderStars(review.rating)}
//                 </div>
//               </div>

//               <p className="review-comment">{review.comment}</p>

//               {/* Phần trả lời của Partner */}
//               {review.reply && (
//                 <div className="partner-reply">
//                   <strong>Phản hồi của bạn:</strong>
//                   <p>{review.reply}</p>
//                 </div>
//               )}

//               {/* Form trả lời */}
//               {!review.reply && (
//                 <div className="reply-section">
//                   {replyingTo === review.id ? (
//                     <div className="reply-form">
//                       <textarea
//                         value={replyText}
//                         onChange={(e) => setReplyText(e.target.value)}
//                         placeholder="Viết phản hồi của bạn..."
//                         rows={3}
//                       />
//                       <div className="reply-actions">
//                         <button 
//                           className="cancel-btn"
//                           onClick={() => {
//                             setReplyingTo(null);
//                             setReplyText("");
//                           }}
//                         >
//                           Hủy
//                         </button>
//                         <button 
//                           className="send-btn"
//                           onClick={() => handleReply(review.id)}
//                           disabled={submitting || !replyText.trim()}
//                         >
//                           <Send size={16} />
//                           {submitting ? "Đang gửi..." : "Gửi phản hồi"}
//                         </button>
//                       </div>
//                     </div>
//                   ) : (
//                     <button 
//                       className="reply-btn"
//                       onClick={() => setReplyingTo(review.id)}
//                     >
//                       <MessageCircle size={18} />
//                       Trả lời
//                     </button>
//                   )}
//                 </div>
//               )}
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default PartnerRating;


// /**
//  * PartnerRating.jsx
//  * -----------------
//  * Component hiển thị danh sách đánh giá từ khách hàng cho địa điểm của Partner.
//  * Flow:
//  *  1. Khởi tạo state quản lý reviews, loading, trạng thái trả lời (replyingTo), nội dung trả lời (replyText), submitting.
//  *  2. Lấy placeId từ user (partner) trong localStorage.
//  *  3. Fetch tất cả reviews của địa điểm từ JSON Server.
//  *  4. Hiển thị danh sách review: tên khách hàng, ngày, rating, comment.
//  *  5. Nếu Partner đã reply → hiển thị reply. Nếu chưa → cho phép nhập form trả lời.
//  *  6. Khi gửi reply → POST lên server, refresh lại danh sách.
//  *  7. Có nút quay lại để điều hướng về trang trước.
//  */

// // import { useState, useEffect } from "react";
// // import { Star, MessageCircle, Send, ArrowLeft } from "lucide-react";
// // import { useNavigate } from "react-router-dom";
// // import "./PartnerRating.css";

// // const API_BASE = "http://localhost:3001";

// // const PartnerRating = () => {
// //   const navigate = useNavigate();

// //   // ==================== STATE ====================
// //   const [reviews, setReviews] = useState([]); // danh sách review
// //   const [loading, setLoading] = useState(true); // trạng thái loading
// //   const [replyingTo, setReplyingTo] = useState(null); // id của review đang trả lời
// //   const [replyText, setReplyText] = useState(""); // nội dung reply
// //   const [submitting, setSubmitting] = useState(false); // trạng thái gửi reply

// //   // ==================== HELPER ====================
// //   // Lấy placeId từ user (partner)
// //   const getPlaceId = async () => {
// //     const user = JSON.parse(localStorage.getItem("user"));
// //     if (!user) return null;

// //     const res = await fetch(`${API_BASE}/locations?partnerId=${user.id}`);
// //     const data = await res.json();
// //     return data.length > 0 ? data[0].id : null;
// //   };

// //   // Fetch tất cả reviews của place
// //   const fetchReviews = async () => {
// //     try {
// //       const placeId = await getPlaceId();
// //       if (!placeId) {
// //         setReviews([]);
// //         setLoading(false);
// //         return;
// //       }

// //       const res = await fetch(`${API_BASE}/reviews?placeId=${placeId}`);
// //       const data = await res.json();
// //       setReviews(data);
// //     } catch (error) {
// //       console.error("Error fetching reviews:", error);
// //       alert("Failed to load reviews!");
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   useEffect(() => {
// //     fetchReviews();
// //   }, []);

// //   // Gửi trả lời comment
// //   const handleReply = async (reviewId) => {
// //     if (!replyText.trim()) return;

// //     setSubmitting(true);
// //     try {
// //       const res = await fetch(`${API_BASE}/reviews/${reviewId}/reply`, {
// //         method: "POST",
// //         headers: { "Content-Type": "application/json" },
// //         body: JSON.stringify({
// //           reply: replyText.trim(),
// //           repliedBy: "Partner", // hoặc lấy tên partner từ user
// //         }),
// //       });

// //       if (res.ok) {
// //         setReplyText("");
// //         setReplyingTo(null);
// //         fetchReviews(); // refresh danh sách
// //       } else {
// //         alert("Failed to send reply. Please try again!");
// //       }
// //     } catch (error) {
// //       console.error(error);
// //       alert("Server connection error!");
// //     } finally {
// //       setSubmitting(false);
// //     }
// //   };

// //   // Render stars cho rating
// //   const renderStars = (rating) => {
// //     return Array.from({ length: 5 }).map((_, i) => (
// //       <Star
// //         key={i}
// //         size={18}
// //         fill={i < rating ? "#fbbf24" : "none"}
// //         stroke={i < rating ? "#fbbf24" : "#d1d5db"}
// //       />
// //     ));
// //   };

// //   // ==================== RENDER ====================
// //   if (loading) return <div className="loading">Loading reviews...</div>;

// //   return (
// //     <div className="rating-container">
// //       {/* Header */}
// //       <div className="rating-header">
// //         <button className="back-btn" onClick={() => navigate(-1)}>
// //           <ArrowLeft size={20} /> Back
// //         </button>
// //         <h1>Customer Reviews</h1>
// //         <p className="review-count">{reviews.length} reviews</p>
// //       </div>

// //       {/* Nếu chưa có review */}
// //       {reviews.length === 0 ? (
// //         <div className="no-reviews">
// //           <MessageCircle size={60} />
// //           <h3>No reviews yet</h3>
// //           <p>When customers leave reviews, they will appear here.</p>
// //         </div>
// //       ) : (
// //         <div className="reviews-list">
// //           {reviews.map((review) => (
// //             <div key={review.id} className="review-card">
// //               {/* Header review */}
// //               <div className="review-header">
// //                 <div className="user-info">
// //                   <div className="user-avatar">
// //                     {review.userName?.charAt(0).toUpperCase() || "U"}
// //                   </div>
// //                   <div>
// //                     <p className="user-name">{review.userName || "Customer"}</p>
// //                     <p className="review-date">
// //                       {new Date(review.createdAt).toLocaleDateString("en-GB")}
// //                     </p>
// //                   </div>
// //                 </div>
// //                 <div className="review-stars">{renderStars(review.rating)}</div>
// //               </div>

// //               {/* Nội dung comment */}
// //               <p className="review-comment">{review.comment}</p>

// //               {/* Phần trả lời của Partner */}
// //               {review.reply && (
// //                 <div className="partner-reply">
// //                   <strong>Your reply:</strong>
// //                   <p>{review.reply}</p>
// //                 </div>
// //               )}

// //               {/* Form trả lời nếu chưa có reply */}
// //               {!review.reply && (
// //                 <div className="reply-section">
// //                   {replyingTo === review.id ? (
// //                     <div className="reply-form">
// //                       <textarea
// //                         value={replyText}
// //                         onChange={(e) => setReplyText(e.target.value)}
// //                         placeholder="Write your reply..."
// //                         rows={3}
// //                       />
// //                       <div className="reply-actions">
// //                         <button
// //                           className="cancel-btn"
// //                           onClick={() => {
// //                             setReplyingTo(null);
// //                             setReplyText("");
// //                           }}
// //                         >
// //                           Cancel
// //                         </button>
// //                         <button
// //                           className="send-btn"
// //                           onClick={() => handleReply(review.id)}
// //                           disabled={submitting || !replyText.trim()}
// //                         >
// //                           <Send size={16} />
// //                           {submitting ? "Submitting..." : "Send reply"}
// //                         </button>
// //                       </div>
// //                     </div>
// //                   ) : (
// //                     <button
// //                       className="reply-btn"
// //                       onClick={() => setReplyingTo(review.id)}
// //                     >
// //                       <MessageCircle size={18} />
// //                       Reply
// //                     </button>
// //                   )}
// //                 </div>
// //               )}
// //             </div>
// //           ))}
// //         </div>
// //       )}
// //     </div>
// //   );
// // };

// // export default PartnerRating;





import { useEffect, useState } from "react";
import "./PartnerRating.css";

const API_BASE = "http://localhost:3001";

const PartnerRating = () => {
  const [reviews, setReviews] = useState([]);
  const [placeId, setPlaceId] = useState(null);
  const [loading, setLoading] = useState(true);

  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchReviews();
  }, []);

  // ✅ FETCH REVIEWS FROM COMMENTS
  const fetchReviews = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user) return;

      const partnerId = user.id;

      // lấy location
      const placeRes = await fetch(
        `${API_BASE}/locations?partnerId=${partnerId}`
      );
      const placeData = await placeRes.json();

      if (placeData.length === 0) return;

      const currentPlaceId = placeData[0].id;
      setPlaceId(currentPlaceId);

      // lấy comments (reviews)
      const reviewRes = await fetch(
        `${API_BASE}/comments?placeId=${currentPlaceId}`
      );
      const reviewData = await reviewRes.json();

      setReviews(reviewData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // ⭐ CALCULATE AVERAGE RATING
  const getAverageRating = () => {
    if (reviews.length === 0) return 0;

    const total = reviews.reduce((sum, r) => sum + (r.rating || 0), 0);
    return (total / reviews.length).toFixed(1);
  };

  // ⭐ RENDER STARS
  const renderStars = (rating) => {
    const fullStars = Math.round(rating);
    return "★".repeat(fullStars) + "☆".repeat(5 - fullStars);
  };

  // ✅ HANDLE REPLY
  const handleReply = async (reviewId) => {
    if (!replyText.trim()) return;

    setSubmitting(true);

    try {
      const res = await fetch(`${API_BASE}/comments/${reviewId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reply: replyText.trim()
        })
      });

      if (res.ok) {
        setReplyText("");
        setReplyingTo(null);
        fetchReviews();
      } else {
        alert("Reply failed!");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="rating-container">
      <h1>Customer Reviews</h1>

      {/* ⭐ SUMMARY */}
      <div className="rating-summary">
        <h2>{getAverageRating()} / 5</h2>
        <p>{renderStars(getAverageRating())}</p>
        <span>{reviews.length} reviews</span>
      </div>

      {/* 📋 LIST REVIEWS */}
      <div className="review-list">
        {reviews.length === 0 ? (
          <p>No reviews yet</p>
        ) : (
          reviews.map((review) => (
            <div key={review.id} className="review-card">
              <h4>{review.userName || "Anonymous"}</h4>

              <p className="stars">
                {renderStars(review.rating || 0)}
              </p>

              <p className="comment">
                {review.comment || review.content}
              </p>

              {/* 🟢 REPLY */}
              {review.reply ? (
                <div className="reply-box">
                  <strong>Reply:</strong>
                  <p>{review.reply}</p>
                </div>
              ) : (
                <>
                  {replyingTo === review.id ? (
                    <div className="reply-form">
                      <input
                        type="text"
                        placeholder="Write a reply..."
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                      />

                      <button
                        onClick={() => handleReply(review.id)}
                        disabled={submitting}
                      >
                        Send
                      </button>

                      <button onClick={() => setReplyingTo(null)}>
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      className="reply-btn"
                      onClick={() => setReplyingTo(review.id)}
                    >
                      Reply
                    </button>
                  )}
                </>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default PartnerRating;