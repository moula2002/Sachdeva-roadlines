import { AppConstants } from "../util/constant";
import axios from "axios";

const HOME_URL = AppConstants.BACKEND_URL+"/home";

export const welcome = () => {console.log("Home URL is :", HOME_URL);} 

/* AllHubTable.jsx -> File */
// Page Based get All hub details API call
export const GetAllHubsDetailsByPageBased = async (page_number) => {
    return await axios.get(`${HOME_URL}/page/${page_number}`);
    // return await axios.get("http://localhost:8080/api/v1/home/page/1");
}

// =============================================================================================

/* HubSearch.jsx -> File */ 
export const LorryReceiptNoToSearch = async (inputSearch) => {
    return await axios.get(`${HOME_URL}/lrno/${inputSearch}`);
}

export const CashReceiptNoToSearch = async (inputSearch) => {
    return await axios.get(`${HOME_URL}/crno/${inputSearch}`);
}

export const InwardNoToSearch = async (inputSearch) => {
    return await axios.get(`${HOME_URL}/inward/${inputSearch}`);
}

export const LorryReceiptDateToSearch = async (inputSearch) => {
    return await axios.get(`${HOME_URL}/lrDate/${inputSearch}`);
}

// ---------------------------------------------------------------------------------------
/* PARTY NAME TO FIND THE DETAILS */

export const PartyNameToFindedPendingRecordList = async (partyName) => {
    return await axios.get(`${HOME_URL}/pending-list-by-party-name?partyName=${partyName}`);
}

export const PartyNameToFindedInitiatedRecordList = async (partyName) => {
    return await axios.get(`${HOME_URL}/initiated-list-by-party-name?partyName=${partyName}`);
}
export const PartyNameToFindedPaidRecordsPages = async (partyName, pageNumber) => {
    return await axios.get(`${HOME_URL}/paid-page-by-party-name?partyName=${partyName}&&pageNumber=${pageNumber}`);
}
export const PartyNameToFindedAllRecordsPages = async (pageNumber, partyName) => {
    return await axios.get(`${HOME_URL}/all-status-party-name-data-by-page-based?partyName=${partyName}&&pageNumber=${pageNumber}`);
}
// ------------------------------------------------------------------------------------------

// =====================================================================================
