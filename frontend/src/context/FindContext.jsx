import React, { createContext, useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'

export const FindContext = createContext();

export const FindContextProvider = (props) => {
 
  const [loading, setLoading] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [singleResult, setSingleResult] = useState({});
  const [multiResult, setMultiResult] = useState([])

  const location = useLocation(); // 👈 detect route changes

  // ✅ Clear all states automatically when changing submenu / route
  useEffect(() => {
    setSingleResult(null);
    setMultiResult(null);
    setSelectedRow(null);
    setLoading(false);
  }, [location.pathname]); // runs every time route changes

  const handleTableRowClick = (row) => {
    setSelectedRow((prev) =>
      prev?.lorryReceiptNo === row.lorryReceiptNo ? null : row
    );
  };

  const contextFindValue = {
    loading, setLoading,
    singleResult, setSingleResult,
    multiResult, setMultiResult,
    selectedRow, setSelectedRow,
    handleTableRowClick
  }

  return (
    <FindContext.Provider value={contextFindValue}>
      {props.children}
    </FindContext.Provider>
  )
}
