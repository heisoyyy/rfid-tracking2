import React, { useContext } from "react";
import { TrackingContext } from "../context/TrackingContext";
import { useLocation, useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { CSVLink } from "react-csv";

const History = () => {
  const { history, items } = useContext(TrackingContext);
  const location = useLocation();
  const navigate = useNavigate();
  const uid = location.state?.uid;

  // Filter history berdasarkan UID jika ada
  const filteredHistory = uid
    ? history.filter((h) => h.uid === uid)
    : history;

  // Fungsi untuk menghitung keterangan sama seperti di dashboard
  const computeKeterangan = (h) => {
    const item = items.find((i) => i.uid === h.uid);
    if (!item || !h.time) return "Belum mulai";

    const now = new Date();
    const elapsed = (now - new Date(h.time)) / 1000; // detik

    if (h.cp >= item.targetCP && item.status === "SAMPAI") return "Selesai";
    if (elapsed <= 10) return "Tepat Waktu";
    if (elapsed <= 15) return "Rawan Terlambat";
    return "Terlambat";
  };

  // Export PDF
  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text("Surat Jalan Barang", 14, 16);

    const tableColumn = ["UID", "Nama Barang", "Checkpoint", "Waktu", "Keterangan", "Bukti"];
    const tableRows = [];

    filteredHistory.forEach((h) => {
      tableRows.push([
        h.uid,
        h.name,
        h.cp,
        new Date(h.time).toLocaleString(),
        computeKeterangan(h),
        h.proof ? "Ada" : "-",
      ]);
    });

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 20,
    });
    doc.save(`History_${uid || "all"}.pdf`);
  };

  // Export CSV
  const csvData = filteredHistory.map((h) => ({
    UID: h.uid,
    "Nama Barang": h.name,
    Checkpoint: h.cp,
    Waktu: new Date(h.time).toLocaleString(),
    Keterangan: computeKeterangan(h),
    Bukti: h.proof ? "Ada" : "-",
  }));

  return (
    <div className="p-4">
      <h2>Riwayat Scan {uid ? `- UID: ${uid}` : ""}</h2>

      <div className="mb-3">
        <button className="btn btn-secondary me-2" onClick={() => navigate("/tracking")}>
          ← Kembali
        </button>
        <button className="btn btn-danger me-2" onClick={exportPDF}>
          Export PDF
        </button>
        <CSVLink data={csvData} filename={`History_${uid || "all"}.csv`} className="btn btn-success">
          Export CSV
        </CSVLink>
      </div>

      <table className="table table-bordered table-striped">
        <thead className="table-dark">
          <tr>
            <th>UID</th>
            <th>Nama Barang</th>
            <th>Checkpoint</th>
            <th>Waktu</th>
            <th>Keterangan</th>
            <th>Bukti</th>
          </tr>
        </thead>
        <tbody>
          {filteredHistory.length === 0 ? (
            <tr>
              <td colSpan="6" className="text-center">
                Belum ada riwayat scan
              </td>
            </tr>
          ) : (
            filteredHistory.map((h, i) => (
              <tr key={`${h.uid}-${i}`}>
                <td>{h.uid}</td>
                <td>{h.name}</td>
                <td>{h.cp}</td>
                <td>{new Date(h.time).toLocaleString()}</td>
                <td>{computeKeterangan(h)}</td>
                <td>{h.proof ? <img src={h.proof} alt="proof" width="60" /> : "-"}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>  
  );
};

export default History;
