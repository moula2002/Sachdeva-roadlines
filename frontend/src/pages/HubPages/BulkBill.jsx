import React,{useState} from 'react';
import { toast } from 'react-toastify';
import { 
    BulkBillPendingStatusDetailsAPIcall, 
    BulKBillPaymentAPIcall 
} from '../../services/HubServices';


export default function BulkBill() {
  return (
    <>    
        <BulkBillFindPartyDetailInput />
    </>
  )
}

export const BulkBillFindPartyDetailInput = () => {

    const pendingDetailsInitial = {
        records : [],
        partyName: "",
        totalLorryReceiptAmount : 0,
        totalAfterRebate : 0,
        totalBalanceAmount : 0,
        totalCashReceiptAmount: 0,
        totalOthers : 0, 
        totalPaidAmount : 0, 
        totalRebate : 0,
        totalRecords : 0
    }

    const [partyName, setPartyName] = useState("");
    const [userIdError, setUserIdError] = useState("");
    const [pendingDetails, setPendingDetails] = useState(pendingDetailsInitial);

    const handleChange = (e) => {
        setPartyName(e.target.value);
        setUserIdError("");
        setPendingDetails(pendingDetailsInitial);
    }

    const handleClick = () => {

        if (!partyName || partyName.trim() === "") {
        setUserIdError("Party Name is required");
        return;
        }
        findBulkPaymentDetailsByPartyName();
    }

    const findBulkPaymentDetailsByPartyName = async() => {

        try {
            // const response = await axios.get(`http://localhost:8080/api/v1/hub/party-bulk-pending-summary/${partyName}`);
            const response = await BulkBillPendingStatusDetailsAPIcall(partyName);

            if(response.status === 200) {
                const data = await response.data;
                console.log("coming user details is : ", data);
                setPendingDetails(data)
            } 
        } catch(error) {
            console.log("Error in  findBulkPaymentDetailsByPartyName function : ", error);
            if(error.response && error.response.data) {
                if(error.response.status === 404) {
                    toast.error(error.response.data.message);
                } else {
                    toast.error("Something went wrong. Try again later.");
                }
            } else {
                toast.error("Server not reachable. Check your backend.");
            }
        }
    }

    return (
        <>

            <div
                className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full max-w-md mx-auto 
                bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-3"
                style={{ boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px" }} >
              
                <input
                type='text'
                name='partyName'
                placeholder='Enter the User Id'
                className="w-full sm:flex-1 px-4 py-2 rounded-lg bg-white/20 text-black dark:text-white placeholder-slate-400 
                    focus:outline-none focus:ring-2 focus:ring-pink-400 text-center sm:text-left"
                onChange={handleChange}
                onKeyDown={(e) => {if(e.key === "Enter") handleClick()}}
                />
        
                <button
                onClick={handleClick}
                className="w-full sm:w-auto px-6 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-pink-500 
                    text-white font-semibold shadow-md hover:opacity-90 transition-all">
                    Find Party
                </button>
        
                {userIdError && (
                <p className="text-center text-xs text-red-500 my-3">{userIdError}</p>
                )}
            </div>
            

            {pendingDetails.totalRecords > 0 && (
                <>
                    <BulkPendingRecordTotals pendingDetails={pendingDetails} />
                    <BulkPendingDetailsTable pendingDetails={pendingDetails} />
                    <BulkPaymentPillPayInput partyName={partyName} setPendingDetails={setPendingDetails} pendingDetailsInitial={pendingDetailsInitial}/>
                </>
            )}

        </>
    )
}

export const BulkPendingRecordTotals = ({pendingDetails}) => {
    // if(!pendingDetails.totalRecords > 0) return;
    return (
        <div className='mt-5 mb-3 mx-1'>
            <div className='flex flex-col gap-1 sm:gap-0 sm:flex-row justify-between my-2'>
                <span className='text-xl font-bold text-[darkblue]'>Amount Totals</span>
                <span className='text-[16px] font-bold dark:text-white'>{pendingDetails.partyName}</span>
            </div>

            <div className='w-full grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2'>
                {[
                    {label :"LR Amount", value : pendingDetails.totalLorryReceiptAmount.toLocaleString()},
                    {label :"After Rebate", value : pendingDetails.totalAfterRebate.toLocaleString()},
                    {label :"Balance Amount", value : pendingDetails.totalBalanceAmount.toLocaleString()},
                    {label :"CR Amount", value : pendingDetails.totalCashReceiptAmount.toLocaleString()},
                    {label :"Others", value : pendingDetails.totalOthers.toLocaleString()},
                    {label :"Paid Amount", value : pendingDetails.totalPaidAmount.toLocaleString()},
                    {label :"Rebate", value : pendingDetails.totalRebate.toLocaleString()},
                    {label :"Record Count", value : pendingDetails.totalRecords}
                    ].map((item, index) => (
                        <div 
                            className='px-4 py-2 rounded bg-white dark:bg-zinc-800/50 flex flex-col gap-3 hover:scale-[1.02] transition-all duration-200'
                            key={index}>
                            <span className='text-[darkcyan] text-md'>{item.label}</span>
                            <span 
                            className={`${item.label === "Balance Amount" ? "text-red-600 font-bold" : "text-pink-600 font-medium"}`}
                            >
                                {item.label === "Record Count" ? "" : "₹ "}{item.value}
                            </span>
                        </div>
                ))}
            </div>

        </div>
    )
} 


export const BulkPendingDetailsTable = ({pendingDetails}) => {

    return (
        <div className="max-w-[98%] mx-auto mt-6 bg-white dark:bg-transparent rounded-xl shadow-lg p-5">
            {pendingDetails.records.length > 0 && (
                <div className="overflow-x-auto mt-5">
                    <table className="min-w-full text-sm border border-gray-300">
                    <thead className="bg-gray-200">
                        <tr>
                            <th className="p-2 border">No</th>
                            <th className="p-2 border">Inward No</th>
                            <th className="p-2 border">LR No</th>
                            <th className="p-2 border">LR Date</th>
                            <th className="p-2 border">LR Amount</th>
                            <th className="p-2 border">Package</th>
                            <th className="p-2 border">Weight</th>
                            <th className="p-2 border">Rebate</th>
                            <th className="p-2 border">After Rebate</th>
                            <th className="p-2 border">Others</th>
                            <th className="p-2 border">Cash Receipt</th>
                            <th className="p-2 border">Paid</th>
                            <th className="p-2 border">Balance</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pendingDetails.records.map((r, index) => (
                        <tr key={index} className="text-center hover:bg-gray-50">
                            <td className="p-2 border">{index+1}</td>
                            <td className="p-2 border">{r.inwardNo}</td>
                            <td className="p-2 border">{r.lorryReceiptNo}</td>
                            <td className="p-2 border text-nowrap">{r.lorryReceiptDate}</td>
                            <td className="p-2 border">{r.lorryReceiptAmount}</td>
                            <td className="p-2 border">{r.pks}</td>
                            <td className="p-2 border">{r.weight}</td>
                            <td className="p-2 border">{r.rebate}</td>
                            <td className="p-2 border">{r.afterRebate}</td>
                            <td className="p-2 border">{r.others}</td>
                            <td className="p-2 border">{r.cashReceiptAmount}</td>
                            <td className="p-2 border">{r.paidAmount}</td>
                            <td className="p-2 border">{r.balanceAmount}</td>
                        </tr>
                        ))}
                    </tbody>
                    </table>
                </div>
            )}
        </div>
    )
}



export const BulkPaymentPillPayInput = ({ partyName, setPendingDetails, pendingDetailsInitial}) => {
  const paymentTypes = ["ACCOUNT1", "ACCOUNT2", "CHECK BOOK", "CASH", "UPI"];

  const paymentInitialData = {
    partyName: partyName || "",
    paidAmount: "",
    paymentType: "",
    paymentDate: "",
  };

  const [paymentInput, setPaymentInput] = useState(paymentInitialData);
  const [inputError, setInputError] = useState("");

  // fix Properly update input values
  const handleChange = (e) => {
    const { name, value } = e.target;
    setPaymentInput((prev) => ({
      ...prev,
      [name]: value,
    }));

    setInputError("");
  };

  // fix Proper validation logic
  const validate = () => {
    if (!paymentInput.partyName.trim()) {
      setInputError("Party Name is required");
      return false;
    }

    if (!paymentInput.paidAmount) {
      setInputError("Paid Amount is required");
      return false;
    } else if (Number(paymentInput.paidAmount) <= 0) {
      setInputError("Paid Amount must be positive");
      return false;
    }

    if (!paymentInput.paymentDate) {
      setInputError("Payment Date is required");
      return false;
    }

    if (!paymentInput.paymentType) {
      setInputError("Payment Type is required");
      return false;
    }

    setInputError("");
    return true;
  };

  const BullPaymentPayAPICall = async () => {

    try {
        // const response = await axios.post(`http://localhost:8080/api/v1/hub/party-bulk-bill-payment`, paymentInput);
        const response = await BulKBillPaymentAPIcall(paymentInput);
        if(response.status === 200) {
            const data = await response.data;
            // console.log("coming user details is : ", data);
            toast.success(data);
            setPendingDetails(pendingDetailsInitial);
            //pendingDetails.totalBalanceAmount don't be grter then paidAmount
        } 
    } catch(error) {
        console.log("Error in BullPaymentPayAPICall function : ", error);
        if(error.response && error.response.data) {
            if(error.response.status === 404) {
                toast.error(error.response.data.message);
            }else if(error.response.status === 400) {
                toast.error(error.response.data.message);
            } else {
                toast.error("Something went wrong. Try again later.");
            }
        } else {
            toast.error("Server not reachable. Check your backend.");
        }
    }
 }

  // fix Call validation function properly
  const handleSubmit = () => {
    if (!validate()) {
        console.log("Please correct the errors before submitting.");
    } else {
        console.log("Befor passing Bulk paid Payment Input:", paymentInput);
        BullPaymentPayAPICall();
    }
  };

  return (
    <div className='max-w-[98%] flex flex-col gap-1.5
     items-center p-4 bg-white rounded-lg shadow-md mt-3 mb-2'>

        <div className="w-full grid grid-rows-1 sm:grid-cols-3 gap-1">
            <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700 mb-1">
                Paying Full Amount
                </label>
                <input
                type="number"
                value={paymentInput.paidAmount}
                min={0}
                name="paidAmount"
                onChange={handleChange}
                placeholder="Enter total amount"
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500"
                />
            </div>

            <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700 mb-1">
                Payment Type
                </label>
                <select
                name="paymentType"
                value={paymentInput.paymentType}
                onChange={handleChange}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500"
                >
                <option value="">-- Select Payment Type --</option>
                {paymentTypes.map((type) => (
                    <option key={type} value={type}>
                    {type}
                    </option>
                ))}
                </select>
            </div>

            <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700 mb-1">
                Payment Date
                </label>
                <input
                type="date"
                value={paymentInput.paymentDate}
                name="paymentDate"
                onChange={handleChange}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500"
                />
            </div>    
        </div>

        <div className='flex flex-col mt-2'>
            <button
                type="button"
                onClick={handleSubmit}
                className="px-6 sm:px-8 py-3 bg-gradient-to-r from-cyan-600 to-cyan-400 text-white font-semibold rounded-lg shadow-md hover:scale-105 transform transition duration-300 text-nowrap hover:cursor-pointer"
            >
                Bulk Pay
            </button>

            {inputError && (
                <span className="text-red-500 text-sm mt-2 text-center w-full">
                {inputError}
                </span>
            )}
        </div>
    </div>
    
  );
};

