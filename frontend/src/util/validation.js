
const inwardNoRegex = /^[0-9]{3,7}[A-Za-z]?$/;
const CrAndLrNoRegex = /^[1-9][0-9]{3,9}$/;

export const validators = {
    
    hub: (data) => {

        let errors = {};
        
        if (!data.inwardNo || data.inwardNo.trim() === "") {
        errors.inwardNo = "Inward No cannot be empty";
        } else if (!inwardNoRegex.test(data.inwardNo)) {
        errors.inwardNo = "must be 3 to 8 characters: 3 to 7 digits followed by an optional letter";
        } 

        if (!data.lorryReceiptNo) {
        errors.lorryReceiptNo = "LR number cannot be empty";
        } else if (!CrAndLrNoRegex.test(data.lorryReceiptNo)) {
        errors.lorryReceiptNo = "LR number must be 4 to 9 digits and cannot start with 0";
        } 

        if (!data.lorryReceiptDate) {
        errors.lorryReceiptDate = 'LR date is required';
        }

        if (!data.fromAddress) {
            errors.fromAddress = "From Address is required";
        }

        if (!data.branch){
        errors.branch = "Branch Type is required";
        }

        if (!data.partyName || data.partyName.trim() === "") {
        errors.partyName = 'Party Name is required';
        }

        if (!data.pks) {
        errors.pks = 'Package count is required';
        }else if (data.pks && data.pks < 0) {
        errors.pks = 'Package must be positive';
        }

        if (!data.weight) {
        errors.weight = 'Weight is required';
        }else if (data.weight && data.weight < 0) {
        errors.weight = 'Weight must be positive';
        }

        if (!data.lorryReceiptAmount) {
        errors.lorryReceiptAmount = 'LR amount is required';
        }else if (data.lorryReceiptAmount && data.lorryReceiptAmount < 0) {
        errors.lorryReceiptAmount = 'LR amount must be positive';
        }
        
        if (!data.cashReceiptNo)
        errors.cashReceiptNo = "CR number cannot be empty";
        else if (!CrAndLrNoRegex.test(data.cashReceiptNo))
        errors.cashReceiptNo = "CR number must be 4–9 digits and cannot start with 0";

        if (!data.cashReceiptDate)
        errors.cashReceiptDate = "Cash Receipt Date is required";

        
        if (data.rebate && data.rebate < 0) {
        errors.rebate = 'Rebate must be positive';
        }

        if (data.others && data.others < 0) {
        errors.others = 'Others must be positive';
        }

        if (data.cashReceiptAmount < 0)
        errors.cashReceiptAmount = "CR Amount must be positive";

        if (data.paidAmount < 0)
        errors.paidAmount = "Paid Amount must be positive";

        if (!data.paymentDate)
        errors.paymentDate = "Payment Date is required";

        if (!data.paymentType)
        errors.paymentType = "Payment Type is required";

        return errors;
    },

    hubInitialEdit : (data) => {
        let errors = {};

        // Helper to check if a value is essentially empty (empty string from input or null/undefined)
        const isEmpty = (value) => value === '' || value === null || value === undefined;

        // Inward No
        if (!data.inwardNo || data.inwardNo.trim() === "") {
        errors.inwardNo = "Inward No cannot be empty";
        } else if (!inwardNoRegex.test(data.inwardNo)) {
        errors.inwardNo = "must be 3 to 8 characters: 3 to 7 digits followed by an optional letter";
        } 

        //LorryReceiptNumber
        if (!data.lorryReceiptNo) {
        errors.lorryReceiptNo = "LR number cannot be empty";
        } else if (!CrAndLrNoRegex.test(data.lorryReceiptNo)) {
        errors.lorryReceiptNo = "LR number must be 4 to 9 digits and cannot start with 0";
        } 

        // LR Date
        if (!data.lorryReceiptDate) {
            errors.lorryReceiptDate = 'LR date is required';
        }

        // form Address
        if (!data.fromAddress) {
            errors.fromAddress = "From Address is required";
        }

         // Branch
        if (!isEmpty(data.branch) && data.branch === "") {
            errors.branch = "Branch selection is invalid";
        }

        // Party Name
        if (!data.partyName || data.partyName.trim() === "") {
        errors.partyName = 'Party Name is required';
        }

        // Package (pks)
        if (!data.pks) {
        errors.pks = 'Package count is required';
        }else if (data.pks && data.pks < 0) {
        errors.pks = 'Package must be positive';
        }

        // Weight
        if (!data.weight) {
        errors.weight = 'Weight is required';
        }else if (data.weight && data.weight < 0) {
        errors.weight = 'Weight must be positive';
        }

        // LR Amount
        if (!data.lorryReceiptAmount) {
        errors.lorryReceiptAmount = 'LR amount is required';
        }else if (data.lorryReceiptAmount && data.lorryReceiptAmount < 0) {
        errors.lorryReceiptAmount = 'LR amount must be positive';
        }
        
    },
    hubEdit: (data) => {
        let errors = {};
        // INWARD	GC_NO	GC_DATE	FROM_ADDRESS	PACKAGE	WEIGHT	LR_AMOUNT	PARTY_NAME

        
        // Helper to check if a value is essentially empty (empty string from input or null/undefined)
        const isEmpty = (value) => value === '' || value === null || value === undefined;

        // =========================================================================
        // 1. TEXT / STRING FIELDS (inwardNo, partyName)
        // =========================================================================

        // Inward No
        if (!data.inwardNo || data.inwardNo.trim() === "") {
        errors.inwardNo = "Inward No cannot be empty";
        } else if (!inwardNoRegex.test(data.inwardNo)) {
        errors.inwardNo = "must be 3 to 8 characters: 3 to 7 digits followed by an optional letter";
        } 

        // form Address
        if (!data.fromAddress) {
            errors.fromAddress = "From Address is required";
        }


        // Party Name
        if (!data.partyName || data.partyName.trim() === "") {
        errors.partyName = 'Party Name is required';
        }


        // =========================================================================
        // 2. NUMBER FIELDS (pks, weight, amount, rebate, others, etc.)
        // =========================================================================
        // Note: Your `handleChange` should ensure these are numbers or empty strings ('').

        //LorryReceiptNumber
        if (!data.lorryReceiptNo) {
        errors.lorryReceiptNo = "LR number cannot be empty";
        } else if (!CrAndLrNoRegex.test(data.lorryReceiptNo)) {
        errors.lorryReceiptNo = "LR number must be 4 to 9 digits and cannot start with 0";
        } 
        
        // Package (pks)
        if (!data.pks) {
        errors.pks = 'Package count is required';
        }else if (data.pks && data.pks < 0) {
        errors.pks = 'Package must be positive';
        }

        

        // Weight
        if (!data.weight) {
        errors.weight = 'Weight is required';
        }else if (data.weight && data.weight < 0) {
        errors.weight = 'Weight must be positive';
        }

        // LR Amount
        if (!data.lorryReceiptAmount) {
        errors.lorryReceiptAmount = 'LR amount is required';
        }else if (data.lorryReceiptAmount && data.lorryReceiptAmount < 0) {
        errors.lorryReceiptAmount = 'LR amount must be positive';
        }
        
        // CR No
        if (!isEmpty(data.cashReceiptNo)) {
            if (!CrAndLrNoRegex.test(data.cashReceiptNo)) {
                errors.cashReceiptNo = "CR number must be 4–9 digits and cannot start with 0";
            }
        }

        // CR Date
        if(!isEmpty(data.cashReceiptDate) || data.cashReceiptNo) {
            if (!data.cashReceiptDate)
            errors.cashReceiptDate = "Cash Receipt Date is required";
        }
        
        // Rebate
        if (!isEmpty(data.rebate) && data.rebate < 0) {
            errors.rebate = 'Rebate must be positive';
        }

        // Others
        if (!isEmpty(data.others) && data.others < 0) {
            errors.others = 'Others must be positive';
        }

        // CR Amount (Calculated Field)
        // You still want to check this if it was calculated to be negative.
        if (!isEmpty(data.cashReceiptAmount) && data.cashReceiptAmount < 0) {
            errors.cashReceiptAmount = "CR Amount must be positive";
        }

        // Paid Amount
        if (!isEmpty(data.paidAmount) && data.paidAmount < 0) {
            errors.paidAmount = "Paid Amount must be positive";
        }

        // =========================================================================
        // 3. SELECT / DATE FIELDS (lorryReceiptDate, branch, paymentType, etc.)
        // =========================================================================

        // LR Date
        if (!data.lorryReceiptDate) {
            errors.lorryReceiptDate = 'LR date is required';
        }

        // Branch
        if (!isEmpty(data.branch) && data.branch === "") {
            errors.branch = "Branch selection is invalid";
        }

        // Payment Date
        if (!isEmpty(data.paymentDate) && data.paymentDate === "") {
            errors.paymentDate = "Payment Date is invalid";
        }

        // Payment Type
        if (!isEmpty(data.paymentType) && data.paymentType === "") {
            errors.paymentType = "Payment Type selection is invalid";
        }

        return errors;
    },

    CrNoAndCrDetails: (data) => {
        
        let errors = {};

        const isEmpty = (value) => value === '' || value === null || value === undefined;

        if (!data.cashReceiptNo)
        errors.cashReceiptNo = "CR number cannot be empty";
        else if (!CrAndLrNoRegex.test(data.cashReceiptNo))
        errors.cashReceiptNo = "CR number must be 4–9 digits and cannot start with 0";

        if (!data.cashReceiptDate)
        errors.cashReceiptDate = "Cash Receipt Date is required";

        if (data.cashReceiptAmount < 0)
        errors.cashReceiptAmount = "CR Amount must be positive";

        // Rebate
        if (!isEmpty(data.rebate) && data.rebate < 0) {
            errors.rebate = 'Rebate must be positive';
        }

        // Others
        if (!isEmpty(data.others) && data.others < 0) {
            errors.others = 'Others must be positive';
        }
    
        return errors;
    },

    bill: (data) => {
        
        let errors = {};

        
        if (!data.paidAmount) {
            errors.paidAmount = "Paid Amount is required";
        } else if (data.paidAmount < 0) {
            errors.paidAmount = "Paid Amount must be positive";
        }

        if (!data.paymentDate)
        errors.paymentDate = "Payment Date is required";

        if (!data.paymentType)
        errors.paymentType = "Payment Type is required";

        if(data.balanceAmount === "" || data.balanceAmount == null) 
        errors.balanceAmount = "Balance amount is required";

        if(data.balanceAmount < 0) 
        errors.balanceAmount = "Balance amount can't be negitive";

        return errors;
    }
}