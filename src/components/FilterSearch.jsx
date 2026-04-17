//Nhận tin: Cập nhật từ khóa khi người dùng gõ.

//Kiểm tra: Chặn tìm kiếm nếu từ khóa quá ngắn (dưới 2 ký tự).

//Trì hoãn (Debounce): Đợi người dùng ngừng gõ 0.3s mới xử lý.

//Truy vấn: Gọi API lấy dữ liệu từ server.

//Đổ dữ liệu: Lưu kết quả vào state và hiển thị danh sách.

//Điều hướng: Chuyển trang khi người dùng click vào kết quả.




//Hook useState dùng để lưu data
//Hook useEffect dùng để chạy dữ liệu theo thời gian thực
//Hook useNavigate dùng để điều hướng
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./FilterSearch.css";

const FilterSearch = () => {
  //khởi tạo các state trạng thái
  //querry: state input của users
  const [query, setQuery] = useState("");
  //results: state mảng kết quả 
  const [results, setResults] = useState([]);
  //showResults: state trạng thái hiển thị on/off
  const [showResults, setShowResults] = useState(false);
  //loading: state trạng thái đang tải...
  const [loading, setLoading] = useState(false);
  //khởi tạo hàm điều hướng 
  const navigate = useNavigate();

  // useEffect(()=>{}, [querry]): chạy lại mỗi lần querry đổi
  useEffect(() => {
    //tránh lãng phí và vô bổ, tất cả những query dưới 2 kí tự sẽ ko được chấp thuận
    if (query.trim().length < 2) {
      //update setResults rỗng
      setResults([]);
      //đóng bảng showResults
      setShowResults(false);
      //thoát hàm
      return;
    }

    //gọi API
    const searchLocations = async () => {
      //bật state loading lên
      setLoading(true);
      try {
        //gửi request => nhận respond JSON
        const res = await fetch(`http://localhost:3001/locations?q=${query}`);
        //chuyển respond JSON sang object
        const data = await res.json();
        //update state results 
        setResults(data);
        //update state trạng thái showResults
        setShowResults(true);
      //bắt và thông báo nếu có lỗi
      } catch (err) {
        console.error("Search error:", err);
      } finally {
        //sau khi gọi API, dù try hay catch thì vẫn update state loading thành false
        setLoading(false);
      }
    };

    // Kỹ thuật DEBOUNCE
    //set timeout mỗi lần là 300 gọi hàm searchLocations
    const timeout = setTimeout(searchLocations, 300); 
    //xóa timeout cũ nếu user nhập 1 kí tự trước 300ms
    return () => clearTimeout(timeout);

  }, [query]);

  //xử lí khi user click vào 1 result hiển thị
  const handleSelect = (location) => {
    //update state querry về rỗng
    setQuery("");
    //update state showResults về false để off
    setShowResults(false);
    //navigate theo path mới
    navigate(`/locations/${location.id}`);
  };

  return (
    <div className="search-container">
      <div className="search-input-wrapper">
      {/* //Ô nhập liệu */}
        <input
          type="text"
          placeholder="Search location..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="search-input"
        />
      </div>

      {/* Dropdown kết quả */}
      {showResults && (
        <div className="search-results">
          {loading ? (
            <div className="search-item">Loading...</div>
          ) : results.length > 0 ? (
            results.map((loc) => (
              <div
                key={loc.id}
                className="search-item"
                onClick={() => handleSelect(loc)}
              >
                <div className="search-item-name">{loc.name}</div>
                <div className="search-item-address">{loc.address || loc.city}</div>
              </div>
            ))
          ) : (
            <div className="search-item">Not find location</div>
          )}
        </div>
      )}
    </div>
  );
};

export default FilterSearch;