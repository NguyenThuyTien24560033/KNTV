// // import Header
// import Header from "../components/Header";
// // khai báo hàm MainLayout => xử lí layout khung cố định của trang web, nhận props là children
// const MainLayout = ({ children }) => {
//   return (
//     <div>
//     {/* luôn hiển thị Header */}
//       <Header />
//      {/* những nội dụng còn lại của cách trang */}
//       <main>{children}</main> 
//     </div>
//   );
// };

// // export mặc định hàm MainLayout
// export default MainLayout;

/**
 * MainLayout.jsx
 * Component layout khung cố định cho toàn bộ trang web
 * Flow:
 *  - Luôn hiển thị Header ở trên cùng
 *  - Nhận props children để render nội dung từng trang bên trong <main>
 */

import Header from "../components/Header";

const MainLayout = ({ children }) => {
  return (
    <div className="main-layout">
      {/* Luôn hiển thị Header */}
      <Header />

      {/* Nội dung chính của từng trang */}
      <main className="main-content">{children}</main>
    </div>
  );
};

export default MainLayout;
