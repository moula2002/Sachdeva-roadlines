import { useState } from 'react';
import { RecordResultCard } from './RecordResultCard';
import { TableBodyGrandTotalRow, TableBodyRow, TableHeadRow } from './RecordResultTable';

export default function RecordPageBasedResultTable({
    totalPages,
    currentPage,
    setCurrentPage,
    loading,
    tableData,
}) {
   
    // Change page
    const paginate = (pageNumber) => {setCurrentPage(pageNumber); setSelectedRow(null)}

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

    const [selectedRow, setSelectedRow] = useState(null);
    
    const handleTableRowClick = (row) => {
    setSelectedRow((prev) =>
      prev?.lorryReceiptNo === row.lorryReceiptNo ? null : row
    );
  };

    // Styles
    const Th = 'px-6 py-3 lg:px-5 text-nowrap'; 
    const Td = 'px-6 py-3 lg:px-5 text-nowrap font-medium text-gray-900 whitespace-nowrap dark:text-white';

  return (
    
    <div >
        
        <div className='mx-auto flex flex-col items-center'>

            <div className='relative w-[90%] overflow-x-auto shadow-md sm:rounded-lg'>

                <table className='text-xs md:text-[13px] text-gray-700 bg-gray-100 dark:bg-gray-700 dark:text-gray-400'>
                    <thead >
                        <TableHeadRow />
                    </thead>
                    {/* <TableBodyRow records={tableData} handleTableRowClick={handleTableRowClick}/> */}
                    {!loading && (
                        <tbody className='dark:text-white'>
                            <TableBodyRow records={tableData} handleTableRowClick={handleTableRowClick}/>
                            <TableBodyGrandTotalRow records={tableData} tableType={'paid'}/>
                        </tbody>
                    )}
                </table>
            </div>

            
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
            
        </div>

        {selectedRow && (<RecordResultCard data={selectedRow} />)}
    </div>
   
  )
}
