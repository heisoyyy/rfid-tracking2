import React, { createContext, useState } from "react";

export const TrackingContext = createContext();

export const TrackingProvider = ({ children }) => {
  const [items, setItems] = useState([]);
  const [history, setHistory] = useState([]);

  // Tambah item baru
  const addItem = (item) => {
    setItems((prev) => [...prev, item]);
  };

  // Update item by UID
  const updateItem = (uid, updatedFields) => {
    setItems((prev) =>
      prev.map((item) => (item.uid === uid ? { ...item, ...updatedFields } : item))
    );
  };

  // Hapus item
  const removeItem = (uid) => {
    setItems((prev) => prev.filter((item) => item.uid !== uid));
    setHistory((prev) => prev.filter((h) => h.uid !== uid));
  };

  // Tambah/Update history per CP agar tidak duplikat
  const addHistory = ({ uid, name, cp, time, proof }) => {
    setHistory((prev) => {
      const copy = [...prev];
      const index = copy.findIndex((h) => h.uid === uid && h.cp === cp);
      if (index !== -1) {
        copy[index] = { ...copy[index], time, proof: proof || copy[index].proof };
      } else {
        copy.push({ uid, name, cp, time, proof });
      }
      return copy;
    });
  };

  return (
    <TrackingContext.Provider
      value={{
        items,
        history,
        addItem,
        updateItem,
        removeItem,
        addHistory,
      }}
    >
      {children}
    </TrackingContext.Provider>
  );
};
