
import { useState, useEffect } from "react";
import { Save, ToggleLeft, ToggleRight } from "lucide-react";
import "./PartnerHours.css";

const daysOfWeek = [
  "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"
];

const parseDbToSchedule = (hourRecord) => {
  if (!hourRecord) return null;

  if (hourRecord.schedule && hourRecord.schedule.length > 0) {
    return hourRecord.schedule;
  }

  const dayKeys = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
  return daysOfWeek.map((day, index) => {
    const raw = hourRecord[dayKeys[index]];
    if (raw) {
      const [openTime, closeTime] = raw.split(" - ");
      return { day, openTime, closeTime, isClosed: false };
    }
    return {
      day,
      openTime:  index >= 5 ? "10:00" : "08:00",
      closeTime: index >= 5 ? "23:30" : "22:00",
      isClosed:  false
    };
  });
};

const defaultSchedule = daysOfWeek.map((day, index) => ({
  day,
  openTime:  index >= 5 ? "10:00" : "08:00",
  closeTime: index >= 5 ? "23:30" : "22:00",
  isClosed:  false
}));

const PartnerHours = ({ data, placeId, onRefresh }) => {
  const [hours, setHours] = useState(defaultSchedule);
  const [isOpenToday, setIsOpenToday] = useState(true);
  const [recordId, setRecordId] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const hourData = Array.isArray(data) ? data[0] : data;

    if (hourData) {
      setRecordId(hourData.id || null);
      setIsOpenToday(hourData.isOpenToday ?? true);
      const parsed = parseDbToSchedule(hourData);
      setHours(parsed || defaultSchedule);
    } else {
      setHours(defaultSchedule);
      setRecordId(null);
      setIsOpenToday(true);
    }
  }, [data]);

  const handleSave = async () => {
    if (!placeId) return alert("Location chưa được xác định!");

    setSaving(true);
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const partnerId = String(user?.id);
      const hoursUrl = import.meta.env.VITE_Location_Hours;

      const payload = {
        locationId:  String(placeId),
        partnerId:   partnerId,
        schedule:    hours,
        isOpenToday: isOpenToday,
        updatedAt:   new Date().toISOString()
      };

      let res;
      if (recordId) {
        res = await fetch(`${hoursUrl}/${recordId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
      } else {
        res = await fetch(hoursUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...payload, createdAt: new Date().toISOString() })
        });
      }

      if (res.ok) {
        await onRefresh();
        alert("Lưu giờ hoạt động thành công!");
      } else {
        alert("Lưu thất bại!");
      }
    } catch (error) {
      console.error("Save error:", error);
      alert("Lỗi kết nối server!");
    } finally {
      setSaving(false);
    }
  };

  const toggleDayClosed = (index) => {
    setHours(prev =>
      prev.map((d, i) => i === index ? { ...d, isClosed: !d.isClosed } : d)
    );
  };

  const handleTimeChange = (index, field, value) => {
    setHours(prev =>
      prev.map((d, i) => i === index ? { ...d, [field]: value } : d)
    );
  };

  return (
    <div className="hours-container">
      <div className="hours-header">
        <h1>Manage Operating Hours</h1>
      </div>

      <div className="today-status">
        <div className="status-card">
          <h3>Today's Status</h3>
          <div className="status-toggle" onClick={() => setIsOpenToday(!isOpenToday)}>
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
                    type="button"
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
        <button
          className="save-hours-btn"
          onClick={handleSave}
          disabled={saving}
        >
          <Save size={20} />
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
};

export default PartnerHours;