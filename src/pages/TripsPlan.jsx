


// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import "./TripsPlan.css";

// const API = "http://localhost:3001";

// const TripPage = () => {
//   const navigate = useNavigate();
//   const today = new Date().toISOString().split("T")[0]; // Lấy ngày hiện tại (YYYY-MM-DD)

//   const [areas, setAreas] = useState([]);
//   const [loadingAreas, setLoadingAreas] = useState(true);
//   const [submitting, setSubmitting] = useState(false);

//   const [form, setForm] = useState({
//     budget: "",
//     num_people: "",
//     area_id: "",
//     departure_date: "",
//     return_date: "",
//     location: "",
//     travel_style: [],
//     food_type: [],
//     accommodation_type: [],
//   });

//   // Fetch danh sách khu vực từ json-server
//   useEffect(() => {
//     const fetchAreas = async () => {
//       try {
//         const res = await fetch(`${API}/areas`);
//         if (!res.ok) throw new Error("Failed to fetch");
//         const data = await res.json();
//         setAreas(data);
//       } catch (err) {
//         console.error("Error loading region list", err);
//         // Fallback data
//         setAreas([
//           { id: 1, name: "Da Lat" },
//           { id: 2, name: "Nha Trang" },
//         ]);
//       } finally {
//         setLoadingAreas(false);
//       }
//     };

//     fetchAreas();
//   }, []);

//   // Xử lý input thông thường
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setForm((prev) => ({
//       ...prev,
//       [name]: name === "area_id" ? Number(value) || "" : value,
//     }));
//   };

//   // Xử lý chọn nhiều (multi-select)
//   const handleMultiSelect = (field, value) => {
//     setForm((prev) => {
//       const current = prev[field];
//       return {
//         ...prev,
//         [field]: current.includes(value)
//           ? current.filter((v) => v !== value)
//           : [...current, value],
//       };
//     });
//   };

//   // Submit form
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     // Validation bổ sung
//     if (!form.budget || !form.num_people || !form.area_id) {
//       alert("Please enter all required details!");
//       return;
//     }

//     if (form.departure_date && form.return_date && form.departure_date > form.return_date) {
//       alert("Return date must be after departure date!");
//       return;
//     }

//     setSubmitting(true);

//     const payload = {
//       title: `Trip to ${form.location || "Viet Nam"}`,
//       destination: form.location || "Việt Nam",
//       budget: Number(form.budget),
//       num_people: Number(form.num_people),
//       departure_date: form.departure_date,
//       return_date: form.return_date,
//       location: form.location,
//       area_id: form.area_id,
//       travel_style: form.travel_style,
//       food_type: form.food_type,
//       accommodation_type: form.accommodation_type,
//       created_at: new Date().toISOString(),
//       status: "pending", 
//     };

//     try {
//       const res = await fetch(`${API}/tripVersions`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload),
//       });

//       if (res.ok) {
//         const newTrip = await res.json();
//         alert("Plan request submitted successfully!");
//         navigate(`/output/${newTrip.id}`);
//       } else {
//         alert("Failed to save plan! Please try again.");
//       }
//     } catch (err) {
//       console.error("Submit error:", err);
//       alert("Cannot connect to server. Please check your json-server.");
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   return (
//     <div className="trip-container">
//       <h1>Plan a Trip</h1>

//       <form onSubmit={handleSubmit} className="trip-form">
//         {/* Ngân sách & Số người */}
//         <div className="form-row">
//           <div className="form-group">
//             <label>Expected Budget (VNĐ) <span className="required">*</span></label>
//             <input
//               type="number"
//               name="budget"
//               placeholder="Ex: 15000000"
//               value={form.budget}
//               onChange={handleChange}
//               min="0"
//               required
//             />
//           </div>
//           <div className="form-group">
//             <label>The number of people <span className="required">*</span></label>
//             <input
//               type="number"
//               name="num_people"
//               placeholder="Ex: 2"
//               value={form.num_people}
//               onChange={handleChange}
//               min="1"
//               required
//             />
//           </div>
//         </div>

//         {/* Khu vực */}
//         <div className="form-group">
//           <label>Main Destination / Region <span className="required">*</span></label>
//           <select
//             name="area_id"
//             value={form.area_id}
//             onChange={handleChange}
//             required
//             disabled={loadingAreas}
//           >
//             <option value="">
//               {loadingAreas ? "Loading regions..." : "-- Select a region --"}
//             </option>
//             {areas.map((area) => (
//               <option key={area.id} value={area.id}>
//                 {area.name}
//               </option>
//             ))}
//           </select>
//         </div>

//         {/* Ngày đi - Ngày về */}
//         <div className="form-row">
//           <div className="form-group">
//             <label>Departure date <span className="required">*</span></label>
//             <input
//               type="date"
//               name="departure_date"
//               value={form.departure_date}
//               onChange={handleChange}
//               min={today}
//               required
//             />
//           </div>
//           <div className="form-group">
//             <label>Return date <span className="required">*</span></label>
//             <input
//               type="date"
//               name="return_date"
//               value={form.return_date}
//               onChange={handleChange}
//               min={form.departure_date || today}
//               required
//             />
//           </div>
//         </div>

//         {/* Địa điểm cụ thể */}
//         <div className="form-group">
//           <label>Specific Location (Optional)</label>
//           <input
//             type="text"
//             name="location"
//             placeholder="Ex: Da Lat Center, Nha Trang..."
//             value={form.location}
//             onChange={handleChange}
//           />
//         </div>

//         {/* Travel Style */}
//         <div className="form-group">
//           <label>Travel Style</label>
//           <div className="multi-select">
//             {[
//               { id: 1, name: "Relax" },
//               { id: 2, name: "Adventure" },
//               { id: 3, name: "Food tour" },
//               { id: 4, name: "Cultural" },
//               { id: 5, name: "Playground" },
//               { id: 6, name: "History" },
//               { id: 7, name: "Thrill" },
//               { id: 8, name: "Beach" }
//             ].map((item) => (
//               <button
//                 type="button"
//                 key={item.id}
//                 className={`select-btn ${form.travel_style.includes(item.id) ? "active" : ""}`}
//                 onClick={() => handleMultiSelect("travel_style", item.id)}
//               >
//                 {item.name}
//               </button>
//             ))}
//           </div>
//         </div>

//         {/* Food Type */}
//         <div className="form-group">
//           <label>Favorite Cuisine</label>
//           <div className="multi-select">
//             {[
//               { id: 1, name: "Meat" },
//               { id: 2, name: "Seafood" },
//               { id: 3, name: "Vegetarian" },
//               { id: 4, name: "Street Food" },
//               { id: 5, name: "Family-style" },
//               { id: 6, name: "Set meals" },
//               { id: 7, name: "Hotpot" },
//             ].map((item) => (
//               <button
//                 type="button"
//                 key={item.id}
//                 className={`select-btn ${form.food_type.includes(item.id) ? "active" : ""}`}
//                 onClick={() => handleMultiSelect("food_type", item.id)}
//               >
//                 {item.name}
//               </button>
//             ))}
//           </div>
//         </div>

//         {/* Accommodation */}
//         <div className="form-group">
//           <label>Accommodation type</label>
//           <div className="multi-select">
//             {[
//               { id: 1, name: "Hotel" },
//               { id: 2, name: "Motel" },
//               { id: 3, name: "Homestay" },
//               { id: 4, name: "Resort" },
//               { id: 5, name: "Villa" },
//             ].map((item) => (
//               <button
//                 type="button"
//                 key={item.id}
//                 className={`select-btn ${form.accommodation_type.includes(item.id) ? "active" : ""}`}
//                 onClick={() => handleMultiSelect("accommodation_type", item.id)}
//               >
//                 {item.name}
//               </button>
//             ))}
//           </div>
//         </div>

//         <button type="submit" className="submit-btn" disabled={submitting}>
//           {submitting ? "Planning..." : "Plan a Trip"}
//         </button>
//       </form>
//     </div>
//   );
// };

// export default TripPage;




/**
 * TripPage.jsx
 * Component cho Input Page - nhập dữ liệu chuyến đi
 * Flow:
 *  - Người dùng nhập form (budget, people, area, dates, style, food, accommodation)
 *  - Validate dữ liệu trước khi gửi
 *  - Submit → gửi lên backend (json-server) để tạo plan đầu tiên
 *  - Nếu thành công → điều hướng sang OutputPage với id plan mới
 */

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./TripsPlan.css";

const API = "http://localhost:3001";

const TripPage = () => {
  const navigate = useNavigate();
  const today = new Date().toISOString().split("T")[0]; // Ngày hiện tại (YYYY-MM-DD)

  // State cho danh sách khu vực
  const [areas, setAreas] = useState([]);
  const [loadingAreas, setLoadingAreas] = useState(true);

  // State cho trạng thái submit
  const [submitting, setSubmitting] = useState(false);

  // State cho form input
  const [form, setForm] = useState({
    budget: "",
    num_people: "",
    area_id: "",
    departure_date: "",
    return_date: "",
    location: "",
    travel_style: [],
    food_type: [],
    accommodation_type: [],
  });

  // Fetch danh sách khu vực từ backend (json-server)
  useEffect(() => {
    const fetchAreas = async () => {
      try {
        const res = await fetch(`${API}/areas`);
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        setAreas(data);
      } catch (err) {
        console.error("Error loading region list", err);
        // Fallback data nếu server lỗi
        setAreas([
          { id: 1, name: "Da Lat" },
          { id: 2, name: "Nha Trang" },
        ]);
      } finally {
        setLoadingAreas(false);
      }
    };

    fetchAreas();
  }, []);

  // Xử lý input thông thường
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "area_id" ? Number(value) || "" : value,
    }));
  };

  // Xử lý multi-select (chọn nhiều giá trị)
  const handleMultiSelect = (field, value) => {
    setForm((prev) => {
      const current = prev[field];
      return {
        ...prev,
        [field]: current.includes(value)
          ? current.filter((v) => v !== value) // Nếu đã chọn thì bỏ
          : [...current, value], // Nếu chưa chọn thì thêm
      };
    });
  };

  // Validation bổ sung trước khi submit
  const validateForm = () => {
    if (!form.budget || !form.num_people || !form.area_id) {
      alert("Please enter all required details!");
      return false;
    }
    if (form.departure_date && form.return_date && form.departure_date > form.return_date) {
      alert("Return date must be after departure date!");
      return false;
    }
    return true;
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setSubmitting(true);

    // Payload gửi lên backend
    const payload = {
      title: `Trip to ${form.location || "Vietnam"}`,
      destination: form.location || "Vietnam",
      budget: Number(form.budget),
      num_people: Number(form.num_people),
      departure_date: form.departure_date,
      return_date: form.return_date,
      location: form.location,
      area_id: form.area_id,
      travel_style: form.travel_style,
      food_type: form.food_type,
      accommodation_type: form.accommodation_type,
      created_at: new Date().toISOString(),
      status: "pending", // trạng thái mặc định
    };

    try {
      const res = await fetch(`${API}/tripVersions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const newTrip = await res.json();
        alert("Plan request submitted successfully!");
        navigate(`/output/${newTrip.id}`);
      } else {
        alert("Failed to save plan! Please try again.");
      }
    } catch (err) {
      console.error("Submit error:", err);
      alert("Cannot connect to server. Please check your json-server.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="trip-container">
      <h1>Plan a Trip</h1>

      <form onSubmit={handleSubmit} className="trip-form">
        {/* Ngân sách & Số người */}
        <div className="form-row">
          <div className="form-group">
            <label>Expected Budget (VNĐ) <span className="required">*</span></label>
            <input
              type="number"
              name="budget"
              placeholder="Ex: 15000000"
              value={form.budget}
              onChange={handleChange}
              min="0"
              required
            />
          </div>
          <div className="form-group">
            <label>The number of people <span className="required">*</span></label>
            <input
              type="number"
              name="num_people"
              placeholder="Ex: 2"
              value={form.num_people}
              onChange={handleChange}
              min="1"
              required
            />
          </div>
        </div>

        {/* Khu vực */}
        <div className="form-group">
          <label>Main Destination / Region <span className="required">*</span></label>
          <select
            name="area_id"
            value={form.area_id}
            onChange={handleChange}
            required
            disabled={loadingAreas}
          >
            <option value="">
              {loadingAreas ? "Loading regions..." : "-- Select a region --"}
            </option>
            {areas.map((area) => (
              <option key={area.id} value={area.id}>
                {area.name}
              </option>
            ))}
          </select>
        </div>

        {/* Ngày đi - Ngày về */}
        <div className="form-row">
          <div className="form-group">
            <label>Departure date <span className="required">*</span></label>
            <input
              type="date"
              name="departure_date"
              value={form.departure_date}
              onChange={handleChange}
              min={today}
              required
            />
          </div>
          <div className="form-group">
            <label>Return date <span className="required">*</span></label>
            <input
              type="date"
              name="return_date"
              value={form.return_date}
              onChange={handleChange}
              min={form.departure_date || today}
              required
            />
          </div>
        </div>

        {/* Địa điểm cụ thể */}
        <div className="form-group">
          <label>Specific Location (Optional)</label>
          <input
            type="text"
            name="location"
            placeholder="Ex: Da Lat Center, Nha Trang..."
            value={form.location}
            onChange={handleChange}
          />
        </div>

        {/* Travel Style */}
        <div className="form-group">
          <label>Travel Style</label>
          <div className="multi-select">
            {[
              { id: 1, name: "Relax" },
              { id: 2, name: "Adventure" },
              { id: 3, name: "Food tour" },
              { id: 4, name: "Cultural" },
              { id: 5, name: "Playground" },
              { id: 6, name: "History" },
              { id: 7, name: "Thrill" },
              { id: 8, name: "Beach" }
            ].map((item) => (
              <button
                type="button"
                key={item.id}
                className={`select-btn ${form.travel_style.includes(item.id) ? "active" : ""}`}
                onClick={() => handleMultiSelect("travel_style", item.id)}
              >
                {item.name}
              </button>
            ))}
          </div>
        </div>

        {/* Food Type */}
        <div className="form-group">
          <label>Favorite Cuisine</label>
          <div className="multi-select">
            {[
              { id: 1, name: "Meat" },
              { id: 2, name: "Seafood" },
              { id: 3, name: "Vegetarian" },
              { id: 4, name: "Street Food" },
              { id: 5, name: "Family-style" },
              { id: 6, name: "Set meals" },
              { id: 7, name: "Hotpot" },
            ].map((item) => (
              <button
                type="button"
                key={item.id}
                                className={`select-btn ${form.food_type.includes(item.id) ? "active" : ""}`}
                onClick={() => handleMultiSelect("food_type", item.id)}
              >
                {item.name}
              </button>
            ))}
          </div>
        </div>

        {/* Accommodation */}
        <div className="form-group">
          <label>Accommodation type</label>
          <div className="multi-select">
            {[
              { id: 1, name: "Hotel" },
              { id: 2, name: "Motel" },
              { id: 3, name: "Homestay" },
              { id: 4, name: "Resort" },
              { id: 5, name: "Villa" },
            ].map((item) => (
              <button
                type="button"
                key={item.id}
                className={`select-btn ${form.accommodation_type.includes(item.id) ? "active" : ""}`}
                onClick={() => handleMultiSelect("accommodation_type", item.id)}
              >
                {item.name}
              </button>
            ))}
          </div>
        </div>

        {/* Submit button */}
        <button type="submit" className="submit-btn" disabled={submitting}>
          {submitting ? "Planning..." : "Plan a Trip"}
        </button>
      </form>
    </div>
  );
};

export default TripPage;
