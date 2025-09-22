// dummyData.js
const dummyData = [{
    uid: "UID-001",
    name: "Barang A",
    status: "START", // START | CP1 | CP2 | CP3 | FINISH
    currentCP: 0,
    targetCP: 3,
    schedule: "2025-09-22 10:00:00",
    estimation: 30, // dalam detik → simulasi
    startTime: "2025-09-22 09:59:00"
  }

];

export default dummyData;