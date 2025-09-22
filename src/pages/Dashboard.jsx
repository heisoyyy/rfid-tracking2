import React, { useContext, useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Polyline, Popup } from "react-leaflet";
import { TrackingContext } from "../context/TrackingContext";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const lerp = (start, end, t) => start + (end - start) * t;

const AnimatedMarker = ({ item }) => {
  const markerRef = useRef(null);
  const [position, setPosition] = useState(item.cpLocations[item.currentCP] || [-6.2088, 106.8456]);

  useEffect(() => {
    if (!markerRef.current) return;
    const start = position;
    const end = item.cpLocations[item.currentCP] || [-6.2088, 106.8456];
    let t = 0;
    const totalDuration = 10000;
    const intervalTime = 100;
    const steps = totalDuration / intervalTime / (item.cpLocations.length - 1);
    const increment = 1 / steps;

    const interval = setInterval(() => {
      t += increment;
      if (t >= 1) {
        clearInterval(interval);
        setPosition(end);
      } else {
        const lat = lerp(start[0], end[0], t);
        const lng = lerp(start[1], end[1], t);
        setPosition([lat, lng]);
      }
    }, intervalTime);

    return () => clearInterval(interval);
  }, [item.currentCP]);

  return (
    <Marker
      ref={markerRef}
      position={position}
      icon={L.icon({
        iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
        iconSize: [30, 30],
      })}
    >
      <Popup>
        <b>{item.name}</b> <br />
        Status: {item.status} <br />
        CP: {item.currentCP}/{item.targetCP}
      </Popup>
    </Marker>
  );
};

const Dashboard = () => {
  const { items } = useContext(TrackingContext);
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const newAlerts = items.map((item) => {
        if (!item.lastCheckpointTime) return { msg: `${item.name} belum mulai`, type: "secondary" };
        const elapsed = (now - new Date(item.lastCheckpointTime)) / 1000;
        if (item.status === "SAMPAI") return { msg: `${item.name} sudah sampai tujuan`, type: "success" };
        if (elapsed <= 10) return { msg: `${item.name} Tepat Waktu`, type: "success" };
        if (elapsed <= 15) return { msg: `${item.name} Rawan Terlambat`, type: "warning" };
        return { msg: `${item.name} Terlambat`, type: "danger" };
      });
      setAlerts(newAlerts);
    }, 1000);
    return () => clearInterval(interval);
  }, [items]);

  return (
    <div className="p-4">
      <h2 className="mb-4">Dashboard</h2>

      {/* Daftar Barang */}
      <div className="card mb-4 shadow-sm">
        <div className="card-header bg-success text-white">Daftar Barang</div>
        <div className="card-body">
          <table className="table table-bordered table-striped">
            <thead className="table-dark">
              <tr>
                <th>Nama Barang</th>
                <th>Status</th>
                <th>Checkpoint</th>
                <th>Jadwal</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.uid}>
                  <td>{item.name}</td>
                  <td>{item.status}</td>
                  <td>{item.currentCP}/{item.targetCP}</td>
                  <td>{item.schedule}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Peta */}
      <div className="card mb-4 shadow-sm">
        <div className="card-header bg-primary text-white">Peta Perjalanan</div>
        <div className="card-body p-0">
          <MapContainer center={items[0]?.cpLocations[0] || [-6.2088, 106.8456]} zoom={5} style={{ height: "400px", width: "100%" }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {items.map((item, idx) => (
              <React.Fragment key={idx}>
                <Polyline positions={item.cpLocations} color="blue" />
                {item.cpLocations.map((pos, i) => (
                  <Marker key={`cp-${idx}-${i}`} position={pos}>
                    <Popup>{i === 0 ? "Mulai" : i === item.cpLocations.length - 1 ? "Sampai" : `CP${i}`}</Popup>
                  </Marker>
                ))}
                <AnimatedMarker item={item} />
              </React.Fragment>
            ))}
          </MapContainer>
        </div>
      </div>

      {/* Status Alerts */}
      <div className="card shadow-sm">
        <div className="card-header bg-warning text-dark">Status Alert</div>
        <div className="card-body">
          {alerts.map((a, i) => (
            <div key={i} className={`alert alert-${a.type} mb-2`}>{a.msg}</div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
