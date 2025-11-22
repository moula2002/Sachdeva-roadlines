
import React, { useContext } from 'react'
import FindInputCard from '../../components/FindHubComponents/FindInputCard'
import { toast } from 'react-toastify';
import { FindContext } from '../../context/FindContext';
import { useNavigate } from 'react-router-dom';

import { ResultTable } from '../../components/RecordResultTable';
import { LorryReceiptDateToSearch } from '../../services/HomeService';

export default function LrDateFind() {


  const {
    loading, setLoading,
    multiResult, setMultiResult,
    selectedRow,
  } = useContext(FindContext);

  const navigate = useNavigate();

  const handleFindLrDate = async (name, isError, value) => {
    
    if (isError) {
      return; 
    }
    
    setLoading(true);
    console.log(`${name}: ${value}`);

    try{
      const response = await LorryReceiptDateToSearch(value);
      console.log("comming response is : ", response);
      
      
      if(response.status === 200 ) {
          
        const data = response.data;
        // setFindedResult(Array.isArray(data) ? data : [data]);
        setMultiResult(data)
        toast.success("LR Date details getted");
      }
    }catch(error) {
      console.log(`Error from LrDateFind Function : ", ${error}`);

      setMultiResult(null);
      // Network Error 
      if (!error.response) {
        toast.error("Network error — please check your internet connection or server status.");
      }

      // Backend responded with an error (HTTP status)
      else if (error.response) {
        const { status } = error.response;
        if (status === 400) toast.error("Invalid data provided.");
        else if (status === 404) toast.error("No data found this LR DATE");
        else if (status === 401) navigate("/login");
        else if (status >= 500) toast.error("Server error — please try again later.");
      }
      // console.log(error.response);
    } finally {
      setLoading(false);
    }
  }
  return (
    <>
      <div>
        <FindInputCard
          name="lorryReceiptDate"
          type="date"
          placeholder="Enter LR date Number"
          buttonText="LR Date"
          onFind={handleFindLrDate} //call back function
        />
      </div>

      <div className='mt-10'>
        {loading && (<p className='text-xl text-center text-cyan-700 font-medium'>Loading...</p>)}
        { !loading && multiResult && (<ResultTable records={multiResult} />)}
      </div>

    </>
  )
}

