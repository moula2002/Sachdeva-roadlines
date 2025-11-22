import React, { useState } from 'react'
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import FindInputCard from '../../components/FindHubComponents/FindInputCard'
import { RecordResultCard } from '../../components/RecordResultCard';
import { InwardNoToSearch } from '../../services/HomeService';


export default function InwardNoFind() {
  
  const [ loading, setLoading ] = useState(false);
  const [ inwardData, setInwardData ] = useState(null);

  const navigate = useNavigate(); 

  const handleFindInwardNumber = async (name, isError, value) => {
    if (isError) {
      return; 
    }

    setLoading(true);
    console.log(`${name}: ${value}`);

    try{
      const response = await InwardNoToSearch(value);
      console.log("comming response is : ", response);

      if(response.status === 200 ) {
        const data = response.data;
        setInwardData(data)
        toast.success("Inward details getted");
      }
    }catch(error) {
      console.log(`Error from InwardNoFind Function : ", ${error}`);
      setInwardData(null);
      // Network Error 
      if (!error.response) {
        toast.error("Network error — please check your internet connection or server status.");
      }

      // Backend responded with an error (HTTP status)
      else if (error.response) {
        const { status } = error.response;
        if (status === 400) toast.error("Invalid data provided.");
        else if (status === 404) toast.error("No data found this INWARD");
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
          name="inward"
          type="text"
          placeholder="Enter INWARD Number"
          buttonText="Inward"
          onFind={handleFindInwardNumber} //call back function
        />
      </div>

      <div>
        {loading && <p>loading ...</p>}
        {!loading && inwardData && (<RecordResultCard data={inwardData}/>)}
      </div>
    </>
  )
}

 