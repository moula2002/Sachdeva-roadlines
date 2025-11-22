import React, { useState } from 'react'
import FindInputCard from '../../components/FindHubComponents/FindInputCard'
import { toast } from 'react-toastify';

import { useNavigate } from 'react-router-dom';
import { RecordResultCard } from '../../components/RecordResultCard';
import { LorryReceiptNoToSearch } from '../../services/HomeService';

function LrnoFind() {

  const [ loading, setLoading ] = useState(false);
  const [ lrData, setLrData ] = useState(null);
  const navigate = useNavigate();

  const handleFindLrnumber = async (name, isError, value) => {

    if (isError) {
      return; 
    }
  
    setLoading(true);
    // setLrData(null);
    console.log(`${name}: ${value}`);

    try{
      const response = await LorryReceiptNoToSearch(value);
      console.log("comming response is : ", response);
      
      if(response.status === 200 ) {
        const data = response.data;
        setLrData(data);
        toast.success("LR details Getted");
      } 
    }catch(error) {
      console.log(`Error from LrnoFind Function : ", ${error}`);

      setLrData(null);
      // Network Error 
      if (!error.response) {
        toast.error("Network error — please check your internet connection or server status.");
      }

      // Backend responded with an error (HTTP status)
      else if (error.response) {
        const { status } = error.response;
        if (status === 400) toast.error("Invalid data provided.");
        else if (status === 404) toast.error("No data found for this LR number.");
        else if (status === 401) navigate("/login");
        else if (status >= 500) toast.error("Server error — please try again later.");
      }
    } finally {
      setLoading(false);
    }
  }
  return (
    <>
      <div>
        <FindInputCard
          name="lorryReceiptNo"
          type="number"
          placeholder="Enter LR Number"
          buttonText="LR"
          onFind={handleFindLrnumber} //call back function
        />
      </div>
      <div>
        {loading && <p>loading ...</p>}
        {!loading && lrData && (<RecordResultCard data={lrData}/>)}
      </div>
    </>
  )
}

export default LrnoFind