

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./OutputPage.css";

const API = "http://localhost:3001";

export default function OutputPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔥 FETCH REAL DATA
  useEffect(() => {
    const fetchPlan = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_Old_Plan}${id}`);
        if (!res.ok) throw new Error("Not found");

        const data = await res.json();
        setPlan(data);
      } catch (err) {
        console.error(err);
        setPlan(null);
      } finally {
        setLoading(false);
      }
    };

    fetchPlan();
  }, [id]);

  if (loading) return <div className="output-container">Loading...</div>;
  if (!plan) return <div className="output-container">No data</div>;

  return (
    <div className="output-container">


      {/* MAIN */}
      <div className="output-main">
        {/* LEFT */}
        <div className="left">
          {plan.itinerary?.map((day) => (
            <div key={day.day} className="day-block">
              <h3>Ngày {day.day}:</h3>

              <p><strong>Food:</strong></p>
              <ul>
                <li>Sáng: {day.food?.morning}</li>
                <li>Trưa: {day.food?.noon}</li>
                <li>Tối: {day.food?.evening}</li>
              </ul>

              <p><strong>Địa điểm:</strong></p>
              <ul>
                {day.places?.map((p, i) => (
                  <li key={i}>{p}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* RIGHT */}
        <div className="right">
          {/* SUMMARY */}
          <div className="box">
            <h3>Chung:</h3>
            <ul>
              <li>Hotel: {plan.summary?.hotel}</li>
              <li>Main activity: {plan.summary?.main_activity}</li>
            </ul>

            <h4>Detail payment:</h4>
            <ul>
              <li>Food: {plan.cost?.food?.toLocaleString()} ₫</li>
              <li>Hotel: {plan.cost?.hotel?.toLocaleString()} ₫</li>
              <li>Other: {plan.cost?.other?.toLocaleString()} ₫</li>
            </ul>
          </div>

          {/* INPUT SUMMARY */}
          <div className="box input-box">
            <h3>Tóm tắt input:</h3>
            <p>{plan.location}</p>
            <p>{plan.departure_date} → {plan.return_date}</p>
            <p>{plan.num_people} people</p>

            <button
              className="edit-btn"
              onClick={() => navigate(`/input/${plan.id}`)}
            >
              ✏️
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}



/**
 * OutputPage.jsx
 * Component hiển thị kết quả plan (Output)
 * Flow:
 *  - Load tất cả plan của input hiện tại (tối đa 5)
 *  - Cho phép chọn tab để xem từng plan
 *  - Có thể chỉnh sửa, Save (khóa plan), hoặc Resend (tạo plan mới)
 */

// import { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import "./OutputPage.css";

// const API = "http://localhost:3001";

// export default function OutputPage() {
//   const { id } = useParams(); // id của input data
//   const navigate = useNavigate();

//   const [plans, setPlans] = useState([]); // danh sách plan
//   const [activeIndex, setActiveIndex] = useState(0); // tab hiện tại
//   const [loading, setLoading] = useState(true);

//   // Fetch tất cả plan của input
//   useEffect(() => {
//     const fetchPlans = async () => {
//       try {
//         const res = await fetch(`${API}/tripVersions?id=${id}`);
//         if (!res.ok) throw new Error("Not found");

//         const data = await res.json();
//         // giả định backend trả về mảng plans
//         setPlans(data.plans || []);
//       } catch (err) {
//         console.error(err);
//         setPlans([]);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchPlans();
//   }, [id]);

//   if (loading) return <div className="output-container">Loading...</div>;
//   if (!plans.length) return <div className="output-container">No plans found</div>;

//   const plan = plans[activeIndex];

//   // Save plan (khóa chỉnh sửa)
//   const handleSave = async () => {
//     try {
//       await fetch(`${API}/tripVersions/${id}/plans/${plan.id}`, {
//         method: "PATCH",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ saved: true })
//       });
//       alert("Plan saved successfully!");
//       navigate("/history");
//     } catch (err) {
//       console.error(err);
//       alert("Failed to save plan!");
//     }
//   };

//   // Resend (tạo plan mới)
//   const handleResend = async () => {
//     if (plans.length >= 5) {
//       alert("Maximum of 5 plans per input!");
//       return;
//     }
//     try {
//       const res = await fetch(`${API}/tripVersions/${id}/plans`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ ...plan, saved: false })
//       });
//       if (res.ok) {
//         const newPlan = await res.json();
//         setPlans([...plans, newPlan]);
//         setActiveIndex(plans.length); // chuyển sang plan mới
//         alert("New plan generated!");
//       }
//     } catch (err) {
//       console.error(err);
//       alert("Failed to generate new plan!");
//     }
//   };

//   // Exit (quay về History mà không save)
//   const handleExit = () => {
//     navigate("/history");
//   };

//   return (
//     <div className="output-container">
//       {/* HEADER */}
//       <div className="output-header">
//         <div className="menu">
//           <span onClick={() => navigate("/")}>Home</span>
//           <span onClick={() => navigate("/input")}>Input</span>
//           <span onClick={() => navigate("/history")}>History</span>
//           <span>Location</span>
//         </div>
//         <div>🔍 Search...</div>
//         <div>👤</div>
//       </div>

//       {/* Tabs cho các plan */}
//       <div className="plan-tabs">
//         {plans.map((p, idx) => (
//           <button
//             key={p.id}
//             className={idx === activeIndex ? "active" : ""}
//             onClick={() => setActiveIndex(idx)}
//           >
//             Plan {idx + 1}
//           </button>
//         ))}
//       </div>

//       {/* MAIN */}
//       <div className="output-main">
//         {/* LEFT */}
//         <div className="left">
//           {plan.itinerary?.map((day) => (
//             <div key={day.day} className="day-block">
//               <h3>Day {day.day}:</h3>

//               <p><strong>Food:</strong></p>
//               <ul>
//                 <li>Morning: {day.food?.morning}</li>
//                 <li>Noon: {day.food?.noon}</li>
//                 <li>Evening: {day.food?.evening}</li>
//               </ul>

//               <p><strong>Places:</strong></p>
//               <ul>
//                 {day.places?.map((p, i) => (
//                   <li key={i}>{p}</li>
//                 ))}
//               </ul>
//             </div>
//           ))}
//         </div>

//         {/* RIGHT */}
//         <div className="right">
//           {/* SUMMARY */}
//           <div className="box">
//             <h3>Summary:</h3>
//             <ul>
//               <li>Hotel: {plan.summary?.hotel}</li>
//               <li>Main activity: {plan.summary?.main_activity}</li>
//             </ul>

//             <h4>Detail payment:</h4>
//             <ul>
//               <li>Food: {plan.cost?.food?.toLocaleString()} ₫</li>
//               <li>Hotel: {plan.cost?.hotel?.toLocaleString()} ₫</li>
//               <li>Other: {plan.cost?.other?.toLocaleString()} ₫</li>
//             </ul>
//           </div>

//           {/* INPUT SUMMARY */}
//           <div className="box input-box">
//             <h3>Input summary:</h3>
//             <p>{plan.location}</p>
//             <p>{plan.departure_date} → {plan.return_date}</p>
//             <p>{plan.num_people} people</p>
//           </div>

//           {/* ACTION BUTTONS */}
//           <div className="actions">
//             {!plan.saved && (
//               <>
//                 <button onClick={handleSave}>Save</button>
//                 <button onClick={handleResend}>Resend</button>
//               </>
//             )}
//             <button onClick={handleExit}>Exit</button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
