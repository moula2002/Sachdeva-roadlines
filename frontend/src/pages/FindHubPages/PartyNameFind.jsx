import React, { useState, useEffect } from 'react'
import FindInputCard from '../../components/FindHubComponents/FindInputCard'
import { toast } from 'react-toastify';
import { CalculateGrandTotal, ResultTable } from '../../components/RecordResultTable';
import RecordPageBasedResultTable from '../../components/RecordPageBasedResultTable';

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// END POINTS
import { 
  PartyNameToFindedPendingRecordList,
  PartyNameToFindedInitiatedRecordList,
  PartyNameToFindedPaidRecordsPages,
  PartyNameToFindedAllRecordsPages,
} from '../../services/HomeService';



export default function PartyNameFind() {

  const baseURL = "http://localhost:8080/api/v1/home"

  // partyName input field error wil state handle
  const [hasInputError, setHasInputError] = useState(false); 
  // this partyName state variableused to Save the searched party name  
  const [partyName, setPartyName] = useState("");


  /* ------------------ PENDING paymentStats Data's Get ------------------ */

  const [pendingData, setPendingData] = useState([]);
  const [pendingLoading, setPendingLoading] = useState(false);

  /* -------------------- Encode PartyNme ------------------------------------- */
  /*  Encode The partyName 
    safely encodes special characters in a string so it can be used inside a URL. 
    "A & B Transport" to A%20%26%20B%20Transport */
  const encodeTheName = (partyName) => {
    return encodeURIComponent(partyName);
  } 
   /* ------------------------------------------------------------------------- */
  const fetchPendingDataToPartyName = async (partyName) => {
    setPendingLoading(true);

    try {
      const response = await PartyNameToFindedPendingRecordList(encodeTheName(partyName));
      if(response.status === 200) setPendingData(response.data);

    } catch(error) {
      console.log(`Error fetchPendingDataToPartyName method : ${error}`);

    } finally {
      setPendingLoading(false)
    }
  } 

 
  /* ------------------ INITIATED paymentStats Data's Get ------------------ */ 

  const [initiatedData, setInitiatedData] = useState([]);
  const [initiatedLoading, setInitiatedLoading] = useState(false);

  const fetchInitiatedDataToPartyName = async (partyName) => {
    setInitiatedLoading(true);
  
    try {
      // const response = await axios.get(`${baseURL}/initiated-list-by-party-name?partyName=${encodedPartyName}`);
      const response = await PartyNameToFindedInitiatedRecordList(encodeTheName(partyName));
      if(response.status === 200) setInitiatedData(response.data)

    } catch(error) {
      console.log(`Error fetchInitiatedDataToPartyName method : ${error}`);
      toast.error("Failed to fetch initiated records.");

    } finally {
      setInitiatedLoading(false);
    }
  } 


  /* ------------------ PAID paymentStatus Data's Get (Page-based) ------------------ */ 

  const [paidData, setPaidData] = useState([]);   // PaidData Storage 
  const [totalPagesPaid, setTotalPagesPaid] = useState(0);    // Total Pages
  const [totalRecordsCountPaid, setTotalRecordsCountPaid] = useState(0);    // Total Recourdes count 
  const [currentPagePaid, setCurrentPagePaid] = useState(1);    // Set the Current Page
  const [paidLoading, setPaidLoading] = useState(false);

  const fetchPaidDataToPartyName = async (currentPagePaid, partyName) => {
  
    setPaidLoading(true);

    try {
      const response = await PartyNameToFindedPaidRecordsPages(encodeTheName(partyName), currentPagePaid);
      console.log("the page res : ", response);
      
  
      if(response.status === 200) {
        const data = response.data
        setPaidData(data.content);
        setTotalPagesPaid(data.totalPages);
        setTotalRecordsCountPaid(data.totalElements);
        console.log(`PAID paymentStatus page \npage number : ${currentPagePaid} \ndata :", ${data.content}`);
      }

    } catch (error) {
      console.log("Error fetchPaidDataToPartyName method : ", error);

    } finally {
      setPaidLoading(false)
    }
  }


  /* ------------------ All paymentStatus like PENDING, INITIATED, PAID Data's Get (Page-based) ------------------ */

  const [allStatusPartyNameData, setAllStatusPartyNameData] = useState([]);   // PaidData Storage
  const [totalPagesAllStatusPartyName, setTotalPagesAllStatusPartyName] = useState(0);    // Total Pages  
  const [totalRecordsCountAllStatusPartyName, setTotalRecordsCountAllStatusPartyName] = useState(0);    // Total Recourdes count
  const [currentPageAllStatusPartyName, setCurrentPageAllStatusPartyName] = useState(1);    // Set the Current Page
  const [allStatusPartyNameLoading, setAllStatusPartyNameLoading] = useState(false);


  const fetchAllStatusDataToPartyName = async (partyName, currentPageAllStatusPartyName) => {
    setAllStatusPartyNameLoading(true);

    try {
      const response = await PartyNameToFindedAllRecordsPages(encodeTheName(partyName), currentPageAllStatusPartyName);
  
      if(response.status === 200) {
        const data = response.data
        setAllStatusPartyNameData(data.content);
        setTotalPagesAllStatusPartyName(data.totalPages);
        setTotalRecordsCountAllStatusPartyName(data.totalElements);
        console.log(`All Status Data's \npage number : ${currentPageAllStatusPartyName} \ndata :", ${data.content}`);
      }

    } catch (error) {
      console.log("Error fetchAllStatusDataToPartyName Function : ", error);
      toast.error("Failed to fetch all-status records.")

    } finally {
      setAllStatusPartyNameLoading(false);
    } 
  }


  /* ------------------ Input Handler Methos ------------------ */
  const handleFindPartyName = async (name, isError, value) => {
  
    setHasInputError(isError)
    if (isError) {
      return; 
    }
    
    setPartyName(value); // Save the searched party name here

    // Reset pagination when new party name searched
    setPendingData([]);
    setInitiatedData([]);
    setPaidData([]);
    setAllStatusPartyNameData([]);
    setCurrentPagePaid(1);
    setCurrentPageAllStatusPartyName(1);
    setTotalRecordsCountPaid(0);
    setTotalRecordsCountAllStatusPartyName(0);
    setPendingLoading(true);
    setInitiatedLoading(true);
    setPaidLoading(true);
    setAllStatusPartyNameLoading(true);

    toast.info(`${value} Details `);

    await Promise.all([
      fetchPendingDataToPartyName(value),   // PENDING paymentStatus data's List get
      fetchInitiatedDataToPartyName(value),   // INITIATED paymentStatus data's List get
    ]);
  }

  /* ------------------ Auto Refetch Effects ------------------ */
  // If the Current Page will change, then only this useEffect call 

  // PAID data
  useEffect(() => {
    if (partyName) fetchPaidDataToPartyName(currentPagePaid, partyName);
  }, [currentPagePaid, partyName]); // triggers on page or party change

  // ALL STATUS data
  useEffect(() => {
    if (partyName) fetchAllStatusDataToPartyName(currentPageAllStatusPartyName, partyName);
  }, [currentPageAllStatusPartyName, partyName]); // triggers on page or party change


  return (
    <div>
      <div>
        <FindInputCard
          name="partyName"
          type="text"
          placeholder="Enter party name"
          buttonText="Party Name"
          onFind={handleFindPartyName} //call back function
        />
      </div>
      

      {!hasInputError && (
        <div className='flex flex-col gap-4 mt-16'>

          <div>
            {/* PENDING paymentStatus List result table */}
            {pendingData.length > 0  && (
              <>
                <div>
                  {/* Show the  PartyName Pending Details to Table Format */}
                  <TableTitle tableTitle={"Pending Details"} tableLoading={pendingLoading} recordCount={pendingData.length} />

                  {/* Downloade The Total Pending Record to PDF Format  */}
                  <div className='text-center my-2'>
                    <DownloadPendingPDF 
                    pendingData={pendingData} 
                    totals={CalculatePendingTotal(pendingData)} 
                    fileName={pendingData[0].partyName}  />
                  </div>
                </div>

                {/* Show the Pending result CARD format  */}
                <ResultTable records={pendingData} tableType={'pending'}/>
              </>
            )}
          </div>
            
          <div>
            {/* INITIATED paymentStatus List result table */}
            {initiatedData.length > 0 && (
              <>
                <TableTitle tableTitle={"Initiated Details"} tableLoading={initiatedLoading} recordCount={initiatedData.length} />
                <ResultTable records={initiatedData} tableType={'initiated'}/>
              </>
            )}
          </div>
            
          <div>
            {/* PAID paymentStatus page based result table */}
            {paidData.length > 0  && (
              <>
                <TableTitle tableTitle={"Paid Details"} tableLoading={paidLoading} recordCount={totalRecordsCountPaid} />
                <RecordPageBasedResultTable
                  totalPages={totalPagesPaid}
                  loading={paidLoading}
                  currentPage={currentPagePaid}
                  setCurrentPage={setCurrentPagePaid}
                  tableData={paidData} 
                />
              </>
            )}
          </div>

          <div>
            {/* all paymentStatus PAID, PENDING, INITIATED page based result table */}
            {allStatusPartyNameData.length > 0 && (
              <>
                <TableTitle tableTitle={"All Details Record"} tableLoading={allStatusPartyNameLoading} recordCount={totalRecordsCountAllStatusPartyName} />
                <RecordPageBasedResultTable
                  totalPages={totalPagesAllStatusPartyName}
                  loading={allStatusPartyNameLoading}
                  currentPage={currentPageAllStatusPartyName}
                  setCurrentPage={setCurrentPageAllStatusPartyName}
                  tableData={allStatusPartyNameData} 
                />
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}


export const TableTitle = ({tableTitle, tableLoading, recordCount}) => {
return (
  <div className='my-5 w-[90%] mx-auto px-[2px] flex justify-between'>
    <div className='text-xl font-bold text-[darkcyan] dark:text-red-600'>{tableTitle}</div>

    {tableLoading && <p>Loading...</p>}

    <div className='my-1 text-sm text-gray-600 dark:text-white '>
      <span>Total : </span>
      <span className='font-bold text-[darkblue] dark:text-pink-500'>{recordCount}</span>
    </div>
    
  </div>
);
}

// Grand Total Find Pending Records
export const CalculatePendingTotal = (result = []) => { 

  if(!Array.isArray(result) || result.length == 0) {
    return {
      pks: 0,
      weight: 0,
      lorryReceiptAmount: 0,
      rebate: 0,
      afterRebate: 0,
      others: 0,
      cashReceiptAmount: 0,
      paidAmount: 0,
      balanceAmount: 0,
    };
  } 
  // console.log("coming row details is : ", result);
    
  // accumulator (acc)  , currentItem (item), {initialValue} - initial value
  const totals = result.reduce((acc, item) => ({
    pks: acc.pks + Number(item.pks || 0),
    weight: acc.weight + Number(item.weight || 0),
    lorryReceiptAmount: acc.lorryReceiptAmount + Number(item.lorryReceiptAmount || 0),
    rebate: acc.rebate + Number(item.rebate || 0),
    afterRebate: acc.afterRebate + Number(item.afterRebate || 0),
    others: acc.others + Number(item.others || 0),
    cashReceiptAmount: acc.cashReceiptAmount + Number(item.cashReceiptAmount || 0),
    paidAmount: acc.paidAmount + Number(item.paidAmount || 0),
    balanceAmount: acc.balanceAmount + Number(item.balanceAmount || 0),
  }),
  {
    pks: 0,
    weight: 0,
    lorryReceiptAmount: 0,
    rebate: 0,
    afterRebate: 0,
    others: 0,
    cashReceiptAmount: 0,
    paidAmount: 0,
    balanceAmount: 0,
  }
  );

  return totals;
}


// =====================================
// downlade the pending PDF Details
export const DownloadPendingPDF = ({ pendingData, totals, fileName }) => {
  const handleDownloaPendingdPDF = () => {
    const doc = new jsPDF();

    // === Setup data ===
    const headers = [
      "S.NO", "CR NO", "LR No", "LR Date", "pks", "Weight",
      "Freight", "Rebate", "After Rebate", "Others", "CR Amount", "Paid", "Pending",
    ];

    const rows = pendingData.map((item, index) => [
      index + 1,
      item.cashReceiptNo || "",
      item.lorryReceiptNo || "",
      item.lorryReceiptDate || "",
      item.pks || 0,
      item.weight || 0,
      item.lorryReceiptAmount || 0,
      item.rebate || 0,
      item.afterRebate || 0,
      item.others || 0,
      item.cashReceiptAmount || 0,
      item.paidAmount || 0,
      item.balanceAmount || 0,
    ]);

    rows.push([
      "Total", "", "", "", 
      totals.pks.toLocaleString(),
      totals.weight.toLocaleString(),
      `RS. ${totals.lorryReceiptAmount.toLocaleString()}`,
      totals.rebate.toLocaleString(),
      totals.afterRebate.toLocaleString(),
      totals.others.toLocaleString(),
      `Rs. ${totals.cashReceiptAmount.toLocaleString()}`,
      totals.paidAmount.toLocaleString(),
      `RS. ${totals.balanceAmount.toLocaleString()}`,
    ]);



    // === Chunk rows for multiple pages ===
    const chunkArray = (array, size) => {
      const result = [];
      for (let i = 0; i < array.length; i += size) {
        result.push(array.slice(i, i + size));
      }
      return result;
    };

    const rowChunks = chunkArray(rows, 35);
    const totalPages = rowChunks.length;
  

    // === Generate pages ===
    rowChunks.forEach((chunk, pageIndex) => {
      if (pageIndex !== 0) doc.addPage();

      // --- HEADER ---
      doc.setFontSize(11);
      // doc.text("Sachdeva Roadlines P Ltd.,", 14, 8);

      doc.text(`Sachdeva Roadlines P Ltd., ${fileName} PENDING AMOUNT DETAILS `, 14, 15);

      // --- TABLE ---
      autoTable(doc, {
        head: [headers],
        body: chunk,
        startY: 18,
        margin: 2,
        styles: { 
          cellWidth: 'auto',   // Auto width
          fontSize: 8 ,
          cellPadding :1,
        },
      });

      // Footer Page No.
      doc.setFontSize(8);
      doc.text(`Page ${pageIndex + 1} of ${totalPages}`, 180, 290);
    });

    doc.save(`${fileName+" PENDING DETAILS" || "Pending_Report"}.pdf`);
  };

  return (
    <button
      onClick={handleDownloaPendingdPDF}
       className='w-[200px] my-2 mx-auto px-6 py-3 bg-gradient-to-r from-cyan-600 to-cyan-400 text-white font-semibold rounded-lg shadow-md hover:scale-105 transform transition duration-300 cursor-pointer'
     >
      Download PDF
    </button>
  );
};

