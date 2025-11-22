
import React,{useState, useEffect} from 'react'
import { useContext } from "react";
import { HubContext } from "../../../context/HubContext";
import { validators } from '../../../util/validation';
import FormField from './FormField';
import axios from 'axios';
import { toast } from 'react-toastify';
import Select from 'react-select';
import { EnterFullHub, EditFullHub } from '../../../services/HubServices';

export default function HubEntryEditForm() {

  const {
    fromAddressList, 
    oldHubData,
    getBranchOptions, handleBranchChange,
    paymentTypes,
    formType, 
    hubData, setHubData,
    setHubResultData
  } = useContext(HubContext);
  
  const [loading, setLoading] = useState(false); 

  // Editing Form Status Type
  const [editFormStatus, setEditFormStatus] = useState("INITIATED");

  //Validation
  const [errors, setErrors] = useState({});

  const validate = () => {
    let tempErrors = {};

    if (formType) {
      // Check safely if oldHubData is defined
      if (editFormStatus === "INITIATED") {
        tempErrors = validators.hubInitialEdit(hubData);
      } else {
        tempErrors = validators.hubEdit(hubData);
      }
    } else {
      tempErrors = validators.hub(hubData); // new entry
    }

    // Ensure it's always an object
    tempErrors = tempErrors || {};

    console.log("Validation errors:", tempErrors);
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setHubData((prev) => {
      // Step 1: Preserve empty string for input display, but convert safely for calculations
      const numericFields = [
        "rebate",
        "afterRebate",
        "others",
        "lorryReceiptAmount",
        "paidAmount",
        "pks",
        "weight",
        "cashReceiptNo",
      ];

      const updated = {
        ...prev,
        [name]: numericFields.includes(name)
          ? value === "" // user cleared input
            ? "" // keep empty for input box
            : Number(value) // otherwise number
          : value,
      };

      // Step 2: Safely parse numeric values ("" → 0 for math)
      const amountValue = Number(updated.lorryReceiptAmount) || 0;
      const rebateValue = Number(updated.rebate) || 0;
      const othersValue = Number(updated.others) || 0;
      const paidValue = Number(updated.paidAmount) || 0;

      // Step 3: Always keep afterRebate and cashReceiptAmount synced
      const afterRebateCalc = amountValue - rebateValue;
      const cashReceiptCalc = afterRebateCalc + othersValue;

      updated.afterRebate = afterRebateCalc;
      updated.cashReceiptAmount = cashReceiptCalc;

      // Step 4: Balance calculation — live updates even when clearing
      if (paidValue === 0) {
        updated.balanceAmount = cashReceiptCalc;
      } else if (paidValue > 0) {
        updated.balanceAmount = cashReceiptCalc - paidValue;
      }

      return updated;
    });

    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return toast.error("Please fix the errors in the form.");

    if(!formType) {
      // Entry new Hub
      entryHubRecord();
    } else {
      // Update Hub Record
      updateHubRecord();
    }
  };

  // Hub Entry API call 
  const entryHubRecord = async() => {
    console.log("Hub Entry Function call ");

    try {
      setLoading(true);
      console.log("Before sending entry hub data:", hubData);

      const response = await EnterFullHub(hubData);

      if (response.status === 201) {
        const data = response.data;
        console.log("the passing new record details is : ", data);
        setHubResultData(data)
        toast.success("Record created successfully!");
      }
    } catch (error) {
      if (error.response && error.response.data.message) {
        toast.error("Failed to create a hub record."); 
        console.log(error.response.data.message); 
      } else if (error.message === "Network Error") {
        toast.error("Network error — please check your internet or server connection.");
      } else {
        toast.error("Something went wrong while updating.");
      }
    } finally {
      setLoading(false);
    }
  }

  // Hub Edit API call
  const updateHubRecord = async () => {
    console.log("Hub Update Function call ");
    setLoading(true);
    console.log("passing hub edit record : ", hubData);
    
    try {
      let payload = {};
      if (formType && editFormStatus === "INITIATED") {
        // Only editable fields + default values for remaining ones
        payload = {
          inwardNo: hubData.inwardNo,
          lorryReceiptNo: hubData.lorryReceiptNo,
          lorryReceiptDate: hubData.lorryReceiptDate,
          fromAddress: hubData.fromAddress,
          branch: hubData.branch,
          partyName: hubData.partyName,
          pks: hubData.pks,
          weight: hubData.weight,
          lorryReceiptAmount: hubData.lorryReceiptAmount,

          // ✅ Default values for non-editable INITIATED fields
          cashReceiptNo: "",
          cashReceiptDate: "",
          rebate: 0,
          afterRebate: 0,
          others: 0,
          cashReceiptAmount: 0,
          paidAmount: 0,
          paymentDate: "",
          paymentType: "",
          balanceAmount: 0,
        };
      } else {
        // Normal full payload for PENDING/PAID or new entry
        payload = { ...hubData };
      }

      console.log("Final payload before edit API:", payload);

      const response = await EditFullHub(hubData.lorryReceiptNo, payload);

      if(response.status === 200) {
        toast.success("Record Updated Success");
        const data = response.data;
        console.log("the Updated Data is : ", data);
        setHubResultData(data);
        return;
      } 

      toast.error("invalid data");
    } catch(error) {
      console.log("Error from updateHubRecords Function :", error);

      if (error.response && error.response.data.message) {
        toast.error("Failed to update the hub record");
        console.log(error.response.data.message);
      } else if (error.message === "Network Error") {
        toast.error("Network error — please check your internet or server connection.");
      } else {
        toast.error("Something went wrong while updating.");
      }
    } finally{
      setLoading(false);
    }
  }

  // oldHubData will change set the EditFormType
  useEffect(() => {
    // guard access to oldHubData
    if (formType && oldHubData?.paymentStatus) {
      if(oldHubData.paymentStatus === "INITIATED") setEditFormStatus("INITIATED");
      if(oldHubData.paymentStatus === "PENDING") setEditFormStatus("PENDING");
      if(oldHubData.paymentStatus === "PAID") setEditFormStatus("PAID");
    } else if (formType && !oldHubData) {
      // If formType true but no oldHubData yet, keep default or reset
      setEditFormStatus("INITIATED");
    }
  },[oldHubData, formType])

  return (
    <>
      <h2 className="text-xl font-semibold mb-4 text-center text-cyan-700 dark:text-cyan-400">
        {formType ? "Hub Edit Form" : "Hub Entry Form"}
      </h2>
    
      <form
        onSubmit={handleSubmit}
        className="w-full bg-white my-2 dark:bg-gray-800 shadow-lg rounded-2xl p-6 border border-gray-200 dark:border-gray-700"
      >

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">    

          {formType && editFormStatus === "INITIATED" ? (
            <>
              <FormField label="Inward" name="inwardNo" type="text" value={hubData?.inwardNo ?? ''} onChange={handleChange} error={errors.inwardNo} disabled={!!formType} />
              <FormField label="LR No" name="lorryReceiptNo" type="number" value={hubData?.lorryReceiptNo ?? ''} onChange={handleChange} error={errors.lorryReceiptNo}  disabled={!!formType} />
              <FormField label="LR Date" name="lorryReceiptDate" type="date" value={hubData?.lorryReceiptDate ?? ''} onChange={handleChange} error={errors.lorryReceiptDate} />

              {/* from_address*/}
              <div className='flex flex-col'>
                  <label className="text-sm font-medium text-gray-700 mb-1 dark:text-gray-400">From Address :</label>
                  <select
                    name="fromAddress"
                    value={hubData?.fromAddress ?? ''}
                    onChange={handleChange}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-cyan-500 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="">-- Select From Address --</option>
                    {fromAddressList.map((city) => (
                    <option key={city} value={city}>{city}</option>
                    ))}
                </select>
                {errors.fromAddress && <span className="text-red-500 text-xs mt-1">{errors.fromAddress}</span>}
              </div>

              {/* Branch */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 dark:text-gray-400">Branch</label>
                <Select
                    options={getBranchOptions(hubData?.fromAddress)}
                    value={
                      hubData?.branch ? { label: hubData.branch, value: hubData.branch } : null
                    }
                    onChange={handleBranchChange}
                    placeholder="Select or type branch..."
                    isSearchable
                    className="text-black rounded-lg dark:bg-gray-700 "
                />
                {errors.branch && <span className="text-red-500 text-xs mt-1">{errors.branch}</span>}
              </div>
              
              <FormField label="Party Name" name="partyName" type="text" value={hubData?.partyName ?? ''} onChange={handleChange} error={errors.partyName} />
              <FormField label="Package" name="pks" type="number" value={hubData?.pks ?? ''} onChange={handleChange} error={errors.pks} />
              <FormField label="Weight" name="weight" type="number" value={hubData?.weight ?? ''} onChange={handleChange} error={errors.weight} />
              <FormField label="LR Amount" name="lorryReceiptAmount" type="number" value={hubData?.lorryReceiptAmount ?? ''} onChange={handleChange} error={errors.lorryReceiptAmount} />
            </>
          )
          :
          (
            <>
              <FormField label="Inward" name="inwardNo" type="text" value={hubData?.inwardNo ?? ''} onChange={handleChange} error={errors.inwardNo} disabled={!!formType} />
              <FormField label="LR No" name="lorryReceiptNo" type="number" value={hubData?.lorryReceiptNo ?? ''} onChange={handleChange} error={errors.lorryReceiptNo}  disabled={!!formType} />
              <FormField label="LR Date" name="lorryReceiptDate" type="date" value={hubData?.lorryReceiptDate ?? ''} onChange={handleChange} error={errors.lorryReceiptDate} />

              {/* from_address*/}
              <div className='flex flex-col'>
                  <label className="text-sm font-medium text-gray-700 mb-1 dark:text-gray-400">From Address :</label>
                  <select
                    name="fromAddress"
                    value={hubData?.fromAddress ?? ''}
                    onChange={handleChange}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-cyan-500 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="">-- Select From Address --</option>
                    {fromAddressList.map((city) => (
                    <option key={city} value={city}>{city}</option>
                    ))}
                </select>
                {errors.fromAddress && <span className="text-red-500 text-xs mt-1">{errors.fromAddress}</span>}
              </div>

              {/* Branch */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 dark:text-gray-400">Branch</label>
                <Select
                    options={getBranchOptions(hubData?.fromAddress)}
                    value={
                      hubData?.branch ? { label: hubData.branch, value: hubData.branch } : null
                    }
                    onChange={handleBranchChange}
                    placeholder="Select or type branch..."
                    isSearchable
                    className="text-black rounded-lg dark:bg-gray-700 "
                />
                {errors.branch && <span className="text-red-500 text-xs mt-1">{errors.branch}</span>}
              </div>
              
              <FormField label="Party Name" name="partyName" type="text" value={hubData?.partyName ?? ''} onChange={handleChange} error={errors.partyName} />
              <FormField label="Package" name="pks" type="number" value={hubData?.pks ?? ''} onChange={handleChange} error={errors.pks} />
              <FormField label="Weight" name="weight" type="number" value={hubData?.weight ?? ''} onChange={handleChange} error={errors.weight} />
              <FormField label="LR Amount" name="lorryReceiptAmount" type="number" value={hubData?.lorryReceiptAmount ?? ''} onChange={handleChange} error={errors.lorryReceiptAmount} />
              <FormField label="CR No" name="cashReceiptNo" type="number" value={hubData?.cashReceiptNo ?? ''} onChange={handleChange} error={errors.cashReceiptNo} />
              <FormField label="CR Date" name="cashReceiptDate" type="date" value={hubData?.cashReceiptDate ?? ''} onChange={handleChange} error={errors.cashReceiptDate} />
              <FormField label="Rebate" name="rebate" type="number" value={hubData?.rebate ?? ''} onChange={handleChange} error={errors.rebate}/>
              <FormField label="After Rebate" name="afterRebate" type="number" value={hubData?.afterRebate ?? 0} onChange={handleChange} error={errors.afterRebate} disabled/>
              <FormField label="Others" name="others" type="number" value={hubData?.others ?? ''} onChange={handleChange} error={errors.others}/>
              <FormField label="CR Amount" name="cashReceiptAmount" type="number" value={hubData?.cashReceiptAmount ?? 0} onChange={handleChange} disabled />
              <FormField label="Paid Amount" name="paidAmount" type="number" value={hubData?.paidAmount ?? ''} onChange={handleChange} error={errors.paidAmount} />
              <FormField label="Payment Date" name="paymentDate" type="date" value={hubData?.paymentDate ?? ''} onChange={handleChange} error={errors.paymentDate} />

              {/* Payment Type */}
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700 mb-1 dark:text-gray-400">Payment Type</label>
                <select
                  name="paymentType"
                  value={hubData?.paymentType ?? ''}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-cyan-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="">-- Select Payment Type --</option>
                  {paymentTypes.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
                {errors.paymentType && <span className="text-red-500 text-xs mt-1">{errors.paymentType}</span>}
              </div>

              <FormField label="Balance Amount" name="balanceAmount" type="number" value={hubData?.balanceAmount ?? 0} onChange={handleChange} disabled />
        
            </>
        )}
        </div> 

        <button
          type="submit"
          className='w-[95%] my-5 mx-5 px-6 py-3 bg-gradient-to-r from-cyan-600 to-cyan-400 text-white font-semibold rounded-lg shadow-md hover:scale-105 transform transition duration-300 cursor-pointer'
        >
          {loading ? "Updating..." : formType ? "Edit Hub" : "Create Hub"}
        </button>
      </form>
    </>
  );
};

