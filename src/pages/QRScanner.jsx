import React, { useContext, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { TrackingContext } from "../context/TrackingContext";

// Daftar kota besar di Indonesia
const KOTA_INDONESIA = [
  { name: "Aceh", coord: [5.5500, 95.3170] },
  { name: "Medan", coord: [3.5952, 98.6722] },
  { name: "Pekanbaru", coord: [0.5333, 101.4500] },
  { name: "Padang", coord: [-0.9493, 100.3543] },
  { name: "Batam", coord: [1.0800, 104.0300] },
  { name: "Palembang", coord: [-2.9761, 104.7754] },
  { name: "Bengkulu", coord: [-3.8000, 102.2656] },
  { name: "Lampung", coord: [-5.4500, 105.2667] },
  { name: "Jakarta", coord: [-6.2088, 106.8456] },
  { name: "Bandung", coord: [-6.9147, 107.6098] },
  { name: "Semarang", coord: [-7.0051, 110.4381] },
  { name: "Yogyakarta", coord: [-7.7956, 110.3695] },
  { name: "Surabaya", coord: [-7.2575, 112.7521] },
  { name: "Malang", coord: [-7.9666, 112.6326] },
  { name: "Bali (Denpasar)", coord: [-8.6705, 115.2126] },
  { name: "Kupang", coord: [-10.1771, 123.6051] },
  { name: "Makassar", coord: [-5.1477, 119.4327] },
  { name: "Manado", coord: [1.4780, 124.8425] },
  { name: "Palangkaraya", coord: [-2.2099, 113.9164] },
  { name: "Pontianak", coord: [-0.4796, 109.3404] },
  { name: "Samarinda", coord: [-0.5023, 117.1539] },
  { name: "Banjarmasin", coord: [-3.3160, 114.5946] },
  { name: "Jayapura", coord: [-2.5336, 140.7181] },
  { name: "Manokwari", coord: [-0.8617, 134.0628] },
];

const QRScanner = () => {
  const { addItem } = useContext(TrackingContext);
  const [name, setName] = useState("");
  const [tanggal, setTanggal] = useState("");
  const [pic, setPic] = useState("");
  const [cpLocations, setCpLocations] = useState(["Jakarta"]);
  const [scannedUid, setScannedUid] = useState("");

  // Scan QR
  const handleScan = () => {
    const scanner = new Html5QrcodeScanner("reader", { fps: 10, qrbox: 250 });
    scanner.render((uid) => {
      setScannedUid(uid);
      alert(`Barcode berhasil discan: ${uid}`);
      scanner.clear();
    });
  };

  // Submit barang baru
  const handleSubmit = () => {
    if (!scannedUid) return alert("Silakan scan barcode dulu!");
    const newItem = {
      uid: scannedUid,
      name: name || `Barang ${scannedUid}`,
      status: "START",
      currentCP: 0,
      targetCP: cpLocations.length,
      schedule: tanggal || new Date().toLocaleString(),
      estimation: 30,
      startTime: new Date().toISOString(),
      lastCheckpointTime: new Date().toISOString(),
      pic,
      cpLocations: cpLocations.map((city) => {
        const kota = KOTA_INDONESIA.find((k) => k.name === city);
        return kota ? kota.coord : [-6.2088, 106.8456];
      }),
    };
    addItem(newItem);
    alert(`Barang ${newItem.name} (UID: ${scannedUid}) berhasil ditambahkan!`);

    // Reset form
    setName("");
    setTanggal("");
    setPic("");
    setCpLocations(["Jakarta"]);
    setScannedUid("");
  };

  const handleCancel = () => {
    setName("");
    setTanggal("");
    setPic("");
    setCpLocations(["Jakarta"]);
    setScannedUid("");
  };

  // Tambah / Hapus CP
  const addCP = () => setCpLocations((prev) => [...prev, "Jakarta"]);
  const removeCP = (idx) => setCpLocations((prev) => prev.filter((_, i) => i !== idx));

  const isFormComplete =
    name.trim() &&
    scannedUid.trim() &&
    tanggal &&
    pic.trim() &&
    cpLocations.every((cp) => cp !== "");

  return (
    <div className="p-4">
      <h2 className="mb-3">QR Scanner & Input Barang</h2>

      <div className="mb-3">
        <label className="form-label">Nama Barang:</label>
        <input
          type="text"
          className="form-control"
          placeholder="Masukkan nama barang"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Scan / Upload Barcode:</label>
        <div className="d-flex mb-2 flex-wrap gap-2">
          <button className="btn btn-secondary" onClick={handleScan}>
            Scan Barcode
          </button>
          {scannedUid && <span className="align-self-center">UID: {scannedUid}</span>}
        </div>
        <div id="reader" style={{ width: "100%" }}></div>
      </div>

      <div className="mb-3">
        <label className="form-label">Tanggal Pengiriman:</label>
        <input
          type="datetime-local"
          className="form-control"
          value={tanggal}
          onChange={(e) => setTanggal(e.target.value)}
        />
      </div>

      <div className="mb-3">
        <label className="form-label">PIC / Penanggung Jawab:</label>
        <input
          type="text"
          className="form-control"
          placeholder="Nama PIC"
          value={pic}
          onChange={(e) => setPic(e.target.value)}
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Lokasi Checkpoint (CP):</label>
        {cpLocations.map((cp, idx) => (
          <div key={idx} className="d-flex mb-2 gap-2 flex-wrap">
            <select
              className="form-select flex-grow-1"
              value={cp}
              onChange={(e) =>
                setCpLocations((prev) => {
                  const copy = [...prev];
                  copy[idx] = e.target.value;
                  return copy;
                })
              }
            >
              {KOTA_INDONESIA.map((kota) => (
                <option key={kota.name} value={kota.name}>
                  {kota.name}
                </option>
              ))}
            </select>
            {cpLocations.length > 1 && (
              <button className="btn btn-danger" onClick={() => removeCP(idx)}>
                Hapus
              </button>
            )}
          </div>
        ))}
        <button className="btn btn-primary mt-2" onClick={addCP}>
          Tambah CP
        </button>
      </div>

      <div className="d-flex flex-wrap gap-2">
        <button
          className="btn btn-success"
          onClick={handleSubmit}
          disabled={!isFormComplete}
        >
          Kirim
        </button>
        <button className="btn btn-danger" onClick={handleCancel}>
          Batal
        </button>
      </div>
    </div>
  );
};

export default QRScanner;
