export const paymentStatusResponse = (paymentStatus) => {
    if(paymentStatus) {
        if(paymentStatus === "INITIATED") {
            return "bg-blue-500";
        }else if (paymentStatus === "PENDING") {
            return "bg-red-500";
        }else if (paymentStatus === "PAID") {
            return "bg-green-700";
        }
    }
} 
