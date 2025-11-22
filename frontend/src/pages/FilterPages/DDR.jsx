import React, { useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { toast } from "react-toastify";

export default function DDR() {
  const [findDdrData, setFindDdrData] = useState({
    from_address: "",
    from_date: "",
    to_date: "",
  });

  const [showDdrData, setShowDdrData] = useState(false);
  const [filteredDdrDatas, setFilteredDdrDatas] = useState([]);
  const [fileName, setFileName] = useState("");
  const [loading, setLoading] = useState(false);

  // Input handler
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFindDdrData({ ...findDdrData, [name]: value });
  };

  // Validation
  const validateData = () => {
    const { from_address, from_date, to_date } = findDdrData;
    return from_address.trim() && from_date && to_date;
  };

  // Fetch DDR data
  const GetDdrForLrDate = async () => {
    setFilteredDdrDatas([]);
    setLoading(true);
    const { from_address, from_date, to_date } = findDdrData;

    try {
      const response = await axios.post("http://localhost:8080/api/v1/hub/ddr", {
        fromAddress: from_address,
        fromDate: from_date,
        toDate: to_date,
      });

      console.log("DDR Response:", response);

      if (response.status === 200) {
        setFilteredDdrDatas(response.data);
        setFileName(`${from_address}_${from_date}_${to_date}`);
        setShowDdrData(true);
        toast.success("DDR fetched successfully");
      } else if (response.status === 204) {
        toast.info("No records found");
      }
    } catch (error) {
      console.error("Error fetching DDR:", error);
      if (error.response?.status === 400) {
        toast.error("No data found for the given criteria.");
      } else {
        toast.warning("Something went wrong!");
      }
    } finally {
      setLoading(false);
    }
  };

  // Submit handler
  const handleSubmit = () => {
    if (validateData()) {
      GetDdrForLrDate();
    } else {
      toast.error("Please fill in all the fields!");
    }
  };

  return (
    <>
      <div>

        {/* Title */}
        <h2 className="text-3xl font-bold text-center text-cyan-700 dark:text-cyan-400 mb-6">
          Hub Entry Form
        </h2>

        {/* DDR Form */}
        <div className="w-[75%] mx-auto px-2 sm:px-4 md:px-20 lg:px-5 grid grid-cols-1 gap-4 md:gap-8 lg:grid-cols-3">
          {/* From Address */}
          <div className="w-full h-10 border rounded-sm pt-1 dark:bg-gray-700 dark:text-white border-pink-500 dark:border-cyan-600 dark:border-2">
            <input
              type="text"
              name="from_address"
              placeholder="From Address"
              className="border-none outline-none w-full h-full text-[16px] sm:text-[18px] font-normal px-3 pb-1"
              onChange={handleChange}
              value={findDdrData.from_address}
            />
          </div>

          {/* From Date */}
          <div className="w-full h-10 border rounded-sm pt-1 dark:bg-gray-700 dark:text-white border-pink-500 dark:border-cyan-600 dark:border-2">
            <input
              type="date"
              name="from_date"
              className="border-none outline-none w-full h-full text-[16px] sm:text-[18px] font-normal px-3 pb-1"
              onChange={handleChange}
              value={findDdrData.from_date}
            />
          </div>

          {/* To Date */}
          <div className="w-full h-10 border rounded-sm pt-1 dark:bg-gray-700 dark:text-white border-pink-500 dark:border-cyan-600 dark:border-2">
            <input
              type="date"
              name="to_date"
              className="border-none outline-none w-full h-full text-[16px] sm:text-[18px] font-normal px-3 pb-1"
              onChange={handleChange}
              value={findDdrData.to_date}
            />
          </div>
        </div>

        <div className="mx-auto flex justify-center">
          <button
            className="px-4 py-2 w-[140px] bg-gradient-to-r from-pink-600 to-cyan-400 text-white font-semibold rounded shadow-md cursor-pointer m-6 hover:scale-105 transform transition duration-300"
            onClick={handleSubmit}
          >
            {loading ? "Loading..." : "Get DDR"}
          </button>
        </div>
      </div>

      {/* Show results */}
      {showDdrData && (
        <DDR_TableResult
          hubData={filteredDdrDatas}
          DDR_FileName={fileName}
          loading={loading}
        />
      )}
    </>
  );
}

// =================== TABLE RESULT COMPONENT =====================
export const DDR_TableResult = ({ hubData, DDR_FileName }) => {
  if (!hubData || hubData.length === 0) {
    return (
      <p className="text-center text-gray-500 dark:text-gray-300 mt-6">
        No records found for the selected filters.
      </p>
    );
  }

  const totals = hubData.reduce(
    (acc, item) => {
      acc.freight_total += item.lorryReceiptAmount || 0;
      acc.rebate_total += item.rebate || 0;
      acc.after_rebate_total += item.afterRebate || 0;
      acc.others_total += item.others || 0;
      acc.total += item.cashReceiptAmount || 0;
      return acc;
    },
    {
      freight_total: 0,
      rebate_total: 0,
      after_rebate_total: 0,
      others_total: 0,
      total: 0,
    }
  );

  const Th_Td =
    "border border-gray-300 dark:border-gray-700 px-2 py-2 text-center text-xs sm:text-sm md:text-base text-black dark:text-white bg-white dark:bg-gray-800 whitespace-nowrap";

  return (
    <>
      {/* Container with scroll support for small screens */}
      <div className="w-full overflow-x-auto">
        <div className="min-w-full flex flex-col items-center mb-6">
          <table className="border-collapse w-full max-w-6xl mx-auto text-center shadow-md rounded-lg overflow-hidden">
            <thead className="bg-gray-100 dark:bg-gray-700 sticky top-0 z-10">
              <tr>
                {[
                  "S.NO",
                  "CR NO",
                  "LR No",
                  "LR Date",
                  "PKS",
                  "Weight",
                  "Freight",
                  "Rebate",
                  "After Rebate",
                  "Others",
                  "Total",
                ].map((title) => (
                  <th key={title} className={Th_Td}>
                    {title}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {hubData.map((item, index) => (
                <tr
                  key={index}
                  className={`${
                    index % 2 === 0
                      ? "bg-white dark:bg-gray-800"
                      : "bg-gray-50 dark:bg-gray-900"
                  } hover:bg-gray-100 dark:hover:bg-gray-700 transition`}
                >
                  <td className={Th_Td}>{index + 1}</td>
                  <td className={Th_Td}>{item.cashReceiptNo}</td>
                  <td className={Th_Td}>{item.lorryReceiptNo}</td>
                  <td className={Th_Td}>{item.lorryReceiptDate}</td>
                  <td className={Th_Td}>{item.pks}</td>
                  <td className={Th_Td}>{item.weight}</td>
                  <td className={Th_Td}>{item.lorryReceiptAmount}</td>
                  <td className={Th_Td}>{item.rebate}</td>
                  <td className={Th_Td}>{item.afterRebate}</td>
                  <td className={Th_Td}>{item.others}</td>
                  <td className={Th_Td}>{item.cashReceiptAmount}</td>
                </tr>
              ))}
              <tr className="bg-gray-200 dark:bg-gray-700 font-semibold">
                <td colSpan="6" className={Th_Td}>
                  Total
                </td>
                <td className={Th_Td}>{totals.freight_total}</td>
                <td className={Th_Td}>{totals.rebate_total}</td>
                <td className={Th_Td}>{totals.after_rebate_total}</td>
                <td className={Th_Td}>{totals.others_total}</td>
                <td className={Th_Td}>{totals.total}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Download PDF */}
      <div className="w-[150px] mx-auto mb-3">
        <DownloadPDF
          hubData={hubData}
          totals={totals}
          fileName={DDR_FileName}
        />
      </div>
    </>
  );
};


// =================== DOWNLOAD PDF COMPONENT ===================

export const DownloadPDF = ({ hubData, totals, fileName }) => {
  const handleDownloadPDF = () => {
    const doc = new jsPDF();

    // === Helper functions ===
    const toRoman = (num) => {
      const romanMap = [
        [1000, "M"], [900, "CM"], [500, "D"], [400, "CD"],
        [100, "C"], [90, "XC"], [50, "L"], [40, "XL"],
        [10, "X"], [9, "IX"], [5, "V"], [4, "IV"], [1, "I"]
      ];
      let roman = "";
      for (let [value, symbol] of romanMap) {
        while (num >= value) {
          roman += symbol;
          num -= value;
        }
      }
      return roman;
    };

    const formatDate = (dateString) => {
      const date = new Date(dateString);
      if (isNaN(date)) return "";
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = date.getFullYear();
      return `${day}.${month}.${year}`;
    };

    const getYear = (dateString) => new Date(dateString).getFullYear().toString();

    const getMonthName = (dateString) => {
      const months = [
        "JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE",
        "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"
      ];
      const month = new Date(dateString).getMonth();
      return months[month] || "";
    };

    // === Setup data ===
    const headers = [
      "S.NO", "CR NO", "LR No", "LR Date", "pks", "Weight",
      "Freight", "Rebate", "After Rebate", "Others", "Total"
    ];

    const rows = hubData.map((item, index) => [
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
    ]);

    rows.push([
      "Total", "", "", "", "", "",
      totals.freight_total || 0,
      totals.rebate_total || 0,
      totals.after_rebate_total || 0,
      totals.others_total || 0,
      totals.total || 0,
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

    // === Mock from/to values from filename or external scope ===
    const [from_address, from_date, to_date] = fileName.split("_");
    const formattedFromAddress = (from_address || "").toUpperCase();
    const formattedFromDate = formatDate(from_date);
    const formattedToDate = formatDate(to_date);

    const formattedYear = getYear(from_date);
    const formattedMonth = getMonthName(from_date);

    // === Generate pages ===
    rowChunks.forEach((chunk, pageIndex) => {
      if (pageIndex !== 0) doc.addPage();

      const romanPage = toRoman(pageIndex + 1);

      // --- HEADER ---
      doc.setFontSize(11);
      // doc.text("Sachdeva Roadlines P Ltd.,", 14, 8);

      doc.text(`Sachdeva Roadlines P Ltd., ${formattedFromAddress} DDR-${romanPage} ${formattedFromDate} to ${formattedToDate}
        `, 14, 15);

      // from_address + DDR + page number in Roman
      // doc.text(`${formattedFromAddress} DDR-${romanPage}`, 14, 15);

      // date range  DD.MM.YYYY-DD.MM.YYYY
      // doc.text(`${formattedFromDate} to ${formattedToDate}`, 14, 22);

      // top-right section: FROM_ADDRESS YEAR MONTH
      doc.setFontSize(11);
      doc.text(
        `${formattedFromAddress} ${formattedYear} ${formattedMonth}`,
        150, 15
      );

      // --- TABLE ---
      autoTable(doc, {
        head: [headers],
        body: chunk,
        startY: 18,
        margin: { top: 10},
        styles: { fontSize: 8 },
      });

      // Footer Page No.
      doc.setFontSize(8);
      doc.text(`Page ${pageIndex + 1} of ${totalPages}`, 180, 290);
    });

    doc.save(`${fileName || "DDR_Report"}.pdf`);
  };

  return (
    <button
      onClick={handleDownloadPDF}
       className='w-[200px] my-2 mx-auto px-6 py-3 bg-gradient-to-r from-cyan-600 to-cyan-400 text-white font-semibold rounded-lg shadow-md hover:scale-105 transform transition duration-300 cursor-pointer'
     >
      Download PDF
    </button>
  );
}; 

