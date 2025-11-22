import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import FindInputCard from "../../components/FindHubComponents/FindInputCard";
import { validators } from "../../util/validation";
import { changeDateTimePeriodFormat } from "../../util/dateFormat";
import { paymentStatusResponse } from "../../util/paymentResponse";
import { RecordResultCard } from "../../components/RecordResultCard";
import { AlertTriangle } from 'lucide-react';
import { BillToLorryReceiptNo } from "../../services/HubServices";
import { InwardNoToSearch, LorryReceiptNoToSearch } from "../../services/HomeService";

export default function Bill() {

  const [findOption, setFindOption] = useState(false);
  const [findedOptionResult, setFindedOptionResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const [paymentBillResult, setPaymentBillResult] = useState(null);
  const [isBillResult, setIsBillResult] = useState(false);

  const handleFindOptionChange = (e) => setFindOption(e.target.checked);

  useEffect(() => {
    setFindedOptionResult(null);
    setPaymentBillResult(null);
    setIsBillResult(false);
  }, [findOption]);

  const handleEditPayment = async (name, isError, value) => {
    if (isError) {
      toast.error("Please correct the input error");
      setFindedOptionResult(null);
      setIsBillResult(false);
      return;
    }

    setLoading(true);
    try {
      const response = await (findOption ? LorryReceiptNoToSearch(value) : InwardNoToSearch(value));
    
      if (response.status === 200) {
        const data = response.data;
        setFindedOptionResult(data);
        toast.success(`${findOption ? "LR" : "INWARD"} number details fetched`);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      if (error.response?.status === 400) toast.error("Invalid data");
      else if (error.response?.status === 404) {
        toast.error("No data found");
        setFindedOptionResult(null);
      } else toast.error("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      {/* Search Input */}
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

      {/* Toggle */}
      <div className="mx-2 my-3">
        <label className="text-sm flex items-center gap-2 cursor-pointer text-cyan-700 dark:text-white">
          <input
            type="checkbox"
            checked={findOption}
            onChange={handleFindOptionChange}
            className="mx-2 w-5 h-5 accent-blue-600 rounded-md cursor-pointer dark:accent-gray-500"
          />
          Search by {findOption ? "INWARD" : "LR Number"}
        </label>
      </div>

      {/* Cards */}
      <div className="my-10 flex flex-col lg:flex-row lg:justify-center lg:items-center items-start gap-6 w-full">
        <div className="w-full lg:w-[45%]">
          <InfoCard info={findedOptionResult} />
        </div>

        <div className="w-full lg:w-[50%] h-full flex justify-center items-center">
          {findedOptionResult && findedOptionResult.paymentStatus === "PENDING" && (
            <PaymentFormEntry
              initialData={findedOptionResult}
              setPaymentBillResult={setPaymentBillResult}
              setIsBillResult={setIsBillResult}
            />
          )}

          {findedOptionResult && findedOptionResult.paymentStatus !== "PENDING" && (
            <div className="flex flex-col justify-center items-center text-center py-4 mt-[25%]">
              <AlertTriangle className="h-10 w-10 lg:h-20 lg:w-20 text-red-600 mb-4" />
              <h1 className="text-lg font-semibold text-gray-700 dark:text-gray-200">
                Only <span className="font-bold">PENDING</span> records are handled here
              </h1>
            </div>
          )}
        </div>
      </div>

      {isBillResult && <RecordResultCard data={paymentBillResult}  cardTitle={'Payment Bill'}/>}
    </div>
  );
}

// Payment Form
const PaymentFormEntry = ({ initialData, setPaymentBillResult, setIsBillResult }) => {
  const initialBillData = {
    paidAmount: initialData.paidAmount || "",
    paymentDate: initialData.paymentDate || "",
    paymentType: initialData.paymentType || "",
    balanceAmount: initialData.balanceAmount || "",
    cashReceiptAmount: initialData.cashReceiptAmount || 0, 
  };

  const [paymentDetailsData, setPaymentDetailsData] = useState(initialBillData);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const paymentTypes = ["ACCOUNT1", "ACCOUNT2", "CHECK BOOK", "CASH", "UPI"];

  // Sync with new props (when new LR/inward fetched)
  useEffect(() => {
    setPaymentDetailsData({
      ...initialBillData,
      paidAmount: initialData.paidAmount || "",
      paymentDate: initialData.paymentDate || "",
      paymentType: initialData.paymentType || "",
      balanceAmount: initialData.balanceAmount || "",
      cashReceiptAmount: initialData.cashReceiptAmount || 0,
    });
  }, [initialData]);

  const validate = () => {
    let tempErrors = validators.bill(paymentDetailsData);

    // Ensure it's always an object
    tempErrors = tempErrors || {};
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setPaymentDetailsData((prev) => {
      const updated = {
        ...prev,
        [name]:
          ["paidAmount", "balanceAmount", "cashReceiptAmount"].includes(name) && value !== ""
            ? Number(value)
            : value,
      };

      // Auto-update balance dynamically
      if (name === "paidAmount") {
        const cashReceiptAmount = Number(updated.cashReceiptAmount) || 0;
        const paidAmount = Number(updated.paidAmount) || 0;
        updated.balanceAmount = cashReceiptAmount - paidAmount;
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
      const response = await BillToLorryReceiptNo(initialData.lorryReceiptNo, paymentDetailsData)
    
      if (response.status === 200) {
        setPaymentBillResult(response.data);
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
      className="w-full bg-white dark:bg-gray-800 shadow-lg rounded-2xl p-6 border border-gray-200 dark:border-gray-700"
    >
      <h2 className="text-lg font-semibold mb-4 text-center text-cyan-700 dark:text-cyan-400">
        Payment Entry
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
        <FormField label="Paid Amount" name="paidAmount" type="number" value={paymentDetailsData.paidAmount} onChange={handleChange} error={errors.paidAmount} />
        <FormField label="Payment Date" name="paymentDate" type="date" value={paymentDetailsData.paymentDate} onChange={handleChange} error={errors.paymentDate} />

        {/* Payment Type */}
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700 mb-1 dark:text-gray-400">Payment Type</label>
          <select
            name="paymentType"
            value={paymentDetailsData.paymentType}
            onChange={handleChange}
            className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-cyan-500 dark:bg-gray-700 dark:text-white"
          >
            <option value="">-- Select Payment Type --</option>
            {paymentTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          {errors.paymentType && <span className="text-red-500 text-xs mt-1">{errors.paymentType}</span>}
        </div>

        <FormField
          label="Balance Amount"
          name="balanceAmount"
          type="number"
          value={paymentDetailsData.balanceAmount}
          onChange={handleChange}
          error={errors.balanceAmount}
          disabled
        />
      </div>

      <button
        type="submit"
        className="w-[95%] mt-6 mb-2 mx-5 px-6 py-3 bg-gradient-to-r from-cyan-600 to-cyan-400 text-white font-semibold rounded-lg shadow-md hover:scale-105 transform transition duration-300 cursor-pointer"
      >
        {loading ? "Updating..." : "Update Payment"}
      </button>
    </form>
  );
};

// Reusable Input
const FormField = ({ label, name, type, value, onChange, error, disabled }) => (
  <div className="flex flex-col">
    <label className="text-sm font-medium text-gray-700 mb-1 dark:text-gray-400">{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      disabled={disabled}
      className={`px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-cyan-500 dark:bg-gray-700 dark:text-white ${
        disabled ? "bg-gray-100 dark:bg-gray-600 cursor-not-allowed" : ""
      }`}
      placeholder={`Enter ${label}`}
    />
    {error && <span className="text-red-500 text-xs mt-1">{error}</span>}
  </div>
);




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
              {/* package and weight details */}
              <div className="bg-gray-100 dark:bg-gray-700 rounded-xl p-4 mb-4 ">
                  
                <div className="grid grid-cols-2 gap-3 text-sm text-center">
                  <div>
                      <p className="text-gray-500 dark:text-gray-300">Rebate</p>
                      <p className="font-medium text-gray-800 dark:text-gray-100">{info.pks}</p>
                  </div>
                  <div>
                      <p className="text-gray-500 dark:text-gray-300">After Rebate</p>
                      <p className="font-medium text-gray-800 dark:text-gray-100">{info.weight} Kg</p>
                  </div>
                </div>
              </div>

              {/* Amount summary */}
              <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 mb-4">
                <h3 className="font-semibold text-gray-700 dark:text-gray-200 mb-2">
                  Amount Summary
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
                  <div>
                    <p className="text-gray-500">Lorry Amount</p>
                    <p className="font-medium text-gray-800 dark:text-gray-100">₹{info.lorryReceiptAmount}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Rebate</p>
                    <p className="font-medium text-gray-800 dark:text-gray-100">₹{info.rebate}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">After Rebate</p>
                    <p className="font-medium text-gray-800 dark:text-gray-100">₹{info.afterRebate}</p>
                  </div>
                  
                  <div>
                    <p className="text-gray-500">Others</p>
                    <p className="font-medium text-gray-800 dark:text-gray-100">₹{info.others}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">CR Number</p>
                    <p className="font-medium text-gray-800 dark:text-gray-100">{info.cashReceiptNo || "-"}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">CR Date</p>
                    <p className="font-medium text-gray-800 dark:text-gray-100">{info.cashReceiptDate || "-"}</p>
                  </div>
                </div>
              </div>

              
              <div className="text-center">
                <h3 className="font-semibold text-gray-700 dark:text-gray-200 mb-2 mt-2 border rounded-sm px-2 py-1 inline-block">
                  <span className="text-gray-600 dark:text-gray-300">CR Amount : </span>
                  ₹ { info.cashReceiptAmount}
                </h3>
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
