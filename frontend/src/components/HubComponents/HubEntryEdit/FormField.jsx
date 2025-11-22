import React from 'react'

// 🔹 Reusable FormField Component
export default function FormField({ 
    label, name, type, value, onChange, error, disabled 
    }) {
  return (
    <div className="flex flex-col">
        <label className="text-sm font-medium text-gray-700 mb-1 dark:text-gray-400">{label}</label>
        <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        min={0}
        max={999999999}
        className={`w-full px-3 py-2 rounded-lg border border-blue-300 focus:ring-2 focus:ring-cyan-500 focus:outline-none dark:bg-gray-700 ${
            error ? "border-red-500" : "border-gray-300"
        }`} 
        placeholder={`Enter ${label}`}
        />
        {error && (
        <div className="flex items-center gap-1 mt-1">
            <span 
            className="flex items-center justify-center w-4 h-4 border border-red-500 text-red-500 rounded-full text-[10px] font-bold">
            X
            </span>
            <span className="text-red-500 text-xs">{error}</span>
        </div>
        )}
    </div>
  )
}

