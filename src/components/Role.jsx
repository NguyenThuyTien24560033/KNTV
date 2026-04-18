//Nhận lệnh (Props): Tiếp nhận hàm xử lý onSelect từ component cha.

//Hiển thị (UI): Trưng bày hai lựa chọn định danh: Traveler hoặc Partner.

//Bắt sự kiện (Click): Lắng nghe thao tác nhấn nút "Continue" của người dùng.

//Phản hồi (Callback): Truyền giá trị đã chọn ("user" hoặc "partner") ngược về cho cha xử lý tiếp.


//import css
import "./Role.css";
//import icon
import { User, Map } from "lucide-react";

//onSelect: callback function từ parent
const Role = ({ onSelect }) => {
  return (
    <div className="role-container">
      <div className="role-card">
        <h2 className="role-title">WHO ARE YOU</h2>
        <p className="role-subtitle">
          Choose your role to start your journey
        </p>

        <div className="option">
          //user
          <div className="role-optional">
            <User size={40} />
            <h3>Traveler</h3>
            <p>Discover and plan amazing trips</p>
            //parent nhận user
            <button onClick={() => onSelect("user")}>
              Continue
            </button>
          </div>

          //partner
          <div className="role-optional">
            <Map size={40} />
            <h3>Partner</h3>
            <p>Manage and share your locations</p>
            //parent nhận partner
            <button onClick={() => onSelect("partner")}>
              Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Role;