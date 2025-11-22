import { AppConstants } from "../util/constant";
import axios from "axios";

const DASHBOARD_URL = AppConstants.BACKEND_URL+"/dashboard";
// http://localhost:8080/api/v1/dashboard

const HUB_URL = AppConstants.BACKEND_URL+"/hub";

// console.log("Dashboard URL is :", DASHBOARD_URL);
// console.log("Activity Log URL is :", ACTIVITY_LOG_URL);

// ===============================================================================

/* Dashboard.jsx -> File */

// Record Status used to count the records count API call
export const TotalRecordsStatusUsedToCount = async () => {
    return await axios.get(`${DASHBOARD_URL}/record-status`);
    // GET - http://localhost:8080/api/v1/dashboard/record-status
}

/* Pending records get page based and us the Filter's also
    like (lorryReceiptNo, inwardNo, lrDateFrom, lrDateTo, weight, pks, partyName) */
export const PendingRecordsPageBasedAndUsingFiltes = async (params) => {
    // params - is a object
    return await axios.get(`${DASHBOARD_URL}/pending-records-page`, {params});
    // GET - http://localhost:8080/api/v1/dashboard/pending-records-page,{ params }
}

// Recently paid records details like Today, Yesterday, Custom Date
export const RecentlyPaidRecordsDetails = async (params) => {
    // params - is a object
    return await axios.get(`${DASHBOARD_URL}/recent-paid`, {params});
    // GET - http://localhost:8080/api/v1/dashboard/recent-paid", { params }
}

// -------------- get PartyName based total Pending total amount ---------------
//PARTY-WISE TOTAL BALANCE API
export const GetPartyNameToTotalBalanceAmountList = async () => {
    return await axios.get(`${HUB_URL}/party-wise-balance`);
    // GET - http://localhost:8080/api/v1/hub/party-wise-balance
}

// -----------------------------------------------------------------------------------------
