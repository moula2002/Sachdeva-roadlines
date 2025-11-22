import { AppConstants } from "../util/constant";
import axios from "axios";

/* AppContext.jsx -> File*/
// Sigle Hub Entry
const HUB_URL = AppConstants.BACKEND_URL+"/hub";
        
export const CRNoAndNullBillAPIcall = async (lorryReceiptNo, paymentDetailsData) => {
    return await axios.put(`${HUB_URL}/cr-no-null-bill/${lorryReceiptNo}`, paymentDetailsData)
    // `http://localhost:8080/api/v1/hub/cr-no-null-bill/${infoCardData.lorryReceiptNo}`,paymentDetailsData
}

// ----------------------------------------------------------------------------

export const EnterFullHub = async (hubData) => {
    return await axios.post(`${HUB_URL}`,hubData );
    // http://localhost:8080/api/v1/hub`,hubData
}

// ----------------------------------------------------------------------------

// Hud Data Edit
export const EditFullHub = async (lorryReceiptNo, hubData) => {
    return await axios.put(`${HUB_URL}/${lorryReceiptNo}`,hubData );
    // http://localhost:8080/api/v1/hub/${hubData.lorryReceiptNo}`, hubData
}

// ----------------------------------------------------------------------------

// Payment Details Enter and Edit
export const EntryEditHubPayment = async (lrNumber, paymentDetailsData) => {
    return await axios.put(`${HUB_URL}/bill-to-lr/${lrNumber}`, paymentDetailsData );
}
// ----------------------------------------------------------------------------

// xl data uploade 
export const AddExcelFileHubDatas = async (ExcelDatas) => {
    return await axios.post(`${HUB_URL}/xl-file`, ExcelDatas);
}

/* TEST BENDING DATA's add XL FILE  */
export const TestAddExcelFileHubDatas = async (ExcelDatas) => {
    return await axios.post(`${HUB_URL}/xl-file-test`, ExcelDatas);
}


// ------------------------- normal Bill ------------------------------------

export const BillToLorryReceiptNo = async (LorryReceiptNumber, paymentDetailsData) => {
    return await axios.put(`${HUB_URL}/bill-to-lr/${LorryReceiptNumber}`, paymentDetailsData );
    // `http://localhost:8080/api/v1/hub/bill-to-lr/${initialData.lorryReceiptNo}`, paymentDetailsData
} 

// ---------------------------------- Bulk Bill ------------------------------------------

// Bullk Bill hubs for Pending data's
export const BulkBillPendingStatusDetailsAPIcall = async (partyName) => {
    return await axios.get(`${HUB_URL}/party-bulk-pending-summary/${partyName}`);
    // `http://localhost:8080/api/v1/hub/party-bulk-pending-summary/${partyName}`;
} 

// Bullk Bill for Bending Payment Entry and Pay 
export const BulKBillPaymentAPIcall = async (paymentInput) => {
    return await axios.post(`${HUB_URL}/party-bulk-bill-payment`, paymentInput);
    // (`http://localhost:8080/api/v1/hub/party-bulk-bill-payment`, paymentInput);
} 


// ----------------------------------------------------------------------------

// get the DDR using lr date
export const DDRGetHubDatas = async (DDR_request) => {
    return await axios.post(`${HUB_URL}/ddr`, DDR_request);
}

// --------------------------- Delete the Hub Record ------------------------------

// Delete the Hub record 
export const DeleteTheHubRecord = async (lr_number) => {
    return await axios.delete(`${HUB_URL}/${lr_number}`);
}

// ----------------------------------------------------------------------------