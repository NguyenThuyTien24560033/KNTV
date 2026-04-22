
import { useState } from "react";
import { Plus, Edit2, Trash2, Save, X } from "lucide-react";
import "./PartnerMenu.css";

const PartnerMenu = ({ data, placeId, onRefresh }) => {
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    name: "", price: "", description: "", category: "", image: ""
  });

  const menuItems = data || [];

  const resetForm = () => {
    setFormData({ name: "", price: "", description: "", category: "", image: "" });
    setEditingItem(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!placeId) return alert("Location chưa được xác định!");

    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const partnerId = String(user?.id);
      const menuUrl = import.meta.env.VITE_Location_Menu;

      // ✅ Dùng locationId cho đúng với db.json
      const payload = {
        ...formData,
        price:      Number(formData.price),
        locationId: String(placeId),
        partnerId:  String(partnerId),
        updatedAt:  new Date().toISOString()
      };

      let res;
      if (editingItem) {
        res = await fetch(`${menuUrl}/${editingItem.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
      } else {
        res = await fetch(menuUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...payload, createdAt: new Date().toISOString() })
        });
      }
      
      if (res.ok) {
        // await onRefresh();
        await onRefresh(true);
        // window.dispatchEvent(new Event("Updated"));
        setShowForm(false);
        resetForm();
        alert(editingItem ? "Cập nhật thành công!" : "Thêm món thành công!");
      }
    } catch (error) {
      console.error(error);
      alert("Lỗi khi lưu món ăn!");
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      name:        item.name,
      price:       item.price,
      description: item.description || "",
      category:    item.category    || "",
      image:       item.image       || ""
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn chắc chắn muốn xóa món này?")) return;
    try {
      const menuUrl = import.meta.env.VITE_Location_Menu;
      const res = await fetch(`${menuUrl}/${id}`, { method: "DELETE" });
      if (res.ok) {
        // await onRefresh();
        await onRefresh(true);
        alert("Xóa thành công!");
      }
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  return (
    <div className="menu-container">
      <div className="menu-header">
        <h1>Menu Management</h1>
        <button className="add-btn" onClick={() => { resetForm(); setShowForm(true); }}>
          <Plus size={20} /> New item
        </button>
      </div>

      {showForm && (
        <div className="menu-form-container">
          <form onSubmit={handleSubmit} className="menu-form">
            <div className="form-title">
              {editingItem ? "Edit item" : "New item"}
              <button
                type="button"
                className="close-form"
                onClick={() => { setShowForm(false); resetForm(); }}
              >
                <X size={20} />
              </button>
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label>Item Name</label>
                <input
                  type="text" name="name"
                  value={formData.name}
                  onChange={handleInputChange} required
                />
              </div>
              <div className="form-group">
                <label>Price (VNĐ)</label>
                <input
                  type="number" name="price"
                  value={formData.price}
                  onChange={handleInputChange} required
                />
              </div>
              <div className="form-group">
                <label>Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange} required
                >
                  <option value="">-- Select Category --</option>
                  <option value="Meat">Meat</option>
                  <option value="Seafood">Seafood</option>
                  <option value="Vegetarian">Vegetarian</option>
                  <option value="Street Food">Street Food</option>
                  <option value="Family-style">Family-style</option>
                  <option value="Set meals">Set meals</option>
                  <option value="Hotpot">Hotpot</option>
                </select>
              </div>
              <div className="form-group">
                <label>Image URL</label>
                <input
                  type="text" name="image"
                  value={formData.image}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group full">
                <label>Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                />
              </div>
            </div>

            <button type="submit" className="submit-btn">
              <Save size={20} /> {editingItem ? "Update item" : "Add item"}
            </button>
          </form>
        </div>
      )}

      <div className="menu-list">
        {menuItems.length === 0 ? (
          <p className="no-items">Menu trống. Hãy thêm món mới!</p>
        ) : (
          menuItems.map((item) => (
            <div key={item.id} className="menu-item-card">
              <div className="menu-item-image">
                {item.image
                  ? <img src={item.image} alt={item.name} />
                  : <div className="no-image-small">No Image</div>
                }
              </div>
              <div className="menu-item-info">
                <h3>{item.name}</h3>
                <p className="price">{Number(item.price).toLocaleString("vi-VN")} ₫</p>
                {item.category    && <p className="category">{item.category}</p>}
                {item.description && <p className="description">{item.description}</p>}
              </div>
              <div className="menu-item-actions">
                <button className="edit-btn-small" onClick={() => handleEdit(item)}>
                  <Edit2 size={18} />
                </button>
                <button className="delete-btn-small" onClick={() => handleDelete(item.id)}>
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default PartnerMenu;



