import React, { useContext, useEffect} from 'react';
import HubEntryEditForm from '../../components/HubComponents/HubEntryEdit/HubEntryEditForm';
import { HubContext } from '../../context/HubContext';
import { RecordResultCard } from '../../components/RecordResultCard';



export default function HubEntry() {

  const {
    initialTransportData, setHubData,
    formType, setFormType,
    hubResultData,
  } = useContext(HubContext);

  // change the form type 
  useEffect(() => {
    setFormType(false);
    setHubData(initialTransportData);
  },[formType]);

  return (
    <>
      <div className="w-[97%] mx-auto my-5">
        <HubEntryEditForm /> 
      </div>
      {hubResultData && Object.keys(hubResultData).length > 0 && <RecordResultCard  data={hubResultData} />}
    </>
  )
}
