import React, { useState } from "react";
import { toast } from "react-toastify";

export default function FindInputCard({
  name = "input", // unique identifier
  type = "text", // input type
  placeholder = "Enter value...",
  value = "",
  buttonText = "Find", // default text
  onFind, // callback from parent
}) {
  const [inputValue, setInputValue] = useState(value);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    setInputValue(e.target.value);
    setErrorMessage("");
    setIsError(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") { 
      handleFind();
    }
  };

  const handleFind = () => {
    const valid = validate();

    if (valid) {
      setIsError(false);
      onFind?.(name, false, inputValue); // ✅ pass correct isError=false
    } else {
      setIsError(true);
      if (errorMessage === "") {
        toast.error("Please correct the error.");
      }
      onFind?.(name, true, inputValue); // ✅ pass correct isError=true
    }
  };

  // input validation
  const validate = () => {
    let isValid = true;
    let message = "";

    const inwardNoRegex = /^[0-9]{3,7}[A-Za-z]?$/;
    const LRAndCrNoRegex = /^[1-9][0-9]{3,9}$/;

    if (type === "text") {
      if (name === "partyName") {
        if (!inputValue || inputValue.trim() === "") {
          isValid = false;
          message = "Party Name is required";
        }
      } else if (name === "inward") {
        if (!inputValue || inputValue.trim() === "") {
          isValid = false;
          message = "Inward number cannot be empty";
        } else if (!inwardNoRegex.test(inputValue)) {
          isValid = false;
          message =
            "Must be 3–8 chars: 3–7 digits followed by an optional letter";
        }
      }
    } else if (type === "number") {
      if (name === "lorryReceiptNo") {
        if (!inputValue) {
          isValid = false;
          message = "LR number is required";
        } else if (!LRAndCrNoRegex.test(inputValue)) {
          isValid = false;
          message =
            "LR number must be 4–9 digits and cannot start with 0";
        }
      } else if (name === "cashReceiptNo") {
        if (!inputValue) {
          isValid = false;
          message = "CR number cannot be empty";
        } else if (!LRAndCrNoRegex.test(inputValue)) {
          isValid = false;
          message =
            "CR number must be 4–9 digits and cannot start with 0";
        }
      }
    } else if (type === "date" && name === "lorryReceiptDate") {
      if (!inputValue) {
        isValid = false;
        message = "LR date is required";
      }
    }

    setErrorMessage(message);
    return isValid;
  };

  const inputProps = {
    type,
    name,
    placeholder,
    value: inputValue,
    onChange: handleChange,
    onKeyDown: handleKeyDown,
  };

  if (type === "number") {
    inputProps.min = 0;
    inputProps.max = 999999999;
  }
  if (type === "text") {
    inputProps.maxLength = 120;
  }

  return (
    <>
      <div
        className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full max-w-md mx-auto 
                   bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-3"
        style={{ boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px" }}
      >
        {/* Input */}
        <input
          {...inputProps}
          className="w-full sm:flex-1 px-4 py-2 rounded-lg bg-white/20 text-black dark:text-white placeholder-slate-400 
                     focus:outline-none focus:ring-2 focus:ring-pink-400 text-center sm:text-left"
        />

        {/* Find Button */}
        <button
          onClick={handleFind}
          className="w-full sm:w-auto px-6 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-pink-500 
                     text-white font-semibold shadow-md hover:opacity-90 transition-all"
        >
          {buttonText}
        </button>
      </div>

      {isError && errorMessage && (
        <p className="text-center text-xs text-red-500 my-3">{errorMessage}</p>
      )}
    </>
  );
}
