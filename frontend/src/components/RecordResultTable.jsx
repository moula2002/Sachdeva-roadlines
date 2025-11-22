import React, { useContext, useState } from 'react'
import { FindContext } from '../context/FindContext';
import { changeDateFormat, changeDateTimeFormat ,changeDateTimePeriodFormat } from '../util/dateFormat';
import { paymentStatusResponse } from '../util/paymentResponse';
import { RecordResultCard } from './RecordResultCard';


export default function RecordResultTable() {

    const {multiResult, handleTableRowClick } = useContext(FindContext); 
    
    // style 
    const Th = 'px-6 py-3 lg:px-5 text-nowrap'; 
    const Td = 'px-6 py-3 lg:px-5 text-nowrap font-medium text-gray-900 whitespace-nowrap dark:text-white';

    return (
        
        <div className='mx-auto flex flex-col items-center'>
            
            <div className='relative w-[90%] overflow-x-auto shadow-md sm:rounded-lg'>
                <table className='text-xs md:text-[13px] text-gray-700 uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-400'>
                    <thead >
                        <TableHeadRow />
                    </thead>
                    {multiResult && (
                        <tbody className='dark:text-white'>
                            {multiResult.map((item, index) => (
                                <tr 
                                key={index} 
                                className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700 border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600"
                                onDoubleClick={() => {
                                    handleTableRowClick(item); 
                                    console.log("passing row is :" , item);
                                }}>
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
                        </tbody>
                    )}
                </table>
            </div> 
        </div>
    )
}  

export const ResultTable = ({records, tableType = "" }) => {

    const [selectedRow, setSelectedRow ] = useState(null);

    const handleTableRowClick = (row) => {
        setSelectedRow((prev) => prev?.lorryReceiptNo == row.lorryReceiptNo ? null : row ); 
    }
    
    return (
        <div>
            <div className='mx-auto flex flex-col items-center'>
                
                <div className='relative w-[90%] overflow-x-auto shadow-md sm:rounded-lg'>
                    <table className='text-xs md:text-[13px] text-gray-700 uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-400'>
                        <thead >
                            <TableHeadRow />
                        </thead>
                        <tbody  className='dark:text-white'>
                            {records && records.length > 0 && (
                                <>
                                    <TableBodyRow records={records} handleTableRowClick={handleTableRowClick}/>
                                    {[ "pending", "initiated", "paid" ].includes(tableType) && (<TableBodyGrandTotalRow records={records} tableType={tableType}/>)}
                                </>
                            )}

                            {!records.length > 0 && (
                                <TableBodyNoRow />
                            )}
                        </tbody>
                    </table>
                </div> 
            </div>
            {selectedRow && (<RecordResultCard data={selectedRow} />)} 
        </div>
    )
} 

export const TableHeadRow = () => {

    const Th = 'px-6 py-3 lg:px-5 text-nowrap'; 
  return (
    <tr className='bg-pink-200 dark:bg-gray-700 uppercase'>
        {["Id", "LR No", "Inward No", "LR Date", "Party Name", "CR Date", "CR NO", "pks", "Weight", "LR Amount", "Rebate", "After Rebate", "Others", "CR Amount", "From", "Branch", "Paid Amount", "Payment Date", "Payment Type", "Balance Amount", "Payment States", "Created At", "Updated At"]
        .map((col) => (
            <th key={col} className={Th}>{col}</th>
        ))}
    </tr>

  )
}


// Table Body Row
export const TableBodyRow = ({ records, handleTableRowClick }) => {
    // style
    const Td = 'px-6 py-3 lg:px-5 text-nowrap font-medium text-gray-900 whitespace-nowrap dark:text-white';

    return (
        <>
            {records.map((item, index) => (
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

                    <td className={Td}>{changeDateFormat(item.paymentDate)}</td>
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
        </>
    )
}

export const TableBodyNoRow = () => {
    return (
        <tr>
            <td colSpan={6} className="text-center p-4 text-gray-500 dark:text-white">
            No paid records found.
            </td>
        </tr>
    )
}

export const CalculateGrandTotal = (result = []) => { 

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

export const TableBodyGrandTotalRow = ({records, tableType=""}) => {

    const totals = CalculateGrandTotal(records);

    //style 
    const Gt = 'px-6 py-3 lg:px-5 text-nowrap font-bold whitespace-nowrap uppercase ';
    const GtN = 'px-6 py-3 lg:px-5 text-nowrap text-gray-900 dark:text-white'

    return (
        <>
            {/* Grand totals showing row */}
            <tr className='bg-pink-100 dark:bg-gray-700'>
                <td className={`${GtN} font-bold`}>Grand Total</td>
                <td className={Gt}></td>
                <td className={Gt}></td>
                <td className={Gt}></td>
                <td className={Gt}></td>
                <td className={Gt}></td>
                <td className={Gt}></td>
                <td className={`${Gt} text-cyan-700 `}>{totals.pks}</td>
                <td className={`${Gt} text-cyan-700`}>{totals.weight}</td>
                <td className={`${Gt} text-pink-600`}>₹ {totals.lorryReceiptAmount.toLocaleString()}</td>
                <td className={GtN}>₹ {totals.rebate.toLocaleString()}</td>
                <td className={GtN}>₹ {totals.afterRebate.toLocaleString()}</td>
                <td className={GtN}>₹ {totals.others.toLocaleString()}</td>
                <td className={`${Gt} text-orange-500 `}>₹ {totals.cashReceiptAmount.toLocaleString()}</td>
                <td className={Gt}></td>
                <td className={Gt}></td>
                <td className={`${Gt} text-green-600`}>₹ {totals.paidAmount.toLocaleString()}</td>
                <td className={Gt}></td>
                <td className={Gt}></td>
                <td className={`${Gt} text-red-500`}>₹ {totals.balanceAmount.toLocaleString()}</td>
                <td className={Gt}></td>
                <td className={Gt}></td> 
                <td className={Gt}></td>
            </tr>
            {/* Grand Total Bending amount */}
            {tableType == "pending" && (
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
            )}
        </>
    )
}
