
import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import FindInputCard from "../../components/FindHubComponents/FindInputCard";
import { validators } from "../../util/validation";
import { paymentStatusResponse } from "../../util/paymentResponse";
import { changeDateTimePeriodFormat } from "../../util/dateFormat";
import { AlertTriangle } from 'lucide-react';
import { LorryReceiptNoToSearch, InwardNoToSearch } from '../../services/HomeService';
import { CRNoAndNullBillAPIcall } from "../../services/HubServices";


export default function CrNoNullBill() {
  
  const [findOption, setFindOption] = useState(false);
  const [findedOptionResult, setFindedOptionResult] = useState(null);
  const [loading, setLoading] = useState(false);

  // updated pill payment result
  const [ paymentBillResult, setPaymentBillResult ] = useState(null);
  const [isBillResult, setIsBillResult] = useState(false);

  const handleFindOptionChange = (e) => {
    setFindOption(e.target.checked);
  }

  useEffect(() => {
    setFindedOptionResult(null);
    setPaymentBillResult(null)
    setIsBillResult(false)
  }, [findOption])

  const handleEditPayment = async (name, isError, value) => {
    if (isError) {
      toast.error("Please correct the input error");
      setFindedOptionResult(null);
      setIsBillResult(false);
      return;
    }
    setIsBillResult(false)
    setLoading(true);

    try {
      // const response = await axios.get(
      //   `http://localhost:8080/api/v1/home/${findOption ? "lrno" : "inward" }/${value}`
      // );
      const response = await (findOption ? LorryReceiptNoToSearch(value) : InwardNoToSearch(value));

      if (response.status === 200) {
        const data = response.data;
        setFindedOptionResult(data);
        console.log("old data is :", data);
        
        toast.success(`${findOption ? "LR" : "INWARD" } number details fetched`);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      if (error.response?.status === 400) toast.error("Invalid data");
      else if (error.response?.status === 404) {
        toast.error("No data found"); 
        setFindedOptionResult(null);
      }
      else toast.error("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      {/* Search Input */}
      <div>
        {findOption ? (
          <FindInputCard
            name="lorryReceiptNo"
            type="number"
            placeholder="Enter LR Number"
            buttonText={loading ? "Loading..." : "Find LR"}
            onFind={handleEditPayment}
          />
        ) : (
          <FindInputCard
            name="inward"
            type="text"
            placeholder="Enter INWARD Number"
            buttonText={loading ? "Loading..." : "Find Inward"}
            onFind={handleEditPayment}
          />
        )}
      </div>

      {/* Search Option Toggle */}
      <div className="mx-2 my-3">
        <label className="text-sm flex items-center gap-2 cursor-pointer text-cyan-700 dark:text-white">
          <input
            type="checkbox"
            checked={findOption}
            onChange={handleFindOptionChange}
            className="mx-2 w-5 h-5 accent-blue-600 rounded-md cursor-pointer dark:accent-gray-500"
          />
          Search by {findOption ? "INWARD" : "LR Number" }
        </label>
      </div>

      {/* 🧾 Result & Form */}
      
      <div className="my-10 flex flex-col lg:flex-row justify-center items-start gap-6 w-full">
        {/* Left Card */}
        <div className="w-full lg:w-[47%]">
          {/* {findedOptionResult && <PaymentResultCard data={findedOptionResult} />} */}
          {findedOptionResult && <InfoCard info={findedOptionResult} />}
        </div>

        {/* Right Form */}
       
        <div className="w-full lg:w-[50%] h-full flex justify-center items-center">
          {findedOptionResult && findedOptionResult.paymentStatus === "INITIATED" && (
            <PaymentFormEntry 
              infoCardData={findedOptionResult} 
              setPaymentBillResult={setPaymentBillResult} 
              setIsBillResult={setIsBillResult} 
            />
          )}

          {findedOptionResult && findedOptionResult.paymentStatus !== "INITIATED" && (
            <div className="flex flex-col justify-center items-center text-center py-4 mt-[25%]">
              <AlertTriangle className="h-10 w-10 lg:h-20 lg:w-20 text-red-600 mb-4" />
              <h1 className="text-lg font-semibold text-gray-700 dark:text-gray-200">
                Only <span className="font-bold">INITIATED</span> records are handled here
              </h1>
            </div>
          )}
        </div>

      </div>

      {/* Bill card */}
      <div>
        {isBillResult && (<BillCard data={paymentBillResult} />)}
      </div>
      
    </div>
  );
}

// Payment Form
const PaymentFormEntry = ({ infoCardData, setPaymentBillResult, setIsBillResult }) => {
  const initialCrNoNullBillDatas = {
    lorryReceiptAmount: infoCardData.lorryReceiptAmount || "",
    cashReceiptNo: infoCardData.cashReceiptNo || "",
    cashReceiptDate: infoCardData.cashReceiptDate || "",
    rebate: infoCardData.rebate || "",
    afterRebate: infoCardData.afterRebate || "",
    others: infoCardData.others || "",
    cashReceiptAmount: infoCardData.cashReceiptAmount || "",
  };

  useEffect(() => {
      setPaymentDetailsData({
        ...initialCrNoNullBillDatas,
        lorryReceiptAmount: infoCardData.lorryReceiptAmount || "",
        cashReceiptNo: infoCardData.cashReceiptNo || "",
        cashReceiptDate: infoCardData.cashReceiptDate || "",
        rebate: infoCardData.rebate || "",
        afterRebate: infoCardData.afterRebate || "",
        others: infoCardData.others || "",
        cashReceiptAmount: infoCardData.cashReceiptAmount || "",
      });
    }, [infoCardData]);
  

  const [paymentDetailsData, setPaymentDetailsData] = useState(initialCrNoNullBillDatas);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const paymentTypes = ["ACCOUNT1", "ACCOUNT2", "CHECK BOOK", "CASH", "UPI"];

  const validate = () => {
    const tempErrors = validators.CrNoAndCrDetails(paymentDetailsData);
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setPaymentDetailsData((prev) => {
      const updated = {
        ...prev,
        [name]: ["rebate", "afterRebate", "others", "lorryReceiptAmount", "cashReceiptNo"].includes(name)
          ? value === ""
            ? ""
            : Number(value)
          : value,
      };

      const { lorryReceiptAmount, rebate, others } = updated;

      if (["rebate", "others"].includes(name)) {
        const rebateValue = Number(rebate) || 0;
        const amountValue = Number(lorryReceiptAmount) || 0;
        const othersValue = Number(others) || 0;

        const afterRebateCalc = amountValue - rebateValue;
        updated.afterRebate = afterRebateCalc;

        // if((!updated.cashReceiptAmount || updated.cashReceiptAmount === 0)) {
          updated.cashReceiptAmount = afterRebateCalc + othersValue;
        // }
      }

      return updated;
    });

    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return toast.error("Please fix the errors in the form.");

    try {
      setLoading(true);
      
      const response = await CRNoAndNullBillAPIcall(infoCardData.lorryReceiptNo, paymentDetailsData);

      if (response.status === 200) {
        const data = response.data;
        setPaymentBillResult(data);
        setIsBillResult(true);
        toast.success("Payment updated successfully!");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to update payment.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full bg-white dark:bg-gray-800 shadow-lg rounded-2xl px-6 py-6 lg:py-10 border border-gray-200 dark:border-gray-700"
    >
      <h2 className="text-lg font-semibold mb-4 text-center text-cyan-700 dark:text-cyan-400">
        Payment Entry
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-7">
        <FormField label="CR No" name="cashReceiptNo" type="number" value={paymentDetailsData.cashReceiptNo} onChange={handleChange} error={errors.cashReceiptNo} />
        <FormField label="CR Date" name="cashReceiptDate" type="date" value={paymentDetailsData.cashReceiptDate} onChange={handleChange} error={errors.cashReceiptDate} />
        <FormField label="Rebate" name="rebate" type="number" value={paymentDetailsData.rebate} onChange={handleChange} error={errors.rebate} />
        <FormField label="After Rebate" name="afterRebate" type="number" value={paymentDetailsData.afterRebate} onChange={handleChange} disabled error={errors.afterRebate}/>
        <FormField label="Others" name="others" type="number" value={paymentDetailsData.others} onChange={handleChange} error={errors.others}/>
        <FormField label="CR Amount" name="cashReceiptAmount" type="number" value={paymentDetailsData.cashReceiptAmount} onChange={handleChange} disabled  error={errors.cashReceiptAmount}/>
      </div>

      <button
        type="submit"
        className="w-[95%] mt-7 mx-5 px-6 py-3 bg-gradient-to-r from-cyan-600 to-cyan-400 text-white font-semibold rounded-lg shadow-md hover:scale-105 transform transition duration-300 cursor-pointer"
      >
        {loading ? "Updating..." : "Update CR"}
      </button>
    </form>
  );
};


// Reusable FormField Component
const FormField = ({ label, name, type, value, onChange, error, disabled }) => (
  <div className="flex flex-col">
    <label className="text-sm font-medium text-gray-700 mb-1 dark:text-gray-400">{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      disabled={disabled}
      min={0}
      max={999999999}
      className={`px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-cyan-500 dark:bg-gray-700 dark:text-white placeholder:text-gray-400 ${
        disabled ? "bg-gray-100 dark:bg-gray-600 cursor-not-allowed" : ""
      }`}
      placeholder={`Enter ${label}`}
    />
    {error && <span className="text-red-500 text-xs mt-1">{error}</span>}
  </div>
);



export function BillCard({ data }) {
  if (!data) return null;

  return (
    <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 shadow-lg rounded-2xl p-6 mt-10 border border-gray-200 dark:border-gray-700">
      {/* Header */}
      <div className="flex justify-between items-center border-b pb-3 mb-4">
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">
          Payment Bill
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          created : {changeDateTimePeriodFormat(data.createdAt)}
        </p>
      </div> 

      {/* Party & LR Info */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-sm text-gray-500">Party Name</p>
          <p className="font-medium text-gray-800 dark:text-gray-100">{data.partyName}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">From Address</p>
          <p className="font-medium text-gray-800 dark:text-gray-100">{data.fromAddress}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Inward No</p>
          <p className="font-medium text-gray-800 dark:text-gray-100">{data.inwardNo}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Lorry Receipt No</p>
          <p className="font-medium text-gray-800 dark:text-gray-100">{data.lorryReceiptNo}</p>
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
            <p className="font-medium text-gray-800 dark:text-gray-100">₹{data.lorryReceiptAmount}</p>
          </div>
          <div>
            <p className="text-gray-500">Rebate</p>
            <p className="font-medium text-gray-800 dark:text-gray-100">₹{data.rebate}</p>
          </div>
          <div>
            <p className="text-gray-500">After Rebate</p>
            <p className="font-medium text-gray-800 dark:text-gray-100">₹{data.afterRebate}</p>
          </div>
          <div>
            <p className="text-gray-500">Paid Amount</p>
            <p className="font-medium text-gray-800 dark:text-gray-100">₹{data.paidAmount}</p>
          </div>
          <div>
            <p className="text-gray-500">Balance</p>
            <p className="font-medium text-gray-800 dark:text-gray-100">₹{data.balanceAmount}</p>
          </div>
          <div>
            <p className="text-gray-500">Others</p>
            <p className="font-medium text-gray-800 dark:text-gray-100">₹{data.others}</p>
          </div>
        </div>
      </div>

      {/* Payment Info */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-3">
        <div>
          <p className="text-sm text-gray-500">Payment Type</p>
          <p className="font-medium text-gray-800 dark:text-gray-100">{data.paymentType}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Cash Receipt No</p>
          <p className="font-medium text-gray-800 dark:text-gray-100">{data.cashReceiptNo}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Cash Receipt Amount</p>
          <p className="font-medium text-gray-800 dark:text-gray-100">₹{data.cashReceiptAmount}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Receipt Date</p>
          <p className="font-medium text-gray-800 dark:text-gray-100">
            {new Date(data.cashReceiptDate).toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="flex justify-between items-center border-t pt-3 mt-4">
        <p className="text-sm text-gray-500">
          Created: {new Date(data.createdAt).toLocaleString()}
        </p>
        <span
          className={`text-sm font-semibold px-3 py-1 rounded-sm text-white ${ paymentStatusResponse(data.paymentStatus)}`}
        >
          {data.paymentStatus}
        </span>
      </div>
    </div>
  );
}

// PaymentResultCard 
const InfoCard = ({info}) => {
  if (!info) return null;

  return (
    <>
        <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 shadow-lg rounded-2xl p-6  border border-gray-200 dark:border-gray-700">
          {/* Header */}
          <div className="flex justify-between items-center border-b pb-3 mb-4">
            <h2 className="text-xl font-medium text-cyan-700 dark:text-cyan-400">
                Record Detail
            </h2>
            <p className="text-sm text-gray-500">{changeDateTimePeriodFormat(info.createdAt)}</p>
          </div> 

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4 pb-4 border-b">
            <div>
                <p className="text-sm text-gray-500">Inward No</p>
                <p className="font-medium text-gray-800 dark:text-gray-100">{info.inwardNo}</p>
            </div>
            <div>
                <p className="text-sm text-gray-500">Party Name</p>
                <p className="font-medium text-gray-800 dark:text-gray-100">{info.partyName}</p>
            </div>
            <div>
                <p className="text-sm text-gray-500">From</p>
                <p className="font-medium text-gray-800 dark:text-gray-100">{info.fromAddress}</p>
            </div>
            <div>
                <p className="text-sm text-gray-500">Branch</p>
                <p className="font-medium text-gray-800 dark:text-gray-100">{info.branch || "null"}</p>
            </div>
            <div>
                <p className="text-sm text-gray-500">Lorry Receipt No </p>
                <p className="font-medium text-gray-800 dark:text-gray-100">{info.lorryReceiptNo}</p>
            </div>
            <div>
                <p className="text-sm text-gray-500">LR Date</p>
                <p className="font-medium text-gray-800 dark:text-gray-100">{info.lorryReceiptDate}</p>
            </div>
          </div>
          <div className="bg-gray-100 dark:bg-gray-700 rounded-xl p-4 mb-4 ">
              
            <div className="grid grid-cols-2 gap-3 text-sm text-center">
              <div>
                  <p className="text-gray-500 dark:text-gray-300">Package</p>
                  <p className="font-medium text-gray-800 dark:text-gray-100">{info.pks}</p>
              </div>
              <div>
                  <p className="text-gray-500 dark:text-gray-300">Weight</p>
                  <p className="font-medium text-gray-800 dark:text-gray-100">{info.weight} Kg</p>
              </div>
            </div>
            <div className="text-center">
              <h3 className="font-semibold text-gray-700 dark:text-gray-200 mb-2 mt-2 border rounded-sm px-2 py-1 inline-block">
                  <span className="text-gray-600 dark:text-gray-300">LR Amount : </span>
                  ₹ { info.lorryReceiptAmount}
              </h3>
            </div>
          </div>
          {/* Footer */}
          <div className="flex justify-between items-center border-t pt-3 mt-4">
            <p className="text-sm text-gray-500">
              Updated : {changeDateTimePeriodFormat(info.updatedAt)}
            </p>
            <span
              className={`text-sm font-semibold px-3 py-1 rounded-sm text-white ${ paymentStatusResponse(info.paymentStatus) }`}
            >
              {info.paymentStatus}
            </span>
          </div>
        </div>
    </>
  )
}
