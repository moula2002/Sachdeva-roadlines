import React, {useContext, useState, useEffect} from 'react'
import { toast } from 'react-toastify'; 
import { HubContext } from '../../context/HubContext';
import FindInputCard from '../../components/FindHubComponents/FindInputCard';
import { DeleteTheHubRecord } from '../../services/HubServices';
import { LorryReceiptNoToSearch, InwardNoToSearch } from '../../services/HomeService';
import { RecordResultCard } from '../../components/RecordResultCard';


export default function DeleteHub() {

    const { hubResultData, setHubResultData } = useContext(HubContext); 
    const [deleteOption, setDeleteOption] = useState(false);
    const [loading, setLoading] = useState(false);


    const handleDeleteOptionChange = (e) => {
        setDeleteOption(e.target.checked);
    }

    useEffect(() => {
        setHubResultData(null);
    },[deleteOption])

    const handleDeleteOption = async (name, isError, value) => {
        if (isError) {
            toast.error("Please correct the input error");
            setHubResultData(null);
        return;
        }
        setLoading(true);

        try {
            const response = await (deleteOption ? InwardNoToSearch(value) : LorryReceiptNoToSearch(value));

            if (response.status === 200) {
                const data = response.data;
                // setFindedOptionResult(data);
                setHubResultData(data);
                toast.success(`${deleteOption ? "INWARD" : "LR"} number details fetched`);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
 
            if (error.response?.status === 400) toast.error("Invalid data");
            else if (error.response?.status === 404) {
                toast.error("No data found"); 
            } else toast.error("An unexpected error occurred");
        } finally {
            setLoading(false);
        }
    };

    // Delete record by LR number API call
    const handleDelete = async () => {
        try {
            const response = await DeleteTheHubRecord(hubResultData.lorryReceiptNo);
            // console.log("deleted response :", response);
            if (response.status === 204) {
                setHubResultData(null);
                toast.success(`${deleteOption ? hubResultData.inwardNo : hubResultData.lorryReceiptNo} : number record Deleted`);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
            if (error.response?.status === 400) toast.error("Invalid data"); 
            else if (error.response?.status === 404) {
                toast.error("No data found"); 
            }
            else toast.error("An unexpected error occurred");
        } finally {
            setLoading(false);
        }
    }

    return (

        <div className="p-4">
            {/* 🔍 Search Input */}
            <div>
                {deleteOption ? (
                <FindInputCard
                    name="inward"
                    type="text"
                    placeholder="Enter INWARD Number"
                    buttonText={loading ? "Loading..." : "Find Inward"}
                    onFind={handleDeleteOption}
                />
                ) : (
                <FindInputCard
                    name="lorryReceiptNo"
                    type="number"
                    placeholder="Enter LR Number"
                    buttonText={loading ? "Loading..." : "Find LR"}
                    onFind={handleDeleteOption}
                />
                )}
            </div>

            {/* 🔘 Search Option Toggle */}
            <div className="mx-2 my-3">
                <label className="text-sm flex items-center gap-2 cursor-pointer text-cyan-700 dark:text-white">
                <input
                    type="checkbox"
                    checked={deleteOption}
                    onChange={handleDeleteOptionChange}
                    className="mx-2 w-5 h-5 accent-blue-600 rounded-md cursor-pointer dark:accent-gray-500"
                />
                Delete by {deleteOption ? "LR Number" : "INWARD"}
                </label>
            </div>
            
            {/* show the selected recorde details to CARD format for verify to delete  */}
            <div>
                {hubResultData && Object.keys(hubResultData).length > 0 && (<RecordResultCard data={hubResultData} />)}
            </div>

            {/* conform to delete the Record */}
            <div className='text-center'>
                {hubResultData && (        
                    <button onClick={handleDelete}
                        className='w-[200px] my-8 mx-auto px-6 py-3 bg-linear-to-r from-cyan-600 to-cyan-400 text-white font-semibold rounded-lg shadow-md hover:scale-105 transform transition duration-300 cursor-pointer'
                    >
                        Delete Record
                    </button>
                )}
            </div>
        </div>
    );
}