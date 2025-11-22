import axios from 'axios';
import { useContext, useEffect, useState } from 'react' 
import { AppContext } from '../../context/AppContext';
import { GetAllHubsDetailsByPageBased } from '../../services/HomeService';
import { HubContext } from '../../context/HubContext';
import { changeDateFormat, changeDateTimePeriodFormat } from '../../util/dateFormat';
import { paymentStatusResponse } from '../../util/paymentResponse';
import { toast } from 'react-toastify';
import { TableHeadRow } from '../RecordResultTable';



export default function AllDataTable() { 

    // HubData Storage
    const [hubData, setHubData ] = useState([]);

    // Total Pages 
    const [totalPages, setTotalPages] = useState(0);
    // Total Recourdes count 
    const [totalRecordsCount, setTotalRecordsCount] = useState(0);
    // Set the Current Page
    const [currentPage, setCurrentPage] = useState(1);
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
    

    //Get Page Based Data to Backend
    const getAllHubDatas = async (curent_page_no) => {
        setLoading(true);
        try {
            const response = await GetAllHubsDetailsByPageBased(curent_page_no);
            const data = response.data;

            if(response.status === 200) {
                setTotalPages(data.totalPages || 0);
                setTotalRecordsCount(data.totalElements || 0);
                setHubData(data.content || []);
            } 
        } catch (error) {
            console.error("Error in getAllHubDatas:", error);
            
            if (error.response?.status === 401) {
                // toast.error(" Please log in .");
                console.log("login in Please");
                // localStorage.removeItem("token");
                // window.location.href = "/login";
            } else if (error.code === "ECONNABORTED") {
                toast.warn("Request timed out. Please try again.");
            } else {
               toast.info("Server not responding. Please try again later.");
            }
        } finally {
            setLoading(false); 
        }
    }

    // initial calling and If the Current Page will change, then only this useEffect call
    useEffect(() => {
        setHubData([]); 
        getAllHubDatas(currentPage);
    },[currentPage])


    // show the data card format 
    const {selectedRow, handleTableRowClick} = useContext(HubContext);

    // Styles
    const Th = 'px-6 py-3 lg:px-5 text-nowrap'; 
    const Td = 'px-6 py-3 lg:px-5 text-nowrap font-medium text-gray-900 whitespace-nowrap dark:text-white';

  return (
    <>
        <div >
           
            <div className='mx-auto flex flex-col items-center'>

                {/* title  */}
                 <div className='mt-10 w-[90%] flex flex-col gap-2 sm:flex-row justify-between'>
                    {hubData.length > 0 && (<>
                        <h1 className='text-center text-2xl font-bold text-[darkcyan]'>Transport Records</h1>
                        <p 
                        className= 'text-center my-1 text-sm text-gray-600 dark:text-white '>
                            Total Records : 
                            <span className='font-bold text-[darkblue] dark:text-pink-500 px-2'>
                                {totalRecordsCount}
                            </span>
                        </p>
                    </>)}
                    {loading && <p>Loading...</p>}
                </div>

                {/* table result  */}
                <div className='relative w-[90%] overflow-x-auto shadow-md sm:rounded-lg'>
                    {!loading && hubData.length > 0 && (
                        <table className='text-xs md:text-[13px] text-gray-700 uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-400'>
                            <thead >
                                <tr className=''>
                                    {["Id", "LR No", "Inward No", "LR Date", "Party Name", "CR Date", "CR NO", "pks", "Weight", "LR Amount", "Rebate", "After Rebate", "Others", "CR Amount", "From", "Branch", "Paid Amount", "Payment Date", "Payment Type", "Balance Amount", "Payment States", "Created At", "Updated At"]
                                    .map((col) => (
                                        <th key={col} className={Th}>{col}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className='dark:text-white'>
                                {hubData.map((item, index) => (
                                    <tr 
                                    key={index} 
                                    className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700 border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600"
                                    onDoubleClick={() => handleTableRowClick(item)}>
                                        <td className={Td}>{index+1}</td>
                                        <td className={Td}>{item.lorryReceiptNo}</td>
                                        <td className={Td}>{item.inwardNo}</td>
                                        <td className={Td}>{changeDateFormat(item.lorryReceiptDate)}</td>
                                        <td className={Td}>{item.partyName}</td>
                                        <td className={Td}>{changeDateFormat(item.cashReceiptDate)}</td>
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
                                            <span 
                                            className={`${paymentStatusResponse(item.paymentStatus)} text-white px-2 py-1 rounded`}>
                                                {item.paymentStatus}
                                            </span>
                                        </td>
                                        <td className={Td}>{changeDateTimePeriodFormat(item.createdAt)}</td>
                                        <td className={Td}>{changeDateTimePeriodFormat(item.updatedAt)}</td>
                                    </tr>

                                ))}
                            </tbody>
                        </table>
                    )}
                </div>

                {!loading && hubData.length > 0 && (
                    <div className='my-3'>
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
    </>
  )
}