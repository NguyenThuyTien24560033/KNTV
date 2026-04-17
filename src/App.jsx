

// import { BrowserRouter, Routes, Route } from "react-router-dom";


// import HomePage from "./pages/HomePage.jsx";
// import UserLogin from "./pages/UserLogin.jsx";
// import MainLayout from "./pages/MainLayout.jsx";
// import LocationPage from "./pages/LocationPage.jsx";
// import LocationDetail from "./pages/LocationDetail.jsx";
// import UserProfile from "./pages/UserProfile.jsx";
// import TripPage from "./pages/TripsPlan.jsx";
// import OutputPage from "./pages/OutputPage.jsx";
// import HistoryPage from "./pages/HistoryPage.jsx";

// import PartnerLogin from "./pages/PartnerLogin.jsx";
// import PartnerLayout from "./pages/PartnerLayout.jsx";

// import PartnerFirst from "./pages/PartnerFirst.jsx";
// import PartnerPlace from "./pages/PartnerPlace.jsx";
// import PartnerMenu from "./pages/PartnerMenu.jsx";
// import PartnerHours from "./pages/PartnerHour.jsx";
// import PartnerNoti from "./pages/PartnerNoti.jsx";
// import PartnerDiscount from "./pages/PartnerDiscount.jsx";
// import PartnerProfile from "./pages/PartnerProfile.jsx";
// import PartnerRating from "./pages/PartnerRating.jsx";


// import UserFeedBack from "./pages/UserFeedBack.jsx";  

// // function App() {
// //   return (
// //     <BrowserRouter>
// //       <Routes>
        
// //         <Route path="/" element={<HomePage />} />
// //         <Route path="/users" element={<UserLogin />} />

        
// //         <Route path="/profile" element={
// //           <MainLayout>
// //             <UserProfile />
// //           </MainLayout>
// //         } />

// //         <Route path="/my-trips" element={<MainLayout><TripPage /></MainLayout>} />
// //         <Route path="/output/:id" element={<MainLayout><OutputPage /></MainLayout>} />
// //         <Route path="/history" element={<MainLayout><HistoryPage /></MainLayout>} />

// //         {/* Locations */}
// //         <Route path="/locations" element={<MainLayout><LocationPage /></MainLayout>} />
// //         <Route path="/locations/:id" element={<MainLayout><LocationDetail /></MainLayout>} />

// //         {/* ==================== PARTNER ROUTES ==================== */}
// //         <Route path="/partner/login" element={<PartnerLogin />} />

// //         <Route path="/partner" element={<PartnerLayout />}>
// //           <Route index element={<PartnerFirst />} />
// //           <Route path="dashboard" element={<PartnerFirst />} />
// //           <Route path="place" element={<PartnerPlace />} />
// //           <Route path="menu" element={<PartnerMenu />} />
// //           <Route path="hours" element={<PartnerHours />} />
// //           <Route path="notifications" element={<PartnerNoti />} />
// //           <Route path="discount" element={<PartnerDiscount />} />
// //           <Route path="profile" element={<PartnerProfile />} />
// //           <Route path="rating" element={<PartnerRating />} />
// //         </Route>

// //         {/* ==================== USER FEEDBACK ROUTE ==================== */}
// //         {/* Route này có thể nằm ngoài hoặc trong MainLayout tùy bạn muốn */}
// //         <Route path="/feedback" element={
// //           <MainLayout>
// //             <UserFeedBack />
// //           </MainLayout>
// //         } />

// //       </Routes>
// //     </BrowserRouter>
// //   );
// // }

// // export default App;



// /**
//  * App.jsx
//  * ------------------
//  * File định nghĩa toàn bộ routing cho ứng dụng.
//  * - User flow: Home, Login, Profile, Trips, Output, History, Locations, Feedback.
//  * - Partner flow: Login, Dashboard, Place, Menu, Hours, Notifications, Discount, Profile, Rating.
//  * - Tất cả route được bọc trong BrowserRouter.
//  */

// // import { BrowserRouter, Routes, Route } from "react-router-dom";

// // // ==================== USER PAGES ====================
// // import HomePage from "./pages/HomePage.jsx";
// // import UserLogin from "./pages/UserLogin.jsx";
// // import MainLayout from "./pages/MainLayout.jsx";
// // import LocationPage from "./pages/LocationPage.jsx";
// // import LocationDetail from "./pages/LocationDetail.jsx";
// // import UserProfile from "./pages/UserProfile.jsx";
// // import TripPage from "./pages/TripsPlan.jsx";
// // import OutputPage from "./pages/OutputPage.jsx";
// // import HistoryPage from "./pages/HistoryPage.jsx";
// // import UserFeedBack from "./pages/UserFeedBack.jsx";  

// // // ==================== PARTNER PAGES ====================
// // import PartnerLogin from "./pages/PartnerLogin.jsx";
// // import PartnerLayout from "./pages/PartnerLayout.jsx";
// // import PartnerFirst from "./pages/PartnerFirst.jsx";
// // import PartnerPlace from "./pages/PartnerPlace.jsx";
// // import PartnerMenu from "./pages/PartnerMenu.jsx";
// // import PartnerHours from "./pages/PartnerHours.jsx";   // ← chỉnh lại đúng tên file PartnerHours.jsx
// // import PartnerNoti from "./pages/PartnerNoti.jsx";
// // import PartnerDiscount from "./pages/PartnerDiscount.jsx";
// // import PartnerProfile from "./pages/PartnerProfile.jsx";
// // import PartnerRating from "./pages/PartnerRating.jsx";

// function App() {
//   return (
//     <BrowserRouter>
//       <Routes>
//         {/* ==================== USER ROUTES ==================== */}
//         <Route path="/" element={<HomePage />} />
//         <Route path="/users" element={<UserLogin />} />

//         <Route path="/profile" element={
//           <MainLayout>
//             <UserProfile />
//           </MainLayout>
//         } />

//         <Route path="/my-trips" element={<MainLayout><TripPage /></MainLayout>} />
//         <Route path="/output/:id" element={<MainLayout><OutputPage /></MainLayout>} />
//         <Route path="/history" element={<MainLayout><HistoryPage /></MainLayout>} />

//         {/* Locations */}
//         <Route path="/locations" element={<MainLayout><LocationPage /></MainLayout>} />
//         <Route path="/locations/:id" element={<MainLayout><LocationDetail /></MainLayout>} />

//         {/* ==================== PARTNER ROUTES ==================== */}
//         <Route path="/partner/login" element={<PartnerLogin />} />

//         <Route path="/partner" element={<PartnerLayout />}>
//           <Route index element={<PartnerFirst />} />
//           <Route path="dashboard" element={<PartnerFirst />} />
//           <Route path="place" element={<PartnerPlace />} />
//           <Route path="menu" element={<PartnerMenu />} />
//           <Route path="hours" element={<PartnerHours />} />
//           <Route path="notifications" element={<PartnerNoti />} />
//           <Route path="discount" element={<PartnerDiscount />} />
//           <Route path="profile" element={<PartnerProfile />} />
//           <Route path="rating" element={<PartnerRating />} />
//         </Route>

//         {/* ==================== USER FEEDBACK ROUTE ==================== */}
//         <Route path="/feedback" element={
//           <MainLayout>
//             <UserFeedBack />
//           </MainLayout>
//         } />
//       </Routes>
//     </BrowserRouter>
//   );
// }

// export default App;



import { BrowserRouter, Routes, Route } from "react-router-dom";

// ==================== USER PAGES ====================
import HomePage from "./pages/HomePage.jsx";
import UserLogin from "./pages/UserLogin.jsx";
import MainLayout from "./pages/MainLayout.jsx";
import LocationPage from "./pages/LocationPage.jsx";
import LocationDetail from "./pages/LocationDetail.jsx";
import UserProfile from "./pages/UserProfile.jsx";
import TripPage from "./pages/TripsPlan.jsx";
import OutputPage from "./pages/OutputPage.jsx";
import HistoryPage from "./pages/HistoryPage.jsx";
import UserFeedBack from "./pages/UserFeedBack.jsx";  

// ==================== PARTNER PAGES ====================
import PartnerLogin from "./pages/PartnerLogin.jsx";
import PartnerLayout from "./pages/PartnerLayout.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ==================== USER ROUTES (GIỮ NGUYÊN) ==================== */}
        <Route path="/" element={<HomePage />} />
        <Route path="/users" element={<UserLogin />} />

        <Route path="/profile" element={
          <MainLayout>
            <UserProfile />
          </MainLayout>
        } />

        <Route path="/my-trips" element={<MainLayout><TripPage /></MainLayout>} />
        <Route path="/output/:id" element={<MainLayout><OutputPage /></MainLayout>} />
        <Route path="/history" element={<MainLayout><HistoryPage /></MainLayout>} />

        <Route path="/locations" element={<MainLayout><LocationPage /></MainLayout>} />
        <Route path="/locations/:id" element={<MainLayout><LocationDetail /></MainLayout>} />

        <Route path="/feedback" element={
          <MainLayout>
            <UserFeedBack />
          </MainLayout>
        } />

        {/* ==================== PARTNER ROUTES (ĐÃ SỬA) ==================== */}
        <Route path="/partner/login" element={<PartnerLogin />} />
        
        {/* Vì PartnerLayout bây giờ tự quản lý các tab bằng State (PartnerFirst, PartnerMenu,...)
            nên chúng ta chỉ cần một Route duy nhất cho toàn bộ hệ thống quản lý của Partner.
        */}
        <Route path="/partner" element={<PartnerLayout />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
