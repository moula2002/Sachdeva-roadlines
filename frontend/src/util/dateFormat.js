import dayjs from 'dayjs';

// change the Date Format 
export const changeDateFormat = (apiDate) => {
    return dayjs(apiDate).format("DD-MM-YYYY");
}

// change the Date and Time Format 
export const changeDateTimeFormat = (apiDate) => {
    return dayjs(apiDate).format("DD-MM-YYYY hh:mm:ss ");
}

// change the Date and Time Format 
export const changeDateTimePeriodFormat = (apiDate) => {
    return dayjs(apiDate).format("DD-MM-YYYY hh:mm:ss A");
}