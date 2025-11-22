import React, {useContext, useEffect, useState} from 'react';
import FindInputCard from '../../components/FindHubComponents/FindInputCard';
import HubEntryEditForm from '../../components/HubComponents/HubEntryEdit/HubEntryEditForm';
import { toast } from 'react-toastify';
import { HubContext } from '../../context/HubContext';
import OldHubResultCard from '../../components/HubComponents/HubEntryEdit/OldHubResultCard';
import { InwardNoToSearch, LorryReceiptNoToSearch } from '../../services/HomeService';
import { RecordResultCard } from '../../components/RecordResultCard';

function HubEdit() {

  const [loading, setLoading] = useState(false);
  // hub serch option 
  const [hubSearchOption, setHubSearchOption] = useState(false);

  // hub search option change function
  const handleHubOptionChange = (e) => {
    setHubSearchOption(e.target.checked);
    setOldHubData(null);
    setHubResultData(null);
  }

  const {
    initialTransportData,
    setHubData,
    formType, setFormType,
    hubResultData, setHubResultData,
    oldHubData, setOldHubData
  } = useContext(HubContext);

  // change the from type 
  useEffect(() => {
    setFormType(true);
    setHubData(initialTransportData);
  }, [formType])

  //search by LR or INWARD number by
  const handleEditHub = async (name, isError, value) => {
    if (isError) {
      toast.error("Please correct the input error");
      return;
    }

    setOldHubData(null);
    setHubResultData(null);

    try {
      const response = await (hubSearchOption ? LorryReceiptNoToSearch(value) : InwardNoToSearch(value));
     
      if (response.status === 200) {
        const data = response.data;
        // setFindedOptionResult(data);
        setHubData(data);
        setOldHubData(data);
        toast.success(`${hubSearchOption ? "LR" : "INWARD"} number details fetched`);
      }
    } catch (error) {
      console.error("Error fetching data :", error);
      if (error.response?.status === 400) toast.error("Invalid data");
      else if (error.response?.status === 404) {
        toast.error("No data found"); 
      }
      else toast.error("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div>
        {/* Search Input */}
        <div>
          {hubSearchOption ? (
            <FindInputCard
              name="lorryReceiptNo"
              type="number"
              placeholder="Enter LR Number"
              buttonText={loading ? "Loading..." : "Find LR"}
              onFind={handleEditHub}
            />
            
          ) : (
            <FindInputCard
              name="inward"
              type="text"
              placeholder="Enter INWARD Number"
              buttonText={loading ? "Loading..." : "Find Inward"}
              onFind={handleEditHub}
            />
          )}
        </div>

        {/* Search Option Toggle */}
        <div className="mx-2 my-3 inline-block">
          <label className="text-sm flex items-center gap-2 cursor-pointer text-cyan-700 dark:text-white">
            <input
              type="checkbox"
              checked={hubSearchOption}
              onChange={handleHubOptionChange}
              className="mx-2 w-5 h-5 accent-blue-600 rounded-md cursor-pointer dark:accent-gray-500"
            />
            Search Record by {hubSearchOption ? "INWARD" : "LR Number"}
          </label>
        </div>
      </div>

      {oldHubData && Object.keys(oldHubData).length > 0 && (
        <div className="my-10 flex flex-col lg:flex-row lg:items-center justify-center items-start gap-6 w-full">

          {/* Left Card */}
          <div className="w-full lg:w-[40%]">
            <OldHubResultCard data={oldHubData} />
          </div>

          {/* Right Form */}
          <div className="w-full lg:w-[55%]">
            <HubEntryEditForm />
          </div>
        </div>
      )}

      {/* Show the result  */}
      {hubResultData && Object.keys(hubResultData).length > 0 && <RecordResultCard  data={hubResultData} />}
      
    </>
  )
}

export default HubEdit