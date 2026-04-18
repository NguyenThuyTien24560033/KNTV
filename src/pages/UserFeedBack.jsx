
// import { useState } from "react";
// import { Star, X, Send } from "lucide-react";
// import "./UserFeedBack.css";

// const API_BASE = "http://localhost:3001";

// const UserFeedBack = ({ placeId, onClose, onReviewSubmitted }) => {
//   const [rating, setRating] = useState(0);
//   const [comment, setComment] = useState("");
//   const [submitting, setSubmitting] = useState(false);
//   const [hoverRating, setHoverRating] = useState(0);

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (rating === 0 || !comment.trim()) {
//       alert("Vui lòng chọn số sao và viết bình luận!");
//       return;
//     }

//     setSubmitting(true);

//     try {
//       const user = JSON.parse(localStorage.getItem("user"));

//       if (!user) {
//         alert("Bạn cần đăng nhập để đánh giá!");
//         setSubmitting(false);
//         return;
//       }

//       // ✅ DATA CHUẨN theo LocationDetail
//       const newComment = {
//         locationId: parseInt(placeId),
//         name: user.name || user.email,
//         rating: rating,
//         content: comment.trim(),
//         createdAt: new Date().toISOString(),
//       };

//       // ✅ FIX 404: đổi reviews → comments
//       const res = await fetch(`${API_BASE}/comments`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(newComment),
//       });

//       if (res.ok) {
//         alert("Cảm ơn bạn đã đánh giá!");
//         onReviewSubmitted?.(); // reload list bên ngoài
//         onClose();
//       } else {
//         alert("Gửi đánh giá thất bại. Vui lòng thử lại!");
//       }
//     } catch (error) {
//       console.error("Error:", error);
//       alert("Lỗi kết nối server!");
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   return (
//     <div className="review-modal-overlay">
//       <div className="review-modal">
//         <div className="modal-header">
//           <h2>Đánh giá địa điểm</h2>
//           <button className="close-btn" onClick={onClose}>
//             <X size={24} />
//           </button>
//         </div>

//         <form onSubmit={handleSubmit}>
//           {/* ⭐ Rating */}
//           <div className="rating-section">
//             <p>Đánh giá của bạn:</p>
//             <div className="stars">
//               {[1, 2, 3, 4, 5].map((star) => (
//                 <Star
//                   key={star}
//                   size={32}
//                   fill={(hoverRating || rating) >= star ? "#fbbf24" : "none"}
//                   stroke="#fbbf24"
//                   onMouseEnter={() => setHoverRating(star)}
//                   onMouseLeave={() => setHoverRating(0)}
//                   onClick={() => setRating(star)}
//                   style={{ cursor: "pointer" }}
//                 />
//               ))}
//             </div>
//             <p className="rating-text">
//               {rating > 0 ? `${rating} sao` : "Chưa chọn"}
//             </p>
//           </div>

//           {/* 📝 Comment */}
//           <div className="form-group">
//             <label>Bình luận của bạn</label>
//             <textarea
//               value={comment}
//               onChange={(e) => setComment(e.target.value)}
//               placeholder="Chia sẻ trải nghiệm của bạn về địa điểm này..."
//               rows={5}
//               required
//             />
//           </div>

//           {/* Buttons */}
//           <div className="modal-footer">
//             <button type="button" className="cancel-btn" onClick={onClose}>
//               Hủy
//             </button>

//             <button
//               type="submit"
//               className="submit-btn"
//               disabled={submitting || rating === 0}
//             >
//               <Send size={18} />
//               {submitting ? "Đang gửi..." : "Gửi đánh giá"}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default UserFeedBack;




/**
 * UserFeedBack.jsx
 * Component modal cho phép user viết review (comment + rating)
 * Flow:
 *  - User chọn số sao và viết bình luận
 *  - Submit → POST lên /comments trong JSON Server
 *  - Nếu thành công → gọi callback onReviewSubmitted để refresh list bên ngoài
 */

import { useState } from "react";
import { Star, X, Send } from "lucide-react";
import "./UserFeedBack.css";

const API_BASE = "http://localhost:3001";

const UserFeedBack = ({ placeId, onClose, onReviewSubmitted }) => {
  const [rating, setRating] = useState(0); // số sao
  const [comment, setComment] = useState(""); // nội dung bình luận
  const [submitting, setSubmitting] = useState(false); // trạng thái submit
  const [hoverRating, setHoverRating] = useState(0); // hover để highlight sao

  // Xử lý submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation cơ bản
    if (rating === 0 || !comment.trim()) {
      alert("Please select a rating and write a comment!");
      return;
    }

    setSubmitting(true);

    try {
      const user = JSON.parse(localStorage.getItem("user"));

      if (!user) {
        alert("You need to log in to submit a review!");
        setSubmitting(false);
        return;
      }

      // Payload comment mới
      const newComment = {
        locationId: parseInt(placeId),
        name: user.name || user.email,
        rating: rating,
        content: comment.trim(),
        createdAt: new Date().toISOString(),
      };

      // Gửi lên JSON Server
      const res = await fetch(`${API_BASE}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newComment),
      });

      if (res.ok) {
        alert("Thank you for your review!");
        onReviewSubmitted?.(); // reload list bên ngoài
        onClose(); // đóng modal
      } else {
        alert("Failed to submit review. Please try again!");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Server connection error!");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="review-modal-overlay">
      <div className="review-modal">
        {/* Header */}
        <div className="modal-header">
          <h2>Write a Review</h2>
          <button className="close-btn" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* ⭐ Rating */}
          <div className="rating-section">
            <p>Your rating:</p>
            <div className="stars">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={32}
                  fill={(hoverRating || rating) >= star ? "#fbbf24" : "none"}
                  stroke="#fbbf24"
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setRating(star)}
                  style={{ cursor: "pointer" }}
                />
              ))}
            </div>
            <p className="rating-text">
              {rating > 0 ? `${rating} stars` : "Not selected"}
            </p>
          </div>

          {/* 📝 Comment */}
          <div className="form-group">
            <label>Your comment</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your experience about this place..."
              rows={5}
              required
            />
          </div>

          {/* Buttons */}
          <div className="modal-footer">
            <button type="button" className="cancel-btn" onClick={onClose}>
              Cancel
            </button>

            <button
              type="submit"
              className="submit-btn"
              disabled={submitting || rating === 0}
            >
              <Send size={18} />
              {submitting ? "Submitting..." : "Submit Review"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserFeedBack;
