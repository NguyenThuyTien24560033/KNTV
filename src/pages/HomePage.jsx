
// // import { useState, useEffect } from "react";
// // import { useNavigate, Link } from "react-router-dom";
// // import "./HomePage.css";
// // import Header from "../components/Header.jsx";
// // import Role from "../components/Role.jsx";
// // import Banner from "../components/Banner.jsx";
// // import axios from "axios";

// // const HomePage = () => {
// //   const [showRole, setShowRole] = useState(false);
// //   const [locations, setLocations] = useState([]);

// //   const navigate = useNavigate();

// //   // chọn role
// //   const handleSelectRole = (role) => {
// //     localStorage.setItem("role", role);
// //     window.dispatchEvent(new Event("userChanged"));

// //     setShowRole(false);

// //     if (role === "user") {
// //       navigate("/users");
// //     } else if (role === "partner") {
// //       navigate("/partner");
// //     }
// //   };

  
// //   useEffect(() => {
// //     const fetchLocations = async () => {
// //       try {
// //         const res = await axios.get("http://localhost:3001/locations");

// //         const topLocations = res.data
// //           .sort((a, b) => (b.rating || 0) - (a.rating || 0)) // sort giảm dần
// //           .slice(0, 4); // lấy 4 cái

// //         setLocations(topLocations);
// //       } catch (err) {
// //         console.error("Error fetching locations:", err);
// //       }
// //     };

// //     fetchLocations();
// //   }, []);

// //   // click location
// //   const handleLocationClick = (id) => {
// //     navigate(`/locations/${id}`);
// //   };

// //   return (
// //     <div className="home-container">
// //       <Header onLoginClick={() => setShowRole(true)} />

// //       {showRole && <Role onSelect={handleSelectRole} />}

      
// //       <Banner />

// //       {/* LOCATION SECTION */}
// //       <div className="books-container">
// //         <section className="books-title">
// //           <Link to="/locations" className="book-link">
// //             TOP LOCATIONS
// //           </Link>
// //         </section>

// //         <div className="book-grid">
// //           {locations.map((loc) => (
// //             <div
// //               key={loc.id}
// //               onClick={() => handleLocationClick(loc.id)}
// //               className="book-clickable"
// //             >
// //               <div className="card">
// //                 <img src={loc.image} alt={loc.name} />
// //                 <h3>{loc.name}</h3>

               
// //                 <p> {loc.rating || "N/A"}</p>

// //                 <p>{loc.description}</p>
// //               </div>
// //             </div>
// //           ))}
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // export default HomePage;



import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./HomePage.css";
import Header from "../components/Header.jsx";
import Role from "../components/Role.jsx";
import Banner from "../components/Banner.jsx";
import axios from "axios";
import { Star, MapPin } from "lucide-react";

const HomePage = () => {
  const [showRole, setShowRole] = useState(false);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  // Chọn vai trò (User hoặc Partner)
  const handleSelectRole = (role) => {
    localStorage.setItem("role", role);
    window.dispatchEvent(new Event("userChanged"));
    setShowRole(false);

    if (role === "user") {
      navigate("/users");
    } else if (role === "partner") {
      navigate("/partner/login");        // ← Chuyển đến Partner Login thay vì /partner
    }
  };

  // Lấy top locations
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const res = await axios.get(import.meta.env.VITE_Location_Recommend);
        
        const topLocations = res.data
          .sort((a, b) => (b.rating || 0) - (a.rating || 0))
          .slice(0, 6);                    // Lấy 6 cái cho đẹp hơn

        setLocations(topLocations);
      } catch (err) {
        console.error("Error fetching locations:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLocations();
  }, []);

  const handleLocationClick = (id) => {
    navigate(`/locations/${id}`);
  };

  return (
    <div className="home-container">
      <Header onLoginClick={() => setShowRole(true)} />

      {showRole && <Role onSelect={handleSelectRole} />}

      <Banner />

      {/* TOP LOCATIONS SECTION */}
      <section className="locations-section">
        <div className="section-header">
          <h2>Top Địa Điểm Nổi Bật</h2>
          <Link to="/locations" className="view-all-btn">
            Xem tất cả →
          </Link>
        </div>

        {loading ? (
          <p className="loading-text">Đang tải địa điểm...</p>
        ) : (
          <div className="locations-grid">
            {locations.map((loc) => (
              <div
                key={loc.id}
                className="location-card"
                onClick={() => handleLocationClick(loc.id)}
              >
                <div className="card-image">
                  <img src={loc.image || "https://via.placeholder.com/300x200"} alt={loc.name} />
                </div>

                <div className="card-content">
                  <h3>{loc.name}</h3>
                  
                  <div className="card-info">
                    <div className="rating">
                      <Star size={18} fill="#fbbf24" color="#fbbf24" />
                      <span>{loc.rating || "4.5"}</span>
                    </div>
                    
                    {loc.address && (
                      <div className="address">
                        <MapPin size={16} />
                        <span>{loc.address}</span>
                      </div>
                    )}
                  </div>

                  <p className="description">
                    {loc.description?.length > 100 
                      ? loc.description.substring(0, 100) + "..." 
                      : loc.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default HomePage;




/**
 * HomePage.jsx
 * Component trang chủ
 * Flow:
 *  - Hiển thị Header, Banner, Role chọn vai trò
 *  - Lấy danh sách location từ JSON Server
 *  - Chọn ra 4 location có rating cao nhất (nếu bằng nhau thì lấy theo createdAt sớm nhất)
 *  - Hiển thị card location với ảnh, tên, rating, địa chỉ, mô tả
 *  - Click card → điều hướng sang LocationDetail
 */

// import { useState, useEffect } from "react";
// import { useNavigate, Link } from "react-router-dom";
// import "./HomePage.css";
// import Header from "../components/Header.jsx";
// import Role from "../components/Role.jsx";
// import Banner from "../components/Banner.jsx";
// import axios from "axios";
// import { Star, MapPin } from "lucide-react";

// const HomePage = () => {
//   // State quản lý hiển thị chọn role
//   const [showRole, setShowRole] = useState(false);
//   // State danh sách location
//   const [locations, setLocations] = useState([]);
//   // State loading khi fetch dữ liệu
//   const [loading, setLoading] = useState(true);

//   const navigate = useNavigate();

//   // Chọn vai trò (User hoặc Partner)
//   const handleSelectRole = (role) => {
//     localStorage.setItem("role", role);
//     window.dispatchEvent(new Event("userChanged")); // phát sự kiện để đồng bộ giao diện
//     setShowRole(false);

//     if (role === "user") {
//       navigate("/users");
//     } else if (role === "partner") {
//       navigate("/partner/login"); // Partner login
//     }
//   };

//   // Fetch dữ liệu location từ JSON Server
//   useEffect(() => {
//     const fetchLocations = async () => {
//       try {
//         const res = await axios.get("http://localhost:3001/locations");

//         // Sort theo rating giảm dần, nếu bằng nhau thì sort theo createdAt tăng dần
//         const topLocations = res.data
//           .sort((a, b) => {
//             const ratingA = a.rating || 0;
//             const ratingB = b.rating || 0;
//             if (ratingB !== ratingA) {
//               return ratingB - ratingA; // rating cao hơn lên trước
//             }
//             // Nếu rating bằng nhau thì lấy createdAt sớm hơn
//             return new Date(a.createdAt) - new Date(b.createdAt);
//           })
//           .slice(0, 4); // lấy 4 location

//         setLocations(topLocations);
//       } catch (err) {
//         console.error("Error fetching locations:", err);
//         alert("Failed to load locations. Please try again!");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchLocations();
//   }, []);

//   // Điều hướng sang LocationDetail khi click card
//   const handleLocationClick = (id) => {
//     navigate(`/locations/${id}`);
//   };

//   return (
//     <div className="home-container">
//       {/* Header */}
//       <Header onLoginClick={() => setShowRole(true)} />

//       {/* Role chọn vai trò */}
//       {showRole && <Role onSelect={handleSelectRole} />}

//       {/* Banner */}
//       <Banner />

//       {/* TOP LOCATIONS SECTION */}
//       <section className="locations-section">
//         <div className="section-header">
//           <h2>Top Locations</h2>
//           <Link to="/locations" className="view-all-btn">
//             View all →
//           </Link>
//         </div>

//         {loading ? (
//           <p className="loading-text">Loading locations...</p>
//         ) : (
//           <div className="locations-grid">
//             {locations.map((loc) => (
//               <div
//                 key={loc.id}
//                 className="location-card"
//                 onClick={() => handleLocationClick(loc.id)}
//               >
//                 {/* Ảnh */}
//                 <div className="card-image">
//                   <img
//                     src={loc.image || "https://via.placeholder.com/300x200"}
//                     alt={loc.name}
//                   />
//                 </div>

//                 {/* Nội dung */}
//                 <div className="card-content">
//                   <h3>{loc.name}</h3>

//                   {/* Rating + Address */}
//                   <div className="card-info">
//                     <div className="rating">
//                       <Star size={18} fill="#fbbf24" color="#fbbf24" />
//                       <span>{loc.rating || "N/A"}</span>
//                     </div>

//                     {loc.address && (
//                       <div className="address">
//                         <MapPin size={16} />
//                         <span>{loc.address}</span>
//                       </div>
//                     )}
//                   </div>

//                   {/* Mô tả cắt gọn */}
//                   <p className="description">
//                     {loc.description?.length > 100
//                       ? loc.description.substring(0, 100) + "..."
//                       : loc.description}
//                   </p>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </section>
//     </div>
//   );
// };

// export default HomePage;
