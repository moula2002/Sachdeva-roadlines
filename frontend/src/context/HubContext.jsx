
import React, { createContext, useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom';


export const HubContext = createContext();

export const HubContextProvider = (props) => {
  const initialTransportData = { 
    inwardNo:'',
    lorryReceiptNo:'',
    lorryReceiptDate:'',
    fromAddress:'',
    branch:'',
    partyName:'',
    pks:'',
    weight:'',
    lorryReceiptAmount:'',
    cashReceiptNo:'',
    cashReceiptDate:'',
    rebate:'',
    afterRebate:'',
    others:'',
    cashReceiptAmount:'',
    paidAmount:'',
    paymentDate:'',
    paymentType:'',
    balanceAmount:'',
  };

  // Hub data store states
  const [hubData, setHubData] = useState(initialTransportData);
  const [formType, setFormType] = useState(false);
  const [hubResultData, setHubResultData] = useState(null);
  const [oldHubData, setOldHubData] = useState(null);
  const [ selectedRow, setSelectedRow] = useState(null)

  // selected table row handl function 
  const handleTableRowClick = (row) => {
    setSelectedRow((prev) =>
      prev?.lorryReceiptNo === row.lorryReceiptNo ? null : row
    );
    setIsCard(true);
  };

  const fromAddressList = [
    'DELHI',
    'UTTAR_PRADESH',
    'HARYANA',
    'PUNJAB',
    'HIMACHAL_PRADESH',
    'MAHARASHTRA',
    'MUMBAI'
  ];

  // Branch types List
  const branchOptions = {
    DELHI: ['BUDHPUR (P)', 'BAWANA (B)', 'INDERLOK (B & D)', 'KAMLA MARKET (B)', 'KAROL BAGH (B)', 'KASHMERE GATE (B)', 'LAJPAT RAI MARKET (B)', 'MANGOLPURI (B)', 'NARAYANA (B)', 'NARELA (B)', 'SADAR BAZAR (B)', 'SHAHDARA (B)', 'VAZIRPUR (B)', 'GANDHINAGAR (B)', 'GT KARNAL ROAD (B)'],
    UTTAR_PRADESH: ['MEERUT (B)', 'NOIDA (B)', 'PILKHUAWA (B)', 'U.P.BORDER (B)'],
    HARYANA: ['FARIDABAD (B)', 'GURGAON (B)', 'PANIPAT (B)', 'JAGHADHRI (B)'],
    PUNJAB: ['LUDHIANA CYCLE MARKET (B)', 'PHAGWARA (B)', 'JALANDHAR INDUSTRIAL AREA (B)', 'LUDHIANA TRANSPORT NAGAR (B)'],
    HIMACHAL_PRADESH: ['BADDI (B)'],
    MAHARASHTRA: ['VASHI [NAVI-MUMBAI] (B)', 'MASJID BUNDER (B)', 'ANDHERI (B)', 'BHAYANDER (B)', 'BHIWANDI (B)', 'VAPI (B)'],
    MUMBAI: ['VASHI [NAVI-MUMBAI] (B)', 'MASJID BUNDER (B)', 'ANDHERI (B)', 'BHAYANDER (B)', 'BHIWANDI (B)', 'VAPI (B)']
  };

  // Branch get function
  const getBranchOptions = (fromAddress) =>
    branchOptions[fromAddress]?.map((branch) => ({
      label: branch, 
      value: branch
    })
  ) || [];

  // handle the Branch change
  // const handleBranchChange = (selectedOption) => {
  //   setHubData({ ...hubData, branch: selectedOption.value });
  // };
  const handleBranchChange = (selectedOption) => {
  setHubData((prev) => ({
    ...prev,
    branch: selectedOption ? selectedOption.value : "",
  }));
};

  // payment types List
  const paymentTypes = ["ACCOUNT1", "ACCOUNT2", "CHECK BOOK", "CASH", "UPI"]; 
  

  const location = useLocation(); // 👈 detect route changes

  // ✅ Clear all states automatically when changing submenu / route
  useEffect(() => {
    setHubData(initialTransportData)
    setHubResultData(null)
    setOldHubData(null)
    setSelectedRow(null)
  }, [location.pathname]); // runs every time route changes



  
  const contextHubValue = {
    initialTransportData,
    hubData, setHubData,
    formType, setFormType,
    hubResultData, setHubResultData,
    fromAddressList,
    getBranchOptions, handleBranchChange,
    paymentTypes,
    oldHubData, setOldHubData,
    selectedRow, setSelectedRow,
    handleTableRowClick,
   
  }


  return (
    <HubContext.Provider value={contextHubValue}>
        {props.children}
    </HubContext.Provider>
  )
}
 