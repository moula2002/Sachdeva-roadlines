import React from 'react'
import { changeDateFormat, changeDateTimePeriodFormat, changeDateTimeFormat } from '../util/dateFormat';
import { paymentStatusResponse } from '../util/paymentResponse';

export function RecordResultCard({ data, cardTitle = "" }) {
  if (!data) return null;  
 
  return (
    <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 shadow-lg rounded-2xl p-6 mt-10 border border-gray-200 dark:border-gray-700">
      {/* Header */}
      <div className="flex justify-between items-center border-b pb-3 mb-4">
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100"> 
          {cardTitle === "" ? "Record Details" : cardTitle}
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          created: {changeDateTimePeriodFormat(data.createdAt)}
        </p>
      </div> 

      {/* Party & LR Info */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-sm text-gray-500">Inward No</p>
          <p className="font-medium text-gray-800 dark:text-gray-100">{data.inwardNo}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Party Name</p>
          <p className="font-medium text-gray-800 dark:text-gray-100">{data.partyName}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">From Address</p>
          <p className="font-medium text-gray-800 dark:text-gray-100">{data.fromAddress}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Branch</p>
          <p className="font-medium text-gray-800 dark:text-gray-100">{data.branch || "---"}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Lorry Receipt No</p>
          <p className="font-medium text-gray-800 dark:text-gray-100">{data.lorryReceiptNo}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Lorry Receipt No</p>
          <p className="font-medium text-gray-800 dark:text-gray-100">{data.lorryReceiptDate}</p>
        </div>
      </div>

      {/* Package and weight */}
      <h3 className="font-semibold text-gray-700 dark:text-gray-200 mb-1 mt-2 border-t">
          package Info
        </h3>
      <div className="bg-gray-100 dark:bg-gray-700 rounded-xl p-4 mb-4 ">
        
        <div className="grid grid-cols-2 gap-3 text-sm text-center">
          <div>
              <p className="text-gray-500 dark:text-gray-300">Package</p>
              <p className="font-medium text-gray-800 dark:text-gray-100">{data.pks || 0}</p>
          </div>
          <div>
              <p className="text-gray-500 dark:text-gray-300">Weight</p>
              <p className="font-medium text-gray-800 dark:text-gray-100">{data.weight || 0} Kg</p>
          </div>
        </div>
      </div>

      {/* Amount Details */}
      <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 mb-4">
        <h3 className="font-semibold text-gray-700 dark:text-gray-200 mb-2">
          Amount Summary
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
          <div>
            <p className="text-gray-500">Lorry Amount</p>
            <p className="font-medium text-gray-800 dark:text-gray-100">₹{data.lorryReceiptAmount || 0}</p>
          </div>
          <div>
            <p className="text-gray-500">Rebate</p>
            <p className="font-medium text-gray-800 dark:text-gray-100">₹{data.rebate || 0}</p>
          </div>
          <div>
            <p className="text-gray-500">After Rebate</p>
            <p className="font-medium text-gray-800 dark:text-gray-100">₹{data.afterRebate || 0}</p>
          </div>
          <div>
            <p className="text-gray-500">Paid Amount</p>
            <p className="font-medium text-gray-800 dark:text-gray-100">₹{data.paidAmount || 0}</p>
          </div>
          <div>
            <p className="text-gray-500">Balance</p>
            <p className="font-medium text-gray-800 dark:text-gray-100">₹{data.balanceAmount || 0}</p>
          </div>
          <div>
            <p className="text-gray-500">Others</p>
            <p className="font-medium text-gray-800 dark:text-gray-100">₹{data.others || 0}</p>
          </div>
        </div>
      </div>

      {/* Payment Info */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-3">
        <div>
          <p className="text-sm text-gray-500">Payment Type</p>
          <p className="font-medium text-gray-800 dark:text-gray-100">{data.paymentType || "--"}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Cash Receipt No</p>
          <p className="font-medium text-gray-800 dark:text-gray-100">{data.cashReceiptNo || "--"}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Cash Receipt Amount</p>
          <p className="font-medium text-gray-800 dark:text-gray-100">₹{data.cashReceiptAmount || 0}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Receipt Date</p>
          <p className="font-medium text-gray-800 dark:text-gray-100">
            {data.cashReceiptDate}
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="flex justify-between items-center border-t pt-3 mt-4">
        <p className="text-sm text-gray-500">
          Updated: {changeDateTimePeriodFormat(data.updatedAt)}
        </p>
        <span
          className={`text-sm font-semibold px-3 py-1 rounded-sm text-white ${paymentStatusResponse(data.paymentStatus)}`}
        >
          {data.paymentStatus}
        </span>
      </div>
    </div>
  );
}