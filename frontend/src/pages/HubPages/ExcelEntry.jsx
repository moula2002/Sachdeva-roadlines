import React, { useState } from "react";
import * as XLSX from "xlsx";
import dayjs from "dayjs";
import { toast } from "react-toastify";
import { AddExcelFileHubDatas } from "../../services/HubServices"; 
// ─────────────────────────────
//  MAIN COMPONENT
// ─────────────────────────────
export default function ExcelEntry() {
  const [excelData, setExcelData] = useState([]);
  const [errors, setErrors] = useState([]);
  const [insertedExcelResultList, setInsertedExcelResultList] = useState([]);
  const [skippedExcelResultList, setSkippedExcelResultList] = useState([]);
  const [insertedExcelResultCount, setInsertedExcelResultCount] = useState(0);
  const [skippedExcelResultCount, setSkippedExcelResultCount] = useState(0);
  const [isXlResult, setIsXlResult] = useState(false);

  // ─────────────────────────────
  // Handle file selection & parsing
  // ─────────────────────────────
  const handleFileUpload = (e) => {
    setIsXlResult(false);
    const file = e.target.files[0];
    if (!file) return;

    setErrors([]); // ✅ Clear only when file is selected

    const reader = new FileReader();
    reader.onload = (event) => {
      const binaryStr = event.target.result;
      const workbook = XLSX.read(binaryStr, { type: "binary" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const data = XLSX.utils.sheet_to_json(worksheet, { defval: "" });

      const validationErrors = validateExcel(data);
      if (validationErrors.length > 0) {
        setErrors(validationErrors);
        setExcelData([]);
      } else {
        setErrors([]);
        setExcelData(data);
      }
    };
    reader.readAsBinaryString(file);
  };

  // ─────────────────────────────
  // Multi-format Date Parser
  // ─────────────────────────────
  const parseJoinDate = (rawDate, rowNum) => {
    if (rawDate === null || rawDate === undefined || rawDate === "") return null;

    // Excel numeric date (e.g., 45929)
    if (!isNaN(rawDate)) {
      try {
        const jsDate = XLSX.SSF.parse_date_code(Number(rawDate));
        if (jsDate && jsDate.y && jsDate.m && jsDate.d) {
          const date = new Date(jsDate.y, jsDate.m - 1, jsDate.d);
          return date.toISOString().split("T")[0];
        }
      } catch {
        throw new Error(`Row ${rowNum}: Invalid Excel numeric date "${rawDate}"`);
      }
    }

    // ISO or valid JS date string
    const isoCheck = new Date(rawDate);
    if (!isNaN(isoCheck.getTime())) {
      return isoCheck.toISOString().split("T")[0];
    }

    // Manual DD-MM-YYYY / DD/MM/YYYY / DD.MM.YY
    const str = String(rawDate).trim();
    const delimiters = [".", "-", "/"];
    for (let d of delimiters) {
      if (str.includes(d)) {
        const parts = str.split(d).map((p) => p.trim());
        if (parts.length === 3) {
          let [day, month, year] = parts;
          day = parseInt(day, 10);
          month = parseInt(month, 10) - 1;
          year = parseInt(year, 10);
          if (year < 100) year += year < 50 ? 2000 : 1900;
          const date = new Date(year, month, day);
          if (!isNaN(date.getTime())) return date.toISOString().split("T")[0];
        }
      }
    }

    throw new Error(
      `Row ${rowNum}: Invalid date format "${rawDate}". Expected Excel date or DD-MM-YYYY / YYYY-MM-DD.`
    );
  };

  // ─────────────────────────────
  // Excel Validation Logic
  // ─────────────────────────────
  const validateExcel = (data) => {
    const errors = [];
    if (data.length === 0) {
      errors.push("Excel file is empty.");
      return errors;
    }

    const headers = Object.keys(data[0]).map((h) => h.trim().toUpperCase());
    const requiredHeaders = [
      "INWARD",
      "GC_NO",
      "GC_DATE",
      "FROM_ADDRESS",
      "PACKAGE",
      "WEIGHT",
      "LR_AMOUNT",
      "PARTY_NAME",
    ];

    if (!requiredHeaders.every((h) => headers.includes(h))) {
      errors.push(
        "Excel must have columns: INWARD | GC_NO | GC_DATE | FROM_ADDRESS | PACKAGE | WEIGHT | LR_AMOUNT | PARTY_NAME"
      );
      return errors;
    }

    const inwardNoRegex = /^[0-9]{3,7}[A-Za-z]?$/;
    const LRAndCrNoRegex = /^[1-9][0-9]{3,9}$/;

    data.forEach((row, i) => {
      const rowNum = i + 2;

      const inwardValue = String(row.INWARD || "").trim();
      if (!inwardValue) {
        errors.push(`Row ${rowNum}: INWARD cannot be empty`);
      } else if (!inwardNoRegex.test(inwardValue)) {
        errors.push(
          `Row ${rowNum}: INWARD must be 3 to 8 characters: 3–7 digits followed by optional letter`
        );
      }

      if (!row.GC_NO) {
        errors.push(`Row ${rowNum}: GC_NO number is required`);
      } else if (isNaN(row.GC_NO)) {
        errors.push(`Row ${rowNum}: GC_NO must be a number`);
      } else if (!LRAndCrNoRegex.test(row.GC_NO)) {
        errors.push(`Row ${rowNum}: GC_NO number must be 4–9 digits, cannot start with 0`);
      }

      if (!row.GC_DATE) {
        errors.push(`Row ${rowNum}: GC_DATE is required`);
      } else {
        try {
          row.GC_DATE = parseJoinDate(row.GC_DATE, rowNum);
        } catch (err) {
          errors.push(err.message);
        }
      }

      if (!row.FROM_ADDRESS?.trim()) errors.push(`Row ${rowNum}: FROM_ADDRESS is required`);

      if (row.PACKAGE === "" || row.PACKAGE == null) {
        errors.push(`Row ${rowNum}: PACKAGE count is required`);
      } else if (isNaN(row.PACKAGE) || row.PACKAGE < 0) {
        errors.push(`Row ${rowNum}: PACKAGE must be a positive number`);
      }

      if (row.WEIGHT === "" || row.WEIGHT == null) {
        errors.push(`Row ${rowNum}: WEIGHT is required`);
      } else if (isNaN(row.WEIGHT) || row.WEIGHT < 0) {
        errors.push(`Row ${rowNum}: WEIGHT must be a positive number`);
      }

      if (row.LR_AMOUNT === "" || row.LR_AMOUNT == null) {
        errors.push(`Row ${rowNum}: LR_AMOUNT is required`);
      } else if (isNaN(row.LR_AMOUNT) || row.LR_AMOUNT < 0) {
        errors.push(`Row ${rowNum}: LR_AMOUNT must be a positive number`);
      }

      if (!row.PARTY_NAME?.trim()) errors.push(`Row ${rowNum}: PARTY_NAME is required`);
    });

    return errors;
  };

  // ─────────────────────────────
  // Map Excel to DTO for backend
  // ─────────────────────────────
  const mapToDto = (row) => ({
    inwardNo: row.INWARD,
    lorryReceiptNo: row.GC_NO,
    lorryReceiptDate: row.GC_DATE,
    fromAddress: row.FROM_ADDRESS,
    pks: row.PACKAGE,
    weight: row.WEIGHT,
    lorryReceiptAmount: row.LR_AMOUNT,
    partyName: row.PARTY_NAME,
  });

  // ─────────────────────────────
  // Submit Excel Data to Backend
  // ─────────────────────────────
  const handleSubmit = async () => {
    if (errors.length > 0) {
      toast.error("Fix validation errors before submitting!");
      return;
    }

    const dtoData = excelData.map(mapToDto);

    try {
      const response = await AddExcelFileHubDatas(dtoData);
      const { data, status } = response;

      if (status === 200) {
        setInsertedExcelResultCount(data.insertedCount);
        setInsertedExcelResultList(data.insertedXlDatas);
        setSkippedExcelResultCount(data.skippedCount);
        setSkippedExcelResultList(data.skippedXlDatas);
        setIsXlResult(true);
        toast.success("Excel data uploaded successfully!");
      }
    } catch (err) {
      console.error("Upload error:", err);
      toast.error("Error uploading Excel data!");
    }
  };

  // ─────────────────────────────
  // JSX Rendering
  // ─────────────────────────────
  return (
    <div className="pt-1">
      <div className="h-20 w-full" />
      <h2 className="text-3xl font-bold text-center text-cyan-700 dark:text-cyan-400 mb-6">
        Upload Excel File
      </h2>

      {/* File Input */}
      <div className="relative group cursor-pointer max-w-xl mx-auto">
        <div className="absolute -inset-1 bg-gradient-to-r from-red-600 to-violet-600 rounded-lg dark:blur-10px opacity-25 group-hover:opacity-50 dark:group-hover:opacity-100 transition duration-1000 pointer-events-none" />
        <div className="relative flex justify-center items-center bg-white dark:bg-gray-800 ring-1 ring-gray-900/5 rounded-lg leading-none p-3">
          <input
            type="file"
            accept=".xlsx, .xls"
            onChange={handleFileUpload}
            className="block w-full text-sm text-gray-700 dark:text-gray-200 file:mr-3 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-cyan-600 file:text-white hover:file:bg-cyan-700 cursor-pointer"
          />
        </div>
      </div>

      {/* Validation Errors */}
      {errors.length > 0 && (
        <div style={{ color: "red", marginTop: "10px" }}>
          <h4>Validation Errors:</h4>
          <ul>
            {errors.map((err, idx) => (
              <li key={idx}>{err}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Preview Table */}
      {errors.length === 0 && excelData.length > 0 && (
        <ExcelVerificationTable excelData={excelData} handleSubmit={handleSubmit} />
      )}

      {/* Upload Result Tables */}
      {isXlResult && (
        <div className="flex flex-col gap-8 mt-6">
          <div>
            <h1 className="text-xl font-bold text-center text-cyan-700 dark:text-cyan-400 my-3">
              Inserted Excel Record Count:&nbsp;
              <span className="text-[darkmagenta] dark:text-white font-bold">
                {insertedExcelResultCount}
              </span>
            </h1>
            {insertedExcelResultCount > 0 && (
              <ExcelResultTable excelResult={insertedExcelResultList} bgcolor="bg-green-400" />
            )}
          </div>

          <div>
            <h1 className="text-xl font-bold text-center text-cyan-700 dark:text-cyan-400 my-3">
              Skipped Excel Record Count:&nbsp;
              <span className="text-[darkmagenta] dark:text-white font-bold">
                {skippedExcelResultCount}
              </span>
            </h1>
            {skippedExcelResultCount > 0 && (
              <ExcelResultTable excelResult={skippedExcelResultList} bgcolor="bg-red-400" />
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────
//  PREVIEW TABLE
// ─────────────────────────────
export const ExcelVerificationTable = ({ excelData, handleSubmit }) => {
  const Th =
    "px-6 py-3 lg:px-5 text-nowrap bg-pink-200 dark:bg-gray-700 sticky top-0 z-10";
  const Td =
    "px-6 py-3 lg:px-5 text-nowrap font-medium text-gray-900 whitespace-nowrap dark:text-white";
  const table_style =
    "text-xs md:text-[13px] text-gray-700 uppercase dark:bg-gray-700 dark:text-gray-400";

  return (
    <div className="mx-auto flex flex-col items-center mt-3">
      <h2 className="text-2xl font-bold text-center text-cyan-700 dark:text-cyan-400 mb-6">
        Preview Excel Data
      </h2>
      <div className="relative w-[75%] overflow-x-auto overflow-y-auto max-h-[500px] shadow-md sm:rounded-lg">
        <table className={table_style}>
          <thead>
            <tr>
              {Object.keys(excelData[0]).map((key) => (
                <th key={key} className={Th}>
                  {key}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="dark:text-white">
            {excelData.map((row, i) => (
              <tr
                key={i}
                className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
              >
                {Object.values(row).map((val, j) => (
                  <td key={j} className={Td}>
                    {val}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="my-6 text-center">
        <button
          onClick={handleSubmit}
          className="w-[190px] px-6 py-3 bg-gradient-to-l from-pink-600 to-cyan-400 text-white font-semibold rounded-lg shadow-md hover:scale-105 transition duration-300"
        >
          Submit XL File
        </button>
      </div>
    </div>
  );
};

// ─────────────────────────────
//  RESULT TABLE
// ─────────────────────────────
export const ExcelResultTable = ({ excelResult, bgcolor }) => {
  const Th = "px-6 py-3 lg:px-5 text-nowrap";
  const Td =
    "px-6 py-3 lg:px-5 text-nowrap font-medium text-gray-900 whitespace-nowrap dark:text-white";

  const changeDateFormat = (apiDate) => dayjs(apiDate).format("DD-MM-YYYY");

  return (
    <>
      {excelResult.length > 0 && (
        <div className="mx-auto flex flex-col items-center">
          <div className="relative w-[90%] overflow-x-auto shadow-md sm:rounded-lg">
            <table
              className={`text-xs md:text-[13px] text-gray-700 uppercase ${bgcolor} dark:bg-gray-700 dark:text-gray-400`}
            >
              <thead>
                <tr>
                  <th className={Th}>Id</th>
                  <th className={Th}>Inward No</th>
                  <th className={Th}>GC No</th>
                  <th className={Th}>GC Date</th>
                  <th className={Th}>From Address</th>
                  <th className={Th}>Package</th>
                  <th className={Th}>Weight</th>
                  <th className={Th}>LR Amount</th>
                  <th className={Th}>Party Name</th>
                </tr>
              </thead>
              <tbody className="dark:text-white">
                {excelResult.map((item, index) => (
                  <tr
                    key={index}
                    className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                  >
                    <td className={Td}>{index + 1}</td>
                    <td className={Td}>{item.inwardNo}</td>
                    <td className={Td}>{item.lorryReceiptNo}</td>
                    <td className={Td}>{changeDateFormat(item.lorryReceiptDate)}</td>
                    <td className={Td}>{item.fromAddress}</td>
                    <td className={Td}>{item.pks}</td>
                    <td className={Td}>{item.weight}</td>
                    <td className={Td}>{item.lorryReceiptAmount}</td>
                    <td className={Td}>{item.partyName}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
};


