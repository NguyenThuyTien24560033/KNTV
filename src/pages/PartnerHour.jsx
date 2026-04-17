// /**
//  * * 1. KHỞI TẠO (Mounting): 
//  * - Gọi fetchHours() ngay khi component được render lần đầu.
//  * * 2. TẢI DỮ LIỆU (fetchHours):
//  * - Lấy thông tin user từ localStorage để xác định partnerId.
//  * - Gọi API lấy danh sách địa điểm (locations) dựa trên partnerId.
//  * - Nếu có địa điểm, lấy placeId đầu tiên để tiếp tục gọi API lấy giờ hoạt động (hours).
//  * - Nếu đã có dữ liệu giờ: Cập nhật state (hours, isOpenToday, recordId).
//  * - Nếu chưa có: Tạo một bộ khung giờ mặc định (08:00 - 23:00) cho 7 ngày trong tuần.
//  * * 3. XỬ LÝ SỰ KIỆN (Interaction):
//  * - toggleOpenToday: Đóng/Mở cửa nhanh trạng thái hiện tại.
//  * - handleTimeChange: Cập nhật giờ đóng/mở cho từng thứ cụ thể.
//  * - toggleDayClosed: Đánh dấu một ngày cụ thể là nghỉ hoặc hoạt động.
//  * * 4. LƯU DỮ LIỆU (handleSave):
//  * - Đóng gói thông tin (placeId, schedule, status) vào payload.
//  * - Kiểm tra recordId:
//  * + Nếu tồn tại: Gọi API PATCH để cập nhật bản ghi cũ.
//  * + Nếu không: Gọi API POST để tạo mới bản ghi giờ hoạt động.
//  * * 5. HIỂN THỊ (Rendering):
//  * - Hiển thị màn hình Loading trong quá trình tải.
//  * - Render bảng lịch trình và nút Save sau khi dữ liệu sẵn sàng.
//  */



// import { useState, useEffect } from "react";
// import { Save, ToggleLeft, ToggleRight } from "lucide-react";
// import "./PartnerHours.css";

// const daysOfWeek = [
//   "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"
// ];

// const PartnerHours = () => {
//   const [hours, setHours] = useState([]);
//   const [isOpenToday, setIsOpenToday] = useState(true);
//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);
//   const [placeId, setPlaceId] = useState(null);
//   const [partnerId, setPartnerId] = useState(null);
//   const [recordId, setRecordId] = useState(null);

//   useEffect(() => {
//     fetchHours();
//   }, []);

//   const fetchHours = async () => {
//     try {
//       const user = JSON.parse(localStorage.getItem("user"));
//       if (!user) {
//         alert("Not logged in!");
//         setLoading(false);
//         return;
//       }
      
//       setPartnerId(user.id);

//      // lấy loction
//       const placeRes = await fetch(`http://localhost:3001/locations?partnerId=${user.id}`);
//       const placeData = await placeRes.json();
      
//       if (placeData.length === 0) {
//         alert("No locations found for this partner!");
//         setLoading(false);
//         return;
//       }

//       const currentPlaceId = placeData[0].id;
//       setPlaceId(currentPlaceId);

//       // lấy giờ
//       const res = await fetch(`http://localhost:3001/hours?placeId=${currentPlaceId}`);
//       const data = await res.json();

//       if (data.length > 0) {
//         setRecordId(data[0].id);
//         setHours(data[0].schedule || []);
//         setIsOpenToday(data[0].isOpenToday ?? true);
//       } else {
       
//         const defaultSchedule = daysOfWeek.map((day, index) => ({
//           day: day,
//           openTime: index === 6 ? "10:00" : "08:00",
//           closeTime: index === 6 ? "24:00" : "23:00",
//           isClosed: false
//         }));
//         setHours(defaultSchedule);
//       }
//     } catch (error) {
//       console.error("Error loading hours:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSave = async () => {
//     if (!placeId || !partnerId) return alert("Location or Partner ID not defined!");
    
//     setSaving(true);
//     try {
//       const payload = {
//         placeId: Number(placeId),
//         partnerId: String(partnerId),
//         schedule: hours,
//         isOpenToday: isOpenToday,
//         updatedAt: new Date().toISOString()
//       };

//       let res;
//       if (recordId) {
//         // cập nhật
//         res = await fetch(`http://localhost:3001/hours/${recordId}`, {
//           method: "PATCH",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify(payload)
//         });
//       } else {
//         // tạo record mới
//         res = await fetch("http://localhost:3001/hours", {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify(payload)
//         });
//         const newData = await res.json();
//         setRecordId(newData.id);
//       }

//       if (res.ok) {
//         alert("Operating hours saved successfully!");
//       } else {
//         alert("Failed to save!");
//       }
//     } catch (error) {
//       console.error("Save error:", error);
//       alert("Could not connect to server!");
//     } finally {
//       setSaving(false);
//     }
//   };

//   const toggleDayClosed = (index) => {
//     const newHours = [...hours];
//     newHours[index].isClosed = !newHours[index].isClosed;
//     setHours(newHours);
//   };

//   const handleTimeChange = (index, field, value) => {
//     const newHours = [...hours];
//     newHours[index][field] = value;
//     setHours(newHours);
//   };

//   const toggleOpenToday = () => setIsOpenToday(!isOpenToday);

//   if (loading) return <div className="loading">Loading hours...</div>;

//   return (
//     <div className="hours-container">
//       <div className="hours-header">
//         <h1>Manage Operating Hours</h1>
//       </div>

//       <div className="today-status">
//         <div className="status-card">
//           <h3>Today's Status</h3>
//           <div className="status-toggle" onClick={toggleOpenToday}>
//             {isOpenToday ? (
//               <>
//                 <ToggleRight size={32} className="toggle-on" />
//                 <span className="status-text open">Open Now</span>
//               </>
//             ) : (
//               <>
//                 <ToggleLeft size={32} className="toggle-off" />
//                 <span className="status-text closed">Closed Now</span>
//               </>
//             )}
//           </div>
//         </div>
//       </div>

//       <div className="schedule-table">
//         <table>
//           <thead>
//             <tr>
//               <th>Day of Week</th>
//               <th>Opening Time</th>
//               <th>Closing Time</th>
//               <th>Status</th>
//             </tr>
//           </thead>
//           <tbody>
//             {hours.map((day, index) => (
//               <tr key={index} className={day.isClosed ? "closed-row" : ""}>
//                 <td className="day-name">{day.day}</td>
//                 <td>
//                   <input
//                     type="time"
//                     value={day.openTime}
//                     onChange={(e) => handleTimeChange(index, "openTime", e.target.value)}
//                     disabled={day.isClosed}
//                   />
//                 </td>
//                 <td>
//                   <input
//                     type="time"
//                     value={day.closeTime}
//                     onChange={(e) => handleTimeChange(index, "closeTime", e.target.value)}
//                     disabled={day.isClosed}
//                   />
//                 </td>
//                 <td>
//                   <button
//                     className={`closed-btn ${day.isClosed ? "closed" : "open"}`}
//                     onClick={() => toggleDayClosed(index)}
//                   >
//                     {day.isClosed ? "Closed" : "Active"}
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       <div className="save-section">
//         <button className="save-hours-btn" onClick={handleSave} disabled={saving}>
//           <Save size={20} />
//           {saving ? "Saving..." : "Save Changes"}
//         </button>
//       </div>
//     </div>
//   );
// };

// export default PartnerHours;



import { useState, useEffect } from "react";
import { Save, ToggleLeft, ToggleRight } from "lucide-react";
import "./PartnerHours.css";

const daysOfWeek = [
  "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"
];

const PartnerHours = ({ data, placeId, onRefresh }) => {
  // 1. Khởi tạo state dựa trên props data truyền xuống
  const [hours, setHours] = useState([]);
  const [isOpenToday, setIsOpenToday] = useState(true);
  const [recordId, setRecordId] = useState(null);
  const [saving, setSaving] = useState(false);

  // 2. useEffect này để đồng bộ lại state nội bộ khi data từ Layout thay đổi
  useEffect(() => {
    if (data) {
      setRecordId(data.id);
      setHours(data.schedule || []);
      setIsOpenToday(data.isOpenToday ?? true);
    } else {
      // Nếu chưa có dữ liệu trên server, tạo bộ khung mặc định
      const defaultSchedule = daysOfWeek.map((day, index) => ({
        day: day,
        openTime: index === 6 ? "10:00" : "08:00",
        closeTime: index === 6 ? "24:00" : "23:00",
        isClosed: false
      }));
      setHours(defaultSchedule);
      setRecordId(null);
    }
  }, [data]);

  const handleSave = async () => {
    if (!placeId) return alert("Location ID not defined!");
    
    setSaving(true);
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const payload = {
        placeId: Number(placeId),
        partnerId: String(user?.id),
        schedule: hours,
        isOpenToday: isOpenToday,
        updatedAt: new Date().toISOString()
      };

      let res;
      if (recordId) {
        res = await fetch(`http://localhost:3001/hours/${recordId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
      } else {
        res = await fetch("http://localhost:3001/hours", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
      }

      if (res.ok) {
        await onRefresh(); // Báo Layout fetch lại để Dashboard và các nơi khác cập nhật
        alert("Operating hours saved successfully!");
      } else {
        alert("Failed to save!");
      }
    } catch (error) {
      console.error("Save error:", error);
      alert("Could not connect to server!");
    } finally {
      setSaving(false);
    }
  };

  const toggleDayClosed = (index) => {
    const newHours = [...hours];
    newHours[index].isClosed = !newHours[index].isClosed;
    setHours(newHours);
  };

  const handleTimeChange = (index, field, value) => {
    const newHours = [...hours];
    newHours[index][field] = value;
    setHours(newHours);
  };

  const toggleOpenToday = () => setIsOpenToday(!isOpenToday);

  // GIAO DIỆN GIỮ NGUYÊN LOGIC CỦA TIÊN
  return (
    <div className="hours-container">
      <div className="hours-header">
        <h1>Manage Operating Hours</h1>
      </div>

      <div className="today-status">
        <div className="status-card">
          <h3>Today's Status</h3>
          <div className="status-toggle" onClick={toggleOpenToday}>
            {isOpenToday ? (
              <>
                <ToggleRight size={32} className="toggle-on" />
                <span className="status-text open">Open Now</span>
              </>
            ) : (
              <>
                <ToggleLeft size={32} className="toggle-off" />
                <span className="status-text closed">Closed Now</span>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="schedule-table">
        <table>
          <thead>
            <tr>
              <th>Day of Week</th>
              <th>Opening Time</th>
              <th>Closing Time</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {hours.map((day, index) => (
              <tr key={index} className={day.isClosed ? "closed-row" : ""}>
                <td className="day-name">{day.day}</td>
                <td>
                  <input
                    type="time"
                    value={day.openTime}
                    onChange={(e) => handleTimeChange(index, "openTime", e.target.value)}
                    disabled={day.isClosed}
                  />
                </td>
                <td>
                  <input
                    type="time"
                    value={day.closeTime}
                    onChange={(e) => handleTimeChange(index, "closeTime", e.target.value)}
                    disabled={day.isClosed}
                  />
                </td>
                <td>
                  <button
                    className={`closed-btn ${day.isClosed ? "closed" : "open"}`}
                    onClick={() => toggleDayClosed(index)}
                  >
                    {day.isClosed ? "Closed" : "Active"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="save-section">
        <button className="save-hours-btn" onClick={handleSave} disabled={saving}>
          <Save size={20} />
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
};

export default PartnerHours;