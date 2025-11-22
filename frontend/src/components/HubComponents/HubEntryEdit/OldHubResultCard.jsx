import React from 'react'
import { changeDateTimePeriodFormat } from '../../../util/dateFormat';
import { paymentStatusResponse } from '../../../util/paymentResponse';

const OldHubResultCard = ({ data }) => {

  if (!data) return null;

  console.log("the result OLD Data is :", data);
  

  const info = [
    { label: "Inward No", value: data.inwardNo },
    { label: "LR No", value: data.lorryReceiptNo },
    { label: "LR Date", value: data.lorryReceiptDate },
    { label: "From", value: data.fromAddress },
    { label: "Branch", value: data.branch },
    { label: "Party Name", value: data.partyName },
    { label: "Package", value: data.pks },
    { label: "Weight", value: data.weight },
    { label: "LR Amount", value: data.lorryReceiptAmount },
    { label: "Rebate", value: data.rebate },
    { label: "After Rebate", value: data.afterRebate },
    { label: "Others", value: data.others },
    { label: "CR No", value: data.cashReceiptNo },
    { label: "CR Date", value: data.cashReceiptDate },
    { label: "CR Amount", value: data.cashReceiptAmount },
    { label: "Payment Type", value: data.paymentType },
    { label: "Payment Date", value: data.paymentDate },
    { label: "Paid Amount", value: data.paidAmount },
    { label: "Balance Amount", value: data.balanceAmount },
    { label: "Record Created", value: changeDateTimePeriodFormat(data.createdAt) },
    { label: "Record Updated", value: changeDateTimePeriodFormat(data.updatedAt) },
  ];

  

  return (
    <div className="bg-white dark:bg-gray-800 shadow-lg rounded-2xl py-4 px-6 border border-gray-200 dark:border-gray-700
      lg:flex lg:flex-col  lg:gap-8 lg:mt-[6px]">
      <h2 className="text-lg lg:text-xl font-semibold mb-1 text-center text-cyan-700 dark:text-cyan-400">
        Lorry Receipt Details
      </h2>

      <div 
      className="flex justify-center items-center ">
        <div>
          {info.map((item, i) => (
            <div 
            key={i} 
            className="grid grid-cols-[160px_30px_1fr] py-1 lg:py-[7px] text-sm lg:text-[15px] border rounded-xs my-[1px] hover:scale-105 
            dark:border-pink-700 hover:bg-gradient-to-r from-blue-500 to-pink-500 hover:text-white hover:border-0 transition-all duration-500 ease-in">
              <span className="font-medium text-gray-700 dark:text-gray-300 pl-4">{item.label}</span>
              <span className="text-gray-500 dark:text-gray-400">:</span>
              <span className="text-gray-900 dark:text-gray-100 truncate pr-1">{item.value ?? "—"}</span>
            </div>
          ))}
        </div>
      </div>
      
      <div className="mt-5 text-center">
        <span
          className={`inline-block px-4 py-1 text-xs rounded-full font-semibold text-white ${paymentStatusResponse(data.paymentStatus)}`}
        >
          {data.paymentStatus}
        </span>
      </div>

    </div>
  );
};
 
export default OldHubResultCard;