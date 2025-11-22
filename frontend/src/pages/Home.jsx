import React, { useContext } from 'react'
import AllDataTable from '../components/HomeComponents/AllDataTable'
import { HubContext } from '../context/HubContext';
import { ImageSlider } from '../components/HomeComponents/ImageSlider';
import { RecordResultCard } from '../components/RecordResultCard';

export default function Home() {
  const { selectedRow } = useContext(HubContext);
  
  return (
    <div className=''>
      {/* Image sliders component */}
        <ImageSlider />
      
      <AllDataTable />
      {/* {selectedRow && (<AllDataCard data={selectedRow}/>)} */}
      {selectedRow && ( <RecordResultCard data={selectedRow} /> )}
    </div>
  )
}


