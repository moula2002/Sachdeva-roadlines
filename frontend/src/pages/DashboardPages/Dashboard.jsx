import { useEffect, useState } from "react";
import { changeDateTimePeriodFormat  } from "../../util/dateFormat";
import { paymentStatusResponse } from '../../util/paymentResponse';
import useDebounce from "../../util/useDebounce";

import { 
  TotalRecordsStatusUsedToCount,
  PendingRecordsPageBasedAndUsingFiltes,
  RecentlyPaidRecordsDetails,
  GetPartyNameToTotalBalanceAmountList
} from "../../services/DashboardService";


export default function Dashboard() {
  return (
    <>
      <TotalRecordStatusCounts />

      {/* <SearchFilters /> */}
      <PartyWiseTotalBalanceAmountList />

      <div className="mt-10">
        <PendingRecordsTable />
      </div>

      {/* recently paid payments this will get today, yesterday and custom date */}
      <div>
        <RecentPaidTable />
      </div>
    </>
  );
}



import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { TableHeadRow } from "../../components/RecordResultTable";

export const TotalRecordStatusCounts = () => {
  const initiatedCounts = {
    totalPendingAmount: 0,
	  totalInitiatedAmount: 0,
    totalRecord: 0,
    pendingRecord: 0,
    initiatedRecord: 0,
    paidRecord: 0,
  };

  const [recordCounts, setRecordCounts] = useState(initiatedCounts);

  const getRecordStatusCounts = async () => {
    try {
      const response = await TotalRecordsStatusUsedToCount();
      console.log("coming total status count records : ", response);
      
      setRecordCounts(response.data);
    } catch (error) {
      console.error("Error in getRecordStatusCounts:", error);
    }
  };

  useEffect(() => {
    getRecordStatusCounts();
  }, []);

  // Chart data
  const chartData = [
    { name: "Initiated", value: recordCounts.initiatedRecord },
    { name: "Pending", value: recordCounts.pendingRecord },
    { name: "Paid", value: recordCounts.paidRecord },
  ];

  const COLORS = ["#3B82F6", "#EF4444", "#22C55E"]; // blue, red, green

  return (
    <div
      className="mx-3 my-4 rounded-xl bg-white dark:bg-zinc-800/50 p-4 md:p-6"
      style={{ boxShadow: "rgba(0, 0, 0, 0.16) 0px 1px 4px" }}>

      <h1 className="text-xl md:text-2xl text-[darkcyan] font-semibold text-center mb-6">
        Record Status Overview
      </h1>

      <div className="w-full flex flex-wrap items-center justify-between flex-row mb-3">
        {[
          {label :"Bending Amount", value : recordCounts.totalPendingAmount.toLocaleString() },
          {label :"Initiated Amount", value : recordCounts.totalInitiatedAmount.toLocaleString() }
        ].map((item, index) => (
          <div 
          className="shadow-md rounded px-3 py-2 bg-gray-50 dark:bg-gray-800 flex flex-col items-center hover:scale-105"
          key={index}>
            <span className="text-[darkblue] dark:text-pink-700 font-medium text-xs">{item.label}</span>
            <span className="text-[darkmagenta] dark:text-white font-bold " >₹ {item.value} </span>
          </div>
        ))}
      </div>

      {/* Layout wrapper */}
      <div className="w-full flex flex-col md:flex-row justify-between items-center gap-6">

        {/* Left: Record Cards */}
        <div className="w-full md:w-[40%] flex flex-col gap-4">
          {/* Common card style */}
          {[
            { label: "Total", value: recordCounts.totalRecord, color: "text-pink-500" },
            { label: "Initiated", value: recordCounts.initiatedRecord, color: "text-blue-500" },
            { label: "Pending", value: recordCounts.pendingRecord, color: "text-red-500" },
            { label: "Paid", value: recordCounts.paidRecord, color: "text-green-500" },
          ].map((item, index) => (
            <div
              key={index}
              className="flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-800 rounded-xl py-3 px-6 shadow-md transition-transform hover:scale-[1.02]"
            >
              <h1 className="text-lg font-medium text-cyan-700 dark:text-cyan-300">
                {item.label}
              </h1>
              <h1 className={`text-2xl font-bold ${item.color}`}>
                {item.value?.toLocaleString() ?? 0}
              </h1>
            </div>
          ))}
        </div>

        {/* Right: Donut Chart */}
        <div className="w-full md:w-[55%] h-80 flex items-center justify-center">
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={70}
                outerRadius={110}
                paddingAngle={5}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                animationBegin={200}
                animationDuration={800}
              >
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                    stroke="#fff"
                    strokeWidth={2}
                  />
                ))}
              </Pie>
              <Tooltip
                formatter={(value) => [`${value} Records`, ""]}
                contentStyle={{
                  backgroundColor: "#1f2987",
                  borderRadius: "8px",
                  color: "#fff",
                  border: "none",
                }}
              />
              <Legend verticalAlign="bottom" height={36} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>

  );
};



export const PendingRecordsTable = () => {
  // Table and pagination states
  const [records, setRecords] = useState([]);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0); 
  const [totalElements, setTotalElements] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  //  const [totalPages, setTotalPages] = useState(0);

  const [loading, setLoading] = useState(false);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Previous page
  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Next page
  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };


  // 🔹 Filter states
  const [filters, setFilters] = useState({
    lorryReceiptNo: "",
    inwardNo: "",
    lrDateFrom: "",
    lrDateTo: "",
    weight: "",
    pks: "",
    partyName: "",
  });

  /* while we search filter every KyeStrok the fetchRecord() method will call, 
  so we don't type continuesly, 
  use this to dely while we filter the inputs type  */
  const debouncedFilters = useDebounce(filters, 900);

  // Fetch data whenever filter, page, or pageSize change
  useEffect(() => {
    fetchRecords();
  }, [currentPage, pageSize, debouncedFilters]);

  // 🔹 Fetch API
  const fetchRecords = async () => {
    try {
      setLoading(true);

      const params = {
        pageNo: currentPage,
        pageSize,
        sortBy: "createdAt",
        sortDir: "DESC",
        ...filters,
      };

      // Remove empty params
      Object.keys(params).forEach(
        (key) => (params[key] === "" || params[key] == null) && delete params[key]
      );

      console.log("passing params : ", params);
      
      // const res = await axios.get(`${backendURL}/dashboard/pending-records-page`,{ params });
      const response = await PendingRecordsPageBasedAndUsingFiltes(params);
      const data = response.data;
      console.log("passsed result Data ", data);
      

      setRecords(data.content || []);
      setTotalPages(data.totalPages || 0);
      setTotalElements(data.totalElements) // total records count
    } catch (err) {
      console.error("Error fetching records:", err);
    } finally {
      setLoading(false);
    }
  };

  // Handle filter changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
    setCurrentPage(1); // reset to first page when filters change
  };

  // Clear filters
  const resetFilters = () => {
    setFilters({
      lorryReceiptNo: "",
      inwardNo: "",
      lrDateFrom: "",
      lrDateTo: "",
      weight: "",
      pks: "",
      partyName: "",
    });
    setCurrentPage(1);
    fetchRecords();
  };

  const Th = 'px-6 py-3 lg:px-5 text-nowrap'; 
  const Td = 'px-6 py-3 lg:px-5 text-nowrap font-medium text-gray-900 whitespace-nowrap dark:text-white';

  return (
    <div className="">
      <h2 className='text-center text-xl font-bold text-[darkcyan]'>Pending Records</h2>

      <div className='mx-auto flex flex-col items-center'>

        {!loading &&(
          <div 
          className="w-[96%] flex flex-col items-center gap-7 my-8 py-4 px-3 rounded-md dark:bg-gray-800" 
          style={{boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px"}}
          >
            {/* Advanced Filters */}
            <div className="w-full grid grid-cols-1 sm:grid-cols-3  lg:grid-cols-4 gap-5">
              <input
                type="number"
                name="lorryReceiptNo"
                value={filters.lorryReceiptNo}
                onChange={handleChange}
                placeholder="Lorry Receipt No"
                className="border-2 p-2 rounded border-blue-300 focus:ring-2 focus:ring-cyan-500 focus:outline-none dark:bg-gray-700"
              />
              <input
                type="text"
                name="inwardNo"
                value={filters.inwardNo}
                onChange={handleChange}
                placeholder="Inward No"
                className="border-2 p-2 rounded border-blue-300 focus:ring-2 focus:ring-cyan-500 focus:outline-none dark:bg-gray-700"
              />
              <input
                type="text"
                name="partyName"
                value={filters.partyName}
                onChange={handleChange}
                placeholder="Party Name"
                className="border-2 p-2 rounded border-blue-300 focus:ring-2 focus:ring-cyan-500 focus:outline-none dark:bg-gray-700"
              />

              <input
                type="date"
                name="lrDateFrom"
                value={filters.lrDateFrom}
                onChange={handleChange}
                className="border-2 p-2 rounded border-blue-300 focus:ring-2 focus:ring-cyan-500 focus:outline-none dark:bg-white"
              />
              <input
                type="date"
                name="lrDateTo"
                value={filters.lrDateTo}
                onChange={handleChange}
                className="border-2 p-2 rounded border-blue-300 focus:ring-2 focus:ring-cyan-500 focus:outline-none dark:bg-white"
              />
              <input
                type="number"
                name="weight"
                value={filters.weight}
                onChange={handleChange}
                placeholder="Weight"
                className="border-2 p-2 rounded border-blue-300 focus:ring-2 focus:ring-cyan-500 focus:outline-none dark:bg-gray-700"
              />
              <input
                type="number"
                name="pks"
                value={filters.pks}
                onChange={handleChange}
                placeholder="PKS"
                className="border-2 p-2 rounded border-blue-300 focus:ring-2 focus:ring-cyan-500 focus:outline-none dark:bg-gray-700"
              />
            </div>

            <div className="w-full flex flex-col sm:flex-row justify-between ">
              <button
                // onClick={fetchRecords}
                onClick={() => { setCurrentPage(1); fetchRecords(); }}
                className="bg-blue-600 text-white w-full my-1.5 sm:my-0 sm:w-47 px-1 lg:px-4 py-2 rounded hover:bg-blue-700 hover:cursor-pointer"
              >
                Search
              </button>
              <button
                onClick={resetFilters}
                className="bg-gray-300 text-black w-full my-1.5 sm:my-0 sm:w-47 sx px-1 lg:px-4 py-2 rounded hover:bg-gray-400 hover:cursor-pointer"
              >
                Reset
              </button>
            </div>
          </div>
        )}
      </div>
        
      <ComanResultTableWithTotal records={records} totalElements={totalElements} loading={loading}/>

      <div className='mx-auto flex flex-col items-center'>
        {/* Pagination */}
        {totalPages > 0 && (
          <div className='my-5'>
            <button className='text-lm px-3 py-1.5 rounded m-1 bg-blue-600 text-white hover:bg-blue-500 cursor-pointer' onClick={prevPage}>Previuse</button>
            {Array.from({length :Math.min(5, totalPages)},(_,i) => {
                let pageNumber;
                if (totalPages <= 5) {
                    pageNumber = i + 1;
                } else if (currentPage <= 3) {
                    pageNumber = i + 1;
                } else if (currentPage >= totalPages - 2) {
                    pageNumber = totalPages - 4 + i;
                } else {
                    pageNumber = currentPage - 2 + i;
                }

                return (
                    <button className={`${currentPage === pageNumber ? 'bg-blue-700 text-black hover:bg-blue-600'  :' bg-blue-600 text-white hover:bg-blue-400'} text-lm px-3 py-1.5 rounded m-1 cursor-pointer`}
                    key={pageNumber} onClick={() => paginate(pageNumber)}>{pageNumber}</button>
                )
            })}
            <button className='text-lm px-3 py-1.5 rounded m-1 bg-blue-600 text-white hover:bg-blue-500 cursor-pointer' onClick={nextPage}>Next</button>
          </div>
        )}
      </div>

    </div>
  );
}


// Recent paid components
export const RecentPaidTable = () => {
  const [records, setRecords] = useState([]);
  const [mode, setMode] = useState("today");
  const [selectedDate, setSelectedDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [totalElements, setTotalElements] = useState(0);


  const fetchPaidRecords = async () => {
    setLoading(true);

    try {
      const params = { mode };
      if (mode === "custom" && selectedDate) {
        params.date = selectedDate;
      }

      const response = await RecentlyPaidRecordsDetails(params);
      console.log("Coming Paid Detaisl Data is : ", response);
      
      setRecords(response.data || []);
      setTotalElements(response.data.length);
    } catch (error) {
      console.error("Error fetching recent paid records:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPaidRecords();
  }, [mode, selectedDate]);

  const Th = "px-6 py-3 lg:px-5 text-nowrap";
  const Td = "px-6 py-3 lg:px-5 text-nowrap font-medium text-gray-900 whitespace-nowrap dark:text-white";

  return (
    <div className="my-6">
      <h1 className="text-green-600 text-xl text-center font-bold my-3">Recently Paid Records</h1>

      {/* Filters */}
      <div className="flex flex-wrap justify-center gap-3 mb-4">
        <button
          className={`px-3 py-1 rounded ${
            mode === "today" ? "bg-green-600 text-white" : "bg-gray-300"
          }`}
          onClick={() => setMode("today")}
        >
          Today
        </button>
        <button
          className={`px-3 py-1 rounded ${
            mode === "yesterday" ? "bg-green-600 text-white" : "bg-gray-300"
          }`}
          onClick={() => setMode("yesterday")}
        >
          Yesterday
        </button>
        <div>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => {
              setMode("custom");
              setSelectedDate(e.target.value);
            }}
            className="border-2 p-2 rounded border-green-400 bg-gray-300 text-white dark:bg-slate-800 dark:text-white 
           focus:ring-2 focus:ring-green-400 "
          />
        </div>
      </div>

      {/* Table */}
      <ComanResultTableWithTotal records={records} totalElements={totalElements} loading={loading} resultType={"paid-details"}/>
    </div>
  );
};

const ComanResultTableWithTotal = ({records, totalElements, loading, resultType = ""}) => {

  // if(!records.length > 0) return;

  const totals = records.reduce((acc, item) => ({
      lorryReceiptAmount : acc.lorryReceiptAmount + (item.lorryReceiptAmount || 0),
      rebate : acc.rebate + (item.rebate || 0),
      afterRebate : acc.afterRebate + (item.afterRebate || 0),
      others : acc.others + (item.others || 0),
      cashReceiptAmount : acc.cashReceiptAmount + (item.cashReceiptAmount || 0),
      paidAmount : acc.paidAmount + (item.paidAmount || 0),
      balanceAmount : acc.balanceAmount + (item.balanceAmount || 0)
    }),{
      lorryReceiptAmount : 0,
      rebate : 0,
      afterRebate : 0,
      others : 0,
      cashReceiptAmount : 0,
      paidAmount : 0,
      balanceAmount : 0
    }
  )

  // style 
  const Th = 'px-6 py-3 lg:px-5 text-nowrap'; 
  const Td = 'px-6 py-3 lg:px-5 text-nowrap font-medium text-gray-900 whitespace-nowrap dark:text-white ';
  const Gt = 'px-6 py-3 lg:px-5 text-nowrap font-bold text-gray-900 whitespace-nowrap dark:text-white ';

  return (
    <div className='mx-auto flex flex-col items-center'>
      
      {/* Total records count */}
      <div className="my-2 text-xs ">
        {records.length > 0 && (
          <p className="text-indigo-900">
          Total Records : 
          <span className="text-[darkcyan] font-medium px-1">{totalElements}</span>
        </p> 
        )}
      </div>
      
      <div className='relative w-[96%] overflow-x-auto shadow-md sm:rounded-lg '>
        {/* Data Table */}
        {loading ? 
        (<p>Loading...</p>) 
        : 
        (
          <table className='text-xs md:text-[13px] text-gray-700 uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-400'>
            <thead >
              <TableHeadRow />
            </thead>
            {records && (
              <tbody className='dark:text-white'>
                
                {records.length > 0 ? 
                  (<>
                    {/* table data result */}
                    {records.map((item, index) => (
                      <tr 
                      key={index} 
                      className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700 border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600"
                      >
                        <td className={Td}>{index+1}</td>
                        <td className={Td}>{item.lorryReceiptNo}</td>
                        <td className={Td}>{item.inwardNo}</td>
                        <td className={Td}>{item.lorryReceiptDate}</td>
                        <td className={Td}>{item.partyName}</td>
                        <td className={Td}>{item.cashReceiptDate}</td>
                        <td className={Td}>{item.cashReceiptNo}</td>
                        <td className={Td}>{item.pks}</td>
                        <td className={Td}>{item.weight}</td>
                        <td className={Td}>{item.lorryReceiptAmount}</td>
                        <td className={Td}>{item.rebate}</td>
                        <td className={Td}>{item.afterRebate}</td>
                        <td className={Td}>{item.others}</td>
                        <td className={Td}>{item.cashReceiptAmount}</td>
                        <td className={Td}>{item.fromAddress}</td>
                        <td className={Td}>{item.branch}</td>
                        <td className={Td}>{item.paidAmount}</td>

                        <td className={Td}>{item.paymentDate}</td>
                        <td className={Td}>{item.paymentType}</td>
                        <td className={Td}>{item.balanceAmount}</td>
                        <td className={Td}>
                          <span className={`${paymentStatusResponse(item.paymentStatus)} text-white px-2 py-1 rounded`}>
                            {item.paymentStatus}
                          </span>
                        </td>
                        <td className={Td}>{changeDateTimePeriodFormat(item.createdAt)}</td>
                        <td className={Td}>{changeDateTimePeriodFormat(item.updatedAt)}</td>
                      </tr>
                    ))}

                    {/* Grand totals showing row */}
                    <tr className='bg-pink-100 dark:bg-gray-700'>
                      <td className={Gt}>Grand Total</td>
                      <td className={Gt}></td>
                      <td className={Gt}></td>
                      <td className={Gt}></td>
                      <td className={Gt}></td>
                      <td className={Gt}></td>
                      <td className={Gt}></td>
                      <td className={Gt}></td>
                      <td className={Gt}></td>
                      <td className={Gt}>{totals.lorryReceiptAmount.toLocaleString()}</td>
                      <td className={Gt}>{totals.rebate.toLocaleString()}</td>
                      <td className={Gt}>{totals.afterRebate.toLocaleString()}</td>
                      <td className={Gt}>{totals.others.toLocaleString()}</td>
                      <td className={Gt}>{totals.cashReceiptAmount.toLocaleString()}</td>
                      <td className={Gt}></td>
                      <td className={Gt}></td>
                      <td className={Gt}>{totals.paidAmount.toLocaleString()}</td>
                      <td className={Gt}></td>
                      <td className={Gt}></td>
                      <td className={Gt}>{totals.balanceAmount.toLocaleString()}</td>
                      <td className={Gt}></td>
                      <td className={Gt}></td>
                      <td className={Gt}></td>
                    </tr>
                    {resultType === "paid-details" ? 
                    (<>
                      {/* Grand Total Paid amount */}
                      <tr className='bg-white dark:bg-gray-900'>
                        <td className={Gt}>Paid Total</td>
                        <td className="px-6 py-3 lg:px-5 text-nowrap font-extrabold whitespace-nowrap text-blue-700 "> 
                          ₹ {(totals.paidAmount).toLocaleString() }
                        </td>
                        <td className={Gt}></td>
                        <td className={Gt}></td>
                        <td className={Gt}></td>
                        <td className={Gt}></td>
                        <td className={Gt}></td>
                        <td className={Gt}></td>
                        <td className={Gt}></td>
                        <td className={Gt}></td>
                        <td className={Gt}></td>
                        <td className={Gt}></td>
                        <td className={Gt}></td>
                        <td className={Gt}></td>
                        <td className={Gt}></td>
                        <td className={Gt}></td>
                        <td className={Gt}></td>
                        <td className={Gt}></td>
                        <td className={Gt}></td>
                        <td className={Gt}></td>
                        <td className={Gt}></td>
                        <td className={Gt}></td>
                        <td className={Gt}></td>
                      </tr>
                    </>) 
                    : 
                    (<>
                      {/* Grand Total Bending amount */}
                    <tr className='bg-white dark:bg-gray-900'>
                      <td className={Gt}>Bending Total</td>
                      <td className="px-6 py-3 lg:px-5 text-nowrap font-extrabold whitespace-nowrap text-blue-700 "> 
                        ₹ {(totals.cashReceiptAmount - totals.paidAmount).toLocaleString()}
                      </td>
                      <td className={Gt}></td>
                      <td className={Gt}></td>
                      <td className={Gt}></td>
                      <td className={Gt}></td>
                      <td className={Gt}></td>
                      <td className={Gt}></td>
                      <td className={Gt}></td>
                      <td className={Gt}></td>
                      <td className={Gt}></td>
                      <td className={Gt}></td>
                      <td className={Gt}></td>
                      <td className={Gt}></td>
                      <td className={Gt}></td>
                      <td className={Gt}></td>
                      <td className={Gt}></td>
                      <td className={Gt}></td>
                      <td className={Gt}></td>
                      <td className={Gt}></td>
                      <td className={Gt}></td>
                      <td className={Gt}></td>
                      <td className={Gt}></td>
                    </tr>
                    </>)
                    }
                  </>) 
                  : 
                  (
                    <tr>
                      <td colSpan={6} className="text-center p-4 text-gray-500 dark:text-white">
                        No paid records found.
                      </td>
                    </tr>
                  )
                }
              </tbody>
            )}
          </table>
        )}
      </div>        
    </div>
  )
}


export const PartyWiseTotalBalanceAmountList = () => {
  const [pendingTotalList, setPendingTotalList] = useState([]);

  const GetPartyNameWiseTotalBalance = async () => {
    try {
      const response = await GetPartyNameToTotalBalanceAmountList();

      console.log("Party Wise Balance Response:", response);

      if (response?.status === 200) {
        setPendingTotalList(response.data || []);
      }
    } catch (error) {
      console.error("Error fetching party balance records:", error);
    }
  };

  useEffect(() => {
    GetPartyNameWiseTotalBalance();
  }, []);

  // style
  const Th = 'px-6 py-3 lg:px-5 text-nowrap'; 
  const Td = 'px-6 py-3 lg:px-5 text-nowrap font-medium text-gray-900 whitespace-nowrap dark:text-white ';
  return (
    <div className='mx-auto flex flex-col items-center'>
      <div className='relative w-[90%] overflow-x-auto shadow-md sm:rounded-lg'>
        <h1 className="text-center text-indigo-950 dark:text-white text-xl font-bold">Party Balance Details</h1>

        {pendingTotalList.length > 0 ? (
          <table className='text-xs md:text-[13px] text-gray-700 uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-400'>
            <thead>
              <tr>
                <th className={Th}>Party Name</th>
                <th className={Th}>Total Balance Amount</th>
              </tr>
            </thead>
            <tbody className='dark:text-white'>
              {pendingTotalList
                .filter(item => item.totalBalanceAmount !== 0)
                .map((item, index) => (
                  <tr key={index} 
                    className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700 border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600">
                    <td className={Td} >{item.partyName}</td>
                    <td className={Td}>{item.totalBalanceAmount}</td>
                  </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No records found</p>
        )}
      </div>
    </div>
  );
};

