import React, { useContext, useState } from 'react'
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import FindInputCard from '../../components/FindHubComponents/FindInputCard'
import { RecordResultCard } from '../../components/RecordResultCard';
import { CashReceiptNoToSearch } from '../../services/HomeService';

export default function CrnoFind() {
  
  const [ loading, setLoading ] = useState(false);
  const [ crData, setCrData ] = useState(null);
  const navigate = useNavigate();
  
  const handleFindCrnumber = async (name,isError, value) => {

    if (isError) {
      return; 
    }

    setLoading(true);
    console.log(`${name}: ${value}`);

    try{
      const response = await CashReceiptNoToSearch(value);
      console.log("comming response is : ", response);
    
      if(response.status === 200 ) {
        const data = response.data;
        setCrData(data);
        toast.success("CR details Getted");
      }
    }catch(error) {
      console.log(`Error from CrnoFind Function : ", ${error}`);
      setCrData(null);

      // Network Error 
      if (!error.response) {
        toast.error("Network error — please check your internet connection or server status.");
      }

      // Backend responded with an error (HTTP status)
      else if (error.response) {
        const { status } = error.response;
        if (status === 400) toast.error("Invalid data provided.");
        else if (status === 404) toast.error("No data found this CR Number.");
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
          name="cashReceiptNo"
          type="number"
          placeholder="Enter CR Number"
          buttonText="LR"
          onFind={handleFindCrnumber} //call back function
        />
      </div>
      
      <div>
        {loading && <p>loading ...</p>}
        {!loading && crData && (<RecordResultCard data={crData}/>)}
      </div>
    </>
  )
}

 