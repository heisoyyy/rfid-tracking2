import React, { useContext, useState, useEffect } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { TrackingContext } from "../context/TrackingContext";
import { useNavigate } from "react-router-dom";

const TrackingData = () => {
  const { items, updateItem, removeItem, addHistory } = useContext(TrackingContext);
  const [activeScanner, setActiveScanner] = useState(null);
  const navigate = useNavigate();

  // Fungsi sinkron dengan Dashboard status alert
  const computeKeterangan = (item) => {
    if (!item.lastCheckpointTime) return "Belum mulai";
    if (item.status === "SAMPAI") return "Selesai";

    const now = new Date();
    const elapsed = (now - new Date(item.lastCheckpointTime)) / 1000; // detik
    const batasWaktu = 10; // 10 detik per CP

    if (elapsed <= batasWaktu) return "Tepat Waktu";
    if (elapsed <= batasWaktu + 5) return "Rawan Terlambat";
    return "Terlambat";
  };

  // Update keterangan otomatis setiap 1 detik agar selaras dengan dashboard
  useEffect(() => {
    const interval = setInterval(() => {
      items.forEach((item) => {
        const keterangan = computeKeterangan(item);
        updateItem(item.uid, { keterangan });
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [items, updateItem]);

  const startScan = (item) => {
    setActiveScanner(item.uid);
    const scanner = new Html5QrcodeScanner("scanner", { fps: 10, qrbox: 250 });

    scanner.render((decodedText) => {
      if (decodedText === item.uid) {
        if (item.currentCP < item.targetCP) {
          const newCP = item.currentCP + 1;
          const now = new Date().toISOString();

          const newStatus = newCP >= item.targetCP ? "SAMPAI" : `CP${newCP}`;
          const keterangan = computeKeterangan({ ...item, currentCP: newCP, status: newStatus, lastCheckpointTime: now });

          // Update item
          updateItem(item.uid, {
            currentCP: newCP,
            lastCheckpointTime: now,
            status: newStatus,
            keterangan,
          });

          // Tambahkan ke riwayat
          addHistory({
            uid: item.uid,
            name: item.name,
            cp: newCP,
            time: now,
            proof: null,
            keterangan,
          });

          alert(`✅ Scan berhasil! Lanjut ke ${newCP >= item.targetCP ? "Selesai" : "CP" + newCP}`);
        }
        scanner.clear();
        setActiveScanner(null);
      } else {
        alert("❌ Barcode salah! Scan barcode yang sesuai.");
      }
    });
  };

  const handleUploadProof = (item, e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const proofs = item.proofs || {};
      proofs[`CP${item.currentCP}`] = reader.result;

      updateItem(item.uid, { proofs });

      addHistory({
        uid: item.uid,
        name: item.name,
        cp: item.currentCP,
        time: new Date().toISOString(),
        proof: reader.result,
        keterangan: item.keterangan || "-",
      });

      alert("📷 Bukti scan berhasil diupload!");
    };
    reader.readAsDataURL(file);
  };

  const goToHistory = (uid) => {
    navigate("/history", { state: { uid } });
  };

  return (
    <div className="p-4">
      <h2>📍 Tracking Data</h2>
      <table className="table table-bordered table-striped">
        <thead className="table-dark">
          <tr>
            <th>UID</th>
            <th>Nama</th>
            <th>Status</th>
            <th>CP</th>
            <th>Keterangan</th>
            <th>Bukti Scan</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.uid}>
              <td>{item.uid}</td>
              <td>{item.name}</td>
              <td>
                {item.status === "SAMPAI" ? (
                  <span className="badge bg-success">{item.status}</span>
                ) : (
                  item.status
                )}
              </td>
              <td>{item.currentCP}/{item.targetCP}</td>
              <td>{item.keterangan || "-"}</td>
              <td>
                {item.proofs && item.proofs[`CP${item.currentCP}`] ? (
                  <img src={item.proofs[`CP${item.currentCP}`]} alt="bukti" width="60" />
                ) : (
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleUploadProof(item, e)}
                  />
                )}
              </td>
              <td>
                {item.status === "SAMPAI" ? (
                  <button className="btn btn-sm btn-danger me-1" onClick={() => removeItem(item.uid)}>
                    Hapus
                  </button>
                ) : (
                  <button className="btn btn-sm btn-primary me-1" onClick={() => startScan(item)}>
                    Scan (Next CP)
                  </button>
                )}
                <button className="btn btn-sm btn-info" onClick={() => goToHistory(item.uid)}>
                  Cek
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {activeScanner && (
        <div className="mt-4">
          <h5>🔍 Scanner untuk UID: {activeScanner}</h5>
          <div id="scanner" style={{ width: "100%" }}></div>
        </div>
      )}
    </div>
  );
};

export default TrackingData;
